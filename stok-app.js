//  stok-app.js

var stokApp = new Vue({
  el: '#stok-app',
  data: {
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    stok: SITTA.getStok(),
    // Filter
    filterUpbjj: '',
    filterKategori: '',
    filterMenipis: false,
    filterKosong: false,
    sortBy: 'judul',
    sortAsc: true,
    // State semua custom dropdown — satu objek, key = nama dropdown
    dd: {
      upbjj: false,
      kategori: false,
      sort: false,
      tambahKategori: false,
      tambahUpbjj: false,
      editKategori: false,
      editUpbjj: false
    },
    // Tambah
    showModalTambah: false,
    formBaru: { kode:'', judul:'', kategori:'', upbjj:'', lokasiRak:'', harga:'', qty:'', safety:'', catatanHTML:'' },
    errorsTambah: {},
    suksesTambah: false,
    // Modal Edit
    showModalEdit: false,
    formEdit: {},
    editIndex: null,
    errorsEdit: {},
    suksesEdit: false,
    // Watcher log
    watchLog: []
  },

  computed: {
    tampilFilterKategori() {
      return this.filterUpbjj !== '';
    },
    kategoriTersedia() {
      if (!this.filterUpbjj) return this.kategoriList;
      var set = new Set(this.stok.filter(s => s.upbjj === this.filterUpbjj).map(s => s.kategori));
      return [...set];
    },
    stokTerfilter() {
      var hasil = this.stok.filter(s => {
        var lolosUpbjj    = !this.filterUpbjj    || s.upbjj    === this.filterUpbjj;
        var lolosKategori = !this.filterKategori || s.kategori === this.filterKategori;
        var lolosMenipis  = !this.filterMenipis  || (s.qty > 0 && s.qty < s.safety);
        var lolosKosong   = !this.filterKosong   || s.qty === 0;
        if (this.filterMenipis && this.filterKosong) {
          return lolosUpbjj && lolosKategori && (s.qty === 0 || (s.qty > 0 && s.qty < s.safety));
        }
        return lolosUpbjj && lolosKategori && lolosMenipis && lolosKosong;
      });
      return hasil.slice().sort((a, b) => {
        var vA = ['harga','qty'].includes(this.sortBy) ? a[this.sortBy] : a[this.sortBy].toLowerCase();
        var vB = ['harga','qty'].includes(this.sortBy) ? b[this.sortBy] : b[this.sortBy].toLowerCase();
        if (vA < vB) return this.sortAsc ? -1 : 1;
        if (vA > vB) return this.sortAsc ?  1 : -1;
        return 0;
      });
    },
    jumlahMenipis() { return this.stok.filter(s => s.qty > 0 && s.qty < s.safety).length; },
    jumlahKosong()  { return this.stok.filter(s => s.qty === 0).length; },
    totalStok()     { return this.stok.reduce((sum, s) => sum + s.qty, 0); },
    sortByLabel()   {
      return { judul: 'Judul', qty: 'Stok', harga: 'Harga' }[this.sortBy] || 'Judul';
    }
  },

  methods: {
    formatRupiah(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); },
    aturSort(kol) {
      if (this.sortBy === kol) this.sortAsc = !this.sortAsc;
      else { this.sortBy = kol; this.sortAsc = true; }
    },
    ikonSort(kol) {
      if (this.sortBy !== kol) return '↕';
      return this.sortAsc ? '↑' : '↓';
    },
    resetFilter() {
      this.filterUpbjj = ''; this.filterKategori = '';
      this.filterMenipis = false; this.filterKosong = false;
      this.sortBy = 'judul'; this.sortAsc = true;
      this.tutupSemuaDD();
    },

    // ── Custom Dropdown helpers ──
    toggleDD(nama) {
      var sedangBuka = this.dd[nama];
      this.tutupSemuaDD();
      if (!sedangBuka) this.dd[nama] = true;
    },
    tutupSemuaDD() {
      Object.keys(this.dd).forEach(k => { this.dd[k] = false; });
    },
    // pilihDD: nama dropdown, nilai, path opsional untuk formBaru/formEdit
    pilihDD(nama, nilai, path) {
      this.dd[nama] = false;
      if (path) {
        // set ke formBaru atau formEdit berdasarkan path string
        var parts = path.split('.');
        this[parts[0]][parts[1]] = nilai;
        // hapus error jika ada
        var errKey = parts[1] === 'kategori' ? 'kategori' : parts[1] === 'upbjj' ? 'upbjj' : null;
        if (errKey) {
          if (parts[0] === 'formBaru' && this.errorsTambah[errKey]) Vue.delete(this.errorsTambah, errKey);
          if (parts[0] === 'formEdit' && this.errorsEdit[errKey])   Vue.delete(this.errorsEdit, errKey);
        }
      } else {
        // filter bar dropdowns
        if (nama === 'upbjj')    this.filterUpbjj    = nilai;
        if (nama === 'kategori') this.filterKategori = nilai;
        if (nama === 'sort')     this.sortBy         = nilai;
      }
    },

    // Tambah Item
    bukaModalTambah() {
      this.formBaru = { kode:'', judul:'', kategori:'', upbjj:'', lokasiRak:'', harga:'', qty:'', safety:'', catatanHTML:'' };
      this.errorsTambah = {}; this.suksesTambah = false;
      this.tutupSemuaDD();
      this.showModalTambah = true;
    },
    validasiTambah() {
      var e = {};
      if (!this.formBaru.kode.trim())      e.kode      = 'Kode tidak boleh kosong';
      if (!this.formBaru.judul.trim())     e.judul     = 'Judul tidak boleh kosong';
      if (!this.formBaru.kategori)         e.kategori  = 'Pilih kategori';
      if (!this.formBaru.upbjj)            e.upbjj     = 'Pilih UT Daerah';
      if (!this.formBaru.lokasiRak.trim()) e.lokasiRak = 'Lokasi rak tidak boleh kosong';
      if (this.formBaru.harga  === '' || isNaN(this.formBaru.harga))  e.harga  = 'Harga harus angka';
      if (this.formBaru.qty    === '' || isNaN(this.formBaru.qty))    e.qty    = 'Qty harus angka';
      if (this.formBaru.safety === '' || isNaN(this.formBaru.safety)) e.safety = 'Safety harus angka';
      if (this.stok.find(s => s.kode === this.formBaru.kode.trim())) e.kode = 'Kode sudah ada';
      this.errorsTambah = e;
      return Object.keys(e).length === 0;
    },
    simpanBaru() {
      if (!this.validasiTambah()) return;
      this.stok.push({
        kode: this.formBaru.kode.trim().toUpperCase(),
        judul: this.formBaru.judul.trim(),
        kategori: this.formBaru.kategori,
        upbjj: this.formBaru.upbjj,
        lokasiRak: this.formBaru.lokasiRak.trim(),
        harga: parseInt(this.formBaru.harga),
        qty: parseInt(this.formBaru.qty),
        safety: parseInt(this.formBaru.safety),
        catatanHTML: this.formBaru.catatanHTML || '-'
      });
      this.suksesTambah = true;
      setTimeout(() => { this.showModalTambah = false; }, 1500);
    },

    // Edit Item
    bukaModalEdit(item) {
      this.formEdit = Object.assign({}, item);
      this.editIndex = this.stok.indexOf(item);
      this.errorsEdit = {}; this.suksesEdit = false;
      this.tutupSemuaDD();
      this.showModalEdit = true;
    },
    validasiEdit() {
      var e = {};
      if (!this.formEdit.judul.trim())     e.judul     = 'Judul tidak boleh kosong';
      if (!this.formEdit.lokasiRak.trim()) e.lokasiRak = 'Lokasi rak tidak boleh kosong';
      if (this.formEdit.harga  === '' || isNaN(this.formEdit.harga))  e.harga  = 'Harga harus angka';
      if (this.formEdit.qty    === '' || isNaN(this.formEdit.qty))    e.qty    = 'Qty harus angka';
      if (this.formEdit.safety === '' || isNaN(this.formEdit.safety)) e.safety = 'Safety harus angka';
      this.errorsEdit = e;
      return Object.keys(e).length === 0;
    },
    simpanEdit() {
      if (!this.validasiEdit()) return;
      Vue.set(this.stok, this.editIndex, {
        kode: this.formEdit.kode,
        judul: this.formEdit.judul.trim(),
        kategori: this.formEdit.kategori,
        upbjj: this.formEdit.upbjj,
        lokasiRak: this.formEdit.lokasiRak.trim(),
        harga: parseInt(this.formEdit.harga),
        qty: parseInt(this.formEdit.qty),
        safety: parseInt(this.formEdit.safety),
        catatanHTML: this.formEdit.catatanHTML || '-'
      });
      this.suksesEdit = true;
      setTimeout(() => { this.showModalEdit = false; }, 1500);
    }
  },

  mounted() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select')) this.tutupSemuaDD();
    });
  },

  watch: {
    filterUpbjj(baru, lama) {
      this.filterKategori = '';
      this.watchLog.unshift('🔍 Filter UPBJJ: ' + (lama||'Semua') + ' → ' + (baru||'Semua'));
      if (this.watchLog.length > 5) this.watchLog.pop();
    },
    stok: {
      deep: true,
      handler(val) {
        SITTA.saveStok(val);
        var kosong  = val.filter(s => s.qty === 0).length;
        var menipis = val.filter(s => s.qty > 0 && s.qty < s.safety).length;
        this.watchLog.unshift('📦 Stok diperbarui — Kosong: '+kosong+', Menipis: '+menipis);
        if (this.watchLog.length > 5) this.watchLog.pop();
      }
    }
  }
});
