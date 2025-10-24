import { useState } from "react";
import {
  DocumentTextIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import EditBlogModal from "../modals/EditBlogModal";

interface BlogsSectionProps {
  myBlogs: any[];
  isSubmitting: boolean;
  canEditOrDeleteBlog: (blog: any) => boolean;
  onCreateClick: () => void;
  onUpdate: (slug: string, data: FormData) => Promise<void>;
  onDelete: (slug: string) => Promise<boolean>;
  onRefresh: () => void;
}

export default function BlogsSection({
  myBlogs,
  isSubmitting,
  canEditOrDeleteBlog,
  onCreateClick,
  onUpdate,
  onDelete,
  onRefresh,
}: BlogsSectionProps) {
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = (blog: any) => {
    setEditingBlog(blog);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (formData: FormData) => {
    if (editingBlog) {
      await onUpdate(editingBlog.slug, formData);
      setShowEditModal(false);
      setEditingBlog(null);
      onRefresh();
    }
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      await onDelete(slug);
      onRefresh();
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header with Create Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
              <DocumentTextIcon className="w-7 h-7 text-white" />
            </div>
            My Blogs
          </h1>
          <p className="text-gray-400 text-base">
            View and manage your submitted blog posts
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale-105"
        >
          <PlusIcon className="w-5 h-5" />
          Create Blog
        </button>
      </div>

      {/* My Blogs List */}
      <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
        {myBlogs.length === 0 ? (
          <div className="text-center py-16">
            <DocumentTextIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-400 text-lg font-semibold mb-2">
              No blogs created yet
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Create your first blog post to share your ideas with the community
            </p>
            <button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              Create Your First Blog
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myBlogs.map((b: any) => (
              <div
                key={b.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-2xl border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {b.cover_image && (
                    <div className="w-32 h-24 flex-shrink-0">
                      <img
                        src={b.cover_image}
                        alt={b.title}
                        className="w-full h-full object-cover rounded-lg border border-pink-500/30"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base text-white mb-2">
                      {b.title}
                    </h4>
                    {b.description && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {b.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          b.status === "APPROVED"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : b.status === "REJECTED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        {b.status}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(b.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {canEditOrDeleteBlog(b) && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditClick(b)}
                        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-medium transition-all border border-blue-500/30 hover:scale-105"
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.slug)}
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
      <EditBlogModal
        blog={editingBlog}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingBlog(null);
        }}
        onSave={handleSaveEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
