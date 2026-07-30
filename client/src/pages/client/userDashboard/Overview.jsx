import React, { useEffect, useState } from "react";
import { Package, Truck, Heart, Star } from "lucide-react";
import StatCard from "./StatCard";
import OrderCard from "./OrderCard";

export default function Overview() {
  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: api call diye overview data fetch koro (recent orders, wishlist count, reward points)
    // Promise.all([
    //   fetch("/api/orders?limit=2").then(r => r.json()),
    //   fetch("/api/wishlist/count").then(r => r.json()),
    //   fetch("/api/rewards").then(r => r.json()),
    // ]).then(([orderData, wishlistData, rewardData]) => {
    //   setOrders(orderData.orders);
    //   setWishlistCount(wishlistData.count);
    //   setRewardPoints(rewardData.points);
    //   setLoading(false);
    // });

    setLoading(false); // remove this once the api call above is wired up
  }, []);

  const inTransitCount = orders.filter((o) => o.status === "In Transit").length;

  if (loading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={orders.length}
          Icon={Package}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <StatCard
          label="In Transit"
          value={inTransitCount}
          Icon={Truck}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Wishlist Items"
          value={wishlistCount}
          Icon={Heart}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
        />
        <StatCard
          label="Reward Points"
          value={rewardPoints.toLocaleString()}
          Icon={Star}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </div>

      <h2 className="mb-4 text-lg font-bold text-slate-900">Recent Orders</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-slate-500">No recent orders yet.</p>
      ) : (
        orders.slice(0, 2).map((o) => <OrderCard key={o.id} order={o} />)
      )}
    </>
  );
}
