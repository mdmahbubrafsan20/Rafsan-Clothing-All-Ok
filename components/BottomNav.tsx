"use client";

import { useState } from "react";
import { Home, LayoutGrid, ShoppingCart, MessageCircle, User, X, Send } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CategoryDrawer from "@/components/CategoryDrawer";

function MiniChatWidget({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([
    { from: "bot", text: "হ্যালো! 👋 Rafsan Clothing-এ স্বাগতম। আমি কীভাবে সাহায্য করতে পারি?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const QUICK_REPLIES = ["অর্ডার করতে চাই", "ডেলিভারি কতদিন?", "Return Policy কী?", "WhatsApp এ কথা বলুন"];

  const getBotReply = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes("whatsapp") || t.includes("হোয়াটসঅ্যাপ"))
      return "আমাদের WhatsApp নম্বর: +880 1610-735064 — সরাসরি message করুন 📲";
    if (t.includes("delivery") || t.includes("ডেলিভারি"))
      return "ঢাকার ভেতরে ১-২ কার্যদিবস, ঢাকার বাইরে ২-৪ কার্যদিবস। ৳৯৯৯+ অর্ডারে ফ্রি ডেলিভারি! 🚚";
    if (t.includes("return") || t.includes("রিটার্ন") || t.includes("policy"))
      return "৭ দিনের মধ্যে সহজ Return ও Exchange সুবিধা। পণ্য অক্ষত থাকতে হবে। বিস্তারিত: therafsan.com/returns";
    if (t.includes("অর্ডার") || t.includes("order") || t.includes("কিনতে"))
      return "অর্ডার করতে পণ্য select করে 'Buy Now' চাপুন অথবা WhatsApp করুন: +880 1610-735064 📦";
    if (t.includes("price") || t.includes("দাম") || t.includes("কত"))
      return "আমাদের পণ্যের দাম ৳২৯৯ থেকে শুরু। সব পণ্য দেখুন: therafsan.com/products";
    if (t.includes("size") || t.includes("সাইজ"))
      return "প্রতিটি পণ্যের page-এ Size Chart দেওয়া আছে। সাধারণত S, M, L, XL, XXL পাওয়া যায়।";
    if (t.includes("payment") || t.includes("পেমেন্ট") || t.includes("bkash") || t.includes("নগদ"))
      return "Cash on Delivery, bKash, Nagad, Rocket ও Credit Card গ্রহণযোগ্য। 💳";
    return "ধন্যবাদ আপনার প্রশ্নের জন্য! আরও সাহায্যের জন্য WhatsApp করুন: +880 1610-735064 😊";
  };

  const sendMessage = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: getBotReply(msg) }]);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 mx-3 z-50 rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden flex flex-col" style={{ maxHeight: "70vh" }}>
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-gray-900 font-bold text-xs">R</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Rafsan Clothing</p>
            <p className="text-xs text-gray-300">সাধারণত কয়েক ঘণ্টার মধ্যে reply করি</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50" style={{ minHeight: 180 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
              msg.from === "user"
                ? "bg-gray-900 text-white rounded-br-sm"
                : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm">
              <span className="text-gray-400 text-xs">লিখছে...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div className="px-3 pt-2 pb-1 flex gap-2 overflow-x-auto bg-white border-t border-gray-100">
        {QUICK_REPLIES.map((qr) => (
          <button key={qr} onClick={() => sendMessage(qr)}
            className="shrink-0 text-xs px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors">
            {qr}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-gray-100">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="আপনার প্রশ্ন লিখুন..."
          className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 outline-none focus:border-gray-400 bg-gray-50"
        />
        <button onClick={() => sendMessage()}
          className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center shrink-0">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const navItems = [
    { id: "home", icon: Home, label: "Home", href: "/", isButton: false },
    { id: "category", icon: LayoutGrid, label: "Category", href: null, isButton: true },
    { id: "cart", icon: ShoppingCart, label: "Cart", href: "/cart", isButton: false },
    { id: "chat", icon: MessageCircle, label: "Chat", href: null, isButton: true },
    { id: "login", icon: User, label: "Login", href: "/login", isButton: false },
  ];

  const isActive = (href: string | null, id: string) => {
    if (id === "category") return categoryOpen;
    if (id === "chat") return chatOpen;
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <CategoryDrawer open={categoryOpen} onClose={() => setCategoryOpen(false)} />
      {chatOpen && <MiniChatWidget onClose={() => setChatOpen(false)} />}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-16 md:hidden">
        <div className="flex items-center justify-around h-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.id);

            if (item.isButton) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === "category") {
                      setCategoryOpen(true);
                      setChatOpen(false);
                    } else if (item.id === "chat") {
                      setChatOpen((prev) => !prev);
                      setCategoryOpen(false);
                    }
                  }}
                  className={`flex flex-col items-center justify-center w-full h-full py-2 transition-colors ${
                    active ? "text-black" : "text-gray-500"
                  }`}
                  aria-label={item.label}
                >
                  <div className="relative">
                    <Icon className={`w-6 h-6 ${active ? "stroke-2" : ""}`} />
                    {active && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${active ? "font-semibold" : "font-medium"}`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href || "/"}
                className={`flex flex-col items-center justify-center w-full h-full py-2 transition-colors ${
                  active ? "text-black" : "text-gray-500"
                }`}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${active ? "stroke-2" : ""}`} />
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
                  )}
                </div>
                <span className={`text-xs mt-1 ${active ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
