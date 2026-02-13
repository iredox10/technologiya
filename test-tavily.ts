
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.TAVILY_API_KEY;

if (!apiKey) {
  console.error('❌ TAVILY_API_KEY not found in .env');
  process.exit(1);
}

console.log(`✅ Found TAVILY_API_KEY: ${apiKey.substring(0, 5)}...`);

async function testSearch() {
  console.log('Testing Tavily Search...');
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: "What is the latest news about GPT-5?",
        search_depth: "basic",
        include_answer: true,
        max_results: 3
      })
    });

    if (!response.ok) {
      console.error(`❌ API Request Failed: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error('Response:', text);
      return;
    }

    const data = await response.json();
    console.log('✅ Search Successful!');
    console.log('--- Answer ---');
    console.log(data.answer);
    console.log('--- Results ---');
    data.results.forEach((r, i) => {
      console.log(`[${i+1}] ${r.title} (${r.url})`);
    });

  } catch (error) {
    console.error('❌ Network Error:', error);
  }
}

testSearch();
