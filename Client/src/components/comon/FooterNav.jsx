import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCartShopping,
  faUser,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const FooterNav = ({ className }) => {
  return (
    <footer
      className={`fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-3 ${className || ""}`}
    >
      <Link to="/" className="flex flex-col items-center text-sm">
        <FontAwesomeIcon icon={faHouse} />
        Home
      </Link>

      <Link to="/card" className="flex flex-col items-center text-sm">
        <FontAwesomeIcon icon={faCartShopping} />
        Cart
      </Link>

      <button className="flex flex-col items-center text-sm">
        <FontAwesomeIcon icon={faUser} />
        Profile
      </button>

      <button className="flex flex-col items-center text-sm">
        <FontAwesomeIcon icon={faBars} />
        Menu
      </button>
    </footer>
  );
};

export default FooterNav;