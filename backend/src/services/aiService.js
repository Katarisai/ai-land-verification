const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(messages, model = 'gpt-4o', max_tokens = 600) {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens,
      temperature: 0.2,
    })
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`OpenAI error: ${res.status} ${res.statusText} - ${text}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return data;
}

// Build a concise context from the Land document
function buildLandPrompt(land) {
  const parts = [];
  parts.push(`Land ID: ${land.landId || 'N/A'}`);
  parts.push(`Survey Number: ${land.surveyNumber || 'N/A'}`);
  if (land.owner) parts.push(`Owner: ${land.owner.name || ''} (${land.owner.email || ''})`);
  if (land.location) parts.push(`Location: ${land.location.city || ''}, ${land.location.state || ''}`);
  if (land.property) parts.push(`Property: ${land.property.type || ''}, Area: ${land.property.area || ''} ${land.property.areaUnit || ''}, Price: ${land.property.price || ''}`);
  if (land.legal) parts.push(`Legal Status: ${land.legal.legalStatus || ''}, Ownership: ${land.legal.ownershipStatus || ''}`);

  if (Array.isArray(land.documents) && land.documents.length) {
    parts.push('Documents:');
    land.documents.slice(0,10).forEach((d, i) => {
      parts.push(`${i+1}. ${d.type || d.documentId || 'Document'} - ${d.fileName || ''} - status: ${d.status || ''}`);
    });
  }

  return parts.join('\n');
}

async function analyzeLand(land) {
  const prompt = `You are a land verification assistant. Read the land information below and:
1) Produce a short AI summary (2-4 sentences) labeled as SUMMARY
2) Produce a detailed chat context that can be used by a chatbot for answering user questions, labeled as CHAT_CONTEXT
3) If possible, identify any immediate risk flags or missing critical info as a JSON array labeled RISKS

Land information:\n\n${buildLandPrompt(land)}`;

  const messages = [
    { role: 'system', content: 'You are a helpful assistant that summarizes land property records and extracts a chat-friendly context.' },
    { role: 'user', content: prompt }
  ];

  const data = await callOpenAI(messages, process.env.OPENAI_MODEL || 'gpt-4o', 800);
  const text = data.choices?.[0]?.message?.content || '';

  // Try to split sections by labels SUMMARY / CHAT_CONTEXT / RISKS
  const summaryMatch = text.match(/SUMMARY\s*[:\-]*\s*([\s\S]*?)((CHAT_CONTEXT|RISKS)|$)/i);
  const chatMatch = text.match(/CHAT_CONTEXT\s*[:\-]*\s*([\s\S]*?)((RISKS)|$)/i);
  const risksMatch = text.match(/RISKS\s*[:\-]*\s*([\s\S]*?)$/i);

  const aiSummary = summaryMatch ? summaryMatch[1].trim() : (text.split('\n').slice(0,3).join(' ').trim());
  const chatContext = chatMatch ? chatMatch[1].trim() : text.trim();
  let risks = [];
  if (risksMatch) {
    try { risks = JSON.parse(risksMatch[1]); } catch (e) { risks = [risksMatch[1].trim()]; }
  }

  return { aiSummary, chatContext, risks, raw: text, usage: data.usage || {} };
}

module.exports = { analyzeLand };
