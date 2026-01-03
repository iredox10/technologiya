import type { APIRoute } from 'astro';
import { shareToTelegram, shareToWhatsApp } from '../../lib/socialSharing';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, excerpt, slug, image, platforms } = body;

    if (!title || !slug) {
      return new Response(JSON.stringify({ error: 'Missing title or slug' }), { status: 400 });
    }

    const results: any = {};

    if (platforms.includes('telegram')) {
      results.telegram = await shareToTelegram({ title, excerpt, slug, image });
    }

    if (platforms.includes('whatsapp')) {
      results.whatsapp = await shareToWhatsApp({ title, excerpt, slug, image });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
