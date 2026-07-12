export default function Hero() {
    return (
        <section id="home" className="relative w-full min-h-screen overflow-hidden">
            {/* Background Image */}
            <img
                src="/images/coffee-hero.png"
                alt="Daily Dose Café"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/35" />

            {/* Content */}
            <div className="relative z-10 min-h-screen px-6 sm:px-10 lg:px-14 text-white">

                {/* Text - กึ่งกลางแนวตั้ง ชิดซ้าย */}
                <div className="absolute top-1/2 left-6 sm:left-10 lg:left-14 -translate-y-1/2 max-w-3xl">
                    <h1 className="text-7xl sm:text-8xl lg:text-[110px] font-light leading-[0.95] tracking-tight">
                        Daily Dose
                        <br />
                        Café
                    </h1>

                    <p className="mt-10 text-lg sm:text-2xl lg:text-3xl font-light">
                        เติมพลังดี ๆ ให้ทุกวัน ด้วยกาแฟแก้วโปรดของคุณ ☕
                    </p>
                </div>

                {/* CTA */}
                <div className="absolute bottom-20 right-6 sm:right-10 lg:right-14">
                    <a
                        href="#menu"
                        className="
                            w-[310px] h-[92px]
                            flex items-center justify-center
                            rounded-full
                            border-2 border-white
                            text-2xl font-semibold
                            bg-black/10 backdrop-blur-sm
                            transition-all duration-300
                            hover:bg-white hover:text-black hover:scale-105
                        "
                    >
                        สั่งเลย
                    </a>
                </div>

            </div>
        </section>
    );
}