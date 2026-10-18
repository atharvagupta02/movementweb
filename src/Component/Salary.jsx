// // import { useState, useEffect, useCallback } from "react";
// // import SalaryReportPdf from "./pdf/SalaryReportPdf";
// // import { MdEdit, MdClose } from "react-icons/md";
// // import { exportToExcel } from "../utils/exportToExcel";
// // import { fetchReport, MONTHS, YEARS, formatINR } from "../utils/reportFetch";
// // import {
// //   ReportPage,
// //   Card,
// //   ReportToolbar,
// //   Tile,
// //   TallyLine,
// //   Loading,
// //   ErrorState,
// //   EmptyState,
// //   EXCEL_BTN,
// //   PRIMARY_BTN,
// // } from "./reports/ReportUI";

// // // "YYYY-MM" of the current month — used as the default pay month for a new row.
// // const currentPayMonth = () => {
// //   const now = new Date();
// //   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
// // };

// // const blankEmployee = () => ({
// //   name: "",
// //   role: "",
// //   month: currentPayMonth(),
// //   salary: 0,
// //   paid: false,
// // });

// // const Salary = () => {
// //   const [employees, setEmployees] = useState([blankEmployee()]);

// //   const [selectedMonth, setSelectedMonth] = useState("");
// //   const [selectedYear, setSelectedYear] = useState("");

// //   const handleChange = (index, field, value) => {
// //     const updated = [...employees];
// //     updated[index][field] =
// //       field === "salary"
// //         ? Number(value)
// //         : field === "paid"
// //           ? value === "true"
// //           : value;
// //     setEmployees(updated);
// //   };

// //   const addEmployee = () => {
// //     setEmployees([...employees, blankEmployee()]);
// //   };

// //   const totalSalary = employees.reduce(
// //     (sum, emp) => sum + (Number(emp.salary) || 0),
// //     0,
// //   );

// //   const [salaryData, setSalaryData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [activeDropdown, setActiveDropdown] = useState(null);

// //   const [editId, setEditId] = useState(null);
// //   const [updateStatus, setUpdateStatus] = useState(null);

// //   const [allEmployeeData, setAllEmployeeData] = useState([]);

// //   const filteredEmployeeOptions = (searchValue) => {
// //     return allEmployeeData.filter((emp) =>
// //       emp?.personalDetails?.fullName
// //         ?.toLowerCase()
// //         .includes(searchValue.toLowerCase()),
// //     );
// //   };

// //   const handleEmployeeSelect = (index, employee) => {
// //     const updated = [...employees];

// //     updated[index] = {
// //       ...updated[index],
// //       name: employee?.personalDetails?.fullName || "",
// //       role: employee?.personalDetails?.qualification || "",
// //     };

// //     setEmployees(updated);
// //     setActiveDropdown(null);
// //   };

// //   // Server-side filtered: each entry already contains only the matching
// //   // employees with a recomputed totalSalary, so we render/total it directly.
// //   const fetchSalaryData = useCallback(async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const data = await fetchReport("salary", {
// //         month: selectedMonth,
// //         year: selectedYear,
// //       });
// //       setSalaryData(data);
// //     } catch (err) {
// //       console.error("Error fetching salary data:", err);
// //       setError("Failed to load salary data. Please try again.");
// //       setSalaryData([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [selectedMonth, selectedYear]);

// //   const fetchAllEmployees = async () => {
// //     try {
// //       const response = await fetch(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/employee/getAllEmployee`,
// //       );

// //       const result = await response.json();

// //       if (result.success && result.employees.length > 0) {
// //         setAllEmployeeData(result?.employees);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching employee data:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchSalaryData();
// //   }, [fetchSalaryData]);

// //   useEffect(() => {
// //     fetchAllEmployees();
// //   }, []);

// //   const handleSubmit = async () => {
// //     const payload = {
// //       employees,
// //       totalSalary,
// //     };

// //     try {
// //       const response = await fetch(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/report/salary`,
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify(payload),
// //         },
// //       );

// //       const result = await response.json();
// //       fetchSalaryData();
// //       alert(result.message || "Salary report saved successfully!");
// //       setEmployees([blankEmployee()]);
// //     } catch (error) {
// //       console.error(error);
// //       alert("Error saving salary report. Please try again later.");
// //     }
// //   };

// //   const updatePaidStatus = async (entryId, empId, paid) => {
// //     try {
// //       const response = await fetch(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/report/salary/${entryId}/${empId}`,
// //         {
// //           method: "PUT", // ✅ using PUT now
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify({ paid }),
// //         },
// //       );

// //       const result = await response.json();

