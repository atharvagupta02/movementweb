// import ConvertToPatientForm from "./ConvertToPatientForm";
// import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { pdf } from "@react-pdf/renderer";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import EnquiryPdfDocument from "./pdf/EnquiryPdfDocument";

// const AllEnquiry = () => {
//   const backendURL = import.meta.env.VITE_BACKEND_URL;

//   const [enquiries, setEnquiries] = useState([]);
//   const [activeStatus, setActiveStatus] = useState("all");
//   const [patientStatus, setPatientStatus] = useState("all");
//   const [showConvertToPatientForm, setShowConvertToPatientForm] =
//     useState(false);
//   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("newest");
//   const [deletingEnquiryId, setDeletingEnquiryId] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editData, setEditData] = useState({
//     enquiryId: "",
//     patientId: "",
//     enquiryStatus: "",
//     patientStatus: "true",
//     remark: "",
//   });

//   const [savingEdit, setSavingEdit] = useState(false);
//   const [downloadingPdf, setDownloadingPdf] = useState(false);
//   const [downloadingExcel, setDownloadingExcel] = useState(false);

//   const [loadingEnquiries, setLoadingEnquiries] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(9);

//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalEnquiries: 0,
//     limit: 9,
//     hasPrevPage: false,
//     hasNextPage: false,
//   });

//   const tabs = ["all", "lead", "patient"];

//   const fetchAllEnquiries = async () => {
//     try {
//       setLoadingEnquiries(true);

//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(limit),
//         activeStatus,
//         patientStatus,
//         search: searchTerm.trim(),
//         sortBy,
//       });

//       const response = await fetch(
//         `${backendURL}/api/enquiry/getEnquiry?${params.toString()}`,
//       );

//       const result = await response.json();

//       setEnquiries(result?.enquiries || []);
//       setPagination(
//         result?.pagination || {
//           currentPage: 1,
//           totalPages: 1,
//           totalEnquiries: 0,
//           limit,
//           hasPrevPage: false,
//           hasNextPage: false,
//         },
//       );
//     } catch (error) {
//       console.error("Error fetching enquiries:", error);
//     } finally {
//       setLoadingEnquiries(false);
//     }
//   };

//   useEffect(() => {
//     setPage(1);
//   }, [activeStatus, patientStatus, searchTerm, sortBy, limit]);

//   useEffect(() => {
//     fetchAllEnquiries();
//   }, [page, limit, activeStatus, patientStatus, searchTerm, sortBy]);

//   useEffect(() => {
//     const employeeData = localStorage.getItem("loginEmployeeData");

//     if (!employeeData) {
//       setIsAdmin(false);
//       return;
//     }

//     try {
//       const employee = JSON.parse(employeeData);
//       const loggedInEmail = employee?.personalDetails?.email
//         ?.trim()
//         ?.toLowerCase();
//       const adminEmail =
//         import.meta.env.VITE_ADMIN_EMAIL?.trim()?.toLowerCase();

//       setIsAdmin(loggedInEmail === adminEmail);
//     } catch (error) {
//       console.error("Failed to parse loginEmployeeData:", error);
//       setIsAdmin(false);
//     }
//   }, []);

//   const getFilteredEnquiries = () => {
//     let filtered = [...enquiries];
//     if (activeStatus === "all") {
//       filtered = filtered.filter((e) => {
//         const status = e?.patientId?.personalDetails?.patientStatus;
//         return !(e.enquiryStatus === "patient" && status === false);
//       });
//     } else if (activeStatus === "lead") {
//       filtered = filtered.filter((e) => e.enquiryStatus === "lead");
//     } else if (activeStatus === "patient") {
//       filtered = filtered.filter((e) => e.enquiryStatus === "patient");
//     }

//     if (activeStatus === "patient" && patientStatus !== "all") {
//       filtered = filtered.filter((e) => {
//         const status = e?.patientId?.personalDetails?.patientStatus;

//         if (patientStatus === "active") return status === true;
//         if (patientStatus === "inactive") return status === false;

//         return true;
//       });
//     }

//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();

//       filtered = filtered.filter((item) => {
//         const nameMatch = item?.patientName?.toLowerCase().includes(term);
//         const phoneMatch = item?.contactNumber?.includes(term);
//         const patientIdMatch = item?.patientId?.personalDetails?.patientId
//           ?.toLowerCase()
//           .includes(term);

//         return nameMatch || phoneMatch || patientIdMatch;
//       });
//     }

//     filtered.sort((a, b) => {
//       const dateA = new Date(a.createdAt);
//       const dateB = new Date(b.createdAt);
//       return sortBy === "newest" ? dateB - dateA : dateA - dateB;
//     });

//     return filtered;
//   };

//   const normalizeEnquiryData = (data) => {
//     return data.map((item, index) => ({
//       "S.No": index + 1,
//       "Enquiry ID": item?._id || "",
//       Type: item?.enquiryStatus || "",
//       "Patient Status":
//         item?.enquiryStatus === "patient"
//           ? item?.patientId?.personalDetails?.patientStatus
//             ? "Active"
//             : "Inactive"
//           : "-",
//       "Patient Code": item?.patientId?.personalDetails?.patientId || "-",
//       Name: item?.patientName || "",
//       Gender: item?.gender || "",
//       Age: item?.age ?? "",
//       Occupation: item?.occupation || "",
//       "Contact Number": item?.contactNumber || "",
//       Email: item?.email || "",
//       "Chief Complaint": item?.chiefComplaint || "",
//       Remark: item?.remark || "",
//       Response: item?.response || "",
//       Source: item?.source || "",
//       Address: item?.patientId?.personalDetails?.address || "-",
//       "Attendance Count": item?.patientId?.attendance?.length || 0,
//       "Billing Count": item?.patientId?.billing?.length || 0,
//       "Treatment Count": item?.patientId?.treatment?.length || 0,
//       "Created Date": item?.createdAt
//         ? new Date(item.createdAt).toLocaleDateString()
//         : "",
//       "Created Time": item?.createdAt
//         ? new Date(item.createdAt).toLocaleTimeString()
//         : "",
//       "Updated Date": item?.updatedAt
//         ? new Date(item.updatedAt).toLocaleDateString()
//         : "",
//     }));
//   };

