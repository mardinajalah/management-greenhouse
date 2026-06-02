# Issue Roadmap Dashboard Management Green House

Dokumen ini berisi tahapan pengerjaan aplikasi secara step by step.

Stack yang digunakan saat ini:

- Next.js TypeScript
- MySQL
- Drizzle ORM
- Drizzle Kit
- Zod
- mysql2

Status checklist disesuaikan dengan kondisi project saat ini: dependency utama sudah terpasang, dan pekerjaan berikutnya fokus pada implementasi coding, integrasi database, validasi, autentikasi, fitur dashboard, dan testing.

## Tahap 1 - Setup Project dan Dependency

- [x] Buat project Next.js TypeScript.
- [x] Install dependency `next`, `react`, dan `react-dom`.
- [x] Install dependency database `mysql2`.
- [x] Install dependency ORM `drizzle-orm`.
- [x] Install dependency migration `drizzle-kit`.
- [x] Install dependency validasi `zod`.
- [x] Siapkan script dasar `dev`, `build`, `start`, dan `lint`.
- [x] Rapikan struktur folder aplikasi agar siap untuk fitur dashboard.
- [x] Tentukan penggunaan routing utama: Pages Router atau App Router.

## Tahap 2 - Konfigurasi Environment dan Database MySQL

- [x] Buat file `.env.example`.
- [x] Tambahkan contoh konfigurasi `DATABASE_URL` untuk MySQL.
- [x] Lengkapi file `.env` lokal dengan koneksi database.
- [x] Buat database MySQL `greenhouse_dashboard`.
- [x] Pastikan koneksi MySQL dapat diakses dari project.
- [x] Buat util helper untuk membaca environment variable secara aman.
- [x] Pastikan nilai environment penting divalidasi sebelum aplikasi berjalan.

## Tahap 3 - Setup Drizzle ORM

- [x] Buat file `drizzle.config.ts`.
- [x] Set dialect Drizzle ke `mysql`.
- [x] Set path schema Drizzle.
- [x] Set output migration Drizzle.
- [x] Buat folder database, misalnya `src/db`.
- [x] Buat file koneksi database Drizzle.
- [x] Buat koneksi menggunakan `mysql2`.
- [x] Export instance `db` untuk dipakai server action, API route, atau service.
- [x] Pastikan koneksi database tidak dipakai di client component.

## Tahap 4 - Schema Database Drizzle

- [x] Buat schema tabel `users`.
- [x] Buat schema tabel `attendances`.
- [x] Buat schema tabel `greenhouse_monitorings`.
- [x] Buat schema tabel `monitoring_photos`.
- [x] Buat schema tabel `comments`.
- [x] Tambahkan enum atau tipe terbatas untuk role `admin` dan `user`.
- [x] Tambahkan enum atau tipe terbatas untuk status presensi.
- [x] Tambahkan foreign key antar tabel sesuai ERD.
- [x] Tambahkan index untuk kolom foreign key.
- [x] Tambahkan unique index untuk email user.
- [x] Tambahkan default timestamp `created_at`.
- [x] Tambahkan timestamp `updated_at`.
- [ ] Tambahkan constraint jam keluar tidak boleh lebih awal dari jam masuk jika memungkinkan di MySQL.
- [x] Buat relation Drizzle untuk setiap tabel.
- [x] Export tipe TypeScript hasil infer Drizzle.

## Tahap 5 - Migration dan Validasi Database

- [x] Jalankan generate migration Drizzle.
- [x] Review file SQL migration yang dihasilkan.
- [x] Jalankan migration ke database MySQL.
- [x] Cek tabel yang terbentuk di database MySQL.
- [x] Cek foreign key dan index sudah sesuai ERD.
- [ ] Cek Drizzle Studio.
- [x] Buat seed data admin pertama jika diperlukan.
- [ ] Dokumentasikan cara generate dan migrate database.

## Tahap 6 - Validasi Data dengan Zod

- [x] Buat schema Zod untuk login.
- [x] Buat schema Zod untuk tambah anggota.
- [x] Buat schema Zod untuk edit anggota.
- [x] Buat schema Zod untuk presensi pekerjaan.
- [x] Buat schema Zod untuk update jam keluar presensi.
- [x] Buat schema Zod untuk monitoring greenhouse.
- [x] Buat schema Zod untuk upload foto monitoring.
- [x] Buat schema Zod untuk komentar admin.
- [x] Buat helper format error Zod agar mudah ditampilkan di UI.
- [x] Pastikan validasi server tidak hanya bergantung pada validasi client.

## Tahap 7 - Autentikasi dan Session

