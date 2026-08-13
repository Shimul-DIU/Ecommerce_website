import React, { useState, useEffect } from "react";
import UserDashboardNavbar from "../../../components/client/userDashboard/userDashboardNavbar";
import { Bell, Search } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function UserDashboardLayout() {
  const [profile, setProfile] = useState({ name: "User", email: "", phone: "" });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // TODO: API call দিয়ে লগইন করা ইউজারের প্রোফাইল ফেচ করুন
  }, []);

  // Safe Name & Initials handling
  const displayName = profile?.name || "User";
  const firstName = displayName.split(" ")[0];
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-[calc(100vh-87px)] mt-[87px] bg-gray-100 overflow-hidden relative">
      {/* Sidebar Navigation */}
      <UserDashboardNavbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {/* Mobile Overlay (সাইডবার খোলা থাকলে ব্যাকগ্রাউন্ডে ক্লিক করে বন্ধ করার জন্য) */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 lg:p-8">
        {/* Topbar */}
        <div className="mb-6 md:mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Welcome back, {firstName}
            </h1>
            <p className="text-[12px] md:text-[13px] text-slate-500">
              Here's what's happening with your account
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Input */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <Search size={15} className="text-slate-500" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-28 md:w-36 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
              <Bell size={16} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-semibold text-white">
                2
              </span>
            </div>

            {/* User Avatar Initials */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white shadow-sm">
              {initials}
            </div>
          </div>
        </div>

        {/* Dashboard Pages Render Here */}
        <Outlet context={{ profile, setProfile }} />
      </main>
    </div>
  );
}