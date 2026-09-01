import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { RoomsSection } from "./components/RoomsSection";
import { RoomDetailModal } from "./components/RoomDetailModal";
import { DiningSection } from "./components/DiningSection";
import { ActivitiesSection } from "./components/ActivitiesSection";
import { InteractiveMapSection } from "./components/InteractiveMapSection";
import { OffersSection } from "./components/OffersSection";
import { LoyaltyRewardsSection } from "./components/LoyaltyRewardsSection";
import { SocialFeedSection } from "./components/SocialFeedSection";
import { Footer } from "./components/Footer";
import { BookingModal } from "./components/BookingModal";
import { TravelerToolsHub } from "./components/TravelerToolsHub";
import { MyBookingsModal } from "./components/MyBookingsModal";
import { AuthModal } from "./components/AuthModal";
import { VirtualTourModal } from "./components/VirtualTourModal";
import { LiveChatWidget } from "./components/LiveChatWidget";

import { Room, Booking, Attraction, UserProfile, LoyaltyReward } from "./types";
import { LanguageCode } from "./utils/i18n";
import { CurrencyCode } from "./utils/currency";
import {
  getStoredBookings,
  saveStoredBookings,
  getStoredUser,
  saveStoredUser,
  getStoredItineraries,
  saveStoredItineraries,
} from "./utils/offlineSync";
import { requestNotificationPermission } from "./utils/notifications";

