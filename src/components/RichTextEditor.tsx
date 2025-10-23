import React, { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  uploadPath?: string; // Next API route for image upload
  className?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  uploadPath = "/api/app/blog/upload",
  className = "",
}: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const savedSelection = useRef<Range | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">(
    "edit"
  );

  // Initialize content only once when component mounts or value changes externally
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value || "";
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Update content when value prop changes (for external updates like reset)
  useEffect(() => {
    if (editorRef.current && isInitialized) {
      const currentContent = editorRef.current.innerHTML;
      if (
        value !== currentContent &&
        !editorRef.current.contains(document.activeElement)
      ) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, isInitialized]);

  // Check which formats are active at current cursor position
  const updateActiveFormats = () => {
    const formats = new Set<string>();

    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    if (document.queryCommandState("insertUnorderedList")) formats.add("ul");
    if (document.queryCommandState("insertOrderedList")) formats.add("ol");

    // Check for blockquote
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node = selection.anchorNode;
      while (node && node !== editorRef.current) {
        if ((node as HTMLElement).tagName === "BLOCKQUOTE") {
          formats.add("blockquote");
          break;
        }
        node = node.parentNode;
      }
    }

    setActiveFormats(formats);
  };

  const emitChange = () => {
    if (editorRef.current) {
      const next = editorRef.current.innerHTML;
      onChange(next);
    }
    updateActiveFormats();
  };

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    emitChange();
  };

  const toggleBlockquote = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Check if we're already in a blockquote
    let node = selection.anchorNode;
    let blockquoteNode: HTMLElement | null = null;

    while (node && node !== editorRef.current) {
      if ((node as HTMLElement).tagName === "BLOCKQUOTE") {
        blockquoteNode = node as HTMLElement;
        break;
      }
      node = node.parentNode;
    }

    if (blockquoteNode) {
      // Remove blockquote by replacing it with its contents
      const parent = blockquoteNode.parentNode;
      if (parent) {
        while (blockquoteNode.firstChild) {
          parent.insertBefore(blockquoteNode.firstChild, blockquoteNode);
        }
        parent.removeChild(blockquoteNode);
      }
    } else {
      // Add blockquote
      exec("formatBlock", "<blockquote>");
    }

    emitChange();
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelection.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelection.current);
      }
    }
  };

  const insertLink = () => {
    saveSelection();
    setShowLinkModal(true);
  };

  const handleInsertLink = () => {
    if (linkUrl) {
      restoreSelection();

      // Ensure URL is absolute
      let finalUrl = linkUrl.trim();
      if (finalUrl && !finalUrl.match(/^https?:\/\//i)) {
        finalUrl = "https://" + finalUrl;
      }

      exec("createLink", finalUrl);

      // Set target="_blank" for the newly created link
      setTimeout(() => {
        if (editorRef.current) {
          const links = editorRef.current.querySelectorAll("a[href]");
          links.forEach((link) => {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
          });
          emitChange();
        }
      }, 0);

      setLinkUrl("");
      setShowLinkModal(false);
    }
  };

  const cancelLinkModal = () => {
    setShowLinkModal(false);
    setLinkUrl("");
    editorRef.current?.focus();
  };

  const insertImage = async (file: File) => {
    try {
      const form = new FormData();
      form.append("image", file);
      const token = localStorage.getItem("access") || "";
      const bearer = token ? `Bearer ${token}` : "";
      const res = await fetch(uploadPath, {
        method: "POST",
        headers: {
          Authorization: bearer,
          "x-access-token": bearer,
        },
        body: form,
      });
      if (!res.ok) {
        alert("Failed to upload image");
        return;
      }
      const data = await res.json();
      const url = data.url;
      if (!url) {
        alert("No URL returned");
        return;
      }
      // Insert using execCommand
      exec("insertImage", url);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed");
    }
  };

  // Helper to check if button should be highlighted
  const isActive = (format: string) => activeFormats.has(format);

  return (
    <div
      className={`bg-gray-900 border border-gray-700 rounded-lg ${className}`}
    >
      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Insert Link
            </h3>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL (e.g., https://example.com)"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInsertLink();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  cancelLinkModal();
                }
              }}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={cancelLinkModal}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-800">
        <button
          type="button"
          className={`px-2 py-1 text-sm rounded font-bold transition-colors ${
            isActive("bold")
              ? "bg-pink-600 text-white"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
          onClick={() => exec("bold")}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          className={`px-2 py-1 text-sm rounded italic transition-colors ${
            isActive("italic")
              ? "bg-pink-600 text-white"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
          onClick={() => exec("italic")}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className={`px-2 py-1 text-sm rounded underline transition-colors ${
            isActive("underline")
              ? "bg-pink-600 text-white"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
          onClick={() => exec("underline")}
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          className={`px-2 py-1 text-sm rounded transition-colors ${
            isActive("ul")
              ? "bg-pink-600 text-white"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
          onClick={() => exec("insertUnorderedList")}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          className={`px-2 py-1 text-sm rounded transition-colors ${
            isActive("ol")
              ? "bg-pink-600 text-white"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
          onClick={() => exec("insertOrderedList")}
          title="Numbered List"
        >
          1. List
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700 transition-colors"
          onClick={() => exec("formatBlock", "<h2>")}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700 transition-colors"
          onClick={() => exec("formatBlock", "<h3>")}
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          className={`px-2 py-1 text-sm rounded transition-colors ${
            isActive("blockquote")
              ? "bg-pink-600 text-white"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
          onClick={toggleBlockquote}
          title="Quote"
        >
          ❝ Quote
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700 transition-colors"
          onClick={insertLink}
          title="Insert Link"
        >
          🔗 Link
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700 transition-colors"
          onClick={() => fileRef.current?.click()}
          title="Insert Image"
        >
          🖼️ Image
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) insertImage(f);
            if (fileRef.current) fileRef.current.value = "";
          }}
        />
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-1 px-2 py-2 border-b border-gray-800 bg-gray-950">
        <button
          type="button"
          className={`px-4 py-2 text-sm rounded-lg transition-all ${
            viewMode === "edit"
              ? "bg-pink-600 text-white font-semibold"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setViewMode("edit")}
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm rounded-lg transition-all ${
            viewMode === "preview"
              ? "bg-pink-600 text-white font-semibold"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setViewMode("preview")}
        >
          👁️ Preview
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm rounded-lg transition-all ${
            viewMode === "split"
              ? "bg-pink-600 text-white font-semibold"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setViewMode("split")}
        >
          ⚡ Side by Side
        </button>
      </div>

      {/* Content Area */}
      <div className={`flex ${viewMode === "split" ? "gap-2" : ""}`}>
        {/* Editor - Always mounted but hidden when not needed */}
        <div
          className={`${
            viewMode === "split" ? "w-1/2 border-r border-gray-700" : viewMode === "edit" ? "w-full" : "hidden"
          }`}
        >
          <div
            ref={editorRef}
            className="min-h-[300px] p-3 focus:outline-none prose prose-invert max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-300 [&_a]:text-pink-400 [&_a]:underline [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-2 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2"
            style={{
              direction: "ltr",
              textAlign: "left",
              unicodeBidi: "normal",
            }}
            contentEditable
            suppressContentEditableWarning
            onInput={emitChange}
            onBlur={emitChange}
            onMouseUp={updateActiveFormats}
            onKeyUp={updateActiveFormats}
            onClick={updateActiveFormats}
          />
        </div>

        {/* Preview */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`${
              viewMode === "split" ? "w-1/2" : "w-full"
            } bg-gray-950/50`}
          >
            <div className="min-h-[300px] p-3 overflow-auto">
              {value ? (
                <div
                  className="prose prose-invert max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_blockquote]:border-l-4 [&_blockquote]:border-pink-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-300 [&_blockquote]:bg-gray-900/50 [&_blockquote]:py-2 [&_a]:text-pink-400 [&_a]:underline [&_a]:hover:text-pink-300 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-pink-400 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:text-pink-300 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2 [&_img]:border [&_img]:border-gray-700 [&_strong]:text-pink-200 [&_em]:text-purple-200"
                  dangerouslySetInnerHTML={{ __html: value }}
                />
              ) : (
                <div className="text-gray-500 italic text-center py-12">
                  Start typing to see preview...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
