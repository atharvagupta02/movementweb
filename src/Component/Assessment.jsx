// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import AssessmentDetailsModal from "./showAssesmentDetails/AssessmentDetailsModal";

// const NeuroPhysioFullForm = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const patient = location?.state?.patient;
//   const patientDetail = location?.state?.patient?.personalDetails;
//   const patient_id = location?.state?.patient?._id;
//   // console.log("patient inside the neuro", patient);
//   // console.log("patient details inside the neuro", patientDetail);
//   // console.log("patient  inside the neuro", patient_id);

//   const { id } = useParams(); // If present => update mode
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     patientName: "",
//     age: "",
//     gender: "",
//     occupation: "",
//     address: "",
//     contactNumber: "",
//     referredBy: "",
//     dateOfEvaluation: "",
//     chiefComplaint: "",
//     historyOfPresentIllness: "",
//     durationOfCondition: "",
//     onset: "",
//     aggravatingFactors: "",
//     pastMedicalHistory: "",
//     surgicalHistory: "",
//     familyHistory: "",
//     obstetricHistory: "",
//     personalHistory: "",
//     mriReports: "",
//     posture: "",
//     gait: "",
//     buildNutrition: "",
//     deformities: "",
//     scars: "",
//     tenderness: "",
//     painSite: "",
//     painType: "",
//     vasScore: 0,
//     mas: "",
//     clonus: "",
//     mmt: "",
//     superficialReflexes: "",
//     deepReflexes: "",
//     pathologicalReflexes: "",
//     coordination: "",
//     cranialNerveExamination: "",
//     superficialSensations: "",
//     deepSensations: "",
//     corticalSensations: "",
//     bedMobility: "",
//     gaitPattern: "",
//     balance: "",
//     assistiveDevices: "",
//     adls: "",
//     orientation: "",
//     memory: "",
//     speech: "",
//     perception: "",
//     mood: "",
//     familySupport: "",
//     fimScores: "",
//     outcomeMeasures: "",
//     problemList: "",
//     shortTermGoals: "",
//     longTermGoals: "",
//     followUp: "",
//     patientConsent: "",
//     patientSignature: "",
//     physiotherapistName: "",
//     physiotherapistSignature: "",
//     datePhysiotherapist: "",
//     datePatient: "",
//   });

//   const [activeRecords, setActiveRecords] = useState([]);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [openModal, setOpenModal] = useState(false);
//   const activeTab = "Neurological";

