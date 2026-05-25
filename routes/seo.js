const express = require('express');
const router = express.Router();
const { readJson } = require('../helpers/json-db');
function esc(s=''){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function published(){ return readJson('articles.json', []).filter(a=>a.status==='published'); }
router.get('/robots.txt', (req,res)=>{
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: ${res.locals.adminPath || '/pinktiger8008'}\nDisallow: ${res.locals.adminPath || '/pinktiger8008'}/\n\nSitemap: ${res.locals.baseUrl}/sitemap.xml\nSitemap: ${res.locals.baseUrl}/sitemap-berita.xml\nSitemap: ${res.locals.baseUrl}/sitemap-pages.xml\n`);
});
function url(loc,lastmod,priority='0.8',changefreq='daily'){
  return `<url><loc>${esc(loc)}</loc><lastmod>${new Date(lastmod||Date.now()).toISOString()}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}
router.get('/sitemap.xml', (req,res)=>{
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${res.locals.baseUrl}/sitemap-pages.xml</loc></sitemap><sitemap><loc>${res.locals.baseUrl}/sitemap-berita.xml</loc></sitemap></sitemapindex>`);
});
router.get('/sitemap-pages.xml', (req,res)=>{
  const pages=readJson('pages.json', []);
  const staticUrls=[url(`${res.locals.baseUrl}/`, Date.now(), '1.0', 'hourly'), url(`${res.locals.baseUrl}/berita`, Date.now(), '0.9', 'hourly'), url(`${res.locals.baseUrl}/apk`, Date.now(), '0.7', 'weekly')];
  const pageUrls=pages.map(p=>url(`${res.locals.baseUrl}/p/${p.slug}`, p.updatedAt||Date.now(), '0.8','weekly'));
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls.concat(pageUrls).join('')}</urlset>`);
});
router.get('/sitemap-berita.xml', (req,res)=>{
  const urls=published().map(a=>url(`${res.locals.baseUrl}/berita/${a.slug}`, a.updatedAt||a.publishedAt, '0.9','daily'));
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`);
});
router.get('/feed.json', (req,res)=>res.json({version:'https://jsonfeed.org/version/1.1', title:'OMTOGEL Feed', home_page_url:res.locals.baseUrl, feed_url:`${res.locals.baseUrl}/feed.json`, items:published().slice(0,20).map(a=>({id:a.id,url:`${res.locals.baseUrl}/berita/${a.slug}`,title:a.title,content_text:a.excerpt,date_published:a.publishedAt}))}));
router.get('/rss.xml', (req,res)=>{
  const items=published().slice(0,20).map(a=>`<item><title><![CDATA[${a.title}]]></title><link>${res.locals.baseUrl}/berita/${a.slug}</link><description><![CDATA[${a.excerpt||''}]]></description><pubDate>${new Date(a.publishedAt||Date.now()).toUTCString()}</pubDate></item>`).join('');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>OMTOGEL</title><link>${res.locals.baseUrl}</link><description>Berita bola OMTOGEL dan update terbaru</description>${items}</channel></rss>`);
});
module.exports = router;
