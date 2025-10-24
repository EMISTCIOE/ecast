import { useEffect, useState } from "react";
import Router from "next/router";
import NavBar from "@/components/nav";
import Sidebar, { SidebarGroup } from "@/components/Sidebar";
import Footer from "@/components/footar";
import { useBlogs } from "@/lib/hooks/blogs";
import { useNotices } from "@/lib/hooks/notices";
import { useAdmin } from "@/lib/hooks/admin";
import { useEvents } from "@/lib/hooks/events";
import { useTasks } from "@/lib/hooks/tasks";
import { useProjects } from "@/lib/hooks/projects";
import { useUsers } from "@/lib/hooks/users";
import { useIntake, IntakeStatus } from "@/lib/hooks/intake";
import { authedFetch } from "@/lib/apiClient";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import AdminNoticesCrud from "@/components/admin/NoticesCrud";
import AdminBlogsCrud from "@/components/admin/BlogsCrud";
import AdminEventsCrud from "@/components/admin/EventsCrud";
import AdminProjectsCrud from "@/components/admin/ProjectsCrud";
import AdminGalleryCrud from "@/components/admin/GalleryCrud";

import { ComprehensiveAnalyticsDashboard } from "@/components/analytics/ComprehensiveAnalyticsDashboard";
import { ChartCard } from "@/components/analytics/Charts";

