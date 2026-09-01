import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Coffee,
  MapPin,
  Anchor,
  HelpCircle,
} from "lucide-react";
import { ChatMessage } from "../types";

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: "Maayong adlaw! 🌅 I am **Ate Sol**, your virtual concierge at Alon & Aninag Boutique Beach Resort in Sipalay. How may I make your stay memorable today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "How do I travel to Sipalay from Bacolod?",
    "What time is the daily sunset coffee?",
    "How to book Julian's WWII wreck dive?",
    "Do you have fast Wi-Fi for remote work?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Build conversation history payload
      const history = messages.map((m) => ({
        role: m.sender === "ai" ? "model" : "user",
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history }),
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: data.reply || "Maayong adlaw! We are excited to welcome you to Alon & Aninag. Please let us know if you need anything else!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      const errorReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: "Maayong adlaw! I am having a brief connection hitch, but our front desk is on stand-by. You can also reach us via phone or at frontdesk@alonaninag.ph!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#1A3C40] text-white shadow-2xl hover:bg-[#132E31] hover:scale-105 transition-all duration-300 cursor-pointer border border-[#254F54]"
          aria-label="Open Ate Sol Live Chat"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-[#C9A66B]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C9A66B] border-2 border-[#1A3C40] animate-pulse"></span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold block leading-none tracking-wide">Chat with Ate Sol</span>
            <span className="text-[10px] text-[#E5D2AD] leading-none mt-1 block font-light">AI Sipalay Concierge</span>
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[550px] max-h-[85vh] bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#E5E1D8] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#1A3C40] text-white px-5 py-4 flex items-center justify-between border-b border-[#254F54]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#C9A66B] flex items-center justify-center text-[#1A3C40] font-bold text-xs shadow">
                  AS
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1A3C40]"></span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
                  <span>Ate Sol</span>
                  <span className="text-[9px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-[#E5D2AD] uppercase tracking-wider">
                    Concierge AI
                  </span>
                </h4>
                <p className="text-[10px] text-[#A3B8BA] font-light">
                  Alon &amp; Aninag Boutique Resort, Sipalay
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDFBF7]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-[#C9A66B] text-[#1A3C40] flex items-center justify-center text-[10px] font-bold shrink-0 mt-1 shadow-sm">
                    AS
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#1A3C40] text-white rounded-br-none shadow-md shadow-[#1A3C40]/15"
                      : "bg-white text-[#1A3C40] border border-[#E5E1D8] rounded-tl-none shadow-sm font-light"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span
                    className={`text-[9px] block text-right mt-1.5 font-medium ${
                      m.sender === "user" ? "text-[#E5D2AD]" : "text-[#8C827A]"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#C9A66B] text-[#1A3C40] flex items-center justify-center text-[10px] font-bold shrink-0">
                  AS
                </div>
                <div className="bg-white text-[#1A3C40] border border-[#E5E1D8] rounded-2xl rounded-tl-none px-4 py-3 text-xs shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A3C40] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A3C40] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A3C40] animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-[#5A5A5A] ml-1">Ate Sol is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-[#F5F2ED] px-3 py-2 border-t border-[#E5E1D8] flex gap-1.5 overflow-x-auto">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-full text-[10px] font-semibold bg-white text-[#1A3C40] hover:bg-[#1A3C40] hover:text-white border border-[#E5E1D8] whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#E5E1D8] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Ate Sol anything about Sipalay..."
              className="flex-1 bg-[#FDFBF7] border border-[#E5E1D8] rounded-full px-4 py-2.5 text-xs text-[#1A3C40] focus:outline-none focus:ring-1 focus:ring-[#1A3C40]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#1A3C40] hover:bg-[#132E31] text-white flex items-center justify-center transition-colors disabled:opacity-40 shrink-0 cursor-pointer shadow-md shadow-[#1A3C40]/20"
            >
              <Send className="w-4 h-4 text-[#C9A66B]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
