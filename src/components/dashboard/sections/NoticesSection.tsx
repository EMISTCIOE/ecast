import { useState } from "react";
import {
  BellIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import EditNoticeModal from "../modals/EditNoticeModal";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
const isImagePath = (p?: string) =>
  /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(p || "");

interface NoticesSectionProps {
  myNotices: any[];
  isSubmitting: boolean;
  canEditOrDeleteNotice: (notice: any) => boolean;
  onCreateClick: () => void;
  onUpdate: (id: string, data: FormData) => Promise<void>;
  onDelete: (id: string) => Promise<boolean>;
  onRefresh: () => void;
}

export default function NoticesSection({
  myNotices,
  isSubmitting,
  canEditOrDeleteNotice,
  onCreateClick,
  onUpdate,
  onDelete,
  onRefresh,
}: NoticesSectionProps) {
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = (notice: any) => {
    setEditingNotice(notice);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (formData: FormData) => {
    if (editingNotice) {
      await onUpdate(editingNotice.id, formData);
      setShowEditModal(false);
      setEditingNotice(null);
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      await onDelete(id);
      onRefresh();
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header with Create Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BellIcon className="w-7 h-7 text-white" />
            </div>
            My Notices
          </h1>
          <p className="text-gray-400 text-lg">
            View and manage your submitted notices
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
        >
          <PlusIcon className="w-5 h-5" />
          Create Notice
        </button>
      </div>

      {/* My Notices List */}
      <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
        {myNotices.length === 0 ? (
          <div className="text-center py-16">
            <BellIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-400 text-xl font-semibold mb-2">
              No notices created yet
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Create your first notice to share announcements with the community
            </p>
            <button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              Create Your First Notice
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myNotices.map((n: any) => (
              <div
                key={n.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-white mb-2">
                      {n.title}
                    </h4>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {n.content}
                    </p>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          n.status === "APPROVED"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : n.status === "REJECTED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        {n.status}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 rounded-md text-purple-300 text-xs font-semibold">
                        {n.audience}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {n.attachment && (
                      <div className="mt-2">
                        {isImagePath(n.attachment) ? (
                          <img
                            src={
                              n.attachment.startsWith("http")
                                ? n.attachment
                                : `${base}${n.attachment}`
                            }
                            alt="Notice attachment"
                            className="max-h-32 rounded-lg border border-purple-500/30"
                          />
                        ) : (
                          <a
                            href={
                              n.attachment.startsWith("http")
                                ? n.attachment
                                : `${base}${n.attachment}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 text-sm underline"
                          >
                            View Attachment
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  {canEditOrDeleteNotice(n) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(n)}
                        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-medium transition-all border border-blue-500/30 hover:scale-105"
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-all border border-red-500/30 hover:scale-105"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditNoticeModal
        notice={editingNotice}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingNotice(null);
        }}
        onSave={handleSaveEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
