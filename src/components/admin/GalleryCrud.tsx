import { useEffect, useState } from "react";
import { useGallery } from "@/lib/hooks/gallery";
import { useToast } from "@/hooks/useToast";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function GalleryCrud({
  toast,
}: {
  toast: ReturnType<typeof useToast>;
}) {
  const { list, create, update, remove, approve, reject } = useGallery();
  const [items, setItems] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(" ");

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // Edit form state
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setItems(await list());
    } catch {}
  };

  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const form = new FormData();
    if (title) form.append("title", title);
    if (description) form.append("description", description);
    if (image) form.append("image", image);
    try {
      await create(form);
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setImage(null);
      setImagePreviewUrl("");
      toast.success("Image uploaded successfully!");
      refresh();
    } catch (_error) {
      toast.error("Failed to upload image");
    } finally {
      setIsCreating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl("");
    }
  };

  const startEdit = (g: any) => {
    setEditId(g.id);
    setEditTitle(g.title || "");
    setEditDesc(g.description || "");
    setSelectedItem(g);
    setShowEditModal(true);
  };

  const doEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setIsUpdating(true);
    const form = new FormData();
    form.append("title", editTitle);
    form.append("description", editDesc);
    try {
      await update(editId, form);
      setShowEditModal(false);
      setEditId(null);
      setSelectedItem(null);
      toast.success("Gallery item updated!");
      refresh();
    } catch (_error) {
      toast.error("Failed to update item");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = (item: any) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const onDelete = async () => {
    if (!selectedItem) return;
    setIsDeleting(true);
    try {
      await remove(selectedItem.id);
      setShowDeleteModal(false);
      setSelectedItem(null);
      toast.success("Image deleted successfully!");
      refresh();
    } catch (_error) {
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
        >
          Upload Image
        </button>
      </div>

      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
        {items.length === 0 ? (
          <p className="text-gray-400">No images found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((g: any) => (
              <div
                key={g.id}
                className="bg-[#252b47] rounded-xl border border-gray-700 overflow-hidden"
              >
                <img
                  src={
                    g.image?.startsWith("http")
                      ? g.image
                      : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${
                          g.image || ""
                        }`
                  }
                  className="w-full h-40 object-cover"
                  onClick={() => {
                    setPreviewImage(
                      g.image?.startsWith("http")
                        ? g.image
                        : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${
                            g.image || ""
                          }`
                    );
                    setShowImagePreview(true);
                  }}
                />
                <div className="p-3 space-y-2">
                  <div className="font-medium text-white">
                    {g.title || "Untitled"}
                  </div>
                  {g.description && (
                    <div className="text-gray-400 text-sm">{g.description}</div>
                  )}
                  <div className="flex gap-2 flex-wrap items-center">
                    {g.status === "PENDING" && (
                      <>
                        <button
                          onClick={async () => {
                            setApprovingId(g.id);
                            await approve(g.id);
                            setApprovingId(null);
                            refresh();
                          }}
                          className="p-2 hover:bg-green-600/20 rounded-lg"
                          title="Approve"
                        >
                          <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        </button>
                        <button
                          onClick={async () => {
                            setRejectingId(g.id);
                            await reject(g.id);
                            setRejectingId(null);
                            refresh();
                          }}
                          className="p-2 hover:bg-yellow-600/20 rounded-lg"
                          title="Reject"
                        >
                          <XMarkIcon className="w-5 h-5 text-yellow-400" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => startEdit(g)}
                      className="p-2 hover:bg-blue-600/20 rounded-lg"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-5 h-5 text-blue-400" />
                    </button>
                    <button
                      onClick={() => confirmDelete(g)}
                      className="p-2 hover:bg-red-600/20 rounded-lg"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white">Upload Image</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={onCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2"
                />
                {imagePreviewUrl && (
                  <img
                    src={imagePreviewUrl}
                    className="mt-3 w-full h-40 object-cover rounded-lg border border-gray-700"
                  />
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold"
                >
                  {isCreating ? "Uploading..." : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                  className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white">Edit Item</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={doEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                  className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Delete Image</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete this image?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {showImagePreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowImagePreview(false)}
        >
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={previewImage} className="w-full h-auto rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
