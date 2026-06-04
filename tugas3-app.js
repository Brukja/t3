var tugas3App = new Vue({
  el: '#tugas3-app',
  data: {
    upbjjList: APP_DATA_BAHAN_AJAR.upbjjList || [],
    kategoriList: APP_DATA_BAHAN_AJAR.kategoriList || [],
    pengirimanList: APP_DATA_BAHAN_AJAR.pengirimanList || [],
    paket: APP_DATA_BAHAN_AJAR.paket || [],
    stok: APP_DATA_BAHAN_AJAR.stok || [],
    tracking: APP_DATA_BAHAN_AJAR.tracking || {},
    filterUpbjj: '',
    filterKategori: '',
    searchJudul: '',
    dd: { upbjj: false, kategori: false },
    currentTime: ''
  },
  computed: {
    totalUpbjj() { return this.upbjjList.length; },
    totalKategori() { return this.kategoriList.length; },
    totalEkspedisi() { return this.pengirimanList.length; },
    totalPaket() { return this.paket.length; },
    totalStokItems() { return this.stok.length; },
    totalStokQty() { return this.stok.reduce((sum, item) => sum + item.qty, 0); },
    filteredStok() {
      return this.stok.filter(item => {
        var okUpbjj = !this.filterUpbjj || item.upbjj === this.filterUpbjj;
        var okKat = !this.filterKategori || item.kategori === this.filterKategori;
        var okSearch = !this.searchJudul || item.judul.toLowerCase().includes(this.searchJudul.toLowerCase());
        return okUpbjj && okKat && okSearch;
      });
    },
    trackingList() {
      return Object.keys(this.tracking).map(key => Object.assign({ no: key }, this.tracking[key]));
    }
  },
  methods: {
    formatRupiah(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); },
    statusLabel(item) {
      if (item.qty === 0) return '🔴 Kosong';
      if (item.qty < item.safety) return '🟡 Menipis';
      return '🟢 Aman';
    },
    statusStyle(item) {
      if (item.qty === 0) return 'color: var(--danger); font-weight: 700;';
      if (item.qty < item.safety) return 'color: var(--warning); font-weight: 700;';
      return 'color: var(--success); font-weight: 700;';
    },
    toggleDD(name) {
      var open = this.dd[name];
      this.dd.upbjj = false;
      this.dd.kategori = false;
      this.dd[name] = !open;
    },
    pilihDD(name, value) {
      this.dd[name] = false;
      if (name === 'upbjj') this.filterUpbjj = value;
      if (name === 'kategori') this.filterKategori = value;
    },
    resetFilter() {
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.searchJudul = '';
      this.dd.upbjj = false;
      this.dd.kategori = false;
    },
    perbaruiWaktu() {
      var now = new Date();
      this.currentTime = now.toLocaleTimeString('id-ID');
    }
  },
  mounted() {
    this.perbaruiWaktu();
    setInterval(this.perbaruiWaktu, 1000);
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select')) {
        this.dd.upbjj = false;
        this.dd.kategori = false;
      }
    });
  }
});