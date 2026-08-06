import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
import Sidebar from "../components/common/Sidebar";
import { useState } from "react";
import Navbar from './../components/common/Navbar';
import Footer from "../components/client/footer/Footer";

const Userlayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsOpen(true);
  };

  const handleMenuClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen">
      <ScrollToTop />

      <Sidebar
        isOpen={isOpen}
        onClose={handleMenuClose}
      />

      <Navbar
        onMenuClick={handleMenuOpen}
      />

      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>

    
      <Footer/>
    </div>
  );
};

export default Userlayout;