require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const compression = require('compression');
const flash = require('connect-flash');

const {
  ensureDataFiles
} = require('./helpers/json-db');

const {
  getSettings
} = require('./helpers/settings');

ensureDataFiles();

const app = express();

const PORT =
  process.env.PORT || 8080;

app.disable('x-powered-by');

app.set(
  'trust proxy',
  1
);

app.set(
  'views',
  path.join(__dirname, 'views')
);

app.set(
  'view engine',
  'ejs'
);

app.use(expressLayouts);

app.set(
  'layout',
  'layouts/main'
);

app.use(
  helmet({
    contentSecurityPolicy:false,
    crossOriginEmbedderPolicy:false
  })
);

app.use(compression());

app.use(
  express.urlencoded({
    extended:true,
    limit:'10mb'
  })
);

app.use(
  express.json({
    limit:'10mb'
  })
);

app.use(
  methodOverride('_method')
);

app.use(
  express.static(
    path.join(__dirname, 'public'),
    {
      maxAge:'7d',
      etag:true
    }
  )
);

app.use(
  session({

    name:'omto.sid',

    secret:
      process.env.SESSION_SECRET ||
      'omtogel-secret-key',

    resave:false,

    saveUninitialized:false,

    cookie:{

      httpOnly:true,

      sameSite:'lax',

      secure:false,

      maxAge:
        1000 * 60 * 60 * 8

    }

  })
);

app.use(flash());

app.use((req,res,next)=>{

  const settings =
    getSettings();

  const baseUrl =
    process.env.BASE_URL ||
    settings.baseUrl ||
    `${req.protocol}://${req.get('host')}`;

  res.locals.settings =
    settings;

  res.locals.currentPath =
    req.path;

  res.locals.success =
    req.flash('success');

  res.locals.error =
    req.flash('error');

  res.locals.baseUrl =
    String(baseUrl)
      .replace(/\/+$/,'');

  res.locals.adminPath =
    settings.adminPath ||
    '/pinktiger8008';

  next();

});

app.use(
  '/',
  require('./routes/home')
);

app.use(
  '/search',
  require('./routes/search')
);

app.use(
  '/berita',
  require('./routes/news')
);

app.use(
  '/apk',
  require('./routes/apk')
);

app.use(
  '/',
  require('./routes/seo')
);

app.use(
  '/',
  require('./routes/admin')
);

app.use((req,res)=>{

  res.status(404).render(
    '404',
    {

      title:
        'Halaman Tidak Ditemukan',

      description:
        'Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.',

      canonical:
        `${res.locals.baseUrl}${req.originalUrl}`,

      keywords:
        'halaman tidak ditemukan',

      type:
        'website'

    }
  );

});

app.use((err,req,res,next)=>{

  console.error(err);

  res.status(500).render(
    '500',
    {

      title:
        'Terjadi Kendala Sistem',

      description:
        'Sistem sedang melakukan proses ulang. Silakan coba beberapa saat lagi.',

      canonical:
        `${res.locals.baseUrl}${req.originalUrl}`,

      keywords:
        'server error',

      type:
        'website'

    }
  );

});

app.listen(
  PORT,
  ()=>{

    console.log(
      `OMTO PLATFORM RUNNING PORT ${PORT}`
    );

  }
);
