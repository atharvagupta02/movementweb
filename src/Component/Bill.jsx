// import { useEffect, useState } from "react";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import { FiDownload } from "react-icons/fi";
// import AllBillPdf from "./pdf/AllBillPdf";
// import { exportToExcel } from "../utils/exportToExcel";
// import { fetchReport, MONTHS, YEARS, formatINR } from "../utils/reportFetch";
// import {
//   ReportPage,
//   Card,
//   ReportToolbar,
//   Tile,
//   TallyLine,
//   Loading,
//   ErrorState,
//   EmptyState,
//   EXCEL_BTN,
//   PDF_BTN,
// } from "./reports/ReportUI";

// // Canonical received/paid figure for a bill.
// const received = (bill) =>
//   bill.paymentStatus === "Paid"
//     ? bill.total || 0
//     : Math.min(bill.advancePayment || 0, bill.total || 0);

// const Bill = () => {
//   const [paymentModeFilter, setPaymentModeFilter] = useState("All");
//   const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
//   const [serviceTypeFilter, setServiceTypeFilter] = useState("All");

//   const [billData, setBillData] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let active = true;

//     const load = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const data = await fetchReport("bill", {
//           month: selectedMonth,
//           year: selectedYear,
//         });
//         if (active) setBillData(data);
//       } catch (err) {
//         if (active) {
//           console.error("Error fetching bill data:", err);
//           setError("Failed to load bills. Please try again.");
//           setBillData([]);
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

//   // The data is already filtered by period server-side. Only the in-page
//   // service/payment-mode/payment-status filters are applied client-side.
//   const filteredBills = billData.filter((bill) => {
//     const serviceMatch =
//       serviceTypeFilter === "All" ? true : bill.billType === serviceTypeFilter;

//     const paymentModeMatch =
//       paymentModeFilter === "All" ? true : bill.status === paymentModeFilter;

//     const paymentStatusMatch =
//       paymentStatusFilter === "All"
//         ? true
//         : bill.paymentStatus === paymentStatusFilter;

//     return serviceMatch && paymentModeMatch && paymentStatusMatch;
//   });

//   // Three reconciling figures: Total Billed = Received + Outstanding.
//   const totalBilled = filteredBills.reduce(
//     (sum, bill) => sum + (bill.total || 0),
//     0
//   );
//   const totalReceived = filteredBills.reduce(
//     (sum, bill) => sum + received(bill),
//     0
//   );
//   const totalOutstanding = totalBilled - totalReceived;

//   const downloadBillsExcel = () => {
//     const rows = filteredBills.flatMap((bill) =>
//       bill.items.map((item, index) => ({
//         "Bill No": index === 0 ? bill.billNumber : "",
//         Date:
//           index === 0 ? new Date(bill.date).toLocaleDateString("en-IN") : "",
//         Customer: index === 0 ? bill.customer : "",
//         Service: index === 0 ? `${bill.billType} Service` : "",
//         "Payment Mode": index === 0 ? bill.status : "",
//         "Payment Status": index === 0 ? bill.paymentStatus : "",
//         Item: item.name,
//         Qty: item.qty,
//         Price: item.price,
//         Subtotal: item.qty * item.price,
//         Total: index === 0 ? bill.total : "",
//         Received: index === 0 ? received(bill) : "",
//         Outstanding: index === 0 ? (bill.total || 0) - received(bill) : "",
//       }))
//     );

//     exportToExcel({
//       data: rows,
//       fileName: `Bills_Report_${new Date().toISOString().slice(0, 10)}`,
//       sheetName: "Bills",
//     });
//   };

//   const monthName = selectedMonth
//     ? MONTHS.find((m) => String(m.value) === String(selectedMonth))?.label
//     : "";

//   const periodLabel =
//     selectedMonth && selectedYear
//       ? `${monthName} ${selectedYear}`
//       : selectedYear
//       ? `Year ${selectedYear}`
//       : selectedMonth
//       ? `${monthName} (all years)`
//       : "All time";

//   return (
//     <ReportPage>
//       <ReportToolbar title="Bills & Revenue" periodLabel={periodLabel}>
//         <select
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className="px-3 py-2 border rounded-lg text-sm"
//         >
//           <option value="">All Months</option>
//           {MONTHS.map((month) => (
//             <option key={month.value} value={month.value}>
//               {month.label}
//             </option>
//           ))}
//         </select>

//         <select
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(e.target.value)}
//           className="px-3 py-2 border rounded-lg text-sm"
//         >
//           <option value="">All Years</option>
//           {YEARS.map((year) => (
//             <option key={year} value={year}>
//               {year}
//             </option>
//           ))}
//         </select>

//         <button onClick={downloadBillsExcel} className={EXCEL_BTN}>
//           Download Bills Excel
//         </button>

