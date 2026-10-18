// import {
//   Document,
//   Page,
//   Text,
//   View,
//   Image,
//   StyleSheet,
// } from "@react-pdf/renderer";
// // import logo from "../../../public/logo.jpeg"; // your logo

// import { Font } from "@react-pdf/renderer";

// Font.register({
//   family: "Roboto",
//   fonts: [
//     {
//       src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf",
//     },
//     {
//       src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf",
//       fontWeight: "bold",
//     },
//   ],
// });

// const styles = StyleSheet.create({
//   page: {
//     paddingTop: 110,
//     paddingBottom: 120,
//     paddingHorizontal: 40,
//     fontFamily: "Roboto",
//     fontSize: 11,
//   },

//   header: {
//     position: "absolute",
//     top: 20,
//     left: 40,
//     right: 40,
//     zIndex:10,
//     borderBottom: "1 solid #0f5c8e",
//     paddingBottom: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   logo: {
//     width: 130,
//   },

//   footer: {
//     position: "absolute",
//     bottom: 20,
//     left: 40,
//     right: 40,
//     borderTop: "1 solid #0f5c8e",
//     paddingTop: 10,
//     textAlign: "center",
//     fontSize: 9,
//     color: "#555",
//   },

//   content: {
//     marginTop: 20,
//     marginBottom: 40,
//   },
//   signature: {
//     position: "absolute",
//     bottom: 80, // ⬅️ just above footer
//     right: 40,
//     textAlign: "right",
//     fontSize: 11,
//   },
// });

// const PdfTemplate = ({ children, showHeader = true }) => {
//   // console.log("children", children);
//   // const pageStyle = {
//   //   ...styles.page,
//   //   paddingTop: showHeader ? 110 : 60, // 🔥 key line
//   // };
//   return (
//     <Document>
//       <Page size="A4" style={styles.page} wrap>
//         {/* Header */}
//         <View style={styles.header} fixed>
//           <Image src="/logo2.jpeg" style={styles.logo} />
//           {showHeader && (
//             <View>
//               <Text
//                 style={{
//                   marginBottom: 4,
//                   fontSize: 10, // 🔥 Bigger name
//                   fontWeight: "bold",
//                 }}
//               >
//                 Dr. Mayank Gupta (PT), BPT
//               </Text>
//               <Text style={{ fontSize: 8 , marginBottom: 4 }}>
//                 Certified PNF Practitioner (IPNFA – Level 3A)
//               </Text>
//               <Text style={{ fontSize:8 , marginBottom: 4 }}>
//                 Certified in Mulligan Concept Manual Therapy (C.O.M.M.T)
//               </Text>
//               <Text style={{ fontSize: 8 , marginBottom: 4 }}>
//                 Certified Pilates Instructor
//               </Text>
//               <Text style={{ fontSize: 7 , marginBottom: 4 }}>
//                 Registration No.: SCH-01/DEG2/25326/2014
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* Dynamic Content */}
//         <View style={styles.content}>{children}</View>

//         {/* Signature */}
//         <View style={styles.signature} fixed>
//           <Text>Authorized Signature</Text>
//           <Text style={{ marginTop: 25, fontWeight: "bold" }}>
//             Dr. Mayank Gupta (PT)
//           </Text>
//         </View>

//         {/* Footer */}
//         <View style={styles.footer} fixed>
//           <Text>
//             Bhawna Nager, Akhand Param Dham Near NDP'S School khandwa road
//             indore 452020
//             {/* Movement Rehab, Near NDPS School, Khandwa Road, Indore 452020 */}
//           </Text>
//           <Text>+91 6262 666 558 | movementrehab.in@gmail.com</Text>
//           <Text
//             render={({ pageNumber, totalPages }) =>
//               `Page ${pageNumber} of ${totalPages}`
//             }
//           />
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default PdfTemplate;
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

/*
  Neurological assessment PDF, laid out like the Movement Rehab paper template.
  Usage:
    const blob = await pdf(<NeuroAssessmentPdf data={record} />).toBlob();

  `data` is one saved assessment (the same object your form saves).
  Records saved with the OLD form still work: fields that only exist in the old
  format are listed in an "Additional findings" block.
  No logo is used; the brand name is drawn as text (blue "Movement", cyan "Rehab").
*/

