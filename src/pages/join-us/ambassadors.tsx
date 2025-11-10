import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { useAmbassadorIntake } from "@/lib/hooks/ambassadorIntake";
import type { IntakeStatus, IntakeInfo } from "@/lib/hooks/intake";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";

const JoinAsAmbassador = () => {
  const router = useRouter();
  const { fetchStatus, fetchInfo, submitForm } = useAmbassadorIntake();

  const [intakeStatus, setIntakeStatus] = useState<IntakeStatus | null>(null);
  const [intakeInfo, setIntakeInfo] = useState<IntakeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [batch, setBatch] = useState("");
  const [about, setAbout] = useState("");
  const [reason_to_join, setReason_to_join] = useState("");
  const [interest, setInterest] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [positions, setPositions] = useState("");
  const [timeAvailability, setTimeAvailability] = useState("");
  const [ecastFullForm, setEcastFullForm] = useState("");

  const [link1, setLink1] = useState("");
  const [link2, setLink2] = useState("");
  const [link3, setLink3] = useState("");

  useEffect(() => {
    const fetchIntakeData = async () => {
      try {
        setLoading(true);
        const statusData = await fetchStatus();
        setIntakeStatus(statusData);
        const infoData = await fetchInfo();
        setIntakeInfo(infoData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch intake information. Please try again later.");
        setLoading(false);
      }
    };
    fetchIntakeData();
  }, [fetchStatus, fetchInfo]);

  const showAlert = (message: string) => {
    const bgOverlay = document.createElement("div");
    bgOverlay.className = "fixed inset-0 bg-black bg-opacity-50 z-50";
    const alertBox = document.createElement("div");
    alertBox.className =
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-6 rounded shadow-lg z-50 max-w-xs w-full text-center";
    const closeButton = document.createElement("button");
    closeButton.className = "absolute top-0 right-0 mt-2 mr-2 text-black";
    closeButton.innerHTML = "&times;";
    closeButton.onclick = () => {
      document.body.removeChild(alertBox);
      document.body.removeChild(bgOverlay);
    };
    alertBox.appendChild(closeButton);
    const messageParagraph = document.createElement("p");
    messageParagraph.innerText = message;
    alertBox.appendChild(messageParagraph);
    document.body.appendChild(bgOverlay);
    document.body.appendChild(alertBox);
  };

  const redirectToHome = () => {
    router.push("/");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!intakeStatus?.is_open) {
      showAlert("Ambassador enrollment is currently closed. Please check back later.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    formData.append("name", name);
    formData.append("campus_roll", rollNo);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("batch", batch);
    formData.append("about", about);
    formData.append("reason_to_join", reason_to_join);
    formData.append("interests", interest);
    formData.append("post", positions);
    if (resume) formData.append("resume", resume);
    formData.append("github_link", link2);
    formData.append("facebook_link", link3);
    formData.append("linkedin_link", link1);
    formData.append("time_availability", timeAvailability);
    formData.append("ecast_full_form_answer", ecastFullForm);
    try {
      await submitForm(formData);
      setIsSubmitting(false);
      setFormSubmitted(true);
      setTimeout(() => {
        redirectToHome();
      }, 3000);
    } catch (error: any) {
      console.log("Submission error:", error);
      setIsSubmitting(false);
      const errorMessage = error?.message || "An unexpected error occurred. Please try again.";
      showAlert(errorMessage);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      setResumeName(e.target.files[0].name);
    }
  };

  const handleFileClick = () => {
    const cvElement = document.getElementById("cv") as HTMLInputElement | null;
    if (cvElement) cvElement.click();
  };

  const isBatchAvailable = (batchCode: string): boolean => {
    if (!intakeStatus?.available_batches) return true;
    return intakeStatus.available_batches.includes(batchCode);
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="bg-black min-h-screen flex items-center justify-center pt-20">
          <div className="text-gray-800 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-xl">Loading intake information...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="bg-gray-50 min-h-screen flex items-center justify-center pt-20">
          <div className="text-gray-800 text-center max-w-md mx-4">
            <p className="text-xl mb-4">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
            >
              Go Back Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!intakeStatus?.is_open) {
    return (
      <>
        <NavBar />
        <div className="bg-black min-h-screen flex items-center justify-center pt-20 pb-10">
          <div className="max-w-4xl mx-4 px-6 text-center">
            <h1 className="text-3xl font-bold mb-4 text-slate-600">Ambassador Enrollment Closed</h1>
            <p className="text-xl mb-6 text-gray-400">
              {intakeStatus?.message || "Ambassador intake is currently closed"}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition font-bold shadow-lg hover:shadow-xl"
            >
              Return to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="bg-black min-h-screen pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-600 mb-4">
              Join as Ambassador
            </h1>
            <p className="text-lg text-gray-400">Be the face of ECAST in your community</p>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </div>

          <div className="mb-8 bg-green-900/30 border-l-4 border-green-500 p-6 rounded-r-lg shadow-sm">
            <div className="flex items-center mb-2">
              <span className="text-green-400 font-semibold text-lg">
                Ambassador Enrollment is Currently Open!
              </span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-lg p-8 md:p-10 border border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 font-semibold mb-2" htmlFor="name">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  disabled={isSubmitting || formSubmitted}
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-2" htmlFor="rollNo">
                  Campus Roll (if any)
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                  type="text"
                  id="rollNo"
                  name="rollNo"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="Optional"
                  disabled={isSubmitting || formSubmitted}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2" htmlFor="batch">
                    Batch <span className="text-red-600">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                    id="batch"
                    name="batch"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    required
                    disabled={isSubmitting || formSubmitted}
                  >
                    <option value="" className="text-gray-500">
                      Select your batch
                    </option>
                    {intakeInfo?.batches.map((b) => (
                      <option
                        key={b.code}
                        value={b.code}
                        disabled={!isBatchAvailable(b.code)}
                      >
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2" htmlFor="email">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={isSubmitting || formSubmitted}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-2" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                    type="text"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Optional"
                    disabled={isSubmitting || formSubmitted}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-2" htmlFor="about">
                  About You <span className="text-red-600">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                  id="about"
                  name="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell us about yourself"
                  required
                  disabled={isSubmitting || formSubmitted}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-2" htmlFor="reason">
                  Why do you want to be an ambassador?
                  <span className="text-red-600">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                  id="reason"
                  name="reason"
                  value={reason_to_join}
                  onChange={(e) => setReason_to_join(e.target.value)}
                  placeholder="Your motivation"
                  required
                  disabled={isSubmitting || formSubmitted}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-2" htmlFor="interests">
                  Your Interests <span className="text-red-600">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                  id="interests"
                  name="interests"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  placeholder="Areas you are passionate about"
                  required
                  disabled={isSubmitting || formSubmitted}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-2" htmlFor="post">
                  Preferred Area / Post <span className="text-red-600">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                  type="text"
                  id="post"
                  name="post"
                  value={positions}
                  onChange={(e) => setPositions(e.target.value)}
                  placeholder="e.g., Outreach, Events, Social"
                  required
                  disabled={isSubmitting || formSubmitted}
                />
              </div>

              {/* Time Availability */}
              <div>
                <label className="block text-gray-300 font-semibold mb-2" htmlFor="time_availability">
                  Time Availability
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                  id="time_availability"
                  name="time_availability"
                  value={timeAvailability}
                  onChange={(e) => setTimeAvailability(e.target.value)}
                  placeholder="e.g., 5 hrs/week, evenings or weekends"
                  disabled={isSubmitting || formSubmitted}
                  rows={3}
                />
              </div>

              {/* Fun question */}
              <div>
                <label className="block text-gray-300 font-semibold mb-2" htmlFor="ecast_full_form">
                  Fun question: What is the full form of ECAST?
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                  type="text"
                  id="ecast_full_form"
                  name="ecast_full_form"
                  value={ecastFullForm}
                  onChange={(e) => setEcastFullForm(e.target.value)}
                  placeholder="Write the full form"
                  disabled={isSubmitting || formSubmitted}
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-2">Resume (PDF) <span className="text-red-600">*</span></label>
                <input id="cv" name="cv" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                <button
                  type="button"
                  onClick={handleFileClick}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  disabled={isSubmitting || formSubmitted}
                >
                  {resumeName ? `Selected: ${resumeName}` : "Upload Resume"}
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2" htmlFor="linkedin">
                    LinkedIn
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={link1}
                    onChange={(e) => setLink1(e.target.value)}
                    placeholder="https://linkedin.com/in/you"
                    disabled={isSubmitting || formSubmitted}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-2" htmlFor="github">
                    GitHub
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                    type="url"
                    id="github"
                    name="github"
                    value={link2}
                    onChange={(e) => setLink2(e.target.value)}
                    placeholder="https://github.com/you"
                    disabled={isSubmitting || formSubmitted}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-2" htmlFor="facebook">
                    Facebook
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition placeholder-gray-500"
                    type="url"
                    id="facebook"
                    name="facebook"
                    value={link3}
                    onChange={(e) => setLink3(e.target.value)}
                    placeholder="https://facebook.com/you"
                    disabled={isSubmitting || formSubmitted}
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition font-bold shadow-lg hover:shadow-xl disabled:opacity-60"
                  disabled={isSubmitting || formSubmitted}
                >
                  {isSubmitting ? "Submitting..." : formSubmitted ? "Submitted" : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JoinAsAmbassador;
