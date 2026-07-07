export const siteConfig = {
  name: 'Optumus Analytics',
  description:
    'Run SEO, analytics, and growth operations from one modern command center for ambitious teams.',
  url: 'https://optumusanalytics.com',
  ogImage: 'https://app.optumusanalytics.com/opengraph-image',
  links: {
    github: 'https://github.com/ansvisor/ansvisor',
    docs: 'https://docs.optumusanalytics.com',
  },
  legal: {
    privacy: 'https://www.optumusanalytics.com/privacy-policy',
    terms: 'https://www.optumusanalytics.com/terms-of-service',
  },
} as const;

export type SiteConfig = typeof siteConfig;
