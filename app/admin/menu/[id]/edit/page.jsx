"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditMenuItem() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Coffee");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  // Status states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load current menu item data
  useEffect(() => {
    if (!id) return;

    async function loadItem() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("menu")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          setName(data.name || "");
          setDescription(data.description || data.desc || "");
          setPrice(data.price || "");
          setCategory(data.category || "Coffee");
          setImageUrl(data.image_url || "");
          setIsAvailable(data.is_available ?? true);
        }
      } catch (err) {
        console.error("Failed to load item:", err);
        setError("ไม่สามารถดึงข้อมูลรายการเมนูนี้ได้");
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id]);

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
      let finalImageUrl = imageUrl;

      // 1. Upload new image if selected
      if (imageFile) {
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
          throw new Error(`การอัปโหลดรูปภาพล้มเหลว: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("menu-images")
          .getPublicUrl(filePath);

        // Delete old image if it is stored in Supabase Storage
        if (imageUrl && imageUrl.includes("/storage/v1/object/public/menu-images/")) {
          const parts = imageUrl.split("/storage/v1/object/public/menu-images/");
          if (parts.length > 1) {
            const oldFileName = parts[1];
            await supabase.storage.from("menu-images").remove([oldFileName]);
          }
        }

        finalImageUrl = publicUrl;
      }

      // 2. Update record in "menu" table
      const updateData = {
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        category: category,
        image_url: finalImageUrl || null,
        is_available: isAvailable,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("menu")
        .update(updateData)
        .eq("id", id);

      if (updateError) throw updateError;

      setSuccess(true);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Error updating menu item:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F1E5] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">กำลังโหลดข้อมูลเมนู...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold">แก้ไขข้อมูลเมนู</h1>
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
            แก้ไขรายการ: {name}
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
                placeholder="คำอธิบายรสชาติหรือข้อมูลเพิ่มเติม..."
                rows="4"
                className="w-full bg-[#F7F1E5]/20 border border-stone-300 focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] text-stone-800 rounded-2xl px-5 py-3 text-sm focus:bg-white transition-all resize-none placeholder-gray-400"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#4A2C1A] block mb-1.5">
                รูปภาพสินค้า (อัปโหลดใหม่เพื่อเปลี่ยนรูปเดิม)
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
                      <p className="text-sm font-semibold text-stone-700">คลิกเพื่อเปลี่ยนรูปภาพใหม่</p>
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
                    ) : imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Current"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<span class="text-stone-400 text-sm">ไม่มีรูปภาพ</span>';
                        }}
                      />
                    ) : (
                      <span className="text-stone-400 text-sm">ไม่มีรูปภาพ</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 flex gap-4 border-t border-[#4A2C1A]/5">
              <Link
                href="/admin"
                className="flex-1 py-4 rounded-full border border-stone-300 text-stone-700 font-semibold text-center hover:bg-stone-50 active:scale-95 transition-all text-sm cursor-pointer"
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
                    กำลังบันทึกข้อมูล...
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
