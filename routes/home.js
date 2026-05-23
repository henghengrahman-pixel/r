const express = require('express');
const router = express.Router();
const { readJson } = require('../helpers/json-db');
const { pageMeta } = require('../helpers/seo');
router.get('/', (req,res)=>{
  const articles=readJson('articles.json', []).filter(a=>a.status==='published').sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt)).slice(0,6);
  const trending=readJson('trending.json', []);
  const seo=readJson('seo.json', {});
  const meta=pageMeta({ title: seo.homeTitle || res.locals.settings.siteName, description: seo.homeDescription, canonical:'/' }, res);
  res.render('home/index', { ...meta, articles, trending });
});
module.exports=router;
