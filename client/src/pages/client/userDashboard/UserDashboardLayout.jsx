import React, { useState, useEffect } from "react";
import UserDashboardNavbar from "../../../components/client/userDashboard/userDashboardNavbar";
import { Bell, Search } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function UserDashboardLayout() {
  const [profile, setProfile] = useState({ name: "User", email: "", phone: "" });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // TODO: api call diye logged-in user er profile fetch koro
  }, []);

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex h-screen bg-gray-100">
      <UserDashboardNavbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      {/* Main Content */}
      <main
        onClick={() => {
          if (isExpanded) setIsExpanded(false);
        }}
        className={`flex-1 min-h-screen min-w-0 overflow-y-auto p-4 md:p-6 lg:p-8 transition-all duration-300
        ${isExpanded ? "blur-sm pointer-events-none lg:blur-0 lg:pointer-events-auto" : ""}`}
      >
        {/* Topbar */}
        <div className="mb-6 md:mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Welcome back, {profile.name.split(" ")[0]}
            </h1>
            <p className="text-[12px] md:text-[13px] text-slate-500">
              Here's what's happening with your account
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <Search size={15} className="text-slate-500" />
              <input
                placeholder="Search orders..."
                className="w-28 md:w-36 bg-transparent text-sm outline-none"
              />
            </div>

            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer">
              <Bell size={16} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] text-white">
                2
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {initials}
            </div>
          </div>
        </div>

        <Outlet context={{ profile, setProfile }} />
      </main>
    </div>
  );
}