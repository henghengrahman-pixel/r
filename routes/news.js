const express = require('express');
const router = express.Router();
const { readJson } = require('../helpers/json-db');
const { pageMeta, breadcrumbSchema, articleSchema } = require('../helpers/seo');
function published(){ return readJson('articles.json', []).filter(a=>a.status==='published').sort((a,b)=>new Date(b.publishedAt||0)-new Date(a.publishedAt||0)); }
router.get('/', (req,res)=>{
  const articles=published();
  const schema=[breadcrumbSchema([{name:'Home',url:'/'},{name:'Berita Bola',url:'/berita'}], res.locals.baseUrl)];
  const meta=pageMeta({ title:'Berita Bola OMTOGEL - Jadwal, Prediksi dan Update Terbaru', description:'Kumpulan berita bola OMTOGEL, jadwal pertandingan, prediksi bola, livescore, transfer pemain, dan update sepak bola terbaru.', canonical:'/berita', schema }, res);
  res.render('news/index', { ...meta, articles });
});
router.get('/:slug', (req,res,next)=>{
  const articles=published();
  const article=articles.find(a=>a.slug===req.params.slug);
  if(!article) return next();
  const related=articles.filter(a=>a.slug!==article.slug && (a.category===article.category || (a.tags||[]).some(t=>(article.tags||[]).includes(t)))).slice(0,4);
  const fallback=articles.filter(a=>a.slug!==article.slug).slice(0,4);
  const schema=[breadcrumbSchema([{name:'Home',url:'/'},{name:'Berita Bola',url:'/berita'},{name:article.title,url:`/berita/${article.slug}`}], res.locals.baseUrl), articleSchema(article,res.locals.settings,res.locals.baseUrl)];
  const meta=pageMeta({ title:article.seoTitle || article.title, description:article.metaDescription || article.excerpt, canonical:'/berita/'+article.slug, image:article.coverUrl, type:'article', keywords:(article.tags||[]).join(', '), schema }, res);
  res.render('news/detail', { ...meta, article, related: related.length ? related : fallback });
});
module.exports=router;
