

// import { useEffect, useRef, useState } from "react";

// /* ------------------------------------------------------------------
//    Movement Rehab: Employee Attendance (OTP) | React + Tailwind CSS
//    Works with Tailwind v3. No extra plugins needed.

//    BACKEND: replace the three functions in `api` with real fetch() calls:
//      sendOtp(id)        -> POST /api/attendance/otp/send     { employeeId }
//      verifyOtp(id,code) -> POST /api/attendance/otp/verify   { employeeId, code }
//      punch(id)          -> returns { in, out, late } from your DB
//    Generate and check the OTP ON THE SERVER (MSG91 / Twilio / Fast2SMS).
// ------------------------------------------------------------------- */

// const EMPLOYEES = {
//   MR001: { name: "Dr. Gupta", role: "Physiotherapist", phone: "••••• ••123", shift: "M" },
//   MR002: { name: "Neha Sharma", role: "Receptionist", phone: "••••• ••456", shift: "E" },
//   MR003: { name: "Rohan Patil", role: "Therapist", phone: "••••• ••789", shift: "M" },
// };
// const SHIFTS = {
//   M: { label: "Morning", time: "8:00 AM – 4:00 PM", startHour: 8, short: "8–4", chip: "bg-emerald-100 text-emerald-700" },
//   E: { label: "Evening", time: "2:00 PM – 10:00 PM", startHour: 14, short: "2–10", chip: "bg-indigo-100 text-indigo-700" },
//   F: { label: "Off", time: "Weekly off", short: "Off", chip: "bg-slate-100 text-slate-500" },
// };
// const GRACE_MIN = 15;
// const OTP_LIFETIME = 120; // seconds
// const RESEND_AFTER = 30; // seconds
// const MAX_TRIES = 3;

// const fmtTime = (d) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

// /* ---------------- DEMO API (replace with real calls) ---------------- */
// const db = { otp: {}, records: {} };
// const api = {
//   async sendOtp(id) {
//     if (!EMPLOYEES[id]) throw new Error("Employee ID not found. Check the ID and try again.");
//     const code = String(Math.floor(100000 + Math.random() * 900000));
//     db.otp[id] = { code, exp: Date.now() + OTP_LIFETIME * 1000, tries: 0 };
//     return { phone: EMPLOYEES[id].phone, demoCode: code }; // remove demoCode in production
//   },
//   async verifyOtp(id, code) {
//     const o = db.otp[id];
//     if (!o || Date.now() > o.exp) throw new Error("OTP expired. Send a new OTP.");
//     if (o.tries >= MAX_TRIES) throw new Error("Too many attempts. Send a new OTP.");
//     if (o.code !== code) {
//       o.tries += 1;
//       throw new Error(`Incorrect OTP. ${MAX_TRIES - o.tries} attempt(s) left.`);
//     }
//     delete db.otp[id];
//     return true;
//   },
//   async punch(id) {
//     const now = new Date();
//     const r = (db.records[id] ||= {});
//     let action = "done";
//     if (!r.in) {
//       r.in = now;
//       r.late = now.getHours() * 60 + now.getMinutes() > SHIFTS[EMPLOYEES[id].shift].startHour * 60 + GRACE_MIN;
//       action = "in";
//     } else if (!r.out) {
//       r.out = now;
//       action = "out";
//     }
//     return { ...r, action };
//   },
// };

// /* ---------------- shared bits ---------------- */
// const Logo = ({ className = "" }) => (
//   <div className={`inline-block rounded-2xl bg-white px-5 py-3 text-xl font-extrabold text-[#1f4aa8] ${className}`}>
//     Movement <span className="text-[#4fc3c9]">Rehab</span>
//   </div>
// );

// const Styles = () => (
//   <style>{`
//     @keyframes mrShake{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
//     @keyframes mrFloat{50%{transform:translate(40px,30px) scale(1.15)}}
//     @keyframes mrRise{from{opacity:0;transform:translateY(16px)}}
//     .mr-shake{animation:mrShake .4s}.mr-float{animation:mrFloat 10s ease-in-out infinite}.mr-rise{animation:mrRise .5s}
//     @media(prefers-reduced-motion:reduce){.mr-shake,.mr-float,.mr-rise{animation:none}}
//   `}</style>
// );

// /* ---------------- OTP LOGIN ---------------- */
// function OtpLogin({ onVerified, initialId = "" }) {
//   const [step, setStep] = useState("id");
//   const [empId, setEmpId] = useState(initialId);
//   const [phone, setPhone] = useState("");
//   const [digits, setDigits] = useState(Array(6).fill(""));
//   const [error, setError] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [shake, setShake] = useState(false);
//   const [expiresAt, setExpiresAt] = useState(0);
//   const [resendAt, setResendAt] = useState(0);
//   const [tick, setTick] = useState(Date.now());
//   const [sms, setSms] = useState(null);
//   const boxes = useRef([]);

//   useEffect(() => {
//     const t = setInterval(() => setTick(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);
//   useEffect(() => {
//     if (initialId) sendOtp(initialId);
//     // eslint-disable-next-line
//   }, []);

//   const left = Math.max(0, Math.ceil((expiresAt - tick) / 1000));
//   const canResend = tick >= resendAt;

//   async function sendOtp(idArg) {
//     const id = (idArg || empId).trim().toUpperCase();
//     setError("");
//     setBusy(true);
//     try {
//       const res = await api.sendOtp(id);
//       setEmpId(id);
//       setPhone(res.phone);
//       setDigits(Array(6).fill(""));
//       setExpiresAt(Date.now() + OTP_LIFETIME * 1000);
//       setResendAt(Date.now() + RESEND_AFTER * 1000);
//       setStep("otp");
//       setTimeout(() => boxes.current[0]?.focus(), 50);
//       setTimeout(() => setSms(res.demoCode), 700); // demo SMS pop-up
//       setTimeout(() => setSms(null), 9000);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function verify(code) {
//     if (code.length < 6) return setError("Enter the 6-digit OTP.");
//     setBusy(true);
//     try {
//       await api.verifyOtp(empId, code);
//       const rec = await api.punch(empId);
//       onVerified(empId, rec);
//     } catch (e) {
//       setError(e.message);
//       setShake(true);
//       setTimeout(() => setShake(false), 450);
//       setDigits(Array(6).fill(""));
//       boxes.current[0]?.focus();
//     } finally {
//       setBusy(false);
//     }
//   }

//   function setDigit(i, v) {
//     const d = v.replace(/\D/g, "").slice(-1);
//     const next = [...digits];
//     next[i] = d;
//     setDigits(next);
//     if (d && i < 5) boxes.current[i + 1]?.focus();
//     if (next.every(Boolean)) verify(next.join(""));
//   }
//   function paste(e) {
//     const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
//     if (!t) return;
//     e.preventDefault();
//     const next = Array(6).fill("").map((_, i) => t[i] || "");
//     setDigits(next);
//     if (t.length === 6) verify(t);
//     else boxes.current[t.length]?.focus();
//   }

