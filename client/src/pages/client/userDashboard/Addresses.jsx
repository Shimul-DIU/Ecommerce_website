import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

// ---- Local design tokens ----
const C = {
  ink: "#14213D",
  inkLight: "#28365B",
  card: "#FBF8F0",
  stamp: "#B23A48",
  sage: "#4F7A57",
  text: "#231F20",
  muted: "#7A7266",
  line: "#D8C9A3",
};

export default function Addresses({ addresses = [], removeAddress }) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ color: C.ink, fontWeight: 700 }} className="text-lg">
          Saved Addresses
        </h2>
        <button
          style={{ background: C.ink, color: "#fff" }}
          className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg"
        >
          <Plus size={15} /> Add new
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((a) => (
          <div key={a.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-4 relative">
            {a.isDefault && (
              <span style={{ background: `${C.sage}1A`, color: C.sage }} className="absolute top-4 right-4 text-[11px] px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
            <p style={{ color: C.ink, fontWeight: 600 }}>{a.label}</p>
            <p style={{ color: C.text, fontSize: 13, marginTop: 4 }}>
              {a.line}, {a.city}
            </p>
            <p style={{ color: C.muted, fontSize: 13 }}>{a.phone}</p>
            <div className="flex items-center gap-4 mt-3">
              <button style={{ color: C.inkLight }} className="text-xs flex items-center gap-1">
                <Pencil size={12} /> Edit
              </button>
              <button onClick={() => removeAddress(a.id)} style={{ color: C.stamp }} className="text-xs flex items-center gap-1">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}