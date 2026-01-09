#!/usr/bin/env node
// Simple HTTP test

import http from 'http';

const testData = JSON.stringify({
  message: 'What documents do I need for land verification?',
  conversationHistory: []
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/chat',
  method: 'POST',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

console.log('📤 Sending test request to http://localhost:5000/api/chat');
console.log('Request body:', testData);
console.log('---\n');

const req = http.request(options, (res) => {
  console.log(`📥 Response Status: ${res.statusCode}`);
  console.log('Response Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
    console.log(`📦 Received ${chunk.length} bytes`);
  });
  
  res.on('end', () => {
    console.log('\n✅ Response complete!\n');
    try {
      const json = JSON.parse(data);
      if (json.reply) {
        console.log('🤖 AI Response:');
        console.log('─'.repeat(80));
        console.log(json.reply);
        console.log('─'.repeat(80));
      } else {
        console.log('Full response:', json);
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('timeout', () => {
  console.error('❌ Request timeout after 30 seconds');
  req.destroy();
  process.exit(1);
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

console.log('⏳ Waiting for response...\n');
req.write(testData);
req.end();
