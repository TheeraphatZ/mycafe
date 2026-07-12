"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Force refreshing the route so middleware catches the new session
      router.refresh();
      router.push("/admin");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E5] flex items-center justify-center px-6 py-12 relative overflow-hidden font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#4A2C1A]/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-[#4A2C1A]/5 relative z-10">
        <div className="text-center mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full overflow-hidden mx-auto border-2 border-[#C6A15B] shadow-sm mb-4">
            <img
              src="/images/logo.png"
              alt="Daily Dose Café"
              className="w-full h-full object-cover"
              onError={(e) => {
                // If logo doesn't exist, show cup emoji
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span class="text-4xl">☕</span>';
              }}
            />
          </div>
          <h2 className="text-3xl font-bold text-[#4A2C1A]">ผู้ดูแลระบบ</h2>
          <p className="text-sm text-gray-500 mt-2">
            Daily Dose Café • ลงชื่อเข้าใช้งานจัดการหลังบ้าน
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-800 text-sm animate-shake">
            <span className="text-lg">⚠️</span>
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#4A2C1A] block mb-1.5">
              อีเมลผู้ใช้งาน (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@dailydose.com"
              className="w-full bg-[#F7F1E5]/40 border border-stone-300 text-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A15B]/50 focus:bg-white transition-all placeholder-gray-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#4A2C1A] block mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F7F1E5]/40 border border-stone-300 text-stone-800 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A15B]/50 focus:bg-white transition-all placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#1C1C1C] hover:bg-[#C6A15B] hover:text-[#1C1C1C] text-[#F7F1E5] font-semibold text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:text-gray-500"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#F7F1E5] border-t-transparent rounded-full animate-spin" />
                กำลังเข้าระบบ...
              </>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-black/5 text-center">
          <a
            href="/"
            className="text-xs font-semibold text-[#8B5E3C] hover:text-[#4A2C1A] transition-colors"
          >
            ← กลับไปที่หน้าร้านค้าหลัก
          </a>
        </div>
      </div>
    </div>
  );
}
