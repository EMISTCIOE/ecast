import { useEffect, useState } from "react";
import Router from "next/router";
import NavBar from "@/components/nav";
import Sidebar from "@/components/Sidebar";
import ProfilePictureModal from "@/components/ProfilePictureModal";
import Footer from "@/components/footar";
import { useBlogs } from "@/lib/hooks/blogs";
import RichTextEditor from "@/components/RichTextEditor";
import { useTasks } from "@/lib/hooks/tasks";
import MySubmissions from "@/components/MySubmissions";
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  TrophyIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function AmbassadorDashboard() {
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
  const [tasks, setTasks] = useState<any[]>([]);
  const [subMsg, setSubMsg] = useState("");
  const [selTask, setSelTask] = useState("");
  const [subText, setSubText] = useState("");
  const [subFile, setSubFile] = useState<File | null>(null);
  const [stats, setStats] = useState<any>(null);

  const { create: createBlog } = useBlogs();
  const { listAssigned, submit } = useTasks();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const access = localStorage.getItem("access");
    const role = userStr ? JSON.parse(userStr)?.role : null;
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const raw = u.user_photo || u.committee_member_photo || '';
        const avatar = raw ? (raw.startsWith('http') ? raw : `${process.env.NEXT_PUBLIC_API_BASE || ''}${raw}`) : undefined;
        setSidebarUser({
          name: u.full_name || u.username,
          role: u.role,
          avatarUrl: avatar,
        });
      } catch {}
    }
    if (!access || role !== "AMBASSADOR") {
      Router.replace("/login");
    } else {
      setAuthReady(true);
      listAssigned()
        .then(setTasks)
        .catch(() => {});
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
    const form = new FormData();
    form.append("title", title);
    form.append("description", desc);
    form.append("content", content);
    if (cover) form.append("cover_image", cover);
    try {
      await createBlog(form);
      setMsg("Blog submitted for approval");
    } catch {
      setMsg("Failed to publish");
    }
  };

  // Rich text editor handles image uploads via its toolbar

  if (!authReady) return null;

  const submitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubMsg("");
    if (!selTask) { setSubMsg('Please select a task.'); return; }
    if (!subText.trim() && !subFile) { setSubMsg('Please add notes or attach a file.'); return; }
    const form = new FormData();
    form.append("task", selTask);
    form.append("content", subText);
    if (subFile) form.append("attachment", subFile);
    try {
      await submit(form);
      setSubMsg("Submitted for review");
      setSelTask('');
      setSubText('');
      setSubFile(null);
    } catch {
      setSubMsg("Submission failed");
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

  const menuItems = [
    { id: "overview", name: "Overview", icon: HomeIcon },
    { id: "publish", name: "Publish Blog", icon: DocumentTextIcon },
    { id: "submit", name: "Submit Task", icon: ClipboardDocumentCheckIcon },
    { id: "submissions", name: "My Submissions", icon: ChartBarIcon },
    { id: "leaderboard", name: "Leaderboard", icon: TrophyIcon },
  ];

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
                  id: "submit",
                  label: "Submit Task",
                  icon: ClipboardDocumentCheckIcon as any,
                  active: activeSection === "submit",
                  onClick: () => setActiveSection("submit"),
                },
                {
                  id: "submissions",
                  label: "My Submissions",
                  icon: ChartBarIcon as any,
                  active: activeSection === "submissions",
                  onClick: () => setActiveSection("submissions"),
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
              <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ambassador Dashboard
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

                  <div className="bg-gradient-to-br from-blue-900/50 to-blue-600/30 p-6 rounded-xl border border-blue-500/20 shadow-xl">
                    <ClipboardDocumentCheckIcon className="w-10 h-10 mb-3 text-blue-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      Tasks Approved
                    </h3>
                    <p className="text-4xl font-bold text-blue-300 mb-3">
                      {stats.submissions_approved || 0}
                    </p>
                    <div className="bg-gray-800 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-300 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (stats.submissions_approved || 0) * 10
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ClipboardDocumentCheckIcon className="w-6 h-6 text-yellow-400" />
                  Your Assigned Tasks ({tasks.length})
                </h3>
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">
                      No tasks assigned yet
                    </p>
                  ) : (
                    tasks.map((t: any) => (
                      <div
                        key={t.id}
                        className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition"
                      >
                        <h4 className="font-semibold text-yellow-300">
                          {t.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {t.description}
                        </p>
                        {t.due_date && (
                          <p className="text-xs text-gray-500 mt-2">
                            Due: {new Date(t.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Publish Blog Section */}
          {activeSection === "publish" && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-green-400" />
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
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                  <RichTextEditor value={content} onChange={setContent} />
                  <div className="mt-3">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const el =
                            document.getElementById("amb-blog-preview");
                          if (!el) return;
                          el.classList.toggle("hidden", !e.target.checked);
                        }}
                      />
                      Preview
                    </label>
                  </div>
                  <div
                    id="amb-blog-preview"
                    className="hidden mt-3 p-4 bg-gray-950 border border-gray-800 rounded"
                  >
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Cover Image
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700 transition"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCover(e.target.files?.[0] || null)}
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 p-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Publish Blog
                </button>
              </form>
            </div>
          )}

          {/* Submit Task Section */}
          {activeSection === "submit" && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <ClipboardDocumentCheckIcon className="w-8 h-8 text-blue-400" />
                Submit Task
              </h1>
              <form
                onSubmit={submitTask}
                className="bg-gray-800/50 backdrop-blur p-8 rounded-xl border border-gray-700 shadow-xl space-y-5"
              >
                {subMsg && (
                  <div
                    className={`p-4 rounded-lg ${
                      subMsg.includes("failed")
                        ? "bg-red-900/50 text-red-300"
                        : "bg-green-900/50 text-green-300"
                    }`}
                  >
                    {subMsg}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Select Task
                  </label>
                  <select
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={selTask}
                    onChange={(e) => setSelTask(e.target.value)}
                    required
                  >
                    <option value="">Choose a task...</option>
                    {tasks.map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Notes or Description
                  </label>
                  <textarea
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Describe your submission..."
                    value={subText}
                    onChange={(e) => setSubText(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Attachment (optional)
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
                    type="file"
                    onChange={(e) => setSubFile(e.target.files?.[0] || null)}
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Submit Task
                </button>
              </form>
            </div>
          )}

          {/* My Submissions */}
          {activeSection === "submissions" && (
            <div>
              <h1 className="text-3xl font-bold mb-6">My Submissions</h1>
              <MySubmissions role={'AMBASSADOR'} showTasks={true} />
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