const BLUE = "#0B4BAA";
const CYAN = "#00C2CB";
const INK = "#14302E";
const MUTED = "#5F7573";
const LINE = "#DCE6E4";
const HEAD = "#E8F0FB";

const styles = StyleSheet.create({
  page: { paddingTop: 58, paddingBottom: 50, paddingHorizontal: 36, fontSize: 9, color: INK, fontFamily: "Helvetica" },

  // running header and footer (every page)
  header: { position: "absolute", top: 20, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 6, borderBottomWidth: 1.2, borderBottomColor: BLUE },
  headerRight: { fontSize: 7.5, color: MUTED, letterSpacing: 0.8 },
  footer: { position: "absolute", bottom: 20, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", paddingTop: 6, borderTopWidth: 0.7, borderTopColor: LINE, fontSize: 7.5, color: MUTED },

  // first-page brand block
  brandBlock: { alignItems: "center", marginBottom: 10 },
  brandSub: { fontSize: 9, color: MUTED, marginTop: 2 },
  title: { fontSize: 15, fontFamily: "Helvetica-Bold", textAlign: "center", marginTop: 10, color: INK, letterSpacing: 0.5 },
  typeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 6, paddingVertical: 6, paddingHorizontal: 8, backgroundColor: HEAD, borderRadius: 3 },
  typeChip: { fontSize: 8, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 8, marginRight: 6, borderWidth: 0.8, borderColor: BLUE, color: BLUE },
  typeChipOn: { backgroundColor: BLUE, color: "#fff" },
  recordNo: { fontSize: 9 },

  // group banners (start a new page like the template)
  band: { backgroundColor: BLUE, borderRadius: 3, paddingVertical: 6, paddingHorizontal: 10, marginBottom: 8 },
  bandText: { color: "#fff", fontFamily: "Helvetica-Bold", fontSize: 10.5, letterSpacing: 0.6 },

  // numbered sections
  sectionHead: { flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 6, paddingBottom: 3, borderBottomWidth: 0.8, borderBottomColor: BLUE },
  sectionNum: { width: 16, height: 16, borderRadius: 3, backgroundColor: CYAN, color: INK, fontFamily: "Helvetica-Bold", fontSize: 8.5, textAlign: "center", paddingTop: 3.5, marginRight: 6 },
  sectionTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, color: BLUE, letterSpacing: 0.4 },
  subTitle: { fontFamily: "Helvetica-Bold", fontSize: 8.5, color: INK, marginTop: 6, marginBottom: 3 },

  // fields (label above, value on a line, like the paper form)
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  field: { marginBottom: 6 },
  label: { fontSize: 7, color: MUTED, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 1.5 },
  value: { fontSize: 9.5, paddingBottom: 2, borderBottomWidth: 0.6, borderBottomColor: "#B8C7D6", minHeight: 13 },
  muted: { color: "#9AAAA8" },

  // tables
  table: { borderWidth: 0.6, borderColor: "#B8C7D6", marginBottom: 4 },
  tr: { flexDirection: "row" },
  th: { backgroundColor: HEAD, fontFamily: "Helvetica-Bold", fontSize: 7.8, padding: 3.5, borderRightWidth: 0.6, borderRightColor: "#B8C7D6" },
  td: { fontSize: 8.6, padding: 3.5, borderTopWidth: 0.6, borderTopColor: "#B8C7D6", borderRightWidth: 0.6, borderRightColor: "#B8C7D6" },
  empty: { fontSize: 8.5, color: "#9AAAA8", fontStyle: "italic", paddingVertical: 4 },

  note: { fontSize: 7.8, color: MUTED, lineHeight: 1.4, marginTop: 4 },
  consent: { fontSize: 8.6, lineHeight: 1.45, padding: 8, backgroundColor: "#F2F6F5", borderRadius: 3, marginBottom: 8 },
});

/* ---------- helpers ---------- */

const str = (v) => (v === undefined || v === null ? "" : String(v).trim());
const isDateOnly = (v) => /^\d{4}-\d{2}-\d{2}$/.test(str(v));

