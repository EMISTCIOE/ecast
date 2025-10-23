import { GetServerSideProps } from "next";
import { useState } from "react";
import Image from "next/image";
import { Notice } from "../types";
import styles from "../components/css/file1.module.css";
import Navbar from "@/components/nav";
import Footer from "@/components/footar";
import clsx from "clsx";

interface NoticesPageProps {
  notices: Notice[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const NoticesPage: React.FC<NoticesPageProps> = ({
  notices,
  total,
  currentPage,
  totalPages,
}) => {
  const [previewModal, setPreviewModal] = useState<{
    type: "pdf" | "image";
    url: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Removed department/audience filter per new design
  const [expandedNotice, setExpandedNotice] = useState<string | null>(null);

  const getFileType = (
    url: string | null | undefined
  ): "pdf" | "image" | null => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith(".pdf")) return "pdf";
    if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return "image";
    return null;
  };

  const handlePreview = (url: string, type: "pdf" | "image") => {
    setPreviewModal({ type, url });
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const closeModal = () => {
    setPreviewModal(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFullUrl = (path: string | null | undefined) => {
    if (!path) return "";
    const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
    return path.startsWith("http") ? path : `${base}${path}`;
  };

  // Filter notices based on search only
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      searchQuery === "" ||
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const toggleExpand = (noticeId: string) => {
    setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center bg-[#1a1f3a] w-full min-h-screen">
        <div className="w-full max-w-7xl px-4 lg:px-8 py-8">
          {/* Header */}
          <h1 className="text-white text-center text-5xl lg:text-6xl font-bold mb-8">
            Notices
          </h1>

          {/* Search Section */}
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-600/20 rounded-xl p-6 mb-8 shadow-md">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-lg focus:outline-none bg-black/40 border border-purple-700/30 text-white placeholder:text-gray-400"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Removed audience/department dropdown */}
            </div>
          </div>

          {/* Notices List */}
          {filteredNotices.length === 0 ? (
            <div className="text-center text-gray-300 text-xl py-12 bg-[#2a2f4a] rounded-lg">
              No notices found matching your criteria.
            </div>
          ) : (
            <>
              <div className="space-y-6 pb-9">
                {filteredNotices.map((notice) => {
                  const fileType = getFileType(notice.attachment);
                  const fullAttachmentUrl = getFullUrl(notice.attachment);
                  const isExpanded = expandedNotice === notice.id;
                  const contentPreview =
                    notice.content.length > 150
                      ? notice.content.substring(0, 150) + "..."
                      : notice.content;

                  return (
                    <div
                      key={notice.id}
                      className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {/* Header Row */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <span>{formatDate(notice.created_at)}</span>
                            <span>|</span>
                            <span>Audience: {notice.audience}</span>
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-0">
                            {notice.title}
                          </h2>
                        </div>
                        <span className="bg-purple-600/20 text-purple-300 text-xs font-bold px-3 py-1 rounded whitespace-nowrap ml-4 uppercase border border-purple-600/30">
                          {notice.audience}
                        </span>
                      </div>

                      {/* Content */}
                      <p className="text-gray-300 mb-3 leading-relaxed">
                        {isExpanded ? notice.content : contentPreview}
                      </p>

                      {/* Author Info */}
                      <p className="text-sm text-gray-400 mb-4">
                        Posted by:{" "}
                        <span className="font-semibold text-gray-200">
                          {notice.published_by_username}
                        </span>
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => toggleExpand(notice.id)}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          {isExpanded ? "Show Less" : "Read More"}
                        </button>

                        {fileType && (
                          <div className="flex gap-4">
                            <button
                              onClick={() =>
                                handlePreview(fullAttachmentUrl, fileType)
                              }
                              className="text-purple-600 hover:text-purple-800 transition-colors transform hover:scale-110"
                              title="Preview"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                handleDownload(
                                  fullAttachmentUrl,
                                  `${notice.title}.${
                                    fileType === "pdf" ? "pdf" : "jpg"
                                  }`
                                )
                              }
                              className="text-purple-600 hover:text-purple-800 transition-colors transform hover:scale-110"
                              title="Download"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8 pb-8">
                  <a
                    href={`/notices?page=${currentPage - 1}`}
                    className={clsx(
                      "px-5 py-2 rounded-lg font-semibold transition-colors",
                      currentPage === 1
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-800 hover:bg-gray-100"
                    )}
                    onClick={(e) => currentPage === 1 && e.preventDefault()}
                  >
                    Previous
                  </a>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <a
                          key={page}
                          href={`/notices?page=${page}`}
                          className={clsx(
                            "px-4 py-2 rounded-lg font-semibold transition-colors",
                            page === currentPage
                              ? "bg-purple-600 text-white"
                              : "bg-white text-gray-800 hover:bg-gray-100"
                          )}
                        >
                          {page}
                        </a>
                      )
                    )}
                  </div>

                  <a
                    href={`/notices?page=${currentPage + 1}`}
                    className={clsx(
                      "px-5 py-2 rounded-lg font-semibold transition-colors",
                      currentPage === totalPages
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-800 hover:bg-gray-100"
                    )}
                    onClick={(e) =>
                      currentPage === totalPages && e.preventDefault()
                    }
                  >
                    Next
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white text-4xl font-bold hover:text-gray-300 z-10"
            >
              ✕
            </button>

            {previewModal.type === "pdf" ? (
              <iframe
                src={previewModal.url}
                className="w-full h-[90vh] rounded-lg"
                title="PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-[90vh]">
                <Image
                  src={previewModal.url}
                  alt="Preview"
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const host = ctx.req?.headers?.host || "localhost:3000";
  const protocol =
    host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https";

  const page = parseInt(ctx.query.page as string) || 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  try {
    // Fetch notices with only approved status
    const params = new URLSearchParams({
      status: "APPROVED",
    });

    const res = await fetch(
      `${protocol}://${host}/api/app/notice/list?${params}`
    );
    const data = await res.json();

    // Handle both paginated response (with results/count) and plain array
    let allNotices: Notice[] = [];
    if (Array.isArray(data)) {
      // Plain array response
      allNotices = data;
    } else if (data.results) {
      // Paginated response
      allNotices = data.results;
    }

    // No need to filter by audience here - backend handles it with APPROVED status
    // All approved notices should be visible on the public notices page

    // Client-side pagination
    const total = allNotices.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const notices = allNotices.slice(startIndex, endIndex);

    return {
      props: {
        notices,
        total,
        currentPage: page,
        totalPages,
      },
    };
  } catch (e) {
    console.error("Error fetching notices:", e);
    return {
      props: {
        notices: [],
        total: 0,
        currentPage: 1,
        totalPages: 0,
      },
    };
  }
};

export default NoticesPage;
