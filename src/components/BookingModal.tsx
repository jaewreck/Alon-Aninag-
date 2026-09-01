import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Users,
  Bed,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Gift,
  Lock,
  Download,
  Share2,
  Car,
  Utensils,
  Flame,
  FileText,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Room, Booking, BookingAddon } from "../types";
import { RESORT_ROOMS, BOOKING_ADDONS, PROMO_CODES } from "../data/resortData";
import { CurrencyCode, formatPrice, convertAmount } from "../utils/currency";
import { sendPushNotification } from "../utils/notifications";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoom?: Room | null;
  initialParams?: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    category?: string;
  };
  onBookingConfirmed: (newBooking: Booking) => void;
  currentCurrency: CurrencyCode;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialRoom,
  initialParams,
  onBookingConfirmed,
  currentCurrency,
}) => {
  if (!isOpen) return null;

  const today = new Date();
  const defaultCheckIn = initialParams?.checkIn || today.toISOString().split("T")[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 2);
  const defaultCheckOut = initialParams?.checkOut || tomorrow.toISOString().split("T")[0];

  // Steps: 1: Room & Dates, 2: Add-ons, 3: Guest Info, 4: Payment, 5: Confirmation
  const [step, setStep] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<Room>(initialRoom || RESORT_ROOMS[0]);
  const [checkInDate, setCheckInDate] = useState<string>(defaultCheckIn);
  const [checkOutDate, setCheckOutDate] = useState<string>(defaultCheckOut);
  const [adults, setAdults] = useState<number>(initialParams?.adults || 2);
  const [childrenCount, setChildrenCount] = useState<number>(initialParams?.children || 0);

  // Selected Add-ons
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // Promo Code
  const [promoCodeInput, setPromoCodeInput] = useState<string>("GLOWATALON");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>({
    code: "GLOWATALON",
    discountPercent: 10,
  });
  const [promoError, setPromoError] = useState<string>("");

  // Guest Information
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<
    "GCash" | "Maya" | "Credit/Debit Card" | "QR PH" | "Bank Transfer" | "Pay at Check-In"
  >("GCash");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Confirmed Booking Output
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Calculate nights
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffTime = Math.max(d2.getTime() - d1.getTime(), 86400000);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // Pricing calculations
  const roomBaseTotal = selectedRoom.pricePerNight * nights;
  const addonsTotal = selectedAddonIds.reduce((sum, id) => {
    const item = BOOKING_ADDONS.find((a) => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const subtotal = roomBaseTotal + addonsTotal;
  const discountRate = appliedPromo ? appliedPromo.discountPercent / 100 : 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const discountedSubtotal = subtotal - discountAmount;
  const taxesAndService = Math.round(discountedSubtotal * 0.15); // 12% VAT + 3% Local Service Charge
  const finalTotalPHP = discountedSubtotal + taxesAndService;

  const handleApplyPromo = () => {
    setPromoError("");
    const cleaned = promoCodeInput.trim().toUpperCase();
    if (PROMO_CODES[cleaned]) {
      setAppliedPromo({
        code: cleaned,
        discountPercent: PROMO_CODES[cleaned].discountPercent,
      });
    } else {
      setPromoError("Invalid promo voucher code. Try GLOWATALON or BARKADA10");
    }
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const resNumber = `AA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newBooking: Booking = {
        reservationNumber: resNumber,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        roomImage: selectedRoom.image,
        checkInDate,
        checkOutDate,
        nights,
        guests: {
          adults,
          children: childrenCount,
        },
        addons: selectedAddonIds.map((id) => {
          const add = BOOKING_ADDONS.find((a) => a.id === id)!;
          return { addonId: id, name: add.name, price: add.price };
        }),
        pricing: {
          baseRate: selectedRoom.pricePerNight,
          roomTotal: roomBaseTotal,
          addonsTotal,
          discountAmount,
          promoCodeApplied: appliedPromo?.code,
          taxesAndService,
          totalAmount: finalTotalPHP,
        },
        guestInfo: {
          firstName,
          lastName,
          email,
          phone,
          address,
          specialRequests,
        },
        payment: {
          method: paymentMethod,
          status: paymentMethod === "Pay at Check-In" ? "Confirmed" : "Paid Online",
          transactionId: `TXN-${Date.now().toString().slice(-8)}`,
          timestamp: new Date().toLocaleString(),
        },
        status: "Confirmed",
        createdAt: new Date().toISOString(),
      };

      setConfirmedBooking(newBooking);
      onBookingConfirmed(newBooking);
      setStep(5);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E2935A", "#8D4413", "#1B6CA8", "#F5C49B"],
      });

      // Browser Push Notification
      sendPushNotification(
        "🎉 Reservation Confirmed at Alon & Aninag!",
        `Reservation ${resNumber} for ${selectedRoom.name} is booked. We look forward to your restful stay!`
      );
    }, 1500);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden my-6 max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#1A3C40] text-white px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between border-b border-[#254F54]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C9A66B] flex items-center justify-center text-[#1A3C40] font-bold text-xs shadow">
              AA
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Alon &amp; Aninag Instant Reservation
              </h3>
              <p className="text-[11px] text-[#A3B8BA] font-light">
                Poblacion Beach, Sipalay City • Best Direct Rate Guaranteed
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

        {/* Multi-Step Progress Tracker */}
        {step < 5 && (
          <div className="bg-[#F5F2ED] px-6 py-3.5 border-b border-[#E5E1D8] flex items-center justify-between text-xs overflow-x-auto">
            {[
              { num: 1, label: "1. Dates & Room" },
              { num: 2, label: "2. Experiences" },
              { num: 3, label: "3. Guest Details" },
              { num: 4, label: "4. Payment" },
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => {
                  if (st.num < step) setStep(st.num);
                }}
                disabled={st.num > step}
                className={`flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] transition-colors whitespace-nowrap ${
                  step === st.num
                    ? "text-[#1A3C40] border-b-2 border-[#1A3C40] pb-0.5"
                    : step > st.num
                    ? "text-[#C9A66B] cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>{st.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step Contents */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {/* STEP 1: ROOM & DATES */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-white border border-[#E5E1D8]">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    min={today.toISOString().split("T")[0]}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2 text-xs font-medium text-[#1A3C40] focus:outline-none focus:ring-1 focus:ring-[#1A3C40]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    min={checkInDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2 text-xs font-medium text-[#1A3C40] focus:outline-none focus:ring-1 focus:ring-[#1A3C40]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                    Adults
                  </label>
                  <select
                    aria-label="Select Adults Count"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2 text-xs font-medium text-[#1A3C40]"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Adult" : "Adults"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                    Children
                  </label>
                  <select
                    aria-label="Select Children Count"
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2 text-xs font-medium text-[#1A3C40]"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Child" : "Children"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-lg text-[#1A3C40] mb-3">
                  Choose from our 12 Cozy Rooms ({nights} {nights === 1 ? "Night" : "Nights"})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {RESORT_ROOMS.map((room) => {
                    const isSelected = selectedRoom.id === room.id;
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`rounded-3xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#F5F2ED] border-[#1A3C40] ring-2 ring-[#1A3C40]/20 shadow-md"
                            : "bg-white border-[#E5E1D8] hover:border-[#1A3C40]/50"
                        }`}
                      >
                        <div>
                          <div className="relative h-32 rounded-2xl overflow-hidden mb-3 bg-[#1A3C40]">
                            <img
                              src={room.image}
                              alt={room.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-[#1A3C40]/80 backdrop-blur-sm text-[#E5D2AD] text-[9px] font-bold uppercase tracking-wider">
                              {room.category}
                            </span>
                          </div>
                          <h5 className="font-serif font-bold text-sm text-[#1A3C40] line-clamp-1">
                            {room.name}
                          </h5>
                          <span className="text-[11px] text-[#8C827A] block mt-0.5 font-medium">
                            {room.view} • Max {room.capacity.adults + room.capacity.children} guests
                          </span>
                        </div>

                        <div className="pt-3 border-t border-[#E5E1D8] mt-3 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-[#8C827A] uppercase tracking-wider block font-bold">Rate</span>
                            <span className="font-serif font-bold text-sm text-[#1A3C40]">
                              {formatPrice(room.pricePerNight, currentCurrency)}
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isSelected
                                ? "bg-[#1A3C40] text-white"
                                : "bg-[#F5F2ED] text-[#1A3C40] border border-[#E5E1D8]"
                            }`}
                          >
                            {isSelected ? "Selected" : "Choose"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ADD-ONS & EXPERIENCES */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1A3C40]">
                  Enhance Your Sipalay Getaway
                </h4>
                <p className="text-xs text-[#5A5A5A] mt-1 font-light">
                  Add direct airport transfers, chartered island hopping boats, or romantic sunset dining.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BOOKING_ADDONS.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isChecked
                          ? "bg-[#F5F2ED] border-[#1A3C40] ring-2 ring-[#1A3C40]/20 shadow-sm"
                          : "bg-white border-[#E5E1D8] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 text-[#1A3C40] rounded focus:ring-[#1A3C40]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-[#1A3C40]">{addon.name}</h5>
                          <span className="font-bold text-xs text-[#C9A66B] ml-2 shrink-0">
                            +{formatPrice(addon.price, currentCurrency)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5A5A5A] mt-1 leading-relaxed font-light">
                          {addon.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code Box */}
              <div className="p-5 rounded-3xl bg-white border border-[#E5E1D8] space-y-2">
                <label className="text-xs font-bold text-[#1A3C40] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <Gift className="w-3.5 h-3.5 text-[#C9A66B]" />
                  Have a Promo Code or Voucher?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. GLOWATALON, BARKADA10, SUNSETLOVE"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 uppercase font-semibold bg-[#FDFBF7] border border-[#E5E1D8] rounded-full px-4 py-2 text-xs text-[#1A3C40] focus:outline-none focus:ring-1 focus:ring-[#1A3C40]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-xs text-emerald-700 font-medium">
                    ✓ Code <strong>{appliedPromo.code}</strong> applied ({appliedPromo.discountPercent}% off subtotal)!
                  </p>
                )}
                {promoError && <p className="text-xs text-rose-600 font-medium">{promoError}</p>}
              </div>
            </div>
          )}

          {/* STEP 3: GUEST INFORMATION */}
          {step === 3 && (
            <form id="guest-form" className="space-y-4">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1A3C40]">
                  Guest Contact Details
                </h4>
                <p className="text-xs text-[#5A5A5A] mt-0.5 font-light">
                  Your reservation confirmation and check-in pass will be sent to this email.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jeric"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A3C40]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abestano"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A3C40]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. guest@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A3C40]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                    Mobile Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +63 917 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A3C40]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                  Home City / Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bacolod City / Manila / International"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A3C40]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                  Special Requests / Dietary Restrictions / Honeymoon Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Early check-in request, celebrating anniversary, vegetarian diet..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A3C40]"
                />
              </div>
            </form>
          )}

          {/* STEP 4: PAYMENT GATEWAY */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1A3C40]">
                  Select Payment Method
                </h4>
                <p className="text-xs text-[#5A5A5A] mt-0.5 font-light">
                  Secure encrypted transactions via GCash, Maya, Cards, or Pay upon Arrival.
                </p>
              </div>

              {/* Payment Method Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: "GCash", label: "GCash (Instant QR)", desc: "Direct E-Wallet" },
                  { id: "Maya", label: "Maya / PayMaya", desc: "Scan or Login" },
                  { id: "Credit/Debit Card", label: "Credit / Debit Card", desc: "Visa / Mastercard" },
                  { id: "QR PH", label: "QR PH (All Banks)", desc: "BDO, BPI, UnionBank" },
                  { id: "Bank Transfer", label: "Direct Bank Deposit", desc: "BDO / BPI Account" },
                  { id: "Pay at Check-In", label: "Pay at Check-In", desc: "Front Desk Cash/Card" },
                ].map((m) => {
                  const isChosen = paymentMethod === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer text-left ${
                        isChosen
                          ? "bg-[#F5F2ED] border-[#1A3C40] ring-2 ring-[#1A3C40]/20 shadow-sm"
                          : "bg-white border-[#E5E1D8] hover:bg-[#FDFBF7]"
                      }`}
                    >
                      <span className="font-bold text-xs text-[#1A3C40] block">{m.label}</span>
                      <span className="text-[10px] text-[#8C827A] mt-0.5 block font-light">{m.desc}</span>
                    </div>
                  );
                })}
              </div>

              {/* Interactive simulated payment details */}
              {paymentMethod === "GCash" && (
                <div className="p-5 rounded-3xl bg-[#007DFE]/10 border border-[#007DFE]/30 flex flex-col sm:flex-row items-center gap-4 text-xs">
                  <div className="w-28 h-28 bg-white p-2 rounded-2xl shadow border border-gray-200 flex flex-col items-center justify-center text-center">
                    <QrCode className="w-16 h-16 text-[#007DFE]" />
                    <span className="text-[9px] font-bold text-[#007DFE]">ALON ANINAG GCASH</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-[#007DFE] text-sm">GCash Instant Express Pay</h5>
                    <p className="text-[#3A4B5C] mt-1 leading-relaxed text-[11px] font-light">
                      Account Name: <strong>ALON &amp; ANINAG RESORT CORP</strong><br />
                      GCash Merchant #: <strong>0917-842-ALON</strong><br />
                      Total to Pay: <strong>{formatPrice(finalTotalPHP, currentCurrency)}</strong>
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === "Credit/Debit Card" && (
                <div className="p-5 rounded-3xl bg-white border border-[#E5E1D8] space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs font-mono text-[#1A3C40]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                        Expiry MM/YY
                      </label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs font-mono text-[#1A3C40]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs font-mono text-[#1A3C40]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Live Rate Breakdown Summary */}
              <div className="p-5 rounded-3xl bg-white border border-[#E5E1D8] space-y-2 text-xs">
                <div className="flex justify-between text-[#5A5A5A]">
                  <span>
                    {selectedRoom.name} ({nights} nights x {formatPrice(selectedRoom.pricePerNight, currentCurrency)})
                  </span>
                  <span>{formatPrice(roomBaseTotal, currentCurrency)}</span>
                </div>

                {addonsTotal > 0 && (
                  <div className="flex justify-between text-[#5A5A5A]">
                    <span>Selected Experiences &amp; Transfers ({selectedAddonIds.length})</span>
                    <span>+{formatPrice(addonsTotal, currentCurrency)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Voucher Discount ({appliedPromo?.code})</span>
                    <span>-{formatPrice(discountAmount, currentCurrency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#5A5A5A]">
                  <span>12% Government VAT &amp; 3% Local Service</span>
                  <span>+{formatPrice(taxesAndService, currentCurrency)}</span>
                </div>

                <div className="pt-3 border-t border-[#E5E1D8] flex justify-between items-center text-sm font-bold text-[#1A3C40]">
                  <span>Final Total</span>
                  <span className="font-serif text-2xl text-[#1A3C40]">
                    {formatPrice(finalTotalPHP, currentCurrency)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION RECEIPT PASS */}
          {step === 5 && confirmedBooking && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#C9A66B] uppercase tracking-widest block">
                  Reservation Successfully Confirmed
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A3C40] mt-1">
                  Paradise Awaits, {confirmedBooking.guestInfo.firstName}!
                </h3>
                <p className="text-xs sm:text-sm text-[#5A5A5A] mt-2 max-w-md mx-auto leading-relaxed font-light">
                  Your reservation is logged in our front-desk system. We are getting your cozy beachfront room and sunset coffee ready!
                </p>
              </div>

              {/* Digital Boarding / Itinerary Pass */}
              <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-dashed border-[#1A3C40]/30 p-6 text-left shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] uppercase text-gray-500 font-bold block">
                      Reservation Number
                    </span>
                    <span className="font-mono text-lg font-bold text-[#1A3C40]">
                      {confirmedBooking.reservationNumber}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    {confirmedBooking.payment.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Room:</span>
                    <span className="font-semibold text-[#1A3C40]">{confirmedBooking.roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dates:</span>
                    <span className="font-semibold text-[#1A3C40]">
                      {confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate} ({confirmedBooking.nights} nights)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guests:</span>
                    <span className="font-semibold text-[#1A3C40]">
                      {confirmedBooking.guests.adults} Adults, {confirmedBooking.guests.children} Children
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Billed:</span>
                    <span className="font-bold text-[#1A3C40]">
                      {formatPrice(confirmedBooking.pricing.totalAmount, currentCurrency)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 text-[11px] text-[#5A5A5A] bg-[#F5F2ED] p-3 rounded-2xl font-light">
                  <strong className="text-[#1A3C40] font-bold">✨ In-House Guest Perk:</strong> Complimentary Aninag Hour drip coffee daily at 5:15 PM on the Sunset Deck.
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={printReceipt}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A3C40] bg-white border border-[#E5E1D8] hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#C9A66B]" />
                  Print / Save Pass (PDF)
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] transition-colors cursor-pointer shadow-md"
                >
                  Return to Website
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="bg-white px-6 py-4 sm:px-8 border-t border-[#E5E1D8] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A3C40] hover:bg-[#F5F2ED] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-4">
              <div className="text-right mr-2 hidden sm:block">
                <span className="text-[9px] text-[#8C827A] uppercase tracking-wider font-bold block">Current Estimate</span>
                <span className="font-serif font-bold text-base text-[#1A3C40]">
                  {formatPrice(finalTotalPHP, currentCurrency)}
                </span>
              </div>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 3 && (!firstName || !lastName || !email || !phone)) {
                      alert("Please complete the required contact fields.");
                      return;
                    }
                    setStep((prev) => prev + 1);
                  }}
                  className="px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#1A3C40]/25"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmReservation}
                  disabled={isProcessingPayment}
                  className="px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A3C40] bg-[#C9A66B] hover:bg-[#D8B980] shadow-lg shadow-[#C9A66B]/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isProcessingPayment ? "Securing Reservation..." : "Confirm & Pay"}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
