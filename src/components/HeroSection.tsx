import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  BedDouble,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  Flame,
  Coffee,
  Compass,
  MapPin,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { HERO_RESORT_IMAGE, RESORT_DETAILS } from "../data/resortData";
import { CurrencyCode, formatPrice } from "../utils/currency";
import { LanguageCode, TRANSLATIONS } from "../utils/i18n";

interface HeroSectionProps {
  currentLanguage: LanguageCode;
  currentCurrency: CurrencyCode;
  onOpenBookingWithParams: (params: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    category?: string;
  }) => void;
  onExploreRooms: () => void;
  onExploreActivities: () => void;
  onOpenVirtualTour: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLanguage,
  currentCurrency,
  onOpenBookingWithParams,
  onExploreRooms,
  onExploreActivities,
  onOpenVirtualTour,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Initial reservation parameters
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 2);

  const [checkInDate, setCheckInDate] = useState(today.toISOString().split("T")[0]);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow.toISOString().split("T")[0]);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [roomCategory, setRoomCategory] = useState("all");

  // Web Audio ocean waves ambient sound
  const [isMuted, setIsMuted] = useState(true);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const toggleOceanAmbiance = () => {
    if (isMuted) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Generate soft pink noise filter simulating rhythmic sea waves
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 0.15;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 350;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.08;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start(0);
        setAudioContext(ctx);
        setIsMuted(false);
      } catch (e) {
        setIsMuted(true);
      }
    } else {
      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
      }
      setIsMuted(true);
    }
  };

  const handleSearchAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBookingWithParams({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults,
      children: childrenCount,
      category: roomCategory !== "all" ? roomCategory : undefined,
    });
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#1A3C40]">
      {/* Hero Realistic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_RESORT_IMAGE}
          alt="Alon & Aninag Boutique Beach Resort Sipalay City at Sunset"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out opacity-85"
          referrerPolicy="no-referrer"
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C40] via-[#1A3C40]/50 to-[#1A3C40]/25"></div>
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#1A3C40]/20 to-[#1A3C40]/80"></div>
      </div>

      {/* Ambiance Audio Toggle & Floating Badges */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium uppercase tracking-wider">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span>29°C Sunny • Poblacion Beach, Sipalay</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleOceanAmbiance}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs hover:bg-white/25 transition-colors cursor-pointer"
            title="Toggle calming ocean waves background audio"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white/70" /> : <Volume2 className="w-3.5 h-3.5 text-[#C9A66B] animate-pulse" />}
            <span className="hidden sm:inline font-medium uppercase tracking-wider text-[10px]">{isMuted ? "Sound: Off" : "Ocean Waves: On"}</span>
          </button>
        </div>
      </div>

      {/* Main Hero Story & Headlines */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center text-white flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#E5D2AD] text-[11px] font-semibold uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
          <span>Boutique Beach Sanctuary • 12 Exclusive Rooms</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white leading-[0.9] drop-shadow-md">
          Paradise<br /><span className="italic font-light text-[#E5D2AD]">Awaits You</span>
        </h1>

        <p className="font-serif italic text-xl sm:text-2xl text-[#E5E1D8] mt-4 font-normal tracking-wide drop-shadow-sm">
          “{t.tagline}”
        </p>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/85 mt-4 leading-relaxed font-light drop-shadow">
          Experience the hidden gems of Sipalay City. A boutique sanctuary at Poblacion Beach, where quiet luxury meets the rhythmic soul of the ocean.
        </p>

        {/* Room Price Highlights Glass Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 w-full max-w-3xl">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex flex-col justify-between text-left">
            <span className="text-[10px] uppercase text-white/70 tracking-widest font-semibold">Sunset Villa</span>
            <span className="text-white font-serif italic text-sm sm:text-base mt-1">From {formatPrice(3500, currentCurrency)}/nt</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex flex-col justify-between text-left">
            <span className="text-[10px] uppercase text-white/70 tracking-widest font-semibold">Seaview Suite</span>
            <span className="text-white font-serif italic text-sm sm:text-base mt-1">From {formatPrice(2800, currentCurrency)}/nt</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex flex-col justify-between text-left">
            <span className="text-[10px] uppercase text-white/70 tracking-widest font-semibold">Barkada Loft</span>
            <span className="text-white font-serif italic text-sm sm:text-base mt-1">From {formatPrice(4200, currentCurrency)}/nt</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex flex-col justify-between text-left">
            <span className="text-[10px] uppercase text-white/70 tracking-widest font-semibold">Cozy Nook</span>
            <span className="text-white font-serif italic text-sm sm:text-base mt-1">From {formatPrice(1800, currentCurrency)}/nt</span>
          </div>
        </div>

        {/* Action Button Group */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={onExploreRooms}
            className="bg-[#C9A66B] hover:bg-[#B89355] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl shadow-black/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            Explore 12 Rooms
          </button>
          <button
            onClick={onOpenVirtualTour}
            className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md transition-all cursor-pointer"
          >
            Take 360° Virtual Tour
          </button>
        </div>
      </div>

      {/* Floating Interactive Availability & Reservation Bar */}
      <div className="relative z-20 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-7 border border-[#E5E1D8]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E1D8]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#1A3C40] flex items-center justify-center text-white">
                <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
              </div>
              <span className="font-serif font-bold text-base text-[#1A3C40]">
                Check Availability &amp; Reserve Directly
              </span>
            </div>
            <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#C9A66B] hidden md:inline">
              ✨ Direct Booking Perks &amp; Welcome Drink Included
            </span>
          </div>

          <form onSubmit={handleSearchAvailability} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Check-In */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A5A5A] mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#1A3C40]" />
                {t.checkIn}
              </label>
              <input
                type="date"
                value={checkInDate}
                min={today.toISOString().split("T")[0]}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-[#1A3C40] focus:outline-none focus:ring-2 focus:ring-[#1A3C40]"
                required
              />
            </div>

            {/* Check-Out */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A5A5A] mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#1A3C40]" />
                {t.checkOut}
              </label>
              <input
                type="date"
                value={checkOutDate}
                min={checkInDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-[#1A3C40] focus:outline-none focus:ring-2 focus:ring-[#1A3C40]"
                required
              />
            </div>

            {/* Guests (Adults & Children) */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A5A5A] mb-1.5 flex items-center gap-1">
                <Users className="w-3 h-3 text-[#1A3C40]" />
                {t.guests}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  aria-label="Number of Adults"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3 py-2.5 text-xs font-semibold text-[#1A3C40] focus:outline-none focus:ring-2 focus:ring-[#1A3C40]"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4 Adults</option>
                  <option value={5}>5+ Barkada</option>
                </select>
                <select
                  aria-label="Number of Children"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3 py-2.5 text-xs font-semibold text-[#1A3C40] focus:outline-none focus:ring-2 focus:ring-[#1A3C40]"
                >
                  <option value={0}>0 Kids</option>
                  <option value={1}>1 Child</option>
                  <option value={2}>2 Kids</option>
                  <option value={3}>3 Kids</option>
                </select>
              </div>
            </div>

            {/* Accommodation Category */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A5A5A] mb-1.5 flex items-center gap-1">
                <BedDouble className="w-3 h-3 text-[#1A3C40]" />
                Room Type
              </label>
              <select
                aria-label="Room Type"
                value={roomCategory}
                onChange={(e) => setRoomCategory(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-[#1A3C40] focus:outline-none focus:ring-2 focus:ring-[#1A3C40]"
              >
                <option value="all">All 12 Rooms &amp; Villas</option>
                <option value="Villa">Sunset Balcony Villas</option>
                <option value="Suite">Horizon Seaview Suites</option>
                <option value="Barkada Loft">Barkada &amp; Family Lofts</option>
                <option value="Deluxe">Wavefront Deluxe Rooms</option>
              </select>
            </div>

            {/* Submit CTA */}
            <div className="flex items-end">
              <button
                type="submit"
                id="hero-check-availability-submit"
                className="w-full py-3 px-5 rounded-2xl font-bold text-xs uppercase tracking-widest text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-lg shadow-[#1A3C40]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#C9A66B]" />
                <span>{t.checkAvailability}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
