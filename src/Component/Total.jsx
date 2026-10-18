// import { useEffect, useState } from "react";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import TotalReportPdf from "../Component/pdf/TotalReportPdf.jsx";
// import { exportToExcel } from "../utils/exportToExcel";
// import { fetchSummary, MONTHS, YEARS, formatINR } from "../utils/reportFetch";

// const Total = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");

//   useEffect(() => {
//     let active = true;
//     const load = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const summary = await fetchSummary({
//           month: selectedMonth,
//           year: selectedYear,
//         });
//         if (active) setData(summary);
//       } catch (err) {
//         console.error("Failed to load financial report:", err);
//         if (active) {
//           setError("Failed to load report data. Please try again.");
//           setData(null);
//         }
//       } finally {
//         if (active) setLoading(false);
//       }
//     };
//     load();
//     return () => {
//       active = false;
//     };
//   }, [selectedMonth, selectedYear]);

//   const periodLabel = () => {
//     const m = selectedMonth
//       ? MONTHS.find((x) => String(x.value) === String(selectedMonth))?.label
//       : "";
//     if (m && selectedYear) return `${m} ${selectedYear}`;
//     if (selectedYear) return `Year ${selectedYear}`;
//     if (m) return `${m} (all years)`;
//     return "All time";
//   };

//   const downloadTotalExcel = () => {
//     if (!data) return alert("No report data available");
//     const rows = [
//       { Section: "Income", Label: "Total Billed", Value: data.income.billed },
//       { Section: "Income", Label: "Received", Value: data.income.received },
//       { Section: "Income", Label: "Pending", Value: data.income.pending },
//       { Section: "Income", Label: "Wallet", Value: data.income.wallet },
//       { Section: "Outgoing", Label: "Expenses", Value: data.outgoing.expenses },
//       {
//         Section: "Outgoing",
//         Label: "Inventory",
//         Value: data.outgoing.inventory,
//       },
//       { Section: "Outgoing", Label: "Rent", Value: data.outgoing.rent },
//       { Section: "Outgoing", Label: "Salary", Value: data.outgoing.salary },
//       {
//         Section: "Summary",
//         Label: "Total Outgoing",
//         Value: data.totalOutgoing,
//       },
//       { Section: "Summary", Label: "Net Balance", Value: data.netBalance },
//     ];

//     exportToExcel({
//       data: rows,
//       fileName: `Financial_Report_${selectedMonth || "All_Month"}_${selectedYear || "All_Year"}`,
//       sheetName: "Financial Summary",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       {/* ===== TOOLBAR ===== */}
//       <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div>
//             <h1 className="text-xl font-bold text-gray-800">
//               Financial Summary
//             </h1>
//             <p className="text-sm text-gray-500">
//               Showing:{" "}
//               <span className="font-semibold text-gray-700">
//                 {periodLabel()}
//               </span>
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             <select
//               className="border border-gray-300 p-2 rounded-lg text-sm"
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(e.target.value)}
//             >
//               <option value="">All Months</option>
//               {MONTHS.map((m) => (
//                 <option key={m.value} value={m.value}>
//                   {m.label}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="border border-gray-300 p-2 rounded-lg text-sm"
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//             >
//               <option value="">All Years</option>
//               {YEARS.map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>

//             {(selectedMonth || selectedYear) && (
//               <button
//                 onClick={() => {
//                   setSelectedMonth("");
//                   setSelectedYear("");
//                 }}
//                 className="text-sm text-blue-600 hover:underline"
//               >
//                 Clear
//               </button>
//             )}

//             <span className="h-6 w-px bg-gray-200 hidden sm:block" />

//             <button
//               onClick={downloadTotalExcel}
//               disabled={!data}
//               className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
//             >
//               ⬇ Excel
//             </button>

//             {data && (
//               <PDFDownloadLink
//                 document={
//                   <TotalReportPdf
//                     data={data}
//                     selectedMonth={selectedMonth}
//                     selectedYear={selectedYear}
//                   />
//                 }
//                 fileName={`Financial_Report_${selectedMonth || "All Month"}_${selectedYear || "All Year"}.pdf`}
//               >
//                 {({ loading: pdfLoading }) => (
//                   <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm">
//                     {pdfLoading ? "Preparing…" : "⬇ PDF"}
//                   </button>
//                 )}
//               </PDFDownloadLink>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ===== STATES ===== */}
//       {loading && (
//         <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
//           Loading report…
//         </div>
//       )}
//       {!loading && error && (
//         <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-6 font-medium">
//           {error}
//         </div>
//       )}
//       {!loading && !error && !data && (
//         <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
//           No report data available.
//         </div>
//       )}

