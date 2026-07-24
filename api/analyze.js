export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY belum diset di Environment Variables Vercel. Tambahkan di Project Settings > Environment Variables lalu redeploy. JANGAN tempel API key langsung di file kode.',
    });
  }

  const { pair, security, isSolana } = req.body || {};

  const prompt = `Kamu adalah analis risiko token crypto untuk keperluan liquidity providing (LP), bukan penasihat keuangan.
Berikut data on-chain & market yang sudah diambil otomatis (JSON):

Data pasar (DexScreener):
${JSON.stringify(pair, null, 2)}

Data keamanan kontrak (GoPlus Security, chain: ${isSolana ? 'Solana' : 'EVM'}):
${JSON.stringify(security, null, 2)}

Tulis ringkasan risiko dalam Bahasa Indonesia, maksimal 150 kata, dengan format:
1. Kesimpulan singkat 1 kalimat.
2. 2-3 red flag utama (jika ada) berdasarkan data di atas.
3. 2-3 hal positif (jika ada) berdasarkan data di atas.
Jangan menyarankan "beli" atau "jangan beli" secara langsung, cukup gambarkan tingkat risikonya secara objektif berdasarkan data yang diberikan. Jangan mengarang data yang tidak ada di JSON.`;

  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await r.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Gemini API error' });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n') ||
      'Tidak ada respons dari model.';

    return res.status(200).json({ summary: text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
