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
import Image from "next/image";

const Contact: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("https://ecast-backend.onrender.com/api/contact/form/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error("Some technical error. Please try again later.");
      }

      setFormSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
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
              If you need our help with anything, have questions, or are experiencing any technical difficulties, please don’t hesitate to reach out to us. We're here to assist you! Additionally, if you have any suggestions, ideas, or feedback to share, we'd love to hear from you. Your input helps us improve our services.
            </p>

            <div className="pb-6 justify-center">
              <div className="mobile flex justify-center items-center mt-3">
                <FaPhoneVolume className="mr-2" />
                <span><a href="tel:+9779824274331">+977 9824274331</a></span>
              </div>
              <div className="mobile flex justify-center items-center mt-3">
                <FaPhoneVolume className="mr-2" />
                <span><a href="tel:+9779867404111">+977 9867404111</a></span>
              </div>
              <div className="email flex justify-center items-center mt-3">
                <FaRegEnvelope className="mr-2" />
                <span><a href="mailto:ecast@tcioe.edu.np" target="_blank" rel="noopener noreferrer">ecast@tcioe.edu.np</a></span>
              </div>
              <div className="location flex justify-center items-center mt-3">
                <FaLocationDot className="mr-2" />
                <span><a href="https://maps.app.goo.gl/CvzD96hgud5kjCVX8" target="_blank" rel="noopener noreferrer">Thapathali Campus, Kathmandu, Nepal</a></span>
              </div>
            </div>

            <div className="social text-white">
              <h2 className="f2 text-center">FOLLOW US</h2>
              <div className="social-links pt-2 flex justify-center mt-3 mb-3">
                <a className="instagram text-3xl mx-5" href="https://www.instagram.com/ecastthapathali/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
                <a className="linkedin text-3xl mx-5" href="https://www.linkedin.com/company/ecastthapathali/" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                </a>
                <a className="facebook text-3xl mx-5" href="https://www.facebook.com/ecastthapathali" target="_blank" rel="noopener noreferrer">
                  <FaFacebook />
                </a>
                <a className="mail text-3xl mx-5" href="mailto:ecast@tcioe.edu.np" target="_blank" rel="noopener noreferrer">
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
              {formSubmitted && (
                <p className="text-green-600">Form submitted successfully!</p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 w-full" autoComplete="off">
                <div className="flex justify-center items-center pb-2 bg-black">
                  <h2 className="text-3xl font-medium text-slate-600 bg-black sm:justify-center">
                    Contact Form
                  </h2>
                </div>
                <div className="mb-4 sm:justify-center">
                  <label htmlFor="name" className="block text-md pb-2 sm:justify-center font-medium text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full py-1 px-2 border-gray-300 bg-gray-300 text-black rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-md pb-2 font-medium text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full py-1 px-2 border-gray-300 bg-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-md pb-2 font-medium text-white">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="w-full py-1 px-1 border-gray-300 bg-gray-300 text-black rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                >
                  Submit
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
