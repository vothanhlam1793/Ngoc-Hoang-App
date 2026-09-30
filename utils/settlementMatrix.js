export const feeColumns = ['TUITION', 'FACILITY', 'CAMERA', 'EXTENDED', 'ABSENCE_CREDIT', 'ADJUSTMENT_CREDIT'];

export function settlementMatrix(doc) {
  const students = doc.students || [];
  const rows = students.map(student => ({ ...student, cells: Object.fromEntries(feeColumns.map(type => [type, []])), total: 0, shared: [] }));
  const byId = new Map(rows.map(row => [row.id, row]));
  for (const fee of doc.fees || []) {
    const siblings = rows.filter(row => fee.parentId && row.parentId === fee.parentId).sort((a, b) => a.id.localeCompare(b.id));
    let target = byId.get(fee.studentId || fee.displayStudentId) || siblings[0];
    // Old snapshots may not contain parent/student presentation metadata. Keep
    // such fees visible as explicit shared rows, never silently drop amounts.
    if (!target) {
      const key = `shared:${fee.parentId || fee.id}`;
      target = byId.get(key);
      if (!target) {
        target = { id: key, name: fee.name || 'Khoản chung phụ huynh', isShared: true, cells: Object.fromEntries(feeColumns.map(type => [type, []])), total: 0, shared: [] };
        rows.push(target); byId.set(key, target);
      }
    }
    const type = feeColumns.includes(fee.type) ? fee.type : 'OTHER';
    (target.cells[type] ||= []).push(fee);
    if (!fee.usedBy) target.total += fee.amount;
    if (!fee.studentId) for (const sibling of siblings) {
      if (sibling.id !== target.id) sibling.shared.push({ type, name: target.name, fee });
    }
  }
  const columns = rows.some(row => row.cells.OTHER) ? [...feeColumns, 'OTHER'] : feeColumns;
  return { rows: rows.sort((a, b) => a.name.localeCompare(b.name, 'vi')), columns,
    totals: Object.fromEntries(columns.map(type => [type, rows.reduce((sum, row) => sum + (row.cells[type] || []).filter(f => !f.usedBy).reduce((n, f) => n + f.amount, 0), 0)])) };
}