//         <DownloadBillPdfButton filteredBills={filteredBills} />
//       </ReportToolbar>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <Tile emoji="📥" label="Total Billed" value={totalBilled} tone="blue" />
//         <Tile
//           emoji="✅"
//           label="Received"
//           value={totalReceived}
//           tone="emerald"
//           hint="Paid bills + advances"
//         />
//         <Tile
//           emoji="⏳"
//           label="Outstanding"
//           value={totalOutstanding}
//           tone="amber"
//           hint="Still to collect"
//         />
//       </div>

//       <TallyLine
//         text={`Received ₹${formatINR(totalReceived)} + Outstanding ₹${formatINR(
//           totalOutstanding
//         )} = Total Billed ₹${formatINR(totalBilled)}`}
//       />

//       <Card>
//         <div className=" flex flox-row flex-wrap justify-between gap-4">
//           <div className="flex flex-col items-center">
//             <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
//               Service Type Filter
//             </h3>

//             <div className="flex flex-wrap justify-center gap-2">
//               <button
//                 onClick={() => setServiceTypeFilter("All")}
//                 className={`px-4 py-2 rounded-md border text-sm transition ${
//                   serviceTypeFilter === "All"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 All Services
//               </button>

//               <button
//                 onClick={() => setServiceTypeFilter("Home")}
//                 className={`px-4 py-2 rounded-md border text-sm transition ${
//                   serviceTypeFilter === "Home"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Home Service
//               </button>

//               <button
//                 onClick={() => setServiceTypeFilter("Clinic")}
//                 className={`px-4 py-2 rounded-md border text-sm transition ${
//                   serviceTypeFilter === "Clinic"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Clinic Service
//               </button>
//             </div>
//           </div>

//           <div className="flex flex-col items-center">
//             <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
//               Payment Mode Filter
//             </h3>

//             <div className="flex flex-wrap justify-center gap-2">
//               <button
//                 onClick={() => setPaymentModeFilter("All")}
//                 className={`px-4 py-2 rounded-md border text-sm transition ${
//                   paymentModeFilter === "All"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 All
//               </button>

//               <button
//                 onClick={() => setPaymentModeFilter("Cash")}
//                 className={`px-4 py-2 rounded-md border text-sm transition ${
//                   paymentModeFilter === "Cash"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Cash
//               </button>

//               <button
//                 onClick={() => setPaymentModeFilter("Online")}
//                 className={`px-4 py-2 rounded-md border text-sm transition ${
//                   paymentModeFilter === "Online"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Online
//               </button>
//             </div>
//           </div>

//           <div className="flex flex-col items-center">
//             <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
//               Payment Status Filter
//             </h3>

//             <div className="flex flex-wrap justify-center gap-2">
//               <button
//                 onClick={() => setPaymentStatusFilter("All")}
//                 className={`px-4 py-2 rounded-md border text-sm transition ${
//                   paymentStatusFilter === "All"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 All
//               </button>

//               <button
//                 onClick={() => setPaymentStatusFilter("Paid")}
//                 className={`px-4 py-2 rounded-md border text-sm transition ${
//                   paymentStatusFilter === "Paid"
//                     ? "bg-green-600 text-white border-green-600"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Paid
//               </button>

//               <button
//                 onClick={() => setPaymentStatusFilter("Unpaid")}
//                 className={`px-4 py-2 rounded-md border text-sm transition ${
//                   paymentStatusFilter === "Unpaid"
//                     ? "bg-red-600 text-white border-red-600"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Unpaid
//               </button>
//             </div>
//           </div>
//         </div>
//       </Card>

//       {loading ? (
//         <Loading />
//       ) : error ? (
//         <ErrorState message={error} />
//       ) : filteredBills.length === 0 ? (
//         <EmptyState label="No bills found for this period." />
//       ) : (
//         <Card className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 rounded-lg">
//             <thead className="bg-gray-100">
//               <tr className="text-left text-sm font-semibold text-gray-700">
//                 <th className="border px-3 py-2">Bill No</th>
//                 <th className="border px-3 py-2">Date</th>
//                 <th className="border px-3 py-2">Customer</th>
//                 <th className="border px-3 py-2">Service</th>
//                 <th className="border px-3 py-2">Payment Mode</th>
//                 <th className="border px-3 py-2">Payment Status</th>
//                 <th className="border px-3 py-2">Item</th>
//                 <th className="border px-3 py-2">Qty</th>
//                 <th className="border px-3 py-2">Price</th>
//                 <th className="border px-3 py-2">Subtotal</th>
//                 <th className="border px-3 py-2">Total</th>
//                 <th className="border px-3 py-2">Received</th>
//                 <th className="border px-3 py-2">Outstanding</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredBills.map((bill) =>
//                 bill.items.map((item, index) => (
//                   <tr key={item._id} className="text-sm hover:bg-gray-50">
//                     {index === 0 && (
//                       <>
//                         <td
//                           rowSpan={bill.items.length}
//                           className="border px-3 py-2 font-semibold"
//                         >
//                           {bill.billNumber}
//                         </td>

//                         <td
//                           rowSpan={bill.items.length}
//                           className="border px-3 py-2"
//                         >
//                           {new Date(bill.date).toLocaleDateString("en-GB")}
//                         </td>

