import React from 'react';
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Overview from "./Overview";
import Wishlist from "./Wishlist";
import Addresses from "./Addresses";
import UserOrders from './userOrders';
import UserProfile from './UserProfile';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-[#EFE6CF]">
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8">
          <Topbar />
          <Overview />
          <UserOrders />
          <Wishlist />
          <Addresses />
          <UserProfile />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;