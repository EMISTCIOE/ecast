import { useState } from "react";
import {
  CalendarIcon,
  PlusIcon,
  MapPinIcon,
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import EditEventModal from "../modals/EditEventModal";

interface EventsSectionProps {
  myEvents: any[];
  onCreateClick: () => void;
  onUpdate: (slug: string, formData: FormData) => Promise<void>;
  onDelete: (slug: string) => Promise<void>;
  onRefresh: () => void;
}

export default function EventsSection({
  myEvents,
  onCreateClick,
  onUpdate,
  onDelete,
  onRefresh,
}: EventsSectionProps) {
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditClick = (event: any) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (formData: FormData) => {
    if (editingEvent) {
      setIsSubmitting(true);
      try {
        await onUpdate(editingEvent.slug, formData);
        setShowEditModal(false);
        setEditingEvent(null);
        onRefresh();
      } catch (error) {
        console.error("Failed to update event:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await onDelete(slug);
      onRefresh();
    }
  };

  const canEdit = (event: any) => {
    // Can only edit if status is PENDING
    return event.status === "PENDING";
  };

  const isEventPast = (event: any) => {
    if (!event.date) return false;
    try {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < today;
    } catch {
      return false;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header with Create Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CalendarIcon className="w-7 h-7 text-white" />
            </div>
            My Events
          </h1>
          <p className="text-gray-400 text-sm">
            View and manage your submitted events
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
        >
          <PlusIcon className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* My Events List */}
      <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
        {myEvents.length === 0 ? (
          <div className="text-center py-16">
            <CalendarIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-400 text-lg font-semibold mb-2">
              No events created yet
            </p>
            <p className="text-gray-500 text-xs mb-6">
              Create your first event to engage with the community
            </p>
            <button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-400">
              {myEvents.length} event{myEvents.length !== 1 ? "s" : ""}{" "}
              submitted
            </p>
            {myEvents.map((e: any) => (
              <div
                key={e.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-2xl border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {e.image && (
                    <div className="w-32 h-24 flex-shrink-0">
                      <img
                        src={e.image}
                        alt={e.title}
                        className="w-full h-full object-cover rounded-lg border border-emerald-500/30"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-bold text-sm text-white flex-1">
                        {e.title}
                      </h4>
                      {canEdit(e) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(e)}
                            className="p-2 hover:bg-emerald-600/20 rounded-lg transition-colors group/btn"
                            title="Edit Event"
                          >
                            <PencilSquareIcon className="w-5 h-5 text-emerald-400 group-hover/btn:text-emerald-300" />
                          </button>
                          <button
                            onClick={() => handleDelete(e.slug)}
                            className="p-2 hover:bg-red-600/20 rounded-lg transition-colors group/btn"
                            title="Delete Event"
                          >
                            <TrashIcon className="w-5 h-5 text-red-400 group-hover/btn:text-red-300" />
                          </button>
                        </div>
                      )}
                    </div>
                    {e.description && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {e.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          e.status === "APPROVED"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : e.status === "REJECTED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        {e.status}
                      </span>
                      {e.created_at && (
                        <span className="text-sm text-gray-400">
                          {new Date(e.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {(e.date || e.time || e.location) && (
                      <div className="flex flex-wrap gap-3 mt-2 text-sm">
                        {e.date && (
                          <div className="flex items-center gap-1 text-emerald-400">
                            <CalendarIcon className="w-4 h-4" />
                            {(() => {
                              try {
                                const dateObj = new Date(e.date);
                                return !isNaN(dateObj.getTime())
                                  ? dateObj.toLocaleDateString()
                                  : "Invalid Date";
                              } catch {
                                return "Invalid Date";
                              }
                            })()}
                          </div>
                        )}
                        {e.time && (
                          <div className="flex items-center gap-1 text-emerald-400">
                            <ClockIcon className="w-4 h-4" />
                            {e.time}
                          </div>
                        )}
                        {e.location && (
                          <div className="flex items-center gap-1 text-emerald-400">
                            <MapPinIcon className="w-4 h-4" />
                            {e.location}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Form Link Button - Show only if not past event and link exists */}
                    {e.form_link && !isEventPast(e) && (
                      <div className="mt-3">
                        <a
                          href={e.form_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-lg text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                            />
                          </svg>
                          Register / View Form
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      <EditEventModal
        event={editingEvent}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
