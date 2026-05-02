const fs = require('fs');
const fetch = require('node-fetch');

async function upload() {
  const file = './test-land.json';
  if (!fs.existsSync(file)) {
    console.error('test-land.json not found');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(file, 'utf8'));

  const res = await fetch(process.env.BACKEND_URL || 'http://localhost:7000/api/lands/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const body = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', body);
}

upload().catch(err => {
  console.error(err);
  process.exit(1);
});
