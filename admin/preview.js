(() => {
  const h = window.h;
  window.CMS.registerPreviewStyle(new URL('../static/css/main.css', location.href).href);
  window.CMS.registerPreviewStyle('body{padding:24px}.page-shell{display:block;padding:0}.profile{position:static;margin-bottom:3rem}.hero{padding:1rem 0 3rem}.timeline{grid-template-columns:1fr}.section-heading{display:block}.lede{white-space:pre-line}.hero h2{white-space:pre-line}.preview-note{font:14px system-ui;color:#66727a;border-bottom:1px solid #d9ddd7;padding-bottom:1rem}', { raw: true });
  const text = value => String(value ?? '');
  const iconPaths = {
    email: '<path d="M2 4h20v16H2z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 5 9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/>',
    github: '<path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.1-1.46-1.1-1.46-.9-.61.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.9 1.52 2.36 1.08 2.94.82.09-.64.35-1.08.64-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 7.9c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.4.11 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2"/>',
    linkedin: '<path fill="currentColor" d="M4.2 3.2A2.2 2.2 0 1 1 4.2 7.6a2.2 2.2 0 0 1 0-4.4ZM2.3 9h3.8v12H2.3zM8.5 9h3.6v1.64h.05c.5-.94 1.72-1.93 3.54-1.93 3.79 0 4.49 2.5 4.49 5.75V21h-3.8v-5.8c0-1.38-.03-3.15-1.92-3.15-1.92 0-2.22 1.5-2.22 3.05V21H8.5z"/>',
    orcid: '<circle cx="12" cy="12" r="10" fill="currentColor"/><text x="12" y="16" text-anchor="middle" font-size="10" font-family="Arial" fill="white">iD</text>',
    scholar: '<path fill="currentColor" d="m2 9 10-5 10 5-10 5z"/><path fill="none" stroke="currentColor" stroke-width="2" d="M6 11v5c3 2 9 2 12 0v-5M20 10v7"/><circle cx="20" cy="19" r="1.5" fill="currentColor"/>'
  };
  const icon = name => h('svg',{className:'social-icon','aria-hidden':true,focusable:'false',viewBox:'0 0 24 24',dangerouslySetInnerHTML:{__html:iconPaths[name] || ''}});
  const social = (label, url, name) => url ? h('p',{className:'social-link'},icon(name),h('span',{},label)) : null;
  const section = (title, children) => h('section', {className:'section'}, h('div',{className:'section-heading'},h('h2',{},title)),children);
  window.CMS.registerPreviewTemplate('homepage', function HomepagePreview(props) {
    const data = props.entry.get('data').toJS();
    const p = data.profile || {}, hero = data.hero || {};
    const photo = p.photo ? props.getAsset(p.photo) : null;
    return h('main', {className:'page-shell'},
      h('p',{className:'preview-note'},'内容预览 · 保存发布后，线上主页会保留完整的双栏与手机布局。'),
      h('aside',{className:'profile'},
        photo ? h('div',{className:'portrait-wrap'},h('img',{className:'portrait',src:photo.toString(),alt:text(p.name)})) : null,
        h('p',{className:'eyebrow'},text(p.label)),
        h('h1',{},text(p.name),h('br'),h('span',{},text(p.chinese_name))),
        h('p',{className:'role'},text(p.role),h('br'),text(p.department)),
        h('p',{className:'affiliation'},text(p.school),h('br'),text(p.university),h('br'),text(p.location)),
        social(text(p.email),p.email,'email'), social(text(p.secondary_email),p.secondary_email,'email'), social('Google Scholar',p.scholar,'scholar'), social('ORCID',p.orcid,'orcid'), social('GitHub',p.github,'github'), social('LinkedIn',p.linkedin,'linkedin')),
      h('div',{className:'content'},
        h('section',{className:'hero'},h('p',{className:'eyebrow'},text(hero.eyebrow)),h('h2',{},text(hero.title)),h('p',{className:'lede'},text(hero.description)),h('span',{className:'button'},text(hero.primary_label)),h('p',{},text(hero.contact_label))),
        section('Research interests',h('div',{className:'interest-grid'},(data.research||[]).map((r,i)=>h('div',{key:i},h('h3',{},text(r.title)),h('p',{},text(r.description)))))),
        section('Publications',h('ol',{className:'publication-list'},(data.publications||[]).map((r,i)=>h('li',{key:i},h('span',{className:'pub-year'},text(r.year)),h('div',{},h('h3',{},text(r.title)),h('p',{},text(r.authors),' ',h('em',{},text(r.venue)),' ',text(r.details),r.corresponding?' Corresponding author.':''),h('p',{},text(r.url))))))),
        section('Education & experience',h('div',{className:'timeline'},(data.experience||[]).map((r,i)=>h('article',{key:i},h('p',{className:'meta'},text(r.period)),h('h3',{},text(r.institution)),h('p',{style:{whiteSpace:'pre-line'}},text(r.description)))))),
        section('Interests',h('div',{className:'interest-items'},(data.interests||[]).map((r,i)=>h('article',{key:i},h('h3',{},text(r.title)),r.description?h('p',{},text(r.description)):null))))));
  });
})();
