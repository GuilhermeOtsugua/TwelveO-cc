import { translateValue } from './localization';
import { createChatScroller } from './djinn-scroll';

const control = document.querySelector('[data-djinn-control]');
if (control instanceof HTMLElement) {
    const microphone = control.querySelector('[data-djinn-open]');
    const keyboard = control.querySelector('[data-djinn-keyboard]');
    const panel = control.querySelector('[data-djinn-response]');
    const log = control.querySelector('[data-djinn-log]');
    const scroller = createChatScroller(log);
    const status = control.querySelector('[data-djinn-status]');
    const form = control.querySelector('[data-djinn-form]');
    const input = control.querySelector('[data-djinn-input]');
    const composerMicrophone = form.querySelector('[data-djinn-compose-microphone]');
    const volume = control.querySelector('[data-djinn-volume]');
    const mute = control.querySelector('[data-djinn-mute]');
    const challenge = control.querySelector('[data-djinn-challenge]');
    const endpoint = location.hostname === 'twelveo-cc.test'
        ? 'https://djinn-voice.test'
        : ['127.0.0.1', 'localhost'].includes(location.hostname)
            ? 'http://127.0.0.1:8080' : 'https://voice.otsugua.dev';
    let mode = 'text';
    let socket = null;
    let hasConnected = false;
    let connection = null;
    let connectAbort = null;
    let sessionVersion = 0;
    let audio = null;
    let gain = null;
    let capture = null;
    let processor = null;
    let captureSource = null;
    let captureGain = null;
    let captureVersion = 0;
    let nextAudioAt = 0;
    let activePacket = null;
    let packets = [];
    let responseRow = null;
    let currentTurnId = null;
    let generatedTurnId = null;
    let turnReceivedAt = 0;
    let pendingText = false;
    let pendingTimer = null;
    let revealFrame = null;
    let widget = null;
    let cancelChallenge = null;
    const sources = new Set();
    const completionTimers = new Set();
    const volumeKey = 'djinn:voice-volume';
    let level = 100;
    try { level = Math.max(0, Math.min(100, Number(localStorage.getItem(volumeKey) ?? 100))) || 0; } catch {}
    let lastVolume = level || 100;
    if (!level) {
        try { lastVolume = Math.max(1, Math.min(100, Number(localStorage.getItem(`${volumeKey}:last`) ?? 100))) || 100; } catch {}
    }
    const translate = (text) => translateValue(text, document.documentElement.lang === 'pt-BR' ? 'pt-BR' : 'en');
    const send = (message) => { if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message)); };
    const sayStatus = (text) => { status.textContent = translate(text); };
    const state = (value) => {
        control.dataset.state = value;
        status.classList.toggle('djinn-activity', ['connecting', 'thinking', 'listening'].includes(value));
        for (const button of [microphone, composerMicrophone]) button.setAttribute('aria-pressed', String(mode === 'voice' && Boolean(capture)));
        keyboard.setAttribute('aria-pressed', String(mode === 'text' && !panel.hidden));
    };
    const openPanel = () => {
        panel.hidden = false;
        applyVolume();
        scroller.update(() => {});
        document.documentElement.classList.add('djinn-open');
        positionPanel();
        renderSpeech();
        packets.forEach(acknowledge);
        if (generatedTurnId === currentTurnId && packets.length && packets.every((packet) => packet.ended && heardWords(packet) === packet.words.length)) {
            send({ type: 'playback_complete', turnId: currentTurnId });
        }
        microphone.setAttribute('aria-expanded', 'true');
        keyboard.setAttribute('aria-expanded', 'true');
        state(control.dataset.state ?? 'idle');
    };
    function positionPanel() {
        if (panel.hidden) return;
        const anchor = control.getBoundingClientRect();
        const mobile = window.matchMedia('(max-width: 639px)').matches;
        const left = mobile ? 16 - anchor.left : Math.min(0, window.innerWidth - 16 - anchor.left - panel.offsetWidth);
        panel.style.left = `${left}px`;
        const button = microphone.getBoundingClientRect();
        panel.style.setProperty('--djinn-tail-left', `${Math.max(12, Math.min(panel.offsetWidth - 24, button.left + button.width / 2 - anchor.left - left - 6))}px`);
        const viewport = window.visualViewport;
        const available = (viewport?.height ?? window.innerHeight) + (viewport?.offsetTop ?? 0) - panel.getBoundingClientRect().top - 16;
        panel.style.setProperty('--djinn-available-height', `${Math.max(120, available)}px`);
    }
    window.addEventListener('resize', positionPanel);
    window.visualViewport?.addEventListener('resize', positionPanel);
    new ResizeObserver(positionPanel).observe(control);
    function appendMessage(role, text) {
        const row = document.createElement('p');
        row.className = `djinn-message djinn-message--${role}`;
        row.dataset.djinnMessage = role;
        row.dataset.noLocalize = '';
        row.textContent = text;
        scroller.update(() => {
            log.append(row);
            while (log.children.length > 48) log.firstElementChild.remove();
        });
        return row;
    }
    function applyVolume() {
        volume.value = String(level);
        volume.style.setProperty('--djinn-volume-level', `${level}%`);
        volume.setAttribute('aria-valuetext', `${level}%`);
        mute.setAttribute('aria-pressed', String(level === 0));
        mute.setAttribute('aria-label', translate(level === 0 ? 'Unmute Djinn' : 'Mute Djinn'));
        mute.querySelector('[data-djinn-volume-waves]').toggleAttribute('hidden', level === 0);
        mute.querySelector('[data-djinn-volume-cross]').toggleAttribute('hidden', level !== 0);
        if (gain) gain.gain.setTargetAtTime(panel.hidden ? 0 : level / 100, audio.currentTime, 0.012);
    }
    function setVolume(value) {
        level = value;
        if (level > 0) lastVolume = level;
        applyVolume();
        try {
            localStorage.setItem(volumeKey, String(level));
            localStorage.setItem(`${volumeKey}:last`, String(lastVolume));
        } catch {}
    }
    async function ensureAudio() {
        if (!audio || audio.state === 'closed') {
            audio = new AudioContext();
            gain = audio.createGain();
            gain.connect(audio.destination);
            applyVolume();
        }
        if (audio.state === 'suspended') await audio.resume();
    }
    function heardWords(packet) {
        if (!audio || packet.start == null || audio.currentTime <= packet.start) return 0;
        const elapsed = audio.currentTime - packet.start;
        if (packet.ended && elapsed >= packet.duration) return packet.words.length;
        const total = packet.weights.reduce((sum, weight) => sum + weight, 0);
        const duration = packet.ended ? packet.duration : Math.max(packet.duration, total / 12);
        const progress = total * Math.min(1, elapsed / Math.max(0.001, duration));
        let consumed = 0;
        let count = 0;
        for (const weight of packet.weights) {
            consumed += weight;
            if (consumed > progress) break;
            count++;
        }
        // Partial playback uses estimated alignment. Only a completed packet
        // carries evidence confirmation back to the conversation engine.
        return Math.min(count, packet.words.length - 1);
    }
    function renderSpeech() {
        if (responseRow && packets.length) {
            scroller.update(() => {
                responseRow.textContent = packets.map((packet) => packet.words.slice(0, heardWords(packet)).join(' ')).filter(Boolean).join(' ');
            });
        }
    }
    function tick() {
        renderSpeech();
        revealFrame = requestAnimationFrame(tick);
    }
    function acknowledge(packet) {
        // Hidden playback is muted and not presented. Reopening exposes the text.
        if (panel.hidden) return;
        const words = heardWords(packet);
        if (words > (packet.acknowledged ?? 0)) {
            send({ type: 'playback_ack', turnId: packet.turnId, sequence: packet.sequence, words });
            packet.acknowledged = words;
        }
    }
    function stopPlayback() {
        renderSpeech();
        responseRow?.classList.remove('djinn-message--active');
        packets.forEach(acknowledge);
        for (const timer of completionTimers) clearTimeout(timer);
        completionTimers.clear();
        sources.forEach((source) => { try { source.stop(); } catch {} });
        sources.clear();
        if (revealFrame !== null) cancelAnimationFrame(revealFrame);
        revealFrame = null;
        packets = [];
        activePacket = null;
        nextAudioAt = audio?.currentTime ?? 0;
    }
    function afterPlayback(callback, target = nextAudioAt) {
        const timer = setTimeout(() => {
            completionTimers.delete(timer);
            if (audio && audio.currentTime < target) { afterPlayback(callback, target); return; }
            callback();
        }, Math.max(100, (target - (audio?.currentTime ?? 0)) * 1000) + 20);
        completionTimers.add(timer);
    }
    function queueAudio(buffer) {
        if (!audio || !activePacket) return;
        const packet = activePacket;
        const incoming = new Uint8Array(buffer);
        const bytes = new Uint8Array(packet.remainder.length + incoming.length);
        bytes.set(packet.remainder);
        bytes.set(incoming, packet.remainder.length);
        const usable = bytes.length - bytes.length % 2;
        packet.remainder = bytes.slice(usable);
        if (!usable) return;
        const pcm = new DataView(bytes.buffer, 0, usable);
        const decoded = audio.createBuffer(1, usable / 2, packet.sampleRate);
        const channel = decoded.getChannelData(0);
        for (let i = 0; i < channel.length; i++) channel[i] = pcm.getInt16(i * 2, true) / 32768;
        const source = audio.createBufferSource();
        source.buffer = decoded;
        source.connect(gain);
        const start = Math.max(audio.currentTime + 0.025, nextAudioAt);
        if (packet.start === null) {
            const gapMs = packet.sequence > 0 ? Math.max(0, (start - nextAudioAt) * 1000) : 0;
            afterPlayback(() => send({ type: 'playback_metric', turnId: packet.turnId, sequence: packet.sequence,
                requestToAudioMs: Math.round(performance.now() - turnReceivedAt), gapMs: Math.round(gapMs) }), start);
        }
        packet.start ??= start;
        packet.duration = start + decoded.duration - packet.start;
        nextAudioAt = start + decoded.duration;
        sources.add(source);
        source.onended = () => sources.delete(source);
        source.start(start);
        if (revealFrame === null) tick();
    }
    function stopCapture() {
        captureVersion++;
        processor?.disconnect(); processor = null;
        captureSource?.disconnect(); captureSource = null;
        captureGain?.disconnect(); captureGain = null;
        capture?.getTracks().forEach((track) => track.stop()); capture = null;
    }
    function startCapture() {
        if (!capture || mode !== 'voice' || panel.hidden || socket?.readyState !== WebSocket.OPEN) return;
        captureSource = audio.createMediaStreamSource(capture);
        processor = audio.createScriptProcessor(4096, 1, 1);
        captureGain = audio.createGain(); captureGain.gain.value = 0;
        processor.onaudioprocess = (event) => {
            if (socket?.readyState !== WebSocket.OPEN || mode !== 'voice') return;
            const samples = event.inputBuffer.getChannelData(0);
            const ratio = audio.sampleRate / 16000;
            const pcm = new Int16Array(Math.floor(samples.length / ratio));
            for (let i = 0; i < pcm.length; i++) {
                const position = i * ratio;
                const low = Math.floor(position);
                const high = Math.min(low + 1, samples.length - 1);
                const sample = samples[low] + (samples[high] - samples[low]) * (position - low);
                pcm[i] = Math.max(-1, Math.min(1, sample)) * 32767;
            }
            if (socket.bufferedAmount < 128000) socket.send(pcm.buffer);
        };
        captureSource.connect(processor); processor.connect(captureGain); captureGain.connect(audio.destination);
        send({ type: 'mode', mode: 'voice' });
        state('listening'); sayStatus('Listening...');
    }
    function clearPending() {
        pendingText = false;
        clearTimeout(pendingTimer);
        input.removeAttribute('aria-busy');
    }
    function receive(event) {
        if (event.data instanceof ArrayBuffer) { queueAudio(event.data); return; }
        let message;
        try { message = JSON.parse(event.data); } catch { return; }
        if (message.type === 'user_turn') {
            stopPlayback();
            currentTurnId = message.turnId;
            generatedTurnId = null;
            turnReceivedAt = performance.now();
            appendMessage('visitor', message.text);
            responseRow = appendMessage('assistant', '');
            if (message.mode === 'text') { input.value = ''; clearPending(); }
        }
        if (message.type === 'thinking') { state('thinking'); sayStatus('Djinn is grounding an answer…'); }
        if (message.type === 'listening_ready') sayStatus(mode === 'voice' ? 'Listening...' : 'Type a question for Djinn.');
        if (message.type === 'audio_start' && message.turnId === currentTurnId) {
            const words = message.text.trim().split(/\s+/);
            const weights = message.speechWeights?.length === words.length && message.speechWeights.every((weight) => Number.isFinite(weight) && weight > 0)
                ? message.speechWeights : words.map((word) => Math.max(3, word.length));
            activePacket = { turnId: message.turnId, sequence: message.sequence, words, weights, sampleRate: message.sampleRate, start: null, duration: 0, ended: false, remainder: new Uint8Array(0) };
            packets.push(activePacket);
            responseRow?.classList.add('djinn-message--active');
            state('speaking'); sayStatus('Djinn is speaking.');
        }
        if (message.type === 'audio_end' && message.turnId === currentTurnId) {
            const packet = packets.find((item) => item.sequence === message.sequence);
            if (packet) { packet.ended = true; afterPlayback(() => { acknowledge(packet); renderSpeech(); }); }
            activePacket = null;
        }
        if (message.type === 'turn_complete' && message.turnId === currentTurnId) {
            generatedTurnId = message.turnId;
            afterPlayback(() => {
                packets.forEach(acknowledge);
                renderSpeech();
                if (revealFrame !== null) cancelAnimationFrame(revealFrame);
                revealFrame = null;
                responseRow?.classList.remove('djinn-message--active');
                send({ type: 'playback_complete', turnId: message.turnId });
                state(mode === 'voice' ? 'listening' : 'ready');
                sayStatus(mode === 'voice' ? 'Listening...' : 'Type a question for Djinn.');
            });
        }
        if (message.type === 'playback_stopped') {
            stopPlayback();
            if (message.token != null) send({ type: 'playback_stopped_ack', token: message.token });
            state(mode === 'voice' ? 'listening' : 'ready');
        }
        if (message.type === 'input_rejected') { clearPending(); sayStatus('Please wait a moment, then try again.'); }
        if (['audio_unavailable', 'stt_unavailable'].includes(message.type)) {
            stopPlayback(); stopCapture(); clearPending(); state('error'); sayStatus('Djinn needs a moment. Please try again.');
        }
        if (message.type === 'ended') {
            stopPlayback(); stopCapture(); clearPending(); state('idle'); sayStatus('Session ended. Ask Djinn to start again.');
        }
    }
    async function verifyVisitor(siteKey, signal) {
        if (!window.turnstile) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
                script.async = true;
                const timer = setTimeout(() => { script.remove(); reject(new Error('challenge_timeout')); }, 10000);
                script.onload = () => { clearTimeout(timer); resolve(); };
                script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('challenge_load')); };
                document.head.append(script);
            });
        }
        signal.throwIfAborted();
        challenge.hidden = false;
        try {
            return await new Promise((resolve, reject) => {
                const timer = setTimeout(() => reject(new Error('challenge_timeout')), 120000);
                const finish = (error, token) => { clearTimeout(timer); signal.removeEventListener('abort', abort); error ? reject(error) : resolve(token); };
                const abort = () => finish(new Error('cancelled'));
                cancelChallenge = abort;
                signal.addEventListener('abort', abort, { once: true });
                widget = window.turnstile.render(challenge, {
                    sitekey: siteKey, action: 'djinn', theme: 'auto',
                    callback: (token) => finish(null, token),
                    'error-callback': () => finish(new Error('challenge_failed')),
                    'expired-callback': () => finish(new Error('challenge_expired')),
                });
            });
        } finally {
            if (widget !== null) window.turnstile?.remove(widget);
            widget = null; cancelChallenge = null; challenge.hidden = true;
        }
    }
    async function connect() {
        if (socket?.readyState === WebSocket.OPEN) return;
        if (connection) return connection;
        const version = sessionVersion;
        connectAbort = new AbortController();
        const signal = connectAbort.signal;
        connection = (async () => {
            state('connecting'); sayStatus('Djinn loading...');
            await ensureAudio();
            const health = await fetch(`${endpoint}/health`, { signal: AbortSignal.any([signal, AbortSignal.timeout(5000)]) });
            if (!health.ok) throw new Error('unavailable');
            const info = await health.json();
            if (!info.demo) throw new Error('unavailable');
            const token = info.challengeRequired ? await verifyVisitor(info.siteKey, signal) : null;
            signal.throwIfAborted();
            const response = await fetch(`${endpoint}/browser/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }), signal: AbortSignal.any([signal, AbortSignal.timeout(7000)]) });
            if (!response.ok) throw new Error('unavailable');
            const { ticket } = await response.json();
            signal.throwIfAborted();
            const url = new URL('/browser/voice', endpoint);
            url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
            url.searchParams.set('ticket', ticket);
            const candidate = new WebSocket(url);
            candidate.binaryType = 'arraybuffer';
            socket = candidate;
            await new Promise((resolve, reject) => {
                const timer = setTimeout(() => { candidate.close(); reject(new Error('connection_timeout')); }, 6000);
                const finish = (error) => { clearTimeout(timer); signal.removeEventListener('abort', abort); error ? reject(error) : resolve(); };
                const abort = () => { candidate.close(); finish(new Error('cancelled')); };
                signal.addEventListener('abort', abort, { once: true });
                candidate.onmessage = (event) => {
                    if (typeof event.data === 'string') {
                        const message = JSON.parse(event.data);
                        if (message.type === 'ready') { finish(); return; }
                    }
                    if (version === sessionVersion && socket === candidate) receive(event);
                };
                candidate.onerror = () => finish(new Error('connection_failed'));
                candidate.onclose = () => {
                    finish(new Error('closed'));
                    if (socket !== candidate) return;
                    socket = null; stopPlayback(); stopCapture(); clearPending();
                    mode = 'text'; form.hidden = false;
                    state('idle'); sayStatus('Session ended. Ask Djinn to start again.');
                };
            });
            signal.throwIfAborted();
            send({ type: 'mode', mode: 'text' });
            if (hasConnected) appendMessage('notice', translate('New session — earlier messages are display-only.'));
            hasConnected = true;
            state('ready');
        })().catch((error) => {
            if (version === sessionVersion) {
                socket?.close(); socket = null;
                stopCapture(); mode = 'text'; form.hidden = false;
                state('error'); sayStatus('Djinn is offline or unavailable. Please try again later.');
            }
            throw error;
        }).finally(() => { if (version === sessionVersion) { connection = null; connectAbort = null; } });
        return connection;
    }
    async function useMicrophone() {
        const version = sessionVersion;
        openPanel();
        if (mode === 'voice') {
            mode = 'text'; form.hidden = false; stopCapture(); send({ type: 'mode', mode });
            state('ready'); sayStatus('Djinn is paused. Click to resume.');
            return;
        }
        mode = 'voice'; form.hidden = false;
        const request = ++captureVersion;
        let stage = 'capture';
        try {
            if (!window.isSecureContext) throw Object.assign(new Error(), { name: 'InsecureContextError' });
            if (typeof navigator.mediaDevices?.getUserMedia !== 'function') throw Object.assign(new Error(), { name: 'UnsupportedCaptureError' });
            sayStatus('Allow microphone access to talk to Djinn.');
            // Acquire permission and a real input before spending on a provider session.
            const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
            if (version !== sessionVersion || request !== captureVersion || mode !== 'voice' || panel.hidden) {
                stream.getTracks().forEach((track) => track.stop()); return;
            }
            capture = stream;
            stage = 'audio';
            await ensureAudio();
            if (version !== sessionVersion || request !== captureVersion || mode !== 'voice') return;
            stage = 'connection';
            await connect();
            stage = 'capture';
            if (version === sessionVersion && request === captureVersion && mode === 'voice') startCapture();
        } catch (error) {
            if (version !== sessionVersion || request !== captureVersion || mode !== 'voice') return;
            stopCapture(); mode = 'text'; form.hidden = false; state('error');
            const failures = {
                InsecureContextError: 'Microphone access requires HTTPS. Open the secure version of this site, or use keyboard mode.',
                UnsupportedCaptureError: 'This browser does not support microphone capture. Please use keyboard mode.',
                NotAllowedError: 'Microphone permission is blocked. Allow it in your browser’s site settings, then try again.',
                NotFoundError: 'No microphone was found. Connect an input device, or use keyboard mode.',
                NotReadableError: 'The microphone could not be opened. Check your device or other apps using it, then try again.',
                AbortError: 'Microphone capture was interrupted. Please try again.',
                OverconstrainedError: 'This microphone does not support the requested audio settings. Try another input device.',
                SecurityError: 'Microphone capture is disabled by browser policy. Please use keyboard mode.',
            };
            sayStatus(stage === 'connection' ? 'Djinn is offline or unavailable. Please try again later.'
                : stage === 'audio' ? 'Audio is unavailable in this browser.'
                    : failures[error?.name] ?? 'The microphone could not be started. Please try again or use keyboard mode.');
        }
    }
    function useKeyboard() {
        mode = 'text'; stopCapture(); send({ type: 'mode', mode });
        openPanel(); form.hidden = false;
        state('ready'); sayStatus('Type a question for Djinn.'); input.focus();
        // Merely opening the panel does not create a paid provider session.
        void ensureAudio().catch(() => sayStatus('Audio is unavailable in this browser.'));
    }
    function hidePanel() {
        scroller.cancel();
        stopCapture();
        mode = 'text'; send({ type: 'mode', mode });
        // Cancel an unfinished microphone admission, not a submitted text turn.
        if (connection && !pendingText) connectAbort?.abort();
        panel.hidden = true;
        applyVolume();
        state(control.dataset.state ?? 'ready');
        document.documentElement.classList.remove('djinn-open');
        microphone.setAttribute('aria-expanded', 'false'); keyboard.setAttribute('aria-expanded', 'false');
    }
    function closeSession() {
        scroller.cancel();
        sessionVersion++;
        cancelChallenge?.(); connectAbort?.abort(); connectAbort = null; connection = null;
        stopPlayback(); stopCapture(); clearPending();
        send({ type: 'end' });
        const old = socket; socket = null; old?.close();
        panel.hidden = true; mode = 'text'; state('idle');
        document.documentElement.classList.remove('djinn-open');
        sayStatus('Session ended. Ask Djinn to start again.');
        microphone.setAttribute('aria-expanded', 'false'); keyboard.setAttribute('aria-expanded', 'false');
        responseRow = null; currentTurnId = null;
    }
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const text = input.value.trim();
        if (!text || text.length > 1200 || pendingText) return;
        pendingText = true; input.setAttribute('aria-busy', 'true');
        const version = sessionVersion;
        try {
            await ensureAudio();
            await connect();
            if (version !== sessionVersion) return;
            if (mode !== 'text') { clearPending(); return; }
            stopPlayback();
            currentTurnId = null;
            send({ type: 'mode', mode: 'text' });
            send({ type: 'text', text });
            pendingTimer = setTimeout(() => { clearPending(); sayStatus('Please wait a moment, then try again.'); }, 7000);
        } catch { if (version === sessionVersion) clearPending(); }
    });
    volume.addEventListener('input', () => setVolume(Number(volume.value)));
    mute.addEventListener('click', () => setVolume(level === 0 ? lastVolume : 0));
    document.addEventListener('otsugua:localechange', applyVolume);
    applyVolume();
    microphone.addEventListener('click', () => { void useMicrophone(); });
    keyboard.addEventListener('click', useKeyboard);
    composerMicrophone.addEventListener('click', () => { void useMicrophone(); });
    input.addEventListener('focus', () => { if (mode !== 'text') useKeyboard(); });
    document.addEventListener('pointerdown', (event) => {
        if (!panel.hidden && event.target instanceof Node && !control.contains(event.target)) hidePanel();
    });
    panel.addEventListener('keydown', (event) => { if (event.key === 'Escape') { hidePanel(); keyboard.focus(); } });
    window.addEventListener('pagehide', closeSession);
    state('idle');
}