// //       if (result.success) {
// //         fetchSalaryData();
// //         setEditId(null);
// //         setUpdateStatus(null);
// //       } else {
// //         alert("Failed to update status");
// //       }
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   const totalFiltered = salaryData.reduce(
// //     (sum, entry) => sum + (Number(entry.totalSalary) || 0),
// //     0,
// //   );

// //   const paidTotal = salaryData.reduce(
// //     (sum, entry) =>
// //       sum +
// //       entry.employees
// //         .filter((e) => e.paid)
// //         .reduce((s, e) => s + (Number(e.salary) || 0), 0),
// //     0,
// //   );
// //   const unpaidTotal = salaryData.reduce(
// //     (sum, entry) =>
// //       sum +
// //       entry.employees
// //         .filter((e) => !e.paid)
// //         .reduce((s, e) => s + (Number(e.salary) || 0), 0),
// //     0,
// //   );

// //   const monthName = MONTHS.find(
// //     (m) => String(m.value) === String(selectedMonth),
// //   )?.label;
// //   const periodLabel =
// //     selectedMonth && selectedYear
// //       ? `${monthName} ${selectedYear}`
// //       : !selectedMonth && selectedYear
// //         ? `Year ${selectedYear}`
// //         : selectedMonth && !selectedYear
// //           ? `${monthName} (all years)`
// //           : "All time";

// //   useEffect(() => {
// //     const handleClickOutside = () => {
// //       setActiveDropdown(null);
// //     };

// //     window.addEventListener("click", handleClickOutside);
// //     return () => window.removeEventListener("click", handleClickOutside);
// //   }, []);

// //   const downloadSalaryExcel = () => {
// //     const rows = salaryData.flatMap((entry) =>
// //       entry.employees.map((emp, index) => ({
// //         Date:
// //           index === 0
// //             ? new Date(entry.createdAt).toLocaleDateString("en-IN")
// //             : "",
// //         Name: emp.name,
// //         Role: emp.role,
// //         Month: emp.month,
// //         Salary: emp.salary,
// //         Status: emp.paid ? "Paid" : "Unpaid",
// //         "Entry Total": index === 0 ? entry.totalSalary : "",
// //       })),
// //     );

// //     exportToExcel({
// //       data: rows,
// //       fileName: `Salary_Report_${selectedMonth || "All"}_${selectedYear || "All"}`,
// //       sheetName: "Salary",
// //     });
// //   };

// //   return (
// //     <ReportPage>
// //       <ReportToolbar title="Salary" periodLabel={periodLabel}>
// //         <select
// //           className="border p-2 rounded text-sm"
// //           value={selectedMonth}
// //           onChange={(e) => setSelectedMonth(e.target.value)}
// //         >
// //           <option value="">All Months</option>
// //           {MONTHS.map((m) => (
// //             <option key={m.value} value={m.value}>
// //               {m.label}
// //             </option>
// //           ))}
// //         </select>
// //         <select
// //           className="border p-2 rounded text-sm"
// //           value={selectedYear}
// //           onChange={(e) => setSelectedYear(e.target.value)}
// //         >
// //           <option value="">All Years</option>
// //           {YEARS.map((y) => (
// //             <option key={y} value={y}>
// //               {y}
// //             </option>
// //           ))}
// //         </select>
// //         <button onClick={downloadSalaryExcel} className={EXCEL_BTN}>
// //           Download Excel
// //         </button>
// //         <SalaryReportPdf
// //           filteredEntries={salaryData}
// //           selectedMonth={selectedMonth}
// //           selectedYear={selectedYear}
// //           totalFiltered={totalFiltered}
// //           paidTotal={paidTotal}
// //           unpaidTotal={unpaidTotal}
// //         />
// //       </ReportToolbar>

// //       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //         <Tile emoji="👥" label="Total Salary" value={totalFiltered} tone="gray" />
// //         <Tile emoji="✅" label="Paid" value={paidTotal} tone="emerald" />
// //         <Tile emoji="⏳" label="Unpaid" value={unpaidTotal} tone="rose" />
// //       </div>

// //       <TallyLine
// //         text={`Paid ₹${formatINR(paidTotal)} + Unpaid ₹${formatINR(
// //           unpaidTotal,
// //         )} = Total ₹${formatINR(totalFiltered)}`}
// //       />

// //       {/* Salary Form */}
// //       <Card>
// //         <h2 className="text-xl font-bold text-gray-800 mb-6">
// //           Add Salary Sheet
// //         </h2>

// //         <div className="overflow-x-auto">
// //           <table className="w-full text-left mb-4">
// //             <thead>
// //               <tr className="bg-gray-200">
// //                 <th className="p-2">Employee Name</th>
// //                 <th className="p-2">Role</th>
// //                 <th className="p-2">Month</th>
// //                 <th className="p-2">Salary</th>
// //                 <th className="p-2">Status</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {employees.map((emp, idx) => (
// //                 <tr key={idx} className="border-b">
// //                   <td className="p-2">
// //                     <div className="relative">
// //                       <input
// //                         type="text"
// //                         value={emp.name}
// //                         onChange={(e) => {
// //                           handleChange(idx, "name", e.target.value);
// //                           setActiveDropdown(idx);
// //                         }}
// //                         onClick={(e) => e.stopPropagation()}
// //                         onFocus={() => setActiveDropdown(idx)}
// //                         placeholder="Employee name"
// //                         className="w-full border border-gray-300 p-2 rounded"
// //                       />

// //                       {activeDropdown === idx && (
// //                         <div
// //                           onClick={(e) => e.stopPropagation()}
// //                           className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow max-h-40 overflow-y-auto"
// //                         >
// //                           {filteredEmployeeOptions(emp.name).map((employee) => (
// //                             <div
// //                               key={employee._id}
// //                               onClick={() =>
// //                                 handleEmployeeSelect(idx, employee)
// //                               }
// //                               className="px-3 py-2 cursor-pointer hover:bg-blue-100"
// //                             >
// //                               <p className="font-medium text-sm text-gray-800">
// //                                 {employee?.personalDetails?.fullName}
// //                               </p>
// //                               <p className="text-xs text-gray-500">
// //                                 {employee?.personalDetails?.qualification ||
// //                                   "No qualification"}
// //                               </p>
// //                             </div>
// //                           ))}

// //                           {filteredEmployeeOptions(emp.name).length === 0 && (
// //                             <div className="px-3 py-2 text-gray-400 text-sm">
// //                               No employee found
// //                             </div>
// //                           )}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </td>
// //                   <td className="p-2">
// //                     <input
// //                       type="text"
// //                       value={emp.role}
// //                       onChange={(e) =>
// //                         handleChange(idx, "role", e.target.value)
// //                       }
// //                       placeholder="e.g. Therapist"
// //                       className="w-full border border-gray-300 p-1 rounded"
// //                     />
// //                   </td>
// //                   <td className="p-2">
// //                     <input
// //                       type="month"
// //                       value={emp.month}
// //                       onChange={(e) =>
// //                         handleChange(idx, "month", e.target.value)
// //                       }
// //                       className="w-full border border-gray-300 p-1 rounded"
// //                     />
// //                   </td>
// //                   <td className="p-2">
// //                     <input
// //                       type="number"
// //                       value={emp.salary}
// //                       min={0}
// //                       onChange={(e) =>
// //                         handleChange(idx, "salary", e.target.value)
// //                       }
// //                       className="w-full border border-gray-300 p-1 rounded"
// //                     />
// //                   </td>
// //                   <td className="p-2">
// //                     <select
// //                       value={emp.paid ? "true" : "false"}
// //                       onChange={(e) =>
// //                         handleChange(idx, "paid", e.target.value)
// //                       }
// //                       className="w-full border border-gray-300 p-1 rounded"
// //                     >
// //                       <option value="false">Unpaid</option>
// //                       <option value="true">Paid</option>
// //                     </select>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         <button
// //           onClick={addEmployee}
// //           className="mb-4 bg-blue-100 text-blue-700 px-3 py-1 rounded"
// //         >
// //           + Add Employee
// //         </button>

// //         <div className="text-right text-lg font-bold mt-2 mb-6">
// //           Total Salary: ₹{formatINR(totalSalary)}
// //         </div>

// //         <div className="flex justify-end space-x-4">
// //           <button onClick={handleSubmit} className={PRIMARY_BTN}>
// //             Save
// //           </button>
// //         </div>
// //       </Card>

// //       {loading ? (
// //         <Loading />
// //       ) : error ? (
// //         <ErrorState message={error} />
// //       ) : salaryData.length === 0 ? (
// //         <EmptyState label="No salary records for this period." />
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //           {salaryData.map((entry) => (
// //             <div
// //               key={entry._id}
// //               className="bg-white border border-gray-200 rounded-xl shadow p-4"
// //             >
// //               <h2 className="text-lg font-semibold text-blue-700 mb-2">
// //                 Salary Sheet
// //               </h2>
// //               <p className="text-sm text-gray-500 mb-1">
// //                 Date: {new Date(entry.createdAt).toLocaleDateString("en-IN")}
// //               </p>
// //               <div className="mb-3">
// //                 {entry.employees.map((emp) => (
// //                   <div
// //                     key={emp._id}
// //                     className="border-t border-gray-200 pt-2 mt-2 text-sm text-gray-700"
// //                   >
// //                     <div className="flex emps-center justify-between">
// //                       <p>
// //                         <span className="font-medium">Name:</span> {emp.name}
// //                       </p>
// //                       <button
// //                         onClick={() => {
// //                           setEditId(editId === emp._id ? null : emp._id);
// //                           setUpdateStatus(emp?.paid);
// //                         }}
// //                         className="p-1 rounded hover:bg-gray-100"
// //                       >
// //                         {editId === emp._id ? (
// //                           <MdClose size={18} className="text-red-500" />
// //                         ) : (
// //                           <MdEdit size={18} className="text-blue-500" />
// //                         )}
// //                       </button>
// //                     </div>
// //                     <p>
// //                       <span className="font-medium">Role:</span> {emp.role}
// //                     </p>
// //                     <p>
// //                       <span className="font-medium">Month:</span> {emp.month}
// //                     </p>
// //                     <p>
// //                       <span className="font-medium">Salary:</span> ₹
// //                       {formatINR(emp.salary)}
// //                     </p>
// //                     {editId === emp._id ? (
// //                       <div className="text-sm">
// //                         Paid:
// //                         <select
// //                           value={updateStatus ? "true" : "false"}
// //                           onChange={(e) =>
// //                             setUpdateStatus(e.target.value === "true")
// //                           }
// //                           className="ml-2 border px-2 py-1 rounded"
// //                         >
// //                           <option value="true">Paid</option>
// //                           <option value="false">Unpaid</option>
// //                         </select>
// //                         <button
// //                           disabled={updateStatus === emp.paid}
// //                           onClick={() =>
// //                             updatePaidStatus(entry._id, emp._id, updateStatus)
// //                           }
// //                           className={`px-2 py-1 rounded text-xs ml-2 ${
// //                             updateStatus === emp.paid
// //                               ? "bg-gray-300 cursor-not-allowed"
// //                               : "bg-green-600 text-white"
// //                           }`}
// //                         >
// //                           OK
// //                         </button>
// //                       </div>
// //                     ) : (
// //                       <p className="text-sm">
// //                         Paid:{" "}
// //                         <span
// //                           className={`font-semibold ${
// //                             emp.paid ? "text-green-600" : "text-red-600"
// //                           }`}
// //                         >
// //                           {emp.paid ? "Paid" : "Unpaid"}
// //                         </span>
// //                       </p>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //               <div className="text-right text-indigo-700 font-bold">
// //                 Total Salary: ₹{formatINR(entry.totalSalary)}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </ReportPage>
// //   );
// // };

// // export default Salary;


// import { useState, useEffect, useCallback } from "react";
// import SalaryReportPdf from "./pdf/SalaryReportPdf";
// import {
//   MdEdit,
//   MdClose,
//   MdCheck,
//   MdAdd,
//   MdDeleteOutline,
//   MdFileDownload,
//   MdCheckCircle,
//   MdErrorOutline,
//   MdPayments,
//   MdPendingActions,
//   MdPeople,
//   MdTrendingUp,
//   MdTaskAlt,
// } from "react-icons/md";
// import { exportToExcel } from "../utils/exportToExcel";
// import { fetchReport, MONTHS, YEARS, formatINR } from "../utils/reportFetch";

// /* ------------------------------------------------------------------ */
// /* Design tokens (shared look with the Rent page)                      */
// /* ------------------------------------------------------------------ */
// const FIELD =
//   "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10";
// const SELECT = `${FIELD} sm:w-auto sm:min-w-[9.5rem]`;
// const BTN_PRIMARY =
//   "inline-flex items-center justify-center rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30";
// const BTN_OUTLINE =
//   "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20";
// const BTN_GHOST =
//   "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20";

// const STATUS = {
//   Paid: {
//     dot: "bg-emerald-500",
//     pill: "bg-emerald-50 text-emerald-800 ring-emerald-600/15",
//     bar: "bg-emerald-400",
//   },
//   Unpaid: {
//     dot: "bg-rose-500",
//     pill: "bg-rose-50 text-rose-800 ring-rose-600/15",
//     bar: "bg-rose-400",
//   },
// };

// const formatMonth = (value) => {
//   // Pay month is stored as "YYYY-MM"; show it as "Mar 2026". Anything else is shown as-is.
//   if (/^\d{4}-\d{2}$/.test(value || "")) {
//     const [y, m] = value.split("-");
//     return new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-IN", {
//       month: "short",
//       year: "numeric",
//     });
//   }
//   return value || "-";
// };

// const formatDate = (value) =>
//   new Date(value).toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });

// // "YYYY-MM" of the current month — used as the default pay month for a new row.
// const currentPayMonth = () => {
//   const now = new Date();
//   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
// };

// const blankEmployee = () => ({
//   name: "",
//   role: "",
//   month: currentPayMonth(),
//   salary: 0,
//   paid: false,
// });

// /* ------------------------------------------------------------------ */
// /* Small presentational pieces                                         */
// /* ------------------------------------------------------------------ */
// const Panel = ({ title, description, aside, children, className = "" }) => (
//   <section
//     className={`rounded-xl border border-slate-200/80 bg-white shadow-sm ${className}`}
//   >
//     {title && (
//       <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-6 py-4">
//         <div>
//           <h2 className="text-base font-semibold tracking-tight text-slate-900">
//             {title}
//           </h2>
//           {description && (
//             <p className="mt-0.5 text-sm text-slate-500">{description}</p>
//           )}
//         </div>
//         {aside}
//       </header>
//     )}
//     {children}
//   </section>
// );

// const StatusPill = ({ paid }) => {
//   const key = paid ? "Paid" : "Unpaid";
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS[key].pill}`}
//     >
//       <span className={`h-1.5 w-1.5 rounded-full ${STATUS[key].dot}`} />
//       {key}
//     </span>
//   );
// };

// const Initial = ({ name }) => (
//   <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-sm font-semibold text-cyan-800 ring-1 ring-cyan-100">
//     {(name || "?").trim().charAt(0).toUpperCase() || "?"}
//   </span>
// );

// const FieldLabel = ({ htmlFor, children }) => (
//   <label
//     htmlFor={htmlFor}
//     className="mb-1.5 block text-sm font-medium text-slate-700 xl:sr-only"
//   >
//     {children}
//   </label>
// );

// const compact = (n) =>
//   new Intl.NumberFormat("en-IN", {
//     notation: "compact",
//     maximumFractionDigits: 1,
//   }).format(Number(n) || 0);

// // "2026-03" -> "Mar 26" for chart axes
// const chartLabel = (key) => {
//   if (/^\d{4}-\d{2}$/.test(key || "")) {
//     const [y, m] = key.split("-");
//     const mon = new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-IN", {
//       month: "short",
//     });
//     return `${mon} ${y.slice(2)}`;
//   }
//   return key || "-";
// };

// const KPI_TONES = {
//   emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
//   rose: "bg-rose-50 text-rose-600 ring-rose-100",
//   blue: "bg-blue-50 text-blue-700 ring-blue-100",
//   cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
// };

// const Kpi = ({ icon, tone, label, value, hint }) => (
//   <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
//     <div className="flex items-center justify-between">
//       <p className="text-sm font-medium text-slate-500">{label}</p>
//       <span
//         className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${KPI_TONES[tone]}`}
//       >
//         {icon}
//       </span>
//     </div>
//     <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums text-slate-900">
//       {value}
//     </p>
//     <p className="mt-1 truncate text-sm text-slate-500">{hint}</p>
//   </div>
// );

