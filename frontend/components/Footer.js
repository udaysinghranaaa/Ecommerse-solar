"use client";

import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* 🔥 TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* COMPANY */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Hans Solar
            </h2>
            <p className="text-sm leading-relaxed">
              Hans Solar Renewable Energy India Pvt Ltd is committed to delivering
              sustainable and efficient solar energy solutions for homes and businesses.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-4 mt-4">
              <FiFacebook className="hover:text-green-500 cursor-pointer" />
              <FiInstagram className="hover:text-green-500 cursor-pointer" />
              <FiLinkedin className="hover:text-green-500 cursor-pointer" />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-green-500 cursor-pointer">Home</li>
              <li className="hover:text-green-500 cursor-pointer">Shop</li>
              <li className="hover:text-green-500 cursor-pointer">Subsidy</li>
              <li className="hover:text-green-500 cursor-pointer">About Us</li>
              <li className="hover:text-green-500 cursor-pointer">Contact Us</li>
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Solar Panel Installation</li>
              <li>On-Grid Solar System</li>
              <li>Off-Grid Solutions</li>
              <li>Maintenance & Support</li>
              <li>Solar Consultation</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <FiMapPin className="mt-1" />
                <p>India (Add your office address here)</p>
              </div>

              <div className="flex items-center gap-2">
                <FiPhone />
                <p>+91 XXXXX XXXXX</p>
              </div>

              <div className="flex items-center gap-2">
                <FiMail />
                <p>support@hanssolar.com</p>
              </div>
            </div>
          </div>

        </div>

        {/* 🔥 DIVIDER */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">

          <p>
            © {new Date().getFullYear()} Hans Solar Renewable Energy India Pvt Ltd. All rights reserved.
          </p>

          <p className="mt-2 md:mt-0">
            Designed with ⚡ for a sustainable future
          </p>

        </div>

      </div>
    </footer>
  );
}