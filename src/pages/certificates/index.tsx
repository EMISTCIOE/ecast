import React, { useState } from "react";
import axios from "axios";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";
import { useRouter } from "next/router";

const GenerateCertificate: React.FC = () => {
  const [name, setName] = useState("");
  const [eventName, setEventName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate animation progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setAnimationProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    try {
      const response = await axios.get("/api/generate-certificate/", {
        params: { name, event_name: eventName },
      });

      if (response.data.url) {
        const certificateId = response.data.url.split("/").pop();
        router.push(`/certificates/${certificateId}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Something went wrong!");
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
      setAnimationProgress(0);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow bg-black">
          <div className="max-w-sm mx-auto p-6 mt-10 bg-black text-white">
            <h1 className="text-xl font-semibold text-center mb-6 mt-4">Get Your Certificate</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-7">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    backgroundColor: "#374151",
                    border: "1px solid #4b5563",
                    color: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="mb-7">
                <label
                  htmlFor="event-name"
                  className="block mb-2 text-sm font-medium"
                >
                  Event Name
                </label>
                <input
                  type="text"
                  id="event-name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  style={{
                    backgroundColor: "#374151",
                    border: "1px solid #4b5563",
                    color: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                  placeholder="Enter the event name"
                  required
                />
              </div>

              <div className="flex items-start mb-5">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    value=""
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "1px solid #4b5563",
                      borderRadius: "4px",
                    }}
                    required
                  />
                </div>
                <label htmlFor="terms" style={{ marginLeft: "10px", fontSize: "14px" }}>
                  I agree with the{" "}
                  <a href="#" style={{ color: "#2563eb", textDecoration: "underline" }}>
                    terms and conditions
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  position: "relative",
                  width: "100%",
                  background: isLoading
                    ? `linear-gradient(to right, #1e40af ${animationProgress}%, #3b82f6 ${animationProgress}%)`
                    : "#1e40af",
                  color: "white",
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "background 0.3s ease",
                }}
              >
                {isLoading ? "Generating..." : "Get Certificate"}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default GenerateCertificate;
