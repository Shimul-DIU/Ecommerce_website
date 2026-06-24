import { Outlet } from "react-router-dom";
import Navbar from "../components/comon/Navbar";
import Footer from "../components/comon/Footer";
import FooterNav from './../components/comon/FooterNav';
import ScrollToTop from './../components/comon/ScrollToTop';
import Sidebar from "../components/comon/Sidebar";
import { useState } from "react";



const Userlayout = () => {
   const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="min-h-screen  ">
            < ScrollToTop/>
              <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)}></Sidebar>
              <Navbar></Navbar>
             <FooterNav  onMenuClick={()=>setIsOpen(true)}></FooterNav>

      {/* Main Content */}
      <main className=" ">
            <Outlet />
        </main>




      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Userlayout;