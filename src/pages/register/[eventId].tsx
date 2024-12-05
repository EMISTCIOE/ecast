import React from "react";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
} from "react-icons/fa";
import styles from "../../components/css/file1.module.css";
import NavBar from "@/components/nav";
import Footer from "@/components/footar"; // Corrected typo from "footar" to "footer"
import Link from "next/link";

interface ContactPageProps {
  eventId: string; // Assuming you pass this as a prop or derive it from context or URL
}

const ContactPage: React.FC<ContactPageProps> = ({ eventId }) => {
  const isDjangoWorkshop = eventId === "django";

  return (
    <>
      <NavBar />
      
      {/* Header Section */}
      <div>
        <h2 className="text-6xl font-medium text-slate-600 bg-black p-12 sm:flex-row sm:justify-center text-center">
          {isDjangoWorkshop ? "Workshop On Django" : "Event Coming Soon"}
        </h2>
      </div>
      
      {/* Main Content */}
      <div className="flex justify-center items-center bg-black w-full col-2">
        <div className="highlight text-white flex flex-col sm:flex-row justify-center items-center w-full sm:max-w-5xl pb-12 bg-black">
          <div className={styles["semi-container"]}>
            {isDjangoWorkshop ? (
              <>
                <img
                  src="/event-django.jpg"
                  alt="Django Workshop"
                  className="mx-auto mb-6 pb-6 sm:mb-0 rounded-lg"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <h1 className="text-white text-center text-3xl font-bold mb-8">
                  𝐉𝐨𝐢𝐧 𝐭𝐡𝐞 𝟖 𝐃𝐚𝐲𝐬 𝐃𝐣𝐚𝐧𝐠𝐨 𝐖𝐨𝐫𝐤𝐬𝐡𝐨𝐩: 𝐌𝐚𝐬𝐭𝐞𝐫 𝐭𝐡𝐞 𝐀𝐫𝐭 𝐨𝐟 𝐖𝐞𝐛 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐦𝐞𝐧𝐭!
                </h1>

                <p className="para leading-normal text-center pb-5">
                  𝐃𝐢𝐯𝐞 𝐢𝐧𝐭𝐨 𝐃𝐣𝐚𝐧𝐠𝐨 𝐚𝐧𝐝 𝐁𝐮𝐢𝐥𝐝 𝐘𝐨𝐮𝐫 𝐅𝐢𝐫𝐬𝐭 𝐖𝐞𝐛 𝐀𝐩𝐩𝐥𝐢𝐜𝐚𝐭𝐢𝐨𝐧!
                  <br />
                  Whether you're a beginner or have some programming experience, this workshop is your ultimate gateway to mastering
                  Django, the powerful Python-based web framework.
                </p>

                <h3 className="text-white text-2xl font-semibold mb-4">𝐖𝐡𝐚𝐭 𝐘𝐨𝐮'𝐥𝐥 𝐋𝐞𝐚𝐫𝐧:</h3>
                <ul className="text-white mb-6">
                  <li>📌 Python Basics – Get started with the foundation of coding! 🐍</li>
                  <li>📌 Django Projects – Learn to set up and navigate like a pro! 🌐</li>
                  <li>📌 Templates, Forms & Authentication – Master the tools for dynamic web apps!</li>
                  <li>📌 Deploy Your App – Build and launch your own Django app! 🚀</li>
                </ul>

                <p className="text-white mb-6">
                  <span className="font-semibold">𝐒𝐲𝐥𝐥𝐚𝐛𝐮𝐬:</span>{' '}
                  <Link className="text-blue-500 hover:text-blue-700 hover:underline" href="https://bit.ly/EcastBackendWorkshop">
                    Click here to view the syllabus
                  </Link>
                </p>

                <h3 className="text-white text-2xl font-semibold mb-4">𝐖𝐨𝐫𝐤𝐬𝐡𝐨𝐩 𝐃𝐞𝐭𝐚𝐢𝐥𝐬:</h3>
                <ul className="text-white mb-6">
                  <li>💵 Registration Fee: Rs. 100 ("Attendees with 100% attendance will receive a full refund")</li>
                  <li>📅 Dates: [Mangsir 25, 2081 – Poush 04, 2081]</li>
                  <li>⏰ Time: 7:00 AM – 9:00 AM</li>
                  <li>📍 Location: E-Block/ E-Hall</li>
                  <li>💻 Mode: Physical</li>
                </ul>

                <h3 className="text-white text-2xl font-semibold mb-4">𝐖𝐡𝐲 𝐉𝐨𝐢𝐧?</h3>
                <ul className="text-white mb-6">
                  <li>✅ Learn from experienced instructors.</li>
                  <li>✅ Build hands-on projects.</li>
                  <li>✅ Gain confidence in web development.</li>
                </ul>

                <p className="text-white mb-6">
                  "Participants actively engaging in the Q&A sessions will have the chance to win exciting swags and more surprises!"
                </p>

                <p className="text-white mb-6 font-semibold">
                  Spots are Limited! Don’t Miss Out!
                </p>

                <p className="text-white">
                  📲 Register Now:{' '}
                  <Link className="text-blue-500 hover:text-blue-700 hover:underline" href="https://forms.gle/565p85j1X8nauhga9">
                    Register Here
                  </Link>
                </p>

                <p className="text-white mt-6">
                  And kickstart your journey into web development! 🎯
                </p>
              </>
            ) : (
              <>
                
                <h1 className="text-white text-center text-3xl font-bold mb-8">
                  Event Coming Soon!
                </h1>
                <img
                  src="https://app.svgator.com/assets/svgator.webapp/log-in-girl.svg"
                  alt="Event Coming Soon"
                  className="mx-auto mb-6 pb-6 sm:mb-0 rounded-lg"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <p className="text-white text-center">Stay tuned for more details on our upcoming events.</p>
              </>
            )}

            <div className="social text-white mt-7">
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
