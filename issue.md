# Issues Proyek Greenhouse Management

Dokumen ini mencatat bug yang sudah diperbaiki dan **rencana revisi** dari [`revisi.txt`](./revisi.txt).  
Implementasi dilakukan **bertahap**: Dashboard → Presensi → Monitoring.

---

## Ringkasan roadmap revisi

| Fase | Modul | Status | Sumber |
|------|--------|--------|--------|
| **1** | Dashboard (leaderboard + detail absensi anggota) | ✅ Selesai (#3–#4) | `revisi.txt` baris 3–11 |
| **2** | Presensi (form, tabel, gambar) | ✅ Selesai (#6–#10, #5) | `revisi.txt` baris 13–18 |
| **3** | Monitoring (3 sub-modul + notifikasi plening) | ✅ Selesai | `revisi.txt` baris 20–51 |

**Halaman terkait**

| Fase | File utama |
|------|------------|
| 1 ✅ | [`user/index.tsx`](./src/pages/user/index.tsx), [`admin/index.tsx`](./src/pages/admin/index.tsx), [`Leaderboard.tsx`](./src/components/Leaderboard.tsx) |
| 2 📋 | [`user/attendances/new.tsx`](./src/pages/user/attendances/new.tsx), [`user/attendances/index.tsx`](./src/pages/user/attendances/index.tsx), [`admin/attendances/index.tsx`](./src/pages/admin/attendances/index.tsx), [`api/attendances/index.ts`](./src/pages/api/attendances/index.ts) |

---

# Fase 1 — Dashboard

> **Tujuan:** Leaderboard tidak hanya menampilkan peringkat dan jumlah selesai, tetapi memungkinkan melihat **riwayat presensi** anggota lain lewat tombol **Detail**.

## Issue #3 — Tombol Detail di setiap baris Leaderboard

**Status:** ✅ Selesai  
**Prioritas:** Tinggi (langkah pertama fase 1)

### Kebutuhan (dari `revisi.txt`)

- Tambahkan **detail** di leaderboard.
- Saat mengklik **Detail** pada nama anggota **lain**, tampilkan daftar absensi anggota tersebut.

### Acceptance criteria

- [x] Setiap baris leaderboard (kecuali baris diri sendiri untuk role `user`) memiliki tombol **Detail**.
- [x] Klik Detail membuka panel/modal (tidak pindah halaman penuh).
- [x] Tombol disabled untuk anggota tanpa data presensi selesai (`total === 0`).

### File yang kemungkinan disentuh

- [`src/components/Leaderboard.tsx`](./src/components/Leaderboard.tsx) — props tambahan: `currentUserId`, handler/modal trigger
- [`src/pages/user/index.tsx`](./src/pages/user/index.tsx), [`src/pages/admin/index.tsx`](./src/pages/admin/index.tsx) — oper `user.id` ke `Leaderboard`

### Catatan implementasi

- Pertahankan tampilan peringkat top 3 yang sudah ada.
- Gunakan pola UI yang konsisten dengan kartu dashboard (rounded-2xl, border slate).

---

## Issue #4 — Modal / panel detail absensi anggota

**Status:** ✅ Selesai  
**Prioritas:** Tinggi (bergantung pada #3)  
**Bergantung pada:** #3

### Kebutuhan (dari `revisi.txt`)

Field yang ditampilkan per entri presensi:

| Field | Sumber data (schema saat ini) |
|-------|-------------------------------|
| Nama | `users.name` (judul modal) |
| Tanggal | `attendances.attendance_date` |
| Jam masuk | `attendances.check_in_time` |
| Jam keluar | `attendances.check_out_time` |
| Keterangan pekerjaan | `attendances.work_title` + `work_description` |
| Gambar | **belum ada di DB** — lihat Issue #5 & fase Presensi |

### Acceptance criteria

- [x] Modal menampilkan **nama anggota** yang dipilih.
- [x] Daftar presensi berstatus **selesai** (`status = 'selesai'`).
- [x] Kolom: tanggal, jam masuk, jam keluar, keterangan pekerjaan (judul + deskripsi jika ada).
- [x] Urutan terbaru di atas.
- [x] State loading dan kosong (“Belum ada presensi selesai”).
- [x] Tutup modal dengan tombol X, klik backdrop, atau Escape.

### Backend / API

- [x] `getMemberCompletedAttendances(userId)` di [`src/server/data.ts`](./src/server/data.ts).
- [x] `GET /api/attendances/member?userId=` — login wajib; admin & user boleh lihat anggota lain; user tidak bisa `userId` sendiri.

### Komponen baru

- [`src/components/LeaderboardDetailModal.tsx`](./src/components/LeaderboardDetailModal.tsx)
- [`src/lib/format.ts`](./src/lib/format.ts) — format tanggal/jam
- `ImageLightbox` — ditunda ke Issue #5 / Fase 2

### Serialisasi

- Pastikan `Date` / `time` dari Drizzle di-serialize ke string (lihat Issue #1) sebelum dikirim ke client.

---

## Issue #5 — Gambar presensi di detail dashboard (lightbox)

**Status:** ✅ Selesai  
**Prioritas:** Sedang  
**Bergantung pada:** #4 dan **Fase 2** (kolom/upload gambar presensi)

### Kebutuhan (dari `revisi.txt`)

- Gambar ditampilkan di detail absensi.
- **Klik gambar** → tampil **layar penuh** (lightbox).

### Acceptance criteria

- [ ] Jika presensi punya URL gambar, tampilkan thumbnail di modal detail.
- [ ] Klik thumbnail membuka overlay fullscreen dengan gambar asli.
- [ ] Jika belum ada gambar (data lama / belum upload), kolom gambar disembunyikan atau menampilkan placeholder netral.

### Ketergantungan schema

Saat ini tabel [`attendances`](./src/db/schema.ts) **belum** memiliki kolom foto. Implementasi penuh gambar mengikuti:

- **Fase 2 — Issue #8** (input gambar saat presensi), lalu kembali menyambungkan ke modal ini.

**Strategi:** Kerjakan #3 dan #4 dulu tanpa gambar; setelah migrasi DB + upload presensi, sambungkan kolom `photo_url` (atau tabel `attendance_photos`) ke modal dan lightbox.

---

## Checklist implementasi Fase 1 (urutan kerja)

Gunakan urutan ini saat coding:

1. **[#3]** ✅ Tombol **Detail** di `Leaderboard.tsx`.
2. **[#4]** ✅ Query + `GET /api/attendances/member`.
3. **[#4]** ✅ `LeaderboardDetailModal` di dashboard user & admin.
4. **[#4]** Uji manual: admin melihat semua; user hanya anggota lain (`currentUserId`).
5. **[#5]** (Setelah fase 2) Tambah kolom gambar + `ImageLightbox` di modal detail.

### Test plan singkat (Fase 1)

- [ ] Leaderboard kosong → pesan kosong, tidak error.
- [ ] Anggota dengan 0 presensi selesai → Detail disabled atau modal kosong.
- [ ] Anggota dengan banyak presensi → scroll di dalam modal, format tanggal/jam konsisten (locale `id-ID`).
- [ ] Role `user` tidak bisa memanggil API detail untuk userId sembarang (validasi server).

---

# Fase 2 — Presensi

> **Tujuan:** Menyelaraskan modul presensi dengan `revisi.txt` (baris 13–18): form lebih sederhana, dokumentasi foto opsional, tabel riwayat tanpa aksi “Selesai”, dan lightbox gambar.  
> **Status fase:** ✅ Diimplementasi (lihat checklist di bawah).

**Sumber requirement**

```text
presensi
- hapus input catatan singkat
- ubah deskripsi detal jadi deskripsi (opsional)
- tambahkan inputan gambar saat input presensi (obsional)
- jika kilik gambar maka muncul gambar layar penuh
- hapus tombol aksi selesai dari tabel absensi
```

---

## Ringkasan: sebelum vs sesudah

| Area | Sekarang (kode saat ini) | Setelah Fase 2 |
|------|---------------------------|----------------|
| Form tambah presensi | Ada field **Catatan Singkat** (`note`) | Field **dihapus** dari UI & validasi create |
| Form tambah presensi | Label **Deskripsi Detail** (`workDescription`) | Label **Deskripsi (opsional)** — field tetap opsional di schema |
| Form tambah presensi | Tidak ada upload gambar | Input **foto (opsional)** + simpan file ke `public/uploads/` |
| Tabel presensi user | Kolom **Catatan**, kolom **Aksi** (form Selesai + jam keluar) | Kolom Catatan **dihapus**; kolom Aksi **dihapus**; kolom **Foto** (thumbnail, klik = fullscreen) |
| Tabel absensi admin | Tanpa foto; tanpa kolom aksi Selesai | Kolom **Foto** (opsional, klik = fullscreen) — konsisten dengan user |
| Dashboard user (kartu aktif) | Form **Selesai** + jam keluar untuk pekerjaan aktif | **Tetap ada** — bukan “tabel absensi”, masih dipakai menyelesaikan pekerjaan |
| Leaderboard detail (Fase 1) | Tanpa gambar di modal | **Issue #5** — tampilkan foto + lightbox setelah kolom foto ada |
| Database `attendances` | `note`, tanpa `photo_url` | `photo_url` nullable (atau tabel foto terpisah); `note` bisa tetap di DB untuk data lama |

---

## Issue #6 — Hapus input Catatan Singkat

**Status:** ✅ Selesai  
**Prioritas:** Tinggi (langkah pertama fase 2 — perubahan UI paling kecil)

### Perubahan yang akan terjadi

| Lapisan | Sebelum | Sesudah |
|---------|---------|---------|
| UI form [`new.tsx`](./src/pages/user/attendances/new.tsx) | Input `name="note"` baris “Catatan Singkat” | **Dihapus** seluruh blok label + input |
| Tabel [`user/attendances/index.tsx`](./src/pages/user/attendances/index.tsx) | Kolom header **Catatan** + `item.note` | Kolom **dihapus** |
| Validasi [`validation.ts`](./src/lib/validation.ts) | `note` di `attendanceSchema` | **Dihapus** dari schema create (opsional: tetap terima kosong di API untuk backward compat — disarankan hapus) |
| API POST [`api/attendances/index.ts`](./src/pages/api/attendances/index.ts) | `note: parsed.data.note \|\| null` | Tidak lagi menyimpan `note` dari form (atau selalu `null`) |
| Admin tabel | Tidak menampilkan `note` | Tidak berubah |

### Yang tidak berubah

- Kolom `note` di [`schema.ts`](./src/db/schema.ts) bisa **tetap ada** untuk record lama; tidak wajib migrasi drop column di fase ini.

### Acceptance criteria

- [x] User tidak melihat field catatan saat tambah presensi.
- [x] Tabel riwayat user tidak punya kolom catatan.
- [x] Presensi baru tersimpan tanpa error tanpa mengisi catatan.

---

## Issue #7 — Label Deskripsi (opsional)

**Status:** ✅ Selesai  
**Prioritas:** Tinggi  
**Bergantung pada:** — (bisa digabung dengan #6)

### Perubahan yang akan terjadi

| Lapisan | Sebelum | Sesudah |
|---------|---------|---------|
| UI form | Label **Deskripsi Detail** | Label **Deskripsi (opsional)** |
| Validasi | `workDescription` sudah `.optional()` | **Tidak berubah** — hanya copy/label UI |
| Tabel user | Subteks deskripsi di kolom Pekerjaan | Tetap; bisa tambah hint “opsional” di placeholder form |

### Acceptance criteria

- [x] Label form sesuai `revisi.txt`.
- [x] Submit form kosong di deskripsi tetap sukses.

---

## Issue #8 — Upload gambar presensi (opsional)

**Status:** ✅ Selesai  
**Prioritas:** Tinggi  
**Bergantung pada:** #6, #7 (disarankan selesai dulu)

### Perubahan yang akan terjadi

| Lapisan | Sebelum | Sesudah |
|---------|---------|---------|
| Database | Tidak ada kolom foto di `attendances` | Migrasi Drizzle: mis. `photo_url VARCHAR(255) NULL` pada `attendances` |
| Form `new.tsx` | Tanpa upload | Input file gambar (opsional), pola mirip [`user/monitorings/new.tsx`](./src/pages/user/monitorings/new.tsx) (base64 hidden fields atau multipart) |
| Validasi | — | Field opsional: jika ada file → validasi tipe `image/*` + ukuran maksimum |
| API POST | Hanya field teks | Decode & simpan ke `public/uploads/attendances/` (atau subfolder `greenhouse/`), simpan path di `photo_url` |
| Query data | `getUserAttendances`, `getAdminAttendances`, `getMemberCompletedAttendances` | Select/include `photoUrl` |

### Pola teknis (mengikuti codebase)

Reuse alur upload monitoring di [`api/monitorings/index.ts`](./src/pages/api/monitorings/index.ts):

- Validasi `photoData`, `photoName`, `photoType` (opsional di presensi).
- `writeFile` ke `public/uploads/...`.
- URL publik mis. `/uploads/attendances/{timestamp}-{uuid}.jpg`.

### Acceptance criteria

- [x] Presensi bisa disimpan **tanpa** gambar.
- [x] Presensi **dengan** gambar menyimpan URL dan file di disk (`public/uploads/attendances/`).
- [x] Hanya user login yang bisa upload untuk presensi sendiri.

---

## Issue #9 — Lightbox gambar (klik = layar penuh)

**Status:** ✅ Selesai  
**Prioritas:** Sedang  
**Bergantung pada:** #8

### Perubahan yang akan terjadi

| Lokasi | Sebelum | Sesudah |
|--------|---------|---------|
| Tabel presensi user | Tidak ada gambar | Thumbnail; **klik** → overlay fullscreen |
| Tabel admin (opsional konsisten) | — | Thumbnail + lightbox jika admin perlu lihat foto |
| [`LeaderboardDetailModal.tsx`](./src/components/LeaderboardDetailModal.tsx) | Hanya teks | Thumbnail per baris + lightbox (**menutup Issue #5** Fase 1) |
| Komponen baru | — | [`ImageLightbox.tsx`](./src/components/ImageLightbox.tsx) — reusable |

### Acceptance criteria

- [x] Baris tanpa `photo_url` menampilkan tanda “—”.
- [x] Escape / klik luar menutup lightbox.
- [x] Gambar memakai `<img>` dengan `alt` bermakna.

---

## Issue #10 — Hapus tombol Selesai dari tabel absensi

**Status:** ✅ Selesai  
**Prioritas:** Tinggi  
**Catatan scope:** Hanya tabel di halaman **Riwayat Presensi** user, **bukan** kartu dashboard.

### Perubahan yang akan terjadi

| Lokasi | Sebelum | Sesudah |
|--------|---------|---------|
| [`user/attendances/index.tsx`](./src/pages/user/attendances/index.tsx) | Kolom **Aksi**: form POST ke `/api/attendances/[id]/finish` + input jam + tombol **Selesai** untuk `sedang_dikerjakan` | Kolom **Aksi dihapus** seluruhnya |
| [`user/index.tsx`](./src/pages/user/index.tsx) dashboard | Kartu pekerjaan aktif + form Selesai | **Tetap** — ini bukan “tabel absensi” |
| API [`finish.ts`](./src/pages/api/attendances/[id]/finish.ts) | Aktif | **Tetap** — dipanggil dari dashboard (dan mungkin alur lain nanti) |
| Admin [`admin/attendances/index.tsx`](./src/pages/admin/attendances/index.tsx) | Sudah tanpa tombol Selesai | **Tidak berubah** |

### Dampak UX (perlu disepakati saat implementasi)

Setelah #10, user **hanya** bisa menyelesaikan pekerjaan aktif dari **Dashboard** (kartu “Presensi Pekerjaan”), tidak dari halaman riwayat. Jika product ingin selesai dari riwayat juga, perlu revisi requirement.

### Acceptance criteria

- [x] Tabel `/user/attendances` tidak memiliki kolom Aksi maupun form Selesai.
- [x] Dashboard masih bisa menyelesaikan pekerjaan `sedang_dikerjakan`.
- [x] `POST /api/attendances/[id]/finish` masih berfungsi dari dashboard.

---

## Peta file yang akan disentuh (Fase 2)

| File | Issue | Jenis perubahan |
|------|-------|-----------------|
| `drizzle/*.sql` + [`schema.ts`](./src/db/schema.ts) | #8 | Migrasi `photo_url` |
| [`src/lib/validation.ts`](./src/lib/validation.ts) | #6, #7, #8 | Hapus `note`; opsional foto |
| [`src/pages/user/attendances/new.tsx`](./src/pages/user/attendances/new.tsx) | #6, #7, #8 | Form UI |
| [`src/pages/api/attendances/index.ts`](./src/pages/api/attendances/index.ts) | #6, #8 | Simpan presensi + upload |
| [`src/pages/user/attendances/index.tsx`](./src/pages/user/attendances/index.tsx) | #6, #9, #10 | Tabel: foto, tanpa catatan/aksi |
| [`src/pages/admin/attendances/index.tsx`](./src/pages/admin/attendances/index.tsx) | #8, #9 | Kolom foto (opsional) |
| [`src/server/data.ts`](./src/server/data.ts) | #8, #9 | Query + `photoUrl` |
| [`src/pages/api/attendances/member.ts`](./src/pages/api/attendances/member.ts) | #8, #9 | Response detail leaderboard |
| [`src/components/LeaderboardDetailModal.tsx`](./src/components/LeaderboardDetailModal.tsx) | #9 | Foto + lightbox (Issue #5) |
| `src/components/ImageLightbox.tsx` | #9 | Komponen baru |

**Tidak direncanakan diubah (kecuali bugfix):**

- [`src/pages/api/attendances/[id]/finish.ts`](./src/pages/api/attendances/[id]/finish.ts) — tetap untuk dashboard.
- Alur login, anggota, monitoring (Fase 3).

---

## Urutan implementasi yang disarankan

1. **[#6 + #7]** Form & tabel: hapus catatan, ubah label deskripsi.  
2. **[#10]** Hapus kolom Aksi di tabel user (quick win, jelas di UI).  
3. **[#8]** Migrasi DB + upload di form & API.  
4. **[#9 + #5]** Kolom foto + `ImageLightbox` di tabel user, admin (jika perlu), dan modal leaderboard.

---

## Test plan Fase 2 (checklist setelah coding)

- [ ] Tambah presensi tanpa catatan, tanpa deskripsi, tanpa foto → sukses.
- [ ] Tambah presensi dengan foto → file ada di `public/uploads/`, URL tersimpan.
- [ ] Tabel riwayat: tidak ada kolom Catatan dan Aksi; ada thumbnail foto bila ada.
- [ ] Klik foto di tabel → lightbox fullscreen; Escape menutup.
- [ ] Pekerjaan `sedang_dikerjakan`: selesai dari **dashboard** masih works; dari tabel riwayat **tidak** ada tombol Selesai.
- [ ] Leaderboard → Detail anggota → foto tampil (jika ada) + lightbox.
- [ ] Data presensi lama (tanpa `photo_url`, dengan `note` di DB) tetap tampil tanpa error.

---

## Kaitan dengan Fase 1 (Issue #5)

| Item Fase 1 | Dilanjutkan di Fase 2 |
|-------------|------------------------|
| Issue #5 — gambar di modal leaderboard | Selesai bersama **#8 + #9** setelah `photo_url` ada |

---

# Fase 3 — Monitoring

> **Status:** ✅ Diimplementasi — 3 sub-modul terpisah menggantikan form monitoring lama.

## Yang sudah dibangun

### 3.1 Kondisi tanaman ✅
- Hub: `/user/monitorings` → **Kondisi Tanaman**
- Tabel + form: tanggal, jenis, usia, deskripsi (wajib), foto (wajib)
- Upload: `public/uploads/plants/`
- Admin: `/admin/monitorings/plants`

### 3.2 Kondisi air ✅
- Tabel + form: tanggal, ruangan, PPM awal/akhir, nutrisi (ml), pH awal/akhir, PH Down (ml), suhu (10–40)
- Validasi sesuai range `revisi.txt`
- Admin: `/admin/monitorings/water`

### 3.3 Jadwal plening ✅
- Tabel status: menunggu → siap (otomatis saat tanggal tiba) → selesai
- Tombol **Selesai** disabled sebelum tanggal plening
- **Notifikasi** banner di hub & halaman plening untuk jadwal status `siap`
- Jenis: sprei hama, sprei penyakit, polinasi, wiwil, panen
- Admin: `/admin/monitorings/plening` (lihat semua, tanpa aksi selesai)

### Database (migrasi `0002`)
- `plant_conditions`, `water_conditions`, `plening_schedules`
- Tabel lama `greenhouse_monitorings` tetap ada (data lama tidak dihapus)

### Dihapus / dialihkan
- Form monitoring lama (`/user/monitorings/new`)
- API `/api/monitorings`, `/api/comments`
- Detail `/monitorings/[id]` → redirect ke hub monitoring

---

# Bug fixes (sejarah)

## Issue #1 — Next.js Serialization Error: `Date` object di `getServerSideProps`

**Status:** ✅ Selesai diperbaiki

### Deskripsi Error

```
Error serializing `.members[0].createdAt` returned from `getServerSideProps` in "/admin/members".
Reason: `object` ("[object Date]") cannot be serialized as JSON.
Please only return JSON serializable data types.
```

### Penyebab

Fungsi `getServerSideProps` harus mengembalikan props yang bisa diserialisasi ke JSON. Drizzle mengembalikan `Date` pada kolom `datetime`.

### Perbaikan yang Diterapkan

**File:** `src/pages/admin/members/index.tsx`

```typescript
const rawMembers = await getMembers(query);
const members = rawMembers.map((member) => ({
  ...member,
  createdAt: member.createdAt.toISOString(),
}));
```

---

## Issue #2 — React 19 Error: `children` dari `<title>` adalah Array

**Status:** ✅ Selesai diperbaiki

### Penyebab

```jsx
<title>{title} - Greenhouse</title>
```

Menghasilkan array children di React 19.

### Perbaikan yang Diterapkan

**File:** `src/components/DashboardLayout.tsx`

```jsx
<title>{`${title} - Greenhouse`}</title>
```

---

## Cara memakai dokumen ini

1. Ambil issue **#3** dari Fase 1, implementasi, centang acceptance criteria.
2. Lanjut **#4**, lalu **#5** setelah Fase 2 menyediakan gambar.
3. Update kolom **Status** di tabel roadmap (`🔲` → `🚧` → `✅`).
4. Jangan campur scope: commit/PR per fase atau per issue agar review mudah.
