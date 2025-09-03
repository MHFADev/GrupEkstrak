import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { whatsappUrlSchema, batchUrlSchema, type ExtractionResponse } from "@shared/schema";

function extractWhatsAppId(url: string): ExtractionResponse {
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

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Extract single URL
  app.post("/api/extract", async (req, res) => {
    try {
      const { url } = whatsappUrlSchema.parse(req.body);
      const result = extractWhatsAppId(url);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error instanceof z.ZodError ? error.errors[0].message : 'Invalid request'
      });
    }
  });
  
  // Extract batch URLs
  app.post("/api/extract-batch", async (req, res) => {
    try {
      const { urls } = batchUrlSchema.parse(req.body);
      const results = urls.map(url => extractWhatsAppId(url));
      
      const summary = {
        total: results.length,
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'error').length,
        groups: results.filter(r => r.urlType === 'group' && r.status === 'success').length,
        channels: results.filter(r => r.urlType === 'channel' && r.status === 'success').length,
      };
      
      res.json({
        results,
        summary
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error instanceof z.ZodError ? error.errors[0].message : 'Invalid request'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
