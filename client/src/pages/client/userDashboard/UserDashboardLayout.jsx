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
    // class="sticky top-0  z-40 bg-white border-b sm:border-b-0 sm:border-r border-slate-200 transition-all duration-300 w-full sm:h-screen sm:w-64 sm:flex sm:flex-col sm:justify-between sm:p-4"
    <div className="flex max-w-7xl mx-auto  flex-col sm:flex-row h-[calc(100vh-87px)] mt-[72px] bg-gray-100 overflow-hidden relative">
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
      <main className="flex-1 min-w-0 md:mt-4 lg:mt-6 overflow-y-auto p-2 md:p-3 lg:p-4">



        {/* Dashboard Pages Render Here */}
        <Outlet context={{ profile, setProfile }} />
      </main>
    </div>
  );
}