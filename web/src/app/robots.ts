import type { MetadataRoute } from 'next';

/**
 * Block search engines from indexing the application subdomain.
 *
 * The marketing site at `optumusanalytics.com` is the indexed surface.
 * The Next.js app at `app.optumusanalytics.com` is the authenticated product UI.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
  };
}
