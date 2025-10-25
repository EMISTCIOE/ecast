import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../../public/assets/ecast-logo.png";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  RectangleStackIcon,
  UserGroupIcon,
  AcademicCapIcon,
  StarIcon,
  PhotoIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
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
      if (!target.closest(".community-dropdown-container")) {
        setCommunityOpen(false);
      }
      if (!target.closest(".resources-dropdown-container")) {
        setResourcesOpen(false);
      }
    };
    if (userOpen || communityOpen || resourcesOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [userOpen, communityOpen, resourcesOpen]);

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
    <nav className="sticky top-0 left-0 z-50 w-full bg-slate-900/95 backdrop-filter backdrop-blur-xl border-b border-white/10 shadow-2xl">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative w-full px-6 h-20 flex items-center justify-between">
        {/* Logo Section - Forced Left */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" onClick={closeMenu}>
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-400/30 transition-all duration-300"></div>
                <Image
                  src={Logo}
                  alt="Logo"
                  className="relative h-14 w-14 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-300"
                />
              </div>
              <div>
                <span className="text-white text-3xl font-black tracking-tight group-hover:text-blue-400 transition-colors duration-300">
                  ECAST
                </span>
                <p className="text-xs text-blue-400/80 font-medium -mt-1">
                  Thapathali Campus
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Menu - All Options Visible & Right Aligned */}
        <div className="hidden lg:flex items-center text-white gap-1 ml-auto">
          <Navlink to="/" onClick={closeMenu} currentRoute={router.pathname}>
            Home
          </Navlink>
          <Navlink
            to="/about"
            onClick={closeMenu}
            currentRoute={router.pathname}
          >
            About
          </Navlink>

          <Navlink
            to="/committee"
            onClick={closeMenu}
            currentRoute={router.pathname}
          >
            Committee
          </Navlink>

          {/* All Other Links - Visible */}
          <Navlink
            to="/ourevents"
            onClick={closeMenu}
            currentRoute={router.pathname}
          >
            Events
          </Navlink>
          <Navlink
            to="/notices"
            onClick={closeMenu}
            currentRoute={router.pathname}
          >
            Notices
          </Navlink>
          <Navlink
            to="/research"
            onClick={closeMenu}
            currentRoute={router.pathname}
          >
            Research
          </Navlink>

          {/* Resources Dropdown */}

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
            Contact
          </Navlink>
          <div className="relative resources-dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setResourcesOpen(!resourcesOpen);
                setCommunityOpen(false);
              }}
              className={`px-3 py-2 font-semibold text-sm uppercase tracking-wide transition-all duration-300 flex items-center gap-1.5 rounded-lg ${
                router.pathname.includes("/gallery") ||
                router.pathname.includes("/projects")
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-white hover:text-blue-400 hover:bg-white/5"
              }`}
            >
              Resources
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-300 ${
                  resourcesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {resourcesOpen && (
              <div className="absolute top-full left-0 mt-3 w-56 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-1.5">
                  <Link
                    href="/projects"
                    onClick={() => {
                      setResourcesOpen(false);
                      closeMenu();
                    }}
                    className="group flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-600/10 hover:text-blue-400 transition-all rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <CodeBracketIcon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Projects</span>
                  </Link>
                  <Link
                    href="/gallery"
                    onClick={() => {
                      setResourcesOpen(false);
                      closeMenu();
                    }}
                    className="group flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-600/10 hover:text-blue-400 transition-all rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <PhotoIcon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Gallery</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Community Dropdown */}
          <div className="relative community-dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCommunityOpen(!communityOpen);
                setResourcesOpen(false);
              }}
              className={`px-3 py-2 font-semibold text-sm uppercase tracking-wide transition-all duration-300 flex items-center gap-1.5 rounded-lg ${
                router.pathname.includes("/alumni") ||
                router.pathname.includes("/ambassadors")
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-white hover:text-blue-400 hover:bg-white/5"
              }`}
            >
              Community
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-300 ${
                  communityOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {communityOpen && (
              <div className="absolute top-full left-0 mt-3 w-56 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-1.5">
                  <Link
                    href="/alumni"
                    onClick={() => {
                      setCommunityOpen(false);
                      closeMenu();
                    }}
                    className="group flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-600/10 hover:text-blue-400 transition-all rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <AcademicCapIcon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Alumni</span>
                  </Link>
                  <Link
                    href="/ambassadors"
                    onClick={() => {
                      setCommunityOpen(false);
                      closeMenu();
                    }}
                    className="group flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-600/10 hover:text-blue-400 transition-all rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <StarIcon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Ambassadors</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative ml-3 user-dropdown-container">
            {me ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserOpen((v) => !v);
                  }}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 min-w-[200px]"
                >
                  {me.user_photo || me.committee_member_photo ? (
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-400 flex-shrink-0 ring-2 ring-blue-400/20">
                      <Image
                        src={
                          (
                            me.user_photo || me.committee_member_photo
                          ).startsWith("http")
                            ? me.user_photo || me.committee_member_photo
                            : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${
                                me.user_photo || me.committee_member_photo
                              }`
                        }
                        alt={me.full_name || me.username || "User"}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold border-2 border-blue-400 ring-2 ring-blue-400/20">
                      {(me.full_name || me.username || "?")
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {me.full_name || me.username}
                    </div>
                    {roleLabel() && (
                      <div className="text-xs text-blue-400 truncate">
                        {roleLabel()}
                      </div>
                    )}
                  </div>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform flex-shrink-0 text-gray-400 ${
                      userOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-5 py-4 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent border-b border-white/10">
                      <div className="flex items-center gap-4 mb-2">
                        {me.user_photo || me.committee_member_photo ? (
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400 shadow-xl flex-shrink-0 ring-4 ring-blue-400/10">
                            <Image
                              src={
                                (
                                  me.user_photo || me.committee_member_photo
                                ).startsWith("http")
                                  ? me.user_photo || me.committee_member_photo
                                  : `${
                                      process.env.NEXT_PUBLIC_BACKEND_URL || ""
                                    }${
                                      me.user_photo || me.committee_member_photo
                                    }`
                              }
                              alt={me.full_name || me.username || "User"}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <span className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold border-2 border-blue-400 shadow-xl ring-4 ring-blue-400/10">
                            {(me.full_name || me.username || "?")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-bold text-white truncate">
                            {me.full_name || me.username}
                          </div>
                          <div className="text-xs text-blue-400 font-semibold uppercase tracking-wide mt-0.5">
                            {roleLabel()}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 truncate px-1">
                        {me.email || me.username}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        href={`/${
                          me.role === "ADMIN"
                            ? "me"
                            : me.role === "AMBASSADOR"
                            ? "me"
                            : me.role === "ALUMNI"
                            ? "me"
                            : "me"
                        }`}
                        onClick={() => setUserOpen(false)}
                        className="group flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-600/10 rounded-lg transition-all text-gray-200 hover:text-white"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                          <RectangleStackIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">Dashboard</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-white/10 p-2">
                      <button
                        onClick={logout}
                        className="w-full group flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 rounded-lg transition-all text-red-400 hover:text-red-300"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                          <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className="lg:hidden flex items-center justify-center w-12 h-12 mr-4 text-white hover:text-blue-400 transition-colors duration-300 cursor-pointer"
          onClick={handleMenuToggle}
        >
          <svg
            className="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-20 text-left text-white backdrop-blur bg-[#000000dd] w-full min-h-screen p-6 overflow-y-auto">
          <div className="space-y-1 max-w-md mx-auto">
            <MobileNavLink
              to="/"
              onClick={closeMenu}
              currentRoute={router.pathname}
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/about"
              onClick={closeMenu}
              currentRoute={router.pathname}
            >
              About Us
            </MobileNavLink>

            {/* Community Section */}
            <div className="py-2">
              <div className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-2 px-4">
                Community
              </div>
              <MobileNavLink
                to="/committee"
                onClick={closeMenu}
                currentRoute={router.pathname}
              >
                Committee
              </MobileNavLink>
              <MobileNavLink
                to="/alumni"
                onClick={closeMenu}
                currentRoute={router.pathname}
              >
                Alumni
              </MobileNavLink>
              <MobileNavLink
                to="/ambassadors"
                onClick={closeMenu}
                currentRoute={router.pathname}
              >
                Ambassadors
              </MobileNavLink>
            </div>

            {/* Resources Section */}
            <div className="py-2">
              <div className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-2 px-4">
                Resources
              </div>
              <MobileNavLink
                to="/ourevents"
                onClick={closeMenu}
                currentRoute={router.pathname}
              >
                Events
              </MobileNavLink>
              <MobileNavLink
                to="/notices"
                onClick={closeMenu}
                currentRoute={router.pathname}
              >
                Notices
              </MobileNavLink>
              <MobileNavLink
                to="/research"
                onClick={closeMenu}
                currentRoute={router.pathname}
              >
                Research
              </MobileNavLink>
              <MobileNavLink
                to="/projects"
                onClick={closeMenu}
                currentRoute={router.pathname}
              >
                Projects
              </MobileNavLink>
              <MobileNavLink
                to="/blogs"
                onClick={closeMenu}
                currentRoute={router.pathname}
              >
                Blogs
              </MobileNavLink>
              <MobileNavLink
                to="/gallery"
                onClick={closeMenu}
                currentRoute={router.pathname}
              >
                Gallery
              </MobileNavLink>
            </div>

            <MobileNavLink
              to="/contact-us"
              onClick={closeMenu}
              currentRoute={router.pathname}
            >
              Contact Us
            </MobileNavLink>

            {/* Mobile Login/User */}
            {me ? (
              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href="/me"
                  onClick={closeMenu}
                  className="block px-4 py-3 bg-white/5 rounded-lg mb-2"
                >
                  <div className="flex items-center gap-3">
                    {me.user_photo || me.committee_member_photo ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-400">
                        <Image
                          src={
                            (
                              me.user_photo || me.committee_member_photo
                            ).startsWith("http")
                              ? me.user_photo || me.committee_member_photo
                              : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${
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
                      <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-base font-bold">
                        {(me.full_name || me.username || "?")
                          .trim()
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                    <div>
                      <div className="text-sm font-semibold">
                        {me.full_name || me.username}
                      </div>
                      <div className="text-xs text-blue-400">{roleLabel()}</div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-2 justify-center"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-center font-semibold"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Navlink Component
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
  const isActive = currentRoute === to;

  return (
    <Link href={to} onClick={onClick}>
      <div
        className={`px-3 py-2 font-semibold text-sm uppercase tracking-wide transition-all duration-300 rounded-lg relative ${
          isActive
            ? "text-blue-400 bg-blue-500/10"
            : "text-white hover:text-blue-400 hover:bg-white/5"
        }`}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-400 rounded-full"></span>
        )}
      </div>
    </Link>
  );
};

// Mobile Navlink Component
interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  currentRoute: string;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  to,
  children,
  onClick,
  currentRoute,
}) => {
  const isActive = currentRoute === to;

  return (
    <Link href={to} onClick={onClick}>
      <div
        className={`px-4 py-3 rounded-lg transition-all duration-300 ${
          isActive
            ? "bg-blue-500/20 text-blue-400 font-semibold border-l-4 border-blue-400"
            : "text-gray-300 hover:bg-white/5 hover:text-white hover:border-l-4 hover:border-white/20"
        }`}
      >
        {children}
      </div>
    </Link>
  );
};

export default NavBar;
