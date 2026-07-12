# BRIEF: ออกแบบเว็บไซต์ Daily Dose Café + Backend

> เว็บไซต์ร้านกาแฟสำหรับแสดงเมนู เครื่องดื่ม จุดเด่นของร้าน และข้อมูลติดต่อ พร้อมระบบหลังบ้านสำหรับจัดการเมนูผ่าน Supabase

---

## GOAL

ออกแบบและพัฒนาเว็บไซต์ **Daily Dose Café** ให้:

1. **ทันสมัยและอบอุ่น** — สื่อถึงบรรยากาศร้านกาแฟสไตล์ Minimal
2. **ใช้งานง่าย** — ลูกค้าสามารถดูเมนู ราคา และข้อมูลร้านได้อย่างรวดเร็ว
3. **Responsive** — รองรับมือถือ แท็บเล็ต และคอมพิวเตอร์
4. **จัดการข้อมูลได้** — เจ้าของร้านสามารถเพิ่ม แก้ไข และลบเมนูผ่านหน้า Admin โดยไม่ต้องแก้โค้ด

---

## TECH STACK

* **Frontend:** Next.js App Router + JavaScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Backend:** Supabase

  * Database
  * Authentication
  * Storage
* **Deploy:** Vercel + GitHub

---

# PAGES

## หน้าหลัก

| หน้า                  | เนื้อหา                                      |
| --------------------- | -------------------------------------------- |
| หน้าแรก `/`           | Hero + เมนูแนะนำ + จุดเด่นร้าน + CTA         |
| เมนู `/menu`          | แสดงรายการเครื่องดื่มและอาหารทั้งหมด         |
| เกี่ยวกับเรา `/about` | เรื่องราวและแนวคิดของ Daily Dose Café        |
| ติดต่อเรา `/contact`  | ที่อยู่ เวลาเปิดร้าน ช่องทางติดต่อ และแผนที่ |

## หน้า Admin

| หน้า                    | การทำงาน                           |
| ----------------------- | ---------------------------------- |
| `/admin/login`          | Login สำหรับเจ้าของร้านหรือพนักงาน |
| `/admin`                | Dashboard จัดการเมนู               |
| `/admin/menu/new`       | เพิ่มเมนูใหม่                      |
| `/admin/menu/[id]/edit` | แก้ไขเมนู                          |

> เริ่มต้นจาก **หน้าแรก + หน้าเมนู + Admin CRUD** เพื่อแสดงการทำงานของทั้ง Frontend และ Backend

---

# FRONTEND REQUIREMENTS

## Menu Section

แสดงรายการเมนูจาก Supabase อย่างน้อย 6 รายการ โดยใช้ `.map()`

แต่ละ Menu Card แสดง:

* รูปสินค้า
* ชื่อเมนู
* คำอธิบายสั้น ๆ
* หมวดหมู่
* ราคา
* สถานะสินค้า เช่น `Available` หรือ `Sold Out`

ตัวอย่างหมวดหมู่:

* Coffee
* Non-Coffee
* Tea
* Bakery
* Dessert

---

## Feature / จุดเด่นของร้าน

แสดง 3 การ์ด เช่น:

### เมล็ดกาแฟคุณภาพ

คัดสรรเมล็ดกาแฟคุณภาพ เพื่อรสชาติที่หอมและกลมกล่อม

### บรรยากาศอบอุ่น

พื้นที่สำหรับพักผ่อน ทำงาน หรือพบปะกับเพื่อน

### สดใหม่ทุกวัน

เครื่องดื่มและขนมจัดเตรียมสดใหม่ เพื่อคุณภาพที่ดีที่สุด

---

## Footer

แสดง:

* Daily Dose Café
* ที่อยู่ร้าน
* เบอร์โทรศัพท์
* เวลาเปิด–ปิด
* Social Media
* Copyright

---

# BACKEND REQUIREMENTS — SUPABASE

ระบบ Backend ใช้สำหรับจัดการ **เมนูของร้าน**

