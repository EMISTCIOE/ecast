/**
 * Cookie utility functions for popup tracking
 * Separate from auth cookies to avoid conflicts
 */

const POPUP_COOKIE_NAME = "ecast_popup_seen";
const COOKIE_EXPIRY_HOURS = 8;

/**
 * Set a cookie to track when popup was last shown
 * @param itemId - The ID of the notice or event shown
 * @param itemType - Type: 'notice' or 'event'
 */
export function setPopupCookie(
  itemId: string,
  itemType: "notice" | "event"
): void {
  const expiryDate = new Date();
  expiryDate.setTime(
    expiryDate.getTime() + COOKIE_EXPIRY_HOURS * 60 * 60 * 1000
  );

  const cookieValue = JSON.stringify({
    id: itemId,
    type: itemType,
    timestamp: Date.now(),
  });

  document.cookie = `${POPUP_COOKIE_NAME}=${encodeURIComponent(
    cookieValue
  )}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Check if a popup was already shown
 * @returns Object containing the last shown popup info, or null
 */
export function getPopupCookie(): {
  id: string;
  type: "notice" | "event";
  timestamp: number;
} | null {
  const cookies = document.cookie.split(";");
  const popupCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${POPUP_COOKIE_NAME}=`)
  );

  if (!popupCookie) return null;

  try {
    const cookieValue = decodeURIComponent(popupCookie.split("=")[1]);
    return JSON.parse(cookieValue);
  } catch {
    return null;
  }
}

/**
 * Check if we should show a popup
 * @param itemId - The ID of the current item to potentially show
 * @param itemType - Type: 'notice' or 'event'
 * @returns boolean - true if popup should be shown
 */
export function shouldShowPopup(
  itemId: string,
  itemType: "notice" | "event"
): boolean {
  const lastPopup = getPopupCookie();

  // If no cookie exists, show the popup
  if (!lastPopup) return true;

  // If same item was shown, don't show again
  if (lastPopup.id === itemId && lastPopup.type === itemType) {
    return false;
  }

  // If 8 hours haven't passed, don't show a different popup
  const hoursSinceLastPopup =
    (Date.now() - lastPopup.timestamp) / (1000 * 60 * 60);
  if (hoursSinceLastPopup < COOKIE_EXPIRY_HOURS) {
    return false;
  }

  // 8 hours have passed, can show new popup
  return true;
}

/**
 * Clear the popup cookie (useful for testing)
 */
export function clearPopupCookie(): void {
  document.cookie = `${POPUP_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
