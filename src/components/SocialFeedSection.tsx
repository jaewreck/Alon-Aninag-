import React, { useState } from "react";
import {
  Camera,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Upload,
  Check,
  Send,
  MapPin,
} from "lucide-react";
import { SOCIAL_POSTS, HERO_RESORT_IMAGE } from "../data/resortData";
import { SocialPost } from "../types";

export const SocialFeedSection: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>(SOCIAL_POSTS);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [userLocation, setUserLocation] = useState("Sipalay City");
  const [caption, setCaption] = useState("");
  const [selectedTag, setSelectedTag] = useState("#SunsetDeck");
  const [previewImage, setPreviewImage] = useState<string>(HERO_RESORT_IMAGE);

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.userLiked;
          return {
            ...p,
            userLiked: isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !caption) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      author: authorName,
      location: userLocation,
      date: "Just now",
      likes: 1,
      userLiked: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      image: previewImage,
      caption,
      tag: selectedTag,
    };

    setPosts([newPost, ...posts]);
    setUploadModalOpen(false);
    setAuthorName("");
    setCaption("");
  };

  return (
    <section id="gallery" className="py-24 bg-[#FDFBF7] border-b border-[#E5E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F2ED] text-[#1A3C40] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 border border-[#E5E1D8]">
              <Camera className="w-3.5 h-3.5 text-[#C9A66B]" />
              #GlowAtAlon Guest Stories &amp; Polaroid Wall
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3C40] tracking-tight">
              Captured Moments &amp; <span className="italic font-light text-[#C9A66B]">Sunset Memories</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A] mt-3 max-w-2xl leading-relaxed font-light">
              See how our travelers rest, connect, and glow. Share your favorite Sipalay photos to join our community wall.
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-lg shadow-[#1A3C40]/25 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#C9A66B]" />
            <span>Post Your Photo &amp; Story</span>
          </button>
        </div>

        {/* Social Contest Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#F5F2ED] border border-[#E5E1D8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1A3C40] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#C9A66B]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#1A3C40]">
                Monthly #GlowAtAlon Photo Contest
              </h4>
              <p className="text-xs text-[#5A5A5A] mt-0.5 font-light">
                Tag <strong className="text-[#1A3C40]">@AlonAninagResort</strong> and <strong className="text-[#1A3C40]">#GlowAtAlon</strong> on TikTok or Instagram. Top monthly photo wins a 2-Night Sunset Balcony stay!
              </p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-full bg-white text-[#1A3C40] text-xs font-bold uppercase tracking-wider border border-[#E5E1D8] shadow-sm whitespace-nowrap">
            🏆 Monthly Winner Picked 1st of Month
          </span>
        </div>

        {/* Polaroid Cards Feed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-5 pb-6 rounded-3xl border border-[#E5E1D8] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-9 h-9 rounded-full object-cover border border-[#E5E1D8]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#1A3C40] block">{post.author}</span>
                      <span className="text-[10px] text-[#8C827A] flex items-center gap-1 font-medium">
                        <MapPin className="w-2.5 h-2.5 text-[#C9A66B]" />
                        {post.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#8C827A] font-semibold">{post.date}</span>
                </div>

                {/* Polaroid Photo Frame */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#1A3C40] mb-3.5 shadow-inner">
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#1A3C40]/80 backdrop-blur-sm text-[#E5D2AD] text-[10px] font-bold uppercase tracking-wider border border-white/20">
                    {post.tag}
                  </span>
                </div>

                {/* Caption */}
                <p className="text-xs text-[#5A5A5A] leading-relaxed font-light">
                  {post.caption}
                </p>
              </div>

              {/* Interactions Bar */}
              <div className="pt-3.5 border-t border-[#E5E1D8] mt-4 flex items-center justify-between">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    post.userLiked ? "text-rose-600" : "text-[#5A5A5A] hover:text-rose-600"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.userLiked ? "fill-rose-600" : ""}`} />
                  <span>{post.likes}</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-[#8C827A]">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span className="text-[11px] font-medium">Story Verified</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Story Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E5E1D8] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
              <h3 className="font-serif font-bold text-lg text-[#1A3C40]">
                Post to #GlowAtAlon Wall
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitStory} className="mt-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                  Your Name / Barkada Handle *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya & Friends"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A3C40] focus:outline-none focus:ring-2 focus:ring-[#1A3C40]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                  Tag / Location at Resort
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs font-medium text-[#1A3C40]"
                >
                  <option value="#SunsetDeck">#SunsetDeck (Aninag Hour)</option>
                  <option value="#BonfireNights">#BonfireNights (Beach Firepit)</option>
                  <option value="#OceanfrontVilla">#OceanfrontVilla (Amihan Suite)</option>
                  <option value="#SipalayDiving">#SipalayDiving (Julian's Wreck)</option>
                  <option value="#NegrenseFood">#NegrenseFood (Chicken Inasal)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                  Upload Photo (JPEG/PNG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-[#F5F2ED] file:text-[#1A3C40] hover:file:bg-[#EAE5DC]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] block mb-1">
                  Your Sipalay Experience / Review *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us what made your soul glow during your stay..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A3C40] focus:outline-none focus:ring-2 focus:ring-[#1A3C40]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full font-bold text-xs uppercase tracking-widest text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-lg shadow-[#1A3C40]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#C9A66B]" />
                <span>Share Story</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
