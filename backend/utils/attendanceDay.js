/**
 * Attendance is a per-calendar-day record, and the clinic runs on IST.
 * Deriving the day from the server's local time would roll over at the wrong
 * moment on a UTC host, so the day window is computed explicitly in IST.
 */
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** IST midnight for the day containing `at`, returned as a UTC Date. */
export const startOfIstDay = (at = new Date()) => {
  const ist = new Date(at.getTime() + IST_OFFSET_MS);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - IST_OFFSET_MS);
};

/** `[start, end)` covering the IST day containing `at`. */
export const istDayRange = (at = new Date()) => {
  const start = startOfIstDay(at);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
};

/** Minutes past IST midnight for `at` - used to decide lateness. */
export const istMinutesOfDay = (at = new Date()) => {
  const ist = new Date(at.getTime() + IST_OFFSET_MS);
  return ist.getUTCHours() * 60 + ist.getUTCMinutes();
};
