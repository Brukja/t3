// data.js 

// ─── DATA DEFAULT ───────────────────────────────────────────────
var DEFAULT_STOK = [
  { kode:"EKMA4116", judul:"Pengantar Manajemen",       kategori:"MK Wajib",      upbjj:"Jakarta",  lokasiRak:"R1-A3", harga:65000, qty:28, safety:20, catatanHTML:"<em>Edisi 2024, cetak ulang</em>" },
  { kode:"EKMA4115", judul:"Pengantar Akuntansi",       kategori:"MK Wajib",      upbjj:"Jakarta",  lokasiRak:"R1-A4", harga:60000, qty:7,  safety:15, catatanHTML:"<strong>Cover baru</strong>" },
  { kode:"BIOL4201",  judul:"Biologi Umum (Praktikum)", kategori:"Praktikum",     upbjj:"Surabaya", lokasiRak:"R3-B2", harga:80000, qty:12, safety:10, catatanHTML:"Butuh <u>pendingin</u> untuk kit basah" },
  { kode:"FISIP4001", judul:"Dasar-Dasar Sosiologi",    kategori:"MK Pilihan",    upbjj:"Makassar", lokasiRak:"R2-C1", harga:55000, qty:2,  safety:8,  catatanHTML:"Stok <i>menipis</i>, prioritaskan reorder" },
  { kode:"EKMA4370",  judul:"Kewirausahaan",             kategori:"MK Pilihan",    upbjj:"Denpasar", lokasiRak:"R4-D1", harga:70000, qty:0,  safety:5,  catatanHTML:"Stok <strong>habis</strong>" },
  { kode:"PDGK4201",  judul:"Pembelajaran PKn SD",       kategori:"Problem-Based", upbjj:"Padang",   lokasiRak:"R2-A2", harga:58000, qty:35, safety:10, catatanHTML:"Edisi terbaru" }
];

var DEFAULT_TRACKING = {
  "DO2025-001": {
    nomorDO:"DO2025-001", nim:"123456789", nama:"Rina Wulandari",
    status:"Di Hub", ekspedisi:"JNE-REG", tanggalKirim:"2025-08-25",
    paket:"PAKET-UT-001", total:120000,
    perjalanan:[
      { waktu:"2025-08-25 10:12:20", keterangan:"DO dibuat. Menunggu pickup oleh kurir." },
      { waktu:"2025-08-25 12:30:00", keterangan:"Paket diterima kurir JNE di Loket: TANGSEL" },
      { waktu:"2025-08-25 14:07:56", keterangan:"Tiba di Hub Sortir: JAKSEL" }
    ]
  },
  "DO2025-002": {
    nomorDO:"DO2025-002", nim:"987654321", nama:"Agus Pranoto",
    status:"Selesai", ekspedisi:"JNE-EXP", tanggalKirim:"2025-08-20",
    paket:"PAKET-UT-002", total:140000,
    perjalanan:[
      { waktu:"2025-08-20 09:00:00", keterangan:"DO dibuat. Menunggu pickup oleh kurir." },
      { waktu:"2025-08-20 10:15:00", keterangan:"Paket diterima kurir JNE di Loket: TANGERANG" },
      { waktu:"2025-08-20 13:00:00", keterangan:"Tiba di Hub Sortir: JAKARTA" },
      { waktu:"2025-08-21 08:00:00", keterangan:"Paket dalam proses antar ke alamat tujuan" },
      { waktu:"2025-08-21 14:30:00", keterangan:"Selesai diantar. Penerima: Agus Pranoto" }
    ]
  },
  "DO2025-003": {
    nomorDO:"DO2025-003", nim:"112233445", nama:"Siti Rahayu",
    status:"Proses Antar", ekspedisi:"JNE-REG", tanggalKirim:"2025-08-26",
    paket:"PAKET-UT-003", total:130000,
    perjalanan:[
      { waktu:"2025-08-26 08:00:00", keterangan:"DO dibuat. Menunggu pickup oleh kurir." },
      { waktu:"2025-08-26 09:45:00", keterangan:"Paket diterima kurir JNE di Loket: DEPOK" },
      { waktu:"2025-08-26 13:20:00", keterangan:"Tiba di Hub Sortir: JAKARTA SELATAN" },
      { waktu:"2025-08-27 07:55:00", keterangan:"Paket dalam proses antar ke alamat tujuan" }
    ]
  }
};

var DEFAULT_PENGGUNA = [
  { id:1, nama:"Rina Wulandari", email:"rina@ut.ac.id",  password:"rina123",  role:"UPBJJ-UT",      lokasi:"UPBJJ Jakarta" },
  { id:2, nama:"Agus Pranoto",   email:"agus@ut.ac.id",  password:"agus123",  role:"UPBJJ-UT",      lokasi:"UPBJJ Makassar" },
  { id:3, nama:"Siti Marlina",   email:"siti@ut.ac.id",  password:"siti123",  role:"Puslaba",       lokasi:"Pusat" },
  { id:4, nama:"Admin SITTA",    email:"admin@ut.ac.id", password:"admin123", role:"Administrator", lokasi:"Pusat" },
  { id:5, nama:"Petugas UT",     email:"petugas@ut.ac.id",  password:"petugas123",  role:"Petugas Gudang", lokasi:"Pusat" },
  { id:6, nama:"Muh. Luthfi",    email:"luth@ut.ac.id",  password:"luth123",  role:"UPBJJ-UT",      lokasi:"UPBJJ Mataram" },
];

// ─── STORAGE HELPERS ────────────────────────────────────────────
var SITTA = {
  // Bahan Ajar
  getStok: function() {
    try {
      var raw = localStorage.getItem('sitta_stok');
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_STOK));
    } catch(e) { return JSON.parse(JSON.stringify(DEFAULT_STOK)); }
  },
  saveStok: function(data) {
    localStorage.setItem('sitta_stok', JSON.stringify(data));
  },

  // Tracking / DO
  getTracking: function() {
    try {
      var raw = localStorage.getItem('sitta_tracking');
      var data = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_TRACKING));
      // Bersihkan entri dummy/test yang mungkin tersimpan di localStorage
      var namaDummy = ['lionel messi', 'messi', 'test', 'dummy', 'coba'];
      var berubah = false;
      Object.keys(data).forEach(function(k) {
        var n = (data[k].nama || '').toLowerCase().trim();
        if (namaDummy.indexOf(n) !== -1) { delete data[k]; berubah = true; }
      });
      if (berubah) localStorage.setItem('sitta_tracking', JSON.stringify(data));
      return data;
    } catch(e) { return JSON.parse(JSON.stringify(DEFAULT_TRACKING)); }
  },
  saveTracking: function(data) {
    localStorage.setItem('sitta_tracking', JSON.stringify(data));
  },

  // Reset ke default (untuk keperluan dev/testing)
  reset: function() {
    localStorage.removeItem('sitta_stok');
    localStorage.removeItem('sitta_tracking');
    console.log('Data direset ke default.');
  }
};

// ─── Alias untuk kompatibilitas dashboard.html ──────────────────
var dataBahanAjar = SITTA.getStok();
var dataTracking  = SITTA.getTracking();
var dataPengguna  = DEFAULT_PENGGUNA;
