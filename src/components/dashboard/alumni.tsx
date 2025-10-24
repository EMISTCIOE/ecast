import { useEffect, useState } from "react";
import Router from "next/router";
import NavBar from "@/components/nav";
import Sidebar from "@/components/Sidebar";
import ProfilePictureModal from "@/components/ProfilePictureModal";
import Footer from "@/components/footar";
import MySubmissions from "@/components/MySubmissions";
import { useBlogs } from "@/lib/hooks/blogs";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import BlogsSection from "@/components/dashboard-member/sections/BlogsSection";
import CreateBlogModal from "@/components/modals/CreateBlogModal";
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
  const [stats, setStats] = useState<any>(null);
  const [myBlogs, setMyBlogs] = useState<any[]>([]);
  const [showCreateBlogModal, setShowCreateBlogModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const {
    list: listBlogs,
    create: createBlog,
    update: updateBlog,
    remove: deleteBlog,
  } = useBlogs();

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
        : `${process.env.NEXT_PUBLIC_API_BASE || ""}${raw}`
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
            <OverviewSection blogs={myBlogs} onNavigate={setActiveSection} />
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
        </div>
      </div>

      {/* Create Blog Modal */}
      <CreateBlogModal
        isOpen={showCreateBlogModal}
        onClose={() => setShowCreateBlogModal(false)}
        onSubmit={handleCreateBlog}
      />

      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <Footer />
    </>
  );
}
