import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Sparkles,
  Send,
  Check,
  Compass,
  Heart,
} from "lucide-react";
import { RESORT_DETAILS } from "../data/resortData";

interface FooterProps {
  onOpenBooking: () => void;
  onOpenMap: () => void;
  onOpenTools: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenMap,
  onOpenTools,
}) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#102427] text-[#E5E1D8] pt-20 pb-14 border-t border-[#1F464B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-[#1F464B]">
          {/* Col 1 & 2: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A66B] flex items-center justify-center text-[#1A3C40] font-bold text-sm shadow-md">
                AA
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white block">
                  Alon &amp; Aninag
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#C9A66B] uppercase block font-medium">
                  Boutique Beach Resort • Sipalay
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A3B8BA] leading-relaxed max-w-sm font-light">
              “Where Waves Rest and Souls Glow.” Situated along the calm shores of Poblacion Beach, Sipalay City. An intimate 12-room haven celebrating raw Negrense hospitality, sunset drip coffee rituals, and starry bonfire nights.
            </p>

            <div className="space-y-2 text-xs text-[#CBDCDD] pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                <span>{RESORT_DETAILS.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                <span>{RESORT_DETAILS.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                <span>{RESORT_DETAILS.email}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
              Resort Experience
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3B8BA] font-light">
              <li>
                <a href="#rooms" className="hover:text-[#C9A66B] transition-colors">
                  12 Cozy Rooms &amp; Villas
                </a>
              </li>
              <li>
                <a href="#dining" className="hover:text-[#C9A66B] transition-colors">
                  Aninag Beachfront Bistro
                </a>
              </li>
              <li>
                <a href="#activities" className="hover:text-[#C9A66B] transition-colors">
                  Diving &amp; Julian’s WWII Wreck
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenMap}
                  className="hover:text-[#C9A66B] transition-colors text-left cursor-pointer"
                >
                  Sipalay Interactive Map
                </button>
              </li>
              <li>
                <a href="#offers" className="hover:text-[#C9A66B] transition-colors">
                  Barkada &amp; Sunset Promos
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Guest Services & Tools */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
              Traveler Suite
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A3B8BA] font-light">
              <li>
                <button
                  onClick={onOpenTools}
                  className="hover:text-[#C9A66B] transition-colors text-left cursor-pointer"
                >
                  Marine Weather &amp; Tides
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTools}
                  className="hover:text-[#C9A66B] transition-colors text-left cursor-pointer"
                >
                  Hiligaynon Language Translator
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTools}
                  className="hover:text-[#C9A66B] transition-colors text-left cursor-pointer"
                >
                  Collaborative Trip Planner
                </button>
              </li>
              <li>
                <a href="#loyalty" className="hover:text-[#C9A66B] transition-colors">
                  Alon Glow Club Rewards
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#C9A66B] transition-colors">
                  #GlowAtAlon Guest Wall
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter & Glow Perks */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
              Sunset Newsletter
            </h4>
            <p className="text-xs text-[#A3B8BA] leading-relaxed font-light">
              Subscribe for secret promo codes, Sipalay weather updates, and invitations to acoustic bonfire nights.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-2xl bg-[#1A3C40] border border-[#C9A66B]/50 text-[#E5D2AD] text-xs">
                <span className="font-bold block text-white">✓ You’re subscribed!</span>
                Use voucher <strong className="text-[#C9A66B]">GLOWATALON</strong> for 10% off your direct booking.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1A3C40] border border-[#2B5458] rounded-full px-4 py-2.5 text-xs text-white placeholder-[#789699] focus:outline-none focus:border-[#C9A66B]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A3C40] bg-[#C9A66B] hover:bg-[#D8B980] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#C9A66B]/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Get 10% Promo Code</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits & Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A9598]">
          <div>
            © {new Date().getFullYear()} Alon &amp; Aninag Boutique Beach Resort. All rights reserved. Poblacion Beach, Sipalay City, Negros Occidental 6111.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#A3B8BA] flex items-center gap-1.5 font-light">
              Crafted with Negrense hospitality <Heart className="w-3.5 h-3.5 text-[#C9A66B] fill-[#C9A66B]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
