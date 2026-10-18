// import { useState, useEffect } from "react";
// import InventoryReportPdf from "./pdf/InventoryReportPdf";
// import { PDFDownloadLink } from "@react-pdf/renderer";
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
//   PRIMARY_BTN,
// } from "./reports/ReportUI";

// const Inventory = () => {
//   const currentDate = new Date().toISOString().split("T")[0];
//   const [items, setItems] = useState([
//     { name: "", date: currentDate, quantity: 0, unitPrice: 0 },
//   ]);
//   const [inventoryData, setInventoryData] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleItemChange = (index, field, value) => {
//     const updated = [...items];
//     updated[index][field] =
//       field === "quantity" || field === "unitPrice" ? Number(value) : value;
//     setItems(updated);
//   };

//   const addItem = () => {
//     setItems([
//       ...items,
//       { name: "", date: currentDate, quantity: 0, unitPrice: 0 },
//     ]);
//   };

//   const total = items.reduce(
//     (sum, item) => sum + item.quantity * item.unitPrice,
//     0,
//   );

//   const fetchInventoryData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await fetchReport("inventory", {
//         month: selectedMonth,
//         year: selectedYear,
//       });
//       setInventoryData(data);
//     } catch (err) {
//       console.error("Error fetching Inventory data:", err);
//       setError("Failed to load inventory records. Please try again.");
//       setInventoryData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInventoryData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedMonth, selectedYear]);