//   useEffect(() => {
//     const employee = localStorage.getItem("loginEmployeeData");
//     const data = JSON.parse(employee);
//     // console.log("data", data);
//     setFormData((prev) => ({
//       ...prev,
//       physiotherapistName: data?.personalDetails?.fullName,
//     }));
//   }, []);

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
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     if (patientDetail) {
//       setFormData((prev) => ({
//         ...prev,
//         patientName: patientDetail.name,
//         age: patientDetail.age,
//         gender: patientDetail.gender,
//         occupation: patientDetail?.enquiryId?.occupation,
//         address: patientDetail?.address,
//         contactNumber: patientDetail?.contactNumber,
//         chiefComplaint: patientDetail?.chiefComplaint,
//       }));
//     }
//   }, [patientDetail]);

//   useEffect(() => {
//     const forms = patient?.assessment?.neurologicalFormId;

//     if (forms?.length) {
//       const lastForm = forms[forms.length - 1];

//       const allowedKeys = Object.keys(formData);

//       const filteredData = pickAllowedFields(lastForm, allowedKeys);
//       // console.log("filteredData", filteredData);
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
//       const endpoint = `${
//         import.meta.env.VITE_BACKEND_URL
//       }/api/assessment/neurological`;

//       const method = "POST";

//       const response = await fetch(endpoint, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           token: localStorage.getItem("webapptoken"),
//         },
//         body: JSON.stringify(payLoad),
//       });

//       const result = await response.json();
//       // console.log("result , , ,, ,", result);
//       if (result?.success) {
//         alert(result?.message);
//         setHistory(result?.updatedForm?.history);
//         setFormData({
//           patientName: "",
//           age: "",
//           gender: "",
//           occupation: "",
//           address: "",
//           contactNumber: "",
//           referredBy: "",
//           dateOfEvaluation: "",
//           chiefComplaint: "",
//           historyOfPresentIllness: "",
//           durationOfCondition: "",
//           onset: "",
//           aggravatingFactors: "",
//           pastMedicalHistory: "",
//           surgicalHistory: "",
//           familyHistory: "",
//           obstetricHistory: "",
//           personalHistory: "",
//           mriReports: "",
//           posture: "",
//           gait: "",
//           buildNutrition: "",
//           deformities: "",
//           scars: "",
//           tenderness: "",
//           painSite: "",
//           painType: "",
//           vasScore: 0,
//           mas: "",
//           clonus: "",
//           mmt: "",
//           superficialReflexes: "",
//           deepReflexes: "",
//           pathologicalReflexes: "",
//           coordination: "",
//           cranialNerveExamination: "",
//           superficialSensations: "",
//           deepSensations: "",
//           corticalSensations: "",
//           bedMobility: "",
//           gaitPattern: "",
//           balance: "",
//           assistiveDevices: "",
//           adls: "",
//           orientation: "",
//           memory: "",
//           speech: "",
//           perception: "",
//           mood: "",
//           familySupport: "",
//           fimScores: "",
//           outcomeMeasures: "",
//           problemList: "",
//           shortTermGoals: "",
//           longTermGoals: "",

//           followUp: "",
//           patientConsent: "",
//           patientSignature: "",
//           physiotherapistName: "",
//           physiotherapistSignature: "",
//           datePhysiotherapist: "",
//           datePatient: "",
//         });
//         navigate(`/PatientDetails/${patient_id}`);
//       } else {
//         if (
//           result?.code === "TOKEN_EXPIRED" ||
//           result?.code === "INVALID_TOKEN"
//         ) {
//           alert(result?.message + " Please login again");
//           localStorage.removeItem("webapptoken");
//           window.location.reload();
//         } else {
//           alert(result?.message);
//         }
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
//         className="max-w-7xl mx-auto px-6 py-10 bg-white shadow-lg rounded-xl space-y-10"
//       >
//         <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
//           Neurological Physiotherapy Evaluation Form
//         </h1>

//         {/* Patient Information */}
//         <Section title="Patient Information">
//           <Grid>
//             <Input
//               label="Patient Name"
//               name="patientName"
//               value={formData.patientName}
//               onChange={handleChange}
//               readOnly={true}
//             />
//             <Input
//               label="Age"
//               name="age"
//               value={formData.age}
//               onChange={handleChange}
//               readOnly={true}
//             />
//             <Input
//               label="Gender"
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               readOnly={true}
//             />
//             <Input
//               label="Occupation"
//               name="occupation"
//               value={formData.occupation}
//               onChange={handleChange}
//               readOnly={true}
//             />
//             <Input
//               label="Address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               readOnly={true}
//             />
//             <Input
//               label="Contact Number"
//               name="contactNumber"
//               value={formData.contactNumber}
//               onChange={handleChange}
//               readOnly={true}
//             />
//             <Input
//               label="Referred By Doctor"
//               name="referredBy"
//               value={formData.referredBy}
//               onChange={handleChange}
//             />
//             <Input
//               label="Date of Evaluation"
//               name="dateOfEvaluation"
//               type="date"
//               value={formData.dateOfEvaluation}
//               onChange={handleChange}
//             />
//           </Grid>
//         </Section>

//         {/* Presenting Complaints */}
//         <Section title="Presenting Complaints">
//           <Textarea
//             label="Chief Complaints"
//             name="chiefComplaint"
//             value={formData.chiefComplaint}
//             onChange={handleChange}
//             readOnly={true}
//           />
//           <Textarea
//             label="History of Present Illness"
//             name="historyOfPresentIllness"
//             value={formData.historyOfPresentIllness}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Duration of Condition"
//             name="durationOfCondition"
//             value={formData.durationOfCondition}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Onset (Sudden/Gradual)"
//             name="onset"
//             value={formData.onset}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Aggravating/Relieving Factors"
//             name="aggravatingFactors"
//             value={formData.aggravatingFactors}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Medical History */}
//         <Section title="Medical, Surgical & Personal History">
//           <Textarea
//             label="Past Medical History"
//             name="pastMedicalHistory"
//             value={formData.pastMedicalHistory}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Surgical History"
//             name="surgicalHistory"
//             value={formData.surgicalHistory}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Family History"
//             name="familyHistory"
//             value={formData.familyHistory}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Obstetric History"
//             name="obstetricHistory"
//             value={formData.obstetricHistory}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Personal History"
//             name="personalHistory"
//             value={formData.personalHistory}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Investigation Reports */}
//         <Section title="Investigation Reports">
//           <Textarea
//             label="MRI / CT / EEG / Others"
//             name="mriReports"
//             value={formData.mriReports}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Observation/Inspection */}
//         <Section title="Observation / Inspection">
//           <Grid>
//             <Input
//               label="Posture"
//               name="posture"
//               value={formData.posture}
//               onChange={handleChange}
//             />
//             <Input
//               label="Gait"
//               name="gait"
//               value={formData.gait}
//               onChange={handleChange}
//             />
//             <Input
//               label="Build & Nutrition"
//               name="buildNutrition"
//               value={formData.buildNutrition}
//               onChange={handleChange}
//             />
//             <Input
//               label="Deformities / Contractures"
//               name="deformities"
//               value={formData.deformities}
//               onChange={handleChange}
//             />
//             <Input
//               label="Scars / Swelling / Atrophy"
//               name="scars"
//               value={formData.scars}
//               onChange={handleChange}
//             />
//           </Grid>
//         </Section>

//         {/* Palpation */}
//         <Section title="Palpation">
//           <Textarea
//             label="Tenderness / Swelling / Muscle Tone"
//             name="tenderness"
//             value={formData.tenderness}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Pain Assessment */}
//         <Section title="Pain Assessment">
//           <Grid>
//             <Input
//               label="Pain Site"
//               name="painSite"
//               value={formData.painSite}
//               onChange={handleChange}
//             />
//             <Input
//               label="Pain Type (e.g., Sharp, Dull)"
//               name="painType"
//               value={formData.painType}
//               onChange={handleChange}
//             />
//           </Grid>

//           <label className="block font-medium mt-2 mb-1">
//             VAS Score <span className="ml-2">{formData.vasScore}</span>
//           </label>

//           <input
//             type="range"
//             min="0"
//             max="10"
//             value={formData.vasScore}
//             onChange={(e) =>
//               setFormData({ ...formData, vasScore: e.target.value })
//             }
//             className="w-full"
//           />
//         </Section>

//         {/* Tone Evaluation */}
//         <Section title="Tone Evaluation">
//           <Textarea
//             label="MAS (Modified Ashworth Scale)"
//             name="mas"
//             value={formData.mas}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Clonus / Rigidity / Flaccidity"
//             name="clonus"
//             value={formData.clonus}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Muscle Strength (Power) */}
//         <Section title="Muscle Strength (Power)">
//           <Textarea
//             label="MMT (Manual Muscle Testing) with Grades"
//             name="mmt"
//             value={formData.mmt}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Reflexes */}
//         <Section title="Reflexes">
//           <Textarea
//             label="Superficial Reflexes (Abdominal, Cremasteric)"
//             name="superficialReflexes"
//             value={formData.superficialReflexes}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Deep Reflexes (Biceps, Triceps, Knee, Ankle)"
//             name="deepReflexes"
//             value={formData.deepReflexes}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Pathological Reflexes (Babinski, Hoffmann's)"
//             name="pathologicalReflexes"
//             value={formData.pathologicalReflexes}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Coordination */}
//         <Section title="Coordination">
//           <Textarea
//             label="Finger-Nose, Heel-Shin, Dysdiadochokinesia"
//             name="coordination"
//             value={formData.coordination}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Cranial Nerve Examination */}
//         <Section title="Cranial Nerve Examination">
//           <Textarea
//             label="Assessment of all 12 Cranial Nerves"
//             name="cranialNerveExamination"
//             value={formData.cranialNerveExamination}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Sensory System */}
//         <Section title="Sensory System">
//           <Textarea
//             label="Superficial Sensations (Touch, Pain, Temp)"
//             name="superficialSensations"
//             value={formData.superficialSensations}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Deep Sensations (Proprioception, Vibration)"
//             name="deepSensations"
//             value={formData.deepSensations}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Cortical Sensations (Stereognosis, Graphesthesia)"
//             name="corticalSensations"
//             value={formData.corticalSensations}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Functional Measures */}
//         <Section title="Functional Measures">
//           <Textarea
//             label="Bed Mobility / Transfers / Wheelchair Mobility"
//             name="bedMobility"
//             value={formData.bedMobility}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Gait Pattern (Assistance, Deviation)"
//             name="gaitPattern"
//             value={formData.gaitPattern}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Balance (Static / Dynamic)"
//             name="balance"
//             value={formData.balance}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Use of Assistive Devices"
//             name="assistiveDevices"
//             value={formData.assistiveDevices}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Activities of Daily Living (ADLs)"
//             name="adls"
//             value={formData.adls}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Higher Mental Functions */}
//         <Section title="Higher Mental Functions">
//           <Textarea
//             label="Orientation (Time, Place, Person)"
//             name="orientation"
//             value={formData.orientation}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Memory (Immediate, Recent, Remote)"
//             name="memory"
//             value={formData.memory}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Speech & Comprehension"
//             name="speech"
//             value={formData.speech}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Perception, Judgment, Attention"
//             name="perception"
//             value={formData.perception}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Psychological Status */}
//         <Section title="Psychological Status">
//           <Textarea
//             label="Mood, Behavior, Anxiety, Depression"
//             name="mood"
//             value={formData.mood}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Family Support / Coping Strategies"
//             name="familySupport"
//             value={formData.familySupport}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Functional Independence Measures (FIM) */}
//         <Section title="Functional Independence Measures (FIM)">
//           <Textarea
//             label="Scores & Observations"
//             name="fimScores"
//             value={formData.fimScores}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Outcome Measures */}
//         <Section title="Outcome Measures">
//           <Textarea
//             label="Berg Balance Scale, Barthel Index, Others"
//             name="outcomeMeasures"
//             value={formData.outcomeMeasures}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Problem List */}
//         <Section title="Problem List">
//           <Textarea
//             label="List All Functional / Physical Problems"
//             name="problemList"
//             value={formData.problemList}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Treatment Goals */}
//         <Section title="Treatment Goals">
//           <Textarea
//             label="Short Term Goals"
//             name="shortTermGoals"
//             value={formData.shortTermGoals}
//             onChange={handleChange}
//           />
//           <Textarea
//             label="Long Term Goals"
//             name="longTermGoals"
//             value={formData.longTermGoals}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Follow-up / Progress */}
//         <Section title="Follow-up & Progress Notes">
//           <Textarea
//             label="Follow-up Observations & Plan"
//             name="followUp"
//             value={formData.followUp}
//             onChange={handleChange}
//           />
//         </Section>

//         {/* Consent */}
//         <Section title="Consent & Signature">
//           <Textarea
//             label="Patient Consent / Remarks"
//             name="patientConsent"
//             value={formData.patientConsent}
//             onChange={handleChange}
//           />
//           <Grid>
//             <Input
//               label="Patient Signature"
//               name="patientSignature"
//               value={formData.patientSignature}
//               onChange={handleChange}
//             />
//             <Input
//               label="Date"
//               type="date"
//               name="datePatient"
//               value={formData.datePatient}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid>
//             <Input
//               label="Physiotherapist Name"
//               name="physiotherapistName"
//               value={formData.physiotherapistName}
//               onChange={handleChange}
//               readOnly={true}
//             />
//             <Input
//               label="Signature"
//               name="physiotherapistSignature"
//               value={formData.physiotherapistSignature}
//               onChange={handleChange}
//             />
//             <Input
//               label="Date"
//               type="date"
//               name="datePhysiotherapist"
//               value={formData.datePhysiotherapist}
//               onChange={handleChange}
//             />
//           </Grid>
//         </Section>

//         {/* Submit Button */}

//         <div className="text-center space-y-3">
//           {id && (
//             <>
//               {history?.length >= 2 ? (
//                 <div className="text-red-600 font-semibold">
//                   No update possible. Maximum update limit (2) reached.
//                 </div>
//               ) : (
//                 <div className="text-green-600 font-semibold">
//                   {2 - (history?.length || 0)} update
//                   {2 - (history?.length || 0) === 1 ? " is" : "s are"}{" "}
//                   remaining.
//                 </div>
//               )}
//             </>
//           )}

//           <div className="space-x-4">
//             <button
//               type="submit"
//               disabled={(id && history?.length >= 2) || loading}
//               className={`${
//                 id
//                   ? history?.length >= 2
//                     ? "bg-gray-500 cursor-not-allowed"
//                     : "bg-green-700 hover:bg-green-800"
//                   : "bg-blue-700 hover:bg-blue-800"
//               } text-white px-8 py-3 rounded-lg transition`}
//             >
//               {id
//                 ? loading
//                   ? "Updating..."
//                   : "Update Evaluation"
//                 : loading
//                   ? "Submitting..."
//                   : "Submit Evaluation"}
//             </button>

//             <button
//               type="button"
//               onClick={() => window.history.back()}
//               className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition"
//             >
//               Cancel
//             </button>
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

// export default NeuroPhysioFullForm;

// // --- Helper Components ---
// const Section = ({ title, children }) => (
//   <section>
//     <h2 className="text-2xl font-semibold text-blue-600 mb-4">{title}</h2>
//     {children}
//   </section>
// );

// const Input = ({ label, type = "text", name, value, onChange, readOnly }) => (
//   <div className="mb-4">
//     <label className="block font-medium mb-1">{label}</label>
//     <input
//       type={type}
//       placeholder={label}
//       name={name}
//       value={value || ""}
//       onChange={onChange}
//       readOnly={readOnly}
//       className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//     />
//   </div>
// );

// const Textarea = ({ label, name, value, onChange, readOnly }) => (
//   <div className="mb-4">
//     <label className="block font-medium mb-1">{label}</label>
//     <textarea
//       placeholder={label}
//       rows={3}
//       name={name}
//       value={value || ""}
//       onChange={onChange}
//       readOnly={readOnly}
//       className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//     />
//   </div>
// );

// const Grid = ({ children }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
// );

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AssessmentDetailsModal from "./showAssesmentDetails/AssessmentDetailsModal";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

/* ------------------------------------------------------------------
   Neurological Physiotherapy Assessment
   Follows the Movement Rehab paper template (15 sections).
   Same endpoint, same patient/update logic as before.
   Theme tokens (same as your dashboard):
   navy #0f2557 → #2150a8   teal #4fbfc7   ink #0f1b3d   page #f8fafc
------------------------------------------------------------------- */

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
const normDT = (v) => (v && v.length === 10 ? `${v}T00:00` : v || "");

/* ---------- table definitions (columns follow the PDF) ---------- */

const GRADES = ["0", "1", "2", "3", "4", "5", "Not assessed", "N/A"];
const MAS_GRADES = ["0", "1", "1+", "2", "3", "4", "Not assessed", "N/A"];
const FINDING_HINTS = ["Intact", "Impaired", "Absent", "Present", "Not assessed", "N/A"];
const ASSIST = ["Independent", "Supervision", "Minimal assist", "Moderate assist", "Maximal assist", "Dependent", "Not assessed", "N/A"];
const MEASURES = ["Barthel Index", "FIM", "Berg Balance Scale", "10-Metre Walk Test", "Timed Up and Go", "Functional Reach Test", "6-Minute Walk Test", "Fugl-Meyer Assessment"];

const TABLES = {
  mmtRows: {
    preset: true,
    cols: [
      { key: "muscle", label: "Movement / Muscle Group", ph: "e.g. Elbow flexion" },
      { key: "right", label: "Right Grade", list: GRADES },
      { key: "left", label: "Left Grade", list: GRADES },
      { key: "notes", label: "Notes / Limitation" },
    ],
    labels: ["Shoulder flexion", "Elbow flexion", "Wrist extension", "Hip flexion", "Knee extension", "Ankle dorsiflexion"],
    add: "Add muscle group",
  },
  masRows: {
    preset: true,
    cols: [
      { key: "muscle", label: "Muscle Group", ph: "e.g. Elbow flexors" },
      { key: "right", label: "Right (MAS)", list: MAS_GRADES },
      { key: "left", label: "Left (MAS)", list: MAS_GRADES },
      { key: "notes", label: "Position / Notes" },
    ],
    labels: ["Elbow flexors", "Wrist flexors", "Finger flexors", "Hip adductors", "Knee extensors", "Ankle plantarflexors"],
    add: "Add muscle group",
  },
  sensoryRows: {
    preset: true,
    cols: [
      { key: "test", label: "Test / Domain", ph: "Test name" },
      { key: "right", label: "Right", list: FINDING_HINTS },
      { key: "left", label: "Left", list: FINDING_HINTS },
      { key: "findings", label: "Findings / Comments" },
    ],
    labels: ["Light touch", "Pinprick", "Proprioception", "Cortical sensation", "Deep tendon reflexes", "Superficial reflexes", "Pathological reflexes", "Clonus", "Finger-nose", "Heel-shin", "Rapid alternating movements"],
    add: "Add test",
  },
  mobilityRows: {
    preset: true,
    cols: [
      { key: "task", label: "Task / Test", ph: "Task name" },
      { key: "performance", label: "Performance / Score" },
      { key: "assistance", label: "Assistance Level", select: ASSIST },
      { key: "notes", label: "Device / Notes" },
    ],
    labels: ["Bed mobility", "Rolling", "Supine-to-sit", "Sitting balance", "Standing balance", "Transfers", "Sit-to-stand", "Gait pattern", "Walking distance", "Stairs"],
    add: "Add task",
  },
  functionRows: {
    preset: true,
    cols: [
      { key: "activity", label: "Activity / Domain", ph: "Activity" },
      { key: "ability", label: "Current Ability" },
      { key: "assistance", label: "Assistance / Support", select: ASSIST },
      { key: "notes", label: "Limitations / Notes" },
    ],
    labels: ["ADLs", "Transfers", "Toileting", "Dressing", "Bathing", "Feeding", "Household / community mobility", "Work / study", "Caregiver burden"],
    add: "Add activity",
  },
  outcomeRows: {
    preset: true,
    cols: [
      { key: "measure", label: "Measure / Version", list: MEASURES, ph: "Choose or type" },
      { key: "baseline", label: "Baseline Score & Date" },
      { key: "reassessment", label: "Reassessment Score & Date" },
      { key: "notes", label: "Interpretation / Notes" },
    ],
    labels: ["Barthel Index", "Berg Balance Scale", "10-Metre Walk Test", "Timed Up and Go"],
    add: "Add measure",
  },
  goalRows: {
    preset: false,
    cols: [
      { key: "priority", label: "Priority", ph: "1", narrow: true },
      { key: "problem", label: "Problem" },
      { key: "baseline", label: "Baseline" },
      { key: "target", label: "SMART Goal / Target" },
      { key: "targetDate", label: "Target Date", type: "date" },
    ],
    blank: 2,
    add: "Add goal",
  },
  progressRows: {
    preset: false,
    cols: [
      { key: "date", label: "Date / Session", ph: "Date or session no." },
      { key: "subjective", label: "Subjective Update", area: true },
      { key: "objective", label: "Objective Findings / Measures", area: true },
      { key: "plan", label: "Intervention / Response / Next Plan", area: true },
    ],
    blank: 1,
    add: "Add session note",
  },
};
const TABLE_KEYS = Object.keys(TABLES);

const blankRow = (key) => {
  const row = { id: uid() };
  TABLES[key].cols.forEach((c) => (row[c.key] = ""));
  return row;
};
const presetRows = (key) => {
  const t = TABLES[key];
  if (t.preset) {
    return t.labels.map((label) => ({ ...blankRow(key), [t.cols[0].key]: label }));
  }
  return Array.from({ length: t.blank }, () => blankRow(key));
};
const withIds = (key, rows) => rows.map((r) => ({ ...blankRow(key), ...r, id: uid() }));

// A row counts only if something besides the preset label was filled in
const cleanRows = (key, rows) => {
  const t = TABLES[key];
  const ignore = t.preset ? t.cols[0].key : null;
  return (rows || [])
    .filter((r) => t.cols.some((c) => c.key !== ignore && String(r[c.key] ?? "").trim() !== ""))
    .map(({ id, ...rest }) => rest);
};

/* ---------- patient autofill ---------- */
const pick = (...vals) => {
  const v = vals.find((x) => x !== undefined && x !== null && String(x).trim() !== "");
  return v === undefined ? "" : v;
};

// Reads the patient details from every place they may be stored
const buildPatientInfo = (patient) => {
  const pd = patient?.personalDetails || {};
  const enq = pd.enquiryId || patient?.enquiryId || {};
  return {
    patientName: pick(pd.name, pd.patientName, pd.fullName, enq.patientName, patient?.patientName, patient?.name),
    age: pick(pd.age, enq.age, patient?.age),
    gender: pick(pd.gender, enq.gender, patient?.gender),
    occupation: pick(pd.occupation, enq.occupation, patient?.occupation),
    address: pick(pd.address, enq.address, patient?.address),
    contactNumber: pick(pd.contactNumber, pd.phone, enq.contactNumber, patient?.contactNumber),
    chiefComplaint: pick(pd.chiefComplaint, enq.chiefComplaint, patient?.chiefComplaint),
  };
};
const nonEmpty = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => String(v ?? "").trim() !== ""));

