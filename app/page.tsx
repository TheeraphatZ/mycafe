import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // ดึงข้อมูล Todos จาก Supabase (ทดสอบการเชื่อมต่อ)
  const { data: todos } = await supabase.from('todos').select()

  return (
    <main className="min-h-screen bg-[#F7F1E5] font-sans">
      <Navbar />
      <Hero />
      <Menu />
      
      {/* ส่วนแสดงผลข้อมูลจาก Supabase (ถ้ามี) */}
      {todos && todos.length > 0 && (
        <section className="py-10 px-6 bg-white border-t border-black/5">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-bold text-[#4A2C1A] mb-4">รายการที่ต้องทำ (Supabase Todos)</h3>
            <ul className="list-disc pl-5 space-y-2">
              {todos.map((todo: any) => (
                <li key={todo.id} className="text-gray-700">{todo.name}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}