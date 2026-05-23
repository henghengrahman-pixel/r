const { readJson } = require('./json-db');
const { stripHtml } = require('./seo');
function normalize(s=''){ return String(s).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim(); }
function scoreItem(q, item){
  const nq=normalize(q); if(!nq) return 0;
  const words=nq.split(' ').filter(Boolean);
  const hay=normalize([item.title,item.description,item.type,item.url,(item.keywords||[]).join(' ')].join(' '));
  let score=Number(item.priority||0);
  if(hay.includes(nq)) score += 35;
  for(const w of words){ if(hay.includes(w)) score += 10; if(normalize(item.title||'').includes(w)) score += 8; }
  return score;
}
function allIndex(){
  const manual=readJson('search.json', []);
  const articles=readJson('articles.json', []).filter(a=>a.status==='published').map(a=>({ id:a.id, title:a.title, url:'/berita/'+a.slug, type:a.category||'Artikel', description:a.excerpt||stripHtml(a.content), keywords:[...(a.tags||[]), a.category||'', a.title||''], priority:7, image:a.coverUrl }));
  const pages=readJson('pages.json', []).map(p=>({ id:'page-'+p.slug, title:p.title, url:'/p/'+p.slug, type:'Halaman', description:p.description||p.body, keywords:p.keywords||[], priority:8 }));
  return [...manual, ...articles, ...pages];
}
function search(q, limit=20){ return allIndex().map(item=>({ ...item, _score:scoreItem(q,item)})).filter(x=>x._score>0).sort((a,b)=>b._score-a._score).slice(0,limit); }
module.exports={ search, allIndex };