ความสามารถหลัก:

* **Create** — เพิ่มเมนูใหม่
* **Read** — ดึงเมนูมาแสดงบนเว็บไซต์
* **Update** — แก้ไขข้อมูลเมนู
* **Delete** — ลบเมนู

ระบบควรมี:

* Admin Dashboard
* Supabase Authentication
* Upload รูปสินค้า
* จัดหมวดหมู่เมนู
* กำหนดสถานะ Available / Sold Out

---

# DATABASE SCHEMA

## ตาราง `menu_items`

```sql
id           bigint primary key generated always as identity
name         text not null
description  text
category     text not null
price        numeric not null
image_url    text
is_available boolean default true
created_at   timestamptz default now()
```

ตัวอย่างข้อมูล:

```text
Iced Americano
Coffee
กาแฟดำเย็น รสชาติเข้ม สดชื่น
65 บาท

Cafe Latte
Coffee
กาแฟเอสเปรสโซผสมนมนุ่ม
75 บาท

Matcha Latte
Non-Coffee
มัทฉะหอมเข้มผสมนม
80 บาท
```

---

# SUPABASE SETUP & INTEGRATION

## 1. ติดตั้ง Supabase

ติดตั้ง Library:

```bash
npm install @supabase/supabase-js
```

สร้างไฟล์:

```text
/lib/supabase.js
```

ใช้ Environment Variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 2. Row Level Security — RLS

กำหนดสิทธิ์ดังนี้:

### Public User

สามารถ:

* อ่านข้อมูลเมนู
* ดูรูปสินค้า

ไม่สามารถ:

* เพิ่มเมนู
* แก้ไขเมนู
* ลบเมนู

### Authenticated User

สามารถ:

* เพิ่มเมนู
* แก้ไขเมนู
* ลบเมนู
* Upload รูปสินค้า

---

# SUPABASE STORAGE

สร้าง Bucket:

```text
menu-images
```

ใช้สำหรับเก็บรูปเมนู เช่น:

```text
americano.jpg
latte.jpg
matcha.jpg
croissant.jpg
```

กำหนดสิทธิ์:

* Public สามารถดูรูปได้
* Authenticated User สามารถ Upload และ Delete ได้

---

# ADMIN SYSTEM

## Login

Route:

```text
/admin/login
```

ฟอร์มประกอบด้วย:

* Email
* Password
* Login Button

ใช้:

```javascript
supabase.auth.signInWithPassword()
```

เมื่อ Login สำเร็จ:

```text
Redirect → /admin
```

---

## Admin Dashboard

Route:

```text
/admin
```

แสดงรายการเมนูทั้งหมดในรูปแบบ Table หรือ Card

ข้อมูลที่แสดง:

* รูปสินค้า
* ชื่อเมนู
* หมวดหมู่
* ราคา
* สถานะ
* Edit
* Delete

มีปุ่ม:

```text
+ เพิ่มเมนูใหม่
```

---

## เพิ่มเมนู

Route:

```text
/admin/menu/new
```

Form ประกอบด้วย:

* ชื่อเมนู
* รายละเอียด
* หมวดหมู่
* ราคา
* รูปสินค้า
* สถานะ Available / Sold Out

ขั้นตอน:

1. Upload รูปไป Supabase Storage
2. รับ Public URL ของรูป
3. บันทึกข้อมูลลงตาราง `menu_items`
4. Redirect กลับ `/admin`

ใช้:

```javascript
supabase
  .from("menu_items")
  .insert([data])
```

---

## แก้ไขเมนู

Route:

```text
/admin/menu/[id]/edit
```

ดึงข้อมูลตาม ID:

```javascript
supabase
  .from("menu_items")
  .select("*")
  .eq("id", id)
  .single()
```

เมื่อแก้ไข:

```javascript
supabase
  .from("menu_items")
  .update(data)
  .eq("id", id)
```

---

## ลบเมนู