- [x] Buat halaman login.
- [x] Buat proses login dengan email atau username.
- [x] Hash password user sebelum disimpan.
- [x] Validasi password saat login.
- [x] Simpan session user menggunakan cookie.
- [x] Buat helper untuk membaca user dari session.
- [x] Buat fitur logout.
- [x] Redirect user berdasarkan role.
- [x] Batasi halaman admin hanya untuk role `admin`.
- [x] Batasi halaman user hanya untuk role `user`.
- [x] Hapus halaman setup admin pertama dan gunakan seed admin default.

## Tahap 8 - Layout dan Navigasi Dashboard

- [x] Buat layout utama dashboard.
- [x] Buat sidebar navigasi admin.
- [x] Buat sidebar navigasi user.
- [x] Buat header dashboard.
- [x] Buat halaman dashboard admin.
- [x] Buat halaman dashboard user.
- [x] Tambahkan navigasi aktif sesuai halaman.
- [x] Pastikan layout responsif di mobile.
- [x] Tambahkan empty state untuk data kosong.
- [ ] Tambahkan loading state dasar untuk perpindahan atau submit data.

## Tahap 9 - Manajemen Anggota Admin

- [x] Buat halaman list anggota.
- [x] Buat query list anggota dari database.
- [x] Buat form tambah anggota.
- [x] Simpan anggota baru ke tabel `users`.
- [x] Hash password anggota baru.
- [x] Validasi email unik melalui database.
- [x] Buat fitur edit data anggota.
- [x] Buat fitur ubah role anggota.
- [x] Buat fitur aktif dan nonaktif anggota.
- [x] Buat filter anggota berdasarkan role atau status.
- [x] Buat pencarian anggota berdasarkan nama atau email.
- [x] Tampilkan pesan sukses dan error yang mudah dipahami.

## Tahap 10 - Presensi Pekerjaan User

- [x] Buat halaman riwayat presensi sendiri.
- [x] Buat query presensi berdasarkan user login.
- [x] Buat form tambah presensi pekerjaan.
- [x] Tambahkan input nama pekerjaan.
- [x] Tambahkan input deskripsi pekerjaan.
- [x] Tambahkan input jam masuk.
- [x] Tambahkan input jam keluar.
- [x] Tambahkan status `sedang_dikerjakan`, `selesai`, `izin`, `sakit`, dan `alpha`.
- [x] Simpan presensi ke tabel `attendances`.
- [x] Buat fitur update jam keluar saat pekerjaan selesai.
- [x] Validasi jam keluar tidak boleh lebih awal dari jam masuk.
- [x] Pastikan user boleh membuat beberapa presensi dalam satu hari.
- [x] Putuskan aturan satu atau banyak presensi aktif dalam waktu yang sama.

## Tahap 11 - List Absensi Admin

- [x] Buat halaman list absensi semua anggota.
- [x] Buat query join `attendances` dengan `users`.
- [x] Tambahkan filter berdasarkan tanggal.
- [x] Tambahkan filter berdasarkan nama anggota.
- [x] Tambahkan filter berdasarkan status presensi.
- [x] Tampilkan nama anggota.
- [x] Tampilkan nama pekerjaan.
- [x] Tampilkan jam masuk dan jam keluar.
- [x] Tampilkan status presensi.
- [x] Tampilkan total presensi per anggota.
- [ ] Tambahkan pagination jika data mulai besar.

## Tahap 12 - Monitoring Greenhouse User

- [x] Buat halaman tambah monitoring greenhouse.
- [x] Tambahkan input tanggal monitoring.
- [x] Tambahkan input kondisi air.
- [x] Tambahkan input pH air.
- [x] Tambahkan input suhu air.
- [x] Tambahkan input suhu udara.
- [x] Tambahkan input kelembaban.
- [x] Tambahkan input kondisi tanaman.
- [x] Tambahkan input kondisi hama atau penyakit.
- [x] Tambahkan input catatan tambahan.
- [x] Buat upload foto dokumentasi.
- [x] Batasi tipe file foto hanya gambar.
- [x] Batasi ukuran maksimal foto.
- [x] Simpan file foto ke `public/uploads/greenhouse`.
- [x] Simpan data monitoring ke tabel `greenhouse_monitorings`.
- [x] Simpan path foto ke tabel `monitoring_photos`.
- [x] Gunakan transaksi database saat menyimpan monitoring dan foto.

## Tahap 13 - List dan Detail Monitoring Greenhouse

