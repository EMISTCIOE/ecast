import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { useRouter } from "next/router"; 
import Logo from "../../public/ecast-logo.png"; 

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter(); 

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 left-0 z-50 w-full h-20 bg-slate-900 backdrop-filter backdrop-blur-lg opacity-95 shadow-2xl flex">
      <div className="flex w-[100%] items-center justify-between m-auto">
        <div className="flex px-4 items-center">
          <Link href="/" onClick={closeMenu}>
            <div className="flex items-center gap-2">
              <Image src={Logo} alt="Logo" className="h-14 w-14" />
              <span className="text-white text-3xl font-semibold tracking-wider">
                ECAST
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden mx-11 sm:flex items-center text-white gap-2">
        <Navlink to="/" onClick={closeMenu} currentRoute={router.pathname}>
          Home
        </Navlink>
        <Navlink to="/about" onClick={closeMenu} currentRoute={router.pathname}>
          About
        </Navlink>
        <Navlink to="/committee" onClick={closeMenu} currentRoute={router.pathname}>
          Committee
        </Navlink>
        <Navlink to="/projects" onClick={closeMenu} currentRoute={router.pathname}>
          Projects
        </Navlink>
        <Navlink to="/gallery" onClick={closeMenu} currentRoute={router.pathname}>
          Gallery
        </Navlink>
        <Navlink to="/contact-us" onClick={closeMenu} currentRoute={router.pathname}>
          Contact
        </Navlink>
      </div>

      {/* Mobile Menu Toggle */}
      <div
        className="sm:hidden text-white hover:text-theme mx-4 my-6 transition-color duration-500"
        onClick={handleMenuToggle}
      >
        <svg
          className="h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          {isMenuOpen ? (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5 5h21v2H4V6zm0 5h6v2H4v2zm0 5h21v2H4v-2z"
            />
          ) : (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5 5h15v2H4V6zm0 5h15v2H4v2zm0 5h15v2H4v-2z"
            />
          )}
        </svg>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden fixed top-20 text-center text-white backdrop-blur bg-[#000000dd] w-full min-h-screen p-4 flex py-48 justify-evenly flex-col">
          <Navlink to="/" onClick={closeMenu} currentRoute={router.pathname}>
            Home
          </Navlink>
          <Navlink to="/about" onClick={closeMenu} currentRoute={router.pathname}>
            About Us
          </Navlink>
          <Navlink to="/committee" onClick={closeMenu} currentRoute={router.pathname}>
            Committee
          </Navlink>
          <Navlink to="/projects" onClick={closeMenu} currentRoute={router.pathname}>
            Projects
          </Navlink>
          <Navlink to="/gallery" onClick={closeMenu} currentRoute={router.pathname}>
            Gallery
          </Navlink>
          <Navlink to="/contact-us" onClick={closeMenu} currentRoute={router.pathname}>
            Contact Us
          </Navlink>
        </div>
      )}
    </nav>
  );
};

interface NavlinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  currentRoute: string;
}

const Navlink: React.FC<NavlinkProps> = ({ to, children, onClick, currentRoute }) => {
  // Check if the link is active (current route matches)
  const isActive = currentRoute === to;

  return (
    <Link href={to} onClick={onClick}>
      <div
        className={`p-2 opacity-90 font-bold uppercase tracking-wide transition duration-500 ${
          isActive
            ? "text-yellow-500 underline underline-offset-8"
            : "hover:text-yellow-500 hover:underline-offset-4"
        }`}
      >
        {children}
      </div>
    </Link>
  );
};

export default NavBar;
