const express = require('express');

const router = express.Router();

const {
  readJson
} = require('../helpers/json-db');

function getArticles() {

  return readJson(
    'articles.json',
    []
  );

}

router.get(
  '/robots.txt',
  (req, res) => {

    res.type('text/plain');

    res.send(
`User-agent: *
Allow: /

Sitemap: ${res.locals.baseUrl}/sitemap.xml`
    );

  }
);

router.get(
  '/sitemap.xml',
  (req, res) => {

    const articles =
      getArticles();

    res.header(
      'Content-Type',
      'application/xml'
    );

    const urls = articles.map(
      article => `
<url>

  <loc>
    ${res.locals.baseUrl}/berita/${article.slug}
  </loc>

  <lastmod>
    ${new Date(
      article.updatedAt ||
      article.publishedAt ||
      Date.now()
    ).toISOString()}
  </lastmod>

  <changefreq>
    daily
  </changefreq>

  <priority>
    0.9
  </priority>

</url>`
    ).join('');

    res.send(
`<?xml version="1.0" encoding="UTF-8"?>

<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>

  <loc>
    ${res.locals.baseUrl}
  </loc>

  <changefreq>
    hourly
  </changefreq>

  <priority>
    1.0
  </priority>

</url>

<url>

  <loc>
    ${res.locals.baseUrl}/berita
  </loc>

  <changefreq>
    hourly
  </changefreq>

  <priority>
    0.9
  </priority>

</url>

${urls}

</urlset>`
    );

  }
);

router.get(
  '/rss.xml',
  (req, res) => {

    const articles =
      getArticles().slice(0, 20);

    res.header(
      'Content-Type',
      'application/xml'
    );

    const items = articles.map(
      article => `
<item>

<title>
<![CDATA[
${article.title}
]]>
</title>

<link>
${res.locals.baseUrl}/berita/${article.slug}
</link>

<description>
<![CDATA[
${article.excerpt || ''}
]]>
</description>

<pubDate>
${new Date(
  article.publishedAt ||
  Date.now()
).toUTCString()}
</pubDate>

</item>`
    ).join('');

    res.send(
`<?xml version="1.0" encoding="UTF-8"?>

<rss version="2.0">

<channel>

<title>
OMTOGEL
</title>

<link>
${res.locals.baseUrl}
</link>

<description>
Portal berita bola terbaru
</description>

${items}

</channel>

</rss>`
    );

  }
);

module.exports = router;