//       {/* ===== REPORT ===== */}
//       {!loading && !error && data && (
//         <div id="report" className="space-y-6">
//           {/* ===== HERO: BOTTOM LINE ===== */}
//           <div
//             className={`rounded-2xl p-6 sm:p-8 text-white shadow-md ${
//               data.netBalance >= 0
//                 ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
//                 : "bg-gradient-to-r from-rose-500 to-rose-600"
//             }`}
//           >
//             <p className="text-sm uppercase tracking-wide opacity-90">
//               {data.netBalance >= 0 ? "Profit" : "Loss"} · {periodLabel()}
//             </p>
//             <p className="text-4xl sm:text-5xl font-extrabold mt-1">
//               ₹{formatINR(Math.abs(data.netBalance))}
//             </p>
//             <p className="mt-3 text-sm sm:text-base opacity-95">
//               Money Received{" "}
//               <b>₹{formatINR(data.income.received)}</b> − Money Spent{" "}
//               <b>₹{formatINR(data.totalOutgoing)}</b> ={" "}
//               <b>
//                 ₹{formatINR(data.netBalance)}
//                 {data.netBalance >= 0 ? " profit" : " loss"}
//               </b>
//             </p>
//           </div>

//           {/* ===== 3 BIG NUMBERS ===== */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <BigTile
//               emoji="📥"
//               label="Money Received"
//               value={data.income.received}
//               tone="emerald"
//               hint="Cash actually collected"
//             />
//             <BigTile
//               emoji="📤"
//               label="Money Spent"
//               value={data.totalOutgoing}
//               tone="rose"
//               hint="Salary + Rent + Inventory + Expenses"
//             />
//             <BigTile
//               emoji={data.netBalance >= 0 ? "📈" : "📉"}
//               label="Net Balance"
//               value={data.netBalance}
//               tone={data.netBalance >= 0 ? "emerald" : "rose"}
//               hint="Received − Spent"
//               signed
//             />
//           </div>

//           {/* ===== TWO BREAKDOWNS SIDE BY SIDE ===== */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* MONEY IN */}
//             <div className="bg-white rounded-xl shadow-sm p-5">
//               <h2 className="font-bold text-gray-800 mb-1">💰 Money In</h2>
//               <p className="text-xs text-gray-500 mb-4">
//                 What you billed and how much has come in
//               </p>

//               {/* Billed split bar: received vs pending */}
//               <div className="mb-4">
//                 <div className="flex justify-between text-sm mb-1">
//                   <span className="text-gray-600">
//                     Total Billed (work done)
//                   </span>
//                   <span className="font-semibold">
//                     ₹{formatINR(data.income.billed)}
//                   </span>
//                 </div>
//                 <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-100">
//                   <div
//                     className="bg-emerald-500"
//                     style={{
//                       width: `${pct(data.income.received, data.income.billed)}%`,
//                     }}
//                     title="Received"
//                   />
//                   <div
//                     className="bg-amber-400"
//                     style={{
//                       width: `${pct(data.income.pending, data.income.billed)}%`,
//                     }}
//                     title="Pending"
//                   />
//                 </div>
//               </div>

//               <Row
//                 label="Received"
//                 sub="Paid bills + advances on unpaid"
//                 value={data.income.received}
//                 dot="bg-emerald-500"
//               />
//               <Row
//                 label="Pending"
//                 sub="Billed but not yet collected"
//                 value={data.income.pending}
//                 dot="bg-amber-400"
//               />
//               <Row
//                 label="Wallet credit held"
//                 sub="Advance balance kept for patients"
//                 value={data.income.wallet}
//                 dot="bg-blue-400"
//               />

//               <Equation
//                 text={`Received ₹${formatINR(data.income.received)} + Pending ₹${formatINR(
//                   data.income.pending,
//                 )} = Billed ₹${formatINR(data.income.billed)}`}
//               />
//             </div>