//   const getSummaryStats = (data) => {
//     const total = data.length;
//     const leads = data.filter((item) => item.enquiryStatus === "lead").length;
//     const patients = data.filter(
//       (item) => item.enquiryStatus === "patient",
//     ).length;
//     const activePatients = data.filter(
//       (item) =>
//         item.enquiryStatus === "patient" &&
//         item?.patientId?.personalDetails?.patientStatus === true,
//     ).length;
//     const inactivePatients = data.filter(
//       (item) =>
//         item.enquiryStatus === "patient" &&
//         item?.patientId?.personalDetails?.patientStatus === false,
//     ).length;
//     const conversionRate =
//       total > 0 ? ((patients / total) * 100).toFixed(2) : 0;

//     return {
//       total,
//       leads,
//       patients,
//       activePatients,
//       inactivePatients,
//       conversionRate,
//     };
//   };

//   const getExportFileName = (type) => {
//     const date = new Date().toISOString().split("T")[0];
//     const statusPart = activeStatus || "all";
//     const patientFilterPart =
//       activeStatus === "patient" ? `-${patientStatus}` : "";
//     const searchPart = searchTerm?.trim()
//       ? `-${searchTerm.trim().replace(/\s+/g, "-")}`
//       : "";

//     return `enquiry-${statusPart}${patientFilterPart}${searchPart}-${date}.${type}`;
//   };

//   const handleDownloadExcel = async () => {
//     try {
//       setDownloadingExcel(true);

//       const filteredData = getFilteredEnquiries();
//       const normalizedData = normalizeEnquiryData(filteredData);
//       const stats = getSummaryStats(filteredData);

//       const workbook = XLSX.utils.book_new();

//       const summaryData = [
//         ["Enquiry Report Summary"],
//         [],
//         ["Total Enquiries", stats.total],
//         ["Total Leads", stats.leads],
//         ["Total Patients", stats.patients],
//         ["Active Patients", stats.activePatients],
//         ["Inactive Patients", stats.inactivePatients],
//         ["Conversion Rate (%)", stats.conversionRate],
//         [],
//         ["Applied Filters"],
//         ["Enquiry Type Filter", activeStatus],
//         ["Patient Status Filter", patientStatus],
//         ["Search Term", searchTerm || "-"],
//         ["Sort By", sortBy],
//       ];

//       const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
//       XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

//       const dataSheet = XLSX.utils.json_to_sheet(normalizedData);
//       XLSX.utils.book_append_sheet(workbook, dataSheet, "Enquiries");

//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "array",
//       });

//       const blob = new Blob([excelBuffer], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
//       });

//       saveAs(blob, getExportFileName("xlsx"));
//     } catch (error) {
//       console.error("Excel download failed:", error);
//       alert("Failed to download Excel");
//     } finally {
//       setDownloadingExcel(false);
//     }
//   };

//   const handleDownloadPdf = async () => {
//     try {
//       setDownloadingPdf(true);

//       const filteredData = getFilteredEnquiries();
//       const stats = getSummaryStats(filteredData);

//       const blob = await pdf(
//         <EnquiryPdfDocument
//           enquiries={filteredData}
//           stats={stats}
//           activeStatus={activeStatus}
//           patientStatus={patientStatus}
//           searchTerm={searchTerm}
//           sortBy={sortBy}
//         />,
//       ).toBlob();

//       saveAs(blob, getExportFileName("pdf"));
//     } catch (error) {
//       console.error("PDF download failed:", error);
//       alert("Failed to download PDF");
//     } finally {
//       setDownloadingPdf(false);
//     }
//   };

//   const openEditModal = (entry) => {
//     setSelectedEnquiry(entry);
//     setEditData({
//       enquiryId: entry?._id || "",
//       patientId: entry?.patientId?._id || "",
//       enquiryStatus: entry?.enquiryStatus || "lead",
//       patientStatus: entry?.patientId?.personalDetails?.patientStatus
//         ? "true"
//         : "false",
//       remark: entry?.remark || "",
//     });
//     setShowEditModal(true);
//   };

//   const closeEditModal = () => {
//     setShowEditModal(false);
//     setSelectedEnquiry(null);
//     setEditData({
//       enquiryId: "",
//       patientId: "",
//       enquiryStatus: "",
//       patientStatus: "true",
//       remark: "",
//     });
//   };

//   const handleConvertToPatient = async (data) => {
//     const confirmConvert = window.confirm(
//       "Are you sure you want to convert this enquiry into patient?",
//     );

//     if (!confirmConvert) return;

//     try {
//       const payload = {
//         ...data,
//         enquiryId: selectedEnquiry?._id,
//       };

//       const response = await fetch(`${backendURL}/api/patient/createPatient`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (result?.success) {
//         alert("Patient created successfully");
//         fetchAllEnquiries();
//         setShowConvertToPatientForm(false);
//         closeEditModal();
//       } else {
//         alert(result?.message || "Failed to convert to patient");
//       }
//     } catch (error) {
//       console.error("Convert to patient failed", error);
//       alert("Something went wrong");
//     }
//   };

