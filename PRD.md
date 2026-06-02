# PRD Sistem Dashboard Management Green House

## 1. Ringkasan Produk

Dashboard Management Green House adalah sistem untuk membantu admin dan anggota dalam mengelola aktivitas greenhouse, khususnya pencatatan presensi anggota dan monitoring kondisi air serta tanaman.

Sistem memiliki dua level pengguna:

- Admin
- User

## 2. Tujuan Produk

- Mempermudah admin dalam mengelola anggota dan role pengguna.
- Mempermudah pencatatan kehadiran anggota.
- Mempermudah pencatatan kondisi greenhouse secara berkala.
- Menyediakan dokumentasi foto untuk monitoring air dan tanaman.
- Memberikan ruang komentar dari admin terhadap input monitoring user.
- Menampilkan leaderboard anggota dengan kehadiran terbanyak.

## 3. Target Pengguna

| Pengguna | Deskripsi |
|---|---|
| Admin | Pengelola sistem yang dapat mengatur anggota, melihat absensi, melihat monitoring greenhouse, dan memberi komentar |
| User | Anggota greenhouse yang dapat melakukan presensi dan menginput data monitoring greenhouse |

## 4. Role dan Hak Akses

### 4.1 Admin

Admin dapat:

- Login ke sistem.
- Menambahkan anggota baru.
- Mengubah data anggota.
- Mengatur role anggota sebagai admin atau user.
- Melihat daftar absensi semua anggota.
- Melihat daftar input management greenhouse.
- Memberikan komentar pada input monitoring greenhouse yang dibuat oleh user.

### 4.2 User

User dapat:

- Login ke sistem.
- Melihat daftar kehadiran sendiri.
- Menambahkan presensi pekerjaan untuk hari ini.
- Menambahkan data management greenhouse.
- Melihat input management greenhouse dari anggota lain.
- Melihat 5 anggota dengan jumlah kehadiran terbanyak.

## 5. Fitur Utama

### 5.1 Login

Pengguna dapat login menggunakan email atau username dan password.

Kebutuhan:

- Sistem memvalidasi akun pengguna.
- Sistem mengarahkan pengguna sesuai role.
- Admin masuk ke dashboard admin.
- User masuk ke dashboard user.

### 5.2 Manajemen Anggota

Fitur ini hanya dapat diakses oleh admin.

Admin dapat:

- Menambahkan anggota.
- Mengedit data anggota.
- Mengatur role anggota.
- Melihat daftar anggota.
- Menonaktifkan anggota jika diperlukan.

Data anggota:

- Nama
- Email
- Password
- Nomor telepon
- Role
- Status aktif

### 5.3 Absensi Anggota

Admin dapat melihat semua data absensi anggota.

User dapat:

- Melihat riwayat kehadiran sendiri.
- Melakukan presensi pekerjaan untuk hari ini.

Aturan:

- User dapat melakukan presensi beberapa kali dalam satu hari.
- Setiap presensi mewakili satu aktivitas atau pekerjaan tertentu.
- Contoh pekerjaan: mengantar buah, membersihkan greenhouse, menyiram tanaman, mengecek kondisi air, atau pekerjaan operasional lain.
- Setiap presensi memiliki jam masuk dan jam keluar.
- Jam keluar dapat diisi setelah pekerjaan selesai.
- Presensi otomatis menyimpan tanggal input.
- Status presensi dapat berupa sedang dikerjakan, selesai, izin, sakit, atau alpha.

Data presensi:

- Tanggal presensi
- Nama pekerjaan
- Deskripsi pekerjaan
- Jam masuk
- Jam keluar
- Status presensi
- Catatan tambahan

### 5.4 Management Green House

Management Green House adalah input monitoring kondisi air dan tanaman yang dilakukan oleh user.

Data yang dicatat:

- Tanggal monitoring
- Kondisi air
- pH air
- Suhu air
- Kondisi tanaman
- Suhu udara
- Kelembaban
- Kondisi hama atau penyakit
- Catatan tambahan
- Foto dokumentasi

User dapat:

- Menambahkan data monitoring greenhouse.
- Melihat input monitoring milik anggota lain.
- Melihat komentar admin pada data monitoring.

Admin dapat:

- Melihat semua data monitoring greenhouse.
- Memberikan komentar pada input monitoring.

### 5.5 Komentar Admin

Admin dapat memberikan komentar terhadap input monitoring greenhouse.

Komentar dapat berisi:

- Catatan evaluasi.
- Instruksi perbaikan.
- Validasi kondisi greenhouse.
- Saran tindakan lanjutan.

### 5.6 Leaderboard Presensi

Sistem menampilkan 5 anggota dengan jumlah presensi pekerjaan selesai terbanyak.

Data yang ditampilkan:

- Ranking
- Nama anggota
- Total presensi selesai

## 6. Daftar Halaman

| Halaman | Admin | User |
|---|---:|---:|
| Login | Ya | Ya |
| Dashboard | Ya | Ya |
| Manajemen Anggota | Ya | Tidak |
| List Absensi Semua Anggota | Ya | Tidak |
| Riwayat Kehadiran Sendiri | Tidak | Ya |
| Tambah Presensi Pekerjaan Hari Ini | Tidak | Ya |
| List Monitoring Greenhouse | Ya | Ya |
| Tambah Monitoring Greenhouse | Tidak | Ya |
| Detail Monitoring | Ya | Ya |
| Komentar Monitoring | Ya | Lihat saja |
| Leaderboard Presensi | Ya | Ya |

## 7. Aturan Bisnis

1. Hanya admin yang dapat menambahkan dan mengatur role anggota.
2. Role pengguna hanya terdiri dari admin dan user.
3. User dapat melakukan beberapa presensi dalam satu hari jika pekerjaan yang dilakukan berbeda.
4. User hanya dapat melihat riwayat kehadiran miliknya sendiri.
5. Admin dapat melihat seluruh data absensi anggota.
6. User dapat menambahkan data monitoring greenhouse.
7. User dapat melihat input monitoring greenhouse dari anggota lain.
8. Admin dapat memberikan komentar pada setiap data monitoring greenhouse.
9. Foto dokumentasi wajib saat user menambahkan data monitoring greenhouse.
10. Leaderboard menampilkan 5 user dengan total presensi berstatus selesai terbanyak.
11. Jam keluar tidak boleh lebih awal dari jam masuk.
12. User boleh memiliki lebih dari satu presensi aktif selama sistem mengizinkan pekerjaan paralel, tetapi disarankan hanya satu presensi berstatus sedang dikerjakan pada waktu yang sama.

## 8. MVP

Fitur minimum yang harus dibuat:

1. Login admin dan user.
2. CRUD anggota oleh admin.
3. Presensi pekerjaan harian user dengan jam masuk dan jam keluar.
4. List absensi semua anggota untuk admin.
5. Riwayat kehadiran sendiri untuk user.
6. Input monitoring greenhouse oleh user.
7. Upload foto dokumentasi monitoring.
8. List monitoring greenhouse untuk admin dan user.
9. Komentar admin pada monitoring.
10. Leaderboard 5 anggota dengan presensi selesai terbanyak.

## 9. Kriteria Keberhasilan

- Admin dapat mengelola anggota dan role dengan lancar.
- User dapat melakukan beberapa presensi dalam satu hari sesuai aktivitas pekerjaan yang berbeda.
- User dapat mengisi jam masuk dan jam keluar untuk setiap pekerjaan.
- User dapat menginput monitoring air dan tanaman beserta foto.
- Admin dapat melihat input monitoring dan memberikan komentar.
- Leaderboard menampilkan data presensi selesai yang benar.
