/**
 * components/status-badge.js
 * Vue Component untuk menampilkan badge status stok
 */

Vue.component('status-badge', {
  template: '#tpl-status-badge',
  props: {
    qty: {
      type: Number,
      required: true
    },
    safety: {
      type: Number,
      required: true
    },
    catatan: {
      type: String,
      default: ''
    }
  },
  computed: {
    /**
     * Computed: Determine status berdasarkan qty dan safety
     */
    statusInfo() {
      if (this.qty === 0) {
        return {
          label: 'Kosong',
          icon: '🔴',
          class: 'badge-danger',
          color: '#E74C3C'
        };
      }
      if (this.qty < this.safety) {
        return {
          label: 'Menipis',
          icon: '🟡',
          class: 'badge-warning',
          color: '#F39C12'
        };
      }
      return {
        label: 'Aman',
        icon: '🟢',
        class: 'badge-success',
        color: '#27AE60'
      };
    }
  },
  data() {
    return {
      showTooltip: false
    };
  },
  methods: {
    toggleTooltip() {
      this.showTooltip = !this.showTooltip;
    },
    closeTooltip() {
      this.showTooltip = false;
    }
  }
});
