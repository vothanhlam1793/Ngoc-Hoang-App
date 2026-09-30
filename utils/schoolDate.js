// Civil school dates: never guess US month/day order or apply timezone shifts.
export function schoolDate(value) {
  if (value instanceof Date) value = value.toISOString();
  const text = String(value == null ? '' : value).trim();
  let y, m, d, match;
  if ((match = /^(\d{4})-(\d{2})-(\d{2})(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.exec(text))) {
    [, y, m, d] = match;
  } else if ((match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text))) {
    [, d, m, y] = match;
  } else return null;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (date.getUTCFullYear() !== Number(y) || date.getUTCMonth() + 1 !== Number(m) || date.getUTCDate() !== Number(d)) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
export function resolveSchoolDate(rows) {
  if (!rows.length) throw new Error('Thiếu ngày bắt đầu học (DATE-ACCESS / DATE_ACCESS)');
  const dates = rows.map(row => schoolDate(row.value));
  if (dates.some(date => !date)) throw new Error('Ngày bắt đầu học sai định dạng hoặc không tồn tại: ' + rows.filter(row => !schoolDate(row.value)).map(row => String(row.value || '(trống)')).join(', '));
  if (new Set(dates).size !== 1) throw new Error('Các bản ghi ngày bắt đầu học mâu thuẫn');
  return dates[0];
}
export function displaySchoolDate(value) {
  const date = schoolDate(value);
  return date ? date.split('-').reverse().join('/') : String(value || '');
}