// const SkeletonRows = ({ rows = 4, cols = 4 }) =>
//   Array.from({ length: rows }).map((_, r) => (
//     <tr key={r}>
//       {Array.from({ length: cols }).map((__, c) => (
//         <td key={c} className="px-6 py-4">
//           <div className="h-3.5 w-full max-w-[7rem] animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
//         </td>
//       ))}
//     </tr>
//   ));

// /* ------------------------------------------------------------------ */
// /* Page                                                                */
// /* ------------------------------------------------------------------ */
// const Salary = () => {
//   const [employees, setEmployees] = useState([blankEmployee()]);

//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");

//   const [salaryData, setSalaryData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   const [editId, setEditId] = useState(null);
//   const [updateStatus, setUpdateStatus] = useState(null);

//   const [allEmployeeData, setAllEmployeeData] = useState([]);

//   const [toast, setToast] = useState(null); // { type: "success" | "error", text }

//   useEffect(() => {
//     if (!toast) return undefined;
//     const t = setTimeout(() => setToast(null), 4000);
//     return () => clearTimeout(t);
//   }, [toast]);

//   const handleChange = (index, field, value) => {
//     const updated = [...employees];
//     updated[index] = {
//       ...updated[index],
//       [field]:
//         field === "salary"
//           ? Number(value)
//           : field === "paid"
//             ? value === "true"
//             : value,
//     };
//     setEmployees(updated);
//   };

//   const addEmployee = () => {
//     setEmployees([...employees, blankEmployee()]);
//   };

//   const removeEmployee = (index) => {
//     if (employees.length === 1) return;
//     setEmployees(employees.filter((_, i) => i !== index));
//     setActiveDropdown(null);
//   };

//   const totalSalary = employees.reduce(
//     (sum, emp) => sum + (Number(emp.salary) || 0),
//     0,
//   );

//   const filteredEmployeeOptions = (searchValue) => {
//     return allEmployeeData.filter((emp) =>
//       emp?.personalDetails?.fullName
//         ?.toLowerCase()
//         .includes(searchValue.toLowerCase()),
//     );
//   };

//   const handleEmployeeSelect = (index, employee) => {
//     const updated = [...employees];

//     updated[index] = {
//       ...updated[index],
//       name: employee?.personalDetails?.fullName || "",
//       role: employee?.personalDetails?.qualification || "",
//     };

//     setEmployees(updated);
//     setActiveDropdown(null);
//   };

//   // Server-side filtered: each entry already contains only the matching
//   // employees with a recomputed totalSalary, so we render/total it directly.
//   const fetchSalaryData = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await fetchReport("salary", {
//         month: selectedMonth,
//         year: selectedYear,
//       });
//       setSalaryData(data);
//     } catch (err) {
//       console.error("Error fetching salary data:", err);
//       setError("Failed to load salary data. Please try again.");
//       setSalaryData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedMonth, selectedYear]);

//   const fetchAllEmployees = async () => {
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/employee/getAllEmployee`,
//       );

//       const result = await response.json();

//       if (result.success && result.employees.length > 0) {
//         setAllEmployeeData(result?.employees);
//       }
//     } catch (error) {
//       console.error("Error fetching employee data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchSalaryData();
//   }, [fetchSalaryData]);

//   useEffect(() => {
//     fetchAllEmployees();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = () => {
//       setActiveDropdown(null);
//     };

//     window.addEventListener("click", handleClickOutside);
//     return () => window.removeEventListener("click", handleClickOutside);
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       employees,
//       totalSalary,
//     };

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/report/salary`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       const result = await response.json();
//       fetchSalaryData();
//       setToast({
//         type: response.ok ? "success" : "error",
//         text:
//           result.message ||
//           (response.ok
//             ? "Salary report saved successfully."
//             : "Could not save the salary report."),
//       });
//       setEmployees([blankEmployee()]);
//     } catch (error) {
//       console.error(error);
//       setToast({
//         type: "error",
//         text: "Error saving salary report. Please try again later.",
//       });
//     }
//   };

//   const updatePaidStatus = async (entryId, empId, paid) => {
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/report/salary/${entryId}/${empId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ paid }),
//         },
//       );

//       const result = await response.json();

//       if (result.success) {
//         fetchSalaryData();
//         setToast({
//           type: "success",
//           text: `Marked as ${paid ? "paid" : "unpaid"}.`,
//         });
//       } else {
//         setToast({ type: "error", text: "Failed to update status." });
//       }
//     } catch (error) {
//       console.error(error);
//       setToast({ type: "error", text: "Failed to update status." });
//     } finally {
//       setEditId(null);
//       setUpdateStatus(null);
//     }
//   };

//   /* ---------------- Totals (server already filtered by period) ---------------- */
//   const totalFiltered = salaryData.reduce(
//     (sum, entry) => sum + (Number(entry.totalSalary) || 0),
//     0,
//   );

//   const paidTotal = salaryData.reduce(
//     (sum, entry) =>
//       sum +
//       entry.employees
//         .filter((e) => e.paid)
//         .reduce((s, e) => s + (Number(e.salary) || 0), 0),
//     0,
//   );
//   const unpaidTotal = salaryData.reduce(
//     (sum, entry) =>
//       sum +
//       entry.employees
//         .filter((e) => !e.paid)
//         .reduce((s, e) => s + (Number(e.salary) || 0), 0),
//     0,
//   );

//   const allRows = salaryData.flatMap((entry) => entry.employees);
//   const paidCount = allRows.filter((e) => e.paid).length;
//   const unpaidCount = allRows.length - paidCount;

//   const paidShare = totalFiltered > 0 ? (paidTotal / totalFiltered) * 100 : 0;
//   const unpaidShare =
//     totalFiltered > 0 ? (unpaidTotal / totalFiltered) * 100 : 0;
//   const paidPct = Math.round(paidShare);

//   /* ---------------- Dashboard data ---------------- */
//   const rows = salaryData.flatMap((entry) =>
//     entry.employees.map((emp) => ({ ...emp, entryId: entry._id })),
//   );
//   const distinctEmployees = new Set(
//     rows.map((r) => (r.name || "").trim().toLowerCase()).filter(Boolean),
//   ).size;
//   const avgSalary = rows.length ? totalFiltered / rows.length : 0;
//   const topEarner = rows.reduce(
//     (best, r) =>
//       !best || Number(r.salary) > Number(best.salary) ? r : best,
//     null,
//   );

//   const monthly = Object.values(
//     rows.reduce((acc, r) => {
//       const key = r.month || "Unknown";
//       if (!acc[key]) acc[key] = { key, paid: 0, unpaid: 0, total: 0 };
//       const v = Number(r.salary) || 0;
//       if (r.paid) acc[key].paid += v;
//       else acc[key].unpaid += v;
//       acc[key].total += v;
//       return acc;
//     }, {}),
//   )
//     .sort((a, b) => a.key.localeCompare(b.key))
//     .slice(-6);
//   const maxMonth = Math.max(0, ...monthly.map((m) => m.total));

//   const roleBreakdown = Object.values(
//     rows.reduce((acc, r) => {
//       const key = (r.role || "").trim() || "No role";
//       if (!acc[key]) acc[key] = { role: key, count: 0, total: 0 };
//       acc[key].count += 1;
//       acc[key].total += Number(r.salary) || 0;
//       return acc;
//     }, {}),
//   )
//     .sort((a, b) => b.total - a.total)
//     .slice(0, 5);
//   const maxRole = Math.max(0, ...roleBreakdown.map((r) => r.total));

//   const outstanding = rows
//     .filter((r) => !r.paid)
//     .sort((a, b) => Number(b.salary) - Number(a.salary));

//   const monthName = MONTHS.find(
//     (m) => String(m.value) === String(selectedMonth),
//   )?.label;
//   const periodLabel =
//     selectedMonth && selectedYear
//       ? `${monthName} ${selectedYear}`
//       : !selectedMonth && selectedYear
//         ? `Year ${selectedYear}`
//         : selectedMonth && !selectedYear
//           ? `${monthName}, all years`
//           : "All time";

//   const downloadSalaryExcel = () => {
//     const rows = salaryData.flatMap((entry) =>
//       entry.employees.map((emp, index) => ({
//         Date:
//           index === 0
//             ? new Date(entry.createdAt).toLocaleDateString("en-IN")
//             : "",
//         Name: emp.name,
//         Role: emp.role,
//         Month: emp.month,
//         Salary: emp.salary,
//         Status: emp.paid ? "Paid" : "Unpaid",
//         "Entry Total": index === 0 ? entry.totalSalary : "",
//       })),
//     );

//     exportToExcel({
//       data: rows,
//       fileName: `Salary_Report_${selectedMonth || "All"}_${selectedYear || "All"}`,
//       sheetName: "Salary",
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {/* ================= TOAST ================= */}
//       {toast && (
//         <div
//           role="status"
//           aria-live="polite"
//           className={`fixed right-6 top-6 z-50 flex max-w-sm items-start gap-2.5 rounded-lg border px-4 py-3 text-sm shadow-lg ${
//             toast.type === "success"
//               ? "border-emerald-200 bg-emerald-50 text-emerald-900"
//               : "border-rose-200 bg-rose-50 text-rose-900"
//           }`}
//         >
//           {toast.type === "success" ? (
//             <MdCheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-600" />
//           ) : (
//             <MdErrorOutline size={18} className="mt-0.5 shrink-0 text-rose-600" />
//           )}
//           <p className="flex-1">{toast.text}</p>
//           <button
//             aria-label="Dismiss message"
//             onClick={() => setToast(null)}
//             className="shrink-0 rounded p-0.5 opacity-60 transition hover:opacity-100"
//           >
//             <MdClose size={16} />
//           </button>
//         </div>
//       )}

//       {/* ================= HEADER ================= */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
//             Salary
//           </h1>
//           <p className="mt-1 text-sm text-slate-500">
//             {periodLabel}
//             <span className="mx-2 text-slate-300">|</span>
//             {salaryData.length} {salaryData.length === 1 ? "sheet" : "sheets"},{" "}
//             {allRows.length} {allRows.length === 1 ? "employee" : "employees"}
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           <button onClick={downloadSalaryExcel} className={BTN_OUTLINE}>
//             <MdFileDownload size={18} className="text-slate-500" />
//             Excel
//           </button>
//           {/* SalaryReportPdf renders its own download control */}
//           <SalaryReportPdf
//             filteredEntries={salaryData}
//             selectedMonth={selectedMonth}
//             selectedYear={selectedYear}
//             totalFiltered={totalFiltered}
//             paidTotal={paidTotal}
//             unpaidTotal={unpaidTotal}
//           />
//         </div>
//       </div>