//   return (
//     <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.1fr_1fr]">
//       {/* demo SMS */}
//       <div
//         className={`fixed right-4 top-4 z-50 max-w-xs rounded-2xl bg-[#0b1f4f] px-5 py-4 text-white shadow-2xl transition-transform duration-500 ${
//           sms ? "translate-x-0" : "translate-x-[130%]"
//         }`}
//       >
//         <p className="mb-1 text-xs text-white/60">Demo SMS from Movement Rehab</p>
//         <p>
//           Your attendance OTP is <b className="ml-1 text-2xl tracking-[0.3em] text-cyan-300">{sms}</b>
//         </p>
//       </div>

//       <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1b3f7a] to-[#0b1f4f] p-8 text-white lg:p-12">
//         <div className="mr-float absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#4fc3c9]/40 blur-3xl" />
//         <div className="mr-float absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#2457b5] blur-3xl" />
//         <Logo className="relative w-fit" />
//         <div className="relative my-10">
//           <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight lg:text-5xl">
//             Mark your attendance in seconds.
//           </h1>
//           <p className="max-w-sm text-white/80">
//             Verify with your Employee ID and a one-time password sent to your registered mobile number.
//           </p>
//           <ol className="mt-7 hidden space-y-3 text-sm text-white/90 lg:block">
//             {["Enter your Employee ID", "Receive a 6-digit OTP by SMS", "Verify and your attendance is marked"].map((t, i) => (
//               <li key={t} className="flex items-center gap-3">
//                 <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 font-bold">{i + 1}</span>
//                 {t}
//               </li>
//             ))}
//           </ol>
//         </div>
//         <p className="relative text-xs text-white/60">Elevate your health &amp; performance</p>
//       </div>

//       <div className="grid place-items-center p-6">
//         <div className="mr-rise w-full max-w-sm">
//           {step === "id" ? (
//             <>
//               <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Employee check-in</h2>
//               <p className="mb-6 mt-1 text-slate-500">Enter your Employee ID to receive an OTP.</p>
//               <label className="mb-2 block text-sm font-semibold text-slate-500" htmlFor="eid">Employee ID</label>
//               <input
//                 id="eid"
//                 value={empId}
//                 onChange={(e) => setEmpId(e.target.value.toUpperCase())}
//                 onKeyDown={(e) => e.key === "Enter" && sendOtp()}
//                 maxLength={8}
//                 placeholder="e.g. MR001"
//                 className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-bold tracking-widest outline-none transition focus:border-[#1f4aa8] focus:ring-4 focus:ring-blue-100"
//               />
//               <p className="mt-2 min-h-[20px] text-sm text-red-600">{error}</p>
//               <button
//                 onClick={() => sendOtp()}
//                 disabled={busy || !empId}
//                 className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[#1f4aa8] to-[#2f6fd6] py-3.5 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
//               >
//                 {busy ? "Sending…" : "Send OTP"}
//               </button>
//               <p className="mt-6 rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-500">
//                 <b>Demo IDs:</b> MR001, MR002, MR003. The OTP appears as a pop-up at the top right.
//               </p>
//             </>
//           ) : (
//             <>
//               <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Verify OTP</h2>
//               <p className="mb-6 mt-1 text-slate-500">OTP sent to +91 {phone}</p>
//               <div className={`flex justify-between gap-2 ${shake ? "mr-shake" : ""}`} onPaste={paste}>
//                 {digits.map((d, i) => (
//                   <input
//                     key={i}
//                     ref={(el) => (boxes.current[i] = el)}
//                     value={d}
//                     inputMode="numeric"
//                     autoComplete="one-time-code"
//                     aria-label={`Digit ${i + 1}`}
//                     onChange={(e) => setDigit(i, e.target.value)}
//                     onKeyDown={(e) => e.key === "Backspace" && !d && boxes.current[i - 1]?.focus()}
//                     className="h-14 w-full rounded-2xl border border-slate-200 bg-white text-center text-2xl font-bold outline-none transition focus:border-[#1f4aa8] focus:ring-4 focus:ring-blue-100"
//                   />
//                 ))}
//               </div>
//               <p className="mt-2 min-h-[20px] text-sm text-red-600">{error}</p>
//               <button
//                 onClick={() => verify(digits.join(""))}
//                 disabled={busy}
//                 className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[#1f4aa8] to-[#2f6fd6] py-3.5 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
//               >
//                 {busy ? "Verifying…" : "Verify & mark attendance"}
//               </button>
//               <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
//                 <span>
//                   Expires in {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
//                 </span>
//                 <button
//                   onClick={() => sendOtp()}
//                   disabled={!canResend}
//                   className="font-bold text-[#1f4aa8] disabled:text-slate-400"
//                 >
//                   {canResend ? "Resend OTP" : `Resend in ${Math.ceil((resendAt - tick) / 1000)}s`}
//                 </button>
//               </div>
//               <button
//                 onClick={() => { setStep("id"); setError(""); }}
//                 className="mt-4 w-full rounded-2xl bg-slate-100 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
//               >
//                 ← Change Employee ID
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- PORTAL ---------------- */
// const StatCard = ({ label, value, sub }) => (
//   <div className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10">
//     <p className="font-semibold text-slate-500">{label}</p>
//     <p className="my-2 text-4xl font-extrabold text-slate-900">{value}</p>
//     <p className="text-sm text-slate-500">{sub}</p>
//   </div>
// );

// const Badge = ({ kind, children }) => {
//   const c = { P: "bg-emerald-100 text-emerald-700", L: "bg-amber-100 text-amber-700", V: "bg-indigo-100 text-indigo-700" }[kind];
//   return <span className={`rounded-full px-3 py-1 text-xs font-bold ${c}`}>{children}</span>;
// };

// function Calendar({ rec }) {
//   // October 2026 starts on Thursday
//   const cells = [];
//   for (let i = 0; i < 3; i++) cells.push(<div key={"b" + i} />);
//   for (let d = 1; d <= 31; d++) {
//     const wd = (d + 2) % 7;
//     let cls = "bg-slate-100 opacity-40";
//     if (d < 10 && wd !== 6) cls = [6].includes(d) ? "bg-amber-100 text-amber-700" : [8, 9].includes(d) ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700";
//     if (d === 10) cls = `ring-2 ring-[#1f4aa8] ${rec?.in ? (rec.late ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700") : "bg-slate-100"}`;
//     cells.push(
//       <div key={d} className={`grid aspect-square place-items-center rounded-xl text-sm font-semibold transition hover:scale-110 ${cls}`}>
//         {d}
//       </div>
//     );
//   }
//   return (
//     <div className="rounded-3xl border border-slate-200 bg-white p-6">
//       <h3 className="text-lg font-bold">October 2026</h3>
//       <div className="mt-4 grid grid-cols-7 gap-2 text-center">
//         {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
//           <span key={i} className="text-xs font-bold text-slate-400">{d}</span>
//         ))}
//         {cells}
//       </div>
//     </div>
//   );
// }

