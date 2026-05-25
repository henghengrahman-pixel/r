function stripHtml(value = '') {
  return String(value).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
function cut(value = '', length = 158) {
  const text = stripHtml(value);
  return text.length > length ? `${text.slice(0, length - 1).trim()}…` : text;
}
function absoluteUrl(base = '', url = '/') {
  if (!url) return String(base || '').replace(/\/+$/, '') + '/';
  if (/^https?:\/\//i.test(url)) return url;
  return `${String(base || '').replace(/\/+$/, '')}/${String(url).replace(/^\/+/, '')}`;
}
function safeJson(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}
function keywordBase(settings = {}) {
  return settings.siteKeywords || 'omtogel, link alternatif omtogel, login omtogel, situs omtogel, omtogel resmi, prediksi bola omtogel, livescore omtogel, berita bola omtogel, bandar bola omtogel, omtogel terpercaya, daftar omtogel, togel online omtogel';
}
function pageMeta(options = {}, res) {
  const settings = res.locals.settings || {};
  const baseUrl = res.locals.baseUrl || '';
  const site = settings.siteName || 'OMTOGEL';
  const rawTitle = options.title || site;
  const title = rawTitle.includes(site) ? rawTitle : `${rawTitle} | ${site}`;
  const description = cut(options.description || settings.siteDescription || `${site} portal resmi dengan berita bola, live score, prediksi pertandingan, jadwal bola, dan informasi akses terbaru.`, 158);
  const canonical = absoluteUrl(baseUrl, options.canonical || '/');
  const image = absoluteUrl(baseUrl, options.image || settings.ogImageUrl || settings.logoUrl || '/images/logo.svg');
  return {
    title,
    description,
    canonical,
    image,
    type: options.type || 'website',
    keywords: options.keywords || keywordBase(settings),
    robots: options.robots || 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    author: options.author || settings.siteName || 'OMTOGEL',
    schema: options.schema || []
  };
}
function orgSchema(settings = {}, baseUrl = '') {
  return { '@context':'https://schema.org', '@type':'Organization', name:settings.siteName || 'OMTOGEL', url:baseUrl || '/', logo:absoluteUrl(baseUrl, settings.logoUrl || '/images/logo.svg'), sameAs:[settings.loginUrl, settings.daftarUrl].filter(Boolean).filter(x => x !== '#') };
}
function websiteSchema(settings = {}, baseUrl = '') {
  return { '@context':'https://schema.org', '@type':'WebSite', name:settings.siteName || 'OMTOGEL', url:baseUrl || '/', potentialAction:{ '@type':'SearchAction', target:`${String(baseUrl).replace(/\/+$/,'')}/search?q={search_term_string}`, 'query-input':'required name=search_term_string' } };
}
function breadcrumbSchema(items = [], baseUrl = '') {
  return { '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:items.map((item, index)=>({ '@type':'ListItem', position:index+1, name:item.name, item:absoluteUrl(baseUrl, item.url || '/') })) };
}
function articleSchema(article = {}, settings = {}, baseUrl = '') {
  const url = absoluteUrl(baseUrl, `/berita/${article.slug}`);
  return { '@context':'https://schema.org', '@type':'NewsArticle', headline:article.title, description:cut(article.excerpt || article.content || '', 150), image:[absoluteUrl(baseUrl, article.coverUrl || settings.logoUrl || '/images/default-cover.svg')], datePublished:article.publishedAt || new Date().toISOString(), dateModified:article.updatedAt || article.publishedAt || new Date().toISOString(), author:{ '@type':'Person', name:article.author || 'Redaksi' }, publisher:{ '@type':'Organization', name:settings.siteName || 'OMTOGEL', logo:{ '@type':'ImageObject', url:absoluteUrl(baseUrl, settings.logoUrl || '/images/logo.svg') } }, mainEntityOfPage:{ '@type':'WebPage', '@id':url } };
}
function faqSchema(items = []) {
  return { '@context':'https://schema.org', '@type':'FAQPage', mainEntity:items.map(item => ({ '@type':'Question', name:item.q, acceptedAnswer:{ '@type':'Answer', text:item.a } })) };
}
module.exports = { stripHtml, cut, absoluteUrl, safeJson, pageMeta, orgSchema, websiteSchema, breadcrumbSchema, articleSchema, faqSchema, keywordBase };
