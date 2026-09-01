import { Booking, TripItinerary, UserProfile } from "../types";

const STORAGE_KEYS = {
  BOOKINGS: "alon_aninag_bookings_v1",
  ITINERARIES: "alon_aninag_itineraries_v1",
  SAVED_ATTRACTIONS: "alon_aninag_saved_attractions_v1",
  GLOW_POINTS: "alon_aninag_glow_points_v1",
  USER_PROFILE: "alon_aninag_user_profile_v1",
  ACTIVE_LANGUAGE: "alon_aninag_lang_v1",
  ACTIVE_CURRENCY: "alon_aninag_currency_v1",
};

export const DEFAULT_INITIAL_ITINERARY: TripItinerary = {
  id: "sipalay-3d2n-glow",
  title: "Soulful Sipalay 3D2N Sunset & Dive Escape",
  dates: "Upcoming Trip",
  collaborators: ["You (Host)", "Barkada / Partner"],
  items: [
    {
      id: "it-1",
      day: 1,
      time: "02:00 PM",
      title: "Check-in at Alon & Aninag",
      location: "Poblacion Beach Front Desk",
      notes: "Welcome calamansi drink, settle in Sunset Balcony Villa, unpack beach gear.",
      category: "Relaxation",
    },
    {
      id: "it-2",
      day: 1,
      time: "05:15 PM",
      title: "Aninag Hour Golden Sunset Coffee",
      location: "Resort Sunset Deck",
      notes: "Complimentary Negrense brewed coffee, golden hour photos, lantern lighting.",
      category: "Sunset",
    },
    {
      id: "it-3",
      day: 1,
      time: "07:30 PM",
      title: "Negrense Inasal & Bonfire Night",
      location: "Beachfront Bistro & Bonfire Pit",
      notes: "Smoky Chicken Inasal dinner, acoustic songs & roasted marshmallows by the sea.",
      category: "Dining",
    },
    {
      id: "it-4",
      day: 2,
      time: "08:00 AM",
      title: "Island Hopping: Tinagong Dagat & Perth Paradise",
      location: "Poblacion Beach Boat Jump-off",
      notes: "Winding bamboo bridges, islet lagoons, and breathtaking hilltop viewpoint.",
      category: "Activity",
    },
    {
      id: "it-5",
      day: 2,
      time: "01:30 PM",
      title: "Julian's WWII Wreck Snorkel & Dive",
      location: "Campomanes Bay Reef",
      notes: "Coral-encrusted historic shipwreck, sea turtles, and vibrant marine life.",
      category: "Activity",
    },
    {
      id: "it-6",
      day: 2,
      time: "06:00 PM",
      title: "Candlelit Seafood Kinilaw Dinner",
      location: "Beachfront Sands",
      notes: "Fresh yellowfin tuna kinilaw, Don Papa rum cocktails under the stars.",
      category: "Dining",
    },
    {
      id: "it-7",
      day: 3,
      time: "07:00 AM",
      title: "Sunrise Swim & Pamahaw Silog Breakfast",
      location: "Poblacion Beach",
      notes: "Crispy danggit, garlicky longganisa, peaceful morning swim before 12 PM checkout.",
      category: "Relaxation",
    },
  ],
};

export function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredBookings(bookings: Booking[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error("Failed to save bookings locally", e);
  }
}

export function getStoredItineraries(): TripItinerary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITINERARIES);
    return raw ? JSON.parse(raw) : [DEFAULT_INITIAL_ITINERARY];
  } catch {
    return [DEFAULT_INITIAL_ITINERARY];
  }
}

export function saveStoredItineraries(itineraries: TripItinerary[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ITINERARIES, JSON.stringify(itineraries));
  } catch (e) {
    console.error("Failed to save itineraries", e);
  }
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save user profile", e);
  }
}

export function generateSyncPayload(): string {
  const payload = {
    version: 1,
    exportDate: new Date().toISOString(),
    bookings: getStoredBookings(),
    itineraries: getStoredItineraries(),
    glowPoints: Number(localStorage.getItem(STORAGE_KEYS.GLOW_POINTS) || 350),
    savedAttractions: JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_ATTRACTIONS) || "[]"),
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

export function restoreSyncPayload(syncCode: string): boolean {
  try {
    const jsonString = decodeURIComponent(escape(atob(syncCode.trim())));
    const data = JSON.parse(jsonString);
    if (data.bookings) saveStoredBookings(data.bookings);
    if (data.itineraries) saveStoredItineraries(data.itineraries);
    if (data.glowPoints !== undefined) {
      localStorage.setItem(STORAGE_KEYS.GLOW_POINTS, String(data.glowPoints));
    }
    if (data.savedAttractions) {
      localStorage.setItem(STORAGE_KEYS.SAVED_ATTRACTIONS, JSON.stringify(data.savedAttractions));
    }
    return true;
  } catch (e) {
    console.error("Sync restore error:", e);
    return false;
  }
}