// function Portal({ empId, rec, onLogout, onNext }) {
//   const emp = EMPLOYEES[empId];
//   const shift = SHIFTS[emp.shift];
//   const [tab, setTab] = useState("a");
//   const [leaves, setLeaves] = useState([{ type: "Earned Leave", dates: "08 – 09 Oct", status: "Approved" }]);
//   const [form, setForm] = useState({ type: "Casual Leave", from: "", to: "", reason: "" });
//   const minutes = Math.floor(((rec.out || new Date()) - rec.in) / 60000);
//   const msg =
//     rec.action === "in"
//       ? `Attendance marked at ${fmtTime(rec.in)}${rec.late ? ", marked late." : ", on time."}`
//       : rec.action === "out"
//       ? `Check-out marked at ${fmtTime(rec.out)}. Have a great evening.`
//       : "Check-in and check-out are already recorded for today.";
//   const chip = rec.action === "in" ? "Checked in" : rec.action === "out" ? "Checked out" : "Completed";

//   const rows = [
//     ["Today", fmtTime(rec.in), rec.out ? fmtTime(rec.out) : "—", rec.late ? "Late" : "Present", rec.late ? "L" : "P"],
//     ["09 Oct", "7:58 AM", "4:03 PM", "Present", "P"],
//     ["08 Oct", "—", "—", "Leave", "V"],
//     ["07 Oct", "8:02 AM", "4:00 PM", "Present", "P"],
//     ["06 Oct", "8:24 AM", "4:10 PM", "Late", "L"],
//   ];
//   const week = emp.shift === "M" ? "MMMMMFF" : "EEEEMFF";

//   function applyLeave() {
//     if (!form.from || !form.to || form.to < form.from) return alert("Choose valid dates.");
//     const f = (v) => new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
//     setLeaves([{ type: form.type, dates: form.from === form.to ? f(form.from) : `${f(form.from)} – ${f(form.to)}`, status: "Pending" }, ...leaves]);
//     setForm({ ...form, reason: "" });
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
//         <div className="rounded-2xl border border-slate-200 px-4 py-2 text-lg font-extrabold text-[#1f4aa8]">
//           Movement <span className="text-[#4fc3c9]">Rehab</span>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#4fc3c9] to-[#1f4aa8] font-bold text-white">{emp.name[0]}</div>
//           <div className="hidden sm:block">
//             <p className="font-bold leading-tight">{emp.name}</p>
//             <p className="text-xs text-slate-500">{empId} · {emp.role}</p>
//           </div>
//           <button onClick={onLogout} className="rounded-xl border border-slate-200 px-3 py-2 text-sm transition hover:bg-slate-100">Logout</button>
//         </div>
//       </header>

//       <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 lg:px-8">
//         <section className="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#1b3a78] to-[#2457b5] p-8 text-white shadow-xl shadow-blue-900/30">
//           <div className="mr-float absolute -right-16 -top-28 h-72 w-72 rounded-full bg-[#4fc3c9]/30 blur-3xl" />
//           <div className="relative">
//             <p className="font-semibold">
//               {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
//               <span className="ml-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">{chip} ✓</span>
//             </p>
//             <h2 className="mb-1 mt-2 text-3xl font-extrabold tracking-tight">Hello, {emp.name.split(" ").pop() === "Gupta" ? "Dr. Gupta" : emp.name.split(" ")[0]}</h2>
//             <p className="text-white/85">{msg}</p>
//             <button
//               onClick={onNext}
//               disabled={!!rec.out}
//               className="mt-5 rounded-2xl bg-white px-6 py-3 font-bold text-[#1f4aa8] transition hover:-translate-y-0.5 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
//             >
//               {rec.out ? "Done for today" : "Mark check-out with OTP"}
//             </button>
//           </div>
//           <div className="relative flex gap-3">
//             {[["Check-in", fmtTime(rec.in)], ["Check-out", rec.out ? fmtTime(rec.out) : "--"], ["Worked", `${Math.floor(minutes / 60)}h ${minutes % 60}m`]].map(([k, v]) => (
//               <div key={k} className="min-w-[96px] rounded-2xl border border-white/20 bg-white/15 px-5 py-4">
//                 <p className="text-2xl font-bold">{v}</p>
//                 <p className="text-sm text-white/80">{k}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className="my-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
//           <StatCard label="Present days" value={20} sub="This month" />
//           <StatCard label="Late arrivals" value={2 + (rec.late ? 1 : 0)} sub={`After ${GRACE_MIN} min grace`} />
//           <StatCard label="Leaves taken" value={3} sub="This month" />
//           <StatCard label="My shift" value={<span className="text-2xl">{shift.label}</span>} sub={shift.time} />
//         </section>

//         <div className="mb-5 inline-flex gap-1 rounded-2xl bg-slate-200/70 p-1.5">
//           {[["a", "My attendance"], ["s", "My shift"], ["l", "My leave"]].map(([k, l]) => (
//             <button key={k} onClick={() => setTab(k)} className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${tab === k ? "bg-white text-[#1f4aa8] shadow" : "text-slate-500 hover:text-slate-800"}`}>
//               {l}
//             </button>
//           ))}
//         </div>