const makeInitial = () => ({
  assessmentType: "Initial",
  recordNo: "",
  // 1
  patientName: "",
  age: "",
  gender: "",
  occupation: "",
  address: "",
  contactNumber: "",
  emergencyContact: "",
  referredBy: "",
  medicalDiagnosis: "",
  affectedSide: "",
  dateOfEvaluation: nowLocal(),
  physiotherapistName: "",
  // 2
  chiefComplaint: "",
  onset: "",
  durationOfCondition: "",
  historyOfPresentIllness: "",
  aggravatingFactors: "",
  functionalLimitations: "",
  pastMedicalHistory: "",
  surgicalHistory: "",
  currentMedication: "",
  familyHistory: "",
  mriReports: "",
  precautions: "",
  // 3
  buildNutrition: "",
  posture: "",
  scars: "",
  painSite: "",
  painType: "",
  vasScore: 0,
  communication: "",
  patientGoals: "",
  // 4, 5
  mmtRows: presetRows("mmtRows"),
  masRows: presetRows("masRows"),
  sensoryRows: presetRows("sensoryRows"),
  // 6
  cranialNerveExamination: "",
  orientation: "",
  memory: "",
  speech: "",
  perception: "",
  mood: "",
  // 7, 8, 9
  mobilityRows: presetRows("mobilityRows"),
  functionRows: presetRows("functionRows"),
  outcomeRows: presetRows("outcomeRows"),
  // 10
  clinicalSummary: "",
  keyImpairments: "",
  activityLimitations: "",
  participationRestrictions: "",
  prognosticFactors: "",
  caregiverPriorities: "",
  // 11
  goalRows: presetRows("goalRows"),
  plannedInterventions: "",
  frequencyReview: "",
  homeProgramme: "",
  referralFurther: "",
  // 12
  progressRows: presetRows("progressRows"),
  // 13
  changeFromBaseline: "",
  goalsStatus: "",
  updatedProblemList: "",
  planModification: "",
  // 14
  consentName: "",
  consentRelationship: "",
  patientConsent: "",
  datePatient: "",
  patientSignature: "",
  // 15
  qualification: "",
  physiotherapistSignature: "",
  datePhysiotherapist: nowLocal(),
});

