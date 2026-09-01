import React, { useState } from "react";
import {
  Bed,
  Users,
  Eye,
  Sparkles,
  Calendar,
  Filter,
  Check,
  ChevronRight,
  Maximize2,
  Info,
} from "lucide-react";
import { Room } from "../types";
import { RESORT_ROOMS } from "../data/resortData";
import { CurrencyCode, formatPrice } from "../utils/currency";
import { RoomDetailModal } from "./RoomDetailModal";

interface RoomsSectionProps {
  currentCurrency: CurrencyCode;
  onBookRoom: (room: Room) => void;
  onOpenVirtualTour: (roomId?: string) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({
  currentCurrency,
  onBookRoom,
  onOpenVirtualTour,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalRoom, setActiveModalRoom] = useState<Room | null>(null);

  const categories = [
    { id: "all", label: "All 12 Cozy Rooms" },
    { id: "Villa", label: "Sunset Balcony Villas" },
    { id: "Suite", label: "Seaview Horizon Suites" },
    { id: "Barkada Loft", label: "Barkada & Family Lofts" },
    { id: "Deluxe", label: "Wavefront & Garden Deluxe" },
  ];

  const filteredRooms =
    selectedCategory === "all"
      ? RESORT_ROOMS
      : RESORT_ROOMS.filter((room) => room.category === selectedCategory);

  return (
    <section id="rooms" className="py-24 bg-[#FDFBF7] border-b border-[#E5E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F2ED] text-[#1A3C40] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 border border-[#E5E1D8]">
              <Bed className="w-3.5 h-3.5 text-[#C9A66B]" />
              Cozy Sipalay Accommodations
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3C40] tracking-tight">
              Our 12 Intimate <span className="italic font-light text-[#C9A66B]">Beachfront Rooms</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A] mt-3 max-w-2xl leading-relaxed">
              Each room faces the golden horizon of Poblacion Beach with warm native woods, high-thread linens, air conditioning, fiber Wi-Fi, and daily complimentary Aninag Hour sunset coffee.
            </p>
          </div>

          {/* 360 Virtual Tour Action */}
          <button
            onClick={() => onOpenVirtualTour()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A3C40] bg-white hover:bg-[#F5F2ED] border border-[#E5E1D8] shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#C9A66B]" />
            Launch 360° Virtual Tour
          </button>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-6 mb-10 border-b border-[#E5E1D8]">
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
          <span className="ml-auto text-xs text-[#8C827A] font-semibold tracking-wider uppercase hidden sm:inline">
            Showing {filteredRooms.length} of 12 rooms
          </span>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E5E1D8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Room Image & Badges */}
              <div className="relative h-64 overflow-hidden bg-[#1A3C40]">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C40]/80 via-transparent to-black/20"></div>

                {/* View Badge */}
                <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/30 flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-[#C9A66B]" />
                  {room.view}
                </span>

                {/* Category Pill */}
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#1A3C40] text-[#E5D2AD] text-[10px] uppercase font-bold tracking-widest border border-[#254F54]">
                  {room.category}
                </span>

                {/* Nightly Rate Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#E5D2AD] font-bold block">
                      Direct Rate
                    </span>
                    <span className="font-serif text-2xl font-bold text-white drop-shadow">
                      {formatPrice(room.pricePerNight, currentCurrency)}
                    </span>
                    <span className="text-xs text-[#E5E1D8] ml-1">/ night</span>
                  </div>

                  <button
                    onClick={() => setActiveModalRoom(room)}
                    className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="View gallery and details"
                  >
                    <Info className="w-4 h-4 text-[#C9A66B]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Details</span>
                  </button>
                </div>
              </div>

              {/* Room Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1A3C40] group-hover:text-[#C9A66B] transition-colors line-clamp-1">
                    {room.name}
                  </h3>
                  <p className="text-xs text-[#5A5A5A] mt-2 line-clamp-2 leading-relaxed font-light">
                    {room.description}
                  </p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E5E1D8] text-[11px] text-[#5A5A5A]">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>{room.capacity.adults}A, {room.capacity.children}K</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span className="truncate">{room.bed}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>{room.size}</span>
                  </div>
                </div>

                {/* Key Amenities */}
                <div className="space-y-1.5 text-xs text-[#5A5A5A]">
                  {room.highlights.slice(0, 2).map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setActiveModalRoom(room)}
                    className="w-full py-2.5 px-3 rounded-full text-[11px] uppercase tracking-wider font-bold text-[#1A3C40] bg-[#F5F2ED] hover:bg-[#EAE5DC] border border-[#E5E1D8] transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onBookRoom(room)}
                    className="w-full py-2.5 px-3 rounded-full text-[11px] uppercase tracking-widest font-bold text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-md shadow-[#1A3C40]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={activeModalRoom}
        onClose={() => setActiveModalRoom(null)}
        onBookRoom={onBookRoom}
        onOpenVirtualTour={onOpenVirtualTour}
        currentCurrency={currentCurrency}
      />
    </section>
  );
};
