function stripHtml(s = '') {

  return String(s)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

}

function cut(s = '', n = 155) {

  s = stripHtml(s);

  return s.length > n
    ? s.slice(0, n - 1).trim() + '…'
    : s;

}

function absoluteUrl(base = '', url = '/') {

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return (
    String(base).replace(/\/+$/, '') +
    '/' +
    String(url).replace(/^\/+/, '')
  );

}

function pageMeta(
  {
    title = '',
    description = '',
    canonical = '/',
    image = '',
    type = 'website',
    keywords = ''
  },
  res
) {

  const settings =
    res.locals.settings || {};

  const site =
    settings.siteName ||
    'OMTOGEL';

  const baseUrl =
    res.locals.baseUrl || '';

  return {

    title:
      title || site,

    description:
      cut(
        description ||
        settings.siteDescription ||
        ''
      ),

    canonical:
      absoluteUrl(
        baseUrl,
        canonical
      ),

    image:
      image
        ? absoluteUrl(baseUrl, image)
        : absoluteUrl(
            baseUrl,
            settings.logoUrl ||
            '/images/logo.svg'
          ),

    type,

    keywords:
      keywords ||
      settings.siteKeywords ||
      ''

  };

}

module.exports = {
  stripHtml,
  cut,
  absoluteUrl,
  pageMeta
};
