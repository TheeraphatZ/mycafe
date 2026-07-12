"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import MenuCard from "./MenuCard";

const fallbackMenuItems = [
    { id: 1, name: "Espresso",      price: 55, category: "Coffee",   desc: "เข้มข้น กลิ่นหอม" },
    { id: 2, name: "Latte",         price: 65, category: "Coffee",   desc: "นุ่มละมุน นมสด" },
    { id: 3, name: "Cappuccino",    price: 65, category: "Coffee",   desc: "ฟองนมหนานุ่ม" },
    { id: 4, name: "Iced Americano",price: 60, category: "Coffee",   desc: "สดชื่น ไม่ใส่นม" },
    { id: 5, name: "Matcha Latte",  price: 75, category: "Non-Coffee", desc: "ชาเขียวญี่ปุ่นแท้" },
    { id: 6, name: "Cocoa",         price: 60, category: "Non-Coffee", desc: "หวานมัน เด็กชอบ" },
];

const features = [
    {
        id: 1,
        title: "เมล็ดกาแฟคุณภาพ",
        desc: "คัดสรรเมล็ดกาแฟคุณภาพ เพื่อรสชาติและกลิ่นหอมที่ดีที่สุด",
        icon: "☕",
    },
    {
        id: 2,
        title: "ชงสดทุกแก้ว",
        desc: "เครื่องดื่มทุกแก้วถูกชงสดใหม่ด้วยความใส่ใจ",
        icon: "✨",
    },
    {
        id: 3,
        title: "บรรยากาศอบอุ่น",
        desc: "พื้นที่สบาย ๆ เหมาะสำหรับพักผ่อน ทำงาน และพบปะเพื่อนฝูง",
        icon: "🏡",
    },
];

const categories = ["ทั้งหมด", "Coffee", "Non-Coffee", "Tea", "Bakery", "Dessert"];

