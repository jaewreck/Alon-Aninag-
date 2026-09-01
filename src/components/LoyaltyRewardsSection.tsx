import React, { useState } from "react";
import {
  Sparkles,
  Gift,
  Award,
  Crown,
  CheckCircle,
  Copy,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { LOYALTY_REWARDS } from "../data/resortData";
import { LoyaltyReward } from "../types";

interface LoyaltyRewardsSectionProps {
  userGlowPoints?: number;
  userName?: string;
  onRedeemReward?: (reward: LoyaltyReward) => void;
}

export const LoyaltyRewardsSection: React.FC<LoyaltyRewardsSectionProps> = ({
  userGlowPoints = 350,
  userName = "Guest",
  onRedeemReward,
}) => {
  const [points, setPoints] = useState<number>(userGlowPoints);
  const [redeemedCode, setRedeemedCode] = useState<{ title: string; code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRedeem = (reward: LoyaltyReward) => {
    if (points < reward.pointsRequired) {
      alert(`You need ${reward.pointsRequired} Glow Points to claim this reward. Keep booking & posting!`);
      return;
    }
    setPoints((prev) => prev - reward.pointsRequired);
    setRedeemedCode({ title: reward.title, code: reward.code });
    if (onRedeemReward) onRedeemReward(reward);
  };

  const copyCode = () => {
    if (redeemedCode) {
      navigator.clipboard?.writeText(redeemedCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="loyalty" className="py-24 bg-[#FDFBF7] border-b border-[#E5E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F2ED] text-[#1A3C40] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 border border-[#E5E1D8]">
            <Crown className="w-3.5 h-3.5 text-[#C9A66B]" />
            Alon Glow Club Rewards
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3C40] tracking-tight">
            Rest. Glow. <span className="italic font-light text-[#C9A66B]">Repeat.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5A5A5A] mt-3 leading-relaxed font-light">
            Our loyalty circle created for repeat travelers and sunset seekers. Earn points automatically on every direct booking and social share to unlock free dining, island tours, and villa upgrades.
          </p>
        </div>

        {/* Member Status Card */}
        <div className="max-w-4xl mx-auto mb-16 rounded-3xl bg-[#1A3C40] text-white p-6 sm:p-10 shadow-2xl border border-[#254F54] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A66B]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-2 text-center md:text-left relative z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A66B] font-bold">
              Member Status: Silver Twilight
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {userName}’s Glow Portal
            </h3>
            <p className="text-xs text-[#E5E1D8] max-w-md font-light leading-relaxed">
              Earn <strong>100 pts</strong> per night stayed, <strong>50 pts</strong> for dining, and <strong>20 pts</strong> for posting with #GlowAtAlon.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/20 text-center min-w-[220px] relative z-10">
            <span className="text-[10px] text-[#E5D2AD] uppercase tracking-[0.2em] block font-bold">
              Available Glow Balance
            </span>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C9A66B] block mt-1">
              {points} <span className="text-xs font-sans text-white/80 font-normal">pts</span>
            </span>
            <span className="text-[10px] text-emerald-300 font-medium block mt-1">
              ✓ Ready to redeem rewards below
            </span>
          </div>
        </div>

        {/* Rewards Catalog */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LOYALTY_REWARDS.map((reward) => {
            const canAfford = points >= reward.pointsRequired;
            return (
              <div
                key={reward.id}
                className="bg-white rounded-3xl p-6 border border-[#E5E1D8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A3C40] bg-[#F5F2ED] px-3 py-1 rounded-full border border-[#E5E1D8]">
                      {reward.category}
                    </span>
                    <span className="font-serif font-bold text-sm text-[#C9A66B]">
                      {reward.pointsRequired} pts
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-[#1A3C40]">
                    {reward.title}
                  </h4>

                  <p className="text-xs text-[#5A5A5A] leading-relaxed font-light">
                    {reward.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E1D8] mt-4">
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      canAfford
                        ? "bg-[#1A3C40] hover:bg-[#132E31] text-white shadow-md shadow-[#1A3C40]/20 cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {canAfford ? "Redeem Voucher" : `Need ${reward.pointsRequired - points} more pts`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Redeemed Voucher Modal Banner */}
        {redeemedCode && (
          <div className="mt-8 max-w-xl mx-auto p-4 rounded-2xl bg-[#F5F2ED] border border-[#C9A66B]/40 text-[#1A3C40] flex items-center justify-between gap-4 animate-in fade-in">
            <div>
              <span className="text-xs font-bold block">🎉 Reward Claimed: {redeemedCode.title}</span>
              <p className="text-xs mt-0.5 font-mono bg-white px-2.5 py-0.5 rounded-full border border-[#E5E1D8] inline-block font-bold text-[#1A3C40]">
                {redeemedCode.code}
              </p>
            </div>
            <button
              onClick={copyCode}
              className="px-4 py-2 rounded-full bg-[#1A3C40] hover:bg-[#132E31] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
