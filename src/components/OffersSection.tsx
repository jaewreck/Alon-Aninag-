import React from "react";
import {
  Tag,
  Gift,
  Users,
  Heart,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Check,
} from "lucide-react";
import { CurrencyCode, formatPrice } from "../utils/currency";

interface OffersSectionProps {
  currentCurrency: CurrencyCode;
  onClaimOffer: (promoCode: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  currentCurrency,
  onClaimOffer,
}) => {
  const packages = [
    {
      id: "barkada-deal",
      title: "Barkada Rest & Glow Getaway (4-6 Pax)",
      badge: "Most Popular Group Promo",
      discount: "12% OFF + Free S'mores",
      promoCode: "BARKADA10",
      description: "Enjoy our spacious Barkada Beachfront Loft with complimentary bonfire firepit s'mores kit, board games, and sunset coffee.",
      validity: "Valid for bookings of 4+ guests",
      inclusions: ["Barkada Beachfront Loft stay", "Free nightly bonfire s'mores kit", "10% off chartered boat tour"],
    },
    {
      id: "honeymoon-glow",
      title: "Romantic Sunset Glow Villa Package",
      badge: "Couples & Anniversaries",
      discount: "15% OFF + Wine & Dinner",
      promoCode: "SUNSETLOVE",
      description: "Stay in our Amihan Sunset Balcony Villa with complimentary bottle of sparkling wine, private sunset deck setup, and 15% off beachfront dinner.",
      validity: "Perfect for couples and honeymooners",
      inclusions: ["Sunset Balcony Villa with direct ocean view", "Bottle of wine upon arrival", "Candlelit sunset table priority"],
    },
    {
      id: "negrense-local",
      title: "Negrense Residents & Bacolod Weekend Rest",
      badge: "Western Visayas Special",
      discount: "15% OFF Direct Stays",
      promoCode: "NEGRENSE15",
      description: "Exclusive discount for residents of Negros Occidental, Bacolod City, Iloilo, and Panay island seeking a refreshing weekend retreat.",
      validity: "Present local government ID at check-in",
      inclusions: ["15% off all 12 room categories", "Complimentary late check-out till 1:30 PM", "Daily sunset brewed coffee"],
    },
    {
      id: "student-sulit",
      title: "Sulit Youth & Student Island Break",
      badge: "Budget-Friendly",
      discount: "10% OFF Any Room",
      promoCode: "STUDENT10",
      description: "Rest, glow, and recharge without breaking your budget. Accessible to students and solo young travelers.",
      validity: "Valid with valid student / youth ID",
      inclusions: ["Valid on Sulit Cozy Rooms", "Free high-speed fiber Wi-Fi", "Access to all beachfront amenities"],
    },
  ];

  return (
    <section id="offers" className="py-24 bg-[#FDFBF7] border-b border-[#E5E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F2ED] text-[#1A3C40] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 border border-[#E5E1D8]">
            <Tag className="w-3.5 h-3.5 text-[#C9A66B]" />
            Exclusive Monthly Packages &amp; Deals
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3C40] tracking-tight">
            Special Glow <span className="italic font-light text-[#C9A66B]">Promotions</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5A5A5A] mt-3 leading-relaxed font-light">
            Curated vacation packages crafted for couples, barkada groups, students, and local Negrense travelers looking for sulit comfort and soul.
          </p>
        </div>

        {/* Promo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-[#F5F2ED] text-[#1A3C40] text-[10px] font-bold uppercase tracking-wider border border-[#E5E1D8]">
                    {pkg.badge}
                  </span>
                  <span className="font-mono font-bold text-xs bg-[#1A3C40] text-[#E5D2AD] px-3.5 py-1 rounded-full border border-[#254F54]">
                    Code: {pkg.promoCode}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1A3C40]">
                    {pkg.title}
                  </h3>
                  <div className="mt-1.5 text-sm font-bold text-[#C9A66B]">
                    {pkg.discount}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed font-light">
                  {pkg.description}
                </p>

                <div className="space-y-2 pt-3 border-t border-[#E5E1D8]">
                  {pkg.inclusions.map((inc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#5A5A5A]">
                      <Check className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#E5E1D8] flex items-center justify-between gap-4">
                <span className="text-[11px] text-[#8C827A] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {pkg.validity}
                </span>

                <button
                  onClick={() => onClaimOffer(pkg.promoCode)}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-lg shadow-[#1A3C40]/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Apply &amp; Book</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