//         <div key={tab} className="mr-rise">
//           {tab === "a" && (
//             <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
//               <Calendar rec={rec} />
//               <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-6">
//                 <h3 className="mb-3 text-lg font-bold">Recent activity</h3>
//                 <table className="w-full min-w-[380px] text-sm">
//                   <thead>
//                     <tr className="border-b border-slate-200 text-left text-slate-500">
//                       {["Date", "In", "Out", "Status"].map((h) => <th key={h} className="py-2 font-semibold">{h}</th>)}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rows.map((r) => (
//                       <tr key={r[0]} className="border-b border-slate-100">
//                         <td className="py-3">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><Badge kind={r[4]}>{r[3]}</Badge></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {tab === "s" && (
//             <div className="rounded-3xl border border-slate-200 bg-white p-6">
//               <h3 className="mb-4 text-lg font-bold">This week's shifts</h3>
//               <div className="grid grid-cols-7 gap-2">
//                 {[...week].map((c, i) => (
//                   <div key={i} className="text-center">
//                     <p className="mb-1.5 text-xs text-slate-500">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</p>
//                     <div className={`rounded-2xl px-1 py-4 text-xs font-bold transition hover:scale-105 ${SHIFTS[c].chip}`}>{SHIFTS[c].short}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {tab === "l" && (
//             <div className="grid gap-5 lg:grid-cols-2">
//               <div className="rounded-3xl border border-slate-200 bg-white p-6">
//                 <h3 className="mb-2 text-lg font-bold">Apply for leave</h3>
//                 <label className="mb-1.5 mt-3 block text-sm font-semibold text-slate-500">Leave type</label>
//                 <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#1f4aa8]">
//                   <option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option>
//                 </select>
//                 <div className="mt-3 grid grid-cols-2 gap-3">
//                   {[["from", "From"], ["to", "To"]].map(([k, l]) => (
//                     <div key={k}>
//                       <label className="mb-1.5 block text-sm font-semibold text-slate-500">{l}</label>
//                       <input type="date" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#1f4aa8]" />
//                     </div>
//                   ))}
//                 </div>
//                 <label className="mb-1.5 mt-3 block text-sm font-semibold text-slate-500">Reason</label>
//                 <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#1f4aa8]" />
//                 <button onClick={applyLeave} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#1f4aa8] to-[#2f6fd6] py-3.5 font-bold text-white transition hover:-translate-y-0.5 active:scale-95">Submit leave request</button>
//               </div>
//               <div className="rounded-3xl border border-slate-200 bg-white p-6">
//                 <h3 className="mb-3 text-lg font-bold">My requests</h3>
//                 <table className="w-full text-sm">
//                   <thead><tr className="border-b border-slate-200 text-left text-slate-500"><th className="py-2 font-semibold">Type</th><th className="font-semibold">Dates</th><th className="font-semibold">Status</th></tr></thead>
//                   <tbody>
//                     {leaves.map((l, i) => (
//                       <tr key={i} className="border-b border-slate-100">
//                         <td className="py-3">{l.type}</td><td>{l.dates}</td>
//                         <td><Badge kind={l.status === "Approved" ? "P" : "L"}>{l.status}</Badge></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ---------------- ROOT ---------------- */
// export default function EmployeeAttendance() {
//   const [session, setSession] = useState(null); // { empId, rec }
//   const [prefill, setPrefill] = useState("");

//   return (
//     <>
//       <Styles />
//       {session ? (
//         <Portal
//           empId={session.empId}
//           rec={session.rec}
//           onLogout={() => { setSession(null); setPrefill(""); }}
//           onNext={() => { setPrefill(session.empId); setSession(null); }}
//         />
//       ) : (
//         <OtpLogin key={prefill} initialId={prefill} onVerified={(empId, rec) => setSession({ empId, rec })} />
//       )}
//     </>
//   );
// }


import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------
   Movement Rehab: Attendance portal | React + Tailwind CSS (v3)

   One OTP page, TWO sides:
     Employee : check in and out for the work day (shift, leave, history)
     Patient  : check in and out for a therapy session (clinic or home visit,
                package progress, missed sessions)

   BACKEND: replace the three functions in `api` with real fetch() calls.
   Each one now also receives the `role` ("employee" or "patient"):
     sendOtp(role, id)         -> POST /api/attendance/otp/send    { role, id }
     verifyOtp(role, id, code) -> POST /api/attendance/otp/verify  { role, id, code }
     punch(role, id)           -> returns { in, out, late, action } from your DB
   Generate and check the OTP ON THE SERVER (MSG91 / Twilio / Fast2SMS).
   Everything else on the dashboards (history, shifts, packages) is demo data.
------------------------------------------------------------------- */

/* ---------------- demo data ---------------- */
const EMPLOYEES = {
  MR001: { name: "Dr. Gupta", role: "Physiotherapist", phone: "••••• ••123", shift: "M" },
  MR002: { name: "Neha Sharma", role: "Receptionist", phone: "••••• ••456", shift: "E" },
  MR003: { name: "Rohan Patil", role: "Therapist", phone: "••••• ••789", shift: "M" },
};

const PATIENTS = {
  PT001: {
    name: "Amit Verma",
    phone: "••••• ••210",
    therapist: "Dr. Gupta",
    visit: "Clinic",
    slotHour: 18,
    plan: "Lower back recovery",
    total: 10,
    past: ["A", "A", "M", "A", "A", "A"], // most recent first: A attended, M missed
  },
  PT002: {
    name: "Sunita Rao",
    phone: "••••• ••342",
    therapist: "Rohan Patil",
    visit: "Home",
    slotHour: 10,
    plan: "Post-surgery knee rehab",
    total: 12,
    past: ["A", "A"],
  },
  PT003: {
    name: "Karan Mehta",
    phone: "••••• ••558",
    therapist: "Dr. Gupta",
    visit: "Clinic",
    slotHour: 16,
    plan: "Shoulder mobility",
    total: 8,
    past: ["M", "A", "A", "A", "M", "A", "A"],
  },
};

const SHIFTS = {
  M: { label: "Morning", time: "8:00 AM – 4:00 PM", startHour: 8, short: "8–4", chip: "bg-emerald-100 text-emerald-700" },
  E: { label: "Evening", time: "2:00 PM – 10:00 PM", startHour: 14, short: "2–10", chip: "bg-indigo-100 text-indigo-700" },
  F: { label: "Off", time: "Weekly off", short: "Off", chip: "bg-slate-100 text-slate-500" },
};

const ROLES = {
  employee: {
    label: "Employee",
    placeholder: "e.g. MR001",
    demo: "MR001, MR002, MR003",
    title: "Employee check-in",
    sub: "Enter your Employee ID to receive an OTP.",
    headline: "Mark your attendance in seconds.",
    blurb: "Verify with your Employee ID and a one-time password sent to your registered mobile number.",
    steps: ["Enter your Employee ID", "Receive a 6-digit OTP by SMS", "Verify and your attendance is marked"],
    verifyCta: "Verify & mark attendance",
  },
  patient: {
    label: "Patient",
    placeholder: "e.g. PT001",
    demo: "PT001, PT002, PT003",
    title: "Session check-in",
    sub: "Enter your Patient ID to receive an OTP.",
    headline: "Check in for your session.",
    blurb: "Verify with your Patient ID and a one-time password sent to the mobile number you registered with us.",
    steps: ["Enter your Patient ID", "Receive a 6-digit OTP by SMS", "Verify and your session is marked"],
    verifyCta: "Verify & start session",
  },
};

const GRACE_MIN = 15;
const OTP_LIFETIME = 120; // seconds
const RESEND_AFTER = 30; // seconds
const MAX_TRIES = 3;
const SESSION_MINUTES = 60;

