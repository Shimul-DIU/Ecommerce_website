import React, { useContext, useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import { CountContext } from "../../../context/countContext";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useContext(CountContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get("/api/wishlist");
        setItems(response.data.items);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // context-এর ids দিয়ে ফিল্টার, তাই Remove চাপলেই সাথে সাথে কার্ড চলে যাবে
  const visibleItems = items.filter((w) => wishlist.includes(String(w._id)));

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-slate-900">Your Wishlist</h2>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : visibleItems.length === 0 ? (
        <p className="text-slate-500">Nothing saved yet. Items you love will show up here.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((w) => (
            <div key={w._id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-md bg-slate-100">
                {w.image || w.images?.[0] ? (
                  <img
                    src={w.image || w.images[0]}
                    alt={w.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Heart size={22} className="text-rose-600" />
                )}
              </div>
              <p className="text-sm font-semibold text-slate-900">{w.name}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-slate-900">&#2547;{Number(w.price || 0).toLocaleString()}</p>
                <span
                  className={`text-xs ${w.inStock !== false ? "text-emerald-600" : "text-rose-600"
                    }`}
                >
                  {w.inStock !== false ? "In stock" : "Out of stock"}
                </span>
              </div>
              <button
                onClick={() => toggleWishlist(String(w._id))}
                className="mt-3 flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600"
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