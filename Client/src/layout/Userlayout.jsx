import { Outlet } from "react-router-dom";
import Navbar from "../components/comon/Navbar";
import Footer from "../components/comon/Footer";
import FooterNav from './../components/comon/FooterNav';



const Userlayout = () => {
  return (
    <div className="min-h-screen  ">


              <Navbar></Navbar>
             <FooterNav ></FooterNav>

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