//   const handleSaveEdit = async () => {
//     try {
//       setSavingEdit(true);

//       const response = await fetch(
//         `${backendURL}/api/patient/updatePatientStatus`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             enquiryId: editData.enquiryId,
//             patientId: editData.patientId || null,
//             patientStatus:
//               editData.enquiryStatus === "patient"
//                 ? editData.patientStatus === "true"
//                 : undefined,
//             remark: editData.remark,
//           }),
//         },
//       );

//       const result = await response.json();

//       if (result?.success) {
//         alert("Updated successfully");
//         fetchAllEnquiries();
//         closeEditModal();
//       } else {
//         alert(result?.message || "Failed to update");
//       }
//     } catch (error) {
//       console.error("Error updating enquiry/patient:", error);
//       alert("Something went wrong");
//     } finally {
//       setSavingEdit(false);
//     }
//   };

//   const handleDeleteEnquiry = async (enquiryId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this enquiry?",
//     );

//     if (!confirmDelete) return;

//     try {
//       setDeletingEnquiryId(enquiryId);

//       const response = await fetch(
//         `${backendURL}/api/enquiry/deleteEnquiryById/${enquiryId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             token: localStorage.getItem("webapptoken"),
//           },
//         },
//       );

//       const result = await response.json();

//       if (result?.success) {
//         alert("Enquiry deleted successfully");
//         fetchAllEnquiries();
//         closeEditModal();
//       } else {
//         alert(result?.message || "Delete failed");
//       }
//     } catch (error) {
//       console.error("Delete enquiry failed", error);
//       alert("Something went wrong");
//     } finally {
//       setDeletingEnquiryId(null);
//     }
//   };

//   const filteredEnquiries = getFilteredEnquiries();

//   return (
//     <div className="px-6">
//       <div className="flex flex-wrap gap-4 mt-10 mb-4 items-center">
//         {tabs?.map((s) => (
//           <button
//             key={s}
//             onClick={() => {
//               setActiveStatus(s);
//               if (s !== "patient") setPatientStatus("all");
//             }}
//             className={`px-4 py-2 rounded ${
//               activeStatus === s ? "bg-blue-600 text-white" : "bg-gray-200"
//             }`}
//           >
//             {s.toUpperCase()}
//           </button>
//         ))}
//         <p className="text-black font-semibold">
//           Total Enquiry :-{" "}
//           <span className="text-gray-600">{pagination.totalEnquiries}</span>
//         </p>
//       </div>

//       <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name, phone, or patient ID"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="px-4 py-2 border rounded w-full md:w-1/2"
//         />

//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           className="px-4 py-2 border rounded w-full md:w-1/4"
//         >
//           <option value="newest">Newest First</option>
//           <option value="oldest">Oldest First</option>
//         </select>

//         <select
//           value={limit}
//           onChange={(e) => setLimit(Number(e.target.value))}
//           className="px-4 py-2 border rounded w-full md:w-1/4"
//         >
//           <option value={6}>6 / page</option>
//           <option value={9}>9 / page</option>
//           <option value={12}>12 / page</option>
//           <option value={24}>24 / page</option>
//         </select>

//         {activeStatus === "patient" && (
//           <select
//             value={patientStatus}
//             onChange={(e) => setPatientStatus(e.target.value)}
//             className="px-4 py-2 border rounded w-full md:w-1/4"
//           >
//             <option value="all">All Patients</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         )}
//       </div>

//       <div className="flex flex-wrap gap-3 mb-6">
//         <button
//           onClick={handleDownloadPdf}
//           disabled={downloadingPdf || filteredEnquiries.length === 0}
//           className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-60"
//         >
//           {downloadingPdf ? "Downloading PDF..." : "Download PDF"}
//         </button>

//         <button
//           onClick={handleDownloadExcel}
//           disabled={downloadingExcel || filteredEnquiries.length === 0}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
//         >
//           {downloadingExcel ? "Downloading Excel..." : "Download Excel"}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//         {loadingEnquiries ? (
//           <div className="col-span-full flex justify-center items-center py-12 text-blue-600 gap-2">
//             <AiOutlineLoading3Quarters className="animate-spin" />
//             Loading enquiries...
//           </div>
//         ) : filteredEnquiries.length === 0 ? (
//           <div className="col-span-full text-center py-12">
//             <p className="text-lg font-medium text-gray-600">
//               No enquiries match your filters
//             </p>
//             <p className="text-sm text-gray-400">
//               Try changing filters or search keywords
//             </p>
//           </div>
//         ) : (
//           filteredEnquiries.map((entry) => (
//             <div
//               key={entry._id}
//               className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
//             >
//               {isAdmin && (
//                 <button
//                   onClick={() => openEditModal(entry)}
//                   className="absolute top-3 right-3 bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700"
//                 >
//                   Edit
//                 </button>
//               )}

//               <div className="mb-2 pr-16">
//                 {entry.enquiryStatus === "patient" && (
//                   <div className="mb-2 space-y-2">
//                     <p className="text-xs text-gray-500">
//                       Patient ID:{" "}
//                       <span className="font-medium">
//                         {entry.patientId?.personalDetails?.patientId}
//                       </span>
//                     </p>

//                     <div className="flex items-center justify-between gap-3">
//                       <p className="text-sm font-medium">
//                         Status:{" "}
//                         <span
//                           className={
//                             entry?.patientId?.personalDetails?.patientStatus
//                               ? "text-green-600"
//                               : "text-red-600"
//                           }
//                         >
//                           {entry?.patientId?.personalDetails?.patientStatus
//                             ? "Active"
//                             : "Inactive"}
//                         </span>
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 <h3 className="font-semibold text-gray-800 text-base">
//                   <span>Name- </span>
//                   <span className="text-sm text-gray-500">
//                     {entry?.patientName}
//                   </span>
//                 </h3>

