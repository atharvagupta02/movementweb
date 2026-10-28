/**
 * Builds the frontend for Hostinger and zips it, refusing to produce a build
 * that would not work in production.
 *
 * The backend address is baked into the JavaScript at build time, so a build
 * made with the development value (http://localhost:8080) looks fine and then
 * fails for every user. This script stops that before upload.
 *
 *   VITE_BACKEND_URL=https://your-api.vercel.app \
 *   VITE_ADMIN_EMAIL=owner@example.com \
 *   npm run build:hostinger
 *
 * (or put both in .env.production). Output: movementweb-hostinger.zip -
 * upload its CONTENTS to public_html.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath, not .pathname: the latter leaves spaces as %20 and breaks in folders like "My Project".
const root = fileURLToPath(new URL("..", import.meta.url));

const fromFile = (file) => {
  const path = join(root, file);
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match) out[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
  return out;
};

// Shell values win, then .env.production. Plain .env is deliberately ignored:
// it holds the development settings.
const prod = fromFile(".env.production");
// Vercel's project URL is the API origin. A stale Hostinger setting sometimes
// includes `/app`, which makes requests target `/app/api/...` and return HTML.
const backend = (process.env.VITE_BACKEND_URL ?? prod.VITE_BACKEND_URL ?? "")
  .replace(/\/+$/, "")
  .replace(/\/app$/i, "");
const adminEmail = process.env.VITE_ADMIN_EMAIL ?? prod.VITE_ADMIN_EMAIL ?? "";

const fail = (message) => {
  console.error(`\nBuild stopped: ${message}\n`);
  process.exit(1);
};

if (!backend) fail("VITE_BACKEND_URL is not set (your deployed backend, e.g. https://your-api.vercel.app).");
if (!/^https:\/\//i.test(backend)) fail(`VITE_BACKEND_URL must start with https:// (got "${backend}").`);
if (new URL(backend).pathname !== "/") fail(`VITE_BACKEND_URL must be the API origin only, without a path (got "${backend}").`);
if (/localhost|127\.0\.0\.1|\[::1\]/i.test(backend)) fail(`VITE_BACKEND_URL points at this computer ("${backend}").`);
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) fail("VITE_ADMIN_EMAIL is not set to the owner's email address.");

console.log(`Backend : ${backend}\nOwner   : ${adminEmail}\n`);

rmSync(join(root, "dist"), { recursive: true, force: true });

const build = spawnSync("npx", ["vite", "build"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, VITE_BACKEND_URL: backend, VITE_ADMIN_EMAIL: adminEmail },
});
if (build.status !== 0) fail("vite build failed.");

// Verify what we are about to upload.
const dist = join(root, "dist");
if (!existsSync(join(dist, "index.html"))) fail("dist/index.html is missing.");
if (!existsSync(join(dist, ".htaccess"))) fail("dist/.htaccess is missing - page refreshes would 404 on Hostinger.");

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const jsFiles = walk(join(dist, "assets")).filter((file) => file.endsWith(".js"));
const bundled = jsFiles.map((file) => readFileSync(file, "utf8")).join("\n");

if (!bundled.includes(backend)) fail("the backend address did not make it into the build.");
if (/localhost:808\d/.test(bundled)) fail("the build still contains a localhost API address.");

const zipName = "movementweb-hostinger.zip";
rmSync(join(root, zipName), { force: true });
// Zip the folder's contents (not the folder itself); "." also picks up .htaccess.
const zip = spawnSync("zip", ["-qr", join(root, zipName), "."], { cwd: dist, stdio: "inherit" });
if (zip.status !== 0) fail("could not create the zip (is the `zip` command installed?).");

console.log(`\nDone: ${zipName}\nUpload the files INSIDE it to public_html on Hostinger (index.html must sit directly in public_html).\n`);
