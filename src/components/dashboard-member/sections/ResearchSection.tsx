import {
  DocumentTextIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

interface ResearchSectionProps {
  myResearch: any[];
  onCreateClick: () => void;
  onEditClick: (research: any) => void;
  onDeleteClick: (slug: string) => void;
  isAdmin?: boolean;
  onApprove?: (slug: string) => void;
  onReject?: (slug: string) => void;
}

export default function ResearchSection({
  myResearch,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  isAdmin = false,
  onApprove,
  onReject,
}: ResearchSectionProps) {
  // Members can only edit if status is PENDING
  const canEdit = (paper: any) => {
    if (isAdmin) return true;
    return paper.status === "PENDING";
  };
  return (
    <div className="animate-fade-in">
      {/* Header with Create Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-3 flex items-center gap-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <DocumentTextIcon className="w-7 h-7 text-white" />
            </div>
            My Research Papers
          </h1>
          <p className="text-gray-400 text-sm">
            View and manage your submitted research papers
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
        >
          <PlusIcon className="w-5 h-5" />
          Add Research
        </button>
      </div>

      {/* My Research List */}
      <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
        {myResearch.length === 0 ? (
          <div className="text-center py-16">
            <DocumentTextIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-400 text-lg font-semibold mb-2">
              No research papers submitted yet
            </p>
            <p className="text-gray-500 text-xs mb-6">
              Share your research papers with the ECAST community
            </p>
            <button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              Submit Your First Paper
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-400">
              {myResearch.length} research paper
              {myResearch.length !== 1 ? "s" : ""} submitted
            </p>
            {myResearch.map((paper: any) => (
              <div
                key={paper.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base text-white mb-2 line-clamp-2">
                      {paper.title}
                    </h4>
                    {paper.abstract && (
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                        {paper.abstract}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          paper.status === "APPROVED"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : paper.status === "REJECTED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        {paper.status || "PENDING"}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(paper.created_at || "").toLocaleDateString()}
                      </span>
                    </div>

                    {/* Paper Details */}
                    <div className="text-sm text-gray-400 space-y-1 mb-3">
                      {paper.authors && (
                        <p>
                          <span className="text-gray-300 font-semibold">
                            Authors:
                          </span>{" "}
                          {paper.authors}
                        </p>
                      )}
                      {paper.journal_name && (
                        <p>
                          <span className="text-gray-300 font-semibold">
                            Journal:
                          </span>{" "}
                          {paper.journal_name}
                        </p>
                      )}
                      {paper.publication_date && (
                        <p>
                          <span className="text-gray-300 font-semibold">
                            Published:
                          </span>{" "}
                          {new Date(
                            paper.publication_date
                          ).toLocaleDateString()}
                        </p>
                      )}
                      {paper.keywords && (
                        <p>
                          <span className="text-gray-300 font-semibold">
                            Keywords:
                          </span>{" "}
                          {paper.keywords}
                        </p>
                      )}
                    </div>

                    {/* Links */}
                    {(paper.url || paper.document) && (
                      <div className="flex gap-3 mt-3">
                        {paper.url && (
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                          >
                            <LinkIcon className="w-4 h-4" />
                            View Paper
                          </a>
                        )}
                        {paper.document && (
                          <a
                            href={paper.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 transition-colors"
                          >
                            <LinkIcon className="w-4 h-4" />
                            Download
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                    {/* Edit button - Admin always, Members only if PENDING */}
                    {canEdit(paper) && (
                      <button
                        onClick={() => onEditClick(paper)}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors border border-blue-500/30"
                        title={
                          isAdmin
                            ? "Edit research"
                            : paper.status === "PENDING"
                            ? "Edit research (available until approved)"
                            : "Cannot edit approved research"
                        }
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                    )}

                    {/* Delete button - Admin always, Members always for their own */}
                    <button
                      onClick={() => onDeleteClick(paper.slug)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors border border-red-500/30"
                      title="Delete research"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>

                    {/* Approve/Reject buttons - Admin only */}
                    {isAdmin && paper.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => onApprove?.(paper.slug)}
                          className="p-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg transition-colors border border-green-500/30"
                          title="Approve research"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => onReject?.(paper.slug)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors border border-red-500/30"
                          title="Reject research"
                        >
                          ✕
                        </button>
                      </>
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
