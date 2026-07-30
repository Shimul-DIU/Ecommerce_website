import React from "react";

// iconBg/iconColor: pass full tailwind classes, e.g. "bg-indigo-50" / "text-indigo-600"
// (avoid building class names dynamically — Tailwind's purge won't catch them)
export default function StatCard({ label, value, Icon, iconBg = "bg-indigo-50", iconColor = "text-indigo-600" }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
