// Simple test script to test the AI API
import http from 'http';

const testMessage = "What documents do I need for land verification?";

const data = JSON.stringify({
  message: testMessage,
  conversationHistory: []
});

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('\n🚀 Testing AI Chat API...');
console.log(`📤 Sending message: "${testMessage}"\n`);

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log(`✅ Response Status: ${res.statusCode}\n`);
    try {
      const json = JSON.parse(responseData);
      console.log('📥 AI Response:');
      console.log('━'.repeat(80));
      console.log(json.reply);
      console.log('━'.repeat(80));
      console.log('\n✅ API TEST PASSED!\n');
    } catch (e) {
      console.log('❌ Error parsing JSON:', e.message);
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Error: ${e.message}`);
  console.error('Make sure the server is running on http://127.0.0.1:5000');
});

req.write(data);
req.end();