/* ---------------- helpers ---------------- */
const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtTime = (d) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const hm = (h, m) => `${((h + 11) % 12) + 1}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
const shortDate = (d) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const people = (role) => (role === "employee" ? EMPLOYEES : PATIENTS);

/* ---------------- DEMO API (replace with real calls) ---------------- */
const db = { otp: {}, records: {} };
const api = {
  async sendOtp(role, id) {
    const person = people(role)[id];
    if (!person) throw new Error(`${ROLES[role].label} ID not found. Check the ID and try again.`);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    db.otp[`${role}:${id}`] = { code, exp: Date.now() + OTP_LIFETIME * 1000, tries: 0 };
    return { phone: person.phone, demoCode: code }; // remove demoCode in production
  },
  async verifyOtp(role, id, code) {
    const o = db.otp[`${role}:${id}`];
    if (!o || Date.now() > o.exp) throw new Error("OTP expired. Send a new OTP.");
    if (o.tries >= MAX_TRIES) throw new Error("Too many attempts. Send a new OTP.");
    if (o.code !== code) {
      o.tries += 1;
      throw new Error(`Incorrect OTP. ${MAX_TRIES - o.tries} attempt(s) left.`);
    }
    delete db.otp[`${role}:${id}`];
    return true;
  },
  async punch(role, id) {
    const now = new Date();
    const r = (db.records[`${role}:${id}:${keyOf(now)}`] ||= {}); // one record per person per day
    const startHour = role === "employee" ? SHIFTS[EMPLOYEES[id].shift].startHour : PATIENTS[id].slotHour;
    let action = "done";
    if (!r.in) {
      r.in = now;
      r.late = now.getHours() * 60 + now.getMinutes() > startHour * 60 + GRACE_MIN;
      action = "in";
    } else if (!r.out) {
      r.out = now;
      action = "out";
    }
    return { ...r, action };
  },
};

/* ---------------- shared bits ---------------- */
const Logo = ({ className = "" }) => (
  <div className={`inline-block rounded-2xl bg-white px-5 py-3 text-xl font-extrabold text-[#1f4aa8] ${className}`}>
    Movement <span className="text-[#4fc3c9]">Rehab</span>
  </div>
);

const Styles = () => (
  <style>{`
    @keyframes mrShake{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
    @keyframes mrFloat{50%{transform:translate(40px,30px) scale(1.15)}}
    @keyframes mrRise{from{opacity:0;transform:translateY(16px)}}
    .mr-shake{animation:mrShake .4s}.mr-float{animation:mrFloat 10s ease-in-out infinite}.mr-rise{animation:mrRise .5s}
    @media(prefers-reduced-motion:reduce){.mr-shake,.mr-float,.mr-rise{animation:none}}
  `}</style>
);

const Icon = ({ d, className = "h-5 w-5" }) => (
  <svg className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
);
const ICONS = {
  briefcase: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M2 13h20",
  heart: "M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z",
  home: "M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z",
  clinic: "M3 21h18M5 21V7l7-4 7 4v14M10 21v-5h4v5M12 8v4M10 10h4",
};

const StatCard = ({ label, value, sub }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10">
    <p className="font-semibold text-slate-500">{label}</p>
    <p className="my-2 text-4xl font-extrabold text-slate-900">{value}</p>
    <p className="text-sm text-slate-500">{sub}</p>
  </div>
);

const KINDS = {
  P: "bg-emerald-100 text-emerald-700",
  L: "bg-amber-100 text-amber-700",
  V: "bg-indigo-100 text-indigo-700",
  M: "bg-rose-100 text-rose-700",
  U: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
};

const Badge = ({ kind, children }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-bold ${KINDS[kind]}`}>{children}</span>
);

const Tabs = ({ tabs, value, onChange }) => (
  <div className="mb-5 inline-flex gap-1 rounded-2xl bg-slate-200/70 p-1.5" role="tablist">
    {tabs.map(([k, l]) => (
      <button
        key={k}
        role="tab"
        aria-selected={value === k}
        onClick={() => onChange(k)}
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4aa8] ${
          value === k ? "bg-white text-[#1f4aa8] shadow" : "text-slate-500 hover:text-slate-800"
        }`}
      >
        {l}
      </button>
    ))}
  </div>
);