//                         <td
//                           rowSpan={bill.items.length}
//                           className="border px-3 py-2"
//                         >
//                           {bill.customer}
//                         </td>

//                         <td
//                           rowSpan={bill.items.length}
//                           className="border px-3 py-2"
//                         >
//                           {bill.billType}
//                         </td>

//                         <td
//                           rowSpan={bill.items.length}
//                           className={`border px-3 py-2 font-medium ${
//                             bill.status === "Cash"
//                               ? "text-orange-600"
//                               : "text-blue-600"
//                           }`}
//                         >
//                           {bill.status}
//                         </td>

//                         <td
//                           rowSpan={bill.items.length}
//                           className={`border px-3 py-2 font-semibold ${
//                             bill.paymentStatus === "Paid"
//                               ? "text-green-600"
//                               : "text-red-600"
//                           }`}
//                         >
//                           {bill.paymentStatus}
//                         </td>
//                       </>
//                     )}

//                     <td className="border px-3 py-2">{item.name}</td>
//                     <td className="border px-3 py-2">{item.qty}</td>
//                     <td className="border px-3 py-2">
//                       ₹{formatINR(item.price)}
//                     </td>
//                     <td className="border px-3 py-2">
//                       ₹{formatINR(item.qty * item.price)}
//                     </td>

//                     {index === 0 && (
//                       <>
//                         <td
//                           rowSpan={bill.items.length}
//                           className="border px-3 py-2 font-semibold"
//                         >
//                           ₹{formatINR(bill.total)}
//                         </td>

//                         <td
//                           rowSpan={bill.items.length}
//                           className="border px-3 py-2 text-green-700"
//                         >
//                           ₹{formatINR(received(bill))}
//                         </td>

//                         <td
//                           rowSpan={bill.items.length}
//                           className={`border px-3 py-2 font-bold ${
//                             bill.paymentStatus === "Paid"
//                               ? "text-green-700"
//                               : "text-red-700"
//                           }`}
//                         >
//                           ₹{formatINR((bill.total || 0) - received(bill))}
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </Card>
//       )}
//     </ReportPage>
//   );
// };

// export default Bill;

// const DownloadBillPdfButton = ({ filteredBills }) => {
//   if (!filteredBills || filteredBills.length === 0) return null;

//   return (
//     <PDFDownloadLink
//       document={<AllBillPdf filteredBills={filteredBills} />}
//       fileName={`Bills_Report_${new Date().toISOString().slice(0, 10)}.pdf`}
//     >
//       {({ loading }) => (
//         <button
//           className={`flex items-center gap-2 ${PDF_BTN}`}
//           disabled={loading}
//         >
//           <FiDownload size={18} />
//           {loading ? "Preparing PDF..." : "Download Bills PDF"}
//         </button>
//       )}
//     </PDFDownloadLink>
//   );
// };


