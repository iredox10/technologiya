import { articleService } from './src/lib/appwriteServices';
import type { Article } from './src/types';

async function checkSlugs() {
  console.log('Fetching articles...');
  let page = 1;
  let allArticles: Article[] = [];
  let hasMore = true;

  while (hasMore) {
    const result = await articleService.getArticles(page, 100);
    if (result.success && result.data) {
      const docs = result.data.documents as unknown as Article[];
      allArticles = [...allArticles, ...docs];
      if (docs.length < 100) hasMore = false;
      page++;
    } else {
      console.error('Failed to fetch:', result.error);
      hasMore = false;
    }
  }

  console.log(`Found ${allArticles.length} articles.`);
  console.log('--- SLUGS ---');
  allArticles.forEach(a => {
    console.log(`[${a.status}] ${a.slug}`);
  });
}

checkSlugs();
