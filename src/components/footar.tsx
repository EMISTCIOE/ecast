import Image from "next/image";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaMapMarkerAlt,
  FaDiscord,
  FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Top Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#ffffff"
            fillOpacity="0.1"
          ></path>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Column - Larger */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center group">
              <Image
                src="/assets/ecast-logo.png"
                alt="ECAST Logo"
                className="h-16 w-16 mr-4 transition-transform group-hover:scale-110 duration-300"
                width={64}
                height={64}
              />
              <div>
                <h2 className="text-3xl font-black tracking-tight">ECAST</h2>
                <p className="text-xs text-blue-400 font-medium">
                  Thapathali Campus
                </p>
              </div>
            </Link>

            <p className="text-gray-400 leading-relaxed pr-4">
              Electronics and Computer Community Amidst Students, Thapathali. We
              are dedicated to fostering innovation, collaboration, and
              excellence among engineering students.
            </p>

            {/* Social Icons with Glassmorphism */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.instagram.com/ecastthapathali/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-lg hover:border-pink-500 transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl text-gray-400 group-hover:text-pink-500 transition-colors duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/company/ecastthapathali/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-lg hover:border-blue-500 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
              </a>
              <a
                href="https://www.facebook.com/ecastthapathali"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-lg hover:border-blue-400 transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
              </a>
              <a
                href="https://discord.gg/4n8rquAp5H"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-lg hover:border-indigo-500 transition-all duration-300"
                aria-label="Discord"
              >
                <FaDiscord className="text-xl text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-4">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/committee", label: "Committee" },
                { href: "/join-us", label: "Join Us" },
                { href: "/contact-us", label: "Contact Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Community */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-4">
              Community
            </h3>
            <nav className="space-y-3">
              {[
                { href: "/alumni", label: "Alumni" },
                { href: "/ambassadors", label: "Ambassadors" },
                { href: "/ourevents", label: "Events" },
                { href: "/notices", label: "Notices" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-4">
              Resources
            </h3>
            <nav className="space-y-3">
              {[
                { href: "/research", label: "Research" },
                { href: "/projects", label: "Projects" },
                { href: "/blogs", label: "Blogs" },
                { href: "/gallery", label: "Gallery" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact - Now smaller */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-400 mt-1 text-sm flex-shrink-0" />
                <p className="text-gray-400">
                  Thapathali Campus
                  <br />
                  Kathmandu, Nepal
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-400 text-sm flex-shrink-0" />
                <a
                  href="mailto:ecast@tcioe.edu.np"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  ecast@tcioe.edu.np
                </a>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  Get In Touch
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white border-opacity-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {currentYear} ECAST. All rights reserved. Made with ❤️ by ECAST
              Team
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-500 hover:text-blue-400 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-blue-400 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                href="/contact-us"
                className="text-gray-500 hover:text-blue-400 transition-colors duration-200"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
