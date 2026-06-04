# Tugas 3 - SITTA UT Vue Components

Aplikasi SITTA (Sistem Informasi Tiras dan Transaksi Bahan Ajar) Universitas Terbuka dengan Vue.js Components Architecture.

## 📋 Struktur Proyek

```
tugas3/
├── index.html                          # Main entry point
├── assets/
│   └── css/
│       └── style.css                   # Global styles
├── data/
│   └── dataBahanAjar.json             # Data source (JSON)
├── js/
│   ├── app.js                         # Root Vue instance
│   ├── services/
│   │   └── api.js                     # Data fetching service
│   └── components/
│       ├── status-badge.js            # <status-badge> component
│       ├── stock-table.js             # <ba-stock-table> component
│       ├── do-tracking.js             # <do-tracking> component
│       └── app-modal.js               # <app-modal> component
└── templates/
    ├── status-badge.html              # <status-badge> template
    ├── stock-table.html               # <ba-stock-table> template
    ├── do-tracking.html               # <do-tracking> template
    └── app-modal.html                 # <app-modal> template
```

## 🎯 Fitur Utama

### 1️⃣ Halaman Stok Bahan Ajar (`<ba-stock-table>`)

**Menampilkan & Mengelola Stok:**
- ✅ Tabel lengkap dengan kolom: Kode, Judul, Kategori, UT Daerah, Lokasi Rak, Harga, Qty, Safety, Status
- ✅ Formatting data: Harga dengan Rupiah (Rp), Qty dengan satuan "buah"
- ✅ Status badge interaktif dengan tooltip hover (catatanHTML)

**Filter & Sort:**
- ✅ Filter by UT Daerah (dependent filter)
- ✅ Filter by Kategori (muncul setelah UT Daerah dipilih)
- ✅ Cari by Judul (real-time search)
- ✅ Sort by: Judul, Qty, Harga (ascending/descending)
- ✅ Filter spesial: Tampilkan Menipis (qty < safety), Tampilkan Kosong (qty = 0)
- ✅ Reset filter (semua filter kembali ke default)

**CRUD Operations:**
- ✅ **CREATE**: Modal tambah bahan ajar dengan validasi, Enter key to save
- ✅ **READ**: Tabel dengan v-for list rendering
- ✅ **UPDATE**: Modal edit bahan ajar, Enter key to save
- ✅ **DELETE**: Konfirmasi popup sebelum hapus

**Status Visual:**
- 🟢 **Aman**: Qty >= Safety (warna hijau)
- 🟡 **Menipis**: 0 < Qty < Safety (warna kuning/orange)
- 🔴 **Kosong**: Qty = 0 (warna merah)

**Vue Directives & Features:**
- ✅ v-if, v-else, v-show untuk conditional rendering
- ✅ v-for untuk list rendering dengan index
- ✅ v-bind untuk class binding, style binding
- ✅ v-model untuk two-way data binding
- ✅ @click, @keydown event handlers
- ✅ Computed properties: `stokTerfilter`, `kategoriTersedia`, `totalStok`, dll
- ✅ Methods: filter, sort, CRUD operations
- ✅ 2 Watchers: `filterUpbjj`, `stokData` (deep watch)
- ✅ Custom filters untuk Rupiah & Qty

### 2️⃣ Tracking Delivery Order (`<do-tracking>`)

**Pencarian DO:**
- ✅ Cari by Nomor DO atau NIM
- ✅ Enter key untuk search, Esc key untuk reset
- ✅ Hint: Daftar nomor DO tersedia

**Menambah DO Baru:**
- ✅ Nomor DO auto-generate: DO + Tahun + Sequence (misal: DO2025-001)
- ✅ Form input: NIM, Nama, Ekspedisi (dropdown), Paket (dropdown), Tanggal Kirim, Total Harga
- ✅ Paket detail muncul setelah memilih paket (isi, harga, dll)
- ✅ Tanggal diformat: "25 Agustus 2025"
- ✅ Total harga otomatis dari paket dipilih, format Rupiah
- ✅ Validasi form sederhana
- ✅ Enter key atau button click untuk submit

**Tracking Status:**
- ✅ Progress bar visual 5 step: Menunggu Pickup → Diterima Kurir → Di Hub → Proses Antar → Selesai
- ✅ Timeline riwayat perjalanan (waktu + keterangan)
- ✅ Detail paket: Ekspedisi, Tanggal Kirim, Kode Paket, Total Harga
- ✅ Tombol tambah status perjalanan baru (waktu auto dari Date, keterangan manual)

**Daftar Semua DO:**
- ✅ Tabel semua DO dengan aksi "Lacak" untuk melacak detail

**Vue Features:**
- ✅ v-model two-way binding untuk input
- ✅ v-if conditional untuk show/hide hasil tracking
- ✅ v-for untuk list perjalanan dan tabel DO
- ✅ Computed properties: `nomorDOBerikutnya`, `progressPersen`, `stepAktif`
- ✅ Methods: search, create DO, add perjalanan
- ✅ 3 Watchers: `searchNoDO`, `trackingData` (deep), `formDO.paketKode`
- ✅ Keyboard event handling (Enter, Esc)
- ✅ Custom filters untuk format Rupiah

## 🛠️ Teknologi

