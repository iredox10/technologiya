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

  const baseUrl = import.meta.env.SITE_URL || 'https://technologiya.netlify.app';
  const articleUrl = `${baseUrl}/articles/${params.slug}`;
  const footerText = "Daga Technologiya - Labaran Fasaha a Hausa";
  
  // Format message using Markdown
  const message = `*${params.title}*\n\n${params.excerpt}\n\n[Karanta Labarin anan](${articleUrl})\n\n_${footerText}_`;

  try {
    const url = `https://api.telegram.org/bot${token}/${params.image ? 'sendPhoto' : 'sendMessage'}`;
    const body: any = {
      chat_id: chatId,
      parse_mode: 'Markdown',
    };

    if (params.image) {
      body.photo = params.image;
      body.caption = message;
    } else {
      body.text = message;
    }

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

  const baseUrl = import.meta.env.SITE_URL || 'https://technologiya.netlify.app';
  const articleUrl = `${baseUrl}/articles/${params.slug}`;
  const footerText = "Daga Technologiya - Labaran Fasaha a Hausa";
  
  // Note: WhatsApp formatting varies by provider. 
  // This is a generic implementation.
  const message = `*${params.title}*\n\n${params.excerpt}\n\nKaranta cikakken labarin anan:\n${articleUrl}\n\n_${footerText}_`;

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
