/**
 * Create Admin User Script
 * This script will create an admin user in your Appwrite project
 * 
 * Run: bun run create-admin.ts
 */

import { Client, Account, Databases, ID } from 'appwrite';

// Configuration from your .env
const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68f4bbc30029d695034f';
const DATABASE_ID = '68f4bc1500083bd17364';
const AUTHORS_COLLECTION_ID = 'authors'; // Update if you have a different ID

// Admin credentials
const ADMIN_EMAIL = 'admin@technologiya.com';
const ADMIN_PASSWORD = 'Admin123!'; // Change this to your preferred password
const ADMIN_NAME = 'Admin User';

async function createAdminUser() {
  console.log('🚀 Starting admin user creation...\n');

  // Initialize client
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

  const account = new Account(client);
  const databases = new Databases(client);

  try {
    // Step 1: Create authentication user
    console.log('📝 Step 1: Creating authentication user...');
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    
    const userId = ID.unique();
    console.log('   Generated User ID:', userId);

    const user = await account.create(
      userId,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_NAME
    );

    console.log('✅ Auth user created successfully!');
    console.log('   User ID:', user.$id);
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);

    // Step 2: Create session to interact with database
    console.log('\n📝 Step 2: Creating session...');
    const session = await account.createEmailPasswordSession(
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );
    console.log('✅ Session created!');

    // Step 3: Create author document
    console.log('\n📝 Step 3: Creating author document...');
    const authorDoc = await databases.createDocument(
      DATABASE_ID,
      AUTHORS_COLLECTION_ID,
      ID.unique(),
      {
        userId: user.$id,
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        bio: 'Main Administrator of Technologiya',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(ADMIN_NAME)}`,
        role: 'admin',
        status: 'active',
        articleCount: 0
      }
    );

    console.log('✅ Author document created!');
    console.log('   Document ID:', authorDoc.$id);

    // Clean up session
    await account.deleteSession('current');

    console.log('\n🎉 SUCCESS! Admin user created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('\n👉 Go to http://localhost:4321/login and use these credentials!\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 409) {
      console.log('\n💡 User already exists! Try these solutions:');
      console.log('   1. Delete the existing user in Appwrite Console → Auth');
      console.log('   2. Or try logging in with:', ADMIN_EMAIL, '/', ADMIN_PASSWORD);
      console.log('   3. Or change the email in this script and run again');
    } else if (error.code === 401) {
      console.log('\n💡 Authentication failed. Check your PROJECT_ID in this script.');
    } else if (error.code === 404) {
      console.log('\n💡 Collection not found. Make sure you have created the "authors" collection in Appwrite.');
      console.log('   Update AUTHORS_COLLECTION_ID in this script with your actual collection ID.');
    } else {
      console.log('\n💡 Full error:', error);
    }
    
    process.exit(1);
  }
}

// Run the script
createAdminUser();
