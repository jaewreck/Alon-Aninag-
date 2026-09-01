import React, { useState } from "react";
import {
  MapPin,
  Compass,
  Navigation,
  Anchor,
  Eye,
  Camera,
  Share2,
  Bookmark,
  Check,
  Sparkles,
  Info,
  Clock,
  Car,
  ChevronRight,
} from "lucide-react";
import { ATTRACT_POINTS, HERO_RESORT_IMAGE } from "../data/resortData";
import { Attraction } from "../types";

interface InteractiveMapSectionProps {
  onAddToTrip: (attraction: Attraction) => void;
  savedAttractionIds?: string[];
  onOpenTripPlanner: () => void;
}

export const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({
  onAddToTrip,
  savedAttractionIds = [],
  onOpenTripPlanner,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeAttraction, setActiveAttraction] = useState<Attraction>(ATTRACT_POINTS[0]);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = [
    { id: "all", label: "All Spots" },
    { id: "Diving", label: "🤿 Scuba & Wrecks" },
    { id: "Scenic Viewpoint", label: "📸 Karst Viewpoints" },
    { id: "Beach", label: "🏖️ White Beaches" },
    { id: "Eco-Tourism", label: "🌿 Marine Reserves" },
  ];

  const filteredSpots =
    selectedCategory === "all"
      ? ATTRACT_POINTS
      : ATTRACT_POINTS.filter((spot) => spot.category === selectedCategory);

  const handleShareRoute = () => {
    navigator.clipboard?.writeText(window.location.origin + "#map");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section id="map" className="py-24 bg-[#FDFBF7] border-b border-[#E5E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F2ED] text-[#1A3C40] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 border border-[#E5E1D8]">
              <Compass className="w-3.5 h-3.5 text-[#C9A66B]" />
              Sipalay Island &amp; Dive Map
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3C40] tracking-tight">
              Explore Sipalay’s <span className="italic font-light text-[#C9A66B]">Hidden Gems</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A] mt-3 max-w-2xl leading-relaxed font-light">
              From our beachfront at Poblacion Beach to the emerald karst maze of Tinagong Dagat, Perth Paradise, and Julian’s WWII coral shipwreck.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleShareRoute}
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A3C40] bg-white hover:bg-[#F5F2ED] border border-[#E5E1D8] shadow-sm transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>{copiedLink ? "Route Link Copied!" : "Share Route"}</span>
            </button>
            <button
              onClick={onOpenTripPlanner}
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-lg shadow-[#1A3C40]/25 transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Trip Planner</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-[#E5E1D8]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#1A3C40] text-white shadow-md shadow-[#1A3C40]/25"
                  : "bg-white text-[#5A5A5A] hover:text-[#1A3C40] hover:bg-[#F5F2ED] border border-[#E5E1D8]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Map Canvas + Spot Detail Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Visual Stage (Left - 7 cols) */}
          <div className="lg:col-span-7 bg-[#F5F2ED] rounded-3xl p-4 sm:p-6 border border-[#E5E1D8] shadow-sm relative overflow-hidden">
            {/* Map Header bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8] mb-3 text-xs text-[#1A3C40]">
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-[#C9A66B]" />
                <span className="font-bold tracking-wide uppercase text-[11px]">Interactive Sipalay Coastal &amp; Marine Map</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-white px-3 py-1 rounded-full border border-[#E5E1D8] text-[#5A5A5A]">
                Click pins to inspect
              </span>
            </div>

            {/* Custom Styled Sipalay Geographic SVG Representation */}
            <div className="relative aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-[#EAE5DC] via-[#F2EDE4] to-[#E5DFC5] border border-[#DDD5C5] overflow-hidden shadow-inner flex items-center justify-center">
              {/* Coastline vector shape */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
                preserveAspectRatio="none"
              >
                {/* Land masses (Sipalay shoreline & hills) */}
                <path
                  d="M 50,0 Q 65,25 70,50 Q 80,75 90,100 L 100,100 L 100,0 Z"
                  fill="#DFD7C7"
                  stroke="#C7BCAB"
                  strokeWidth="0.8"
                />
                {/* Islet clusters (Tinagong Dagat / Perth) */}
                <circle cx="38" cy="40" r="4.5" fill="#657A68" stroke="#4D6050" strokeWidth="0.5" />
                <circle cx="32" cy="30" r="3.8" fill="#657A68" stroke="#4D6050" strokeWidth="0.5" />
                <circle cx="44" cy="34" r="3" fill="#657A68" stroke="#4D6050" strokeWidth="0.5" />
                <circle cx="15" cy="18" r="5" fill="#657A68" stroke="#4D6050" strokeWidth="0.5" />
                {/* Coral reef areas */}
                <path
                  d="M 20,60 Q 25,65 22,70"
                  stroke="#C9A66B"
                  strokeWidth="1.2"
                  strokeDasharray="2,2"
                  fill="none"
                />
                <path
                  d="M 72,32 Q 78,36 75,40"
                  stroke="#C9A66B"
                  strokeWidth="1.2"
                  strokeDasharray="2,2"
                  fill="none"
                />
                {/* Boat route lines connecting Alon & Aninag (50,55) */}
                <line
                  x1="50"
                  y1="55"
                  x2="38"
                  y2="40"
                  stroke="#1A3C40"
                  strokeWidth="0.8"
                  strokeDasharray="1.5,1.5"
                />
                <line
                  x1="50"
                  y1="55"
                  x2="22"
                  y2="65"
                  stroke="#1A3C40"
                  strokeWidth="0.8"
                  strokeDasharray="1.5,1.5"
                />
                <line
                  x1="50"
                  y1="55"
                  x2="65"
                  y2="70"
                  stroke="#1A3C40"
                  strokeWidth="0.8"
                  strokeDasharray="1.5,1.5"
                />
              </svg>

              {/* Interactive Spot Pins */}
              {filteredSpots.map((spot) => {
                const isSelected = activeAttraction.id === spot.id;
                const isResort = spot.id === "poblacion-beach";

                return (
                  <button
                    key={spot.id}
                    onClick={() => setActiveAttraction(spot)}
                    style={{ left: `${spot.coordinates.x}%`, top: `${spot.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none transition-transform ${
                      isSelected ? "scale-125 z-30" : "hover:scale-110"
                    }`}
                  >
                    <div
                      className={`relative flex items-center justify-center p-2 rounded-full shadow-lg transition-all ${
                        isResort
                          ? "bg-[#C9A66B] text-white ring-4 ring-[#C9A66B]/30 animate-pulse"
                          : isSelected
                          ? "bg-[#1A3C40] text-white ring-4 ring-[#1A3C40]/30"
                          : "bg-white text-[#1A3C40] border border-[#E5E1D8]"
                      }`}
                    >
                      {isResort ? (
                        <MapPin className="w-4 h-4 text-white" />
                      ) : spot.category === "Diving" ? (
                        <Anchor className="w-3.5 h-3.5" />
                      ) : spot.category === "Scenic Viewpoint" ? (
                        <Camera className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Hover Pin Label */}
                    <span
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap shadow-md pointer-events-none ${
                        isSelected
                          ? "bg-[#1A3C40] text-white"
                          : "bg-white text-[#1A3C40] border border-[#E5E1D8]"
                      }`}
                    >
                      {spot.name.split("(")[0]}
                    </span>
                  </button>
                );
              })}

              {/* Compass Rose */}
              <div className="absolute top-3 right-3 p-2.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#E5E1D8] text-[10px] text-[#1A3C40] flex flex-col items-center">
                <span className="font-bold text-[#C9A66B]">N</span>
                <Compass className="w-4 h-4 text-[#1A3C40] my-0.5" />
                <span>S</span>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-3 left-3 p-3 rounded-2xl bg-white/95 backdrop-blur-sm border border-[#E5E1D8] text-[10px] text-[#5A5A5A] space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-[#1A3C40]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9A66B]"></span>
                  <span>Alon &amp; Aninag Resort (Poblacion Beach)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5A5A5A]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1A3C40]"></span>
                  <span>Diving Sites &amp; Karst Islets</span>
                </div>
              </div>
            </div>

            {/* Quick Map Spot Pill Ticker */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {filteredSpots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setActiveAttraction(spot)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                    activeAttraction.id === spot.id
                      ? "bg-[#1A3C40] text-white"
                      : "bg-white text-[#5A5A5A] hover:bg-[#EAE5DC] border border-[#E5E1D8]"
                  }`}
                >
                  {spot.name.split("(")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Attraction Detail Card (Right - 5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D8] shadow-sm space-y-5">
            <div className="relative h-52 rounded-2xl overflow-hidden bg-[#1A3C40] shadow-sm">
              <img
                src={activeAttraction.image || HERO_RESORT_IMAGE}
                alt={activeAttraction.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1A3C40] text-[#E5D2AD] text-[10px] font-bold uppercase tracking-widest border border-[#254F54]">
                {activeAttraction.category}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1A3C40]">
                {activeAttraction.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C827A] mt-2 font-medium">
                <span className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-[#C9A66B]" />
                  {activeAttraction.distanceFromResort}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C9A66B]" />
                  {activeAttraction.duration}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed font-light">
              {activeAttraction.description}
            </p>

            {/* Highlights */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C827A] block">
                Highlights
              </span>
              {activeAttraction.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#5A5A5A]">
                  <Check className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            {/* Local Insider Tip */}
            <div className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#E5E1D8] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#1A3C40]">
                <Info className="w-3.5 h-3.5 text-[#C9A66B]" />
                <span>Aninag Insider Tip</span>
              </div>
              <p className="text-[11px] text-[#5A5A5A] leading-relaxed font-light">
                {activeAttraction.tips}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onAddToTrip(activeAttraction)}
                className="flex-1 py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-lg shadow-[#1A3C40]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#C9A66B]" />
                <span>
                  {savedAttractionIds.includes(activeAttraction.id)
                    ? "Saved in Your Trip"
                    : "Add to My Trip Itinerary"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
