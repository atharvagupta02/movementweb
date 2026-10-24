/**
 * Restricts a route to requests coming from the clinic's network.
 *
 * This is what actually makes self-service attendance meaningful: a TOTP code
 * proves the employee has their enrolled phone, but not that they are at the
 * clinic. Pinning check-in to the clinic's public IP makes "being there" part
 * of the requirement.
 *
 * Configure with CLINIC_IPS in .env - a comma-separated list of IPv4/IPv6
 * addresses and/or IPv4 CIDR ranges:
 *
 *   CLINIC_IPS=203.0.113.47,192.168.1.0/24,::1,127.0.0.1
 *
 * If CLINIC_IPS is unset the middleware allows everything and warns at boot,
 * so a fresh checkout is not bricked before the clinic's IP is known. Set
 * CLINIC_IP_ENFORCE=true to fail closed instead.
 *
 * NOTE: behind a proxy (Vercel, nginx, Cloudflare) req.ip is the proxy unless
 * `trust proxy` is configured in server.js via TRUST_PROXY. Do not enable
 * TRUST_PROXY unless a proxy really is in front of this app - otherwise a
 * client can forge X-Forwarded-For and walk straight through this check.
 */

const parseList = (raw) =>
  (raw || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

/** `::ffff:10.0.0.1` -> `10.0.0.1`; leaves real IPv6 alone. */
const normalise = (ip) => {
  if (!ip) return "";
  const stripped = ip.replace(/^::ffff:/i, "");
  return stripped === "::1" ? "::1" : stripped;
};

const ipv4ToInt = (ip) => {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null;
    value = value * 256 + octet;
  }
  return value;
};

const matchesCidr = (ip, cidr) => {
  const [range, bitsRaw] = cidr.split("/");
  const bits = Number(bitsRaw);
  if (!Number.isInteger(bits) || bits < 0 || bits > 32) return false;

  const ipInt = ipv4ToInt(ip);
  const rangeInt = ipv4ToInt(range);
  if (ipInt === null || rangeInt === null) return false;

  if (bits === 0) return true;
  const mask = (-1 << (32 - bits)) >>> 0;
  return (ipInt & mask) === (rangeInt & mask);
};

const isAllowed = (ip, allowList) =>
  allowList.some((entry) =>
    entry.includes("/") ? matchesCidr(ip, entry) : normalise(entry) === ip,
  );

let warned = false;

const clinicIp = (req, res, next) => {
  const allowList = parseList(process.env.CLINIC_IPS);
  const enforce = String(process.env.CLINIC_IP_ENFORCE).toLowerCase() === "true";

  if (allowList.length === 0) {
    if (enforce) {
      return res.status(403).json({
        success: false,
        message: "Check-in is not available from this network",
        code: "CLINIC_IP_NOT_CONFIGURED",
      });
    }
    if (!warned) {
      warned = true;
      console.warn(
        "[clinicIp] CLINIC_IPS is not set - attendance check-in is reachable from ANY network. Set CLINIC_IPS in .env to lock it to the clinic.",
      );
    }
    return next();
  }

  const ip = normalise(req.ip);

  if (!isAllowed(ip, allowList)) {
    console.warn(`[clinicIp] blocked check-in attempt from ${ip}`);
    return res.status(403).json({
      success: false,
      message: "Attendance can only be marked from the clinic network",
      code: "OUTSIDE_CLINIC_NETWORK",
    });
  }

  return next();
};

export default clinicIp;
export { isAllowed, normalise, matchesCidr };
