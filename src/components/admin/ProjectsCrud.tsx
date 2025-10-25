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
  const [editSlug, setEditSlug] = useState<string | null>(null);
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
    if (repoLink) form.append("repo_link", repoLink);
    if (liveLink) form.append("live_link", liveLink);
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
    } catch {
      toast.error("Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (p: any) => {
    setEditSlug(p.slug);
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
    if (!editSlug) return;
    setIsUpdating(true);
    const form = new FormData();
    form.append("title", editTitle);
    form.append("description", editDescription);
    if (editRepoLink) form.append("repo_link", editRepoLink);
    if (editLiveLink) form.append("live_link", editLiveLink);
    if (editImage) form.append("image", editImage);
    try {
      await update(editSlug, form);
      setShowEditModal(false);
      setEditSlug(null);
      toast.success("Project updated successfully!");
      refresh();
    } catch {
      toast.error("Failed to update project");
    } finally {
      setIsUpdating(false);
    }
  };

  const onApprove = async (slug: string) => {
    setApprovingSlug(slug);
    try {
      await approve(slug);
      toast.success("Project approved!");
      refresh();
    } catch {
      toast.error("Failed to approve project");
    } finally {
      setApprovingSlug(null);
    }
  };

  const onReject = async (slug: string) => {
    setRejectingSlug(slug);
    try {
      await reject(slug as any);
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
      await remove(selectedProject.slug);
      setShowDeleteModal(false);
      setSelectedProject(null);
      toast.success("Project deleted successfully!");
      refresh();
    } catch {
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
        <div className="overflow-x-auto">
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
                        <div className="text-sm text-blue-300 space-y-1">
                          {p.repo_link && (
                            <a
                              href={p.repo_link}
                              target="_blank"
                              className="underline"
                            >
                              Repo
                            </a>
                          )}
                          {p.live_link && (
                            <a
                              href={p.live_link}
                              target="_blank"
                              className="underline"
                            >
                              Live
                            </a>
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
                                onClick={() => onApprove(p.slug)}
                                className="p-2 hover:bg-green-600/20 rounded-lg"
                                title="Approve"
                              >
                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                              </button>
                              <button
                                onClick={() => onReject(p.slug)}
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
                    Repository Link
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={repoLink}
                    onChange={(e) => setRepoLink(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Live Link
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={liveLink}
                    onChange={(e) => setLiveLink(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                  />
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
                    Repository Link
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editRepoLink}
                    onChange={(e) => setEditRepoLink(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Live Link
                  </label>
                  <input
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editLiveLink}
                    onChange={(e) => setEditLiveLink(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Image
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
