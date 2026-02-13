
import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

config();

const getEnv = (key: string): string | undefined => {
  return import.meta.env[key] || process.env[key];
};

const GOOGLE_API_KEY = getEnv('GOOGLE_API_KEY') || '';
const TAVILY_API_KEY = getEnv('TAVILY_API_KEY') || '';
const OPENROUTER_API_KEY = getEnv('OPENROUTER_API_KEY');
const GITHUB_TOKEN = getEnv('GITHUB_TOKEN');

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

import * as cheerio from 'cheerio';

async function searchWeb(query: string, apiKey: string) {
  const urlMatch = query.match(/(https?:\/\/[^\s]+)/);
  const targetUrl = urlMatch ? urlMatch[0] : null;

  let scrapedContent = '';

  if (targetUrl) {
    console.log(`[Search] URL detected in query: "${targetUrl}". Attempting to scrape...`);
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        
        $('script, style, nav, footer, header, aside, .ads, .sidebar, .cookie-banner').remove();
        
        const title = $('title').text().trim();
        const contentParts: string[] = [];
        
        $('body').find('h1, h2, h3, p, li, article, section').each((_, el) => {
          const text = $(el).text().trim().replace(/\s+/g, ' ');
          if (text.length > 20) {
            contentParts.push(text);
          }
        });

        const textContent = contentParts.join('\n\n');
        const truncatedContent = textContent.slice(0, 15000);

        console.log(`[Search] Scraped URL successfully. Title: ${title}`);
        scrapedContent = `\nSOURCE URL: ${targetUrl}\nPAGE TITLE: ${title}\nPAGE CONTENT:\n${truncatedContent}\n----------------\n`;
      } else {
        console.warn(`[Search] Failed to fetch URL: ${response.status}`);
      }
    } catch (error) {
      console.error('[Search] Scraping error:', error);
    }
  }

  const cleanQuery = targetUrl ? query.replace(targetUrl, '').trim() : query;
  const searchQuery = cleanQuery.length > 5 ? cleanQuery : (targetUrl ? `review and details of ${targetUrl}` : query);

  console.log(`[Search] Starting Tavily search for: "${searchQuery}"`);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: searchQuery,
        search_depth: "advanced",
        include_answer: true,
        max_results: 5,
        topic: "news"
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn('[Search] Tavily request failed:', await response.text());
      return null;
    }

    const data = await response.json();
    console.log(`[Search] Found ${data.results?.length || 0} results.`);
    
    const tavilyResults = data.results.map((r: any) => `Title: ${r.title}\nDate: ${r.published_date || 'Recent'}\nContent: ${r.content}\nURL: ${r.url}`).join('\n---\n');

    return {
      answer: data.answer,
      results: (scrapedContent ? scrapedContent + '\n\nADDITIONAL SEARCH RESULTS:\n' : '') + tavilyResults
    };
  } catch (error) {
    console.error('[Search] Error:', error);
    if (scrapedContent) {
      return {
        answer: 'Content scraped directly from source URL.',
        results: scrapedContent
      };
    }
    return null;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { topic, tone, length, provider, language, useSearch, sourceUrl, model } = await request.json();

    console.log(`[Generate] Request received. Topic: "${topic}", Provider: ${provider}, Search: ${useSearch}, SourceURL: ${sourceUrl}`);
    console.log(`[Generate] TAVILY_API_KEY loaded: ${!!TAVILY_API_KEY}, length: ${TAVILY_API_KEY?.length || 0}`);

    if (!topic) {
      return new Response(JSON.stringify({ success: false, error: 'Topic is required' }), { status: 400 });
    }

    let searchContext = "";
    
    if (sourceUrl) {
      console.log(`[Generate] Using explicit source: ${sourceUrl}`);
      const sourceResult = await searchWeb(sourceUrl, TAVILY_API_KEY);
      
      if (sourceResult) {
        searchContext = `
        \n\n=== EXPLICIT SOURCE MATERIAL ===
        The user has provided a specific source for this article. You MUST base the article primarily on this information.
        
        SOURCE SUMMARY/CONTENT: ${sourceResult.answer || 'N/A'}
        
        DETAILED CONTENT:
        ${sourceResult.results}
        
        INSTRUCTIONS:
        1. Use the content above as the primary source of truth.
        2. If it is a specific URL, write a review or summary based on its actual content.
        ==============================
        `;
      }
    } 
    else if (useSearch) {
      if (TAVILY_API_KEY) {
        console.log('[Generate] Starting web search with Tavily...');
        const searchResult = await searchWeb(topic, TAVILY_API_KEY);
        if (searchResult) {
          searchContext = `
          \n\n=== REAL-TIME NEWS CONTEXT ===
          The following information is retrieved from a live web search. Use it to ensure the article is accurate and up-to-date.
          
          AI SUMMARY: ${searchResult.answer || 'N/A'}
          
          SEARCH RESULTS:
          ${searchResult.results}
          
          INSTRUCTIONS:
          1. Integrate this news naturally into the article.
          2. Cite specific facts or figures if available in the source.
          3. Ignore results that seem irrelevant to the specific topic.
          ==============================
          `;
        }
      } else {
        console.warn('[Generate] Search requested but TAVILY_API_KEY is missing.');
      }
    }

    const systemPrompt = `
      You are an expert tech journalist and blogger for "Technologiya", a leading tech news platform in Hausa language.
      ${searchContext}

      Structure the article with:
      1. A catchy Headline (H1)
      2. An engaging Introduction (Referencing current events if search context provided)
      3. Well-organized Body paragraphs with Subheadings (H2, H3)
      4. Code blocks if relevant
      5. Bullet points for readability
      6. A solid Conclusion

      Output Format:
      Return ONLY a valid JSON object with the following fields:
      - title: (string) The article title in Hausa
      - excerpt: (string) A short summary (150-160 chars)
      - content: (string) The full blog post body in Markdown
      - tags: (array of strings) 5-8 relevant tags
      - seoTitle: (string) Optimized title
      - seoDescription: (string) Optimized meta description
      - imagePrompt: (string) English prompt for cover image

      Ensure the Hausa is natural, modern, and grammatically correct.
    `;

    let generatedData;

    if (!provider || provider === 'gemini') {
      if (!GOOGLE_API_KEY) {
         throw new Error('Google API Key is missing. Please set GOOGLE_API_KEY in .env');
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash"
      });
      
      try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        });
        generatedData = JSON.parse(result.response.text());
      } catch (geminiError: any) {
        console.warn('Gemini 2.0 Flash failed, trying gemini-2.5-flash...', geminiError.message);
        
        const fallbackModel = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash" 
        });

        const fallbackResult = await fallbackModel.generateContent({
          contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\nIMPORTANT: Output strictly valid JSON only. Do not wrap in markdown code blocks." }] }]
        });
        
        const text = fallbackResult.response.text();
        const jsonText = text.replace(/```json\n?|\n?```/g, '').trim();
        generatedData = JSON.parse(jsonText);
      }
    } 
    else if (provider === 'openrouter') {
      if (!OPENROUTER_API_KEY) throw new Error('OpenRouter API Key is missing');

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-001",
          "messages": [
            { "role": "system", "content": "You are a helpful assistant that outputs JSON." },
            { "role": "user", "content": systemPrompt }
          ],
          "response_format": { "type": "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${await response.text()}`);
      }

      const result = await response.json();
      generatedData = JSON.parse(result.choices[0].message.content);
    }
    else if (provider === 'github') {
      if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is missing in .env');

      const selectedModel = model || 'gpt-4o';
      console.log(`[Generate] Using GitHub model: ${selectedModel}`);

      const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": selectedModel,
          "messages": [
            { "role": "system", "content": "You are a helpful assistant that outputs JSON." },
            { "role": "user", "content": systemPrompt }
          ],
          "response_format": { "type": "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`GitHub Models API Error: ${await response.text()}`);
      }

      const result = await response.json();
      generatedData = JSON.parse(result.choices[0].message.content);
    }

    return new Response(JSON.stringify({ success: true, data: generatedData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message || 'Unknown error' }), { status: 500 });
  }
}
