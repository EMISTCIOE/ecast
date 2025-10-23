import { useEffect, useState } from "react";
import Router from "next/router";
import NavBar from "@/components/nav";
import Sidebar from "@/components/Sidebar";
import ProfilePictureModal from "@/components/ProfilePictureModal";
import Footer from "@/components/footar";
import { useNotices } from "@/lib/hooks/notices";
import { useBlogs } from "@/lib/hooks/blogs";
import RichTextEditor from "@/components/RichTextEditor";
import { useProjects } from "@/lib/hooks/projects";
import { useEvents } from "@/lib/hooks/events";
import { useTasks } from "@/lib/hooks/tasks";
import MySubmissions from "@/components/MySubmissions";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import CreateNoticeModal from "@/components/modals/CreateNoticeModal";
import CreateBlogModal from "@/components/modals/CreateBlogModal";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import CreateEventModal from "@/components/modals/CreateEventModal";
import {
  BellIcon,
  DocumentTextIcon,
  FolderIcon,
  CalendarIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  PaperAirplaneIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  LinkIcon,
  GlobeAltIcon,
  MapPinIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  FolderIcon as FolderIconSolid,
  CalendarIcon as CalendarIconSolid,
} from "@heroicons/react/24/solid";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
const isImagePath = (p?: string) =>
  /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(p || "");

type Notice = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  audience: string;
  published_by_username: string;
};

