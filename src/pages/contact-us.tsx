import React, { useState } from "react";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaPhoneVolume,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";
import SEO from "@/components/SEO";

const Contact: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [category, setCategory] = useState<string>("general");
  const [message, setMessage] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "collaboration", label: "Collaboration Proposal" },
    { value: "event", label: "Event Information" },
    { value: "membership", label: "Membership" },
    { value: "feedback", label: "Feedback" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, category, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Some technical error. Please try again later."
        );
      }

      setFormSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setCategory("general");
      setMessage("");

      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us - ECAST"
        description="Get in touch with ECAST. Have questions, suggestions, or need technical support? We're here to help."
        url="/contact-us"
      />
      <NavBar />

      {/* Hero Section */}
      <div className="bg-black pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Get In <span className="text-red-500">Touch</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-black min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Phone Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500 transition-all duration-300 shadow-lg hover:shadow-red-500/20">
              <div className="flex items-center justify-center w-12 h-12 bg-red-600/20 rounded-lg mb-4 mx-auto">
                <FaPhoneVolume className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-3">
                Phone
              </h3>
              <div className="space-y-2 text-center">
                <a
                  href="tel:+9779824274331"
                  className="block text-gray-400 hover:text-red-500 transition"
                >
                  +977 9824274331
                </a>
                <a
                  href="tel:+9779867404111"
                  className="block text-gray-400 hover:text-red-500 transition"
                >
                  +977 9867404111
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500 transition-all duration-300 shadow-lg hover:shadow-red-500/20">
              <div className="flex items-center justify-center w-12 h-12 bg-red-600/20 rounded-lg mb-4 mx-auto">
                <FaEnvelope className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-3">
                Email
              </h3>
              <a
                href="mailto:ecast@tcioe.edu.np"
                className="block text-gray-400 hover:text-red-500 transition text-center"
              >
                ecast@tcioe.edu.np
              </a>
            </div>

            {/* Location Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500 transition-all duration-300 shadow-lg hover:shadow-red-500/20">
              <div className="flex items-center justify-center w-12 h-12 bg-red-600/20 rounded-lg mb-4 mx-auto">
                <FaMapMarkerAlt className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-3">
                Location
              </h3>
              <a
                href="https://maps.app.goo.gl/CvzD96hgud5kjCVX8"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-red-500 transition text-center"
              >
                Thapathali Campus
                <br />
                Kathmandu, Nepal
              </a>
            </div>
          </div>

          {/* Form and Map Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form - Shows first on mobile */}
            <div className="bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800 order-1">
              <h2 className="text-3xl font-bold text-white mb-6">
                Send us a Message
              </h2>

              {formSubmitted && (
                <div className="mb-6 bg-green-900/30 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-green-400 font-medium">
                      Message sent successfully! We'll get back to you soon.
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <span className="text-red-400">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full py-3 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full py-3 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full py-3 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full py-3 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    maxLength={500}
                    className="w-full py-3 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {message.length}/500 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/50"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map and Social Section - Shows second on mobile */}
            <div className="space-y-6 order-2">
              {/* Map */}
              <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
                <iframe
                  title="ECAST Location"
                  width="100%"
                  height="400"
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.7527841083115!2d85.31625117617291!3d27.694034676190054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19ae08c068d9%3A0x475bed1f66d060c!2sIOE%2C%20Thapathali%20Campus!5e0!3m2!1sen!2snp!4v1720262496739!5m2!1sen!2snp"
                  className="w-full"
                ></iframe>
              </div>

              {/* Social Links */}
              <div className="bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Connect With Us
                </h3>
                <div className="flex justify-center gap-6">
                  <a
                    href="https://www.instagram.com/ecastthapathali/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-red-600 transition-all duration-300 group"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-2xl text-gray-400 group-hover:text-white transition" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ecastthapathali/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-red-600 transition-all duration-300 group"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="text-2xl text-gray-400 group-hover:text-white transition" />
                  </a>
                  <a
                    href="https://www.facebook.com/ecastthapathali"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-red-600 transition-all duration-300 group"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="text-2xl text-gray-400 group-hover:text-white transition" />
                  </a>
                  <a
                    href="mailto:ecast@tcioe.edu.np"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-red-600 transition-all duration-300 group"
                    aria-label="Email"
                  >
                    <FaEnvelope className="text-2xl text-gray-400 group-hover:text-white transition" />
                  </a>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Need Help?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Whether you have questions, need technical support, or want to
                  share feedback, we're here to help. Our team typically
                  responds within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