//             {/* MONEY OUT */}
//             <div className="bg-white rounded-xl shadow-sm p-5">
//               <h2 className="font-bold text-gray-800 mb-1">🧾 Money Out</h2>
//               <p className="text-xs text-gray-500 mb-4">
//                 Everything the clinic spent in this period
//               </p>

//               <ExpenseRow
//                 emoji="👥"
//                 label="Staff Salary"
//                 value={data.outgoing.salary}
//                 total={data.totalOutgoing}
//               />
//               <ExpenseRow
//                 emoji="🏠"
//                 label="Rent"
//                 value={data.outgoing.rent}
//                 total={data.totalOutgoing}
//               />
//               <ExpenseRow
//                 emoji="📦"
//                 label="Inventory"
//                 value={data.outgoing.inventory}
//                 total={data.totalOutgoing}
//               />
//               <ExpenseRow
//                 emoji="🧰"
//                 label="Other Expenses"
//                 value={data.outgoing.expenses}
//                 total={data.totalOutgoing}
//               />

//               <div className="flex justify-between items-center border-t mt-3 pt-3">
//                 <span className="font-bold text-gray-800">Total Spent</span>
//                 <span className="font-bold text-rose-600 text-lg">
//                   ₹{formatINR(data.totalOutgoing)}
//                 </span>
//               </div>
//               <Equation
//                 text={`${formatINR(data.outgoing.salary)} + ${formatINR(
//                   data.outgoing.rent,
//                 )} + ${formatINR(data.outgoing.inventory)} + ${formatINR(
//                   data.outgoing.expenses,
//                 )} = ₹${formatINR(data.totalOutgoing)}`}
//               />
//             </div>
//           </div>

//           {/* ===== PLAIN-ENGLISH EXPLAINER ===== */}
//           <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
//             <h2 className="font-bold text-blue-900 mb-2">
//               How these numbers are calculated
//             </h2>
//             <ul className="text-sm text-blue-900/80 space-y-1 list-disc pl-5">
//               <li>
//                 <b>Received</b> = full amount of paid bills + any advance taken on
//                 unpaid bills.
//               </li>
//               <li>
//                 <b>Pending</b> = Total Billed − Received (money still to collect).
//               </li>
//               <li>
//                 <b>Money Spent</b> = Staff Salary + Rent + Inventory + Other
//                 Expenses.
//               </li>
//               <li>
//                 <b>Profit / Loss</b> = Money Received − Money Spent.
//               </li>
//             </ul>
//           </div>

//           {/* ===== TREND ===== */}
//           <TrendChart trend={data.trend} year={data.trendYear} />
//         </div>
//       )}
//     </div>
//   );
// };

// /* ===== HELPERS ===== */

// const pct = (part, whole) => {
//   const w = Number(whole) || 0;
//   if (w <= 0) return 0;
//   return Math.min(100, Math.max(0, (Number(part) / w) * 100));
// };

// const toneMap = {
//   emerald: "text-emerald-600",
//   rose: "text-rose-600",
// };

// const BigTile = ({ emoji, label, value, tone, hint, signed }) => (
//   <div className="bg-white rounded-xl shadow-sm p-5">
//     <div className="flex items-center gap-2 text-gray-500 text-sm">
//       <span className="text-lg">{emoji}</span>
//       {label}
//     </div>
//     <p className={`text-2xl sm:text-3xl font-extrabold mt-1 ${toneMap[tone]}`}>
//       {signed && value < 0 ? "−" : ""}₹{formatINR(Math.abs(value))}
//     </p>
//     {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
//   </div>
// );

// const Row = ({ label, sub, value, dot }) => (
//   <div className="flex items-start justify-between py-2 border-b last:border-b-0">
//     <div className="flex items-start gap-2">
//       <span className={`mt-1.5 w-2.5 h-2.5 rounded-full ${dot}`} />
//       <div>
//         <p className="text-sm font-medium text-gray-800">{label}</p>
//         {sub && <p className="text-xs text-gray-400">{sub}</p>}
//       </div>
//     </div>
//     <span className="font-semibold text-gray-900">₹{formatINR(value)}</span>
//   </div>
// );

