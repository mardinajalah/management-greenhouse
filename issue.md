# Issues Proyek Greenhouse Management

---

## Issue #1 — Next.js Serialization Error: `Date` object di `getServerSideProps`

**Status:** ✅ Selesai diperbaiki

### Deskripsi Error
```
Error serializing `.members[0].createdAt` returned from `getServerSideProps` in "/admin/members".
Reason: `object` ("[object Date]") cannot be serialized as JSON.
Please only return JSON serializable data types.
```

### Penyebab
Fungsi `getServerSideProps` harus mengembalikan props yang bisa diserialisasi ke JSON agar bisa dikirim dari server ke browser. Format JSON **tidak mendukung** objek `Date` bawaan JavaScript.

Drizzle ORM secara otomatis mengubah kolom `datetime` (kolom `createdAt` di tabel `users`) menjadi objek `Date` saat mengambil data dari database. Ketika Next.js mencoba melakukan JSON-serialize objek tersebut, terjadi error karena `Date` adalah `[object Date]`, bukan plain object.

### Perbaikan yang Diterapkan
**File:** `src/pages/admin/members/index.tsx`

Sebelum dikembalikan melalui `props`, field `createdAt` dipetakan secara eksplisit ke string ISO 8601 menggunakan `.toISOString()`:

```typescript
const rawMembers = await getMembers(query);
const members = rawMembers.map((member) => ({
  ...member,
  createdAt: member.createdAt.toISOString(), // ✅ Date → string ISO
}));
```

Tipe `MembersPageProps` juga diperbarui agar mencerminkan tipe data yang benar (`createdAt: string`).

---

## Issue #2 — React 19 Error: `children` dari `<title>` adalah Array

**Status:** ✅ Selesai diperbaiki

### Deskripsi Error
```
React expects the `children` prop of <title> tags to be a string, number, bigint,
or object with a novel `toString` method but found an Array with length 2 instead.
```

### Penyebab
Di `src/components/DashboardLayout.tsx`, tag `<title>` ditulis seperti ini:

```jsx
<title>{title} - Greenhouse</title>
```

Di React 19, penulisan seperti ini menghasilkan **array children** dengan 2 elemen: `[title_value, " - Greenhouse"]`. React 19 memperketat validasi dan **tidak mengizinkan array** sebagai children dari tag `<title>` karena browser memperlakukan semua konten dalam `<title>` sebagai satu teks tunggal.

### Perbaikan yang Diterapkan
**File:** `src/components/DashboardLayout.tsx`

Mengubah sintaks JSX campuran menjadi satu **template literal** sehingga hasilnya adalah satu string tunggal:

```jsx
// ❌ Sebelum — menghasilkan array children
<title>{title} - Greenhouse</title>

// ✅ Sesudah — menghasilkan satu string
<title>{`${title} - Greenhouse`}</title>
```
