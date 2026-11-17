import { useEffect, useState } from "react";
import UserDashboardNavbar from "../../../components/client/userDashboard/userDashboardNavbar";
import { Outlet } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";

export default function UserDashboardLayout() {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/user/profile", {
          signal: controller.signal,
        });
        const user = response.data.user;
        setProfile({
          id: user.id,
          name: user.fullname,
          email: user.email,
          phone: user.phone || "",
        });
        setProfileError("");
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching profile:", error);
          setProfileError("Could not load your profile.");
        }
      } finally {
        if (!controller.signal.aborted) setProfileLoading(false);
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, []);

  return (
    <div className="relative mx-auto mt-[33px] flex min-h-[calc(100vh-87px)] w-full max-w-none flex-col sm:mt-16 sm:flex-row md:mt-8">
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
      <main className="min-w-0 flex-1 p-2 pb-20 sm:pb-2 md:mt-4 md:p-3 lg:p-4">
        {/* Dashboard Pages Render Here */}
        <Outlet
          context={{
            profile,
            setProfile,
            profileLoading,
            profileError,
          }}
        />
      </main>
    </div>
  );
}