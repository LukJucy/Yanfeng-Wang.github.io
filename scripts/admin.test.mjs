import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderHomepage } from './build.mjs';

const config = JSON.parse(fs.readFileSync(new URL('../admin/config.yml', import.meta.url)));
const data = JSON.parse(fs.readFileSync(new URL('../content/homepage.json', import.meta.url)));
function check(fields, value) {
    for (const key of Object.keys(value)) assert.ok(fields.some(f=>f.name===key), `Unknown field: ${key}`);
    for (const field of fields) {
      if(field.widget==='object') check(field.fields,value[field.name]);
      else if(field.widget==='list') value[field.name].forEach(item=>check(field.fields,item));
      else if(field.required !== false) assert.notEqual(String(value[field.name]??'').trim(),'');
    }
}
test('CMS schema covers every content field, including existing optional values', () => {
  check(config.collections[0].files[0].fields,data);
  assert.equal(config.collections[0].files[0].file,'content/homepage.json');
  assert.equal(config.backend.branch,'main');
  assert.equal(config.media_folder,'static/assets/uploads');
  assert.equal(config.public_folder,'static/assets/uploads');
});
test('new posters and cleared optional fields can publish', () => {
  const draft=structuredClone(data);
  delete draft.profile.secondary_email;
  draft.publications.push({year:'2026',title:'Poster fixture',venue:'Conference fixture'});
  check(config.collections[0].files[0].fields,draft);
  const template=fs.readFileSync(new URL('../templates/homepage.html',import.meta.url),'utf8');
  const html=renderHomepage(draft,template);
  assert.match(html,/Poster fixture/);
  assert.doesNotMatch(html,/mailto:undefined|mailto:"/);
});
test('custom preview renders all collections and unsaved uploaded images', () => {
  let render;
  const window = {h:(tag,props,...children)=>({tag,props,children}),CMS:{registerPreviewStyle(){},registerPreviewTemplate(name,component){assert.equal(name,'homepage');render=component;}}};
  vm.runInNewContext(fs.readFileSync(new URL('../admin/preview.js',import.meta.url),'utf8'),{window,URL,location:{href:'https://lukjucy.github.io/Yanfeng-Wang.github.io/admin/'}});
  const preview=render({entry:{get:()=>({toJS:()=>data})},getAsset:()=>({toString:()=> 'blob:unsaved-image'})});
  const output=JSON.stringify(preview);
  assert.match(output,/blob:unsaved-image/);
  for(const paper of data.publications) assert.ok(output.includes(paper.title));
  for(const award of data.awards) assert.ok(output.includes(award.title));
});
