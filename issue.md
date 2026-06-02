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
- [ ] Rapikan struktur folder aplikasi agar siap untuk fitur dashboard.
- [ ] Tentukan penggunaan routing utama: Pages Router atau App Router.

## Tahap 2 - Konfigurasi Environment dan Database MySQL

- [ ] Buat file `.env.example`.
- [ ] Tambahkan contoh konfigurasi `DATABASE_URL` untuk MySQL.
- [ ] Lengkapi file `.env` lokal dengan koneksi database.
- [ ] Buat database MySQL `greenhouse_dashboard`.
- [ ] Pastikan koneksi MySQL dapat diakses dari project.
- [ ] Buat util helper untuk membaca environment variable secara aman.
- [ ] Pastikan nilai environment penting divalidasi sebelum aplikasi berjalan.

## Tahap 3 - Setup Drizzle ORM

- [ ] Buat file `drizzle.config.ts`.
- [ ] Set dialect Drizzle ke `mysql`.
- [ ] Set path schema Drizzle.
- [ ] Set output migration Drizzle.
- [ ] Buat folder database, misalnya `src/db`.
- [ ] Buat file koneksi database Drizzle.
- [ ] Buat koneksi menggunakan `mysql2`.
- [ ] Export instance `db` untuk dipakai server action, API route, atau service.
- [ ] Pastikan koneksi database tidak dipakai di client component.

## Tahap 4 - Schema Database Drizzle

- [ ] Buat schema tabel `users`.
- [ ] Buat schema tabel `attendances`.
- [ ] Buat schema tabel `greenhouse_monitorings`.
- [ ] Buat schema tabel `monitoring_photos`.
- [ ] Buat schema tabel `comments`.
- [ ] Tambahkan enum atau tipe terbatas untuk role `admin` dan `user`.
- [ ] Tambahkan enum atau tipe terbatas untuk status presensi.
- [ ] Tambahkan foreign key antar tabel sesuai ERD.
- [ ] Tambahkan index untuk kolom foreign key.
- [ ] Tambahkan unique index untuk email user.
- [ ] Tambahkan default timestamp `created_at`.
- [ ] Tambahkan timestamp `updated_at`.
- [ ] Tambahkan constraint jam keluar tidak boleh lebih awal dari jam masuk jika memungkinkan di MySQL.
- [ ] Buat relation Drizzle untuk setiap tabel.
- [ ] Export tipe TypeScript hasil infer Drizzle.

## Tahap 5 - Migration dan Validasi Database

- [ ] Jalankan generate migration Drizzle.
- [ ] Review file SQL migration yang dihasilkan.
- [ ] Jalankan migration ke database MySQL.
- [ ] Cek tabel yang terbentuk di database MySQL.
- [ ] Cek foreign key dan index sudah sesuai ERD.
- [ ] Cek Drizzle Studio.
- [ ] Buat seed data admin pertama jika diperlukan.
- [ ] Dokumentasikan cara generate dan migrate database.

## Tahap 6 - Validasi Data dengan Zod

- [ ] Buat schema Zod untuk login.
- [ ] Buat schema Zod untuk tambah anggota.
- [ ] Buat schema Zod untuk edit anggota.
- [ ] Buat schema Zod untuk presensi pekerjaan.
- [ ] Buat schema Zod untuk update jam keluar presensi.
- [ ] Buat schema Zod untuk monitoring greenhouse.
- [ ] Buat schema Zod untuk upload foto monitoring.
- [ ] Buat schema Zod untuk komentar admin.
- [ ] Buat helper format error Zod agar mudah ditampilkan di UI.
- [ ] Pastikan validasi server tidak hanya bergantung pada validasi client.

## Tahap 7 - Autentikasi dan Session

- [ ] Buat halaman login.
- [ ] Buat proses login dengan email atau username.
- [ ] Hash password user sebelum disimpan.
- [ ] Validasi password saat login.
- [ ] Simpan session user menggunakan cookie.
- [ ] Buat helper untuk membaca user dari session.
- [ ] Buat fitur logout.
- [ ] Redirect user berdasarkan role.
- [ ] Batasi halaman admin hanya untuk role `admin`.
- [ ] Batasi halaman user hanya untuk role `user`.
- [ ] Buat halaman setup admin pertama jika belum ada admin.

## Tahap 8 - Layout dan Navigasi Dashboard

- [ ] Buat layout utama dashboard.
- [ ] Buat sidebar navigasi admin.
- [ ] Buat sidebar navigasi user.
- [ ] Buat header dashboard.
- [ ] Buat halaman dashboard admin.
- [ ] Buat halaman dashboard user.
- [ ] Tambahkan navigasi aktif sesuai halaman.
- [ ] Pastikan layout responsif di mobile.
- [ ] Tambahkan empty state untuk data kosong.
- [ ] Tambahkan loading state dasar untuk perpindahan atau submit data.

## Tahap 9 - Manajemen Anggota Admin

- [ ] Buat halaman list anggota.
- [ ] Buat query list anggota dari database.
- [ ] Buat form tambah anggota.
- [ ] Simpan anggota baru ke tabel `users`.
- [ ] Hash password anggota baru.
- [ ] Validasi email unik melalui database.
- [ ] Buat fitur edit data anggota.
- [ ] Buat fitur ubah role anggota.
- [ ] Buat fitur aktif dan nonaktif anggota.
- [ ] Buat filter anggota berdasarkan role atau status.
- [ ] Buat pencarian anggota berdasarkan nama atau email.
- [ ] Tampilkan pesan sukses dan error yang mudah dipahami.

## Tahap 10 - Presensi Pekerjaan User

