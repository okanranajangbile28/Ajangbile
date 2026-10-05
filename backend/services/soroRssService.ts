import Parser from 'rss-parser';
import BlogV2 from '../models/BlogV2';
import slugify from 'slugify';

const parser = new Parser();

const SORO_RSS_URL =
  'https://app.trysoro.com/api/rss/641157c5-282d-41e3-b101-d835aa85eae0';

/**
 * Decode HTML entities that may have been escaped by the RSS source.
 *
 * Example:
 * &lt;p&gt;Hello&lt;/p&gt;
 *
 * becomes:
 * <p>Hello</p>
 */
const decodeHtmlEntities = (html: string): string => {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
};

/**
 * Clean and normalize HTML coming from Soro.
 *
 * This fixes links such as:
 *
 * href="[https://ajangbileheritage.com/consultation](https://ajangbileheritage.com/consultation)"
 *
 * into:
 *
 * href="https://ajangbileheritage.com/consultation"
 */
export const cleanSoroContent = (rawContent: string): string => {
  let content = rawContent || '';

  // Decode escaped HTML first.
  content = decodeHtmlEntities(content);

  // Fix Markdown-style URLs accidentally placed inside HTML href attributes.
  content = content.replace(
    /href=["']?\[([^\]]+)\]\((https?:\/\/[^)]+)\)["']?/gi,
    'href="$2"',
  );

  // Also fix relative URLs wrapped in Markdown syntax.
  content = content.replace(
    /href=["']?\[([^\]]+)\]\((\/[^)]+)\)["']?/gi,
    'href="$2"',
  );

  // Convert Markdown links that may exist directly inside the article.
  // Example:
  // [Consultation](https://ajangbileheritage.com/consultation)
  //
  // becomes:
  // <a href="https://ajangbileheritage.com/consultation">Consultation</a>
  content = content.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2">$1</a>',
  );

  // Convert relative Markdown links.
  content = content.replace(
    /\[([^\]]+)\]\((\/[^)]+)\)/g,
    '<a href="$2">$1</a>',
  );

  return content.trim();
};

export const syncSoroRss = async () => {
  console.log('🤖 Checking Soro RSS feed...');

  const feed = await parser.parseURL(SORO_RSS_URL);

  let imported = 0;
  let skipped = 0;

  for (const item of feed.items) {
    if (!item.guid) {
      console.log('⚠️ Skipping Soro article without GUID:', item.title);
      continue;
    }

    // Prevent duplicate imports.
    const existing = await BlogV2.findOne({
      soroGuid: item.guid,
    });

    if (existing) {
      skipped++;
      continue;
    }

    const title = item.title?.trim() || 'Untitled Soro Article';

    const rawContent =
      (item as any)['content:encoded'] ||
      item.content ||
      item.description ||
      '';

    // Clean the Soro HTML before saving it to MongoDB.
    const content = cleanSoroContent(rawContent);

    const excerpt =
      item.contentSnippet?.trim() || item.description?.trim() || title;

    // Soro normally provides the featured image through enclosure.
    // Fall back to media:content if necessary.
    const image =
      (item as any).enclosure?.url || (item as any)['media:content']?.url || '';

    let slug = slugify(title, {
      lower: true,
      strict: true,
    });

    // Make sure the slug does not collide with an existing manual article.
    const slugExists = await BlogV2.findOne({ slug });

    if (slugExists) {
      slug = `${slug}-${String(item.guid).slice(0, 8)}`;
    }

    await BlogV2.create({
      title,
      slug,
      excerpt: excerpt.substring(0, 300),
      content,
      category: 'Culture',
      coverImage: image,
      author: 'Ajangbile Heritage',
      featured: false,

      // IMPORTANT:
      // Soro articles enter your CMS as drafts.
      published: false,

      source: 'soro',
      soroGuid: item.guid,

      readingTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
    });

    imported++;

    console.log(`✅ Imported Soro article: ${title}`);
  }

  console.log(
    `🤖 Soro sync complete — Imported: ${imported}, Skipped: ${skipped}`,
  );

  return {
    imported,
    skipped,
  };
};
