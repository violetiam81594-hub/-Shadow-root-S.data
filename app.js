const KEY = 'gitlit.elements.v2';
const kinds = ['favicon', 'icon', 'font', 'stylesheet', 'button', 'web-app', 'script', 'extension', 'other'];
const samples = [
  { id:'sample-favicon', name:'Moonseed favicon', kind:'favicon', creator:'GitLit sample', price:0, accent:'#7654d9', description:'A simple moon-like mark for a tiny site.', license:'CC0-1.0', grants:['view','reuse','remix'], capabilities:['visual'], terms:'Sample listing; public-domain dedication for the demo.', snippet:'favicon.svg', sourceUrl:'', sourceMapUrl:'' },
  { id:'sample-toggle', name:'Jellybean toggle', kind:'button', creator:'GitLit sample', price:0, accent:'#d76988', description:'A friendly local toggle button. Its preview only changes its own state.', license:'MIT', grants:['view','reuse','remix'], capabilities:['visual','local-toggle','preview-style'], terms:'Sample listing. Attribution appreciated.', snippet:'<button class="jelly">Toggle</button>', sourceUrl:'', sourceMapUrl:'' },
  { id:'sample-style', name:'Soft paper tokens', kind:'stylesheet', creator:'GitLit sample', price:0, accent:'#558b72', description:'A small palette idea with a low-key green accent.', license:'CC-BY-4.0', grants:['view','reuse'], capabilities:['visual','preview-style'], terms:'Credit the creator when reusing.', snippet:':root { --paper: #fbf8f3; --accent: #558b72; }', sourceUrl:'', sourceMapUrl:'' }
];
let elements = load();
let filter = 'all';
const catalog = document.querySelector('#catalog');
const search = document.querySelector('#search');

