import { useState } from "react";

/*
  Add Enquiry page (revamped).
  Same API call and same fields as before:
  POST {VITE_BACKEND_URL}/api/enquiry/createEnquiry
  { patientName, gender, age, occupation, contactNumber, email }
*/

const EMPTY = {
  patientName: "",
  gender: "",
  age: "",
  occupation: "",
  contactNumber: "",
  email: "",
};

const GENDERS = ["Male", "Female", "Other"];

const validate = (f) => {
  const e = {};
  if (!f.patientName.trim()) e.patientName = "Enter the patient's name";
  if (!f.gender) e.gender = "Select a gender";

  const age = Number(f.age);
  if (f.age === "") e.age = "Enter the age";
  else if (!(age > 0 && age <= 120)) e.age = "Age must be between 1 and 120";

  if (!f.occupation.trim()) e.occupation = "Enter the occupation";

  if (!f.contactNumber) e.contactNumber = "Enter the contact number";
  else if (!/^[0-9]{10}$/.test(f.contactNumber)) e.contactNumber = "Enter a 10-digit mobile number";

  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address";
  return e;
};

const inputClass = (error) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] text-slate-800 placeholder-slate-400 outline-none transition focus:ring-4 ${
    error
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
      : "border-slate-300 hover:border-slate-400 focus:border-[#0B4BAA] focus:ring-[#00C2CB]/20"
  }`;

const Field = ({ label, id, required, error, hint, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 flex items-center gap-1 text-sm font-semibold text-slate-700">
      {label}
      {required && <span className="text-rose-500" aria-hidden="true">*</span>}
    </label>
    {children}
    {error ? (
      <p className="mt-1.5 text-[13px] font-medium text-rose-600" role="alert">
        {error}
      </p>
    ) : (
      hint && <p className="mt-1.5 text-[13px] text-slate-400">{hint}</p>
    )}
  </div>
);

const SectionTitle = ({ children }) => (
  <div className="mb-4 flex items-center gap-3">
    <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#0B4BAA]">{children}</h3>
    <span className="h-px flex-1 bg-slate-200" />
  </div>
);

const EnquiryForm = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { type: "success" | "error", text }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "contactNumber") value = value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const msg = validate(formData)[name];
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const setGender = (g) => {
    setFormData((prev) => ({ ...prev, gender: g }));
    if (errors.gender) setErrors((prev) => ({ ...prev, gender: undefined }));
  };

  const handleClear = () => {
    setFormData(EMPTY);
    setErrors({});
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${backendURL}/api/enquiry/createEnquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          patientName: formData.patientName.trim(),
          occupation: formData.occupation.trim(),
          email: formData.email.trim(),
        }),
      });

      const result = await response.json();

      if (result?.success) {
        setStatus({ type: "success", text: result.message || "Enquiry added successfully." });
        setFormData(EMPTY);
        setErrors({});
      } else {
        setStatus({ type: "error", text: result?.message || "Could not add the enquiry. Please try again." });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", text: "Could not reach the server. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200">
        <div className="h-1.5 bg-gradient-to-r from-[#00C2CB] via-[#0B4BAA] to-[#082F6B]" />

        {/* Header */}
        <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-6 sm:px-8">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0B4BAA] to-[#082F6B] text-white shadow-md shadow-[#0B4BAA]/30">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Add Enquiry</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Enter the patient's details. It is saved as a lead you can follow up from All Enquiry.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-6 py-6 sm:px-8">
          {/* Status banner */}
          {status && (
            <div
              role={status.type === "error" ? "alert" : "status"}
              className={`mb-6 flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                  : "bg-rose-50 text-rose-800 ring-1 ring-rose-200"
              }`}
            >
              <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                {status.type === "success" ? (
                  <path d="M20 6L9 17l-5-5" />
                ) : (
                  <path d="M12 8v4M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <span className="flex-1">{status.text}</span>
              <button
                type="button"
                onClick={() => setStatus(null)}
                aria-label="Dismiss message"
                className="rounded p-0.5 opacity-60 transition hover:opacity-100"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Patient details */}
          <SectionTitle>Patient details</SectionTitle>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Patient Name" id="patientName" required error={errors.patientName}>
              <input
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Full name"
                autoComplete="off"
                className={inputClass(errors.patientName)}
              />
            </Field>

            <Field label="Gender" id="gender" required error={errors.gender}>
              <div
                id="gender"
                role="radiogroup"
                aria-label="Gender"
                className={`grid grid-cols-3 gap-1 rounded-xl border p-1 ${
                  errors.gender ? "border-rose-400 bg-rose-50/40" : "border-slate-300 bg-slate-50"
                }`}
              >
                {GENDERS.map((g) => {
                  const on = formData.gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setGender(g)}
                      className={`rounded-lg py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] ${
                        on
                          ? "bg-[#0B4BAA] text-white shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-[#0B4BAA]"
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Age" id="age" required error={errors.age}>
              <input
                id="age"
                name="age"
                type="number"
                min={0}
                inputMode="numeric"
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Years"
                className={inputClass(errors.age)}
              />
            </Field>

            <Field label="Occupation" id="occupation" required error={errors.occupation}>
              <input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Teacher, Student, Retired"
                autoComplete="off"
                className={inputClass(errors.occupation)}
              />
            </Field>
          </div>

          {/* Contact details */}
          <div className="mt-8">
            <SectionTitle>Contact details</SectionTitle>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Contact Number"
              id="contactNumber"
              required
              error={errors.contactNumber}
              hint="10-digit mobile number"
            >
              <div className="flex">
                <span className="grid place-items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm font-semibold text-slate-500">
                  +91
                </span>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.contactNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="98765 43210"
                  className={`${inputClass(errors.contactNumber)} rounded-l-none`}
                />
              </div>
            </Field>

            <Field label="Email" id="email" error={errors.email} hint="Optional">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="name@example.com"
                autoComplete="off"
                className={inputClass(errors.email)}
              />
            </Field>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse items-stretch gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              <span className="text-rose-500">*</span> Required fields
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] disabled:opacity-50 sm:flex-none"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0B4BAA] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0B4BAA]/30 transition hover:bg-[#093d8c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  "+ Add Enquiry"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryForm;
