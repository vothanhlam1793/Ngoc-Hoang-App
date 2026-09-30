import { articles } from './schoolHandbook';

// Render tokens with Vue text interpolation; never render model-supplied HTML.
export function messageParts(text, allowed) {
  const links = new Map(allowed.map(link => [link.to, link]));
  const titles = new Map(allowed.map(link => [link.label, link]));
  const parts = [];
  const pattern = /\[([^\]\n]+)\]\(([^)\s]+)\)|\*\*([^*\n]+)\*\*/g;
  let offset = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > offset) parts.push({ text: text.slice(offset, match.index) });
    const label = match[1] || match[3];
    const link = match[1] ? links.get(match[2]) : titles.get(label);
    parts.push({ text: label, to: link?.to, bold: !!match[3] });
    offset = match.index + match[0].length;
  }
  if (offset < text.length) parts.push({ text: text.slice(offset) });
  return parts;
}

export function guideLinks(store) {
  const roles = store.getters['user/effectiveRoles'] || [];
  const state = store.state.user;
  const school = !state.isImpersonating && roles.some(role => ['quan-tri-vien', 'ke-toan', 'hieu-truong', 'hieu-pho'].includes(role));
  const access = { school, students: school || state.isImpersonating || roles.includes('giao-vien'),
    fees: school && (state.isAdmin === true || roles.some(role => ['super-admin', 'quan-tri-vien'].includes(role))) };
  const links = articles.flatMap(article => [
    { label: article.title, to: '/huongdan?bai=' + article.id },
    ...article.links.filter(link => access[link.access] && !['/ketso', '/lichhoc'].includes(link.to))
      .map(link => ({ to: link.to, label: link.label.replace(/^Mở /, '') }))
  ]);
  return links;
}

export function shouldSendOnEnter(event) {
  return event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.keyCode !== 229 && !event.target?.composing;
}
