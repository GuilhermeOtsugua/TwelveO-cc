import { translateValue } from './localization';

const control = document.querySelector('[data-djinn-control]');

if (control instanceof HTMLElement) {
    const trigger = control.querySelector('[data-djinn-open]');
    const status = control.querySelector('[data-djinn-status]');
    const response = control.querySelector('[data-djinn-response]');
    const answer = control.querySelector('[data-djinn-answer]');
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
    let closing = false;
    const activeSources = new Set();

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
                ['listening', 'speaking'].includes(state) ? 'Stop Djinn conversation' : 'Ask Djinn',
                locale(),
            ));
        }
        if (message) setStatus(message);
    };

    const hideResponse = () => {
        clearTimeout(responseTimer);
        responseTimer = null;
        if (response instanceof HTMLElement) response.hidden = true;
    };

    const showResponseAfterPlayback = (text) => {
        clearTimeout(responseTimer);
        const remainingMs = audioContext
            ? Math.max(0, (nextPlaybackTime - audioContext.currentTime) * 1000)
            : 0;
        responseTimer = window.setTimeout(() => {
            if (answer instanceof HTMLElement) answer.textContent = text;
            if (response instanceof HTMLElement) response.hidden = false;
            setState('listening', 'Listening. You can interrupt Djinn at any time.');
        }, remainingMs + 40);
    };

    const ensureAudioContext = async () => {
        if (!audioContext || audioContext.state === 'closed') audioContext = new AudioContext();
        if (audioContext.state === 'suspended') await audioContext.resume();
        return audioContext;
    };

    const stopAudio = () => {
        activeSources.forEach((source) => {
            try { source.stop(); } catch {}
        });
        activeSources.clear();
        pcmRemainder = new Uint8Array(0);
        nextPlaybackTime = audioContext?.currentTime ?? 0;
        clearTimeout(responseTimer);
        responseTimer = null;
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
        stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        const context = await ensureAudioContext();
        const source = context.createMediaStreamSource(stream);
        processor = context.createScriptProcessor(4096, 1, 1);
        const silent = context.createGain();
        silent.gain.value = 0;
        processor.onaudioprocess = (event) => {
            if (socket?.readyState === WebSocket.OPEN) {
                socket.send(toPcm16(event.inputBuffer.getChannelData(0), context.sampleRate));
            }
        };
        source.connect(processor);
        processor.connect(silent);
        silent.connect(context.destination);
        socket?.send(JSON.stringify({ type: 'start' }));
        setState('listening', 'Listening. You can interrupt Djinn at any time.');
    };

    const handleMessage = (event, ready) => {
        if (event.data instanceof ArrayBuffer) {
            void queuePcm(event.data);
            return;
        }

        const message = JSON.parse(event.data);
        if (message.type === 'ready') ready();
        if (message.type === 'transcript' && message.text) hideResponse();
        if (message.type === 'thinking') setStatus('Djinn is grounding an answer…');
        if (message.type === 'audio_start') {
            currentAudioSampleRate = message.sampleRate ?? 24000;
            setState('speaking', 'Djinn is speaking.');
        }
        if (message.type === 'turn_complete') showResponseAfterPlayback(message.text);
        if (message.type === 'playback_stopped') {
            stopAudio();
            hideResponse();
            setState('listening', 'Listening. You can interrupt Djinn at any time.');
        }
        if (['audio_unavailable', 'stt_unavailable'].includes(message.type)) {
            setState('error', 'Djinn needs a moment. Please try again.');
        }
        if (message.type === 'ended' && !closing) close('Djinn is taking a short pause. Please try again later.');
    };

    const connect = async () => {
        hideResponse();
        closing = false;
        let microphoneRequested = false;
        setState('connecting', 'Checking whether Djinn is ready…');
        try {
            await ensureAudioContext();
            const health = await fetch(`${endpoint}/health`, { signal: AbortSignal.timeout(2500) });
            if (!health.ok || !(await health.json()).demo) throw new Error('unavailable');

            const wsUrl = new URL(endpoint);
            wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
            wsUrl.pathname = '/browser/voice';
            socket = new WebSocket(wsUrl);
            socket.binaryType = 'arraybuffer';
            await new Promise((resolve, reject) => {
                socket.onmessage = (event) => handleMessage(event, resolve);
                socket.onerror = reject;
                socket.onclose = () => reject(new Error('closed'));
            });
            socket.onclose = () => {
                if (!closing) close('Djinn is taking a short pause. Please try again later.');
            };
            microphoneRequested = true;
            await startCapture();
        } catch {
            stopCapture();
            stopAudio();
            socket?.close();
            socket = null;
            setState(
                'error',
                microphoneRequested
                    ? 'Microphone access is needed to speak with Djinn. Please allow it and try again.'
                    : 'Djinn is taking a short pause. Please try again later.',
            );
        }
    };

    const close = (message = 'Ask Djinn') => {
        closing = true;
        stopCapture();
        stopAudio();
        if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'end' }));
        socket?.close();
        socket = null;
        setState('idle', message);
    };

    trigger?.addEventListener('click', () => {
        if (['connecting', 'listening', 'speaking'].includes(currentState)) {
            close();
            return;
        }
        void connect();
    });

    window.addEventListener('pagehide', () => close());
    setState('idle', 'Ask Djinn');
}
