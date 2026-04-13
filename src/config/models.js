// ═══════════════════════════════════════════════════════════════════════════════
// Ko'z modeli qism nomlari — GLB geometriya + texture tahlili asosida
// Har mesh uchun: hajm, verteks soni, texture rangi tahlil qilindi
// ═══════════════════════════════════════════════════════════════════════════════
export const EYE_MESH_NAMES = [

  // ── Meshes 0–3: defaultMat (#a46842, jigarrang) ──────────────────────────
  // Hajm: ~1.3×2.86×3.24, z_depth=5.02, KATTA → Bosh suyagi
  {
    name: "Kranium — O'ng tashqi",
    info: "Bosh suyagining o'ng tashqi qatlami. Frontal, parietal, temporal va sfenoid suyaklardan tashkil topgan. Ko'z orbita chetini hosil qiladi."
  },
  {
    name: "Kranium — O'ng ichki",
    info: "O'ng kranium ichki yuzasi. Miya pardasi (dura mater) shu yerga yopishgan. Kraniyal nervlar o'tuvchi teshiklarni o'z ichiga oladi."
  },
  {
    name: "Kranium — Chap tashqi",
    info: "Bosh suyagining chap tashqi qatlami. Ko'ruv kanalini (canalis opticus) va ustki orbital yoriqni o'z ichiga oladi."
  },
  {
    name: "Kranium — Chap ichki",
    info: "Chap kranium ichki yuzasi. Suyak qovurg'alari (orbital ridges) ko'zni mexanik ta'sirdan himoya qiladi."
  },

  // ── Mesh 4: mat1 (#c4b39a, teriga o'xshash) ─────────────────────────────
  // Hajm: JUDA KATTA (1.67×4.50×3.83), yarim shaffof → Orbital yog' to'qimasi
  {
    name: "Orbital Yog' To'qimasi",
    info: "Ko'z orbita kovagini to'ldirib turuvchi yog' to'qimasi. Ko'z olmasi va muskullarni orbital devordan ajratib, amortizator vazifasini bajaradi."
  },

  // ── Meshes 5–8: mat10 (#f9f9f9, deyarli oq, juda shaffof alpha=0.077) ──
  // Hajm: JUDA KICHIK (0.02–0.23), 65532 verteks, z_depth=6.77–6.79
  // Ko'z orqa qutbida joylashgan, yupqa va shaffof → Fotoretseptor qatlamlari
  {
    name: "Tayoqchalar Qatlami (Rod Layer)",
    info: "Retinaning tashqi yadroviy qatlami. ~120 million tayoqcha fotoreseptor mavjud. Kechasi va sust yorug'likda ko'rishni ta'minlaydi."
  },
  {
    name: "Konuscha Qatlami (Cone Layer)",
    info: "Markaziy retinaning konuscha fotoreseptorlari. ~7 million konuscha mavjud. Rang ajratish va aniq ko'rishni ta'minlaydi."
  },
  {
    name: "Retinal Pigment Epithelium (RPE)",
    info: "Fotoreseptorlarni qo'llab-quvvatlovchi pigmentli bir qatlam hujayralar. A vitamini metabolizmi va fotoreseptor tiklanishida ishtirok etadi."
  },
  {
    name: "Bruch Membranasi",
    info: "RPE va xoroid orasidagi 2–4 mkm qalinlikdagi membrana. Qon va to'r parda o'rtasida selektiv to'siq vazifasini bajaradi."
  },

  // ── Mesh 9: mat11 (#572c20, to'q jigarrang-qizil, 538 vert, z=6.82) ───
  // Eng chuqur pozitsiya, kichkina, to'q rang → Fovea Sentralis
  {
    name: "Fovea Sentralis",
    info: "Retinaning markaziy chuqurchasi (diametri 1.5 mm). Faqat konuscha fotoreseptorlar mavjud. Ko'rishning eng aniq nuqtasi — 20/20 ko'rish shu yerda."
  },

  // ── Mesh 10: mat12 (#6e4a2d, o'rta jigarrang, 515 vert, z=6.80) ────────
  {
    name: "Optik Disk (Ko'ruv Nervi Boshi)",
    info: "Ko'ruv nervi tolalari retinadan chiqadigan nuqta. Fotoreseptorlar yo'q, shuning uchun 'ko'r dog'' deyiladi. Diametri ~1.7 mm."
  },

  // ── Meshes 11–15: mat13 (#df0912, qip-qizil) ────────────────────────────
  // 65532 verteks × 5, hajm ~0.16×0.32×0.53, z=6.35–6.54 → Qon tomirlari
  {
    name: "Retinal Qon Tomiri Tarmog'i I",
    info: "Ko'z markaziy arteriyasining (arteria centralis retinae) birinchi darajali tarmoqlari. To'r pardaning ichki qatlamlarini oziqlantiradi."
  },
  {
    name: "Retinal Qon Tomiri Tarmog'i II",
    info: "Ikkinchi darajali retinal arteriya va venalar. Ustki va pastki temporal, burun tomirlari to'rini hosil qiladi."
  },
  {
    name: "Retinal Qon Tomiri Tarmog'i III",
    info: "Uchinchi darajali mayda kapillyar tarmoqlar. Retinaning tashqi yadroviy qatlamigacha yetib boradi."
  },
  {
    name: "Xoroidal Qon Tomiri Tarmog'i",
    info: "Xoroidni (ko'z tomirli pardasini) oziqlantiradigan qisqa posterior siliar arteriyalar. Retinal yog' asidlari sintezida muhim rol o'ynaydi."
  },
  {
    name: "Venoz Drenaj Tizimi",
    info: "Ko'z markaziy venasi (vena centralis retinae) tarmoqlari. Qonni ko'z to'r pardasidan ophthalmic venaga olib chiqadi."
  },

  // ── Meshes 16–17: mat14 (#e1e27d, sariq-yashil, juft, yassi) ───────────
  // Hajm: 0.301×0.073×0.528, simmetrik chap/o'ng → Ko'z rektus muskullar
  {
    name: "Lateral Rektus Muskul",
    info: "Ko'zni tashqariga (abduktsiya) harakatlantiradi. VI (abducens) nervi tomonidan innervatsiya qilinadi. Uzunligi ~40 mm."
  },
  {
    name: "Medial Rektus Muskul",
    info: "Ko'zni ichkariga (adduktsiya) harakatlantiradi. III (okulomotor) nervi tomonidan innervatsiya qilinadi. Eng kuchli ko'z muskuli."
  },

  // ── Mesh 18: mat4 (#d5bca8, pushti-beige, juda shaffof, ~0.5×0.5×0.5) ─
  {
    name: "Ko'z Gavhari (Crystalline Lens)",
    info: "Elastik bikonveks shaffof linza. Diametri ~10 mm, qalinligi 3.6–5 mm. Siliar muskullar orqali yaqin/uzoqni ko'rish (akkommodatsiya) ta'minlaydi."
  },

  // ── Mesh 19: mat5 (#d2bba6, beige, 5005 vert, sfera ~0.48) ────────────
  {
    name: "Ko'z Olmasi (Bulbus Oculi)",
    info: "Ko'zning tashqi himoya qopqog'i (sclera). Diametri ~24 mm, og'irligi ~7 g. Uch qavat devordan iborat: sklera, xoroid, retina."
  },

  // ── Mesh 20: mat6 (#c6b0a5, pushti, 925 vert, z=6.61) ──────────────────
  {
    name: "Siliar Jasad (Corpus Ciliare)",
    info: "Iris bilan xoroid o'rtasidagi tuzilma. Suv humor (aqueous humor) ishlab chiqaradi va zonular tolalar orqali linzani ushlab turadi."
  },

  // ── Mesh 21: mat7 (#af836e, jigarrang, 42155 vert — ENG KO'P) ──────────
  {
    name: "Shisha Tana (Corpus Vitreum)",
    info: "Ko'z bo'shlig'ining 80%ini to'ldiruvchi shaffof jele. Suv (99%), gialuron kislotasi va kollagen tolalardan iborat. Retinani joyida ushlab turadi."
  },

  // ── Mesh 22: mat8 (#e2e27b, SARIQ, 7643 vert) ───────────────────────────
  {
    name: "Ko'ruv Nervi (Nervus Opticus)",
    info: "~1.2 million asab tolasidan iborat II kranial nerv. Ko'zdan chiqqach, xiyazma optika (chiasma opticum) orqali miyaga signal uzatadi."
  },

  // ── Mesh 23: mat9 (#e1eef7, och ko'k-oq, 2008 vert, z=6.77) ────────────
  {
    name: "Sklera (Oq Parda)",
    info: "Ko'zning qattiq tashqi himoya qopqog'i (5/6 qismini egallaydi). Kollagen tolalari zichligidan oq rangda. Ko'z muskullarini biriktiradi."
  },
];

