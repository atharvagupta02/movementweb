/**
 * Failed-attempt limiter for the public attendance endpoints.
 *
 * An employee ID is not a secret, so the only thing between a stranger on the
 * clinic WiFi and someone else's punch is a 6-digit code that rotates every 30
 * seconds. Without a limit that code can be brute-forced; this caps wrong
 * guesses per key inside a window.
 *
 * State is in process memory. That is right for one server, but on a
 * serverless host (Vercel) each instance has its own counter, so the effective
 * limit is looser there - clinicIp is the backstop in that case.
 */
export const createLimiter = ({ max, windowMs }) => {
  const hits = new Map();

  const live = (key, now) => {
    const entry = hits.get(key);
    if (!entry || now - entry.first > windowMs) {
      hits.delete(key);
      return null;
    }
    return entry;
  };

  return {
    /** Seconds until the key may try again, or 0 if it is not blocked. */
    blockedFor(key, now = Date.now()) {
      const entry = live(key, now);
      if (!entry || entry.count < max) return 0;
      return Math.ceil((entry.first + windowMs - now) / 1000);
    },
    fail(key, now = Date.now()) {
      const entry = live(key, now);
      if (entry) entry.count += 1;
      else hits.set(key, { count: 1, first: now });
    },
    clear(key) {
      hits.delete(key);
    },
  };
};
