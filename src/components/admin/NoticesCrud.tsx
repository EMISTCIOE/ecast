import { useEffect, useState } from "react";
import { useNotices } from "@/lib/hooks/notices";
import { useToast } from "@/hooks/useToast";
import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { NoticePreview } from "@/components/ContentPreviews";

export default function NoticesCrud({
  useNoticesHook,
  role,
  toast,
}: {
  useNoticesHook: typeof useNotices;
  role: string | null;
  toast: ReturnType<typeof useToast>;
}) {
  const { list, create, approve, update, remove, reject } = useNoticesHook();
  const [items, setItems] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<any>(null);
  const [previewNotice, setPreviewNotice] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("ALL");
  const [file, setFile] = useState<File | null>(null);
  const isAdmin = role === "ADMIN";

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

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
    } catch (_error) {
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
    } catch (_error) {
      toast.error("Failed to approve notice");
    } finally {
      setApprovingId(null);
    }
  };

  const onReject = async (id: string) => {
    setRejectingId(id);
    try {
      await reject(id);
      toast.success("Notice rejected");
      refresh();
    } catch (_error) {
      toast.error("Failed to reject notice");
    } finally {
      setRejectingId(null);
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
    } catch (_error) {
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
    } catch (_error) {
      toast.error("Failed to update notice");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notices</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
        >
          New Notice
        </button>
      </div>

      <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#252b47]">
              <tr>
                <th className="text-left p-4 text-gray-300 font-semibold">Title</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Content Preview</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Audience</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Status</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Created</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Attachment</th>
                <th className="text-left p-4 text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {items.map((n: any) => {
                const canEditOrDelete = isAdmin || n.status !== "APPROVED";
                const createdDate = new Date(n.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <tr key={n.id} className="hover:bg-[#252b47] transition-colors">
                    <td className="p-4 text-white font-medium max-w-xs">
                      <div className="truncate" title={n.title}>{n.title}</div>
                    </td>
                    <td className="p-4 text-gray-300 max-w-md">
                      <div className="truncate" title={n.content}>{n.content}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        n.audience === "ALL"
                          ? "bg-green-900 text-green-200"
                          : n.audience === "MEMBERS"
                          ? "bg-blue-900 text-blue-200"
                          : "bg-purple-900 text-purple-200"
                      }`}>{n.audience}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        n.status === "APPROVED"
                          ? "bg-green-900 text-green-200"
                          : n.status === "PENDING"
                          ? "bg-yellow-900 text-yellow-200"
                          : "bg-red-900 text-red-200"
                      }`}>{n.status}</span>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">{createdDate}</td>
                    <td className="p-4 text-gray-300">
                      {n.attachment ? (
                        <a href={n.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">📎 View</a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 flex gap-3 flex-wrap items-center">
                      <button
                        onClick={() => setPreviewNotice(n)}
                        className="text-gray-300 hover:text-white flex items-center gap-1"
                      >
                        <EyeIcon className="w-5 h-5" /> Preview
                      </button>
                      {n.status === "PENDING" && isAdmin && (
                        <>
                          <button onClick={() => onApprove(n.id)} className="text-green-400 hover:text-green-300 flex items-center gap-1">
                            <CheckIcon className="w-4 h-4" /> Approve
                          </button>
                          <button onClick={() => onReject(n.id)} className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
                            <XMarkIcon className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                      {canEditOrDelete && (
                        <>
                          <button onClick={() => startEdit(n)} className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            <PencilSquareIcon className="w-5 h-5" /> Edit
                          </button>
                          <button onClick={() => handleDelete(n)} className="text-red-400 hover:text-red-300 flex items-center gap-1">
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
              <h2 className="text-2xl font-bold text-white">Create New Notice</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={onCreate} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" placeholder="Notice Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Audience</label>
                  <select className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" value={audience} onChange={(e) => setAudience(e.target.value)}>
                    <option value="ALL">All</option>
                    <option value="MEMBERS">Members</option>
                    <option value="AMBASSADORS">Ambassadors</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Attachment (Optional)</label>
                  <input type="file" className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                  <textarea className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" rows={6} placeholder="Notice content..." value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isCreating} className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg">
                  {isCreating ? "Publishing..." : "Create Notice"}
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} disabled={isCreating} className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold">
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
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={doEdit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Audience</label>
                  <select className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" value={editAudience} onChange={(e) => setEditAudience(e.target.value)}>
                    <option value="ALL">All</option>
                    <option value="MEMBERS">Members</option>
                    <option value="AMBASSADORS">Ambassadors</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Update Attachment</label>
                  <input type="file" className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" onChange={(e) => setEditFile(e.target.files?.[0] || null)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                  <textarea className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" rows={6} value={editContent} onChange={(e) => setEditContent(e.target.value)} required />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isUpdating} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2">
                  <CheckIcon className="w-5 h-5" />
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setShowEditModal(false)} disabled={isUpdating} className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold">
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
                <TrashIcon className="w-6 h-6" /> Delete Notice
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-4">
                <p className="text-red-200 font-semibold mb-2">⚠️ Warning: This action cannot be undone!</p>
                <p className="text-gray-300 text-sm">
                  Deleting notice <span className="font-bold text-white">"{noticeToDelete.title}"</span> will permanently remove it from the system.
                </p>
              </div>
              <p className="text-gray-300">Are you sure you want to delete this notice?</p>
              <div className="flex gap-3 pt-2">
                <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2">
                  <TrashIcon className="w-5 h-5" /> {isDeleting ? "Deleting..." : "Yes, Delete Notice"}
                </button>
                <button onClick={() => { setShowDeleteModal(false); setNoticeToDelete(null); }} disabled={isDeleting} className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewNotice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewNotice(null)}>
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <NoticePreview notice={previewNotice} />
          </div>
        </div>
      )}
    </div>
  );
}

