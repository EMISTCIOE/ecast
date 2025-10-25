import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import {
  DocumentTextIcon,
  LinkIcon,
  ArrowUpTrayIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  XMarkIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  validateResearchForm,
  parseBackendErrors,
  scrollToFirstError,
  type ValidationErrors,
} from "@/lib/validation";

interface CoAuthor {
  id: number;
  username: string;
  full_name: string;
  email: string;
}

interface Author {
  id?: number; // Only for internal members
  full_name: string;
  username?: string;
  email?: string;
  isExternal?: boolean;
}

interface EditResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  research?: any;
  onSubmit: (
    slug: string,
    data: FormData | Record<string, any>
  ) => Promise<void>;
}

export default function EditResearchModal({
  isOpen,
  onClose,
  research,
  onSubmit,
}: EditResearchModalProps) {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [journalName, setJournalName] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [coAuthors, setCoAuthors] = useState<Author[]>([]);
  const [coAuthorSearch, setCoAuthorSearch] = useState("");
  const [searchResults, setSearchResults] = useState<CoAuthor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (research && isOpen) {
      setTitle(research.title || "");
      setAbstract(research.abstract || "");
      setJournalName(research.journal_name || "");
      setPublicationDate(research.publication_date || "");
      setDoi(research.doi || "");
      setUrl(research.url || "");
      setKeywords(research.keywords || "");
      setDocument(null);
      setMessage("");
      setErrors({});

      // Parse authors from the comma-separated string and existing co-authors
      let parsedAuthors: Author[] = [];

      // Add internal co-authors if they exist
      if (research.co_authors && Array.isArray(research.co_authors)) {
        parsedAuthors = research.co_authors.map((ca: any) => ({
          id: ca.id,
          full_name: ca.full_name || `${ca.first_name} ${ca.last_name}`.trim(),
          username: ca.username,
          email: ca.email,
          isExternal: false,
        }));
      }

      // Parse external authors from the authors string
      if (research.authors) {
        const allAuthorNames = research.authors
          .split(",")
          .map((a: string) => a.trim());
        const internalIds = parsedAuthors.map((a) => a.id);

        // Find external authors (those not in the internal co-authors list)
        // This is a simple approach - in reality you might need more sophisticated matching
        allAuthorNames.forEach((name: string) => {
          if (
            !parsedAuthors.some(
              (a) => a.full_name.toLowerCase() === name.toLowerCase()
            )
          ) {
            parsedAuthors.push({
              full_name: name,
              isExternal: true,
            });
          }
        });
      }

      setCoAuthors(parsedAuthors);
      setCoAuthorSearch("");
      setSearchResults([]);
    }
  }, [research, isOpen]);

  const handleCoAuthorSearch = async (query: string) => {
    setCoAuthorSearch(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const base =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(
        `${base}/api/research/search_members/?q=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const results = await response.json();
        // Filter out already selected authors
        const selectedIds = coAuthors
          .map((ca) => ca.id)
          .filter((id) => id !== undefined);
        const filtered = results.filter(
          (r: CoAuthor) => !selectedIds.includes(r.id)
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const addCoAuthor = (author: CoAuthor) => {
    const newAuthor: Author = {
      id: author.id,
      full_name: author.full_name,
      username: author.username,
      email: author.email,
      isExternal: false,
    };
    setCoAuthors([...coAuthors, newAuthor]);
    setCoAuthorSearch("");
    setSearchResults([]);
  };

  const addExternalAuthor = (name: string) => {
    if (name.trim().length === 0) return;

    // Check if already exists
    if (
      coAuthors.some((a) => a.full_name.toLowerCase() === name.toLowerCase())
    ) {
      return;
    }

    const newAuthor: Author = {
      full_name: name,
      isExternal: true,
    };
    setCoAuthors([...coAuthors, newAuthor]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!research?.slug) return;

    // Build authors string from all co-authors for validation
    const authorsString = coAuthors.map((a) => a.full_name).join(", ");

    // Client-side validation
    const validationErrors = validateResearchForm({
      title,
      abstract,
      authors: authorsString,
      url,
      doi,
      journalName,
      keywords,
      document,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      scrollToFirstError();
      return;
    }

    if (coAuthors.length === 0) {
      setErrors({ authors: "Please add at least one author" });
      scrollToFirstError();
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setErrors({});

    try {
      const payload: any = {
        title,
        abstract,
        authors: authorsString,
        journal_name: journalName,
        publication_date: publicationDate,
        doi,
        url,
        keywords,
      };

      // Send only internal members as co_author_ids
      const internalCoAuthors = coAuthors.filter((a) => a.id);
      if (internalCoAuthors.length > 0) {
        payload.co_author_ids = internalCoAuthors.map((ca) => ca.id);
      }

      await onSubmit(research.slug, payload);
      setMessage("Research paper updated successfully!");
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    } catch (error: any) {
      if (error.response?.data) {
        const backendErrors = parseBackendErrors(error.response.data);
        setErrors(backendErrors);
        scrollToFirstError();
      }
      setMessage("Failed to update research paper");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="✏️ Edit Research Paper"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div
            className={`p-5 rounded-2xl font-medium flex items-center gap-3 ${
              message.includes("Failed")
                ? "bg-red-900/30 border border-red-500/50 text-red-300"
                : "bg-green-900/30 border border-green-500/50 text-green-300"
            }`}
          >
            {message.includes("Failed") ? (
              <XCircleIcon className="w-6 h-6" />
            ) : (
              <CheckCircleIcon className="w-6 h-6" />
            )}
            {message}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            Paper Title *
          </label>
          <input
            className={`w-full p-4 bg-gray-900/80 border ${
              errors.title ? "border-red-500" : "border-gray-700"
            } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-lg text-white`}
            placeholder="Enter paper title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                const { title, ...rest } = errors;
                setErrors(rest);
              }
            }}
            required
          />
          {errors.title && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.title}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-purple-400" />
            Abstract *
          </label>
          <textarea
            className={`w-full p-4 bg-gray-900/80 border ${
              errors.abstract ? "border-red-500" : "border-gray-700"
            } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 resize-none font-medium text-white`}
            placeholder="Provide a brief abstract of your research..."
            rows={4}
            value={abstract}
            onChange={(e) => {
              setAbstract(e.target.value);
              if (errors.abstract) {
                const { abstract, ...rest } = errors;
                setErrors(rest);
              }
            }}
            required
          />
          {errors.abstract && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.abstract}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 text-purple-400" />
            Authors (Internal & External) *
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white"
              placeholder="Type author name (search internal members or add external authors)..."
              value={coAuthorSearch}
              onChange={(e) => handleCoAuthorSearch(e.target.value)}
              disabled={isSubmitting}
              required={coAuthors.length === 0}
            />

            {/* Search Results Dropdown - Show internal members */}
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => addCoAuthor(result)}
                    className="w-full text-left px-4 py-3 hover:bg-purple-600/30 border-b border-gray-700 last:border-b-0 transition text-white"
                  >
                    <div className="font-medium">{result.full_name}</div>
                    <div className="text-xs text-gray-400">
                      @{result.username} (Internal Member)
                    </div>
                  </button>
                ))}

                {/* Option to add as external author if not found */}
                {coAuthorSearch.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      addExternalAuthor(coAuthorSearch.trim());
                      setCoAuthorSearch("");
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-blue-600/30 border-t border-gray-700 transition text-blue-300 font-medium flex items-center gap-2"
                  >
                    <span>
                      + Add "{coAuthorSearch.trim()}" as External Author
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Show "Add as External" option when no search results but text is entered */}
            {coAuthorSearch.trim().length > 0 && searchResults.length === 0 && (
              <div className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-10">
                <button
                  type="button"
                  onClick={() => {
                    addExternalAuthor(coAuthorSearch.trim());
                    setCoAuthorSearch("");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-blue-600/30 transition text-blue-300 font-medium flex items-center gap-2"
                >
                  <span>
                    + Add "{coAuthorSearch.trim()}" as External Author
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Selected Authors (Internal & External) */}
          {coAuthors.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {coAuthors.map((author, idx) => (
                <div
                  key={`${author.id || "external"}-${idx}`}
                  className={`rounded-full px-4 py-2 flex items-center gap-2 text-sm transition-all ${
                    author.id
                      ? "bg-purple-600/30 border border-purple-500/50 text-purple-200"
                      : "bg-blue-600/30 border border-blue-500/50 text-blue-200"
                  }`}
                  title={
                    author.id ? `Internal: ${author.email}` : "External Author"
                  }
                >
                  <span>{author.full_name}</span>
                  {author.id && (
                    <span className="text-xs opacity-75">(Internal)</span>
                  )}
                  {!author.id && (
                    <span className="text-xs opacity-75">(External)</span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setCoAuthors(coAuthors.filter((_, i) => i !== idx));
                    }}
                    className="hover:text-opacity-100 transition"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            💡 Search for internal members or type external author names.
            Minimum 1 author required.
          </p>
          {errors.authors && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.authors}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Journal Name
            </label>
            <input
              className={`w-full p-4 bg-gray-900/80 border ${
                errors.journalName ? "border-red-500" : "border-gray-700"
              } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white`}
              placeholder="Journal/Conference name..."
              value={journalName}
              onChange={(e) => {
                setJournalName(e.target.value);
                if (errors.journalName) {
                  const { journalName, ...rest } = errors;
                  setErrors(rest);
                }
              }}
            />
            {errors.journalName && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.journalName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Publication Date
            </label>
            <input
              type="date"
              className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              DOI (Digital Object Identifier)
            </label>
            <input
              className={`w-full p-4 bg-gray-900/80 border ${
                errors.doi ? "border-red-500" : "border-gray-700"
              } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white`}
              placeholder="10.xxxx/xxxxx"
              value={doi}
              onChange={(e) => {
                setDoi(e.target.value);
                if (errors.doi) {
                  const { doi, ...rest } = errors;
                  setErrors(rest);
                }
              }}
            />
            {errors.doi && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.doi}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-purple-400" />
              Paper URL
            </label>
            <input
              className={`w-full p-4 bg-gray-900/80 border ${
                errors.url ? "border-red-500" : "border-gray-700"
              } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white`}
              placeholder="https://..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) {
                  const { url, ...rest } = errors;
                  setErrors(rest);
                }
              }}
            />
            {errors.url && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.url}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            Keywords
          </label>
          <input
            className={`w-full p-4 bg-gray-900/80 border ${
              errors.keywords ? "border-red-500" : "border-gray-700"
            } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white`}
            placeholder="Comma-separated keywords (e.g., AI, Machine Learning, NLP)..."
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
              if (errors.keywords) {
                const { keywords, ...rest } = errors;
                setErrors(rest);
              }
            }}
          />
          {errors.keywords && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.keywords}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 text-xs text-gray-500">
            Current document: {research?.document ? "Uploaded" : "None"}
          </label>
          <p className="text-xs text-gray-500">
            To update document, create a new submission
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 p-4 rounded-xl font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all duration-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 p-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                Update Research
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
