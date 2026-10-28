// Run with:  node --test middleware/clinicLocation.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import clinicLocation, { distanceMetres } from "./clinicLocation.js";

const CLINIC = { lat: 22.7, lng: 75.85 };

// ~1 degree of latitude is 111,195 m, so these offsets are close to the metres named.
const north = (metres) => ({ lat: CLINIC.lat + metres / 111195, lng: CLINIC.lng });

const run = (location, env = {}) => {
  const saved = { ...process.env };
  Object.assign(process.env, { CLINIC_LAT: String(CLINIC.lat), CLINIC_LNG: String(CLINIC.lng) }, env);
  for (const key of Object.keys(env)) if (env[key] === undefined) delete process.env[key];
  const req = { body: location === undefined ? {} : { location } };
  let result = { next: false };
  const res = {
    status(code) {
      result.status = code;
      return this;
    },
    json(body) {
      result.body = body;
      return this;
    },
  };
  clinicLocation(req, res, () => {
    result.next = true;
  });
  process.env = saved;
  return result;
};

test("distance is about right", () => {
  const d = distanceMetres(CLINIC.lat, CLINIC.lng, north(100).lat, north(100).lng);
  assert.ok(Math.abs(d - 100) < 1, `got ${d}`);
  assert.equal(Math.round(distanceMetres(CLINIC.lat, CLINIC.lng, CLINIC.lat, CLINIC.lng)), 0);
});

test("standing at the clinic is allowed", () => {
  assert.equal(run({ ...CLINIC, accuracy: 20 }).next, true);
});

test("60 m away is allowed, 100 m radius", () => {
  assert.equal(run({ ...north(60), accuracy: 20 }).next, true);
});

test("150 m away is refused", () => {
  const r = run({ ...north(150), accuracy: 20 });
  assert.equal(r.next, false);
  assert.equal(r.status, 403);
  assert.equal(r.body.code, "OUTSIDE_CLINIC_AREA");
});

test("home, kilometres away, is refused", () => {
  const r = run({ lat: 22.75, lng: 75.9, accuracy: 15 });
  assert.equal(r.body.code, "OUTSIDE_CLINIC_AREA");
});

test("a custom radius is honoured", () => {
  assert.equal(run({ ...north(150), accuracy: 20 }, { CLINIC_RADIUS_M: "200" }).next, true);
  assert.equal(run({ ...north(60), accuracy: 20 }, { CLINIC_RADIUS_M: "50" }).next, false);
});

test("no location sent is refused with a clear code", () => {
  assert.equal(run(undefined).body.code, "LOCATION_REQUIRED");
  assert.equal(run(null).body.code, "LOCATION_REQUIRED");
});

test("junk location values are refused, not crashed on", () => {
  for (const bad of [
    { lat: "22.7", lng: "75.85" },
    { lat: NaN, lng: 75.85 },
    { lat: 999, lng: 75.85 },
    { lat: 22.7 },
    "22.7,75.85",
    { lat: { $gt: 0 }, lng: { $gt: 0 } },
  ]) {
    const r = run(bad);
    assert.equal(r.next, false, JSON.stringify(bad));
    assert.equal(r.body.code, "LOCATION_REQUIRED", JSON.stringify(bad));
  }
});

test("a very imprecise reading is refused even if it looks close", () => {
  const r = run({ ...CLINIC, accuracy: 900 });
  assert.equal(r.body.code, "LOCATION_TOO_VAGUE");
});

test("a missing accuracy value is tolerated", () => {
  assert.equal(run({ ...CLINIC }).next, true);
});

test("unset clinic location skips the check by default", () => {
  const r = run(undefined, { CLINIC_LAT: undefined, CLINIC_LNG: undefined });
  assert.equal(r.next, true);
});

test("unset clinic location fails closed when enforced", () => {
  const r = run({ ...CLINIC }, { CLINIC_LAT: undefined, CLINIC_LNG: undefined, CLINIC_GEO_ENFORCE: "true" });
  assert.equal(r.next, false);
  assert.equal(r.body.code, "CLINIC_LOCATION_NOT_CONFIGURED");
});

test("a bad clinic latitude in the settings counts as unset", () => {
  const r = run(undefined, { CLINIC_LAT: "not-a-number" });
  assert.equal(r.next, true);
});
