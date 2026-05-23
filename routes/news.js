const express = require('express');
const router = express.Router();
const { readJson } = require('../helpers/json-db');
const { pageMeta } = require('../helpers/seo');
router.get('/', (req,res)=>{
  const articles=readJson('articles.json', []).filter(a=>a.status==='published').sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));
  const meta=pageMeta({ title:'Berita Bola dan Update Terbaru', description:'Kumpulan berita bola, jadwal, prediksi pertandingan, dan update informasi pilihan.', canonical:'/berita' }, res);
  res.render('news/index', { ...meta, articles });
});
router.get('/:slug', (req,res,next)=>{
  const articles=readJson('articles.json', []);
  const article=articles.find(a=>a.slug===req.params.slug && a.status==='published');
  if(!article) return next();
  const related=articles.filter(a=>a.slug!==article.slug && a.status==='published').slice(0,4);
  const meta=pageMeta({ title:article.title, description:article.excerpt, canonical:'/berita/'+article.slug, image:article.coverUrl, type:'article' }, res);
  res.render('news/detail', { ...meta, article, related });
});
module.exports=router;
