import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCartShopping,
  faUser,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const FooterNav = ({ className,onMenuClick }) => {

  return (
    <footer
      className={`md:hidden fixed bottom-0  left-0 shadow-2xl shadow-cyan-500 w-full bg-white border-t flex justify-around py-3 ${className || ""}`}
    >

      <button className="flex flex-col items-center text-sm" onClick={onMenuClick}>
        <FontAwesomeIcon icon={faBars} />
        Menu
      </button>


      <Link to="/card" className="flex flex-col items-center text-sm">
        <FontAwesomeIcon icon={faCartShopping} />
        Cart
      </Link>

      <button className="flex flex-col items-center text-sm">
        <FontAwesomeIcon icon={faUser} />
        Profile
      </button>
      <Link to="/" className="flex flex-col items-center text-sm">
        <FontAwesomeIcon icon={faHouse} />
        Home
      </Link>


    </footer>
  );
};

export default FooterNav;