//                 <p className="font-semibold text-gray-800 text-base">
//                   <span className="text-sm text-gray-500">Contact number-</span>{" "}
//                   {entry?.contactNumber}
//                 </p>

//                 <p className="font-semibold text-gray-800 text-base">
//                   <span className="text-sm text-gray-500">Remark-</span>{" "}
//                   {entry?.remark || "_______"}
//                 </p>
//               </div>

//               <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                 <span className="font-medium text-gray-700">Complaint:</span>{" "}
//                 {entry.chiefComplaint || "-"}
//               </p>

//               <div className="flex items-center justify-between">
//                 {entry.enquiryStatus === "lead" ? (
//                   <span className="text-sm font-medium text-yellow-600">
//                     ● Lead
//                   </span>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-medium text-green-600">
//                       ● Patient
//                     </span>
//                     <Link
//                       to={`/PatientDetails/${entry?.patientId?._id}`}
//                       className="text-sm text-blue-600 hover:underline"
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {pagination.totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 mb-8">
//           <p className="text-sm text-gray-600">
//             Page {pagination.currentPage} of {pagination.totalPages} • Total{" "}
//             {pagination.totalEnquiries}
//           </p>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//               disabled={!pagination.hasPrevPage || loadingEnquiries}
//               className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//             >
//               Previous
//             </button>

//             <span className="px-4 py-2 bg-blue-600 text-white rounded">
//               {pagination.currentPage}
//             </span>

//             <button
//               onClick={() =>
//                 setPage((prev) => Math.min(prev + 1, pagination.totalPages))
//               }
//               disabled={!pagination.hasNextPage || loadingEnquiries}
//               className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {showEditModal && selectedEnquiry && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
//           <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
//             <button
//               onClick={closeEditModal}
//               className="absolute right-4 top-4 text-gray-500 hover:text-black text-xl"
//             >
//               ×
//             </button>

//             <h2 className="text-xl font-semibold mb-4">Edit Enquiry</h2>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   type="text"
//                   value={selectedEnquiry?.patientName || ""}
//                   disabled
//                   className="w-full border rounded px-3 py-2 bg-gray-100"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Remark</label>
//                 <textarea
//                   rows={4}
//                   value={editData.remark}
//                   onChange={(e) =>
//                     setEditData((prev) => ({
//                       ...prev,
//                       remark: e.target.value,
//                     }))
//                   }
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="Update remark"
//                 />
//               </div>

//               {editData.enquiryStatus === "patient" && (
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Patient Status
//                   </label>
//                   <select
//                     value={editData.patientStatus}
//                     onChange={(e) =>
//                       setEditData((prev) => ({
//                         ...prev,
//                         patientStatus: e.target.value,
//                       }))
//                     }
//                     className="w-full border rounded px-3 py-2"
//                   >
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </select>
//                 </div>
//               )}

//               <div className="flex flex-wrap gap-3 pt-2">
//                 <button
//                   onClick={handleSaveEdit}
//                   disabled={savingEdit}
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-70"
//                 >
//                   {savingEdit ? "Saving..." : "Update"}
//                 </button>

//                 {selectedEnquiry?.enquiryStatus === "lead" && (
//                   <button
//                     onClick={() => {
//                       setShowEditModal(false);
//                       setShowConvertToPatientForm(true);
//                     }}
//                     className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                   >
//                     Convert to Patient
//                   </button>
//                 )}

//                 <button
//                   onClick={() => handleDeleteEnquiry(selectedEnquiry?._id)}
//                   disabled={deletingEnquiryId === selectedEnquiry?._id}
//                   className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-70 flex items-center gap-2"
//                 >
//                   {deletingEnquiryId === selectedEnquiry?._id && (
//                     <AiOutlineLoading3Quarters className="animate-spin" />
//                   )}
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showConvertToPatientForm && (
//         <ConvertToPatientForm
//           selectedEnquiry={selectedEnquiry}
//           onClose={() => {
//             setShowConvertToPatientForm(false);
//             setShowEditModal(true);
//           }}
//           onSubmit={handleConvertToPatient}
//         />
//       )}
//     </div>
//   );
// };

// export default AllEnquiry;





import ConvertToPatientForm from "./ConvertToPatientForm";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { pdf } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EnquiryPdfDocument from "./pdf/EnquiryPdfDocument";

/*
  All Enquiry page (premium revamp).
  Same API calls, same filters, same edit / convert / delete flows, same exports.
  Changes in behaviour are listed in the message that came with this file.
*/

const Icon = ({ d, className = "h-5 w-5" }) => (
  <svg className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
);

const ICONS = {
  search: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z",
  plus: "M12 5v14M5 12h14",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  edit: "M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z",
  close: "M6 18L18 6M6 6l12 12",
  alert: "M12 8v4M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  check: "M20 6L9 17l-5-5",
  trash: "M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";

const TABS = [
  { key: "all", label: "All" },
  { key: "lead", label: "Leads" },
  { key: "patient", label: "Patients" },
];

const inputClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-400 focus:border-[#0B4BAA] focus:ring-4 focus:ring-[#00C2CB]/20";

/* ---------- small UI pieces ---------- */

const StatusPill = ({ entry }) => {
  if (entry.enquiryStatus === "lead") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Lead
      </span>
    );
  }
  const active = entry?.patientId?.personalDetails?.patientStatus;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-rose-500"}`} />
      Patient · {active ? "Active" : "Inactive"}
    </span>
  );
};

const Stat = ({ label, value, tone }) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
    <p className="text-xs font-semibold text-slate-500 sm:text-sm">{label}</p>
    <p className={`mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl ${tone}`}>{value}</p>
  </div>
);

