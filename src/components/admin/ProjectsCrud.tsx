import { useEffect, useState } from "react";
import { useProjects } from "@/lib/hooks/projects";
import { useToast } from "@/hooks/useToast";
import {
  FolderIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { ProjectPreview } from "@/components/ContentPreviews";

export default function ProjectsCrud({
  useProjectsHook,
  role,
  toast,
}: {
  useProjectsHook: typeof useProjects;
  role: string | null;
  toast: ReturnType<typeof useToast>;
}) {
  const { list, create, approve, reject, update, remove } = useProjectsHook();
  const [items, setItems] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [previewProject, setPreviewProject] = useState<any | null>(null);

  // Create state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRepoLink, setEditRepoLink] = useState("");
  const [editLiveLink, setEditLiveLink] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const isAdmin = role === "ADMIN";

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
    // Only append optional fields if they have actual values
    if (repoLink && repoLink.trim()) {
      form.append("repo_link", repoLink.trim());
    }
    if (liveLink && liveLink.trim()) {
      form.append("live_link", liveLink.trim());
    }
    if (image) form.append("image", image);
    try {
      await create(form);
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setRepoLink("");
      setLiveLink("");
      setImage(null);
      toast.success("Project created successfully!");
      refresh();
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.detail ||
        error?.response?.data?.repo_link?.[0] ||
        error?.response?.data?.live_link?.[0] ||
        error?.response?.data?.image?.[0] ||
        "Failed to create project";
      toast.error(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (p: any) => {
    setEditId(p.id);
    setEditTitle(p.title);
    setEditDescription(p.description || "");
    setEditRepoLink(p.repo_link || "");
    setEditLiveLink(p.live_link || "");
    setEditImage(null);
    const imageUrl =
      p.image && (p.image as string).startsWith("http")
        ? p.image
        : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${p.image || ""}`;
    setCurrentImageUrl(p.image ? imageUrl : null);
    setShowEditModal(true);
  };

  const doEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) {
      toast.error("No project selected for editing");
      return;
    }
    setIsUpdating(true);
    const form = new FormData();
    form.append("title", editTitle);
    form.append("description", editDescription);
    // Only append optional fields if they have actual values
    if (editRepoLink && editRepoLink.trim()) {
      form.append("repo_link", editRepoLink.trim());
    }
    if (editLiveLink && editLiveLink.trim()) {
      form.append("live_link", editLiveLink.trim());
    }
    if (editImage) form.append("image", editImage);
    try {
      await update(editId, form);
      setShowEditModal(false);
      setEditId(null);
      toast.success("Project updated successfully!");
      refresh();
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.detail ||
        error?.response?.data?.repo_link?.[0] ||
        error?.response?.data?.live_link?.[0] ||
        "Failed to update project";
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const onApprove = async (id: string) => {
    setApprovingSlug(id);
    try {
      await approve(id);
      toast.success("Project approved!");
      refresh();
    } catch {
      toast.error("Failed to approve project");
    } finally {
      setApprovingSlug(null);
    }
  };

  const onReject = async (id: string) => {
    setRejectingSlug(id);
    try {
      await reject(id as any);
      toast.success("Project rejected");
      refresh();
    } catch {
      toast.error("Failed to reject project");
    } finally {
      setRejectingSlug(null);
    }
  };

  const confirmDelete = (project: any) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const onDelete = async () => {
    if (!selectedProject) return;
    setIsDeleting(true);
    try {
      await remove(selectedProject.id);
      setShowDeleteModal(false);
      setSelectedProject(null);
      toast.success("Project deleted successfully!");
      refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          New Project
        </button>
      </div>

      <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
        {/* Desktop/tablet table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#252b47]">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Title
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Links
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Image
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No projects found.
                  </td>
                </tr>
              ) : (
                items.map((p: any) => {
                  const canEditOrDelete = isAdmin || p.status !== "APPROVED";
                  const imgUrl =
                    p.image && p.image.startsWith("http")
                      ? p.image
                      : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${
                          p.image || ""
                        }`;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#252b47] transition-colors"
                    >
                      <td className="p-4">
                        <div className="text-white font-medium">{p.title}</div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {p.repo_link ? (
                            <a
                              href={p.repo_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline text-sm block"
                            >
                              View Repo
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                          {p.live_link ? (
                            <a
                              href={p.live_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-400 hover:text-green-300 underline text-sm block"
                            >
                              View Demo
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            p.status === "APPROVED"
                              ? "bg-green-900/50 text-green-300"
                              : p.status === "PENDING"
                              ? "bg-yellow-900/50 text-yellow-300"
                              : "bg-red-900/50 text-red-300"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {p.image ? (
                          <img
                            src={imgUrl}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No image
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 items-center flex-wrap">
                          <button
                            onClick={() => setPreviewProject(p)}
                            className="p-2 hover:bg-gray-700/40 rounded-lg"
                            title="Preview"
                          >
                            <EyeIcon className="w-5 h-5 text-gray-300" />
                          </button>
                          {p.status === "PENDING" && isAdmin && (
                            <>
                              <button
                                onClick={() => onApprove(p.id)}
                                className="p-2 hover:bg-green-600/20 rounded-lg"
                                title="Approve"
                              >
                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                              </button>
                              <button
                                onClick={() => onReject(p.id)}
                                className="p-2 hover:bg-yellow-600/20 rounded-lg"
                                title="Reject"
                              >
                                <XMarkIcon className="w-5 h-5 text-yellow-400" />
                              </button>
                            </>
                          )}
                          {canEditOrDelete && (
                            <>
                              <button
                                onClick={() => startEdit(p)}
                                className="p-2 hover:bg-blue-600/20 rounded-lg"
                                title="Edit"
                              >
                                <PencilSquareIcon className="w-5 h-5 text-blue-400" />
                              </button>
                              <button
                                onClick={() => confirmDelete(p)}
                                className="p-2 hover:bg-red-600/20 rounded-lg"
                                title="Delete"
                              >
                                <TrashIcon className="w-5 h-5 text-red-400" />
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

        {/* Mobile list */}
        <div className="md:hidden p-3 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No projects found.</div>
          ) : (
            items.map((p: any) => {
              const canEditOrDelete = isAdmin || p.status !== "APPROVED";
              const imgUrl =
                p.image && p.image.startsWith("http")
                  ? p.image
                  : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${p.image || ""}`;
              return (
                <div key={p.id} className="rounded-xl border border-gray-800 bg-[#111428] p-3 space-y-2">
                  <div className="flex items-start gap-3">
                    {p.image && (
                      <img src={imgUrl} alt={p.title} className="w-16 h-16 rounded-lg object-cover border border-gray-700" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold truncate">{p.title}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === "APPROVED" ? "bg-green-900/60 text-green-300" : p.status === "PENDING" ? "bg-yellow-900/60 text-yellow-300" : "bg-red-900/60 text-red-300"}`}>{p.status}</span>
                        {p.repo_link && (
                          <a href={p.repo_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 underline">Repo</a>
                        )}
                        {p.live_link && (
                          <a href={p.live_link} target="_blank" rel="noopener noreferrer" className="text-xs text-green-300 underline">Demo</a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button onClick={() => setPreviewProject(p)} className="text-gray-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5">Preview</button>
                    {p.status === "PENDING" && isAdmin && (
                      <>
                        <button onClick={() => onApprove(p.id)} className="text-green-300 hover:text-green-200 flex items-center gap-1 px-2 py-1 rounded-lg bg-green-600/20">Approve</button>
                        <button onClick={() => onReject(p.id)} className="text-yellow-300 hover:text-yellow-200 flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-600/20">Reject</button>
                      </>
                    )}
                    {canEditOrDelete && (
                      <>
                        <button onClick={() => startEdit(p)} className="text-blue-300 hover:text-blue-200 flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600/20">Edit</button>
                        <button onClick={() => confirmDelete(p)} className="text-red-300 hover:text-red-200 flex items-center gap-1 px-2 py-1 rounded-lg bg-red-600/20">Delete</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderIcon className="w-6 h-6 text-green-400" /> Create New
                Project
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
                    Title *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Repository Link (optional)
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={repoLink}
                    onChange={(e) => setRepoLink(e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Live Link (optional)
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={liveLink}
                    onChange={(e) => setLiveLink(e.target.value)}
                    placeholder="https://your-project-demo.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Supported: JPG, PNG, GIF, WebP, BMP, SVG (Max: 5MB)
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
                >
                  {isCreating ? "Creating..." : "Create Project"}
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

      {/* Edit Modal and Delete Modal (copied logic from admin) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PencilSquareIcon className="w-6 h-6 text-blue-400" /> Edit
                Project
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
                  Description *
                </label>
                <textarea
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Repository Link (optional)
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editRepoLink}
                    onChange={(e) => setEditRepoLink(e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Live Link (optional)
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editLiveLink}
                    onChange={(e) => setEditLiveLink(e.target.value)}
                    placeholder="https://your-project-demo.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Image (optional)
                </label>
                {currentImageUrl && !editImage && (
                  <div className="mb-2">
                    <img
                      src={currentImageUrl}
                      alt="Current"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-400 mt-1">Current image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Supported: JPG, PNG, GIF, WebP, BMP, SVG (Max: 5MB)
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
                >
                  {isUpdating ? "Updating..." : "Update Project"}
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

      {showDeleteModal && selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-[#1a1f3a] rounded-2xl shadow-2xl max-w-md w-full border border-red-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                <TrashIcon className="w-6 h-6" /> Delete Project
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-300">
                Are you sure you want to delete the project{" "}
                <span className="font-bold text-white">
                  {selectedProject.title}
                </span>
                ?
              </p>
              <p className="text-sm text-gray-400">
                This action cannot be undone.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
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

      {/* Preview */}
      {previewProject && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewProject(null)}
        >
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <ProjectPreview project={previewProject} />
          </div>
        </div>
      )}
    </div>
  );
}