ก่อนลบต้องมี Confirmation Dialog

```text
คุณต้องการลบเมนูนี้หรือไม่?
```

เมื่อตกลง:

```javascript
supabase
  .from("menu_items")
  .delete()
  .eq("id", id)
```

หากมีรูปสินค้า ควรลบรูปที่เกี่ยวข้องออกจาก Supabase Storage ด้วย

---

# FRONTEND DATA FETCHING

เปลี่ยนข้อมูลเมนูจาก Static Array เป็นข้อมูลจริงจาก Supabase

## หน้า `/menu`

ดึงข้อมูล:

```javascript
supabase
  .from("menu_items")
  .select("*")
  .order("created_at", { ascending: false })
```

ส่งข้อมูลไปยัง:

```text
MenuGrid
    ↓
MenuCard
```

และใช้:

```javascript
menuItems.map(...)
```

เพื่อแสดงรายการเมนู

---

# MENU FILTER

เพิ่มระบบ Filter ตามหมวดหมู่:

```text
ทั้งหมด
Coffee
Non-Coffee
Tea
Bakery
Dessert
```

สามารถเพิ่ม Search สำหรับค้นหาชื่อเมนูได้

---

# PROJECT STRUCTURE

```text
app/
├── page.jsx
├── menu/
│   └── page.jsx
├── about/
│   └── page.jsx
├── contact/
│   └── page.jsx
├── admin/
│   ├── page.jsx
│   ├── login/
│   │   └── page.jsx
│   └── menu/
│       ├── new/
│       │   └── page.jsx
│       └── [id]/
│           └── edit/
│               └── page.jsx
│
components/
├── Navbar.jsx
├── Hero.jsx
├── Menu.jsx
├── MenuCard.jsx
├── Features.jsx
├── Footer.jsx
└── admin/
    ├── AdminTable.jsx
    └── MenuForm.jsx
│
lib/
└── supabase.js
```

---

# DESIGN PRINCIPLES

ใช้หลักการออกแบบ 5 ข้อในทุกหน้า

### 1. Visual Hierarchy

ชื่อร้านและ CTA ต้องเด่นที่สุด

### 2. Spacing

ใช้พื้นที่ว่างอย่างเหมาะสม เช่น:

```text
py-20
gap-6
px-6
```

### 3. Typography

ใช้ฟอนต์ 1–2 แบบ เช่น:

* Prompt
* Kanit
* Sarabun

### 4. Color

ใช้โทนสีร้านกาแฟ:

* Cream — Background
* Dark Brown — Primary
* Coffee Brown — Secondary
* Warm Orange / Gold — Accent

### 5. Consistency

กำหนดรูปแบบให้เหมือนกันทั้งเว็บไซต์:

* Card: `rounded-2xl`
* Button: `rounded-full`
* Shadow: `shadow-sm`
* Hover Animation เหมือนกัน

---

# UX REQUIREMENTS

ระบบต้องมี:

* Loading State
* Empty State
* Error State
* Form Validation
* Success Message
* Delete Confirmation
* Responsive Design

ตัวอย่าง Empty State:

```text
ยังไม่มีเมนูในหมวดหมู่นี้
```

ตัวอย่าง Success Message:

```text
เพิ่มเมนูสำเร็จ
แก้ไขเมนูสำเร็จ
ลบเมนูสำเร็จ
```

---

# PHASES

## Phase 1 — Design

* เลือก Color Palette
* เลือก Font
* ออกแบบ Navbar
* ออกแบบ Hero
* ออกแบบ Menu Card
* ออกแบบ Features
* ออกแบบ Footer

## Phase 2 — Frontend

* สร้างหน้า Home
* สร้างหน้า Menu
* ใช้ข้อมูลจำลองก่อน
* แยก Components
* ทำ Responsive

## Phase 3 — Backend

* เชื่อม Supabase
* สร้างตาราง `menu_items`
* สร้าง Storage
* เชื่อมข้อมูลเมนูจริง
* ทำ Admin Login
* ทำ CRUD
* ทำ Upload รูป

