(() => {
  const h = window.h;
  window.CMS.registerPreviewStyle(new URL('../static/css/main.css', location.href).href);
  window.CMS.registerPreviewStyle('body{padding:24px}.page-shell{display:block;padding:0}.profile{position:static;margin-bottom:3rem}.hero{padding:1rem 0 3rem}.timeline{grid-template-columns:1fr}.section-heading{display:block}.lede{white-space:pre-line}.hero h2{white-space:pre-line}.preview-note{font:14px system-ui;color:#66727a;border-bottom:1px solid #d9ddd7;padding-bottom:1rem}', { raw: true });
  const text = value => String(value ?? '');
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
        h('p',{},text(p.email),h('br'),text(p.secondary_email))),
      h('div',{className:'content'},
        h('section',{className:'hero'},h('p',{className:'eyebrow'},text(hero.eyebrow)),h('h2',{},text(hero.title)),h('p',{className:'lede'},text(hero.description)),h('span',{className:'button'},text(hero.primary_label)),h('p',{},text(hero.contact_label))),
        section('Research interests',h('div',{className:'interest-grid'},(data.research||[]).map((r,i)=>h('div',{key:i},h('h3',{},text(r.title)),h('p',{},text(r.description)))))),
        section('Publications',h('ol',{className:'publication-list'},(data.publications||[]).map((r,i)=>h('li',{key:i},h('span',{className:'pub-year'},text(r.year)),h('div',{},h('h3',{},text(r.title)),h('p',{},text(r.authors),' ',h('em',{},text(r.venue)),' ',text(r.details),r.corresponding?' Corresponding author.':''),h('p',{},text(r.url))))))),
        section('Education & experience',h('div',{className:'timeline'},(data.experience||[]).map((r,i)=>h('article',{key:i},h('p',{className:'meta'},text(r.period)),h('h3',{},text(r.institution)),h('p',{style:{whiteSpace:'pre-line'}},text(r.description)))))),
        section('Awards & scholarships',h('div',{className:'award-items'},(data.awards||[]).map((r,i)=>h('p',{key:i},h('strong',{},text(r.title)),h('span',{},text(r.details))))))));
  });
})();
