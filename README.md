# Dashboard Management Greenhouse

Dashboard operasional greenhouse untuk manajemen anggota, presensi pekerjaan harian, monitoring kondisi air dan tanaman, komentar admin, dan leaderboard presensi.

## Stack

- Next.js TypeScript
- MySQL
- Drizzle ORM
- Drizzle Kit
- Zod
- mysql2

## Setup

1. Salin `.env.example` menjadi `.env`.
2. Isi `DATABASE_URL` sesuai koneksi MySQL lokal.
3. Buat database:

```sql
CREATE DATABASE greenhouse_dashboard;
```

4. Generate migration:

```bash
npm run db:generate
```

5. Jalankan migration:

```bash
npm run db:migrate
```

6. Jalankan aplikasi:

```bash
npm run dev
```

7. Buat admin default:

```bash
npm run db:seed
```

Admin default:

- Email/username: `admin`
- Password: `admin`

Atau jalankan semua proses database sekaligus:

```bash
npm run db:setup
```

## Script

- `npm run dev` menjalankan development server.
- `npm run build` membuat production build.
- `npm run lint` menjalankan ESLint.
- `npm run db:generate` membuat SQL migration Drizzle.
- `npm run db:migrate` menjalankan migration ke MySQL.
- `npm run db:seed` membuat admin default.
- `npm run db:setup` membuat database, menjalankan migration, lalu membuat admin default.
- `npm run db:studio` membuka Drizzle Studio.
