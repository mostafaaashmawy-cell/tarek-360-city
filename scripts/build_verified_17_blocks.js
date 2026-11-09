const fs = require('fs');

const rawHulls = JSON.parse(fs.readFileSync('scripts/convex_hull_blocks.json'));

// Filter out cluster 14 (duplicate of cluster 15 for blue block)
const list = rawHulls.filter(c => c.id !== 'cluster_14');

// We have 17 blocks. Let's map each to its sector, name, specs, category, and color.
const blocks = [
  // Sector 1: North / North-East
  {
    hullIdx: 0, // cluster 1: yellow
    id: 'block_yellow_east_corner',
    nameAr: 'البلوك الأصفر - فلل الركن الشرقي المرتفع',
    nameEn: 'East Corner Yellow Block - Executive Villas',
    category: 'standalone',
    unitType: 'فلل مستقلة فاخرة (البلوك الأصفر)',
    area: '450 م²',
    specs: '5 غرف نوم ماستر · مجلس خارجي · حديقة خاصة وتراس بانورامي',
    description: 'فلل الركن الشرقي المرتفع ذات الخصوصية والإطلالة الاستثنائية.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
  {
    hullIdx: 1, // cluster 2: green
    id: 'block_green_top',
    nameAr: 'البلوك الأخضر - فلل الرويال كورت الشمالية',
    nameEn: 'Royal Green Block - Prime Villas',
    category: 'standalone',
    unitType: 'فلل رويال كورت (البلوك الأخضر)',
    area: '430 م²',
    specs: '4 غرف نوم ماستر · حديقة خلفية واسعة · مصعد داخلي',
    description: 'فلل ملكية راقية مجاورة للممر الأخضر الرئيسي في الشمال الشرقي.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
  {
    hullIdx: 2, // cluster 3: red
    id: 'block_red_top',
    nameAr: 'البلوك الأحمر - فلل القمة المستقلة',
    nameEn: 'Prime Red Block - Executive Villas',
    category: 'standalone',
    unitType: 'فلل القمة الفاخرة (البلوك الأحمر)',
    area: '480 م²',
    specs: '5 غرف نوم ماستر · إطلالة مفتوحة · مسبح خاص وتراس واسع',
    description: 'أرقى مجمع فلل مستقلة في الجهة الشمالية بتشطيبات ألترا لوكس.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
  {
    hullIdx: 3, // cluster 4: cyan
    id: 'block_cyan_east_mid',
    nameAr: 'البلوك السماوي - تاون هاوس الواحة الشرقية',
    nameEn: 'East Oasis Cyan Block - Townhouses',
    category: 'townhouse',
    unitType: 'تاون هاوس عصري (البلوك السماوي)',
    area: '340 م²',
    specs: '4 غرف نوم · تصميم ذكي مفتوح · روف جاردن وتراس علوي',
    description: 'تاون هاوس عصري مطل على الممرات المشجرة الداخلية بالجهة الشرقية.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=satk-masterplan',
  },
  {
    hullIdx: 4, // cluster 5: pink
    id: 'block_pink_center_north',
    nameAr: 'البلوك الوردي - عمائر وفلل النخيل المركزية',
    nameEn: 'Central Palms Pink Block - Luxury Residences',
    category: 'standalone',
    unitType: 'فلل وعمائر سكنية (البلوك الوردي)',
    area: '410 م²',
    specs: '4 غرف نوم ماستر · حديقة خاصة · بهو استقبال مزدوج',
    description: 'موقع استراتيجي وسط المشروع بقرب الحدائق والممشى الرياضي.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
  {
    hullIdx: 5, // cluster 6: yellow
    id: 'block_yellow_west_mid',
    nameAr: 'البلوك الأصفر الغربي - فلل الواحة الهادئة',
    nameEn: 'West Oasis Yellow Block - Private Villas',
    category: 'standalone',
    unitType: 'فلل الواحة المستقلة (البلوك الأصفر)',
    area: '380 م²',
    specs: '4 غرف نوم · حديقة محيطة واسعة · خصوصية تامة ومصعد',
    description: 'فلل مستقلة ذات خصوصية عالية في الجانب الغربي الهادئ من الكمباوند.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
  {
    hullIdx: 6, // cluster 7: green
    id: 'block_green_center',
    nameAr: 'البلوك الأخضر الأوسط - تاون هاوس الحديقة',
    nameEn: 'Central Garden Green Block',
    category: 'townhouse',
    unitType: 'تاون هاوس الحديقة (البلوك الأخضر)',
    area: '320 م²',
    specs: '3 غرف نوم + ملحق علوي · حديقة خاصة مطلة على المسطحات الخضراء',
    description: 'وحدات تاون هاوس بتصاميم مستدامة مع ممرات مشاة خضراء آمنة للأطفال.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=satk-masterplan',
  },
  {
    hullIdx: 7, // cluster 8: pink
    id: 'block_pink_east_mid',
    nameAr: 'البلوك الوردي الشرقي - فلل الماجستيك',
    nameEn: 'East Majestic Pink Block - Villas',
    category: 'standalone',
    unitType: 'فلل ماجستيك فاخرة (البلوك الوردي)',
    area: '420 م²',
    specs: '4 غرف نوم ماستر · غرفة سائق وخادمة · مسبح عائلي خاص',
    description: 'فلل أنيقة في القطاع الشرقي بتصميم معماري يحقق أقصى درجات الراحة.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
  {
    hullIdx: 8, // cluster 9: pink
    id: 'block_pink_west_center',
    nameAr: 'البلوك الوردي الغربي - تاون هاوس الغروب',
    nameEn: 'West Sunset Pink Block - Townhouses',
    category: 'townhouse',
    unitType: 'تاون هاوس عصري (البلوك الوردي)',
    area: '310 م²',
    specs: '3 غرف نوم · حديقة خلفية · مواقف مظللة لسيارتين',
    description: 'تاون هاوس راقي يوفر أسلوب حياة مريح وعصري للعائلات الشابة.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=satk-masterplan',
  },
  {
    hullIdx: 9, // cluster 10: yellow
    id: 'block_yellow_east_avenue',
    nameAr: 'البلوك الأصفر - فلل سنترال أفينيو الشرقية',
    nameEn: 'East Avenue Yellow Block - Signature Villas',
    category: 'standalone',
    unitType: 'فلل سنترال أفينيو (البلوك الأصفر)',
    area: '440 م²',
    specs: '4 غرف نوم ماستر · حديقة خاصة كبيرة · واجهات زجاجية واسعة',
    description: 'فلل مستقلة على شارع داخلي عريض مع سهولة الوصول للمرافق.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
  {
    hullIdx: 10, // cluster 11: cyan
    id: 'block_cyan_west_center',
    nameAr: 'البلوك السماوي الغربي - تاون هاوس جاردن فيو',
    nameEn: 'West Garden Cyan Block - Townhouses',
    category: 'townhouse',
    unitType: 'تاون هاوس جاردن فيو (البلوك السماوي)',
    area: '330 م²',
    specs: '3 غرف نوم + صالة عائلية علوية · حديقة خاصة وتراس',
    description: 'مجمع تاون هاوس متميز بالجهة الغربية بالقرب من الممشى الرياضي.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=satk-masterplan',
  },
  {
    hullIdx: 11, // cluster 12: cyan
    id: 'block_cyan_center',
    nameAr: 'البلوك السماوي الأوسط - فلل سنترال بارك',
    nameEn: 'Central Park Cyan Block - Villas',
    category: 'standalone',
    unitType: 'فلل سنترال بارك (البلوك السماوي)',
    area: '390 م²',
    specs: '4 غرف نوم · إطلالة على الحديقة الوسطية · مسبح وجلسة خارجية',
    description: 'فلل هادئة تتوسط المشروع بمحاذاة الحديقة المركزية والمرافق الترفيهية.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
  {
    hullIdx: 12, // cluster 13: yellow
    id: 'block_yellow_boulevard',
    nameAr: 'البلوك الأصفر - فلل البوليفارد الوسطية',
    nameEn: 'Boulevard Yellow Block - Luxury Villas',
    category: 'standalone',
    unitType: 'فلل بوليفارد فاخرة (البلوك الأصفر)',
    area: '430 م²',
    specs: '4 غرف نوم ماستر · بهو استقبال واسع · حديقة خاصة ومسبح',
    description: 'فلل الصف الثاني من البوليفارد تجمع بين الحيوية والهدوء العائلي.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
  {
    hullIdx: 13, // cluster 15: blue
    id: 'block_blue_amenities',
    nameAr: 'البلوك الأزرق - مجمع المرافق والفلل الفاخرة',
    nameEn: 'Boulevard Blue Block - Amenities & Premium Villas',
    category: 'amenities',
    unitType: 'فلل ومرافق البوليفارد (البلوك الأزرق)',
    area: '460 م²',
    specs: 'إطلالة مباشرة على البوليفارد · وصول سريع للكلوب هاوس والمرافق',
    description: 'بلوك مميز يجمع بين الفلل الفاخرة وأهم المرافق الخدمية والترفيهية.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev',
  },
  {
    hullIdx: 14, // cluster 16: pink
    id: 'block_pink_front_center',
    nameAr: 'البلوك الوردي الأمامي - فلل الواجهة الملكية',
    nameEn: 'Royal Frontline Pink Block - Signature Villas',
    category: 'standalone',
    unitType: 'فلل الواجهة الملكية (البلوك الوردي)',
    area: '500 م²',
    specs: '5 غرف نوم ماستر · إطلالة بانورامية على الشارع الرئيسي · حديقة محيطة ومسبح',
    description: 'أفخم فلل الصف الأمامي على الشارع الرئيسي بتصميم نجدي معاصر وتجهيزات متكاملة.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
  {
    hullIdx: 15, // cluster 17: pink
    id: 'block_pink_front_west',
    nameAr: 'البلوك الوردي الغربي الأمامي - فلل الواجهة',
    nameEn: 'Frontline West Pink Block - Executive Villas',
    category: 'standalone',
    unitType: 'فلل الصف الأمامي (البلوك الوردي)',
    area: '450 م²',
    specs: '4 غرف نوم · حديقة خاصة واسعة · غرفة سائق ومواقف مظللة',
    description: 'فلل مستقلة راقية على امتداد بوليفارد المشروع مع إطلالة مفتوحة.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
  {
    hullIdx: 16, // cluster 18: orange
    id: 'block_orange_front_center',
    nameAr: 'البلوك البرتقالي - فلل سنترال بوليفارد الأمامية',
    nameEn: 'Central Boulevard Orange Block - Prime Villas',
    category: 'standalone',
    unitType: 'فلل واجهة فاخرة (البلوك البرتقالي)',
    area: '470 م²',
    specs: '4 غرف نوم ماستر · بهو مزدوج الارتفاع · مواقف لـ 3 سيارات',
    description: 'فلل الواجهة الوسطى ذات المداخل الخاصة والواجهات الحجرية المعاصرة.',
    tourUrl: 'https://satk-360-city.mostafa-a-ashmawy.workers.dev?p=Villa-a1',
  },
];

const finalBlocks = blocks.map(b => {
  const hull = list[b.hullIdx];
  return {
    id: b.id,
    nameAr: b.nameAr,
    nameEn: b.nameEn,
    category: b.category,
    unitType: b.unitType,
    area: b.area,
    specs: b.specs,
    description: b.description,
    tourUrl: b.tourUrl,
    color: hull.hex,
    polygon: hull.polygon,
    center: hull.center
  };
});

fs.writeFileSync('scripts/final_17_blocks.json', JSON.stringify(finalBlocks, null, 2));
console.log('Saved 17 verified blocks to scripts/final_17_blocks.json');
