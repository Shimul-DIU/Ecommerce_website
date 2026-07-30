import React, { useState } from "react";
import { Package, Truck, Clock, CheckCircle2, ChevronRight } from "lucide-react";

const STATUS_STYLES = {
  Delivered: { classes: "bg-emerald-50 text-emerald-600", Icon: CheckCircle2 },
  "In Transit": { classes: "bg-amber-50 text-amber-600", Icon: Truck },
  Processing: { classes: "bg-slate-100 text-slate-600", Icon: Clock },
};

function Barcode({ seed = 1 }) {
  const bars = Array.from({ length: 24 }, (_, i) => ((i * 37 + seed * 13) % 5) + 1);
  return (
    <div className="flex items-end gap-[2px] h-7">
      {bars.map((w, i) => (
        <div
          key={i}
          className="bg-slate-800/70"
          style={{ width: w % 2 === 0 ? 2 : 1, height: 10 + w * 3 }}
        />
      ))}
    </div>
  );
}

// order shape: { id, date, items: string[], total, status, tracking }
export default function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const { classes, Icon } = STATUS_STYLES[order.status] || STATUS_STYLES.Processing;

  return (
    <div className="mb-4 rounded-lg border border-dashed border-slate-300 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
        <div className="flex items-start gap-4">
          <Package size={28} strokeWidth={1.5} className="text-slate-900" />
          <div>
            <p className="text-sm text-slate-900">{order.id}</p>
            <p className="text-[13px] text-slate-500">{order.date}</p>
            <p className="mt-1 text-sm text-slate-700">{order.items.join(", ")}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${classes}`}>
            <Icon size={14} />
            <span className="text-xs font-semibold">{order.status}</span>
          </div>
          <p className="font-bold text-slate-900">&#2547;{order.total.toLocaleString()}</p>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-sm text-slate-700"
          >
            Details
            <ChevronRight
              size={16}
              style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-300 px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">Tracking Number</p>
            <p className="text-[15px] text-slate-900">{order.tracking}</p>
          </div>
          <Barcode seed={order.id.length} />
        </div>
      )}
    </div>
  );
}
