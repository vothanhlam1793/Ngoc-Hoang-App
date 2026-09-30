export async function supportRequest(vm, method, path, data) {
  const token = vm.$auth.strategy.token.get();
  if (typeof token !== 'string' || !token.trim()) throw new Error('Cần đăng nhập');
  const result = await vm.$axios.$request({ method, url: '/api/support/' + path, data, timeout: 55000,
    headers: { Authorization: /^Bearer /i.test(token) ? token : `Bearer ${token}` } });
  if (!result || typeof result !== 'object' || Array.isArray(result) ||
      (['status', 'config'].includes(path) && typeof result.enabled !== 'boolean') ||
      (path === 'chat' && typeof result.answer !== 'string') ||
      (path === 'test' && result.ok !== true)) {
    throw new Error('Kết nối hỗ trợ trả về dữ liệu không hợp lệ. Vui lòng tải lại trang hoặc báo quản trị.');
  }
  return result;
}
export const chatTTL = 48 * 60 * 60 * 1000;
export function cleanSession(value, now = Date.now()) {
  if (!value || !Number.isFinite(value.createdAt) || value.createdAt > now || now - value.createdAt >= chatTTL || !Array.isArray(value.messages)) return null;
  return { createdAt: value.createdAt, messages: value.messages.filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string').slice(-40).map(m => ({ role: m.role, content: m.content.slice(0, 6000) })) };
}