//   const handleSubmit = async () => {
//     const formData = {
//       items,
//       total,
//     };
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/report/inventory`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         },
//       );
//       const result = await response.json();
//       alert(result.message);
//       fetchInventoryData();
//       setItems([{ name: "", date: currentDate, quantity: 0, unitPrice: 0 }]);
//     } catch (err) {
//       console.error("Error submitting inventory:", err);
//       alert("Failed to submit inventory");
//     }
//   };

//   const filteredTotal = inventoryData.reduce(
//     (sum, entry) => sum + entry.total,
//     0,
//   );

//   const monthName = selectedMonth
//     ? MONTHS.find((m) => m.value === selectedMonth)?.label
//     : null;
//   let periodLabel = "All time";
//   if (selectedMonth && selectedYear) {
//     periodLabel = `${monthName} ${selectedYear}`;
//   } else if (selectedYear) {
//     periodLabel = `Year ${selectedYear}`;
//   } else if (selectedMonth) {
//     periodLabel = `${monthName} (all years)`;
//   }

//   const entryCount = inventoryData.length;

//   const downloadInventoryExcel = () => {
//     const rows = inventoryData.flatMap((entry) =>
//       entry.items.map((item, index) => ({
//         Date:
//           index === 0
//             ? new Date(entry.createdAt).toLocaleDateString("en-IN")
//             : "",
//         "Item Name": item.name,
//         Qty: item.quantity,
//         "Unit Price": item.unitPrice,
//         Subtotal: item.quantity * item.unitPrice,
//         "Entry Total": index === 0 ? entry.total : "",
//       })),
//     );

//     exportToExcel({
//       data: rows,
//       fileName: `Inventory_Report_${selectedMonth || "All_Months"}_${selectedYear || "All_Years"}`,
//       sheetName: "Inventory",
//     });
//   };

//   return (
//     <ReportPage>
//       <ReportToolbar title="Inventory" periodLabel={periodLabel}>
//         <select
//           className="border p-2 rounded text-sm"
//           value={selectedMonth || ""}
//           onChange={(e) =>
//             setSelectedMonth(e.target.value ? Number(e.target.value) : null)
//           }
//         >
//           <option value="">All Months</option>
//           {MONTHS.map((m) => (
//             <option key={m.value} value={m.value}>
//               {m.label}
//             </option>
//           ))}
//         </select>

//         <select
//           className="border p-2 rounded text-sm"
//           value={selectedYear || ""}
//           onChange={(e) =>
//             setSelectedYear(e.target.value ? Number(e.target.value) : null)
//           }
//         >
//           <option value="">All Years</option>
//           {YEARS.map((year) => (
//             <option key={year} value={year}>
//               {year}
//             </option>
//           ))}
//         </select>

//         <button onClick={downloadInventoryExcel} className={EXCEL_BTN}>
//           Download Excel
//         </button>

//         <PDFDownloadLink
//           document={<InventoryReportPdf inventory={inventoryData} />}
//           fileName={`Inventory_Report_${selectedMonth || "All_Month"}_${selectedYear || "All_Year"}.pdf`}
//         >
//           {({ loading: pdfLoading }) => (
//             <button className={PDF_BTN}>
//               {pdfLoading ? "Preparing PDF..." : "Download PDF"}
//             </button>
//           )}
//         </PDFDownloadLink>
//       </ReportToolbar>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <Tile
//           emoji="📦"
//           label="Inventory Value"
//           value={filteredTotal}
//           tone="rose"
//           hint="Total cost in this period"
//         />
//         <Tile
//           emoji="🧮"
//           label="Entries"
//           value={String(entryCount)}
//           isCurrency={false}
//           tone="gray"
//         />
//       </div>

//       <Card>
//         <h2 className="text-lg font-bold text-gray-800 mb-4">
//           Add Inventory Purchase
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left mb-4">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2">Item Name</th>
//                 <th className="p-2">Date</th>
//                 <th className="p-2">Quantity</th>
//                 <th className="p-2">Unit Price</th>
//                 <th className="p-2">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, idx) => (
//                 <tr key={idx} className="border-b">
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={item.name}
//                       onChange={(e) =>
//                         handleItemChange(idx, "name", e.target.value)
//                       }
//                       className="w-full border p-1 rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="date"
//                       value={item.date}
//                       onChange={(e) =>
//                         handleItemChange(idx, "date", e.target.value)
//                       }
//                       className="w-full border p-1 rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         handleItemChange(idx, "quantity", e.target.value)
//                       }
//                       className="w-full border p-1 rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={item.unitPrice}
//                       onChange={(e) =>
//                         handleItemChange(idx, "unitPrice", e.target.value)
//                       }
//                       className="w-full border p-1 rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     ₹{formatINR(item.quantity * item.unitPrice)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <button
//           onClick={addItem}
//           className="mb-4 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
//         >
//           + Add Item
//         </button>

//         <div className="text-right text-lg font-bold mb-6">
//           Inventory Value: ₹{formatINR(total)}
//         </div>

//         <div className="flex justify-end">
//           <button onClick={handleSubmit} className={PRIMARY_BTN}>
//             Save
//           </button>
//         </div>
//       </Card>

//       {loading && <Loading />}

//       {!loading && error && <ErrorState message={error} />}

//       {!loading && !error && inventoryData.length === 0 && (
//         <EmptyState label="No inventory records for this period." />
//       )}

//       {!loading && !error && inventoryData.length > 0 && (
//         <Card>
//           <TallyLine
//             text={`Sum of ${entryCount} entr${entryCount === 1 ? "y" : "ies"} = ₹${formatINR(filteredTotal)}`}
//           />
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//             {inventoryData.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
//               >
//                 <h2 className="text-lg font-semibold text-indigo-600">
//                   Purchase Details
//                 </h2>
//                 <p className="text-sm text-gray-600 mb-2">
//                   Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}
//                 </p>
//                 <h3 className="font-semibold text-gray-800 mb-1">Items:</h3>
//                 <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
//                   {order.items.map((item) => (
//                     <li key={item._id} className="mb-2">
//                       <div>
//                         {item.name} - {item.quantity} pcs × ₹{item.unitPrice}
//                       </div>

//                       <div className="text-xs text-gray-500">
//                         Date:{" "}
//                         {item?.date
//                           ? new Date(item.date).toLocaleDateString("en-IN")
//                           : new Date(order.createdAt).toLocaleDateString(
//                               "en-IN",
//                             )}
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//                 <div className="text-right font-bold text-green-700">
//                   Total: ₹{formatINR(order.total)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}
//     </ReportPage>
//   );
// };

// export default Inventory;




import { useEffect, useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import InventoryReportPdf from "./pdf/InventoryReportPdf";
import { exportToExcel } from "../utils/exportToExcel";
import { fetchReport, MONTHS, YEARS, formatINR } from "../utils/reportFetch";

/*
  Inventory report (premium revamp).
  Same data and API as before: fetchReport("inventory", { month, year }),
  POST /api/report/inventory with { items, total }, Excel export and PDF export.
  The design lives in this file, so it no longer uses ./reports/ReportUI.
*/

const PAGE_SIZE = 10;
const BAR_COLORS = ["bg-[#0B4BAA]", "bg-[#00C2CB]", "bg-amber-400", "bg-emerald-500", "bg-rose-400", "bg-slate-400"];

const rupee = (n) => `₹${formatINR(n)}`;
const compact = (n) => {
  const v = Math.abs(n);
  if (v >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
  if (v >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
  return `₹${Math.round(n)}`;
};
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const newItem = () => ({ id: Date.now() + Math.random(), name: "", date: todayISO(), quantity: "", unitPrice: "" });
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "-");

const Icon = ({ d, className = "h-5 w-5" }) => (
  <svg className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
);

const ICONS = {
  plus: "M12 5v14M5 12h14",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  search: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z",
  close: "M6 18L18 6M6 6l12 12",
  chevron: "M9 18l6-6-6-6",
  trash: "M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  alert: "M12 8v4M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  check: "M20 6L9 17l-5-5",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  box: "M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  layers: "M12 2l10 5-10 5L2 7l10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-[15px] text-slate-800 placeholder-slate-400 outline-none transition hover:border-slate-400 focus:border-[#0B4BAA] focus:ring-4 focus:ring-[#00C2CB]/20";
const selectClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-400 focus:border-[#0B4BAA] focus:ring-4 focus:ring-[#00C2CB]/20";

/* ------------------------------ building blocks ------------------------------ */

const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${className}`}>{children}</div>
);

