// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import AssessmentDetailsModal from "./showAssesmentDetails/AssessmentDetailsModal";

// const Obesity = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const patient = location?.state?.patient;
//   const patientDetail = location?.state?.patient?.personalDetails;
//   const patient_id = location?.state?.patient?._id;

//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     age: "",
//     gender: "",
//     height: "",
//     weight: "",
//     bmi: "",
//     medicalHistory: "",
//     armGirth: "",
//     thighGirth: "",
//     chest: "",
//     abdomenUmbilicus: "",
//     abdomenXiphoid: "",
//     abdomenAsis: "",
//     weightChart: Array(5).fill({ date: "", before: "", after: "" }),
//     summary: "",
//   });

//   const [activeRecords, setActiveRecords] = useState([]);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [openModal, setOpenModal] = useState(false);
//   const activeTab = "Obesity Management";

//   const formatDateTime = (date) => {
//     if (!date) return "";
//     return new Date(date).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const pickAllowedFields = (source, allowedKeys) => {
//     const result = {};
//     allowedKeys.forEach((key) => {
//       if (source[key] !== undefined) {
//         result[key] = source[key];
//       }
//     });
//     return result;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const [history, setHistory] = useState([]);

//   const handleChartChange = (index, field, value) => {
//     const newChart = [...formData.weightChart];
//     newChart[index] = { ...newChart[index], [field]: value };
//     setFormData((prev) => ({ ...prev, weightChart: newChart }));
//   };

//   useEffect(() => {
//     if (patientDetail) {
//       setFormData((prev) => ({
//         ...prev,
//         fullName: patientDetail?.name,
//         age: patientDetail?.age,
//         gender: patientDetail?.gender,
//       }));
//     }
//   }, [patientDetail]);

//   useEffect(() => {
//     const forms = patient?.assessment?.obesityFormId;

//     if (forms?.length) {
//       const lastForm = forms[forms.length - 1];

//       const allowedKeys = Object.keys(formData);

//       const filteredData = pickAllowedFields(lastForm, allowedKeys);

//       setFormData((prev) => ({
//         ...prev,
//         ...filteredData,
//       }));

//       setActiveRecords([...forms].reverse());
//     }
//   }, [patient]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payLoad = {
//       patientId: patient_id,
//       formData: formData,
//     };
//     setLoading(true);

//     try {
//       const endPoint = `${
//         import.meta.env.VITE_BACKEND_URL
//       }/api/assessment/obesity`;
//       const method = "POST";
//       const response = await fetch(endPoint, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           token: localStorage.getItem("webapptoken"),
//         },
//         body: JSON.stringify(payLoad),
//       });
//       const result = await response.json();
//       if (result.success) {
//         alert(result.message);
//         setHistory(result?.updatedForm?.history);
//         setFormData({
//           fullName: "",
//           age: "",
//           gender: "",
//           height: "",
//           weight: "",
//           bmi: "",
//           medicalHistory: "",
//           armGirth: "",
//           thighGirth: "",
//           chest: "",
//           abdomenUmbilicus: "",
//           abdomenXiphoid: "",
//           abdomenAsis: "",
//           weightChart: Array(5).fill({ date: "", before: "", after: "" }),
//           summary: "",
//         });
//         navigate(`/PatientDetails/${patient_id}`);
//       } else {
//         alert(result?.message);
//       }
//     } catch (error) {
//       console.log("error inside the nero", error);
//       alert("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {/* <div>
//         <h1 className="text-2xl font-bold mb-4">History</h1>
//         {history?.length === 0 ? (
//           <p>No history found</p>
//         ) : (
//           history?.map((item, index) => (
//             <div key={index} className="bg-white shadow-md rounded-xl p-6 mb-6">
//               <p className="text-sm text-gray-600 mb-2">
//                 <strong>{index + 1} </strong> <strong>Updated At:</strong>{" "}
//                 {new Date(item?.updatedAt).toLocaleString("en-IN")}
//               </p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 <p>
//                   <strong>Full Name:</strong> {item?.data?.fullName}
//                 </p>
//                 <p>
//                   <strong>Age:</strong> {item?.data?.age}
//                 </p>
//                 <p>
//                   <strong>Sex:</strong> {item?.data?.sex}
//                 </p>
//                 <p>
//                   <strong>Height:</strong> {item?.data?.height}
//                 </p>
//                 <p>
//                   <strong>Weight:</strong> {item?.data?.weight}
//                 </p>
//                 <p>
//                   <strong>BMI:</strong> {item?.data?.bmi}
//                 </p>
//                 <p>
//                   <strong>Medical History:</strong> {item?.data?.medicalHistory}
//                 </p>
//                 <p>
//                   <strong>Arm Girth:</strong> {item?.data?.armGirth}
//                 </p>
//                 <p>
//                   <strong>Thigh Girth:</strong> {item?.data?.thighGirth}
//                 </p>
//                 <p>
//                   <strong>Chest:</strong> {item?.data?.chest}
//                 </p>
//                 <p>
//                   <strong>Abdomen (Umbilicus):</strong>{" "}
//                   {item?.data?.abdomenUmbilicus}
//                 </p>
//                 <p>
//                   <strong>Abdomen (Xiphoid):</strong>{" "}
//                   {item?.data?.abdomenXiphoid}
//                 </p>
//                 <p>
//                   <strong>Abdomen (ASIS):</strong> {item?.data?.abdomenAsis}
//                 </p>

