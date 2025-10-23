import { useState, useEffect } from "react";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  LinkIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

interface EditProjectModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function EditProjectModal({
  project,
  isOpen,
  onClose,
  onSave,
  isSubmitting = false,
}: EditProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setRepoLink(project.repo_link || "");
      setLiveLink(project.live_link || "");
      setImage(null);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("repo_link", repoLink);
    if (liveLink) formData.append("live_link", liveLink);
    if (image) {
      formData.append("image", image);
    }
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-blue-500/30 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 p-6 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-white">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Project Title
            </label>
            <input
              type="text"
              required
              className="w-full bg-gray-900/90 p-3 rounded-xl border border-blue-500/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-lg text-white transition-all"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Description
            </label>
            <textarea
              required
              className="w-full bg-gray-900/90 p-3 rounded-xl border border-blue-500/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white transition-all"
              placeholder="Describe your project"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Repository Link */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-blue-400" />
              Repository Link
            </label>
            <input
              type="url"
              required
              className="w-full bg-gray-900/90 p-3 rounded-xl border border-blue-500/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
              placeholder="https://github.com/username/repo"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
            />
          </div>

          {/* Live Link */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <GlobeAltIcon className="w-4 h-4 text-cyan-400" />
              Live Demo Link (Optional)
            </label>
            <input
              type="url"
              className="w-full bg-gray-900/90 p-3 rounded-xl border border-blue-500/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
              placeholder="https://your-project.com"
              value={liveLink}
              onChange={(e) => setLiveLink(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <ArrowUpTrayIcon className="w-4 h-4 text-blue-400" />
              Update Project Image{" "}
              {image && (
                <span className="text-green-400 text-xs">({image.name})</span>
              )}
              {project?.image && !image && (
                <span className="text-gray-500 text-xs">
                  (Current image set)
                </span>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-3 bg-gray-900/90 border-2 border-dashed border-blue-500/30 rounded-xl hover:border-blue-500/50 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600/20 file:text-blue-300 hover:file:bg-blue-600/30 file:transition-all cursor-pointer text-sm text-white"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            {image && image.type?.startsWith("image/") && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="New image preview"
                  className="max-h-48 w-full object-cover rounded-lg border border-blue-500/30"
                />
              </div>
            )}
            {!image && project?.image && (
              <div className="mt-3">
                <img
                  src={project.image}
                  alt="Current image preview"
                  className="max-h-48 w-full object-cover rounded-lg border border-blue-500/30"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 p-3 rounded-xl font-bold text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