const SECTIONS = [
  { id: "s1", title: "Patient & Referral", fields: ["referredBy", "emergencyContact", "medicalDiagnosis", "affectedSide"] },
  { id: "s2", title: "Presenting Problem & History", fields: ["chiefComplaint", "onset", "durationOfCondition", "historyOfPresentIllness", "aggravatingFactors", "functionalLimitations", "pastMedicalHistory", "surgicalHistory", "currentMedication", "familyHistory", "mriReports", "precautions"] },
  { id: "s3", title: "Initial Observation", fields: ["buildNutrition", "posture", "scars", "painSite", "painType", "communication", "patientGoals"] },
  { id: "s4", title: "Motor Examination", tables: ["mmtRows", "masRows"] },
  { id: "s5", title: "Sensory, Reflex & Coordination", tables: ["sensoryRows"] },
  { id: "s6", title: "Cranial Nerve / Cognition", fields: ["cranialNerveExamination", "orientation", "memory", "speech", "perception", "mood"] },
  { id: "s7", title: "Balance & Mobility", tables: ["mobilityRows"] },
  { id: "s8", title: "Function & Participation", tables: ["functionRows"] },
  { id: "s9", title: "Outcome Measures", tables: ["outcomeRows"] },
  { id: "s10", title: "Impression & Problem List", fields: ["clinicalSummary", "keyImpairments", "activityLimitations", "participationRestrictions", "prognosticFactors", "caregiverPriorities"] },
  { id: "s11", title: "Goals & Plan of Care", tables: ["goalRows"], fields: ["plannedInterventions", "frequencyReview", "homeProgramme", "referralFurther"] },
  { id: "s12", title: "Progress Notes", tables: ["progressRows"] },
  { id: "s13", title: "Reassessment Summary", fields: ["changeFromBaseline", "goalsStatus", "updatedProblemList", "planModification"] },
  { id: "s14", title: "Consent", fields: ["consentName", "consentRelationship", "patientConsent", "patientSignature"] },
  { id: "s15", title: "Clinician Authentication", fields: ["qualification", "physiotherapistSignature"] },
];

const NeuroPhysioFullForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location?.state?.patient;
  const patient_id = location?.state?.patient?._id;

  const { id } = useParams(); // If present => update mode
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(makeInitial);
  const [toast, setToast] = useState(null);

  const [activeRecords, setActiveRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const activeTab = "Neurological";

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    let data = null;
    try {
      data = JSON.parse(localStorage.getItem("loginEmployeeData"));
    } catch {
      data = null;
    }
    setFormData((prev) => ({
      ...prev,
      physiotherapistName: data?.personalDetails?.fullName || "",
    }));
  }, []);

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
      if (source[key] !== undefined) {
        result[key] = source[key];
      }
    });
    return result;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setRows = (key) => (rows) => setFormData((prev) => ({ ...prev, [key]: rows }));

  const [history, setHistory] = useState([]);

  // Fill the patient information, then the last saved assessment.
  // Patient details always come from the live patient record, so an older saved
  // copy (or an empty saved value) can never overwrite them.
  useEffect(() => {
    if (!patient) return;

    const info = buildPatientInfo(patient);
    const forms = patient?.assessment?.neurologicalFormId;

    let saved = {};
    if (forms?.length) {
      const lastForm = forms[forms.length - 1];
      saved = pickAllowedFields(lastForm, Object.keys(makeInitial()));

      TABLE_KEYS.forEach((k) => {
        if (Array.isArray(saved[k]) && saved[k].length) saved[k] = withIds(k, saved[k]);
        else delete saved[k];
      });

      // keep the logged-in physiotherapist and the current date, not the old ones
      delete saved.physiotherapistName;
      delete saved.dateOfEvaluation;
      delete saved.datePhysiotherapist;

      setActiveRecords([...forms].reverse());
    }

    const { chiefComplaint, ...identity } = info;
    setFormData((prev) => ({
      ...prev,
      ...saved,
      ...nonEmpty(identity), // read-only patient details: always from the patient record
      chiefComplaint: pick(saved.chiefComplaint, chiefComplaint, prev.chiefComplaint),
    }));
  }, [patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patient_id) {
      showToast("No patient is selected. Open this form from the patient's page.", "error");
      return;
    }

    // Rows left blank are not saved, so nothing is recorded as "normal" by default
    const cleaned = {};
    TABLE_KEYS.forEach((k) => (cleaned[k] = cleanRows(k, formData[k])));

    const payLoad = {
      patientId: patient_id,
      formData: { ...formData, ...cleaned },
    };
    setLoading(true);
    try {
      const endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/assessment/neurological`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("webapptoken"),
        },
        body: JSON.stringify(payLoad),
      });

      const result = await response.json();
      if (result?.success) {
        showToast(result?.message || "Assessment saved");
        setHistory(result?.updatedForm?.history);
        setFormData(makeInitial());
        setTimeout(() => navigate(`/PatientDetails/${patient_id}`), 900);
      } else if (result?.code === "TOKEN_EXPIRED" || result?.code === "INVALID_TOKEN") {
        showToast(`${result?.message} Please login again`, "error");
        setTimeout(() => {
          localStorage.removeItem("webapptoken");
          window.location.reload();
        }, 1500);
      } else {
        showToast(result?.message || "Could not save the assessment", "error");
      }
    } catch (error) {
      console.log("error inside the nero", error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const vas = Number(formData.vasScore) || 0;
  const vasTone =
    vas <= 3
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : vas <= 6
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-rose-50 text-rose-700 ring-rose-200";

  const updateLimitReached = id && history?.length >= 2;

  // Which sections have something filled in (for the tracker)
  const filledMap = useMemo(() => {
    const map = {};
    SECTIONS.forEach((s) => {
      const f = s.fields?.some((k) => String(formData[k] ?? "").trim() !== "");
      const t = s.tables?.some((k) => cleanRows(k, formData[k]).length > 0);
      map[s.id] = !!(f || t);
    });
    return map;
  }, [formData]);
  const filledCount = Object.values(filledMap).filter(Boolean).length;

  const downloadPdf = async () => {
    if (!selectedRecord) return;
    try {
      // saved record first; patient details fill any gaps (older records)
      const data = { ...buildPatientInfo(patient), ...nonEmpty(selectedRecord) };
      const blob = await pdf(<NeuroAssessmentPdf data={data} />).toBlob();
      const name = String(data.patientName || "Patient").trim().replace(/\s+/g, "_");
      saveAs(blob, `Neurological_Assessment_${name}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
      showToast("Could not create the PDF. Please try again.", "error");
    }
  };

  const goTo = (sid) => document.getElementById(sid)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {!patient && (
          <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            <p className="font-bold">Patient details could not be loaded</p>
            <p className="mt-1">
              This form gets the patient's details from the patient's page. Open the patient from the Enquiries list,
              then choose the assessment again. If you refreshed this page, go back and reopen it.
            </p>
          </div>
        )}

        {/* ---------- Hero banner ---------- */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0f2557] via-[#1b3f8f] to-[#2a62b8] px-8 py-8 text-white shadow-[0_20px_40px_-18px_rgba(15,37,87,0.6)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#4fbfc7]/20 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                {id ? "Update mode" : "New assessment"}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Neurological Physiotherapy Assessment</h1>
              <p className="text-base text-white/80">
                {formData.patientName ? `Assessment for ${formData.patientName}` : "Fill in the details below to record this assessment."}
              </p>
            </div>
            <div className="flex gap-3">
              <StatChip value={activeRecords.length} label="Past assessments" />
              <StatChip value={`${filledCount}/${SECTIONS.length}`} label="Sections started" />
            </div>
          </div>
        </div>

        {/* ---------- History ---------- */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0f1b3d]">History</h2>
              <p className="text-sm text-slate-500">Tap a record to view its details</p>
            </div>
            <span className="rounded-full bg-[#4fbfc7]/15 px-3 py-1 text-sm font-semibold text-[#2a8f98]">{activeRecords.length} total</span>
          </div>

          {activeRecords.length === 0 ? (
            <p className="text-sm text-slate-500">No {activeTab} records yet</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {activeRecords?.map((item, index) => (
                <li
                  key={item?._id}
                  onClick={() => {
                    setSelectedRecord(item);
                    setOpenModal(true);
                  }}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-[#4fbfc7] hover:bg-[#4fbfc7]/10"
                >
                  <p className="text-sm font-semibold text-[#0f1b3d]">
                    {activeTab} Assessment #{activeRecords.length - index}
                  </p>
                  <p className="text-xs text-slate-500">{formatDateTime(item?.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="grid items-start gap-6 lg:grid-cols-[250px_1fr]">
          {/* ---------- Section tracker ---------- */}
          <nav aria-label="Assessment sections" className="hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,37,87,0.04)] lg:sticky lg:top-24 lg:block">
            <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">Sections</p>
            <ol className="space-y-0.5">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => goTo(s.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition hover:bg-[#4fbfc7]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7]"
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        filledMap[s.id] ? "bg-[#4fbfc7] text-[#0f2557]" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {filledMap[s.id] ? "✓" : i + 1}
                    </span>
                    <span className={`truncate ${filledMap[s.id] ? "font-semibold text-[#0f1b3d]" : "text-slate-600"}`}>{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {/* ---------- Form ---------- */}
          <form onSubmit={handleSubmit} className="min-w-0 space-y-6">
            {/* Assessment type */}
            <Card>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Assessment type</label>
                  <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1" role="radiogroup" aria-label="Assessment type">
                    {["Initial", "Reassessment"].map((t) => {
                      const on = formData.assessmentType === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => setFormData((p) => ({ ...p, assessmentType: t }))}
                          className={`rounded-lg py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7] ${
                            on ? "bg-white text-[#2150a8] shadow-sm" : "text-slate-600 hover:text-[#0f1b3d]"
                          }`}
                        >
                          {t === "Initial" ? "Initial assessment" : "Reassessment"}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Input label="Record No." name="recordNo" value={formData.recordNo} onChange={handleChange} />
              </div>
            </Card>

            {/* 1 */}
            <Section id="s1" n={1} title="Patient & Referral Details" subtitle="Name, age, address and contact are filled from the patient record">
              <Grid>
                <Input label="Patient Name" name="patientName" value={formData.patientName} onChange={handleChange} readOnly />
                <Input label="Date of Birth / Age" name="age" value={formData.age} onChange={handleChange} readOnly />
                <Input label="Gender (optional)" name="gender" value={formData.gender} onChange={handleChange} readOnly />
                <Input label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} readOnly />
                <Input label="Address (as required)" name="address" value={formData.address} onChange={handleChange} readOnly />
                <Input label="Contact Number (minimum necessary)" name="contactNumber" value={formData.contactNumber} onChange={handleChange} readOnly />
                <Input label="Emergency Contact (if indicated)" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
                <Input label="Referred By / Treating Consultant" name="referredBy" value={formData.referredBy} onChange={handleChange} />
                <Input label="Medical Diagnosis" name="medicalDiagnosis" value={formData.medicalDiagnosis} onChange={handleChange} />
                <Input label="Affected Side / Region" name="affectedSide" value={formData.affectedSide} onChange={handleChange} />
                <Input label="Date & Time of Assessment" name="dateOfEvaluation" type="datetime-local" value={formData.dateOfEvaluation} onChange={handleChange} />
                <Input label="Treating Physiotherapist" name="physiotherapistName" value={formData.physiotherapistName} onChange={handleChange} readOnly />
              </Grid>
            </Section>

            {/* 2 */}
            <Section id="s2" n={2} title="Presenting Problem & History">
              <Textarea label="Chief Complaint (patient's words)" name="chiefComplaint" value={formData.chiefComplaint} onChange={handleChange} />
              <Grid>
                <Input label="Onset / Date of Onset" name="onset" value={formData.onset} onChange={handleChange} />
                <Input label="Duration / Course" name="durationOfCondition" value={formData.durationOfCondition} onChange={handleChange} />
              </Grid>
              <Textarea label="History of Present Illness" name="historyOfPresentIllness" value={formData.historyOfPresentIllness} onChange={handleChange} />
              <Textarea label="Aggravating / Easing Factors" name="aggravatingFactors" value={formData.aggravatingFactors} onChange={handleChange} />
              <Textarea label="Functional Limitations" name="functionalLimitations" value={formData.functionalLimitations} onChange={handleChange} />
              <Textarea label="Relevant Medical History" name="pastMedicalHistory" value={formData.pastMedicalHistory} onChange={handleChange} />
              <Textarea label="Surgical History / Procedures" name="surgicalHistory" value={formData.surgicalHistory} onChange={handleChange} />
              <Textarea label="Current Medication (relevant)" name="currentMedication" value={formData.currentMedication} onChange={handleChange} />
              <Textarea label="Family / Personal / Social History (relevant)" name="familyHistory" value={formData.familyHistory} onChange={handleChange} />
              <Textarea label="Investigations / Imaging Reviewed" name="mriReports" value={formData.mriReports} onChange={handleChange} />
              <Textarea label="Precautions / Contraindications / Red Flags" name="precautions" value={formData.precautions} onChange={handleChange} />
            </Section>

            {/* 3 */}
            <Section id="s3" n={3} title="Initial Observation">
              <Hint>Record only clinically relevant information. Mark a test as Not assessed or Not applicable when appropriate; do not assume normal findings.</Hint>
              <Grid>
                <Input label="General Condition / Build" name="buildNutrition" value={formData.buildNutrition} onChange={handleChange} />
                <Input label="Posture / Alignment" name="posture" value={formData.posture} onChange={handleChange} />
                <Input label="Skin / Scars / Edema (if relevant)" name="scars" value={formData.scars} onChange={handleChange} />
                <Input label="Communication / Behaviour" name="communication" value={formData.communication} onChange={handleChange} />
                <Input label="Pain Site" name="painSite" value={formData.painSite} onChange={handleChange} />
                <Input label="Pain Type (e.g., Sharp, Dull)" name="painType" value={formData.painType} onChange={handleChange} />
              </Grid>

              <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <label htmlFor="vas" className="font-semibold text-[#0f1b3d]">Pain score (VAS or NPRS, 0–10)</label>
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ring-1 ${vasTone}`}>{formData.vasScore} / 10</span>
                </div>
                <input
                  id="vas"
                  type="range"
                  min="0"
                  max="10"
                  value={formData.vasScore}
                  onChange={(e) => setFormData((p) => ({ ...p, vasScore: e.target.value }))}
                  className="w-full cursor-pointer accent-[#2150a8]"
                />
                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>No pain</span>
                  <span>Worst pain</span>
                </div>
              </div>

              <Textarea label="Patient's Goals / Priorities" name="patientGoals" value={formData.patientGoals} onChange={handleChange} />
            </Section>

            {/* 4 */}
            <Section id="s4" n={4} title="Motor Examination">
              <SubTitle>Manual Muscle Testing (MMT)</SubTitle>
              <Hint>Record muscle / movement, side and grade (e.g., 0–5); include pain, range or testing limitations.</Hint>
              <DataTable tableKey="mmtRows" rows={formData.mmtRows} onChange={setRows("mmtRows")} />

              <div className="mt-8" />
              <SubTitle>Tone / Spasticity: Modified Ashworth Scale (MAS)</SubTitle>
              <Hint>Use MAS where appropriate. Record the muscle group and side; use the scale convention adopted by the clinic.</Hint>
              <DataTable tableKey="masRows" rows={formData.masRows} onChange={setRows("masRows")} />
            </Section>

            {/* 5 */}
            <Section id="s5" n={5} title="Sensory, Reflex & Coordination Examination">
              <Hint>Examples as indicated: light touch, pinprick, proprioception, cortical sensation, deep tendon reflexes, superficial reflexes, pathological reflexes, clonus, finger-nose, heel-shin and rapid alternating movements.</Hint>
              <DataTable tableKey="sensoryRows" rows={formData.sensoryRows} onChange={setRows("sensoryRows")} />
            </Section>

            {/* 6 */}
            <Section id="s6" n={6} title="Cranial Nerve / Cognition / Communication" subtitle="As indicated">
              <Textarea label="Cranial Nerve Findings" name="cranialNerveExamination" value={formData.cranialNerveExamination} onChange={handleChange} />
              <Textarea label="Orientation / Attention" name="orientation" value={formData.orientation} onChange={handleChange} />
              <Textarea label="Memory / Executive Function" name="memory" value={formData.memory} onChange={handleChange} />
              <Textarea label="Speech / Language / Swallowing concerns" name="speech" value={formData.speech} onChange={handleChange} />
              <Textarea label="Visual / Perceptual Findings" name="perception" value={formData.perception} onChange={handleChange} />
              <Textarea label="Mood / Behaviour" name="mood" value={formData.mood} onChange={handleChange} />
            </Section>

            {/* 7 */}
            <Section id="s7" n={7} title="Postural Control, Balance & Mobility">
              <Hint>Consider bed mobility, rolling, supine-to-sit, sitting balance, standing balance, transfers, sit-to-stand, gait pattern, walking distance, stairs and assistive devices, as relevant.</Hint>
              <DataTable tableKey="mobilityRows" rows={formData.mobilityRows} onChange={setRows("mobilityRows")} />
            </Section>

            {/* 8 */}
            <Section id="s8" n={8} title="Functional Independence & Participation">
              <Hint>Consider ADLs, transfers, toileting, dressing, bathing, feeding, household/community mobility, work/study and caregiver burden where relevant.</Hint>
              <DataTable tableKey="functionRows" rows={formData.functionRows} onChange={setRows("functionRows")} />
            </Section>

            {/* 9 */}
            <Section id="s9" n={9} title="Standardized Outcome Measures">
              <Hint>Choose validated measures appropriate to the diagnosis and goals (e.g., Barthel Index, FIM where licensed/appropriate, Berg Balance Scale, 10-Metre Walk Test, Timed Up and Go, or condition-specific measures). Follow each measure's administration and scoring instructions.</Hint>
              <DataTable tableKey="outcomeRows" rows={formData.outcomeRows} onChange={setRows("outcomeRows")} />
            </Section>

            {/* 10 */}
            <Section id="s10" n={10} title="Clinical Impression & Problem List">
              <Textarea label="Clinical Summary / Movement Diagnosis" name="clinicalSummary" value={formData.clinicalSummary} onChange={handleChange} />
              <Textarea label="Key Impairments" name="keyImpairments" value={formData.keyImpairments} onChange={handleChange} />
              <Textarea label="Activity Limitations" name="activityLimitations" value={formData.activityLimitations} onChange={handleChange} />
              <Textarea label="Participation Restrictions" name="participationRestrictions" value={formData.participationRestrictions} onChange={handleChange} />
              <Textarea label="Prognostic / Contextual Factors" name="prognosticFactors" value={formData.prognosticFactors} onChange={handleChange} />
              <Textarea label="Patient / Caregiver Priorities" name="caregiverPriorities" value={formData.caregiverPriorities} onChange={handleChange} />
            </Section>

            {/* 11 */}
            <Section id="s11" n={11} title="Goals & Plan of Care">
              <Hint>Goals should be measurable, patient-centred and time-bound. Document clinical reasoning and obtain consent before assessment or treatment.</Hint>
              <DataTable tableKey="goalRows" rows={formData.goalRows} onChange={setRows("goalRows")} />
              <div className="mt-6" />
              <Textarea label="Planned Interventions / Exercise Programme" name="plannedInterventions" value={formData.plannedInterventions} onChange={handleChange} />
              <Textarea label="Frequency & Expected Review Date" name="frequencyReview" value={formData.frequencyReview} onChange={handleChange} />
              <Textarea label="Home Programme / Caregiver Education" name="homeProgramme" value={formData.homeProgramme} onChange={handleChange} />
              <Textarea label="Referral / Further Review Required" name="referralFurther" value={formData.referralFurther} onChange={handleChange} />
            </Section>

            {/* 12 */}
            <Section id="s12" n={12} title="Follow-up / Session Progress Notes">
              <DataTable tableKey="progressRows" rows={formData.progressRows} onChange={setRows("progressRows")} />
            </Section>

            {/* 13 */}
            <Section id="s13" n={13} title="Reassessment Summary">
              <Textarea label="Change from Baseline" name="changeFromBaseline" value={formData.changeFromBaseline} onChange={handleChange} />
              <Textarea label="Goals Achieved / Partially Achieved / Not Achieved" name="goalsStatus" value={formData.goalsStatus} onChange={handleChange} />
              <Textarea label="Updated Problem List / Goals" name="updatedProblemList" value={formData.updatedProblemList} onChange={handleChange} />
              <Textarea label="Plan Modification / Reason" name="planModification" value={formData.planModification} onChange={handleChange} />
            </Section>

            {/* 14 */}
            <Section id="s14" n={14} title="Consent & Patient Information">
              <p className="mb-5 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 ring-1 ring-slate-200">
                The assessment and proposed examination procedures were explained in a language I understand. I had the opportunity to ask questions. I understand that findings and treatment response may vary, and I may ask for clarification or withdraw consent where appropriate.
              </p>
              <Grid>
                <Input label="Patient / Legal Representative Name" name="consentName" value={formData.consentName} onChange={handleChange} />
                <Input label="Relationship (if applicable)" name="consentRelationship" value={formData.consentRelationship} onChange={handleChange} />
                <div className="mb-4">
                  <label className={labelClass}>Consent</label>
                  <select name="patientConsent" value={formData.patientConsent} onChange={handleChange} className={fieldClass}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <Input label="Consent Date" type="date" name="datePatient" value={formData.datePatient} onChange={handleChange} />
                <Input label="Patient / Representative Signature (type full name)" name="patientSignature" value={formData.patientSignature} onChange={handleChange} />
              </Grid>
            </Section>

            {/* 15 */}
            <Section id="s15" n={15} title="Clinician Authentication">
              <Grid>
                <Input label="Treating Physiotherapist Name" name="physiotherapistName" value={formData.physiotherapistName} onChange={handleChange} readOnly />
                <Input label="Qualification / Registration No." name="qualification" value={formData.qualification} onChange={handleChange} />
                <Input label="Signature (type full name)" name="physiotherapistSignature" value={formData.physiotherapistSignature} onChange={handleChange} />
                <Input label="Date & Time" type="datetime-local" name="datePhysiotherapist" value={formData.datePhysiotherapist} onChange={handleChange} />
              </Grid>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Confidentiality: this is a confidential clinical record. Store securely and share only with appropriate authorization or as otherwise permitted or required by law. This template does not replace professional judgement, diagnosis-specific protocols, local legal requirements or the official instructions for standardized assessment tools.
              </p>
            </Section>

            {/* ---------- Action bar ---------- */}
            <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 shadow-[0_12px_30px_-12px_rgba(15,37,87,0.35)] backdrop-blur">
              <div className="text-sm font-semibold">
                {id ? (
                  updateLimitReached ? (
                    <span className="text-rose-600">No update possible. Maximum update limit (2) reached.</span>
                  ) : (
                    <span className="text-emerald-600">
                      {2 - (history?.length || 0)} update{2 - (history?.length || 0) === 1 ? " is" : "s are"} remaining.
                    </span>
                  )
                ) : (
                  <span className="text-slate-500">{filledCount} of {SECTIONS.length} sections started. Review everything before you submit.</span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLimitReached || loading || !patient_id}
                  className={`rounded-xl px-7 py-2.5 font-semibold text-white shadow-md transition ${
                    updateLimitReached
                      ? "cursor-not-allowed bg-slate-400"
                      : id
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110"
                        : "bg-gradient-to-r from-[#1b3f8f] to-[#2a62b8] hover:brightness-110"
                  } ${loading ? "opacity-70" : ""}`}
                >
                  {id ? (loading ? "Updating..." : "Update Assessment") : loading ? "Submitting..." : "Submit Assessment"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <AssessmentDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedRecord}
        title={`${activeTab} Assessment`}
        assessmentType={activeTab}
        onDownloadPdf={downloadPdf}
      />

      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          className={`fixed bottom-24 right-6 z-[100] max-w-sm rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${
            toast.type === "error" ? "bg-rose-600" : "bg-[#0f2557]"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default NeuroPhysioFullForm;

// --- Helper Components ---
const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0f1b3d] placeholder:text-slate-400 transition focus:border-[#4fbfc7] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4fbfc7]/20 read-only:cursor-not-allowed read-only:bg-slate-100 read-only:text-slate-500";

const cellClass =
  "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-[#0f1b3d] placeholder:text-slate-300 focus:border-[#4fbfc7] focus:outline-none focus:ring-2 focus:ring-[#4fbfc7]/25";

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-600";

const Card = ({ children }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,37,87,0.04)]">{children}</div>
);

const StatChip = ({ value, label }) => (
  <div className="min-w-[110px] rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur">
    <div className="text-3xl font-extrabold leading-none">{value}</div>
    <div className="mt-1 text-sm text-white/80">{label}</div>
  </div>
);

const Section = ({ id, n, title, subtitle, children }) => (
  <section id={id} className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,37,87,0.04)] sm:p-8">
    <div className="mb-6 flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#1b3f8f] to-[#2a62b8] text-sm font-bold text-white">{n}</span>
      <div>
        <h2 className="text-xl font-bold text-[#0f1b3d]">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
);

const SubTitle = ({ children }) => <h3 className="mb-1 text-base font-bold text-[#2150a8]">{children}</h3>;

const Hint = ({ children }) => (
  <p className="mb-4 rounded-xl bg-[#4fbfc7]/10 px-4 py-2.5 text-[13px] leading-relaxed text-[#1f6f77]">{children}</p>
);

const Input = ({ label, type = "text", name, value, onChange, readOnly }) => (
  <div className="mb-4">
    <label htmlFor={name} className={labelClass}>{label}</label>
    <input
      id={name}
      type={type}
      placeholder={readOnly ? "" : label}
      name={name}
      value={type === "datetime-local" ? normDT(value) : value ?? ""}
      onChange={onChange}
      readOnly={readOnly}
      className={fieldClass}
    />
  </div>
);

const Textarea = ({ label, name, value, onChange, readOnly }) => (
  <div className="mb-4">
    <label htmlFor={name} className={labelClass}>{label}</label>
    <textarea
      id={name}
      placeholder={label}
      rows={3}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      readOnly={readOnly}
      className={`${fieldClass} resize-y`}
    />
  </div>
);

const Grid = ({ children }) => <div className="grid grid-cols-1 gap-x-5 md:grid-cols-2">{children}</div>;

/* Editable table used for MMT, MAS, sensory, mobility, function, outcomes, goals and progress notes */
const DataTable = ({ tableKey, rows, onChange }) => {
  const t = TABLES[tableKey];

  const update = (i, key, val) => onChange(rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));
  const add = () => onChange([...rows, blankRow(tableKey)]);

  return (
    <div>
      {t.cols.map(
        (c) =>
          c.list && (
            <datalist key={c.key} id={`${tableKey}-${c.key}`}>
              {c.list.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          )
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              {t.cols.map((c) => (
                <th key={c.key} className={`px-2.5 py-3 font-semibold ${c.narrow ? "w-20" : ""}`}>{c.label}</th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr key={r.id}>
                {t.cols.map((c) => (
                  <td key={c.key} className="p-1.5 align-top">
                    {c.select ? (
                      <select
                        aria-label={`${c.label}, row ${i + 1}`}
                        value={r[c.key] ?? ""}
                        onChange={(e) => update(i, c.key, e.target.value)}
                        className={cellClass}
                      >
                        <option value="">Select</option>
                        {c.select.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : c.area ? (
                      <textarea
                        aria-label={`${c.label}, row ${i + 1}`}
                        rows={2}
                        value={r[c.key] ?? ""}
                        onChange={(e) => update(i, c.key, e.target.value)}
                        className={`${cellClass} resize-y`}
                      />
                    ) : (
                      <input
                        aria-label={`${c.label}, row ${i + 1}`}
                        type={c.type || "text"}
                        list={c.list ? `${tableKey}-${c.key}` : undefined}
                        placeholder={c.ph || ""}
                        value={r[c.key] ?? ""}
                        onChange={(e) => update(i, c.key, e.target.value)}
                        className={cellClass}
                      />
                    )}
                  </td>
                ))}
                <td className="p-1.5 align-top">
                  <button
                    type="button"
                    aria-label={`Remove row ${i + 1}`}
                    onClick={() => remove(i)}
                    disabled={rows.length === 1}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#2150a8] transition hover:bg-[#4fbfc7]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7]"
      >
        + {t.add}
      </button>
    </div>
  );
};
