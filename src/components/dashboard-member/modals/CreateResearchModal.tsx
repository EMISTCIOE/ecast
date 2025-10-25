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

interface CurrentUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
}

interface CreateResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function CreateResearchModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateResearchModalProps) {
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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [coAuthors, setCoAuthors] = useState<Author[]>([]);
  const [coAuthorSearch, setCoAuthorSearch] = useState("");
  const [searchResults, setSearchResults] = useState<CoAuthor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Load current user and pre-select them as author
  useEffect(() => {
    if (isOpen) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser({
            id: user.id,
            username: user.username,
            full_name:
              user.full_name || `${user.first_name} ${user.last_name}`.trim(),
            email: user.email,
          });

          // Pre-select current user as first author
          const currentUserAuthor: Author = {
            id: user.id,
            full_name:
              user.full_name || `${user.first_name} ${user.last_name}`.trim(),
            username: user.username,
            email: user.email,
            isExternal: false,
          };
          setCoAuthors([currentUserAuthor]);
        } catch (error) {
          console.error("Failed to parse user from localStorage");
        }
      }
    }
  }, [isOpen]);

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
      const access = localStorage.getItem("access");
      const response = await fetch(
        `${base}/api/research/search_members/?q=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(access && { Authorization: `Bearer ${access}` }),
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

    // Clear previous errors
    setErrors({});
    setMessage("");

    // Build authors string from all authors (internal + external)
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

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("abstract", abstract);
      formData.append("authors", authorsString);
      if (journalName) formData.append("journal_name", journalName);
      if (publicationDate) formData.append("publication_date", publicationDate);
      if (doi) formData.append("doi", doi);
      if (url) formData.append("url", url);
      if (keywords) formData.append("keywords", keywords);
      if (document) formData.append("document", document);

      // Send only internal members as co_author_ids
      const internalCoAuthors = coAuthors.filter((a) => a.id);
      if (internalCoAuthors.length > 0) {
        const coAuthorIds = internalCoAuthors.map((ca) => ca.id);
        formData.append("co_author_ids", JSON.stringify(coAuthorIds));
      }

      await onSubmit(formData);
      setMessage("success");
      setTimeout(() => {
        setTitle("");
        setAbstract("");
        setAuthors([]);
        setJournalName("");
        setPublicationDate("");
        setDoi("");
        setUrl("");
        setKeywords("");
        setDocument(null);
        setCoAuthors([]);
        setCoAuthorSearch("");
        setSearchResults([]);
        setMessage("");
        setErrors({});
        onClose();
      }, 1500);
    } catch (error: any) {
      // Parse backend validation errors
      if (error?.response?.data) {
        const backendErrors = parseBackendErrors(error.response.data);
        setErrors(backendErrors);
        scrollToFirstError();
      } else {
        const errorMsg =
          error?.message ||
          "Failed to submit research paper. Please try again.";
        setMessage("error:" + errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setAbstract("");
      setJournalName("");
      setPublicationDate("");
      setDoi("");
      setUrl("");
      setKeywords("");
      setDocument(null);
      // Reset to just the current user
      if (currentUser) {
        setCoAuthors([
          {
            id: currentUser.id,
            full_name: currentUser.full_name,
            username: currentUser.username,
            email: currentUser.email,
            isExternal: false,
          },
        ]);
      }
      setCoAuthorSearch("");
      setSearchResults([]);
      setMessage("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="📄 Submit Research Paper"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div
            className={`p-5 rounded-2xl font-medium flex items-center gap-3 animate-in fade-in ${
              message.startsWith("error")
                ? "bg-red-900/30 border border-red-500/50 text-red-300"
                : message === "success"
                ? "bg-green-900/30 border border-green-500/50 text-green-300"
                : "bg-blue-900/30 border border-blue-500/50 text-blue-300"
            }`}
          >
            {message.startsWith("error") ? (
              <XCircleIcon className="w-6 h-6 flex-shrink-0" />
            ) : message === "success" ? (
              <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
            ) : (
              <SparklesIcon className="w-6 h-6 flex-shrink-0 animate-pulse" />
            )}
            <span className="flex-1">
              {message === "success"
                ? "✨ Research paper submitted successfully!"
                : message.startsWith("error")
                ? message.replace("error:", "")
                : message}
            </span>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            Paper Title *
          </label>
          <input
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-lg text-white ${
              errors.title ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Enter paper title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                const newErrors = { ...errors };
                delete newErrors.title;
                setErrors(newErrors);
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
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 resize-none font-medium text-white ${
              errors.abstract ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Provide a brief abstract of your research..."
            rows={4}
            value={abstract}
            onChange={(e) => {
              setAbstract(e.target.value);
              if (errors.abstract) {
                const newErrors = { ...errors };
                delete newErrors.abstract;
                setErrors(newErrors);
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
              className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white ${
                errors.journal_name ? "border-red-500" : "border-gray-700"
              }`}
              placeholder="Journal/Conference name..."
              value={journalName}
              onChange={(e) => {
                setJournalName(e.target.value);
                if (errors.journal_name) {
                  const newErrors = { ...errors };
                  delete newErrors.journal_name;
                  setErrors(newErrors);
                }
              }}
            />
            {errors.journal_name && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.journal_name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Publication Date
            </label>
            <input
              type="date"
              className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white ${
                errors.publication_date ? "border-red-500" : "border-gray-700"
              }`}
              value={publicationDate}
              onChange={(e) => {
                setPublicationDate(e.target.value);
                if (errors.publication_date) {
                  const newErrors = { ...errors };
                  delete newErrors.publication_date;
                  setErrors(newErrors);
                }
              }}
            />
            {errors.publication_date && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.publication_date}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              DOI (Digital Object Identifier)
            </label>
            <input
              className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white ${
                errors.doi ? "border-red-500" : "border-gray-700"
              }`}
              placeholder="10.xxxx/xxxxx"
              value={doi}
              onChange={(e) => {
                setDoi(e.target.value);
                if (errors.doi) {
                  const newErrors = { ...errors };
                  delete newErrors.doi;
                  setErrors(newErrors);
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
              className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white ${
                errors.url ? "border-red-500" : "border-gray-700"
              }`}
              placeholder="https://..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) {
                  const newErrors = { ...errors };
                  delete newErrors.url;
                  setErrors(newErrors);
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
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white ${
              errors.keywords ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Comma-separated keywords (e.g., AI, Machine Learning, NLP)..."
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
              if (errors.keywords) {
                const newErrors = { ...errors };
                delete newErrors.keywords;
                setErrors(newErrors);
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
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <ArrowUpTrayIcon className="w-5 h-5 text-purple-400" />
            Upload Document{" "}
            {document && (
              <span className="text-green-400 text-xs">({document.name})</span>
            )}
          </label>
          <input
            type="file"
            accept=".pdf,.docx,.pptx"
            className={`w-full p-4 bg-gray-900/80 border-2 border-dashed rounded-xl hover:border-purple-500/50 transition-all duration-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white file:font-semibold hover:file:from-purple-700 hover:file:to-pink-700 file:shadow-lg file:transition-all cursor-pointer text-white ${
              errors.document ? "border-red-500" : "border-gray-700"
            }`}
            onChange={(e) => {
              setDocument(e.target.files?.[0] || null);
              if (errors.document) {
                const newErrors = { ...errors };
                delete newErrors.document;
                setErrors(newErrors);
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported: PDF, DOCX, PPTX (Max 25MB)
          </p>
          {errors.document && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.document}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 p-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              Submit for Review
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}
