// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AssessmentDetailsModal from "../showAssesmentDetails/AssessmentDetailsModal";

// const assessmentItems = [
//   { name: "Neurological", key: "neurologicalFormId", path: "/assessment" },
//   {
//     name: "Musculoskeletal",
//     key: "musculoskeletalFormId",
//     path: "/musculoskeletal",
//   },
//   { name: "Obesity Management", key: "obesityFormId", path: "/obesity" },
//   { name: "Pilates", key: "pilatesPhysioFormId", path: "/pilates" },
//   // { name: "Treatment Plan", key: "treatmentPlan", path: "/treatmentPlan" },
// ];

// const AssessmentSection = ({ assessment, patientDetail }) => {
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("Neurological");
//   const [activeRecords, setActiveRecords] = useState([]);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [openModal, setOpenModal] = useState(false);

//   // console.log("assessment", assessment);

//   const goTo = (path) => {
//     navigate(path, { state: { patient: patientDetail } });
//   };

//   useEffect(() => {
//     const selected = assessmentItems.find((i) => i.name === activeTab);
//     if (!selected) return;

//     const records = assessment?.[selected.key] || [];
//     const sorted = [...records].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );
//     setActiveRecords(sorted);
//   }, [activeTab, assessment]);
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

//   return (
//     <section className="border rounded-lg p-4">
//       <h2 className="font-semibold text-lg mb-3">Assessment</h2>
//       {/* Action buttons */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         {assessmentItems.map((item) => (
//           <button
//             key={item.name}
//             onClick={() => goTo(item.path)}
//             className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
//           >
//            Add {item.name}
//           </button>
//         ))}
//       </div>
//       {/* Tabs */}
//       <div className="flex flex-wrap gap-2 mb-3">
//         {assessmentItems.map((item) => (
//           <button
//             key={item.name}
//             onClick={() => setActiveTab(item.name)}
//             className={`px-3 py-1 text-sm border rounded ${
//               activeTab === item.name ? "bg-gray-200" : "hover:bg-gray-100"
//             }`}
//           >
//             {item.name}
//           </button>
//         ))}
//       </div>
//       {/* Records */}
//       {activeRecords.length === 0 ? (
//         <p className="text-sm text-gray-500">No {activeTab} records</p>
//       ) : (
//         <ul className="text-sm list-disc ml-5">
//           {activeRecords?.map((item, index) => (
//             <li
//               key={item?._id}
//               onClick={() => {
//                 setSelectedRecord(item);
//                 setOpenModal(true);
//               }}
//               className="cursor-pointer"
//             >
//               {activeTab} Assessment #{index + 1} -{" "}
//               {formatDateTime(item?.createdAt)}
//             </li>
//           ))}
//         </ul>
//       )}
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
//     </section>
//   );
// };

// export default AssessmentSection;





import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import AssessmentDetailsModal from "../showAssesmentDetails/AssessmentDetailsModal";


/*
  Assessment section of the patient page (premium revamp).
  Same props and same behaviour: "Add ..." opens the form with the patient in the
  router state, tabs switch the record list, a record opens in the details window.
  Theme tokens match the dashboard: navy #0f2557 / #2150a8, teal #4fbfc7, ink #0f1b3d.
*/

const Icon = ({ d, className = "h-5 w-5" }) => (
  <svg className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
);

const ICONS = {
  clipboard: "M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1zM8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 12h6M9 16h6",
  plus: "M12 5v14M5 12h14",
  chevron: "M9 18l6-6-6-6",
  neuro: "M22 12h-4l-3 9L9 3l-3 9H2",
  msk: "M6.5 6.5l11 11M21 21l-1-1M3 3l1 1M18 22l4-4M2 6l4-4M3 10l7-7M14 21l7-7",
  obesity: "M3 12a9 9 0 0118 0M12 12l4-5M5 20h14",
  pilates: "M12 8a3 3 0 100-6 3 3 0 000 6zM5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2",
  alert: "M12 8v4M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

const assessmentItems = [
  { name: "Neurological", key: "neurologicalFormId", path: "/assessment", icon: ICONS.neuro },
  { name: "Musculoskeletal", key: "musculoskeletalFormId", path: "/musculoskeletal", icon: ICONS.msk },
  { name: "Obesity Management", key: "obesityFormId", path: "/obesity", icon: ICONS.obesity },
  { name: "Pilates", key: "pilatesPhysioFormId", path: "/pilates", icon: ICONS.pilates },
  // { name: "Treatment Plan", key: "treatmentPlan", path: "/treatmentPlan" },
];

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

const nonEmpty = (obj) =>
  Object.fromEntries(Object.entries(obj || {}).filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== ""));

