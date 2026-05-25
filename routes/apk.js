const express = require('express');
const router = express.Router();
const { readJson } = require('../helpers/json-db');
const { pageMeta } = require('../helpers/seo');
router.get('/', (req,res)=>{
  const apk=readJson('apk.json', {});
  const meta=pageMeta({ title:'Download Aplikasi dan Update Versi', description:'Informasi aplikasi, catatan pembaruan, dan panduan instalasi terbaru.', canonical:'/apk' }, res);
  res.render('apk/index', { ...meta, apk });
});
module.exports=router;
