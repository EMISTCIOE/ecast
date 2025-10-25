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

  // Members/Alumni can only delete if status is PENDING or REJECTED
  // Admin can delete any status
  const canDelete = (paper: any) => {
    if (isAdmin) return true;
    return paper.status === "PENDING" || paper.status === "REJECTED";
  };

  return (
    <div className="animate-fade-in">
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold mb-1 flex items-center gap-2.5 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <DocumentTextIcon className="w-5 h-5 text-white" />
            </div>
            My Research Papers
          </h1>
          <p className="text-gray-400 text-xs">
            View and manage your submitted research papers
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
        >
          <PlusIcon className="w-4 h-4" />
          Add Research
        </button>
      </div>

      {/* My Research List */}
      <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 shadow-2xl">
        {myResearch.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-base font-semibold mb-1">
              No research papers submitted yet
            </p>
            <p className="text-gray-500 text-xs mb-5">
              Share your research papers with the ECAST community
            </p>
            <button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 shadow-lg transition-all duration-300"
            >
              <PlusIcon className="w-4 h-4" />
              Submit Your First Paper
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-400 text-xs font-medium">
              {myResearch.length} research paper
              {myResearch.length !== 1 ? "s" : ""} submitted
            </p>
            {myResearch.map((paper: any) => (
              <div
                key={paper.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-3.5 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Title and Status Row */}
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h4 className="font-semibold text-sm text-white line-clamp-1 flex-1">
                        {paper.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                            paper.status === "APPROVED"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : paper.status === "REJECTED"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {paper.status || "PENDING"}
                        </span>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(
                            paper.created_at || ""
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Abstract - Show only if exists */}
                    {paper.abstract && (
                      <p className="text-xs text-gray-400 line-clamp-1 mb-1.5">
                        {paper.abstract}
                      </p>
                    )}

                    {/* Paper Details in Grid Layout */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400 mb-1.5">
                      {paper.authors && (
                        <p className="truncate">
                          <span className="text-gray-300 font-medium">
                            Authors:
                          </span>{" "}
                          <span className="text-gray-400">{paper.authors}</span>
                        </p>
                      )}
                      {paper.journal_name && (
                        <p className="truncate">
                          <span className="text-gray-300 font-medium">
                            Journal:
                          </span>{" "}
                          <span className="text-gray-400">
                            {paper.journal_name}
                          </span>
                        </p>
                      )}
                      {paper.publication_date && (
                        <p className="truncate">
                          <span className="text-gray-300 font-medium">
                            Published:
                          </span>{" "}
                          <span className="text-gray-400">
                            {new Date(
                              paper.publication_date
                            ).toLocaleDateString()}
                          </span>
                        </p>
                      )}
                      {paper.keywords && (
                        <p className="truncate">
                          <span className="text-gray-300 font-medium">
                            Keywords:
                          </span>{" "}
                          <span className="text-gray-400">
                            {paper.keywords}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Links */}
                    {(paper.url || paper.document) && (
                      <div className="flex gap-3">
                        {paper.url && (
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors font-medium"
                          >
                            <LinkIcon className="w-3 h-3" />
                            View
                          </a>
                        )}
                        {paper.document && (
                          <a
                            href={paper.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors font-medium"
                          >
                            <LinkIcon className="w-3 h-3" />
                            Download
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    {/* Edit button - Admin always, Members only if PENDING */}
                    {canEdit(paper) && (
                      <button
                        onClick={() => onEditClick(paper)}
                        className="p-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors border border-blue-500/30"
                        title={
                          isAdmin
                            ? "Edit research"
                            : paper.status === "PENDING"
                            ? "Edit research (available until approved)"
                            : "Cannot edit approved research"
                        }
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete button - Admin always, Members/Alumni only if PENDING or REJECTED */}
                    {canDelete(paper) && (
                      <button
                        onClick={() => onDeleteClick(paper.slug)}
                        className="p-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors border border-red-500/30"
                        title={
                          isAdmin
                            ? "Delete research"
                            : paper.status === "APPROVED"
                            ? "Cannot delete approved research"
                            : "Delete research"
                        }
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}

                    {/* Approve/Reject buttons - Admin only */}
                    {isAdmin && paper.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => onApprove?.(paper.slug)}
                          className="p-1.5 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg transition-colors border border-green-500/30 text-sm font-bold"
                          title="Approve research"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => onReject?.(paper.slug)}
                          className="p-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors border border-red-500/30 text-sm font-bold"
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
