# Direktori Guru ICT, DELIMa & GPM Manjung

Laman ringan untuk memaparkan maklumat asas guru mengikut sekolah, menerima kemas kini tanpa login guru, dan menyimpan sejarah untuk admin.

## Status Projek

Projek ini menggunakan `Next.js + TypeScript + Supabase`. Jika Supabase belum dikonfigurasi, laman masih boleh dibina tetapi hanya berjalan dalam mod demo.

## Fungsi

- Direktori awam: sekolah, zon, peranan, nama guru, nombor telefon.
- Borang kemas kini: pilih sekolah dan isi GPICT, GP DELIMa, dan GPM sekali gus.
- Admin: lihat data semasa, sejarah kemas kini, restore versi lama, export CSV.
- Data awal dijana daripada fail Excel `PENGEMASKINIAN GPB_GPICT, GP DELIMA & GPM DAERAH MANJUNG 2025 (Responses).xlsx`.

## Fail Yang Tidak Dimasukkan Ke Git

Fail berikut mengandungi data tempatan atau maklumat sensitif dan tidak patut dipush ke GitHub:

- `database_password.txt`
- Fail Excel/PDF sumber data asal
- `.env` dan `.env.local`
- `supabase/seed.sql` jika mengandungi data sebenar

## Setup Supabase

1. Buat projek Supabase.
2. Jalankan `supabase/schema.sql` dalam SQL Editor.
3. Jalankan `supabase/seed.sql` selepas dijana untuk masukkan data awal.
4. Salin `.env.example` kepada `.env.local` dan isi:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
```

## Jana Semula Data Awal

Guna arahan ini selepas fail Excel sumber dikemas kini:

```powershell
npm run import:initial
```

Arahan ini menjana:

- `src\data\initial-data.json` untuk demo tempatan.
- `supabase\seed.sql` untuk import awal ke Supabase.

## Jalankan Di Windows

Guna arahan npm biasa:

```powershell
npm run dev
npm run test
npm run build
```

Skrip PowerShell ini juga disediakan jika mahu menjalankan arahan secara terus:

```powershell
.\scripts\dev.ps1
.\scripts\test.ps1
.\scripts\build.ps1
```

Jika Supabase belum dikonfigurasi, laman akan berjalan dalam mod demo baca sahaja menggunakan data Excel yang telah diimport.

## GitHub / Deployment

Sebelum deploy:

1. Isi environment variable di Vercel atau server.
2. Jangan upload fail Excel/PDF asal ke repo awam.
3. Jika mahu masukkan data sebenar ke Supabase, jalankan import secara tempatan dan masukkan data melalui Supabase SQL Editor, bukan melalui GitHub.

