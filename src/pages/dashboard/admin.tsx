import { useEffect, useState } from "react";
import Router from "next/router";
import NavBar from "@/components/nav";
import Sidebar, { SidebarGroup } from "@/components/Sidebar";
import Footer from "@/components/footar";
import { useBlogs } from "@/lib/hooks/blogs";
import RichTextEditor from "@/components/RichTextEditor";
import { useNotices } from "@/lib/hooks/notices";
import { useAdmin } from "@/lib/hooks/admin";
import { useEvents } from "@/lib/hooks/events";
import { useTasks } from "@/lib/hooks/tasks";
import { useProjects } from "@/lib/hooks/projects";
import { useUsers } from "@/lib/hooks/users";
import { useGallery } from "@/lib/hooks/gallery";
import { authedFetch } from "@/lib/apiClient";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import {
  BellIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  HomeIcon,
  TrophyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  CalendarIcon,
  FolderIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function AdminDashboard() {
  const [authReady, setAuthReady] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarUser, setSidebarUser] = useState<{
    name: string;
    role?: string;
    avatarUrl?: string;
  }>();
  const [activeSection, setActiveSection] = useState("overview");
  const toast = useToast();

  // Loading states
  const [isCreatingNotice, setIsCreatingNotice] = useState(false);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const [noticeMsg, setNoticeMsg] = useState("");
  const [blogMsg, setBlogMsg] = useState("");
  const [projectMsg, setProjectMsg] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [taskMsg, setTaskMsg] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);

  // Notice form
  const [nTitle, setNTitle] = useState("");
  const [nContent, setNContent] = useState("");
  const [nAudience, setNAudience] = useState("ALL");
  const [nFile, setNFile] = useState<File | null>(null);

  // Blog form
  const [bTitle, setBTitle] = useState("");
  const [bDesc, setBDesc] = useState("");
  const [bContent, setBContent] = useState("");
  const [bCover, setBCover] = useState<File | null>(null);

  // Project form
  const [pTitle, setPTitle] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pRepo, setPRepo] = useState("");
  const [pLive, setPLive] = useState("");
  const [pImage, setPImage] = useState<File | null>(null);

  // Create user form
  const [cmUsername, setCmUsername] = useState("");
  const [cmEmail, setCmEmail] = useState("");
  const [cmFirst, setCmFirst] = useState("");
  const [cmLast, setCmLast] = useState("");
  const [cmPhone, setCmPhone] = useState("");
  const [cmRole, setCmRole] = useState<
    "MEMBER" | "AMBASSADOR" | "ALUMNI" | "ADMIN"
  >("MEMBER");
  const [cmPosition, setCmPosition] = useState("");
  const [cmStart, setCmStart] = useState("");
  const [cmTenure, setCmTenure] = useState<number | "">("");
  const [cmPhoto, setCmPhoto] = useState("");
  const [cmPhotoFile, setCmPhotoFile] = useState<File | null>(null);
  const [cmLinkedIn, setCmLinkedIn] = useState("");
  const [cmGithub, setCmGithub] = useState("");
  const [cmAmbYear, setCmAmbYear] = useState<string>("");
  const [cmAlumYear, setCmAlumYear] = useState<string>("");

  // Derive role from committee position per rules
  useEffect(() => {
    if (cmPosition === "President" || cmPosition === "Vice President") {
      setCmRole("ADMIN" as any);
    } else if (cmPosition) {
      setCmRole("MEMBER" as any);
    }
  }, [cmPosition]);

  // Tasks
  const [assignees, setAssignees] = useState<any[]>([]);
  const [tTitle, setTTitle] = useState("");
  const [tDesc, setTDesc] = useState("");
  const [tAssignee, setTAssignee] = useState("");
  const [tDue, setTDue] = useState("");

  // Moderation lists
  const [pendingBlogs, setPendingBlogs] = useState<any[]>([]);
  const [pendingNotices, setPendingNotices] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  // Events form
  const [evTitle, setEvTitle] = useState("");
  const [evDesc, setEvDesc] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evTime, setEvTime] = useState("");
  const [evLocation, setEvLocation] = useState("");
  const [evImage, setEvImage] = useState<File | null>(null);
  const [evContact, setEvContact] = useState("");
  const [evFeatured, setEvFeatured] = useState(false);
  const [evComingSoon, setEvComingSoon] = useState(false);
  const [pendingProjects, setPendingProjects] = useState<any[]>([]);
  const [pendingGallery, setPendingGallery] = useState<any[]>([]);
  const [pendingSubs, setPendingSubs] = useState<any[]>([]);

  const {
    list: listBlogs,
    approve: approveBlog,
    reject: rejectBlog,
    create: createBlogApi,
  } = useBlogs();
  const {
    list: listNotices,
    approve: approveNotice,
    reject: rejectNotice,
    create: createNoticeApi,
  } = useNotices();
  const {
    list: listEvents,
    approve: approveEvent,
    reject: rejectEvent,
    create: createEventApi,
    update: updateEventApi,
    remove: removeEventApi,
  } = useEvents();
  const {
    list: listProjects,
    approve: approveProject,
    reject: rejectProject,
    create: createProjectApi,
  } = useProjects();
  const tasksApi = useTasks();
  const {
    listUsers,
    pendingSubmissions: pendingSubsApi,
    reviewSubmission: reviewApi,
    createTask: createTaskApi,
  } = useAdmin();
  const usersApi = useUsers();
  const {
    list: listGallery,
    approve: approveGallery,
    reject: rejectGallery,
  } = useGallery();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const access = localStorage.getItem("access");
    const role = userStr ? JSON.parse(userStr)?.role : null;
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
          avatarUrl: avatar,
          position:
            u.committee_position ||
            (u.committee && u.committee.position) ||
            undefined,
        });
        setRole(u.role || null);
      } catch {}
    }
    if (!access || role !== "ADMIN") {
      Router.replace("/login");
    } else {
      setAuthReady(true);
      // preload potential task assignees: Ambassadors + Members
      Promise.all([listUsers("AMBASSADOR"), listUsers("MEMBER")])
        .then(([amb, mem]) => setAssignees([...(amb || []), ...(mem || [])]))
        .catch(() => {});
      listBlogs({ status: "PENDING" })
        .then(setPendingBlogs)
        .catch(() => {});
      // Latest 3 blogs (any status)
      listBlogs()
        .then((all: any[]) => setLatestBlogs((all || []).slice(0, 3)))
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
      listGallery({ status: "PENDING" })
        .then(setPendingGallery)
        .catch(() => {});
      pendingSubsApi()
        .then(setPendingSubs)
        .catch(() => {});

      // Load tasks (admins receive all tasks)
      tasksApi
        .listAssigned()
        .then((d: any[]) => setTasks(Array.isArray(d) ? d : []))
        .catch(() => setTasks([]));

      // Fetch leaderboard
      authedFetch(`${base}/api/auth/leaderboard/`)
        .then((r) => r.json())
        .then(setLeaderboard)
        .catch(() => {});
    }
  }, []);

  const createNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeMsg("");
    setIsCreatingNotice(true);
    try {
      const form = new FormData();
      form.append("title", nTitle);
      form.append("content", nContent);
      form.append("audience", nAudience);
      if (nFile) form.append("attachment", nFile);
      await createNoticeApi(form);
      setNoticeMsg("Notice published");
      toast.success("Notice published successfully!");
      // Reset form fields after successful creation
      setNTitle("");
      setNContent("");
      setNAudience("ALL");
      setNFile(null);
    } catch {
      setNoticeMsg("Failed to publish");
      toast.error("Failed to publish notice");
    } finally {
      setIsCreatingNotice(false);
    }
  };

  const createBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogMsg("");
    setIsCreatingBlog(true);
    const form = new FormData();
    form.append("title", bTitle);
    form.append("description", bDesc);
    form.append("content", bContent);
    if (bCover) form.append("cover_image", bCover);
    try {
      await createBlogApi(form);
      setBlogMsg("Blog published");
      toast.success("Blog published successfully!");
      // Reset form fields after successful creation
      setBTitle("");
      setBDesc("");
      setBContent("");
      setBCover(null);
    } catch {
      setBlogMsg("Failed to publish");
      toast.error("Failed to publish blog");
    } finally {
      setIsCreatingBlog(false);
    }
  };

  // Rich text editor handles images via upload toolbar

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectMsg("");
    setIsCreatingProject(true);
    try {
      const form = new FormData();
      form.append("title", pTitle);
      form.append("description", pDesc);
      if (pRepo) form.append("repo_link", pRepo);
      if (pLive) form.append("live_link", pLive);
      if (pImage) form.append("image", pImage);
      await createProjectApi(form);
      setProjectMsg("Project published");
      toast.success("Project published successfully!");
      setPTitle("");
      setPDesc("");
      setPRepo("");
      setPLive("");
      setPImage(null);
    } catch {
      setProjectMsg("Failed to publish project");
      toast.error("Failed to publish project");
    } finally {
      setIsCreatingProject(false);
    }
  };

  const createCommitteeMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMsg("");
    setIsCreatingUser(true);
    try {
      const form = new FormData();
      form.append("username", cmUsername);
      form.append("email", cmEmail);
      if (cmPhone) form.append("phone_number", cmPhone);
      form.append("first_name", cmFirst);
      form.append("last_name", cmLast);
      form.append("role", cmRole as any);
      if (cmLinkedIn) form.append("linkedin_url", cmLinkedIn);
      if (cmGithub) form.append("github_url", cmGithub);
      if (cmRole === "AMBASSADOR" && cmAmbYear)
        form.append("ambassador_batch_year_bs", cmAmbYear);
      if (cmRole === "ALUMNI" && cmAlumYear)
        form.append("alumni_batch_year_bs", cmAlumYear);
      if (cmPosition) {
        form.append("committee.position", cmPosition);
        if (cmStart) form.append("committee.started_from", cmStart);
        if (cmTenure !== "" && cmTenure !== null)
          form.append("committee.tenure", String(cmTenure));
      }
      if (cmPhotoFile) form.append("photo", cmPhotoFile);
      try {
        await usersApi.create(form);
        setUserMsg("User created (email sent if configured).");
        toast.success("User created successfully!");
      } catch (err: any) {
        setUserMsg(err?.message || "Failed to create user");
        toast.error(err?.message || "Failed to create user");
        return;
      }
    } catch (e: any) {
      setUserMsg(e?.message || "Failed to create user");
      toast.error(e?.message || "Failed to create user");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskMsg("");
    setIsCreatingTask(true);
    try {
      await createTaskApi({
        title: tTitle,
        description: tDesc,
        assigned_to: tAssignee,
        due_date: tDue,
      });
      setTaskMsg("Task assigned");
      toast.success("Task assigned successfully!");
      // Reset form fields after successful creation
      setTTitle("");
      setTDesc("");
      setTAssignee("");
      setTDue("");
      setShowTaskModal(false);
      // Refresh tasks list
      tasksApi
        .listAssigned()
        .then((d: any[]) => setTasks(Array.isArray(d) ? d : []))
        .catch(() => {});
    } catch {
      setTaskMsg("Failed to assign task");
      toast.error("Failed to assign task");
    } finally {
      setIsCreatingTask(false);
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

  const reject = async (
    type: "blog" | "notice" | "event" | "project",
    idOrSlug: string
  ) => {
    try {
      if (type === "blog") await rejectBlog(idOrSlug);
      else if (type === "notice") await rejectNotice(idOrSlug);
      else if (type === "event") await rejectEvent(idOrSlug);
      else await rejectProject(idOrSlug);
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
    { id: "notices", name: "Notices", icon: BellIcon },
    { id: "blogs", name: "Blogs", icon: DocumentTextIcon },
    { id: "events", name: "Events", icon: CalendarIcon },
    { id: "gallery", name: "Gallery", icon: FolderIcon },
    { id: "users", name: "Users", icon: UserGroupIcon },
    { id: "tasks", name: "Assign Task", icon: ClipboardDocumentCheckIcon },
    { id: "moderation", name: "Moderation", icon: ClockIcon },
    { id: "leaderboard", name: "Leaderboard", icon: TrophyIcon },
  ];

  return (
    <>
      <NavBar />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="flex bg-gray-950 text-white min-h-screen">
        <Sidebar
          expanded={!sidebarCollapsed}
          setExpanded={(v) => setSidebarCollapsed(!v)}
          user={sidebarUser}
          groups={
            [
              {
                title: "Main Menu",
                items: [
                  {
                    id: "overview",
                    label: "Overview",
                    icon: HomeIcon,
                    active: activeSection === "overview",
                    onClick: () => setActiveSection("overview"),
                  },
                  {
                    id: "notices",
                    label: "Notices",
                    icon: BellIcon,
                    active: activeSection === "notices",
                    onClick: () => setActiveSection("notices"),
                  },
                  {
                    id: "blogs",
                    label: "Blogs",
                    icon: DocumentTextIcon,
                    active: activeSection === "blogs",
                    onClick: () => setActiveSection("blogs"),
                  },
                  {
                    id: "events",
                    label: "Events",
                    icon: CalendarIcon,
                    active: activeSection === "events",
                    onClick: () => setActiveSection("events"),
                  },
                  {
                    id: "projects",
                    label: "Projects",
                    icon: FolderIcon,
                    active: activeSection === "projects",
                    onClick: () => setActiveSection("projects"),
                  },
                  {
                    id: "gallery",
                    label: "Gallery",
                    icon: FolderIcon,
                    active: activeSection === "gallery",
                    onClick: () => setActiveSection("gallery"),
                  },
                ],
              },
              {
                title: "General",
                items: [
                  {
                    id: "tasks",
                    label: "Assign Task",
                    icon: ClipboardDocumentCheckIcon,
                    active: activeSection === "tasks",
                    onClick: () => setActiveSection("tasks"),
                  },
                  {
                    id: "moderation",
                    label: "Moderation",
                    icon: ClockIcon,
                    active: activeSection === "moderation",
                    onClick: () => setActiveSection("moderation"),
                  },
                  {
                    id: "leaderboard",
                    label: "Leaderboard",
                    icon: TrophyIcon,
                    active: activeSection === "leaderboard",
                    onClick: () => setActiveSection("leaderboard"),
                  },
                ],
              },
              {
                title: "Account",
                items: [
                  {
                    id: "users",
                    label: "Users",
                    icon: UserGroupIcon,
                    active: activeSection === "users",
                    onClick: () => setActiveSection("users"),
                  },
                  {
                    id: "ambassadors-alumni",
                    label: "Ambassadors/Alumni",
                    icon: UserGroupIcon,
                    active: activeSection === "ambassadors-alumni",
                    onClick: () => setActiveSection("ambassadors-alumni"),
                  },
                ],
              },
            ] as SidebarGroup[]
          }
        />

        {/* Main Content */}
        <div
          className={`flex-1 ${
            sidebarCollapsed ? "ml-20" : "ml-64"
          } transition-all duration-300 p-8 mt-16`}
        >
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-600/20 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition cursor-pointer">
                  <BellIcon className="w-10 h-10 mb-3 text-purple-400" />
                  <h3 className="text-lg font-semibold mb-1">
                    Pending Notices
                  </h3>
                  <p className="text-3xl font-bold text-purple-300">
                    {pendingNotices.length}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-pink-900/30 to-pink-600/20 p-6 rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition cursor-pointer">
                  <DocumentTextIcon className="w-10 h-10 mb-3 text-pink-400" />
                  <h3 className="text-lg font-semibold mb-1">Pending Blogs</h3>
                  <p className="text-3xl font-bold text-pink-300">
                    {pendingBlogs.length}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-blue-600/20 p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition cursor-pointer">
                  <CalendarIcon className="w-10 h-10 mb-3 text-blue-400" />
                  <h3 className="text-lg font-semibold mb-1">Pending Events</h3>
                  <p className="text-3xl font-bold text-blue-300">
                    {pendingEvents.length}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-900/30 to-green-600/20 p-6 rounded-xl border border-green-500/20 hover:border-green-500/40 transition cursor-pointer">
                  <FolderIcon className="w-10 h-10 mb-3 text-green-400" />
                  <h3 className="text-lg font-semibold mb-1">
                    Pending Projects
                  </h3>
                  <p className="text-3xl font-bold text-green-300">
                    {pendingProjects.length}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ClipboardDocumentCheckIcon className="w-6 h-6 text-yellow-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveSection("notices")}
                      className="w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 p-3 rounded-lg transition flex items-center gap-2"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      Publish Notice
                    </button>
                    <button
                      onClick={() => setActiveSection("blogs")}
                      className="w-full bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 p-3 rounded-lg transition flex items-center gap-2"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      Publish Blog
                    </button>
                    <button
                      onClick={() => setActiveSection("projects")}
                      className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 p-3 rounded-lg transition flex items-center gap-2"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      Publish Project
                    </button>
                    <button
                      onClick={() => setActiveSection("tasks")}
                      className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 p-3 rounded-lg transition flex items-center gap-2"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      Assign Task
                    </button>
                  </div>
                </div>
                {/* Removed unintended photo upload in Overview */}

                <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ClockIcon className="w-6 h-6 text-orange-400" />
                    Recent Activity
                  </h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• {pendingSubs.length} pending task submissions</p>
                    <p>
                      •{" "}
                      {
                        assignees.filter((u: any) => u.role === "AMBASSADOR")
                          .length
                      }{" "}
                      active ambassadors
                    </p>
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

              {/* Latest Blogs (Approve inline) */}
              <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold mb-4">Latest Blogs</h3>
                <div className="space-y-3">
                  {latestBlogs.map((b: any) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded p-3"
                    >
                      <div>
                        <div className="font-semibold">{b.title}</div>
                        <div className="text-xs text-gray-400">
                          by {b.author_username} • {b.status}
                        </div>
                      </div>
                      {b.status === "PENDING" && (
                        <button
                          onClick={() => approve("blog", b.slug)}
                          className="text-green-400 hover:text-green-300"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeSection === "projects" && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <FolderIcon className="w-8 h-8 text-green-400" />
                Publish Project
              </h1>
              <form onSubmit={createProject} className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800 space-y-4">
                {projectMsg && (
                  <div className={`p-3 rounded ${projectMsg.includes('Failed') ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>{projectMsg}</div>
                )}
                <div>
                  <label className="block text-sm mb-1">Title</label>
                  <input className="w-full p-3 bg-gray-950 border border-gray-800 rounded" value={pTitle} onChange={(e)=>setPTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm mb-1">Description</label>
                  <textarea className="w-full p-3 bg-gray-950 border border-gray-800 rounded" rows={4} value={pDesc} onChange={(e)=>setPDesc(e.target.value)} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Repository Link</label>
                    <input className="w-full p-3 bg-gray-950 border border-gray-800 rounded" placeholder="https://github.com/..." value={pRepo} onChange={(e)=>setPRepo(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Live Link</label>
                    <input className="w-full p-3 bg-gray-950 border border-gray-800 rounded" placeholder="https://..." value={pLive} onChange={(e)=>setPLive(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Image</label>
                  <input type="file" onChange={(e)=>setPImage(e.target.files?.[0] || null)} />
                </div>
                <button disabled={isCreatingProject} className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg font-semibold">
                  {isCreatingProject ? 'Publishing...' : 'Publish Project'}
                </button>
              </form>
            </div>
          )}

          {/* Events Section - CRUD */}
          {activeSection === "events" && (
            <EventsCrud useEventsHook={useEvents} role={role} toast={toast} />
          )}

          {/* Notices Section - CRUD */}
          {activeSection === "notices" && (
            <NoticesCrud
              useNoticesHook={useNotices}
              role={role}
              toast={toast}
            />
          )}

          {/* Blogs Section - CRUD */}
          {activeSection === "blogs" && (
            <BlogsCrud useBlogsHook={useBlogs} role={role} toast={toast} />
          )}

          {/* Gallery Section - CRUD */}
          {activeSection === "gallery" && <GalleryCrud toast={toast} />}

          {/* Users Section - CRUD */}
          {activeSection === "users" && (
            <UsersCrud
              usersApi={usersApi}
              toast={toast}
              isCreatingUser={isCreatingUser}
              cm={{
                cmUsername,
                setCmUsername,
                cmEmail,
                setCmEmail,
                cmPhone,
                setCmPhone,
                cmFirst,
                setCmFirst,
                cmLast,
                setCmLast,
                cmRole,
                setCmRole,
                cmPosition,
                setCmPosition,
                cmStart,
                setCmStart,
                cmTenure,
                setCmTenure,
                cmPhoto,
                setCmPhoto,
                cmPhotoFile,
                setCmPhotoFile,
                cmLinkedIn,
                setCmLinkedIn,
                cmGithub,
                setCmGithub,
                // include batch-year controls even if unused in committee mode
                cmAmbYear,
                setCmAmbYear,
                cmAlumYear,
                setCmAlumYear,
              }}
              createUser={createCommitteeMember}
              userMsg={userMsg}
              mode="committee" // Only committee members and admins
            />
          )}

          {/* Ambassadors/Alumni Section - CRUD */}
          {activeSection === "ambassadors-alumni" && (
            <UsersCrud
              usersApi={usersApi}
              toast={toast}
              isCreatingUser={isCreatingUser}
              cm={{
                cmUsername,
                setCmUsername,
                cmEmail,
                setCmEmail,
                cmPhone,
                setCmPhone,
                cmFirst,
                setCmFirst,
                cmLast,
                setCmLast,
                cmRole,
                setCmRole,
                cmPosition,
                setCmPosition,
                cmStart,
                setCmStart,
                cmTenure,
                setCmTenure,
                cmPhoto,
                setCmPhoto,
                cmPhotoFile,
                setCmPhotoFile,
                cmLinkedIn,
                setCmLinkedIn,
                cmGithub,
                setCmGithub,
                cmAmbYear,
                setCmAmbYear,
                cmAlumYear,
                setCmAlumYear,
              }}
              createUser={createCommitteeMember}
              userMsg={userMsg}
              mode="ambassadors-alumni" // Only ambassadors and alumni
            />
          )}

          {/* Tasks Section with list + modal */}
          {activeSection === "tasks" && (
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <ClipboardDocumentCheckIcon className="w-8 h-8 text-yellow-400" />
                  Tasks
                </h1>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-black font-semibold"
                >
                  New Task
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Open tasks */}
                <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">Open Tasks</h3>
                  <div className="space-y-3">
                    {tasks.filter((t: any) => t.status === "OPEN").length ===
                    0 ? (
                      <p className="text-gray-400">No open tasks</p>
                    ) : (
                      tasks
                        .filter((t: any) => t.status === "OPEN")
                        .map((t: any) => (
                          <div
                            key={t.id}
                            className="bg-gray-950 border border-gray-800 rounded p-3 flex items-center justify-between"
                          >
                            <div className="min-w-0">
                              <div className="font-semibold truncate">
                                {t.title}
                              </div>
                              <div className="text-xs text-gray-400 truncate">
                                to {t.assigned_to_username}{" "}
                                {t.due_date ? `• due ${t.due_date}` : ""}
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-yellow-900/40 text-yellow-200 rounded text-xs font-bold">
                              {t.status}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Pending task submissions */}
                <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">
                    Pending Task Submissions
                  </h3>
                  <div className="space-y-3">
                    {pendingSubs.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        No pending submissions
                      </p>
                    ) : (
                      pendingSubs.map((s: any) => (
                        <div
                          key={s.id}
                          className="bg-gray-950 border border-gray-800 rounded p-3 flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <div className="font-semibold truncate">
                              {s.task?.title || `Submission ${s.id}`}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                              by {s.submitted_by_username}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                              onClick={() => reviewSubmission(s.id, "approve")}
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                              onClick={() => reviewSubmission(s.id, "reject")}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* All tasks */}
              <div className="mt-6 bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold mb-4">All Tasks</h3>
                <div className="space-y-2">
                  {tasks.length === 0 ? (
                    <p className="text-gray-400">No tasks yet</p>
                  ) : (
                    tasks.map((t: any) => (
                      <div
                        key={t.id}
                        className="bg-gray-950 border border-gray-800 rounded p-3 flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold truncate">
                            {t.title}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            to {t.assigned_to_username}{" "}
                            {t.due_date ? `• due ${t.due_date}` : ""}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            t.status === "OPEN"
                              ? "bg-yellow-900/40 text-yellow-200"
                              : "bg-green-900/40 text-green-200"
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* New Task Modal */}
              {showTaskModal && (
                <div
                  className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setShowTaskModal(false)}
                >
                  <div
                    className="max-w-lg w-full bg-gray-900 border border-gray-800 rounded-xl p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Create Task</h3>
                      <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => setShowTaskModal(false)}
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={createTask} className="space-y-4">
                      {taskMsg && (
                        <div
                          className={`p-3 rounded ${
                            taskMsg.includes("Failed")
                              ? "bg-red-900/50 text-red-300"
                              : "bg-green-900/50 text-green-300"
                          }`}
                        >
                          {taskMsg}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm mb-1">Task Title</label>
                        <input
                          className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
                          placeholder="Enter task title"
                          value={tTitle}
                          onChange={(e) => setTTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
                          placeholder="Describe the task..."
                          value={tDesc}
                          onChange={(e) => setTDesc(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">
                          Assign to User
                        </label>
                        <select
                          className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
                          value={tAssignee}
                          onChange={(e) => setTAssignee(e.target.value)}
                          required
                        >
                          <option value="">Select User</option>
                          {assignees.map((u: any) => (
                            <option key={u.id} value={u.id}>
                              {u.full_name || u.username} • {u.role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Due Date</label>
                        <input
                          type="date"
                          className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
                          value={tDue}
                          onChange={(e) => setTDue(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          className="px-4 py-2 rounded bg-gray-800 border border-gray-700"
                          onClick={() => setShowTaskModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isCreatingTask}
                          className="px-4 py-2 rounded bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-semibold"
                        >
                          {isCreatingTask ? "Assigning..." : "Assign Task"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
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
                          <div className="flex gap-2">
                            <button
                              className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                              onClick={() => approve("blog", b.slug)}
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                              onClick={() => reject("blog", b.slug)}
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
                          <div className="flex gap-2">
                            <button
                              className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                              onClick={() => approve("notice", n.id)}
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                              onClick={() => reject("notice", n.id)}
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
                          <div className="flex gap-2">
                            <button
                              className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                              onClick={() => approve("event", e.slug)}
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                              onClick={() =>
                                rejectEvent(e.slug).then(() =>
                                  listEvents({ status: "PENDING" })
                                    .then(setPendingEvents)
                                    .catch(() => {})
                                )
                              }
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
                          <div className="flex gap-2">
                            <button
                              className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                              onClick={() => approve("project", p.id)}
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                              onClick={() => reject("project", p.id)}
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

              {/* Pending Gallery Items */}
              <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FolderIcon className="w-6 h-6 text-indigo-400" />
                  Pending Gallery ({pendingGallery.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pendingGallery.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">
                      No pending gallery items
                    </p>
                  ) : (
                    pendingGallery.map((g: any) => (
                      <div
                        key={g.id}
                        className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-indigo-500 transition"
                      >
                        <div className="mb-2">
                          <h3 className="font-semibold text-indigo-300">
                            {g.title || "Untitled"}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              approveGallery(g.id).then(() =>
                                listGallery({ status: "PENDING" })
                                  .then(setPendingGallery)
                                  .catch(() => {})
                              )
                            }
                            className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                          >
                            <CheckCircleIcon className="w-4 h-4" /> Approve
                          </button>
                          <button
                            onClick={() =>
                              rejectGallery(g.id).then(() =>
                                listGallery({ status: "PENDING" })
                                  .then(setPendingGallery)
                                  .catch(() => {})
                              )
                            }
                            className="flex-1 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                          >
                            <XMarkIcon className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
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
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <TrophyIcon className="w-8 h-8 text-yellow-400" />
                Leaderboard
              </h1>
              <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800">
                <div className="space-y-3">
                  {leaderboard.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      No leaderboard data available
                    </p>
                  ) : (
                    leaderboard.map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-4 p-4 bg-gray-950 rounded-lg border border-gray-800 hover:border-yellow-500/30 transition"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-gray-900"
                              : index === 1
                              ? "bg-gray-400 text-gray-900"
                              : index === 2
                              ? "bg-orange-600 text-white"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {user.full_name || user.username}
                          </h3>
                          <p className="text-sm text-gray-400">{user.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-yellow-400">
                            {user.points || 0}
                          </p>
                          <p className="text-xs text-gray-400">points</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

// --- Inline CRUD components ---

function SectionHeader({
  title,
  onAdd,
}: {
  title: string;
  onAdd?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          <PlusCircleIcon className="w-5 h-5" /> Add
        </button>
      )}
    </div>
  );
}

function NoticesCrud({
  useNoticesHook,
  role,
  toast,
}: {
  useNoticesHook: typeof useNotices;
  role: string | null;
  toast: ReturnType<typeof useToast>;
}) {
  const { list, create, approve, update, remove } = useNoticesHook();
  const [items, setItems] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("ALL");
  const [file, setFile] = useState<File | null>(null);
  const isAdmin = role === "ADMIN";

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const refresh = async () => {
    const params = isAdmin ? {} : { mine: "1" };
    try {
      setItems(await list(params));
    } catch {}
  };
  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const form = new FormData();
    form.append("title", title);
    form.append("content", content);
    form.append("audience", audience);
    if (file) form.append("attachment", file);
    try {
      await create(form);
      setShowCreateModal(false);
      setTitle("");
      setContent("");
      setAudience("ALL");
      setFile(null);
      toast.success("Notice published successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to publish notice");
    } finally {
      setIsCreating(false);
    }
  };

  const onApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await approve(id);
      toast.success("Notice approved!");
      refresh();
    } catch (error) {
      toast.error("Failed to approve notice");
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = (notice: any) => {
    setNoticeToDelete(notice);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!noticeToDelete) return;
    setIsDeleting(true);
    try {
      await remove(noticeToDelete.id);
      setShowDeleteModal(false);
      setNoticeToDelete(null);
      toast.success("Notice deleted successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to delete notice");
    } finally {
      setIsDeleting(false);
    }
  };

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editAudience, setEditAudience] = useState("ALL");
  const [editFile, setEditFile] = useState<File | null>(null);

  const startEdit = (n: any) => {
    setEditId(n.id);
    setEditTitle(n.title);
    setEditContent(n.content);
    setEditAudience(n.audience);
    setEditFile(null);
    setShowEditModal(true);
  };

  const doEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setIsUpdating(true);
    const form = new FormData();
    form.append("title", editTitle);
    form.append("content", editContent);
    form.append("audience", editAudience);
    if (editFile) form.append("attachment", editFile);
    try {
      await update(editId, form);
      setEditId(null);
      setShowEditModal(false);
      toast.success("Notice updated successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to update notice");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Notices</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Add Notice
        </button>
      </div>

      {/* Notices Table */}
      <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#252b47]">
              <tr>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Title
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Content Preview
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Audience
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Status
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Created
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Attachment
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {items.map((n: any) => {
                const canEditOrDelete = isAdmin || n.status !== "APPROVED";
                const createdDate = new Date(n.created_at).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                );
                return (
                  <tr
                    key={n.id}
                    className="hover:bg-[#252b47] transition-colors"
                  >
                    <td className="p-4 text-white font-medium max-w-xs">
                      <div className="truncate" title={n.title}>
                        {n.title}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 max-w-md">
                      <div className="truncate" title={n.content}>
                        {n.content}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          n.audience === "ALL"
                            ? "bg-green-900 text-green-200"
                            : n.audience === "MEMBERS"
                            ? "bg-blue-900 text-blue-200"
                            : "bg-purple-900 text-purple-200"
                        }`}
                      >
                        {n.audience}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          n.status === "APPROVED"
                            ? "bg-green-900 text-green-200"
                            : n.status === "PENDING"
                            ? "bg-yellow-900 text-yellow-200"
                            : "bg-red-900 text-red-200"
                        }`}
                      >
                        {n.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">{createdDate}</td>
                    <td className="p-4 text-gray-300">
                      {n.attachment ? (
                        <a
                          href={n.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          📎 View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 flex gap-2 flex-wrap">
                      {n.status === "PENDING" && isAdmin && (
                        <button
                          onClick={() => onApprove(n.id)}
                          className="text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors"
                        >
                          <CheckIcon className="w-4 h-4" /> Approve
                        </button>
                      )}
                      {canEditOrDelete && (
                        <>
                          <button
                            onClick={() => startEdit(n)}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                          >
                            <PencilSquareIcon className="w-5 h-5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(n)}
                            className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Notice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-[#1a1f3a] z-10">
              <h2 className="text-2xl font-bold text-white">
                Create New Notice
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={onCreate} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Notice Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Audience
                  </label>
                  <select
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  >
                    <option value="ALL">All</option>
                    <option value="MEMBERS">Members</option>
                    <option value="AMBASSADORS">Ambassadors</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Attachment (Optional)
                  </label>
                  <input
                    type="file"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    rows={6}
                    placeholder="Notice content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
                >
                  {isCreating ? "Publishing..." : "Create Notice"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                  className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-[#1a1f3a] z-10">
              <h2 className="text-2xl font-bold text-white">Edit Notice</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={doEdit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Audience
                  </label>
                  <select
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={editAudience}
                    onChange={(e) => setEditAudience(e.target.value)}
                  >
                    <option value="ALL">All</option>
                    <option value="MEMBERS">Members</option>
                    <option value="AMBASSADORS">Ambassadors</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Update Attachment
                  </label>
                  <input
                    type="file"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    rows={6}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                  className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && noticeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl max-w-md w-full border border-red-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                <TrashIcon className="w-6 h-6" />
                Delete Notice
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-4">
                <p className="text-red-200 font-semibold mb-2">
                  ⚠️ Warning: This action cannot be undone!
                </p>
                <p className="text-gray-300 text-sm">
                  Deleting notice{" "}
                  <span className="font-bold text-white">
                    "{noticeToDelete.title}"
                  </span>{" "}
                  will permanently remove it from the system.
                </p>
              </div>
              <p className="text-gray-300">
                Are you sure you want to delete this notice?
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" />
                  {isDeleting ? "Deleting..." : "Yes, Delete Notice"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setNoticeToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventsCrud({
  useEventsHook,
  role,
  toast,
}: {
  useEventsHook: typeof useEvents;
  role: string | null;
  toast: ReturnType<typeof useToast>;
}) {
  const { list, create, approve, reject, update, remove } = useEventsHook();
  const [items, setItems] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [featured, setFeatured] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  // Edit form state
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editContactEmail, setEditContactEmail] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editComingSoon, setEditComingSoon] = useState(false);

  const isAdmin = role === "ADMIN";

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [approvingSlug, setApprovingSlug] = useState<string | null>(null);
  const [rejectingSlug, setRejectingSlug] = useState<string | null>(null);

  const refresh = async () => {
    const params = isAdmin ? {} : { mine: "1" };
    try {
      setItems(await list(params));
    } catch {}
  };

  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("date", date);
    form.append("time", time);
    form.append("location", location);
    if (image) form.append("image", image);
    if (contactEmail) form.append("contact_email", contactEmail);
    form.append("featured", String(featured));
    form.append("coming_soon", String(comingSoon));
    try {
      await create(form);
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      setImage(null);
      setContactEmail("");
      setFeatured(false);
      setComingSoon(false);
      toast.success("Event created successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to create event");
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (event: any) => {
    setEditSlug(event.slug);
    setEditTitle(event.title || "");
    setEditDate(event.date || "");
    setEditTime(event.time || "");
    setEditLocation(event.location || "");
    setEditDesc(event.description || "");
    setEditContactEmail(event.contact_email || "");
    setEditFeatured(event.featured || false);
    setEditComingSoon(event.coming_soon || false);
    setEditImage(null);
    setShowEditModal(true);
  };

  const doEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSlug) return;
    setIsUpdating(true);
    const form = new FormData();
    form.append("title", editTitle);
    form.append("date", editDate);
    form.append("time", editTime);
    form.append("location", editLocation);
    form.append("description", editDesc);
    if (editContactEmail) form.append("contact_email", editContactEmail);
    form.append("featured", String(editFeatured));
    form.append("coming_soon", String(editComingSoon));
    if (editImage) form.append("image", editImage);
    try {
      await update(editSlug, form);
      setShowEditModal(false);
      setEditSlug(null);
      toast.success("Event updated successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to update event");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = (event: any) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const onDelete = async () => {
    if (!selectedEvent) return;
    setIsDeleting(true);
    try {
      await remove(selectedEvent.slug);
      setShowDeleteModal(false);
      setSelectedEvent(null);
      toast.success("Event deleted successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  const onApprove = async (slug: string) => {
    setApprovingSlug(slug);
    try {
      await approve(slug);
      toast.success("Event approved!");
      refresh();
    } catch (error) {
      toast.error("Failed to approve event");
    } finally {
      setApprovingSlug(null);
    }
  };

  const onReject = async (slug: string) => {
    setRejectingSlug(slug);
    try {
      await reject(slug);
      toast.success("Event rejected!");
      refresh();
    } catch (error) {
      toast.error("Failed to reject event");
    } finally {
      setRejectingSlug(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#252b47] rounded-xl p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Events Management</h2>
            <p className="text-gray-400 text-sm">Create and manage events</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1a1f3a] rounded-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#252b47]">
                <th className="text-left p-4 font-semibold text-gray-300">
                  Title
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Date & Time
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Location
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Tags
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No events found. Create your first event!
                  </td>
                </tr>
              ) : (
                items.map((event: any) => {
                  const canEditOrDelete =
                    isAdmin || event.status !== "APPROVED";
                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-[#252b47] transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-white">
                          {event.title}
                        </div>
                        {event.description && (
                          <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {event.description}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-white">{event.date}</div>
                        {event.time && (
                          <div className="text-sm text-gray-400">
                            {event.time}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-gray-300">{event.location}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === "APPROVED"
                              ? "bg-green-900/50 text-green-300"
                              : event.status === "PENDING"
                              ? "bg-yellow-900/50 text-yellow-300"
                              : "bg-red-900/50 text-red-300"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {event.featured && (
                            <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-xs font-semibold">
                              Featured
                            </span>
                          )}
                          {event.coming_soon && (
                            <span className="px-2 py-1 bg-orange-900/50 text-orange-300 rounded text-xs font-semibold">
                              Coming Soon
                            </span>
                          )}
                          {!event.featured && !event.coming_soon && (
                            <span className="text-gray-500 text-xs">—</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {event.status === "PENDING" && isAdmin && (
                            <>
                              <button
                                onClick={() => onApprove(event.slug)}
                                className="p-2 hover:bg-green-600/20 rounded-lg transition-colors group"
                                title="Approve"
                              >
                                <CheckCircleIcon className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                              </button>
                              <button
                                onClick={() => onReject(event.slug)}
                                className="p-2 hover:bg-yellow-600/20 rounded-lg transition-colors group"
                                title="Reject"
                              >
                                <XMarkIcon className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300" />
                              </button>
                            </>
                          )}
                          {canEditOrDelete && (
                            <>
                              <button
                                onClick={() => startEdit(event)}
                                className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors group"
                                title="Edit"
                              >
                                <PencilSquareIcon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                              </button>
                              <button
                                onClick={() => confirmDelete(event)}
                                className="p-2 hover:bg-red-600/20 rounded-lg transition-colors group"
                                title="Delete"
                              >
                                <TrashIcon className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-blue-400" />
                Create New Event
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={onCreate} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter event location"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the event..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="md:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <span>Featured Event</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={comingSoon}
                      onChange={(e) => setComingSoon(e.target.checked)}
                    />
                    <span>Coming Soon</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PencilSquareIcon className="w-6 h-6 text-blue-400" />
                Edit Event
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={doEdit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    rows={4}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editContactEmail}
                    onChange={(e) => setEditContactEmail(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={editFeatured}
                      onChange={(e) => setEditFeatured(e.target.checked)}
                    />
                    <span>Featured Event</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={editComingSoon}
                      onChange={(e) => setEditComingSoon(e.target.checked)}
                    />
                    <span>Coming Soon</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-md">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrashIcon className="w-6 h-6 text-red-400" />
                Delete Event
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete the event "
                <span className="font-semibold text-white">
                  {selectedEvent.title}
                </span>
                "?
              </p>
              <div className="bg-[#252b47] p-4 rounded-xl mb-6">
                <div className="text-sm text-gray-400 space-y-1">
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {selectedEvent.date}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    {selectedEvent.location}
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogsCrud({
  useBlogsHook,
  role,
  toast,
}: {
  useBlogsHook: typeof useBlogs;
  role: string | null;
  toast: ReturnType<typeof useToast>;
}) {
  const { list, create, approve, update, remove } = useBlogsHook();
  const [items, setItems] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Edit form state
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCover, setEditCover] = useState<File | null>(null);
  const [showEditPreview, setShowEditPreview] = useState(false);
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null);

  const isAdmin = role === "ADMIN";

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [approvingSlug, setApprovingSlug] = useState<string | null>(null);

  const refresh = async () => {
    const params = isAdmin ? {} : { mine: "1" };
    try {
      setItems(await list(params));
    } catch {}
  };

  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("content", content);
    if (cover) form.append("cover_image", cover);
    try {
      await create(form);
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setContent("");
      setCover(null);
      setShowPreview(false);
      toast.success("Blog published successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to publish blog");
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (b: any) => {
    setEditSlug(b.slug);
    setEditTitle(b.title);
    setEditDesc(b.description || "");
    setEditContent(b.content || "");
    setEditCover(null);
    setShowEditPreview(false);
    setShowEditModal(true);
    const coverUrl =
      b.cover_image && (b.cover_image as string).startsWith("http")
        ? b.cover_image
        : `${process.env.NEXT_PUBLIC_API_BASE || ""}${b.cover_image || ""}`;
    setCurrentCoverUrl(b.cover_image ? coverUrl : null);
  };

  const doEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSlug) return;
    setIsUpdating(true);
    const form = new FormData();
    form.append("title", editTitle);
    form.append("description", editDesc);
    form.append("content", editContent);
    if (editCover) form.append("cover_image", editCover);
    try {
      await update(editSlug, form);
      setShowEditModal(false);
      setEditSlug(null);
      setShowEditPreview(false);
      toast.success("Blog updated successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to update blog");
    } finally {
      setIsUpdating(false);
    }
  };

  const onApprove = async (slug: string) => {
    setApprovingSlug(slug);
    try {
      await approve(slug);
      toast.success("Blog approved!");
      refresh();
    } catch (error) {
      toast.error("Failed to approve blog");
    } finally {
      setApprovingSlug(null);
    }
  };

  const confirmDelete = (blog: any) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };

  const onDelete = async () => {
    if (!selectedBlog) return;
    setIsDeleting(true);
    try {
      await remove(selectedBlog.slug);
      setShowDeleteModal(false);
      setSelectedBlog(null);
      toast.success("Blog deleted successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to delete blog");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#252b47] rounded-xl p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DocumentTextIcon className="w-8 h-8 text-pink-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Blogs Management</h2>
            <p className="text-gray-400 text-sm">
              Create and manage blog posts
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Create Blog
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1a1f3a] rounded-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#252b47]">
                <th className="text-left p-4 font-semibold text-gray-300">
                  Title
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Author
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Description
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Cover
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No blogs found. Create your first blog post!
                  </td>
                </tr>
              ) : (
                items.map((b: any) => {
                  const canEditOrDelete = isAdmin || b.status !== "APPROVED";
                  const coverUrl =
                    b.cover_image && b.cover_image.startsWith("http")
                      ? b.cover_image
                      : `${process.env.NEXT_PUBLIC_API_BASE || ""}${
                          b.cover_image || ""
                        }`;

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-[#252b47] transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-white">{b.title}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-300">
                          {b.author_full_name || b.author_username || "Unknown"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-400 text-sm max-w-xs truncate">
                          {b.description || "No description"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            b.status === "APPROVED"
                              ? "bg-green-900/50 text-green-300"
                              : b.status === "PENDING"
                              ? "bg-yellow-900/50 text-yellow-300"
                              : "bg-red-900/50 text-red-300"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {b.cover_image ? (
                          <img
                            src={coverUrl}
                            alt={b.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-gray-500 text-sm">No image</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {b.status === "PENDING" && isAdmin && (
                            <button
                              onClick={() => onApprove(b.slug)}
                              className="p-2 hover:bg-green-600/20 rounded-lg transition-colors group"
                              title="Approve"
                            >
                              <CheckCircleIcon className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                            </button>
                          )}
                          {canEditOrDelete && (
                            <>
                              <button
                                onClick={() => startEdit(b)}
                                className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors group"
                                title="Edit"
                              >
                                <PencilSquareIcon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                              </button>
                              <button
                                onClick={() => confirmDelete(b)}
                                className="p-2 hover:bg-red-600/20 rounded-lg transition-colors group"
                                title="Delete"
                              >
                                <TrashIcon className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-pink-400" />
                Create New Blog Post
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={onCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  uploadPath="/api/app/blog/upload"
                  className="border-gray-600"
                />
                <div className="mt-3 flex items-center gap-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={showPreview}
                      onChange={(e) => setShowPreview(e.target.checked)}
                    />
                    Show Preview
                  </label>
                </div>
                {showPreview && (
                  <div className="mt-3 p-4 bg-[#252b47] border border-gray-600 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      Preview:
                    </h4>
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700"
                  onChange={(e) => setCover(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  {isCreating ? "Publishing..." : "Create Blog"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                  className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PencilSquareIcon className="w-6 h-6 text-blue-400" />
                Edit Blog Post
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={doEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <RichTextEditor
                  value={editContent}
                  onChange={setEditContent}
                  uploadPath="/api/app/blog/upload"
                  className="border-gray-600"
                />
                <div className="mt-3 flex items-center gap-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={showEditPreview}
                      onChange={(e) => setShowEditPreview(e.target.checked)}
                    />
                    Show Preview
                  </label>
                </div>
                {showEditPreview && (
                  <div className="mt-3 p-4 bg-[#252b47] border border-gray-600 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      Preview:
                    </h4>
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: editContent }}
                    />
                  </div>
                )}
              </div>
              {currentCoverUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Cover
                  </label>
                  <img
                    src={currentCoverUrl}
                    alt="Current cover"
                    className="w-full h-48 object-cover rounded-xl border border-gray-700"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  onChange={(e) => setEditCover(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                  className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBlog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-md">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrashIcon className="w-6 h-6 text-red-400" />
                Delete Blog
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete the blog "
                <span className="font-semibold text-white">
                  {selectedBlog.title}
                </span>
                "? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 border border-gray-600 rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryCrud({ toast }: { toast: ReturnType<typeof useToast> }) {
  const { list, create, update, remove, approve, reject } = useGallery();
  const [items, setItems] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // Edit form state
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setItems(await list());
    } catch {}
  };

  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const form = new FormData();
    if (title) form.append("title", title);
    if (description) form.append("description", description);
    if (image) form.append("image", image);
    try {
      await create(form);
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setImage(null);
      setImagePreviewUrl("");
      toast.success("Image uploaded successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsCreating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl("");
    }
  };

  const startEdit = (g: any) => {
    setEditId(g.id);
    setEditTitle(g.title || "");
    setEditDesc(g.description || "");
    setSelectedItem(g);
    setShowEditModal(true);
  };

  const doEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setIsUpdating(true);
    const form = new FormData();
    form.append("title", editTitle);
    form.append("description", editDesc);
    try {
      await update(editId, form);
      setShowEditModal(false);
      setEditId(null);
      setSelectedItem(null);
      toast.success("Gallery item updated!");
      refresh();
    } catch (error) {
      toast.error("Failed to update item");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = (item: any) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const onDelete = async () => {
    if (!selectedItem) return;
    setIsDeleting(true);
    try {
      await remove(selectedItem.id);
      setShowDeleteModal(false);
      setSelectedItem(null);
      toast.success("Image deleted successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  const onApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await approve(id);
      toast.success("Image approved!");
      refresh();
    } catch (error) {
      toast.error("Failed to approve image");
    } finally {
      setApprovingId(null);
    }
  };

  const onReject = async (id: string) => {
    setRejectingId(id);
    try {
      await reject(id);
      toast.success("Image rejected!");
      refresh();
    } catch (error) {
      toast.error("Failed to reject image");
    } finally {
      setRejectingId(null);
    }
  };

  const openImagePreview = (imgUrl: string) => {
    setPreviewImage(imgUrl);
    setShowImagePreview(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#252b47] rounded-xl p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Gallery Management
            </h2>
            <p className="text-gray-400 text-sm">
              Upload and manage images for the gallery
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Upload Image
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            No images in gallery. Upload your first image!
          </div>
        ) : (
          items.map((g: any) => {
            const src =
              g.image && g.image.startsWith("http")
                ? g.image
                : `${process.env.NEXT_PUBLIC_API_BASE || ""}${g.image || ""}`;
            return (
              <div
                key={g.id}
                className="bg-[#1a1f3a] rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20"
              >
                <div
                  className="relative h-48 bg-gray-900 cursor-pointer group"
                  onClick={() => openImagePreview(src)}
                >
                  <img
                    src={src}
                    alt={g.title || "Gallery image"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 truncate">
                    {g.title || "Untitled"}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {g.description || "No description"}
                  </p>
                  <div className="mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        g.status === "APPROVED"
                          ? "bg-green-900/50 text-green-300"
                          : g.status === "PENDING"
                          ? "bg-yellow-900/50 text-yellow-300"
                          : "bg-red-900/50 text-red-300"
                      }`}
                    >
                      {g.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {g.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => onApprove(g.id)}
                          className="flex-1 p-2 hover:bg-green-600/20 rounded-lg transition-colors group"
                          title="Approve"
                        >
                          <CheckCircleIcon className="w-5 h-5 text-green-400 group-hover:text-green-300 mx-auto" />
                        </button>
                        <button
                          onClick={() => onReject(g.id)}
                          className="flex-1 p-2 hover:bg-yellow-600/20 rounded-lg transition-colors group"
                          title="Reject"
                        >
                          <XMarkIcon className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 mx-auto" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => startEdit(g)}
                      className="flex-1 p-2 hover:bg-blue-600/20 rounded-lg transition-colors group"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-5 h-5 text-blue-400 group-hover:text-blue-300 mx-auto" />
                    </button>
                    <button
                      onClick={() => confirmDelete(g)}
                      className="flex-1 p-2 hover:bg-red-600/20 rounded-lg transition-colors group"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5 text-red-400 group-hover:text-red-300 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Upload Image to Gallery
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setImagePreviewUrl("");
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={onCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                  onChange={handleImageChange}
                  required
                />
                {imagePreviewUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-gray-600">
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="w-full h-64 object-contain bg-gray-900"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter image title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter image description"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setImagePreviewUrl("");
                  }}
                  className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PencilSquareIcon className="w-6 h-6 text-blue-400" />
                Edit Image Details
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={doEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Image
                </label>
                <div className="rounded-xl overflow-hidden border border-gray-600">
                  <img
                    src={
                      selectedItem.image &&
                      selectedItem.image.startsWith("http")
                        ? selectedItem.image
                        : `${process.env.NEXT_PUBLIC_API_BASE || ""}${
                            selectedItem.image || ""
                          }`
                    }
                    alt={selectedItem.title || "Gallery image"}
                    className="w-full h-64 object-contain bg-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter image title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Enter image description"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-md">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrashIcon className="w-6 h-6 text-red-400" />
                Delete Image
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete this image?
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-600 mb-4">
                <img
                  src={
                    selectedItem.image && selectedItem.image.startsWith("http")
                      ? selectedItem.image
                      : `${process.env.NEXT_PUBLIC_API_BASE || ""}${
                          selectedItem.image || ""
                        }`
                  }
                  alt={selectedItem.title || "Gallery image"}
                  className="w-full h-48 object-cover bg-gray-900"
                />
              </div>
              {selectedItem.title && (
                <p className="text-white font-semibold mb-2">
                  {selectedItem.title}
                </p>
              )}
              <p className="text-gray-400 text-sm mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowImagePreview(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh]">
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-12 right-0 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function UsersCrud({
  usersApi,
  cm,
  createUser,
  userMsg,
  mode = "committee", // 'committee' or 'ambassadors-alumni'
  toast,
  isCreatingUser,
}: {
  usersApi: ReturnType<typeof useUsers>;
  cm: any;
  createUser: (e: React.FormEvent) => Promise<void>;
  userMsg: string;
  mode?: "committee" | "ambassadors-alumni";
  toast: ReturnType<typeof useToast>;
  isCreatingUser: boolean;
}) {
  const [list, setList] = useState<any[]>([]);
  const [roleTab, setRoleTab] = useState<
    "ALL" | "MEMBER" | "AMBASSADOR" | "ALUMNI"
  >("ALL");
  const [ambFilterYear, setAmbFilterYear] = useState<string>("");
  const [alumFilterYear, setAlumFilterYear] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const refresh = async () => {
    try {
      const allUsers = await usersApi.list();
      // Filter based on mode
      if (mode === "ambassadors-alumni") {
        setList(
          allUsers.filter(
            (u: any) => u.role === "AMBASSADOR" || u.role === "ALUMNI"
          )
        );
      } else {
        // committee mode: show MEMBER and ADMIN only
        setList(
          allUsers.filter((u: any) => u.role === "MEMBER" || u.role === "ADMIN")
        );
      }
    } catch {}
  };
  useEffect(() => {
    refresh();
  }, []);

  // Initialize role based on mode when component mounts
  useEffect(() => {
    if (mode === "ambassadors-alumni") {
      cm.setCmRole("AMBASSADOR");
      cm.setCmPosition(""); // No committee position
    } else if (mode === "committee") {
      cm.setCmRole("MEMBER");
      cm.setCmPosition("President"); // Default to President
    }
  }, [mode]);

  const [editId, setEditId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState("MEMBER");
  const [editFirst, setEditFirst] = useState("");
  const [editLast, setEditLast] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [editCommitteePos, setEditCommitteePos] = useState("");
  const [editCommitteeStart, setEditCommitteeStart] = useState("");
  const [editCommitteeTenure, setEditCommitteeTenure] = useState<
    string | number
  >("");
  const [editLinkedIn, setEditLinkedIn] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editAmbYear, setEditAmbYear] = useState<string>("");
  const [editAlumYear, setEditAlumYear] = useState<string>("");

  // Loading states
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const startEdit = (u: any) => {
    setEditId(u.id);
    setEditRole(u.role);
    setEditFirst(u.first_name || "");
    setEditLast(u.last_name || "");
    setEditEmail(u.email || "");
    setEditPhone(u.phone_number || "");
    setEditPhotoFile(null);
    const c = u.committee || {};
    setEditCommitteePos(c.position || u.committee_position || "");
    setEditCommitteeStart(c.started_from || u.committee_started_from || "");
    setEditCommitteeTenure(
      typeof c.tenure === "number"
        ? c.tenure
        : c.tenure || u.committee_tenure || ""
    );
    setEditLinkedIn(u.linkedin_url || "");
    setEditGithub(u.github_url || "");
    setEditAmbYear((u.ambassador_batch_year_bs ?? "").toString() || "");
    setEditAlumYear((u.alumni_batch_year_bs ?? "").toString() || "");
    setShowEditModal(true);
  };

  const doEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId == null) return;

    setIsUpdating(true);
    const form = new FormData();
    form.append("role", editRole);
    form.append("first_name", editFirst);
    form.append("last_name", editLast);
    form.append("email", editEmail);
    form.append("phone_number", editPhone);
    if (editPhotoFile) form.append("photo", editPhotoFile);
    if (editCommitteePos) form.append("committee.position", editCommitteePos);
    if (editCommitteeStart)
      form.append("committee.started_from", editCommitteeStart);
    if (editCommitteeTenure !== "" && editCommitteeTenure !== null)
      form.append("committee.tenure", String(editCommitteeTenure));
    if (editLinkedIn) form.append("linkedin_url", editLinkedIn);
    if (editGithub) form.append("github_url", editGithub);
    if (editAmbYear) form.append("ambassador_batch_year_bs", editAmbYear);
    if (editAlumYear) form.append("alumni_batch_year_bs", editAlumYear);
    try {
      await usersApi.update(editId, form);
      setEditId(null);
      setShowEditModal(false);
      toast.success("User updated successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (user: any) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await usersApi.remove(userToDelete.id);
      setShowDeleteModal(false);
      setUserToDelete(null);
      toast.success("User deleted successfully!");
      refresh();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser(e);
    // Reset form fields after successful creation
    cm.setCmUsername("");
    cm.setCmEmail("");
    cm.setCmPhone("");
    cm.setCmFirst("");
    cm.setCmLast("");
    cm.setCmLinkedIn("");
    cm.setCmGithub("");
    cm.setCmStart("");
    cm.setCmTenure("");
    cm.setCmPhotoFile(null);
    if (mode === "ambassadors-alumni") {
      cm.setCmRole("AMBASSADOR");
      cm.setCmPosition("");
    } else {
      cm.setCmRole("MEMBER");
      cm.setCmPosition("President");
    }
    setShowCreateModal(false);
    refresh();
  };

  return (
    <div className="w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">
          {mode === "ambassadors-alumni"
            ? "Ambassadors / Alumni"
            : "Users (Committee & Admin)"}
        </h1>
        <div className="flex items-center gap-2">
          {mode === "ambassadors-alumni" && (
            <>
              <select
                value={roleTab}
                onChange={(e) => setRoleTab(e.target.value as any)}
                className="bg-[#252b47] border border-gray-600 p-2 rounded-lg text-sm"
              >
                <option value="ALL">All</option>
                <option value="AMBASSADOR">Ambassadors</option>
                <option value="ALUMNI">Alumni</option>
              </select>
              {roleTab === "AMBASSADOR" && (
                <input
                  value={ambFilterYear}
                  onChange={(e) => setAmbFilterYear(e.target.value)}
                  placeholder="Batch Year (BS)"
                  className="bg-[#252b47] border border-gray-600 p-2 rounded-lg text-sm w-40"
                />
              )}
              {roleTab === "ALUMNI" && (
                <input
                  value={alumFilterYear}
                  onChange={(e) => setAlumFilterYear(e.target.value)}
                  placeholder="Batch Year (BS)"
                  className="bg-[#252b47] border border-gray-600 p-2 rounded-lg text-sm w-40"
                />
              )}
            </>
          )}
          {mode === "committee" && (
            <select
              value={roleTab}
              onChange={(e) => setRoleTab(e.target.value as any)}
              className="bg-[#252b47] border border-gray-600 p-2 rounded-lg text-sm"
            >
              <option value="ALL">All</option>
              <option value="MEMBER">Members</option>
              <option value="ADMIN">Admins</option>
            </select>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-[#252b47]">
              <tr>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Username
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Name
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Email
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Phone
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Role
                </th>
                {mode === "ambassadors-alumni" && (
                  <th className="text-left p-4 text-gray-300 font-semibold">
                    Batch Year (BS)
                  </th>
                )}
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Committee Position
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Committee Start
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Tenure
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Social Links
                </th>
                <th className="text-left p-4 text-gray-300 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {list
                .filter((u: any) => roleTab === "ALL" || u.role === roleTab)
                .filter(
                  (u: any) =>
                    roleTab !== "AMBASSADOR" ||
                    !ambFilterYear ||
                    String(u.ambassador_batch_year_bs || "").includes(
                      ambFilterYear
                    )
                )
                .filter(
                  (u: any) =>
                    roleTab !== "ALUMNI" ||
                    !alumFilterYear ||
                    String(u.alumni_batch_year_bs || "").includes(
                      alumFilterYear
                    )
                )
                .map((u: any) => (
                  <tr
                    key={u.id}
                    className="hover:bg-[#252b47] transition-colors"
                  >
                    <td className="p-4 text-white">{u.username}</td>
                    <td className="p-4 text-white">
                      {u.full_name ||
                        `${u.first_name || ""} ${u.last_name || ""}`.trim() ||
                        "—"}
                    </td>
                    <td className="p-4 text-gray-300">{u.email}</td>
                    <td className="p-4 text-gray-300">
                      {u.phone_number || "—"}
                    </td>
                    <td className="p-4">
                      {(() => {
                        const role = u.role as string;
                        const cls =
                          role === "ADMIN"
                            ? "bg-red-900 text-red-200"
                            : role === "AMBASSADOR"
                            ? "bg-purple-900 text-purple-200"
                            : role === "ALUMNI"
                            ? "bg-green-900 text-green-200"
                            : "bg-blue-900 text-blue-200";
                        return (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}
                          >
                            {role}
                          </span>
                        );
                      })()}
                    </td>
                    {mode === "ambassadors-alumni" && (
                      <td className="p-4 text-gray-300">
                        {u.role === "AMBASSADOR"
                          ? u.ambassador_batch_year_bs || "—"
                          : u.role === "ALUMNI"
                          ? u.alumni_batch_year_bs || "—"
                          : "—"}
                      </td>
                    )}
                    <td className="p-4 text-gray-300">
                      {u.committee?.position || u.committee_position || "—"}
                    </td>
                    <td className="p-4 text-gray-300">
                      {u.committee?.started_from || u.committee_started_from
                        ? new Date(
                            u.committee?.started_from ||
                              u.committee_started_from
                          ).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-4 text-gray-300">
                      {u.committee?.tenure || u.committee_tenure
                        ? `${u.committee?.tenure || u.committee_tenure} year(s)`
                        : "—"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {u.linkedin_url && (
                          <a
                            href={u.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                            title="LinkedIn"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                        )}
                        {u.github_url && (
                          <a
                            href={u.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-300"
                            title="GitHub"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </a>
                        )}
                        {!u.linkedin_url && !u.github_url && (
                          <span className="text-gray-500 text-sm">—</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 flex gap-2 flex-wrap">
                      <button
                        onClick={() => startEdit(u)}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        <PencilSquareIcon className="w-5 h-5" /> Edit
                      </button>
                      {u.role !== "ALUMNI" && (
                        <button
                          onClick={async () => {
                            const year = window.prompt(
                              "Alumni Batch Year (BS)? optional"
                            );
                            try {
                              await usersApi.transform({
                                user_id: u.id,
                                role: "ALUMNI",
                                alumni_batch_year_bs: year
                                  ? Number(year)
                                  : undefined,
                              });
                              refresh();
                            } catch {}
                          }}
                          className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition-colors"
                          title="Transform to Alumni"
                        >
                          Make Alumni
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(u)}
                        className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-[#1a1f3a] z-10">
              <h2 className="text-2xl font-bold text-white">Add New User</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {userMsg && (
                <div
                  className={`p-4 rounded-xl ${
                    userMsg.includes("success") || userMsg.includes("created")
                      ? "bg-green-900/50 text-green-200"
                      : "bg-red-900/50 text-red-200"
                  }`}
                >
                  {userMsg}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Username"
                    value={cm.cmUsername}
                    onChange={(e) => cm.setCmUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Email"
                    value={cm.cmEmail}
                    onChange={(e) => cm.setCmEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone (optional)
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Phone (optional)"
                    value={cm.cmPhone}
                    onChange={(e) => cm.setCmPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First name
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="First name"
                    value={cm.cmFirst}
                    onChange={(e) => cm.setCmFirst(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last name
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Last name"
                    value={cm.cmLast}
                    onChange={(e) => cm.setCmLast(e.target.value)}
                  />
                </div>

                {/* Committee Position - After Last name */}
                {mode === "committee" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Committee Position
                    </label>
                    <select
                      className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      value={cm.cmPosition}
                      onChange={(e) => {
                        const pos = e.target.value;
                        cm.setCmPosition(pos);
                        // Auto-set role based on position for committee members
                        if (pos === "President" || pos === "Vice President") {
                          cm.setCmRole("ADMIN");
                        } else if (pos !== "") {
                          cm.setCmRole("MEMBER");
                        }
                      }}
                    >
                      <option value="President">President</option>
                      <option value="Vice President">Vice President</option>
                      <option value="Secretary">Secretary</option>
                      <option value="Vice Secretary/Treasurer">
                        Vice Secretary/Treasurer
                      </option>
                      <option value="Vice Treasurer">Vice Treasurer</option>
                      <option value="Technical Team">Technical Team</option>
                      <option value="Graphics Designer">
                        Graphics Designer
                      </option>
                      <option value="Communication,Events & HR">
                        Communication,Events & HR
                      </option>
                      <option value="Social Media Manager">
                        Social Media Manager
                      </option>
                      <option value="Consultant">Consultant</option>
                      <option value="Research and Development Team">
                        Research and Development Team
                      </option>
                      <option value="Editor In Chief">Editor In Chief</option>
                    </select>
                  </div>
                )}

                {/* Role - with conditional locking and visibility */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    value={cm.cmRole}
                    onChange={(e) => cm.setCmRole(e.target.value)}
                    disabled={
                      mode === "committee" &&
                      (cm.cmPosition === "President" ||
                        cm.cmPosition === "Vice President" ||
                        (cm.cmPosition !== "" &&
                          cm.cmPosition !== "President" &&
                          cm.cmPosition !== "Vice President"))
                    }
                  >
                    {/* Show MEMBER/ADMIN for committee mode */}
                    {mode === "committee" && (
                      <>
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                      </>
                    )}
                    {/* Show AMBASSADOR/ALUMNI for ambassadors-alumni mode */}
                    {mode === "ambassadors-alumni" && (
                      <>
                        <option value="AMBASSADOR">Ambassador</option>
                        <option value="ALUMNI">Alumni</option>
                      </>
                    )}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {mode === "committee"
                      ? cm.cmPosition === "President" ||
                        cm.cmPosition === "Vice President"
                        ? "President/Vice President automatically set to Admin role"
                        : "Committee members automatically set to Member role"
                      : "Select Ambassador or Alumni"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="LinkedIn URL"
                    value={cm.cmLinkedIn}
                    onChange={(e) => cm.setCmLinkedIn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="GitHub URL"
                    value={cm.cmGithub}
                    onChange={(e) => cm.setCmGithub(e.target.value)}
                  />
                </div>
                <div className={cm.cmRole === "ALUMNI" ? "hidden" : ""}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Committee Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={cm.cmStart}
                    onChange={(e) => cm.setCmStart(e.target.value)}
                  />
                </div>
                <div className={cm.cmRole === "ALUMNI" ? "hidden" : ""}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tenure (years)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Tenure (years)"
                    value={cm.cmTenure}
                    onChange={(e) => cm.setCmTenure(e.target.value as any)}
                  />
                </div>
                {mode === "ambassadors-alumni" && (
                  <>
                    {cm.cmRole === "AMBASSADOR" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ambassador Batch Year (BS)
                        </label>
                        <input
                          className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                          placeholder="2080"
                          value={cm.cmAmbYear}
                          onChange={(e) => cm.setCmAmbYear(e.target.value)}
                        />
                      </div>
                    )}
                    {cm.cmRole === "ALUMNI" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Alumni Batch Year (BS)
                        </label>
                        <input
                          className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                          placeholder="2080"
                          value={cm.cmAlumYear}
                          onChange={(e) => cm.setCmAlumYear(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    onChange={(e) =>
                      cm.setCmPhotoFile(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
                >
                  {isCreatingUser ? "Creating..." : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreatingUser}
                  className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-[#1a1f3a] z-10">
              <h2 className="text-2xl font-bold text-white">Edit User</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={doEdit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={editFirst}
                    onChange={(e) => setEditFirst(e.target.value)}
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={editLast}
                    onChange={(e) => setEditLast(e.target.value)}
                    placeholder="Last Name"
                  />
                </div>

                {/* Committee Position - After Last name */}
                {mode === "committee" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Committee Position
                    </label>
                    <select
                      className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      value={editCommitteePos}
                      onChange={(e) => {
                        const pos = e.target.value;
                        setEditCommitteePos(pos);
                        // Auto-set role based on position for committee members
                        if (pos === "President" || pos === "Vice President") {
                          setEditRole("ADMIN");
                        } else if (pos !== "") {
                          setEditRole("MEMBER");
                        }
                      }}
                    >
                      <option value="President">President</option>
                      <option value="Vice President">Vice President</option>
                      <option value="Secretary">Secretary</option>
                      <option value="Vice Secretary/Treasurer">
                        Vice Secretary/Treasurer
                      </option>
                      <option value="Vice Treasurer">Vice Treasurer</option>
                      <option value="Technical Team">Technical Team</option>
                      <option value="Graphics Designer">
                        Graphics Designer
                      </option>
                      <option value="Communication,Events & HR">
                        Communication,Events & HR
                      </option>
                      <option value="Social Media Manager">
                        Social Media Manager
                      </option>
                      <option value="Consultant">Consultant</option>
                      <option value="Research and Development Team">
                        Research and Development Team
                      </option>
                      <option value="Editor In Chief">Editor In Chief</option>
                    </select>
                  </div>
                )}

                {/* Role - with conditional locking and visibility */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white opacity-70 cursor-not-allowed"
                    value={editRole}
                    disabled
                    onChange={() => {}}
                  >
                    <option value={editRole}>{editRole}</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Role is managed automatically by committee position or via
                    the "Make Alumni" action.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Phone"
                  />
                </div>
                <div className={editRole === "ALUMNI" ? "hidden" : ""}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Committee Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={editCommitteeStart}
                    onChange={(e) => setEditCommitteeStart(e.target.value)}
                  />
                </div>
                <div className={editRole === "ALUMNI" ? "hidden" : ""}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Committee Tenure (years)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={editCommitteeTenure as any}
                    onChange={(e) =>
                      setEditCommitteeTenure(e.target.value as any)
                    }
                    placeholder="Tenure"
                  />
                </div>
                {/* Batch Year fields for Ambassador/Alumni in Edit */}
                {mode === "ambassadors-alumni" && (
                  <>
                    {editRole === "AMBASSADOR" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ambassador Batch Year (BS)
                        </label>
                        <input
                          className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                          placeholder="2080"
                          value={editAmbYear}
                          onChange={(e) => setEditAmbYear(e.target.value)}
                        />
                      </div>
                    )}
                    {editRole === "ALUMNI" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Alumni Batch Year (BS)
                        </label>
                        <input
                          className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                          placeholder="2080"
                          value={editAlumYear}
                          onChange={(e) => setEditAlumYear(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    onChange={(e) =>
                      setEditPhotoFile(e.target.files?.[0] || null)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={editLinkedIn}
                    onChange={(e) => setEditLinkedIn(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                  className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl max-w-md w-full border border-red-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                <TrashIcon className="w-6 h-6" />
                Delete User
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-4">
                <p className="text-red-200 font-semibold mb-2">
                  ⚠️ Warning: This action cannot be undone!
                </p>
                <p className="text-gray-300 text-sm">
                  Deleting user{" "}
                  <span className="font-bold text-white">
                    {userToDelete.username}
                  </span>{" "}
                  will:
                </p>
                <ul className="text-gray-300 text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>Remove all their blog posts</li>
                  <li>Delete their notices and content</li>
                  <li>Remove them from all committees</li>
                </ul>
              </div>
              <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4">
                <p className="text-blue-200 text-sm">
                  💡 <strong>Tip:</strong> If this user has left, consider
                  changing their role to{" "}
                  <span className="font-bold">ALUMNI</span> instead of deleting
                  them.
                </p>
              </div>

              {/* Batch Year fields for Ambassador/Alumni */}
              {cm.cmPosition === "" && (
                <>
                  {cm.cmRole === "AMBASSADOR" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ambassador Batch Year (BS)
                      </label>
                      <input
                        className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        placeholder="2080"
                        value={cm.cmAmbYear}
                        onChange={(e) => cm.setCmAmbYear(e.target.value)}
                      />
                    </div>
                  )}
                  {cm.cmRole === "ALUMNI" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Alumni Batch Year (BS)
                      </label>
                      <input
                        className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        placeholder="2080"
                        value={cm.cmAlumYear}
                        onChange={(e) => cm.setCmAlumYear(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}
              <p className="text-gray-300">
                Are you sure you want to delete{" "}
                <span className="font-bold text-white">
                  {userToDelete.full_name || userToDelete.username}
                </span>
                ?
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" />
                  {isDeleting ? "Deleting..." : "Yes, Delete User"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
