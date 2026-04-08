"use client";

import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar({ categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Subsidy", href: "/subsidy" },
    { label: "Category", href: "#", hasDropdown: true },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          <div
            onClick={() => router.push("/")}
            className="flex items-center cursor-pointer"
          >
            <Image
              src="/HANSLOGO.png"
              alt="Hans Solar Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>

          <div className="hidden md:flex items-center gap-6">

            {navLinks.map((link, index) => (
              <div key={index} className="relative group">

                <button
                  onClick={() => {
                    if (link.href !== "#") router.push(link.href);
                  }}
                  className={`flex items-center gap-1 text-sm font-medium transition ${
                    pathname === link.href
                      ? "text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={16} />}
                </button>

                {/* 🔥 FIXED SAFE MAP */}
                {link.hasDropdown && (
                  <div className="absolute top-10 w-56 bg-white shadow-xl rounded-xl hidden group-hover:block z-50 border">

                    {categories?.length > 0 ? (
                      categories?.map((cat) => (
                        <div
                          key={cat._id}
                          onClick={() =>
                            router.push(`/shop?category=${cat._id}`)
                          }
                          className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm"
                        >
                          {cat.name}
                        </div>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-gray-400">
                        No categories
                      </p>
                    )}

                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center border rounded-xl px-3 py-1">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="outline-none px-2 text-sm w-40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/shop?search=${searchQuery}`);
                  }
                }}
              />
            </div>

            <button
              onClick={() => router.push("/cart")}
              className="hover:text-green-600"
            >
              <ShoppingCart size={22} />
            </button>

            <a
              href="tel:9358622621"
              className="flex items-center gap-1 bg-green-600 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-green-700"
            >
              <Phone size={16} />
              Call
            </a>

            <button
              onClick={() => router.push("/contact")}
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-blue-700"
            >
              <Mail size={16} />
              Contact
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden flex flex-col space-y-2 pb-4">

            {navLinks.map((link, index) => (
              <div key={index}>
                <button
                  onClick={() => {
                    if (link.href !== "#") {
                      router.push(link.href);
                      setIsOpen(false);
                    } else {
                      setShowMobileCategories(!showMobileCategories);
                    }
                  }}
                  className="px-3 py-2 text-left text-sm w-full flex justify-between items-center"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={16} />}
                </button>

                {/* 🔥 FIX SAFE MAP */}
                {link.hasDropdown && showMobileCategories && (
                  <div className="pl-4">
                    {categories?.map((cat) => (
                      <div
                        key={cat._id}
                        onClick={() => {
                          router.push(`/shop?category=${cat._id}`);
                          setIsOpen(false);
                        }}
                        className="py-1 text-sm text-gray-600"
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center border rounded-lg px-2 mx-3">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="outline-none px-2 py-1 text-sm w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/shop?search=${e.target.value}`);
                    setIsOpen(false);
                  }
                }}
              />
            </div>

            <div className="flex justify-between items-center px-3 mt-2 gap-2">

              <button onClick={() => router.push("/cart")}>
                <ShoppingCart size={22} />
              </button>

              <a
                href="tel:9358622621"
                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg"
              >
                <Phone size={16} />
                Call
              </a>

              <button
                onClick={() => {
                  router.push("/contact");
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg"
              >
                <Mail size={16} />
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}