//       {/* ================= FILTER BAR ================= */}
//       <div className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
//         <p className="px-1 text-sm font-medium text-slate-600 sm:mr-2">
//           Period
//         </p>
//         <select
//           aria-label="Filter by month"
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className={SELECT}
//         >
//           <option value="">All months</option>
//           {MONTHS.map((m) => (
//             <option key={m.value} value={m.value}>
//               {m.label}
//             </option>
//           ))}
//         </select>
//         <select
//           aria-label="Filter by year"
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(e.target.value)}
//           className={SELECT}
//         >
//           <option value="">All years</option>
//           {YEARS.map((y) => (
//             <option key={y} value={y}>
//               {y}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* ================= OVERVIEW (the one bold element) ================= */}
//       <section
//         aria-label="Payroll overview"
//         className="rounded-2xl bg-gradient-to-br from-[#17458f] via-[#102f6b] to-[#0a1f4d] p-6 text-white shadow-sm ring-1 ring-blue-950/40 sm:p-8"
//       >
//         <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
//           <div className="lg:col-span-2">
//             <p className="text-sm text-cyan-200/90">Total payroll</p>
//             <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
//               ₹{formatINR(totalFiltered)}
//             </p>
//             <p className="mt-3 text-sm text-blue-100/80">
//               <span className="font-semibold text-emerald-300">
//                 {paidPct}% paid
//               </span>{" "}
//               (₹{formatINR(paidTotal)} of ₹{formatINR(totalFiltered)})
//             </p>

//             <div
//               className="mt-6 flex h-2.5 w-full overflow-hidden rounded-full bg-white/10"
//               role="img"
//               aria-label={`Paid ${paidPct}%, unpaid ${Math.round(unpaidShare)}%`}
//             >
//               <div
//                 className={`${STATUS.Paid.bar} h-full transition-all duration-500 motion-reduce:transition-none`}
//                 style={{ width: `${paidShare}%` }}
//               />
//               <div
//                 className={`${STATUS.Unpaid.bar} h-full transition-all duration-500 motion-reduce:transition-none`}
//                 style={{ width: `${unpaidShare}%` }}
//               />
//             </div>

//             <dl className="mt-5 grid grid-cols-2 gap-4">
//               <div>
//                 <dt className="flex items-center gap-2 text-sm text-blue-100/80">
//                   <span className={`h-2 w-2 rounded-full ${STATUS.Paid.dot}`} />
//                   Paid
//                 </dt>
//                 <dd className="mt-0.5 text-lg font-semibold tabular-nums">
//                   ₹{formatINR(paidTotal)}
//                 </dd>
//               </div>
//               <div>
//                 <dt className="flex items-center gap-2 text-sm text-blue-100/80">
//                   <span className={`h-2 w-2 rounded-full ${STATUS.Unpaid.dot}`} />
//                   Unpaid
//                 </dt>
//                 <dd className="mt-0.5 text-lg font-semibold tabular-nums">
//                   ₹{formatINR(unpaidTotal)}
//                 </dd>
//               </div>
//             </dl>
//           </div>

//           <div className="lg:col-span-3">
//             <div className="flex items-center justify-between">
//               <h2 className="text-sm font-medium text-blue-100">
//                 Payroll by pay month
//               </h2>
//               <div className="flex items-center gap-4 text-xs text-blue-200/80">
//                 <span className="flex items-center gap-1.5">
//                   <span className={`h-2 w-2 rounded-full ${STATUS.Paid.dot}`} />
//                   Paid
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <span className={`h-2 w-2 rounded-full ${STATUS.Unpaid.dot}`} />
//                   Unpaid
//                 </span>
//               </div>
//             </div>

//             {monthly.length === 0 ? (
//               <p className="mt-10 text-center text-sm text-blue-200/70">
//                 No payroll data for this period.
//               </p>
//             ) : (
//               <div className="mt-6 flex h-48 items-end gap-3 border-b border-white/10">
//                 {monthly.map((m) => {
//                   const h = maxMonth > 0 ? (m.total / maxMonth) * 100 : 0;
//                   return (
//                     <div
//                       key={m.key}
//                       title={`${formatMonth(m.key)}: paid ₹${formatINR(
//                         m.paid,
//                       )}, unpaid ₹${formatINR(m.unpaid)}`}
//                       className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
//                     >
//                       <span className="text-xs tabular-nums text-blue-100/80">
//                         ₹{compact(m.total)}
//                       </span>
//                       <div
//                         className="flex w-full max-w-[3.5rem] flex-col-reverse overflow-hidden rounded-t-md"
//                         style={{
//                           height: `${h * 0.72}%`,
//                           minHeight: m.total > 0 ? 4 : 0,
//                         }}
//                       >
//                         <div
//                           className="bg-emerald-400"
//                           style={{
//                             height: `${m.total ? (m.paid / m.total) * 100 : 0}%`,
//                           }}
//                         />
//                         <div
//                           className="bg-rose-400"
//                           style={{
//                             height: `${m.total ? (m.unpaid / m.total) * 100 : 0}%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//             {monthly.length > 0 && (
//               <div className="mt-2 flex gap-3">
//                 {monthly.map((m) => (
//                   <span
//                     key={m.key}
//                     className="flex-1 text-center text-xs text-blue-200/70"
//                   >
//                     {chartLabel(m.key)}
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ================= KPI CARDS ================= */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <Kpi
//           icon={<MdPayments size={22} />}
//           tone="emerald"
//           label="Paid out"
//           value={`₹${formatINR(paidTotal)}`}
//           hint={`${paidCount} ${paidCount === 1 ? "payment" : "payments"} completed`}
//         />
//         <Kpi
//           icon={<MdPendingActions size={22} />}
//           tone="rose"
//           label="Outstanding"
//           value={`₹${formatINR(unpaidTotal)}`}
//           hint={
//             unpaidCount === 0
//               ? "Nothing pending"
//               : `${unpaidCount} ${unpaidCount === 1 ? "payment" : "payments"} pending`
//           }
//         />
//         <Kpi
//           icon={<MdPeople size={22} />}
//           tone="blue"
//           label="Employees"
//           value={distinctEmployees}
//           hint={`${rows.length} salary ${rows.length === 1 ? "entry" : "entries"}`}
//         />
//         <Kpi
//           icon={<MdTrendingUp size={22} />}
//           tone="cyan"
//           label="Average salary"
//           value={`₹${formatINR(avgSalary)}`}
//           hint={
//             topEarner
//               ? `Highest: ₹${formatINR(topEarner.salary)} (${topEarner.name})`
//               : "No data yet"
//           }
//         />
//       </div>

//       {/* ================= BREAKDOWN ================= */}
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
//         <Panel
//           title="Payroll by role"
//           description="Top roles by total salary in this period."
//         >
//           <div className="space-y-4 px-6 py-5">
//             {roleBreakdown.length === 0 ? (
//               <p className="py-8 text-center text-sm text-slate-500">
//                 No data available.
//               </p>
//             ) : (
//               roleBreakdown.map((r) => (
//                 <div key={r.role}>
//                   <div className="flex items-baseline justify-between gap-3 text-sm">
//                     <p className="truncate font-medium text-slate-900">
//                       {r.role}
//                       <span className="ml-2 text-xs font-normal text-slate-500">
//                         {r.count} {r.count === 1 ? "employee" : "employees"}
//                       </span>
//                     </p>
//                     <p className="font-semibold tabular-nums text-slate-900">
//                       ₹{formatINR(r.total)}
//                     </p>
//                   </div>
//                   <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
//                     <div
//                       className="h-2 rounded-full bg-gradient-to-r from-blue-700 to-cyan-400"
//                       style={{
//                         width: `${maxRole > 0 ? (r.total / maxRole) * 100 : 0}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </Panel>

//         <Panel
//           title="Pending payments"
//           description={
//             outstanding.length === 0
//               ? "Everything in this period has been paid."
//               : `${outstanding.length} unpaid, largest first.`
//           }
//         >
//           {outstanding.length === 0 ? (
//             <div className="flex flex-col items-center gap-2 px-6 py-12 text-sm text-slate-500">
//               <MdTaskAlt size={32} className="text-emerald-500" />
//               All salaries are paid.
//             </div>
//           ) : (
//             <ul className="divide-y divide-slate-100">
//               {outstanding.slice(0, 5).map((r) => (
//                 <li
//                   key={`${r.entryId}-${r._id}`}
//                   className="flex items-center gap-3 px-6 py-3.5"
//                 >
//                   <Initial name={r.name} />
//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-sm font-medium text-slate-900">
//                       {r.name}
//                     </p>
//                     <p className="truncate text-xs text-slate-500">
//                       {r.role || "No role"}, {formatMonth(r.month)}
//                     </p>
//                   </div>
//                   <p className="text-sm font-semibold tabular-nums text-slate-900">
//                     ₹{formatINR(r.salary)}
//                   </p>
//                   <button
//                     onClick={() => updatePaidStatus(r.entryId, r._id, true)}
//                     className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20"
//                   >
//                     Mark paid
//                   </button>
//                 </li>
//               ))}
//               {outstanding.length > 5 && (
//                 <li className="px-6 py-3 text-center text-xs text-slate-500">
//                   and {outstanding.length - 5} more in the salary sheets below
//                 </li>
//               )}
//             </ul>
//           )}
//         </Panel>
//       </div>

//       {/* ================= ADD SALARY SHEET ================= */}
//       <Panel
//         title="Add salary sheet"
//         description="Start typing a name to pick an existing employee, or enter one manually."
//       >
//         <form onSubmit={handleSubmit}>
//           <div className="px-6 py-5">
//             {/* Column headings (desktop only) */}
//             <div className="mb-2 hidden gap-3 px-1 text-xs font-medium text-slate-500 xl:grid xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(10.5rem,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_2.5rem]">
//               <span>Employee name</span>
//               <span>Role</span>
//               <span>Pay month</span>
//               <span>Salary</span>
//               <span>Status</span>
//               <span />
//             </div>

