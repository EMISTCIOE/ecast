import { useEffect, useState } from "react";
import Router from "next/router";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";
import { useBlogs } from "@/lib/hooks/blogs";
import { useNotices } from "@/lib/hooks/notices";
import { useAdmin } from "@/lib/hooks/admin";
import { useEvents } from "@/lib/hooks/events";
import { useProjects } from "@/lib/hooks/projects";
import {
  BellIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  HomeIcon,
  TrophyIcon,
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  CalendarIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function AdminDashboard() {
  const [authReady, setAuthReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [noticeMsg, setNoticeMsg] = useState("");
  const [blogMsg, setBlogMsg] = useState("");
  const [committeeMsg, setCommitteeMsg] = useState("");
  const [taskMsg, setTaskMsg] = useState("");

  // Notice form
  const [nTitle, setNTitle] = useState("");
  const [nContent, setNContent] = useState("");
  const [nAudience, setNAudience] = useState("ALL");

  // Blog form
  const [bTitle, setBTitle] = useState("");
  const [bDesc, setBDesc] = useState("");
  const [bContent, setBContent] = useState("");
  const [bCover, setBCover] = useState<File | null>(null);

  // Committee member form
  const [cmUsername, setCmUsername] = useState("");
  const [cmEmail, setCmEmail] = useState("");
  const [cmFirst, setCmFirst] = useState("");
  const [cmLast, setCmLast] = useState("");
  const [cmPosition, setCmPosition] = useState("");
  const [cmStart, setCmStart] = useState("");
  const [cmTenure, setCmTenure] = useState<number | "">("");
  const [cmPhoto, setCmPhoto] = useState("");

  // Tasks
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [tTitle, setTTitle] = useState("");
  const [tDesc, setTDesc] = useState("");
  const [tAssignee, setTAssignee] = useState("");
  const [tDue, setTDue] = useState("");

  // Moderation lists
  const [pendingBlogs, setPendingBlogs] = useState<any[]>([]);
  const [pendingNotices, setPendingNotices] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [pendingProjects, setPendingProjects] = useState<any[]>([]);
  const [pendingSubs, setPendingSubs] = useState<any[]>([]);

  const {
    list: listBlogs,
    approve: approveBlog,
    create: createBlogApi,
  } = useBlogs();
  const {
    list: listNotices,
    approve: approveNotice,
    create: createNoticeApi,
  } = useNotices();
  const { list: listEvents, approve: approveEvent } = useEvents();
  const { list: listProjects, approve: approveProject } = useProjects();
  const {
    listUsers,
    createCommitteeMember: createCommitteeApi,
    pendingSubmissions: pendingSubsApi,
    reviewSubmission: reviewApi,
    createTask: createTaskApi,
  } = useAdmin();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const access = localStorage.getItem("access");
    const role = userStr ? JSON.parse(userStr)?.role : null;
    if (!access || role !== "ADMIN") {
      Router.replace("/login");
    } else {
      setAuthReady(true);
      // preload ambassadors and pending items
      listUsers("AMBASSADOR")
        .then(setAmbassadors)
        .catch(() => {});
      listBlogs({ status: "PENDING" })
        .then(setPendingBlogs)
        .catch(() => {});
      listNotices({ status: "PENDING" })
        .then(setPendingNotices)
        .catch(() => {});
      listEvents({ status: "PENDING" })
        .then(setPendingEvents)
        .catch(() => {});
      listProjects({ status: "PENDING" })
        .then(setPendingProjects)
        .catch(() => {});
      pendingSubsApi()
        .then(setPendingSubs)
        .catch(() => {});
    }
  }, []);

  const createNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeMsg("");
    try {
      await createNoticeApi({
        title: nTitle,
        content: nContent,
        audience: nAudience,
      });
      setNoticeMsg("Notice published");
    } catch {
      setNoticeMsg("Failed to publish");
    }
  };

  const createBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogMsg("");
    const form = new FormData();
    form.append("title", bTitle);
    form.append("description", bDesc);
    form.append("content", bContent);
    if (bCover) form.append("cover_image", bCover);
    try {
      await createBlogApi(form);
      setBlogMsg("Blog published");
    } catch {
      setBlogMsg("Failed to publish");
    }
  };

  const createCommitteeMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommitteeMsg("");
    try {
      await createCommitteeApi({
        username: cmUsername,
        email: cmEmail,
        first_name: cmFirst,
        last_name: cmLast,
        position: cmPosition,
        started_from: cmStart,
        tenure: cmTenure || 0,
        memberPhoto: cmPhoto,
      });
      setCommitteeMsg("Committee member created (email sent).");
    } catch {
      setCommitteeMsg("Failed to create committee member");
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskMsg("");
    try {
      await createTaskApi({
        title: tTitle,
        description: tDesc,
        assigned_to: tAssignee,
        due_date: tDue,
      });
      setTaskMsg("Task assigned");
    } catch {
      setTaskMsg("Failed to assign task");
    }
  };

  const approve = async (
    type: "blog" | "notice" | "event" | "project",
    idOrSlug: string
  ) => {
    try {
      if (type === "blog") await approveBlog(idOrSlug);
      else if (type === "notice") await approveNotice(idOrSlug);
      else if (type === "event") await approveEvent(idOrSlug);
      else await approveProject(idOrSlug);
    } catch {}
    listBlogs({ status: "PENDING" })
      .then(setPendingBlogs)
      .catch(() => {});
    listNotices({ status: "PENDING" })
      .then(setPendingNotices)
      .catch(() => {});
    listEvents({ status: "PENDING" })
      .then(setPendingEvents)
      .catch(() => {});
    listProjects({ status: "PENDING" })
      .then(setPendingProjects)
      .catch(() => {});
  };

  const reviewSubmission = async (
    id: string,
    decision: "approve" | "reject"
  ) => {
    await reviewApi(id, decision);
    pendingSubsApi().then(setPendingSubs);
  };

  if (!authReady) return null;

  const menuItems = [
    { id: "overview", name: "Overview", icon: HomeIcon },
    { id: "notices", name: "Publish Notice", icon: BellIcon },
    { id: "blogs", name: "Publish Blog", icon: DocumentTextIcon },
    { id: "committee", name: "Add Member", icon: UserGroupIcon },
    { id: "tasks", name: "Assign Task", icon: ClipboardDocumentCheckIcon },
    { id: "moderation", name: "Moderation", icon: ClockIcon },
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
        <aside
          className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 z-40 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 mt-16 shadow-2xl`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg scale-105"
                        : "hover:bg-gray-800 hover:scale-102"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:ml-64 p-6 pt-24">
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-900/50 to-purple-600/30 p-6 rounded-xl border border-purple-500/20 shadow-xl hover:shadow-purple-500/20 transition">
                  <BellIcon className="w-10 h-10 mb-3 text-purple-400" />
                  <h3 className="text-lg font-semibold mb-1">
                    Pending Notices
                  </h3>
                  <p className="text-3xl font-bold text-purple-300">
                    {pendingNotices.length}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-pink-900/50 to-pink-600/30 p-6 rounded-xl border border-pink-500/20 shadow-xl hover:shadow-pink-500/20 transition">
                  <DocumentTextIcon className="w-10 h-10 mb-3 text-pink-400" />
                  <h3 className="text-lg font-semibold mb-1">Pending Blogs</h3>
                  <p className="text-3xl font-bold text-pink-300">
                    {pendingBlogs.length}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-900/50 to-blue-600/30 p-6 rounded-xl border border-blue-500/20 shadow-xl hover:shadow-blue-500/20 transition">
                  <CalendarIcon className="w-10 h-10 mb-3 text-blue-400" />
                  <h3 className="text-lg font-semibold mb-1">Pending Events</h3>
                  <p className="text-3xl font-bold text-blue-300">
                    {pendingEvents.length}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-900/50 to-green-600/30 p-6 rounded-xl border border-green-500/20 shadow-xl hover:shadow-green-500/20 transition">
                  <FolderIcon className="w-10 h-10 mb-3 text-green-400" />
                  <h3 className="text-lg font-semibold mb-1">
                    Pending Projects
                  </h3>
                  <p className="text-3xl font-bold text-green-300">
                    {pendingProjects.length}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ClipboardDocumentCheckIcon className="w-6 h-6 text-yellow-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveSection("notices")}
                      className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg transition flex items-center gap-2"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      Publish Notice
                    </button>
                    <button
                      onClick={() => setActiveSection("blogs")}
                      className="w-full bg-pink-600 hover:bg-pink-700 p-3 rounded-lg transition flex items-center gap-2"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      Publish Blog
                    </button>
                    <button
                      onClick={() => setActiveSection("tasks")}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 p-3 rounded-lg transition flex items-center gap-2"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      Assign Task
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ClockIcon className="w-6 h-6 text-orange-400" />
                    Recent Activity
                  </h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• {pendingSubs.length} pending task submissions</p>
                    <p>• {ambassadors.length} active ambassadors</p>
                    <p>
                      • Total pending approvals:{" "}
                      {pendingBlogs.length +
                        pendingNotices.length +
                        pendingEvents.length +
                        pendingProjects.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Publish Notice Section */}
          {activeSection === "notices" && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <BellIcon className="w-8 h-8 text-purple-400" />
                Publish Notice
              </h1>
              <form
                onSubmit={createNotice}
                className="bg-gray-800/50 backdrop-blur p-8 rounded-xl border border-gray-700 shadow-xl space-y-5"
              >
                {noticeMsg && (
                  <div
                    className={`p-4 rounded-lg ${
                      noticeMsg.includes("Failed")
                        ? "bg-red-900/50 text-red-300"
                        : "bg-green-900/50 text-green-300"
                    }`}
                  >
                    {noticeMsg}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Title
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Enter notice title"
                    value={nTitle}
                    onChange={(e) => setNTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Content
                  </label>
                  <textarea
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg h-40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Enter notice content"
                    value={nContent}
                    onChange={(e) => setNContent(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Audience
                  </label>
                  <select
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    value={nAudience}
                    onChange={(e) => setNAudience(e.target.value)}
                  >
                    <option value="ALL">All</option>
                    <option value="MEMBERS">Members</option>
                    <option value="AMBASSADORS">Ambassadors</option>
                  </select>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <BellIcon className="w-5 h-5" />
                  Publish Notice
                </button>
              </form>
            </div>
          )}

          {/* Publish Blog Section */}
          {activeSection === "blogs" && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-pink-400" />
                Publish Blog
              </h1>
              <form
                onSubmit={createBlog}
                className="bg-gray-800/50 backdrop-blur p-8 rounded-xl border border-gray-700 shadow-xl space-y-5"
              >
                {blogMsg && (
                  <div
                    className={`p-4 rounded-lg ${
                      blogMsg.includes("Failed")
                        ? "bg-red-900/50 text-red-300"
                        : "bg-green-900/50 text-green-300"
                    }`}
                  >
                    {blogMsg}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Title
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    placeholder="Enter blog title"
                    value={bTitle}
                    onChange={(e) => setBTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Short Description
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    placeholder="Brief description"
                    value={bDesc}
                    onChange={(e) => setBDesc(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Content
                  </label>
                  <textarea
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg h-40 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    placeholder="Write your blog content here..."
                    value={bContent}
                    onChange={(e) => setBContent(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Cover Image
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-600 file:text-white hover:file:bg-pink-700 transition"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBCover(e.target.files?.[0] || null)}
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 p-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <DocumentTextIcon className="w-5 h-5" />
                  Publish Blog
                </button>
              </form>
            </div>
          )}

          {/* Create Committee Member Section */}
          {activeSection === "committee" && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <UserGroupIcon className="w-8 h-8 text-blue-400" />
                Create Committee Member
              </h1>
              <form
                onSubmit={createCommitteeMember}
                className="bg-gray-800/50 backdrop-blur p-8 rounded-xl border border-gray-700 shadow-xl space-y-5"
              >
                {committeeMsg && (
                  <div
                    className={`p-4 rounded-lg ${
                      committeeMsg.includes("Failed")
                        ? "bg-red-900/50 text-red-300"
                        : "bg-green-900/50 text-green-300"
                    }`}
                  >
                    {committeeMsg}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Username
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="username"
                    value={cmUsername}
                    onChange={(e) => setCmUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Email
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="email@example.com"
                    type="email"
                    value={cmEmail}
                    onChange={(e) => setCmEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      First Name
                    </label>
                    <input
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="First name"
                      value={cmFirst}
                      onChange={(e) => setCmFirst(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Last Name
                    </label>
                    <input
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Last name"
                      value={cmLast}
                      onChange={(e) => setCmLast(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Position
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="e.g., President, Secretary"
                    value={cmPosition}
                    onChange={(e) => setCmPosition(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Start Date
                    </label>
                    <input
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      type="date"
                      value={cmStart}
                      onChange={(e) => setCmStart(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Tenure (years)
                    </label>
                    <input
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      type="number"
                      placeholder="2"
                      value={cmTenure}
                      onChange={(e) => setCmTenure(e.target.value as any)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Photo URL
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="https://..."
                    value={cmPhoto}
                    onChange={(e) => setCmPhoto(e.target.value)}
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 p-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <UserGroupIcon className="w-5 h-5" />
                  Create Member
                </button>
              </form>
            </div>
          )}

          {/* Assign Task Section */}
          {activeSection === "tasks" && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <ClipboardDocumentCheckIcon className="w-8 h-8 text-yellow-400" />
                Assign Task to Ambassador
              </h1>
              <form
                onSubmit={createTask}
                className="bg-gray-800/50 backdrop-blur p-8 rounded-xl border border-gray-700 shadow-xl space-y-5"
              >
                {taskMsg && (
                  <div
                    className={`p-4 rounded-lg ${
                      taskMsg.includes("Failed")
                        ? "bg-red-900/50 text-red-300"
                        : "bg-green-900/50 text-green-300"
                    }`}
                  >
                    {taskMsg}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Task Title
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                    placeholder="Enter task title"
                    value={tTitle}
                    onChange={(e) => setTTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg h-32 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                    placeholder="Describe the task..."
                    value={tDesc}
                    onChange={(e) => setTDesc(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Assign to Ambassador
                  </label>
                  <select
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                    value={tAssignee}
                    onChange={(e) => setTAssignee(e.target.value)}
                    required
                  >
                    <option value="">Select Ambassador</option>
                    {ambassadors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.full_name || a.username} ({a.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Due Date
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                    type="date"
                    value={tDue}
                    onChange={(e) => setTDue(e.target.value)}
                    required
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 p-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <ClipboardDocumentCheckIcon className="w-5 h-5" />
                  Assign Task
                </button>
              </form>
            </div>
          )}

          {/* Moderation Section */}
          {activeSection === "moderation" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <ClockIcon className="w-8 h-8 text-orange-400" />
                Moderation Queue
              </h1>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Pending Blogs */}
                <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DocumentTextIcon className="w-6 h-6 text-pink-400" />
                    Pending Blogs ({pendingBlogs.length})
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingBlogs.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        No pending blogs
                      </p>
                    ) : (
                      pendingBlogs.map((b: any) => (
                        <div
                          key={b.id}
                          className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-pink-500 transition"
                        >
                          <div className="mb-2">
                            <h3 className="font-semibold text-pink-300">
                              {b.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              by {b.author_username}
                            </p>
                          </div>
                          <button
                            className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                            onClick={() => approve("blog", b.slug)}
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Pending Notices */}
                <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BellIcon className="w-6 h-6 text-purple-400" />
                    Pending Notices ({pendingNotices.length})
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingNotices.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        No pending notices
                      </p>
                    ) : (
                      pendingNotices.map((n: any) => (
                        <div
                          key={n.id}
                          className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition"
                        >
                          <div className="mb-2">
                            <h3 className="font-semibold text-purple-300">
                              {n.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              Audience: {n.audience}
                            </p>
                          </div>
                          <button
                            className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                            onClick={() => approve("notice", n.id)}
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Pending Events */}
                <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-blue-400" />
                    Pending Events ({pendingEvents.length})
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingEvents.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        No pending events
                      </p>
                    ) : (
                      pendingEvents.map((e: any) => (
                        <div
                          key={e.id}
                          className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition"
                        >
                          <div className="mb-2">
                            <h3 className="font-semibold text-blue-300">
                              {e.title}
                            </h3>
                            <p className="text-sm text-gray-400">{e.date}</p>
                          </div>
                          <button
                            className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                            onClick={() => approve("event", e.slug)}
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Pending Projects */}
                <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FolderIcon className="w-6 h-6 text-green-400" />
                    Pending Projects ({pendingProjects.length})
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingProjects.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        No pending projects
                      </p>
                    ) : (
                      pendingProjects.map((p: any) => (
                        <div
                          key={p.id}
                          className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-green-500 transition"
                        >
                          <div className="mb-2">
                            <h3 className="font-semibold text-green-300">
                              {p.title}
                            </h3>
                          </div>
                          <button
                            className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                            onClick={() => approve("project", p.id)}
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Pending Task Submissions */}
              <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ClipboardDocumentCheckIcon className="w-6 h-6 text-yellow-400" />
                  Pending Task Submissions ({pendingSubs.length})
                </h2>
                <div className="space-y-3">
                  {pendingSubs.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">
                      No pending submissions
                    </p>
                  ) : (
                    pendingSubs.map((s: any) => (
                      <div
                        key={s.id}
                        className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-semibold text-yellow-300">
                            Submission #{s.id}
                          </h3>
                          <p className="text-sm text-gray-400">
                            by {s.submitted_by_username}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
                            onClick={() => reviewSubmission(s.id, "approve")}
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
                            onClick={() => reviewSubmission(s.id, "reject")}
                          >
                            <XMarkIcon className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
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
