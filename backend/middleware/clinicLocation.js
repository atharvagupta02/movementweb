/**
 * Restricts a route to people standing near the clinic, using the phone's GPS.
 *
 * The attendance page sends `location: { lat, lng, accuracy }` (from the
 * browser's Geolocation API) with every punch. This checks that the point is
 * within CLINIC_RADIUS_M metres of the clinic.
 *
 * Configure in the environment:
 *
 *   CLINIC_LAT=22.7196        clinic latitude  (decimal degrees)
 *   CLINIC_LNG=75.8577        clinic longitude (decimal degrees)
 *   CLINIC_RADIUS_M=100       allowed distance in metres (default 100)
 *   CLINIC_MAX_ACCURACY_M=150 reject readings less precise than this (default 150)
 *   CLINIC_GEO_ENFORCE=true   refuse punches while CLINIC_LAT/LNG are unset
 *
 * If CLINIC_LAT/LNG are unset the check is skipped and a warning is logged, so
 * a fresh deploy is not bricked; set CLINIC_GEO_ENFORCE=true to fail closed.
 *
 * Be honest about what this proves: the browser reports its own position and
 * the server cannot verify it, so someone who forges the request can still lie.
 * It stops the ordinary case (checking in from home) and works best together
 * with clinicIp, which a forged request cannot fake.
 */

const EARTH_RADIUS_M = 6371000;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

/** Great-circle distance in metres between two lat/lng points. */
const distanceMetres = (lat1, lng1, lat2, lng2) => {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(a)));
};

const numberFrom = (value) => (typeof value === "number" && Number.isFinite(value) ? value : null);

const readConfig = () => {
  const lat = Number.parseFloat(process.env.CLINIC_LAT);
  const lng = Number.parseFloat(process.env.CLINIC_LNG);
  const radius = Number.parseFloat(process.env.CLINIC_RADIUS_M);
  const maxAccuracy = Number.parseFloat(process.env.CLINIC_MAX_ACCURACY_M);
  const valid =
    Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  return {
    configured: valid,
    lat,
    lng,
    radius: Number.isFinite(radius) && radius > 0 ? radius : 100,
    maxAccuracy: Number.isFinite(maxAccuracy) && maxAccuracy > 0 ? maxAccuracy : 150,
    enforce: String(process.env.CLINIC_GEO_ENFORCE).toLowerCase() === "true",
  };
};

const refuse = (res, message, code) => res.status(403).json({ success: false, message, code });

let warned = false;

const clinicLocation = (req, res, next) => {
  const config = readConfig();

  if (!config.configured) {
    if (config.enforce) {
      return refuse(
        res,
        "Check-in is not available yet because the clinic location is not set",
        "CLINIC_LOCATION_NOT_CONFIGURED",
      );
    }
    if (!warned) {
      warned = true;
      console.warn(
        "[clinicLocation] CLINIC_LAT/CLINIC_LNG are not set - attendance is not checked against the clinic location.",
      );
    }
    return next();
  }

  const location = req.body?.location;
  const lat = numberFrom(location?.lat);
  const lng = numberFrom(location?.lng);
  const accuracy = numberFrom(location?.accuracy);

  if (lat === null || lng === null || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return refuse(res, "Turn on location for this site to mark attendance", "LOCATION_REQUIRED");
  }

  if (accuracy !== null && accuracy > config.maxAccuracy) {
    return refuse(
      res,
      "Your phone's location is not precise enough. Turn on GPS or step near a window and try again",
      "LOCATION_TOO_VAGUE",
    );
  }

  const away = distanceMetres(config.lat, config.lng, lat, lng);
  if (away > config.radius) {
    console.warn(`[clinicLocation] blocked punch ${Math.round(away)}m from the clinic`);
    return refuse(
      res,
      `Attendance can only be marked at the clinic (within ${config.radius} m). You appear to be about ${Math.round(away)} m away`,
      "OUTSIDE_CLINIC_AREA",
    );
  }

  return next();
};

export default clinicLocation;
export { distanceMetres, readConfig };
