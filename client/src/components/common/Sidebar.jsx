import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isOpen, onClose }) => {
  const [menOpen, setMenOpen] = useState(false);
  const [womenOpen, setWomenOpen] = useState(false);
  const [jewelryOpen, setJewelryOpen] = useState(false);
  const [perfumeOpen, setPerfumeOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-[87px] rounded-md left-4 h-screen w-72 bg-white shadow-xl z-50
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">Categories</h2>

          <button
            onClick={onClose}
            className="text-xl hover:text-red-500"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Menu */}
        <ul className="flex-1 overflow-y-auto py-2">

          {/* Home */}
          <li>
            <Link
              to="/"
              className="block px-5 py-3 hover:bg-gray-100"
            >
              Home
            </Link>
          </li>

          {/* Products */}
          <li>
            <Link
              to="/products"
              className="block px-5 py-3 hover:bg-gray-100"
            >
              Products
            </Link>
          </li>

          {/* Men's */}
          <li>
            <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-100">
              <span>Men's</span>

              <button onClick={() => setMenOpen(!menOpen)}>
                <FontAwesomeIcon
                  icon={menOpen ? faMinus : faPlus}
                />
              </button>
            </div>

            {menOpen && (
              <ul className="bg-gray-50">
                <li>
                  <Link
                    to="/men/shirt"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Shirt
                  </Link>
                </li>

                <li>
                  <Link
                    to="/men/shorts-jeans"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Shorts & Jeans
                  </Link>
                </li>

                <li>
                  <Link
                    to="/men/safety-shoes"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Safety Shoes
                  </Link>
                </li>

                <li>
                  <Link
                    to="/men/wallet"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Wallet
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Women's */}
          <li>
            <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-100">
              <span>Women's</span>

              <button onClick={() => setWomenOpen(!womenOpen)}>
                <FontAwesomeIcon
                  icon={womenOpen ? faMinus : faPlus}
                />
              </button>
            </div>

            {womenOpen && (
              <ul className="bg-gray-50">
                <li>
                  <Link
                    to="/women/dress-frock"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Dress & Frock
                  </Link>
                </li>

                <li>
                  <Link
                    to="/women/earrings"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Earrings
                  </Link>
                </li>

                <li>
                  <Link
                    to="/women/necklace"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Necklace
                  </Link>
                </li>

                <li>
                  <Link
                    to="/women/makeup-kit"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Makeup Kit
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Jewellery */}
          <li>
            <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-100">
              <span>Jewellery</span>

              <button onClick={() => setJewelryOpen(!jewelryOpen)}>
                <FontAwesomeIcon
                  icon={jewelryOpen ? faMinus : faPlus}
                />
              </button>
            </div>

            {jewelryOpen && (
              <ul className="bg-gray-50 ease-linear duration-500">
                <li>
                  <Link
                    to="/jewellery/earrings"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Earrings
                  </Link>
                </li>

                <li>
                  <Link
                    to="/jewellery/couple-rings"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Couple Rings
                  </Link>
                </li>

                <li>
                  <Link
                    to="/jewellery/necklace"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Necklace
                  </Link>
                </li>

                <li>
                  <Link
                    to="/jewellery/bracelets"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Bracelets
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Perfume */}
          <li>
            <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-100">
              <span>Perfume</span>

              <button onClick={() => setPerfumeOpen(!perfumeOpen)}>
                <FontAwesomeIcon
                  icon={perfumeOpen ? faMinus : faPlus}
                />
              </button>
            </div>

            {perfumeOpen && (
              <ul className="bg-gray-50">
                <li>
                  <Link
                    to="/perfume/clothes-perfume"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Clothes Perfume
                  </Link>
                </li>

                <li>
                  <Link
                    to="/perfume/deodorant"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Deodorant
                  </Link>
                </li>

                <li>
                  <Link
                    to="/perfume/flower-fragrance"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Flower Fragrance
                  </Link>
                </li>

                <li>
                  <Link
                    to="/perfume/air-freshener"
                    className="block px-10 py-2 hover:bg-gray-200"
                  >
                    Air Freshener
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Profile */}
          <li>
            <Link
              to="/profile"
              className="block px-5 py-3 hover:bg-gray-100"
            >
              Profile
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;