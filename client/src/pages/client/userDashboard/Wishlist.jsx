import React from "react";
import { Heart, Trash2 } from "lucide-react";

// ---- Local design tokens ----
const C = {
  ink: "#14213D",
  kraftDark: "#E1D3AC",
  card: "#FBF8F0",
  stamp: "#B23A48",
  sage: "#4F7A57",
  muted: "#7A7266",
  line: "#D8C9A3",
};

export default function Wishlist({ wishlist = [], removeFromWishlist }) {
  return (
    <>
      <h2 style={{ color: C.ink, fontWeight: 700 }} className="mb-4 text-lg">
        Your Wishlist
      </h2>
      {wishlist.length === 0 ? (
        <p style={{ color: C.muted }}>Nothing saved yet. Items you love will show up here.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((w) => (
            <div key={w.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10 }} className="p-4">
              <div style={{ background: C.kraftDark }} className="w-full h-28 rounded-md mb-3 flex items-center justify-center">
                <Heart size={22} color={C.stamp} />
              </div>
              <p style={{ color: C.ink, fontWeight: 600, fontSize: 14 }}>{w.name}</p>
              <div className="flex items-center justify-between mt-2">
                <p style={{ color: C.ink }}>&#2547;{w.price?.toLocaleString()}</p>
                <span style={{ color: w.inStock ? C.sage : C.stamp, fontSize: 12 }}>
                  {w.inStock ? "In stock" : "Out of stock"}
                </span>
              </div>
              <button
                onClick={() => removeFromWishlist(w.id)}
                style={{ color: C.muted }}
                className="mt-3 text-xs flex items-center gap-1"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
