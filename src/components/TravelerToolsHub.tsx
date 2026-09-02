import React, { useState, useEffect } from "react";
import {
  X,
  CloudSun,
  DollarSign,
  Languages,
  Calendar,
  Cloud,
  Check,
  Volume2,
  Share2,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Wifi,
  WifiOff,
  Copy,
  Clock,
  Waves,
  Sun,
  ShieldCheck,
  Send,
} from "lucide-react";
import { CurrencyCode, CURRENCY_CONFIGS, formatPrice, convertAmount } from "../utils/currency";
import { LanguageCode, SUPPORTED_LANGUAGES } from "../utils/i18n";
import { TripItinerary, TripPlanItem } from "../types";
import {
  getStoredItineraries,
  saveStoredItineraries,
  generateSyncPayload,
  restoreSyncPayload,
} from "../utils/offlineSync";

interface TravelerToolsHubProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  currentCurrency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const TravelerToolsHub: React.FC<TravelerToolsHubProps> = ({
  isOpen,
  onClose,
  initialTab = "weather",
  currentCurrency,
  onCurrencyChange,
  currentLanguage,
  onLanguageChange,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Weather & Sunset Aninag Countdown
  const [sunsetMinutesLeft, setSunsetMinutesLeft] = useState<number>(45);

  // Currency Converter State
  const [converterAmount, setConverterAmount] = useState<number>(3000);
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("PHP");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("USD");

  // Translator State
  const [translateInput, setTranslateInput] = useState<string>("Thank you very much");
  const [sourceLang, setSourceLang] = useState<string>("en");
  const [targetLang, setTargetLang] = useState<string>("hil");
  const [translatedResult, setTranslatedResult] = useState<string>("Madamo gid nga salamat");
  const [pronunciationGuide, setPronunciationGuide] = useState<string>("Mah-DAH-moh geed ngah sah-LAH-maht");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Itinerary Planner State
  const [itineraries, setItineraries] = useState<TripItinerary[]>(getStoredItineraries());
  const [newPlanDay, setNewPlanDay] = useState<number>(1);
  const [newPlanTime, setNewPlanTime] = useState<string>("03:00 PM");
  const [newPlanTitle, setNewPlanTitle] = useState<string>("");
  const [newPlanLocation, setNewPlanLocation] = useState<string>("Poblacion Beach");
  const [newPlanNotes, setNewPlanNotes] = useState<string>("");

  // Cloud Sync State
  const [syncCodeInput, setSyncCodeInput] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [syncSuccess, setSyncSuccess] = useState<string>("");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Handle Translate Request
  const handleTranslate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!translateInput.trim()) return;

    setIsTranslating(true);
    let resultText = "";
    let phoneticGuide = "";

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: translateInput,
          sourceLang,
          targetLang,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        resultText = data.translatedText;
        phoneticGuide = data.pronunciation || "";
      }
    } catch {
      // Fallback to client-side Hiligaynon / multi-language dictionary
    }

    if (!resultText) {
      const clean = translateInput.trim().toLowerCase();
      const localDict: Record<string, Record<string, { hil: string; pron: string }>> = {
        "good morning": { hil: { hil: "Maayong aga", pron: "mah-AH-yong AH-gah" } },
        "good afternoon": { hil: { hil: "Maayong hapon", pron: "mah-AH-yong HAH-pon" } },
        "good evening": { hil: { hil: "Maayong gab-i", pron: "mah-AH-yong GAB-ee" } },
        "good day": { hil: { hil: "Maayong adlaw", pron: "mah-AH-yong AHD-lahw" } },
        "thank you": { hil: { hil: "Madamo gid nga salamat", pron: "mah-DAH-moh geed ngah sah-LAH-maht" } },
        "thank you very much": { hil: { hil: "Madamo gid nga salamat palangga", pron: "mah-DAH-moh geed ngah sah-LAH-maht pah-LAHNG-gah" } },
        "how much is this": { hil: { hil: "Tagpila ini?", pron: "tahg-pee-LAH ee-NEE" } },
        "how much": { hil: { hil: "Tagpila?", pron: "tahg-pee-LAH" } },
        "delicious": { hil: { hil: "Namanamian / Manamit gid!", pron: "mah-NAH-meet geed" } },
        "where is the beach": { hil: { hil: "Diin ang baybayon?", pron: "dee-EEN ahng bye-bye-YON" } },
        "where is the boat": { hil: { hil: "Diin ang baroto / sakayan?", pron: "dee-EEN ahng bah-ROH-toh" } },
        "where is the room": { hil: { hil: "Diin ang kwarto?", pron: "dee-EEN ahng KWAHR-toh" } },
        "let's go": { hil: { hil: "Dali na / Malakat na kita", pron: "DAH-lee nah / mah-lah-KAHT nah kee-TAH" } },
        "welcome": { hil: { hil: "Maayong pag-abot sa Alon & Aninag", pron: "mah-AH-yong pahg-ah-BOHT" } },
        "coffee": { hil: { hil: "Kape", pron: "KAH-peh" } },
        "sunset": { hil: { hil: "Tunod-adlaw / Aninag", pron: "TOO-nod AHD-lahw" } },
      };

      // Match in dictionary or direct translation
      const match = Object.keys(localDict).find((k) => clean.includes(k));
      if (match && targetLang === "hil") {
        resultText = localDict[match].hil.hil;
        phoneticGuide = localDict[match].hil.pron;
      } else {
        resultText = targetLang === "hil" ? `[Hiligaynon]: ${translateInput}` : translateInput;
        phoneticGuide = "Local Negrense cadence";
      }
    }

    setTranslatedResult(resultText);
    setPronunciationGuide(phoneticGuide);
    setIsTranslating(false);
  };

  // Text-To-Speech for Hiligaynon/Translations
  const speakTranslation = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Add Item to Itinerary
  const handleAddItineraryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanTitle) return;

    const newItem: TripPlanItem = {
      id: `it-${Date.now()}`,
      day: newPlanDay,
      time: newPlanTime,
      title: newPlanTitle,
      location: newPlanLocation,
      notes: newPlanNotes,
      category: "Activity",
    };

    const currentItin = itineraries[0];
    const updated = {
      ...currentItin,
      items: [...currentItin.items, newItem],
    };

    const newItins = [updated];
    setItineraries(newItins);
    saveStoredItineraries(newItins);
    setNewPlanTitle("");
    setNewPlanNotes("");
  };

  const handleDeleteItineraryItem = (itemId: string) => {
    const currentItin = itineraries[0];
    const updated = {
      ...currentItin,
      items: currentItin.items.filter((i) => i.id !== itemId),
    };
    const newItins = [updated];
    setItineraries(newItins);
    saveStoredItineraries(newItins);
  };

  // Cloud Sync Handler
  const handleGenerateBackup = () => {
    const code = generateSyncPayload();
    setGeneratedCode(code);
    navigator.clipboard?.writeText(code);
    setSyncSuccess("✓ Backup payload generated and copied to clipboard!");
    setTimeout(() => setSyncSuccess(""), 4000);
  };

  const handleRestoreBackup = () => {
    if (!syncCodeInput.trim()) return;
    const ok = restoreSyncPayload(syncCodeInput);
    if (ok) {
      setItineraries(getStoredItineraries());
      setSyncSuccess("✓ Data restored successfully across your devices!");
      setSyncCodeInput("");
    } else {
      setSyncSuccess("⚠️ Invalid sync payload string.");
    }
    setTimeout(() => setSyncSuccess(""), 4000);
  };

  // Currency Converter calculation
  const phpEquivalent = fromCurrency === "PHP" ? converterAmount : converterAmount / CURRENCY_CONFIGS[fromCurrency].rateFromPHP;
  const convertedValue = phpEquivalent * CURRENCY_CONFIGS[toCurrency].rateFromPHP;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Hub Header */}
        <div className="bg-[#1A3C40] text-white px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between border-b border-[#254F54]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C9A66B] flex items-center justify-center text-[#1A3C40] font-bold text-xs shadow">
              ✨
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Sipalay Traveler Tools &amp; Offline Hub
              </h3>
              <p className="text-[11px] text-[#A3B8BA] font-light">
                Real-time weather, currency converter, Hiligaynon translator &amp; collaborative itinerary
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

        {/* Tab Navigation */}
        <div className="bg-[#F5F2ED] px-4 sm:px-6 py-2.5 border-b border-[#E5E1D8] flex items-center gap-2 overflow-x-auto">
          {[
            { id: "weather", label: "☀️ Weather & Tides", icon: CloudSun },
            { id: "currency", label: "💱 Currency Converter", icon: DollarSign },
            { id: "translator", label: "🗣️ Hiligaynon Translator", icon: Languages },
            { id: "itinerary", label: "🗺️ Trip Planner", icon: Calendar },
            { id: "offline", label: "☁️ Offline & Cloud Sync", icon: Cloud },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-[#1A3C40] text-white shadow-md shadow-[#1A3C40]/20"
                    : "text-[#5A5A5A] hover:bg-white/80"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {/* 1. WEATHER & TIDES TAB */}
          {activeTab === "weather" && (
            <div className="space-y-6">
              {/* Aninag Hour Golden Sunset Countdown Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#1A3C40] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#254F54]">
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-white/10 text-[#E5D2AD] px-3 py-1 rounded-full inline-block">
                    🌅 Aninag Sunset Countdown
                  </span>
                  <h4 className="font-serif text-2xl sm:text-3xl font-bold">
                    Golden Hour Begins at 5:15 PM
                  </h4>
                  <p className="text-xs text-[#A3B8BA] font-light max-w-md">
                    Complimentary brewed Negrense drip coffee served on the Sunset Deck for all registered guests.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/15 text-center shrink-0">
                  <span className="font-serif text-3xl sm:text-4xl font-bold block text-[#C9A66B]">45m</span>
                  <span className="text-[9px] uppercase tracking-wider text-[#A3B8BA] font-bold">
                    Till Golden Glow
                  </span>
                </div>
              </div>

              {/* Weather Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-[#E5E1D8] text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C827A] block">Air Temperature</span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1A3C40] mt-1 block">
                    29°C
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">☀️ Tropical Sunshine</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-[#E5E1D8] text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C827A] block">Sea Water Temp</span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1A3C40] mt-1 block">
                    28°C
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">🌊 Ideal for Swimming</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-[#E5E1D8] text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C827A] block">Wave &amp; Swell</span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1A3C40] mt-1 block">
                    0.3 m
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">✓ Calm &amp; Glassy</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-[#E5E1D8] text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C827A] block">Underwater Visibility</span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1A3C40] mt-1 block">
                    20 - 25 m
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">🤿 Crystal Clear Diving</span>
                </div>
              </div>

              {/* 3-Day Coastal Forecast */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E1D8] space-y-4 shadow-sm">
                <h4 className="font-serif font-bold text-base text-[#1A3C40]">
                  3-Day Sipalay Marine &amp; Travel Outlook
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5E1D8]">
                    <span className="font-bold block text-[#1A3C40]">Today (Sunset Clear)</span>
                    <span className="text-[#C9A66B] font-bold">29°C / Low 24°C</span>
                    <p className="text-[11px] text-[#5A5A5A] mt-1 font-light">Calm seas, gentle breeze at sunset.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5E1D8]">
                    <span className="font-bold block text-[#1A3C40]">Tomorrow (Sunny &amp; Dry)</span>
                    <span className="text-[#C9A66B] font-bold">30°C / Low 24°C</span>
                    <p className="text-[11px] text-[#5A5A5A] mt-1 font-light">Prime conditions for Tinagong Dagat boat tour.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5E1D8]">
                    <span className="font-bold block text-[#1A3C40]">Wednesday (Light Breeze)</span>
                    <span className="text-[#C9A66B] font-bold">29°C / Low 25°C</span>
                    <p className="text-[11px] text-[#5A5A5A] mt-1 font-light">Great for Julian's Wreck morning dive.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. CURRENCY CONVERTER TAB */}
          {activeTab === "currency" && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="text-center">
                <h4 className="font-serif text-2xl font-bold text-[#1A3C40]">
                  Real-Time Travel Budget Currency Converter
                </h4>
                <p className="text-xs text-[#5A5A5A] mt-1 font-light">
                  Accurate conversions for international guests planning their Sipalay stay.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E1D8] shadow-sm space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                    Amount to Convert
                  </label>
                  <input
                    type="number"
                    value={converterAmount}
                    onChange={(e) => setConverterAmount(Number(e.target.value))}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-4 py-2.5 text-base font-bold text-[#1A3C40] focus:outline-none focus:ring-1 focus:ring-[#1A3C40]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                      From Currency
                    </label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                      className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs font-medium text-[#1A3C40]"
                    >
                      {Object.values(CURRENCY_CONFIGS).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.symbol} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                      To Currency
                    </label>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                      className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs font-medium text-[#1A3C40]"
                    >
                      {Object.values(CURRENCY_CONFIGS).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.symbol} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Result Display */}
                <div className="p-5 rounded-2xl bg-[#F5F2ED] border border-[#E5E1D8] text-center space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C827A] block">Converted Result:</span>
                  <span className="font-serif text-3xl font-bold text-[#1A3C40] block">
                    {CURRENCY_CONFIGS[toCurrency].symbol}
                    {toCurrency === "JPY" || toCurrency === "PHP"
                      ? Math.round(convertedValue).toLocaleString()
                      : convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-[#8C827A] block font-light">
                    1 {fromCurrency} ≈ {(convertedValue / (converterAmount || 1)).toFixed(4)} {toCurrency}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. HILIGAYNON TRANSLATOR TAB */}
          {activeTab === "translator" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#1A3C40]">
                  Hiligaynon (Ilonggo) &amp; Multi-Language Travel Translator
                </h4>
                <p className="text-xs text-[#5A5A5A] mt-1 font-light">
                  Speak like a local in Negros Occidental. Includes dialect pronunciation guides and audio.
                </p>
              </div>

              <form onSubmit={handleTranslate} className="space-y-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E1D8]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">Source Language</label>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A3C40]"
                    >
                      <option value="en">English</option>
                      <option value="tl">Tagalog (Filipino)</option>
                      <option value="es">Spanish</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">Target Language</label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#1A3C40]"
                    >
                      <option value="hil">Hiligaynon / Ilonggo (Local Dialect)</option>
                      <option value="tl">Tagalog (Filipino)</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">Enter Phrase</label>
                  <textarea
                    rows={2}
                    value={translateInput}
                    onChange={(e) => setTranslateInput(e.target.value)}
                    placeholder="e.g. Where is the sunset deck? / How much is the boat?"
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A3C40]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isTranslating}
                  className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>{isTranslating ? "Translating..." : "Translate to Hiligaynon"}</span>
                </button>

                {/* Translation Output Card */}
                {translatedResult && (
                  <div className="p-5 rounded-2xl bg-[#F5F2ED] border border-[#E5E1D8] space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#C9A66B] tracking-wider">
                        Hiligaynon / Ilonggo Translation
                      </span>
                      <button
                        type="button"
                        onClick={() => speakTranslation(translatedResult)}
                        className="px-3 py-1 rounded-full bg-white text-[#1A3C40] border border-[#E5E1D8] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer shadow-sm"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#C9A66B]" />
                        <span>Listen</span>
                      </button>
                    </div>

                    <p className="font-serif text-2xl font-bold text-[#1A3C40]">
                      “{translatedResult}”
                    </p>

                    {pronunciationGuide && (
                      <p className="text-xs text-[#8C827A] italic font-mono">
                        Phonetic: {pronunciationGuide}
                      </p>
                    )}
                  </div>
                )}
              </form>

              {/* Quick Negrense Phrasebook */}
              <div className="space-y-2.5">
                <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#8C827A]">
                  Essential Sipalay Local Phrases
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {[
                    { en: "Good morning / day", hil: "Maayong aga / Maayong adlaw" },
                    { en: "Thank you very much", hil: "Madamo gid nga salamat" },
                    { en: "It is very delicious!", hil: "Manamit gid ini!" },
                    { en: "Where is the boat to Tinagong Dagat?", hil: "Diin ang sakayan pakadto sa Tinagong Dagat?" },
                    { en: "How much is this?", hil: "Tagpila ini?" },
                    { en: "Take care on the trip", hil: "Halong gid sa biyahe" },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setTranslateInput(p.en);
                        setTranslatedResult(p.hil);
                      }}
                      className="p-3.5 rounded-2xl bg-white border border-[#E5E1D8] hover:bg-[#F5F2ED] transition-colors cursor-pointer flex items-center justify-between shadow-sm"
                    >
                      <div>
                        <span className="text-[#8C827A] block font-light text-[11px]">{p.en}</span>
                        <span className="font-bold text-[#1A3C40] font-serif text-sm">{p.hil}</span>
                      </div>
                      <Volume2
                        className="w-4 h-4 text-gray-400 hover:text-[#1A3C40]"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakTranslation(p.hil);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. COLLABORATIVE TRIP PLANNER TAB */}
          {activeTab === "itinerary" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#1A3C40]">
                    {itineraries[0]?.title || "Sipalay Trip Planner"}
                  </h4>
                  <p className="text-xs text-[#5A5A5A] font-light">
                    Collaborate with your barkada or partner. Offline accessible.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.origin + "#itinerary");
                      alert("Itinerary share link copied!");
                    }}
                    className="px-4 py-2 rounded-full bg-white border border-[#E5E1D8] text-xs font-bold uppercase tracking-wider text-[#1A3C40] flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Share with Friends</span>
                  </button>
                </div>
              </div>

              {/* Itinerary Schedule List */}
              <div className="space-y-3">
                {itineraries[0]?.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-white border border-[#E5E1D8] shadow-sm flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="px-3 py-1.5 rounded-full bg-[#F5F2ED] text-[#1A3C40] font-bold text-[10px] uppercase tracking-wider shrink-0 border border-[#E5E1D8]">
                        Day {item.day} • {item.time}
                      </span>
                      <div>
                        <h5 className="font-serif font-bold text-base text-[#1A3C40]">{item.title}</h5>
                        <span className="text-xs text-[#C9A66B] flex items-center gap-1 mt-0.5 font-medium">
                          📍 {item.location}
                        </span>
                        <p className="text-xs text-[#5A5A5A] mt-1.5 leading-relaxed font-light">{item.notes}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteItineraryItem(item.id)}
                      className="text-gray-400 hover:text-rose-600 p-1.5 cursor-pointer transition-colors"
                      title="Remove activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Activity Form */}
              <form onSubmit={handleAddItineraryItem} className="p-5 sm:p-6 rounded-3xl bg-[#F5F2ED] border border-[#E5E1D8] space-y-3 text-xs">
                <span className="font-bold text-[#1A3C40] block uppercase tracking-wider text-[10px]">
                  Add Spot / Activity to Schedule
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A5A] block mb-1">Day</label>
                    <select
                      value={newPlanDay}
                      onChange={(e) => setNewPlanDay(Number(e.target.value))}
                      className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3 py-2 text-[#1A3C40]"
                    >
                      <option value={1}>Day 1 (Arrival &amp; Bonfire)</option>
                      <option value={2}>Day 2 (Diving &amp; Islands)</option>
                      <option value={3}>Day 3 (Sunrise &amp; Departure)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A5A] block mb-1">Time</label>
                    <input
                      type="text"
                      value={newPlanTime}
                      onChange={(e) => setNewPlanTime(e.target.value)}
                      placeholder="e.g. 02:00 PM"
                      className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3 py-2 text-[#1A3C40]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A5A] block mb-1">Activity Title</label>
                    <input
                      type="text"
                      required
                      value={newPlanTitle}
                      onChange={(e) => setNewPlanTitle(e.target.value)}
                      placeholder="e.g. Snorkeling at Campomanes Bay"
                      className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3 py-2 text-[#1A3C40]"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPlanNotes}
                    onChange={(e) => setNewPlanNotes(e.target.value)}
                    placeholder="Notes, gear needed, or entrance fees..."
                    className="flex-1 bg-white border border-[#E5E1D8] rounded-full px-4 py-2 text-[#1A3C40]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full font-bold uppercase tracking-wider text-xs text-white bg-[#1A3C40] hover:bg-[#132E31] flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Add Item</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 5. OFFLINE & CLOUD SYNC TAB */}
          {activeTab === "offline" && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F5F2ED] border border-[#E5E1D8] text-xs font-bold uppercase tracking-wider mb-2">
                  {isOnline ? (
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <Wifi className="w-3.5 h-3.5" /> Cloud Sync Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-amber-700">
                      <WifiOff className="w-3.5 h-3.5" /> Offline Mode Active
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#1A3C40]">
                  Cross-Device Cloud Sync &amp; Offline Backup
                </h4>
                <p className="text-xs text-[#5A5A5A] mt-1 font-light">
                  Access your room bookings, itineraries, and rewards anywhere, even without Wi-Fi in remote beach coves.
                </p>
              </div>

              {/* Export Backup Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E1D8] space-y-3.5 shadow-sm">
                <h5 className="font-bold text-sm text-[#1A3C40]">1. Generate Device Sync Payload</h5>
                <p className="text-xs text-[#5A5A5A] font-light">
                  Exports all your current saved bookings, trip itineraries, and Glow loyalty points into a transferable sync string.
                </p>
                <button
                  onClick={handleGenerateBackup}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Copy className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>Generate &amp; Copy Sync Payload</span>
                </button>
                {generatedCode && (
                  <textarea
                    readOnly
                    rows={2}
                    value={generatedCode}
                    className="w-full bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl p-3 text-[10px] font-mono text-gray-600"
                  />
                )}
              </div>

              {/* Import Restore Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E1D8] space-y-3.5 shadow-sm">
                <h5 className="font-bold text-sm text-[#1A3C40]">2. Restore Data on Another Device</h5>
                <p className="text-xs text-[#5A5A5A] font-light">
                  Paste a sync payload generated from your phone or laptop to instantly restore all itineraries and bookings.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste sync code here..."
                    value={syncCodeInput}
                    onChange={(e) => setSyncCodeInput(e.target.value)}
                    className="flex-1 bg-[#FDFBF7] border border-[#E5E1D8] rounded-full px-4 py-2 text-xs font-mono text-[#1A3C40]"
                  />
                  <button
                    onClick={handleRestoreBackup}
                    className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] transition-colors cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
              </div>

              {syncSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-in fade-in">
                  {syncSuccess}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-8 bg-white border-t border-[#E5E1D8] flex items-center justify-between">
          <span className="text-[11px] text-[#8C827A] font-light">
            Alon &amp; Aninag Traveler Suite • Poblacion Beach, Sipalay City
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A3C40] bg-[#F5F2ED] hover:bg-[#E5E1D8] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