- [x] Buat halaman list monitoring untuk admin.
- [x] Buat halaman list monitoring untuk user.
- [x] User dapat melihat input monitoring anggota lain.
- [x] Buat query join monitoring dengan user dan foto.
- [x] Tampilkan nama penginput.
- [x] Tampilkan tanggal monitoring.
- [x] Tampilkan ringkasan kondisi air dan tanaman.
- [x] Tampilkan foto dokumentasi.
- [x] Tambahkan halaman detail monitoring.
- [x] Tampilkan semua data monitoring di halaman detail.
- [x] Tampilkan semua foto pada halaman detail.
- [ ] Tambahkan filter berdasarkan tanggal atau nama penginput jika diperlukan.

## Tahap 14 - Komentar Admin

- [x] Buat form komentar pada detail monitoring.
- [x] Batasi form komentar hanya untuk admin.
- [x] Simpan komentar ke tabel `comments`.
- [x] Pastikan `admin_id` berasal dari session admin.
- [x] Admin dapat melihat semua komentar pada monitoring.
- [x] User dapat melihat komentar admin pada monitoring.
- [x] Tampilkan waktu komentar dibuat.
- [x] Tambahkan pesan sukses dan error setelah komentar dikirim.

## Tahap 15 - Leaderboard Presensi

- [x] Buat query 5 anggota dengan presensi `selesai` terbanyak.
- [x] Gunakan agregasi Drizzle untuk menghitung total presensi selesai.
- [x] Buat komponen leaderboard.
- [x] Tampilkan ranking anggota.
- [x] Tampilkan nama anggota.
- [x] Tampilkan total presensi selesai.
- [x] Tampilkan leaderboard di dashboard user.
- [x] Tampilkan leaderboard di dashboard admin.
- [x] Pastikan user nonaktif tidak masuk leaderboard jika aturan bisnis membutuhkan.

## Tahap 16 - UI, State, dan Error Handling

- [x] Rapikan tampilan login.
- [x] Rapikan dashboard admin.
- [x] Rapikan dashboard user.
- [x] Rapikan tabel data.
- [x] Rapikan form input.
- [ ] Tambahkan state loading untuk submit form.
- [ ] Tambahkan disabled state saat submit berjalan.
- [x] Tambahkan empty state saat data kosong.
- [ ] Tambahkan error state saat query gagal.
- [ ] Tambahkan konfirmasi untuk aksi penting seperti nonaktif anggota.
- [x] Pastikan tampilan responsif di mobile.

## Tahap 17 - Testing Manual

- [ ] Test koneksi database MySQL.
- [ ] Test migration Drizzle.
- [x] Test seed admin default.
- [ ] Test login admin.
- [ ] Test login user.
- [ ] Test logout.
- [ ] Test proteksi halaman admin.
- [ ] Test proteksi halaman user.
- [ ] Test tambah anggota.
- [ ] Test edit anggota.
- [ ] Test aktif dan nonaktif anggota.
- [ ] Test pencarian dan filter anggota.
- [ ] Test tambah presensi beberapa kali dalam satu hari.
- [ ] Test update jam keluar presensi.
- [ ] Test validasi jam keluar.
- [ ] Test list absensi admin.
- [ ] Test filter absensi admin.
- [ ] Test tambah monitoring greenhouse.
- [ ] Test upload foto.
- [ ] Test list monitoring admin.
- [ ] Test list monitoring user.
- [ ] Test detail monitoring.
- [ ] Test komentar admin.
- [ ] Test leaderboard.
- [ ] Test tampilan mobile.

## Tahap 18 - Dokumentasi

- [ ] Update `PRD.md` jika ada perubahan fitur.
- [ ] Update `ERD.md` jika ada perubahan database.
- [x] Tambahkan panduan setup project.
- [x] Tambahkan panduan konfigurasi `.env`.
- [x] Tambahkan panduan membuat database MySQL.
- [x] Tambahkan panduan menjalankan migration Drizzle.
- [x] Tambahkan panduan menjalankan Drizzle Studio.
- [x] Tambahkan panduan menjalankan aplikasi.
- [ ] Tambahkan akun contoh untuk testing lokal jika diperlukan.

## Tahap Lanjutan

- [ ] Tambahkan edit dan hapus data monitoring jika dibutuhkan.
- [ ] Tambahkan reset password anggota oleh admin.
- [ ] Tambahkan pagination untuk tabel besar.
- [ ] Tambahkan export data absensi.
- [ ] Tambahkan export data monitoring.
- [ ] Tambahkan test otomatis untuk logic validasi Zod.
- [ ] Tambahkan test otomatis untuk query dan server action.
- [ ] Tambahkan audit log untuk aktivitas admin.
- [ ] Tambahkan backup database.
