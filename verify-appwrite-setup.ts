/**
 * Appwrite Setup Verification Script
 * Run this to verify your Appwrite configuration is correct
 * 
 * Usage: bun run verify-appwrite-setup.ts
 */

import { client, account, APPWRITE_CONFIG } from './src/lib/appwrite';

async function verifySetup() {
  console.log('\n🔍 Verifying Appwrite Setup...\n');
  
  // Check Environment Variables
  console.log('📋 Environment Variables:');
  console.log('✓ Endpoint:', APPWRITE_CONFIG.endpoint);
  console.log('✓ Project ID:', APPWRITE_CONFIG.projectId || '❌ MISSING');
  console.log('✓ Database ID:', APPWRITE_CONFIG.databaseId || '❌ MISSING');
  
  console.log('\n📚 Collections:');
  console.log('  Articles:', APPWRITE_CONFIG.collections.articles || '❌ MISSING');
  console.log('  Categories:', APPWRITE_CONFIG.collections.categories || '❌ MISSING');
  console.log('  Authors:', APPWRITE_CONFIG.collections.authors || '❌ MISSING');
  console.log('  Comments:', APPWRITE_CONFIG.collections.comments || '❌ MISSING');
  console.log('  Users:', APPWRITE_CONFIG.collections.users || '❌ MISSING');
  
  console.log('\n🗄️ Storage Buckets:');
  console.log('  Article Images:', APPWRITE_CONFIG.buckets.articleImages || '❌ MISSING');
  console.log('  Author Avatars:', APPWRITE_CONFIG.buckets.authorAvatars || '❌ MISSING');
  
  // Check missing values
  const missing = [];
  if (!APPWRITE_CONFIG.projectId) missing.push('PROJECT_ID');
  if (!APPWRITE_CONFIG.databaseId) missing.push('DATABASE_ID');
  if (!APPWRITE_CONFIG.collections.articles) missing.push('COLLECTION_ARTICLES');
  if (!APPWRITE_CONFIG.collections.categories) missing.push('COLLECTION_CATEGORIES');
  if (!APPWRITE_CONFIG.collections.authors) missing.push('COLLECTION_AUTHORS');
  if (!APPWRITE_CONFIG.collections.comments) missing.push('COLLECTION_COMMENTS');
  if (!APPWRITE_CONFIG.collections.users) missing.push('COLLECTION_USERS');
  if (!APPWRITE_CONFIG.buckets.articleImages) missing.push('BUCKET_ARTICLE_IMAGES');
  if (!APPWRITE_CONFIG.buckets.authorAvatars) missing.push('BUCKET_AUTHOR_AVATARS');
  
  if (missing.length > 0) {
    console.log('\n⚠️  Missing Configuration:');
    missing.forEach(item => console.log(`   - PUBLIC_APPWRITE_${item}`));
    console.log('\n📝 Please update your .env file with these values from Appwrite Console');
    return false;
  }
  
  // Test Connection
  console.log('\n🔌 Testing Connection...');
  try {
    const health = await account.get();
    console.log('✅ Connected! Logged in as:', health.email);
    return true;
  } catch (error: any) {
    if (error.code === 401) {
      console.log('⚠️  Connection successful but not logged in (this is expected)');
      console.log('✅ Appwrite configuration is correct!');
      return true;
    }
    console.log('❌ Connection failed:', error.message);
    console.log('\n💡 Make sure your Project ID is correct in .env file');
    return false;
  }
}

verifySetup().then(success => {
  if (success) {
    console.log('\n✅ Setup verification complete!');
    console.log('\n📌 Next Steps:');
    console.log('   1. Make sure you have created all collections in Appwrite Console');
    console.log('   2. Follow APPWRITE_SETUP.md for detailed schema');
    console.log('   3. Create an admin user and author document');
    console.log('   4. Start integrating authentication into components\n');
  } else {
    console.log('\n❌ Setup incomplete. Please fix the issues above.\n');
  }
  process.exit(success ? 0 : 1);
});
