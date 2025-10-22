import { useEffect, useState } from "react";
import Router from "next/router";
import NavBar from "@/components/nav";
import Sidebar from "@/components/Sidebar";
import ProfilePictureModal from "@/components/ProfilePictureModal";
import Footer from "@/components/footar";
import {
  DocumentTextIcon,
  TrophyIcon,
  HomeIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function AlumniDashboard() {
  const [authReady, setAuthReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarUser, setSidebarUser] = useState<{
    name: string;
    role?: string;
    avatarUrl?: string;
  }>();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const access = localStorage.getItem("access");
    const role = userStr ? JSON.parse(userStr)?.role : null;
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setSidebarUser({
          name: u.full_name || u.username,
          role: u.role,
          avatarUrl: u.user_photo || u.committee_member_photo,
        });
      } catch {}
    }
    if (!access || role !== "ALUMNI") {
      Router.replace("/login");
    } else {
      setAuthReady(true);
      fetch(`${base}/api/auth/mystats/`, {
        headers: { Authorization: `Bearer ${access}` },
      })
        .then((r) => r.json())
        .then(setStats)
        .catch(() => {});
    }
  }, []);

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const access = localStorage.getItem("access") || "";
    const form = new FormData();
    form.append("title", title);
    form.append("description", desc);
    form.append("content", content);
    if (cover) form.append("cover_image", cover);
    const res = await fetch(`${base}/api/blog/posts/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${access}` },
      body: form,
    });
    if (res.ok) {
      setMsg("Blog submitted for approval");
      setTitle("");
      setDesc("");
      setContent("");
      setCover(null);
    } else {
      setMsg("Failed to submit");
    }
  };

  const handleProfileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("user_photo", file);

    const access = localStorage.getItem("access");
    const response = await fetch(`${base}/api/auth/profile/update/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${access}` },
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");

    const updated = await response.json();
    // Update sidebar user
    setSidebarUser((prev) => ({
      ...prev!,
      avatarUrl: updated.user_photo || updated.committee_member_photo,
    }));
    // Update localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      user.user_photo = updated.user_photo;
      user.committee_member_photo = updated.committee_member_photo;
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  if (!authReady) return null;

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen">
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-20 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-gray-800 p-3 rounded-lg shadow-lg hover:bg-gray-700 transition"
          >
            {sidebarOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Sidebar */}
        <Sidebar
          expanded={!sidebarCollapsed}
          setExpanded={(v) => setSidebarCollapsed(!v)}
          user={sidebarUser}
          onProfileClick={() => setShowProfileModal(true)}
          groups={[
            {
              title: "Main Menu",
              items: [
                {
                  id: "overview",
                  label: "Overview",
                  icon: HomeIcon as any,
                  active: activeSection === "overview",
                  onClick: () => setActiveSection("overview"),
                },
                {
                  id: "publish",
                  label: "Publish Blog",
                  icon: DocumentTextIcon as any,
                  active: activeSection === "publish",
                  onClick: () => setActiveSection("publish"),
                },
                {
                  id: "leaderboard",
                  label: "Leaderboard",
                  icon: TrophyIcon as any,
                  active: activeSection === "leaderboard",
                  onClick: () => setActiveSection("leaderboard"),
                },
              ],
            },
          ]}
        />

        {/* Profile Picture Modal */}
        <ProfilePictureModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentImage={sidebarUser?.avatarUrl}
          userName={sidebarUser?.name || "User"}
          onUpload={handleProfileUpload}
        />

        {/* Main Content */}
        <div
          className={`${
            sidebarCollapsed ? "ml-20" : "ml-64"
          } p-6 pt-24 transition-all duration-300`}
        >
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Alumni Dashboard
              </h1>

              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-900/50 to-green-600/30 p-6 rounded-xl border border-green-500/20 shadow-xl">
                    <ChartBarIcon className="w-10 h-10 mb-3 text-green-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      Blogs Approved
                    </h3>
                    <p className="text-4xl font-bold text-green-300 mb-3">
                      {stats.blogs_approved || 0}
                    </p>
                    <div className="bg-gray-800 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-300 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (stats.blogs_approved || 0) * 10
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-600/30 p-6 rounded-xl border border-yellow-500/20 shadow-xl">
                    <DocumentTextIcon className="w-10 h-10 mb-3 text-yellow-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      Blogs Pending
                    </h3>
                    <p className="text-4xl font-bold text-yellow-300 mb-3">
                      {stats.blogs_pending || 0}
                    </p>
                    <div className="bg-gray-800 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (stats.blogs_pending || 0) * 10
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="w-6 h-6 text-orange-400" />
                  Quick Actions
                </h3>
                <button
                  onClick={() => setActiveSection("publish")}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 p-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  Publish New Blog
                </button>
              </div>
            </div>
          )}

          {/* Publish Blog Section */}
          {activeSection === "publish" && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-orange-400" />
                Publish Blog
              </h1>
              <form
                onSubmit={publish}
                className="bg-gray-800/50 backdrop-blur p-8 rounded-xl border border-gray-700 shadow-xl space-y-5"
              >
                {msg && (
                  <div
                    className={`p-4 rounded-lg ${
                      msg.includes("Failed")
                        ? "bg-red-900/50 text-red-300"
                        : "bg-green-900/50 text-green-300"
                    }`}
                  >
                    {msg}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Title
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="Enter blog title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Short Description
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="Brief description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Content
                  </label>
                  <textarea
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg h-40 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="Write your blog content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Cover Image
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-600 file:text-white hover:file:bg-orange-700 transition"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCover(e.target.files?.[0] || null)}
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 p-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Submit Blog
                </button>
              </form>
            </div>
          )}

          {/* Leaderboard Section */}
          {activeSection === "leaderboard" && (
            <div>
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <TrophyIcon className="w-8 h-8 text-yellow-400" />
                Leaderboard
              </h1>
              <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                <p className="text-gray-400">
                  Redirecting to leaderboard page...
                </p>
                <button
                  onClick={() => Router.push("/leaderboard")}
                  className="mt-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 px-6 py-3 rounded-lg font-semibold shadow-lg transition"
                >
                  Go to Leaderboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
