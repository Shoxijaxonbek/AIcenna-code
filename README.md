# AIcenna — Ishga Tushirish

## Kerakli narsalar
- Node.js 18+
- Chrome yoki Edge (MediaPipe uchun)
- Kamera
- OpenAI API kalit → https://platform.openai.com/api-keys

## O'rnatish

```bash
# 1. Papkaga kiring
cd holomed

# 2. Kutubxonalarni o'rnating
npm install

# 3. .env.local fayl yarating
echo "VITE_OPENAI_KEY=sk-SIZNING_OPENAI_KALITINGIZ" > .env.local

# 4. Ishga tushiring
npm run dev
```

## Brauzerda oching
http://localhost:5173

---

## Yangi model qo'shish

1. `.glb` faylni `public/models/` ga joylashtiring
2. `src/config/models.js` ga yangi yozuv qo'shing:

```js
{
  id: 'heart',           // unique id
  label: 'Yurak',        // O'zbek nomi
  labelEn: 'Heart',
  file: '/models/heart.glb',
  icon: '❤️',
  scale: 2.0,
  position: [0, 0, 0],
  parts: {
    left_ventricle:  { label: 'Chap qorincha', color: 0xff4444 },
    right_ventricle: { label: 'O\'ng qorincha', color: 0xff6666 },
  },
  aiContext: "Bu yurak anatomiyasi modeli...",
}
```

Hammasi shu! Boshqa hech narsani o'zgartirish shart emas.

---

## Qo'l Harakatlari

| Harakat | Natija |
|---|---|
| ✋ Kaft yoying + harakatlaning | Aylantirish |
| ✊ Mushtlab harakatlaning | Aylantirish (aniq) |
| 🤏 Ikki barmoq yaqinlashsa | Zoom in |
| ☝️ Ko'rsatkich barmoq | Organ tanlash |
| 🔄 Ikkala kaft | Reset |

## Ovoz buyruqlari (O'zbek tilida)
- "Frontal lob nima vazifa bajaradi?"
- "Miyacha qayerda joylashgan?"
- "Yurak nechanchi marta uradi?"
