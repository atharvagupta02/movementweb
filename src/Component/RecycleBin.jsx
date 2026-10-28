import { useCallback, useEffect, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL;

const readResponse = async (response) => {
  const body = await response.text();
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(
      `Recycle Bin API returned a non-JSON response (HTTP ${response.status}). Check the Hostinger API URL and deploy the latest backend to Vercel.`,
    );
  }
};

export default function RecycleBin() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/recycle-bin`, { headers: { token: localStorage.getItem("webapptoken") } });
      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.message || "Could not load recycle bin");
      setItems(data.items || []);
      setError("");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const act = async (item, action) => {
    if (action === "delete" && !window.confirm(`Permanently delete ${item.label}? This cannot be undone.`)) return;
    setBusy(item._id);
    try {
      const response = await fetch(`${API}/api/recycle-bin/${item._id}${action === "restore" ? "/restore" : ""}`, {
        method: action === "restore" ? "POST" : "DELETE",
        headers: { token: localStorage.getItem("webapptoken") },
      });
      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.message || "Action failed");
      await load();
    } catch (err) { setError(err.message); }
    finally { setBusy(""); }
  };

  return <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
    <div className="mb-6"><p className="text-sm font-semibold uppercase tracking-wide text-[#0B4BAA]">Owner tools</p><h1 className="mt-1 text-3xl font-bold text-slate-900">Recycle bin</h1><p className="mt-2 text-sm text-slate-600">Deleted records remain here until restored or permanently deleted.</p></div>
    {error && <div role="alert" className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
    {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Loading recycle bin…</div> : items.length === 0 ? !error && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">Recycle bin is empty.</div> : <div className="space-y-3">{items.map((item) => <article key={item._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-slate-900">{item.label}</h2><p className="mt-1 text-sm text-slate-500">{item.recordCount} record(s) · Deleted {new Date(item.createdAt).toLocaleString()}</p></div><div className="flex gap-2"><button disabled={busy === item._id} onClick={() => act(item, "restore")} className="rounded-lg bg-[#0B4BAA] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Restore</button><button disabled={busy === item._id} onClick={() => act(item, "delete")} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-50">Delete forever</button></div></article>)}</div>}
  </main>;
}
