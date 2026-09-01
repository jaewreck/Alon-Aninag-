import React, { useState } from "react";
import {
  X,
  User,
  Lock,
  Mail,
  Crown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  if (!isOpen) return null;

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const userObj: UserProfile = {
      id: `user-${Date.now()}`,
      name: name || (email.split("@")[0].toUpperCase()),
      email: email,
      glowPoints: 450,
      memberTier: "Silver Twilight",
      bookingsCount: 2,
    };

    onLoginSuccess(userObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E5E1D8] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1A3C40] text-white px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between border-b border-[#254F54]">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-[#C9A66B]" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                {currentUser ? "Member Profile" : isRegister ? "Join Alon Glow Club" : "Member Sign In"}
              </h3>
              <p className="text-[11px] text-[#A3B8BA] font-light">
                Alon &amp; Aninag Guest Portal
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
        <div className="p-6 sm:p-8">
          {currentUser ? (
            <div className="space-y-4">
              <div className="text-center py-3">
                <div className="w-16 h-16 rounded-full bg-[#1A3C40] text-[#C9A66B] flex items-center justify-center font-bold text-xl mx-auto shadow-md border border-[#C9A66B]/30">
                  {currentUser.name.charAt(0)}
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#1A3C40] mt-2">
                  {currentUser.name}
                </h4>
                <span className="text-xs text-[#8C827A] font-light">{currentUser.email}</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F2ED] border border-[#E5E1D8] flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#8C827A] tracking-wider block">
                    Glow Club Status
                  </span>
                  <span className="font-serif font-bold text-base text-[#1A3C40]">
                    {currentUser.memberTier}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-[#8C827A] tracking-wider block">
                    Glow Points
                  </span>
                  <span className="font-serif text-xl font-bold text-[#C9A66B]">
                    {currentUser.glowPoints} pts
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-4 py-2.5 text-xs text-[#1A3C40] focus:outline-none focus:ring-1 focus:ring-[#1A3C40]"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. guest@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-4 py-2.5 text-xs text-[#1A3C40] focus:outline-none focus:ring-1 focus:ring-[#1A3C40]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-4 py-2.5 text-xs text-[#1A3C40] focus:outline-none focus:ring-1 focus:ring-[#1A3C40]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-lg shadow-[#1A3C40]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isRegister ? "Create Account & Get 100 Pts" : "Sign In to Portal"}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs text-[#1A3C40] hover:underline font-bold"
                >
                  {isRegister
                    ? "Already have an account? Sign In"
                    : "New traveler? Join Alon Glow Club (Free 100 Pts)"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
