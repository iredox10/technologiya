import { articleService, categoryService, authorService } from './src/lib/appwriteServices';

async function testArticles() {
  console.log('🔍 Testing article fetching...\n');
  
  // Test fetching articles
  const articlesResult = await articleService.getArticles(1, 100);
  
  console.log('📊 Articles Result:', {
    success: articlesResult.success,
    error: articlesResult.error || 'none',
    totalDocuments: articlesResult.data?.total || 0,
    documentsReturned: articlesResult.data?.documents?.length || 0
  });
  
  if (articlesResult.success && articlesResult.data) {
    console.log('\n📰 Articles found:', articlesResult.data.total);
    
    if (articlesResult.data.documents && articlesResult.data.documents.length > 0) {
      console.log('\n📝 First article:');
      const firstArticle = articlesResult.data.documents[0];
      console.log({
        id: firstArticle.$id,
        title: firstArticle.title,
        status: firstArticle.status,
        slug: firstArticle.slug,
        featured: firstArticle.featured,
        categoryId: firstArticle.categoryId,
        authorId: firstArticle.authorId,
      });
    } else {
      console.log('\n⚠️  No articles found in the database!');
      console.log('💡 You need to create some articles in the admin dashboard.');
    }
  } else {
    console.log('\n❌ Failed to fetch articles:', articlesResult.error);
  }
  
  // Test categories
  console.log('\n\n🏷️  Testing categories...');
  const categoriesResult = await categoryService.getCategories();
  
  if (categoriesResult.success && categoriesResult.data) {
    console.log('Categories found:', categoriesResult.data.total);
    if (categoriesResult.data.documents?.length > 0) {
      console.log('Category names:', categoriesResult.data.documents.map((c: any) => c.name).join(', '));
    }
  }
  
  // Test authors
  console.log('\n\n👥 Testing authors...');
  const authorsResult = await authorService.getAuthors();
  
  if (authorsResult.success && authorsResult.data) {
    console.log('Authors found:', authorsResult.data.total);
    if (authorsResult.data.documents?.length > 0) {
      console.log('Author names:', authorsResult.data.documents.map((a: any) => a.name).join(', '));
    }
  }
}

testArticles().catch(console.error);