## Phase 4 — Deploy

* Push GitHub
* Deploy Vercel
* ตั้ง Environment Variables
* ทดสอบ Login
* ทดสอบ CRUD
* ทดสอบ Upload รูป

---

# DELIVERABLES

* [ ] เว็บไซต์ Daily Dose Café
* [ ] Responsive ทุกอุปกรณ์
* [ ] เมนูดึงข้อมูลจาก Supabase
* [ ] Admin Login
* [ ] เพิ่มเมนูได้
* [ ] แก้ไขเมนูได้
* [ ] ลบเมนูได้
* [ ] Upload รูปเมนูได้
* [ ] GitHub Repository
* [ ] Vercel URL ใช้งานได้จริง

---

# ผลลัพธ์ที่คาดหวัง

* ลูกค้าสามารถดูเมนู ราคา และข้อมูลร้านได้
* เมนูทั้งหมดดึงจาก Supabase Database
* เจ้าของร้านสามารถ Login เข้าหน้า Admin
* เจ้าของร้านสามารถเพิ่ม แก้ไข และลบเมนูได้
* สามารถ Upload รูปเมนูผ่านหน้า Admin
* เมื่อแก้ไขข้อมูลใน Admin หน้าเว็บไซต์จะอัปเดตตามข้อมูลใน Supabase
* เว็บไซต์มีดีไซน์ Minimal อบอุ่น และเหมาะกับแบรนด์ Daily Dose Café

---

# PROMPT สำหรับ AI AGENT

พัฒนา Backend และระบบ Admin สำหรับเว็บไซต์ Daily Dose Café ที่สร้างด้วย Next.js App Router, JavaScript และ Tailwind CSS โดยโปรเจกต์เชื่อมต่อ Supabase Database ได้แล้ว

สิ่งที่ต้องทำ:

1. สร้างระบบดึงข้อมูลจากตาราง `menu_items` มาแสดงแทนข้อมูลเมนูแบบ hardcode
2. สร้างหน้า `/menu` สำหรับแสดงเมนูทั้งหมด
3. สร้าง `/admin/login` โดยใช้ Supabase Auth
4. สร้าง `/admin` เป็น Dashboard สำหรับจัดการเมนู
5. สร้างระบบ CRUD:

   * เพิ่มเมนู
   * อ่านข้อมูลเมนู
   * แก้ไขเมนู
   * ลบเมนู
6. สร้างระบบ Upload รูปไปยัง Supabase Storage bucket `menu-images`
7. ป้องกันหน้า Admin ไม่ให้ผู้ที่ยังไม่ได้ Login เข้าถึง
8. เพิ่ม Loading, Error, Empty State และ Form Validation
9. ใช้โครงสร้างและ Design System เดิมของเว็บไซต์ ห้ามเปลี่ยน Navbar, Hero, Footer หรือ Theme ที่มีอยู่โดยไม่จำเป็น
10. ใช้ JavaScript และไฟล์ `.jsx` เท่านั้น ห้ามเปลี่ยนเป็น TypeScript

ก่อนแก้ไขโค้ด:

* ตรวจสอบโครงสร้างไฟล์ปัจจุบันก่อน
* ใช้ Component เดิมที่มีอยู่ให้มากที่สุด
* ห้ามสร้าง Component ซ้ำโดยไม่จำเป็น
* ห้ามลบ UI หรือ Feature เดิม
* หลังแก้ไขให้สรุปว่าเพิ่มหรือแก้ไฟล์ใดบ้าง

---

## แผนงานปฏิบัติ: เชื่อมต่อ Supabase และระบบจัดการเมนู/ข่าวสารหลังบ้าน (Admin CRUD)

### 1. การเตรียมระบบฐานข้อมูล (Supabase Database & Storage Setup)
- **สร้างตารางบน Supabase**:
  - สร้างตาราง `menu_items` (หรือตาราง `news` สำหรับระบบข่าวสาร) ตาม Schema โครงสร้างข้อมูลที่กำหนด
