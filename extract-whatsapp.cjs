#!/usr/bin/env node

/**
 * WhatsApp URL Extractor - Node.js Script
 * Ekstrak ID dari URL WhatsApp Group dan Channel
 */

function extractWhatsAppId(url) {
  try {
    const urlObj = new URL(url);
    
    // WhatsApp Group patterns
    if (urlObj.hostname === 'chat.whatsapp.com') {
      const pathParts = urlObj.pathname.split('/');
      const groupId = pathParts[1];
      if (groupId && groupId.length > 0) {
        return {
          originalUrl: url,
          rawId: groupId,
          whatsappId: groupId + '@g.us',
          type: 'group',
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
          rawId: groupId,
          whatsappId: groupId + '@g.us',
          type: 'group',
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
          rawId: channelId,
          whatsappId: channelId + '@newsletter',
          type: 'channel',
          status: 'success'
        };
      }
    }
    
    return {
      originalUrl: url,
      rawId: null,
      whatsappId: null,
      type: 'unknown',
      status: 'error',
      errorMessage: 'URL bukan link WhatsApp group atau channel yang valid'
    };
    
  } catch (error) {
    return {
      originalUrl: url,
      rawId: null,
      whatsappId: null,
      type: 'unknown',
      status: 'error',
      errorMessage: 'Format URL tidak valid'
    };
  }
}

function processUrls(urls) {
  const results = [];
  
  for (const url of urls) {
    const result = extractWhatsAppId(url.trim());
    results.push(result);
  }
  
  return results;
}

function displayResults(results) {
  console.log('\n=== HASIL EKSTRAKSI WHATSAPP ID ===\n');
  
  let successCount = 0;
  let groupCount = 0;
  let channelCount = 0;
  
  results.forEach((result, index) => {
    console.log(`[${index + 1}] ${result.originalUrl}`);
    
    if (result.status === 'success') {
      successCount++;
      if (result.type === 'group') groupCount++;
      if (result.type === 'channel') channelCount++;
      
      console.log(`    ✅ ${result.type === 'group' ? 'GROUP' : 'CHANNEL'}`);
      console.log(`    📋 Raw ID: ${result.rawId}`);
      console.log(`    📱 WhatsApp ID: ${result.whatsappId}`);
    } else {
      console.log(`    ❌ ERROR: ${result.errorMessage}`);
    }
    console.log('');
  });
  
  console.log('=== RINGKASAN ===');
  console.log(`Total URL: ${results.length}`);
  console.log(`Berhasil: ${successCount}`);
  console.log(`Grup: ${groupCount}`);
  console.log(`Channel: ${channelCount}`);
  console.log(`Gagal: ${results.length - successCount}`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('WhatsApp URL Extractor');
    console.log('=====================');
    console.log('');
    console.log('Cara pakai:');
    console.log('  node extract-whatsapp.cjs <URL1> [URL2] [URL3] ...');
    console.log('');
    console.log('Contoh:');
    console.log('  node extract-whatsapp.cjs https://chat.whatsapp.com/ABC123');
    console.log('  node extract-whatsapp.cjs https://whatsapp.com/channel/XYZ456');
    console.log('');
    console.log('Format yang didukung:');
    console.log('  - https://chat.whatsapp.com/[GROUP_ID]');
    console.log('  - https://whatsapp.com/invite/[GROUP_ID]');
    console.log('  - https://whatsapp.com/channel/[CHANNEL_ID]');
    console.log('  - https://www.whatsapp.com/channel/[CHANNEL_ID]');
    console.log('');
    console.log('Opsi tambahan:');
    console.log('  --export    Simpan hasil ke file JSON');
    return;
  }
  
  const results = processUrls(args.filter(arg => !arg.startsWith('--')));
  displayResults(results);
  
  // Export hasil ke file JSON jika ada flag --export
  if (process.argv.includes('--export')) {
    const fs = require('fs');
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `whatsapp-results-${timestamp}.json`;
    
    const exportData = results.map(r => ({
      url: r.originalUrl,
      rawId: r.rawId,
      whatsappId: r.whatsappId,
      type: r.type,
      status: r.status,
      error: r.errorMessage
    }));
    
    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
    console.log(`\n📁 Hasil diekspor ke: ${filename}`);
  }
}

// Jalankan script jika dipanggil langsung
if (require.main === module) {
  main();
}

module.exports = { extractWhatsAppId, processUrls };