- **Vue.js 2** - Progressive JavaScript Framework
- **HTML5** - Semantic markup
- **CSS3** - Modern styling dengan CSS variables
- **JavaScript (ES6)** - Modern JavaScript

## 📝 Vue.js Implementation Details

### Indikator Capaian Pembelajaran:

1. ✅ **Arsitektur Vue Component** (20 poin)
   - Vue Component terpisah per file
   - Template terpisah di folder templates/
   - Service layer (api.js) untuk data fetching
   - Struktur folder rapi dan terorganisir

2. ✅ **Data Binding & Directive** (10 poin)
   - `{{ mustaches }}` untuk display data
   - `v-text`, `v-html` untuk text binding
   - `v-bind` untuk attribute binding
   - `v-model` untuk form binding

3. ✅ **Conditional Rendering** (7 poin)
   - `v-if`, `v-else`, `v-else-if` untuk conditional logic
   - `v-show` untuk toggle visibility
   - Operator ternary dalam template

4. ✅ **Data Binding & Properties** (10 poin)
   - **Computed Properties**: `stokTerfilter`, `kategoriTersedia`, `totalStok`, `jumlahMenipis`, `jumlahKosong`, `progressPersen`, `stepAktif`, dll
   - **Methods**: filter, sort, CRUD, event handlers
   - **Data Binding**: one-way, two-way dengan v-model

5. ✅ **Watchers** (10 poin)
   - Minimal 2 watchers per komponen
   - `filterUpbjj` watcher di stock-table
   - `stokData` deep watcher di stock-table
   - `searchNoDO` watcher di do-tracking
   - `trackingData` deep watcher di do-tracking

6. ✅ **Array Rendering** (10 poin)
   - `v-for` dengan zero-based index: `v-for="(item, idx) in array"`
   - `v-for` dengan name-based key: `v-for="(data, noDO) in tracking"`
   - Filtering dan sorting data

7. ✅ **Text Formatting (Filters)** (10 poin)
   - Format Rupiah: `formatRupiah(n)`
   - Format Qty: `formatQty(qty)`
   - Format Tanggal: `tanggalFormat` computed
   - Format Status: `statusLabel(item)`

8. ✅ **Custom Element & Component** (8 poin)
   - `<ba-stock-table>` component
   - `<do-tracking>` component
   - `<status-badge>` component
   - `<app-modal>` component
   - Props usage: `:qty`, `:safety`, `:catatan`

### Validasi Input:

**Stock Table:**
- Kode tidak boleh kosong & tidak duplicate
- Judul, UT Daerah, Kategori, Lokasi Rak required
- Harga, Qty, Safety harus angka

**Tracking:**
- NIM, Nama required
- Ekspedisi, Paket required
- Tanggal Kirim required

## 🚀 Cara Menggunakan

1. **Buka index.html** di browser
2. **Tab Stok Bahan Ajar**:
   - Filter by UT Daerah → Kategori akan muncul
   - Cari judul atau gunakan sort
   - Klik ➕ untuk tambah, ✏️ untuk edit, 🗑️ untuk hapus
   - Tekan Enter saat di form untuk instant save

3. **Tab Tracking**:
   - Masukkan Nomor DO atau NIM untuk cari
   - Tekan Enter atau Esc untuk kontrol
   - Klik ➕ Tambah DO untuk membuat DO baru
   - Klik 🔍 Lacak untuk melihat detail

## 📊 Data Format

Lihat `data/dataBahanAjar.json` untuk struktur data lengkap.

### Stok Item:
```json
{
  "kode": "EKMA4116",
  "judul": "Pengantar Manajemen",
  "kategori": "MK Wajib",
  "upbjj": "Jakarta",
  "lokasiRak": "R1-A3",
  "harga": 65000,
  "qty": 28,
  "safety": 20,
  "catatanHTML": "<em>Edisi 2024, cetak ulang</em>"
}
```

### Tracking Item:
```json
{
  "nim": "123456789",
  "nama": "Rina Wulandari",
  "status": "Di Hub",
  "ekspedisi": "JNE-REG",
  "tanggalKirim": "25 Agustus 2025",
  "paket": "PAKET-UT-001",
  "total": 120000,
  "perjalanan": [...]
}
```

## 🎨 User Experience

- **Responsive Design**: Mobile-friendly interface
- **Visual Feedback**: Hover effects, loading states, error alerts
- **Keyboard Navigation**: Enter untuk submit, Esc untuk cancel
- **Real-time Search**: Live filtering tanpa delay
- **Progress Visualization**: Tracking progress dengan step indicator
- **Color Coding**: Status dengan visual cues (hijau=aman, kuning=warning, merah=danger)

## 📚 Learning Outcomes

Setelah menyelesaikan tugas ini, mahasiswa dapat:

1. Mengorganisir kode Vue.js dengan struktur component architecture
2. Menggunakan Vue directives dengan efektif
3. Membuat computed properties dan watchers
4. Menangani event keyboard dan mouse
5. Melakukan validasi form input
6. Mengimplementasikan CRUD operations
7. Format dan transform data menggunakan filters
8. Membuat reusable Vue components

---

**Dibuat untuk:** Tugas Praktik 3 - Universitas Terbuka  
**Framework:** Vue.js 2  
**Tanggal:** 2025
