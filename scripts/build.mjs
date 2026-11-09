import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = (value, {asset = false} = {}) => {
  if (!value) return '';
  if (asset) {
    if (typeof value !== 'string' || !value.startsWith('static/assets/') || value.startsWith('/') || value.includes('..') || value.includes('\\') || value.includes('%') || /^[a-z][a-z0-9+.-]*:/i.test(value)) throw new Error(`Unsafe asset path: ${value}`);
    const resolved = path.resolve(root, value);
    if (!resolved.startsWith(path.join(root, 'static', 'assets') + path.sep) || !fs.existsSync(resolved)) throw new Error(`Missing asset: ${value}`);
    return escapeHtml(value);
  }
  if (!/^(https?:\/\/|mailto:)/i.test(value)) throw new Error(`Unsafe URL: ${value}`);
  return escapeHtml(value);
};
const lines = value => escapeHtml(value).replace(/\r?\n/g, '<br>');
const safeEmail = value => {
  if (!value) return '';
  if (typeof value !== 'string' || /[\s\x00-\x1f\x7f:?&#%=]/.test(value) || !/^[^@<>]+@[^@<>]+\.[^@<>]+$/.test(value)) throw new Error(`Unsafe email: ${value}`);
  return escapeHtml(value);
};
const renderResearch = items => items.map((item, i) => `<div><span class="index">${String(i + 1).padStart(2, '0')}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div>`).join('');
const renderPublications = items => items.map(item => `<li><span class="pub-year">${escapeHtml(item.year)}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.authors).replace(/\bWang Y\b/g, '<strong>Wang Y</strong>')}${item.authors ? ' ' : ''}<em>${escapeHtml(item.venue)}</em> ${escapeHtml(item.details)}${item.corresponding ? ' Corresponding author.' : ''}</p>${item.url ? `<a href="${safeUrl(item.url)}" target="_blank" rel="noreferrer">Read paper ↗</a>` : ''}</div></li>`).join('');
const renderExperience = items => items.map(item => `<article><p class="meta">${escapeHtml(item.period)}</p><h3>${escapeHtml(item.institution)}</h3><p>${lines(item.description)}</p></article>`).join('');
const renderAwards = items => items.map(item => `<p><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.details)}</span></p>`).join('');
export function renderHomepage(data, template) {
  const p = data.profile, h = data.hero;
  const replacements = {
    'profile.name': escapeHtml(p.name), 'profile.chinese_name': escapeHtml(p.chinese_name), 'profile.label': escapeHtml(p.label), 'profile.role': escapeHtml(p.role), 'profile.department': escapeHtml(p.department), 'profile.school': escapeHtml(p.school), 'profile.university': escapeHtml(p.university), 'profile.location': escapeHtml(p.location), 'profile.photo': safeUrl(p.photo, {asset: true}), 'profile.email': safeEmail(p.email), 'profile.secondary_email': safeEmail(p.secondary_email), 'profile.secondary_email_link': p.secondary_email ? `<a href="mailto:${safeEmail(p.secondary_email)}">${safeEmail(p.secondary_email)}</a>` : '', 'profile.github': safeUrl(p.github), 'hero.eyebrow': escapeHtml(h.eyebrow), 'hero.title': lines(h.title), 'hero.description': escapeHtml(h.description), 'hero.primary_label': escapeHtml(h.primary_label), 'hero.contact_label': escapeHtml(h.contact_label), research: renderResearch(data.research), publications: renderPublications(data.publications), experience: renderExperience(data.experience), awards: renderAwards(data.awards)
  };
  return template.replace(/{{([^}]+)}}/g, (_, key) => replacements[key.trim()] ?? '');
}
export function build() {
  const data = JSON.parse(fs.readFileSync(path.join(root, 'content/homepage.json'), 'utf8'));
  const template = fs.readFileSync(path.join(root, 'templates/homepage.html'), 'utf8');
  const html = renderHomepage(data, template).trimEnd();
  fs.writeFileSync(path.join(root, 'index.html'), html + '\n');
  const out = path.join(root, '_site');
  fs.rmSync(out, {recursive: true, force: true}); fs.mkdirSync(out, {recursive: true}); fs.writeFileSync(path.join(out, 'index.html'), html + '\n');
  fs.cpSync(path.join(root, 'static'), path.join(out, 'static'), {recursive: true});
  if (fs.existsSync(path.join(root, 'admin'))) fs.cpSync(path.join(root, 'admin'), path.join(out, 'admin'), {recursive: true});
  return html;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
