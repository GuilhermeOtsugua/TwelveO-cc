import { translateValue } from './localization';

const panel = document.querySelector('[data-djinn-panel]');

if (panel instanceof HTMLElement) {
    const startButton = panel.querySelector('[data-djinn-start]');
    const retryButton = panel.querySelector('[data-djinn-retry]');
    const status = panel.querySelector('[data-djinn-status]');
    const transcript = panel.querySelector('[data-djinn-transcript]');
    const answer = panel.querySelector('[data-djinn-answer]');
    const sources = panel.querySelector('[data-djinn-sources]');
    const endpoint = ['twelveo-cc.test', '127.0.0.1', 'localhost'].includes(window.location.hostname)
        ? 'http://127.0.0.1:8080'
        : 'https://voice.otsugua.dev';
    let socket = null;
    let stream = null;
    let audioContext = null;
    let processor = null;
    let activeAudio = null;
    let audioQueue = [];
    let opener = null;

    const setStatus = (message) => {
        if (status instanceof HTMLElement) {
            const locale = document.documentElement.lang === 'pt-BR' ? 'pt-BR' : 'en';
            status.textContent = translateValue(message, locale);
        }
    };

    const setUnavailable = () => {
        setStatus('Djinn is taking a short pause. Please try again later.');
        if (startButton instanceof HTMLButtonElement) startButton.disabled = true;
        if (retryButton instanceof HTMLButtonElement) retryButton.hidden = false;
    };

    const stopCapture = () => {
        processor?.disconnect();
        processor = null;
        stream?.getTracks().forEach((track) => track.stop());
        stream = null;
        audioContext?.close().catch(() => {});
        audioContext = null;
    };

    const stopAudio = () => {
        audioQueue = [];
        if (activeAudio) {
            activeAudio.pause();
            URL.revokeObjectURL(activeAudio.src);
            activeAudio.src = '';
            activeAudio = null;
        }
    };

    const close = () => {
        stopCapture();
        stopAudio();
        socket?.close();
        socket = null;
        panel.hidden = true;
        opener?.focus();
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
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
            audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            processor = audioContext.createScriptProcessor(4096, 1, 1);
            const silent = audioContext.createGain();
            silent.gain.value = 0;
            processor.onaudioprocess = (event) => {
                if (socket?.readyState === WebSocket.OPEN) {
                    socket.send(toPcm16(event.inputBuffer.getChannelData(0), audioContext.sampleRate));
                }
            };
            source.connect(processor);
            processor.connect(silent);
            silent.connect(audioContext.destination);
            socket?.send(JSON.stringify({ type: 'start' }));
            setStatus('Listening. You can interrupt Djinn at any time.');
        } catch {
            setStatus('Microphone access is needed to speak with Djinn. Please allow it and try again.');
            if (retryButton instanceof HTMLButtonElement) retryButton.hidden = false;
        }
    };

    const playNextAudio = () => {
        if (activeAudio || audioQueue.length === 0) return;
        const next = audioQueue.shift();
        const bytes = Uint8Array.from(atob(next.base64), (character) => character.charCodeAt(0));
        const url = URL.createObjectURL(new Blob([bytes], { type: next.mime || 'audio/mpeg' }));
        activeAudio = new Audio(url);
        activeAudio.onended = () => {
            URL.revokeObjectURL(url);
            activeAudio = null;
            playNextAudio();
        };
        activeAudio.play().catch(() => {
            URL.revokeObjectURL(url);
            activeAudio = null;
            audioQueue = [];
            setStatus('Djinn answered, but your browser could not play the audio.');
        });
    };

    const queueAudio = (base64, mime) => {
        audioQueue.push({ base64, mime });
        playNextAudio();
    };

    const connect = async () => {
        if (startButton instanceof HTMLButtonElement) startButton.disabled = true;
        if (retryButton instanceof HTMLButtonElement) retryButton.hidden = true;
        setStatus('Checking whether Djinn is ready…');
        try {
            const health = await fetch(`${endpoint}/health`, { signal: AbortSignal.timeout(2500) });
            if (!health.ok || !(await health.json()).demo) throw new Error('unavailable');
            const wsUrl = new URL(endpoint);
            wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
            wsUrl.pathname = '/browser/voice';
            socket = new WebSocket(wsUrl);
            socket.onopen = () => {
                if (startButton instanceof HTMLButtonElement) startButton.disabled = false;
                setStatus('Djinn is ready. Start when you are ready to speak.');
            };
            socket.onerror = setUnavailable;
            socket.onclose = () => {
                if (!panel.hidden && socket?.readyState !== WebSocket.OPEN) setUnavailable();
            };
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'transcript' && transcript instanceof HTMLElement) {
                    transcript.hidden = false;
                    transcript.textContent = message.text;
                }
                if (message.type === 'thinking') setStatus('Djinn is grounding an answer…');
                if (message.type === 'answer' && answer instanceof HTMLElement) {
                    answer.hidden = false;
                    answer.textContent = message.text;
                    if (sources instanceof HTMLElement) {
                        sources.hidden = !message.sources?.length;
                        const locale = document.documentElement.lang === 'pt-BR' ? 'pt-BR' : 'en';
                        sources.textContent = message.sources?.length ? `${translateValue('Grounded by', locale)} ${message.sources.join(' · ')}` : '';
                    }
                    setStatus('Djinn is speaking.');
                }
                if (message.type === 'audio') queueAudio(message.data, message.mime);
                if (message.type === 'playback_stopped') stopAudio();
                if (['audio_unavailable', 'stt_unavailable'].includes(message.type)) setStatus('Djinn needs a moment. Please try again.');
                if (message.type === 'ended') setUnavailable();
            };
        } catch {
            setUnavailable();
        }
    };

    document.querySelectorAll('[data-djinn-open]').forEach((button) => button.addEventListener('click', () => {
        opener = button;
        panel.hidden = false;
        answer.hidden = true;
        transcript.hidden = true;
        sources.hidden = true;
        connect();
        panel.querySelector('[data-djinn-close]')?.focus();
    }));
    panel.querySelectorAll('[data-djinn-close]').forEach((button) => button.addEventListener('click', close));
    startButton?.addEventListener('click', startCapture);
    retryButton?.addEventListener('click', () => { stopCapture(); socket?.close(); connect(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !panel.hidden) close(); });
}
