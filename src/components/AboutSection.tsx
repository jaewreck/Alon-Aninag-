import React from "react";
import {
  Sun,
  Flame,
  Coffee,
  Heart,
  Sparkles,
  Waves,
  MapPin,
  CheckCircle,
  Users,
  Compass,
} from "lucide-react";
import {
  HERO_RESORT_IMAGE,
  ROOM_VILLA_IMAGE,
  BONFIRE_DECK_IMAGE,
  DINING_NEGRENSE_IMAGE,
  RESORT_DETAILS,
} from "../data/resortData";

interface AboutSectionProps {
  onExploreRooms: () => void;
  onExploreDining: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onExploreRooms,
  onExploreDining,
}) => {
  return (
    <section id="about" className="py-24 bg-[#FDFBF7] border-b border-[#E5E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F2ED] text-[#1A3C40] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 border border-[#E5E1D8]">
            <Waves className="w-3.5 h-3.5 text-[#C9A66B]" />
            Our Story &amp; Philosophy
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A3C40] tracking-tight">
            Where Waves Rest <span className="italic font-light text-[#C9A66B]">and Souls Glow</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5A5A5A] mt-4 leading-relaxed">
            Nestled along the calm shore of Poblacion Beach in Sipalay City, Alon &amp; Aninag is an intimate 12-room boutique beach resort built around a simple, soulful promise:{" "}
            <span className="font-semibold text-[#1A3C40] italic font-serif">
              “You come tired, you leave glowing.”
            </span>
          </p>
        </div>

        {/* 2-Column Story Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Atmospheric Image Collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-sm border border-[#E5E1D8]">
                  <img
                    src={ROOM_VILLA_IMAGE}
                    alt="Cozy Balcony Villa Interior"
                    className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-sm border border-[#E5E1D8]">
                  <img
                    src={DINING_NEGRENSE_IMAGE}
                    alt="Authentic Negrense Beachfront Dining"
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-6">
                <div className="rounded-3xl overflow-hidden shadow-sm border border-[#E5E1D8]">
                  <img
                    src={BONFIRE_DECK_IMAGE}
                    alt="Nightly Bonfire on Wooden Deck"
                    className="w-full h-44 object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-sm border border-[#E5E1D8]">
                  <img
                    src={HERO_RESORT_IMAGE}
                    alt="Sunset Viewing Deck at Sipalay"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-3xl p-5 shadow-xl border border-[#E5E1D8] max-w-xs animate-in fade-in">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#F5F2ED] flex items-center justify-center text-[#1A3C40] border border-[#E5E1D8]">
                  <Flame className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1A3C40]">
                    Aninag Hour Ritual
                  </h4>
                  <p className="text-[11px] text-[#5A5A5A] mt-0.5 leading-snug">
                    Free freshly brewed Negrense coffee every day at 5:15 PM sunset.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The 4 Pillars of Alon & Aninag */}
          <div className="space-y-6">
            <div className="border-l-2 border-[#1A3C40] pl-4">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A3C40]">
                Why Travelers Love Our Boutique Haven
              </h3>
              <p className="text-xs sm:text-sm text-[#5A5A5A] mt-1">
                Others sell a generic room. We give you a soulful feeling — rest, glow, and sincere Negrense care.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Pillar 1 */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E1D8] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F2ED] flex items-center justify-center shrink-0 text-[#1A3C40] border border-[#E5E1D8]">
                  <Sun className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1A3C40]">
                    Sunset Deck &amp; Aninag Hour
                  </h4>
                  <p className="text-xs text-[#5A5A5A] mt-1 leading-relaxed">
                    Facing due west over Poblacion bay, our wooden deck is the prime spot in Sipalay for golden hour photography, glowing paper lanterns, and soulful acoustic music.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E1D8] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F2ED] flex items-center justify-center shrink-0 text-[#1A3C40] border border-[#E5E1D8]">
                  <Heart className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1A3C40]">
                    Warm, Family-Like Service
                  </h4>
                  <p className="text-xs text-[#5A5A5A] mt-1 leading-relaxed">
                    With just 12 rooms, our local Sipalay staff remember your name, your favorite food, and dietary preferences. You are treated like family returning home.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E1D8] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F2ED] flex items-center justify-center shrink-0 text-[#1A3C40] border border-[#E5E1D8]">
                  <Sparkles className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1A3C40]">
                    Affordable Native Aesthetic (Sulit &amp; Photogenic)
                  </h4>
                  <p className="text-xs text-[#5A5A5A] mt-1 leading-relaxed">
                    Minimalist wood-and-white native architecture, rattan touches, and high-speed Wi-Fi. Premium aesthetic vibe without the steep 5-star price.
                  </p>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E1D8] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F2ED] flex items-center justify-center shrink-0 text-[#1A3C40] border border-[#E5E1D8]">
                  <Flame className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1A3C40]">
                    Bonfire Soul Nights &amp; Negrense Flavors
                  </h4>
                  <p className="text-xs text-[#5A5A5A] mt-1 leading-relaxed">
                    Gather around our nightly beach firepit with s'mores, roasted corn, local guitarists, and authentic Negros Chicken Inasal fresh off the coconut grill.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Facts Counter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[#E5E1D8]">
          <div className="p-6 rounded-3xl bg-white border border-[#E5E1D8] text-center shadow-sm">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1A3C40] block">
              12
            </span>
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A5A] font-bold mt-1.5 block">
              Cozy Sea-Facing Rooms
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E5E1D8] text-center shadow-sm">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1A3C40] block">
              ₱1,800+
            </span>
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A5A] font-bold mt-1.5 block">
              Affordable Sulit Rates
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E5E1D8] text-center shadow-sm">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1A3C40] block">
              5:15 PM
            </span>
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A5A] font-bold mt-1.5 block">
              Daily Free Sunset Coffee
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E5E1D8] text-center shadow-sm">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1A3C40] block">
              100%
            </span>
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#5A5A5A] font-bold mt-1.5 block">
              Warm Negrense Soul
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