//                 <div className="mt-4">
//                   <h3 className="font-bold">Weight Chart</h3>
//                   <table className="w-full border mt-2">
//                     <thead>
//                       <tr>
//                         <th className="border px-2 py-1">Date</th>
//                         <th className="border px-2 py-1">Before</th>
//                         <th className="border px-2 py-1">After</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {item?.data?.weightChart?.map((entry, index) => (
//                         <tr key={index}>
//                           <td className="border px-2 py-1">{entry.date}</td>
//                           <td className="border px-2 py-1">{entry.before}</td>
//                           <td className="border px-2 py-1">{entry.after}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <p className="mt-4">
//                   <strong>Summary:</strong> {item?.data?.summary}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </div> */}
//       <div>
//         <h2>History</h2>
//         {activeRecords.length === 0 ? (
//           <p className="text-sm text-gray-500">No {activeTab} records</p>
//         ) : (
//           <ul className="text-sm list-disc ml-5 p-2">
//             {activeRecords?.map((item, index) => (
//               <li
//                 key={item?._id}
//                 onClick={() => {
//                   setSelectedRecord(item);
//                   setOpenModal(true);
//                 }}
//                 className="cursor-pointer "
//               >
//                 {activeTab} Assessment #{index + 1} -{" "}
//                 {formatDateTime(item?.createdAt)}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//       <form
//         onSubmit={handleSubmit}
//         className="w-full min-h-screen bg-gray-50 p-6 overflow-y-auto"
//       >
//         <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8 space-y-10">
//           <h1 className="text-3xl font-bold text-center text-purple-600">
//             Obesity Management Assessment Form
//           </h1>

//           {/* Patient Information */}
//           <section>
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">
//               Patient Information
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <input
//                 className="input"
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//                 readOnly
//               />
//               <input
//                 className="input"
//                 type="number"
//                 name="age"
//                 value={formData.age}
//                 onChange={handleChange}
//                 placeholder="Age"
//                 readOnly
//               />
//               <input
//                 className="input"
//                 type="text"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 placeholder="Gender"
//                 readOnly
//               />
//               <input
//                 className="input"
//                 type="number"
//                 min={0}
//                 name="height"
//                 value={formData.height}
//                 onChange={handleChange}
//                 placeholder="Height (cm)"
//               />
//               <input
//                 className="input"
//                 type="number"
//                 min={0}
//                 name="weight"
//                 value={formData.weight}
//                 onChange={handleChange}
//                 placeholder="Weight (kg)"
//               />
//               <input
//                 className="input"
//                 type="number"
//                 name="bmi"
//                 value={formData.bmi}
//                 onChange={handleChange}
//                 placeholder="BMI"
//               />
//             </div>
//           </section>

//           {/* Medical History */}
//           <section>
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">
//               Medical History
//             </h2>
//             <textarea
//               className="input h-32"
//               name="medicalHistory"
//               value={formData.medicalHistory}
//               onChange={handleChange}
//               placeholder="Any known medical conditions, medications, or previous treatments"
//             />
//           </section>

