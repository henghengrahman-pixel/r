const express = require('express');
const router = express.Router();
const { readJson } = require('../helpers/json-db');
const { allIndex } = require('../helpers/search-engine');
const { absoluteUrl, pageMeta } = require('../helpers/seo');
router.get('/robots.txt', (req,res)=>{
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${absoluteUrl(res.locals.baseUrl,'/sitemap.xml')}\n`);
});
router.get('/sitemap.xml', (req,res)=>{
  const articles=readJson('articles.json', []).filter(a=>a.status==='published').map(a=>'/berita/'+a.slug);
  const pages=readJson('pages.json', []).map(p=>'/p/'+p.slug);
  const trending=readJson('trending.json', []).map(k=>'/search/'+encodeURIComponent(k.toLowerCase().replace(/\s+/g,'-')));
  const urls=['/','/search','/berita','/apk',...articles,...pages,...trending];
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`\n<url><loc>${absoluteUrl(res.locals.baseUrl,u)}</loc><changefreq>daily</changefreq><priority>${u==='/'?'1.0':'0.8'}</priority></url>`).join('')}\n</urlset>`);
});
router.get('/feed.json', (req,res)=>res.json(allIndex()));
router.get('/p/:slug', (req,res,next)=>{
  const page=readJson('pages.json', []).find(p=>p.slug===req.params.slug);
  if(!page) return next();
  const meta=pageMeta({ title:page.title, description:page.description, canonical:'/p/'+page.slug }, res);
  res.render('page', { ...meta, page });
});
module.exports=router;
