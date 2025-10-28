import { useEffect, useState } from "react";
import Router from "next/router";
import NavBar from "@/components/nav";
import Sidebar from "@/components/Sidebar";
import ProfileEditModal from "@/components/ProfileEditModal";
import Footer from "@/components/footar";
import MySubmissions from "@/components/MySubmissions";
import { useBlogs } from "@/lib/hooks/blogs";
import { useResearch } from "@/lib/hooks/research";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import BlogsSection from "@/components/dashboard-member/sections/BlogsSection";
import CreateBlogModal from "@/components/modals/CreateBlogModal";
import ResearchSection from "@/components/dashboard-member/sections/ResearchSection";
import CreateResearchModal from "@/components/dashboard-member/modals/CreateResearchModal";
import EditResearchModal from "@/components/dashboard-member/modals/EditResearchModal";
import OverviewSection from "@/components/dashboard-alumni/sections/OverviewSection";
import {
  DocumentTextIcon,
  TrophyIcon,
  HomeIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { authedFetch } from "@/lib/apiClient";

const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function AlumniDashboard() {
  const [authReady, setAuthReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Collapse sidebar on small screens for better mobile responsiveness
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarUser, setSidebarUser] = useState<{
    name: string;
    role?: string;
    avatarUrl?: string;
  }>();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [myBlogs, setMyBlogs] = useState<any[]>([]);
  const [myResearch, setMyResearch] = useState<any[]>([]);
  const [showCreateBlogModal, setShowCreateBlogModal] = useState(false);
  const [showCreateResearchModal, setShowCreateResearchModal] = useState(false);
  const [showEditResearchModal, setShowEditResearchModal] = useState(false);
  const [researchToEdit, setResearchToEdit] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const {
    list: listBlogs,
    create: createBlog,
    update: updateBlog,
    remove: deleteBlog,
  } = useBlogs();
  const {
    list: listResearch,
    create: createResearch,
    update: updateResearch,
    remove: deleteResearch,
  } = useResearch();

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
            : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${raw}`
          : undefined;
        setSidebarUser({
          name: u.full_name || u.username,
          role: u.role,
          avatarUrl: avatar,
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

      // Load user's blogs
      listBlogs({ mine: "1" })
        .then(setMyBlogs)
        .catch(() => {});

      // Load user's research
      listResearch({ mine: "1" })
        .then(setMyResearch)
        .catch(() => {});
    }
  }, []);

  const handleCreateBlog = async (data: {
    title: string;
    description: string;
    content: string;
    coverImage: File | null;
  }) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("content", data.content);
      if (data.coverImage) {
        formData.append("cover_image", data.coverImage);
      }
      await createBlog(formData);
      toast.success("Blog submitted for approval!");
      setShowCreateBlogModal(false);
      // Refresh blogs list
      listBlogs({ mine: "1" }).then(setMyBlogs);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBlog = async (slug: string, formData: FormData) => {
    setIsSubmitting(true);
    try {
      await updateBlog(slug, formData);
      toast.success("Blog updated successfully!");
      listBlogs({ mine: "1" }).then(setMyBlogs);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBlog = async (slug: string): Promise<boolean> => {
    try {
      await deleteBlog(slug);
      toast.success("Blog deleted successfully!");
      listBlogs({ mine: "1" }).then(setMyBlogs);
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete blog");
      return false;
    }
  };

  const canEditOrDeleteBlog = (blog: any) => {
    return blog.status === "PENDING" || blog.status === "REJECTED";
  };

  const handleCreateResearch = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createResearch(formData);
      toast.success("Research submitted for approval!");
      setShowCreateResearchModal(false);
      // Refresh research list
      listResearch({ mine: "1" }).then(setMyResearch);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create research");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditResearch = (research: any) => {
    setResearchToEdit(research);
    setShowEditResearchModal(true);
  };

  const handleUpdateResearch = async (
    slug: string,
    formData: FormData | Record<string, any>
  ) => {
    setIsSubmitting(true);
    try {
      await updateResearch(slug, formData);
      toast.success("Research updated successfully!");
      setShowEditResearchModal(false);
      setResearchToEdit(null);
      listResearch({ mine: "1" }).then(setMyResearch);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update research");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResearch = async (slug: string) => {
    try {
      await deleteResearch(slug);
      toast.success("Research deleted successfully!");
      listResearch({ mine: "1" }).then(setMyResearch);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete research");
    }
  };

  const handleProfileSave = async (data: {
    email?: string;
    phone_number?: string;
    linkedin_url?: string;
    github_url?: string;
    alumni_workplace?: string;
    photo?: File;
  }) => {
    const formData = new FormData();

    // Add all the fields to FormData
    if (data.email) formData.append("email", data.email);
    if (data.phone_number) formData.append("phone_number", data.phone_number);
    if (data.linkedin_url) formData.append("linkedin_url", data.linkedin_url);
    if (data.github_url) formData.append("github_url", data.github_url);
    if (data.alumni_workplace)
      formData.append("alumni_workplace", data.alumni_workplace);
    if (data.photo) formData.append("photo", data.photo);

    const access = localStorage.getItem("access");
    const response = await fetch(`${base}/api/auth/me/profile/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${access}` },
      body: formData,
    });

    if (!response.ok) throw new Error("Update failed");

    const updated = await response.json();
    const raw = updated.user_photo || updated.committee_member_photo || "";
    const avatar = raw
      ? raw.startsWith("http")
        ? raw
        : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${raw}`
      : undefined;
    // Update sidebar user
    setSidebarUser({
      name: updated.full_name || updated.username,
      role: updated.role,
      avatarUrl: avatar,
    });
    // Update localStorage with all updated fields
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      Object.assign(user, updated);
      localStorage.setItem("user", JSON.stringify(user));
    }

    toast.success("Profile updated successfully!");
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
    const raw = updated.user_photo || updated.committee_member_photo || "";
    const avatar = raw
      ? raw.startsWith("http")
        ? raw
        : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${raw}`
      : undefined;
    // Update sidebar user
    setSidebarUser((prev) => ({
      ...prev!,
      avatarUrl: avatar,
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

  // Initialize sidebar collapsed state based on viewport width (mobile first)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const preferCollapsed = window.innerWidth < 1024; // < lg
      setSidebarCollapsed(preferCollapsed);
    }
  }, []);

  if (!authReady) return null;

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen w-full overflow-x-hidden">
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-20 left-4 z-50">
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setSidebarCollapsed((v) => !v);
            }}
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
                  id: "blog",
                  label: "My Blogs",
                  icon: DocumentTextIcon as any,
                  active: activeSection === "blog",
                  onClick: () => setActiveSection("blog"),
                },
                {
                  id: "submissions",
                  label: "My Submissions",
                  icon: DocumentTextIcon as any,
                  active: activeSection === "submissions",
                  onClick: () => setActiveSection("submissions"),
                },
                {
                  id: "research",
                  label: "My Research",
                  icon: DocumentTextIcon as any,
                  active: activeSection === "research",
                  onClick: () => setActiveSection("research"),
                },
              ],
            },
          ]}
        />

        {/* Mobile overlay when sidebar is open */}
        {!sidebarCollapsed && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-30"
            onClick={() => {
              setSidebarCollapsed(true);
              setSidebarOpen(false);
            }}
          />
        )}

        {/* Profile Edit Modal */}
        <ProfileEditModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onSave={handleProfileSave}
          currentImage={sidebarUser?.avatarUrl}
          userName={sidebarUser?.name || ""}
          userEmail={(() => {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr).email || "" : "";
          })()}
          userRole="ALUMNI"
          userPhoneNumber={(() => {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr).phone_number || "" : "";
          })()}
          userLinkedIn={(() => {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr).linkedin_url || "" : "";
          })()}
          userGitHub={(() => {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr).github_url || "" : "";
          })()}
          userAlumniWorkplace={(() => {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr).alumni_workplace || "" : "";
          })()}
        />

        {/* Main Content */}
        <div
          className={`${
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          } ml-0 p-4 md:p-6 pt-24 transition-all duration-300`}
        >
          {/* Profile Completion Hint */}
          {(() => {
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            const hasWorkplace =
              user?.alumni_workplace && user.alumni_workplace.trim() !== "";

            if (!hasWorkplace) {
              return (
                <div className="mb-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-xl p-4 flex items-start gap-4 shadow-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      Complete Your Profile
                    </h3>
                    <p className="text-sm text-gray-300 mb-2">
                      Help us stay connected! Update your current workplace
                      information to let others know where you're working now.
                    </p>
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Update Workplace
                    </button>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* Overview Section */}
          {activeSection === "overview" && (
            <OverviewSection
              blogs={myBlogs}
              research={myResearch}
              onNavigate={setActiveSection}
            />
          )}

          {/* My Blogs Section */}
          {activeSection === "blog" && (
            <BlogsSection
              myBlogs={myBlogs}
              isSubmitting={isSubmitting}
              canEditOrDeleteBlog={canEditOrDeleteBlog}
              onCreateClick={() => setShowCreateBlogModal(true)}
              onUpdate={handleUpdateBlog}
              onDelete={handleDeleteBlog}
              onRefresh={() => listBlogs({ mine: "1" }).then(setMyBlogs)}
            />
          )}

          {activeSection === "submissions" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">My Submissions</h1>
              <MySubmissions role={"ALUMNI"} showTasks={false} />
            </div>
          )}

          {activeSection === "research" && (
            <ResearchSection
              myResearch={myResearch}
              onCreateClick={() => setShowCreateResearchModal(true)}
              onEditClick={handleEditResearch}
              onDeleteClick={handleDeleteResearch}
              isAdmin={false}
            />
          )}
        </div>
      </div>

      {/* Create Blog Modal */}
      <CreateBlogModal
        isOpen={showCreateBlogModal}
        onClose={() => setShowCreateBlogModal(false)}
        onSubmit={handleCreateBlog}
      />

      {/* Create Research Modal */}
      <CreateResearchModal
        isOpen={showCreateResearchModal}
        onClose={() => setShowCreateResearchModal(false)}
        onSubmit={handleCreateResearch}
      />

      {/* Edit Research Modal */}
      <EditResearchModal
        isOpen={showEditResearchModal}
        onClose={() => {
          setShowEditResearchModal(false);
          setResearchToEdit(null);
        }}
        research={researchToEdit}
        onSubmit={handleUpdateResearch}
      />

      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <Footer />
    </>
  );
}
