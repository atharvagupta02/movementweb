import React, { useEffect, useMemo, useState } from "react";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import PdfAttendanceContent from "../pdf/PdfAttendanceContent";

/*
  Attendance section (view only).
  - Month calendar: every day shows Present, Absent or no record.
  - Summary numbers, and a list view of the same month.
  - Download PDF and Share on WhatsApp both follow the month shown.
  Adding attendance was removed from this component on purpose.
  Theme tokens match the dashboard: navy #0f2557 / #2150a8, teal #4fbfc7, ink #0f1b3d.
*/

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
  calendar:
    "M8 2v4M16 2v4M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zM9 15l2 2 4-4",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  share: "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13",
  close: "M6 18L18 6M6 6l12 12",
  copy: "M9 9h10a2 2 0 012 2v10a2 2 0 01-2 2H9a2 2 0 01-2-2V11a2 2 0 012-2zM5 15H4a2 2 0 01-2-2V3a2 2 0 012-2h10a2 2 0 012 2v1",
  user: "M12 8a3 3 0 100-6 3 3 0 000 6zM5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2",
  users:
    "M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 11a4 4 0 100-8 4 4 0 000 8zM21 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M9 13h6M9 17h6",
  alert: "M12 8v4M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  check: "M20 6L9 17l-5-5",
  left: "M15 18l-6-6 6-6",
  right: "M9 18l6-6-6-6",
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const pad = (n) => String(n).padStart(2, "0");

