import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: api call diye saved addresses fetch koro
    // fetch("/api/addresses")
    //   .then((res) => res.json())
    //   .then((data) => setAddresses(data.addresses))
    //   .finally(() => setLoading(false));

    setLoading(false); // remove this once the api call above is wired up
  }, []);

  const removeAddress = (id) => {
    // TODO: api call diye address delete koro, tarpor state update koro
    // fetch(`/api/addresses/${id}`, { method: "DELETE" }).then(() => {
    //   setAddresses((prev) => prev.filter((a) => a.id !== id));
    // });

    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddNew = () => {
    // TODO: address add korar form/modal khulo, submit hole api call kore notun address save koro
  };

  const handleEdit = (id) => {
    // TODO: address edit korar form/modal khulo, submit hole api call kore update koro
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Saved Addresses</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
        >
          <Plus size={15} /> Add new
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : addresses.length === 0 ? (
        <p className="text-sm text-slate-500">No addresses saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="relative rounded-lg border border-slate-200 bg-white p-4">
              {a.isDefault && (
                <span className="absolute right-4 top-4 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600">
                  Default
                </span>
              )}
              <p className="font-semibold text-slate-900">{a.label}</p>
              <p className="mt-1 text-[13px] text-slate-700">
                {a.line}, {a.city}
              </p>
              <p className="text-[13px] text-slate-500">{a.phone}</p>
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => handleEdit(a.id)}
                  className="flex items-center gap-1 text-xs text-slate-700"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => removeAddress(a.id)}
                  className="flex items-center gap-1 text-xs text-rose-600"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