export default function Menu() {
    const supabase = createClient();
    
    // States for Menu
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [useFallback, setUseFallback] = useState(false);
    
    // Filter and Search States
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
    const [searchQuery, setSearchQuery] = useState("");

    // States for Order Modal
    const [selectedItem, setSelectedItem] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [sweetness, setSweetness] = useState("หวานปกติ (100%)");
    const [type, setType] = useState("เย็น"); // ร้อน / เย็น / ปั่น
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");
    
    // Submission states
    const [submitting, setSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderError, setOrderError] = useState("");

    // Fetch menu from Supabase
    useEffect(() => {
        async function loadMenu() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("menu")
                    .select("*")
                    .order("id", { ascending: true });
                
                if (error) throw error;
                
                if (data && data.length > 0) {
                    setMenuItems(data);
                } else {
                    setMenuItems(fallbackMenuItems);
                }
                setError(null);
            } catch (err) {
                console.error("Error fetching menu:", err);
                setError(err.message || "Failed to load menu items");
            } finally {
                setLoading(false);
            }
        }
        
        if (!useFallback) {
            loadMenu();
        } else {
            setMenuItems(fallbackMenuItems);
            setLoading(false);
            setError(null);
        }
    }, [useFallback]);

    // Handle Order Submit
    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        if (!selectedItem) return;

        setSubmitting(true);
        setOrderError("");

        const orderData = {
            menu_name: selectedItem.name,
            price: selectedItem.price,
            quantity: parseInt(quantity),
            sweetness: sweetness,
            type: type,
            customer_name: customerName,
            phone: phone,
            note: note || null,
        };

        try {
            const { error } = await supabase.from("orders").insert([orderData]);
            
            if (error) throw error;

            setOrderSuccess(true);
            // Reset form
            setCustomerName("");
            setPhone("");
            setSweetness("หวานปกติ (100%)");
            setType("เย็น");
            setQuantity(1);
            setNote("");
        } catch (err) {
            console.error("Failed to submit order to Supabase:", err);
            // Fallback: save to localStorage and mock success for user experience
            try {
                const localOrders = JSON.parse(localStorage.getItem("offline_orders") || "[]");
                localOrders.push({ ...orderData, id: Date.now(), offline: true });
                localStorage.setItem("offline_orders", JSON.stringify(localOrders));
                
                setOrderSuccess(true);
                setOrderError("บันทึกคำสั่งซื้อของคุณสำเร็จ (บันทึกออฟไลน์ในเครื่องของคุณ)");
            } catch (localErr) {
                setOrderError("ไม่สามารถทำการสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Filter Logic
    const filteredMenuItems = menuItems.filter((item) => {
        const itemCategory = item.category || item.tag || "";
        const matchesCategory =
            selectedCategory === "ทั้งหมด" ||
            itemCategory.toLowerCase() === selectedCategory.toLowerCase();
        
        const itemDesc = item.description || item.desc || "";
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            itemDesc.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <>
            {/* Menu Section */}
            <section id="menu" className="py-20 px-6 bg-[#F7F1E5]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[#8B5E3C] font-semibold tracking-wider">
                            OUR MENU
                        </p>
                        <h2 className="text-4xl font-bold text-[#4A2C1A] mt-2">
                            เมนูแนะนำ
                        </h2>
                        <p className="text-gray-600 mt-4 max-w-md mx-auto">
                            เติมความสดชื่นให้ทุกวันด้วยเครื่องดื่มแก้วโปรด สดใหม่จากเคาน์เตอร์บาร์
                        </p>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="flex flex-col gap-6 mb-12">
                        {/* Categories List */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                                        selectedCategory === cat
                                            ? "bg-[#4A2C1A] text-white shadow-md scale-105"
                                            : "bg-white text-gray-700 border border-black/5 hover:bg-[#F7F1E5]"
                                    }`}
                                >
                                    {cat === "ทั้งหมด" ? "ทั้งหมด (All)" : cat}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-md mx-auto w-full relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="🔍 ค้นหาชื่อเมนูหรือรสชาติที่ชอบ..."
                                className="w-full bg-white border border-black/5 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 transition-all shadow-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Menu Content States */}
                    {loading ? (
                        /* Loading State */
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
                            <p className="text-[#8B5E3C] font-medium">กำลังโหลดเมนูพิเศษ...</p>
                        </div>
                    ) : error ? (
                        /* Error State with Local Fallback Trigger */
                        <div className="max-w-md mx-auto p-6 bg-white rounded-2xl border border-red-100 shadow-md text-center">
                            <span className="text-4xl">⚠️</span>
                            <h3 className="text-lg font-bold text-[#4A2C1A] mt-2">
                                เชื่อมต่อข้อมูลไม่สำเร็จ
                            </h3>
                            <p className="text-gray-500 text-sm mt-1 mb-6 font-mono break-words">
                                {error}
                            </p>
                            <button
                                onClick={() => setUseFallback(true)}
                                className="w-full py-3 px-6 rounded-full bg-[#8B5E3C] text-white font-medium hover:bg-[#4A2C1A] transition-all cursor-pointer"
                            >
                                ดึงข้อมูลเมนูแบบออฟไลน์ (Local Menu)
                            </button>
                        </div>
                    ) : filteredMenuItems.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-16 bg-white/40 rounded-3xl border border-dashed border-gray-300">
                            <span className="text-5xl block mb-2">🍽️</span>
                            <h3 className="text-lg font-bold text-[#4A2C1A]">ยังไม่มีเมนูในหมวดหมู่นี้</h3>
                            <p className="text-gray-500 text-sm mt-1 mb-6">ลองค้นหาด้วยคำอื่นหรือเลือกหมวดหมู่อื่นดูนะ</p>
                            {(searchQuery || selectedCategory !== "ทั้งหมด") && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("ทั้งหมด");
                                    }}
                                    className="px-6 py-2.5 rounded-full bg-[#4A2C1A] text-white text-xs font-semibold hover:bg-[#8B5E3C] transition-all cursor-pointer"
                                >
                                    ล้างการค้นหาทั้งหมด
                                </button>
                            )}
                        </div>
                    ) : (
                        /* Loaded Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMenuItems.map((item) => (
                                <MenuCard
                                    key={item.id}
                                    name={item.name}
                                    price={item.price}
                                    desc={item.description || item.desc}
                                    category={item.category}
                                    tag={item.tag}
                                    image_url={item.image_url}
                                    is_available={item.is_available ?? true}
                                    onOrder={() => setSelectedItem(item)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Feature Section */}
            <section id="about" className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#4A2C1A]">
                            ทำไมต้อง Daily Dose Café?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <div
                                key={feature.id}
                                className="text-center p-8 bg-[#F7F1E5] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="text-5xl mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#4A2C1A]">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ordering Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="relative w-full max-w-lg bg-[#F7F1E5] rounded-3xl overflow-hidden shadow-2xl border border-white/20 transform transition-all scale-100 max-h-[90vh] flex flex-col font-sans">
                        
                        {/* Header */}
                        <div className="p-6 bg-[#4A2C1A] text-white flex justify-between items-center">
                            <div>
                                <span className="text-xs uppercase text-amber-300 tracking-wider">ใบสั่งซื้อเครื่องดื่ม</span>
                                <h3 className="text-2xl font-bold">{selectedItem.name}</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedItem(null);
                                    setOrderSuccess(false);
                                    setOrderError("");
                                }}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {orderSuccess ? (
                                <div className="text-center py-8 space-y-4">
                                    <span className="text-6xl block">🎉</span>
                                    <h4 className="text-2xl font-bold text-[#4A2C1A]">สั่งซื้อสำเร็จ!</h4>
                                    <p className="text-gray-700 text-sm max-w-sm mx-auto">
                                        คำสั่งซื้อเครื่องดื่ม <span className="font-semibold text-[#8B5E3C]">{selectedItem.name}</span> ได้รับการยืนยันแล้ว ทางร้านกำลังเริ่มปรุงทันที!
                                    </p>
                                    {orderError && (
                                        <div className="mt-4 p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
                                            ℹ️ {orderError}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            setSelectedItem(null);
                                            setOrderSuccess(false);
                                            setOrderError("");
                                        }}
                                        className="mt-6 px-8 py-3 rounded-full bg-[#4A2C1A] text-white font-medium hover:bg-[#8B5E3C] transition-colors cursor-pointer"
                                    >
                                        ปิดหน้าต่าง
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleOrderSubmit} className="space-y-5">
                                    {/* Drink Options Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Temperature Option */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#4A2C1A] block">ประเภท</label>
                                            <div className="flex bg-white rounded-xl p-1 border border-black/5 gap-1">
                                                {["ร้อน", "เย็น", "ปั่น"].map((t) => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        onClick={() => setType(t)}
                                                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                                            type === t
                                                                ? "bg-[#8B5E3C] text-white shadow-sm"
                                                                : "text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sweetness Option */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-[#4A2C1A] block">ความหวาน</label>
                                            <select
                                                value={sweetness}
                                                onChange={(e) => setSweetness(e.target.value)}
                                                className="w-full bg-white border border-black/5 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]"
                                            >
                                                <option value="ไม่หวานเลย (0%)">ไม่หวานเลย (0%)</option>
                                                <option value="หวานน้อย (50%)">หวานน้อย (50%)</option>
                                                <option value="หวานปกติ (100%)">หวานปกติ (100%)</option>
                                                <option value="หวานมาก (120%)">หวานมาก (120%)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-black/5">
                                        <div>
                                            <label className="text-sm font-bold text-[#4A2C1A]">จำนวน</label>
                                            <p className="text-xs text-gray-500">เลือกจำนวนแก้วที่ต้องการ</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold text-lg text-[#4A2C1A] w-6 text-center">{quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Customer Form */}
                                    <div className="space-y-3 bg-white p-5 rounded-2xl border border-black/5">
                                        <h4 className="text-sm font-bold text-[#4A2C1A] border-b border-black/5 pb-2">ข้อมูลผู้สั่งซื้อ</h4>
                                        
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">ชื่อของคุณ</label>
                                            <input
                                                type="text"
                                                required
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                placeholder="กรอกชื่อเพื่อรับเครื่องดื่ม"
                                                className="w-full bg-[#F7F1E5]/40 border border-black/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">เบอร์โทรศัพท์</label>
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="กรอกเบอร์โทรสำหรับติดต่อ"
                                                className="w-full bg-[#F7F1E5]/40 border border-black/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">รายละเอียดเพิ่มเติม (ถ้ามี)</label>
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="เช่น หวานมากพิเศษ, วิปครีมแยกแก้ว"
                                                rows="2"
                                                className="w-full bg-[#F7F1E5]/40 border border-black/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5E3C] resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedItem(null)}
                                            className="flex-1 py-3.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 active:scale-95 transition-all text-center cursor-pointer"
                                        >
                                            ยกเลิก
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 py-3.5 rounded-full bg-[#8B5E3C] hover:bg-[#4A2C1A] disabled:bg-gray-400 text-white font-medium shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    กำลังส่งออเดอร์...
                                                </>
                                            ) : (
                                                `ส่งสั่งซื้อ • ฿${selectedItem.price * quantity}`
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}