import React from "react";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaPhoneVolume,
} from "react-icons/fa";
import { FaRegEnvelope, FaLocationDot } from "react-icons/fa6";
import styles from "../../components/css/file1.module.css";
import NavBar from "@/components/nav";
import Footer from "@/components/footar"; // Corrected typo from "footar" to "footer"

const ContactPage: React.FC = () => {
  return (
    <>
      <NavBar />
      
      {/* Header Section */}
      <div>
        <h2 className="text-6xl font-medium text-slate-600 bg-black p-12 sm:flex-row sm:justify-center text-center">
          NEW EVENT
        </h2>
      </div>
      
      {/* Contact Section */}
      <div className="flex justify-center items-center bg-black w-full col-2">
        <div className="highlight text-white flex flex-col sm:flex-row justify-center items-center w-full sm:max-w-5xl pb-12 bg-black">
          <div className={styles["semi-container"]}>
            <img
              src="/event-django.jpg"
              alt="Our team"
              className="mx-auto mb-6 pb-6 sm:mb-0 rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <p className="para leading-normal justify-center text-center pb-5 flex">
              We are happy to annouce that we are organizing a new event. The details of the event will be released later.
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
      
      <Footer />
    </>
  );
};

export default ContactPage;
