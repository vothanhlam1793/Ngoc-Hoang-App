/**
 * Storage Utility Helper cho Nuxt.js
 * Hỗ trợ lưu/đọc LocalStorage an toàn (chống crash khi chạy Server-Side Rendering)
 */

export const storage = {
  /**
   * Lấy giá trị từ localStorage
   * @param {string} key 
   * @param {any} defaultValue 
   * @returns {any}
   */
  get(key, defaultValue = null) {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (e) {
      // Nếu không parse được JSON, trả về dạng chuỗi gốc hoặc defaultValue
      const raw = window.localStorage.getItem(key);
      return raw !== null ? raw : defaultValue;
    }
  },

  /**
   * Lưu giá trị vào localStorage
   * @param {string} key 
   * @param {any} value 
   */
  set(key, value) {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    } catch (e) {
      console.warn(`[Storage] Lỗi khi lưu key "${key}":`, e);
    }
  },

  /**
   * Xóa một key khỏi localStorage
   * @param {string} key 
   */
  remove(key) {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[Storage] Lỗi khi xóa key "${key}":`, e);
    }
  },

  /**
   * Lấy giá trị boolean với fallback
   * @param {string} key 
   * @param {boolean} defaultValue 
   * @returns {boolean}
   */
  getBool(key, defaultValue = false) {
    const val = this.get(key, defaultValue);
    return val === true || val === 'true' || val === '1' || val === 1;
  }
};

export default storage;
