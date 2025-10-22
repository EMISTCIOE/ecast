import { useEffect, useState } from "react";
import Router from "next/router";
import NavBar from "@/components/nav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/footar";
import { useNotices } from "@/lib/hooks/notices";
import { useBlogs } from "@/lib/hooks/blogs";
import RichTextEditor from "@/components/RichTextEditor";
import { useProjects } from "@/lib/hooks/projects";
import { useEvents } from "@/lib/hooks/events";
import {
  BellIcon,
  DocumentTextIcon,
  FolderIcon,
  CalendarIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

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
  const [sidebarUser, setSidebarUser] = useState<{name:string; role?:string; avatarUrl?:string}>();
  const [activeSection, setActiveSection] = useState("overview");
  const [notices, setNotices] = useState<Notice[]>([]);
  const { create: createNoticeApi, list: listNotices } = useNotices();
  const { create: createBlogApi } = useBlogs();
  const { create: createProjectApi } = useProjects();
  const { create: createEventApi } = useEvents();
  const [nTitle, setNTitle] = useState("");
  const [nContent, setNContent] = useState("");
  const [nAudience, setNAudience] = useState("ALL");
  const [nFile, setNFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

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

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      Router.replace("/login");
    } else {
      setAuthReady(true);
      const userStr = localStorage.getItem('user');
      if (userStr) { try { const u = JSON.parse(userStr); setSidebarUser({ name: u.full_name || u.username, role: u.role, avatarUrl: u.user_photo || u.committee_member_photo }); } catch {} }
      // Fetch both ALL and MEMBERS notices (public endpoint supports GET without auth)
      listNotices({ audience: "ALL" }).then((d) =>
        setNotices((prev) => [...prev, ...d])
      );
      listNotices({ audience: "MEMBERS" }).then((d) =>
        setNotices((prev) => [...prev, ...d])
      );
    }
  }, []);

  if (!authReady) return null;

  const sorted = [...notices].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const createNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const form = new FormData();
      form.append('title', nTitle);
      form.append('content', nContent);
      form.append('audience', nAudience);
      if (nFile) form.append('attachment', nFile);
      await createNoticeApi(form);
      setMsg("Notice submitted for approval");
      setNTitle("");
      setNContent("");
      setNFile(null);
    } catch {
      setMsg("Failed to submit notice");
    }
  };

  const createBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
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
    } catch {
      setMsg("Failed to submit blog");
    }
  };

  const handleInsertImage = async (file: File) => {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/app/blog/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` },
      body: form,
    });
    if (res.ok) {
      const data = await res.json();
      const url = data.url;
      setBContent(prev => (prev + `\n<img src="${url}" alt="image" />\n`));
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
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
    }
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
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
    }
  };

  const menuItems = [
    { id: "overview", name: "Overview", icon: HomeIcon },
    { id: "notice", name: "Create Notice", icon: BellIcon },
    { id: "blog", name: "Create Blog", icon: DocumentTextIcon },
    { id: "project", name: "Create Project", icon: FolderIcon },
    { id: "event", name: "Create Event", icon: CalendarIcon },
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
          setExpanded={(v)=>setSidebarCollapsed(!v)}
          user={sidebarUser}
          groups={[{ title:'Main Menu', items:[
            { id:'overview', label:'Overview', icon: HomeIcon as any, active: activeSection==='overview', onClick: ()=>setActiveSection('overview') },
            { id:'notice', label:'Create Notice', icon: BellIcon as any, active: activeSection==='notice', onClick: ()=>setActiveSection('notice') },
            { id:'blog', label:'Create Blog', icon: DocumentTextIcon as any, active: activeSection==='blog', onClick: ()=>setActiveSection('blog') },
            { id:'project', label:'Create Project', icon: FolderIcon as any, active: activeSection==='project', onClick: ()=>setActiveSection('project') },
            { id:'event', label:'Create Event', icon: CalendarIcon as any, active: activeSection==='event', onClick: ()=>setActiveSection('event') },
          ]}]} />

        {/* Main Content */}
        <div className={`${sidebarCollapsed ? 'ml-20' : 'ml-64'} p-6 pt-24 transition-all duration-300`}>
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Member Dashboard
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button
                  onClick={() => setActiveSection("notice")}
                  className="bg-gradient-to-br from-purple-900/50 to-purple-600/30 p-6 rounded-xl border border-purple-500/20 shadow-xl hover:shadow-purple-500/20 transition hover:scale-105"
                >
                  <BellIcon className="w-10 h-10 mb-3 text-purple-400" />
                  <h3 className="text-lg font-semibold">Create Notice</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Post announcements
                  </p>
                </button>

                <button
                  onClick={() => setActiveSection("blog")}
                  className="bg-gradient-to-br from-pink-900/50 to-pink-600/30 p-6 rounded-xl border border-pink-500/20 shadow-xl hover:shadow-pink-500/20 transition hover:scale-105"
                >
                  <DocumentTextIcon className="w-10 h-10 mb-3 text-pink-400" />
                  <h3 className="text-lg font-semibold">Write Blog</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Share your thoughts
                  </p>
                </button>

                <button
                  onClick={() => setActiveSection("project")}
                  className="bg-gradient-to-br from-blue-900/50 to-blue-600/30 p-6 rounded-xl border border-blue-500/20 shadow-xl hover:shadow-blue-500/20 transition hover:scale-105"
                >
                  <FolderIcon className="w-10 h-10 mb-3 text-blue-400" />
                  <h3 className="text-lg font-semibold">Add Project</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Showcase your work
                  </p>
                </button>

                <button
                  onClick={() => setActiveSection("event")}
                  className="bg-gradient-to-br from-green-900/50 to-green-600/30 p-6 rounded-xl border border-green-500/20 shadow-xl hover:shadow-green-500/20 transition hover:scale-105"
                >
                  <CalendarIcon className="w-10 h-10 mb-3 text-green-400" />
                  <h3 className="text-lg font-semibold">Create Event</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Organize activities
                  </p>
                </button>
              </div>

              <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BellIcon className="w-6 h-6 text-purple-400" />
                  Recent Notices
                </h3>
                <div className="space-y-3">
                  {sorted.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className="bg-gray-900/50 p-4 rounded-lg border border-gray-700"
                    >
                      <h4 className="font-semibold text-purple-300">
                        {n.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(n.created_at).toLocaleDateString()} •{" "}
                        {n.audience} • by {n.published_by_username}
                      </p>
                      <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                        {n.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Create Notice Section */}
          {activeSection === "notice" && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <BellIcon className="w-8 h-8 text-purple-400" />
                Create Notice
              </h1>
              <form
                onSubmit={createNotice}
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
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg h-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Submit Notice
                </button>
              </form>
            </div>
          )}

          {/* Create Blog Section */}
          {activeSection === "blog" && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-pink-400" />
                Create Blog
              </h1>
              <form
                onSubmit={createBlog}
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
                  <div className="mt-3">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <input type="checkbox" onChange={(e)=>{
                        const el = document.getElementById('mem-blog-preview');
                        if (!el) return;
                        el.classList.toggle('hidden', !e.target.checked);
                      }} />
                      Preview
                    </label>
                  </div>
                  <div id="mem-blog-preview" className="hidden mt-3 p-4 bg-gray-950 border border-gray-800 rounded">
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
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Submit Blog
                </button>
              </form>
            </div>
          )}

          {/* Create Project Section */}
          {activeSection === "project" && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <FolderIcon className="w-8 h-8 text-blue-400" />
                Create Project
              </h1>
              <form
                onSubmit={createProject}
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
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter project title"
                    value={pTitle}
                    onChange={(e) => setPTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Describe your project..."
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Repository URL
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="https://github.com/..."
                    value={pRepo}
                    onChange={(e) => setPRepo(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Live URL (optional)
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="https://..."
                    value={pLive}
                    onChange={(e) => setPLive(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Project Image
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPImage(e.target.files?.[0] || null)}
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 p-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Submit Project
                </button>
              </form>
            </div>
          )}

          {/* Create Event Section */}
          {activeSection === "event" && (
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <CalendarIcon className="w-8 h-8 text-green-400" />
                Create Event
              </h1>
              <form
                onSubmit={createEvent}
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
                    placeholder="Enter event title"
                    value={eTitle}
                    onChange={(e) => setETitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg h-32 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Describe the event..."
                    value={eDesc}
                    onChange={(e) => setEDesc(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Date
                    </label>
                    <input
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      type="date"
                      value={eDate}
                      onChange={(e) => setEDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Time
                    </label>
                    <input
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      type="time"
                      value={eTime}
                      onChange={(e) => setETime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Location
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Event location"
                    value={eLoc}
                    onChange={(e) => setELoc(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Event Image
                  </label>
                  <input
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700 transition"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEImage(e.target.files?.[0] || null)}
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 p-4 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Submit Event
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
