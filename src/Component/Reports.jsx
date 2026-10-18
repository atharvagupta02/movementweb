

import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

/*
  Reports hub (revamped).
  Same routes as before: /Reports/bill, /expenses, /inventory, /rent, /salary, /total, /daily-attendance
  Child pages still render through <Outlet />.
  The old header (logo, date, AD avatar) and footer bar are removed because the
  sidebar and top bar already show them.
*/

const Icon = ({ d, className = "h-5 w-5" }) => (
  <svg className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
);

const categories = [
  { name: "Bill", path: "bill", description: "Patient billing and invoices", icon: "M4 2v20l3-2 3 2 3-2 3 2 3-2V2l-3 2-3-2-3 2-3-2-3 2zM8 8h8M8 12h8M8 16h5" },
  { name: "Expenses", path: "expenses", description: "Operational spending", icon: "M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zM1 10h22" },
  { name: "Inventory", path: "inventory", description: "Medicines and supplies", icon: "M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8" },
  { name: "Rent", path: "rent", description: "Premises and equipment rent", icon: "M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6" },
  { name: "Salary", path: "salary", description: "Staff payroll", icon: "M2 7h20v10H2zM12 14a2 2 0 100-4 2 2 0 000 4zM6 12h.01M18 12h.01" },
  { name: "Total", path: "total", description: "Combined financial summary", icon: "M3 3v18h18M7 14v3M12 9v8M17 5v12" },
  { name: "Daily Attendance", path: "daily-attendance", description: "Staff attendance for the day", icon: "M8 2v4M16 2v4M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zM9 15l2 2 4-4" },
];

const ARROW = "M5 12h14M13 6l6 6-6 6";
const LOCK = "M5 11h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1zM8 11V7a4 4 0 118 0v4";
const CHART = "M3 3v18h18M7 15l4-4 3 3 5-6";

const Reports = () => {
  const { pathname } = useLocation();

  // Find the selected report from the URL segments, e.g. /Reports/bill -> "bill"
  const segments = pathname.toLowerCase().split("/").filter(Boolean);
  const active = categories.find((cat) => segments.includes(cat.path)) || null;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
      {/* Page header */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="h-1 bg-gradient-to-r from-[#00C2CB] via-[#0B4BAA] to-[#082F6B]" />

        <div className="flex items-start gap-4 px-5 pt-5 sm:px-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0B4BAA] to-[#082F6B] text-white shadow-md shadow-[#0B4BAA]/30">
            <Icon d={active ? active.icon : CHART} className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center text-xs font-medium text-slate-400">
              <Link to="/" className="hover:text-[#0B4BAA]">Dashboard</Link>
              <span className="mx-1.5 text-slate-300">/</span>
              {active ? (
                <>
                  <Link to="/Reports" className="hover:text-[#0B4BAA]">Reports</Link>
                  <span className="mx-1.5 text-slate-300">/</span>
                  <span className="text-slate-600">{active.name}</span>
                </>
              ) : (
                <span className="text-slate-600">Reports</span>
              )}
            </nav>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {active ? active.name : "Reports"}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {active ? active.description : "Select a report to view financial and staff records."}
            </p>
          </div>
        </div>

        {/* Report navigation */}
        <nav aria-label="Report categories" className="mt-5 flex gap-1 overflow-x-auto border-t border-slate-100 bg-slate-50/70 px-3 py-2.5 sm:px-4">
          {categories.map((cat) => (
            <NavLink
              key={cat.path}
              to={cat.path}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB] ${
                  isActive
                    ? "bg-[#0B4BAA] text-white shadow-sm shadow-[#0B4BAA]/30"
                    : "text-slate-600 hover:bg-white hover:text-[#0B4BAA] hover:shadow-sm"
                }`
              }
            >
              <Icon d={cat.icon} className="h-[17px] w-[17px]" />
              {cat.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Report picker (shown until a report is selected) */}
      {!active && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2CB]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0B4BAA]/10 text-[#0B4BAA] transition group-hover:bg-[#0B4BAA] group-hover:text-white">
                <Icon d={cat.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-slate-800">{cat.name}</span>
                <span className="mt-0.5 block text-sm text-slate-500">{cat.description}</span>
              </span>
              <Icon d={ARROW} className="mt-1 h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0B4BAA]" />
            </Link>
          ))}
        </div>
      )}

      {/* Child report content */}
      <section className={`rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 ${active ? "min-h-[24rem] p-4 sm:p-6" : ""}`}>
        <Outlet />
      </section>

      <p className="flex items-center justify-center gap-1.5 pb-2 text-xs text-slate-400">
        <Icon d={LOCK} className="h-3.5 w-3.5" />
        Reports are confidential and for authorised staff only.
      </p>
    </div>
  );
};

export default Reports;
