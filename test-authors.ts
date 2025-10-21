import { Client, Databases } from 'appwrite';

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '');

async function testAuthors() {
  try {
    console.log('Testing Appwrite connection...');
    console.log('Endpoint:', process.env.PUBLIC_APPWRITE_ENDPOINT);
    console.log('Project ID:', process.env.PUBLIC_APPWRITE_PROJECT_ID);
    console.log('Database ID:', process.env.PUBLIC_APPWRITE_DATABASE_ID);
    console.log('Authors Collection ID:', process.env.PUBLIC_APPWRITE_COLLECTION_AUTHORS);

    const databaseId = process.env.PUBLIC_APPWRITE_DATABASE_ID || '';
    const authorsCollectionId = process.env.PUBLIC_APPWRITE_COLLECTION_AUTHORS || '';

    if (authorsCollectionId === 'authors') {
      console.error('\n❌ Collection ID is still a placeholder string!');
      console.log('\nYou need to:');
      console.log('1. Go to Appwrite Console → Databases');
      console.log('2. Create a collection named "authors"');
      console.log('3. Copy the collection ID');
      console.log('4. Update .env with: PUBLIC_APPWRITE_COLLECTION_AUTHORS="<actual-id>"');
      return;
    }

    console.log('\nFetching authors...');
    const response = await databases.listDocuments(databaseId, authorsCollectionId);
    
    console.log('✅ Success! Found', response.documents.length, 'authors');
    console.log('Authors:', response.documents);
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 404) {
      console.log('\nThe collection does not exist yet.');
      console.log('Follow SETUP_COLLECTIONS.md to create it.');
    }
  }
}

testAuthors();
