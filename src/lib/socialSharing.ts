export interface ShareParams {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
}

export async function shareToTelegram(params: ShareParams) {
  const token = import.meta.env.TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID;
  
  if (!token || !chatId) {
    console.warn('Telegram sharing skipped: Bot token or Chat ID not configured');
    return { success: false, error: 'Telegram not configured' };
  }

  const baseUrl = (import.meta.env.SITE_URL?.replace(/\/$/, '') || 'https://technologiyaa.netlify.app');
  const articleUrl = `${baseUrl}/articles/${params.slug}`;
  
  // Use Zero-Width Space trick to make link "invisible" but trigger preview
  const message = `<a href="${articleUrl}">&#8203;</a>`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const body: any = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return { success: result.ok, data: result };
  } catch (error: any) {
    console.error('Error sharing to Telegram:', error);
    return { success: false, error: error.message };
  }
}

export async function shareToWhatsApp(params: ShareParams) {
  const apiUrl = import.meta.env.WHATSAPP_API_URL;
  const apiKey = import.meta.env.WHATSAPP_API_KEY;
  
  if (!apiUrl || !apiKey) {
    console.warn('WhatsApp sharing skipped: API URL or Key not configured');
    return { success: false, error: 'WhatsApp not configured' };
  }

  const baseUrl = (import.meta.env.SITE_URL?.replace(/\/$/, '') || 'https://technologiyaa.netlify.app');
  const articleUrl = `${baseUrl}/articles/${params.slug}`;
  
  // Note: WhatsApp formatting varies by provider. 
  const message = `${articleUrl}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        message: message,
        image: params.image,
        // Add other provider-specific fields here
      }),
    });

    return { success: response.ok };
  } catch (error: any) {
    console.error('Error sharing to WhatsApp:', error);
    return { success: false, error: error.message };
  }
}
