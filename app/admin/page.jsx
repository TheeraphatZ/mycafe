"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const supabase = createClient();
  const router = useRouter();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Menu items
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("menu")
        .select("*")
        .order("id", { ascending: true });

      if (fetchError) throw fetchError;
      setMenuItems(data || []);
    } catch (err) {
      console.error("Error loading menu:", err);
      setError(err.message || "ไม่สามารถโหลดข้อมูลเมนูได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;
      router.refresh();
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("ออกจากระบบไม่สำเร็จ");
    }
  };

  // Delete function
  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(`คุณต้องการลบเมนู "${item.name}" ใช่หรือไม่?`);
    if (!confirmDelete) return;

    setDeletingId(item.id);
    setError(null);
    setSuccessMsg("");

    try {
      // 1. Delete associated image from Supabase Storage if it's stored there
      if (item.image_url && item.image_url.includes("/storage/v1/object/public/menu-images/")) {
        const parts = item.image_url.split("/storage/v1/object/public/menu-images/");
        if (parts.length > 1) {
          const fileName = parts[1];
          const { error: storageError } = await supabase.storage
            .from("menu-images")
            .remove([fileName]);
          
          if (storageError) {
            console.warn("Storage deletion warning (might not exist):", storageError);
          }
        }
      }

      // 2. Delete row from menu table
      const { error: deleteError } = await supabase
        .from("menu")
        .delete()
        .eq("id", item.id);

      if (deleteError) throw deleteError;

      setSuccessMsg("ลบเมนูสำเร็จเรียบร้อย");
      // Remove from state
      setMenuItems(menuItems.filter((i) => i.id !== item.id));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      console.error("Failed to delete item:", err);
      setError(err.message || "ไม่สามารถลบข้อมูลเมนูได้");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E5] font-sans">
      {/* Header Banner */}
      <header className="bg-[#4A2C1A] text-[#F7F1E5] py-6 px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full overflow-hidden border border-[#C6A15B]">
              <img src="/images/logo.png" alt="Logo" className="w-full h-full object-cover" onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span class="text-2xl flex justify-center items-center h-full">☕</span>';
              }} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Daily Dose Café</h1>
              <p className="text-xs text-[#C6A15B]">ระบบจัดการหลังบ้าน (Admin Panel)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-5 py-2.5 rounded-full border border-[#C6A15B] text-sm font-medium hover:bg-[#C6A15B]/10 transition-all text-center"
            >
              ดูหน้าร้านค้า
            </Link>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-full bg-red-600/90 hover:bg-red-700 text-white text-sm font-medium transition-all cursor-pointer"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#4A2C1A]">รายการเมนูเครื่องดื่มและอาหาร</h2>
            <p className="text-gray-500 mt-1">ทั้งหมด {menuItems.length} รายการในฐานข้อมูล</p>
          </div>
          <Link
            href="/admin/menu/new"
            className="px-6 py-3 rounded-full bg-[#1C1C1C] hover:bg-[#C6A15B] text-[#F7F1E5] hover:text-[#1C1C1C] font-semibold text-sm transition-all duration-300 shadow-md flex items-center gap-2"
          >
            <span>+</span> เพิ่มเมนูใหม่
          </Link>
        </div>

        {/* Status Alerts */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-800 text-sm">
            <span className="text-lg">✅</span>
            <p className="font-semibold">{successMsg}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-sm">
            <span className="text-lg">⚠️</span>
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Table & Content States */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-[#4A2C1A]/5 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">กำลังโหลดข้อมูลเมนู...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 shadow-sm border border-[#4A2C1A]/5 text-center">
            <span className="text-6xl block mb-4">🍽️</span>
            <h3 className="text-xl font-bold text-[#4A2C1A]">ยังไม่มีเมนูในระบบ</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              คุณสามารถสร้างรายการเมนูใหม่เพื่อให้หน้าบ้านแสดงผลได้โดยการกดปุ่ม "เพิ่มเมนูใหม่" ด้านบน
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-[#4A2C1A]/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#4A2C1A]/5 text-[#4A2C1A] border-b border-[#4A2C1A]/10">
                    <th className="px-6 py-4 font-bold text-sm w-24">รูปภาพ</th>
                    <th className="px-6 py-4 font-bold text-sm">ชื่อเมนู</th>
                    <th className="px-6 py-4 font-bold text-sm">หมวดหมู่</th>
                    <th className="px-6 py-4 font-bold text-sm">ราคา</th>
                    <th className="px-6 py-4 font-bold text-sm">สถานะสินค้า</th>
                    <th className="px-6 py-4 font-bold text-sm text-center w-40">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4A2C1A]/5">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="h-16 w-16 rounded-xl overflow-hidden bg-[#F7F1E5] border border-black/5 flex items-center justify-center relative">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = '<span class="text-xl">☕</span>';
                              }}
                            />
                          ) : (
                            <span className="text-xl">☕</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1 max-w-xs mt-1">
                          {item.description || item.desc || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C6A15B]/10 text-[#8B5E3C]">
                          {item.category || "Coffee"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        ฿{item.price}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            item.is_available ?? true
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.is_available ?? true ? "bg-green-600" : "bg-red-600"}`} />
                          {item.is_available ?? true ? "พร้อมขาย (Available)" : "หมด (Sold Out)"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/admin/menu/${item.id}/edit`}
                            className="px-4 py-2 rounded-xl border border-gray-200 hover:border-[#C6A15B] text-gray-700 hover:text-[#8B5E3C] text-xs font-semibold transition-all"
                          >
                            แก้ไข
                          </Link>
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                          >
                            {deletingId === item.id ? "กำลังลบ..." : "ลบ"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
