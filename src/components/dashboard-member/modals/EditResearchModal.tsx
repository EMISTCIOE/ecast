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
} from "@heroicons/react/24/outline";

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
  const [authors, setAuthors] = useState("");
  const [journalName, setJournalName] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (research && isOpen) {
      setTitle(research.title || "");
      setAbstract(research.abstract || "");
      setAuthors(research.authors || "");
      setJournalName(research.journal_name || "");
      setPublicationDate(research.publication_date || "");
      setDoi(research.doi || "");
      setUrl(research.url || "");
      setKeywords(research.keywords || "");
      setDocument(null);
      setMessage("");
    }
  }, [research, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!research?.slug) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const payload: any = {
        title,
        abstract,
        authors,
        journal_name: journalName,
        publication_date: publicationDate,
        doi,
        url,
        keywords,
      };

      await onSubmit(research.slug, payload);
      setMessage("Research paper updated successfully!");
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    } catch (error) {
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
            className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-lg text-white"
            placeholder="Enter paper title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-purple-400" />
            Abstract *
          </label>
          <textarea
            className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 resize-none font-medium text-white"
            placeholder="Provide a brief abstract of your research..."
            rows={4}
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-purple-400" />
            Authors (All) *
          </label>
          <input
            className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white"
            placeholder="Comma-separated list of all authors..."
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500">
            Include all authors (internal and external)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Journal Name
            </label>
            <input
              className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white"
              placeholder="Journal/Conference name..."
              value={journalName}
              onChange={(e) => setJournalName(e.target.value)}
            />
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
              className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white"
              placeholder="10.xxxx/xxxxx"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-purple-400" />
              Paper URL
            </label>
            <input
              className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            Keywords
          </label>
          <input
            className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white"
            placeholder="Comma-separated keywords (e.g., AI, Machine Learning, NLP)..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
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
