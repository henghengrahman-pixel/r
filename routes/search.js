const express = require('express');
const router = express.Router();
const { search } = require('../helpers/search-engine');
const { readJson } = require('../helpers/json-db');
const { pageMeta } = require('../helpers/seo');
router.get('/', (req,res)=>{
  const q=(req.query.q||'').trim();
  const results=q ? search(q, 30) : [];
  const trending=readJson('trending.json', []);
  const meta=pageMeta({ title: q ? `Hasil Pencarian ${q}` : 'Pencarian', description: q ? `Temukan hasil terbaik untuk ${q} di portal pencarian brand.` : 'Cari artikel, aplikasi, panduan, dan update brand.', canonical: q ? `/search?q=${encodeURIComponent(q)}` : '/search' }, res);
  res.render('search/index', { ...meta, q, results, trending });
});
router.get('/:keyword', (req,res)=>{
  const q=String(req.params.keyword||'').replace(/-/g,' ');
  const results=search(q, 30);
  const trending=readJson('trending.json', []);
  const meta=pageMeta({ title: `${q.toUpperCase()} - Pencarian Portal`, description:`Hasil pencarian dan informasi terkait ${q} dalam portal brand.`, canonical:`/search/${req.params.keyword}` }, res);
  res.render('search/index', { ...meta, q, results, trending });
});
module.exports=router;