const AssessmentSection = ({ assessment, patientDetail }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Neurological");
  const [activeRecords, setActiveRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [toast, setToast] = useState(null);

  const goTo = (path) => {
    navigate(path, { state: { patient: patientDetail } });
  };

  useEffect(() => {
    const selected = assessmentItems.find((i) => i.name === activeTab);
    if (!selected) return;

    const records = assessment?.[selected.key] || [];
    const sorted = [...records].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setActiveRecords(sorted);
  }, [activeTab, assessment]);

  const counts = useMemo(() => {
    const map = {};
    assessmentItems.forEach((i) => (map[i.name] = assessment?.[i.key]?.length || 0));
    return map;
  }, [assessment]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleDownloadPdf = async () => {
    if (!selectedRecord) return;

    if (activeTab !== "Neurological") {
      showToast(`PDF download for ${activeTab} is not set up here yet.`, "error");
      return;
    }

    try {
      // saved record first; patient details fill any gaps in older records
      const pd = patientDetail?.personalDetails || {};
      const base = {
        patientName: pd.name,
        age: pd.age,
        gender: pd.gender,
        occupation: pd?.enquiryId?.occupation,
        address: pd.address,
        contactNumber: pd.contactNumber,
      };
      const data = { ...nonEmpty(base), ...nonEmpty(selectedRecord) };
      const blob = await pdf(<NeuroAssessmentPdf data={data} />).toBlob();
      const name = String(data.patientName || "Patient").trim().replace(/\s+/g, "_");
      saveAs(blob, `Neurological_Assessment_${name}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
      showToast("Could not create the PDF. Please try again.", "error");
    }
  };

  const activeItem = assessmentItems.find((i) => i.name === activeTab);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,37,87,0.04)]">
      <div className="h-1 bg-gradient-to-r from-[#4fbfc7] via-[#2150a8] to-[#0f2557]" />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#1b3f8f] to-[#2a62b8] text-white shadow-md shadow-[#2150a8]/25">
              <Icon d={ICONS.clipboard} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#0f1b3d]">Assessments</h2>
              <p className="text-sm text-slate-500">Record and review this patient's clinical assessments</p>
            </div>
          </div>
          <span className="rounded-full bg-[#4fbfc7]/15 px-3 py-1 text-sm font-semibold text-[#2a8f98]">{total} total</span>
        </div>

        {/* Add assessment */}
        <div className="mt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">New assessment</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {assessmentItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => goTo(item.path)}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-left transition hover:border-[#4fbfc7] hover:bg-[#4fbfc7]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7]"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#2150a8] shadow-sm ring-1 ring-slate-200 transition group-hover:bg-[#2150a8] group-hover:text-white group-hover:ring-[#2150a8]">
                  <Icon d={item.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[#0f1b3d]">Add {item.name}</span>
                  <span className="text-xs text-slate-500">Start a new record</span>
                </span>
                <Icon d={ICONS.plus} className="h-4 w-4 text-slate-400 transition group-hover:text-[#2150a8]" />
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-6 overflow-x-auto border-b border-slate-200">
          {assessmentItems.map((item) => {
            const on = activeTab === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveTab(item.name)}
                aria-pressed={on}
                className={`-mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7] ${
                  on ? "border-[#2150a8] text-[#2150a8]" : "border-transparent text-slate-500 hover:text-[#0f1b3d]"
                }`}
              >
                {item.name}
                <span className={`rounded-full px-2 py-0.5 text-xs ${on ? "bg-[#2150a8]/10 text-[#2150a8]" : "bg-slate-100 text-slate-500"}`}>
                  {counts[item.name]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Records */}
        <div className="mt-5">
          {activeRecords.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200">
                <Icon d={activeItem?.icon || ICONS.clipboard} />
              </span>
              <p className="mt-3 font-semibold text-slate-700">No {activeTab} records yet</p>
              <p className="mt-0.5 text-sm text-slate-500">Add the first assessment to start tracking progress.</p>
              <button
                type="button"
                onClick={() => goTo(activeItem.path)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1b3f8f] to-[#2a62b8] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7] focus-visible:ring-offset-2"
              >
                <Icon d={ICONS.plus} className="h-4 w-4" /> Add {activeTab}
              </button>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {activeRecords.map((item, index) => (
                <li key={item?._id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecord(item);
                      setOpenModal(true);
                    }}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left transition hover:border-[#4fbfc7] hover:bg-[#4fbfc7]/5 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#2150a8]/10 text-sm font-extrabold text-[#2150a8]">
                      #{activeRecords.length - index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#0f1b3d]">{activeTab} Assessment</span>
                        {index === 0 && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">Latest</span>
                        )}
                        {item?.assessmentType && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{item.assessmentType}</span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {formatDateTime(item?.createdAt)}
                        {item?.physiotherapistName ? ` · ${item.physiotherapistName}` : ""}
                      </span>
                    </span>
                    <Icon d={ICONS.chevron} className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#2150a8]" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <AssessmentDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedRecord}
        title={`${activeTab} Assessment`}
        assessmentType={activeTab}
        onDownloadPdf={handleDownloadPdf}
      />

      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${
            toast.type === "error" ? "bg-rose-600" : "bg-[#0f2557]"
          }`}
        >
          <Icon d={ICONS.alert} className="h-5 w-5" />
          {toast.text}
        </div>
      )}
    </section>
  );
};

export default AssessmentSection;
