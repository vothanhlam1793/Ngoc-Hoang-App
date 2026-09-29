const EMPTY_SUMMARY = { total: 0, active: 0, attached: 0, cancelled: 0 };

export function feeQuery(filters = {}, page = 1, pageSize = 50) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  for (const key of ['type', 'status', 'source', 'billingMonth', 'search']) {
    const value = typeof filters[key] === 'string' ? filters[key].trim() : filters[key];
    if (value) params.set(key, value);
  }
  return params.toString();
}

export function feeIsAttached(fee = {}) {
  if (typeof fee.attached === 'boolean') return fee.attached;
  if (typeof fee.isAttached === 'boolean') return fee.isAttached;
  if (Number(fee.usageCount || fee.usedCount || 0) > 0) return true;
  return Boolean((Array.isArray(fee.attachments) && fee.attachments.length) || fee.document || fee.invoice || fee.settlement || fee.receipt || fee.usage);
}

export function feeCanCancel(fee = {}) {
  return fee.status === 'ACTIVE' && !feeIsAttached(fee);
}

export function feeUsage(fee = {}) {
  const attachment = Array.isArray(fee.attachments) ? fee.attachments[0] : null;
  const document = fee.document || fee.invoice || fee.settlement || fee.receipt || null;
  const usage = fee.usage || null;
  const code = attachment?.documentId || document?.code || document?.number || document?.id || fee.documentCode || fee.invoiceCode || '';
  const label = attachment ? ({ INVOICE: 'Hóa đơn', MONTHLY_SETTLEMENT: 'Kết sổ tháng', ABSENCE_SETTLEMENT: 'Kết sổ nghỉ học' }[attachment.documentType] || attachment.documentType) :
    (usage?.label || usage?.name || usage?.type || fee.usageLabel || '');
  return {
    attached: feeIsAttached(fee),
    code,
    label,
    text: [label, code].filter(Boolean).join(' · ') || (feeIsAttached(fee) ? 'Đã sử dụng' : 'Chưa sử dụng')
  };
}

export function normalizeFeeResponse(payload) {
  const body = payload?.data !== undefined ? payload.data : payload;
  const container = Array.isArray(body) ? { items: body } : (body || {});
  const items = container.items || container.rows || container.fees || container.results || [];
  const total = Number(container.total ?? container.totalCount ?? items.length) || 0;
  const supplied = container.summary || container.counts;
  const summary = supplied ? {
    total: Number(supplied.total ?? total) || 0,
    active: Number(supplied.active ?? supplied.ACTIVE) || 0,
    attached: Number(supplied.attached ?? supplied.used) || 0,
    cancelled: Number(supplied.cancelled ?? supplied.CANCELLED) || 0
  } : items.reduce((result, item) => {
    if (item.status === 'ACTIVE') result.active += 1;
    if (item.status === 'CANCELLED') result.cancelled += 1;
    if (feeIsAttached(item)) result.attached += 1;
    return result;
  }, { ...EMPTY_SUMMARY, total });
  return { items, total, summary };
}

export function feeCancelPayload(reason) {
  const value = typeof reason === 'string' ? reason.trim() : '';
  if (value.length < 3 || value.length > 500) throw new Error('Lý do hủy phải từ 3 đến 500 ký tự');
  return { reason: value };
}
