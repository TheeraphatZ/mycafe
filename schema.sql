-- คำสั่งสร้างตารางสำหรับระบบร้านกาแฟ Daily Dose Café
-- คัดลอกโค้ดนี้ไปรันในส่วน SQL Editor ของ Supabase Dashboard

-- 1. สร้างตารางเมนูเครื่องดื่ม (menu)
CREATE TABLE IF NOT EXISTS public.menu (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    tag TEXT, -- ร้อน / เย็น (Hot / Cold)
    "desc" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- เพิ่มข้อมูลเมนูเครื่องดื่มเริ่มต้น 6 รายการ
INSERT INTO public.menu (name, price, tag, "desc") VALUES
('Espresso', 55, 'Hot', 'เข้มข้น กลิ่นหอม'),
('Latte', 65, 'Hot', 'นุ่มละมุน นมสด'),
('Cappuccino', 65, 'Hot', 'ฟองนมหนานุ่ม'),
('Iced Americano', 60, 'Cold', 'สดชื่น ไม่ใส่นม'),
('Matcha Latte', 75, 'Cold', 'ชาเขียวญี่ปุ่นแท้'),
('Cocoa', 60, 'Cold', 'หวานมัน เด็กชอบ')
ON CONFLICT DO NOTHING;

-- 2. สร้างตารางคำสั่งซื้อ (orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    menu_name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    sweetness TEXT NOT NULL,
    type TEXT NOT NULL, -- ร้อน / เย็น / ปั่น
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. ตั้งค่าความปลอดภัย Row Level Security (RLS)
ALTER TABLE public.menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. สร้างนโยบายการเข้าถึง (Policies) เพื่อให้ทุกคนสามารถอ่านข้อมูลเมนู และสั่งซื้อเครื่องดื่มได้
CREATE POLICY "Allow public read access to menu" ON public.menu
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to orders" ON public.orders
    FOR SELECT USING (true);
