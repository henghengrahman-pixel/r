const express = require('express');
const slugify = require('slugify');

const router = express.Router();

const {
  readJson,
  writeJson
} = require('../helpers/json-db');

const {
  getSettings,
  saveSettings
} = require('../helpers/settings');

function adminPath(){

  return (
    getSettings().adminPath ||
    '/pinktiger8008'
  );

}

function auth(req,res,next){

  if(
    req.session &&
    req.session.admin
  ){
    return next();
  }

  req.flash(
    'error',
    'Silakan login terlebih dahulu.'
  );

  res.redirect(
    adminPath() + '/login'
  );

}

router.use((req,res,next)=>{

  if(
    !req.path.startsWith(
      adminPath()
    )
  ){
    return next('route');
  }

  next();

});

router.get(
  adminPath() + '/login',
  (req,res)=>{

    res.render(
      'admin/login',
      {
        layout:false,
        title:'Login Admin'
      }
    );

  }
);

router.post(
  adminPath() + '/login',
  (req,res)=>{

    const adminId =
      process.env.ADMIN_ID ||
      'admin';

    const adminPassword =
      process.env.ADMIN_PASSWORD ||
      'admin123';

    const {
      username,
      password
    } = req.body;

    if(
      username === adminId &&
      password === adminPassword
    ){

      req.session.admin = true;

      req.flash(
        'success',
        'Login berhasil.'
      );

      return res.redirect(
        adminPath()
      );

    }

    req.flash(
      'error',
      'ID atau password salah.'
    );

    res.redirect(
      adminPath() + '/login'
    );

  }
);

router.post(
  adminPath() + '/logout',
  auth,
  (req,res)=>{

    req.session.destroy(()=>{

      res.redirect(
        adminPath() + '/login'
      );

    });

  }
);

router.get(
  adminPath(),
  auth,
  (req,res)=>{

    res.render(
      'admin/dashboard',
      {
        layout:'layouts/admin',
        title:'Dashboard Admin',

        articles:
          readJson(
            'articles.json',
            []
          ),

        searches:
          readJson(
            'search.json',
            []
          ),

        pages:
          readJson(
            'pages.json',
            []
          )
      }
    );

  }
);

router.get(
  adminPath() + '/settings',
  auth,
  (req,res)=>{

    res.render(
      'admin/settings',
      {
        layout:'layouts/admin',
        title:'Pengaturan Website'
      }
    );

  }
);

router.post(
  adminPath() + '/settings',
  auth,
  (req,res)=>{

    saveSettings(req.body);

    req.flash(
      'success',
      'Pengaturan berhasil disimpan.'
    );

    res.redirect(
      adminPath() + '/settings'
    );

  }
);

router.get(
  adminPath() + '/articles',
  auth,
  (req,res)=>{

    res.render(
      'admin/articles',
      {
        layout:'layouts/admin',
        title:'Artikel',

        articles:
          readJson(
            'articles.json',
            []
          )
      }
    );

  }
);

router.get(
  adminPath() + '/articles/new',
  auth,
  (req,res)=>{

    res.render(
      'admin/article-form',
      {
        layout:'layouts/admin',
        title:'Tambah Artikel',
        article:null
      }
    );

  }
);

router.get(
  adminPath() + '/articles/:id/edit',
  auth,
  (req,res,next)=>{

    const article =
      readJson(
        'articles.json',
        []
      ).find(
        a => a.id === req.params.id
      );

    if(!article){
      return next();
    }

    res.render(
      'admin/article-form',
      {
        layout:'layouts/admin',
        title:'Edit Artikel',
        article
      }
    );

  }
);

router.post(
  adminPath() + '/articles',
  auth,
  (req,res)=>{

    const articles =
      readJson(
        'articles.json',
        []
      );

    const slug =
      req.body.slug ||
      slugify(
        req.body.title || 'artikel',
        {
          lower:true,
          strict:true
        }
      );

    articles.unshift({

      id:
        'art-' + Date.now(),

      title:
        req.body.title,

      slug,

      category:
        req.body.category ||
        'Artikel',

      author:
        req.body.author ||
        'Redaksi',

      excerpt:
        req.body.excerpt || '',

      content:
        req.body.content || '',

      coverUrl:
        req.body.coverUrl ||
        '/images/default-cover.svg',

      publishedAt:
        req.body.publishedAt
          ? new Date(
              req.body.publishedAt
            ).toISOString()
          : new Date().toISOString(),

      status:
        req.body.status ||
        'published',

      tags:
        String(
          req.body.tags || ''
        )
        .split(',')
        .map(x=>x.trim())
        .filter(Boolean)

    });

    writeJson(
      'articles.json',
      articles
    );

    req.flash(
      'success',
      'Artikel berhasil ditambahkan.'
    );

    res.redirect(
      adminPath() + '/articles'
    );

  }
);