export default function App() {
  // Global Preferences
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>("PHP");

  // User Profile & Glow Points
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUser());
  const [userBookings, setUserBookings] = useState<Booking[]>(getStoredBookings());

  // Modals & Navigation State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [bookingParams, setBookingParams] = useState<{
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    category?: string;
  } | undefined>(undefined);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailRoom, setSelectedDetailRoom] = useState<Room | null>(null);

  const [isTravelerToolsOpen, setIsTravelerToolsOpen] = useState(false);
  const [travelerToolsTab, setTravelerToolsTab] = useState<string>("weather");

  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);

  // Saved Attractions for Itinerary
  const [savedAttractionIds, setSavedAttractionIds] = useState<string[]>([
    "julians-wreck",
    "tinagong-dagat",
  ]);

  // Request notifications on initial load
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Handlers for Booking Actions
  const handleOpenBooking = (room?: Room, params?: any) => {
    setBookingRoom(room || null);
    if (params) setBookingParams(params);
    setIsBookingOpen(true);
  };

  const handleOpenRoomDetail = (room: Room) => {
    setSelectedDetailRoom(room);
    setIsDetailModalOpen(true);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    const updated = [newBooking, ...userBookings];
    setUserBookings(updated);
    saveStoredBookings(updated);

    // Reward loyalty points
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        glowPoints: currentUser.glowPoints + 200,
        bookingsCount: currentUser.bookingsCount + 1,
      };
      setCurrentUser(updatedUser);
      saveStoredUser(updatedUser);
    }
  };

  const handleCancelBooking = (resNumber: string) => {
    const updated = userBookings.filter((b) => b.reservationNumber !== resNumber);
    setUserBookings(updated);
    saveStoredBookings(updated);
  };

  // Handlers for Traveler Tools
  const handleOpenToolsTab = (tab: string) => {
    setTravelerToolsTab(tab);
    setIsTravelerToolsOpen(true);
  };

  const handleAddToTrip = (attraction: Attraction) => {
    if (!savedAttractionIds.includes(attraction.id)) {
      const updatedIds = [...savedAttractionIds, attraction.id];
      setSavedAttractionIds(updatedIds);

      // Add to default itinerary
      const itins = getStoredItineraries();
      if (itins[0]) {
        itins[0].items.push({
          id: `it-${Date.now()}`,
          day: 2,
          time: "10:00 AM",
          title: attraction.name,
          location: attraction.name,
          notes: `Distance from resort: ${attraction.distanceFromResort}. ${attraction.tips}`,
          category: attraction.category as any,
        });
        saveStoredItineraries(itins);
      }
    }
    handleOpenToolsTab("itinerary");
  };

  const handleClaimOffer = (promoCode: string) => {
    handleOpenBooking(undefined, { promoCode });
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    saveStoredUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("alon_aninag_user");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2A26] font-sans selection:bg-[#C9A66B]/20 selection:text-[#1A3C40]">
      {/* Top Header Bar */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        onOpenBooking={() => handleOpenBooking()}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenTools={() => setIsTravelerToolsOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        bookingsCount={userBookings.length}
        currentUser={currentUser}
      />

      {/* Main Page Flow */}
      <main>
        {/* 1. Hero Section with Availability Search */}
        <HeroSection
          onOpenBooking={handleOpenBooking}
          onOpenVirtualTour={() => setIsVirtualTourOpen(true)}
          currentCurrency={currentCurrency}
        />

        {/* 2. Resort Philosophy & About */}
        <AboutSection />

        {/* 3. 12 Cozy Rooms & Villas Gallery */}
        <RoomsSection
          currentCurrency={currentCurrency}
          onSelectRoom={(room) => handleOpenBooking(room)}
          onViewRoomDetail={handleOpenRoomDetail}
        />

        {/* 4. Aninag Beachfront Bistro & Aninag Hour */}
        <DiningSection currentCurrency={currentCurrency} />

        {/* 5. Sipalay Adventures & Diving */}
        <ActivitiesSection
          onOpenBooking={() => handleOpenBooking()}
          onOpenMap={() => {
            const mapEl = document.getElementById("map");
            mapEl?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 6. Sipalay Interactive Map */}
        <InteractiveMapSection
          onAddToTrip={handleAddToTrip}
          savedAttractionIds={savedAttractionIds}
          onOpenTripPlanner={() => handleOpenToolsTab("itinerary")}
        />

        {/* 7. Special Promotions & Barkada Packages */}
        <OffersSection
          currentCurrency={currentCurrency}
          onClaimOffer={handleClaimOffer}
        />

        {/* 8. Alon Glow Club Rewards */}
        <LoyaltyRewardsSection
          userGlowPoints={currentUser?.glowPoints || 350}
          userName={currentUser?.name || "Guest"}
          onRedeemReward={(reward) => {
            if (currentUser) {
              const updatedUser = {
                ...currentUser,
                glowPoints: Math.max(0, currentUser.glowPoints - reward.pointsRequired),
              };
              setCurrentUser(updatedUser);
              saveStoredUser(updatedUser);
            }
          }}
        />

        {/* 9. Guest Polaroid Wall & Social Feed */}
        <SocialFeedSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenMap={() => {
          const mapEl = document.getElementById("map");
          mapEl?.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenTools={() => setIsTravelerToolsOpen(true)}
      />

      {/* Ate Sol Real-Time AI Concierge Chat Widget */}
      <LiveChatWidget />

      {/* --- ALL INTERACTIVE MODALS --- */}
      {/* 1. Dynamic Booking Engine */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialRoom={bookingRoom}
        initialParams={bookingParams}
        onBookingConfirmed={handleBookingConfirmed}
        currentCurrency={currentCurrency}
      />

      {/* 2. Room Detail Modal */}
      <RoomDetailModal
        room={selectedDetailRoom}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBookRoom={(room) => {
          setIsDetailModalOpen(false);
          handleOpenBooking(room);
        }}
        currentCurrency={currentCurrency}
      />

      {/* 3. Traveler Tools Suite */}
      <TravelerToolsHub
        isOpen={isTravelerToolsOpen}
        onClose={() => setIsTravelerToolsOpen(false)}
        initialTab={travelerToolsTab}
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* 4. My Bookings & Offline Pass Manager */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={userBookings}
        onCancelBooking={handleCancelBooking}
        currentCurrency={currentCurrency}
      />

      {/* 5. Member Sign In & Loyalty Profile */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* 6. 360° Interactive Virtual Tour */}
      <VirtualTourModal
        isOpen={isVirtualTourOpen}
        onClose={() => setIsVirtualTourOpen(false)}
      />
    </div>
  );
}
