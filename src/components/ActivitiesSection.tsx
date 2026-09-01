import React from "react";
import {
  Compass,
  Anchor,
  Flame,
  Sparkles,
  Sun,
  Camera,
  Heart,
  Waves,
  Check,
  Calendar,
} from "lucide-react";
import {
  HERO_RESORT_IMAGE,
  BONFIRE_DECK_IMAGE,
  ROOM_VILLA_IMAGE,
} from "../data/resortData";

interface ActivitiesSectionProps {
  onOpenBooking: () => void;
  onOpenMap: () => void;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  onOpenBooking,
  onOpenMap,
}) => {
  const experiences = [
    {
      id: "exp-diving",
      title: "Scuba Diving & Julian's WWII Wreck",
      category: "Diving & Marine",
      image: HERO_RESORT_IMAGE,
      tag: "Top Sipalay Adventure",
      desc: "Explore historic coral-encrusted WWII shipwrecks, vertical reef wall drop-offs at Punta Ballo, and swim alongside green sea turtles.",
      perks: ["PADI dive masters", "Equipment rental available", "Daily morning boat departures"],
    },
    {
      id: "exp-island-hopping",
      title: "Tinagong Dagat & Perth Karst Island Hopping",
      category: "Island Exploration",
      image: HERO_RESORT_IMAGE,
      tag: "Must-Do Sightseeing",
      desc: "Cruise through Sipalay's maze of emerald limestone islets, walk across bamboo suspension bridges, and photograph iconic panoramic vistas.",
      perks: ["Direct pumpboat from Poblacion beach", "Snorkeling gear included", "Cold fresh coconut stop"],
    },
    {
      id: "exp-bonfire-soul",
      title: "Nightly Wooden Deck Bonfire & Acoustic Soul",
      category: "Evening Vibe",
      image: BONFIRE_DECK_IMAGE,
      tag: "Resort Signature",
      desc: "Gather under a canopy of stars on our beachside wooden deck for warm crackling fires, roasted s'mores, acoustic guitar, and heartfelt conversations.",
      perks: ["Complimentary for in-house guests", "Firepit floor cushions", "Acoustic song requests"],
    },
    {
      id: "exp-hilot-massage",
      title: "Sunset Hilot Herbal Massage",
      category: "Wellness & Spa",
      image: ROOM_VILLA_IMAGE,
      tag: "Total Relaxation",
      desc: "Melt away city stress with ancient Filipino Hilot warm coconut oil and herbal leaf therapy right on your private villa balcony or beachfront cabana.",
      perks: ["Certified Negrense therapists", "Organic botanical oils", "Sound of gentle waves"],
    },
  ];

  return (
    <section id="activities" className="py-24 bg-[#FDFBF7] border-b border-[#E5E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F2ED] text-[#1A3C40] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 border border-[#E5E1D8]">
              <Compass className="w-3.5 h-3.5 text-[#C9A66B]" />
              Sipalay Adventures &amp; Wellness
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3C40] tracking-tight">
              Unforgettable Island <span className="italic font-light text-[#C9A66B]">Experiences</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A] mt-3 max-w-2xl leading-relaxed font-light">
              Whether you seek adrenaline diving historical wrecks or soulful evening relaxation by the firepit, our concierge curates your perfect escape.
            </p>
          </div>

          <button
            onClick={onOpenMap}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-lg shadow-[#1A3C40]/25 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#C9A66B]" />
            <span>View Sipalay Dive Map</span>
          </button>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E5E1D8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-[#1A3C40]">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/30">
                    {exp.tag}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A66B] block">
                    {exp.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#1A3C40] leading-snug">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-[#5A5A5A] leading-relaxed font-light">
                    {exp.desc}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-[#E5E1D8]">
                    {exp.perks.map((perk, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-[#5A5A5A]">
                        <Check className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A3C40] bg-[#F5F2ED] hover:bg-[#EAE5DC] border border-[#E5E1D8] transition-colors cursor-pointer"
                >
                  Book with Stay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
