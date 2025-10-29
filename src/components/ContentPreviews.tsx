import React from "react";

// Notice Preview Component
interface NoticePreviewProps {
  notice: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    audience: string;
    published_by_username: string;
    flyer?: string;
    document?: string;
  };
  onApprove?: () => void;
  onReject?: () => void;
}

export const NoticePreview: React.FC<NoticePreviewProps> = ({
  notice,
  onApprove,
  onReject,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const fullFlyerUrl = notice.flyer
    ? notice.flyer.startsWith("http")
      ? notice.flyer
      : `${base}${notice.flyer}`
    : null;

  const fullDocumentUrl = notice.document
    ? notice.document.startsWith("http")
      ? notice.document
      : `${base}${notice.document}`
    : null;

  const getFileType = (url: string | null): "pdf" | "doc" | "image" | null => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith(".pdf")) return "pdf";
    if (lowerUrl.match(/\.(doc|docx)$/)) return "doc";
    if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return "image";
    return null;
  };

  const documentFileType = getFileType(fullDocumentUrl);

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span>{formatDate(notice.created_at)}</span>
            <span>|</span>
            <span>Audience: {notice.audience}</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-0">{notice.title}</h2>
        </div>
        <span className="bg-purple-600/20 text-purple-300 text-xs font-bold px-3 py-1 rounded whitespace-nowrap ml-4 uppercase border border-purple-600/30">
          {notice.audience}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-300 mb-3 leading-relaxed">{notice.content}</p>

      {/* Author Info */}
      <p className="text-sm text-gray-400 mb-4">
        Posted by:{" "}
        <span className="font-semibold text-gray-200">
          {notice.published_by_username}
        </span>
      </p>

      {/* Flyer Preview */}
      {fullFlyerUrl && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Flyer Image:</p>
          <img
            src={fullFlyerUrl}
            alt="Notice flyer"
            className="max-w-full h-auto rounded-lg border border-gray-700"
          />
        </div>
      )}

      {/* Document Attachment */}
      {fullDocumentUrl && (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-gray-400">
                {documentFileType === "pdf" ? "PDF" : "Document"} Attachment
              </p>
              <a
                href={fullDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 text-sm underline"
              >
                {notice.document?.split("/").pop()}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {(onApprove || onReject) && (
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-700">
          {onReject && (
            <button
              onClick={onReject}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Reject
            </button>
          )}
          {onApprove && (
            <button
              onClick={onApprove}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Approve
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Blog Preview Component
interface BlogPreviewProps {
  blog: {
    uid?: string;
    slug?: string;
    title: string;
    description: string;
    content: string;
    cover_image?: string;
    thumbnail?: string;
    author_username?: string;
    author?: string;
    created_at?: string;
    created?: string;
  };
  onApprove?: () => void;
  onReject?: () => void;
}

export const BlogPreview: React.FC<BlogPreviewProps> = ({
  blog,
  onApprove,
  onReject,
}) => {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const coverImage =
    blog.cover_image || blog.thumbnail || "/assets/placeholder.png";
  const fullCoverUrl = coverImage.startsWith("http")
    ? coverImage
    : `${base}${coverImage}`;
  const author = blog.author_username || blog.author || "Unknown";
  const created = blog.created_at || blog.created || "";

  return (
    <div className="bg-gray-900 border-4 border-transparent hover:border-[#5f20ff] rounded-lg p-6 flex flex-col">
      {/* Cover Image */}
      <div className="mb-4">
        <img
          src={fullCoverUrl}
          alt={blog.title}
          className="rounded-md w-full h-48 object-cover"
        />
      </div>

      {/* Blog Title */}
      <h2 className="text-white text-2xl font-semibold mb-2">{blog.title}</h2>

      {/* Metadata */}
      <div className="text-gray-400 text-sm mb-4">
        <p>
          <span className="font-semibold text-gray-300">Author:</span> {author}
        </p>
        {created && (
          <p>
            <span className="font-semibold text-gray-300">Published:</span>{" "}
            {new Date(created).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Blog Description */}
      <p className="text-gray-300 mb-4">{blog.description}</p>

      {/* Content Preview */}
      <div className="prose prose-invert prose-sm max-w-none mb-4 max-h-40 overflow-y-auto">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      {/* Actions */}
      {(onApprove || onReject) && (
        <div className="flex gap-4 mt-auto pt-4 border-t border-gray-700">
          {onReject && (
            <button
              onClick={onReject}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Reject
            </button>
          )}
          {onApprove && (
            <button
              onClick={onApprove}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Approve
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Project Preview Component
interface ProjectPreviewProps {
  project: {
    id?: string;
    title: string;
    description: string;
    image?: string;
    imageUrl?: string;
    repository_link?: string;
    live_link?: string;
    pageUrl?: string;
  };
  onApprove?: () => void;
  onReject?: () => void;
}

export const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  project,
  onApprove,
  onReject,
}) => {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const projectImage =
    project.image || project.imageUrl || "/assets/placeholder.png";
  const fullImageUrl = projectImage.startsWith("http")
    ? projectImage
    : projectImage.startsWith("/")
    ? projectImage
    : `${base}${projectImage}`;

  const liveLink = project.live_link || project.pageUrl;
  const repoLink = project.repository_link;

  return (
    <div className="max-w-sm mx-auto hover:border-blue-950 transition duration-500 border-black rounded-3xl overflow-hidden bg-black border-2 border-gray-800">
      {/* Project Image */}
      <img
        src={fullImageUrl}
        alt={project.title}
        className="w-full h-48 object-cover"
      />

      {/* Project Content */}
      <div className="p-4">
        <h2 className="text-lg text-white font-bold mb-2">{project.title}</h2>
        <p className="text-sm text-white mb-4">{project.description}</p>

        {/* Links */}
        <div className="flex flex-col gap-2 mb-4">
          {repoLink && (
            <a
              href={repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Repository
            </a>
          )}
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Live Demo
            </a>
          )}
        </div>

        {/* Actions */}
        {(onApprove || onReject) && (
          <div className="flex gap-4 pt-4 border-t border-gray-700">
            {onReject && (
              <button
                onClick={onReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Reject
              </button>
            )}
            {onApprove && (
              <button
                onClick={onApprove}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Approve
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Event Preview Component
interface EventPreviewProps {
  event: {
    id?: string;
    title: string;
    description: string;
    event_date?: string;
    location?: string;
    image?: string;
    organizer_username?: string;
  };
  onApprove?: () => void;
  onReject?: () => void;
}

export const EventPreview: React.FC<EventPreviewProps> = ({
  event,
  onApprove,
  onReject,
}) => {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const eventImage = event.image || "/assets/placeholder.png";
  const fullImageUrl = eventImage.startsWith("http")
    ? eventImage
    : `${base}${eventImage}`;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 shadow-md">
      {/* Event Image */}
      {eventImage && (
        <div className="mb-4">
          <img
            src={fullImageUrl}
            alt={event.title}
            className="rounded-lg w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Event Title */}
      <h2 className="text-2xl font-bold text-white mb-3">{event.title}</h2>

      {/* Event Details */}
      <div className="space-y-2 mb-4">
        {event.event_date && (
          <p className="text-gray-300 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-semibold">Date:</span>{" "}
            {formatDate(event.event_date)}
          </p>
        )}
        {event.location && (
          <p className="text-gray-300 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-semibold">Location:</span> {event.location}
          </p>
        )}
        {event.organizer_username && (
          <p className="text-gray-300 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-semibold">Organizer:</span>{" "}
            {event.organizer_username}
          </p>
        )}
      </div>

      {/* Event Description */}
      <p className="text-gray-300 mb-4 leading-relaxed">{event.description}</p>

      {/* Actions */}
      {(onApprove || onReject) && (
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-700">
          {onReject && (
            <button
              onClick={onReject}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Reject
            </button>
          )}
          {onApprove && (
            <button
              onClick={onApprove}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Approve
            </button>
          )}
        </div>
      )}
    </div>
  );
};