import { Fragment, useEffect, useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import {
  FiDownload,
  FiSearch,
  FiChevronRight,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import AllBillPdf from "./pdf/AllBillPdf";
import { exportToExcel } from "../utils/exportToExcel";
import { fetchReport, MONTHS, YEARS, formatINR } from "../utils/reportFetch";

/*
  Bill report.

  How the page is organised (top to bottom):
    1. Header          title and the two downloads
    2. Filters         ONE panel: period, search, service, mode, status.
                       Everything below, plus both downloads, uses exactly
                       these filters. Active filters show as chips.
    3. Summary         billed, received, outstanding
    4. Performance     collection rate and monthly billing
    5. Breakdown       by service, payment mode and payment status
    6. Bill list       the table (sorting only affects the table)

  Month and year are applied by the server (fetchReport); the rest are applied
  in the browser to those results.
*/

const PAGE_SIZE = 10;

// Canonical received/paid figure for a bill.
const received = (bill) =>
  bill.paymentStatus === "Paid"
    ? bill.total || 0
    : Math.min(bill.advancePayment || 0, bill.total || 0);

const rupee = (n) => `₹${formatINR(n)}`;

const compact = (n) => {
  const v = Math.abs(n);
  if (v >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
  if (v >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
  return `₹${Math.round(n)}`;
};

// Does a bill pass the client-side filters? `skip` leaves one filter out, which
// is how the option counts stay accurate (see `facets` below).
const passes = (bill, f, skip) => {
  if (skip !== "service" && f.service !== "All" && bill.billType !== f.service)
    return false;
  if (skip !== "mode" && f.mode !== "All" && bill.status !== f.mode) return false;
  if (skip !== "status" && f.status !== "All" && bill.paymentStatus !== f.status)
    return false;
  if (
    f.q &&
    !`${bill.billNumber || ""} ${bill.customer || ""}`.toLowerCase().includes(f.q)
  )
    return false;
  return true;
};

const Icon = ({ d, className = "h-5 w-5" }) => (
  <svg
    className={`${className} shrink-0`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  billed: "M4 2v20l3-2 3 2 3-2 3 2 3-2V2l-3 2-3-2-3 2-3-2-3 2zM8 8h8M8 12h8M8 16h5",
  received: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
  outstanding: "M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  check: "M20 6L9 17l-5-5",
};

/* ------------------------------ building blocks ------------------------------ */

const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ title, sub }) => (
  <div className="mb-4">
    <h3 className="text-base font-bold tracking-tight text-slate-800">{title}</h3>
    {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
  </div>
);

// Titled group of cards, so the page reads as clear sections
const Section = ({ title, sub, children }) => (
  <section className="space-y-4">
    <div>
      <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
      {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
    </div>
    {children}
  </section>
);

const TONES = {
  blue: "bg-[#0B4BAA]/10 text-[#0B4BAA]",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

const Kpi = ({ icon, label, value, hint, tone, valueClass = "text-slate-900" }) => (
  <Card>
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${TONES[tone]}`}>
        <Icon d={icon} />
      </span>
    </div>
    <p className={`mt-3 text-2xl font-extrabold tracking-tight sm:text-[28px] ${valueClass}`}>
      {value}
    </p>
    <p className="mt-1 text-[13px] text-slate-500">{hint}</p>
  </Card>
);

const FilterLabel = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400"
  >
    {children}
  </label>
);

const Segment = ({ title, value, onChange, options }) => (
  <div>
    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
    <div
      className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1"
      role="group"
      aria-label={title}
    >
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] ${
              on ? "bg-white text-[#0B4BAA] shadow-sm" : "text-slate-600 hover:text-[#0B4BAA]"
            }`}
          >
            {o.label}
            <span
              className={`rounded-full px-1.5 text-[11px] ${
                on ? "bg-[#0B4BAA]/10" : "bg-slate-200/70 text-slate-500"
              }`}
            >
              {o.count}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

const selectClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-400 focus:border-[#0B4BAA] focus:ring-4 focus:ring-[#00C2CB]/20";

const Pill = ({ tone, children }) => {
  const t = {
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-rose-50 text-rose-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${t[tone]}`}>
      {children}
    </span>
  );
};

/* Collection rate ring */
const Ring = ({ rate }) => {
  const C = 2 * Math.PI * 50;
  return (
    <div className="relative mx-auto h-36 w-36">
      <svg
        viewBox="0 0 120 120"
        className="-rotate-90"
        role="img"
        aria-label={`${Math.round(rate)} percent of billed amount collected`}
      >
        <circle cx="60" cy="60" r="50" fill="none" stroke="#E2E8F0" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="#0B4BAA"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(Math.min(rate, 100) / 100) * C} ${C}`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-3xl font-extrabold text-slate-900">{Math.round(rate)}%</p>
          <p className="text-xs font-medium text-slate-500">collected</p>
        </div>
      </div>
    </div>
  );
};

/* Monthly stacked bars: received + outstanding = billed */
const TrendChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.billed), 1);
  return (
    <div>
      <div
        className="flex h-56 items-end gap-2 sm:gap-3"
        role="img"
        aria-label={`Billed amount per month: ${data
          .map((d) => `${d.label} ${compact(d.billed)}`)
          .join(", ")}`}
      >
        {data.map((d) => {
          const h = Math.max((d.billed / max) * 100, 3);
          const recShare = d.billed ? (d.received / d.billed) * 100 : 0;
          return (
            <div
              key={d.key}
              className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
            >
              <span className="text-[11px] font-semibold text-slate-600">
                {compact(d.billed)}
              </span>
              <div className="flex w-full flex-1 items-end">
                <div
                  className="flex w-full flex-col overflow-hidden rounded-t-lg"
                  style={{ height: `${h}%` }}
                  title={`${d.label}: billed ${rupee(d.billed)}, received ${rupee(d.received)}`}
                >
                  <div className="bg-amber-300" style={{ height: `${100 - recShare}%` }} />
                  <div
                    className="bg-gradient-to-t from-[#0B4BAA] to-[#2B7BE4]"
                    style={{ height: `${recShare}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-slate-500">{d.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex gap-5 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#0B4BAA]" /> Received
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-300" /> Outstanding
        </span>
      </div>
    </div>
  );
};

/* Share-of-total horizontal bars */
const Breakdown = ({ title, sub, rows, money = true }) => {
  const total = rows.reduce((s, r) => s + r.value, 0);
  return (
    <Card>
      <CardTitle title={title} sub={sub} />
      {total === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">No data</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => {
            const pct = (r.value / total) * 100;
            return (
              <li key={r.label}>
                <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-semibold text-slate-700">{r.label}</span>
                  <span className="text-slate-500">
                    <b className="text-slate-800">{money ? rupee(r.value) : r.value}</b> ·{" "}
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${r.color}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

/* ------------------------------ page ------------------------------ */

const Bill = () => {
  // Filters: month/year are server-side, the other four are client-side.
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [query, setQuery] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("All");
  const [paymentModeFilter, setPaymentModeFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");

  // Table only
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState({});

  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [exportError, setExportError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchReport("bill", {
          month: selectedMonth,
          year: selectedYear,
        });
        if (active) setBillData(data);
      } catch (err) {
        if (active) {
          console.error("Error fetching bill data:", err);
          setError("Failed to load bills. Please try again.");
          setBillData([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [selectedMonth, selectedYear, reloadKey]);

  // Back to page 1 whenever the result set changes
  useEffect(() => {
    setPage(1);
  }, [
    selectedMonth,
    selectedYear,
    serviceTypeFilter,
    paymentModeFilter,
    paymentStatusFilter,
    query,
    sortBy,
  ]);

  const filters = useMemo(
    () => ({
      service: serviceTypeFilter,
      mode: paymentModeFilter,
      status: paymentStatusFilter,
      q: query.trim().toLowerCase(),
    }),
    [serviceTypeFilter, paymentModeFilter, paymentStatusFilter, query],
  );

  // THE filtered list. Summary, charts, breakdowns, table, Excel and PDF all
  // read from this one list, so they can never disagree.
  const filteredBills = useMemo(
    () => billData.filter((b) => passes(b, filters)),
    [billData, filters],
  );

  // Option counts that respect the OTHER active filters, so a number on a
  // button is how many bills you will get if you press it.
  const facets = useMemo(() => {
    const tally = (skip, key) => {
      const base = billData.filter((b) => passes(b, filters, skip));
      const out = { All: base.length };
      base.forEach((b) => {
        out[b[key]] = (out[b[key]] || 0) + 1;
      });
      return out;
    };
    return {
      service: tally("service", "billType"),
      mode: tally("mode", "status"),
      status: tally("status", "paymentStatus"),
    };
  }, [billData, filters]);

  const stats = useMemo(() => {
    const n = filteredBills.length;
    const billed = filteredBills.reduce((s, b) => s + (b.total || 0), 0);
    const rec = filteredBills.reduce((s, b) => s + received(b), 0);

    const monthMap = {};
    const byService = {};
    const byMode = {};
    filteredBills.forEach((b) => {
      const d = new Date(b.date);
      if (!isNaN(d)) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthMap[key] = monthMap[key] || {
          key,
          label: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
          billed: 0,
          received: 0,
        };
        monthMap[key].billed += b.total || 0;
        monthMap[key].received += received(b);
      }
      const s = b.billType || "Other";
      byService[s] = (byService[s] || 0) + (b.total || 0);
      const m = b.status || "Other";
      byMode[m] = (byMode[m] || 0) + received(b);
    });

    return {
      n,
      billed,
      rec,
      outstanding: billed - rec,
      rate: billed ? (rec / billed) * 100 : 0,
      avg: n ? billed / n : 0,
      paid: filteredBills.filter((b) => b.paymentStatus === "Paid").length,
      months: Object.values(monthMap)
        .sort((a, b) => a.key.localeCompare(b.key))
        .slice(-12),
      byService,
      byMode,
    };
  }, [filteredBills]);

  const sortedBills = useMemo(() => {
    const list = [...filteredBills];
    list.sort((a, b) => {
      if (sortBy === "highest") return (b.total || 0) - (a.total || 0);
      if (sortBy === "outstanding")
        return (b.total || 0) - received(b) - ((a.total || 0) - received(a));
      const d = new Date(b.date) - new Date(a.date);
      return sortBy === "oldest" ? -d : d;
    });
    return list;
  }, [filteredBills, sortBy]);

  const pages = Math.max(1, Math.ceil(sortedBills.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const pageRows = sortedBills.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const monthName = selectedMonth
    ? MONTHS.find((m) => String(m.value) === String(selectedMonth))?.label
    : "";

  /* ---------------- Active filters ---------------- */
  const chips = [
    selectedMonth && { key: "month", label: monthName, clear: () => setSelectedMonth("") },
    selectedYear && { key: "year", label: String(selectedYear), clear: () => setSelectedYear("") },
    serviceTypeFilter !== "All" && {
      key: "service",
      label: `${serviceTypeFilter} service`,
      clear: () => setServiceTypeFilter("All"),
    },
    paymentModeFilter !== "All" && {
      key: "mode",
      label: `${paymentModeFilter} payments`,
      clear: () => setPaymentModeFilter("All"),
    },
    paymentStatusFilter !== "All" && {
      key: "status",
      label: paymentStatusFilter,
      clear: () => setPaymentStatusFilter("All"),
    },
    query.trim() && {
      key: "q",
      label: `Search: "${query.trim()}"`,
      clear: () => setQuery(""),
    },
  ].filter(Boolean);

  const clearAll = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setQuery("");
    setServiceTypeFilter("All");
    setPaymentModeFilter("All");
    setPaymentStatusFilter("All");
  };

  const today = new Date().toISOString().slice(0, 10);

  const downloadBillsExcel = () => {
    const rows = filteredBills.flatMap((bill) =>
      (bill.items || []).map((item, index) => ({
        "Bill No": index === 0 ? bill.billNumber : "",
        Date: index === 0 ? new Date(bill.date).toLocaleDateString("en-IN") : "",
        Customer: index === 0 ? bill.customer : "",
        Service: index === 0 ? `${bill.billType} Service` : "",
        "Payment Mode": index === 0 ? bill.status : "",
        "Payment Status": index === 0 ? bill.paymentStatus : "",
        Item: item.name,
        Qty: item.qty,
        Price: item.price,
        Subtotal: item.qty * item.price,
        Total: index === 0 ? bill.total : "",
        Received: index === 0 ? received(bill) : "",
        Outstanding: index === 0 ? (bill.total || 0) - received(bill) : "",
      })),
    );
    exportToExcel({ data: rows, fileName: `Bills_Report_${today}`, sheetName: "Bills" });
  };

  // The PDF is built only when you click, so changing filters stays fast
  const downloadBillsPdf = async () => {
    setPdfBusy(true);
    setExportError("");
    try {
      const blob = await pdf(<AllBillPdf filteredBills={filteredBills} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bills_Report_${today}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
      setExportError("Could not create the PDF. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  const serviceRows = Object.entries(stats.byService).map(([label, value], i) => ({
    label: `${label} Service`,
    value,
    color: i === 0 ? "bg-[#0B4BAA]" : i === 1 ? "bg-[#00C2CB]" : "bg-slate-400",
  }));
  const modeRows = Object.entries(stats.byMode).map(([label, value]) => ({
    label,
    value,
    color: label === "Cash" ? "bg-amber-400" : label === "Online" ? "bg-[#0B4BAA]" : "bg-slate-400",
  }));
  const statusRows = [
    { label: "Paid", value: stats.paid, color: "bg-emerald-500" },
    { label: "Unpaid", value: stats.n - stats.paid, color: "bg-rose-500" },
  ];

  const noBillsAtAll = !loading && !error && billData.length === 0;
  const noMatches = !loading && !error && billData.length > 0 && filteredBills.length === 0;

  const scope = `${stats.n} ${stats.n === 1 ? "bill" : "bills"}${
    chips.length ? " matching your filters" : ""
  }`;

  const opts = (labels, facet) =>
    labels.map(([value, label]) => ({
      value,
      label,
      count: facet[value] || 0,
    }));

  return (
    <div className="space-y-8">
      {/* ============ 1. HEADER ============ */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Bills &amp; Revenue
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Billing, collections and outstanding amounts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={downloadBillsExcel}
            disabled={!filteredBills.length}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-emerald-700"
          >
            <FiDownload size={16} /> Excel
          </button>
          <button
            onClick={downloadBillsPdf}
            disabled={!filteredBills.length || pdfBusy}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B4BAA] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#0B4BAA]/30 transition hover:bg-[#093d8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiDownload size={16} /> {pdfBusy ? "Preparing PDF..." : "PDF"}
          </button>
        </div>
      </header>
      {exportError && (
        <p role="alert" className="-mt-4 text-sm font-medium text-rose-600">
          {exportError}
        </p>
      )}

      {/* ============ 2. FILTERS (drive everything below) ============ */}
      <section aria-label="Filters">
        <Card>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-800">Filters</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                These apply to everything below: the summary, charts, bill list and
                both downloads.
              </p>
            </div>
            <p className="rounded-full bg-[#0B4BAA]/10 px-3 py-1 text-sm font-semibold text-[#0B4BAA]">
              {loading ? "Loading..." : `${filteredBills.length} of ${billData.length} bills`}
            </p>
          </div>

          {/* Period + search */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <FilterLabel htmlFor="f-month">Month</FilterLabel>
              <select
                id="f-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={selectClass}
              >
                <option value="">All months</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FilterLabel htmlFor="f-year">Year</FilterLabel>
              <select
                id="f-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={selectClass}
              >
                <option value="">All years</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <FilterLabel htmlFor="f-search">Search</FilterLabel>
              <div className="relative">
                <FiSearch
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  id="f-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Bill number or customer name"
                  className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#0B4BAA] focus:ring-4 focus:ring-[#00C2CB]/20"
                />
              </div>
            </div>
          </div>

          {/* Segments */}
          <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-2 xl:grid-cols-3">
            <Segment
              title="Service type"
              value={serviceTypeFilter}
              onChange={setServiceTypeFilter}
              options={opts(
                [["All", "All"], ["Home", "Home"], ["Clinic", "Clinic"]],
                facets.service,
              )}
            />
            <Segment
              title="Payment mode"
              value={paymentModeFilter}
              onChange={setPaymentModeFilter}
              options={opts(
                [["All", "All"], ["Cash", "Cash"], ["Online", "Online"]],
                facets.mode,
              )}
            />
            <Segment
              title="Payment status"
              value={paymentStatusFilter}
              onChange={setPaymentStatusFilter}
              options={opts(
                [["All", "All"], ["Paid", "Paid"], ["Unpaid", "Unpaid"]],
                facets.status,
              )}
            />
          </div>

          {/* Active filters */}
          {chips.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active
              </span>
              {chips.map((c) => (
                <span
                  key={c.key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0B4BAA]/10 py-1 pl-3 pr-1.5 text-xs font-semibold text-[#0B4BAA]"
                >
                  {c.label}
                  <button
                    type="button"
                    onClick={c.clear}
                    aria-label={`Remove filter ${c.label}`}
                    className="grid h-5 w-5 place-items-center rounded-full transition hover:bg-[#0B4BAA]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="ml-1 text-sm font-semibold text-slate-500 underline-offset-2 transition hover:text-[#0B4BAA] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]"
              >
                Clear all
              </button>
            </div>
          )}
        </Card>
      </section>

      {/* ============ RESULTS ============ */}
      {loading ? (
        <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading bills">
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-200" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-72 rounded-2xl bg-slate-200" />
            <div className="h-72 rounded-2xl bg-slate-200 lg:col-span-2" />
          </div>
        </div>
      ) : error ? (
        <Card className="text-center">
          <p className="text-base font-bold text-slate-800">{error}</p>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0B4BAA] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#093d8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2"
          >
            <FiRefreshCw size={15} /> Try again
          </button>
        </Card>
      ) : noBillsAtAll ? (
        <Card className="py-14 text-center">
          <p className="text-lg font-semibold text-slate-700">No bills found</p>
          <p className="mt-1 text-sm text-slate-400">
            There are no bills for this period. Try another month or year.
          </p>
          {(selectedMonth || selectedYear) && (
            <button
              onClick={clearAll}
              className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]"
            >
              Show all time
            </button>
          )}
        </Card>
      ) : noMatches ? (
        <Card className="py-14 text-center">
          <p className="text-lg font-semibold text-slate-700">No bills match these filters</p>
          <p className="mt-1 text-sm text-slate-400">
            Remove a filter or search term to see more bills.
          </p>
          <button
            onClick={clearAll}
            className="mt-4 rounded-xl bg-[#0B4BAA] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#093d8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2"
          >
            Clear all filters
          </button>
        </Card>
      ) : (
        <>
          {/* ============ 3. SUMMARY ============ */}
          <Section title="Summary" sub={`Based on ${scope}.`}>
            <div className="grid gap-4 sm:grid-cols-3">
              <Kpi
                icon={ICONS.billed}
                tone="blue"
                label="Total Billed"
                value={rupee(stats.billed)}
                hint={`${stats.n} ${stats.n === 1 ? "bill" : "bills"}`}
              />
              <Kpi
                icon={ICONS.received}
                tone="emerald"
                label="Received"
                value={rupee(stats.rec)}
                hint="Paid bills + advances"
                valueClass="text-emerald-600"
              />
              <Kpi
                icon={ICONS.outstanding}
                tone="amber"
                label="Outstanding"
                value={rupee(stats.outstanding)}
                hint="Still to collect"
                valueClass={stats.outstanding > 0 ? "text-amber-600" : "text-slate-900"}
              />
            </div>
            <p className="flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
              <Icon d={ICONS.check} className="h-4 w-4 text-emerald-600" />
              Received {rupee(stats.rec)} + Outstanding {rupee(stats.outstanding)} = Total
              Billed {rupee(stats.billed)}
            </p>
          </Section>

          {/* ============ 4. PERFORMANCE ============ */}
          <Section title="Performance" sub="How much of the billing has been collected, and when.">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardTitle title="Collection rate" sub="Received as a share of billed" />
                <Ring rate={stats.rate} />
                <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
                  <div>
                    <dd className="text-lg font-extrabold text-slate-900">{stats.n}</dd>
                    <dt className="text-xs text-slate-500">Bills</dt>
                  </div>
                  <div>
                    <dd className="text-lg font-extrabold text-slate-900">{compact(stats.avg)}</dd>
                    <dt className="text-xs text-slate-500">Average bill</dt>
                  </div>
                  <div>
                    <dd className="text-lg font-extrabold text-slate-900">
                      {stats.paid}/{stats.n}
                    </dd>
                    <dt className="text-xs text-slate-500">Paid</dt>
                  </div>
                </dl>
              </Card>
              <Card className="lg:col-span-2">
                <CardTitle title="Billing by month" sub="Last 12 months in this view" />
                {stats.months.length ? (
                  <TrendChart data={stats.months} />
                ) : (
                  <p className="py-10 text-center text-sm text-slate-400">No dated bills</p>
                )}
              </Card>
            </div>
          </Section>

          {/* ============ 5. BREAKDOWN ============ */}
          <Section title="Breakdown" sub="Where the billing and payments come from.">
            <div className="grid gap-6 md:grid-cols-3">
              <Breakdown title="By service" sub="Share of billed amount" rows={serviceRows} />
              <Breakdown title="By payment mode" sub="Share of received amount" rows={modeRows} />
              <Breakdown
                title="By payment status"
                sub="Number of bills"
                rows={statusRows}
                money={false}
              />
            </div>
          </Section>

          {/* ============ 6. BILL LIST ============ */}
          <Section title="Bill list" sub={`Showing ${scope}. Select a row to see its items.`}>
            <Card className="!p-0">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  {sortedBills.length} {sortedBills.length === 1 ? "bill" : "bills"}
                  {chips.length > 0 && (
                    <>
                      {" "}
                      <button
                        type="button"
                        onClick={clearAll}
                        className="font-semibold text-[#0B4BAA] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]"
                      >
                        Clear filters
                      </button>
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2.5">
                  <label htmlFor="sort-bills" className="text-sm font-medium text-slate-500">
                    Sort by
                  </label>
                  <select
                    id="sort-bills"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`${selectClass} !w-auto`}
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="highest">Highest amount</option>
                    <option value="outstanding">Highest outstanding</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <th className="w-10 px-4 py-3" />
                      <th className="px-3 py-3 font-semibold">Bill</th>
                      <th className="px-3 py-3 font-semibold">Customer</th>
                      <th className="px-3 py-3 font-semibold">Service</th>
                      <th className="px-3 py-3 font-semibold">Mode</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                      <th className="px-3 py-3 text-right font-semibold">Total</th>
                      <th className="px-3 py-3 text-right font-semibold">Received</th>
                      <th className="px-4 py-3 text-right font-semibold">Outstanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((bill) => {
                      const key = bill._id || bill.billNumber;
                      const isOpen = !!open[key];
                      const out = (bill.total || 0) - received(bill);
                      const items = bill.items || [];
                      return (
                        <Fragment key={key}>
                          <tr
                            onClick={() => setOpen((o) => ({ ...o, [key]: !o[key] }))}
                            className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50"
                          >
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-label={`${isOpen ? "Hide" : "Show"} items for bill ${
                                  bill.billNumber
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpen((o) => ({ ...o, [key]: !o[key] }));
                                }}
                                className="rounded p-1 text-slate-400 transition hover:text-[#0B4BAA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]"
                              >
                                <FiChevronRight
                                  className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
                                  size={16}
                                />
                              </button>
                            </td>
                            <td className="px-3 py-3">
                              <p className="font-bold text-slate-800">{bill.billNumber}</p>
                              <p className="text-xs text-slate-400">
                                {new Date(bill.date).toLocaleDateString("en-GB")}
                              </p>
                            </td>
                            <td className="px-3 py-3 font-medium text-slate-700">
                              {bill.customer}
                            </td>
                            <td className="px-3 py-3 text-slate-600">{bill.billType}</td>
                            <td className="px-3 py-3">
                              <Pill tone={bill.status === "Cash" ? "amber" : "blue"}>
                                {bill.status}
                              </Pill>
                            </td>
                            <td className="px-3 py-3">
                              <Pill tone={bill.paymentStatus === "Paid" ? "green" : "red"}>
                                {bill.paymentStatus}
                              </Pill>
                            </td>
                            <td className="px-3 py-3 text-right font-bold text-slate-800">
                              {rupee(bill.total)}
                            </td>
                            <td className="px-3 py-3 text-right font-medium text-emerald-700">
                              {rupee(received(bill))}
                            </td>
                            <td
                              className={`px-4 py-3 text-right font-bold ${
                                out > 0 ? "text-rose-600" : "text-slate-400"
                              }`}
                            >
                              {out > 0 ? rupee(out) : "-"}
                            </td>
                          </tr>
                          {isOpen && (
                            <tr className="bg-slate-50/70">
                              <td />
                              <td colSpan={8} className="px-3 py-3">
                                <table className="w-full max-w-2xl text-sm">
                                  <thead>
                                    <tr className="text-xs uppercase tracking-wider text-slate-400">
                                      <th className="py-1.5 text-left font-semibold">Item</th>
                                      <th className="py-1.5 text-right font-semibold">Qty</th>
                                      <th className="py-1.5 text-right font-semibold">Price</th>
                                      <th className="py-1.5 text-right font-semibold">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {items.map((it, i) => (
                                      <tr key={it._id || i} className="border-t border-slate-200/70">
                                        <td className="py-1.5 text-slate-700">{it.name}</td>
                                        <td className="py-1.5 text-right text-slate-600">{it.qty}</td>
                                        <td className="py-1.5 text-right text-slate-600">
                                          {rupee(it.price)}
                                        </td>
                                        <td className="py-1.5 text-right font-semibold text-slate-800">
                                          {rupee(it.qty * it.price)}
                                        </td>
                                      </tr>
                                    ))}
                                    {items.length === 0 && (
                                      <tr>
                                        <td colSpan={4} className="py-2 text-slate-400">
                                          No items recorded.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row">
                <span>
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–
                  {Math.min(safePage * PAGE_SIZE, sortedBills.length)} of {sortedBills.length}{" "}
                  bills
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(safePage - 1)}
                    disabled={safePage <= 1}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="px-1 font-medium text-slate-700">
                    Page {safePage} of {pages}
                  </span>
                  <button
                    onClick={() => setPage(safePage + 1)}
                    disabled={safePage >= pages}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </Card>
          </Section>
        </>
      )}
    </div>
  );
};

export default Bill;
