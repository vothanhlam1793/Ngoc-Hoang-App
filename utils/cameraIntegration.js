export function cameraAdmin(store) {
  return store.state.user.user?.isAdmin === true;
}

export async function cameraRequest(vm, method, path, data) {
  if (!cameraAdmin(vm.$store)) throw new Error('Cần quyền quản trị');
  const token = vm.$auth.strategy.token.get();
  if (typeof token !== 'string' || !token.trim()) throw new Error('Cần đăng nhập');
  try {
    const response = await vm.$axios.request({ method, url: `/api/camera-integration/${path}`, data,
      headers: { Authorization: /^Bearer /i.test(token) ? token : `Bearer ${token}` } });
    if (!response.data || response.data.success !== true) throw new Error('Phản hồi camera không hợp lệ');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || 'Không thể kết nối camera');
  }
}
