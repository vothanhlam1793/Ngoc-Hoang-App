// Payment Hub management uses Keystone's authenticated User.isAdmin policy.
export function paymentHubAdmin(store) {
  return store.state.user.user?.isAdmin === true;
}

export function paymentHubRequest(vm, method, path, data) {
  if (!paymentHubAdmin(vm.$store)) throw new Error('Cần quyền quản trị');
  const token = vm.$auth.strategy.token.get();
  if (typeof token !== 'string' || !token.trim()) throw new Error('Cần đăng nhập');
  return vm.$axios.request({
    method, url: `/api/payment-hub/${path}`, data,
    headers: { Authorization: /^Bearer /i.test(token) ? token : `Bearer ${token}` }
  });
}

export function accountList(text) {
  const accounts = text.split(/[\n,]/).map(value => value.trim()).filter(Boolean);
  if (accounts.length > 100 || accounts.some(value => value.length > 50 || /^SBX/i.test(value))) {
    throw new Error('Tài khoản không hợp lệ (tối đa 100 mục, 50 ký tự/mục; không dùng sandbox)');
  }
  return [...new Set(accounts)];
}

export function configPayload(config, receiving, virtual) {
  const payload = {};
  for (const key of ['monapay_enabled', 'client_id', 'default_bank', 'auto_settle',
    'auto_sync_interval_mins', 'telegram_notify_enabled', 'telegram_chat_id']) payload[key] = config[key];
  payload.receiving_accounts = accountList(receiving);
  payload.virtual_account_numbers = accountList(virtual);
  if (!Number.isInteger(payload.auto_sync_interval_mins) || payload.auto_sync_interval_mins < 1 || payload.auto_sync_interval_mins > 1440) {
    throw new Error('Chu kỳ đồng bộ phải từ 1 đến 1440 phút');
  }
  if (config.monapay_enabled && !payload.receiving_accounts.length) throw new Error('Cần cấu hình tài khoản nhận');
  for (const key of ['api_token', 'client_secret', 'webhook_secret']) {
    const value = config[key];
    // Omission preserves redacted secrets. Never send configured flags or null.
    if (!value) continue;
    if (typeof value !== 'string' || value !== value.trim() || value.length > 8192 || /^\*+$/.test(value) || value === 'monapay_secret_demo') {
      throw new Error(`${key} không hợp lệ`);
    }
    payload[key] = value;
  }
  if (config.monapay_enabled && !config.webhook_secret_configured && !payload.webhook_secret) throw new Error('Cần Webhook Secret');
  return payload;
}

export function manualCashPayload(form) {
  const amount = Number(form.amount);
  if (!Number.isInteger(amount) || amount <= 0 || amount > 2147483647) throw new Error('Số tiền phải là số nguyên VND dương, tối đa 2.147.483.647');
  if (!['CASH', 'ACB_BANK', 'MONA_PAY', 'OTHER'].includes(form.paymentMethod)) throw new Error('Phương thức không hợp lệ');
  const data = { amount, paymentMethod: form.paymentMethod,
    bankDescription: form.bankDescription || (form.paymentMethod === 'CASH' ? 'Thu tiền mặt tại trường' : 'Chuyển khoản') };
  if (data.bankDescription.length > 4096) throw new Error('Nội dung quá dài');
  if (['ACB_BANK', 'MONA_PAY'].includes(form.paymentMethod)) {
    const bankRef = (form.bankRef || '').trim();
    const receivingAccount = (form.receivingAccount || '').trim();
    if (!bankRef || bankRef.length > 100 || /^(SANDBOX|TEST[_-])/i.test(bankRef)) throw new Error('Cần mã giao dịch ngân hàng thật (tối đa 100 ký tự)');
    if (!receivingAccount || receivingAccount.length > 50 || /^SBX/i.test(receivingAccount)) throw new Error('Cần tài khoản nhận đã cấu hình');
    Object.assign(data, { bankRef, receivingAccount });
  }
  return data;
}
