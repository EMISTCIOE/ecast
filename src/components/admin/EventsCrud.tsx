import { useEffect, useState } from "react";
import { useEvents } from "@/lib/hooks/events";
import { useToast } from "@/hooks/useToast";
import {
  CalendarIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { EventPreview } from "@/components/ContentPreviews";

export default function EventsCrud({
  useEventsHook,
  role,
  toast,
}: {
  useEventsHook: typeof useEvents;
  role: string | null;
  toast: ReturnType<typeof useToast>;
}) {
  const { list, create, approve, reject, update, remove } = useEventsHook();
  const [items, setItems] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [previewEvent, setPreviewEvent] = useState<any | null>(null);

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [formLink, setFormLink] = useState("");
  const [featured, setFeatured] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  // Edit form state
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editContactEmail, setEditContactEmail] = useState("");
  const [editFormLink, setEditFormLink] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editComingSoon, setEditComingSoon] = useState(false);

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

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("date", date);
    if (endDate.trim()) form.append("end_date", endDate.trim());
    if (time.trim()) form.append("time", time.trim());
    form.append("location", location);
    if (image) form.append("image", image);
    if (contactEmail) form.append("contact_email", contactEmail);
    if (formLink.trim()) form.append("form_link", formLink.trim());
    form.append("featured", String(featured));
    form.append("coming_soon", String(comingSoon));
    try {
      await create(form);
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setDate("");
      setEndDate("");
      setTime("");
      setLocation("");
      setImage(null);
      setContactEmail("");
      setFormLink("");
      setFeatured(false);
      setComingSoon(false);
      toast.success("Event created successfully!");
      refresh();
    } catch (_error) {
      toast.error("Failed to create event");
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (event: any) => {
    setEditSlug(event.slug);
    setEditTitle(event.title || "");
    setEditDate(event.date || "");
    setEditEndDate(event.end_date || "");
    setEditTime(event.time || "");
    setEditLocation(event.location || "");
    setEditDesc(event.description || "");
    setEditContactEmail(event.contact_email || "");
    setEditFormLink(event.form_link || "");
    setEditFeatured(event.featured || false);
    setEditComingSoon(event.coming_soon || false);
    setEditImage(null);
    setShowEditModal(true);
  };

  const doEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSlug) return;
    setIsUpdating(true);
    const form = new FormData();
    form.append("title", editTitle);
    form.append("date", editDate);
    // Always send end_date and time (even if empty) to allow clearing them
    form.append("end_date", editEndDate.trim());
    form.append("time", editTime.trim());
    form.append("location", editLocation);
    form.append("description", editDesc);
    if (editContactEmail) form.append("contact_email", editContactEmail);
    if (editFormLink.trim()) form.append("form_link", editFormLink.trim());
    form.append("featured", String(editFeatured));
    form.append("coming_soon", String(editComingSoon));
    if (editImage) form.append("image", editImage);
    try {
      await update(editSlug, form);
      setShowEditModal(false);
      setEditSlug(null);
      toast.success("Event updated successfully!");
      refresh();
    } catch (_error) {
      toast.error("Failed to update event");
    } finally {
      setIsUpdating(false);
    }
  };

  const onApprove = async (slug: string) => {
    setApprovingSlug(slug);
    try {
      await approve(slug);
      toast.success("Event approved!");
      refresh();
    } catch (_error) {
      toast.error("Failed to approve event");
    } finally {
      setApprovingSlug(null);
    }
  };

  const onReject = async (slug: string) => {
    setRejectingSlug(slug);
    try {
      await reject(slug);
      toast.success("Event rejected");
      refresh();
    } catch (_error) {
      toast.error("Failed to reject event");
    } finally {
      setRejectingSlug(null);
    }
  };

  const confirmDelete = (event: any) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const onDelete = async () => {
    if (!selectedEvent) return;
    setIsDeleting(true);
    try {
      await remove(selectedEvent.slug);
      setShowDeleteModal(false);
      setSelectedEvent(null);
      toast.success("Event deleted successfully!");
      refresh();
    } catch (_error) {
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          New Event
        </button>
      </div>

      <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#252b47]">
                <th className="text-left p-4 font-semibold text-gray-300">
                  Title
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Date & Time
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Location
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-300">
                  Tags
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
                    No events found. Create your first event!
                  </td>
                </tr>
              ) : (
                items.map((event: any) => {
                  const canEditOrDelete =
                    isAdmin || event.status !== "APPROVED";
                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-[#252b47] transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-white">
                          {event.title}
                        </div>
                        {event.description && (
                          <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {event.description}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-white">{event.date}</div>
                        {event.end_date && (
                          <div className="text-sm text-gray-400">
                            to {event.end_date}
                          </div>
                        )}
                        {event.time && (
                          <div className="text-sm text-gray-400">
                            {event.time}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-gray-300">{event.location}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === "APPROVED"
                              ? "bg-green-900/50 text-green-300"
                              : event.status === "PENDING"
                              ? "bg-yellow-900/50 text-yellow-300"
                              : "bg-red-900/50 text-red-300"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {event.featured && (
                            <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-xs font-semibold">
                              Featured
                            </span>
                          )}
                          {event.coming_soon && (
                            <span className="px-2 py-1 bg-orange-900/50 text-orange-300 rounded text-xs font-semibold">
                              Coming Soon
                            </span>
                          )}
                          {!event.featured && !event.coming_soon && (
                            <span className="text-gray-500 text-xs">—</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 items-center flex-wrap">
                          <button
                            onClick={() => setPreviewEvent(event)}
                            className="p-2 hover:bg-gray-700/40 rounded-lg transition-colors"
                            title="Preview"
                          >
                            <EyeIcon className="w-5 h-5 text-gray-300" />
                          </button>
                          {event.status === "PENDING" && isAdmin && (
                            <>
                              <button
                                onClick={() => onApprove(event.slug)}
                                className="p-2 hover:bg-green-600/20 rounded-lg transition-colors group"
                                title="Approve"
                              >
                                <CheckCircleIcon className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                              </button>
                              <button
                                onClick={() => onReject(event.slug)}
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
                                onClick={() => startEdit(event)}
                                className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors group"
                                title="Edit"
                              >
                                <PencilSquareIcon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                              </button>
                              <button
                                onClick={() => confirmDelete(event)}
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
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-blue-400" /> Create New
                Event
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
                    Event Title *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time (Optional)
                  </label>
                  <input
                    type="time"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Event location"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Event description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration/Form Link (Optional)
                  </label>
                  <input
                    type="url"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Google Forms, registration link, etc."
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <span>Featured Event</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={comingSoon}
                      onChange={(e) => setComingSoon(e.target.checked)}
                    />
                    <span>Coming Soon</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  {isCreating ? "Creating..." : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                  className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal and Delete Modal are omitted here for brevity; keep as in existing admin.tsx if needed */}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PencilSquareIcon className="w-6 h-6 text-blue-400" /> Edit
                Event
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={doEdit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Title *
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
                    Start Date *
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time (Optional)
                  </label>
                  <input
                    type="time"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    rows={4}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={editContactEmail}
                    onChange={(e) => setEditContactEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration/Form Link (Optional)
                  </label>
                  <input
                    type="url"
                    className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Google Forms, registration link, etc."
                    value={editFormLink}
                    onChange={(e) => setEditFormLink(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={editFeatured}
                      onChange={(e) => setEditFeatured(e.target.checked)}
                    />
                    <span>Featured Event</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={editComingSoon}
                      onChange={(e) => setEditComingSoon(e.target.checked)}
                    />
                    <span>Coming Soon</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f3a] rounded-2xl border border-gray-700 w-full max-w-md">
            <div className="bg-[#252b47] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrashIcon className="w-6 h-6 text-red-400" /> Delete Event
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete the event "
                <span className="font-semibold text-white">
                  {selectedEvent.title}
                </span>
                "?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewEvent(null)}
        >
          <div
            className="max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <EventPreview event={previewEvent} />
          </div>
        </div>
      )}
    </div>
  );
}