/* Month calendar for the current month. marks: { "YYYY-MM-DD": "P" | "L" | "V" | "M" | "U" } */
function Calendar({ marks, legend }) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const todayKey = keyOf(now);
  const offset = (new Date(y, m, 1).getDay() + 6) % 7; // Monday first
  const days = new Date(y, m + 1, 0).getDate();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-bold">
        {now.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
      </h3>
      <div className="mt-4 grid grid-cols-7 gap-2 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="text-xs font-bold text-slate-400">{d}</span>
        ))}
        {Array.from({ length: offset }).map((_, i) => <div key={`b${i}`} />)}
        {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
          const key = `${y}-${pad(m + 1)}-${pad(d)}`;
          const kind = marks[key];
          const isToday = key === todayKey;
          return (
            <div
              key={d}
              className={`grid aspect-square place-items-center rounded-xl text-sm font-semibold transition hover:scale-110 ${
                kind ? KINDS[kind] : key > todayKey ? "bg-white text-slate-300" : "bg-slate-100 text-slate-400"
              } ${isToday ? "ring-2 ring-[#1f4aa8]" : ""}`}
              aria-label={`${d} ${now.toLocaleDateString("en-IN", { month: "long" })}${kind ? `, ${legend[kind]}` : ""}${isToday ? ", today" : ""}`}
            >
              {d}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
        {Object.entries(legend).map(([k, l]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded ${KINDS[k]}`} /> {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function PortalHeader({ name, sub, role, onLogout }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-slate-200 px-4 py-2 text-lg font-extrabold text-[#1f4aa8]">
          Movement <span className="text-[#4fc3c9]">Rehab</span>
        </div>
        <span className="hidden rounded-full bg-[#1f4aa8]/10 px-3 py-1 text-xs font-bold text-[#1f4aa8] sm:inline-block">
          {ROLES[role].label} portal
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#4fc3c9] to-[#1f4aa8] font-bold text-white">{name[0]}</div>
        <div className="hidden sm:block">
          <p className="font-bold leading-tight">{name}</p>
          <p className="text-xs text-slate-500">{sub}</p>
        </div>
        <button onClick={onLogout} className="rounded-xl border border-slate-200 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4aa8]">
          Logout
        </button>
      </div>
    </header>
  );
}

function Hero({ dateChip, title, message, button, onNext, done, tiles }) {
  return (
    <section className="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#1b3a78] to-[#2457b5] p-8 text-white shadow-xl shadow-blue-900/30">
      <div className="mr-float absolute -right-16 -top-28 h-72 w-72 rounded-full bg-[#4fc3c9]/30 blur-3xl" />
      <div className="relative">
        <p className="font-semibold">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          <span className="ml-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">{dateChip}</span>
        </p>
        <h2 className="mb-1 mt-2 text-3xl font-extrabold tracking-tight">{title}</h2>
        <p className="text-white/85">{message}</p>
        <button
          onClick={onNext}
          disabled={done}
          className="mt-5 rounded-2xl bg-white px-6 py-3 font-bold text-[#1f4aa8] transition hover:-translate-y-0.5 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2457b5] disabled:pointer-events-none disabled:opacity-50"
        >
          {button}
        </button>
      </div>
      <div className="relative flex gap-3">
        {tiles.map(([k, v]) => (
          <div key={k} className="min-w-[96px] rounded-2xl border border-white/20 bg-white/15 px-5 py-4">
            <p className="text-2xl font-bold">{v}</p>
            <p className="text-sm text-white/80">{k}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const field =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#1f4aa8] focus:ring-4 focus:ring-blue-100";

/* ---------------- OTP LOGIN (both roles) ---------------- */
function OtpLogin({ role, onRoleChange, onVerified, initialId = "" }) {
  const cfg = ROLES[role];
  const [step, setStep] = useState("id");
  const [id, setId] = useState(initialId);
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const [expiresAt, setExpiresAt] = useState(0);
  const [resendAt, setResendAt] = useState(0);
  const [tick, setTick] = useState(Date.now());
  const [sms, setSms] = useState(null);
  const boxes = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (initialId) sendOtp(initialId);
    // eslint-disable-next-line
  }, []);

  const left = Math.max(0, Math.ceil((expiresAt - tick) / 1000));
  const canResend = tick >= resendAt;

  async function sendOtp(idArg) {
    const value = (idArg || id).trim().toUpperCase();
    setError("");
    setBusy(true);
    try {
      const res = await api.sendOtp(role, value);
      setId(value);
      setPhone(res.phone);
      setDigits(Array(6).fill(""));
      setExpiresAt(Date.now() + OTP_LIFETIME * 1000);
      setResendAt(Date.now() + RESEND_AFTER * 1000);
      setStep("otp");
      setTimeout(() => boxes.current[0]?.focus(), 50);
      setTimeout(() => setSms(res.demoCode), 700); // demo SMS pop-up
      setTimeout(() => setSms(null), 9000);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function verify(code) {
    if (code.length < 6) return setError("Enter the 6-digit OTP.");
    setBusy(true);
    try {
      await api.verifyOtp(role, id, code);
      const rec = await api.punch(role, id);
      onVerified(role, id, rec);
    } catch (e) {
      setError(e.message);
      setShake(true);
      setTimeout(() => setShake(false), 450);
      setDigits(Array(6).fill(""));
      boxes.current[0]?.focus();
    } finally {
      setBusy(false);
    }
  }

  function setDigit(i, v) {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = d;
    setDigits(next);
    if (d && i < 5) boxes.current[i + 1]?.focus();
    if (next.every(Boolean)) verify(next.join(""));
  }
  function paste(e) {
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!t) return;
    e.preventDefault();
    const next = Array(6).fill("").map((_, i) => t[i] || "");
    setDigits(next);
    if (t.length === 6) verify(t);
    else boxes.current[t.length]?.focus();
  }

  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.1fr_1fr]">
      {/* demo SMS */}
      <div
        role="status"
        className={`fixed right-4 top-4 z-50 max-w-xs rounded-2xl bg-[#0b1f4f] px-5 py-4 text-white shadow-2xl transition-transform duration-500 ${
          sms ? "translate-x-0" : "translate-x-[130%]"
        }`}
      >
        <p className="mb-1 text-xs text-white/60">Demo SMS from Movement Rehab</p>
        <p>
          Your {role === "employee" ? "attendance" : "session"} OTP is{" "}
          <b className="ml-1 text-2xl tracking-[0.3em] text-cyan-300">{sms}</b>
        </p>
      </div>

      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1b3f7a] to-[#0b1f4f] p-8 text-white lg:p-12">
        <div className="mr-float absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#4fc3c9]/40 blur-3xl" />
        <div className="mr-float absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#2457b5] blur-3xl" />
        <Logo className="relative w-fit" />
        <div className="relative my-10">
          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight lg:text-5xl">{cfg.headline}</h1>
          <p className="max-w-sm text-white/80">{cfg.blurb}</p>
          <ol className="mt-7 hidden space-y-3 text-sm text-white/90 lg:block">
            {cfg.steps.map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 font-bold">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
        <p className="relative text-xs text-white/60">Elevate your health &amp; performance</p>
      </div>

      <div className="grid place-items-center p-6">
        <div className="mr-rise w-full max-w-sm">
          {/* Employee / Patient switch */}
          <div className="mb-7 grid grid-cols-2 gap-1 rounded-2xl bg-slate-200/70 p-1.5" role="tablist" aria-label="Who is checking in">
            {[
              ["employee", "Employee", ICONS.briefcase],
              ["patient", "Patient", ICONS.heart],
            ].map(([k, l, ic]) => (
              <button
                key={k}
                role="tab"
                aria-selected={role === k}
                onClick={() => role !== k && onRoleChange(k)}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4aa8] ${
                  role === k ? "bg-white text-[#1f4aa8] shadow" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon d={ic} className="h-4 w-4" /> {l}
              </button>
            ))}
          </div>

          {step === "id" ? (
            <>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{cfg.title}</h2>
              <p className="mb-6 mt-1 text-slate-500">{cfg.sub}</p>
              <label className="mb-2 block text-sm font-semibold text-slate-500" htmlFor="eid">{cfg.label} ID</label>
              <input
                id="eid"
                value={id}
                onChange={(e) => setId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                maxLength={8}
                placeholder={cfg.placeholder}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-bold tracking-widest outline-none transition focus:border-[#1f4aa8] focus:ring-4 focus:ring-blue-100"
              />
              <p role="alert" className="mt-2 min-h-[20px] text-sm text-red-600">{error}</p>
              <button
                onClick={() => sendOtp()}
                disabled={busy || !id}
                className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[#1f4aa8] to-[#2f6fd6] py-3.5 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send OTP"}
              </button>
              <p className="mt-6 rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-500">
                <b>Demo IDs:</b> {cfg.demo}. The OTP appears as a pop-up at the top right.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Verify OTP</h2>
              <p className="mb-6 mt-1 text-slate-500">OTP sent to +91 {phone}</p>
              <div className={`flex justify-between gap-2 ${shake ? "mr-shake" : ""}`} onPaste={paste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (boxes.current[i] = el)}
                    value={d}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    aria-label={`Digit ${i + 1}`}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => e.key === "Backspace" && !d && boxes.current[i - 1]?.focus()}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white text-center text-2xl font-bold outline-none transition focus:border-[#1f4aa8] focus:ring-4 focus:ring-blue-100"
                  />
                ))}
              </div>
              <p role="alert" className="mt-2 min-h-[20px] text-sm text-red-600">{error}</p>
              <button
                onClick={() => verify(digits.join(""))}
                disabled={busy}
                className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[#1f4aa8] to-[#2f6fd6] py-3.5 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
              >
                {busy ? "Verifying…" : cfg.verifyCta}
              </button>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>
                  Expires in {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
                </span>
                <button
                  onClick={() => sendOtp()}
                  disabled={!canResend}
                  className="font-bold text-[#1f4aa8] disabled:text-slate-400"
                >
                  {canResend ? "Resend OTP" : `Resend in ${Math.ceil((resendAt - tick) / 1000)}s`}
                </button>
              </div>
              <button
                onClick={() => { setStep("id"); setError(""); }}
                className="mt-4 w-full rounded-2xl bg-slate-100 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                ← Change {cfg.label} ID
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- EMPLOYEE PORTAL ---------------- */

// Demo history for a working day (replace with your attendance records)
const demoDay = (date, startHour) => {
  const dow = date.getDay();
  const d = date.getDate();
  if (dow === 0 || dow === 6) return null; // weekly off
  if (d % 11 === 0) return { kind: "V", label: "Leave", in: "—", out: "—" };
  if (d % 7 === 3) return { kind: "L", label: "Late", in: hm(startHour, 20 + (d % 9)), out: hm(startHour + 8, d % 5) };
  return { kind: "P", label: "Present", in: hm(startHour, d % 6), out: hm(startHour + 8, d % 4) };
};

function EmployeePortal({ empId, rec, onLogout, onNext }) {
  const emp = EMPLOYEES[empId];
  const shift = SHIFTS[emp.shift];
  const [tab, setTab] = useState("a");
  const [leaves, setLeaves] = useState([{ type: "Earned Leave", dates: "Approved earlier", status: "Approved" }]);
  const [form, setForm] = useState({ type: "Casual Leave", from: "", to: "", reason: "" });
  const [leaveError, setLeaveError] = useState("");

  const now = new Date();
  const minutes = Math.floor(((rec.out || new Date()) - rec.in) / 60000);

  // Calendar marks and numbers for this month (past days are demo data)
  const marks = {};
  let present = 0;
  let late = 0;
  let leave = 0;
  for (let d = 1; d < now.getDate(); d++) {
    const day = new Date(now.getFullYear(), now.getMonth(), d);
    const rec2 = demoDay(day, shift.startHour);
    if (!rec2) continue;
    marks[keyOf(day)] = rec2.kind;
    if (rec2.kind === "V") leave++;
    else present++;
    if (rec2.kind === "L") late++;
  }
  marks[keyOf(now)] = rec.late ? "L" : "P";
  present++;
  if (rec.late) late++;

  const rows = [
    ["Today", fmtTime(rec.in), rec.out ? fmtTime(rec.out) : "—", rec.late ? "Late" : "Present", rec.late ? "L" : "P"],
  ];
  for (let back = 1; rows.length < 5 && back < 14; back++) {
    const day = addDays(now, -back);
    const r = demoDay(day, shift.startHour);
    if (r) rows.push([shortDate(day), r.in, r.out, r.label, r.kind]);
  }

  const msg =
    rec.action === "in"
      ? `Attendance marked at ${fmtTime(rec.in)}${rec.late ? ", marked late." : ", on time."}`
      : rec.action === "out"
      ? `Check-out marked at ${fmtTime(rec.out)}. Have a great evening.`
      : "Check-in and check-out are already recorded for today.";
  const chip = rec.action === "in" ? "Checked in" : rec.action === "out" ? "Checked out" : "Completed";
  const week = emp.shift === "M" ? "MMMMMFF" : "EEEEMFF";

  function applyLeave() {
    if (!form.from || !form.to || form.to < form.from) return setLeaveError("Choose valid dates.");
    setLeaveError("");
    const f = (v) => new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    setLeaves([{ type: form.type, dates: form.from === form.to ? f(form.from) : `${f(form.from)} – ${f(form.to)}`, status: "Pending" }, ...leaves]);
    setForm({ ...form, reason: "" });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PortalHeader name={emp.name} sub={`${empId} · ${emp.role}`} role="employee" onLogout={onLogout} />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 lg:px-8">
        <Hero
          dateChip={`${chip} ✓`}
          title={`Hello, ${emp.name}`}
          message={msg}
          button={rec.out ? "Done for today" : "Mark check-out with OTP"}
          onNext={onNext}
          done={!!rec.out}
          tiles={[
            ["Check-in", fmtTime(rec.in)],
            ["Check-out", rec.out ? fmtTime(rec.out) : "--"],
            ["Worked", `${Math.floor(minutes / 60)}h ${minutes % 60}m`],
          ]}
        />

        <section className="my-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Present days" value={present} sub="This month" />
          <StatCard label="Late arrivals" value={late} sub={`After ${GRACE_MIN} min grace`} />
          <StatCard label="Leaves taken" value={leave} sub="This month" />
          <StatCard label="My shift" value={<span className="text-2xl">{shift.label}</span>} sub={shift.time} />
        </section>

        <Tabs tabs={[["a", "My attendance"], ["s", "My shift"], ["l", "My leave"]]} value={tab} onChange={setTab} />

        <div key={tab} className="mr-rise">
          {tab === "a" && (
            <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
              <Calendar marks={marks} legend={{ P: "Present", L: "Late", V: "Leave" }} />
              <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="mb-3 text-lg font-bold">Recent activity</h3>
                <table className="w-full min-w-[380px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      {["Date", "In", "Out", "Status"].map((h) => <th key={h} className="py-2 font-semibold">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r[0]} className="border-b border-slate-100">
                        <td className="py-3">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><Badge kind={r[4]}>{r[3]}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "s" && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-bold">This week's shifts</h3>
              <div className="grid grid-cols-7 gap-2">
                {[...week].map((c, i) => (
                  <div key={i} className="text-center">
                    <p className="mb-1.5 text-xs text-slate-500">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</p>
                    <div className={`rounded-2xl px-1 py-4 text-xs font-bold transition hover:scale-105 ${SHIFTS[c].chip}`}>{SHIFTS[c].short}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "l" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="mb-2 text-lg font-bold">Apply for leave</h3>
                <label htmlFor="lv-type" className="mb-1.5 mt-3 block text-sm font-semibold text-slate-500">Leave type</label>
                <select id="lv-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={field}>
                  <option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option>
                </select>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[["from", "From"], ["to", "To"]].map(([k, l]) => (
                    <div key={k}>
                      <label htmlFor={`lv-${k}`} className="mb-1.5 block text-sm font-semibold text-slate-500">{l}</label>
                      <input id={`lv-${k}`} type="date" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={field} />
                    </div>
                  ))}
                </div>
                <label htmlFor="lv-reason" className="mb-1.5 mt-3 block text-sm font-semibold text-slate-500">Reason</label>
                <textarea id="lv-reason" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className={field} />
                {leaveError && <p role="alert" className="mt-2 text-sm text-red-600">{leaveError}</p>}
                <button onClick={applyLeave} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#1f4aa8] to-[#2f6fd6] py-3.5 font-bold text-white transition hover:-translate-y-0.5 active:scale-95">Submit leave request</button>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="mb-3 text-lg font-bold">My requests</h3>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-200 text-left text-slate-500"><th className="py-2 font-semibold">Type</th><th className="font-semibold">Dates</th><th className="font-semibold">Status</th></tr></thead>
                  <tbody>
                    {leaves.map((l, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="py-3">{l.type}</td><td>{l.dates}</td>
                        <td><Badge kind={l.status === "Approved" ? "P" : "L"}>{l.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------------- PATIENT PORTAL ---------------- */
const VisitChip = ({ visit }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
      visit === "Home" ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700"
    }`}
  >
    <Icon d={visit === "Home" ? ICONS.home : ICONS.clinic} className="h-3.5 w-3.5" />
    {visit === "Home" ? "Home visit" : "Clinic session"}
  </span>
);

function PatientPortal({ patientId, rec, onLogout, onNext }) {
  const pt = PATIENTS[patientId];
  const [tab, setTab] = useState("s");
  const now = new Date();
  const slot = hm(pt.slotHour, 0);

  // Past sessions every second day, most recent first (demo data)
  const past = pt.past.map((s, i) => ({ date: addDays(now, -2 * (i + 1)), status: s }));
  const upcoming = [2, 4, 6].map((n) => addDays(now, n));

  const attendedPast = past.filter((p) => p.status === "A").length;
  const missed = past.filter((p) => p.status === "M").length;
  const attended = attendedPast + 1; // today's session
  const remaining = Math.max(0, pt.total - attended);
  const rate = Math.round((attended / (attended + missed)) * 100);
  const progress = Math.min(100, Math.round((attended / pt.total) * 100));

  const marks = {};
  past.forEach((p) => (marks[keyOf(p.date)] = p.status === "A" ? "P" : "M"));
  upcoming.forEach((d) => (marks[keyOf(d)] = "U"));
  marks[keyOf(now)] = rec.late ? "L" : "P";

  const minutes = Math.floor(((rec.out || new Date()) - rec.in) / 60000);
  const msg =
    rec.action === "in"
      ? `Session started at ${fmtTime(rec.in)}${rec.late ? ", you arrived a little late." : ", right on time."}`
      : rec.action === "out"
      ? `Session completed at ${fmtTime(rec.out)}. Well done, take care.`
      : "Your session for today is already recorded.";
  const chip = rec.action === "in" ? "Session started" : rec.action === "out" ? "Session completed" : "Completed";

  const rows = [
    ["Today", fmtTime(rec.in), rec.out ? fmtTime(rec.out) : "—", rec.late ? "Late arrival" : "Attended", rec.late ? "L" : "P"],
    ...past.slice(0, 4).map((p) => [
      shortDate(p.date),
      p.status === "A" ? hm(pt.slotHour, 2) : "—",
      p.status === "A" ? hm(pt.slotHour + 1, 1) : "—",
      p.status === "A" ? "Attended" : "Missed",
      p.status === "A" ? "P" : "M",
    ]),
  ];

  const info = [
    ["Therapist", pt.therapist],
    ["Visit type", <VisitChip key="v" visit={pt.visit} />],
    ["Usual time", slot],
    ["Treatment plan", pt.plan],
    ["Next session", upcoming[0].toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })],
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PortalHeader name={pt.name} sub={`${patientId} · ${pt.visit === "Home" ? "Home visit" : "Clinic"}`} role="patient" onLogout={onLogout} />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 lg:px-8">
        <Hero
          dateChip={`${chip} ✓`}
          title={`Hello, ${pt.name.split(" ")[0]}`}
          message={msg}
          button={rec.out ? "Session done for today" : "Mark session end with OTP"}
          onNext={onNext}
          done={!!rec.out}
          tiles={[
            ["Started", fmtTime(rec.in)],
            ["Ended", rec.out ? fmtTime(rec.out) : "--"],
            ["Session", `${minutes} min`],
          ]}
        />

        <section className="my-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Sessions attended" value={attended} sub={`of ${pt.total} in your plan`} />
          <StatCard label="Sessions left" value={remaining} sub={remaining === 0 ? "Plan complete" : "To finish your plan"} />
          <StatCard label="Missed sessions" value={missed} sub="Try not to skip" />
          <StatCard label="Attendance" value={`${rate}%`} sub="Attended vs missed" />
        </section>

        {/* plan progress */}
        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">{pt.plan}</h3>
              <p className="text-sm text-slate-500">
                {attended} of {pt.total} sessions completed with {pt.therapist}
              </p>
            </div>
            <VisitChip visit={pt.visit} />
          </div>
          <div
            className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Treatment plan progress"
          >
            <div className="h-full rounded-full bg-gradient-to-r from-[#1f4aa8] to-[#4fc3c9] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <Tabs tabs={[["s", "My sessions"], ["c", "Care plan"]]} value={tab} onChange={setTab} />

        <div key={tab} className="mr-rise">
          {tab === "s" && (
            <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
              <Calendar marks={marks} legend={{ P: "Attended", L: "Late arrival", M: "Missed", U: "Upcoming" }} />
              <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="mb-3 text-lg font-bold">Recent sessions</h3>
                <table className="w-full min-w-[380px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      {["Date", "Start", "End", "Status"].map((h) => <th key={h} className="py-2 font-semibold">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r[0]} className="border-b border-slate-100">
                        <td className="py-3">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><Badge kind={r[4]}>{r[3]}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "c" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-bold">Your care plan</h3>
                <dl className="divide-y divide-slate-100">
                  {info.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <dt className="text-slate-500">{k}</dt>
                      <dd className="text-right font-semibold text-slate-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-bold">Upcoming sessions</h3>
                <ul className="space-y-3">
                  {upcoming.map((d) => (
                    <li key={keyOf(d)} className="flex items-center justify-between rounded-2xl bg-sky-50 px-4 py-3 text-sm ring-1 ring-sky-100">
                      <span className="font-semibold text-slate-800">
                        {d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
                      </span>
                      <span className="text-slate-500">{slot}, {pt.visit === "Home" ? "home visit" : "clinic"}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-slate-400">
                  Need to change a session? Please call the clinic before your usual time.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------------- ROOT ---------------- */
export default function AttendancePortal() {
  const [role, setRole] = useState("employee");
  const [session, setSession] = useState(null); // { role, id, rec }
  const [prefill, setPrefill] = useState("");

  const logout = () => {
    setSession(null);
    setPrefill("");
  };
  // Second OTP of the day = check-out (employee) or session end (patient)
  const next = () => {
    setRole(session.role);
    setPrefill(session.id);
    setSession(null);
  };

  return (
    <>
      <Styles />
      {session ? (
        session.role === "employee" ? (
          <EmployeePortal empId={session.id} rec={session.rec} onLogout={logout} onNext={next} />
        ) : (
          <PatientPortal patientId={session.id} rec={session.rec} onLogout={logout} onNext={next} />
        )
      ) : (
        <OtpLogin
          key={`${role}-${prefill}`}
          role={role}
          onRoleChange={(r) => {
            setRole(r);
            setPrefill("");
          }}
          initialId={prefill}
          onVerified={(r, id, rec) => setSession({ role: r, id, rec })}
        />
      )}
    </>
  );
}
