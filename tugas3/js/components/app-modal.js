/**
 * components/app-modal.js
 * Vue Component untuk modal reusable
 */

Vue.component('app-modal', {
  template: '#tpl-app-modal',
  props: {
    title: {
      type: String,
      default: 'Modal'
    },
    active: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md', // sm, md, lg
      validator: value => ['sm', 'md', 'lg'].includes(value)
    }
  },
  computed: {
    modalClass() {
      return `modal-${this.size}`;
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
});