// "YYYY-MM-DD" for a stored date. ISO strings are cut as they are, so the
// calendar shows the same day that is saved, whatever the time zone.
const dayKey = (d) => {
  if (!d) return "";
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
  const x = new Date(d);
  return isNaN(x) ? "" : `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
};

const dateFromKey = (key) => new Date(`${key}T00:00:00`);
const monthKeyOf = (key) => key.slice(0, 7);

const monthLabel = (key) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};

const shortDay = (key) =>
  dateFromKey(key).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const todayKeyNow = () => dayKey(new Date());

const AttendanceSection = ({ attendance, personalDetails }) => {
  const todayKey = todayKeyNow();

  const [view, setView] = useState(() => {
    const [y, m] = todayKey.split("-").map(Number);
    return { y, m: m - 1 };
  });
  const [mode, setMode] = useState("calendar"); // "calendar" | "list"
  const [shareOpen, setShareOpen] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const records = attendance || [];
  const name = personalDetails?.fullName || personalDetails?.name || "Employee";

  const viewKey = `${view.y}-${pad(view.m + 1)}`;
  const isCurrentMonth = viewKey >= monthKeyOf(todayKey);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (text, type = "success") => setToast({ text, type });

  /* ---------- month data ---------- */
  const monthOptions = useMemo(() => {
    const keys = new Set(records.map((a) => monthKeyOf(dayKey(a.date))).filter(Boolean));
    return [...keys].sort().reverse();
  }, [records]);

  // Records of the month on screen, one per day (the last one wins), by day
  const byDay = useMemo(() => {
    const map = {};
    records.forEach((a) => {
      const k = dayKey(a.date);
      if (k && monthKeyOf(k) === viewKey) map[k] = a;
    });
    return map;
  }, [records, viewKey]);

  const filtered = useMemo(
    () => Object.keys(byDay).sort().map((k) => byDay[k]),
    [byDay],
  );

  const stats = useMemo(() => {
    const present = filtered.filter((a) => a.status === "Present").length;
    const absent = filtered.filter((a) => a.status === "Absent").length;
    const total = present + absent;
    return { present, absent, total, rate: total ? Math.round((present / total) * 100) : 0 };
  }, [filtered]);

  const absentDays = useMemo(
    () => Object.keys(byDay).sort().filter((k) => byDay[k].status === "Absent"),
    [byDay],
  );

  /* ---------- calendar cells ---------- */
  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const offset = (first.getDay() + 6) % 7; // Monday first
    const days = new Date(view.y, view.m + 1, 0).getDate();
    return [
      ...Array(offset).fill(null),
      ...Array.from({ length: days }, (_, i) => i + 1),
    ];
  }, [view]);

  const shiftMonth = (delta) =>
    setView(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const goToKey = (key) => {
    if (!key) return;
    const [y, m] = key.split("-").map(Number);
    setView({ y, m: m - 1 });
  };

  const goToToday = () => goToKey(monthKeyOf(todayKey));

  const periodLabel = monthLabel(viewKey);

  /* ---------- WhatsApp ---------- */
  const digits = String(personalDetails?.contactNumber || "").replace(/\D/g, "");
  const phone = digits.length === 10 ? `91${digits}` : digits.length > 10 ? digits : "";

  const message = useMemo(() => {
    const shown = absentDays.slice(0, 15).map(shortDay);
    const lines = [
      "*Movement Rehab*",
      `Attendance report: ${name}`,
      `Period: ${periodLabel}`,
      "",
      `Present: ${stats.present} ${stats.present === 1 ? "day" : "days"}`,
      `Absent: ${stats.absent} ${stats.absent === 1 ? "day" : "days"}`,
      `Attendance: ${stats.rate}% (of ${stats.total} recorded ${stats.total === 1 ? "day" : "days"})`,
    ];
    if (shown.length) {
      lines.push(
        "",
        `Absent on: ${shown.join(", ")}${
          absentDays.length > shown.length ? ` and ${absentDays.length - shown.length} more` : ""
        }`,
      );
    }
    lines.push("", "Thank you.");
    return lines.join("\n");
  }, [absentDays, stats, periodLabel, name]);

  const waLink = (to) => `https://wa.me/${to ? to : ""}?text=${encodeURIComponent(message)}`;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      showToast("Message copied");
    } catch {
      showToast("Could not copy the message", "error");
    }
  };

  const fileName = `Attendance-${name.replace(/\s+/g, "_")}-${viewKey}.pdf`;

  // On phones this opens the share menu with the PDF attached (choose WhatsApp).
  // On a computer it downloads the PDF so it can be attached in WhatsApp.
  const sharePdf = async () => {
    setPdfBusy(true);
    try {
      const blob = await pdf(
        <PdfAttendanceContent attendance={filtered} patient={personalDetails} />,
      ).toBlob();
      const file = new File([blob], fileName, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Attendance report", text: message });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        showToast("PDF downloaded. Attach it in the WhatsApp chat.");
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("Share PDF failed:", err);
        showToast("Could not prepare the PDF. Please try again.", "error");
      }
    } finally {
      setPdfBusy(false);
    }
  };

  useEffect(() => {
    if (!shareOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setShareOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shareOpen]);

  const controlClass =
    "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-[#0f1b3d] transition focus:border-[#4fbfc7] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4fbfc7]/20";
  const navBtn =
    "grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#2150a8] hover:text-[#2150a8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600";

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,37,87,0.04)]">
      <div className="h-1 bg-gradient-to-r from-[#4fbfc7] via-[#2150a8] to-[#0f2557]" />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#1b3f8f] to-[#2a62b8] text-white shadow-md shadow-[#2150a8]/25">
              <Icon d={ICONS.calendar} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#0f1b3d]">Attendance</h2>
              <p className="text-sm text-slate-500">Month-wise attendance record</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <PDFDownloadLink
              document={<PdfAttendanceContent attendance={filtered} patient={personalDetails} />}
              fileName={fileName}
            >
              {({ loading: pdfLoading }) => (
                <span className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#2150a8] hover:text-[#2150a8]">
                  <Icon d={ICONS.download} className="h-4 w-4" />
                  {pdfLoading ? "Generating PDF..." : "Download PDF"}
                </span>
              )}
            </PDFDownloadLink>
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              disabled={filtered.length === 0}
              title={filtered.length === 0 ? "No attendance in this month to share" : undefined}
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#25D366]/30 transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon d={ICONS.share} className="h-4 w-4" /> Share on WhatsApp
            </button>
          </div>
        </div>

        {/* Month controls + view switch */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month" className={navBtn}>
              <Icon d={ICONS.left} className="h-4 w-4" />
            </button>
            <h3 className="min-w-[10.5rem] text-center text-lg font-bold text-[#0f1b3d]" aria-live="polite">
              {periodLabel}
            </h3>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={isCurrentMonth}
              aria-label="Next month"
              className={navBtn}
            >
              <Icon d={ICONS.right} className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goToToday}
              disabled={isCurrentMonth}
              className="ml-1 rounded-lg px-3 py-2 text-sm font-semibold text-[#2150a8] transition hover:bg-[#2150a8]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7] disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
            >
              Today
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {monthOptions.length > 0 && (
              <>
                <label htmlFor="att-jump" className="sr-only">
                  Jump to a month with records
                </label>
                <select
                  id="att-jump"
                  value=""
                  onChange={(e) => goToKey(e.target.value)}
                  className={controlClass}
                >
                  <option value="">Jump to month</option>
                  {monthOptions.map((k) => (
                    <option key={k} value={k}>
                      {monthLabel(k)}
                    </option>
                  ))}
                </select>
              </>
            )}
            <div className="inline-flex gap-1 rounded-xl bg-slate-100 p-1" role="group" aria-label="View">
              {[
                { value: "calendar", label: "Calendar", icon: ICONS.grid },
                { value: "list", label: "List", icon: ICONS.list },
              ].map((o) => {
                const on = mode === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setMode(o.value)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7] ${
                      on ? "bg-white text-[#2150a8] shadow-sm" : "text-slate-600 hover:text-[#2150a8]"
                    }`}
                  >
                    <Icon d={o.icon} className="h-4 w-4" />
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Numbers for the month on screen */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: "Present", value: stats.present, tone: "text-emerald-600" },
            { label: "Absent", value: stats.absent, tone: "text-rose-600" },
            { label: "Attendance", value: stats.total ? `${stats.rate}%` : "-", tone: "text-[#2150a8]" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center">
              <p className={`text-2xl font-extrabold leading-none ${s.tone}`}>{s.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Calendar or list */}
        <div className="mt-5">
          {mode === "calendar" ? (
            <>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-7 bg-slate-50 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="py-2.5">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-px bg-slate-200">
                  {cells.map((day, i) => {
                    if (day === null) return <div key={`b-${i}`} className="bg-slate-50/60" />;

                    const key = `${viewKey}-${pad(day)}`;
                    const rec = byDay[key];
                    const isToday = key === todayKey;
                    const future = key > todayKey;
                    const present = rec?.status === "Present";
                    const absent = rec?.status === "Absent";
                    const label = `${dateFromKey(key).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}, ${rec ? rec.status : future ? "upcoming" : "no record"}`;

                    return (
                      <div
                        key={key}
                        role="img"
                        aria-label={label}
                        className={`flex aspect-square flex-col justify-between p-1.5 sm:aspect-auto sm:h-[84px] sm:p-2 ${
                          present
                            ? "bg-emerald-50"
                            : absent
                              ? "bg-rose-50"
                              : future
                                ? "bg-white text-slate-300"
                                : "bg-white"
                        }`}
                      >
                        <span
                          className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold sm:text-sm ${
                            isToday
                              ? "bg-[#2150a8] text-white"
                              : present
                                ? "text-emerald-800"
                                : absent
                                  ? "text-rose-800"
                                  : future
                                    ? "text-slate-300"
                                    : "text-slate-600"
                          }`}
                        >
                          {day}
                        </span>
                        {rec && (
                          <span
                            className={`flex items-center gap-1 text-[11px] font-semibold ${
                              present ? "text-emerald-700" : "text-rose-700"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${present ? "bg-emerald-500" : "bg-rose-500"}`}
                            />
                            <span className="hidden sm:inline">{rec.status}</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-emerald-200 ring-1 ring-emerald-300" /> Present
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-rose-200 ring-1 ring-rose-300" /> Absent
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-white ring-1 ring-slate-300" /> No record
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-[#2150a8] text-[9px] font-bold text-white">
                    12
                  </span>
                  Today
                </span>
              </div>

              {filtered.length === 0 && (
                <p className="mt-4 text-center text-sm text-slate-500">
                  No attendance has been recorded for {periodLabel}.
                </p>
              )}
            </>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
              <p className="font-semibold text-slate-700">No attendance records</p>
              <p className="mt-0.5 text-sm text-slate-500">Nothing recorded for {periodLabel}.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="max-h-[420px] overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Day</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...filtered].reverse().map((a, i) => {
                      const key = dayKey(a.date);
                      return (
                        <tr key={a._id || i} className="transition hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-[#0f1b3d]">
                            {dateFromKey(key).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {dateFromKey(key).toLocaleDateString("en-IN", { weekday: "long" })}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                a.status === "Present"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  a.status === "Present" ? "bg-emerald-500" : "bg-rose-500"
                                }`}
                              />
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Absent days at a glance */}
        {absentDays.length > 0 && (
          <p className="mt-4 text-sm text-slate-600">
            <span className="font-semibold text-rose-700">Absent on:</span>{" "}
            {absentDays.map(shortDay).join(", ")}
          </p>
        )}
      </div>

      {/* WhatsApp share window */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-[80] overflow-y-auto bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setShareOpen(false)}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Share attendance on WhatsApp"
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
                <div>
                  <h3 className="text-lg font-bold text-[#0f1b3d]">Share on WhatsApp</h3>
                  <p className="text-sm text-slate-500">
                    {name} · {periodLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShareOpen(false)}
                  aria-label="Close"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7]"
                >
                  <Icon d={ICONS.close} />
                </button>
              </div>

              <div className="space-y-4 px-6 py-5">
                {/* message preview */}
                <div className="rounded-2xl bg-[#E7F5EC] p-4">
                  <pre className="whitespace-pre-wrap break-words font-sans text-[13px] leading-relaxed text-[#14302E]">
                    {message}
                  </pre>
                </div>

                <div className="space-y-2.5">
                  {phone ? (
                    <a
                      href={waLink(phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#25D366]/25 transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                    >
                      <Icon d={ICONS.user} className="h-5 w-5" />
                      <span className="flex-1">Send to {name}</span>
                      <span className="text-xs font-medium text-white/80">{digits.slice(-10)}</span>
                    </a>
                  ) : (
                    <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-[13px] font-medium text-amber-800 ring-1 ring-amber-200">
                      No contact number saved for {name}. You can still choose a contact below.
                    </p>
                  )}

                  <a
                    href={waLink("")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-[#25D366] px-4 py-3 text-sm font-semibold text-[#128C7E] transition hover:bg-[#25D366]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                  >
                    <Icon d={ICONS.users} className="h-5 w-5" />
                    <span className="flex-1">Choose a contact or group</span>
                  </a>

                  <button
                    type="button"
                    onClick={sharePdf}
                    disabled={pdfBusy}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-[#2150a8] hover:text-[#2150a8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7] disabled:opacity-60"
                  >
                    <Icon d={ICONS.file} className="h-5 w-5" />
                    <span className="flex-1">{pdfBusy ? "Preparing PDF..." : "Share the PDF file"}</span>
                  </button>
                  <p className="px-1 text-xs text-slate-400">
                    On a phone the PDF opens the share menu, where you pick WhatsApp. On a computer it
                    downloads, then you attach it in the chat.
                  </p>

                  <button
                    type="button"
                    onClick={copyMessage}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fbfc7]"
                  >
                    <Icon d={ICONS.copy} className="h-5 w-5" />
                    <span className="flex-1">Copy the message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${
            toast.type === "error" ? "bg-rose-600" : "bg-[#0f2557]"
          }`}
        >
          <Icon d={toast.type === "error" ? ICONS.alert : ICONS.check} className="h-5 w-5" />
          {toast.text}
        </div>
      )}
    </section>
  );
};

export default AttendanceSection;
