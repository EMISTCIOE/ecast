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
    <nav className="sticky top-0 left-0 z-50 w-full h-20 bg-slate-900/90 backdrop-filter backdrop-blur-lg border-b border-white/10 shadow-lg flex">
      <div className="flex w-[100%] items-center justify-between m-auto">
        <div className="flex px-4 items-center">
          <Link href="/" onClick={closeMenu}>
            <div className="flex items-center gap-3 group">
              <Image
                src={Logo}
                alt="Logo"
                className="h-14 w-14 transition-transform group-hover:scale-110 duration-300"
              />
              <span className="text-white text-3xl font-black tracking-tight">
                ECAST
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden mx-11 lg:flex items-center text-white gap-1">
        <Navlink to="/" onClick={closeMenu} currentRoute={router.pathname}>
          Home
        </Navlink>
        <Navlink to="/about" onClick={closeMenu} currentRoute={router.pathname}>
          About
        </Navlink>

        {/* Community Dropdown */}
        <div className="relative community-dropdown-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCommunityOpen(!communityOpen);
              setResourcesOpen(false);
            }}
            className={`p-2 opacity-90 font-semibold uppercase tracking-wide transition-all duration-300 flex items-center gap-1 ${
              router.pathname.includes("/committee") ||
              router.pathname.includes("/alumni") ||
              router.pathname.includes("/ambassadors")
                ? "text-blue-400"
                : "text-white hover:text-blue-400"
            }`}
          >
            Community
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                communityOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {communityOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden">
              <Link
                href="/committee"
                onClick={() => {
                  setCommunityOpen(false);
                  closeMenu();
                }}
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-400 transition-colors border-b border-white/10"
              >
                Committee
              </Link>
              <Link
                href="/alumni"
                onClick={() => {
                  setCommunityOpen(false);
                  closeMenu();
                }}
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-400 transition-colors border-b border-white/10"
              >
                Alumni
              </Link>
              <Link
                href="/ambassadors"
                onClick={() => {
                  setCommunityOpen(false);
                  closeMenu();
                }}
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-400 transition-colors"
              >
                Ambassadors
              </Link>
            </div>
          )}
        </div>

        {/* Resources Dropdown */}
        <div className="relative resources-dropdown-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setResourcesOpen(!resourcesOpen);
              setCommunityOpen(false);
            }}
            className={`p-2 opacity-90 font-semibold uppercase tracking-wide transition-all duration-300 flex items-center gap-1 ${
              router.pathname.includes("/ourevents") ||
              router.pathname.includes("/notices") ||
              router.pathname.includes("/projects") ||
              router.pathname.includes("/gallery") ||
              router.pathname.includes("/blogs") ||
              router.pathname.includes("/research")
                ? "text-blue-400"
                : "text-white hover:text-blue-400"
            }`}
          >
            Resources
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                resourcesOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {resourcesOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden">
              <Link
                href="/ourevents"
                onClick={() => {
                  setResourcesOpen(false);
                  closeMenu();
                }}
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-400 transition-colors border-b border-white/10"
              >
                Events
              </Link>
              <Link
                href="/notices"
                onClick={() => {
                  setResourcesOpen(false);
                  closeMenu();
                }}
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-400 transition-colors border-b border-white/10"
              >
                Notices
              </Link>
              <Link
                href="/research"
                onClick={() => {
                  setResourcesOpen(false);
                  closeMenu();
                }}
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-400 transition-colors border-b border-white/10"
              >
                Research
              </Link>
              <Link
                href="/projects"
                onClick={() => {
                  setResourcesOpen(false);
                  closeMenu();
                }}
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-400 transition-colors border-b border-white/10"
              >
                Projects
              </Link>
              <Link
                href="/blogs"
                onClick={() => {
                  setResourcesOpen(false);
                  closeMenu();
                }}
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-400 transition-colors border-b border-white/10"
              >
                Blogs
              </Link>
              <Link
                href="/gallery"
                onClick={() => {
                  setResourcesOpen(false);
                  closeMenu();
                }}
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-400 transition-colors"
              >
                Gallery
              </Link>
            </div>
          )}
        </div>

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
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg min-w-[180px]"
              >
                {me.user_photo || me.committee_member_photo ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-400 flex-shrink-0">
                    <Image
                      src={
                        (me.user_photo || me.committee_member_photo).startsWith(
                          "http"
                        )
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
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-base font-bold border-2 border-blue-400">
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
                <div className="absolute right-0 mt-3 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {/* User Info Header */}
                  <div className="px-4 py-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      {me.user_photo || me.committee_member_photo ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg flex-shrink-0">
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
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <span className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-xl font-bold border-2 border-blue-400 shadow-lg">
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
                        <div className="text-xs text-blue-400 capitalize">
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
                      <RectangleStackIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-white/10">
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
              className="text-white hover:text-blue-400 transition-colors px-4 py-2 font-medium"
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
        className={`p-2 opacity-90 font-semibold uppercase tracking-wide transition-all duration-300 ${
          isActive
            ? "text-blue-400 border-b-2 border-blue-400"
            : "text-white hover:text-blue-400"
        }`}
      >
        {children}
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
