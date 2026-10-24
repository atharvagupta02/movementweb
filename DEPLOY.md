# Deploying Movement Rehab

Two pieces, deployed separately:

| Piece | Where | Folder |
|---|---|---|
| **Backend (API)** | Vercel | `backend/` |
| **Frontend (the staff web app)** | Hostinger (static files) | repo root |

Deploy the **backend first** — the frontend needs its address.

---

## Part A — Backend on Vercel

### A1. Allow Vercel to reach MongoDB Atlas
Vercel's servers have changing addresses, so Atlas must accept connections from anywhere.

1. Atlas → **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
2. Make sure the database user's password is long and random — that password is now the only gate.

### A2. Create the Vercel project
1. Vercel dashboard → **Add New… → Project** → import the GitHub repo `movementweb`.
2. **Root Directory: `backend`** (click *Edit* next to it). This is the important one.
3. **Framework Preset: Other.** Leave Build Command and Output Directory empty.
4. Open **Environment Variables** and add the values below, then **Deploy**.

| Name | Value | Notes |
|---|---|---|
| `MONGO_URI` | your Atlas connection string | |
| `JWT_SECRET` | a new long random string | `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_EMAIL` | the owner's login email | the one account that is admin |
| `CLINIC_IPS` | the clinic's **public** IP | open https://ifconfig.me while on the clinic WiFi |
| `CLINIC_IP_ENFORCE` | `true` | |
| `TRUST_PROXY` | `1` | **required on Vercel** — otherwise the clinic IP check sees Vercel's address |
| `CORS_ORIGINS` | `https://your-frontend-domain.com` | exact, `https://`, no trailing slash. Add after A4 if you don't have the domain yet |
| `SHIFT_START_HOUR` | `8` | late-arrival rules, IST |
| `SHIFT_START_MINUTE` | `0` | |
| `ATTENDANCE_GRACE_MINUTES` | `15` | |
| `TOTP_ISSUER` | `Movement Rehab` | name shown in the authenticator app |

Do **not** set `PORT`. See `backend/.env.example` for the same list with explanations.

### A3. Check it works
Open `https://<your-project>.vercel.app/` — it should say **API working**.

```
curl -i https://<your-project>.vercel.app/api/report/salary
```
should answer **401** (login required). If it says 503 `DB_UNAVAILABLE`, see Troubleshooting.

### A4. Note the URL
Copy `https://<your-project>.vercel.app` — it is the `VITE_BACKEND_URL` for Part B.

> **Before anyone logs in:** this backend and the old dashboard backend share one database
> if they use the same `MONGO_URI`. The first login here re-encrypts that employee's password,
> and the old backend (which compares plain text) will then reject them. Switch the old
> backend off first, or give this one its own database.

---

## Part B — Frontend on Hostinger

### B1. Build on your computer
```
npm install
VITE_BACKEND_URL=https://<your-project>.vercel.app \
VITE_ADMIN_EMAIL=owner@example.com \
npm run build:hostinger
```
`VITE_ADMIN_EMAIL` must equal the backend's `ADMIN_EMAIL`.

The script **refuses to build** if the API address is missing, is not `https://`, points at
`localhost`, or the owner email is missing — those mistakes produce a build that looks fine and
fails for every user. On success it creates **`movementweb-hostinger.zip`**.

(Instead of typing the two values each time you can put them in a file named `.env.production`
in the project root. It is git-ignored.)

### B2. Upload
1. Hostinger **hPanel → Websites → Manage → File Manager → `public_html`**.
2. Delete Hostinger's placeholder files (`default.php`, any old `index.html`).
3. **Upload** `movementweb-hostinger.zip` into `public_html`, right-click → **Extract**, extract *into* `public_html`.
4. Check that `index.html` sits **directly in `public_html`** (not inside a sub-folder), and that
   `.htaccess` is there too (turn on *Show hidden files* in File Manager). `.htaccess` is what
   stops a page refresh from showing a 404.
5. Turn on **SSL** for the domain (hPanel → Security → SSL). The site must be `https://` because
   the backend is.

The app expects to live at the **root** of a domain or subdomain, not in a sub-folder.

### B3. Tell the backend where the frontend is
Vercel → the backend project → **Settings → Environment Variables** → set `CORS_ORIGINS` to
`https://your-frontend-domain.com` → **Deployments → … → Redeploy**.

---

## Part C — First-day checklist
1. Open the site, sign in at `/auth` with the owner email and password.
   (Forgot it? `cd backend && node scripts/setEmployeePassword.js --email <owner email> --password "<new>"`)
2. **Staff Attendance → Authenticator → Set up** for each employee: they scan the QR with Google or
   Microsoft Authenticator and you type the code to confirm.
3. From the **clinic WiFi**, check in and out once yourself on `/daily-attendance`.
   From mobile data it must say *Attendance can only be marked from the clinic network*.
4. Delete any test attendance rows you made.
5. Run a pilot with two or three staff for a week; use manual marking on Staff Attendance as the backup.

---

## Troubleshooting

| What you see | Cause and fix |
|---|---|
| Browser console: *blocked by CORS policy* | `CORS_ORIGINS` doesn't exactly match the site's address (check `https`, `www.`, trailing `/`). Fix and redeploy the backend. |
| Every request fails / login does nothing | The build used the wrong `VITE_BACKEND_URL`. Rebuild with the right one and re-upload. |
| API returns `503 DB_UNAVAILABLE` | Atlas isn't accepting Vercel: check Network Access (A1), the `MONGO_URI` password, and that the cluster isn't paused. |
| *Attendance can only be marked from the clinic network* **at the clinic** | `CLINIC_IPS` is wrong or the clinic's IP changed, or `TRUST_PROXY` isn't `1`. Re-check ifconfig.me on the clinic WiFi. |
| Refreshing `/attendence` shows 404 | `.htaccess` is missing from `public_html` (hidden file — re-extract the zip). |
| Everyone is logged out after a deploy | `JWT_SECRET` was changed. Expected; they sign in again. |
| Someone who left can still use the app | Mark them **Inactive** on the Staff page — their login stops working immediately. |

## Good to know
- The authenticator code must be typed in the 30 seconds it is valid; a code works only once.
- The wrong-guess lockout is kept in memory per server instance. On Vercel it is a little looser than on
  a single server; the clinic-network check and the authenticator code are the real protection.
- After any change to the backend settings in Vercel, **redeploy** for it to take effect.
