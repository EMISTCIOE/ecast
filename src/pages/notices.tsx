import { GetServerSideProps } from "next";
import { useState } from "react";
import Image from "next/image";
import { Notice } from "../types";
import Navbar from "@/components/nav";
import Footer from "@/components/footar";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
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
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
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
      <div className="flex justify-center bg-black w-full min-h-screen">
        <div className="w-full max-w-7xl px-4 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-white text-5xl lg:text-6xl font-bold mb-4">
              Notices
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Stay informed with important announcements, deadlines, and updates
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
            <div className="text-center text-gray-300 text-xl py-12 bg-gray-900/60 rounded-lg border border-gray-800">
              No notices found matching your criteria.
            </div>
          ) : (
            <>
              <div className="space-y-4 pb-9">
                {filteredNotices.map((notice) => {
                  const documentFileType = getFileType(notice.document);
                  const fullFlyerUrl = getFullUrl(notice.flyer);
                  const fullDocumentUrl = getFullUrl(notice.document);
                  const isExpanded = expandedNotice === notice.id;
                  const contentPreview =
                    notice.content.length > 120
                      ? notice.content.substring(0, 120) + "..."
                      : notice.content;

                  return (
                    <div
                      key={notice.id}
                      className="bg-gradient-to-r from-gray-900/70 to-gray-800/60 backdrop-blur-sm border-l-4 border-purple-500 rounded-lg p-4 shadow-lg hover:shadow-2xl hover:border-purple-400 transition-all duration-300 group relative overflow-hidden"
                    >
                      {/* Notification accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl"></div>

                      {/* Header Row - More Compact */}
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors leading-tight">
                            {notice.title}
                          </h2>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {formatDate(notice.created_at)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {notice.published_by_username}
                            </span>
                          </div>
                        </div>
                        {/* Notification Badge */}
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-500/30 animate-pulse">
                            NEW
                          </span>
                        </div>
                      </div>

                      {/* Content - More Compact */}
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed relative z-10">
                        {isExpanded ? notice.content : contentPreview}
                      </p>

                      {/* Action Buttons - More Compact */}
                      <div className="flex items-center justify-between pt-1 relative z-10">
                        <button
                          onClick={() => toggleExpand(notice.id)}
                          className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 font-medium py-1.5 px-4 rounded-md transition-all duration-200 text-sm border border-purple-500/30 hover:border-purple-400/50"
                        >
                          {isExpanded ? "Show Less" : "Read More"}
                        </button>

                        <div className="flex gap-3">
                          {fullFlyerUrl && (
                            <>
                              <button
                                onClick={() =>
                                  handlePreview(fullFlyerUrl, "image")
                                }
                                className="text-purple-400 hover:text-purple-300 transition-colors transform hover:scale-110"
                                title="Preview Flyer"
                              >
                                <svg
                                  className="w-5 h-5"
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
                                    fullFlyerUrl,
                                    `${notice.title}-flyer.jpg`
                                  )
                                }
                                className="text-purple-400 hover:text-purple-300 transition-colors transform hover:scale-110"
                                title="Download Flyer"
                              >
                                <svg
                                  className="w-5 h-5"
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
                            </>
                          )}
                          {fullDocumentUrl && (
                            <>
                              <button
                                onClick={() =>
                                  handlePreview(
                                    fullDocumentUrl,
                                    documentFileType || "pdf"
                                  )
                                }
                                className="text-blue-400 hover:text-blue-300 transition-colors transform hover:scale-110"
                                title="Preview Document"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  handleDownload(
                                    fullDocumentUrl,
                                    `${notice.title}.${
                                      documentFileType === "pdf" ? "pdf" : "doc"
                                    }`
                                  )
                                }
                                className="text-blue-400 hover:text-blue-300 transition-colors transform hover:scale-110"
                                title="Download Document"
                              >
                                <svg
                                  className="w-5 h-5"
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
                            </>
                          )}
                        </div>
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
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
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
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
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
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
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

      {/* Newsletter Subscription - Matching background */}
      <div className="bg-black py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <NewsletterSubscribe
            category="NOTICES"
            title="Subscribe to Notice Updates"
            description="Get notified instantly when important notices are posted. Stay informed about announcements, deadlines, and important information."
          />
        </div>
      </div>

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
