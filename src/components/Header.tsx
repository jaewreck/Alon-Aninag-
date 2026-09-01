import React, { useState, useEffect } from "react";
import {
  Waves,
  Sun,
  Moon,
  Globe,
  DollarSign,
  Calendar,
  User,
  Compass,
  Bell,
  Menu as MenuIcon,
  X,
  Sparkles,
  Phone,
  CloudSun,
  ShieldCheck,
  Wifi,
  WifiOff,
  Flame,
  Search,
} from "lucide-react";
import { CurrencyCode, CURRENCY_CONFIGS } from "../utils/currency";
import { LanguageCode, SUPPORTED_LANGUAGES, TRANSLATIONS } from "../utils/i18n";
import { TravelAlert, DEFAULT_ALERTS } from "../utils/notifications";

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currentCurrency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  onOpenBooking: () => void;
  onOpenMyBookings: () => void;
  onOpenAuth: () => void;
  onOpenTools: (initialTab?: string) => void;
  onOpenVirtualTour: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  userGlowPoints?: number;
  userName?: string;
  isLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  currentCurrency,
  onCurrencyChange,
  onOpenBooking,
  onOpenMyBookings,
  onOpenAuth,
  onOpenTools,
  onOpenVirtualTour,
  activeSection,
  onNavigate,
  userGlowPoints = 350,
  userName = "Guest",
  isLoggedIn = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [alerts, setAlerts] = useState<TravelAlert[]>(DEFAULT_ALERTS);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const navLinks = [
    { id: "home", label: t.home },
    { id: "about", label: t.about },
    { id: "rooms", label: t.rooms },
    { id: "dining", label: t.dining },
    { id: "amenities", label: t.amenities },
    { id: "activities", label: t.activities },
    { id: "map", label: t.map },
    { id: "offers", label: t.offers },
    { id: "gallery", label: t.gallery },
    { id: "loyalty", label: t.loyalty },
    { id: "contact", label: t.contact },
  ];

  return (
    <>
      {/* Top Utility Ribbon */}
      <div className="bg-[#1A3C40] text-[#E5E1D8] text-xs py-2 px-4 border-b border-[#254F54] relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Slogan & Location */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[#C9A66B] font-semibold tracking-[0.15em] uppercase text-[11px]">
              <Flame className="w-3.5 h-3.5 text-[#C9A66B] animate-pulse" />
              Aninag Hour: 5:15 PM Daily
            </span>
            <span className="hidden sm:inline text-[#3D6B70]">|</span>
            <span className="hidden sm:inline text-[#D5DCD8] font-light text-[11px] tracking-wide">
              Poblacion Beach, Sipalay City, Negros Occidental
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#132E31] text-[#E5D2AD] text-[10px] border border-[#254F54]">
              ✨ Free Brewed Negrense Coffee at Sunset
            </span>
          </div>

          {/* Quick Tools, Lang, Currency & Status */}
          <div className="flex items-center gap-4">
            {/* Online/Offline status indicator */}
            <button
              onClick={() => onOpenTools("offline")}
              title={isOnline ? "Connected to Cloud" : "Offline mode active"}
              className="flex items-center gap-1 text-[11px] hover:text-[#C9A66B] transition-colors"
            >
              {isOnline ? (
                <span className="flex items-center gap-1 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <Wifi className="w-3 h-3" />
                  <span className="hidden lg:inline text-[10px] uppercase tracking-wider font-semibold">Synced</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-300 font-medium text-[10px] uppercase tracking-wider">
                  <WifiOff className="w-3 h-3" />
                  <span>Offline Ready</span>
                </span>
              )}
            </button>

            {/* Weather shortcut */}
            <button
              onClick={() => onOpenTools("weather")}
              className="flex items-center gap-1 text-[11px] text-[#E5E1D8] hover:text-[#C9A66B] transition-colors"
              title="View Sipalay Marine & Weather Forecast"
            >
              <CloudSun className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span className="text-[11px] tracking-wide">Sipalay 29°C</span>
            </button>

            {/* Currency Selector */}
            <div className="relative inline-flex items-center">
              <select
                aria-label="Select Currency"
                value={currentCurrency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="bg-[#132E31] text-[#E5D2AD] rounded-full px-2.5 py-0.5 text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-[#C9A66B] border border-[#254F54] cursor-pointer"
              >
                {Object.values(CURRENCY_CONFIGS).map((curr) => (
                  <option key={curr.code} value={curr.code} className="bg-[#1A3C40] text-white">
                    {curr.symbol} {curr.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selector */}
            <div className="relative inline-flex items-center">
              <select
                aria-label="Select Language"
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="bg-[#132E31] text-[#E5D2AD] rounded-full px-2.5 py-0.5 text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-[#C9A66B] border border-[#254F54] cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#1A3C40] text-white">
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Push Notifications Bell */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => setAlertsOpen(!alertsOpen)}
                className="relative p-1 rounded-full hover:bg-[#132E31] text-[#E5E1D8] hover:text-[#C9A66B] transition-colors"
                title="Booking Updates & Travel Alerts"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#C9A66B] rounded-full"></span>
              </button>

              {alertsOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white text-[#2D2A26] rounded-2xl shadow-2xl border border-[#E5E1D8] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E1D8] mb-2.5">
                    <span className="font-serif font-bold text-xs text-[#1A3C40] uppercase tracking-[0.15em] flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-[#C9A66B]" />
                      Sipalay Travel Alerts
                    </span>
                    <button
                      onClick={() => setAlertsOpen(false)}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E5E1D8] hover:bg-[#F5F2ED] transition-colors"
                      >
                        <p className="font-semibold text-[#1A3C40] text-xs">{alert.title}</p>
                        <p className="text-[11px] text-[#5A5A5A] mt-0.5 leading-relaxed">{alert.message}</p>
                        <span className="text-[10px] text-[#8C827A] mt-1 block">{alert.timestamp}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setAlertsOpen(false);
                      onOpenTools("weather");
                    }}
                    className="w-full mt-3 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-[#1A3C40] bg-[#F5F2ED] hover:bg-[#EAE5DC] border border-[#E5E1D8] rounded-xl transition-colors"
                  >
                    View Live Tides &amp; Radar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3 border-b border-[#E5E1D8]"
            : "bg-[#FDFBF7]/95 backdrop-blur-sm py-4 border-b border-[#E5E1D8]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo & Slogan */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#1A3C40] flex items-center justify-center text-white shadow-md shadow-[#1A3C40]/20 group-hover:scale-105 transition-transform">
              <Waves className="w-5 h-5 text-[#C9A66B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1A3C40]">
                  ALON <span className="italic font-light text-[#C9A66B]">ANINAG</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#C9A66B] bg-[#F5F2ED] px-2 py-0.5 rounded-full border border-[#E5E1D8]">
                  Sipalay
                </span>
              </div>
              <p className="text-[10px] text-[#5A5A5A] uppercase tracking-[0.2em] font-semibold hidden sm:block">
                Boutique Beach Resort
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`text-[11px] uppercase tracking-[0.18em] font-semibold transition-all pb-0.5 ${
                  activeSection === link.id
                    ? "text-[#1A3C40] border-b-2 border-[#1A3C40] font-bold"
                    : "text-[#5A5A5A] hover:text-[#1A3C40]"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Traveler Tools Hub Trigger */}
            <button
              onClick={() => onOpenTools()}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1A3C40] bg-[#F5F2ED] hover:bg-[#EAE5DC] border border-[#E5E1D8] transition-colors"
              title="Weather, Currency Converter, Translator & Trip Planner"
            >
              <Compass className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span className="text-[11px] uppercase tracking-wider">{t.travelTools}</span>
            </button>

            {/* Virtual 360 Tour Trigger */}
            <button
              onClick={onOpenVirtualTour}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#1A3C40] bg-white hover:bg-[#F5F2ED] border border-[#E5E1D8] transition-colors"
              title="Virtual Tour of Sipalay Resort"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span className="text-[11px] uppercase tracking-wider">360° Tour</span>
            </button>

            {/* My Booking button */}
            <button
              onClick={onOpenMyBookings}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#5A5A5A] hover:text-[#1A3C40] hover:bg-[#F5F2ED] transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#1A3C40]" />
              <span className="text-[11px] uppercase tracking-wider">{t.myBooking}</span>
            </button>

            {/* Sign In / Profile Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F5F2ED] text-[#1A3C40] hover:bg-[#EAE5DC] border border-[#E5E1D8] transition-colors"
              title={isLoggedIn ? `Logged in as ${userName}` : "Sign In / Register"}
            >
              <User className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span className="text-[11px] uppercase tracking-wider hidden md:inline">{isLoggedIn ? userName : "Log In"}</span>
              {isLoggedIn && (
                <span className="text-[10px] bg-[#C9A66B] text-white px-1.5 py-0.2 rounded-full font-bold">
                  {userGlowPoints} pts
                </span>
              )}
            </button>

            {/* Primary Book Now CTA */}
            <button
              id="header-book-now-btn"
              onClick={onOpenBooking}
              className="bg-[#1A3C40] hover:bg-[#132E31] text-white px-5 sm:px-6 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold shadow-lg shadow-[#1A3C40]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>{t.bookNow}</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-[#1A3C40] hover:bg-[#F5F2ED] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#FDFBF7] border-t border-[#E5E1D8] px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-4">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#E5E1D8]">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-xl text-[11px] uppercase tracking-wider font-semibold transition-colors ${
                    activeSection === link.id
                      ? "bg-[#1A3C40] text-white font-bold"
                      : "text-[#5A5A5A] hover:bg-[#F5F2ED]"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenTools();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#F5F2ED] text-[#1A3C40] border border-[#E5E1D8]"
              >
                <span className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-[#C9A66B]" />
                  {t.travelTools}
                </span>
                <span className="text-[9px] uppercase tracking-widest bg-[#1A3C40] text-white px-2.5 py-0.5 rounded-full font-bold">
                  Suite
                </span>
              </button>

              <button
                onClick={() => {
                  onOpenVirtualTour();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-[#1A3C40] border border-[#E5E1D8]"
              >
                <Sparkles className="w-4 h-4 text-[#C9A66B]" />
                <span className="text-[11px] uppercase tracking-wider">360° Virtual Resort Tour</span>
              </button>

              <button
                onClick={() => {
                  onOpenMyBookings();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#E5E1D8] text-[#5A5A5A] hover:text-[#1A3C40]"
              >
                <Calendar className="w-4 h-4 text-[#1A3C40]" />
                <span className="text-[11px] uppercase tracking-wider">{t.myBooking}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