const Modal = ({ onClose, label, children, z = "z-[70]" }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className={`fixed inset-0 ${z} overflow-y-auto bg-slate-900/60 backdrop-blur-sm`} onClick={onClose}>
      <div className="flex min-h-full items-center justify-center p-4">
        <div role="dialog" aria-modal="true" aria-label={label} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
};

const AllEnquiry = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [enquiries, setEnquiries] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [patientStatus, setPatientStatus] = useState("all");
  const [showConvertToPatientForm, setShowConvertToPatientForm] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [deletingEnquiryId, setDeletingEnquiryId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    enquiryId: "",
    patientId: "",
    enquiryStatus: "",
    patientStatus: "true",
    remark: "",
  });

  const [savingEdit, setSavingEdit] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEnquiries: 0,
    limit: 9,
    hasPrevPage: false,
    hasNextPage: false,
  });

  const [counts, setCounts] = useState({ all: null, lead: null, patient: null });
  const [confirm, setConfirm] = useState(null); // { kind: "delete" | "convert", data }
  const [converting, setConverting] = useState(false);
  const [toast, setToast] = useState(null); // { text, type }

  const reqId = useRef(0);

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* ---------- data loading ---------- */

  const fetchAllEnquiries = async () => {
    const id = ++reqId.current;
    try {
      setLoadingEnquiries(true);
      setLoadError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        activeStatus,
        patientStatus,
        search: searchTerm.trim(),
        sortBy,
      });

      const response = await fetch(`${backendURL}/api/enquiry/getEnquiry?${params.toString()}`);
      const result = await response.json();
      if (id !== reqId.current) return; // a newer request replaced this one

      setEnquiries(result?.enquiries || []);
      setPagination(
        result?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalEnquiries: 0,
          limit,
          hasPrevPage: false,
          hasNextPage: false,
        }
      );
    } catch (error) {
      if (id !== reqId.current) return;
      console.error("Error fetching enquiries:", error);
      setLoadError("Could not load the enquiries. Check your connection and try again.");
    } finally {
      if (id === reqId.current) setLoadingEnquiries(false);
    }
  };

  // Totals for the tabs and stat cards (one tiny request per tab)
  const fetchCounts = async () => {
    try {
      const entries = await Promise.all(
        TABS.map(async (t) => {
          const params = new URLSearchParams({
            page: "1",
            limit: "1",
            activeStatus: t.key,
            patientStatus: "all",
            search: "",
            sortBy: "newest",
          });
          const res = await fetch(`${backendURL}/api/enquiry/getEnquiry?${params.toString()}`);
          const json = await res.json();
          return [t.key, json?.pagination?.totalEnquiries ?? null];
        })
      );
      setCounts(Object.fromEntries(entries));
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const refreshAll = () => {
    fetchAllEnquiries();
    fetchCounts();
  };

  // Wait for the user to stop typing before searching
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    fetchAllEnquiries();
  }, [page, limit, activeStatus, patientStatus, searchTerm, sortBy]);

  useEffect(() => {
    fetchCounts();
  }, []);

  useEffect(() => {
    const employeeData = localStorage.getItem("loginEmployeeData");
    if (!employeeData) {
      setIsAdmin(false);
      return;
    }
    try {
      const employee = JSON.parse(employeeData);
      const loggedInEmail = employee?.personalDetails?.email?.trim()?.toLowerCase();
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim()?.toLowerCase();
      setIsAdmin(loggedInEmail === adminEmail);
    } catch (error) {
      console.error("Failed to parse loginEmployeeData:", error);
      setIsAdmin(false);
    }
  }, []);

  /* ---------- filtering (same rules as before) ---------- */

  const applyClientFilters = (list) => {
    let filtered = [...list];
    if (activeStatus === "all") {
      filtered = filtered.filter((e) => {
        const status = e?.patientId?.personalDetails?.patientStatus;
        return !(e.enquiryStatus === "patient" && status === false);
      });
    } else if (activeStatus === "lead") {
      filtered = filtered.filter((e) => e.enquiryStatus === "lead");
    } else if (activeStatus === "patient") {
      filtered = filtered.filter((e) => e.enquiryStatus === "patient");
    }

    if (activeStatus === "patient" && patientStatus !== "all") {
      filtered = filtered.filter((e) => {
        const status = e?.patientId?.personalDetails?.patientStatus;
        if (patientStatus === "active") return status === true;
        if (patientStatus === "inactive") return status === false;
        return true;
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        const nameMatch = item?.patientName?.toLowerCase().includes(term);
        const phoneMatch = item?.contactNumber?.includes(term);
        const patientIdMatch = item?.patientId?.personalDetails?.patientId?.toLowerCase().includes(term);
        return nameMatch || phoneMatch || patientIdMatch;
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const filteredEnquiries = applyClientFilters(enquiries);

  const changeTab = (key) => {
    setActiveStatus(key);
    if (key !== "patient") setPatientStatus("all");
    setPage(1);
  };

  /* ---------- exports ---------- */

  const normalizeEnquiryData = (data) =>
    data.map((item, index) => ({
      "S.No": index + 1,
      "Enquiry ID": item?._id || "",
      Type: item?.enquiryStatus || "",
      "Patient Status":
        item?.enquiryStatus === "patient"
          ? item?.patientId?.personalDetails?.patientStatus
            ? "Active"
            : "Inactive"
          : "-",
      "Patient Code": item?.patientId?.personalDetails?.patientId || "-",
      Name: item?.patientName || "",
      Gender: item?.gender || "",
      Age: item?.age ?? "",
      Occupation: item?.occupation || "",
      "Contact Number": item?.contactNumber || "",
      Email: item?.email || "",
      "Chief Complaint": item?.chiefComplaint || "",
      Remark: item?.remark || "",
      Response: item?.response || "",
      Source: item?.source || "",
      Address: item?.patientId?.personalDetails?.address || "-",
      "Attendance Count": item?.patientId?.attendance?.length || 0,
      "Billing Count": item?.patientId?.billing?.length || 0,
      "Treatment Count": item?.patientId?.treatment?.length || 0,
      "Created Date": item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
      "Created Time": item?.createdAt ? new Date(item.createdAt).toLocaleTimeString() : "",
      "Updated Date": item?.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "",
    }));

  const getSummaryStats = (data) => {
    const total = data.length;
    const leads = data.filter((item) => item.enquiryStatus === "lead").length;
    const patients = data.filter((item) => item.enquiryStatus === "patient").length;
    const activePatients = data.filter(
      (item) => item.enquiryStatus === "patient" && item?.patientId?.personalDetails?.patientStatus === true
    ).length;
    const inactivePatients = data.filter(
      (item) => item.enquiryStatus === "patient" && item?.patientId?.personalDetails?.patientStatus === false
    ).length;
    const conversionRate = total > 0 ? ((patients / total) * 100).toFixed(2) : 0;
    return { total, leads, patients, activePatients, inactivePatients, conversionRate };
  };

  const getExportFileName = (type) => {
    const date = new Date().toISOString().split("T")[0];
    const statusPart = activeStatus || "all";
    const patientFilterPart = activeStatus === "patient" ? `-${patientStatus}` : "";
    const searchPart = searchTerm?.trim() ? `-${searchTerm.trim().replace(/\s+/g, "-")}` : "";
    return `enquiry-${statusPart}${patientFilterPart}${searchPart}-${date}.${type}`;
  };

  // Exports cover every result of the current filters, not only the visible page
  const fetchExportData = async () => {
    const params = new URLSearchParams({
      page: "1",
      limit: String(Math.max(pagination.totalEnquiries || 0, limit, 1)),
      activeStatus,
      patientStatus,
      search: searchTerm.trim(),
      sortBy,
    });
    const response = await fetch(`${backendURL}/api/enquiry/getEnquiry?${params.toString()}`);
    const result = await response.json();
    return applyClientFilters(result?.enquiries || []);
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);

      const filteredData = await fetchExportData();
      const normalizedData = normalizeEnquiryData(filteredData);
      const stats = getSummaryStats(filteredData);

      const workbook = XLSX.utils.book_new();
      const summaryData = [
        ["Enquiry Report Summary"],
        [],
        ["Total Enquiries", stats.total],
        ["Total Leads", stats.leads],
        ["Total Patients", stats.patients],
        ["Active Patients", stats.activePatients],
        ["Inactive Patients", stats.inactivePatients],
        ["Conversion Rate (%)", stats.conversionRate],
        [],
        ["Applied Filters"],
        ["Enquiry Type Filter", activeStatus],
        ["Patient Status Filter", patientStatus],
        ["Search Term", searchTerm || "-"],
        ["Sort By", sortBy],
      ];

      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summaryData), "Summary");
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(normalizedData), "Enquiries");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      saveAs(blob, getExportFileName("xlsx"));
    } catch (error) {
      console.error("Excel download failed:", error);
      showToast("Failed to download Excel", "error");
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);

      const filteredData = await fetchExportData();
      const stats = getSummaryStats(filteredData);

      const blob = await pdf(
        <EnquiryPdfDocument
          enquiries={filteredData}
          stats={stats}
          activeStatus={activeStatus}
          patientStatus={patientStatus}
          searchTerm={searchTerm}
          sortBy={sortBy}
        />
      ).toBlob();

      saveAs(blob, getExportFileName("pdf"));
    } catch (error) {
      console.error("PDF download failed:", error);
      showToast("Failed to download PDF", "error");
    } finally {
      setDownloadingPdf(false);
    }
  };

  /* ---------- edit / convert / delete ---------- */

  const openEditModal = (entry) => {
    setSelectedEnquiry(entry);
    setEditData({
      enquiryId: entry?._id || "",
      patientId: entry?.patientId?._id || "",
      enquiryStatus: entry?.enquiryStatus || "lead",
      patientStatus: entry?.patientId?.personalDetails?.patientStatus ? "true" : "false",
      remark: entry?.remark || "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedEnquiry(null);
    setEditData({ enquiryId: "", patientId: "", enquiryStatus: "", patientStatus: "true", remark: "" });
  };

  // The form submits here; the actual request runs after the user confirms
  const handleConvertToPatient = (data) => setConfirm({ kind: "convert", data });

  const doConvertToPatient = async (data) => {
    try {
      setConverting(true);
      const payload = { ...data, enquiryId: selectedEnquiry?._id };

      const response = await fetch(`${backendURL}/api/patient/createPatient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result?.success) {
        showToast("Patient created successfully");
        refreshAll();
        setShowConvertToPatientForm(false);
        closeEditModal();
      } else {
        showToast(result?.message || "Failed to convert to patient", "error");
      }
    } catch (error) {
      console.error("Convert to patient failed", error);
      showToast("Something went wrong", "error");
    } finally {
      setConverting(false);
      setConfirm(null);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setSavingEdit(true);

      const response = await fetch(`${backendURL}/api/patient/updatePatientStatus`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryId: editData.enquiryId,
          patientId: editData.patientId || null,
          patientStatus: editData.enquiryStatus === "patient" ? editData.patientStatus === "true" : undefined,
          remark: editData.remark,
        }),
      });
      const result = await response.json();

      if (result?.success) {
        showToast("Updated successfully");
        refreshAll();
        closeEditModal();
      } else {
        showToast(result?.message || "Failed to update", "error");
      }
    } catch (error) {
      console.error("Error updating enquiry/patient:", error);
      showToast("Something went wrong", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    try {
      setDeletingEnquiryId(enquiryId);

      const response = await fetch(`${backendURL}/api/enquiry/deleteEnquiryById/${enquiryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("webapptoken"),
        },
      });
      const result = await response.json();

      if (result?.success) {
        showToast("Enquiry deleted successfully");
        refreshAll();
        closeEditModal();
      } else {
        showToast(result?.message || "Delete failed", "error");
      }
    } catch (error) {
      console.error("Delete enquiry failed", error);
      showToast("Something went wrong", "error");
    } finally {
      setDeletingEnquiryId(null);
      setConfirm(null);
    }
  };

  /* ---------- derived numbers ---------- */

  const total = counts.all;
  const conversion = total ? Math.round(((counts.patient || 0) / total) * 100) : 0;
  const from = pagination.totalEnquiries ? (pagination.currentPage - 1) * limit + 1 : 0;
  const to = Math.min(pagination.currentPage * limit, pagination.totalEnquiries);
  const show = (n) => (n === null ? "-" : n);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Enquiries</h2>
          <p className="mt-0.5 text-sm text-slate-500">Track leads and convert them into patients.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel || loadingEnquiries || filteredEnquiries.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-emerald-700"
          >
            {downloadingExcel ? <AiOutlineLoading3Quarters className="animate-spin" /> : <Icon d={ICONS.download} className="h-4 w-4" />}
            {downloadingExcel ? "Preparing..." : "Excel"}
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf || loadingEnquiries || filteredEnquiries.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-600 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-rose-700"
          >
            {downloadingPdf ? <AiOutlineLoading3Quarters className="animate-spin" /> : <Icon d={ICONS.download} className="h-4 w-4" />}
            {downloadingPdf ? "Preparing..." : "PDF"}
          </button>
          <Link
            to="/enquiry"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B4BAA] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0B4BAA]/30 transition hover:bg-[#093d8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2"
          >
            <Icon d={ICONS.plus} className="h-4 w-4" /> New Enquiry
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Total enquiries" value={show(counts.all)} tone="text-[#0B4BAA]" />
        <Stat label="Leads" value={show(counts.lead)} tone="text-amber-600" />
        <Stat label="Patients" value={show(counts.patient)} tone="text-emerald-600" />
        <Stat label="Conversion rate" value={total === null ? "-" : `${conversion}%`} tone="text-slate-900" />
      </div>

      {/* Filters */}
      <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Enquiry type">
            {TABS.map((t) => {
              const on = activeStatus === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => changeTab(t.key)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] ${
                    on ? "bg-white text-[#0B4BAA] shadow-sm" : "text-slate-600 hover:text-[#0B4BAA]"
                  }`}
                >
                  {t.label}
                  <span className={`rounded-full px-2 text-xs ${on ? "bg-[#0B4BAA]/10" : "bg-slate-200/70 text-slate-500"}`}>{show(counts[t.key])}</span>
                </button>
              );
            })}
          </div>
          <p className="text-sm text-slate-500">
            Showing <b className="text-slate-700">{pagination.totalEnquiries}</b> result{pagination.totalEnquiries === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Icon d={ICONS.search} className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or patient ID"
              aria-label="Search enquiries"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={`${inputClass} w-full pl-10`}
            />
          </div>
          {activeStatus === "patient" && (
            <select
              aria-label="Patient status"
              value={patientStatus}
              onChange={(e) => {
                setPatientStatus(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            >
              <option value="all">All patients</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          )}
          <select
            aria-label="Sort enquiries"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <select
            aria-label="Results per page"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className={inputClass}
          >
            <option value={6}>6 / page</option>
            <option value={9}>9 / page</option>
            <option value={12}>12 / page</option>
            <option value={24}>24 / page</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loadError ? (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 ring-1 ring-rose-200">
          <Icon d={ICONS.alert} />
          <span className="flex-1">{loadError}</span>
          <button onClick={refreshAll} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700">
            <Icon d={ICONS.refresh} className="h-3.5 w-3.5" /> Try again
          </button>
        </div>
      ) : loadingEnquiries ? (
        <div className="grid animate-pulse gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading enquiries">
          {Array.from({ length: Math.min(limit, 6) }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-lg font-semibold text-slate-700">No enquiries match your filters</p>
          <p className="mt-1 text-sm text-slate-400">Try changing the filters or the search words.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEnquiries.map((entry) => {
            const isPatient = entry.enquiryStatus === "patient";
            return (
              <article key={entry._id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#0B4BAA] to-[#082F6B] text-base font-bold uppercase text-white">
                    {(entry?.patientName || "?").charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-slate-900">{entry?.patientName || "-"}</h3>
                    <a href={`tel:${entry?.contactNumber}`} className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#0B4BAA]">
                      <Icon d={ICONS.phone} className="h-3.5 w-3.5" /> {entry?.contactNumber || "-"}
                    </a>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => openEditModal(entry)}
                      aria-label={`Edit enquiry for ${entry?.patientName}`}
                      title="Edit"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-[#E6F9FA] hover:text-[#0B4BAA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]"
                    >
                      <Icon d={ICONS.edit} className="h-[18px] w-[18px]" />
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <StatusPill entry={entry} />
                  {isPatient && entry.patientId?.personalDetails?.patientId && (
                    <span className="rounded-md bg-[#0B4BAA]/10 px-2 py-1 text-xs font-bold tracking-wide text-[#0B4BAA]">
                      {entry.patientId.personalDetails.patientId}
                    </span>
                  )}
                </div>

                <dl className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Complaint</dt>
                    <dd className="line-clamp-2 font-medium text-slate-800">{entry.chiefComplaint || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Remark</dt>
                    <dd className={`line-clamp-2 font-medium ${entry?.remark ? "text-slate-800" : "text-slate-400"}`}>{entry?.remark || "No remark"}</dd>
                  </div>
                </dl>

                <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                  <span className="text-xs text-slate-400">Added {fmtDate(entry.createdAt)}</span>
                  {isPatient && (
                    <Link
                      to={`/PatientDetails/${entry?.patientId?._id}`}
                      className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0B4BAA] transition hover:bg-[#E6F9FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loadingEnquiries && !loadError && pagination.totalEnquiries > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 pb-2 text-sm text-slate-500 sm:flex-row">
          <p>
            Showing {from}–{to} of {pagination.totalEnquiries}
          </p>
          {pagination.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrevPage || loadingEnquiries}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="rounded-xl bg-[#0B4BAA] px-4 py-2 font-bold text-white">
                {pagination.currentPage} <span className="font-medium text-blue-200">/ {pagination.totalPages}</span>
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={!pagination.hasNextPage || loadingEnquiries}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit modal */}
      {showEditModal && selectedEnquiry && (
        <Modal onClose={closeEditModal} label="Edit enquiry">
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#0B4BAA] to-[#082F6B] text-base font-bold uppercase text-white">
              {(selectedEnquiry?.patientName || "?").charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-bold text-slate-900">{selectedEnquiry?.patientName}</h2>
              <p className="text-sm text-slate-500">{selectedEnquiry?.contactNumber}</p>
            </div>
            <StatusPill entry={selectedEnquiry} />
            <button onClick={closeEditModal} aria-label="Close" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]">
              <Icon d={ICONS.close} />
            </button>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div>
              <label htmlFor="remark" className="mb-1.5 block text-sm font-semibold text-slate-700">Remark</label>
              <textarea
                id="remark"
                rows={4}
                value={editData.remark}
                onChange={(e) => setEditData((prev) => ({ ...prev, remark: e.target.value }))}
                className={`${inputClass} w-full`}
                placeholder="Add a note about this enquiry"
              />
            </div>

            {editData.enquiryStatus === "patient" && (
              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700">Patient status</p>
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1" role="radiogroup" aria-label="Patient status">
                  {[
                    ["true", "Active"],
                    ["false", "Inactive"],
                  ].map(([v, label]) => {
                    const on = editData.patientStatus === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setEditData((prev) => ({ ...prev, patientStatus: v }))}
                        className={`rounded-lg py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] ${
                          on ? (v === "true" ? "bg-emerald-600 text-white shadow-sm" : "bg-rose-600 text-white shadow-sm") : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
            <button
              onClick={() => setConfirm({ kind: "delete", data: selectedEnquiry?._id })}
              disabled={deletingEnquiryId === selectedEnquiry?._id}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-60"
            >
              {deletingEnquiryId === selectedEnquiry?._id ? <AiOutlineLoading3Quarters className="animate-spin" /> : <Icon d={ICONS.trash} className="h-4 w-4" />}
              Delete
            </button>
            <div className="flex flex-wrap gap-3">
              {selectedEnquiry?.enquiryStatus === "lead" && (
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowConvertToPatientForm(true);
                  }}
                  className="rounded-xl border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  Convert to Patient
                </button>
              )}
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0B4BAA] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#093d8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2 disabled:opacity-70"
              >
                {savingEdit && <AiOutlineLoading3Quarters className="animate-spin" />}
                {savingEdit ? "Saving..." : "Update"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showConvertToPatientForm && (
        <ConvertToPatientForm
          selectedEnquiry={selectedEnquiry}
          onClose={() => {
            setShowConvertToPatientForm(false);
            setShowEditModal(true);
          }}
          onSubmit={handleConvertToPatient}
        />
      )}

      {/* Confirm dialog */}
      {confirm && (
        <Modal onClose={() => !converting && !deletingEnquiryId && setConfirm(null)} label="Please confirm" z="z-[90]">
          <div className="p-6 text-center">
            <span className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${confirm.kind === "delete" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
              <Icon d={confirm.kind === "delete" ? ICONS.trash : ICONS.check} className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              {confirm.kind === "delete" ? "Delete this enquiry?" : "Convert to patient?"}
            </h3>
            <p className="mt-1.5 text-sm text-slate-500">
              {confirm.kind === "delete"
                ? "This cannot be undone."
                : "A patient record will be created from this enquiry."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setConfirm(null)}
                disabled={converting || !!deletingEnquiryId}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={() => (confirm.kind === "delete" ? handleDeleteEnquiry(confirm.data) : doConvertToPatient(confirm.data))}
                disabled={converting || !!deletingEnquiryId}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-70 ${
                  confirm.kind === "delete" ? "bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500" : "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
                }`}
              >
                {(converting || deletingEnquiryId) && <AiOutlineLoading3Quarters className="animate-spin" />}
                {confirm.kind === "delete" ? "Delete" : "Convert"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${
            toast.type === "error" ? "bg-rose-600" : "bg-slate-900"
          }`}
        >
          <Icon d={toast.type === "error" ? ICONS.alert : ICONS.check} className="h-5 w-5" />
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default AllEnquiry;