// ─── Haqiqiy texture ranglar (GLB dan ajratib olingan) ───────────────────────
// python3 tahlil natijalari: har material uchun texture dominant rangi
export const EYE_MESH_COLORS = [
  // 0-3: defaultMat — jigarrang (#a46842)
  0xa46842, 0xa46842, 0xa46842, 0xa46842,
  // 4: mat1 — teriga o'xshash beige (#c4b39a)
  0xc4b39a,
  // 5-8: mat10 — deyarli oq (#f9f9f9)
  0xf5f4f2, 0xf5f4f2, 0xf5f4f2, 0xf5f4f2,
  // 9: mat11 — to'q jigarrang-qizil (#572c20)
  0x572c20,
  // 10: mat12 — o'rta jigarrang (#6e4a2d)
  0x6e4a2d,
  // 11-15: mat13 — qip-qizil (#df0912)
  0xdf0912, 0xdf0912, 0xdf0912, 0xdf0912, 0xdf0912,
  // 16-17: mat14 — sariq-yashil (#e1e27d)
  0xe1e27d, 0xe1e27d,
  // 18: mat4 — pushti-beige (#d5bca8)
  0xd5bca8,
  // 19: mat5 — beige (#d2bba6)
  0xd2bba6,
  // 20: mat6 — pushti (#c6b0a5)
  0xc6b0a5,
  // 21: mat7 — jigarrang (#af836e)
  0xaf836e,
  // 22: mat8 — sariq (#e2e27b)
  0xe2e27b,
  // 23: mat9 — och ko'k-oq (#e1eef7)
  0xe1eef7,
];

