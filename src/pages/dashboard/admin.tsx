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
import { useProjects } from "@/lib/hooks/projects";
import { useUsers } from "@/lib/hooks/users";
import { useGallery } from "@/lib/hooks/gallery";
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
} from "@heroicons/react/24/outline";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function AdminDashboard() {
  const [authReady, setAuthReady] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarUser, setSidebarUser] = useState<{name:string; role?:string; avatarUrl?:string}>();
  const [activeSection, setActiveSection] = useState("overview");
  const [noticeMsg, setNoticeMsg] = useState("");
  const [blogMsg, setBlogMsg] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [taskMsg, setTaskMsg] = useState("");
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

  // Create user form
  const [cmUsername, setCmUsername] = useState("");
  const [cmEmail, setCmEmail] = useState("");
  const [cmFirst, setCmFirst] = useState("");
  const [cmLast, setCmLast] = useState("");
  const [cmRole, setCmRole] = useState<'MEMBER'|'AMBASSADOR'|'ALUMNI'|'ADMIN'>("MEMBER");
  const [cmPosition, setCmPosition] = useState("");
  const [cmStart, setCmStart] = useState("");
  const [cmTenure, setCmTenure] = useState<number | "">("");
  const [cmPhoto, setCmPhoto] = useState("");
  const [cmPhotoFile, setCmPhotoFile] = useState<File | null>(null);
  const [cmLinkedIn, setCmLinkedIn] = useState("");
  const [cmGithub, setCmGithub] = useState("");

  // Derive role from committee position per rules
  useEffect(() => {
    if (cmPosition === 'President' || cmPosition === 'Vice President') {
      setCmRole('ADMIN' as any);
    } else if (cmPosition) {
      setCmRole('MEMBER' as any);
    }
  }, [cmPosition]);

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
  const { listUsers, pendingSubmissions: pendingSubsApi, reviewSubmission: reviewApi, createTask: createTaskApi } = useAdmin();
  const usersApi = useUsers();
  const galleryApi = useGallery();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const access = localStorage.getItem("access");
    const role = userStr ? JSON.parse(userStr)?.role : null;
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setSidebarUser({ name: u.full_name || u.username, role: u.role, avatarUrl: u.user_photo || u.committee_member_photo });
        setRole(u.role || null);
      } catch {}
    }
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
      // Latest 3 blogs (any status)
      listBlogs().then((all:any[]) => setLatestBlogs((all || []).slice(0,3))).catch(()=>{});
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

      // Fetch leaderboard
      fetch(`${base}/api/auth/leaderboard/`, {
        headers: { Authorization: `Bearer ${access}` },
      })
        .then((r) => r.json())
        .then(setLeaderboard)
        .catch(() => {});
    }
  }, []);

  const createNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeMsg("");
    try {
      const form = new FormData();
      form.append('title', nTitle);
      form.append('content', nContent);
      form.append('audience', nAudience);
      if (nFile) form.append('attachment', nFile);
      await createNoticeApi(form);
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

  // Rich text editor handles images via upload toolbar

  const createCommitteeMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMsg("");
    try {
      const form = new FormData();
      form.append('username', cmUsername);
      form.append('email', cmEmail);
      form.append('first_name', cmFirst);
      form.append('last_name', cmLast);
      form.append('role', cmRole as any);
      if (cmLinkedIn) form.append('linkedin_url', cmLinkedIn);
      if (cmGithub) form.append('github_url', cmGithub);
      if (cmPosition) {
        form.append('committee.position', cmPosition);
        if (cmStart) form.append('committee.started_from', cmStart);
        if (cmTenure !== '' && cmTenure !== null) form.append('committee.tenure', String(cmTenure));
      }
      if (cmPhotoFile) form.append('photo', cmPhotoFile);
      try {
        await usersApi.create(form);
        setUserMsg("User created (email sent if configured).");
      } catch (err:any) {
        // Fallback: legacy committee create (JSON, no photo)
        if (cmPosition) {
          await createCommitteeApi({
            username: cmUsername,
            email: cmEmail,
            first_name: cmFirst,
            last_name: cmLast,
            position: cmPosition,
            started_from: cmStart,
            tenure: cmTenure || 1,
          });
          setUserMsg("User created via committee endpoint.");
        } else {
          setUserMsg(err?.message || "Failed to create user");
          return;
        }
      }
      } catch (e:any) {
      setUserMsg(e?.message || "Failed to create user");
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
    { id: "notices", name: "Notices", icon: BellIcon },
    { id: "blogs", name: "Blogs", icon: DocumentTextIcon },
    { id: "gallery", name: "Gallery", icon: FolderIcon },
    { id: "users", name: "Users", icon: UserGroupIcon },
    { id: "tasks", name: "Assign Task", icon: ClipboardDocumentCheckIcon },
    { id: "moderation", name: "Moderation", icon: ClockIcon },
    { id: "leaderboard", name: "Leaderboard", icon: TrophyIcon },
  ];

  return (
    <>
      <NavBar />
      <div className="flex bg-gray-950 text-white min-h-screen">
        <Sidebar
          expanded={!sidebarCollapsed}
          setExpanded={(v)=>setSidebarCollapsed(!v)}
          user={sidebarUser}
          groups={([
            { title: 'Main Menu', items: [
              { id:'overview', label:'Overview', icon: HomeIcon, active: activeSection==='overview', onClick: ()=>setActiveSection('overview') },
              { id:'notices', label:'Notices', icon: BellIcon, active: activeSection==='notices', onClick: ()=>setActiveSection('notices') },
              { id:'blogs', label:'Blogs', icon: DocumentTextIcon, active: activeSection==='blogs', onClick: ()=>setActiveSection('blogs') },
              { id:'gallery', label:'Gallery', icon: FolderIcon, active: activeSection==='gallery', onClick: ()=>setActiveSection('gallery') },
            ]},
            { title: 'General', items: [
              { id:'tasks', label:'Assign Task', icon: ClipboardDocumentCheckIcon, active: activeSection==='tasks', onClick: ()=>setActiveSection('tasks') },
              { id:'moderation', label:'Moderation', icon: ClockIcon, active: activeSection==='moderation', onClick: ()=>setActiveSection('moderation') },
              { id:'leaderboard', label:'Leaderboard', icon: TrophyIcon, active: activeSection==='leaderboard', onClick: ()=>setActiveSection('leaderboard') },
            ]},
            { title: 'Account', items: [
              { id:'users', label:'Users', icon: UserGroupIcon, active: activeSection==='users', onClick: ()=>setActiveSection('users') },
            ]},
          ]) as SidebarGroup[]}
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

              {/* Latest Blogs (Approve inline) */}
              <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold mb-4">Latest Blogs</h3>
                <div className="space-y-3">
                  {latestBlogs.map((b:any)=> (
                    <div key={b.id} className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded p-3">
                      <div>
                        <div className="font-semibold">{b.title}</div>
                        <div className="text-xs text-gray-400">by {b.author_username} • {b.status}</div>
                      </div>
                      {b.status==='PENDING' && (
                        <button onClick={()=>approve('blog', b.slug)} className="text-green-400 hover:text-green-300">Approve</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Publish Notice Section */}
          {activeSection === "notices" && (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <BellIcon className="w-8 h-8 text-purple-400" />
                Publish Notice
              </h1>
              <form
                onSubmit={createNotice}
                className="bg-gray-900/50 backdrop-blur p-8 rounded-xl border border-gray-800 space-y-5"
              >
                {noticeMsg && (
                  <div
                    className={`p-4 rounded-lg ${
                      noticeMsg.includes("Failed")
                        ? "bg-red-900/50 border border-red-500/50 text-red-300"
                        : "bg-green-900/50 border border-green-500/50 text-green-300"
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
                    className="w-full p-3 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
                    className="w-full p-3 bg-gray-950 border border-gray-700 rounded-lg h-40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Attachment (PDF or Image)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    onChange={(e) => setNFile(e.target.files?.[0] || null)}
                  />
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
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-pink-400" />
                Publish Blog
              </h1>
              <form
                onSubmit={createBlog}
                className="bg-gray-900/50 backdrop-blur p-8 rounded-xl border border-gray-800 space-y-5"
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
                  <RichTextEditor value={bContent} onChange={setBContent} />
                  <div className="mt-3 flex items-center gap-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <input type="checkbox" onChange={(e)=>{
                        const el = document.getElementById('blog-preview');
                        if (!el) return;
                        el.classList.toggle('hidden', !e.target.checked);
                      }} />
                      Preview
                    </label>
                  </div>
                  <div id="blog-preview" className="hidden mt-3 p-4 bg-gray-950 border border-gray-800 rounded">
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: bContent }} />
                  </div>
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


          {/* Notices Section - CRUD */}
          {activeSection === 'notices' && (
            <NoticesCrud useNoticesHook={useNotices} role={role} />
          )}

          {/* Blogs Section - CRUD */}
          {activeSection === 'blogs' && (
            <BlogsCrud useBlogsHook={useBlogs} role={role} />
          )}

          {/* Gallery Section - CRUD */}
          {activeSection === 'gallery' && (
            <GalleryCrud />
          )}

          {/* Users Section - CRUD */}
          {activeSection === 'users' && (
            <UsersCrud usersApi={usersApi} 
              cm={{ cmUsername, setCmUsername, cmEmail, setCmEmail, cmFirst, setCmFirst, cmLast, setCmLast, cmRole, setCmRole, cmPosition, setCmPosition, cmStart, setCmStart, cmTenure, setCmTenure, cmPhoto, setCmPhoto, cmPhotoFile, setCmPhotoFile, cmLinkedIn, setCmLinkedIn, cmGithub, setCmGithub }}
              createUser={createCommitteeMember}
              userMsg={userMsg}
            />
          )}

          {/* Assign Task Section */}
          {activeSection === "tasks" && (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <ClipboardDocumentCheckIcon className="w-8 h-8 text-yellow-400" />
                Assign Task to Ambassador
              </h1>
              <form
                onSubmit={createTask}
                className="bg-gray-900/50 backdrop-blur p-8 rounded-xl border border-gray-800 space-y-5"
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

function SectionHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          <PlusCircleIcon className="w-5 h-5" /> Add
        </button>
      )}
    </div>
  );
}

function NoticesCrud({ useNoticesHook, role }: { useNoticesHook: typeof useNotices; role: string | null }) {
  const { list, create, approve, update, remove } = useNoticesHook();
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('ALL');
  const [file, setFile] = useState<File | null>(null);
  const isAdmin = role === 'ADMIN';

  const refresh = async () => {
    const params = isAdmin ? {} : { mine: '1' };
    try { setItems(await list(params)); } catch {}
  };
  useEffect(() => { refresh(); }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', title);
    form.append('content', content);
    form.append('audience', audience);
    if (file) form.append('attachment', file);
    try { await create(form); setShowForm(false); setTitle(''); setContent(''); setAudience('ALL'); setFile(null); refresh(); } catch {}
  };

  const onApprove = async (id: string) => { try { await approve(id); refresh(); } catch {} };
  const onDelete = async (id: string) => { try { await remove(id); refresh(); } catch {} };

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAudience, setEditAudience] = useState('ALL');
  const startEdit = (n: any) => { setEditId(n.id); setEditTitle(n.title); setEditContent(n.content); setEditAudience(n.audience); };
  const doEdit = async () => {
    if (!editId) return;
    const form = new FormData();
    form.append('title', editTitle);
    form.append('content', editContent);
    form.append('audience', editAudience);
    try { await update(editId, form); setEditId(null); refresh(); } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto">
      <SectionHeader title="Notices" onAdd={() => setShowForm(true)} />
      {showForm && (
        <form onSubmit={onCreate} className="bg-gray-900 border border-gray-800 rounded p-4 mb-6 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input className="bg-gray-800 p-3 rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
            <select className="bg-gray-800 p-3 rounded" value={audience} onChange={e=>setAudience(e.target.value)}>
              <option value="ALL">All</option>
              <option value="MEMBERS">Members</option>
              <option value="AMBASSADORS">Ambassadors</option>
            </select>
          </div>
          <textarea className="bg-gray-800 p-3 rounded w-full" rows={4} placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} />
          <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
          <div className="flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Save</button>
            <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 rounded border border-gray-700">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Audience</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n:any)=>{
              const canEditOrDelete = isAdmin || (n.status !== 'APPROVED');
              return (
                <tr key={n.id} className="border-t border-gray-800">
                  <td className="p-3">
                    {editId===n.id ? (
                      <input className="bg-gray-800 p-2 rounded w-full" value={editTitle} onChange={e=>setEditTitle(e.target.value)} />
                    ) : n.title}
                  </td>
                  <td className="p-3">
                    {editId===n.id ? (
                      <select className="bg-gray-800 p-2 rounded" value={editAudience} onChange={e=>setEditAudience(e.target.value)}>
                        <option value="ALL">All</option>
                        <option value="MEMBERS">Members</option>
                        <option value="AMBASSADORS">Ambassadors</option>
                      </select>
                    ) : n.audience}
                  </td>
                  <td className="p-3">{n.status}</td>
                  <td className="p-3 flex gap-2">
                    {n.status==='PENDING' && isAdmin && (
                      <button onClick={()=>onApprove(n.id)} className="text-green-400">Approve</button>
                    )}
                    {canEditOrDelete && (
                      editId===n.id ? (
                        <>
                          <button onClick={doEdit} className="text-blue-400">Save</button>
                          <button onClick={()=>setEditId(null)} className="text-gray-400">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>startEdit(n)} className="text-blue-400">Edit</button>
                          <button onClick={()=>onDelete(n.id)} className="text-red-400">Delete</button>
                        </>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BlogsCrud({ useBlogsHook, role }: { useBlogsHook: typeof useBlogs; role: string | null }) {
  const { list, create, approve, update, remove } = useBlogsHook();
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const isAdmin = role === 'ADMIN';

  const refresh = async () => {
    const params = isAdmin ? {} : { mine: '1' };
    try { setItems(await list(params)); } catch {}
  };
  useEffect(() => { refresh(); }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('content', content);
    if (cover) form.append('cover_image', cover);
    try { await create(form); setShowForm(false); setTitle(''); setDescription(''); setContent(''); setCover(null); refresh(); } catch {}
  };

  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editContent, setEditContent] = useState('');
  const startEdit = (b:any) => { setEditSlug(b.slug); setEditTitle(b.title); setEditDesc(b.description || ''); setEditContent(b.content || ''); };
  const doEdit = async () => {
    if (!editSlug) return;
    const form = new FormData();
    form.append('title', editTitle);
    form.append('description', editDesc);
    form.append('content', editContent);
    try { await update(editSlug, form); setEditSlug(null); refresh(); } catch {}
  };

  const onApprove = async (slug: string) => { try { await approve(slug); refresh(); } catch {} };
  const onDelete = async (slug: string) => { try { await remove(slug); refresh(); } catch {} };

  return (
    <div className="max-w-5xl mx-auto">
      <SectionHeader title="Blogs" onAdd={()=>setShowForm(true)} />
      {showForm && (
        <form onSubmit={onCreate} className="bg-gray-900 border border-gray-800 rounded p-4 mb-6 space-y-3">
          <input className="bg-gray-800 p-3 rounded w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
          <input className="bg-gray-800 p-3 rounded w-full" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <textarea className="bg-gray-800 p-3 rounded w-full" rows={6} placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} />
          <input type="file" onChange={e=>setCover(e.target.files?.[0] || null)} />
          <div className="flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Save</button>
            <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 rounded border border-gray-700">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Author</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b:any)=>{
              const canEditOrDelete = isAdmin || (b.status !== 'APPROVED');
              return (
                <tr key={b.id} className="border-t border-gray-800">
                  <td className="p-3">{editSlug===b.slug ? (<input className="bg-gray-800 p-2 rounded w-full" value={editTitle} onChange={e=>setEditTitle(e.target.value)} />) : b.title}</td>
                  <td className="p-3">{b.author_username}</td>
                  <td className="p-3">{b.status}</td>
                  <td className="p-3 flex gap-2">
                    {b.status==='PENDING' && isAdmin && (
                      <button onClick={()=>onApprove(b.slug)} className="text-green-400">Approve</button>
                    )}
                    {canEditOrDelete && (
                      editSlug===b.slug ? (
                        <>
                          <button onClick={doEdit} className="text-blue-400">Save</button>
                          <button onClick={()=>setEditSlug(null)} className="text-gray-400">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>startEdit(b)} className="text-blue-400">Edit</button>
                          <button onClick={()=>onDelete(b.slug)} className="text-red-400">Delete</button>
                        </>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GalleryCrud() {
  const { list, create, update, remove, approve, reject } = useGallery();
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const refresh = async () => {
    try { setItems(await list()); } catch {}
  };
  useEffect(() => { refresh(); }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    if (title) form.append('title', title);
    if (description) form.append('description', description);
    if (image) form.append('image', image);
    try { await create(form); setShowForm(false); setTitle(''); setDescription(''); setImage(null); refresh(); } catch {}
  };

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const startEdit = (g:any) => { setEditId(g.id); setEditTitle(g.title || ''); setEditDesc(g.description || ''); };
  const doEdit = async () => { if (!editId) return; const form = new FormData(); form.append('title', editTitle); form.append('description', editDesc); try { await update(editId, form); setEditId(null); refresh(); } catch {} };

  return (
    <div className="max-w-5xl mx-auto">
      <SectionHeader title="Gallery" onAdd={()=>setShowForm(true)} />
      {showForm && (
        <form onSubmit={onCreate} className="bg-gray-900 border border-gray-800 rounded p-4 mb-6 space-y-3">
          <input className="bg-gray-800 p-3 rounded w-full" placeholder="Title (optional)" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="bg-gray-800 p-3 rounded w-full" rows={3} placeholder="Description (optional)" value={description} onChange={e=>setDescription(e.target.value)} />
          <input type="file" onChange={e=>setImage(e.target.files?.[0] || null)} required />
          <div className="flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Upload</button>
            <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 rounded border border-gray-700">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((g:any)=> {
          const src = g.image && g.image.startsWith('http') ? g.image : `${process.env.NEXT_PUBLIC_API_BASE || ''}${g.image || ''}`;
          return (
          <div key={g.id} className="bg-gray-900 border border-gray-800 rounded p-3">
            <img src={src} className="w-full h-40 object-cover rounded" />
            <div className="mt-2 text-sm text-gray-300">{editId===g.id ? (<input className="bg-gray-800 p-2 rounded w-full" value={editTitle} onChange={e=>setEditTitle(e.target.value)} />) : (g.title || '—')}</div>
            <div className="text-xs text-gray-500">{g.status}</div>
            <div className="flex gap-3 mt-2">
              {g.status==='PENDING' ? (
                <>
                  <button onClick={()=>approve(g.id).then(refresh)} className="text-green-400">Approve</button>
                  <button onClick={()=>reject(g.id).then(refresh)} className="text-yellow-400">Reject</button>
                </>
              ) : null}
              {editId===g.id ? (
                <>
                  <button onClick={doEdit} className="text-blue-400">Save</button>
                  <button onClick={()=>setEditId(null)} className="text-gray-400">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={()=>startEdit(g)} className="text-blue-400">Edit</button>
                  <button onClick={()=>remove(g.id).then(refresh)} className="text-red-400">Delete</button>
                </>
              )}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}

function UsersCrud({ usersApi, cm, createUser, userMsg }: {
  usersApi: ReturnType<typeof useUsers>;
  cm: any;
  createUser: (e: React.FormEvent) => Promise<void>;
  userMsg: string;
}) {
  const [list, setList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const refresh = async () => { try { setList(await usersApi.list()); } catch {} };
  useEffect(() => { refresh(); }, []);

  const [editId, setEditId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState('MEMBER');
  const [editFirst, setEditFirst] = useState('');
  const [editLast, setEditLast] = useState('');
  const startEdit = (u:any) => { setEditId(u.id); setEditRole(u.role); setEditFirst(u.first_name || ''); setEditLast(u.last_name || ''); };
  const doEdit = async () => {
    if (editId==null) return;
    const payload = { role: editRole, first_name: editFirst, last_name: editLast };
    try { await usersApi.update(editId, payload); setEditId(null); refresh(); } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader title="Users" onAdd={()=>setShowForm(true)} />
      {showForm && (
        <form onSubmit={createUser} className="bg-gray-900 border border-gray-800 rounded p-4 mb-6 space-y-3">
          {userMsg && <div className="text-sm text-gray-300">{userMsg}</div>}
          <div className="grid md:grid-cols-2 gap-3">
            <input className="bg-gray-800 p-3 rounded" placeholder="Username" value={cm.cmUsername} onChange={(e)=>cm.setCmUsername(e.target.value)} required />
            <input className="bg-gray-800 p-3 rounded" placeholder="Email" value={cm.cmEmail} onChange={(e)=>cm.setCmEmail(e.target.value)} required />
            <input className="bg-gray-800 p-3 rounded" placeholder="First name" value={cm.cmFirst} onChange={(e)=>cm.setCmFirst(e.target.value)} />
            <input className="bg-gray-800 p-3 rounded" placeholder="Last name" value={cm.cmLast} onChange={(e)=>cm.setCmLast(e.target.value)} />
            <select className="bg-gray-800 p-3 rounded" value={cm.cmRole} onChange={(e)=>cm.setCmRole(e.target.value)}>
              <option value="MEMBER">Member</option>
              <option value="AMBASSADOR">Ambassador</option>
              <option value="ALUMNI">Alumni</option>
              <option value="ADMIN">Admin</option>
            </select>
            <input className="bg-gray-800 p-3 rounded" placeholder="LinkedIn URL" value={cm.cmLinkedIn} onChange={(e)=>cm.setCmLinkedIn(e.target.value)} />
            <input className="bg-gray-800 p-3 rounded" placeholder="GitHub URL" value={cm.cmGithub} onChange={(e)=>cm.setCmGithub(e.target.value)} />
            <select className="bg-gray-800 p-3 rounded" value={cm.cmPosition} onChange={(e)=>cm.setCmPosition(e.target.value)}>
              <option value="">No Committee Role</option>
              <option value="President">President</option>
              <option value="Vice President">Vice President</option>
              <option value="Secretary">Secretary</option>
              <option value="Vice Secretary/Treasurer">Vice Secretary/Treasurer</option>
              <option value="Vice Treasurer">Vice Treasurer</option>
              <option value="Technical Team">Technical Team</option>
              <option value="Graphics Designer">Graphics Designer</option>
              <option value="Communication,Events & HR">Communication,Events & HR</option>
              <option value="Social Media Manager">Social Media Manager</option>
              <option value="Consultant">Consultant</option>
              <option value="Research and Development Team">Research and Development Team</option>
              <option value="Editor In Chief">Editor In Chief</option>
            </select>
            <input type="date" className="bg-gray-800 p-3 rounded" value={cm.cmStart} onChange={(e)=>cm.setCmStart(e.target.value)} />
            <input type="number" className="bg-gray-800 p-3 rounded" placeholder="Tenure (years)" value={cm.cmTenure} onChange={(e)=>cm.setCmTenure(e.target.value as any)} />
            {/* Removed Photo URL field; we use file upload below */}
            <input type="file" onChange={(e)=>cm.setCmPhotoFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Create</button>
            <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 rounded border border-gray-700">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900">
            <tr>
              <th className="text-left p-3">Username</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u:any)=> (
              <tr key={u.id} className="border-t border-gray-800">
                <td className="p-3">{u.username}</td>
                <td className="p-3">{editId===u.id ? (
                  <div className="flex gap-2"><input className="bg-gray-800 p-2 rounded" value={editFirst} onChange={e=>setEditFirst(e.target.value)} placeholder="First" />
                  <input className="bg-gray-800 p-2 rounded" value={editLast} onChange={e=>setEditLast(e.target.value)} placeholder="Last" /></div>
                ) : (u.full_name || `${u.first_name || ''} ${u.last_name || ''}`)}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{editId===u.id ? (
                  <select className="bg-gray-800 p-2 rounded" value={editRole} onChange={e=>setEditRole(e.target.value)}>
                    <option value="MEMBER">Member</option>
                    <option value="AMBASSADOR">Ambassador</option>
                    <option value="ALUMNI">Alumni</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                ) : u.role}</td>
                <td className="p-3 flex gap-2">
                  {editId===u.id ? (
                    <>
                      <button onClick={doEdit} className="text-blue-400">Save</button>
                      <button onClick={()=>setEditId(null)} className="text-gray-400">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={()=>startEdit(u)} className="text-blue-400">Edit</button>
                      <button onClick={()=>usersApi.remove(u.id).then(refresh)} className="text-red-400">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
