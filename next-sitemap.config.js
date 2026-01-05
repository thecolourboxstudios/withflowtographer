/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://withtheflowtographer.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/api/*', '/admin/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    additionalSitemaps: [
      'https://withtheflowtographer.com/server-sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    const defaultPriority = config.priority;
    const defaultChangefreq = config.changefreq;

    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
      };
    }

    if (path.startsWith('/#')) {
      return {
        loc: `https://withtheflowtographer.com${path}`,
        changefreq: 'monthly',
        priority: 0.8,
      };
    }

    return {
      loc: path,
      changefreq: defaultChangefreq,
      priority: defaultPriority,
    };
  },
}