const fmtDate = (v) => {
  if (!str(v)) return "";
  const d = new Date(v);
  return isNaN(d) ? str(v) : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const fmtDateTime = (v) => {
  if (!str(v)) return "";
  if (isDateOnly(v)) return fmtDate(v);
  const d = new Date(v);
  return isNaN(d)
    ? str(v)
    : d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
};

const Wordmark = ({ size }) => (
  <Text style={{ fontSize: size, fontFamily: "Helvetica-Bold" }}>
    <Text style={{ color: BLUE }}>Movement </Text>
    <Text style={{ color: CYAN }}>Rehab</Text>
  </Text>
);

const Section = ({ n, title, children }) => (
  <View>
    <View style={styles.sectionHead} minPresenceAhead={60}>
      <Text style={styles.sectionNum}>{n}</Text>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    </View>
    {children}
  </View>
);

const Field = ({ label, value, half }) => {
  const v = str(value);
  return (
    <View style={[styles.field, { width: half ? "48.5%" : "100%" }]} wrap={false}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, !v && styles.muted]}>{v || "-"}</Text>
    </View>
  );
};

const Grid = ({ children }) => <View style={styles.grid}>{children}</View>;

const cleanRows = (rows, cols) =>
  (Array.isArray(rows) ? rows : []).filter((r) => cols.some((c) => str(r?.[c.key]) !== ""));

