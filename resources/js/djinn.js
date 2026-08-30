import { translateValue } from './localization';

const control = document.querySelector('[data-djinn-control]');

if (control instanceof HTMLElement) {
    const trigger = control.querySelector('[data-djinn-open]');
    const status = control.querySelector('[data-djinn-status]');
    const response = control.querySelector('[data-djinn-response]');
    const answer = control.querySelector('[data-djinn-answer]');
    const activity = control.querySelector('[data-djinn-activity]');
    const endpoint = ['twelveo-cc.test', '127.0.0.1', 'localhost'].includes(window.location.hostname)
        ? 'http://127.0.0.1:8080'
        : 'https://voice.otsugua.dev';
    let socket = null;
    let stream = null;
    let audioContext = null;
    let processor = null;
    let currentState = 'idle';
    let currentAudioSampleRate = 24000;
    let pcmRemainder = new Uint8Array(0);
    let nextPlaybackTime = 0;
    let responseTimer = null;
    let revealFrame = null;
    let revealSegments = [];
    let activeRevealSequence = null;
    let estimatedSpeechUnitsPerSecond = 12;
    let desiredActive = false;
    let connectingPromise = null;
    let connectionAbort = null;
    let retryTimer = null;
    let retryStartedAt = 0;
    let retryAttempt = 0;
    let closing = false;
    let lastVisibleResponse = '';
    let sessionAudioScheduledMs = 0;
    let lastPlaybackOffsetMs = 0;
    let playbackRanges = [];
    const activeSources = new Set();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activityFrame = 0;
    let activityTimer = null;

    const drawActivity = () => {
        if (!(activity instanceof HTMLCanvasElement)) return;
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const cell = Math.max(1, Math.round(4 * dpr));
        const gap = Math.max(1, Math.round(dpr));
        const size = (cell * 2) + gap;
        if (activity.width !== size || activity.height !== size) {
            activity.width = size;
            activity.height = size;
            activity.style.width = `${size / dpr}px`;
            activity.style.height = `${size / dpr}px`;
        }

        const context = activity.getContext('2d');
        if (!context) return;
        context.clearRect(0, 0, size, size);
        context.fillStyle = getComputedStyle(activity).color;
        const positions = [[0, 0], [cell + gap, 0], [0, cell + gap], [cell + gap, cell + gap]];
        const missingByFrame = [1, 3, 2, 0];
        const missing = missingByFrame[reducedMotion.matches ? 0 : activityFrame];
        positions.forEach(([x, y], index) => {
            if (index !== missing) context.fillRect(x, y, cell, cell);
        });
    };

    const startActivity = () => {
        clearInterval(activityTimer);
        activityTimer = null;
        activityFrame = 0;
        drawActivity();
        if (!reducedMotion.matches) {
            activityTimer = window.setInterval(() => {
                activityFrame = (activityFrame + 1) % 4;
                drawActivity();
            }, 200);
        }
    };

    const locale = () => document.documentElement.lang === 'pt-BR' ? 'pt-BR' : 'en';

    const setStatus = (message) => {
        const translated = translateValue(message, locale());
        if (status instanceof HTMLElement) status.textContent = translated;
        if (trigger instanceof HTMLButtonElement) trigger.title = translated;
    };

    const setState = (state, message) => {
        currentState = state;
        control.dataset.state = state;
        if (trigger instanceof HTMLButtonElement) {
            trigger.setAttribute('aria-pressed', String(['listening', 'speaking'].includes(state)));
            trigger.setAttribute('aria-label', translateValue(
                ['listening', 'speaking'].includes(state) ? 'Pause Djinn microphone' : 'Ask Djinn',
                locale(),
            ));
        }
        if (message) setStatus(message);
    };

    const stopWordReveal = (reset = true) => {
        if (revealFrame !== null) window.cancelAnimationFrame(revealFrame);
        revealFrame = null;
        activeRevealSequence = null;
        if (reset) revealSegments = [];
    };

    const hideResponse = () => {
        clearTimeout(responseTimer);
        responseTimer = null;
        stopWordReveal();
        if (response instanceof HTMLElement) response.hidden = true;
    };

    const showResponse = (message, kind = 'notice', translate = true) => {
        clearTimeout(responseTimer);
        responseTimer = null;
        stopWordReveal();
        const text = translate ? translateValue(message, locale()) : message;
        if (answer instanceof HTMLElement) answer.textContent = text;
        if (response instanceof HTMLElement) {
            response.dataset.kind = kind;
            response.setAttribute('role', kind === 'error' ? 'alert' : 'status');
            response.hidden = false;
        }
        drawActivity();
    };

    const showListeningIndicator = () => {
        if (lastVisibleResponse) showResponse(lastVisibleResponse, 'response', false);
        else showResponse('Listening...', 'activity');
    };

    const showLoading = () => {
        showResponse('Djinn loading...', 'loading');
    };

    const speechWeight = (word) => {
        const spokenCharacters = word.match(/[\p{L}\p{N}]/gu)?.length ?? 0;
        let weight = Math.max(2.5, spokenCharacters);
        if (/[,]["')\]]*$/.test(word)) weight += 2;
        if (/[;:]["')\]]*$/.test(word)) weight += 3;
        if (/[.!?]["')\]]*$/.test(word)) weight += 4;
        return weight;
    };

    const progressiveText = () => revealSegments
        .flatMap((segment) => segment.words.slice(0, segment.revealed))
        .join(' ');

    const renderProgressiveResponse = () => {
        const text = progressiveText();
        if (text) lastVisibleResponse = text;
        if (answer instanceof HTMLElement) answer.textContent = text;
        if (response instanceof HTMLElement) {
            response.dataset.kind = 'response';
            response.setAttribute('role', 'presentation');
            response.hidden = false;
        }
        drawActivity();
    };

    const targetRevealedWords = (segment) => {
        if (!audioContext || segment.startsAt === null || audioContext.currentTime < segment.startsAt) return 0;
        const elapsedMs = Math.max(0, (audioContext.currentTime - segment.startsAt) * 1000);
        const totalWeight = segment.weights.reduce((total, weight) => total + weight, 0);
        const millisecondsPerUnit = segment.complete && segment.audioDurationMs > 0 && totalWeight > 0
            ? segment.audioDurationMs / totalWeight
            : 1000 / estimatedSpeechUnitsPerSecond;
        let thresholdMs = 0;
        let target = 0;
        for (let index = 0; index < segment.words.length; index += 1) {
            if (elapsedMs + 45 < thresholdMs) break;
            target = index + 1;
            thresholdMs += segment.weights[index] * millisecondsPerUnit;
        }
        return target;
    };

    const revealTick = () => {
        revealFrame = null;
        let changed = false;
        let pending = false;
        for (const segment of revealSegments) {
            const target = Math.max(segment.revealed, targetRevealedWords(segment));
            if (target !== segment.revealed) {
                segment.revealed = target;
                changed = true;
            }
            if (segment.revealed < segment.words.length || !segment.complete) pending = true;
            if (segment.revealed < segment.words.length) break;
        }
        if (changed) renderProgressiveResponse();
        if (pending) revealFrame = window.requestAnimationFrame(revealTick);
    };

    const scheduleWordReveal = () => {
        if (revealFrame === null) revealFrame = window.requestAnimationFrame(revealTick);
    };

    const beginWordRevealWithPlayback = (text, sequence = 0) => {
        clearTimeout(responseTimer);
        responseTimer = null;
        if (sequence === 0) stopWordReveal();
        const words = String(text ?? '').trim().split(/\s+/).filter(Boolean);
        if (!words.length) return;
        const segment = {
            sequence,
            words,
            weights: words.map(speechWeight),
            revealed: 0,
            startsAt: null,
            audioDurationMs: 0,
            complete: false,
        };
        revealSegments.push(segment);
        activeRevealSequence = sequence;
        scheduleWordReveal();
    };

    const appendWordReveal = (text) => {
        const words = String(text ?? '').trim().split(/\s+/).filter(Boolean);
        const segment = revealSegments.at(-1);
        if (!segment || !words.length) return;
        segment.words.push(...words);
        segment.weights.push(...words.map(speechWeight));
        scheduleWordReveal();
    };

    const completeWordRevealSegment = (sequence) => {
        const segment = revealSegments.find((candidate) => candidate.sequence === sequence);
        if (!segment) return;
        segment.complete = true;
        const totalWeight = segment.weights.reduce((total, weight) => total + weight, 0);
        if (segment.audioDurationMs > 0 && totalWeight > 0) {
            const observedRate = totalWeight / (segment.audioDurationMs / 1000);
            if (observedRate >= 6 && observedRate <= 24) {
                estimatedSpeechUnitsPerSecond = (estimatedSpeechUnitsPerSecond * 0.7) + (observedRate * 0.3);
            }
        }
        scheduleWordReveal();
    };

    const showResponseAfterPlayback = (text) => {
        clearTimeout(responseTimer);
        const remainingMs = audioContext
            ? Math.max(0, (nextPlaybackTime - audioContext.currentTime) * 1000)
            : 0;
        responseTimer = window.setTimeout(() => {
            lastVisibleResponse = String(text ?? '').trim();
            showResponse(text, 'response', false);
            setState('listening', 'Listening. You can interrupt Djinn at any time.');
            setStatus(`Djinn answered: ${text}`);
        }, remainingMs + 40);
    };

    const ensureAudioContext = async () => {
        if (!audioContext || audioContext.state === 'closed') audioContext = new AudioContext();
        if (audioContext.state === 'suspended') await audioContext.resume();
        return audioContext;
    };

    const currentPlaybackOffsetMs = () => {
        const now = audioContext?.currentTime ?? 0;
        let offset = lastPlaybackOffsetMs;
        playbackRanges.forEach((range) => {
            if (now <= range.startsAt) return;
            const playedMs = Math.min(range.durationMs, (now - range.startsAt) * 1000);
            offset = Math.max(offset, range.sessionStartMs + playedMs);
        });
        lastPlaybackOffsetMs = Math.round(offset);
        return lastPlaybackOffsetMs;
    };

    const stopAudio = () => {
        const playbackOffsetMs = currentPlaybackOffsetMs();
        activeSources.forEach((source) => {
            try { source.stop(); } catch {}
        });
        activeSources.clear();
        playbackRanges = [];
        sessionAudioScheduledMs = playbackOffsetMs;
        pcmRemainder = new Uint8Array(0);
        nextPlaybackTime = audioContext?.currentTime ?? 0;
        clearTimeout(responseTimer);
        responseTimer = null;
        stopWordReveal();
        return playbackOffsetMs;
    };

    const queuePcm = (arrayBuffer) => {
        const context = audioContext;
        if (!context) return;

        const incoming = new Uint8Array(arrayBuffer);
        let bytes = incoming;
        if (pcmRemainder.length) {
            bytes = new Uint8Array(pcmRemainder.length + incoming.length);
            bytes.set(pcmRemainder);
            bytes.set(incoming, pcmRemainder.length);
        }
        const usableBytes = bytes.byteLength - (bytes.byteLength % 2);
        pcmRemainder = bytes.slice(usableBytes);
        if (!usableBytes) return;

        const sampleCount = usableBytes / 2;
        const samples = new DataView(bytes.buffer, bytes.byteOffset, usableBytes);
        const audioBuffer = context.createBuffer(1, sampleCount, currentAudioSampleRate);
        const channel = audioBuffer.getChannelData(0);
        for (let index = 0; index < sampleCount; index += 1) {
            channel[index] = samples.getInt16(index * 2, true) / 0x8000;
        }

        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(context.destination);
        const startsAt = Math.max(context.currentTime + 0.025, nextPlaybackTime);
        const durationMs = audioBuffer.duration * 1000;
        const revealSegment = revealSegments.find((segment) => segment.sequence === activeRevealSequence);
        if (revealSegment) {
            revealSegment.startsAt ??= startsAt;
            revealSegment.audioDurationMs += durationMs;
            scheduleWordReveal();
        }
        playbackRanges.push({
            startsAt,
            durationMs,
            sessionStartMs: sessionAudioScheduledMs,
        });
        sessionAudioScheduledMs += durationMs;
        nextPlaybackTime = startsAt + audioBuffer.duration;
        activeSources.add(source);
        source.onended = () => activeSources.delete(source);
        source.start(startsAt);
    };

    const stopCapture = () => {
        processor?.disconnect();
        processor = null;
        stream?.getTracks().forEach((track) => track.stop());
        stream = null;
    };

    const toPcm16 = (input, inputRate) => {
        const targetRate = 16000;
        const ratio = inputRate / targetRate;
        const length = Math.floor(input.length / ratio);
        const output = new Int16Array(length);
        for (let index = 0; index < length; index += 1) {
            const position = index * ratio;
            const low = Math.floor(position);
            const high = Math.min(Math.ceil(position), input.length - 1);
            const sample = input[low] + ((input[high] - input[low]) * (position - low));
            output[index] = Math.max(-1, Math.min(1, sample)) * 0x7fff;
        }
        return output.buffer;
    };

    const startCapture = async () => {
        if (stream || !desiredActive) return;
        const captured = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        if (!desiredActive) {
            captured.getTracks().forEach((track) => track.stop());
            return;
        }

        stream = captured;
        const context = await ensureAudioContext();
        const source = context.createMediaStreamSource(stream);
        processor = context.createScriptProcessor(4096, 1, 1);
        const silent = context.createGain();
        silent.gain.value = 0;
        processor.onaudioprocess = (event) => {
            if (desiredActive && socket?.readyState === WebSocket.OPEN) {
                socket.send(toPcm16(event.inputBuffer.getChannelData(0), context.sampleRate));
            }
        };
        source.connect(processor);
        processor.connect(silent);
        silent.connect(context.destination);
        socket?.send(JSON.stringify({ type: 'start' }));
        if (lastVisibleResponse) showListeningIndicator();
        else showLoading();
        setState('listening', 'Listening. You can interrupt Djinn at any time.');
    };

    const clearRetry = () => {
        clearTimeout(retryTimer);
        retryTimer = null;
    };

    const pause = () => {
        desiredActive = false;
        clearRetry();
        if (!socket) connectionAbort?.abort();
        stopCapture();
        stopAudio();
        if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'interrupt' }));
        const pausedMessage = 'Djinn is paused. Click to resume.';
        setState('paused', pausedMessage);
        showResponse(pausedMessage, 'notice');
    };

    const showMicrophoneError = () => {
        desiredActive = false;
        const errorMessage = 'Microphone access is needed to speak with Djinn. Please allow it and try again.';
        setState('error', errorMessage);
        showResponse(errorMessage, 'error');
    };

    const resumeCapture = async () => {
        try {
            await startCapture();
        } catch {
            stopCapture();
            showMicrophoneError();
        }
    };

    const scheduleRetry = () => {
        if (!desiredActive || retryTimer) return;
        retryStartedAt ||= Date.now();
        if (Date.now() - retryStartedAt >= 35000) {
            desiredActive = false;
            const unavailableMessage = 'Djinn is taking a short pause. Please try again later.';
            setState('error', unavailableMessage);
            showResponse(unavailableMessage, 'notice');
            return;
        }

        const delays = [1000, 2000, 4000, 5000];
        const delay = delays[Math.min(retryAttempt, delays.length - 1)];
        retryAttempt += 1;
        const waitingMessage = 'Djinn loading...';
        setState('connecting', waitingMessage);
        showLoading();
        retryTimer = window.setTimeout(() => {
            retryTimer = null;
            void connect();
        }, delay);
    };

    const handleMessage = (event, ready) => {
        if (event.data instanceof ArrayBuffer) {
            queuePcm(event.data);
            return;
        }

        const message = JSON.parse(event.data);
        if (message.type === 'ready') ready?.();
        if (message.type === 'listening_ready' && desiredActive) showListeningIndicator();
        if (message.type === 'thinking') {
            showLoading();
            setStatus('Djinn is grounding an answer…');
        }
        if (message.type === 'audio_start') {
            currentAudioSampleRate = message.sampleRate ?? 24000;
            beginWordRevealWithPlayback(message.text, message.sequence);
            setState('speaking', 'Djinn is speaking.');
        }
        if (message.type === 'answer_append') appendWordReveal(message.text);
        if (message.type === 'audio_end') {
            completeWordRevealSegment(message.sequence);
            activeRevealSequence = null;
        }
        if (message.type === 'turn_complete') showResponseAfterPlayback(message.text);
        if (message.type === 'playback_stopped') {
            const playbackOffsetMs = stopAudio();
            if (message.interruptToken && socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: 'playback_stopped_ack',
                    interruptToken: message.interruptToken,
                    playbackOffsetMs,
                }));
            }
            if (desiredActive) {
                showListeningIndicator();
                setState('listening', 'Listening. You can interrupt Djinn at any time.');
            } else {
                const pausedMessage = 'Djinn is paused. Click to resume.';
                setState('paused', pausedMessage);
                showResponse(pausedMessage, 'notice');
            }
        }
        if (['audio_unavailable', 'stt_unavailable'].includes(message.type)) {
            desiredActive = false;
            const errorMessage = 'Djinn needs a moment. Please try again.';
            setState('error', errorMessage);
            showResponse(errorMessage, 'error');
        }
        if (message.type === 'ended') {
            desiredActive = false;
            closing = true;
            stopCapture();
            stopAudio();
            const unavailableMessage = 'Djinn is taking a short pause. Please try again later.';
            setState('error', unavailableMessage);
            showResponse(unavailableMessage, 'notice');
        }
    };

    const connect = () => {
        if (connectingPromise) return connectingPromise;
        if (socket?.readyState === WebSocket.OPEN) return resumeCapture();

        connectingPromise = (async () => {
            closing = false;
            connectionAbort = new AbortController();
            const timeout = window.setTimeout(() => connectionAbort?.abort(), 2500);
            let microphoneRequested = false;
            setState('connecting', 'Djinn loading...');
            showLoading();

            try {
                const [, health] = await Promise.all([
                    ensureAudioContext(),
                    fetch(`${endpoint}/health`, { signal: connectionAbort.signal }),
                ]);
                window.clearTimeout(timeout);
                if (!health.ok || !(await health.json()).demo) throw new Error('unavailable');
                if (!desiredActive) {
                    pause();
                    return;
                }

                const wsUrl = new URL(endpoint);
                wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
                wsUrl.pathname = '/browser/voice';
                const connectingSocket = new WebSocket(wsUrl);
                connectingSocket.binaryType = 'arraybuffer';
                socket = connectingSocket;
                await new Promise((resolve, reject) => {
                    const readyTimeout = window.setTimeout(() => reject(new Error('ready_timeout')), 3500);
                    connectingSocket.onmessage = (event) => handleMessage(event, () => {
                        window.clearTimeout(readyTimeout);
                        resolve();
                    });
                    connectingSocket.onerror = reject;
                    connectingSocket.onclose = () => reject(new Error('closed'));
                });

                connectingSocket.onclose = () => {
                    if (socket === connectingSocket) socket = null;
                    stopCapture();
                    stopAudio();
                    if (!closing && desiredActive) scheduleRetry();
                };
                retryStartedAt = 0;
                retryAttempt = 0;
                clearRetry();
                if (!desiredActive) {
                    pause();
                    return;
                }

                microphoneRequested = true;
                await startCapture();
            } catch {
                window.clearTimeout(timeout);
                if (socket?.readyState !== WebSocket.OPEN) {
                    try { socket?.close(); } catch {}
                    socket = null;
                }
                stopCapture();
                stopAudio();
                if (!desiredActive) {
                    const pausedMessage = 'Djinn is paused. Click to resume.';
                    setState('paused', pausedMessage);
                    showResponse(pausedMessage, 'notice');
                } else if (microphoneRequested) {
                    showMicrophoneError();
                } else {
                    scheduleRetry();
                }
            } finally {
                window.clearTimeout(timeout);
                connectionAbort = null;
                connectingPromise = null;
            }
        })();

        return connectingPromise;
    };

    const activate = () => {
        desiredActive = true;
        clearRetry();
        if (socket?.readyState === WebSocket.OPEN) {
            setState('listening', 'Listening. You can interrupt Djinn at any time.');
            showListeningIndicator();
            void resumeCapture();
            return;
        }
        if (connectingPromise) {
            setState('connecting', 'Djinn loading...');
            showLoading();
            return;
        }
        retryStartedAt = Date.now();
        retryAttempt = 0;
        void connect();
    };

    const closeSession = () => {
        desiredActive = false;
        closing = true;
        clearRetry();
        connectionAbort?.abort();
        stopCapture();
        stopAudio();
        if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'end' }));
        try { socket?.close(); } catch {}
        socket = null;
        setState('idle', 'Ask Djinn');
    };

    reducedMotion.addEventListener?.('change', startActivity);
    new MutationObserver(drawActivity).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme-effective'],
    });
    startActivity();

    trigger?.addEventListener('click', () => {
        if (desiredActive) pause();
        else activate();
    });

    window.addEventListener('pagehide', () => {
        clearInterval(activityTimer);
        closeSession();
    });
    setState('idle', 'Ask Djinn');
}
