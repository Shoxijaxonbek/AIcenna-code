// ═══════════════════════════════════════════════════════════════════════
// AIcenna — Savollar banki
// highlightMesh: 'mesh_N' → ko'z modelida o'sha qism yonib turadi
// ═══════════════════════════════════════════════════════════════════════

export const QUESTIONS = [

  // ─── KO'Z (eye) — 22 savol, har birida highlightMesh ────────────────
  // mesh indekslari: 0-3 Kranium, 4 Orbital yog', 5 Tayoqcha, 6 Konuscha,
  // 7 RPE, 8 Bruch, 9 Fovea, 10 Optik disk, 11-15 Qon tomirlari,
  // 16 Lateral rektus, 17 Medial rektus, 18 Gavhar, 19 Bulbus, 20 Siliar,
  // 21 Vitreus, 22 Ko'ruv nervi, 23 Sklera
  {
    id: 1, modelId: 'eye', highlightMesh: 'mesh_19',
    q: "Ko'z olmasining (Bulbus Oculi) o'rtacha diametri qancha?",
    options: ["12 mm", "24 mm", "36 mm", "48 mm"],
    answer: 1,
    explanation: "Ko'z olmasi o'rtacha 24 mm diametrga va ~7 gramm og'irlikka ega."
  },
  {
    id: 2, modelId: 'eye', highlightMesh: 'mesh_5',
    q: "Retinada taxminan nechta tayoqcha (rod) fotoreseptor mavjud?",
    options: ["1 million", "7 million", "120 million", "500 million"],
    answer: 2,
    explanation: "Retinada ~120 million tayoqcha (rod) va ~7 million konuscha (cone) fotoreseptor mavjud."
  },
  {
    id: 3, modelId: 'eye', highlightMesh: 'mesh_9',
    q: "Fovea sentralis qaysi xususiyati bilan ajralib turadi?",
    options: [
      "Eng ko'p tayoqchalar joylashgan joy",
      "Ko'r dog' hosil bo'ladigan joy",
      "Faqat konuschalar bo'lgan, eng aniq ko'rish nuqtasi",
      "Yog' to'qimasi to'ldirilgan bo'shliq"
    ],
    answer: 2,
    explanation: "Fovea sentralis faqat konuscha fotoreseptorlardan iborat va 20/20 aniqlikda ko'rish ta'minlaydigan markaziy nuqta."
  },
  {
    id: 4, modelId: 'eye', highlightMesh: 'mesh_21',
    q: "Ko'z bo'shlig'ining taxminan 80%ini qaysi tuzilma to'ldiradi?",
    options: ["Suv humor (Aqueous humor)", "Ko'z gavhari (Linza)", "Shisha tana (Corpus Vitreum)", "Xoroid"],
    answer: 2,
    explanation: "Shisha tana (vitreus) ko'z bo'shlig'ining 80%ini to'ldiruvchi shaffof jele."
  },
  {
    id: 5, modelId: 'eye', highlightMesh: 'mesh_16',
    q: "VI (Abducens) kranial nervi qaysi ko'z muskulini innervatsiya qiladi?",
    options: ["Medial rektus muskul", "Lateral rektus muskul", "Ustki to'g'ri muskul", "Pastki qiya muskul"],
    answer: 1,
    explanation: "VI (abducens) nervi lateral rektus muskulni boshqaradi — ko'zni tashqariga (abduktsiya) harakatlantiradi."
  },
  {
    id: 6, modelId: 'eye', highlightMesh: 'mesh_10',
    q: "Optik disk (Ko'ruv nervi boshi) qanday nom bilan ham ataladi?",
    options: ["Fovea sentralis", "Makulya", "Ko'r dog'", "Retinal pigment epiteliy"],
    answer: 2,
    explanation: "Optik diskda fotoreseptorlar yo'qligi sababli bu yerda ko'rish bo'lmaydi — shuning uchun 'ko'r dog'' deyiladi."
  },
  {
    id: 7, modelId: 'eye', highlightMesh: 'mesh_20',
    q: "Siliar jasad (Corpus Ciliare) qanday suyuqlik ishlab chiqaradi?",
    options: ["Vitreus (shisha tana jeli)", "Suv humor (Aqueous humor)", "Yog' moylari", "Lakrimal suyuqlik"],
    answer: 1,
    explanation: "Siliar jasad aqueous humor ishlab chiqaradi — ko'z ichki bosimini (IOP) tartibga soladi."
  },
  {
    id: 8, modelId: 'eye', highlightMesh: 'mesh_18',
    q: "Ko'z akkommodatsiyasi (yaqin/uzoq ko'rish moslashuvi) qaysi tuzilma orqali amalga oshadi?",
    options: ["Sklera", "Ko'z gavhari (Crystalline Lens)", "Retina", "Xoroid"],
    answer: 1,
    explanation: "Elastik bikonveks ko'z gavhari siliar muskullar orqali shakl o'zgartirib akkommodatsiyani ta'minlaydi."
  },
  {
    id: 9, modelId: 'eye', highlightMesh: 'mesh_23',
    q: "Sklera ko'z yuzasining qancha qismini egallaydi?",
    options: ["1/2", "2/3", "5/6", "to'liq ko'z"],
    answer: 2,
    explanation: "Sklera ko'zning 5/6 qismini egallaydi; qolgan 1/6 oldingi qismi shaffof kornea."
  },
  {
    id: 10, modelId: 'eye', highlightMesh: 'mesh_22',
    q: "Ko'ruv nervida (Nervus Opticus) taxminan nechta asab tolasi mavjud?",
    options: ["100 ming", "500 ming", "1.2 million", "10 million"],
    answer: 2,
    explanation: "Ko'ruv nervi ~1.2 million asab tolasidan iborat II kranial nerv hisoblanadi."
  },
  {
    id: 11, modelId: 'eye', highlightMesh: 'mesh_7',
    q: "Retinal Pigment Epiteliy (RPE) qaysi vitamin metabolizmida qatnashadi?",
    options: ["C vitamini", "D vitamini", "A vitamini", "B12 vitamini"],
    answer: 2,
    explanation: "RPE A vitamini (retinol) metabolizmida qatnashadi va fotoreseptorlarning tiklanishida muhim rol o'ynaydi."
  },
  {
    id: 12, modelId: 'eye', highlightMesh: 'mesh_4',
    q: "Orbital yog' to'qimasi qanday vazifani bajaradi?",
    options: [
      "Ko'z muskullarini harakatlantiradi",
      "Ko'z olmasini amortizatsiya qiladi va orbital devordan ajratadi",
      "Suv humor ishlab chiqaradi",
      "Retinani oziqlantradi"
    ],
    answer: 1,
    explanation: "Orbital yog' to'qimasi ko'z olmasiga yumshoq asos bo'lib, mexanik ta'sirlardan himoya qiladi."
  },
  {
    id: 13, modelId: 'eye', highlightMesh: 'mesh_6',
    q: "Konuscha (Cone) fotoreseptorlar qanday asosiy funksiyani bajaradi?",
    options: [
      "Kechasi va sust yorug'likda ko'rish",
      "Ko'z bosimini tartibga solish",
      "Rang ajratish va kunduzi aniq ko'rish",
      "Ko'z harakatini ta'minlash"
    ],
    answer: 2,
    explanation: "~7 million konuscha fotoreseptorlar rang ajratish va yorug' sharoitda aniq ko'rishni ta'minlaydi."
  },
  {
    id: 14, modelId: 'eye', highlightMesh: 'mesh_17',
    q: "Medial rektus muskul ko'zni qaysi yo'nalishda harakatlantiradi?",
    options: ["Tashqariga (abduktsiya)", "Ichkariga (adduktsiya)", "Yuqoriga", "Pastga"],
    answer: 1,
    explanation: "Medial rektus muskul ko'zni ichkariga (adduktsiya) harakatlantiradi va III (okulomotor) nervi tomonidan innervatsiya qilinadi."
  },
  {
    id: 15, modelId: 'eye', highlightMesh: 'mesh_8',
    q: "Bruch membranasi qayerda joylashgan va funksiyasi nima?",
    options: [
      "Ko'z gavhari va vitreus o'rtasida — linzani ushlab turadi",
      "RPE va xoroid o'rtasida — selektiv to'siq vazifasini bajaradi",
      "Sklera va kornea o'rtasida — himoya qiladi",
      "Siliar jasad va iris o'rtasida — aqueous hosil qiladi"
    ],
    answer: 1,
    explanation: "Bruch membranasi RPE va xoroid orasidagi 2–4 mkm qalinlikdagi membrana bo'lib, selektiv to'siq vazifasini bajaradi."
  },
  {
    id: 16, modelId: 'eye', highlightMesh: 'mesh_11',
    q: "Ko'z markaziy arteriyasi (arteria centralis retinae) qaysi to'qimani oziqlantirada?",
    options: ["Ko'z gavharini", "Retinaning ichki qatlamlarini", "Shisha tanani", "Sklerani"],
    answer: 1,
    explanation: "Ko'z markaziy arteriyasi optik disk orqali kirib retinaning ichki qatlamlarini oziqlantiradigan asosiy qon tomidir."
  },
  {
    id: 17, modelId: 'eye', highlightMesh: 'mesh_0',
    q: "Frontal, parietal, temporal va sfenoid suyaklardan tashkil topgan tuzilma qaysi?",
    options: ["Ko'z olmasi", "Orbital yog' to'qimasi", "Kranium (Bosh suyagi)", "Siliar jasad"],
    answer: 2,
    explanation: "Kranium bir nechta suyaklardan tashkil topadi: frontal, parietal, temporal, sfenoid — ko'z orbitasini hosil qiladi."
  },
  {
    id: 18, modelId: 'eye', highlightMesh: 'mesh_9',
    q: "Fovea sentralisning diametri taxminan qancha?",
    options: ["0.1 mm", "1.5 mm", "5 mm", "10 mm"],
    answer: 1,
    explanation: "Fovea sentralisning diametri ~1.5 mm bo'lib, inson ko'rishining eng aniq nuqtasi hisoblanadi."
  },
  {
    id: 19, modelId: 'eye', highlightMesh: 'mesh_22',
    q: "Ko'ruv nervi (Nervus Opticus) qaysi kranial nerv hisoblanadi?",
    options: ["I kranial nerv", "II kranial nerv", "III kranial nerv", "VI kranial nerv"],
    answer: 1,
    explanation: "Ko'ruv nervi II (ikkinchi) kranial nervdir. Retinadan optik xiyazma orqali miyaga vizual axborot uzatadi."
  },
  {
    id: 20, modelId: 'eye', highlightMesh: 'mesh_21',
    q: "Shisha tana (Corpus Vitreum) asosan nimadan iborat?",
    options: [
      "Qon plazmasi va eritrotsitlar",
      "Suv (99%), gialuron kislotasi va kollagen tolalar",
      "Yog' hujayralari va fibroblastlar",
      "Keratin va elastin oqsillari"
    ],
    answer: 1,
    explanation: "Shisha tana 99% suv, gialuron kislotasi va kollagen tolalardan iborat shaffof jele — retinani joyida ushlab turadi."
  },
  {
    id: 21, modelId: 'eye', highlightMesh: 'mesh_18',
    q: "Ko'z gavharining (Crystalline Lens) o'lchamlari qancha?",
    options: ["Diametri ~3 mm, qalinligi 15 mm", "Diametri ~10 mm, qalinligi 3.6–5 mm", "Diametri ~20 mm, qalinligi 1 mm", "Diametri ~5 mm, qalinligi 8 mm"],
    answer: 1,
    explanation: "Ko'z gavhari ~10 mm diametrga va 3.6–5 mm qalinlikka ega elastik bikonveks shaffof linzadir."
  },
  {
    id: 22, modelId: 'eye', highlightMesh: 'mesh_23',
    q: "Sklera nimadan yasalgan va nima uchun oq rangda?",
    options: [
      "Melanin pigmenti sababli",
      "Zich kollagen tolalari sababli",
      "Elastin oqsili sababli",
      "Suv va shaffof minerallar sababli"
    ],
    answer: 1,
    explanation: "Sklera zich kollagen tolalari to'qimasidan iborat — bu tolalarning tartibliligi nurni qaytarib oq rang beradi."
  },

  // ─── MIYA (brain) — 10 savol ─────────────────────────────────────────
  {
    id: 23, modelId: 'brain',
    q: "Inson miyasining o'rtacha og'irligi qancha?",
    options: ["800 gramm", "1400 gramm", "2000 gramm", "600 gramm"],
    answer: 1,
    explanation: "Inson miyasi o'rtacha ~1400 gramm (1.3–1.5 kg orasida) og'irlikka ega."
  },
  {
    id: 24, modelId: 'brain',
    q: "Inson miyasida taxminan nechta neyron mavjud?",
    options: ["1 milliard", "10 milliard", "86 milliard", "1 trillion"],
    answer: 2,
    explanation: "So'nggi tadqiqotlarga ko'ra inson miyasida ~86 milliard neyron mavjud."
  },
  {
    id: 25, modelId: 'brain',
    q: "Mantiqiy fikrlash, qaror qabul qilish va shaxsiyat uchun qaysi lob mas'ul?",
    options: ["Oksipital lob", "Parietal lob", "Frontal lob", "Temporal lob"],
    answer: 2,
    explanation: "Frontal lob (peshona bo'lagi) oliy fikrlash, ijodiy va ijtimoiy xulq-atvori boshqaradi."
  },
  {
    id: 26, modelId: 'brain',
    q: "Ko'ruv ma'lumotlarini qayta ishlovchi markaziy lob qaysi?",
    options: ["Frontal lob", "Temporal lob", "Parietal lob", "Oksipital lob"],
    answer: 3,
    explanation: "Oksipital lob (ensa bo'lagi) ko'ruv korteksini o'z ichiga oladi va vizual axborotni qayta ishlaydi."
  },
  {
    id: 27, modelId: 'brain',
    q: "Muvozanat, harakat koordinatsiyasi va nozik motorikani qaysi qism boshqaradi?",
    options: ["Gipokamp", "Amigdala", "Miyacha (Cerebellum)", "Talamus"],
    answer: 2,
    explanation: "Miyacha harakat koordinatsiyasi, muvozanat va nozik motorikani tartibga soladi."
  },
  {
    id: 28, modelId: 'brain',
    q: "Nafas olish va yurak ritmini qaysi miya tuzilmasi asosiy tartibga soladi?",
    options: ["Miya yarim korteksi", "Miya poyasi (Brainstem)", "Miyacha", "Gipofiz"],
    answer: 1,
    explanation: "Miya poyasi hayotiy funksiyalar — nafas, yurak urishi va qon bosimini boshqaradi."
  },
  {
    id: 29, modelId: 'brain',
    q: "Nutq markazi (Broca markazi) qaysi lobda joylashgan?",
    options: ["Parietal lob", "Temporal lob", "Frontal lob", "Oksipital lob"],
    answer: 2,
    explanation: "Broca markazi chap frontal lobning pastki qismida joylashgan va nutqni ishlab chiqarish uchun mas'ul."
  },
  {
    id: 30, modelId: 'brain',
    q: "Gipokamp (Hippocampus) asosan qaysi funksiya uchun muhim?",
    options: ["Ko'rish", "Xotira shakllantirish va yo'nalish", "Hidlash", "Eshitish"],
    answer: 1,
    explanation: "Gipokamp yangi xotiralarni shakllantirishda va fazoviy yo'nalishda muhim rol o'ynaydi."
  },
  {
    id: 31, modelId: 'brain',
    q: "Miya chap va o'ng yarim sharlarini birlashtiruvchi asosiy tuzilma?",
    options: ["Talamus", "Gipotalamus", "Corpus Callosum", "Pons"],
    answer: 2,
    explanation: "Corpus callosum 200-250 million asab tolasidan iborat va ikkala yarim sharni bog'laydi."
  },
  {
    id: 32, modelId: 'brain',
    q: "Sezgi ma'lumotlarini (teri sezgisi, og'riq) birlamchi qayta ishlovchi lob qaysi?",
    options: ["Frontal lob", "Temporal lob", "Parietal lob", "Oksipital lob"],
    answer: 2,
    explanation: "Parietal lob somatosensor korteksni o'z ichiga oladi — teri sezgisi, og'riq, harorat qayta ishlanadi."
  },

  // ─── YURAK (heart) — 10 savol ─────────────────────────────────────────
  {
    id: 33, modelId: 'heart',
    q: "Sog'lom inson yuragi minutiga o'rtacha necha marta uradi?",
    options: ["30–50", "60–100", "110–130", "150–180"],
    answer: 1,
    explanation: "Normal dam olish holatida yurakning urish chastotasi 60–100 marta/min (o'rtacha ~72)."
  },
  {
    id: 34, modelId: 'heart',
    q: "Yurakning o'rtacha og'irligi qancha?",
    options: ["~100 gramm", "~300 gramm", "~600 gramm", "~1 kilogramm"],
    answer: 1,
    explanation: "Inson yuragi o'rtacha ~250–350 gramm (erkaklar ~300 g, ayollar ~250 g)."
  },
  {
    id: 35, modelId: 'heart',
    q: "Yurakning nechta kamerasi (bo'shlig'i) mavjud?",
    options: ["2 ta", "3 ta", "4 ta", "6 ta"],
    answer: 2,
    explanation: "Yurak 4 ta kameradan iborat: o'ng bo'lma, o'ng qorincha, chap bo'lma, chap qorincha."
  },
  {
    id: 36, modelId: 'heart',
    q: "O'ng qorincha qonga qayerga yo'naltiradi?",
    options: ["Butun tanaga", "O'pkaga", "Miyaga", "Jigar va buyraklarga"],
    answer: 1,
    explanation: "O'ng qorincha o'pkaga venoz qon yuboradi (kichik qon aylanish doirasi)."
  },
  {
    id: 37, modelId: 'heart',
    q: "Chap qorincha devori nima uchun boshqa kameralardan qalinroq?",
    options: [
      "Ichida ko'proq qon saqlaydi",
      "Butun tana bo'ylab yuqori bosimda qon haydashi kerak",
      "Ko'p qon tomirlarga ulangan",
      "Aksincha, o'ng qorincha qalinroq"
    ],
    answer: 1,
    explanation: "Chap qorincha butun katta qon aylanish doirasi uchun yuqori bosim yaratishi sababli devori eng qalin."
  },
  {
    id: 38, modelId: 'heart',
    q: "Aorta qaysi yurak kamerasidan chiqadi?",
    options: ["O'ng bo'lma", "O'ng qorincha", "Chap bo'lma", "Chap qorincha"],
    answer: 3,
    explanation: "Aorta — eng yirik arteriya — chap qorinchadan chiqib butun tanaga oksigenlangan qon yetkazadi."
  },
  {
    id: 39, modelId: 'heart',
    q: "Sinoatrial (SA) tugun qanday rol o'ynaydi?",
    options: [
      "Yurak qopqoqlarini boshqaradi",
      "Yurak ritmini belgilaydigan asosiy elektr импулс generatori",
      "Qon bosimini o'lchaydi",
      "O'pkadan qon qabul qiladi"
    ],
    answer: 1,
    explanation: "SA tugun o'ng bo'lmada joylashgan va 'yurak peysmekeri' vazifasini bajarib elektr impulslari yaratadi."
  },
  {
    id: 40, modelId: 'heart',
    q: "Koronar arteriyalar qanday vazifani bajaradi?",
    options: [
      "Miyaga qon olib boradi",
      "O'pkani oziqlantradi",
      "Yurak muskulini (miokardni) oziqlantradi",
      "Buyraklarni oziqlantradi"
    ],
    answer: 2,
    explanation: "Koronar arteriyalar bevosita yurak mushagini oksigen va ozuqa bilan ta'minlaydi."
  },
  {
    id: 41, modelId: 'heart',
    q: "Miokard infarkti ('yurak xurujи') nima?",
    options: [
      "Yurak ritmining buzilishi",
      "Yurak qopqog'ining shikastlanishi",
      "Koronar arteriya tiqilib qon oqimi to'xtashi natijasida yurak muskulining o'lishi",
      "Yurak bo'shlig'iga suyuqlik to'planishi"
    ],
    answer: 2,
    explanation: "Miokard infarkti — koronar arteriya ateroskleroz yoki trombus bilan to'silib, yurak muskuliga qon bormasligi."
  },
  {
    id: 42, modelId: 'heart',
    q: "Yurakning qaysi qopqog'i chap bo'lma va chap qorincha o'rtasida joylashgan?",
    options: ["Trikuspidal qopqoq", "Mitral (ikki bargli) qopqoq", "Aortal qopqoq", "O'pka qopqog'i"],
    answer: 1,
    explanation: "Mitral (bikuspidal) qopqoq chap bo'lma va chap qorincha orasini ajratadi."
  },

  // ─── YUQORI TANA (upper_body) — 10 savol ─────────────────────────────
  {
    id: 43, modelId: 'upper_body',
    q: "Ko'krak qafasida nechta qovurg'a juftligi mavjud?",
    options: ["8 juft (16 ta)", "10 juft (20 ta)", "12 juft (24 ta)", "14 juft (28 ta)"],
    answer: 2,
    explanation: "Inson ko'krak qafasida 12 juft (jami 24 ta) qovurg'a mavjud."
  },
  {
    id: 44, modelId: 'upper_body',
    q: "O'pka nechta lobdan iborat (o'ng va chap)?",
    options: ["O'ng 2, chap 2", "O'ng 3, chap 2", "O'ng 3, chap 3", "O'ng 2, chap 3"],
    answer: 1,
    explanation: "O'ng o'pka 3 lob (yuqori, o'rta, pastki), chap o'pka 2 lobdan (yuqori, pastki) iborat."
  },
  {
    id: 45, modelId: 'upper_body',
    q: "Diafragma qanday asosiy funksiyani bajaradi?",
    options: [
      "Ovqat hazm qilishda ishtirok etadi",
      "Nafas olishdagi asosiy harakatlanuvchi mushak",
      "Qon ishlab chiqaradi",
      "Yurakni qo'llabturadi"
    ],
    answer: 1,
    explanation: "Diafragma nafas olishning asosiy mushagi: qisqarganda ko'krak bo'shlig'i kengayib nafas kiradi."
  },
  {
    id: 46, modelId: 'upper_body',
    q: "Karotid arteriya qayerda joylashgan va qanday vazifasi bor?",
    options: [
      "Qo'l bilak sohasida — qo'l qonini ta'minlaydi",
      "Bo'yinda — miyaga va boshga asosiy qon oqimini ta'minlaydi",
      "Ko'krakda — yurakni oziqlantradi",
      "Qovurg'a orasida — o'pkani oziqlantradi"
    ],
    answer: 1,
    explanation: "Karotid arteriyalar bo'yin tomirlarining asosiysi bo'lib, miyaga ~80% qon olib boradi."
  },
  {
    id: 47, modelId: 'upper_body',
    q: "Plevra nima?",
    options: [
      "O'pkani o'rab turuvchi ikki qavatli seroz parda",
      "Bronxlarning ichki qoplag'ichi",
      "Ko'krak qafasi muskullaridan biri",
      "Qon plazmasi qatlami"
    ],
    answer: 0,
    explanation: "Plevra o'pkani o'rab turuvchi ikki qavatli seroz parda: visseral va parietal qatlamlardan iborat."
  },
  {
    id: 48, modelId: 'upper_body',
    q: "Trapetsiya (trapezius) mushagi qayerda joylashgan?",
    options: [
      "Qorin sohasida",
      "Ko'krak old yuzasida",
      "Yelka-bo'yin-orqa sohasida",
      "Qo'l tirsak sohasida"
    ],
    answer: 2,
    explanation: "Trapetsiya mushagi yelka-bo'yin-orqa sohasini egallaydi — yelkani ko'tarish va yelka pichog'ini harakatlantiradi."
  },
  {
    id: 49, modelId: 'upper_body',
    q: "Timus bezi qayerda joylashgan va qanday funksiyasi bor?",
    options: [
      "Qorin bo'shlig'ida — ferment ishlab chiqaradi",
      "Ko'krak qafasida (mediastinum) — T-limfotsitlarni yetiltirishda ishtirok etadi",
      "Bo'yinda — qalqonsimon gormon ishlab chiqaradi",
      "Jigar yonida — safro ishlab chiqaradi"
    ],
    answer: 1,
    explanation: "Timus bezi ko'krak qafasining oldingi mediastinumida joylashgan va immunitet T-hujayralarini yetiltirishda muhim."
  },
  {
    id: 50, modelId: 'upper_body',
    q: "Sternoklavikular bo'g'im qaysi suyaklar orasida joylashgan?",
    options: [
      "To'sh suyagi (sternum) va o'mrov suyagi (clavicula)",
      "Qovurg'a va umurtqa pog'onasi",
      "O'mrov suyagi va yelka suyagi",
      "Kurak suyagi va yelka suyagi"
    ],
    answer: 0,
    explanation: "Sternoklavikular bo'g'im to'sh suyagi (sternum) va o'mrov suyagi (clavicula) o'rtasidagi yagona yuqori ekstremite bo'g'imi."
  },
  {
    id: 51, modelId: 'upper_body',
    q: "Bronxlar qaysi organlarning ichiga kirib boradi?",
    options: ["Yurak", "O'pka", "Oshqozon", "Jigar"],
    answer: 1,
    explanation: "Traxeyadan ikkilanib chiquvchi bronxlar mos ravishda o'ng va chap o'pkaga kiradi."
  },
  {
    id: 52, modelId: 'upper_body',
    q: "Ko'krak limfatik kanali (Thoracic duct) qanday vazifani bajaradi?",
    options: [
      "Aortadan qon olib boradi",
      "Pastki tana limfasini qon aylanishiga qaytaradi",
      "O'pkalarga havo yetkazadi",
      "Ko'krak qafasini himoya qiladi"
    ],
    answer: 1,
    explanation: "Ko'krak limfatik kanali limfa tizimining eng yirik tomiri — pastki tana limfasini qon aylanishiga qaytaradi."
  },
];

// Tasodifiy 10 ta savol tanlash
export function getRandomQuestions(count = 10) {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
