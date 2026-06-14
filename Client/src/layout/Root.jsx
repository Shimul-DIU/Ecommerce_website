import { Outlet } from "react-router-dom";
import Navbar from "../components/comon/Navbar";
import Footer from "../components/comon/Footer";


const Root = () => {
  return (
    <div className="min-h-screen  ">

     <Navbar></Navbar>

      {/* Main Content */}
      <main className=" ">

           <Outlet />


      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Root;