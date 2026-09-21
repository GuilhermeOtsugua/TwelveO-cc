// Fractional generations survive frame boundaries and live speed changes.
// At most one generation per frame; missed whole generations are never replayed.
export function createLifeClock(now = 0) {
    let previous = now;
    let phase = 0;
    let speed = 1;

    function accrue(now) {
        phase += Math.max(0, now - previous) * 6 * speed / 1000;
        // A queued RAF timestamp can precede the input event that changed speed.
        previous = Math.max(previous, now);
    }

    return {
        advance(now) {
            accrue(now);
            if (phase + 1e-9 < 1) return false;
            phase = Math.max(0, (phase + 1e-9) % 1);
            return true;
        },
        setSpeed(value, now) {
            accrue(now);
            // Input events may outnumber frames; retain one pending step, not a backlog.
            if (phase >= 2) phase = 1 + phase % 1;
            speed = Math.max(0.5, Math.min(4, value));
        },
        reset(now) {
            previous = now;
            phase = 0;
        },
    };
}