- [ ] Buat halaman riwayat presensi sendiri.
- [ ] Buat query presensi berdasarkan user login.
- [ ] Buat form tambah presensi pekerjaan.
- [ ] Tambahkan input nama pekerjaan.
- [ ] Tambahkan input deskripsi pekerjaan.
- [ ] Tambahkan input jam masuk.
- [ ] Tambahkan input jam keluar.
- [ ] Tambahkan status `sedang_dikerjakan`, `selesai`, `izin`, `sakit`, dan `alpha`.
- [ ] Simpan presensi ke tabel `attendances`.
- [ ] Buat fitur update jam keluar saat pekerjaan selesai.
- [ ] Validasi jam keluar tidak boleh lebih awal dari jam masuk.
- [ ] Pastikan user boleh membuat beberapa presensi dalam satu hari.
- [ ] Putuskan aturan satu atau banyak presensi aktif dalam waktu yang sama.

## Tahap 11 - List Absensi Admin

- [ ] Buat halaman list absensi semua anggota.
- [ ] Buat query join `attendances` dengan `users`.
- [ ] Tambahkan filter berdasarkan tanggal.
- [ ] Tambahkan filter berdasarkan nama anggota.
- [ ] Tambahkan filter berdasarkan status presensi.
- [ ] Tampilkan nama anggota.
- [ ] Tampilkan nama pekerjaan.
- [ ] Tampilkan jam masuk dan jam keluar.
- [ ] Tampilkan status presensi.
- [ ] Tampilkan total presensi per anggota.
- [ ] Tambahkan pagination jika data mulai besar.

## Tahap 12 - Monitoring Greenhouse User

- [ ] Buat halaman tambah monitoring greenhouse.
- [ ] Tambahkan input tanggal monitoring.
- [ ] Tambahkan input kondisi air.
- [ ] Tambahkan input pH air.
- [ ] Tambahkan input suhu air.
- [ ] Tambahkan input suhu udara.
- [ ] Tambahkan input kelembaban.
- [ ] Tambahkan input kondisi tanaman.
- [ ] Tambahkan input kondisi hama atau penyakit.
- [ ] Tambahkan input catatan tambahan.
- [ ] Buat upload foto dokumentasi.
- [ ] Batasi tipe file foto hanya gambar.
- [ ] Batasi ukuran maksimal foto.
- [ ] Simpan file foto ke `public/uploads/greenhouse`.
- [ ] Simpan data monitoring ke tabel `greenhouse_monitorings`.
- [ ] Simpan path foto ke tabel `monitoring_photos`.
- [ ] Gunakan transaksi database saat menyimpan monitoring dan foto.

## Tahap 13 - List dan Detail Monitoring Greenhouse

- [ ] Buat halaman list monitoring untuk admin.
- [ ] Buat halaman list monitoring untuk user.
- [ ] User dapat melihat input monitoring anggota lain.
- [ ] Buat query join monitoring dengan user dan foto.
- [ ] Tampilkan nama penginput.
- [ ] Tampilkan tanggal monitoring.
- [ ] Tampilkan ringkasan kondisi air dan tanaman.
- [ ] Tampilkan foto dokumentasi.
- [ ] Tambahkan halaman detail monitoring.
- [ ] Tampilkan semua data monitoring di halaman detail.
- [ ] Tampilkan semua foto pada halaman detail.
- [ ] Tambahkan filter berdasarkan tanggal atau nama penginput jika diperlukan.

## Tahap 14 - Komentar Admin

- [ ] Buat form komentar pada detail monitoring.
- [ ] Batasi form komentar hanya untuk admin.
- [ ] Simpan komentar ke tabel `comments`.
- [ ] Pastikan `admin_id` berasal dari session admin.
- [ ] Admin dapat melihat semua komentar pada monitoring.
- [ ] User dapat melihat komentar admin pada monitoring.
- [ ] Tampilkan waktu komentar dibuat.
- [ ] Tambahkan pesan sukses dan error setelah komentar dikirim.

## Tahap 15 - Leaderboard Presensi

- [ ] Buat query 5 anggota dengan presensi `selesai` terbanyak.
- [ ] Gunakan agregasi Drizzle untuk menghitung total presensi selesai.
- [ ] Buat komponen leaderboard.
- [ ] Tampilkan ranking anggota.
- [ ] Tampilkan nama anggota.
- [ ] Tampilkan total presensi selesai.
- [ ] Tampilkan leaderboard di dashboard user.
- [ ] Tampilkan leaderboard di dashboard admin.
- [ ] Pastikan user nonaktif tidak masuk leaderboard jika aturan bisnis membutuhkan.

## Tahap 16 - UI, State, dan Error Handling

- [ ] Rapikan tampilan login.
- [ ] Rapikan dashboard admin.
- [ ] Rapikan dashboard user.
- [ ] Rapikan tabel data.
- [ ] Rapikan form input.
- [ ] Tambahkan state loading untuk submit form.
- [ ] Tambahkan disabled state saat submit berjalan.
- [ ] Tambahkan empty state saat data kosong.
- [ ] Tambahkan error state saat query gagal.
- [ ] Tambahkan konfirmasi untuk aksi penting seperti nonaktif anggota.
- [ ] Pastikan tampilan responsif di mobile.

## Tahap 17 - Testing Manual

- [ ] Test koneksi database MySQL.
- [ ] Test migration Drizzle.
- [ ] Test setup admin pertama.
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
- [ ] Tambahkan panduan setup project.
- [ ] Tambahkan panduan konfigurasi `.env`.
- [ ] Tambahkan panduan membuat database MySQL.
- [ ] Tambahkan panduan menjalankan migration Drizzle.
- [ ] Tambahkan panduan menjalankan Drizzle Studio.
- [ ] Tambahkan panduan menjalankan aplikasi.
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