function load() {
  try { const data = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(data)) return data.filter(valid); } catch { /* use examples */ }
  return structuredClone(samples);
}
function valid(x) { return x && typeof x.id === 'string' && typeof x.name === 'string' && kinds.includes(x.kind); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(elements)); return true; } catch { return false; } }
function el(tag, cls, text) { const n=document.createElement(tag); if(cls)n.className=cls; if(text!==undefined)n.textContent=text; return n; }
function safeUrl(value) { try { const u=new URL(value); return ['https:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } }
function render() {
  const q=search.value.trim().toLowerCase();
  const found=elements.filter(x=>(filter==='all'||x.kind===filter)&&[x.name,x.kind,x.creator,x.description,...(x.grants||[])].join(' ').toLowerCase().includes(q));
  catalog.replaceChildren(); document.querySelector('#empty').hidden=found.length>0;
  for(const item of found) catalog.append(makeCard(item));
}
function makeCard(item) {
  const card=el('article','card');
  const preview=el('div','preview');
  const accent=/^#[0-9a-f]{6}$/i.test(item.accent||'')?item.accent:'#7654d9';
  preview.style.setProperty('--preview-accent',accent);
  const frame=document.createElement('iframe');
  frame.title=`Safe preview: ${item.name}`;
  frame.loading='lazy';
  frame.setAttribute('sandbox','allow-scripts');
  frame.referrerPolicy='no-referrer';
  frame.srcdoc=previewDocument(item,accent);
  preview.append(frame);
  const meta=el('div','card-meta'); meta.append(el('span','kind',item.kind),el('span','price',Number(item.price)>0?`$${Number(item.price).toFixed(2)} · creator-set`:'Free'));
  card.append(preview,meta,el('h3','',item.name),el('p','description',item.description),el('p','creator',`Created by ${item.creator}`));
  const rights=el('div','rights'); rights.append(el('strong','','Usage rights granted: '),el('span','',formatRights(item.grants)));
  card.append(rights);
  const caps=el('div','caps'); caps.append(el('strong','','Preview capabilities: '),el('span','',formatCaps(item.capabilities)));
  card.append(caps);
  const detail=document.createElement('details'); detail.append(el('summary','','License, terms & source'));
  detail.append(el('p','terms',`${item.license||'License not set'}${item.terms?` — ${item.terms}`:''}`));
  const source=safeUrl(item.sourceUrl); if(source){const a=el('a','','Open source');a.href=source;a.target='_blank';a.rel='noopener noreferrer';detail.append(a);}
  const map=safeUrl(item.sourceMapUrl); if(map){const a=el('a','','Open source map (may reveal source)');a.href=map;a.target='_blank';a.rel='noopener noreferrer';detail.append(a);}
  if(item.snippet) detail.append(el('pre','snippet',item.snippet));
  card.append(detail); return card;
}
function formatRights(values=[]) { const labels={view:'inspect',reuse:'reuse',remix:'modify/remix',commercial:'commercial use',redistribute:'redistribute'}; return values.length?values.map(x=>labels[x]||x).join(', '):'none specified'; }
function formatCaps(values=[]) { const labels={visual:'visual preview', 'local-toggle':'local toggle', 'preview-style':'preview-only styling'}; return values.length?values.map(x=>labels[x]||x).join(', '):'static info only'; }
function esc(s) { return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function previewDocument(item, accent) {
  const name=esc(item.name), kind=esc(item.kind);
  const visual=(item.capabilities||[]).includes('visual');
  const toggle=(item.capabilities||[]).includes('local-toggle') && ['button','web-app','extension'].includes(item.kind);
  const style=(item.capabilities||[]).includes('preview-style');
  const content=visual ? `<div class="mark" aria-hidden="true">${kind==='favicon'?'◒':kind==='icon'?'✳':kind==='font'?'Aa':kind==='stylesheet'?'{}':kind==='button'?'✦':kind==='script'?'⌘':'◈'}</div><h2>${name}</h2>${toggle?'<button id="toggle" type="button" aria-pressed="false">Try local toggle</button>':''}${style?'<p class="note">Accent applies only inside this preview.</p>':''}` : '<p>Visual preview not granted by creator.</p>';
  const script=toggle?`<script>const b=document.querySelector('#toggle');b.addEventListener('click',()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.textContent=on?'On — click to reset':'Try local toggle';document.body.classList.toggle('on',on)});<\/script>`:'';
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;min-height:180px;display:grid;place-content:center;justify-items:center;gap:8px;font:14px system-ui,sans-serif;color:#29263a;background:#faf9fc;text-align:center}.mark{font-size:38px;color:${style?accent:'#7654d9'}}h2{font-size:14px;margin:0}button{border:0;border-radius:20px;padding:8px 14px;background:${style?accent:'#7654d9'};color:white;cursor:pointer}.on{background:#e8f4ec}.note{font-size:11px;color:#666;margin:0}</style></head><body>${content}${script}</body></html>`;
}

document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.filter.active')?.classList.remove('active');b.classList.add('active');filter=b.dataset.kind;render();}));
search.addEventListener('input',render);
document.querySelector('#create-form').addEventListener('submit',event=>{
  event.preventDefault(); const f=event.currentTarget; const d=new FormData(f); const price=Number(d.get('price'));
  if(!Number.isFinite(price)||price<0||price>100000){document.querySelector('#status').textContent='Enter a price from $0 to $100,000.';return;}
  const item={id:crypto.randomUUID?.()||`item-${Date.now()}`,name:String(d.get('name')).trim(),kind:String(d.get('kind')),creator:String(d.get('creator')).trim(),price,accent:String(d.get('accent')),description:String(d.get('description')).trim(),license:String(d.get('license')),terms:String(d.get('terms')).trim(),snippet:String(d.get('snippet')).slice(0,2000),sourceUrl:safeUrl(d.get('sourceUrl')),sourceMapUrl:safeUrl(d.get('sourceMapUrl')),grants:d.getAll('grant'),capabilities:d.getAll('capability'),createdAt:new Date().toISOString()};
  elements.unshift(item); const saved=save(); f.reset(); f.elements.price.value='0'; f.elements.accent.value='#7654d9';
  document.querySelector('#status').textContent=saved?'Added to this browser’s library. Export JSON to share it.':'Added for this session; browser storage is unavailable.'; render(); document.querySelector('#explore').scrollIntoView({behavior:'smooth'});
});
document.querySelector('#export-button').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({format:'gitlit-elements',version:2,elements},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='gitlit-elements.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
render();
