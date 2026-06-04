/**
 * services/api.js
 * Data Service Layer untuk fetch data dari JSON
 */

const ApiService = {
  /**
   * Fetch data dari file JSON
   * @returns {Promise<Object>} Data aplikasi
   */
  fetchData() {
    return fetch('./data/dataBahanAjar.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
      })
      .catch(error => {
        console.error('API Error:', error);
        return null;
      });
  },

  /**
   * Simulasi delay untuk memberikan UX yang lebih baik
   * @param {number} ms - Miliseconds
   * @returns {Promise}
   */
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
