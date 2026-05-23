function stripHtml(s=''){ return String(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(); }
function cut(s='', n=155){ s=stripHtml(s); return s.length>n ? s.slice(0,n-1).trim()+'…' : s; }
function absoluteUrl(base='', url='/'){
  if(/^https?:\/\//i.test(url)) return url;
  return String(base).replace(/\/$/,'') + '/' + String(url).replace(/^\//,'');
}
function pageMeta({ title, description, canonical, image, type='website' }, res){
  const site=res.locals.settings.siteName || 'OMTOGEL';
  return {
    title: title ? `${title}` : site,
    description: cut(description || res.locals.settings.siteDescription || ''),
    canonical: absoluteUrl(res.locals.baseUrl, canonical || '/'),
    image: image ? absoluteUrl(res.locals.baseUrl, image) : absoluteUrl(res.locals.baseUrl, res.locals.settings.logoUrl || '/images/logo.svg'),
    type
  };
}
module.exports={ stripHtml, cut, absoluteUrl, pageMeta };
