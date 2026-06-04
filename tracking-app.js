//  tracking-app.js

var trackingApp = new Vue({
  el: '#tracking-app',
  data: {
    pengirimanList: [
      { kode:"JNE-REG", nama:"JNE Regular (3-5 hari)" },
      { kode:"JNE-EXP", nama:"JNE Ekspres (1-2 hari)" }
    ],
    paket: [
      { kode:"PAKET-UT-001", nama:"PAKET IPS Dasar",  isi:["EKMA4116","EKMA4115"], harga:120000 },
      { kode:"PAKET-UT-002", nama:"PAKET IPA Dasar",  isi:["BIOL4201","FISIP4001"], harga:140000 },
      { kode:"PAKET-UT-003", nama:"PAKET Manajemen",  isi:["EKMA4116","EKMA4370"],  harga:130000 }
    ],
    // Data tracking dimuat dari localStorage via SITTA helper
    tracking: SITTA.getTracking(),
    inputNoDO: '',
    hasilTracking: null,
    errorCari: '',
    showModalTambah: false,
    dropdownEkspedisiOpen: false,
    dropdownPaketOpen: false,
    formDO: { nim:'', nama:'', ekspedisi:'', paketKode:'', tanggalKirim:'' },
    errorsDO: {},
    suksesDO: false,
    paketTerpilih: null,
    watchLog: []
  },

  computed: {
    nomorDOBerikutnya() {
      var tahun = new Date().getFullYear();
      var seq = Object.keys(this.tracking).reduce((max, k) => {
        var parts = k.split('-');
        if (parts[0] === 'DO'+tahun) { var n = parseInt(parts[1])||0; return n > max ? n : max; }
        return max;
      }, 0);
      return 'DO'+tahun+'-'+String(seq+1).padStart(3,'0');
    },
    hintNomor() { return Object.keys(this.tracking).join('  |  '); },
    // 5 step: Menunggu Pickup(1) > Diterima Kurir(2) > Di Hub(3) > Proses Antar(4) > Selesai(5)
    // Dot center: dot-1=10%, dot-2=30%, dot-3=50%, dot-4=70%, dot-5=90% dari container
    // progress-fill dimulai dari left:10%, jadi width = jarak dari dot-1 ke dot aktif
    // width: dot-1->0%, dot-2->20%, dot-3->40%, dot-4->60%, dot-5->80%
    progressPersen() {
      if (!this.hasilTracking) return 0;
      var map = {
        'Menunggu Pickup': 0,
        'Diterima Kurir':  20,
        'Di Hub':          40,
        'Proses Antar':    60,
        'Selesai':         80
      };
      return map[this.hasilTracking.status] !== undefined ? map[this.hasilTracking.status] : 0;
    },
    aktifDots() {
      if (!this.hasilTracking) return 0;
      var map = {
        'Menunggu Pickup': 1,
        'Diterima Kurir':  2,
        'Di Hub':          3,
        'Proses Antar':    4,
        'Selesai':         5
      };
      return map[this.hasilTracking.status] || 1;
    },
    perjalananTerbalik() {
      if (!this.hasilTracking) return [];
      return this.hasilTracking.perjalanan.slice().reverse();
    },
    badgeStatus() {
      if (!this.hasilTracking) return '';
      var map = {
        'Selesai':         'badge-success',
        'Proses Antar':    'badge-warning',
        'Di Hub':          'badge-warning',
        'Diterima Kurir':  'badge-info',
        'Menunggu Pickup': 'badge-gray'
      };
      return map[this.hasilTracking.status] || 'badge-gray';
    },
    namaEkspedisiHasil() {
      if (!this.hasilTracking) return '-';
      var exp = this.pengirimanList.find(p => p.kode === this.hasilTracking.ekspedisi);
      return exp ? exp.nama : this.hasilTracking.ekspedisi;
    }
  },

  methods: {
    formatRupiah(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); },
    namaEkspedisi(kode) {
      var exp = this.pengirimanList.find(p => p.kode === kode);
      return exp ? exp.nama : kode;
    },
    cariDO() {
      var noDO = this.inputNoDO.trim();
      this.errorCari = ''; this.hasilTracking = null;
      if (!noDO) { this.errorCari = '⚠️ Masukkan nomor DO terlebih dahulu.'; return; }
      var data = this.tracking[noDO];
      if (!data) { this.errorCari = '❌ Nomor DO "'+noDO+'" tidak ditemukan.'; return; }
      this.hasilTracking = data;
    },
    resetCari() { this.inputNoDO = ''; this.hasilTracking = null; this.errorCari = ''; },
    bukaModalTambah() {
      var today = new Date().toISOString().split('T')[0];
      this.formDO = { nim:'', nama:'', ekspedisi:'', paketKode:'', tanggalKirim:today };
      this.errorsDO = {}; this.suksesDO = false; this.paketTerpilih = null;
      this.dropdownEkspedisiOpen = false; this.dropdownPaketOpen = false;
      this.showModalTambah = true;
    },
    pilihanPaketBerubah() {
      this.paketTerpilih = this.paket.find(p => p.kode === this.formDO.paketKode) || null;
    },
    validasiDO() {
      var e = {};
      if (!this.formDO.nim.trim())       e.nim       = 'NIM tidak boleh kosong';
      if (!this.formDO.nama.trim())      e.nama      = 'Nama tidak boleh kosong';
      if (!this.formDO.ekspedisi)        e.ekspedisi = 'Pilih ekspedisi';
      if (!this.formDO.paketKode)        e.paketKode = 'Pilih paket bahan ajar';
      if (!this.formDO.tanggalKirim)     e.tanggalKirim = 'Pilih tanggal kirim';
      this.errorsDO = e;
      return Object.keys(e).length === 0;
    },
    toggleDropdown(nama) {
      if (nama === 'ekspedisi') {
        this.dropdownEkspedisiOpen = !this.dropdownEkspedisiOpen;
        this.dropdownPaketOpen = false;
      } else {
        this.dropdownPaketOpen = !this.dropdownPaketOpen;
        this.dropdownEkspedisiOpen = false;
      }
    },
    pilihEkspedisi(kode) {
      this.formDO.ekspedisi = kode;
      this.dropdownEkspedisiOpen = false;
      if (this.errorsDO.ekspedisi) Vue.delete(this.errorsDO, 'ekspedisi');
    },
    pilihPaket(kode) {
      this.formDO.paketKode = kode;
      this.dropdownPaketOpen = false;
      this.pilihanPaketBerubah();
      if (this.errorsDO.paketKode) Vue.delete(this.errorsDO, 'paketKode');
    },
    tutupSemuaDropdown(e) {
      if (!e.target.closest('.custom-select')) {
        this.dropdownEkspedisiOpen = false;
        this.dropdownPaketOpen = false;
      }
    },
    simpanDO() {
      if (!this.validasiDO()) return;
      var noDO  = this.nomorDOBerikutnya;
      var paket = this.paket.find(p => p.kode === this.formDO.paketKode);
      var now   = new Date();
      var waktu = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')+':00';
      Vue.set(this.tracking, noDO, {
        nomorDO: noDO, nim: this.formDO.nim.trim(), nama: this.formDO.nama.trim(),
        status: 'Menunggu Pickup', ekspedisi: this.formDO.ekspedisi,
        tanggalKirim: this.formDO.tanggalKirim, paket: this.formDO.paketKode,
        total: paket ? paket.harga : 0,
        perjalanan:[{ waktu: waktu, keterangan:'DO dibuat. Menunggu pickup oleh kurir.' }]
      });
      this.suksesDO = true;
      setTimeout(() => {
        this.showModalTambah = false;
        this.inputNoDO = noDO;
        this.cariDO();
      }, 1600);
    }
  },

  mounted() {
    document.addEventListener('click', this.tutupSemuaDropdown);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.tutupSemuaDropdown);
  },

  watch: {
    // Watcher 1: pantau input nomor DO
    inputNoDO(val) {
      if (!val) { this.hasilTracking = null; this.errorCari = ''; }
      this.watchLog.unshift('⌨️ Input DO: "'+val+'"');
      if (this.watchLog.length > 5) this.watchLog.pop();
    },
    // Watcher 2: pantau data tracking saat DO baru ditambah + simpan ke localStorage
    tracking: {
      deep: true,
      handler(val) {
        SITTA.saveTracking(val);
        var jumlah = Object.keys(val).length;
        this.watchLog.unshift('📋 Data tracking diperbarui — Total DO: '+jumlah);
        if (this.watchLog.length > 5) this.watchLog.pop();
      }
    },
    // Watcher 3: pantau pemilihan paket
    'formDO.paketKode'(val) {
      this.pilihanPaketBerubah();
      if (val) { this.watchLog.unshift('🛒 Paket dipilih: '+val); if(this.watchLog.length>5) this.watchLog.pop(); }
    }
  }
});
