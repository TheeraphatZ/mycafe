"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewMenuItem() {
  const supabase = createClient();
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Coffee");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !category) {
      setError("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    if (parseFloat(price) < 0) {
      setError("ราคาห้ามติดลบ");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let imageUrl = "";

      // 1. Upload image to Supabase Storage if file selected
      if (imageFile) {
        // Create unique file name
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("menu-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`การอัปโหลดรูปภาพล้มเหลว: ${uploadError.message}. โปรดตรวจสอบว่าได้สร้าง bucket "menu-images" ใน Supabase แล้วและเป็น Public`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("menu-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // 2. Insert into "menu" table
      const menuItemData = {
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        category: category,
        image_url: imageUrl || null,
        is_available: isAvailable,
      };

      const { error: insertError } = await supabase
        .from("menu")
        .insert([menuItemData]);

      if (insertError) throw insertError;

      // 3. Redirect back to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Error creating menu item:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E5] font-sans pb-16">
      {/* Header Banner */}
      <header className="bg-[#4A2C1A] text-[#F7F1E5] py-6 px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold hover:text-[#C6A15B] transition-colors">
              ←
            </Link>
            <div>
              <h1 className="text-xl font-bold">เพิ่มเมนูเครื่องดื่ม/อาหาร</h1>
              <p className="text-xs text-[#C6A15B]">ระบบหลังบ้าน Daily Dose Café</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-full border border-white/20 text-xs font-semibold hover:bg-white/10 transition-all"
          >
            ย้อนกลับ
          </Link>
        </div>
      </header>

      {/* Form Container */}
      <main className="max-w-3xl mx-auto px-6 mt-10">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[#4A2C1A]/5">
          <h2 className="text-2xl font-bold text-[#4A2C1A] mb-8 pb-4 border-b border-[#4A2C1A]/5">
            รายละเอียดเมนูใหม่
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-sm">
              <span className="text-lg">⚠️</span>
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid for basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Menu Name */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#4A2C1A] block mb-1.5">
                  ชื่อเมนู <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น Espresso, Croissant"
                  className="w-full bg-[#F7F1E5]/20 border border-stone-300 focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] text-stone-800 rounded-2xl px-5 py-3 text-sm focus:bg-white transition-all placeholder-gray-400"
                />
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#4A2C1A] block mb-1.5">
                  ราคา (บาท) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="เช่น 65"
                  className="w-full bg-[#F7F1E5]/20 border border-stone-300 focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] text-stone-800 rounded-2xl px-5 py-3 text-sm focus:bg-white transition-all placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#4A2C1A] block mb-1.5">
                  หมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F7F1E5]/20 border border-stone-300 focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] text-stone-800 rounded-2xl px-5 py-3 text-sm focus:bg-white transition-all"
                >
                  <option value="Coffee">Coffee (กาแฟ)</option>
                  <option value="Non-Coffee">Non-Coffee (นม/โกโก้)</option>
                  <option value="Tea">Tea (ชา)</option>
                  <option value="Bakery">Bakery (เบเกอรี)</option>
                  <option value="Dessert">Dessert (ของหวาน)</option>
                </select>
              </div>

              {/* Availability Status */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#4A2C1A] block mb-2">
                  สถานะสินค้า
                </label>
                <div className="flex bg-[#F7F1E5]/20 rounded-2xl p-1 border border-stone-300 gap-1">
                  <button
                    type="button"
                    onClick={() => setIsAvailable(true)}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                      isAvailable
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-stone-600 hover:bg-white/40"
                    }`}
                  >
                    พร้อมขาย (Available)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAvailable(false)}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                      !isAvailable
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-stone-600 hover:bg-white/40"
                    }`}
                  >
                    สินค้าหมด (Sold Out)
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#4A2C1A] block mb-1.5">
                รายละเอียดสินค้า
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="คำอธิบายรสชาติหรือข้อมูลเพิ่มเติม เช่น กาแฟอาราบิก้า 100% ผสมนมสดแท้สูตรพิเศษ..."
                rows="4"
                className="w-full bg-[#F7F1E5]/20 border border-stone-300 focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] text-stone-800 rounded-2xl px-5 py-3 text-sm focus:bg-white transition-all resize-none placeholder-gray-400"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#4A2C1A] block mb-1.5">
                รูปภาพสินค้า (แนะนำอัตราส่วน 1:1)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Upload Area */}
                <div className="md:col-span-2">
                  <div className="relative border-2 border-dashed border-stone-300 hover:border-[#8B5E3C] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#F7F1E5]/10">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-1">
                      <span className="text-3xl block">📸</span>
                      <p className="text-sm font-semibold text-stone-700">คลิกเพื่ออัปโหลดรูปภาพ</p>
                      <p className="text-xs text-stone-400">รองรับไฟล์ PNG, JPG ขนาดไม่เกิน 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="flex justify-center">
                  <div className="h-32 w-32 rounded-2xl overflow-hidden bg-[#F7F1E5] border border-stone-200 flex items-center justify-center relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-stone-400 text-sm">ไม่มีรูปตัวอย่าง</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 flex gap-4 border-t border-[#4A2C1A]/5">
              <Link
                href="/admin"
                className="flex-1 py-4 rounded-full border border-stone-300 text-[#4A2C1A] font-semibold text-center hover:bg-stone-50 active:scale-95 transition-all text-sm cursor-pointer"
              >
                ยกเลิก
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 rounded-full bg-[#1C1C1C] hover:bg-[#C6A15B] hover:text-[#1C1C1C] disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    กำลังบันทึกเมนู...
                  </>
                ) : (
                  "บันทึกข้อมูล"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
