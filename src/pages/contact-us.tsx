import React, { useState } from "react";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaPhoneVolume,
} from "react-icons/fa";
import { FaRegEnvelope, FaLocationDot } from "react-icons/fa6";
import styles from "../components/css/file1.module.css";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";
import SEO from "@/components/SEO";
import Image from "next/image";

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact/form/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, category, message }),
        }
      );

      if (!response.ok) {
        throw new Error("Some technical error. Please try again later.");
      }

      setFormSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setCategory("general");
      setMessage("");

      // Hide success message after 5 seconds
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit form. Please try again.");
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
      <div>
        <h2 className="text-6xl font-medium text-slate-600 bg-black p-12 sm:flex-row sm:justify-center text-center">
          Contact Us
        </h2>
      </div>

      <div className="flex justify-center items-center bg-black w-full col-2">
        <div className="highlight text-white flex flex-col sm:flex-row justify-center items-center w-full sm:max-w-5xl pb-12 bg-black">
          <div className={styles["semi-container"]}>
            <Image
              src="https://shotcan.com/images/2024/07/06/449363624_1023379369466682_3008407874607543682_n712a6d91a613817d.jpg"
              alt="Our team"
              width={800} // Set width
              height={600} // Set height
              className="mx-auto mb-6 pb-6 sm:mb-0 rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }}
              priority // Optional: To load the image faster
            />
            <p className="para leading-normal justify-center pb-5 flex">
              If you need our help with anything, have questions, or are
              experiencing any technical difficulties, please don’t hesitate to
              reach out to us. We're here to assist you! Additionally, if you
              have any suggestions, ideas, or feedback to share, we'd love to
              hear from you. Your input helps us improve our services.
            </p>

            <div className="pb-6 justify-center">
              <div className="mobile flex justify-center items-center mt-3">
                <FaPhoneVolume className="mr-2" />
                <span>
                  <a href="tel:+9779824274331">+977 9824274331</a>
                </span>
              </div>
              <div className="mobile flex justify-center items-center mt-3">
                <FaPhoneVolume className="mr-2" />
                <span>
                  <a href="tel:+9779867404111">+977 9867404111</a>
                </span>
              </div>
              <div className="email flex justify-center items-center mt-3">
                <FaRegEnvelope className="mr-2" />
                <span>
                  <a
                    href="mailto:ecast@tcioe.edu.np"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ecast@tcioe.edu.np
                  </a>
                </span>
              </div>
              <div className="location flex justify-center items-center mt-3">
                <FaLocationDot className="mr-2" />
                <span>
                  <a
                    href="https://maps.app.goo.gl/CvzD96hgud5kjCVX8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Thapathali Campus, Kathmandu, Nepal
                  </a>
                </span>
              </div>
            </div>

            <div className="social text-white">
              <h2 className="f2 text-center">FOLLOW US</h2>
              <div className="social-links pt-2 flex justify-center mt-3 mb-3">
                <a
                  className="instagram text-3xl mx-5"
                  href="https://www.instagram.com/ecastthapathali/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  className="linkedin text-3xl mx-5"
                  href="https://www.linkedin.com/company/ecastthapathali/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                </a>
                <a
                  className="facebook text-3xl mx-5"
                  href="https://www.facebook.com/ecastthapathali"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </a>
                <a
                  className="mail text-3xl mx-5"
                  href="mailto:ecast@tcioe.edu.np"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center bg-black w-full">
        <div className="highlight text-white flex justify-between w-full sm:max-w-5xl pb-12 bg-black flex-col sm:flex-row sm:justify-center">
          <div className={styles["semi-container"]}>
            <div className="highlight w-full max-w-5xl text-white p-13 flex justify-between mt-6">
              <form
                onSubmit={handleSubmit}
                className="space-y-6 w-full"
                autoComplete="off"
              >
                <div className="flex justify-center items-center pb-4 bg-black">
                  <h2 className="text-3xl font-medium text-slate-600 bg-black sm:justify-center">
                    Contact Form
                  </h2>
                </div>

                {formSubmitted && (
                  <div className="bg-green-600/20 border border-green-500/30 text-green-400 p-4 rounded-lg flex items-center gap-2 animate-pulse">
                    <svg
                      className="w-6 h-6"
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
                    <span>
                      Form submitted successfully! We'll get back to you soon.
                    </span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-600/20 border border-red-500/30 text-red-400 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full py-3 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full py-3 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full py-3 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full py-3 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="w-full py-3 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {message.length}/500 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
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
                      <FaEnvelope />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-black pt-10">
              <iframe
                title="Map"
                width="100%"
                height="450"
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.7527841083115!2d85.31625117617291!3d27.694034676190054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19ae08c068d9%3A0x475bed1f66d060c!2sIOE%2C%20Thapathali%20Campus!5e0!3m2!1sen!2snp!4v1720262496739!5m2!1sen!2snp"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