//           {/* Body Measurements */}
//           <section>
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">
//               Body Measurements
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <input
//                 className="input"
//                 type="text"
//                 name="armGirth"
//                 value={formData.armGirth}
//                 onChange={handleChange}
//                 placeholder="Arm Girth (cm)"
//               />
//               <input
//                 className="input"
//                 type="text"
//                 name="thighGirth"
//                 value={formData.thighGirth}
//                 onChange={handleChange}
//                 placeholder="Thigh Girth (cm)"
//               />
//               <input
//                 className="input"
//                 type="text"
//                 name="chest"
//                 value={formData.chest}
//                 onChange={handleChange}
//                 placeholder="Chest (cm)"
//               />
//               <input
//                 className="input"
//                 type="text"
//                 name="abdomenUmbilicus"
//                 value={formData.abdomenUmbilicus}
//                 onChange={handleChange}
//                 placeholder="Abdomen at Umbilicus (cm)"
//               />
//               <input
//                 className="input"
//                 type="text"
//                 name="abdomenXiphoid"
//                 value={formData.abdomenXiphoid}
//                 onChange={handleChange}
//                 placeholder="Abdomen at Xiphoid Process (cm)"
//               />
//               <input
//                 className="input"
//                 type="text"
//                 name="abdomenAsis"
//                 value={formData.abdomenAsis}
//                 onChange={handleChange}
//                 placeholder="Abdomen at ASIS (cm)"
//               />
//             </div>
//           </section>

//           {/* Per Day Weight Chart */}
//           <section>
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">
//               Per Day Weight Chart (Before & After Treatment)
//             </h2>
//             <div className="space-y-4">
//               {formData.weightChart.map((entry, i) => (
//                 <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <input
//                     className="input"
//                     type="date"
//                     value={entry.date}
//                     onChange={(e) =>
//                       handleChartChange(i, "date", e.target.value)
//                     }
//                   />
//                   <input
//                     className="input"
//                     type="text"
//                     value={entry.before}
//                     onChange={(e) =>
//                       handleChartChange(i, "before", e.target.value)
//                     }
//                     placeholder="Before Treatment Weight (kg)"
//                   />
//                   <input
//                     className="input"
//                     type="text"
//                     value={entry.after}
//                     onChange={(e) =>
//                       handleChartChange(i, "after", e.target.value)
//                     }
//                     placeholder="After Treatment Weight (kg)"
//                   />
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Assessment Summary */}
//           <section>
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">
//               Physiotherapist's Summary
//             </h2>
//             <textarea
//               className="input h-32"
//               name="summary"
//               value={formData.summary}
//               onChange={handleChange}
//               placeholder="Overall assessment and plan"
//             />
//           </section>

//           {/* Submit */}
//           <div className="text-center space-y-3">
//             {id && (
//               <>
//                 {history?.length >= 2 ? (
//                   <div className="text-red-600 font-semibold">
//                     No update possible. Maximum update limit (2) reached.
//                   </div>
//                 ) : (
//                   <div className="text-green-600 font-semibold">
//                     {2 - (history?.length || 0)} update
//                     {2 - (history?.length || 0) === 1 ? " is" : "s are"}{" "}
//                     remaining.
//                   </div>
//                 )}
//               </>
//             )}

//             <div className="space-x-4">
//               <button
//                 type="submit"
//                 disabled={(id && history?.length >= 2) || loading}
//                 className={`${
//                   id
//                     ? history?.length >= 2
//                       ? "bg-gray-500 cursor-not-allowed"
//                       : "bg-green-700 hover:bg-green-800"
//                     : "bg-blue-700 hover:bg-blue-800"
//                 } text-white px-8 py-3 rounded-lg transition`}
//               >
//                 {id
//                   ? loading
//                     ? "Updating..."
//                     : "Update Evaluation"
//                   : loading
//                   ? "Submitting..."
//                   : "Submit Evaluation"}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => window.history.back()}
//                 className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>
//       <AssessmentDetailsModal
//         open={openModal}
//         onClose={() => setOpenModal(false)}
//         data={selectedRecord}
//         title={`${activeTab} Assessment`}
//         assessmentType={activeTab}
//         onDownloadPdf={() => {
//           console.log("Download PDF for", activeTab, selectedRecord);
//         }}
//       />
//     </div>
//   );
// };

// export default Obesity;




import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AssessmentDetailsModal from "./showAssesmentDetails/AssessmentDetailsModal";

