/**
 * components/do-tracking.js
 * Vue Component untuk tracking Delivery Order
 */

Vue.component('do-tracking', {
  template: '#tpl-do-tracking',
  data() {
    return {
      trackingData: {},
      pengirimanList: [],
      paketList: [],
      searchNoDO: '',
      searchNIM: '',
      hasilTracking: null,
      errorSearch: '',
      showModalTambah: false,
      formDO: {
        nim: '',
        nama: '',
        ekspedisi: '',
        paketKode: '',
        tanggalKirim: new Date().toISOString().split('T')[0],
        keterangan: ''
      },
      formErrors: {},
      paketTerpilih: null,
      watchLog: []
    };
  },
  computed: {
    /**
     * Computed: Generate nomor DO otomatis
     */
    nomorDOBerikutnya() {
      const tahun = new Date().getFullYear();
      const doKeys = Object.keys(this.trackingData).filter(k => k.startsWith('DO' + tahun));
      const maxSeq = doKeys.reduce((max, k) => {
        const parts = k.split('-');
        const seq = parseInt(parts[1]) || 0;
        return seq > max ? seq : max;
      }, 0);
      return `DO${tahun}-${String(maxSeq + 1).padStart(3, '0')}`;
    },

    /**
     * Computed: Hint nomor DO yang tersedia
     */
    hintNomor() {
      return Object.keys(this.trackingData).join(' | ');
    },

    /**
     * Computed: Format tanggal untuk display
     */
    tanggalFormat() {
      const date = new Date(this.formDO.tanggalKirim);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },

    /**
     * Computed: Hitung progress perjalanan
     */
    progressPersen() {
      if (!this.hasilTracking) return 0;
      const statusMap = {
        'Menunggu Pickup': 0,
        'Diterima Kurir': 20,
        'Di Hub': 40,
        'Proses Antar': 60,
        'Selesai': 80
      };
      return statusMap[this.hasilTracking.status] || 0;
    },

    /**
     * Computed: Hitung step aktif
     */
    stepAktif() {
      if (!this.hasilTracking) return 1;
      const statusMap = {
        'Menunggu Pickup': 1,
        'Diterima Kurir': 2,
        'Di Hub': 3,
        'Proses Antar': 4,
        'Selesai': 5
      };
      return statusMap[this.hasilTracking.status] || 1;
    },

    /**
     * Computed: Reverse perjalanan untuk display descending
     */
    perjalananTerbalik() {
      if (!this.hasilTracking || !this.hasilTracking.perjalanan) return [];
      return [...this.hasilTracking.perjalanan].reverse();
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
     * Cari DO berdasarkan nomor atau NIM
     */
    cariDO() {
      this.errorSearch = '';
      this.hasilTracking = null;

      const noDO = this.searchNoDO.trim().toUpperCase();
      const nim = this.searchNIM.trim();

      if (!noDO && !nim) {
        this.errorSearch = '⚠️ Masukkan Nomor DO atau NIM';
        return;
      }

      let ditemukan = null;

      if (noDO) {
        ditemukan = this.trackingData[noDO];
        if (!ditemukan) {
          this.errorSearch = `❌ Nomor DO "${noDO}" tidak ditemukan`;
          return;
        }
      } else if (nim) {
        const results = Object.entries(this.trackingData).filter(([_, data]) => data.nim === nim);
        if (results.length === 0) {
          this.errorSearch = `❌ NIM "${nim}" tidak ditemukan`;
          return;
        }
        ditemukan = results[0][1];
        this.searchNoDO = results[0][0];
      }

      this.hasilTracking = ditemukan;
    },

    /**
     * Reset pencarian (dipanggil saat Esc)
     */
    resetCari() {
      this.searchNoDO = '';
      this.searchNIM = '';
      this.hasilTracking = null;
      this.errorSearch = '';
    },

    /**
     * Nama ekspedisi berdasarkan kode
     */
    namaEkspedisi(kode) {
      const exp = this.pengirimanList.find(e => e.kode === kode);
      return exp ? exp.nama : kode;
    },

    /**
     * Buka modal tambah DO
     */
    bukaTambah() {
      const today = new Date().toISOString().split('T')[0];
      this.formDO = {
        nim: '',
        nama: '',
        ekspedisi: '',
        paketKode: '',
        tanggalKirim: today,
        keterangan: ''
      };
      this.formErrors = {};
      this.paketTerpilih = null;
      this.showModalTambah = true;
    },

    /**
     * Saat paket dipilih
     */
    paketBerubah() {
      this.paketTerpilih = this.paketList.find(p => p.kode === this.formDO.paketKode) || null;
    },

    /**
     * Validasi form DO
     */
    validasiDO() {
      let errors = {};
      
      if (!this.formDO.nim.trim()) errors.nim = 'NIM tidak boleh kosong';
      if (!this.formDO.nama.trim()) errors.nama = 'Nama tidak boleh kosong';
      if (!this.formDO.ekspedisi) errors.ekspedisi = 'Pilih ekspedisi';
      if (!this.formDO.paketKode) errors.paketKode = 'Pilih paket';
      if (!this.formDO.tanggalKirim) errors.tanggalKirim = 'Pilih tanggal kirim';

      this.formErrors = errors;
      return Object.keys(errors).length === 0;
    },

    /**
     * Simpan DO baru
     */
    simpanDO() {
      if (!this.validasiDO()) return;

      const noDO = this.nomorDOBerikutnya;
      const paket = this.paketList.find(p => p.kode === this.formDO.paketKode);
      
      const now = new Date();
      const waktuFormat = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

      const newDO = {
        nim: this.formDO.nim.trim(),
        nama: this.formDO.nama.trim(),
        status: 'Menunggu Pickup',
        ekspedisi: this.formDO.ekspedisi,
        tanggalKirim: this.tanggalFormat,
        paket: this.formDO.paketKode,
        total: paket ? paket.harga : 0,
        perjalanan: [{
          waktu: waktuFormat,
          keterangan: 'DO dibuat. Menunggu pickup oleh kurir.'
        }]
      };

      Vue.set(this.trackingData, noDO, newDO);
      this.showModalTambah = false;
      
      // Auto search hasil
      setTimeout(() => {
        this.searchNoDO = noDO;
        this.cariDO();
      }, 300);
    },

    /**
     * Tambah status perjalanan baru
     */
    tambahPerjalanan() {
      if (!this.hasilTracking) return;
      if (!this.formDO.keterangan.trim()) {
        alert('Masukkan keterangan perjalanan');
        return;
      }

      const now = new Date();
      const waktuFormat = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

      this.hasilTracking.perjalanan.push({
        waktu: waktuFormat,
        keterangan: this.formDO.keterangan.trim()
      });

      this.formDO.keterangan = '';
    },

    /**
     * Handle keyboard: Enter pada search, Esc untuk reset
     */
    handleKeyDown(event) {
      if (event.key === 'Enter') {
        this.cariDO();
      } else if (event.key === 'Escape') {
        this.resetCari();
      }
    }
  },

  mounted() {
    // Load data
    this.trackingData = JSON.parse(JSON.stringify(window.appData?.tracking || {}));
    this.pengirimanList = window.appData?.pengirimanList || [];
    this.paketList = window.appData?.paket || [];
  },

  watch: {
    /**
     * Watcher: Monitor input nomor DO
     */
    searchNoDO(newVal) {
      if (!newVal) {
        this.hasilTracking = null;
        this.errorSearch = '';
      }
      this.watchLog.unshift(`⌨️ Input DO: "${newVal}"`);
      if (this.watchLog.length > 5) this.watchLog.pop();
    },

    /**
     * Watcher: Monitor data tracking berubah
     */
    trackingData: {
      deep: true,
      handler(newVal) {
        const total = Object.keys(newVal).length;
        const selesai = Object.values(newVal).filter(d => d.status === 'Selesai').length;
        this.watchLog.unshift(`📋 Tracking diperbarui — Total: ${total}, Selesai: ${selesai}`);
        if (this.watchLog.length > 5) this.watchLog.pop();
      }
    },

    /**
     * Watcher: Monitor pemilihan paket
     */
    'formDO.paketKode'(newVal) {
      if (newVal) {
        this.paketBerubah();
      }
    }
  }
});
