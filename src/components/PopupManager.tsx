import { useEffect, useState } from "react";
import { PopupModal } from "@/components/PopupModal";
import { Event, Notice } from "@/types/index";
import { shouldShowPopup, setPopupCookie } from "@/lib/popupCookies";

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface PopupData {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  type: "notice" | "event";
}

/**
 * Check if an image URL is valid (not null/undefined and is an actual image)
 */
function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  // Check if it's a valid image extension
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
}

/**
 * Calculate days since creation
 */
function getDaysSinceCreation(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Fetch pinned notices with image flyers that are less than 5 days old
 */
async function fetchPinnedNotices(): Promise<Notice[]> {
  try {
    const response = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}/api/notice/notices/?status=APPROVED&pinned=true`
    );
    if (!response.ok) return [];

    const notices: Notice[] = await response.json();

    // Filter notices: must have image flyer and be less than 5 days old
    return notices.filter((notice) => {
      if (!isValidImageUrl(notice.flyer) || !notice.created_at) return false;
      const daysSince = getDaysSinceCreation(notice.created_at);
      return daysSince <= 5;
    });
  } catch (error) {
    console.error("Error fetching pinned notices:", error);
    return [];
  }
}

/**
 * Fetch approved events
 */
async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}/api/event/events/?status=APPROVED`
    );
    if (!response.ok) return [];

    const events: Event[] = await response.json();
    return events.filter((event) => isValidImageUrl(event.image));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

/**
 * Prioritization Logic:
 * 1. If both upcoming AND ongoing events exist -> random between the two (ignore notices)
 * 2. If only ongoing event exists -> show ongoing event
 * 3. If upcoming exists AND pinned notice < 5 days exists -> show upcoming event
 * 4. If only upcoming event exists -> show upcoming event
 * 5. If only pinned notice < 5 days exists -> show notice
 * 6. Otherwise -> show nothing
 */
async function determinePopupContent(): Promise<PopupData | null> {
  const [notices, events] = await Promise.all([
    fetchPinnedNotices(),
    fetchEvents(),
  ]);

  // Categorize events
  const ongoingEvents = events.filter((e) => e.event_status === "running");
  const upcomingEvents = events.filter((e) => e.event_status === "upcoming");

  // Priority 1: Both upcoming AND ongoing events exist -> random between them (regardless of notices)
  if (upcomingEvents.length > 0 && ongoingEvents.length > 0) {
    const allEvents = [...upcomingEvents, ...ongoingEvents];
    const event = allEvents[Math.floor(Math.random() * allEvents.length)];
    return {
      id: String(event.id),
      title: event.title,
      imageUrl: event.image!,
      description: event.description,
      type: "event",
    };
  }

  // Priority 2: Ongoing event only (no upcoming)
  if (ongoingEvents.length > 0) {
    const event = ongoingEvents[0];
    return {
      id: String(event.id),
      title: event.title,
      imageUrl: event.image!,
      description: event.description,
      type: "event",
    };
  }

  // Priority 3 & 4: If upcoming exists (with or without pinned notice) -> show upcoming event
  if (upcomingEvents.length > 0) {
    const event =
      upcomingEvents[Math.floor(Math.random() * upcomingEvents.length)];
    return {
      id: String(event.id),
      title: event.title,
      imageUrl: event.image!,
      description: event.description,
      type: "event",
    };
  }

  // Priority 5: Only pinned notice < 5 days exists (no events at all)
  if (notices.length > 0) {
    const notice = notices[0];
    return {
      id: String(notice.id),
      title: notice.title,
      imageUrl: notice.flyer!,
      description: notice.content,
      type: "notice",
    };
  }

  // No popup to show
  return null;
}

/**
 * PopupManager Component
 * Handles fetching, prioritization, and display of popups
 */
export const PopupManager: React.FC = () => {
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePopup = async () => {
      try {
        const content = await determinePopupContent();

        if (content && shouldShowPopup(content.id, content.type)) {
          setPopupData(content);
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error initializing popup:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure page has loaded
    const timer = setTimeout(initializePopup, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClosePopup = () => {
    if (popupData) {
      setPopupCookie(popupData.id, popupData.type);
    }
    setShowPopup(false);
    setPopupData(null);
  };

  // Show loading indicator while fetching
  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white rounded-full shadow-lg p-3 animate-pulse">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!showPopup || !popupData) return null;

  return (
    <PopupModal
      imageUrl={popupData.imageUrl}
      title={popupData.title}
      description={popupData.description}
      type={popupData.type}
      onClose={handleClosePopup}
    />
  );
};
