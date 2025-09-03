import type { ExtractionResponse } from "@shared/schema";

export function extractWhatsAppId(url: string): ExtractionResponse {
  try {
    const urlObj = new URL(url);
    
    // WhatsApp Group patterns
    if (urlObj.hostname === 'chat.whatsapp.com') {
      const pathParts = urlObj.pathname.split('/');
      const groupId = pathParts[1];
      if (groupId && groupId.length > 0) {
        return {
          originalUrl: url,
          extractedId: groupId + '@g.us',
          rawId: groupId,
          whatsappId: groupId + '@g.us',
          urlType: 'group',
          status: 'success'
        };
      }
    }
    
    // Alternative group invite pattern
    if (urlObj.hostname === 'whatsapp.com' && urlObj.pathname.startsWith('/invite/')) {
      const groupId = urlObj.pathname.replace('/invite/', '');
      if (groupId && groupId.length > 0) {
        return {
          originalUrl: url,
          extractedId: groupId + '@g.us',
          rawId: groupId,
          whatsappId: groupId + '@g.us',
          urlType: 'group',
          status: 'success'
        };
      }
    }
    
    // WhatsApp Channel patterns
    if ((urlObj.hostname === 'whatsapp.com' || urlObj.hostname === 'www.whatsapp.com') && 
        urlObj.pathname.startsWith('/channel/')) {
      const channelId = urlObj.pathname.replace('/channel/', '');
      if (channelId && channelId.length > 0) {
        return {
          originalUrl: url,
          extractedId: channelId + '@newsletter',
          rawId: channelId,
          whatsappId: channelId + '@newsletter',
          urlType: 'channel',
          status: 'success'
        };
      }
    }
    
    // If we reach here, it's not a valid WhatsApp URL
    return {
      originalUrl: url,
      extractedId: null,
      rawId: null,
      whatsappId: null,
      urlType: 'unknown',
      status: 'error',
      errorMessage: 'This URL is not a valid WhatsApp group or channel link'
    };
    
  } catch (error) {
    return {
      originalUrl: url,
      extractedId: null,
      rawId: null,
      whatsappId: null,
      urlType: 'unknown',
      status: 'error',
      errorMessage: 'Invalid URL format'
    };
  }
}

export function isValidWhatsAppUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Check for valid WhatsApp domains and paths
    return (
      (urlObj.hostname === 'chat.whatsapp.com') ||
      (urlObj.hostname === 'whatsapp.com' && (urlObj.pathname.startsWith('/invite/') || urlObj.pathname.startsWith('/channel/'))) ||
      (urlObj.hostname === 'www.whatsapp.com' && urlObj.pathname.startsWith('/channel/'))
    );
  } catch {
    return false;
  }
}

export function parseMultipleUrls(text: string): string[] {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const urls: string[] = [];
  
  for (const line of lines) {
    try {
      new URL(line);
      urls.push(line);
    } catch {
      // Skip invalid URLs
      continue;
    }
  }
  
  return urls;
}