const Table = ({ cols, rows, emptyText = "No findings recorded." }) => {
  const list = cleanRows(rows, cols);
  if (!list.length) return <Text style={styles.empty}>{emptyText}</Text>;
  const last = cols.length - 1;
  return (
    <View style={styles.table}>
      <View style={styles.tr} wrap={false}>
        {cols.map((c, i) => (
          <Text key={c.key} style={[styles.th, { flex: c.flex || 1 }, i === last && { borderRightWidth: 0 }]}>
            {c.label}
          </Text>
        ))}
      </View>
      {list.map((r, idx) => (
        <View key={idx} style={styles.tr} wrap={false}>
          {cols.map((c, i) => (
            <Text key={c.key} style={[styles.td, { flex: c.flex || 1 }, i === last && { borderRightWidth: 0 }]}>
              {c.date ? fmtDate(r[c.key]) || "-" : str(r[c.key]) || "-"}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

/* ---------- table columns (same as the form) ---------- */

const MMT = [
  { key: "muscle", label: "Movement / Muscle Group", flex: 2.2 },
  { key: "right", label: "Right Grade", flex: 1 },
  { key: "left", label: "Left Grade", flex: 1 },
  { key: "notes", label: "Notes / Limitation", flex: 2.2 },
];
const MAS = [
  { key: "muscle", label: "Muscle Group", flex: 2.2 },
  { key: "right", label: "Right", flex: 1 },
  { key: "left", label: "Left", flex: 1 },
  { key: "notes", label: "Position / Notes", flex: 2.2 },
];
const SENSORY = [
  { key: "test", label: "Test / Domain", flex: 2 },
  { key: "right", label: "Right", flex: 1.2 },
  { key: "left", label: "Left", flex: 1.2 },
  { key: "findings", label: "Findings / Comments", flex: 2.4 },
];
const MOBILITY = [
  { key: "task", label: "Task / Test", flex: 2 },
  { key: "performance", label: "Performance / Score", flex: 1.6 },
  { key: "assistance", label: "Assistance Level", flex: 1.4 },
  { key: "notes", label: "Device / Notes", flex: 2 },
];
const FUNCTION = [
  { key: "activity", label: "Activity / Domain", flex: 2 },
  { key: "ability", label: "Current Ability", flex: 1.6 },
  { key: "assistance", label: "Assistance / Support", flex: 1.6 },
  { key: "notes", label: "Limitations / Notes", flex: 2 },
];
const OUTCOME = [
  { key: "measure", label: "Measure / Version", flex: 2 },
  { key: "baseline", label: "Baseline Score & Date", flex: 1.6 },
  { key: "reassessment", label: "Reassessment Score & Date", flex: 1.6 },
  { key: "notes", label: "Interpretation / Notes", flex: 2 },
];
const GOALS = [
  { key: "priority", label: "Priority", flex: 0.7 },
  { key: "problem", label: "Problem", flex: 1.6 },
  { key: "baseline", label: "Baseline", flex: 1.4 },
  { key: "target", label: "SMART Goal / Target", flex: 2 },
  { key: "targetDate", label: "Target Date", flex: 1.1, date: true },
];
const PROGRESS = [
  { key: "date", label: "Date / Session", flex: 1.1 },
  { key: "subjective", label: "Subjective Update", flex: 2 },
  { key: "objective", label: "Objective Findings / Measures", flex: 2 },
  { key: "plan", label: "Intervention / Response / Next Plan", flex: 2.2 },
];

// Fields that exist only in records saved with the old form
const LEGACY = [
  ["obstetricHistory", "Obstetric History"],
  ["personalHistory", "Personal History"],
  ["gait", "Gait"],
  ["deformities", "Deformities / Contractures"],
  ["tenderness", "Tenderness / Swelling / Muscle Tone"],
  ["mmt", "MMT (manual muscle testing)"],
  ["mas", "MAS (Modified Ashworth Scale)"],
  ["clonus", "Clonus / Rigidity / Flaccidity"],
  ["superficialReflexes", "Superficial Reflexes"],
  ["deepReflexes", "Deep Reflexes"],
  ["pathologicalReflexes", "Pathological Reflexes"],
  ["coordination", "Coordination"],
  ["superficialSensations", "Superficial Sensations"],
  ["deepSensations", "Deep Sensations"],
  ["corticalSensations", "Cortical Sensations"],
  ["bedMobility", "Bed Mobility / Transfers / Wheelchair Mobility"],
  ["gaitPattern", "Gait Pattern"],
  ["balance", "Balance"],
  ["assistiveDevices", "Assistive Devices"],
  ["adls", "Activities of Daily Living"],
  ["fimScores", "FIM Scores & Observations"],
  ["outcomeMeasures", "Outcome Measures"],
  ["problemList", "Problem List"],
  ["shortTermGoals", "Short Term Goals"],
  ["longTermGoals", "Long Term Goals"],
  ["followUp", "Follow-up Observations & Plan"],
];

/* ---------- document ---------- */

const NeuroAssessmentPdf = ({ data = {} }) => {
  const d = data || {};
  const type = d.assessmentType === "Reassessment" ? "Reassessment" : "Initial";

  const vasNum = Number(d.vasScore);
  const painParts = [str(d.painSite), str(d.painType)].filter(Boolean);
  const pain =
    painParts.length || (vasNum > 0)
      ? [...painParts, `${isNaN(vasNum) ? 0 : vasNum}/10`].join(" / ")
      : "";

  const legacy = LEGACY.filter(([k]) => typeof d[k] === "string" && str(d[k]) !== "");
  const consentLine = [str(d.patientConsent), fmtDate(d.datePatient)].filter(Boolean).join("  ·  ");

  return (
    <Document title={`Neurological Assessment${d.patientName ? ` - ${d.patientName}` : ""}`} author="Movement Rehab">
      <Page size="A4" style={styles.page} wrap>
        {/* running header */}
        <View fixed style={styles.header}>
          <Text>
            <Wordmark size={9.5} />
            <Text style={{ fontSize: 7.5, color: MUTED, letterSpacing: 0.8 }}>{"   |   NEUROLOGICAL REHABILITATION"}</Text>
          </Text>
          <Text style={styles.headerRight}>CONFIDENTIAL CLINICAL RECORD</Text>
        </View>

        {/* running footer */}
        <View fixed style={styles.footer}>
          <Text>Movement Rehab Physiotherapy &amp; Rehabilitation Centre | Indore</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${d.patientName ? `Patient: ${d.patientName}   ·   ` : ""}Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>

        {/* brand block */}
        <View style={styles.brandBlock}>
          <Wordmark size={22} />
          <Text style={styles.brandSub}>Physiotherapy &amp; Rehabilitation Centre | Indore</Text>
          <Text style={styles.title}>NEUROLOGICAL PHYSIOTHERAPY ASSESSMENT</Text>
        </View>

        <View style={styles.typeRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.typeChip, type === "Initial" && styles.typeChipOn]}>INITIAL ASSESSMENT</Text>
            <Text style={[styles.typeChip, type === "Reassessment" && styles.typeChipOn]}>REASSESSMENT</Text>
          </View>
          <Text style={styles.recordNo}>
            Record No.: <Text style={{ fontFamily: "Helvetica-Bold" }}>{str(d.recordNo) || "-"}</Text>
            {d.createdAt ? `     Created: ${fmtDateTime(d.createdAt)}` : ""}
          </Text>
        </View>

        {/* 1 */}
        <Section n={1} title="Patient & Referral Details">
          <Grid>
            <Field half label="Patient Name" value={d.patientName} />
            <Field half label="Date of Birth / Age" value={d.age} />
            <Field half label="Gender (optional)" value={d.gender} />
            <Field half label="Occupation" value={d.occupation} />
            <Field half label="Address (as required)" value={d.address} />
            <Field half label="Contact Number (minimum necessary)" value={d.contactNumber} />
            <Field half label="Emergency Contact (if indicated)" value={d.emergencyContact} />
            <Field half label="Referred By / Treating Consultant" value={d.referredBy} />
            <Field half label="Medical Diagnosis" value={d.medicalDiagnosis} />
            <Field half label="Affected Side / Region" value={d.affectedSide} />
            <Field half label="Date & Time of Assessment" value={fmtDateTime(d.dateOfEvaluation)} />
            <Field half label="Treating Physiotherapist" value={d.physiotherapistName} />
          </Grid>
        </Section>

        {/* 2 */}
        <Section n={2} title="Presenting Problem & History">
          <Field label="Chief Complaint (patient's words)" value={d.chiefComplaint} />
          <Grid>
            <Field half label="Onset / Date of Onset" value={d.onset} />
            <Field half label="Duration / Course" value={d.durationOfCondition} />
          </Grid>
          <Field label="History of Present Illness" value={d.historyOfPresentIllness} />
          <Field label="Aggravating / Easing Factors" value={d.aggravatingFactors} />
          <Field label="Functional Limitations" value={d.functionalLimitations} />
          <Field label="Relevant Medical History" value={d.pastMedicalHistory} />
          <Field label="Surgical History / Procedures" value={d.surgicalHistory} />
          <Field label="Current Medication (relevant)" value={d.currentMedication} />
          <Field label="Family / Personal / Social History (relevant)" value={d.familyHistory} />
          <Field label="Investigations / Imaging Reviewed" value={d.mriReports} />
          <Field label="Precautions / Contraindications / Red Flags" value={d.precautions} />
        </Section>

        {/* 3 */}
        <Section n={3} title="Initial Observation">
          <Grid>
            <Field half label="General Condition / Build" value={d.buildNutrition} />
            <Field half label="Posture / Alignment" value={d.posture} />
            <Field half label="Skin / Scars / Edema (if relevant)" value={d.scars} />
            <Field half label="Communication / Behaviour" value={d.communication} />
          </Grid>
          <Field label="Pain Site / Type / VAS or NPRS (0–10)" value={pain} />
          <Field label="Patient's Goals / Priorities" value={d.patientGoals} />
          <Text style={styles.note}>
            Record only clinically relevant information. Mark a test as Not assessed or Not applicable when appropriate; do not assume normal findings.
          </Text>
        </Section>

        {/* ---------------- group: neurological examination ---------------- */}
        <View break style={styles.band}>
          <Text style={styles.bandText}>NEUROLOGICAL EXAMINATION</Text>
        </View>

        <Section n={4} title="Motor Examination">
          <Text style={styles.subTitle}>Manual Muscle Testing (MMT)</Text>
          <Table cols={MMT} rows={d.mmtRows} />
          <Text style={styles.subTitle}>Tone / Spasticity: Modified Ashworth Scale (MAS)</Text>
          <Table cols={MAS} rows={d.masRows} />
        </Section>

        <Section n={5} title="Sensory, Reflex & Coordination Examination">
          <Table cols={SENSORY} rows={d.sensoryRows} />
        </Section>

        <Section n={6} title="Cranial Nerve / Cognition / Communication (as indicated)">
          <Field label="Cranial Nerve Findings" value={d.cranialNerveExamination} />
          <Field label="Orientation / Attention" value={d.orientation} />
          <Field label="Memory / Executive Function" value={d.memory} />
          <Field label="Speech / Language / Swallowing concerns" value={d.speech} />
          <Field label="Visual / Perceptual Findings" value={d.perception} />
          <Field label="Mood / Behaviour" value={d.mood} />
        </Section>

        <Section n={7} title="Postural Control, Balance & Mobility">
          <Table cols={MOBILITY} rows={d.mobilityRows} />
        </Section>

        {/* ---------------- group: function, impression, plan ---------------- */}
        <View break style={styles.band}>
          <Text style={styles.bandText}>FUNCTION, CLINICAL IMPRESSION &amp; REHABILITATION PLAN</Text>
        </View>

        <Section n={8} title="Functional Independence & Participation">
          <Table cols={FUNCTION} rows={d.functionRows} />
        </Section>

        <Section n={9} title="Standardized Outcome Measures">
          <Table cols={OUTCOME} rows={d.outcomeRows} emptyText="No outcome measures recorded." />
        </Section>

        <Section n={10} title="Clinical Impression & Problem List">
          <Field label="Clinical Summary / Movement Diagnosis" value={d.clinicalSummary} />
          <Field label="Key Impairments" value={d.keyImpairments} />
          <Field label="Activity Limitations" value={d.activityLimitations} />
          <Field label="Participation Restrictions" value={d.participationRestrictions} />
          <Field label="Prognostic / Contextual Factors" value={d.prognosticFactors} />
          <Field label="Patient / Caregiver Priorities" value={d.caregiverPriorities} />
        </Section>

        <Section n={11} title="Goals & Plan of Care">
          <Table cols={GOALS} rows={d.goalRows} emptyText="No goals recorded." />
          <View style={{ height: 4 }} />
          <Field label="Planned Interventions / Exercise Programme" value={d.plannedInterventions} />
          <Field label="Frequency & Expected Review Date" value={d.frequencyReview} />
          <Field label="Home Programme / Caregiver Education" value={d.homeProgramme} />
          <Field label="Referral / Further Review Required" value={d.referralFurther} />
          <Text style={styles.note}>
            Goals should be measurable, patient-centred and time-bound. Document clinical reasoning and obtain consent before assessment or treatment.
          </Text>
        </Section>

        {legacy.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <View style={styles.sectionHead} minPresenceAhead={60}>
              <Text style={styles.sectionTitle}>ADDITIONAL FINDINGS (RECORDED IN THE PREVIOUS FORM FORMAT)</Text>
            </View>
            {legacy.map(([k, label]) => (
              <Field key={k} label={label} value={d[k]} />
            ))}
          </View>
        )}

        {/* ---------------- group: progress, reassessment, authentication ---------------- */}
        <View break style={styles.band}>
          <Text style={styles.bandText}>PROGRESS, REASSESSMENT &amp; AUTHENTICATION</Text>
        </View>

        <Section n={12} title="Follow-up / Session Progress Notes">
          <Table cols={PROGRESS} rows={d.progressRows} emptyText="No progress notes recorded." />
        </Section>

        <Section n={13} title="Reassessment Summary">
          <Field label="Change from Baseline" value={d.changeFromBaseline} />
          <Field label="Goals Achieved / Partially Achieved / Not Achieved" value={d.goalsStatus} />
          <Field label="Updated Problem List / Goals" value={d.updatedProblemList} />
          <Field label="Plan Modification / Reason" value={d.planModification} />
        </Section>

        <Section n={14} title="Consent & Patient Information">
          <Text style={styles.consent}>
            The assessment and proposed examination procedures were explained in a language I understand. I had the opportunity to ask questions. I understand that findings and treatment response may vary, and I may ask for clarification or withdraw consent where appropriate.
          </Text>
          <Grid>
            <Field half label="Patient / Legal Representative Name" value={d.consentName} />
            <Field half label="Relationship (if applicable)" value={d.consentRelationship} />
            <Field half label="Consent (Yes / No) & Date" value={consentLine} />
            <Field half label="Patient / Representative Signature" value={d.patientSignature} />
          </Grid>
        </Section>

        <Section n={15} title="Clinician Authentication">
          <Grid>
            <Field half label="Treating Physiotherapist Name" value={d.physiotherapistName} />
            <Field half label="Qualification / Registration No." value={d.qualification} />
            <Field half label="Signature" value={d.physiotherapistSignature} />
            <Field half label="Date & Time" value={fmtDateTime(d.datePhysiotherapist)} />
          </Grid>
          <Text style={styles.note}>
            Confidentiality: This is a confidential clinical record. Store securely and share only with appropriate authorization or as otherwise permitted/required by law.
          </Text>
          <Text style={styles.note}>
            Clinical use note: This is a general template, not a substitute for professional judgement, diagnosis-specific protocols, local legal requirements or the official instructions for standardized assessment tools.
          </Text>
        </Section>
      </Page>
    </Document>
  );
};

export default NeuroAssessmentPdf;