router.post(
  adminPath() + '/articles/:id',
  auth,
  (req,res,next)=>{

    const articles =
      readJson(
        'articles.json',
        []
      );

    const index =
      articles.findIndex(
        a => a.id === req.params.id
      );

    if(index < 0){
      return next();
    }

    const slug =
      req.body.slug ||
      slugify(
        req.body.title ||
        articles[index].title,
        {
          lower:true,
          strict:true
        }
      );

    articles[index] = {

      ...articles[index],

      title:
        req.body.title,

      slug,

      category:
        req.body.category ||
        'Artikel',

      author:
        req.body.author ||
        'Redaksi',

      excerpt:
        req.body.excerpt || '',

      content:
        req.body.content || '',

      coverUrl:
        req.body.coverUrl ||
        '/images/default-cover.svg',

      publishedAt:
        req.body.publishedAt
          ? new Date(
              req.body.publishedAt
            ).toISOString()
          : articles[index].publishedAt,

      status:
        req.body.status ||
        'published',

      tags:
        String(
          req.body.tags || ''
        )
        .split(',')
        .map(x=>x.trim())
        .filter(Boolean)

    };

    writeJson(
      'articles.json',
      articles
    );

    req.flash(
      'success',
      'Artikel berhasil diperbarui.'
    );

    res.redirect(
      adminPath() + '/articles'
    );

  }
);

router.post(
  adminPath() + '/articles/:id/delete',
  auth,
  (req,res)=>{

    writeJson(
      'articles.json',

      readJson(
        'articles.json',
        []
      ).filter(
        a => a.id !== req.params.id
      )
    );

    req.flash(
      'success',
      'Artikel berhasil dihapus.'
    );

    res.redirect(
      adminPath() + '/articles'
    );

  }
);

router.get(
  adminPath() + '/search-data',
  auth,
  (req,res)=>{

    res.render(
      'admin/search-data',
      {
        layout:'layouts/admin',
        title:'Data Search',

        items:
          readJson(
            'search.json',
            []
          ),

        trending:
          readJson(
            'trending.json',
            []
          )
      }
    );

  }
);

router.post(
  adminPath() + '/search-data',
  auth,
  (req,res)=>{

    const items =
      readJson(
        'search.json',
        []
      );

    items.unshift({

      id:
        's-' + Date.now(),

      title:
        req.body.title,

      url:
        req.body.url,

      type:
        req.body.type ||
        'Portal',

      description:
        req.body.description,

      keywords:
        String(
          req.body.keywords || ''
        )
        .split(',')
        .map(x=>x.trim())
        .filter(Boolean),

      priority:
        Number(
          req.body.priority || 5
        )

    });

    writeJson(
      'search.json',
      items
    );

    writeJson(
      'trending.json',

      String(
        req.body.trending || ''
      )
      .split(',')
      .map(x=>x.trim())
      .filter(Boolean)
    );

    req.flash(
      'success',
      'Data search berhasil disimpan.'
    );

    res.redirect(
      adminPath() + '/search-data'
    );

  }
);

router.post(
  adminPath() + '/search-data/:id/delete',
  auth,
  (req,res)=>{

    writeJson(
      'search.json',

      readJson(
        'search.json',
        []
      ).filter(
        x => x.id !== req.params.id
      )
    );

    req.flash(
      'success',
      'Item search berhasil dihapus.'
    );

    res.redirect(
      adminPath() + '/search-data'
    );

  }
);

router.get(
  adminPath() + '/seo',
  auth,
  (req,res)=>{

    res.render(
      'admin/seo',
      {
        layout:'layouts/admin',
        title:'SEO',

        seo:
          readJson(
            'seo.json',
            {}
          )
      }
    );

  }
);

router.post(
  adminPath() + '/seo',
  auth,
  (req,res)=>{

    writeJson(
      'seo.json',
      req.body
    );

    req.flash(
      'success',
      'SEO berhasil disimpan.'
    );

    res.redirect(
      adminPath() + '/seo'
    );

  }
);

router.get(
  adminPath() + '/apk',
  auth,
  (req,res)=>{

    res.render(
      'admin/apk',
      {
        layout:'layouts/admin',
        title:'APK',

        apk:
          readJson(
            'apk.json',
            {}
          )
      }
    );

  }
);

router.post(
  adminPath() + '/apk',
  auth,
  (req,res)=>{

    writeJson(
      'apk.json',
      {

        version:
          req.body.version,

        androidUrl:
          req.body.androidUrl,

        changelog:
          String(
            req.body.changelog || ''
          )
          .split('\n')
          .map(x=>x.trim())
          .filter(Boolean),

        updatedAt:
          new Date().toISOString()

      }
    );

    req.flash(
      'success',
      'APK berhasil diperbarui.'
    );

    res.redirect(
      adminPath() + '/apk'
    );

  }
);

module.exports = router;
