/**
 * components/stock-table.js
 * Vue Component untuk menampilkan tabel stok bahan ajar
 */

Vue.component('ba-stock-table', {
  template: '#tpl-stock-table',
  data() {
    return {
      stokData: [],
      filterUpbjj: '',
      filterKategori: '',
      filterMenipis: false,
      filterKosong: false,
      sortBy: 'judul',
      sortAsc: true,
      searchJudul: '',
      upbjjList: [],
      kategoriList: [],
      editingItem: null,
      editIndex: -1,
      showEditModal: false,
      showDeleteConfirm: false,
      deleteIndex: -1,
      showAddModal: false,
      formNew: {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: '',
        qty: '',
        safety: '',
        catatanHTML: ''
      },
      formErrors: {},
      watchLog: []
    };
  },
  computed: {
    /**
     * Computed: Kategori tersedia berdasarkan filter UPBJJ
     */
    kategoriTersedia() {
      if (!this.filterUpbjj) return this.kategoriList;
      const categorySet = new Set(
        this.stokData
          .filter(s => s.upbjj === this.filterUpbjj)
          .map(s => s.kategori)
      );
      return Array.from(categorySet);
    },

    /**
     * Computed: Filter dan sort stok data
     */
    stokTerfilter() {
      let filtered = this.stokData.filter(item => {
        const lolosUpbjj = !this.filterUpbjj || item.upbjj === this.filterUpbjj;
        const lolosKategori = !this.filterKategori || item.kategori === this.filterKategori;
        const lolosSearch = !this.searchJudul || 
          item.judul.toLowerCase().includes(this.searchJudul.toLowerCase());
        
        let loloCond = true;
        if (this.filterMenipis && this.filterKosong) {
          loloCond = item.qty === 0 || (item.qty > 0 && item.qty < item.safety);
        } else if (this.filterMenipis) {
          loloCond = item.qty > 0 && item.qty < item.safety;
        } else if (this.filterKosong) {
          loloCond = item.qty === 0;
        }

        return lolosUpbjj && lolosKategori && lolosSearch && loloCond;
      });

      return filtered.sort((a, b) => {
        let vA = ['harga', 'qty'].includes(this.sortBy) ? a[this.sortBy] : 
                 a[this.sortBy].toString().toLowerCase();
        let vB = ['harga', 'qty'].includes(this.sortBy) ? b[this.sortBy] : 
                 b[this.sortBy].toString().toLowerCase();
        
        if (vA < vB) return this.sortAsc ? -1 : 1;
        if (vA > vB) return this.sortAsc ? 1 : -1;
        return 0;
      });
    },

    /**
     * Computed: Hitung jumlah stok menipis
     */
    jumlahMenipis() {
      return this.stokData.filter(s => s.qty > 0 && s.qty < s.safety).length;
    },

    /**
     * Computed: Hitung jumlah stok kosong
     */
    jumlahKosong() {
      return this.stokData.filter(s => s.qty === 0).length;
    },

    /**
     * Computed: Total stok
     */
    totalStok() {
      return this.stokData.reduce((sum, s) => sum + s.qty, 0);
    }
  },

  methods: {
    /**
     * Format Rupiah
     */
    formatRupiah(n) {
      return 'Rp ' + Number(n).toLocaleString('id-ID');
    },

    /**
     * Format quantity dengan satuan buah
     */
    formatQty(qty) {
      return qty + ' buah';
    },

    /**
     * Sorting handler
     */
    aturSort(kolom) {
      if (this.sortBy === kolom) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortBy = kolom;
        this.sortAsc = true;
      }
    },

    /**
     * Sort icon indicator
     */
    ikonSort(kolom) {
      if (this.sortBy !== kolom) return '↕';
      return this.sortAsc ? '↑' : '↓';
    },

    /**
     * Reset filter
     */
    resetFilter() {
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.filterMenipis = false;
      this.filterKosong = false;
      this.sortBy = 'judul';
      this.sortAsc = true;
      this.searchJudul = '';
    },

    /**
     * Buka modal edit
     */
    bukaEdit(index) {
      this.editIndex = index;
      this.editingItem = JSON.parse(JSON.stringify(this.stokTerfilter[index]));
      this.showEditModal = true;
    },

    /**
     * Simpan perubahan
     */
    simpanEdit() {
      if (!this.validasiForm(this.editingItem)) return;
      const originalIndex = this.stokData.findIndex(s => s.kode === this.editingItem.kode);
      Vue.set(this.stokData, originalIndex, this.editingItem);
      this.showEditModal = false;
    },

    /**
     * Konfirmasi hapus
     */
    konfirmasiHapus(index) {
      this.deleteIndex = index;
      this.showDeleteConfirm = true;
    },

    /**
     * Hapus item
     */
    hapusItem() {
      const itemToDelete = this.stokTerfilter[this.deleteIndex];
      const originalIndex = this.stokData.findIndex(s => s.kode === itemToDelete.kode);
      this.stokData.splice(originalIndex, 1);
      this.showDeleteConfirm = false;
    },

    /**
     * Buka modal tambah
     */
    bukaTambah() {
      this.formNew = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: '',
        qty: '',
        safety: '',
        catatanHTML: ''
      };
      this.formErrors = {};
      this.showAddModal = true;
    },

    /**
     * Validasi form
     */
    validasiForm(item) {
      let errors = {};
      
      if (!item.kode || !item.kode.trim()) errors.kode = 'Kode tidak boleh kosong';
      if (!item.judul || !item.judul.trim()) errors.judul = 'Judul tidak boleh kosong';
      if (!item.kategori) errors.kategori = 'Pilih kategori';
      if (!item.upbjj) errors.upbjj = 'Pilih UT Daerah';
      if (!item.lokasiRak || !item.lokasiRak.trim()) errors.lokasiRak = 'Lokasi rak tidak boleh kosong';
      if (item.harga === '' || isNaN(item.harga)) errors.harga = 'Harga harus angka';
      if (item.qty === '' || isNaN(item.qty)) errors.qty = 'Qty harus angka';
      if (item.safety === '' || isNaN(item.safety)) errors.safety = 'Safety harus angka';

      this.formErrors = errors;
      return Object.keys(errors).length === 0;
    },

    /**
     * Simpan item baru (dipanggil saat Enter atau klik tombol)
     */
    simpanBaru() {
      if (!this.validasiForm(this.formNew)) return;

      // Check if kode already exists
      if (this.stokData.find(s => s.kode === this.formNew.kode.trim())) {
        this.formErrors.kode = 'Kode sudah ada';
        return;
      }

      const newItem = {
        kode: this.formNew.kode.trim().toUpperCase(),
        judul: this.formNew.judul.trim(),
        kategori: this.formNew.kategori,
        upbjj: this.formNew.upbjj,
        lokasiRak: this.formNew.lokasiRak.trim(),
        harga: parseInt(this.formNew.harga),
        qty: parseInt(this.formNew.qty),
        safety: parseInt(this.formNew.safety),
        catatanHTML: this.formNew.catatanHTML || '-'
      };

      this.stokData.push(newItem);
      this.showAddModal = false;
    },

    /**
     * Handle Enter key pada form
     */
    handleKeyDown(event) {
      if (event.key === 'Enter') {
        if (this.showEditModal) {
          this.simpanEdit();
        } else if (this.showAddModal) {
          this.simpanBaru();
        }
      }
    }
  },

  mounted() {
    // Load initial data
    this.stokData = window.appData?.stok || [];
    this.upbjjList = window.appData?.upbjjList || [];
    this.kategoriList = window.appData?.kategoriList || [];
  },

  watch: {
    /**
     * Watcher: Monitor filter UPBJJ berubah
     */
    filterUpbjj(newVal, oldVal) {
      this.filterKategori = '';
      this.watchLog.unshift(`🔍 Filter UPBJJ: ${oldVal || 'Semua'} → ${newVal || 'Semua'}`);
      if (this.watchLog.length > 5) this.watchLog.pop();
    },

    /**
     * Watcher: Monitor stok data berubah
     */
    stokData: {
      deep: true,
      handler(newVal) {
        const kosong = newVal.filter(s => s.qty === 0).length;
        const menipis = newVal.filter(s => s.qty > 0 && s.qty < s.safety).length;
        this.watchLog.unshift(`📦 Stok diperbarui — Kosong: ${kosong}, Menipis: ${menipis}`);
        if (this.watchLog.length > 5) this.watchLog.pop();
      }
    }
  }
});
