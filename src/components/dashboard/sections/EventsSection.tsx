import {
  CalendarIcon,
  PlusIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface EventsSectionProps {
  myEvents: any[];
  onCreateClick: () => void;
}

export default function EventsSection({
  myEvents,
  onCreateClick,
}: EventsSectionProps) {
  return (
    <div className="animate-fade-in">
      {/* Header with Create Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CalendarIcon className="w-7 h-7 text-white" />
            </div>
            My Events
          </h1>
          <p className="text-gray-400 text-lg">
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
            <p className="text-gray-400 text-xl font-semibold mb-2">
              No events created yet
            </p>
            <p className="text-gray-500 text-sm mb-6">
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
                    <h4 className="font-bold text-lg text-white mb-2">
                      {e.title}
                    </h4>
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
                      <span className="text-sm text-gray-400">
                        {new Date(e.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {(e.date || e.time || e.location) && (
                      <div className="flex flex-wrap gap-3 mt-2 text-sm">
                        {e.date && (
                          <div className="flex items-center gap-1 text-emerald-400">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(e.date).toLocaleDateString()}
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
