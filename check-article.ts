import { articleService } from './src/lib/appwriteServices';

const slug = 'qwen-vl-3-sabuwar-fasahar-ai-da-ke-iya-gani-da-karanta-rubutu-kamar-an-adam';

async function checkArticle() {
  console.log('Checking for article with slug:', slug);
  
  const result = await articleService.getArticles(1, 100);
  
  if (!result.success) {
    console.error('Failed to fetch articles:', result.error);
    return;
  }
  
  const articles = result.data.documents;
  console.log('Total articles fetched:', articles.length);
  
  const article = articles.find((a: any) => a.slug === slug);
  
  if (article) {
    console.log('✅ Article found!');
    console.log('Title:', article.title);
    console.log('Slug:', article.slug);
    console.log('Status:', article.status);
    console.log('Category ID:', article.categoryId);
    console.log('Author ID:', article.authorId);
  } else {
    console.log('❌ Article NOT found');
    console.log('\nAvailable article slugs:');
    articles.forEach((a: any, i: number) => {
      console.log(`${i + 1}. ${a.slug} (${a.status})`);
    });
  }
}

checkArticle().catch(console.error);
