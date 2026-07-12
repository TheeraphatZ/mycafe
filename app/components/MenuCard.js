export default function MenuCard({ name, price, desc, category, tag, image_url, is_available = true, onOrder }) {
    // Determine category or tag label to show
    const badgeLabel = category || tag || "";
    
    return (
        <div className={`bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between border border-[#4A2C1A]/5 relative ${
            !is_available ? "opacity-75" : ""
        }`}>
            {/* Category / Tag Badge */}
            {badgeLabel && (
                <span className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#4A2C1A]/80 text-[#F7F1E5] backdrop-blur-sm">
                    {badgeLabel}
                </span>
            )}

            {/* Availability Badge */}
            {!is_available && (
                <span className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-600 text-white shadow-sm">
                    🚫 หมด (Sold Out)
                </span>
            )}

            {/* Card Image Header */}
            <div className="h-48 w-full bg-[#F7F1E5] relative flex items-center justify-center overflow-hidden border-b border-[#4A2C1A]/5">
                {image_url ? (
                    <img
                        src={image_url}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<span class="text-5xl">☕</span>';
                        }}
                    />
                ) : (
                    <span className="text-5xl">☕</span>
                )}
            </div>
            
            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-[#4A2C1A] tracking-tight line-clamp-1">
                        {name}
                    </h3>

                    <p className="text-gray-600 mt-2 text-sm line-clamp-2 leading-relaxed">
                        {desc || "-"}
                    </p>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#4A2C1A]/5">
                    <p className="text-2xl font-black text-[#8B5E3C]">
                        ฿{price}
                    </p>
                    <button
                        onClick={onOrder}
                        disabled={!is_available}
                        className={`px-6 py-2.5 text-xs font-bold rounded-full transition-all duration-300 shadow-sm hover:shadow active:scale-95 cursor-pointer ${
                            is_available
                                ? "bg-[#1C1C1C] text-[#F7F1E5] hover:bg-[#C6A15B] hover:text-[#1C1C1C]"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {is_available ? "สั่งซื้อ" : "หมดชั่วคราว"}
                    </button>
                </div>
            </div>
        </div>
    );
}