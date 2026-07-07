import { describe, expect, it } from 'vitest';
import { analyzeSeoHtml } from './audit';

describe('analyzeSeoHtml', () => {
  it('flags missing alt text and long titles', () => {
    const html = `<!doctype html>
      <html>
        <head>
          <title>${'x'.repeat(80)}</title>
          <meta name="description" content="Short" />
        </head>
        <body>
          <h1>Heading</h1>
          <img src="/hero.png" />
          <a href="https://example.com">Link</a>
        </body>
      </html>`;

    const result = analyzeSeoHtml(html, 'https://example.com');

    expect(result.titleLength).toBeGreaterThan(60);
    expect(result.missingAltText).toBe(1);
    expect(result.score).toBeLessThan(100);
  });
});
