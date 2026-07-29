import React, { useState } from "react";
import { Package, Truck, Clock, CheckCircle2, ChevronRight } from "lucide-react";

// ---- Local design tokens ----
const C = {
  ink: "#14213D",
  inkLight: "#28365B",
  kraft: "#EFE6CF",
  card: "#FBF8F0",
  sage: "#4F7A57",
  mustard: "#C98A2B",
  text: "#231F20",
  muted: "#7A7266",
  line: "#D8C9A3",
};

const STATUS_STYLES = {
  Delivered: { color: C.sage, Icon: CheckCircle2 },
  "In Transit": { color: C.mustard, Icon: Truck },
  Processing: { color: C.inkLight, Icon: Clock },
};

function Barcode({ seed = 1 }) {
  const bars = Array.from({ length: 24 }, (_, i) => ((i * 37 + seed * 13) % 5) + 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 28 }}>
      {bars.map((w, i) => (
        <div
          key={i}
          style={{ width: w % 2 === 0 ? 2 : 1, height: 10 + w * 3, background: C.ink, opacity: 0.75 }}
        />
      ))}
    </div>
  );
}

function TicketCard({ order }) {
  const [open, setOpen] = useState(false);
  const { color, Icon } = STATUS_STYLES[order.status] || STATUS_STYLES.Processing;

  return (
    <div
      style={{ background: C.card, border: `1.5px dashed ${C.line}`, borderRadius: 10, position: "relative", overflow: "visible" }}
      className="mb-4"
    >
      <div style={{ position: "absolute", top: "50%", left: -10, width: 20, height: 20, borderRadius: "50%", background: C.kraft, transform: "translateY(-50%)" }} />
      <div style={{ position: "absolute", top: "50%", right: -10, width: 20, height: 20, borderRadius: "50%", background: C.kraft, transform: "translateY(-50%)" }} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
        <div className="flex items-start gap-4">
          <div style={{ color: C.ink }}>
            <Package size={28} strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ color: C.ink, fontSize: 14, letterSpacing: 0.5 }}>{order.id}</p>
            <p style={{ color: C.muted, fontSize: 13 }}>{order.date}</p>
            <p style={{ color: C.text, fontSize: 14, marginTop: 4 }}>{order.items?.join(", ")}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: `${color}1A`, color }}>
            <Icon size={14} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{order.status}</span>
          </div>
          <p style={{ color: C.ink, fontWeight: 700 }}>&#2547;{order.total?.toLocaleString()}</p>
          <button onClick={() => setOpen(!open)} style={{ color: C.inkLight }} className="flex items-center gap-1 text-sm">
            Details
            <ChevronRight size={16} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
          </button>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: `1px dashed ${C.line}` }} className="px-5 py-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Tracking Number</p>
            <p style={{ color: C.ink, fontSize: 15 }}>{order.tracking}</p>
          </div>
          <Barcode seed={order.id?.length} />
        </div>
      )}
    </div>
  );
}

export default function UserOrders({ orders = [] }) {
  return (
    <>
      <h2 style={{ color: C.ink, fontWeight: 700 }} className="mb-4 text-lg">
        Order History
      </h2>
      {orders.map((o) => (
        <TicketCard key={o.id} order={o} />
      ))}
    </>
  );
}
