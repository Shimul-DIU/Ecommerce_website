import React, { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";

export default function Topbar() {
  const [profile, setProfile] = useState({ name: "User" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/user/profile");
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#14213D]">
            Welcome back, loading...
          </h1>
          <p className="text-sm text-[#7A7266]">Here's what's happening with your account</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D8C9A3] bg-[#FBF8F0]">
            <Search size={15} color="#7A7266" />
            <input
              placeholder="Search orders..."
              className="bg-transparent outline-none text-sm w-[140px]"
            />
          </div>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center relative border border-[#D8C9A3] bg-[#FBF8F0] text-[#14213D]">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center bg-[#B23A48]">
              2
            </span>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-[#14213D]">
            U
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-[#14213D]">
          Welcome back, {profile?.name ? profile.name.split(" ")[0] : "there"}
        </h1>
        <p className="text-sm text-[#7A7266]">Here's what's happening with your account</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D8C9A3] bg-[#FBF8F0]">
          <Search size={15} color="#7A7266" />
          <input
            placeholder="Search orders..."
            className="bg-transparent outline-none text-sm w-[140px]"
          />
        </div>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center relative border border-[#D8C9A3] bg-[#FBF8F0] text-[#14213D]">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center bg-[#B23A48]">
            2
          </span>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-[#14213D]">
          {profile?.name ? profile.name.split(" ").map((n) => n[0]).join("") : "U"}
        </div>
      </div>
    </div>
  );
}