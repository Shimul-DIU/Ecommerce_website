import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import Footer from "../components/client/footer/Footer";
import { useState } from "react";

const Userlayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsOpen(true);
  };

  const handleMenuClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <ScrollToTop />

      {/* Mobile Sidebar */}
      <Sidebar
        isOpen={isOpen}
        onClose={handleMenuClose}
      />

      {/* Navbar */}
      <Navbar onMenuClick={handleMenuOpen} />

      {/* Main Content */}
      <main className="w-full min-w-0 overflow-x-hidden pt-24 pb-20 md:pt-32 md:pb-0">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Userlayout;