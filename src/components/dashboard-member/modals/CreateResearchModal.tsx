import { useState } from "react";
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
  const [authors, setAuthors] = useState("");
  const [journalName, setJournalName] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!title.trim() || !abstract.trim() || !authors.trim()) {
      setMessage("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("abstract", abstract);
      formData.append("authors", authors);
      if (journalName) formData.append("journal_name", journalName);
      if (publicationDate) formData.append("publication_date", publicationDate);
      if (doi) formData.append("doi", doi);
      if (url) formData.append("url", url);
      if (keywords) formData.append("keywords", keywords);
      if (document) formData.append("document", document);

      await onSubmit(formData);
      setMessage("success");
      setTimeout(() => {
        setTitle("");
        setAbstract("");
        setAuthors("");
        setJournalName("");
        setPublicationDate("");
        setDoi("");
        setUrl("");
        setKeywords("");
        setDocument(null);
        setMessage("");
        onClose();
      }, 1500);
    } catch (error: any) {
      const errorMsg =
        error?.message || "Failed to submit research paper. Please try again.";
      setMessage("error:" + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setAbstract("");
      setAuthors("");
      setJournalName("");
      setPublicationDate("");
      setDoi("");
      setUrl("");
      setKeywords("");
      setDocument(null);
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
            className="w-full p-4 bg-gray-900/80 border-2 border-dashed border-gray-700 rounded-xl hover:border-purple-500/50 transition-all duration-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white file:font-semibold hover:file:from-purple-700 hover:file:to-pink-700 file:shadow-lg file:transition-all cursor-pointer text-white"
            onChange={(e) => setDocument(e.target.files?.[0] || null)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported: PDF, DOCX, PPTX (Max 25MB)
          </p>
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
