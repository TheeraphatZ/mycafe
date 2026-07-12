"use client";

import { useState } from "react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#menu", label: "Menu" },
  { href: "#about", label: "Feature" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (href === "#home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 112; // navbar height (h-28 = 112px)
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F7F1E5]/95 backdrop-blur-md border-b border-black/5">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="flex h-28 items-center justify-between">

          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleScroll(e, "#home")}
            className="shrink-0 group relative cursor-pointer"
          >
            <span className="absolute inset-0 rounded-full bg-[#C6A15B]/20 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src="/images/logo.png"
              alt="Daily Dose Café"
              className="relative w-20 h-20 rounded-full object-cover ring-2 ring-[#C6A15B] ring-offset-2 ring-offset-[#F7F1E5] group-hover:scale-105 transition-transform duration-300"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="text-base font-medium text-[#1C1C1C] hover:text-[#C6A15B] transition-colors duration-300 cursor-pointer"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#menu"
              onClick={(e) => handleScroll(e, "#menu")}
              className="px-8 py-3 rounded-full bg-[#1C1C1C] text-[#F7F1E5] text-base font-medium hover:bg-[#C6A15B] hover:text-[#1C1C1C] transition-colors duration-300 cursor-pointer"
            >
              Order Now
            </a>

            <a
              href="/admin"
              className="px-6 py-3 rounded-full border border-[#C6A15B] text-[#1C1C1C] hover:bg-[#C6A15B] text-base font-medium transition-colors duration-300 cursor-pointer"
            >
              Login
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`w-7 h-0.5 bg-[#1C1C1C] transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""
                }`}
            />
            <span
              className={`w-7 h-0.5 bg-[#1C1C1C] transition-all duration-300 ${isOpen ? "opacity-0" : ""
                }`}
            />
            <span
              className={`w-7 h-0.5 bg-[#1C1C1C] transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden bg-[#F7F1E5] transition-all duration-300 ${isOpen
          ? "max-h-96 opacity-100 border-t border-black/5"
          : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col px-6 py-6 gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-lg font-medium text-[#1C1C1C] hover:text-[#C6A15B] transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#menu"
            onClick={(e) => handleScroll(e, "#menu")}
            className="mt-2 px-6 py-3.5 rounded-full bg-[#1C1C1C] text-[#F7F1E5] text-center font-medium cursor-pointer"
          >
            Order Now
          </a>

          <a
            href="/admin"
            className="mt-1 px-6 py-3.5 rounded-full border border-[#C6A15B] text-[#1C1C1C] text-center font-medium cursor-pointer hover:bg-[#C6A15B] transition-colors"
          >
            login
          </a>
        </div>
      </div>
    </nav>
  );
}