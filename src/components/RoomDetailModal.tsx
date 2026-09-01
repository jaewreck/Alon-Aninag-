import React, { useState } from "react";
import {
  X,
  Bed,
  Users,
  Maximize2,
  Eye,
  Check,
  Calendar,
  Sparkles,
  Shield,
  Coffee,
  Wifi,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Room } from "../types";
import { CurrencyCode, formatPrice } from "../utils/currency";

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onBookRoom: (room: Room) => void;
  onOpenVirtualTour: (roomId?: string) => void;
  currentCurrency: CurrencyCode;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  onClose,
  onBookRoom,
  onOpenVirtualTour,
  currentCurrency,
}) => {
  if (!room) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = room.gallery && room.gallery.length > 0 ? room.gallery : [room.image];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#1A3C40]/80 hover:bg-[#1A3C40] text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1">
          {/* Main Photo Gallery Carousel */}
          <div className="relative h-72 sm:h-96 w-full bg-[#1A3C40]">
            <img
              src={images[activeImageIndex]}
              alt={room.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#1A3C40] flex items-center justify-center shadow transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#1A3C40] flex items-center justify-center shadow transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Thumbnail dots & Virtual Tour Trigger */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-[#1A3C40]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-white border border-white/10 font-medium">
                <span>{activeImageIndex + 1}</span> / <span>{images.length}</span> Photos
              </div>

              <button
                onClick={() => onOpenVirtualTour(room.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A66B] hover:bg-[#D8B980] text-[#1A3C40] text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                View 360° Virtual Tour
              </button>
            </div>
          </div>

          {/* Room Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header with Title and Price */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E1D8]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-[#1A3C40] bg-[#F5F2ED] border border-[#E5E1D8] px-3 py-1 rounded-full mb-2">
                  <Eye className="w-3 h-3 text-[#C9A66B]" />
                  {room.view}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A3C40]">
                  {room.name}
                </h3>
                <p className="text-xs text-[#5A5A5A] mt-1 font-light">
                  Category: <span className="font-semibold text-[#1A3C40]">{room.category}</span> • Sipalay Poblacion Beachfront
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-[#E5E1D8] sm:pl-6">
                <span className="text-[10px] uppercase tracking-wider text-[#8C827A] block font-bold">
                  Direct Website Rate
                </span>
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="font-serif text-3xl font-bold text-[#1A3C40]">
                    {formatPrice(room.pricePerNight, currentCurrency)}
                  </span>
                  <span className="text-xs text-[#5A5A5A]">/ night</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-medium block">
                  Includes Free Aninag Sunset Coffee &amp; Breakfast
                </span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] flex items-center gap-3">
                <Users className="w-4 h-4 text-[#C9A66B]" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#8C827A] font-bold block">Capacity</span>
                  <span className="text-xs font-semibold text-[#1A3C40]">
                    {room.capacity.adults} Adults, {room.capacity.children} Kids
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] flex items-center gap-3">
                <Bed className="w-4 h-4 text-[#C9A66B]" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#8C827A] font-bold block">Bedding</span>
                  <span className="text-xs font-semibold text-[#1A3C40]">{room.bed}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] flex items-center gap-3">
                <Maximize2 className="w-4 h-4 text-[#C9A66B]" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#8C827A] font-bold block">Room Size</span>
                  <span className="text-xs font-semibold text-[#1A3C40]">{room.size}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] flex items-center gap-3">
                <Coffee className="w-4 h-4 text-[#C9A66B]" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#8C827A] font-bold block">Aninag Hour</span>
                  <span className="text-xs font-bold text-emerald-700">Free Daily Coffee</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-serif font-bold text-base text-[#1A3C40] mb-2">
                Room Description &amp; Vibe
              </h4>
              <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed font-light">
                {room.description}
              </p>
            </div>

            {/* Key Highlights */}
            {room.highlights && room.highlights.length > 0 && (
              <div>
                <h4 className="font-serif font-bold text-base text-[#1A3C40] mb-2.5">
                  Special Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {room.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-[#5A5A5A]">
                      <span className="w-4 h-4 rounded-full bg-[#F5F2ED] border border-[#E5E1D8] flex items-center justify-center shrink-0 text-[#1A3C40]">
                        <Check className="w-3 h-3 text-[#C9A66B]" />
                      </span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Amenities */}
            <div>
              <h4 className="font-serif font-bold text-base text-[#1A3C40] mb-2.5">
                All Included Amenities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {room.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-[#E5E1D8] text-xs text-[#1A3C40] flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA Bar */}
        <div className="p-5 sm:p-6 bg-white border-t border-[#E5E1D8] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#8C827A] uppercase tracking-wider font-bold block">Total per night (before promo discount)</span>
            <span className="font-serif text-2xl font-bold text-[#1A3C40]">
              {formatPrice(room.pricePerNight, currentCurrency)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A3C40] hover:bg-[#F5F2ED] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookRoom(room);
              }}
              className="px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-lg shadow-[#1A3C40]/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#C9A66B]" />
              <span>Reserve {room.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
