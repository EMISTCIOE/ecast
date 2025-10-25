import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";
import SEO from "@/components/SEO";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const Unsubscribe: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    if (token && typeof token === "string") {
      handleUnsubscribe(token);
    }
  }, [token]);

  const handleUnsubscribe = async (unsubscribeToken: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/event/newsletter/unsubscribe/${unsubscribeToken}/`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Successfully unsubscribed from newsletter");
        setEmail(data.email || "");
        setCategory(data.category || "");
      } else {
        setStatus("error");
        setMessage(
          data.message ||
            "Failed to unsubscribe. The link may be invalid or expired."
        );
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        "An error occurred while processing your request. Please try again later."
      );
      console.error("Unsubscribe error:", error);
    }
  };

  return (
    <>
      <SEO
        title="Unsubscribe - ECAST Newsletter"
        description="Unsubscribe from ECAST newsletter updates"
      />
      <NavBar />

      <div className="min-h-screen bg-black py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-white border-opacity-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-8 px-6 text-center">
              <h1 className="text-3xl font-bold mb-2">
                Newsletter Unsubscribe
              </h1>
              <p className="text-purple-100">ECAST - Thapathali Campus</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {status === "loading" && (
                <div className="text-center py-12">
                  <FaSpinner className="animate-spin text-6xl text-pink-500 mx-auto mb-4" />
                  <p className="text-gray-300 text-lg">
                    Processing your request...
                  </p>
                </div>
              )}

              {status === "success" && (
                <div className="text-center py-8">
                  <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Successfully Unsubscribed
                  </h2>
                  <p className="text-gray-300 mb-6">{message}</p>

                  {email && (
                    <div className="bg-slate-800 rounded-lg p-6 mb-6 text-left max-w-md mx-auto border border-gray-700">
                      <p className="text-sm text-gray-300 mb-2">
                        <strong className="text-white">Email:</strong> {email}
                      </p>
                      {category && (
                        <p className="text-sm text-gray-300">
                          <strong className="text-white">Category:</strong>{" "}
                          {category}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-200">
                      You will no longer receive emails for this subscription.
                      We're sorry to see you go!
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Changed your mind? You can always subscribe again.
                    </p>
                    <button
                      onClick={() => router.push("/")}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="text-center py-8">
                  <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Unsubscribe Failed
                  </h2>
                  <p className="text-gray-300 mb-6">{message}</p>

                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-200 mb-2">
                      <strong className="text-white">Possible reasons:</strong>
                    </p>
                    <ul className="text-sm text-gray-300 text-left list-disc list-inside space-y-1">
                      <li>The unsubscribe link has expired</li>
                      <li>You've already unsubscribed using this link</li>
                      <li>The link is invalid or corrupted</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Need help? Contact us at{" "}
                      <a
                        href="mailto:ecast@tcioe.edu.np"
                        className="text-pink-500 hover:underline"
                      >
                        ecast@tcioe.edu.np
                      </a>
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => router.push("/")}
                        className="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
                      >
                        Back to Home
                      </button>
                      <button
                        onClick={() => router.push("/contact-us")}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
                      >
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="bg-slate-800 px-8 py-6 border-t border-gray-700">
              <div className="text-center text-sm text-gray-300">
                <p className="mb-2">
                  <strong className="text-white">
                    About Newsletter Subscriptions
                  </strong>
                </p>
                <p className="mb-4">
                  ECAST newsletter keeps you updated about events, blogs,
                  research, notices, and projects from our community.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs">
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                    Events
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                    Blogs
                  </span>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/30">
                    Research
                  </span>
                  <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full border border-yellow-500/30">
                    Notices
                  </span>
                  <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full border border-pink-500/30">
                    Projects
                  </span>
                  <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                    General
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Unsubscribe;