//             <div className="space-y-4 lg:space-y-3">
//               {employees.map((emp, idx) => {
//                 const options =
//                   activeDropdown === idx ? filteredEmployeeOptions(emp.name) : [];
//                 return (
//                   <div
//                     key={idx}
//                     className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-4 sm:grid-cols-2 xl:items-center xl:border-0 xl:p-0 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(10.5rem,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_2.5rem]"
//                   >
//                     <div className="relative sm:col-span-2">
//                       <FieldLabel htmlFor={`name-${idx}`}>Employee name</FieldLabel>
//                       <input
//                         id={`name-${idx}`}
//                         type="text"
//                         autoComplete="off"
//                         value={emp.name}
//                         onChange={(e) => {
//                           handleChange(idx, "name", e.target.value);
//                           setActiveDropdown(idx);
//                         }}
//                         onClick={(e) => e.stopPropagation()}
//                         onFocus={() => setActiveDropdown(idx)}
//                         placeholder="Employee name"
//                         className={FIELD}
//                       />

//                       {activeDropdown === idx && (
//                         <div
//                           onClick={(e) => e.stopPropagation()}
//                           className="absolute z-20 mt-1.5 max-h-56 w-full min-w-[16rem] overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
//                         >
//                           {options.map((employee) => (
//                             <button
//                               type="button"
//                               key={employee._id}
//                               onClick={() => handleEmployeeSelect(idx, employee)}
//                               className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
//                             >
//                               <Initial name={employee?.personalDetails?.fullName} />
//                               <span className="min-w-0">
//                                 <span className="block truncate text-sm font-medium text-slate-900">
//                                   {employee?.personalDetails?.fullName}
//                                 </span>
//                                 <span className="block truncate text-xs text-slate-500">
//                                   {employee?.personalDetails?.qualification ||
//                                     "No qualification"}
//                                 </span>
//                               </span>
//                             </button>
//                           ))}

//                           {options.length === 0 && (
//                             <p className="px-3 py-3 text-sm text-slate-500">
//                               No employee found. You can keep typing to add a
//                               new name.
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <FieldLabel htmlFor={`role-${idx}`}>Role</FieldLabel>
//                       <input
//                         id={`role-${idx}`}
//                         type="text"
//                         value={emp.role}
//                         onChange={(e) => handleChange(idx, "role", e.target.value)}
//                         placeholder="e.g. Therapist"
//                         className={FIELD}
//                       />
//                     </div>

//                     <div>
//                       <FieldLabel htmlFor={`month-${idx}`}>Pay month</FieldLabel>
//                       <input
//                         id={`month-${idx}`}
//                         type="month"
//                         value={emp.month}
//                         onChange={(e) => handleChange(idx, "month", e.target.value)}
//                         className={`${FIELD} px-3`}
//                       />
//                     </div>

//                     <div>
//                       <FieldLabel htmlFor={`salary-${idx}`}>Salary</FieldLabel>
//                       <div className="relative">
//                         <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-slate-400">
//                           ₹
//                         </span>
//                         <input
//                           id={`salary-${idx}`}
//                           type="number"
//                           min={0}
//                           value={emp.salary}
//                           onChange={(e) =>
//                             handleChange(idx, "salary", e.target.value)
//                           }
//                           className={`${FIELD} pl-8 tabular-nums`}
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <FieldLabel htmlFor={`paid-${idx}`}>Status</FieldLabel>
//                       <select
//                         id={`paid-${idx}`}
//                         value={emp.paid ? "true" : "false"}
//                         onChange={(e) => handleChange(idx, "paid", e.target.value)}
//                         className={FIELD}
//                       >
//                         <option value="false">Unpaid</option>
//                         <option value="true">Paid</option>
//                       </select>
//                     </div>

//                     <div className="flex justify-end sm:col-span-2">
//                       <button
//                         type="button"
//                         aria-label={`Remove employee row ${idx + 1}`}
//                         disabled={employees.length === 1}
//                         onClick={() => removeEmployee(idx)}
//                         className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
//                       >
//                         <MdDeleteOutline size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <button type="button" onClick={addEmployee} className={`${BTN_GHOST} mt-4`}>
//               <MdAdd size={18} />
//               Add employee
//             </button>
//           </div>

//           <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
//             <p className="text-sm text-slate-600">
//               {employees.length} {employees.length === 1 ? "employee" : "employees"},
//               total{" "}
//               <span className="text-lg font-semibold tabular-nums text-slate-900">
//                 ₹{formatINR(totalSalary)}
//               </span>
//             </p>
//             <button type="submit" className={BTN_PRIMARY}>
//               Save salary sheet
//             </button>
//           </div>
//         </form>
//       </Panel>

