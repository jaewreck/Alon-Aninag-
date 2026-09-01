export interface Room {
  id: string;
  name: string;
  category: "Villa" | "Suite" | "Deluxe" | "Barkada Loft";
  pricePerNight: number;
  capacity: {
    adults: number;
    children: number;
  };
  size: string; // e.g. "38 sqm"
  bed: string; // e.g. "1 King Bed + 1 Daybed"
  view: "Direct Ocean Sunset View" | "Seaview & Sunset Deck" | "Garden & Ocean Breeze" | "Beachfront Panorama";
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  amenities: string[];
  featured?: boolean;
}

export interface BookingAddon {
  id: string;
  name: string;
  price: number;
  category: "Transport" | "Dining" | "Experience" | "Wellness";
  description: string;
  icon: string;
}

export interface Booking {
  reservationNumber: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: {
    adults: number;
    children: number;
  };
  addons: {
    addonId: string;
    name: string;
    price: number;
  }[];
  pricing: {
    baseRate: number;
    roomTotal: number;
    addonsTotal: number;
    discountAmount: number;
    promoCodeApplied?: string;
    taxesAndService: number; // 12% VAT + 3% Local Service Fee
    totalAmount: number;
  };
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    specialRequests?: string;
  };
  payment: {
    method: "GCash" | "Maya" | "Credit/Debit Card" | "QR PH" | "Bank Transfer" | "Pay at Check-In";
    status: "Confirmed" | "Pending Verification" | "Paid Online";
    transactionId: string;
    timestamp: string;
  };
  status: "Confirmed" | "Checked-In" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface Attraction {
  id: string;
  name: string;
  category: "Diving" | "Scenic Viewpoint" | "Beach" | "Island" | "Eco-Tourism";
  distanceFromResort: string; // e.g. "15 mins by boat"
  duration: string;
  description: string;
  image: string;
  coordinates: { x: number; y: number }; // Relative coordinates on custom Sipalay Map
  bestTimeToVisit: string;
  highlights: string[];
  tips: string;
}

export interface MenuItem {
  id: string;
  name: string;
  localName?: string;
  category: "Breakfast" | "Lunch & Dinner" | "Negrense Specialties" | "Sunset Cocktails & Beverages" | "Desserts & Coffee";
  price: number;
  description: string;
  image: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isSignature?: boolean;
}

export interface SocialPost {
  id: string;
  author: string;
  location: string;
  date: string;
  likes: number;
  avatar: string;
  image: string;
  caption: string;
  tag: string;
  userLiked?: boolean;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsRequired: number;
  description: string;
  category: "Food & Beverage" | "Room Upgrade" | "Activity" | "Discount";
  code: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  memberTier?: string;
  loyaltyTier?: "Bronze Wave" | "Silver Twilight" | "Golden Aninag" | "Platinum Luminary";
  glowPoints: number;
  bookingsCount: number;
  savedAttractions?: string[];
  bookings?: Booking[];
}

export interface TripPlanItem {
  id: string;
  day: number;
  time: string;
  title: string;
  location: string;
  notes: string;
  category: "Activity" | "Dining" | "Relaxation" | "Sunset";
}

export interface TripItinerary {
  id: string;
  title: string;
  dates: string;
  collaborators: string[];
  items: TripPlanItem[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