export default function MemberDashboard() {
  const [authReady, setAuthReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarUser, setSidebarUser] = useState<{
    name: string;
    role?: string;
    committee_position?: string;
    avatarUrl?: string;
  }>();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [notices, setNotices] = useState<Notice[]>([]);
  const toast = useToast();
  const {
    create: createNoticeApi,
    list: listNotices,
    update: updateNotice,
    remove: deleteNotice,
  } = useNotices();
  const {
    create: createBlogApi,
    list: listBlogs,
    update: updateBlog,
    remove: deleteBlog,
  } = useBlogs();
  const { create: createProjectApi, list: listProjects } = useProjects();
  const { create: createEventApi, list: listEvents } = useEvents();
  const { listAssigned, submit } = useTasks();
  const [role, setRole] = useState<string | null>(null);
  const [nTitle, setNTitle] = useState("");
  const [nContent, setNContent] = useState("");
  const [nAudience, setNAudience] = useState("ALL");
  const [nFile, setNFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [myNotices, setMyNotices] = useState<any[]>([]);
  const [myBlogs, setMyBlogs] = useState<any[]>([]);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Blog
  const [bTitle, setBTitle] = useState("");
  const [bDesc, setBDesc] = useState("");
  const [bContent, setBContent] = useState("");
  const [bCover, setBCover] = useState<File | null>(null);

  // Project
  const [pTitle, setPTitle] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pRepo, setPRepo] = useState("");
  const [pLive, setPLive] = useState("");
  const [pImage, setPImage] = useState<File | null>(null);

  // Event
  const [eTitle, setETitle] = useState("");
  const [eDesc, setEDesc] = useState("");
  const [eDate, setEDate] = useState("");
  const [eTime, setETime] = useState("");
  const [eLoc, setELoc] = useState("");
  const [eImage, setEImage] = useState<File | null>(null);
  // Tasks
  const [tasks, setTasks] = useState<any[]>([]);
  const [subMsg, setSubMsg] = useState("");
  const [selTask, setSelTask] = useState("");
  const [subText, setSubText] = useState("");
  const [subFile, setSubFile] = useState<File | null>(null);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      Router.replace("/login");
    } else {
      setAuthReady(true);
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          const raw = u.user_photo || u.committee_member_photo || "";
          const avatar = raw
            ? raw.startsWith("http")
              ? raw
              : `${process.env.NEXT_PUBLIC_API_BASE || ""}${raw}`
            : undefined;
          setSidebarUser({
            name: u.full_name || u.username,
            role: u.role,
            committee_position: u.committee_position,
            avatarUrl: avatar,
          });
          setRole(u.role || null);
        } catch {}
      }
      // Fetch both ALL and MEMBERS notices for feed
      listNotices({ audience: "ALL" }).then((d) =>
        setNotices((prev) => [...prev, ...d])
      );
      listNotices({ audience: "MEMBERS" }).then((d) =>
        setNotices((prev) => [...prev, ...d])
      );
      // Fetch my own items for CRUD
      listNotices({ mine: "1" })
        .then(setMyNotices)
        .catch(() => {});
      listBlogs({ mine: "1" })
        .then(setMyBlogs)
        .catch(() => {});
      listProjects({ mine: "1" })
        .then(setMyProjects)
        .catch(() => {});
      listEvents({ mine: "1" })
        .then(setMyEvents)
        .catch(() => {});
      listAssigned()
        .then(setTasks)
        .catch(() => {});
    }
  }, []);

  // Clear messages when switching sections
  useEffect(() => {
    setMsg("");
    setSubMsg("");
  }, [activeSection]);

  // Note: Do not early-return before all hooks run.
  // We gate rendering later to keep hooks order consistent across renders.

  const sorted = [...notices].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const createNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", nTitle);
      form.append("content", nContent);
      form.append("audience", nAudience);
      if (nFile) form.append("attachment", nFile);
      await createNoticeApi(form);
      setMsg("Notice submitted for approval");
      setNTitle("");
      setNContent("");
      setNAudience("ALL");
      setNFile(null);
      // Refresh the list immediately
      listNotices({ mine: "1" }).then(setMyNotices);
    } catch {
      setMsg("Failed to submit notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setIsSubmitting(true);
    const form = new FormData();
    form.append("title", bTitle);
    form.append("description", bDesc);
    form.append("content", bContent);
    if (bCover) form.append("cover_image", bCover);
    try {
      await createBlogApi(form);
      setMsg("Blog submitted for approval");
      setBTitle("");
      setBDesc("");
      setBContent("");
      setBCover(null);
      // Refresh the list immediately
      listBlogs({ mine: "1" }).then(setMyBlogs);
    } catch {
      setMsg("Failed to submit blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple inline edit state for my items
  const [editNoticeId, setEditNoticeId] = useState<string>("");
  const [editNoticeTitle, setEditNoticeTitle] = useState("");
  const [editNoticeContent, setEditNoticeContent] = useState("");
  const [editNoticeAudience, setEditNoticeAudience] = useState("ALL");
  const [editNoticeFile, setEditNoticeFile] = useState<File | null>(null);
  const startEditNotice = (n: any) => {
    setEditNoticeId(n.id);
    setEditNoticeTitle(n.title);
    setEditNoticeContent(n.content);
    setEditNoticeAudience(n.audience || "ALL");
    setEditNoticeFile(null);
  };
  const saveEditNotice = async () => {
    if (!editNoticeId) return;
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", editNoticeTitle);
      form.append("content", editNoticeContent);
      form.append("audience", editNoticeAudience);
      if (editNoticeFile) {
        form.append("attachment", editNoticeFile);
      }
      await updateNotice(editNoticeId, form);
      setEditNoticeId("");
      setEditNoticeFile(null);
      listNotices({ mine: "1" }).then(setMyNotices);
    } catch (error) {
      console.error("Failed to update notice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [editBlogSlug, setEditBlogSlug] = useState<string>("");
  const [editBlogTitle, setEditBlogTitle] = useState("");
  const [editBlogDesc, setEditBlogDesc] = useState("");
  const [editBlogContent, setEditBlogContent] = useState("");
  const [editBlogCover, setEditBlogCover] = useState<File | null>(null);
  const startEditBlog = (b: any) => {
    setEditBlogSlug(b.slug);
    setEditBlogTitle(b.title);
    setEditBlogDesc(b.description || "");
    setEditBlogContent(b.content || "");
    setEditBlogCover(null);
  };
  const saveEditBlog = async () => {
    if (!editBlogSlug) return;
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", editBlogTitle);
      form.append("description", editBlogDesc);
      form.append("content", editBlogContent);
      if (editBlogCover) {
        form.append("cover_image", editBlogCover);
      }
      await updateBlog(editBlogSlug, form);
      setEditBlogSlug("");
      setEditBlogCover(null);
      listBlogs({ mine: "1" }).then(setMyBlogs);
    } catch (error) {
      console.error("Failed to update blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInsertImage = async (file: File) => {
    const form = new FormData();
    form.append("image", file);
    const res = await fetch("/api/app/blog/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      body: form,
    });
    if (res.ok) {
      const data = await res.json();
      const url = data.url;
      setBContent((prev) => prev + `\n<img src="${url}" alt="image" />\n`);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setIsSubmitting(true);
    const form = new FormData();
    form.append("title", pTitle);
    form.append("description", pDesc);
    form.append("repo_link", pRepo);
    if (pLive) form.append("live_link", pLive);
    if (pImage) form.append("image", pImage);
    try {
      await createProjectApi(form);
      setMsg("Project submitted for approval");
      setPTitle("");
      setPDesc("");
      setPRepo("");
      setPLive("");
      setPImage(null);
    } catch {
      setMsg("Failed to submit project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setIsSubmitting(true);
    const form = new FormData();
    form.append("title", eTitle);
    form.append("description", eDesc);
    form.append("date", eDate);
    form.append("time", eTime);
    form.append("location", eLoc);
    form.append("image", eImage as any);
    form.append("registration_required", "false");
    form.append("coming_soon", "false");
    form.append("contact_email", "info@example.com");
    try {
      await createEventApi(form);
      setMsg("Event submitted for approval");
      setETitle("");
      setEDesc("");
      setEDate("");
      setETime("");
      setELoc("");
      setEImage(null);
    } catch {
      setMsg("Failed to submit event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);

    const access = localStorage.getItem("access");
    const response = await fetch(`${base}/api/auth/me/profile/`, {
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

  const canEditOrDeleteNotice = (n: any) => n.status !== "APPROVED";
  const canEditOrDeleteBlog = (b: any) => b.status !== "APPROVED";

  // Modal states
  const [showCreateNoticeModal, setShowCreateNoticeModal] = useState(false);
  const [showCreateBlogModal, setShowCreateBlogModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  const menuItems = [
    { id: "overview", name: "Overview", icon: HomeIcon },
    { id: "notices", name: "My Notices", icon: BellIcon },
    { id: "blogs", name: "My Blogs", icon: DocumentTextIcon },
    { id: "projects", name: "My Projects", icon: FolderIcon },
    { id: "events", name: "My Events", icon: CalendarIcon },
    { id: "submit", name: "Submit Task", icon: PaperAirplaneIcon },
    { id: "submissions", name: "My Submissions", icon: DocumentTextIcon },
  ];

  if (!authReady)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-300 mb-2">
            Loading Dashboard
          </h2>
          <p className="text-gray-500">Please wait...</p>
        </div>
      </div>
    );

  return (
    <>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
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
                  id: "notices",
                  label: "My Notices",
                  icon: BellIcon as any,
                  active: activeSection === "notices",
                  onClick: () => setActiveSection("notices"),
                },
                {
                  id: "blog",
                  label: "My Blogs",
                  icon: DocumentTextIcon as any,
                  active: activeSection === "blog",
                  onClick: () => setActiveSection("blog"),
                },
                {
                  id: "project",
                  label: "My Projects",
                  icon: FolderIcon as any,
                  active: activeSection === "project",
                  onClick: () => setActiveSection("project"),
                },
                {
                  id: "event",
                  label: "My Events",
                  icon: CalendarIcon as any,
                  active: activeSection === "event",
                  onClick: () => setActiveSection("event"),
                },
                {
                  id: "submit",
                  label: "Submit Task",
                  icon: PaperAirplaneIcon as any,
                  active: activeSection === "submit",
                  onClick: () => setActiveSection("submit"),
                },
                {
                  id: "submissions",
                  label: "My Submissions",
                  icon: DocumentTextIcon as any,
                  active: activeSection === "submissions",
                  onClick: () => setActiveSection("submissions"),
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
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Welcome Back! 👋
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Let's make today productive
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <SparklesIcon className="w-7 h-7 text-yellow-400" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <button
                    onClick={() => setActiveSection("notice")}
                    className="group relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-purple-600/10 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-400/60 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-purple-500/0 to-purple-400/0 group-hover:from-purple-600/10 group-hover:via-purple-500/5 group-hover:to-purple-400/10 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <BellIcon className="w-7 h-7 text-purple-400 group-hover:text-purple-300" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                        Create Notice
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        Post important announcements
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveSection("blog")}
                    className="group relative overflow-hidden bg-gradient-to-br from-pink-900/40 via-pink-800/20 to-pink-600/10 p-8 rounded-2xl border border-pink-500/30 hover:border-pink-400/60 shadow-xl hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 via-pink-500/0 to-pink-400/0 group-hover:from-pink-600/10 group-hover:via-pink-500/5 group-hover:to-pink-400/10 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-pink-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <DocumentTextIcon className="w-7 h-7 text-pink-400 group-hover:text-pink-300" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-pink-300 transition-colors">
                        Write Blog
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        Share your thoughts & ideas
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveSection("project")}
                    className="group relative overflow-hidden bg-gradient-to-br from-blue-900/40 via-blue-800/20 to-blue-600/10 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-400/60 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-500/0 to-blue-400/0 group-hover:from-blue-600/10 group-hover:via-blue-500/5 group-hover:to-blue-400/10 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <FolderIcon className="w-7 h-7 text-blue-400 group-hover:text-blue-300" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                        Add Project
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        Showcase your amazing work
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveSection("event")}
                    className="group relative overflow-hidden bg-gradient-to-br from-emerald-900/40 via-emerald-800/20 to-emerald-600/10 p-8 rounded-2xl border border-emerald-500/30 hover:border-emerald-400/60 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 via-emerald-500/0 to-emerald-400/0 group-hover:from-emerald-600/10 group-hover:via-emerald-500/5 group-hover:to-emerald-400/10 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <CalendarIcon className="w-7 h-7 text-emerald-400 group-hover:text-emerald-300" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-300 transition-colors">
                        Create Event
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        Organize exciting activities
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tasks Assigned Summary */}
              <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 shadow-2xl hover:border-gray-600/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    Tasks Assigned
                  </h3>
                  <button
                    onClick={() => setActiveSection("submit")}
                    className="group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2 hover:scale-105"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Submit Task
                  </button>
                </div>
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      No tasks assigned yet.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Check back later for new assignments
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.slice(0, 3).map((t: any) => (
                      <div
                        key={t.id}
                        className="group flex items-center justify-between bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-5 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-lg text-white group-hover:text-blue-300 transition-colors">
                            {t.title}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <ClockIcon className="w-4 h-4" />
                            Due: {t.due_date || "No deadline"}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelTask(t.id);
                            setActiveSection("submit");
                          }}
                          className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg font-medium transition-all duration-300 hover:scale-105 border border-blue-500/30"
                        >
                          Submit →
                        </button>
                      </div>
                    ))}
                    {tasks.length > 3 && (
                      <div className="text-center pt-2">
                        <button
                          onClick={() => setActiveSection("submit")}
                          className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                        >
                          +{tasks.length - 3} more tasks • View all →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Notices */}
              <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 shadow-2xl hover:border-gray-600/50 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <BellIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  Recent Notices
                </h3>
                {sorted.length === 0 ? (
                  <div className="text-center py-12">
                    <BellIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No notices yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Stay tuned for important announcements
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sorted.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-purple-300 group-hover:text-purple-200 transition-colors mb-2">
                              {n.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
                              <span className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                {new Date(n.created_at).toLocaleDateString()}
                              </span>
                              <span className="px-2 py-1 bg-purple-500/20 rounded-md text-purple-300 text-xs font-semibold">
                                {n.audience}
                              </span>
                              <span>by {n.published_by_username}</span>
                            </div>
                            <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                              {n.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Task Section */}
          {activeSection === "submit" && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <PaperAirplaneIcon className="w-7 h-7 text-white" />
                  </div>
                  Submit Task
                </h1>
                <p className="text-gray-400 text-lg">
                  Complete your assigned tasks
                </p>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!selTask) {
                    setSubMsg("Please select a task.");
                    return;
                  }
                  if (!subText.trim() && !subFile) {
                    setSubMsg("Please add notes or attach a file.");
                    return;
                  }
                  const form = new FormData();
                  form.append("task", selTask);
                  form.append("content", subText);
                  if (subFile) form.append("attachment", subFile);
                  try {
                    await submit(form);
                    setSubMsg("Submitted for review");
                    setSelTask("");
                    setSubText("");
                    setSubFile(null);
                  } catch {
                    setSubMsg("Submission failed");
                  }
                }}
                className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-10 rounded-3xl border border-gray-700/50 shadow-2xl space-y-6"
              >
                {subMsg && (
                  <div
                    className={`p-5 rounded-2xl font-medium flex items-center gap-3 ${
                      subMsg.includes("fail")
                        ? "bg-red-900/30 border border-red-500/50 text-red-300"
                        : "bg-green-900/30 border border-green-500/50 text-green-300"
                    }`}
                  >
                    {subMsg.includes("fail") ? (
                      <XCircleIcon className="w-6 h-6" />
                    ) : (
                      <CheckCircleIcon className="w-6 h-6" />
                    )}
                    {subMsg}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <ClipboardDocumentCheckIcon className="w-5 h-5 text-blue-400" />
                    Select Task
                  </label>
                  <select
                    className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-500/50 font-medium"
                    value={selTask}
                    onChange={(e) => setSelTask(e.target.value)}
                    required
                  >
                    <option value="">Choose a task to submit...</option>
                    {tasks.map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 text-blue-400" />
                    Submission Notes
                  </label>
                  <textarea
                    className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-500/50 resize-none font-medium"
                    rows={5}
                    placeholder="Add details about your submission, challenges faced, or any notes for reviewers..."
                    value={subText}
                    onChange={(e) => setSubText(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <ArrowUpTrayIcon className="w-5 h-5 text-blue-400" />
                    Attachment{" "}
                    {subFile && (
                      <span className="text-green-400 text-xs">
                        ({subFile.name})
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      key={subFile ? "has-subfile" : "no-subfile"}
                      type="file"
                      onChange={(e) => setSubFile(e.target.files?.[0] || null)}
                      className="w-full p-4 bg-gray-900/80 border-2 border-dashed border-gray-700 rounded-xl hover:border-blue-500/50 transition-all duration-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-blue-600 file:to-cyan-600 file:text-white file:font-semibold hover:file:from-blue-700 hover:file:to-cyan-700 file:shadow-lg file:transition-all cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 p-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      Submit Task
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* My Submissions */}
          {activeSection === "submissions" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  My Submissions
                </h1>
                <p className="text-gray-400 text-lg">
                  Track all your submissions and their status
                </p>
              </div>
              <MySubmissions role={"MEMBER"} showTasks={true} />
            </div>
          )}

          {/* My Notices Section */}
          {activeSection === "notices" && (
            <div className="animate-fade-in">
              {/* Header with Create Button */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <BellIcon className="w-7 h-7 text-white" />
                    </div>
                    My Notices
                  </h1>
                  <p className="text-gray-400 text-lg">
                    View and manage your submitted notices
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateNoticeModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create Notice
                </button>
              </div>

              {/* My Notices List */}
              <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
                {myNotices.length === 0 ? (
                  <div className="text-center py-16">
                    <BellIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                    <p className="text-gray-400 text-xl font-semibold mb-2">
                      No notices created yet
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                      Create your first notice to share announcements with the
                      community
                    </p>
                    <button
                      onClick={() => setShowCreateNoticeModal(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg transition-all duration-300"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Create Your First Notice
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myNotices.map((n: any) => (
                      <div
                        key={n.id}
                        className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {editNoticeId === n.id ? (
                              <div className="space-y-3">
                                <input
                                  className="w-full bg-gray-900/90 p-3 rounded-xl border border-purple-500/50 focus:ring-2 focus:ring-purple-500 font-semibold text-lg text-white"
                                  placeholder="Notice Title"
                                  value={editNoticeTitle}
                                  onChange={(e) =>
                                    setEditNoticeTitle(e.target.value)
                                  }
                                />
                                <textarea
                                  className="w-full bg-gray-900/90 p-3 rounded-xl border border-purple-500/50 focus:ring-2 focus:ring-purple-500 resize-none text-white"
                                  placeholder="Notice Content"
                                  rows={4}
                                  value={editNoticeContent}
                                  onChange={(e) =>
                                    setEditNoticeContent(e.target.value)
                                  }
                                />
                                <select
                                  className="w-full bg-gray-900/90 p-3 rounded-xl border border-purple-500/50 focus:ring-2 focus:ring-purple-500 text-white"
                                  value={editNoticeAudience}
                                  onChange={(e) =>
                                    setEditNoticeAudience(e.target.value)
                                  }
                                >
                                  <option value="ALL">All Members</option>
                                  <option value="MEMBERS">Members Only</option>
                                  <option value="AMBASSADORS">
                                    Ambassadors Only
                                  </option>
                                </select>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                    <ArrowUpTrayIcon className="w-4 h-4 text-purple-400" />
                                    Update Attachment{" "}
                                    {editNoticeFile && (
                                      <span className="text-green-400 text-xs">
                                        ({editNoticeFile.name})
                                      </span>
                                    )}
                                    {n.attachment && !editNoticeFile && (
                                      <span className="text-gray-500 text-xs">
                                        (Current:{" "}
                                        {n.attachment.split("/").pop()})
                                      </span>
                                    )}
                                  </label>
                                  <input
                                    type="file"
                                    accept="application/pdf,image/*"
                                    className="w-full p-3 bg-gray-900/90 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600/20 file:text-purple-300 hover:file:bg-purple-600/30 file:transition-all cursor-pointer text-sm text-white"
                                    onChange={(e) =>
                                      setEditNoticeFile(
                                        e.target.files?.[0] || null
                                      )
                                    }
                                  />
                                  {editNoticeFile &&
                                    editNoticeFile.type?.startsWith(
                                      "image/"
                                    ) && (
                                      <div className="mt-3">
                                        <img
                                          src={URL.createObjectURL(
                                            editNoticeFile
                                          )}
                                          alt="New attachment preview"
                                          className="max-h-48 rounded-lg border border-purple-500/30"
                                        />
                                      </div>
                                    )}
                                  {!editNoticeFile &&
                                    n.attachment &&
                                    isImagePath(n.attachment) && (
                                      <div className="mt-3">
                                        <img
                                          src={
                                            n.attachment.startsWith("http")
                                              ? n.attachment
                                              : `${base}${n.attachment}`
                                          }
                                          alt="Current attachment preview"
                                          className="max-h-48 rounded-lg border border-purple-500/30"
                                        />
                                      </div>
                                    )}
                                </div>
                              </div>
                            ) : (
                              <>
                                <h4 className="font-bold text-lg text-white mb-2">
                                  {n.title}
                                </h4>
                                <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                                  {n.content}
                                </p>
                              </>
                            )}
                            <div className="flex items-center gap-2 mb-3">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                  n.status === "APPROVED"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : n.status === "REJECTED"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                }`}
                              >
                                {n.status}
                              </span>
                              {editNoticeId !== n.id && (
                                <>
                                  <span className="px-2 py-1 bg-purple-500/20 rounded-md text-purple-300 text-xs font-semibold">
                                    {n.audience}
                                  </span>
                                  <span className="text-sm text-gray-400">
                                    {new Date(
                                      n.created_at
                                    ).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {canEditOrDeleteNotice(n) &&
                              (editNoticeId === n.id ? (
                                <>
                                  <button
                                    onClick={saveEditNotice}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg font-medium transition-all border border-green-500/30 disabled:opacity-50"
                                  >
                                    {isSubmitting ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    onClick={() => setEditNoticeId("")}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg font-medium transition-all border border-gray-500/30 disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditNotice(n)}
                                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-medium transition-all border border-blue-500/30"
                                  >
                                    <PencilSquareIcon className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteNotice(n.id).then(() =>
                                        listNotices({ mine: "1" }).then(
                                          setMyNotices
                                        )
                                      )
                                    }
                                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-all border border-red-500/30"
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                </>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* My Blogs Section */}
          {activeSection === "blog" && (
            <div className="animate-fade-in">
              {/* Header with Create Button */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                      <DocumentTextIcon className="w-7 h-7 text-white" />
                    </div>
                    My Blogs
                  </h1>
                  <p className="text-gray-400 text-lg">
                    View and manage your submitted blog posts
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateBlogModal(true)}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale-105"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create Blog
                </button>
              </div>

              {/* My Blogs List */}
              <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
                {myBlogs.length === 0 ? (
                  <div className="text-center py-16">
                    <DocumentTextIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                    <p className="text-gray-400 text-xl font-semibold mb-2">
                      No blogs created yet
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                      Create your first blog post to share your ideas with the
                      community
                    </p>
                    <button
                      onClick={() => setShowCreateBlogModal(true)}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg transition-all duration-300"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Create Your First Blog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myBlogs.map((b: any) => (
                      <div
                        key={b.id}
                        className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-2xl border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {editBlogSlug === b.slug ? (
                              <div className="space-y-3">
                                <input
                                  className="w-full bg-gray-900/90 p-3 rounded-xl border border-pink-500/50 focus:ring-2 focus:ring-pink-500 font-semibold text-lg text-white"
                                  placeholder="Blog Title"
                                  value={editBlogTitle}
                                  onChange={(e) =>
                                    setEditBlogTitle(e.target.value)
                                  }
                                />
                                <input
                                  className="w-full bg-gray-900/90 p-3 rounded-xl border border-pink-500/50 focus:ring-2 focus:ring-pink-500 text-white"
                                  placeholder="Short Description"
                                  value={editBlogDesc}
                                  onChange={(e) =>
                                    setEditBlogDesc(e.target.value)
                                  }
                                />
                                <div className="w-full">
                                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Blog Content
                                  </label>
                                  <RichTextEditor
                                    value={editBlogContent}
                                    onChange={setEditBlogContent}
                                    className="min-h-[300px]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                    <ArrowUpTrayIcon className="w-4 h-4 text-pink-400" />
                                    Update Cover Image{" "}
                                    {editBlogCover && (
                                      <span className="text-green-400 text-xs">
                                        ({editBlogCover.name})
                                      </span>
                                    )}
                                    {b.cover_image && !editBlogCover && (
                                      <span className="text-gray-500 text-xs">
                                        (Current cover set)
                                      </span>
                                    )}
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full p-3 bg-gray-900/90 border-2 border-dashed border-pink-500/30 rounded-xl hover:border-pink-500/50 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-600/20 file:text-pink-300 hover:file:bg-pink-600/30 file:transition-all cursor-pointer text-sm text-white"
                                    onChange={(e) =>
                                      setEditBlogCover(
                                        e.target.files?.[0] || null
                                      )
                                    }
                                  />
                                  {editBlogCover &&
                                    editBlogCover.type?.startsWith(
                                      "image/"
                                    ) && (
                                      <div className="mt-3">
                                        <img
                                          src={URL.createObjectURL(
                                            editBlogCover
                                          )}
                                          alt="New cover preview"
                                          className="max-h-48 rounded-lg border border-pink-500/30"
                                        />
                                      </div>
                                    )}
                                  {!editBlogCover && b.cover_image && (
                                    <div className="mt-3">
                                      <img
                                        src={b.cover_image}
                                        alt="Current cover preview"
                                        className="max-h-48 rounded-lg border border-pink-500/30"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <>
                                <h4 className="font-bold text-lg text-white mb-2">
                                  {b.title}
                                </h4>
                                {b.description && (
                                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                                    {b.description}
                                  </p>
                                )}
                              </>
                            )}
                            <div className="flex items-center gap-2 mb-3">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                  b.status === "APPROVED"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : b.status === "REJECTED"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                }`}
                              >
                                {b.status}
                              </span>
                              {editBlogSlug !== b.slug && (
                                <span className="text-sm text-gray-400">
                                  {new Date(b.created_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {canEditOrDeleteBlog(b) &&
                              (editBlogSlug === b.slug ? (
                                <>
                                  <button
                                    onClick={saveEditBlog}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg font-medium transition-all border border-green-500/30 disabled:opacity-50"
                                  >
                                    {isSubmitting ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    onClick={() => setEditBlogSlug("")}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg font-medium transition-all border border-gray-500/30 disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditBlog(b)}
                                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-medium transition-all border border-blue-500/30"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteBlog(b.slug).then(() =>
                                        listBlogs({ mine: "1" }).then(
                                          setMyBlogs
                                        )
                                      )
                                    }
                                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-all border border-red-500/30"
                                  >
                                    Delete
                                  </button>
                                </>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Create Project Section */}
          {/* My Projects Section */}
          {activeSection === "project" && (
            <div className="animate-fade-in">
              {/* Header with Create Button */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <FolderIcon className="w-7 h-7 text-white" />
                    </div>
                    My Projects
                  </h1>
                  <p className="text-gray-400 text-lg">
                    View and manage your submitted projects
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateProjectModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create Project
                </button>
              </div>

              {/* My Projects List */}
              <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
                {myProjects.length === 0 ? (
                  <div className="text-center py-16">
                    <FolderIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                    <p className="text-gray-400 text-xl font-semibold mb-2">
                      No projects created yet
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                      Create your first project to showcase your work
                    </p>
                    <button
                      onClick={() => setShowCreateProjectModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg transition-all duration-300"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Create Your First Project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      {myProjects.length} project
                      {myProjects.length !== 1 ? "s" : ""} submitted
                    </p>
                    {myProjects.map((p: any) => (
                      <div
                        key={p.id}
                        className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-white mb-2">
                              {p.title}
                            </h4>
                            {p.description && (
                              <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                                {p.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mb-3">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                  p.status === "APPROVED"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : p.status === "REJECTED"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                }`}
                              >
                                {p.status}
                              </span>
                              <span className="text-sm text-gray-400">
                                {new Date(p.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {(p.repo_url || p.live_url) && (
                              <div className="flex gap-3 mt-2">
                                {p.repo_url && (
                                  <a
                                    href={p.repo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                                  >
                                    <LinkIcon className="w-4 h-4" />
                                    Repository
                                  </a>
                                )}
                                {p.live_url && (
                                  <a
                                    href={p.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
                                  >
                                    <GlobeAltIcon className="w-4 h-4" />
                                    Live Demo
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* My Events Section */}
          {activeSection === "event" && (
            <div className="animate-fade-in">
              {/* Header with Create Button */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <CalendarIcon className="w-7 h-7 text-white" />
                    </div>
                    My Events
                  </h1>
                  <p className="text-gray-400 text-lg">
                    View and manage your submitted events
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateEventModal(true)}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create Event
                </button>
              </div>

              {/* My Events List */}
              <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
                {myEvents.length === 0 ? (
                  <div className="text-center py-16">
                    <CalendarIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                    <p className="text-gray-400 text-xl font-semibold mb-2">
                      No events created yet
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                      Create your first event to engage with the community
                    </p>
                    <button
                      onClick={() => setShowCreateEventModal(true)}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg transition-all duration-300"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Create Your First Event
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      {myEvents.length} event{myEvents.length !== 1 ? "s" : ""}{" "}
                      submitted
                    </p>
                    {myEvents.map((e: any) => (
                      <div
                        key={e.id}
                        className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-2xl border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-white mb-2">
                              {e.title}
                            </h4>
                            {e.description && (
                              <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                                {e.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mb-3">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                  e.status === "APPROVED"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : e.status === "REJECTED"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                }`}
                              >
                                {e.status}
                              </span>
                            </div>
                            {(e.date || e.time || e.location) && (
                              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                                {e.date && (
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="w-4 h-4 text-emerald-400" />
                                    {new Date(e.date).toLocaleDateString()}
                                  </span>
                                )}
                                {e.time && (
                                  <span className="flex items-center gap-1">
                                    <ClockIcon className="w-4 h-4 text-emerald-400" />
                                    {e.time}
                                  </span>
                                )}
                                {e.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPinIcon className="w-4 h-4 text-emerald-400" />
                                    {e.location}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modals - Placed at root level for global accessibility */}
        <CreateNoticeModal
          isOpen={showCreateNoticeModal}
          onClose={() => setShowCreateNoticeModal(false)}
          onSubmit={async (data) => {
            const form = new FormData();
            form.append("title", data.title);
            form.append("content", data.content);
            form.append("audience", data.audience);
            if (data.file) form.append("attachment", data.file);

            await createNoticeApi(form);
            toast.success("Notice submitted for review successfully!");
            listNotices({ mine: "1" }).then(setMyNotices);
          }}
        />

        <CreateBlogModal
          isOpen={showCreateBlogModal}
          onClose={() => setShowCreateBlogModal(false)}
          onSubmit={async (data) => {
            const form = new FormData();
            form.append("title", data.title);
            form.append("description", data.description);
            form.append("content", data.content);
            if (data.coverImage) form.append("cover_image", data.coverImage);

            await createBlogApi(form);
            toast.success("Blog submitted for review successfully!");
            listBlogs({ mine: "1" }).then(setMyBlogs);
          }}
        />

        <CreateProjectModal
          isOpen={showCreateProjectModal}
          onClose={() => setShowCreateProjectModal(false)}
          onSubmit={async (data) => {
            const form = new FormData();
            form.append("title", data.title);
            form.append("description", data.description);
            form.append("repo_url", data.repo_url);
            if (data.live_url) form.append("live_url", data.live_url);
            if (data.image) form.append("image", data.image);

            await createProjectApi(form);
            toast.success("Project submitted for review successfully!");
            listProjects({ mine: "1" }).then(setMyProjects);
          }}
        />

        <CreateEventModal
          isOpen={showCreateEventModal}
          onClose={() => setShowCreateEventModal(false)}
          onSubmit={async (data) => {
            const form = new FormData();
            form.append("title", data.title);
            form.append("description", data.description);
            form.append("date", data.date);
            form.append("time", data.time);
            form.append("location", data.location);
            if (data.image) form.append("image", data.image);

            await createEventApi(form);
            toast.success("Event submitted for review successfully!");
            listEvents({ mine: "1" }).then(setMyEvents);
          }}
        />
      </div>
      <Footer />
    </>
  );
}
