import React from "react";
import { Facebook, Twitter, Instagram, GitHub } from "react-feather";

const Footer = () => {
  return (
    <footer className=" text-white py-6  bg-[#2A265F]">
      <div className="container mx-auto text-center">
        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mb-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-500 transition duration-300"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 transition duration-300"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-pink-500 transition duration-300"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition duration-300"
          >
            <GitHub size={24} />
          </a>
        </div>

        {/* Footer Text */}
        <p className="text-sm">
          © {new Date().getFullYear()} TaskManager. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
