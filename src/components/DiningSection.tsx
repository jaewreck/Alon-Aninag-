import React, { useState } from "react";
import {
  Utensils,
  Coffee,
  Flame,
  Wine,
  Sparkles,
  Check,
  ShoppingBag,
  Plus,
  Minus,
  Clock,
  MapPin,
  Send,
} from "lucide-react";
import { MENU_ITEMS, DINING_NEGRENSE_IMAGE, RESORT_DETAILS } from "../data/resortData";
import { MenuItem } from "../types";
import { CurrencyCode, formatPrice } from "../utils/currency";

interface DiningSectionProps {
  currentCurrency: CurrencyCode;
}

export const DiningSection: React.FC<DiningSectionProps> = ({ currentCurrency }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("Room Delivery (Enter Room #)");
  const [roomNumber, setRoomNumber] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const categories = [
    { id: "all", label: "All Menus" },
    { id: "Negrense Specialties", label: "Negrense Heritage" },
    { id: "Breakfast", label: "Sunrise Breakfast" },
    { id: "Lunch & Dinner", label: "Lunch & Dinner" },
    { id: "Sunset Cocktails & Beverages", label: "Sunset Cocktails" },
    { id: "Desserts & Coffee", label: "Dessert & Artisan Coffee" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const totalCartCount: number = (Object.values(cart) as number[]).reduce((sum: number, qty: number) => sum + qty, 0);
  const totalCartPrice: number = Object.entries(cart).reduce((sum: number, [id, qty]) => {
    const item = MENU_ITEMS.find((m) => m.id === id);
    return sum + (item ? item.price * (qty as number) : 0);
  }, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setCart({});
      setOrderModalOpen(false);
      setRoomNumber("");
    }, 3500);
  };

  return (
    <section id="dining" className="py-24 bg-[#FDFBF7] border-b border-[#E5E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F2ED] text-[#1A3C40] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 border border-[#E5E1D8]">
            <Utensils className="w-3.5 h-3.5 text-[#C9A66B]" />
            Beachfront Bistro &amp; Café
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3C40] tracking-tight">
            Authentic Negrense <span className="italic font-light text-[#C9A66B]">Soul Food</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5A5A5A] mt-3 leading-relaxed">
            From smoky Chicken Inasal and batwan-infused KBL soup to freshly caught yellowfin tuna kinilaw and Don Papa rum twilight cocktails.
          </p>
        </div>

        {/* Aninag Hour Golden Coffee Banner */}
        <div className="mb-16 rounded-3xl bg-[#1A3C40] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-[#254F54]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A66B]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-[#E5D2AD] text-[10px] font-bold uppercase tracking-[0.2em]">
                <Coffee className="w-3.5 h-3.5 text-[#C9A66B]" />
                Daily Sunset Ritual
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                Aninag Hour: Where the Sunset Meets Fresh Negrense Brew
              </h3>
              <p className="text-xs sm:text-sm text-[#E5E1D8] leading-relaxed font-light">
                Every afternoon from <strong className="text-[#C9A66B]">5:15 PM to 6:15 PM</strong>, join fellow travelers on our wooden sunset deck facing west. All checked-in guests enjoy complimentary freshly brewed Negros highland drip coffee, warm native snacks, glowing paper lanterns, and soothing acoustic melodies.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#E5D2AD]">
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20">
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  100% Free for In-House Guests
                </span>
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20">
                  <Flame className="w-3.5 h-3.5 text-[#C9A66B]" />
                  Followed by Beach Bonfire
                </span>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-xl border border-white/20">
              <img
                src={DINING_NEGRENSE_IMAGE}
                alt="Aninag Beachfront Dining Spread"
                className="w-full h-60 object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Menu Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-[#E5E1D8]">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#1A3C40] text-white shadow-md shadow-[#1A3C40]/25"
                    : "bg-white text-[#5A5A5A] hover:text-[#1A3C40] hover:bg-[#F5F2ED] border border-[#E5E1D8]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cart Tray Floating Trigger */}
          {totalCartCount > 0 && (
            <button
              onClick={() => setOrderModalOpen(true)}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-[#C9A66B] hover:bg-[#B89355] shadow-lg shadow-black/20 flex items-center gap-2 animate-bounce"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                Room Service Tray ({totalCartCount}) • {formatPrice(totalCartPrice, currentCurrency)}
              </span>
            </button>
          )}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E5E1D8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-[#1A3C40]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {item.isSignature && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1A3C40] text-[#E5D2AD] text-[9px] font-bold uppercase tracking-widest border border-[#254F54] shadow">
                      Negrense Signature
                    </span>
                  )}
                  {item.isSpicy && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                      🌶️ Spicy
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div>
                    {item.localName && (
                      <span className="text-[11px] font-serif italic text-[#C9A66B] block">
                        {item.localName}
                      </span>
                    )}
                    <h4 className="font-serif text-base font-bold text-[#1A3C40] line-clamp-1">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5A5A5A] line-clamp-3 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-[#E5E1D8] mt-2">
                <span className="font-serif text-base font-bold text-[#1A3C40]">
                  {formatPrice(item.price, currentCurrency)}
                </span>

                {cart[item.id] ? (
                  <div className="flex items-center gap-2 bg-[#F5F2ED] px-2.5 py-1 rounded-full border border-[#E5E1D8]">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 rounded-full bg-white text-[#1A3C40] flex items-center justify-center text-xs font-bold hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-[#1A3C40] px-1">
                      {cart[item.id]}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-6 h-6 rounded-full bg-[#1A3C40] text-white flex items-center justify-center text-xs font-bold hover:bg-[#132E31]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A3C40] bg-[#F5F2ED] hover:bg-[#EAE5DC] border border-[#E5E1D8] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Order</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Service / Beachside Order Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E5E1D8] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#C9A66B]" />
                <h3 className="font-serif font-bold text-lg text-[#1A3C40]">
                  Room Service &amp; Beachside Order
                </h3>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {orderSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#1A3C40]">
                  Order Sent to Kitchen!
                </h4>
                <p className="text-xs text-[#5A5A5A] leading-relaxed max-w-xs mx-auto">
                  Our chef is preparing your Negrense dishes. Freshly delivered to{" "}
                  <strong>{deliveryLocation}</strong> in 20–25 minutes. Charge will be billed to your room folio.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="mt-4 space-y-4">
                {/* Selected Items */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = MENU_ITEMS.find((m) => m.id === id);
                    if (!item) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E5E1D8] text-xs"
                      >
                        <div>
                          <span className="font-semibold text-[#1A3C40] block">{item.name}</span>
                          <span className="text-[11px] text-[#C9A66B] font-bold">
                            {formatPrice(item.price, currentCurrency)} x {qty}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => removeFromCart(id)}
                            className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold px-1">{qty}</span>
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E1D8]">
                  <span className="font-semibold text-xs text-[#1A3C40] uppercase tracking-wider">Order Total</span>
                  <span className="font-serif text-lg font-bold text-[#1A3C40]">
                    {formatPrice(totalCartPrice, currentCurrency)}
                  </span>
                </div>

                {/* Delivery Spot */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] mb-1.5 block">
                    Deliver To:
                  </label>
                  <select
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-[#1A3C40]"
                  >
                    <option value="Room Delivery">Guest Room</option>
                    <option value="Sunset Wooden Deck Beanbags">Sunset Wooden Deck Beanbags</option>
                    <option value="Beachfront Sand Sunbed">Beachfront Sand Sunbed</option>
                    <option value="Bonfire Firepit Lounge">Bonfire Firepit Lounge</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A5A] mb-1.5 block">
                    Room Number / Guest Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 4 - Maria Santos"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-white border border-[#E5E1D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A3C40] focus:outline-none focus:ring-2 focus:ring-[#1A3C40]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full font-bold text-xs uppercase tracking-widest text-white bg-[#1A3C40] hover:bg-[#132E31] shadow-lg shadow-[#1A3C40]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#C9A66B]" />
                  <span>Send Order to Bistro Kitchen</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
