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
const iconSvg = name => {
  const paths = {
    email: '<path d="M2 4h20v16H2z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 5 9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/>',
    github: '<path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.1-1.46-1.1-1.46-.9-.61.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.9 1.52 2.36 1.08 2.94.82.09-.64.35-1.08.64-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 7.9c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.4.11 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2"/>',
    linkedin: '<path fill="currentColor" d="M4.2 3.2A2.2 2.2 0 1 1 4.2 7.6a2.2 2.2 0 0 1 0-4.4ZM2.3 9h3.8v12H2.3zM8.5 9h3.6v1.64h.05c.5-.94 1.72-1.93 3.54-1.93 3.79 0 4.49 2.5 4.49 5.75V21h-3.8v-5.8c0-1.38-.03-3.15-1.92-3.15-1.92 0-2.22 1.5-2.22 3.05V21H8.5z"/>',
    orcid: '<circle cx="12" cy="12" r="10" fill="currentColor"/><text x="12" y="16" text-anchor="middle" font-size="10" font-family="Arial" fill="white">iD</text>',
    scholar: '<path fill="currentColor" d="m2 9 10-5 10 5-10 5z"/><path fill="none" stroke="currentColor" stroke-width="2" d="M6 11v5c3 2 9 2 12 0v-5M20 10v7"/><circle cx="20" cy="19" r="1.5" fill="currentColor"/>'
  };
  return `<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || ''}</svg>`;
};
const socialLink = (label, url, icon) => url ? `<a class="social-link" href="${safeUrl(url)}" target="_blank" rel="noreferrer">${iconSvg(icon)}<span>${escapeHtml(label)}</span></a>` : '';
const safeEmail = value => {
  if (!value) return '';
  if (typeof value !== 'string' || /[\s\x00-\x1f\x7f:?&#%=]/.test(value) || !/^[^@<>]+@[^@<>]+\.[^@<>]+$/.test(value)) throw new Error(`Unsafe email: ${value}`);
  return escapeHtml(value);
};
const renderResearch = items => items.map((item, i) => `<div><span class="index">${String(i + 1).padStart(2, '0')}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div>`).join('');
const renderPublications = items => items.map(item => `<li><span class="pub-year">${escapeHtml(item.year)}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.authors).replace(/\bWang Y\b/g, '<strong>Wang Y</strong>')}${item.authors ? ' ' : ''}<em>${escapeHtml(item.venue)}</em> ${escapeHtml(item.details)}${item.corresponding ? ' Corresponding author.' : ''}</p>${item.url ? `<a href="${safeUrl(item.url)}" target="_blank" rel="noreferrer">Read paper ↗</a>` : ''}</div></li>`).join('');
const renderExperience = items => items.map(item => `<article><p class="meta">${escapeHtml(item.period)}</p><h3>${escapeHtml(item.institution)}</h3><p>${lines(item.description)}</p></article>`).join('');
const renderInterests = items => items.map(item => `<article class="interest-item"><h3>${escapeHtml(item.title)}</h3>${item.description ? `<p>${lines(item.description)}</p>` : ''}</article>`).join('');
export function renderHomepage(data, template) {
  const p = data.profile, h = data.hero;
  const replacements = {
    'profile.email_link': p.email ? `<a class="social-link" href="mailto:${safeEmail(p.email)}">${iconSvg('email')}<span>${safeEmail(p.email)}</span></a>` : '',
    'profile.secondary_email_link': p.secondary_email ? `<a class="social-link" href="mailto:${safeEmail(p.secondary_email)}">${iconSvg('email')}<span>${safeEmail(p.secondary_email)}</span></a>` : '',
    'profile.github_link': socialLink('GitHub', p.github, 'github'),
    'profile.linkedin_link': socialLink('LinkedIn', p.linkedin, 'linkedin'),
    'profile.orcid_link': socialLink('ORCID', p.orcid, 'orcid'),
    'profile.scholar_link': socialLink('Google Scholar', p.scholar, 'scholar'),
    'profile.name': escapeHtml(p.name), 'profile.chinese_name': escapeHtml(p.chinese_name), 'profile.label': escapeHtml(p.label), 'profile.role': escapeHtml(p.role), 'profile.department': escapeHtml(p.department), 'profile.school': escapeHtml(p.school), 'profile.university': escapeHtml(p.university), 'profile.location': escapeHtml(p.location), 'profile.photo': safeUrl(p.photo, {asset: true}), 'profile.email': safeEmail(p.email), 'profile.secondary_email': safeEmail(p.secondary_email), 'profile.github': safeUrl(p.github), 'hero.eyebrow': escapeHtml(h.eyebrow), 'hero.title': lines(h.title), 'hero.description': escapeHtml(h.description), 'hero.primary_label': escapeHtml(h.primary_label), 'hero.contact_label': escapeHtml(h.contact_label), research: renderResearch(data.research), publications: renderPublications(data.publications), experience: renderExperience(data.experience), interests: renderInterests(data.interests || [])
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
