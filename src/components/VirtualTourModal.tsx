import React, { useState } from "react";
import {
  X,
  Compass,
  RotateCw,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  MapPin,
} from "lucide-react";
import {
  HERO_RESORT_IMAGE,
  ROOM_VILLA_IMAGE,
  BONFIRE_DECK_IMAGE,
  DINING_NEGRENSE_IMAGE,
} from "../data/resortData";

interface VirtualTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [panOffset, setPanOffset] = useState<number>(0);
  const [isPlayingWaves, setIsPlayingWaves] = useState<boolean>(false);

  const scenes = [
    {
      id: "deck",
      name: "Sunset Wooden Deck & Aninag Hour Lounge",
      location: "Beachfront Waterfront",
      image: BONFIRE_DECK_IMAGE,
      desc: "Experience the warm glow where guests gather at 5:15 PM for fresh Negrense drip coffee and acoustic songs.",
    },
    {
      id: "villa",
      name: "Amihan Ocean Villa Interior",
      location: "Upper West Wing",
      image: ROOM_VILLA_IMAGE,
      desc: "Handcrafted bamboo woven headboards, plush king bed, private sunset balcony, and soaking ocean bathtub.",
    },
    {
      id: "bistro",
      name: "Aninag Beachfront Bistro & Bar",
      location: "Main Pavilion",
      image: DINING_NEGRENSE_IMAGE,
      desc: "Open-air dining pavilion serving smoky Chicken Inasal, KBL soup, kinilaw, and Don Papa rum cocktails.",
    },
    {
      id: "aerial",
      name: "Poblacion Beach Shoreline View",
      location: "Sipalay Coastline",
      image: HERO_RESORT_IMAGE,
      desc: "Pristine calm waters facing the Sulu Sea with surrounding karst islet hills.",
    },
  ];

  const currentScene = scenes[activeSceneIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#1A3C40] text-white rounded-3xl shadow-2xl border border-[#254F54] overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#132E31] px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between border-b border-[#254F54]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A66B] flex items-center justify-center text-[#1A3C40] font-bold text-xs shadow">
              360°
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Alon &amp; Aninag Interactive Virtual Walkthrough
              </h3>
              <p className="text-[11px] text-[#A3B8BA] font-light">
                {currentScene.name} • {currentScene.location}
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

        {/* 360° Interactive Canvas */}
        <div className="relative flex-1 aspect-[16/9] min-h-[320px] max-h-[550px] overflow-hidden bg-black flex items-center justify-center select-none group">
          <img
            src={currentScene.image}
            alt={currentScene.name}
            style={{
              transform: `scale(1.15) translateX(${panOffset}px)`,
              transition: "transform 0.2s ease-out",
            }}
            className="w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Pan Controls Overlay */}
          <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
            <button
              onClick={() => setPanOffset((prev) => Math.min(prev + 120, 180))}
              className="pointer-events-auto w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
              title="Pan Left"
            >
              ◀
            </button>
            <button
              onClick={() => setPanOffset((prev) => Math.max(prev - 120, -180))}
              className="pointer-events-auto w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
              title="Pan Right"
            >
              ▶
            </button>
          </div>

          {/* Live 360 Indicator */}
          <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-[#1A3C40]/80 backdrop-blur-md border border-[#C9A66B]/30 text-xs flex items-center gap-2 font-bold uppercase tracking-wider text-white shadow-lg">
            <RotateCw className="w-3.5 h-3.5 text-[#C9A66B] animate-spin" style={{ animationDuration: "8s" }} />
            <span>Interactive 360° View</span>
          </div>

          {/* Scene Description Card */}
          <div className="absolute bottom-4 left-4 right-4 max-w-xl p-5 rounded-3xl bg-[#1A3C40]/85 backdrop-blur-md border border-white/15 text-xs space-y-1.5 shadow-xl">
            <h4 className="font-serif font-bold text-base text-[#C9A66B]">
              {currentScene.name}
            </h4>
            <p className="text-xs text-[#E5E1D8] leading-relaxed font-light">
              {currentScene.desc}
            </p>
          </div>
        </div>

        {/* Scene Switcher Bar */}
        <div className="p-4 sm:px-8 bg-[#132E31] border-t border-[#254F54] flex gap-2.5 overflow-x-auto">
          {scenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => {
                setActiveSceneIndex(idx);
                setPanOffset(0);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeSceneIndex === idx
                  ? "bg-[#C9A66B] text-[#1A3C40] shadow-md"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{scene.name.split(" ")[0]} {scene.name.split(" ")[1]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