/*
  Obesity management assessment (revamped).
  - Weight is recorded per day: weight at CHECK-IN and weight at CHECK-OUT.
    (They are saved in the same `before` / `after` fields as before, so the
    backend, the details window and old records keep working.)
  - Rows can be added and removed, one per visit day. The change for each day
    (check-out minus check-in) is worked out for you.
  - BMI is filled in from height and weight (you can still edit it).
  - Progress and a trend chart sit next to the form.
  Theme: brand blue #0B4BAA, deep navy #051F4A, cyan #00C2CB.
*/

const activeTab = "Obesity Management";

/* ------------------------------ helpers ------------------------------ */

const todayStr = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

const nextDay = (dateStr) => {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

const dateOnly = (v) => (v ? String(v).slice(0, 10) : "");

const num = (v) =>
  v === "" || v === null || v === undefined || isNaN(Number(v)) ? null : Number(v);

const formatChange = (c) =>
  `${c > 0 ? "+" : c < 0 ? "−" : ""}${Math.abs(c).toFixed(1)} kg`;

const shortDate = (s) =>
  new Date(`${s}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const formatDateTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const pickAllowedFields = (source, allowedKeys) => {
  const result = {};
  allowedKeys.forEach((key) => {
    if (source[key] !== undefined) result[key] = source[key];
  });
  return result;
};

const blankRow = (date = "") => ({ date, before: "", after: "" });

const emptyForm = () => ({
  fullName: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  bmi: "",
  medicalHistory: "",
  armGirth: "",
  thighGirth: "",
  chest: "",
  abdomenUmbilicus: "",
  abdomenXiphoid: "",
  abdomenAsis: "",
  weightChart: [blankRow(todayStr())],
  summary: "",
});

// Change colour: for weight management, losing weight is the good direction.
const changeTone = (c) =>
  c < 0 ? "text-emerald-600" : c > 0 ? "text-rose-600" : "text-slate-500";

/* ------------------------------ ui pieces ------------------------------ */

const INPUT =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 read-only:bg-slate-50";
const INPUT_OK = "border-slate-300 focus:border-[#0B4BAA] focus:ring-[#00C2CB]/20";
const INPUT_ERR = "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10";

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
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6",
  chevron: "M9 18l6-6-6-6",
  alert: "M12 8v4M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  check: "M20 6L9 17l-5-5",
  login: "M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
};

const Card = ({ title, sub, aside, children, className = "" }) => (
  <section className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6 ${className}`}>
    {(title || aside) && (
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-800">{title}</h2>
          {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
        </div>
        {aside}
      </div>
    )}
    {children}
  </section>
);

const Field = ({ label, name, suffix, error, className = "", ...props }) => (
  <div className={className}>
    <label htmlFor={`ob-${name}`} className="mb-1.5 block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <div className="relative">
      <input
        id={`ob-${name}`}
        name={name}
        aria-invalid={error ? true : undefined}
        className={`${INPUT} ${error ? INPUT_ERR : INPUT_OK} ${suffix ? "pr-12" : ""}`}
        {...props}
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-semibold text-slate-400">
          {suffix}
        </span>
      )}
    </div>
    {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
  </div>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-[#0B4BAA]/10 px-2.5 py-1 text-xs font-semibold text-[#0B4BAA]">
    {children}
  </span>
);

/* Check-in vs check-out trend, one point per day */
const WeightChart = ({ rows }) => {
  const W = 560;
  const H = 190;
  const padL = 40;
  const padR = 14;
  const padT = 14;
  const padB = 28;

  const vals = rows.flatMap((r) => [num(r.before), num(r.after)]).filter((v) => v !== null);
  if (rows.length < 2 || vals.length < 2) {
    return (
      <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        Add at least two days of weight to see the trend.
      </p>
    );
  }

  const lo = Math.floor(Math.min(...vals) - 1);
  const hi = Math.ceil(Math.max(...vals) + 1);
  const x = (i) => padL + (i / (rows.length - 1)) * (W - padL - padR);
  const y = (v) => padT + (1 - (v - lo) / (hi - lo || 1)) * (H - padT - padB);
  const mid = (lo + hi) / 2;

  const series = (key) =>
    rows.map((r, i) => ({ i, v: num(r[key]) })).filter((p) => p.v !== null);
  const line = (key) => series(key).map((p) => `${x(p.i)},${y(p.v)}`).join(" ");

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Weight from ${shortDate(rows[0].date)} to ${shortDate(
          rows[rows.length - 1].date,
        )}, check-in and check-out`}
      >
        {[lo, mid, hi].map((g) => (
          <g key={g}>
            <line x1={padL} x2={W - padR} y1={y(g)} y2={y(g)} stroke="#E2E8F0" strokeDasharray="4 4" />
            <text x={padL - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill="#94A3B8">
              {Number.isInteger(g) ? g : g.toFixed(1)}
            </text>
          </g>
        ))}
        <polyline fill="none" stroke="#0B4BAA" strokeWidth="2.5" strokeLinejoin="round" points={line("before")} />
        <polyline fill="none" stroke="#00C2CB" strokeWidth="2.5" strokeLinejoin="round" points={line("after")} />
        {series("before").map((p) => (
          <circle key={`b${p.i}`} cx={x(p.i)} cy={y(p.v)} r="3.5" fill="#0B4BAA" />
        ))}
        {series("after").map((p) => (
          <circle key={`a${p.i}`} cx={x(p.i)} cy={y(p.v)} r="3.5" fill="#00C2CB" />
        ))}
        <text x={padL} y={H - 8} fontSize="11" fill="#64748B">
          {shortDate(rows[0].date)}
        </text>
        <text x={W - padR} y={H - 8} textAnchor="end" fontSize="11" fill="#64748B">
          {shortDate(rows[rows.length - 1].date)}
        </text>
      </svg>
      <div className="mt-2 flex gap-5 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#0B4BAA]" /> Check-in
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#00C2CB]" /> Check-out
        </span>
      </div>
    </div>
  );
};

/* ------------------------------ page ------------------------------ */

const Obesity = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const patient = location?.state?.patient;
  const patientDetail = location?.state?.patient?.personalDetails;
  const patient_id = location?.state?.patient?._id;

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  const [toast, setToast] = useState(null); // { type, text }

  const [activeRecords, setActiveRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (patientDetail) {
      setFormData((prev) => ({
        ...prev,
        fullName: patientDetail?.name,
        age: patientDetail?.age,
        gender: patientDetail?.gender,
      }));
    }
  }, [patientDetail]);

  useEffect(() => {
    const forms = patient?.assessment?.obesityFormId;

    if (forms?.length) {
      const lastForm = forms[forms.length - 1];
      const allowedKeys = Object.keys(emptyForm());
      const filteredData = pickAllowedFields(lastForm, allowedKeys);

      // keep at least one weight row, and give every row a plain YYYY-MM-DD date
      if (Array.isArray(filteredData.weightChart) && filteredData.weightChart.length) {
        filteredData.weightChart = filteredData.weightChart.map((r) => ({
          date: dateOnly(r.date),
          before: r.before ?? "",
          after: r.after ?? "",
        }));
      } else {
        delete filteredData.weightChart;
      }

      setFormData((prev) => ({ ...prev, ...filteredData }));
      setActiveRecords([...forms].reverse());
      if (Array.isArray(lastForm.history)) setHistory(lastForm.history);
    }
  }, [patient]);

  /* ---------- handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // BMI follows height and weight (it can still be edited by hand)
      if (name === "height" || name === "weight") {
        const h = num(next.height);
        const w = num(next.weight);
        if (h > 0 && w > 0) next.bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
      }
      return next;
    });
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleChartChange = (index, field, value) => {
    setFormData((prev) => {
      const chart = [...prev.weightChart];
      chart[index] = { ...chart[index], [field]: value };
      return { ...prev, weightChart: chart };
    });
    if (rowErrors[index]) setRowErrors((p) => ({ ...p, [index]: "" }));
  };

  const addDay = () => {
    setFormData((prev) => {
      const dates = prev.weightChart.map((r) => r.date).filter(Boolean).sort();
      const date = dates.length ? nextDay(dates[dates.length - 1]) : todayStr();
      return { ...prev, weightChart: [...prev.weightChart, blankRow(date)] };
    });
  };

  const removeDay = (index) => {
    setFormData((prev) =>
      prev.weightChart.length === 1
        ? prev
        : { ...prev, weightChart: prev.weightChart.filter((_, i) => i !== index) },
    );
    setRowErrors({});
  };

  const validate = () => {
    const top = {};
    ["height", "weight"].forEach((k) => {
      if (formData[k] !== "" && !(Number(formData[k]) > 0)) top[k] = "Enter a value above 0.";
    });

    const rows = {};
    const seen = new Set();
    formData.weightChart.forEach((r, i) => {
      const has = r.before !== "" || r.after !== "";
      if (!has) return;
      if (!r.date) rows[i] = "Choose the date for this entry.";
      else if (seen.has(r.date)) rows[i] = "Another row already uses this date.";
      else if (
        (r.before !== "" && !(Number(r.before) > 0)) ||
        (r.after !== "" && !(Number(r.after) > 0))
      )
        rows[i] = "Weights must be above 0.";
      seen.add(r.date);
    });

    setFieldErrors(top);
    setRowErrors(rows);
    return Object.keys(top).length + Object.keys(rows).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }

    // only days that have a weight are saved
    const payLoad = {
      patientId: patient_id,
      formData: {
        ...formData,
        weightChart: formData.weightChart.filter((r) => r.before !== "" || r.after !== ""),
      },
    };
    setLoading(true);

    try {
      const endPoint = `${import.meta.env.VITE_BACKEND_URL}/api/assessment/obesity`;
      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("webapptoken"),
        },
        body: JSON.stringify(payLoad),
      });
      const result = await response.json();
      if (result.success) {
        setToast({ type: "success", text: result.message || "Assessment saved." });
        setHistory(result?.updatedForm?.history || []);
        setTimeout(() => navigate(`/PatientDetails/${patient_id}`), 900);
      } else {
        setToast({ type: "error", text: result?.message || "Could not save the assessment." });
      }
    } catch (error) {
      console.log("error inside the nero", error);
      setToast({ type: "error", text: "Could not save the assessment. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- derived ---------- */
  const logRows = useMemo(
    () =>
      formData.weightChart
        .filter((r) => r.date && (num(r.before) !== null || num(r.after) !== null))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [formData.weightChart],
  );

  const progress = useMemo(() => {
    if (!logRows.length) return null;
    const first = logRows[0];
    const last = logRows[logRows.length - 1];
    const start = num(first.before) ?? num(first.after);
    const latest = num(last.after) ?? num(last.before);
    const readings = logRows.reduce(
      (n, r) => n + (num(r.before) !== null ? 1 : 0) + (num(r.after) !== null ? 1 : 0),
      0,
    );
    return {
      start,
      latest,
      change: readings >= 2 && start !== null && latest !== null ? latest - start : null,
      days: logRows.length,
    };
  }, [logRows]);

  const missingPatient = !patient_id;
  const limitReached = !!id && history?.length >= 2;
  const initial = (formData.fullName || "?").toString().trim().charAt(0).toUpperCase();
  const submitLabel = id
    ? loading
      ? "Updating..."
      : "Update evaluation"
    : loading
      ? "Submitting..."
      : "Submit evaluation";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      {/* ---------- header ---------- */}
      <header className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="h-1.5 bg-gradient-to-r from-[#00C2CB] via-[#0B4BAA] to-[#051F4A]" />
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#0B4BAA] to-[#051F4A] text-xl font-extrabold text-white shadow-md shadow-[#0B4BAA]/25">
              {initial}
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0B4BAA]">Obesity Management Assessment</p>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {formData.fullName || "Patient"}
              </h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.age !== "" && formData.age !== undefined && (
                  <Chip>{formData.age} years</Chip>
                )}
                {formData.gender && <Chip>{formData.gender}</Chip>}
                {patientDetail?.patientId && <Chip>ID {patientDetail.patientId}</Chip>}
              </div>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              id ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {id ? "Updating an evaluation" : "New evaluation"}
          </span>
        </div>
      </header>

      {missingPatient && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200"
        >
          <Icon d={ICONS.alert} className="mt-0.5 h-5 w-5 text-amber-600" />
          <p>
            <b>Patient details were not found.</b> Open this form from the patient's page so the
            assessment is saved to the right patient. Saving is switched off until then.
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* ---------- form ---------- */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6 xl:col-span-2">
          {/* Vitals */}
          <Card title="Vitals" sub="Height and weight. BMI is worked out for you.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Height"
                name="height"
                type="number"
                min={0}
                step="0.1"
                inputMode="decimal"
                suffix="cm"
                value={formData.height}
                onChange={handleChange}
                error={fieldErrors.height}
              />
              <Field
                label="Weight"
                name="weight"
                type="number"
                min={0}
                step="0.1"
                inputMode="decimal"
                suffix="kg"
                value={formData.weight}
                onChange={handleChange}
                error={fieldErrors.weight}
              />
              <Field
                label="BMI"
                name="bmi"
                type="number"
                min={0}
                step="0.1"
                inputMode="decimal"
                suffix="kg/m²"
                value={formData.bmi}
                onChange={handleChange}
              />
            </div>
          </Card>

          {/* Medical history */}
          <Card title="Medical history">
            <label htmlFor="ob-medicalHistory" className="sr-only">
              Medical history
            </label>
            <textarea
              id="ob-medicalHistory"
              name="medicalHistory"
              rows={4}
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Any known medical conditions, medications, or previous treatments"
              className={`${INPUT} ${INPUT_OK} resize-y`}
            />
          </Card>

          {/* Body measurements */}
          <Card title="Body measurements" sub="Girth in centimetres.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["armGirth", "Arm girth"],
                ["thighGirth", "Thigh girth"],
                ["chest", "Chest"],
                ["abdomenUmbilicus", "Abdomen at umbilicus"],
                ["abdomenXiphoid", "Abdomen at xiphoid process"],
                ["abdomenAsis", "Abdomen at ASIS"],
              ].map(([name, label]) => (
                <Field
                  key={name}
                  label={label}
                  name={name}
                  type="number"
                  min={0}
                  step="0.1"
                  inputMode="decimal"
                  suffix="cm"
                  value={formData[name]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </Card>

          {/* Daily weight log */}
          <Card
            title="Daily weight log"
            sub="One row for each visit day: weight when the patient checks in and when they check out."
            aside={
              <button
                type="button"
                onClick={addDay}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#0B4BAA] px-3.5 py-2 text-sm font-semibold text-[#0B4BAA] transition hover:bg-[#0B4BAA] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2"
              >
                <Icon d={ICONS.plus} className="h-4 w-4" /> Add day
              </button>
            }
          >
            {/* column headings (desktop) */}
            <div className="mb-2 hidden grid-cols-[1.2fr_1fr_1fr_0.9fr_2.5rem] gap-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-400 md:grid">
              <span>Date</span>
              <span className="flex items-center gap-1.5">
                <Icon d={ICONS.login} className="h-3.5 w-3.5" /> Check-in weight
              </span>
              <span className="flex items-center gap-1.5">
                <Icon d={ICONS.logout} className="h-3.5 w-3.5" /> Check-out weight
              </span>
              <span>Change</span>
              <span />
            </div>

            <div className="space-y-3">
              {formData.weightChart.map((entry, i) => {
                const b = num(entry.before);
                const a = num(entry.after);
                const change = b !== null && a !== null ? a - b : null;
                const err = rowErrors[i];
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 p-3 md:border-0 md:p-0"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_0.9fr_2.5rem] md:items-center">
                      <div>
                        <label htmlFor={`ob-date-${i}`} className="mb-1.5 block text-sm font-semibold text-slate-700 md:sr-only">
                          Date
                        </label>
                        <input
                          id={`ob-date-${i}`}
                          type="date"
                          value={entry.date}
                          onChange={(e) => handleChartChange(i, "date", e.target.value)}
                          className={`${INPUT} ${err ? INPUT_ERR : INPUT_OK} px-3`}
                        />
                      </div>
                      <div>
                        <label htmlFor={`ob-in-${i}`} className="mb-1.5 block text-sm font-semibold text-slate-700 md:sr-only">
                          Check-in weight
                        </label>
                        <div className="relative">
                          <input
                            id={`ob-in-${i}`}
                            type="number"
                            min={0}
                            step="0.1"
                            inputMode="decimal"
                            value={entry.before}
                            onChange={(e) => handleChartChange(i, "before", e.target.value)}
                            placeholder="At check-in"
                            className={`${INPUT} ${err ? INPUT_ERR : INPUT_OK} pr-10`}
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-semibold text-slate-400">
                            kg
                          </span>
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`ob-out-${i}`} className="mb-1.5 block text-sm font-semibold text-slate-700 md:sr-only">
                          Check-out weight
                        </label>
                        <div className="relative">
                          <input
                            id={`ob-out-${i}`}
                            type="number"
                            min={0}
                            step="0.1"
                            inputMode="decimal"
                            value={entry.after}
                            onChange={(e) => handleChartChange(i, "after", e.target.value)}
                            placeholder="At check-out"
                            className={`${INPUT} ${err ? INPUT_ERR : INPUT_OK} pr-10`}
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-semibold text-slate-400">
                            kg
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:block">
                        <span className="text-sm font-semibold text-slate-700 md:hidden">Change:</span>
                        <span
                          className={`text-sm font-bold tabular-nums ${
                            change === null ? "text-slate-300" : changeTone(change)
                          }`}
                        >
                          {change === null ? "-" : formatChange(change)}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeDay(i)}
                          disabled={formData.weightChart.length === 1}
                          aria-label={`Remove day ${i + 1}`}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        >
                          <Icon d={ICONS.trash} className="h-[18px] w-[18px]" />
                        </button>
                      </div>
                    </div>
                    {err && <p className="mt-2 text-xs text-rose-600">{err}</p>}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Change is check-out minus check-in. Leave check-out empty until the patient leaves. Days
              without any weight are not saved.
            </p>
          </Card>

          {/* Summary */}
          <Card title="Physiotherapist's summary">
            <label htmlFor="ob-summary" className="sr-only">
              Summary
            </label>
            <textarea
              id="ob-summary"
              name="summary"
              rows={4}
              value={formData.summary}
              onChange={handleChange}
              placeholder="Overall assessment and plan"
              className={`${INPUT} ${INPUT_OK} resize-y`}
            />
          </Card>

          {/* Action bar */}
          <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl bg-white/90 px-5 py-3.5 shadow-lg ring-1 ring-slate-200 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium">
              {id ? (
                limitReached ? (
                  <span className="text-rose-600">
                    No update possible. Maximum update limit (2) reached.
                  </span>
                ) : (
                  <span className="text-emerald-700">
                    {2 - (history?.length || 0)} update
                    {2 - (history?.length || 0) === 1 ? " is" : "s are"} remaining.
                  </span>
                )
              ) : (
                <span className="text-slate-500">Check the details, then submit.</span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={limitReached || loading || missingPatient}
                className="rounded-xl bg-[#0B4BAA] px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#0B4BAA]/30 transition hover:bg-[#093d8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </form>

        {/* ---------- sidebar ---------- */}
        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Card title="Weight progress" sub="From the daily log.">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 px-2 py-3">
                <p className="text-lg font-extrabold text-slate-900">
                  {progress?.start != null ? `${progress.start}` : "-"}
                </p>
                <p className="text-xs text-slate-500">Start (kg)</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-2 py-3">
                <p className="text-lg font-extrabold text-slate-900">
                  {progress?.latest != null ? `${progress.latest}` : "-"}
                </p>
                <p className="text-xs text-slate-500">Latest (kg)</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-2 py-3">
                <p
                  className={`text-lg font-extrabold ${
                    progress?.change != null ? changeTone(progress.change) : "text-slate-300"
                  }`}
                >
                  {progress?.change != null ? formatChange(progress.change).replace(" kg", "") : "-"}
                </p>
                <p className="text-xs text-slate-500">Change (kg)</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Start is the first check-in. Latest is the most recent check-out.
              {progress ? ` ${progress.days} ${progress.days === 1 ? "day" : "days"} logged.` : ""}
            </p>
            <div className="mt-4">
              <WeightChart rows={logRows} />
            </div>
          </Card>

          <Card title="Past assessments" sub="Select one to see its details.">
            {activeRecords.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No {activeTab} records yet.
              </p>
            ) : (
              <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {activeRecords.map((item, index) => (
                  <li key={item?._id || index}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRecord(item);
                        setOpenModal(true);
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-[#0B4BAA] hover:bg-[#0B4BAA]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">
                          Assessment #{activeRecords.length - index}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {formatDateTime(item?.createdAt)}
                        </span>
                      </span>
                      <Icon d={ICONS.chevron} className="h-4 w-4 text-slate-400" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>

      <AssessmentDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedRecord}
        title={`${activeTab} Assessment`}
        assessmentType={activeTab}
        onDownloadPdf={() => {
          console.log("Download PDF for", activeTab, selectedRecord);
        }}
      />

      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          className={`fixed right-6 top-6 z-[100] flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${
            toast.type === "error" ? "bg-rose-600" : "bg-[#051F4A]"
          }`}
        >
          <Icon d={toast.type === "error" ? ICONS.alert : ICONS.check} className="h-5 w-5" />
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default Obesity;
