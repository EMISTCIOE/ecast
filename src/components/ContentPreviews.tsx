import React from "react";
import Image from "next/image";

// Notice Preview Component
interface NoticePreviewProps {
  notice: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    audience: string;
    published_by_username: string;
    attachment?: string;
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

  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const fullAttachmentUrl = notice.attachment
    ? notice.attachment.startsWith("http")
      ? notice.attachment
      : `${base}${notice.attachment}`
    : null;

  const getFileType = (url: string | null): "pdf" | "image" | null => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith(".pdf")) return "pdf";
    if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return "image";
    return null;
  };

  const fileType = getFileType(fullAttachmentUrl);

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

      {/* Attachment Preview */}
      {fullAttachmentUrl && fileType === "image" && (
        <div className="mb-4">
          <img
            src={fullAttachmentUrl}
            alt="Notice attachment"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}

      {fullAttachmentUrl && fileType === "pdf" && (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <p className="text-gray-300">
            📄 PDF Attachment: {notice.attachment}
          </p>
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
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
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
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
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
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              🔗 Repository
            </a>
          )}
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 text-sm"
            >
              🌐 Live Demo
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
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
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
          <p className="text-gray-300">
            <span className="font-semibold">📅 Date:</span>{" "}
            {formatDate(event.event_date)}
          </p>
        )}
        {event.location && (
          <p className="text-gray-300">
            <span className="font-semibold">📍 Location:</span> {event.location}
          </p>
        )}
        {event.organizer_username && (
          <p className="text-gray-300">
            <span className="font-semibold">👤 Organizer:</span>{" "}
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
