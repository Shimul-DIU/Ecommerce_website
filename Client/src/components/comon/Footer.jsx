import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            ShimulShop
          </h2>

          <p className="text-sm leading-6">
            Your trusted ecommerce destination for quality products,
            affordable prices, and fast delivery.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-5 text-lg">
            <a
              href=""
              className="hover:text-blue-500 transition duration-300"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              className="hover:text-pink-500 transition duration-300"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              className="hover:text-sky-400 transition duration-300"
            >
              <FaTwitter />
            </a>

            <a
              href="#"
              className="hover:text-red-500 transition duration-300"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                className="hover:text-white transition duration-300"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/shop"
                className="hover:text-white transition duration-300"
              >
                Shop
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="hover:text-white transition duration-300"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="hover:text-white transition duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Customer Service
          </h3>

          <ul className="space-y-3">
            <li className="hover:text-white cursor-pointer">
              FAQ
            </li>

            <li className="hover:text-white cursor-pointer">
              Shipping Policy
            </li>

            <li className="hover:text-white cursor-pointer">
              Return Policy
            </li>

            <li className="hover:text-white cursor-pointer">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Newsletter
          </h3>

          <p className="text-sm mb-4">
            Subscribe to get updates on new arrivals and offers.
          </p>

          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
            />

            <button
              className="bg-blue-600 hover:bg-blue-700 transition duration-300 py-3 rounded-lg text-white font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-sm text-center md:text-left">
            © 2026 ShimulShop. All rights reserved.
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-4 text-3xl">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;