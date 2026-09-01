// Web Push Notifications & Travel Alerts Utility

export interface TravelAlert {
  id: string;
  title: string;
  message: string;
  type: "booking" | "sunset" | "weather" | "promo";
  timestamp: string;
  read?: boolean;
}

export const DEFAULT_ALERTS: TravelAlert[] = [
  {
    id: "alert-sunset-today",
    title: "🌅 Aninag Hour in 45 Minutes!",
    message: "Golden hour coffee ritual begins at 5:15 PM on the Sunset Deck. Complimentary hot drip coffee & acoustic tunes await.",
    type: "sunset",
    timestamp: "Just now",
  },
  {
    id: "alert-weather-good",
    title: "☀️ Sipalay Sea Condition: Calm & Crystal Clear",
    message: "Perfect diving conditions today at Julian's WWII Wreck and Tinagong Dagat. High visibility up to 25 meters!",
    type: "weather",
    timestamp: "2 hours ago",
  },
  {
    id: "alert-promo-glow",
    title: "✨ Negrense Resident 15% Off",
    message: "Use promo code NEGRENSE15 on all weekday stays this month.",
    type: "promo",
    timestamp: "Yesterday",
  }
];

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    return false;
  }
  if (Notification.permission === "granted") {
    return true;
  }
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
}

export function sendPushNotification(title: string, body: string, icon = "/icon.png") {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon,
      });
    } catch (e) {
      console.log("Notification trigger notice:", e);
    }
  }
}
