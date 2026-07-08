import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-4 
          gap-8
        ">

          {/* Logo */}
          <div>
           <h1 className="text-2xl font-bold">
  Job<span className="text-[#F83002]">Portal</span>
</h1>

            <p className="text-sm text-gray-400 mt-3">
              Find your dream job and build your career with
              the best opportunities.
            </p>
          </div>


          {/* Company */}
          <div>
            <h2 className="font-semibold text-lg mb-3">
              Company
            </h2>

            <ul className="space-y-2 text-sm text-gray-400">
              <li>About Us</li>
              <li>Contact</li>
              <li>Careers</li>
            </ul>
          </div>


          {/* Support */}
          <div>
            <h2 className="font-semibold text-lg mb-3">
              Support
            </h2>

            <ul className="space-y-2 text-sm text-gray-400">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>


          {/* Social */}
          <div>
            <h2 className="font-semibold text-lg mb-3">
              Follow Us
            </h2>

            <div className="flex gap-4">

              <FaFacebook 
                className="text-2xl cursor-pointer hover:text-[#6A38C2]"
              />

              <FaInstagram 
                className="text-2xl cursor-pointer hover:text-[#6A38C2]"
              />

              <FaLinkedin 
                className="text-2xl cursor-pointer hover:text-[#6A38C2]"
              />

              <FaTwitter 
                className="text-2xl cursor-pointer hover:text-[#6A38C2]"
              />

            </div>
          </div>

        </div>


        <div className="
          border-t 
          border-gray-700 
          mt-8 
          pt-5 
          text-center 
          text-sm 
          text-gray-400
        ">
          © 2026 JobPortal. All rights reserved.
        </div>


      </div>
    </footer>
  );
};