const CardTitle = ({ title, sub }) => (
  <div className="mb-4">
    <h3 className="text-base font-bold tracking-tight text-slate-800">{title}</h3>
    {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
  </div>
);

const TONES = {
  blue: "bg-[#0B4BAA]/10 text-[#0B4BAA]",
  cyan: "bg-[#00C2CB]/15 text-[#0A8F96]",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

const Kpi = ({ icon, label, value, hint, tone, valueClass = "text-slate-900" }) => (
  <Card>
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${TONES[tone]}`}>
        <Icon d={icon} />
      </span>
    </div>
    <p className={`mt-3 truncate text-2xl font-extrabold tracking-tight sm:text-[28px] ${valueClass}`}>{value}</p>
    <p className="mt-1 truncate text-[13px] text-slate-500">{hint}</p>
  </Card>
);

const TrendChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <div className="flex h-56 items-end gap-2 sm:gap-3" role="img" aria-label={`Inventory purchases per month: ${data.map((d) => `${d.label} ${compact(d.total)}`).join(", ")}`}>
      {data.map((d, i) => (
        <div key={d.key} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-[11px] font-semibold text-slate-600">{compact(d.total)}</span>
          <div className="flex w-full flex-1 items-end">
            <div
              className={`w-full rounded-t-lg transition-all ${i === data.length - 1 ? "bg-gradient-to-t from-[#0B4BAA] to-[#00C2CB]" : "bg-[#0B4BAA]/20 group-hover:bg-[#0B4BAA]/40"}`}
              style={{ height: `${Math.max((d.total / max) * 100, 3)}%` }}
              title={`${d.label}: ${rupee(d.total)}`}
            />
          </div>
          <span className="text-xs font-medium text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------ page ------------------------------ */

const Inventory = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState({});

  // add-purchase form (slide-over panel)
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([newItem()]);
  const [saving, setSaving] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const [pdfBusy, setPdfBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* ---------- data ---------- */
  const fetchInventoryData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchReport("inventory", { month: selectedMonth, year: selectedYear });
      setInventoryData(data);
    } catch (err) {
      console.error("Error fetching Inventory data:", err);
      setError("Failed to load inventory records. Please try again.");
      setInventoryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    setPage(1);
  }, [selectedMonth, selectedYear, query, sortBy]);

  useEffect(() => {
    if (!showForm) return;
    const onKey = (e) => e.key === "Escape" && !saving && setShowForm(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showForm, saving]);

  /* ---------- derived ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inventoryData;
    return inventoryData.filter((e) => (e.items || []).some((i) => (i.name || "").toLowerCase().includes(q)));
  }, [inventoryData, query]);

  const stats = useMemo(() => {
    const count = filtered.length;
    const total = filtered.reduce((s, e) => s + (e.total || 0), 0);
    let units = 0;
    const itemMap = {};
    const monthMap = {};
    filtered.forEach((e) => {
      const d = new Date(e.createdAt);
      if (!isNaN(d)) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthMap[key] = monthMap[key] || { key, label: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }), total: 0 };
        monthMap[key].total += e.total || 0;
      }
      (e.items || []).forEach((it) => {
        const qty = Number(it.quantity) || 0;
        const spend = qty * (Number(it.unitPrice) || 0);
        units += qty;
        const label = (it.name || "Unnamed").trim() || "Unnamed";
        const key = label.toLowerCase();
        itemMap[key] = itemMap[key] || { name: label, qty: 0, spend: 0 };
        itemMap[key].qty += qty;
        itemMap[key].spend += spend;
      });
    });
    const topItems = Object.values(itemMap).sort((a, b) => b.spend - a.spend);
    return {
      count,
      total,
      units,
      distinct: topItems.length,
      avg: count ? total / count : 0,
      topItems,
      top: topItems[0],
      months: Object.values(monthMap).sort((a, b) => a.key.localeCompare(b.key)).slice(-12),
    };
  }, [filtered]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      if (sortBy === "highest") return (b.total || 0) - (a.total || 0);
      const d = new Date(b.createdAt) - new Date(a.createdAt);
      return sortBy === "oldest" ? -d : d;
    });
    return list;
  }, [filtered, sortBy]);

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const rows = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const itemSuggestions = useMemo(() => {
    const set = new Set();
    inventoryData.forEach((e) => (e.items || []).forEach((i) => i.name && set.add(i.name.trim())));
    return [...set];
  }, [inventoryData]);

  const monthName = selectedMonth ? MONTHS.find((m) => String(m.value) === String(selectedMonth))?.label : null;
  const periodLabel = monthName && selectedYear ? `${monthName} ${selectedYear}` : selectedYear ? `Year ${selectedYear}` : monthName ? `${monthName} (all years)` : "All time";

  /* ---------- form ---------- */
  const lineTotal = (i) => (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0);
  const formTotal = items.reduce((s, i) => s + lineTotal(i), 0);
  const validItems = items.filter((i) => i.name.trim() && Number(i.quantity) > 0 && Number(i.unitPrice) > 0);
  const formErrors = [];
  if (validItems.length === 0) formErrors.push("Add at least one item with a name, a quantity and a unit price.");
  if (items.some((i) => !i.date)) formErrors.push("Every item needs a date.");

  const openForm = () => {
    setAttempted(false);
    setShowForm(true);
  };
  const updateItem = (id, key, val) => setItems((list) => list.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  const removeItem = (id) => setItems((list) => (list.length > 1 ? list.filter((r) => r.id !== id) : list));

  const handleSubmit = async () => {
    setAttempted(true);
    if (formErrors.length) return;
    setSaving(true);

    const formData = {
      items: validItems.map((i) => ({
        name: i.name.trim(),
        date: i.date,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
      })),
      total: validItems.reduce((s, i) => s + lineTotal(i), 0),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/report/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok || result?.success === false) {
        showToast(result?.message || "Failed to submit inventory", "error");
      } else {
        showToast(result?.message || "Purchase saved");
        setShowForm(false);
        setItems([newItem()]);
        setAttempted(false);
        fetchInventoryData();
      }
    } catch (err) {
      console.error("Error submitting inventory:", err);
      showToast("Failed to submit inventory", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- exports ---------- */
  const downloadInventoryExcel = () => {
    const excelRows = filtered.flatMap((entry) =>
      (entry.items || []).map((item, index) => ({
        Date: index === 0 ? new Date(entry.createdAt).toLocaleDateString("en-IN") : "",
        "Item Name": item.name,
        Qty: item.quantity,
        "Unit Price": item.unitPrice,
        Subtotal: item.quantity * item.unitPrice,
        "Entry Total": index === 0 ? entry.total : "",
      }))
    );
    exportToExcel({
      data: excelRows,
      fileName: `Inventory_Report_${selectedMonth || "All_Months"}_${selectedYear || "All_Years"}`,
      sheetName: "Inventory",
    });
  };

  // The PDF is built only when you click, so changing filters stays fast
  const downloadInventoryPdf = async () => {
    setPdfBusy(true);
    try {
      const blob = await pdf(<InventoryReportPdf inventory={filtered} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Inventory_Report_${selectedMonth || "All_Month"}_${selectedYear || "All_Year"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
      showToast("Could not create the PDF. Please try again.", "error");
    } finally {
      setPdfBusy(false);
    }
  };

  const noData = !loading && !error && filtered.length === 0;

  return (
    <div className="space-y-6">
      <style>{`@keyframes invSlide{from{transform:translateX(28px);opacity:0}to{transform:none;opacity:1}}`}</style>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Inventory</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            Showing
            <span className="rounded-full bg-[#0B4BAA]/10 px-2.5 py-0.5 text-xs font-bold text-[#0B4BAA]">{periodLabel}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <select aria-label="Month" value={selectedMonth || ""} onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : null)} className={selectClass}>
            <option value="">All Months</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select aria-label="Year" value={selectedYear || ""} onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)} className={selectClass}>
            <option value="">All Years</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={downloadInventoryExcel}
            disabled={!filtered.length}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-emerald-700"
          >
            <Icon d={ICONS.download} className="h-4 w-4" /> Excel
          </button>
          <button
            onClick={downloadInventoryPdf}
            disabled={!filtered.length || pdfBusy}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-600 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pdfBusy ? <AiOutlineLoading3Quarters className="animate-spin" /> : <Icon d={ICONS.download} className="h-4 w-4" />}
            {pdfBusy ? "Preparing..." : "PDF"}
          </button>
          <button
            onClick={openForm}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B4BAA] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-[#0B4BAA]/30 transition hover:bg-[#093d8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2"
          >
            <Icon d={ICONS.plus} className="h-4 w-4" /> Add purchase
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading inventory">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl bg-slate-200" />)}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-72 rounded-2xl bg-slate-200 lg:col-span-2" />
            <div className="h-72 rounded-2xl bg-slate-200" />
          </div>
        </div>
      ) : error ? (
        <Card className="text-center">
          <p className="text-base font-bold text-slate-800">{error}</p>
          <button
            onClick={fetchInventoryData}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0B4BAA] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#093d8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2"
          >
            <Icon d={ICONS.refresh} className="h-4 w-4" /> Try again
          </button>
        </Card>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={ICONS.box} tone="blue" label="Inventory value" value={rupee(stats.total)} hint="Total cost in this view" valueClass="text-[#0B4BAA]" />
            <Kpi icon={ICONS.list} tone="cyan" label="Purchases" value={stats.count} hint={`Average ${rupee(stats.avg)} per purchase`} />
            <Kpi icon={ICONS.layers} tone="amber" label="Units bought" value={stats.units.toLocaleString("en-IN")} hint={`${stats.distinct} different ${stats.distinct === 1 ? "item" : "items"}`} />
            <Kpi icon={ICONS.star} tone="emerald" label="Top item by spend" value={stats.top ? stats.top.name : "-"} hint={stats.top ? `${rupee(stats.top.spend)} · ${stats.top.qty} units` : "No data yet"} />
          </div>

          {noData ? (
            <Card className="py-14 text-center">
              <p className="text-lg font-semibold text-slate-700">No inventory records found</p>
              <p className="mt-1 text-sm text-slate-400">Try another period or clear the search, or add a purchase.</p>
              <button onClick={openForm} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0B4BAA] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#093d8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2">
                <Icon d={ICONS.plus} className="h-4 w-4" /> Add purchase
              </button>
            </Card>
          ) : (
            <>
              {/* Trend + top items */}
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardTitle title="Purchases by month" sub="Last 12 months in this view" />
                  {stats.months.length ? <TrendChart data={stats.months} /> : <p className="py-10 text-center text-sm text-slate-400">No dated entries</p>}
                </Card>
                <Card>
                  <CardTitle title="Top items by spend" sub="Share of total cost" />
                  <ul className="space-y-4">
                    {stats.topItems.slice(0, 6).map((it, i) => {
                      const pct = stats.total ? (it.spend / stats.total) * 100 : 0;
                      return (
                        <li key={it.name}>
                          <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                            <span className="truncate font-semibold text-slate-700">{it.name}</span>
                            <span className="shrink-0 text-slate-500"><b className="text-slate-800">{rupee(it.spend)}</b> · {pct.toFixed(0)}%</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} style={{ width: `${pct}%` }} />
                          </div>
                          <p className="mt-1 text-xs text-slate-400">{it.qty} units</p>
                        </li>
                      );
                    })}
                  </ul>
                  {stats.topItems.length > 6 && <p className="mt-4 text-xs text-slate-400">+ {stats.topItems.length - 6} more items</p>}
                </Card>
              </div>

              {/* Table */}
              <Card className="!p-0">
                <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">All purchases</h3>
                    <p className="text-sm text-slate-500">Select a row to see its items.</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <div className="relative">
                      <Icon d={ICONS.search} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by item name"
                        aria-label="Search inventory"
                        className="w-60 rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#0B4BAA] focus:ring-4 focus:ring-[#00C2CB]/20"
                      />
                    </div>
                    <select aria-label="Sort purchases" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="highest">Highest value</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <th className="w-10 px-4 py-3" />
                        <th className="px-3 py-3 font-semibold">Date</th>
                        <th className="px-3 py-3 font-semibold">Items</th>
                        <th className="px-3 py-3 text-right font-semibold">Units</th>
                        <th className="px-4 py-3 text-right font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((order) => {
                        const isOpen = !!open[order._id];
                        const list = order.items || [];
                        const names = list.map((i) => i.name).filter(Boolean);
                        const units = list.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
                        const toggle = () => setOpen((o) => ({ ...o, [order._id]: !o[order._id] }));
                        return (
                          <InventoryRows key={order._id}>
                            <tr onClick={toggle} className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50">
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  aria-expanded={isOpen}
                                  aria-label={`${isOpen ? "Hide" : "Show"} items of purchase on ${fmtDate(order.createdAt)}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggle();
                                  }}
                                  className="rounded p-1 text-slate-400 transition hover:text-[#0B4BAA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]"
                                >
                                  <Icon d={ICONS.chevron} className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                                </button>
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-slate-600">{fmtDate(order.createdAt)}</td>
                              <td className="max-w-[320px] px-3 py-3">
                                <p className="truncate font-semibold text-slate-800">
                                  {names.slice(0, 2).join(", ") || "-"}
                                  {names.length > 2 && <span className="font-medium text-slate-400"> +{names.length - 2} more</span>}
                                </p>
                                <p className="text-xs text-slate-400">{list.length} {list.length === 1 ? "item" : "items"}</p>
                              </td>
                              <td className="px-3 py-3 text-right text-slate-600">{units}</td>
                              <td className="px-4 py-3 text-right font-bold text-[#0B4BAA]">{rupee(order.total)}</td>
                            </tr>
                            {isOpen && (
                              <tr className="bg-slate-50/70">
                                <td />
                                <td colSpan={4} className="px-3 py-3">
                                  <table className="w-full max-w-2xl text-sm">
                                    <thead>
                                      <tr className="text-xs uppercase tracking-wider text-slate-400">
                                        <th className="py-1.5 text-left font-semibold">Item</th>
                                        <th className="py-1.5 text-left font-semibold">Date</th>
                                        <th className="py-1.5 text-right font-semibold">Qty</th>
                                        <th className="py-1.5 text-right font-semibold">Unit price</th>
                                        <th className="py-1.5 text-right font-semibold">Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {list.map((item, i) => (
                                        <tr key={item._id || i} className="border-t border-slate-200/70">
                                          <td className="py-1.5 text-slate-700">{item.name}</td>
                                          <td className="py-1.5 text-slate-500">{fmtDate(item.date || order.createdAt)}</td>
                                          <td className="py-1.5 text-right text-slate-600">{item.quantity}</td>
                                          <td className="py-1.5 text-right text-slate-600">{rupee(item.unitPrice)}</td>
                                          <td className="py-1.5 text-right font-semibold text-slate-800">{rupee(item.quantity * item.unitPrice)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
                          </InventoryRows>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row">
                  <span>
                    Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length} purchases
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(safePage - 1)}
                      disabled={safePage <= 1}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="px-1 font-medium text-slate-700">Page {safePage} of {pages}</span>
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
            </>
          )}
        </>
      )}

      {/* Add purchase panel */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-[65] bg-slate-900/40" onClick={() => !saving && setShowForm(false)} />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Add inventory purchase"
            style={{ animation: "invSlide .2s ease-out" }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-lg flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-gradient-to-br from-[#0B4BAA] to-[#082F6B] px-6 py-5 text-white">
              <div>
                <h2 className="text-lg font-bold">Add inventory purchase</h2>
                <p className="text-sm text-blue-100">Record the items you bought.</p>
              </div>
              <button onClick={() => !saving && setShowForm(false)} aria-label="Close panel" className="rounded-lg p-1.5 text-blue-100 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <Icon d={ICONS.close} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              <datalist id="inv-items">
                {itemSuggestions.map((n) => <option key={n} value={n} />)}
              </datalist>

              {items.map((it, idx) => (
                <div key={it.id} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Item {idx + 1}</p>
                    <button
                      type="button"
                      aria-label={`Remove item ${idx + 1}`}
                      onClick={() => removeItem(it.id)}
                      disabled={items.length === 1}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    >
                      <Icon d={ICONS.trash} className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      aria-label={`Item ${idx + 1} name`}
                      list="inv-items"
                      value={it.name}
                      onChange={(e) => updateItem(it.id, "name", e.target.value)}
                      placeholder="Item name"
                      autoComplete="off"
                      className={inputClass}
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-500">Date</label>
                        <input type="date" aria-label={`Item ${idx + 1} date`} value={it.date} onChange={(e) => updateItem(it.id, "date", e.target.value)} className={`${inputClass} !px-2.5`} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-500">Quantity</label>
                        <input type="number" inputMode="numeric" min="0" aria-label={`Item ${idx + 1} quantity`} value={it.quantity} onChange={(e) => updateItem(it.id, "quantity", e.target.value)} placeholder="0" className={inputClass} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-500">Unit price</label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
                          <input type="number" inputMode="decimal" min="0" step="any" aria-label={`Item ${idx + 1} unit price`} value={it.unitPrice} onChange={(e) => updateItem(it.id, "unitPrice", e.target.value)} placeholder="0" className={`${inputClass} pl-7`} />
                        </div>
                      </div>
                    </div>
                    <p className="text-right text-sm text-slate-500">Line total <b className="text-slate-800">{rupee(lineTotal(it))}</b></p>
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => setItems((l) => [...l, newItem()])} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-[#0B4BAA] transition hover:border-[#0B4BAA] hover:bg-[#E6F9FA]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]">
                <Icon d={ICONS.plus} className="h-4 w-4" /> Add another item
              </button>

              {attempted && formErrors.length > 0 && (
                <ul role="alert" className="space-y-1 rounded-xl bg-rose-50 p-3.5 text-sm font-medium text-rose-800 ring-1 ring-rose-200">
                  {formErrors.map((e) => (
                    <li key={e} className="flex gap-2"><Icon d={ICONS.alert} className="mt-0.5 h-4 w-4" /> {e}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Inventory value</p>
                <p className="text-xl font-extrabold text-slate-900">{rupee(formTotal)}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => !saving && setShowForm(false)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B4BAA] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0B4BAA]/30 transition hover:bg-[#093d8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving && <AiOutlineLoading3Quarters className="animate-spin" />}
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {toast && (
        <div role={toast.type === "error" ? "alert" : "status"} className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${toast.type === "error" ? "bg-rose-600" : "bg-slate-900"}`}>
          <Icon d={toast.type === "error" ? ICONS.alert : ICONS.check} className="h-5 w-5" />
          {toast.text}
        </div>
      )}
    </div>
  );
};

// Lets one purchase render as two table rows without an extra wrapper element
const InventoryRows = ({ children }) => <>{children}</>;

export default Inventory;
