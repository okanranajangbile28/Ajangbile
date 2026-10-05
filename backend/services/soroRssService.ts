import Parser from 'rss-parser';
import BlogV2 from '../models/BlogV2';
import slugify from 'slugify';

const parser = new Parser();

const SORO_RSS_URL =
  'https://app.trysoro.com/api/rss/641157c5-282d-41e3-b101-d835aa85eae0';

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

    // Prevent duplicate imports
    const existing = await BlogV2.findOne({
      soroGuid: item.guid,
    });

    if (existing) {
      skipped++;
      continue;
    }

    const title = item.title?.trim() || 'Untitled Soro Article';

    const content =
      (item as any)['content:encoded'] ||
      item.content ||
      item.description ||
      '';

    const excerpt =
      item.contentSnippet?.trim() || item.description?.trim() || title;

    const image = (item as any).enclosure?.url || '';

    let slug = slugify(title, {
      lower: true,
      strict: true,
    });

    // Make sure the slug does not collide with an existing manual article
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