- **ตั้งค่าความปลอดภัย Row Level Security (RLS)**:
  - สร้างนโยบาย (Policy) เพื่ออนุญาตให้บุคคลทั่วไป (Anon/Public) สามารถเปิดอ่านรายการข้อมูลได้เท่านั้น (`SELECT` = true)
  - สร้างนโยบายเพื่อบังคับใช้สิทธิ์เฉพาะผู้ใช้ที่ลงชื่อเข้าใช้งานสำเร็จ (Authenticated Users) ให้สามารถเพิ่ม แก้ไข และลบข้อมูลได้ (`INSERT`, `UPDATE`, `DELETE`)
- **สร้าง Storage Bucket สำหรับเก็บรูปภาพ**:
  - สร้าง Bucket ชื่อ `menu-images` (หรือ `news-assets`) ตั้งค่าเป็น Public เพื่อให้ดึงรูปภาพแสดงหน้าบ้านได้ทันที
  - เปิดสิทธิ์เขียน/ลบข้อมูลเฉพาะสิทธิ์ Authenticated เท่านั้น

### 2. การตั้งค่า Supabase Client ใน Next.js
- ติดตั้ง `@supabase/supabase-js` ในโปรเจกต์
- สร้างตัวจัดการการเชื่อมต่อที่ไฟล์ `/lib/supabase.js` หรือนำ helper client ที่มีอยู่แล้วกลับมาใช้ใหม่โดยอ้างอิงจาก Environment Variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. การปรับปรุงหน้าบ้าน (Frontend Integration)
- เปลี่ยนจุดดึงข้อมูลจาก Static Array เป็นการ Query ผ่าน Supabase Client (`supabase.from('menu_items').select('*')`)
- เพิ่ม Loading state สำหรับแสดงผลระหว่างรอข้อมูล และ Error state ในกรณีที่เรียกอ่านฐานข้อมูลไม่สำเร็จ
- ปรับแต่ง Card Component ให้รับ Props แสดงผลชื่อ รายละเอียด ราคา และแสดงสถานะ พร้อมระบุ `key` ด้วย `id` จากแถวข้อมูลในฐานข้อมูล

### 4. ระบบการจัดการหลังบ้านผ่าน Admin (Admin CRUD)
- **หน้าเข้าสู่ระบบ (`/admin/login`)**: สร้างแบบฟอร์มตรวจสอบสิทธิ์การเข้าใช้งานโดยใช้ `supabase.auth.signInWithPassword()`
- **หน้าแดชบอร์ดจัดการเมนู/ข่าวสาร (`/admin`)**:
  - พัฒนา Table ตารางรายการข้อมูล พร้อมระบุปุ่มสำหรับ เพิ่มข้อมูล (New), แก้ไข (Edit), และลบข้อมูล (Delete)
  - ทำการตรวจสอบ Session การล็อกอิน หากผู้ใช้ยังไม่ได้ล็อกอินให้ดีดหน้าจอกลับไปยังหน้าล็อกอินโดยอัตโนมัติ
- **หน้าเพิ่ม/แก้ไขข้อมูล (`/admin/menu/new` & `/admin/menu/[id]/edit`)**:
  - แสดงผลฟอร์มกรอกข้อมูลตาม Schema
  - รองรับการลากวางหรืออัปโหลดรูปภาพผ่าน Input File ไปเก็บที่ Storage Bucket และนำ Public URL ที่ได้กลับมาบันทึกลงตาราง
  - บันทึกข้อมูลกลับไปยังตารางหลักใน Supabase
- **ระบบลบข้อมูล (Delete)**: เรียกใช้งานคำสั่งลบข้อมูลด้วย `.delete().eq('id', id)` พร้อมแจ้งเตือนยืนยันความปลอดภัยก่อนทำรายการลบ

