import React, { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: api call diye wishlist fetch koro
    // fetch("/api/wishlist")
    //   .then((res) => res.json())
    //   .then((data) => setWishlist(data.items))
    //   .finally(() => setLoading(false));

    setLoading(false); // remove this once the api call above is wired up
  }, []);

  const removeFromWishlist = (id) => {
    // TODO: api call diye wishlist theke item delete koro, tarpor state update koro
    // fetch(`/api/wishlist/${id}`, { method: "DELETE" }).then(() => {
    //   setWishlist((prev) => prev.filter((w) => w.id !== id));
    // });

    setWishlist((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-slate-900">Your Wishlist</h2>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : wishlist.length === 0 ? (
        <p className="text-slate-500">Nothing saved yet. Items you love will show up here.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((w) => (
            <div key={w.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-3 flex h-28 w-full items-center justify-center rounded-md bg-slate-100">
                <Heart size={22} className="text-rose-600" />
              </div>
              <p className="text-sm font-semibold text-slate-900">{w.name}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-slate-900">&#2547;{w.price.toLocaleString()}</p>
                <span className={`text-xs ${w.inStock ? "text-emerald-600" : "text-rose-600"}`}>
                  {w.inStock ? "In stock" : "Out of stock"}
                </span>
              </div>
              <button
                onClick={() => removeFromWishlist(w.id)}
                className="mt-3 flex items-center gap-1 text-xs text-slate-500"
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
