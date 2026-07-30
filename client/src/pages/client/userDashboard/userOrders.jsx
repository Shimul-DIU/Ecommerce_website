import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: api call diye full order history fetch koro
    // fetch("/api/orders")
    //   .then((res) => res.json())
    //   .then((data) => setOrders(data.orders))
    //   .finally(() => setLoading(false));

    setLoading(false); // remove this once the api call above is wired up
  }, []);

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-slate-900">Order History</h2>
      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-slate-500">You haven't placed any orders yet.</p>
      ) : (
        orders.map((o) => <OrderCard key={o.id} order={o} />)
      )}
    </>
  );
}
