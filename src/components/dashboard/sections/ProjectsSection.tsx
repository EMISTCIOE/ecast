import {
  FolderIcon,
  PlusIcon,
  LinkIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

interface ProjectsSectionProps {
  myProjects: any[];
  onCreateClick: () => void;
}

export default function ProjectsSection({
  myProjects,
  onCreateClick,
}: ProjectsSectionProps) {
  return (
    <div className="animate-fade-in">
      {/* Header with Create Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FolderIcon className="w-7 h-7 text-white" />
            </div>
            My Projects
          </h1>
          <p className="text-gray-400 text-lg">
            View and manage your submitted projects
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
        >
          <PlusIcon className="w-5 h-5" />
          Create Project
        </button>
      </div>

      {/* My Projects List */}
      <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
        {myProjects.length === 0 ? (
          <div className="text-center py-16">
            <FolderIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-400 text-xl font-semibold mb-2">
              No projects created yet
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Create your first project to showcase your work
            </p>
            <button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-400">
              {myProjects.length} project{myProjects.length !== 1 ? "s" : ""}{" "}
              submitted
            </p>
            {myProjects.map((p: any) => (
              <div
                key={p.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {p.image && (
                    <div className="w-32 h-24 flex-shrink-0">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover rounded-lg border border-blue-500/30"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg text-white mb-2">
                      {p.title}
                    </h4>
                    {p.description && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {p.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          p.status === "APPROVED"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : p.status === "REJECTED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        {p.status}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(p.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {(p.repo_link || p.live_link) && (
                      <div className="flex gap-3 mt-2">
                        {p.repo_link && (
                          <a
                            href={p.repo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                          >
                            <LinkIcon className="w-4 h-4" />
                            Repository
                          </a>
                        )}
                        {p.live_link && (
                          <a
                            href={p.live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 transition-colors"
                          >
                            <GlobeAltIcon className="w-4 h-4" />
                            Live Demo
                          </a>
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
