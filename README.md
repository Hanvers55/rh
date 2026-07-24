# LP Screener

Web app untuk mengecek kelayakan token sebelum dijadikan liquidity pool (LP).
Tempel contract address (CA) → chart DexScreener otomatis muncul + checklist rules keamanan otomatis via GoPlus Security API + ringkasan AI (opsional).

## Fitur
- Auto-detect chain (EVM & Solana) dari CA yang ditempel
- Chart embed langsung dari DexScreener
- Checklist otomatis: contract verified, mint authority, ownership, honeypot, buy/sell tax, LP locked/burned, konsentrasi top holder, TVL, rasio volume/TVL
- Tabel top 10 holder
- Skor & verdict otomatis (Layak / Perlu Hati-hati / Berisiko Tinggi)
- Ringkasan naratif dari Claude (opsional, butuh API key sendiri)

## Cara Deploy ke Vercel

### Opsi 1 — via Vercel CLI (paling cepat)
```bash
npm install -g vercel
cd lp-screener
vercel
```
Ikuti instruksi di terminal (login, pilih scope, dst). Setelah selesai jalankan `vercel --prod` untuk deploy production.

### Opsi 2 — via GitHub
1. Push folder ini ke repo GitHub baru.
2. Buka https://vercel.com/new, import repo tersebut.
3. Klik Deploy (tidak perlu build command khusus, ini static site + serverless function).

## Mengaktifkan Ringkasan AI (opsional)
Fitur "Generate Ringkasan AI" memanggil `/api/analyze.js` yang menggunakan **Gemini 3.5 Flash API**. Tanpa langkah ini, fitur lain (chart + checklist + maskot) tetap jalan normal.

1. Buat API key di https://aistudio.google.com/apikey
2. Di dashboard Vercel: **Project → Settings → Environment Variables**
3. Tambahkan:
   - Name: `GEMINI_API_KEY`
   - Value: (api key kamu)
4. Redeploy project.

⚠️ **Jangan pernah** tempel API key langsung di file kode (`analyze.js`, `.env` yang ikut di-commit, dsb) — kalau project ini di-push ke repo publik, key kamu bisa langsung dicuri dan dipakai orang lain, kena tagihan ke akun Google Cloud/AI Studio kamu. Selalu lewat Environment Variables di dashboard Vercel.

## Sumber Data
- Market data & chart: [DexScreener public API](https://docs.dexscreener.com/api/reference) — gratis, tanpa API key
- Security scan: [GoPlus Security API](https://docs.gopluslabs.io/reference) — gratis, tanpa API key (ada rate limit wajar)

## Catatan Penting
- Ini bukan saran finansial / bukan jaminan keamanan token. Semua rules bisa "lolos" tapi token tetap bisa rug dengan cara lain (misal social engineering, dev dump di luar kontrak, dsb).
- GoPlus API punya rate limit publik — kalau sering kena error saat traffic tinggi, pertimbangkan daftar API key GoPlus sendiri.
- Selalu DYOR sebelum menyediakan likuiditas.
