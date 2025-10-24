import { useEffect, useState } from "react";
import { useResearch } from "@/lib/hooks/research";
import { useToast } from "@/hooks/useToast";
import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface Research {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  authors: string;
  journal_name?: string;
  publication_date?: string;
  doi?: string;
  url?: string;
  keywords?: string;
  document?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_by?: {
    id: number;
    username: string;
    full_name: string;
  };
  created_at: string;
}

export default function ResearchCrud({
  useResearchHook,
  toast,
}: {
  useResearchHook: typeof useResearch;
  toast: ReturnType<typeof useToast>;
}) {
  const { list, create, approve, reject, update, remove } = useResearchHook();
  const [items, setItems] = useState<Research[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Research | null>(null);
  const [itemToReject, setItemToReject] = useState<Research | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState("");
  const [journalName, setJournalName] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [document, setDocument] = useState<File | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [approvingSlug, setApprovingSlug] = useState<string | null>(null);
  const [rejectingSlug, setRejectingSlug] = useState<string | null>(null);

  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAbstract, setEditAbstract] = useState("");
  const [editAuthors, setEditAuthors] = useState("");
  const [editJournalName, setEditJournalName] = useState("");
  const [editPublicationDate, setEditPublicationDate] = useState("");
  const [editDoi, setEditDoi] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editKeywords, setEditKeywords] = useState("");
  const [editDocument, setEditDocument] = useState<File | null>(null);

  const refresh = async () => {
    try {
      const params = filterStatus !== "ALL" ? { status: filterStatus } : {};
      const data = await list(params);
      setItems(data.results || data || []);
    } catch {
      toast.error("Failed to load research");
    }
  };

  useEffect(() => {
    refresh();
  }, [filterStatus]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const form = new FormData();
    form.append("title", title);
    form.append("abstract", abstract);
    form.append("authors", authors);
    if (journalName) form.append("journal_name", journalName);
    if (publicationDate) form.append("publication_date", publicationDate);
    if (doi) form.append("doi", doi);
    if (url) form.append("url", url);
    if (keywords) form.append("keywords", keywords);
    if (document) form.append("document", document);

    try {
      await create(form);
      setShowCreateModal(false);
      setTitle("");
      setAbstract("");
      setAuthors("");
      setJournalName("");
      setPublicationDate("");
      setDoi("");
      setUrl("");
      setKeywords("");
      setDocument(null);
      toast.success("Research created successfully!");
      refresh();
    } catch {
      toast.error("Failed to create research");
    } finally {
      setIsCreating(false);
    }
  };

  const onApprove = async (slug: string) => {
    setApprovingSlug(slug);
    try {
      await approve(slug);
      toast.success("Research approved!");
      refresh();
    } catch {
      toast.error("Failed to approve research");
    } finally {
      setApprovingSlug(null);
    }
  };

  const onReject = async () => {
    if (!itemToReject) return;
    setRejectingSlug(itemToReject.slug);
    try {
      await reject(itemToReject.slug, rejectReason);
      setShowRejectModal(false);
      setItemToReject(null);
      setRejectReason("");
      toast.success("Research rejected!");
      refresh();
    } catch {
      toast.error("Failed to reject research");
    } finally {
      setRejectingSlug(null);
    }
  };

  const handleDelete = (item: Research) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await remove(itemToDelete.slug);
      setShowDeleteModal(false);
      setItemToDelete(null);
      toast.success("Research deleted successfully!");
      refresh();
    } catch {
      toast.error("Failed to delete research");
    } finally {
      setIsDeleting(false);
    }
  };

  const startEdit = (item: Research) => {
    setEditSlug(item.slug);
    setEditTitle(item.title);
    setEditAbstract(item.abstract);
    setEditAuthors(item.authors);
    setEditJournalName(item.journal_name || "");
    setEditPublicationDate(item.publication_date || "");
    setEditDoi(item.doi || "");
    setEditUrl(item.url || "");
    setEditKeywords(item.keywords || "");
    setEditDocument(null);
    setShowEditModal(true);
  };

  const doEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSlug) return;
    setIsUpdating(true);
    const form = new FormData();
    form.append("title", editTitle);
    form.append("abstract", editAbstract);
    form.append("authors", editAuthors);
    if (editJournalName) form.append("journal_name", editJournalName);
    if (editPublicationDate)
      form.append("publication_date", editPublicationDate);
    if (editDoi) form.append("doi", editDoi);
    if (editUrl) form.append("url", editUrl);
    if (editKeywords) form.append("keywords", editKeywords);
    if (editDocument) form.append("document", editDocument);

    try {
      await update(editSlug, form);
      setEditSlug(null);
      setShowEditModal(false);
      toast.success("Research updated successfully!");
      refresh();
    } catch {
      toast.error("Failed to update research");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredItems =
    filterStatus === "ALL"
      ? items
      : items.filter((i) => i.status === filterStatus);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <ArrowUpTrayIcon className="w-6 h-6 text-white" />
            </div>
            Research Papers
          </h1>
          <p className="text-gray-400">
            Manage and review all submitted research papers
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
        >
          <ArrowUpTrayIcon className="w-5 h-5" />
          New Research
        </button>
      </div>

      {/* Filter Status */}
      <div className="flex gap-3 flex-wrap">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              filterStatus === status
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === "ALL"
                  ? "bg-gray-500"
                  : status === "PENDING"
                  ? "bg-yellow-400"
                  : status === "APPROVED"
                  ? "bg-green-400"
                  : "bg-red-400"
              }`}
            ></span>
            {status === "ALL" ? "All" : status}
          </button>
        ))}
      </div>

      {/* Research Table */}
      <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-gray-900/60 rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl hover:border-gray-700 transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 border-b border-gray-700/50">
                <th className="text-left p-5 text-gray-300 font-bold text-sm uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left p-5 text-gray-300 font-bold text-sm uppercase tracking-wider">
                  Authors
                </th>
                <th className="text-left p-5 text-gray-300 font-bold text-sm uppercase tracking-wider">
                  Journal
                </th>
                <th className="text-left p-5 text-gray-300 font-bold text-sm uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left p-5 text-gray-300 font-bold text-sm uppercase tracking-wider">
                  Created By
                </th>
                <th className="text-left p-5 text-gray-300 font-bold text-sm uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left p-5 text-gray-300 font-bold text-sm uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <DocumentTextIcon className="w-16 h-16 text-gray-600 mb-4 opacity-50" />
                      <p className="text-gray-400 text-lg font-semibold">
                        No research papers found
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Research papers will appear here when submitted
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item: Research) => {
                  const createdDate = new Date(
                    item.created_at
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <tr
                      key={item.slug}
                      className="hover:bg-gray-800/40 transition-all duration-300 group"
                    >
                      <td className="p-5 text-white font-semibold max-w-xs">
                        <div
                          className="truncate text-sm group-hover:text-purple-300 transition-colors"
                          title={item.title}
                        >
                          {item.title}
                        </div>
                      </td>
                      <td className="p-5 text-gray-300 max-w-xs">
                        <div className="truncate text-sm" title={item.authors}>
                          {item.authors}
                        </div>
                      </td>
                      <td className="p-5 text-gray-300 max-w-xs">
                        <div className="truncate text-sm">
                          {item.journal_name || "—"}
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 ${
                            item.status === "APPROVED"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : item.status === "PENDING"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.status === "APPROVED"
                                ? "bg-green-400"
                                : item.status === "PENDING"
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                          ></span>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-5 text-gray-300 text-sm">
                        {item.created_by?.full_name ||
                          item.created_by?.username ||
                          "—"}
                      </td>
                      <td className="p-5 text-gray-300 text-sm">
                        {createdDate}
                      </td>
                      <td className="p-5">
                        <div className="flex gap-2 flex-wrap items-center">
                          {item.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => onApprove(item.slug)}
                                disabled={approvingSlug === item.slug}
                                className="px-3 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg transition-all duration-300 flex items-center gap-1 text-sm font-semibold border border-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-500/50"
                              >
                                <CheckIcon className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setItemToReject(item);
                                  setShowRejectModal(true);
                                }}
                                disabled={rejectingSlug === item.slug}
                                className="px-3 py-2 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 rounded-lg transition-all duration-300 flex items-center gap-1 text-sm font-semibold border border-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:border-yellow-500/50"
                              >
                                <XMarkIcon className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => startEdit(item)}
                            className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-all duration-300 flex items-center gap-1 text-sm font-semibold border border-blue-500/30 hover:border-blue-500/50"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="px-3 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-all duration-300 flex items-center gap-1 text-sm font-semibold border border-red-500/30 hover:border-red-500/50"
                          >
                            <TrashIcon className="w-4 h-4" />
                            Delete
                          </button>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-b border-gray-700/50 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Create Research Paper
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Add a new research paper to the database
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={onCreate} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-purple-400" />
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/30"
                  placeholder="Research paper title"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4 text-purple-400" />
                  Abstract *
                </label>
                <textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/30 resize-none"
                  placeholder="Paper abstract"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Authors *
                </label>
                <input
                  type="text"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/30"
                  placeholder="Author names (comma separated)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Journal Name
                  </label>
                  <input
                    type="text"
                    value={journalName}
                    onChange={(e) => setJournalName(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/30"
                    placeholder="Journal name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    DOI
                  </label>
                  <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/30"
                    placeholder="10.xxxx/xxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/30"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-500/30"
                  placeholder="Comma separated keywords"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                  <ArrowUpTrayIcon className="w-4 h-4 text-purple-400" />
                  Document (PDF, DOC, DOCX)
                </label>
                <input
                  type="file"
                  onChange={(e) => setDocument(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx"
                  className="w-full bg-gray-800/50 border-2 border-dashed border-gray-700/50 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:font-semibold hover:file:bg-purple-700 file:transition-colors cursor-pointer focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {document && (
                  <p className="text-sm text-green-400 mt-2">
                    ✓ {document.name} selected
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-700/50 hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition-colors text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="w-5 h-5" />
                      Create Research
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-700/50 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Edit Research Paper
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Update research paper details
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={doEdit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500/30"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Abstract *
                </label>
                <textarea
                  value={editAbstract}
                  onChange={(e) => setEditAbstract(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500/30 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Authors *
                </label>
                <input
                  type="text"
                  value={editAuthors}
                  onChange={(e) => setEditAuthors(e.target.value)}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500/30"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Journal Name
                  </label>
                  <input
                    type="text"
                    value={editJournalName}
                    onChange={(e) => setEditJournalName(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={editPublicationDate}
                    onChange={(e) => setEditPublicationDate(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    DOI
                  </label>
                  <input
                    type="text"
                    value={editDoi}
                    onChange={(e) => setEditDoi(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={editKeywords}
                  onChange={(e) => setEditKeywords(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500/30"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Document (PDF, DOC, DOCX)
                </label>
                <input
                  type="file"
                  onChange={(e) => setEditDocument(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx"
                  className="w-full bg-gray-800/50 border-2 border-dashed border-gray-700/50 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700 file:transition-colors cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {editDocument && (
                  <p className="text-sm text-green-400 mt-2">
                    ✓ {editDocument.name} selected
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-700/50 hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition-colors text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <PencilSquareIcon className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 p-6 max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <TrashIcon className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Delete Research Paper?
              </h2>
            </div>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "
              <span className="text-white font-semibold">
                {itemToDelete?.title}
              </span>
              "? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-700/50 hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition-colors text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 p-6 max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <XMarkIcon className="w-6 h-6 text-yellow-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Reject Research Paper
              </h2>
            </div>
            <p className="text-gray-400 mb-4">
              Are you sure you want to reject "
              <span className="text-white font-semibold">
                {itemToReject?.title}
              </span>
              "?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Rejection Reason (Optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                placeholder="Explain why this paper is being rejected..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setItemToReject(null);
                  setRejectReason("");
                }}
                className="flex-1 bg-gray-700/50 hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition-colors text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={onReject}
                disabled={rejectingSlug === itemToReject?.slug}
                className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                {rejectingSlug === itemToReject?.slug ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XMarkIcon className="w-5 h-5" />
                    Reject
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
