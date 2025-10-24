import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../../public/assets/ecast-logo.png";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [me, setMe] = useState<any>(null);
  const router = useRouter();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const u = localStorage.getItem("user");
      if (u) setMe(JSON.parse(u));
    } catch {}
  }, [router.pathname]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-dropdown-container")) {
        setUserOpen(false);
      }
    };
    if (userOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [userOpen]);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setMe(null);
    setUserOpen(false);
    router.push("/");
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: string } = {
      ADMIN: "Administrator",
      AMBASSADOR: "Ambassador",
      ALUMNI: "Alumni",
      MEMBER: "Member",
    };
    return roleMap[role] || role;
  };

  const roleLabel = () => {
    if (!me) return "";
    const pos = me?.committee_position || me?.committee?.position;
    const role = me?.role;
    return pos && (role === "ADMIN" || role === "MEMBER")
      ? pos
      : getRoleDisplay(role);
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
        <Navlink
          to="/committee"
          onClick={closeMenu}
          currentRoute={router.pathname}
        >
          Committee
        </Navlink>
        <Navlink
          to="/projects"
          onClick={closeMenu}
          currentRoute={router.pathname}
        >
          Projects
        </Navlink>
        <Navlink
          to="/gallery"
          onClick={closeMenu}
          currentRoute={router.pathname}
        >
          Gallery
        </Navlink>
        <Navlink to="/blogs" onClick={closeMenu} currentRoute={router.pathname}>
          Blogs
        </Navlink>
        <Navlink
          to="/contact-us"
          onClick={closeMenu}
          currentRoute={router.pathname}
        >
          Contact
        </Navlink>

        <div className="relative ml-4 user-dropdown-container">
          {me ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserOpen((v) => !v);
                }}
                className="flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg min-w-[180px]"
              >
                {me.user_photo || me.committee_member_photo ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 flex-shrink-0">
                    <Image
                      src={
                        (me.user_photo || me.committee_member_photo).startsWith(
                          "http"
                        )
                          ? me.user_photo || me.committee_member_photo
                          : `${process.env.NEXT_PUBLIC_API_BASE || ""}${
                              me.user_photo || me.committee_member_photo
                            }`
                      }
                      alt={me.full_name || me.username || "User"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center text-base font-bold border-2 border-purple-500">
                    {(me.full_name || me.username || "?")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-medium flex-1 text-left truncate">
                  {(me.full_name || me.username) +
                    (roleLabel() ? ` · ${roleLabel()}` : "")}
                </span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform flex-shrink-0 ${
                    userOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {/* User Info Header */}
                  <div className="px-4 py-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-b border-gray-700/50">
                    <div className="flex items-center gap-3 mb-2">
                      {me.user_photo || me.committee_member_photo ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg flex-shrink-0">
                          <Image
                            src={
                              (
                                me.user_photo || me.committee_member_photo
                              ).startsWith("http")
                                ? me.user_photo || me.committee_member_photo
                                : `${process.env.NEXT_PUBLIC_API_BASE || ""}${
                                    me.user_photo || me.committee_member_photo
                                  }`
                            }
                            alt={me.full_name || me.username || "User"}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <span className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center text-xl font-bold border-2 border-purple-500 shadow-lg">
                          {(me.full_name || me.username || "?")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {me.full_name || me.username}
                        </div>
                        <div className="text-xs text-purple-400 capitalize">
                          {roleLabel()}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {me.email || me.username}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href={`/${
                        me.role === "ADMIN"
                          ? "/me"
                          : me.role === "AMBASSADOR"
                          ? "/me"
                          : me.role === "ALUMNI"
                          ? "/me"
                          : "/me"
                      }`}
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-gray-200 hover:text-white group"
                    >
                      <RectangleStackIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-gray-700/50">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300 group"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="text-white hover:text-yellow-500 transition-colors px-4 py-2 font-medium"
            >
              Login
            </Link>
          )}
        </div>
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
          <Navlink
            to="/about"
            onClick={closeMenu}
            currentRoute={router.pathname}
          >
            About Us
          </Navlink>
          <Navlink
            to="/committee"
            onClick={closeMenu}
            currentRoute={router.pathname}
          >
            Committee
          </Navlink>
          <Navlink
            to="/projects"
            onClick={closeMenu}
            currentRoute={router.pathname}
          >
            Projects
          </Navlink>
          <Navlink
            to="/gallery"
            onClick={closeMenu}
            currentRoute={router.pathname}
          >
            Gallery
          </Navlink>
          <Navlink
            to="/blogs"
            onClick={closeMenu}
            currentRoute={router.pathname}
          >
            Blogs
          </Navlink>
          <Navlink
            to="/contact-us"
            onClick={closeMenu}
            currentRoute={router.pathname}
          >
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

const Navlink: React.FC<NavlinkProps> = ({
  to,
  children,
  onClick,
  currentRoute,
}) => {
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