export const MODELS = [
  {
    id: 'eye',
    label: "Ko'z anatomiyasi",
    labelEn: 'Eye Anatomy',
    file: '/models/eye.glb',
    icon: '👁',
    isProcedural: false,
    isExplodable: true,
    scale: 1.0,
    meshNames: EYE_MESH_NAMES,
    meshColors: EYE_MESH_COLORS,
    parts: {},
    aiContext: `Bu ko'z anatomiyasi modeli (24 qism):
Kranium (bosh suyagi, 4 qism), Orbital yog' to'qimasi,
Fotoretseptor qatlamlari (tayoqchalar, konuscha, RPE, Bruch membranasi),
Fovea sentralis, Optik disk, Retinal qon tomirlari (5 qism),
Lateral va medial rektus muskullar, Ko'z gavhari (linza),
Ko'z olmasi (bulbus oculi), Siliar jasad, Shisha tana (vitreus),
Ko'ruv nervi (n. opticus), Sklera.
Savollarga 2-3 gapda O'ZBEK TILIDA javob ber.`,
  },

  {
    id: 'upper_body',
    label: 'Yuqori Tana',
    labelEn: 'Upper Body',
    file: '/models/upper_body.glb',
    icon: '🫀',
    isProcedural: false,
    isExplodable: false,
    scale: 1.0,
    initialRotation: [0, 0, 0],
    meshNames: [
      {
        name: 'Yuqori Tana Anatomiyasi',
        info: "Inson tanasining yuqori qismi: bosh suyagi, miya, bo'yin, ko'krak qafasi, muskullar, yurak, o'pka va qon tomirlari.",
      },
    ],
    meshColors: null,
    parts: {},
    aiContext: "Bu 3D yuqori tana anatomiyasi modeli. Tarkibi: bosh suyagi, miya, bo'yin, ko'krak qafasi, o'mrov va yelka suyaklari, muskullar, yurak, o'pka, qon tomirlari. Savollarga 2-3 gapda O'ZBEK TILIDA javob ber.",
  },

  {
    id: 'brain',
    label: 'Miya 3D',
    labelEn: 'Brain 3D',
    file: '/models/brain.glb',
    icon: '🧠',
    isProcedural: false,
    isExplodable: false,
    scale: 1.0,
    initialRotation: [0, Math.PI, 0],
    meshNames: [
      {
        name: 'Miya (Encephalon)',
        info: "Markaziy asab tizimining asosiy organi. Og'irligi ~1400g, 86 milliard neyron. Fikrlash, xotira, harakat va barcha tana funksiyalarini boshqaradi.",
      },
    ],
    meshColors: null,
    parts: {},
    aiContext: "Bu 3D miya modeli. Asosiy qismlar: frontal lob (fikrlash), parietal (sezgi), temporal (xotira, nutq), oksipital (ko'rish), miyacha (muvozanat), miya poyasi (nafas, yurak). Savollarga 2-3 gapda O'ZBEK TILIDA javob ber.",
  },

  {
    id: 'heart',
    label: 'Yurak',
    labelEn: 'Heart',
    file: '/models/realistic_human_heart.glb',
    icon: '❤️',
    isProcedural: false,
    isExplodable: false,
    scale: 1.0,
    initialRotation: [0, 0, 0],
    meshNames: [
      {
        name: 'Yurak (Cor)',
        info: "Inson yuragining realistik 3D modeli. Qo'shaloq nasos — o'ng tomon o'pkaga, chap tomon butun tanaga qon yo'naltiradi. Og'irligi ~300g, minutiga 60-80 marta uradi.",
      },
    ],
    meshColors: null,
    parts: {},
    aiContext: "Bu realistik yurak (Cor) 3D modeli. 4 ta kamera: o'ng va chap bo'lmalar, o'ng va chap qorinchalar. Minutiga 60-80 marta uradi. Savollarga 2-3 gapda O'ZBEK TILIDA javob ber.",
  },
];

export const DEFAULT_MODEL_ID = 'eye';