import { Outlet } from "react-router-dom";
import Navbar from "../components/comon/Navbar";
import Footer from "../components/comon/Footer";

const Root = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-2">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Root;