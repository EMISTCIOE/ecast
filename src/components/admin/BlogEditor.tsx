import React, { useEffect, useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";

export type BlogEditorValues = {
  title: string;
  description: string;
  content: string;
  coverFile?: File | null;
};

export default function BlogEditor({
  initial,
  onSubmit,
  submitLabel = "Save",
  loading = false,
}: {
  initial?: Partial<BlogEditorValues> & { coverUrl?: string | null };
  onSubmit: (values: BlogEditorValues) => Promise<void> | void;
  submitLabel?: string;
  loading?: boolean;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [content, setContent] = useState(initial?.content || "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Allow parent to change the initial values when opening/closing modals
    setTitle(initial?.title || "");
    setDescription(initial?.description || "");
    setContent(initial?.content || "");
    setCoverFile(null);
  }, [initial?.title, initial?.description, initial?.content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, description, content, coverFile });
  };

  const currentCoverUrl = initial?.coverUrl || null;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Title *
        </label>
        <input
          type="text"
          className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <input
          type="text"
          className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Content
        </label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          uploadPath="/api/app/blog/upload"
          className="border-gray-600"
        />
        <div className="mt-3 flex items-center gap-2">
          <label className="text-sm text-gray-400 flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
            />
            Show Preview
          </label>
        </div>
        {showPreview && (
          <div className="mt-3 p-4 bg-[#252b47] border border-gray-600 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">
              Preview:
            </h4>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
      {currentCoverUrl && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Cover
          </label>
          <img
            src={currentCoverUrl}
            alt="Current cover"
            className="w-full h-48 object-cover rounded-xl border border-gray-700"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Cover Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="w-full bg-[#252b47] border border-gray-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700"
          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