// const ExpenseRow = ({ emoji, label, value, total }) => (
//   <div className="py-2">
//     <div className="flex justify-between text-sm mb-1">
//       <span className="text-gray-700">
//         {emoji} {label}
//       </span>
//       <span className="font-semibold text-gray-900">
//         ₹{formatINR(value)}{" "}
//         <span className="text-xs text-gray-400">
//           ({Math.round(pct(value, total))}%)
//         </span>
//       </span>
//     </div>
//     <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
//       <div
//         className="h-2 bg-rose-400 rounded-full"
//         style={{ width: `${pct(value, total)}%` }}
//       />
//     </div>
//   </div>
// );

// const Equation = ({ text }) => (
//   <p className="text-xs text-gray-500 bg-gray-50 rounded-md px-3 py-2 mt-3">
//     ✓ {text}
//   </p>
// );

// const monthShort = (m) =>
//   new Date(0, m - 1).toLocaleString("default", { month: "short" });

// const TrendChart = ({ trend = [], year }) => {
//   const max = Math.max(
//     1,
//     ...trend.map((t) => Math.max(t.received || 0, t.spent || 0)),
//   );
//   return (
//     <div className="bg-white rounded-xl shadow-sm p-5">
//       <h2 className="font-bold text-gray-800 mb-1">
//         Month-by-Month Trend · {year}
//       </h2>
//       <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
//         <span className="flex items-center gap-1">
//           <span className="inline-block w-3 h-3 bg-emerald-500 rounded-sm" />
//           Received
//         </span>
//         <span className="flex items-center gap-1">
//           <span className="inline-block w-3 h-3 bg-rose-400 rounded-sm" />
//           Spent
//         </span>
//         <span className="ml-auto">Net = Received − Spent</span>
//       </div>
//       <div className="space-y-2">
//         {trend.map((t) => (
//           <div key={t.month} className="flex items-center gap-3">
//             <span className="w-9 text-xs font-medium text-gray-600">
//               {monthShort(t.month)}
//             </span>
//             <div className="flex-1 space-y-1">
//               <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
//                 <div
//                   className="h-2.5 bg-emerald-500 rounded-full"
//                   style={{ width: `${((t.received || 0) / max) * 100}%` }}
//                 />
//               </div>
//               <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
//                 <div
//                   className="h-2.5 bg-rose-400 rounded-full"
//                   style={{ width: `${((t.spent || 0) / max) * 100}%` }}
//                 />
//               </div>
//             </div>
//             <span
//               className={`w-24 text-right text-xs font-semibold ${
//                 (t.net || 0) >= 0 ? "text-emerald-600" : "text-rose-600"
//               }`}
//             >
//               {(t.net || 0) < 0 ? "−" : ""}₹{formatINR(Math.abs(t.net))}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Total;



import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TotalReportPdf from "../Component/pdf/TotalReportPdf.jsx";
import {
  MdFileDownload,
  MdTrendingUp,
  MdTrendingDown,
  MdHourglassEmpty,
  MdAccountBalanceWallet,
  MdExpandMore,
  MdErrorOutline,
} from "react-icons/md";
import { exportToExcel } from "../utils/exportToExcel";
import { fetchSummary, MONTHS, YEARS, formatINR } from "../utils/reportFetch";

/* ------------------------------------------------------------------ */
/* Design tokens (shared look with the Rent and Salary pages)          */
/* ------------------------------------------------------------------ */
const SELECT =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 sm:w-auto sm:min-w-[9.5rem]";
const BTN_OUTLINE =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50";

// Each outgoing category keeps the same colour in the donut, rows and bars.
const OUT = {
  salary: {
    label: "Staff salary",
    dot: "bg-cyan-400",
    bar: "bg-cyan-500",
    stroke: "#22d3ee",
  },
  rent: {
    label: "Rent",
    dot: "bg-blue-500",
    bar: "bg-blue-600",
    stroke: "#60a5fa",
  },
  inventory: {
    label: "Inventory",
    dot: "bg-indigo-400",
    bar: "bg-indigo-500",
    stroke: "#a5b4fc",
  },
  expenses: {
    label: "Other expenses",
    dot: "bg-sky-300",
    bar: "bg-sky-400",
    stroke: "#bae6fd",
  },
};
const OUT_KEYS = ["salary", "rent", "inventory", "expenses"];

