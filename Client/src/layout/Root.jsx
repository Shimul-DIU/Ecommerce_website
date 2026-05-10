import { Outlet } from "react-router-dom";
import Navbar from "../components/comon/Navbar";
import Footer from "../components/comon/Footer";

const Root = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default Root;