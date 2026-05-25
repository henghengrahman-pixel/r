const express = require('express');
const router = express.Router();
const { readJson } = require('../helpers/json-db');
const { pageMeta, orgSchema, websiteSchema, breadcrumbSchema, faqSchema } = require('../helpers/seo');
function published(){ return readJson('articles.json', []).filter(a=>a.status==='published').sort((a,b)=>new Date(b.publishedAt||0)-new Date(a.publishedAt||0)); }
router.get('/', (req,res)=>{
  const articles=published().slice(0,6);
  const latest=published().slice(0,10);
  const trending=readJson('trending.json', []);
  const seo=readJson('seo.json', {});
  const schema=[orgSchema(res.locals.settings,res.locals.baseUrl), websiteSchema(res.locals.settings,res.locals.baseUrl), faqSchema([
    {q:'Apa itu OMTOGEL?',a:'OMTOGEL adalah portal informasi brand yang memuat akses login, berita bola, live score, prediksi pertandingan, jadwal bola, dan update terbaru secara mobile friendly.'},
    {q:'Di mana menemukan link alternatif OMTOGEL?',a:'Pengguna dapat memakai menu akses cepat pada homepage untuk menuju halaman login, daftar, bantuan, dan informasi akses resmi yang disetel melalui admin.'},
    {q:'Apakah berita bola OMTOGEL mobile friendly?',a:'Ya, halaman berita dan homepage dioptimasi untuk perangkat mobile, gambar lazy load, struktur heading rapi, dan layout tanpa horizontal scroll.'}
  ])];
  const meta=pageMeta({ title: seo.homeTitle || 'OMTOGEL Resmi - Login, Link Alternatif, Berita Bola dan Livescore', description: seo.homeDescription || 'OMTOGEL portal resmi untuk login, daftar, link alternatif, berita bola, prediksi pertandingan, livescore, jadwal bola, dan informasi akses terbaru.', canonical:'/', schema }, res);
  res.render('home/index', { ...meta, articles, latest, trending });
});
router.get('/p/:slug', (req,res,next)=>{
  const page=readJson('pages.json', []).find(p=>p.slug===req.params.slug);
  if(!page) return next();
  const schema=[breadcrumbSchema([{name:'Home',url:'/'},{name:page.title,url:`/p/${page.slug}`}], res.locals.baseUrl)];
  const meta=pageMeta({ title:page.title, description:page.description, canonical:`/p/${page.slug}`, keywords:(page.keywords||[]).join(', '), schema }, res);
  res.render('page', { ...meta, page });
});
module.exports=router;