const KPI_TONES = {
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const pct = (part, whole) => {
  const w = Number(whole) || 0;
  if (w <= 0) return 0;
  return Math.min(100, Math.max(0, (Number(part) / w) * 100));
};

const money = (n) => `${Number(n) < 0 ? "−" : ""}₹${formatINR(Math.abs(Number(n) || 0))}`;

const compact = (n) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(n) || 0);

const compactSigned = (n) =>
  `${Number(n) < 0 ? "−" : ""}₹${compact(Math.abs(Number(n) || 0))}`;

const monthShort = (m) =>
  new Date(0, m - 1).toLocaleString("default", { month: "short" });

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */
const Panel = ({ title, description, aside, children, className = "" }) => (
  <section
    className={`rounded-xl border border-slate-200/80 bg-white shadow-sm ${className}`}
  >
    {title && (
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
        {aside}
      </header>
    )}
    {children}
  </section>
);

const Kpi = ({ icon, tone, label, value, hint }) => (
  <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${KPI_TONES[tone]}`}
      >
        {icon}
      </span>
    </div>
    <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums text-slate-900">
      {value}
    </p>
    <p className="mt-1 truncate text-sm text-slate-500">{hint}</p>
  </div>
);

const DetailRow = ({ label, sub, value, dot }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
    <div className="flex items-start gap-3">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>
    </div>
    <span className="font-semibold tabular-nums text-slate-900">
      {money(value)}
    </span>
  </div>
);

const Check = ({ children }) => (
  <p className="mt-4 rounded-lg bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600 ring-1 ring-inset ring-slate-100">
    <span className="font-medium text-slate-700">Check: </span>
    {children}
  </p>
);

const Skeleton = () => (
  <div className="space-y-6" aria-busy="true" aria-label="Loading report">
    <div className="h-64 animate-pulse rounded-2xl bg-slate-200/70 motion-reduce:animate-none" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-xl bg-slate-200/70 motion-reduce:animate-none"
        />
      ))}
    </div>
    <div className="h-72 animate-pulse rounded-xl bg-slate-200/70 motion-reduce:animate-none" />
  </div>
);

/* Donut of outgoing categories (drawn on the navy hero) */
const Donut = ({ segments, centerTop, centerBottom }) => {
  let acc = 0;
  return (
    <div className="relative mx-auto h-44 w-44 shrink-0">
      <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90" role="img" aria-label="Spending split by category">
        <circle
          cx="21"
          cy="21"
          r="15.9155"
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="5"
        />
        {segments.map((seg) => {
          if (seg.pct <= 0) return null;
          const el = (
            <circle
              key={seg.key}
              cx="21"
              cy="21"
              r="15.9155"
              fill="none"
              stroke={seg.stroke}
              strokeWidth="5"
              strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
              strokeDashoffset={-acc}
            />
          );
          acc += seg.pct;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-semibold tabular-nums text-white">
          {centerTop}
        </span>
        <span className="text-xs text-blue-200/80">{centerBottom}</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const Total = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const summary = await fetchSummary({
          month: selectedMonth,
          year: selectedYear,
        });
        if (active) setData(summary);
      } catch (err) {
        console.error("Failed to load financial report:", err);
        if (active) {
          setError("Failed to load report data. Please try again.");
          setData(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [selectedMonth, selectedYear]);

  const periodLabel = () => {
    const m = selectedMonth
      ? MONTHS.find((x) => String(x.value) === String(selectedMonth))?.label
      : "";
    if (m && selectedYear) return `${m} ${selectedYear}`;
    if (selectedYear) return `Year ${selectedYear}`;
    if (m) return `${m}, all years`;
    return "All time";
  };

  const downloadTotalExcel = () => {
    if (!data) return;
    const rows = [
      { Section: "Income", Label: "Total Billed", Value: data.income.billed },
      { Section: "Income", Label: "Received", Value: data.income.received },
      { Section: "Income", Label: "Pending", Value: data.income.pending },
      { Section: "Income", Label: "Wallet", Value: data.income.wallet },
      { Section: "Outgoing", Label: "Expenses", Value: data.outgoing.expenses },
      {
        Section: "Outgoing",
        Label: "Inventory",
        Value: data.outgoing.inventory,
      },
      { Section: "Outgoing", Label: "Rent", Value: data.outgoing.rent },
      { Section: "Outgoing", Label: "Salary", Value: data.outgoing.salary },
      {
        Section: "Summary",
        Label: "Total Outgoing",
        Value: data.totalOutgoing,
      },
      { Section: "Summary", Label: "Net Balance", Value: data.netBalance },
    ];

    exportToExcel({
      data: rows,
      fileName: `Financial_Report_${selectedMonth || "All_Month"}_${selectedYear || "All_Year"}`,
      sheetName: "Financial Summary",
    });
  };

  /* ---------------- Derived values ---------------- */
  const isProfit = data ? data.netBalance >= 0 : true;
  const margin =
    data && data.income.received > 0
      ? Math.round((data.netBalance / data.income.received) * 100)
      : null;

  const donutSegments = data
    ? OUT_KEYS.map((key) => ({
        key,
        stroke: OUT[key].stroke,
        pct: pct(data.outgoing[key], data.totalOutgoing),
      }))
    : [];

  const trend = data?.trend || [];
  const trendMax = Math.max(
    1,
    ...trend.map((t) => Math.max(t.received || 0, t.spent || 0)),
  );
  const bestMonth = trend.reduce(
    (best, t) => (!best || (t.net || 0) > (best.net || 0) ? t : best),
    null,
  );

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Financial summary
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Showing {periodLabel()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadTotalExcel}
            disabled={!data}
            className={BTN_OUTLINE}
          >
            <MdFileDownload size={18} className="text-slate-500" />
            Excel
          </button>

          {data ? (
            <PDFDownloadLink
              document={
                <TotalReportPdf
                  data={data}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              }
              fileName={`Financial_Report_${selectedMonth || "All Month"}_${selectedYear || "All Year"}.pdf`}
              className={BTN_OUTLINE}
            >
              {({ loading: pdfLoading }) => (
                <>
                  <MdFileDownload size={18} className="text-slate-500" />
                  {pdfLoading ? "Preparing PDF..." : "PDF"}
                </>
              )}
            </PDFDownloadLink>
          ) : (
            <button disabled className={BTN_OUTLINE}>
              <MdFileDownload size={18} className="text-slate-500" />
              PDF
            </button>
          )}
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
        <p className="px-1 text-sm font-medium text-slate-600 sm:mr-2">Period</p>
        <select
          aria-label="Filter by month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className={SELECT}
        >
          <option value="">All months</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className={SELECT}
        >
          <option value="">All years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {(selectedMonth || selectedYear) && (
          <button
            onClick={() => {
              setSelectedMonth("");
              setSelectedYear("");
            }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ================= STATES ================= */}
      {loading && <Skeleton />}

      {!loading && error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm font-medium text-rose-800"
        >
          <MdErrorOutline size={20} className="shrink-0 text-rose-600" />
          {error}
        </div>
      )}

      {!loading && !error && !data && (
        <Panel>
          <p className="px-6 py-14 text-center text-sm text-slate-500">
            No report data available for this period.
          </p>
        </Panel>
      )}

      {/* ================= REPORT ================= */}
      {!loading && !error && data && (
        <div id="report" className="space-y-6">
          {/* ----- HERO: the bottom line (the one bold element) ----- */}
          <section
            aria-label="Net balance"
            className="rounded-2xl bg-gradient-to-br from-[#17458f] via-[#102f6b] to-[#0a1f4d] p-6 text-white shadow-sm ring-1 ring-blue-950/40 sm:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
              <div className="lg:col-span-3">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm text-cyan-200/90">
                    {isProfit ? "Net profit" : "Net loss"}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      isProfit
                        ? "bg-emerald-400/15 text-emerald-300 ring-emerald-300/30"
                        : "bg-rose-400/15 text-rose-300 ring-rose-300/30"
                    }`}
                  >
                    {isProfit ? "In surplus" : "In deficit"}
                  </span>
                </div>

                <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums sm:text-6xl">
                  ₹{formatINR(Math.abs(data.netBalance))}
                </p>
                {margin !== null && (
                  <p className="mt-3 text-sm text-blue-100/80">
                    {isProfit ? "Keeping" : "Losing"}{" "}
                    <span
                      className={`font-semibold ${
                        isProfit ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {Math.abs(margin)}%
                    </span>{" "}
                    of every rupee received
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
                  <div>
                    <p className="text-xs text-blue-200/70">Received</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums">
                      {money(data.income.received)}
                    </p>
                  </div>
                  <span className="text-xl text-blue-200/50" aria-hidden="true">
                    −
                  </span>
                  <div>
                    <p className="text-xs text-blue-200/70">Spent</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums">
                      {money(data.totalOutgoing)}
                    </p>
                  </div>
                  <span className="text-xl text-blue-200/50" aria-hidden="true">
                    =
                  </span>
                  <div>
                    <p className="text-xs text-blue-200/70">Net</p>
                    <p
                      className={`mt-0.5 text-lg font-semibold tabular-nums ${
                        isProfit ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {money(data.netBalance)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 sm:flex-row lg:col-span-2 lg:flex-col xl:flex-row">
                <Donut
                  segments={donutSegments}
                  centerTop={`₹${compact(data.totalOutgoing)}`}
                  centerBottom="spent"
                />
                <ul className="w-full space-y-2.5 text-sm">
                  {OUT_KEYS.map((key) => (
                    <li key={key} className="flex items-center gap-2.5">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${OUT[key].dot}`}
                      />
                      <span className="flex-1 text-blue-100/90">
                        {OUT[key].label}
                      </span>
                      <span className="text-xs tabular-nums text-blue-200/70">
                        {Math.round(pct(data.outgoing[key], data.totalOutgoing))}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ----- KPI cards ----- */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi
              icon={<MdTrendingUp size={22} />}
              tone="emerald"
              label="Money received"
              value={money(data.income.received)}
              hint="Cash actually collected"
            />
            <Kpi
              icon={<MdTrendingDown size={22} />}
              tone="rose"
              label="Money spent"
              value={money(data.totalOutgoing)}
              hint="Salary, rent, inventory and expenses"
            />
            <Kpi
              icon={<MdHourglassEmpty size={22} />}
              tone="amber"
              label="Pending collection"
              value={money(data.income.pending)}
              hint={`${Math.round(
                pct(data.income.pending, data.income.billed),
              )}% of billed work not yet collected`}
            />
            <Kpi
              icon={<MdAccountBalanceWallet size={22} />}
              tone="blue"
              label="Wallet credit held"
              value={money(data.income.wallet)}
              hint="Advance balance kept for patients"
            />
          </div>

          {/* ----- Money in / Money out ----- */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Panel
              title="Money in"
              description="What you billed and how much has come in."
            >
              <div className="px-6 py-5">
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="text-slate-600">Total billed (work done)</span>
                  <span className="text-lg font-semibold tabular-nums text-slate-900">
                    {money(data.income.billed)}
                  </span>
                </div>
                <div
                  className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
                  role="img"
                  aria-label={`Received ${Math.round(
                    pct(data.income.received, data.income.billed),
                  )}% of billed, pending ${Math.round(
                    pct(data.income.pending, data.income.billed),
                  )}%`}
                >
                  <div
                    className="bg-emerald-500"
                    style={{
                      width: `${pct(data.income.received, data.income.billed)}%`,
                    }}
                    title="Received"
                  />
                  <div
                    className="bg-amber-400"
                    style={{
                      width: `${pct(data.income.pending, data.income.billed)}%`,
                    }}
                    title="Pending"
                  />
                </div>

                <div className="mt-4">
                  <DetailRow
                    label="Received"
                    sub="Paid bills plus advances on unpaid bills"
                    value={data.income.received}
                    dot="bg-emerald-500"
                  />
                  <DetailRow
                    label="Pending"
                    sub="Billed but not yet collected"
                    value={data.income.pending}
                    dot="bg-amber-400"
                  />
                  <DetailRow
                    label="Wallet credit held"
                    sub="Advance balance kept for patients"
                    value={data.income.wallet}
                    dot="bg-blue-400"
                  />
                </div>

                <Check>
                  Received {money(data.income.received)} + Pending{" "}
                  {money(data.income.pending)} = Billed{" "}
                  {money(data.income.billed)}
                </Check>
              </div>
            </Panel>

            <Panel
              title="Money out"
              description="Everything the clinic spent in this period."
            >
              <div className="px-6 py-5">
                <div className="space-y-4">
                  {OUT_KEYS.map((key) => (
                    <div key={key}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2.5 font-medium text-slate-900">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${OUT[key].dot}`}
                          />
                          {OUT[key].label}
                        </span>
                        <span className="font-semibold tabular-nums text-slate-900">
                          {money(data.outgoing[key])}
                          <span className="ml-2 text-xs font-normal text-slate-500">
                            {Math.round(pct(data.outgoing[key], data.totalOutgoing))}%
                          </span>
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                        <div
                          className={`h-2 rounded-full ${OUT[key].bar}`}
                          style={{
                            width: `${pct(data.outgoing[key], data.totalOutgoing)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="font-semibold text-slate-900">Total spent</span>
                  <span className="text-lg font-semibold tabular-nums text-rose-600">
                    {money(data.totalOutgoing)}
                  </span>
                </div>

                <Check>
                  {formatINR(data.outgoing.salary)} +{" "}
                  {formatINR(data.outgoing.rent)} +{" "}
                  {formatINR(data.outgoing.inventory)} +{" "}
                  {formatINR(data.outgoing.expenses)} ={" "}
                  {money(data.totalOutgoing)}
                </Check>
              </div>
            </Panel>
          </div>

          {/* ----- Trend ----- */}
          <Panel
            title={`Monthly trend, ${data.trendYear}`}
            description={
              bestMonth && (bestMonth.net || 0) > 0
                ? `Best month: ${monthShort(bestMonth.month)} with a net of ${money(
                    bestMonth.net,
                  )}.`
                : "Received and spent for each month of the year."
            }
            aside={
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                  Received
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-rose-400" />
                  Spent
                </span>
              </div>
            }
          >
            {trend.length === 0 ? (
              <p className="px-6 py-14 text-center text-sm text-slate-500">
                No monthly data available.
              </p>
            ) : (
              <div className="overflow-x-auto px-6 py-6">
                <div className="min-w-[40rem]">
                  <div className="flex h-56 items-end gap-2 border-b border-slate-200">
                    {trend.map((t) => (
                      <div
                        key={t.month}
                        title={`${monthShort(t.month)}: received ₹${formatINR(
                          t.received || 0,
                        )}, spent ₹${formatINR(t.spent || 0)}, net ${money(t.net || 0)}`}
                        className="flex h-full flex-1 items-end justify-center gap-1"
                      >
                        <div
                          className="w-3 rounded-t bg-emerald-500 sm:w-4"
                          style={{
                            height: `${((t.received || 0) / trendMax) * 100}%`,
                            minHeight: t.received > 0 ? 3 : 0,
                          }}
                        />
                        <div
                          className="w-3 rounded-t bg-rose-400 sm:w-4"
                          style={{
                            height: `${((t.spent || 0) / trendMax) * 100}%`,
                            minHeight: t.spent > 0 ? 3 : 0,
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex gap-2">
                    {trend.map((t) => (
                      <div key={t.month} className="flex-1 text-center">
                        <p className="text-xs font-medium text-slate-600">
                          {monthShort(t.month)}
                        </p>
                        <p
                          className={`mt-0.5 text-[11px] font-semibold tabular-nums ${
                            (t.net || 0) >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {compactSigned(t.net || 0)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Figures under each month show net (received minus spent).
                  </p>
                </div>
              </div>
            )}
          </Panel>

          {/* ----- How it is calculated ----- */}
          <details className="group rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 [&::-webkit-details-marker]:hidden">
              How these numbers are calculated
              <MdExpandMore
                size={22}
                className="text-slate-400 transition-transform group-open:rotate-180"
              />
            </summary>
            <ul className="space-y-2 border-t border-slate-100 px-6 py-5 text-sm text-slate-600">
              <li>
                <span className="font-medium text-slate-900">Received</span> is
                the full amount of paid bills plus any advance taken on unpaid
                bills.
              </li>
              <li>
                <span className="font-medium text-slate-900">Pending</span> is
                total billed minus received, the money still to collect.
              </li>
              <li>
                <span className="font-medium text-slate-900">Money spent</span>{" "}
                is staff salary plus rent, inventory and other expenses.
              </li>
              <li>
                <span className="font-medium text-slate-900">Profit or loss</span>{" "}
                is money received minus money spent.
              </li>
            </ul>
          </details>
        </div>
      )}
    </div>
  );
};

export default Total;