//       {/* ================= SALARY SHEETS ================= */}
//       {loading ? (
//         <Panel title="Salary sheets">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <tbody className="divide-y divide-slate-100">
//                 <SkeletonRows rows={4} cols={4} />
//               </tbody>
//             </table>
//           </div>
//         </Panel>
//       ) : error ? (
//         <Panel>
//           <p className="px-6 py-14 text-center text-sm text-rose-600">{error}</p>
//         </Panel>
//       ) : salaryData.length === 0 ? (
//         <Panel>
//           <p className="px-6 py-14 text-center text-sm text-slate-500">
//             No salary records for this period. Add a salary sheet using the form
//             above.
//           </p>
//         </Panel>
//       ) : (
//         <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
//           {salaryData.map((entry) => {
//             const entryPaid = entry.employees.filter((e) => e.paid).length;
//             return (
//               <Panel
//                 key={entry._id}
//                 title={`Salary sheet, ${formatDate(entry.createdAt)}`}
//                 description={`${entry.employees.length} ${
//                   entry.employees.length === 1 ? "employee" : "employees"
//                 }, ${entryPaid} paid`}
//                 aside={
//                   <div className="text-right">
//                     <p className="text-xs text-slate-500">Sheet total</p>
//                     <p className="text-lg font-semibold tabular-nums text-slate-900">
//                       ₹{formatINR(entry.totalSalary)}
//                     </p>
//                   </div>
//                 }
//               >
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full text-sm">
//                     <thead className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-medium text-slate-500">
//                       <tr>
//                         <th className="px-6 py-3">Employee</th>
//                         <th className="px-6 py-3">Pay month</th>
//                         <th className="px-6 py-3 text-right">Salary</th>
//                         <th className="px-6 py-3">Status</th>
//                         <th className="w-14 px-6 py-3">
//                           <span className="sr-only">Actions</span>
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                       {entry.employees.map((emp) => {
//                         const isEditing = editId === emp._id;
//                         return (
//                           <tr
//                             key={emp._id}
//                             className="transition-colors hover:bg-slate-50/70"
//                           >
//                             <td className="px-6 py-4">
//                               <div className="flex items-center gap-3">
//                                 <Initial name={emp.name} />
//                                 <div className="min-w-0">
//                                   <p className="truncate font-medium text-slate-900">
//                                     {emp.name}
//                                   </p>
//                                   <p className="truncate text-xs text-slate-500">
//                                     {emp.role || "No role"}
//                                   </p>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="whitespace-nowrap px-6 py-4 text-slate-600">
//                               {formatMonth(emp.month)}
//                             </td>
//                             <td className="whitespace-nowrap px-6 py-4 text-right font-semibold tabular-nums text-slate-900">
//                               ₹{formatINR(emp.salary)}
//                             </td>
//                             <td className="whitespace-nowrap px-6 py-4">
//                               {isEditing ? (
//                                 <div className="flex items-center gap-2">
//                                   <select
//                                     aria-label="New status"
//                                     value={updateStatus ? "true" : "false"}
//                                     onChange={(e) =>
//                                       setUpdateStatus(e.target.value === "true")
//                                     }
//                                     className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
//                                   >
//                                     <option value="true">Paid</option>
//                                     <option value="false">Unpaid</option>
//                                   </select>
//                                   <button
//                                     aria-label="Save status"
//                                     disabled={updateStatus === emp.paid}
//                                     onClick={() =>
//                                       updatePaidStatus(
//                                         entry._id,
//                                         emp._id,
//                                         updateStatus,
//                                       )
//                                     }
//                                     className="rounded-lg bg-blue-800 p-1.5 text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300"
//                                   >
//                                     <MdCheck size={16} />
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <StatusPill paid={emp.paid} />
//                               )}
//                             </td>
//                             <td className="px-6 py-4 text-right">
//                               <button
//                                 aria-label={
//                                   isEditing ? "Cancel editing" : "Edit status"
//                                 }
//                                 onClick={() => {
//                                   setEditId(isEditing ? null : emp._id);
//                                   setUpdateStatus(emp?.paid);
//                                 }}
//                                 className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20"
//                               >
//                                 {isEditing ? (
//                                   <MdClose size={18} />
//                                 ) : (
//                                   <MdEdit size={18} />
//                                 )}
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                     <tfoot className="border-t border-slate-200 bg-slate-50/70">
//                       <tr>
//                         <td
//                           colSpan={2}
//                           className="px-6 py-3.5 text-right font-medium text-slate-600"
//                         >
//                           Total
//                         </td>
//                         <td className="px-6 py-3.5 text-right font-semibold tabular-nums text-slate-900">
//                           ₹{formatINR(entry.totalSalary)}
//                         </td>
//                         <td colSpan={2} />
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               </Panel>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Salary;





import { Fragment, useState, useEffect, useCallback } from "react";
import SalaryReportPdf from "./pdf/SalaryReportPdf";
import {
  MdEdit,
  MdClose,
  MdCheck,
  MdAdd,
  MdDeleteOutline,
  MdFileDownload,
  MdCheckCircle,
  MdErrorOutline,
  MdPayments,
  MdPendingActions,
  MdPeople,
  MdTrendingUp,
  MdTaskAlt,
} from "react-icons/md";
import { exportToExcel } from "../utils/exportToExcel";
import { fetchReport, MONTHS, YEARS, formatINR } from "../utils/reportFetch";

/* ------------------------------------------------------------------ */
/* Design tokens (shared look with the Rent page)                      */
/* ------------------------------------------------------------------ */
const FIELD =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10";
const SELECT = `${FIELD} sm:w-auto sm:min-w-[9.5rem]`;
const BTN_PRIMARY =
  "inline-flex items-center justify-center rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30";
const BTN_OUTLINE =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20";
const BTN_GHOST =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20";

const STATUS = {
  Paid: {
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-800 ring-emerald-600/15",
    bar: "bg-emerald-400",
  },
  Unpaid: {
    dot: "bg-rose-500",
    pill: "bg-rose-50 text-rose-800 ring-rose-600/15",
    bar: "bg-rose-400",
  },
};

const formatMonth = (value) => {
  // Pay month is stored as "YYYY-MM"; show it as "Mar 2026". Anything else is shown as-is.
  if (/^\d{4}-\d{2}$/.test(value || "")) {
    const [y, m] = value.split("-");
    return new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-IN", {
      month: "short",
      year: "numeric",
    });
  }
  return value || "-";
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const PAYMENT_MODES = [
  "Cash",
  "UPI",
  "Bank transfer",
  "Cheque",
  "Card",
  "Other",
];

// Today as YYYY-MM-DD in the local time zone (for date inputs).
const todayStr = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

const dateInputValue = (v) => (v ? String(v).slice(0, 10) : "");

const formatPayDate = (v) =>
  v && !isNaN(new Date(v).getTime())
    ? new Date(v).toLocaleDateString("en-IN")
    : "-";

// "YYYY-MM" of the current month — used as the default pay month for a new row.
const currentPayMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const blankEmployee = () => ({
  name: "",
  role: "",
  month: currentPayMonth(),
  salary: 0,
  paid: false,
  paymentMode: "",
  paymentDate: "",
});

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

const StatusPill = ({ paid }) => {
  const key = paid ? "Paid" : "Unpaid";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS[key].pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS[key].dot}`} />
      {key}
    </span>
  );
};

const Initial = ({ name }) => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-sm font-semibold text-cyan-800 ring-1 ring-cyan-100">
    {(name || "?").trim().charAt(0).toUpperCase() || "?"}
  </span>
);

const FieldLabel = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="mb-1.5 block text-sm font-medium text-slate-700 xl:sr-only"
  >
    {children}
  </label>
);

const Label = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="mb-1.5 block text-sm font-medium text-slate-700"
  >
    {children}
  </label>
);

const compact = (n) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(n) || 0);

// "2026-03" -> "Mar 26" for chart axes
const chartLabel = (key) => {
  if (/^\d{4}-\d{2}$/.test(key || "")) {
    const [y, m] = key.split("-");
    const mon = new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-IN", {
      month: "short",
    });
    return `${mon} ${y.slice(2)}`;
  }
  return key || "-";
};

const KPI_TONES = {
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
};

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

const SkeletonRows = ({ rows = 4, cols = 4 }) =>
  Array.from({ length: rows }).map((_, r) => (
    <tr key={r}>
      {Array.from({ length: cols }).map((__, c) => (
        <td key={c} className="px-6 py-4">
          <div className="h-3.5 w-full max-w-[7rem] animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
        </td>
      ))}
    </tr>
  ));

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const Salary = () => {
  const [employees, setEmployees] = useState([blankEmployee()]);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [editId, setEditId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [updateMode, setUpdateMode] = useState("");
  const [updateDate, setUpdateDate] = useState("");

  // Quick "Mark paid" from the pending payments list
  const [quickKey, setQuickKey] = useState(null);
  const [quickMode, setQuickMode] = useState("");
  const [quickDate, setQuickDate] = useState("");

  const [allEmployeeData, setAllEmployeeData] = useState([]);

  const [toast, setToast] = useState(null); // { type: "success" | "error", text }

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleChange = (index, field, value) => {
    const updated = [...employees];
    const current = updated[index];

    if (field === "paid") {
      const paid = value === "true";
      updated[index] = paid
        ? { ...current, paid, paymentDate: current.paymentDate || todayStr() }
        : { ...current, paid, paymentMode: "", paymentDate: "" };
    } else {
      updated[index] = {
        ...current,
        [field]: field === "salary" ? Number(value) : value,
      };
    }
    setEmployees(updated);
  };

  const addEmployee = () => {
    setEmployees([...employees, blankEmployee()]);
  };

  const removeEmployee = (index) => {
    if (employees.length === 1) return;
    setEmployees(employees.filter((_, i) => i !== index));
    setActiveDropdown(null);
  };

  const totalSalary = employees.reduce(
    (sum, emp) => sum + (Number(emp.salary) || 0),
    0,
  );

  const filteredEmployeeOptions = (searchValue) => {
    return allEmployeeData.filter((emp) =>
      emp?.personalDetails?.fullName
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()),
    );
  };

  const handleEmployeeSelect = (index, employee) => {
    const updated = [...employees];

    updated[index] = {
      ...updated[index],
      name: employee?.personalDetails?.fullName || "",
      role: employee?.personalDetails?.qualification || "",
    };

    setEmployees(updated);
    setActiveDropdown(null);
  };

  // Server-side filtered: each entry already contains only the matching
  // employees with a recomputed totalSalary, so we render/total it directly.
  const fetchSalaryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReport("salary", {
        month: selectedMonth,
        year: selectedYear,
      });
      setSalaryData(data);
    } catch (err) {
      console.error("Error fetching salary data:", err);
      setError("Failed to load salary data. Please try again.");
      setSalaryData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  const fetchAllEmployees = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/getAllEmployee`,
      );

      const result = await response.json();

      if (result.success && result.employees.length > 0) {
        setAllEmployeeData(result?.employees);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mode and date of payment only apply to salaries that have been paid.
    const payload = {
      employees: employees.map(({ paymentMode, paymentDate, ...rest }) =>
        rest.paid ? { ...rest, paymentMode, paymentDate } : rest,
      ),
      totalSalary,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/salary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      fetchSalaryData();
      setToast({
        type: response.ok ? "success" : "error",
        text:
          result.message ||
          (response.ok
            ? "Salary report saved successfully."
            : "Could not save the salary report."),
      });
      setEmployees([blankEmployee()]);
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        text: "Error saving salary report. Please try again later.",
      });
    }
  };

  const startEdit = (emp) => {
    setEditId(emp._id);
    setUpdateStatus(!!emp.paid);
    setUpdateMode(emp.paymentMode || "");
    setUpdateDate(dateInputValue(emp.paymentDate));
  };

  const cancelEdit = () => {
    setEditId(null);
    setUpdateStatus(null);
    setUpdateMode("");
    setUpdateDate("");
  };

  const changeUpdateStatus = (paid) => {
    setUpdateStatus(paid);
    if (paid) setUpdateDate((d) => d || todayStr());
  };

  const startQuick = (key) => {
    setQuickKey(key);
    setQuickMode("");
    setQuickDate(todayStr());
  };

  const cancelQuick = () => {
    setQuickKey(null);
    setQuickMode("");
    setQuickDate("");
  };

  const updatePaidStatus = async (entryId, empId, paid, mode, date) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/report/salary/${entryId}/${empId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paid,
            paymentMode: paid ? mode : "",
            paymentDate: paid ? date : null,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        fetchSalaryData();
        setToast({
          type: "success",
          text: paid ? "Marked as paid." : "Marked as unpaid.",
        });
      } else {
        setToast({
          type: "error",
          text: result.message || "Failed to update the salary record.",
        });
      }
    } catch (error) {
      console.error(error);
      setToast({ type: "error", text: "Failed to update the salary record." });
    } finally {
      cancelEdit();
      cancelQuick();
    }
  };

  /* ---------------- Totals (server already filtered by period) ---------------- */
  const totalFiltered = salaryData.reduce(
    (sum, entry) => sum + (Number(entry.totalSalary) || 0),
    0,
  );

  const paidTotal = salaryData.reduce(
    (sum, entry) =>
      sum +
      entry.employees
        .filter((e) => e.paid)
        .reduce((s, e) => s + (Number(e.salary) || 0), 0),
    0,
  );
  const unpaidTotal = salaryData.reduce(
    (sum, entry) =>
      sum +
      entry.employees
        .filter((e) => !e.paid)
        .reduce((s, e) => s + (Number(e.salary) || 0), 0),
    0,
  );

  const allRows = salaryData.flatMap((entry) => entry.employees);
  const paidCount = allRows.filter((e) => e.paid).length;
  const unpaidCount = allRows.length - paidCount;

  const paidShare = totalFiltered > 0 ? (paidTotal / totalFiltered) * 100 : 0;
  const unpaidShare =
    totalFiltered > 0 ? (unpaidTotal / totalFiltered) * 100 : 0;
  const paidPct = Math.round(paidShare);

  /* ---------------- Dashboard data ---------------- */
  const rows = salaryData.flatMap((entry) =>
    entry.employees.map((emp) => ({ ...emp, entryId: entry._id })),
  );
  const distinctEmployees = new Set(
    rows.map((r) => (r.name || "").trim().toLowerCase()).filter(Boolean),
  ).size;
  const avgSalary = rows.length ? totalFiltered / rows.length : 0;
  const topEarner = rows.reduce(
    (best, r) =>
      !best || Number(r.salary) > Number(best.salary) ? r : best,
    null,
  );

  const monthly = Object.values(
    rows.reduce((acc, r) => {
      const key = r.month || "Unknown";
      if (!acc[key]) acc[key] = { key, paid: 0, unpaid: 0, total: 0 };
      const v = Number(r.salary) || 0;
      if (r.paid) acc[key].paid += v;
      else acc[key].unpaid += v;
      acc[key].total += v;
      return acc;
    }, {}),
  )
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-6);
  const maxMonth = Math.max(0, ...monthly.map((m) => m.total));

  const roleBreakdown = Object.values(
    rows.reduce((acc, r) => {
      const key = (r.role || "").trim() || "No role";
      if (!acc[key]) acc[key] = { role: key, count: 0, total: 0 };
      acc[key].count += 1;
      acc[key].total += Number(r.salary) || 0;
      return acc;
    }, {}),
  )
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
  const maxRole = Math.max(0, ...roleBreakdown.map((r) => r.total));

  const outstanding = rows
    .filter((r) => !r.paid)
    .sort((a, b) => Number(b.salary) - Number(a.salary));

  const monthName = MONTHS.find(
    (m) => String(m.value) === String(selectedMonth),
  )?.label;
  const periodLabel =
    selectedMonth && selectedYear
      ? `${monthName} ${selectedYear}`
      : !selectedMonth && selectedYear
        ? `Year ${selectedYear}`
        : selectedMonth && !selectedYear
          ? `${monthName}, all years`
          : "All time";

  const downloadSalaryExcel = () => {
    const rows = salaryData.flatMap((entry) =>
      entry.employees.map((emp, index) => ({
        Date:
          index === 0
            ? new Date(entry.createdAt).toLocaleDateString("en-IN")
            : "",
        Name: emp.name,
        Role: emp.role,
        Month: emp.month,
        Salary: emp.salary,
        Status: emp.paid ? "Paid" : "Unpaid",
        "Payment Mode": emp.paymentMode || "-",
        "Salary Date": emp.paymentDate
          ? new Date(emp.paymentDate).toLocaleDateString("en-IN")
          : "-",
        "Entry Total": index === 0 ? entry.totalSalary : "",
      })),
    );

    exportToExcel({
      data: rows,
      fileName: `Salary_Report_${selectedMonth || "All"}_${selectedYear || "All"}`,
      sheetName: "Salary",
    });
  };

  return (
    <div className="space-y-6">
      {/* ================= TOAST ================= */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-6 top-6 z-50 flex max-w-sm items-start gap-2.5 rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {toast.type === "success" ? (
            <MdCheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-600" />
          ) : (
            <MdErrorOutline size={18} className="mt-0.5 shrink-0 text-rose-600" />
          )}
          <p className="flex-1">{toast.text}</p>
          <button
            aria-label="Dismiss message"
            onClick={() => setToast(null)}
            className="shrink-0 rounded p-0.5 opacity-60 transition hover:opacity-100"
          >
            <MdClose size={16} />
          </button>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Salary
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {periodLabel}
            <span className="mx-2 text-slate-300">|</span>
            {salaryData.length} {salaryData.length === 1 ? "sheet" : "sheets"},{" "}
            {allRows.length} {allRows.length === 1 ? "employee" : "employees"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={downloadSalaryExcel} className={BTN_OUTLINE}>
            <MdFileDownload size={18} className="text-slate-500" />
            Excel
          </button>
          {/* SalaryReportPdf renders its own download control */}
          <SalaryReportPdf
            filteredEntries={salaryData}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            totalFiltered={totalFiltered}
            paidTotal={paidTotal}
            unpaidTotal={unpaidTotal}
          />
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
        <p className="px-1 text-sm font-medium text-slate-600 sm:mr-2">
          Period
        </p>
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
      </div>

      {/* ================= OVERVIEW (the one bold element) ================= */}
      <section
        aria-label="Payroll overview"
        className="rounded-2xl bg-gradient-to-br from-[#17458f] via-[#102f6b] to-[#0a1f4d] p-6 text-white shadow-sm ring-1 ring-blue-950/40 sm:p-8"
      >
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2">
            <p className="text-sm text-cyan-200/90">Total payroll</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
              ₹{formatINR(totalFiltered)}
            </p>
            <p className="mt-3 text-sm text-blue-100/80">
              <span className="font-semibold text-emerald-300">
                {paidPct}% paid
              </span>{" "}
              (₹{formatINR(paidTotal)} of ₹{formatINR(totalFiltered)})
            </p>

            <div
              className="mt-6 flex h-2.5 w-full overflow-hidden rounded-full bg-white/10"
              role="img"
              aria-label={`Paid ${paidPct}%, unpaid ${Math.round(unpaidShare)}%`}
            >
              <div
                className={`${STATUS.Paid.bar} h-full transition-all duration-500 motion-reduce:transition-none`}
                style={{ width: `${paidShare}%` }}
              />
              <div
                className={`${STATUS.Unpaid.bar} h-full transition-all duration-500 motion-reduce:transition-none`}
                style={{ width: `${unpaidShare}%` }}
              />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <dt className="flex items-center gap-2 text-sm text-blue-100/80">
                  <span className={`h-2 w-2 rounded-full ${STATUS.Paid.dot}`} />
                  Paid
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums">
                  ₹{formatINR(paidTotal)}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-sm text-blue-100/80">
                  <span className={`h-2 w-2 rounded-full ${STATUS.Unpaid.dot}`} />
                  Unpaid
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums">
                  ₹{formatINR(unpaidTotal)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-blue-100">
                Payroll by pay month
              </h2>
              <div className="flex items-center gap-4 text-xs text-blue-200/80">
                <span className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${STATUS.Paid.dot}`} />
                  Paid
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${STATUS.Unpaid.dot}`} />
                  Unpaid
                </span>
              </div>
            </div>

            {monthly.length === 0 ? (
              <p className="mt-10 text-center text-sm text-blue-200/70">
                No payroll data for this period.
              </p>
            ) : (
              <div className="mt-6 flex h-48 items-end gap-3 border-b border-white/10">
                {monthly.map((m) => {
                  const h = maxMonth > 0 ? (m.total / maxMonth) * 100 : 0;
                  return (
                    <div
                      key={m.key}
                      title={`${formatMonth(m.key)}: paid ₹${formatINR(
                        m.paid,
                      )}, unpaid ₹${formatINR(m.unpaid)}`}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                    >
                      <span className="text-xs tabular-nums text-blue-100/80">
                        ₹{compact(m.total)}
                      </span>
                      <div
                        className="flex w-full max-w-[3.5rem] flex-col-reverse overflow-hidden rounded-t-md"
                        style={{
                          height: `${h * 0.72}%`,
                          minHeight: m.total > 0 ? 4 : 0,
                        }}
                      >
                        <div
                          className="bg-emerald-400"
                          style={{
                            height: `${m.total ? (m.paid / m.total) * 100 : 0}%`,
                          }}
                        />
                        <div
                          className="bg-rose-400"
                          style={{
                            height: `${m.total ? (m.unpaid / m.total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {monthly.length > 0 && (
              <div className="mt-2 flex gap-3">
                {monthly.map((m) => (
                  <span
                    key={m.key}
                    className="flex-1 text-center text-xs text-blue-200/70"
                  >
                    {chartLabel(m.key)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={<MdPayments size={22} />}
          tone="emerald"
          label="Paid out"
          value={`₹${formatINR(paidTotal)}`}
          hint={`${paidCount} ${paidCount === 1 ? "payment" : "payments"} completed`}
        />
        <Kpi
          icon={<MdPendingActions size={22} />}
          tone="rose"
          label="Outstanding"
          value={`₹${formatINR(unpaidTotal)}`}
          hint={
            unpaidCount === 0
              ? "Nothing pending"
              : `${unpaidCount} ${unpaidCount === 1 ? "payment" : "payments"} pending`
          }
        />
        <Kpi
          icon={<MdPeople size={22} />}
          tone="blue"
          label="Employees"
          value={distinctEmployees}
          hint={`${rows.length} salary ${rows.length === 1 ? "entry" : "entries"}`}
        />
        <Kpi
          icon={<MdTrendingUp size={22} />}
          tone="cyan"
          label="Average salary"
          value={`₹${formatINR(avgSalary)}`}
          hint={
            topEarner
              ? `Highest: ₹${formatINR(topEarner.salary)} (${topEarner.name})`
              : "No data yet"
          }
        />
      </div>

      {/* ================= BREAKDOWN ================= */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel
          title="Payroll by role"
          description="Top roles by total salary in this period."
        >
          <div className="space-y-4 px-6 py-5">
            {roleBreakdown.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No data available.
              </p>
            ) : (
              roleBreakdown.map((r) => (
                <div key={r.role}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <p className="truncate font-medium text-slate-900">
                      {r.role}
                      <span className="ml-2 text-xs font-normal text-slate-500">
                        {r.count} {r.count === 1 ? "employee" : "employees"}
                      </span>
                    </p>
                    <p className="font-semibold tabular-nums text-slate-900">
                      ₹{formatINR(r.total)}
                    </p>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-700 to-cyan-400"
                      style={{
                        width: `${maxRole > 0 ? (r.total / maxRole) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel
          title="Pending payments"
          description={
            outstanding.length === 0
              ? "Everything in this period has been paid."
              : `${outstanding.length} unpaid, largest first.`
          }
        >
          {outstanding.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-sm text-slate-500">
              <MdTaskAlt size={32} className="text-emerald-500" />
              All salaries are paid.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {outstanding.slice(0, 5).map((r) => {
                const key = `${r.entryId}-${r._id}`;
                const open = quickKey === key;
                return (
                  <li key={key} className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <Initial name={r.name} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {r.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {r.role || "No role"}, {formatMonth(r.month)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold tabular-nums text-slate-900">
                        ₹{formatINR(r.salary)}
                      </p>
                      <button
                        onClick={() => (open ? cancelQuick() : startQuick(key))}
                        aria-expanded={open}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20"
                      >
                        {open ? "Cancel" : "Mark paid"}
                      </button>
                    </div>

                    {open && (
                      <div className="mt-3 flex flex-col gap-3 rounded-lg bg-slate-50/70 p-3 ring-1 ring-inset ring-slate-100 sm:flex-row sm:items-end">
                        <div className="sm:w-44">
                          <Label htmlFor={`quick-mode-${key}`}>Payment mode</Label>
                          <select
                            id={`quick-mode-${key}`}
                            value={quickMode}
                            onChange={(e) => setQuickMode(e.target.value)}
                            className={FIELD}
                          >
                            <option value="">Select mode</option>
                            {PAYMENT_MODES.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:w-44">
                          <Label htmlFor={`quick-date-${key}`}>Salary date</Label>
                          <input
                            id={`quick-date-${key}`}
                            type="date"
                            max={todayStr()}
                            value={quickDate}
                            onChange={(e) => setQuickDate(e.target.value)}
                            className={FIELD}
                          />
                        </div>
                        <button
                          type="button"
                          disabled={!quickMode || !quickDate}
                          onClick={() =>
                            updatePaidStatus(
                              r.entryId,
                              r._id,
                              true,
                              quickMode,
                              quickDate,
                            )
                          }
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none sm:ml-auto"
                        >
                          <MdCheck size={16} />
                          Confirm payment
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
              {outstanding.length > 5 && (
                <li className="px-6 py-3 text-center text-xs text-slate-500">
                  and {outstanding.length - 5} more in the salary sheets below
                </li>
              )}
            </ul>
          )}
        </Panel>
      </div>

      {/* ================= ADD SALARY SHEET ================= */}
      <Panel
        title="Add salary sheet"
        description="Start typing a name to pick an existing employee, or enter one manually."
      >
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5">
            {/* Column headings (desktop only) */}
            <div className="mb-2 hidden gap-3 px-1 text-xs font-medium text-slate-500 xl:grid xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(10.5rem,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_2.5rem]">
              <span>Employee name</span>
              <span>Role</span>
              <span>Pay month</span>
              <span>Salary</span>
              <span>Status</span>
              <span />
            </div>

            <div className="space-y-4 lg:space-y-3">
              {employees.map((emp, idx) => {
                const options =
                  activeDropdown === idx ? filteredEmployeeOptions(emp.name) : [];
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-200 p-4 xl:border-0 xl:p-0"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:items-center xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(10.5rem,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_2.5rem]">
                    <div className="relative sm:col-span-2">
                      <FieldLabel htmlFor={`name-${idx}`}>Employee name</FieldLabel>
                      <input
                        id={`name-${idx}`}
                        type="text"
                        autoComplete="off"
                        value={emp.name}
                        onChange={(e) => {
                          handleChange(idx, "name", e.target.value);
                          setActiveDropdown(idx);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={() => setActiveDropdown(idx)}
                        placeholder="Employee name"
                        className={FIELD}
                      />

                      {activeDropdown === idx && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute z-20 mt-1.5 max-h-56 w-full min-w-[16rem] overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                        >
                          {options.map((employee) => (
                            <button
                              type="button"
                              key={employee._id}
                              onClick={() => handleEmployeeSelect(idx, employee)}
                              className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                            >
                              <Initial name={employee?.personalDetails?.fullName} />
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium text-slate-900">
                                  {employee?.personalDetails?.fullName}
                                </span>
                                <span className="block truncate text-xs text-slate-500">
                                  {employee?.personalDetails?.qualification ||
                                    "No qualification"}
                                </span>
                              </span>
                            </button>
                          ))}

                          {options.length === 0 && (
                            <p className="px-3 py-3 text-sm text-slate-500">
                              No employee found. You can keep typing to add a
                              new name.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <FieldLabel htmlFor={`role-${idx}`}>Role</FieldLabel>
                      <input
                        id={`role-${idx}`}
                        type="text"
                        value={emp.role}
                        onChange={(e) => handleChange(idx, "role", e.target.value)}
                        placeholder="e.g. Therapist"
                        className={FIELD}
                      />
                    </div>

                    <div>
                      <FieldLabel htmlFor={`month-${idx}`}>Pay month</FieldLabel>
                      <input
                        id={`month-${idx}`}
                        type="month"
                        value={emp.month}
                        onChange={(e) => handleChange(idx, "month", e.target.value)}
                        className={`${FIELD} px-3`}
                      />
                    </div>

                    <div>
                      <FieldLabel htmlFor={`salary-${idx}`}>Salary</FieldLabel>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-slate-400">
                          ₹
                        </span>
                        <input
                          id={`salary-${idx}`}
                          type="number"
                          min={0}
                          value={emp.salary}
                          onChange={(e) =>
                            handleChange(idx, "salary", e.target.value)
                          }
                          className={`${FIELD} pl-8 tabular-nums`}
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel htmlFor={`paid-${idx}`}>Status</FieldLabel>
                      <select
                        id={`paid-${idx}`}
                        value={emp.paid ? "true" : "false"}
                        onChange={(e) => handleChange(idx, "paid", e.target.value)}
                        className={FIELD}
                      >
                        <option value="false">Unpaid</option>
                        <option value="true">Paid</option>
                      </select>
                    </div>

                    <div className="flex justify-end sm:col-span-2">
                      <button
                        type="button"
                        aria-label={`Remove employee row ${idx + 1}`}
                        disabled={employees.length === 1}
                        onClick={() => removeEmployee(idx)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>
                    </div>

                    {emp.paid && (
                      <div className="mt-3 flex flex-col gap-3 rounded-lg bg-slate-50/70 p-3 ring-1 ring-inset ring-slate-100 sm:flex-row sm:items-end">
                        <div className="sm:w-48">
                          <Label htmlFor={`mode-${idx}`}>Payment mode</Label>
                          <select
                            id={`mode-${idx}`}
                            value={emp.paymentMode}
                            onChange={(e) =>
                              handleChange(idx, "paymentMode", e.target.value)
                            }
                            required
                            className={FIELD}
                          >
                            <option value="">Select mode</option>
                            {PAYMENT_MODES.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:w-48">
                          <Label htmlFor={`paydate-${idx}`}>Salary date</Label>
                          <input
                            id={`paydate-${idx}`}
                            type="date"
                            max={todayStr()}
                            value={emp.paymentDate}
                            onChange={(e) =>
                              handleChange(idx, "paymentDate", e.target.value)
                            }
                            required
                            className={FIELD}
                          />
                        </div>
                        <p className="text-xs text-slate-500 sm:pb-3">
                          The date this salary was paid.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button type="button" onClick={addEmployee} className={`${BTN_GHOST} mt-4`}>
              <MdAdd size={18} />
              Add employee
            </button>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              {employees.length} {employees.length === 1 ? "employee" : "employees"},
              total{" "}
              <span className="text-lg font-semibold tabular-nums text-slate-900">
                ₹{formatINR(totalSalary)}
              </span>
            </p>
            <button type="submit" className={BTN_PRIMARY}>
              Save salary sheet
            </button>
          </div>
        </form>
      </Panel>

      {/* ================= SALARY SHEETS ================= */}
      {loading ? (
        <Panel title="Salary sheets">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                <SkeletonRows rows={4} cols={4} />
              </tbody>
            </table>
          </div>
        </Panel>
      ) : error ? (
        <Panel>
          <p className="px-6 py-14 text-center text-sm text-rose-600">{error}</p>
        </Panel>
      ) : salaryData.length === 0 ? (
        <Panel>
          <p className="px-6 py-14 text-center text-sm text-slate-500">
            No salary records for this period. Add a salary sheet using the form
            above.
          </p>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {salaryData.map((entry) => {
            const entryPaid = entry.employees.filter((e) => e.paid).length;
            return (
              <Panel
                key={entry._id}
                title={`Salary sheet, ${formatDate(entry.createdAt)}`}
                description={`${entry.employees.length} ${
                  entry.employees.length === 1 ? "employee" : "employees"
                }, ${entryPaid} paid`}
                aside={
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Sheet total</p>
                    <p className="text-lg font-semibold tabular-nums text-slate-900">
                      ₹{formatINR(entry.totalSalary)}
                    </p>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-medium text-slate-500">
                      <tr>
                        <th className="px-6 py-3">Employee</th>
                        <th className="px-6 py-3">Pay month</th>
                        <th className="px-6 py-3 text-right">Salary</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Payment</th>
                        <th className="w-14 px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {entry.employees.map((emp) => {
                        const isEditing = editId === emp._id;
                        const hasPaymentInfo =
                          emp.paid && (emp.paymentMode || emp.paymentDate);

                        const isPaidEdit = updateStatus === true;
                        const incomplete =
                          isPaidEdit && (!updateMode || !updateDate);
                        const unchanged =
                          updateStatus === !!emp.paid &&
                          (!isPaidEdit ||
                            (updateMode === (emp.paymentMode || "") &&
                              updateDate === dateInputValue(emp.paymentDate)));

                        return (
                          <Fragment key={emp._id}>
                            <tr
                              className={`transition-colors hover:bg-slate-50/70 ${
                                isEditing ? "bg-slate-50/70" : ""
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <Initial name={emp.name} />
                                  <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-900">
                                      {emp.name}
                                    </p>
                                    <p className="truncate text-xs text-slate-500">
                                      {emp.role || "No role"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                {formatMonth(emp.month)}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right font-semibold tabular-nums text-slate-900">
                                ₹{formatINR(emp.salary)}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <StatusPill paid={emp.paid} />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                {hasPaymentInfo ? (
                                  <div>
                                    <p className="font-medium text-slate-800">
                                      {emp.paymentMode || "-"}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {formatPayDate(emp.paymentDate)}
                                    </p>
                                  </div>
                                ) : emp.paid ? (
                                  <span className="text-xs text-slate-400">
                                    Not recorded
                                  </span>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  aria-label={
                                    isEditing ? "Cancel editing" : "Edit payment"
                                  }
                                  onClick={() =>
                                    isEditing ? cancelEdit() : startEdit(emp)
                                  }
                                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20"
                                >
                                  {isEditing ? (
                                    <MdClose size={18} />
                                  ) : (
                                    <MdEdit size={18} />
                                  )}
                                </button>
                              </td>
                            </tr>

                            {isEditing && (
                              <tr className="bg-slate-50/70">
                                <td colSpan={6} className="px-6 pb-5 pt-1">
                                  <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 lg:flex-row lg:flex-wrap lg:items-end">
                                    <div className="lg:w-40">
                                      <Label htmlFor={`edit-status-${emp._id}`}>
                                        Status
                                      </Label>
                                      <select
                                        id={`edit-status-${emp._id}`}
                                        value={updateStatus ? "true" : "false"}
                                        onChange={(e) =>
                                          changeUpdateStatus(
                                            e.target.value === "true",
                                          )
                                        }
                                        className={FIELD}
                                      >
                                        <option value="true">Paid</option>
                                        <option value="false">Unpaid</option>
                                      </select>
                                    </div>

                                    {isPaidEdit && (
                                      <>
                                        <div className="lg:w-44">
                                          <Label htmlFor={`edit-mode-${emp._id}`}>
                                            Payment mode
                                          </Label>
                                          <select
                                            id={`edit-mode-${emp._id}`}
                                            value={updateMode}
                                            onChange={(e) =>
                                              setUpdateMode(e.target.value)
                                            }
                                            className={FIELD}
                                          >
                                            <option value="">Select mode</option>
                                            {PAYMENT_MODES.map((m) => (
                                              <option key={m} value={m}>
                                                {m}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="lg:w-44">
                                          <Label htmlFor={`edit-date-${emp._id}`}>
                                            Salary date
                                          </Label>
                                          <input
                                            id={`edit-date-${emp._id}`}
                                            type="date"
                                            max={todayStr()}
                                            value={updateDate}
                                            onChange={(e) =>
                                              setUpdateDate(e.target.value)
                                            }
                                            className={FIELD}
                                          />
                                        </div>
                                      </>
                                    )}

                                    <div className="flex gap-2 lg:ml-auto">
                                      <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className={BTN_OUTLINE}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        disabled={incomplete || unchanged}
                                        onClick={() =>
                                          updatePaidStatus(
                                            entry._id,
                                            emp._id,
                                            updateStatus,
                                            updateMode,
                                            updateDate,
                                          )
                                        }
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
                                      >
                                        <MdCheck size={16} />
                                        Save changes
                                      </button>
                                    </div>
                                  </div>
                                  {isPaidEdit && incomplete && (
                                    <p className="mt-2 text-xs text-slate-500">
                                      Choose the payment mode and salary date to
                                      mark this salary as paid.
                                    </p>
                                  )}
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                    <tfoot className="border-t border-slate-200 bg-slate-50/70">
                      <tr>
                        <td
                          colSpan={2}
                          className="px-6 py-3.5 text-right font-medium text-slate-600"
                        >
                          Total
                        </td>
                        <td className="px-6 py-3.5 text-right font-semibold tabular-nums text-slate-900">
                          ₹{formatINR(entry.totalSalary)}
                        </td>
                        <td colSpan={3} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Salary;