import {
  BellIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
  TrophyIcon,
  PlusCircleIcon,
  CalendarIcon,
  FolderIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function AdminDashboard() {
  const [authReady, setAuthReady] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarUser, setSidebarUser] = useState<{
    name: string;
    role?: string;
    avatarUrl?: string;
    position?: string;
  }>();
  const [activeSection, setActiveSection] = useState("overview");
  const toast = useToast();
  const { fetchStatus, updateStatus, fetchInfo } = useIntake();

  const [tasks, setTasks] = useState<any[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [alumniLeaderboard, setAlumniLeaderboard] = useState<any[]>([]);
  const [ambassadorsLeaderboard, setAmbassadorsLeaderboard] = useState<any[]>(
    []
  );
  const [leaderboardTab, setLeaderboardTab] = useState<
    "alumni" | "ambassadors"
  >("ambassadors");
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);

  // Intake status state
  const [intakeStatus, setIntakeStatus] = useState<IntakeStatus | null>(null);
  const [isTogglingIntake, setIsTogglingIntake] = useState(false);
  const [showIntakeDialog, setShowIntakeDialog] = useState(false);
  const [intakeStartDate, setIntakeStartDate] = useState("");
  const [intakeEndDate, setIntakeEndDate] = useState("");
  const [createNewBatch, setCreateNewBatch] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [availableBatches, setAvailableBatches] = useState<any[]>([]);

  // Task form
  const [assignees, setAssignees] = useState<any[]>([]);
  const [tTitle, setTTitle] = useState("");
  const [tDesc, setTDesc] = useState("");
  const [tAssignee, setTAssignee] = useState("");
  const [tDue, setTDue] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskMsg, setTaskMsg] = useState("");

  // Moderation lists (for overview counts only)
  const [pendingBlogs, setPendingBlogs] = useState<any[]>([]);
  const [pendingNotices, setPendingNotices] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [pendingProjects, setPendingProjects] = useState<any[]>([]);
  const [pendingSubs, setPendingSubs] = useState<any[]>([]);
  const [previewSub, setPreviewSub] = useState<any | null>(null);

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const { list: listBlogs } = useBlogs();
  const { list: listNotices } = useNotices();
  const { list: listEvents } = useEvents();
  const { list: listProjects } = useProjects();
  const tasksApi = useTasks();
  const {
    listUsers,
    pendingSubmissions: pendingSubsApi,
    reviewSubmission: reviewApi,
    createTask: createTaskApi,
  } = useAdmin();
  const usersApi = useUsers();

  // Create user form state for UsersCrud
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
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userMsg, setUserMsg] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const access = localStorage.getItem("access");
    const urole = userStr ? JSON.parse(userStr)?.role : null;
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
    if (!access || urole !== "ADMIN") {
      Router.replace("/login");
    } else {
      setAuthReady(true);
      Promise.all([listUsers("AMBASSADOR"), listUsers("MEMBER")])
        .then(([amb, mem]) => setAssignees([...(amb || []), ...(mem || [])]))
        .catch(() => {});
      listBlogs({ status: "PENDING" })
        .then(setPendingBlogs)
        .catch(() => {});
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
      pendingSubsApi()
        .then(setPendingSubs)
        .catch(() => {});
      tasksApi
        .listAssigned()
        .then((d: any[]) => setTasks(Array.isArray(d) ? d : []))
        .catch(() => setTasks([]));

      // Load alumni leaderboard (top 5)
      authedFetch(`${base}/api/auth/leaderboard/alumni/`)
        .then((r) => r.json())
        .then((data) => {
          const top5 = Array.isArray(data) ? data.slice(0, 5) : [];
          setAlumniLeaderboard(top5);
        })
        .catch(() => {});

      // Load ambassadors leaderboard (current batch year only)
      const currentBatchYear = parseInt(
        process.env.NEXT_PUBLIC_CURRENT_BATCH_YEAR || "2082",
        10
      );
      authedFetch(`${base}/api/auth/leaderboard/ambassadors/`)
        .then((r) => r.json())
        .then((data) => {
          const currentBatch = Array.isArray(data)
            ? data.filter(
                (user: any) =>
                  user.batch_year_bs === currentBatchYear && user.is_active
              )
            : [];
          setAmbassadorsLeaderboard(currentBatch);
        })
        .catch(() => {});

      // Load analytics data (last 7 days)
      fetchAnalyticsData();

      // Load intake status
      loadIntakeStatus();
    }
  }, []);

  // Auto-assign role based on committee position in create mode (only for committee mode)
  useEffect(() => {
    if (cmPosition === "President" || cmPosition === "Vice President") {
      setCmRole("ADMIN");
    } else if (cmPosition) {
      setCmRole("MEMBER");
    }
  }, [cmPosition]);

  const loadIntakeStatus = async () => {
    try {
      const status = await fetchStatus();
      console.log("Loaded intake status:", status);
      setIntakeStatus(status);

      // Also load batch information
      const info = await fetchInfo();
      setAvailableBatches(info.batches || []);
    } catch (error) {
      console.error("Failed to load intake status:", error);
    }
  };

  const toggleIntakeStatus = async () => {
    if (!intakeStatus) {
      console.log("No intake status available");
      return;
    }

    // If opening, show dialog to collect parameters
    if (!intakeStatus.is_open) {
      console.log("Opening intake dialog...");
      setShowIntakeDialog(true);
      return;
    }

    // If closing, proceed directly
    setIsTogglingIntake(true);
    try {
      const newStatus = await updateStatus(!intakeStatus.is_open);
      setIntakeStatus(newStatus);
      toast.success(
        `Enrollment ${newStatus.is_open ? "opened" : "closed"} successfully!`
      );

      // Reload intake status to ensure we have the latest data
      await loadIntakeStatus();
    } catch (error) {
      console.error("Failed to toggle intake status:", error);
      toast.error("Failed to update enrollment status");
    } finally {
      setIsTogglingIntake(false);
    }
  };

  const handleOpenIntake = async () => {
    if (!intakeStartDate) {
      toast.error("Please set a start date and time");
      return;
    }

    setIsTogglingIntake(true);
    try {
      const params: any = {
        start_datetime: new Date(intakeStartDate).toISOString(),
        create_new_batch: createNewBatch,
      };

      if (intakeEndDate) {
        params.end_datetime = new Date(intakeEndDate).toISOString();
      }

      if (selectedBatches.length > 0) {
        params.available_batches = selectedBatches;
      }

      const newStatus = await updateStatus(true, params);
      setIntakeStatus(newStatus);
      toast.success("Enrollment opened successfully!");
      setShowIntakeDialog(false);
      // Reset form
      setIntakeStartDate("");
      setIntakeEndDate("");
      setCreateNewBatch(false);
      setSelectedBatches([]);

      // Reload intake status to ensure we have the latest data
      await loadIntakeStatus();
    } catch (error) {
      console.error("Failed to open intake:", error);
      toast.error("Failed to open enrollment");
    } finally {
      setIsTogglingIntake(false);
    }
  };

  const fetchAnalyticsData = async () => {
    setAnalyticsLoading(true);
    try {
      const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
      if (!websiteId || websiteId === "your-website-id-here") {
        setAnalyticsLoading(false);
        return;
      }

      const endAt = new Date().getTime();
      const startAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime();

      const response = await fetch(
        `/api/analytics/umami?websiteId=${websiteId}&startAt=${startAt}&endAt=${endAt}`
      );

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setAnalyticsLoading(false);
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

        // Reset form fields
        setCmUsername("");
        setCmEmail("");
        setCmFirst("");
        setCmLast("");
        setCmPhone("");
        setCmPosition("");
        setCmStart("");
        setCmTenure("");
        setCmPhotoFile(null);
        setCmLinkedIn("");
        setCmGithub("");
        setCmAmbYear("");
        setCmAlumYear("");

        // Small delay before clearing message to let user see it
        setTimeout(() => setUserMsg(""), 3000);
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
      setTTitle("");
      setTDesc("");
      setTAssignee("");
      setTDue("");
      setShowTaskModal(false);
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

  const reviewSubmission = async (
    id: string,
    decision: "approve" | "reject"
  ) => {
    await reviewApi(id, decision);
    // Refresh both the pending submissions and the tasks list so status reflects immediately
    pendingSubsApi()
      .then(setPendingSubs)
      .catch(() => {});
    tasksApi
      .listAssigned()
      .then((d: any[]) => setTasks(Array.isArray(d) ? d : []))
      .catch(() => {});
  };

  if (!authReady) return null;

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
                    id: "leaderboard",
                    label: "Leaderboard",
                    icon: TrophyIcon,
                    active: activeSection === "leaderboard",
                    onClick: () => setActiveSection("leaderboard"),
                  },
                  {
                    id: "analytics",
                    label: "Analytics",
                    icon: PresentationChartLineIcon,
                    active: activeSection === "analytics",
                    onClick: () => setActiveSection("analytics"),
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

        <div
          className={`flex-1 ${
            sidebarCollapsed ? "ml-20" : "ml-64"
          } transition-all duration-300 p-8 mt-16`}
        >
          {activeSection === "overview" && (
            <div className="max-w-7xl mx-auto space-y-4">
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>

              {/* Enrollment Status Control */}
              <div className="mb-4 bg-gradient-to-br from-indigo-900/40 to-indigo-600/20 p-6 rounded-lg border border-indigo-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserPlusIcon className="w-8 h-8 text-indigo-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Enrollment Status
                      </h3>
                      <p className="text-sm text-gray-400">
                        {intakeStatus?.is_open
                          ? "Students can currently submit applications"
                          : "Enrollment is currently closed"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Status</div>
                      <div
                        className={`text-lg font-bold ${
                          intakeStatus?.is_open
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {intakeStatus?.is_open ? "OPEN" : "CLOSED"}
                      </div>
                    </div>
                    <button
                      onClick={toggleIntakeStatus}
                      disabled={isTogglingIntake || !intakeStatus}
                      className={`relative inline-flex items-center h-8 rounded-full w-16 transition-colors duration-200 ease-in-out focus:outline-none ${
                        intakeStatus?.is_open ? "bg-green-600" : "bg-gray-600"
                      } ${
                        isTogglingIntake || !intakeStatus
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <span
                        className={`inline-block w-6 h-6 transform transition-transform duration-200 ease-in-out bg-white rounded-full ${
                          intakeStatus?.is_open
                            ? "translate-x-9"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                {intakeStatus?.message && (
                  <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">Message: </span>
                      {intakeStatus.message}
                    </p>
                  </div>
                )}
                {intakeStatus?.end_date && intakeStatus.is_open && (
                  <div className="mt-2 text-sm text-gray-400">
                    Deadline:{" "}
                    {new Date(intakeStatus.end_date).toLocaleString("en-NP", {
                      timeZone: "Asia/Kathmandu",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveSection("notices")}
                  className="bg-gradient-to-br from-purple-900/30 to-purple-600/20 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition cursor-pointer"
                >
                  <BellIcon className="w-8 h-8 mb-2 text-purple-400" />
                  <h3 className="text-sm font-semibold mb-1">
                    Pending Notices
                  </h3>
                  <p className="text-2xl font-bold text-purple-300">
                    {pendingNotices.length}
                  </p>
                </div>
                <div
                  onClick={() => setActiveSection("blogs")}
                  className="bg-gradient-to-br from-pink-900/30 to-pink-600/20 p-4 rounded-lg border border-pink-500/20 hover:border-pink-500/40 transition cursor-pointer"
                >
                  <DocumentTextIcon className="w-8 h-8 mb-2 text-pink-400" />
                  <h3 className="text-sm font-semibold mb-1">Pending Blogs</h3>
                  <p className="text-2xl font-bold text-pink-300">
                    {pendingBlogs.length}
                  </p>
                </div>
                <div
                  onClick={() => setActiveSection("events")}
                  className="bg-gradient-to-br from-blue-900/30 to-blue-600/20 p-4 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition cursor-pointer"
                >
                  <CalendarIcon className="w-8 h-8 mb-2 text-blue-400" />
                  <h3 className="text-sm font-semibold mb-1">Pending Events</h3>
                  <p className="text-2xl font-bold text-blue-300">
                    {pendingEvents.length}
                  </p>
                </div>
                <div
                  onClick={() => setActiveSection("projects")}
                  className="bg-gradient-to-br from-green-900/30 to-green-600/20 p-4 rounded-lg border border-green-500/20 hover:border-green-500/40 transition cursor-pointer"
                >
                  <FolderIcon className="w-8 h-8 mb-2 text-green-400" />
                  <h3 className="text-sm font-semibold mb-1">
                    Pending Projects
                  </h3>
                  <p className="text-2xl font-bold text-green-300">
                    {pendingProjects.length}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ClipboardDocumentCheckIcon className="w-5 h-5 text-yellow-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveSection("notices")}
                      className="w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 p-2 rounded-lg transition flex items-center gap-2 text-sm"
                    >
                      <PlusCircleIcon className="w-4 h-4" /> Publish Notice
                    </button>
                    <button
                      onClick={() => setActiveSection("blogs")}
                      className="w-full bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 p-2 rounded-lg transition flex items-center gap-2 text-sm"
                    >
                      <PlusCircleIcon className="w-4 h-4" /> Publish Blog
                    </button>
                    <button
                      onClick={() => setActiveSection("projects")}
                      className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 p-2 rounded-lg transition flex items-center gap-2 text-sm"
                    >
                      <PlusCircleIcon className="w-4 h-4" /> Publish Project
                    </button>
                    <button
                      onClick={() => setActiveSection("tasks")}
                      className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 p-2 rounded-lg transition flex items-center gap-2 text-sm"
                    >
                      <PlusCircleIcon className="w-4 h-4" /> Assign Task
                    </button>
                  </div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-3">
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
                <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-blue-400" />
                    Content Stats
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Blogs:</span>
                      <span className="font-semibold text-pink-400">
                        {latestBlogs.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Notices:</span>
                      <span className="font-semibold text-purple-400">
                        {pendingNotices.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Events:</span>
                      <span className="font-semibold text-blue-400">
                        {pendingEvents.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Projects:</span>
                      <span className="font-semibold text-green-400">
                        {pendingProjects.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Charts Section */}
              {analyticsLoading ? (
                <div className="bg-gray-900/50 backdrop-blur p-8 rounded-lg border border-gray-800 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading analytics...</p>
                </div>
              ) : analyticsData ? (
                <div className="space-y-4">
                  {/* Analytics Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-600/20 p-4 rounded-lg border border-blue-500/20">
                      <div className="text-sm text-gray-400 mb-1">
                        Total Visitors
                      </div>
                      <div className="text-2xl font-bold text-blue-300">
                        {analyticsData.summary?.visitors?.value?.toLocaleString() ||
                          0}
                      </div>
                      {analyticsData.summary?.visitors?.change !==
                        undefined && (
                        <div className="text-xs text-gray-400 mt-1">
                          {analyticsData.summary.visitors.change > 0 ? "+" : ""}
                          {analyticsData.summary.visitors.change}% vs prev
                          period
                        </div>
                      )}
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-600/20 p-4 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-gray-400 mb-1">
                        Page Views
                      </div>
                      <div className="text-2xl font-bold text-purple-300">
                        {analyticsData.summary?.pageviews?.value?.toLocaleString() ||
                          0}
                      </div>
                      {analyticsData.summary?.pageviews?.change !==
                        undefined && (
                        <div className="text-xs text-gray-400 mt-1">
                          {analyticsData.summary.pageviews.change > 0
                            ? "+"
                            : ""}
                          {analyticsData.summary.pageviews.change}% vs prev
                          period
                        </div>
                      )}
                    </div>
                    <div className="bg-gradient-to-br from-green-900/30 to-green-600/20 p-4 rounded-lg border border-green-500/20">
                      <div className="text-sm text-gray-400 mb-1">
                        Total Visits
                      </div>
                      <div className="text-2xl font-bold text-green-300">
                        {analyticsData.summary?.visits?.value?.toLocaleString() ||
                          0}
                      </div>
                      {analyticsData.summary?.visits?.change !== undefined && (
                        <div className="text-xs text-gray-400 mt-1">
                          {analyticsData.summary.visits.change > 0 ? "+" : ""}
                          {analyticsData.summary.visits.change}% vs prev period
                        </div>
                      )}
                    </div>
                    <div className="bg-gradient-to-br from-orange-900/30 to-orange-600/20 p-4 rounded-lg border border-orange-500/20">
                      <div className="text-sm text-gray-400 mb-1">
                        Bounce Rate
                      </div>
                      <div className="text-2xl font-bold text-orange-300">
                        {analyticsData.summary?.visits?.value
                          ? Math.round(
                              (analyticsData.summary.bounces.value /
                                analyticsData.summary.visits.value) *
                                100
                            )
                          : 0}
                        %
                      </div>
                      {analyticsData.summary?.bounces?.change !== undefined && (
                        <div className="text-xs text-gray-400 mt-1">
                          {analyticsData.summary.bounces.change > 0 ? "+" : ""}
                          {analyticsData.summary.bounces.change}% vs prev period
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="space-y-4">
                    {/* Top row - Page views and Countries */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {analyticsData.pages &&
                        analyticsData.pages.length > 0 && (
                          <ChartCard
                            title="Top Pages (Last 7 Days)"
                            data={analyticsData.pages.slice(0, 5)}
                            type="bar"
                            color="#3B82F6"
                            height={250}
                          />
                        )}
                      {analyticsData.countries &&
                        analyticsData.countries.length > 0 && (
                          <ChartCard
                            title="Visitors by Country"
                            data={analyticsData.countries.slice(0, 5)}
                            type="bar"
                            color="#10B981"
                            height={250}
                          />
                        )}
                    </div>

                    {/* Second row - Devices and Browsers */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {analyticsData.devices &&
                        analyticsData.devices.length > 0 && (
                          <ChartCard
                            title="Devices"
                            data={analyticsData.devices.slice(0, 5)}
                            type="bar"
                            color="#8B5CF6"
                            height={250}
                          />
                        )}
                      {analyticsData.browsers &&
                        analyticsData.browsers.length > 0 && (
                          <ChartCard
                            title="Browsers"
                            data={analyticsData.browsers.slice(0, 5)}
                            type="bar"
                            color="#F59E0B"
                            height={250}
                          />
                        )}
                    </div>

                    {/* Third row - Referrers and Operating Systems */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {analyticsData.referrers &&
                        analyticsData.referrers.length > 0 && (
                          <ChartCard
                            title="Top Referrers"
                            data={analyticsData.referrers.slice(0, 5)}
                            type="bar"
                            color="#EC4899"
                            height={250}
                          />
                        )}
                      {analyticsData.os && analyticsData.os.length > 0 && (
                        <ChartCard
                          title="Operating Systems"
                          data={analyticsData.os.slice(0, 5)}
                          type="bar"
                          color="#14B8A6"
                          height={250}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900/50 backdrop-blur p-8 rounded-lg border border-gray-800 text-center">
                  <PresentationChartLineIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">Analytics data unavailable</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Configure Umami in .env file
                  </p>
                </div>
              )}

              <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
                <h3 className="text-lg font-semibold mb-3">Latest Blogs</h3>
                <div className="space-y-2">
                  {latestBlogs.slice(0, 5).map((b: any) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded p-2"
                    >
                      <div>
                        <div className="font-semibold text-sm">{b.title}</div>
                        <div className="text-xs text-gray-400">
                          by {b.author_username} • {b.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "projects" && (
            <AdminProjectsCrud
              useProjectsHook={useProjects}
              role={role}
              toast={toast}
            />
          )}
          {activeSection === "events" && (
            <AdminEventsCrud
              useEventsHook={useEvents}
              role={role}
              toast={toast}
            />
          )}
          {activeSection === "notices" && (
            <AdminNoticesCrud
              useNoticesHook={useNotices}
              role={role}
              toast={toast}
            />
          )}
          {activeSection === "blogs" && (
            <AdminBlogsCrud useBlogsHook={useBlogs} role={role} toast={toast} />
          )}
          {activeSection === "gallery" && <AdminGalleryCrud toast={toast} />}

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
                cmAmbYear,
                setCmAmbYear,
                cmAlumYear,
                setCmAlumYear,
              }}
              createUser={createCommitteeMember}
              userMsg={userMsg}
              mode="committee"
            />
          )}

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
              mode="ambassadors-alumni"
            />
          )}

          {activeSection === "tasks" && (
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <ClipboardDocumentCheckIcon className="w-8 h-8 text-yellow-400" />
                  Tasks
                </h1>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 px-4 py-2 rounded-lg"
                >
                  New Task
                </button>
              </div>

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
                            {s.task?.title ||
                              s.task_title ||
                              `Submission ${s.id}`}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            by {s.submitted_by_username}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                            onClick={async () => {
                              try {
                                // If task is not expanded, fetch details for richer preview
                                if (
                                  !s.task ||
                                  (typeof s.task === "string" && s.task)
                                ) {
                                  const taskId =
                                    typeof s.task === "string"
                                      ? s.task
                                      : s.task?.id;
                                  if (taskId) {
                                    const r = await authedFetch(
                                      `${base}/api/tasks/tasks/${taskId}/`
                                    );
                                    if (r.ok) {
                                      const task = await r.json();
                                      setPreviewSub({ ...s, task });
                                      return;
                                    }
                                  }
                                }
                              } catch {}
                              setPreviewSub(s);
                            }}
                          >
                            Preview
                          </button>
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

              {previewSub && (
                <div
                  className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setPreviewSub(null)}
                >
                  <div
                    className="max-w-2xl w-full bg-gray-900 border border-gray-800 rounded-xl p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {previewSub.task?.title ||
                            previewSub.task_title ||
                            `Submission ${previewSub.id}`}
                        </h3>
                        <p className="text-xs text-gray-400">
                          by {previewSub.submitted_by_username} •{" "}
                          {new Date(previewSub.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => setPreviewSub(null)}
                      >
                        ×
                      </button>
                    </div>

                    {(() => {
                      const taskDesc =
                        previewSub.task?.description ||
                        previewSub.task_description;
                      const taskDue =
                        previewSub.task?.due_date || previewSub.task_due_date;
                      if (!taskDesc && !taskDue) return null;
                      return (
                        <div className="mb-4 text-sm text-gray-300 space-y-1">
                          {taskDesc && (
                            <div>
                              <span className="text-gray-400">
                                Task Description:
                              </span>{" "}
                              {taskDesc}
                            </div>
                          )}
                          {taskDue && (
                            <div>
                              <span className="text-gray-400">
                                Assigned Deadline:
                              </span>{" "}
                              {new Date(taskDue).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {previewSub.content && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-1">
                          Submission Notes
                        </div>
                        <div className="whitespace-pre-wrap bg-gray-950 border border-gray-800 rounded p-3 text-gray-200 text-sm">
                          {previewSub.content}
                        </div>
                      </div>
                    )}

                    {previewSub.attachment && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-1">
                          Attachment
                        </div>
                        {(() => {
                          const raw = String(previewSub.attachment || "");
                          const pathOnly = raw.split("?")[0];
                          const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(
                            pathOnly
                          );
                          const isPdf = /\.(pdf)$/i.test(pathOnly);
                          const url = raw.startsWith("http")
                            ? raw
                            : `${
                                process.env.NEXT_PUBLIC_API_BASE ||
                                "http://localhost:8000"
                              }${raw}`;
                          if (isImage) {
                            return (
                              <img
                                src={url}
                                alt="Submission attachment preview"
                                className="max-h-80 rounded border border-gray-800"
                              />
                            );
                          }
                          if (isPdf) {
                            return (
                              <div className="border border-gray-800 rounded overflow-hidden">
                                <iframe
                                  src={`${url}#toolbar=1`}
                                  className="w-full h-96 bg-white"
                                ></iframe>
                              </div>
                            );
                          }
                          return (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm bg-blue-500/10 px-3 py-1.5 rounded"
                            >
                              Open Attachment
                            </a>
                          );
                        })()}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                        onClick={async () => {
                          await reviewSubmission(previewSub.id, "approve");
                          setPreviewSub(null);
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                        onClick={async () => {
                          await reviewSubmission(previewSub.id, "reject");
                          setPreviewSub(null);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}

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

          {activeSection === "analytics" && (
            <div className="w-full">
              <ComprehensiveAnalyticsDashboard
                websiteId={
                  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "your-website-id"
                }
              />
            </div>
          )}

          {activeSection === "leaderboard" && (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <TrophyIcon className="w-8 h-8 text-yellow-400" />
                Leaderboard
              </h1>

              {/* Tab Navigation */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setLeaderboardTab("ambassadors")}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                    leaderboardTab === "ambassadors"
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  Ambassadors (Current Batch)
                </button>
                <button
                  onClick={() => setLeaderboardTab("alumni")}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                    leaderboardTab === "alumni"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  Alumni (Top 5)
                </button>
              </div>

              {/* Ambassadors Tab */}
              {leaderboardTab === "ambassadors" && (
                <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800">
                  <div className="space-y-3">
                    {ambassadorsLeaderboard.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        No ambassadors in current batch
                      </p>
                    ) : (
                      ambassadorsLeaderboard.map((user, _index) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-4 p-4 bg-gray-950 rounded-lg border border-gray-800"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              _index === 0
                                ? "bg-yellow-500 text-gray-900"
                                : _index === 1
                                ? "bg-gray-400 text-gray-900"
                                : _index === 2
                                ? "bg-orange-600 text-white"
                                : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            {_index + 1}
                          </div>
                          {user.photo && (
                            <img
                              src={
                                user.photo.startsWith("http")
                                  ? user.photo
                                  : `${base}${user.photo}`
                              }
                              alt={user.full_name || user.username}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {user.full_name || user.username}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {user.blogs || 0} blogs,{" "}
                              {user.tasks_completed || 0} tasks
                            </p>
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
              )}

              {/* Alumni Tab */}
              {leaderboardTab === "alumni" && (
                <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800">
                  <div className="space-y-3">
                    {alumniLeaderboard.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        No alumni data available
                      </p>
                    ) : (
                      alumniLeaderboard.map((user, index) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-4 p-4 bg-gray-950 rounded-lg border border-gray-800"
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
                          {user.photo && (
                            <img
                              src={
                                user.photo.startsWith("http")
                                  ? user.photo
                                  : `${base}${user.photo}`
                              }
                              alt={user.full_name || user.username}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {user.full_name || user.username}
                            </h3>
                            <p className="text-sm text-gray-400">
                              Batch {user.batch_year_bs} • {user.blogs || 0}{" "}
                              blogs
                            </p>
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* Intake Opening Dialog */}
      {showIntakeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl max-w-2xl w-full border border-indigo-700 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-indigo-400 flex items-center gap-2">
                  <UserPlusIcon className="w-7 h-7" />
                  Open Enrollment
                </h2>
                <button
                  onClick={() => {
                    setShowIntakeDialog(false);
                    setIntakeStartDate("");
                    setIntakeEndDate("");
                    setCreateNewBatch(false);
                    setSelectedBatches([]);
                  }}
                  className="text-gray-400 hover:text-white transition"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-300">
                Configure the enrollment settings before opening registration.
              </p>

              {/* Start Date/Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date & Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                  value={intakeStartDate}
                  onChange={(e) => setIntakeStartDate(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  When should enrollment open?
                </p>
              </div>

              {/* End Date/Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                  value={intakeEndDate}
                  onChange={(e) => setIntakeEndDate(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Leave empty for no deadline
                </p>
              </div>

              {/* Create New Batch */}
              <div className="flex items-center gap-3 p-4 bg-[#252b47] rounded-xl border border-gray-600">
                <input
                  type="checkbox"
                  id="createNewBatch"
                  checked={createNewBatch}
                  onChange={(e) => setCreateNewBatch(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="createNewBatch"
                  className="text-gray-300 cursor-pointer"
                >
                  <div className="font-medium">Create New Batch</div>
                  <div className="text-xs text-gray-400">
                    Check this if you want to start a new batch for enrollment
                  </div>
                </label>
              </div>

              {/* Available Batches Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Batches (Optional)
                </label>
                <div className="bg-[#252b47] border border-gray-600 p-4 rounded-xl space-y-2 max-h-48 overflow-y-auto">
                  {availableBatches.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      No batches available
                    </p>
                  ) : (
                    availableBatches.map((batch: any) => (
                      <div key={batch.code} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`batch-${batch.code}`}
                          checked={selectedBatches.includes(batch.code)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBatches([
                                ...selectedBatches,
                                batch.code,
                              ]);
                            } else {
                              setSelectedBatches(
                                selectedBatches.filter(
                                  (b: string) => b !== batch.code
                                )
                              );
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`batch-${batch.code}`}
                          className="text-gray-300 cursor-pointer flex-1"
                        >
                          {batch.label}
                        </label>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Leave empty to allow all batches
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleOpenIntake}
                  disabled={isTogglingIntake || !intakeStartDate}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  {isTogglingIntake ? "Opening..." : "Open Enrollment"}
                </button>
                <button
                  onClick={() => {
                    setShowIntakeDialog(false);
                    setIntakeStartDate("");
                    setIntakeEndDate("");
                    setCreateNewBatch(false);
                    setSelectedBatches([]);
                  }}
                  disabled={isTogglingIntake}
                  className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

function UsersCrud({
  usersApi,
  cm,
  createUser,
  userMsg,
  mode = "committee",
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
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [userToMakeAlumni, setUserToMakeAlumni] = useState<any>(null);
  const [alumniBatchYear, setAlumniBatchYear] = useState<string>("");
  const [isMakingAlumni, setIsMakingAlumni] = useState(false);

  const refresh = async () => {
    try {
      const allUsers = await usersApi.list();
      if (mode === "ambassadors-alumni") {
        setList(
          allUsers.filter(
            (u: any) => u.role === "AMBASSADOR" || u.role === "ALUMNI"
          )
        );
      } else {
        setList(
          allUsers.filter((u: any) => u.role === "MEMBER" || u.role === "ADMIN")
        );
      }
    } catch {}
  };

  useEffect(() => {
    refresh();
  }, []);

  // Watch for successful user creation to close modal and refresh
  useEffect(() => {
    if (userMsg.includes("User created") && showCreateModal) {
      const timer = setTimeout(() => {
        setShowCreateModal(false);
        refresh();
      }, 1500); // Close modal after 1.5 seconds to let user see the success message
      return () => clearTimeout(timer);
    }
  }, [userMsg, showCreateModal]);

  useEffect(() => {
    if (mode === "ambassadors-alumni") {
      cm.setCmRole("AMBASSADOR");
      cm.setCmPosition("");
      cm.setCmStart("");
      cm.setCmTenure("");
    } else if (mode === "committee") {
      cm.setCmRole("MEMBER");
      cm.setCmPosition("President");
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-assign role based on committee position in edit mode (only for committee mode)
  useEffect(() => {
    if (mode === "committee") {
      if (
        editCommitteePos === "President" ||
        editCommitteePos === "Vice President"
      ) {
        setEditRole("ADMIN");
      } else if (editCommitteePos) {
        setEditRole("MEMBER");
      }
    }
  }, [editCommitteePos, mode]);

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
    if (editPhone) form.append("phone_number", editPhone);
    if (editPhotoFile) form.append("photo", editPhotoFile);
    if (editCommitteePos) form.append("committee.position", editCommitteePos);
    if (editCommitteeStart)
      form.append("committee.started_from", editCommitteeStart);
    if (editCommitteeTenure !== "")
      form.append("committee.tenure", String(editCommitteeTenure));
    if (editLinkedIn) form.append("linkedin_url", editLinkedIn);
    if (editGithub) form.append("github_url", editGithub);
    if (editRole === "AMBASSADOR" && editAmbYear)
      form.append("ambassador_batch_year_bs", editAmbYear);
    if (editRole === "ALUMNI" && editAlumYear)
      form.append("alumni_batch_year_bs", editAlumYear);
    try {
      await usersApi.update(editId, form);
      setShowEditModal(false);
      toast.success("User updated successfully!");
      refresh();
    } catch (e: any) {
      toast.error(e?.message || "Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = (u: any) => {
    setUserToDelete(u);
    setShowDeleteModal(true);
  };

  const doDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await usersApi.remove(userToDelete.id);
      setShowDeleteModal(false);
      setUserToDelete(null);
      toast.success("User deleted successfully!");
      refresh();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmMakeAlumni = (user: any) => {
    setUserToMakeAlumni(user);
    setAlumniBatchYear("");
    setShowAlumniModal(true);
  };

  const makeAlumni = async () => {
    if (!userToMakeAlumni) return;

    if (!alumniBatchYear || !alumniBatchYear.trim()) {
      toast.error("Batch year is required");
      return;
    }

    const batchYearNum = parseInt(alumniBatchYear);
    if (isNaN(batchYearNum) || batchYearNum < 2000 || batchYearNum > 2100) {
      toast.error("Please enter a valid batch year (e.g., 2078)");
      return;
    }

    setIsMakingAlumni(true);
    try {
      const response = await authedFetch(`${base}/api/auth/transform/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userToMakeAlumni.id,
          role: "ALUMNI",
          alumni_batch_year_bs: batchYearNum,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to convert to alumni");
      }

      toast.success(
        `${
          userToMakeAlumni.full_name || userToMakeAlumni.username
        } converted to Alumni successfully!`
      );
      setShowAlumniModal(false);
      setUserToMakeAlumni(null);
      setAlumniBatchYear("");
      refresh();
    } catch (e: any) {
      toast.error(e?.message || "Failed to convert to alumni");
    } finally {
      setIsMakingAlumni(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {mode === "committee" ? "Committee Users" : "Ambassadors / Alumni"}
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
        >
          New User
        </button>
      </div>

      <div className="grid gap-4">
        {list.length === 0 ? (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center text-gray-400">
            No users found.
          </div>
        ) : (
          list.map((u: any) => {
            // Get photo URL - check committee object first, then user_photo field
            const getPhotoUrl = () => {
              let photoUrl = null;

              // Check if committee object exists and has memberPhoto
              if (u.committee && u.committee.memberPhoto) {
                photoUrl = u.committee.memberPhoto;
              } else if (u.user_photo) {
                photoUrl = u.user_photo;
              } else if (u.photo) {
                photoUrl = u.photo;
              }

              if (!photoUrl) return null;

              // If it's already a full URL, return it
              if (photoUrl.startsWith("http")) {
                return photoUrl;
              }

              // Otherwise, prepend the API base URL
              const base =
                process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
              return `${base}${photoUrl}`;
            };

            const photoUrl = getPhotoUrl();

            // For committee members, show their committee position instead of role
            const displayRole =
              u.committee_position ||
              (u.committee && u.committee.position) ||
              u.role;

            return (
              <div
                key={u.id}
                className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* User Photo & Basic Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={u.full_name || u.username}
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/50"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          if (target.nextElementSibling) {
                            (
                              target.nextElementSibling as HTMLElement
                            ).style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="w-16 h-16 rounded-full bg-purple-600/20 border-2 border-purple-500/50 flex items-center justify-center text-purple-400 font-bold text-xl"
                      style={{
                        display: photoUrl ? "none" : "flex",
                      }}
                    >
                      {(u.full_name || u.username || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name & Role */}
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {u.full_name || u.username}
                        </h3>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-600/20 text-purple-400 border border-purple-500/30 uppercase">
                          {displayRole}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                        {/* Email */}
                        {u.email && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">📧</span>
                            <span className="text-gray-300 truncate">
                              {u.email}
                            </span>
                          </div>
                        )}

                        {/* Phone */}
                        {(u.phone || u.phone_number) && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">📱</span>
                            <span className="text-gray-300">
                              {u.phone || u.phone_number}
                            </span>
                          </div>
                        )}

                        {/* Username */}
                        {u.username && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">👤</span>
                            <span className="text-gray-400 text-xs">
                              @{u.username}
                            </span>
                          </div>
                        )}

                        {/* Committee Position (if not already shown as badge) */}
                        {(u.committee_position ||
                          (u.committee && u.committee.position)) && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">👔</span>
                            <span className="text-gray-300 font-medium">
                              {u.committee_position || u.committee.position}
                            </span>
                          </div>
                        )}

                        {/* Committee Start */}
                        {(u.committee_started_from ||
                          (u.committee && u.committee.started_from)) && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">📅</span>
                            <span className="text-gray-300">
                              Started:{" "}
                              {new Date(
                                u.committee_started_from ||
                                  u.committee.started_from
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {/* Committee Tenure */}
                        {(u.committee_tenure ||
                          (u.committee && u.committee.tenure)) && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">⏱️</span>
                            <span className="text-gray-300">
                              Tenure: {u.committee_tenure || u.committee.tenure}{" "}
                              years
                            </span>
                          </div>
                        )}

                        {/* LinkedIn */}
                        {(u.linkedin_url || u.linkedin) && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">💼</span>
                            <a
                              href={u.linkedin_url || u.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 truncate"
                            >
                              LinkedIn
                            </a>
                          </div>
                        )}

                        {/* GitHub */}
                        {(u.github_url || u.github) && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">💻</span>
                            <a
                              href={u.github_url || u.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 truncate"
                            >
                              GitHub
                            </a>
                          </div>
                        )}

                        {/* Ambassador Batch Year */}
                        {u.ambassador_batch_year_bs && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">🎓</span>
                            <span className="text-gray-300">
                              Batch: {u.ambassador_batch_year_bs} BS
                            </span>
                          </div>
                        )}

                        {/* Alumni Batch Year */}
                        {u.alumni_batch_year_bs && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">🎓</span>
                            <span className="text-gray-300">
                              Batch: {u.alumni_batch_year_bs} BS
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Make Alumni button - only show for non-alumni users in committee mode */}
                    {mode === "committee" && u.role !== "ALUMNI" && (
                      <button
                        onClick={() => confirmMakeAlumni(u)}
                        className="p-2 hover:bg-green-600/20 rounded-lg transition-colors"
                        title="Make Alumni"
                      >
                        <span className="text-green-400 text-sm font-semibold px-2">
                          🎓 Change to Alumni
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(u)}
                      className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-5 h-5 text-blue-400" />
                    </button>
                    <button
                      onClick={() => confirmDelete(u)}
                      className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-[#252b47]">
              <h3 className="text-xl font-bold">Create User</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={createUser} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* For Committee Mode: Show committee position and locked role */}
                {mode === "committee" && (
                  <>
                    {/* Committee Position - FIRST */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Committee Position
                      </label>
                      <select
                        className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                        value={cm.cmPosition}
                        onChange={(e) => cm.setCmPosition(e.target.value)}
                      >
                        <option value="">Select Position</option>
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
                          Communication, Events & HR
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
                    {/* Role - LOCKED based on committee position */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role (Auto-assigned)
                      </label>
                      <select
                        className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white opacity-60 cursor-not-allowed"
                        value={cm.cmRole}
                        disabled
                      >
                        <option value="MEMBER">MEMBER</option>
                        <option value="AMBASSADOR">AMBASSADOR</option>
                        <option value="ALUMNI">ALUMNI</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">
                        {cm.cmPosition === "President" ||
                        cm.cmPosition === "Vice President"
                          ? "President & Vice President are automatically assigned ADMIN role"
                          : "Other positions are assigned MEMBER role"}
                      </p>
                    </div>
                  </>
                )}

                {/* For Ambassadors/Alumni Mode: Show role selector (not locked) */}
                {mode === "ambassadors-alumni" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role
                    </label>
                    <select
                      className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                      value={cm.cmRole}
                      onChange={(e) => cm.setCmRole(e.target.value)}
                    >
                      <option value="AMBASSADOR">AMBASSADOR</option>
                      <option value="ALUMNI">ALUMNI</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      Choose between Ambassador or Alumni role
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
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
                    type="email"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={cm.cmEmail}
                    onChange={(e) => cm.setCmEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={cm.cmFirst}
                    onChange={(e) => cm.setCmFirst(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={cm.cmLast}
                    onChange={(e) => cm.setCmLast(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={cm.cmPhone}
                    onChange={(e) => cm.setCmPhone(e.target.value)}
                  />
                </div>

                {/* Committee-specific fields */}
                {mode === "committee" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Committee Start
                      </label>
                      <input
                        type="date"
                        className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                        value={cm.cmStart}
                        onChange={(e) => cm.setCmStart(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Committee Tenure
                      </label>
                      <input
                        type="number"
                        className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                        value={cm.cmTenure as any}
                        onChange={(e) => cm.setCmTenure(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Batch year for Ambassadors/Alumni */}
                {mode === "ambassadors-alumni" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Batch Year (Nepali BS)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                      placeholder="e.g., 2078"
                      value={
                        cm.cmRole === "AMBASSADOR"
                          ? cm.cmAmbYear
                          : cm.cmAlumYear
                      }
                      onChange={(e) => {
                        if (cm.cmRole === "AMBASSADOR") {
                          cm.setCmAmbYear(e.target.value);
                        } else {
                          cm.setCmAlumYear(e.target.value);
                        }
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Enter the batch year in Nepali calendar (BS)
                    </p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={cm.cmLinkedIn}
                    onChange={(e) => cm.setCmLinkedIn(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={cm.cmGithub}
                    onChange={(e) => cm.setCmGithub(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Photo
                  </label>
                  <input
                    type="file"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2"
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />{" "}
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
              {userMsg && (
                <p className="text-sm text-gray-300 mt-2">{userMsg}</p>
              )}
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-[#252b47]">
              <h3 className="text-xl font-bold">Edit User</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={doEdit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* For Committee Mode: Show committee position and locked role */}
                {mode === "committee" && (
                  <>
                    {/* Committee Position - FIRST */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Committee Position
                      </label>
                      <select
                        className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                        value={editCommitteePos}
                        onChange={(e) => setEditCommitteePos(e.target.value)}
                      >
                        <option value="">Select Position</option>
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
                          Communication, Events & HR
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
                    {/* Role - LOCKED based on committee position */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role (Auto-assigned)
                      </label>
                      <select
                        className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white opacity-60 cursor-not-allowed"
                        value={editRole}
                        disabled
                      >
                        <option value="MEMBER">MEMBER</option>
                        <option value="AMBASSADOR">AMBASSADOR</option>
                        <option value="ALUMNI">ALUMNI</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">
                        {editCommitteePos === "President" ||
                        editCommitteePos === "Vice President"
                          ? "President & Vice President are automatically assigned ADMIN role"
                          : "Other positions are assigned MEMBER role"}
                      </p>
                    </div>
                  </>
                )}

                {/* For Ambassadors/Alumni Mode: Show role selector (not locked) */}
                {mode === "ambassadors-alumni" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role
                    </label>
                    <select
                      className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    >
                      <option value="AMBASSADOR">AMBASSADOR</option>
                      <option value="ALUMNI">ALUMNI</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      Choose between Ambassador or Alumni role
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={editFirst}
                    onChange={(e) => setEditFirst(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={editLast}
                    onChange={(e) => setEditLast(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Photo
                  </label>
                  <input
                    type="file"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2"
                    onChange={(e) =>
                      setEditPhotoFile(e.target.files?.[0] || null)
                    }
                  />
                </div>

                {/* Committee-specific fields */}
                {mode === "committee" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Committee Start
                      </label>
                      <input
                        type="date"
                        className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                        value={editCommitteeStart}
                        onChange={(e) => setEditCommitteeStart(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Committee Tenure
                      </label>
                      <input
                        type="number"
                        className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                        value={editCommitteeTenure as any}
                        onChange={(e) => setEditCommitteeTenure(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Batch year for Ambassadors/Alumni */}
                {mode === "ambassadors-alumni" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Batch Year (Nepali BS)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                      placeholder="e.g., 2078"
                      value={
                        editRole === "AMBASSADOR" ? editAmbYear : editAlumYear
                      }
                      onChange={(e) => {
                        if (editRole === "AMBASSADOR") {
                          setEditAmbYear(e.target.value);
                        } else {
                          setEditAlumYear(e.target.value);
                        }
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Enter the batch year in Nepali calendar (BS)
                    </p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={editLinkedIn}
                    onChange={(e) => setEditLinkedIn(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />{" "}
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

      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl max-w-md w-full border border-red-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                <TrashIcon className="w-6 h-6" /> Delete User
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-300">
                Are you sure you want to delete{" "}
                <span className="font-bold text-white">
                  {userToDelete.full_name || userToDelete.username}
                </span>
                ?
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={doDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" />{" "}
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

      {showAlumniModal && userToMakeAlumni && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl max-w-md w-full border border-green-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                🎓 Make Alumni
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-300">
                Convert{" "}
                <span className="font-bold text-white">
                  {userToMakeAlumni.full_name || userToMakeAlumni.username}
                </span>{" "}
                to Alumni?
              </p>
              <p className="text-sm text-yellow-400 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30">
                ⚠️ This will clear their committee position, start date, and
                tenure.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alumni Batch Year (Nepali BS){" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                  placeholder="e.g., 2078"
                  value={alumniBatchYear}
                  onChange={(e) => setAlumniBatchYear(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isMakingAlumni) {
                      e.preventDefault();
                      makeAlumni();
                    }
                  }}
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the batch year in Nepali calendar (BS)
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={makeAlumni}
                  disabled={isMakingAlumni}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />{" "}
                  {isMakingAlumni ? "Converting..." : "Confirm & Make Alumni"}
                </button>
                <button
                  onClick={() => {
                    setShowAlumniModal(false);
                    setUserToMakeAlumni(null);
                    setAlumniBatchYear("");
                  }}
                  disabled={isMakingAlumni}
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
