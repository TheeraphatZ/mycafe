import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-[#1C120C] border-t border-white/10 py-16 text-stone-300 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 relative">

        {/* Cafe Info */}
        <div className="lg:col-span-4 space-y-6">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full overflow-hidden">
              <img
                src="/images/logo.png"
                alt="Daily Dose Café"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Daily Dose Café
              </h2>
              <p className="text-xs text-amber-400">
                เติมพลังดี ๆ ให้ทุกวัน ด้วยกาแฟแก้วโปรดของคุณ
              </p>
            </div>
          </Link>

          <p className="text-sm text-stone-400 leading-relaxed">
            เติมความสดชื่นให้ทุกวันของคุณ ด้วยกาแฟคุณภาพ
            และบรรยากาศอบอุ่นที่พร้อมต้อนรับทุกคน
          </p>
        </div>

        {/* Address */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-white font-bold text-sm border-l-2 border-amber-500 pl-3">
            ที่อยู่
          </h3>

          <p className="text-sm text-stone-400 leading-relaxed">
            159 ซอยอิสรภาพ 9 แขวงวัดกัลยาณ์
            เขตธนบุรี กรุงเทพมหานคร 10600
          </p>
        </div>

        {/* Opening Hours */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-white font-bold text-sm border-l-2 border-amber-500 pl-3">
            เวลาเปิด - ปิด
          </h3>

          <div className="text-sm text-stone-400 space-y-2">
            <p>จันทร์ - ศุกร์</p>
            <p className="text-white">07:00 - 18:00 น.</p>

            <p className="pt-2">เสาร์ - อาทิตย์</p>
            <p className="text-white">08:00 - 17:00 น.</p>
          </div>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-white font-bold text-sm border-l-2 border-amber-500 pl-3">
            ติดต่อเรา
          </h3>

          <div className="space-y-3 text-sm text-stone-400">
            <p>โทร: 02-465-1779</p>
            <p>อีเมล: hello@dailydosecafe.com</p>
            <p>Facebook: Daily Dose Café</p>
            <p>Instagram: @dailydosecafe</p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
        <p>© 2026 Daily Dose Café. All Rights Reserved.</p>

        <p className="text-stone-600">
          Brewed with ☕ for your daily happiness.
        </p>
      </div>
    </footer>
  );
}