import { useEffect, useState } from "react";
import { useBlogs } from "@/lib/hooks/blogs";
import { useToast } from "@/hooks/useToast";
import {
  DocumentTextIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import BlogEditor from "@/components/admin/BlogEditor";
import { BlogPreview } from "@/components/ContentPreviews";

export default function BlogsCrud({
  useBlogsHook,
  role,
  toast,
}: {
  useBlogsHook: typeof useBlogs;
  role: string | null;
  toast: ReturnType<typeof useToast>;
}) {
  const { list, create, approve, reject, update, remove } = useBlogsHook();
  const [items, setItems] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [previewBlog, setPreviewBlog] = useState<any | null>(null);

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<File | null>(null);

  // Edit form state
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editContent, setEditContent] = useState("");
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null);

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

  const onCreate = async (vals: {
    title: string;
    description: string;
    content: string;
    coverFile?: File | null;
  }) => {
    setIsCreating(true);
    const form = new FormData();
    form.append("title", vals.title);
    form.append("description", vals.description);
    form.append("content", vals.content);
    if (vals.coverFile) form.append("cover_image", vals.coverFile);
    try {
      await create(form);
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setContent("");
      setCover(null);
      toast.success("Blog published successfully!");
      refresh();
    } catch (_error) {
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
    const coverUrl =
      b.cover_image && (b.cover_image as string).startsWith("http")
        ? b.cover_image
        : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${b.cover_image || ""}`;
    setCurrentCoverUrl(b.cover_image ? coverUrl : null);
    setShowEditModal(true);
  };

  const doEdit = async (vals: {
    title: string;
    description: string;
    content: string;
    coverFile?: File | null;
  }) => {
    if (!editSlug) return;
    setIsUpdating(true);
    const form = new FormData();
    form.append("title", vals.title);
    form.append("description", vals.description);
    form.append("content", vals.content);
    if (vals.coverFile) form.append("cover_image", vals.coverFile);
    try {
      await update(editSlug, form);
      setShowEditModal(false);
      setEditSlug(null);
      toast.success("Blog updated successfully!");
      refresh();
    } catch (_error) {
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
    } catch (_error) {
      toast.error("Failed to approve blog");
    } finally {
      setApprovingSlug(null);
    }
  };

  const onReject = async (slug: string) => {
    setRejectingSlug(slug);
    try {
      await reject(slug);
      toast.success("Blog rejected");
      refresh();
    } catch (_error) {
      toast.error("Failed to reject blog");
    } finally {
      setRejectingSlug(null);
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
      toast.success("Blog deleted");
      refresh();
    } catch (_error) {
      toast.error("Failed to delete blog");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg"
        >
          New Blog
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
                      : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${
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
                        <div className="flex gap-2 flex-wrap items-center">
                          <button
                            onClick={() => setPreviewBlog(b)}
                            className="p-2 hover:bg-gray-700/40 rounded-lg transition-colors group"
                            title="Preview"
                          >
                            <EyeIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />
                          </button>
                          {b.status === "PENDING" && isAdmin && (
                            <>
                              <button
                                onClick={() => onApprove(b.slug)}
                                className="p-2 hover:bg-green-600/20 rounded-lg transition-colors group"
                                title="Approve"
                              >
                                <CheckCircleIcon className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                              </button>
                              <button
                                onClick={() => onReject(b.slug)}
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
                <DocumentTextIcon className="w-6 h-6 text-pink-400" /> Create
                New Blog Post
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <BlogEditor
              initial={{ title, description, content }}
              submitLabel={isCreating ? "Publishing..." : "Create Blog"}
              loading={isCreating}
              onSubmit={onCreate}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PencilSquareIcon className="w-6 h-6 text-blue-400" /> Edit Blog
                Post
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <BlogEditor
              initial={{
                title: editTitle,
                description: editDesc,
                content: editContent,
                coverUrl: currentCoverUrl || undefined,
              }}
              submitLabel={isUpdating ? "Updating..." : "Save Changes"}
              loading={isUpdating}
              onSubmit={doEdit}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBlog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-md">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrashIcon className="w-6 h-6 text-red-400" /> Delete Blog
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

      {/* Preview */}
      {previewBlog && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewBlog(null)}
        >
          <div
            className="max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <BlogPreview blog={previewBlog} />
          </div>
        </div>
      )}
    </div>
  );
}
