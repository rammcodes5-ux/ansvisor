export interface SeoAuditResult {
  score: number;
  titleLength: number;
  metaDescriptionLength: number;
  headingCount: number;
  brokenLinks: number;
  missingAltText: number;
  issues: Array<{ type: string; message: string }>;
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function analyzeSeoHtml(html: string, url: string): SeoAuditResult {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const metaDescriptionMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const headingMatches = html.match(/<h[1-6][^>]*>/gi) || [];
  const imgMatches = html.match(/<img[^>]+>/gi) || [];
  const linkMatches = html.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi) || [];

  const titleLength = titleMatch?.[1]?.trim().length ?? 0;
  const metaDescriptionLength = metaDescriptionMatch?.[1]?.trim().length ?? 0;
  const brokenLinks = linkMatches.filter((link) => {
    const href = link.match(/href=["']([^"']+)["']/i)?.[1];
    return !!href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:');
  }).length;
  const missingAltText = imgMatches.filter((img) => !/alt\s*=\s*['"][^'"]*['"]/i.test(img)).length;

  const issues: SeoAuditResult['issues'] = [];
  if (titleLength < 50 || titleLength > 60) {
    issues.push({ type: 'title', message: 'Title length should ideally be 50-60 characters.' });
  }
  if (metaDescriptionLength < 120 || metaDescriptionLength > 160) {
    issues.push({ type: 'meta', message: 'Meta description should be 120-160 characters.' });
  }
  if (headingMatches.length < 2) {
    issues.push({ type: 'headings', message: 'Add stronger heading structure.' });
  }
  if (brokenLinks > 0) {
    issues.push({ type: 'links', message: `Found ${brokenLinks} link(s) that may need review.` });
  }
  if (missingAltText > 0) {
    issues.push({ type: 'alt', message: `Add alt text to ${missingAltText} image(s).` });
  }

  const score = Math.max(40, 100 - issues.length * 12 - (titleLength > 80 ? 8 : 0));

  return {
    score,
    titleLength,
    metaDescriptionLength,
    headingCount: headingMatches.length,
    brokenLinks,
    missingAltText,
    issues,
  };
}
