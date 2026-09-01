import React from "react";
import {
  X,
  Calendar,
  Bed,
  CheckCircle,
  Clock,
  Download,
  Trash2,
  FileText,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Booking } from "../types";
import { CurrencyCode, formatPrice } from "../utils/currency";

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (resNumber: string) => void;
  currentCurrency: CurrencyCode;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  currentCurrency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1A3C40] text-white px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between border-b border-[#254F54]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A66B] flex items-center justify-center text-[#1A3C40]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                My Alon &amp; Aninag Itineraries &amp; Passes
              </h3>
              <p className="text-[11px] text-[#A3B8BA] font-light">
                Saved locally and available offline on this device
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-4">
          {bookings.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Calendar className="w-12 h-12 text-[#C9A66B]/50 mx-auto" />
              <h4 className="font-serif text-xl font-bold text-[#1A3C40]">
                No Bookings Found Yet
              </h4>
              <p className="text-xs text-[#5A5A5A] max-w-xs mx-auto font-light">
                Ready to experience Poblacion Beach sunsets? Select any of our 12 rooms to make your reservation.
              </p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.reservationNumber}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E1D8] shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E1D8]">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#8C827A] tracking-wider block">
                      Reservation #
                    </span>
                    <span className="font-mono text-base font-bold text-[#1A3C40]">
                      {b.reservationNumber}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {b.status} • {b.payment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-1 h-24 rounded-2xl overflow-hidden bg-gray-900">
                    <img
                      src={b.roomImage}
                      alt={b.roomName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1 text-xs">
                    <h5 className="font-serif font-bold text-base text-[#1A3C40]">
                      {b.roomName}
                    </h5>
                    <p className="text-[#5A5A5A] font-light">
                      📅 {b.checkInDate} to {b.checkOutDate} ({b.nights} {b.nights === 1 ? "night" : "nights"})
                    </p>
                    <p className="text-[#5A5A5A] font-light">
                      👥 {b.guests.adults} Adults, {b.guests.children} Children
                    </p>
                    <p className="font-bold text-[#1A3C40] text-sm">
                      Total: {formatPrice(b.pricing.totalAmount, currentCurrency)}
                    </p>
                  </div>
                </div>

                {b.addons && b.addons.length > 0 && (
                  <div className="bg-[#F5F2ED] p-3 rounded-2xl text-xs space-y-1 border border-[#E5E1D8]">
                    <span className="font-bold text-[#1A3C40] block text-[10px] uppercase tracking-wider">
                      Add-ons &amp; Experiences:
                    </span>
                    {b.addons.map((ad, idx) => (
                      <div key={idx} className="flex justify-between text-[#5A5A5A] text-xs font-light">
                        <span>• {ad.name}</span>
                        <span className="font-medium text-[#1A3C40]">+{formatPrice(ad.price, currentCurrency)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A3C40] bg-[#F5F2ED] hover:bg-[#E5E1D8] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Print Pass</span>
                  </button>

                  {b.status === "Confirmed" && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to cancel booking ${b.reservationNumber}?`)) {
                          onCancelBooking(b.reservationNumber);
                        }
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel Booking</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-8 bg-white border-t border-[#E5E1D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-md transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
