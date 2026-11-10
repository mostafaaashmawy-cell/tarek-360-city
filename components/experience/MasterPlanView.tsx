'use client';

import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Compass,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  ExternalLink,
  Info,
} from 'lucide-react';
import TourEmbedModal from './TourEmbedModal';
import { soundManager } from './SoundManager';

export interface MasterPlanBlock {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'standalone' | 'townhouse' | 'amenities';
  unitType: string;
  area: string;
  specs: string;
  description: string;
  tourUrl: string;
  color: string;
  polygon: string; // SVG polygon points in 2752x1536 viewBox
  center: [number, number]; // Center coordinate [x, y] in 2752x1536
}

export const MASTERPLAN_BLOCKS_HD: MasterPlanBlock[] = [
  {
    id: 'block_yellow_east_corner',
    nameAr: 'البلوك الأصفر - فلل الركن الشرقي المرتفع',
    nameEn: 'East Corner Yellow Block - Executive Villas',
    category: 'standalone',
    unitType: 'فلل مستقلة فاخرة (البلوك الأصفر)',
    area: '450 م²',
    specs: '5 غرف نوم ماستر · مجلس خارجي · حديقة خاصة وتراس بانورامي',
    description: 'فلل الركن الشرقي المرتفع ذات الخصوصية والإطلالة الاستثنائية.',
    polygon: '2378,400 2456,308 2518,294 2580,310 2492,430',
    center: [2485, 348],
    color: '#eab308',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
  {
    id: 'block_green_top',
    nameAr: 'البلوك الأخضر - فلل الرويال كورت الشمالية',
    nameEn: 'Royal Green Block - Prime Villas',
    category: 'standalone',
    unitType: 'فلل رويال كورت (البلوك الأخضر)',
    area: '430 م²',
    specs: '4 غرف نوم ماستر · حديقة خلفية واسعة · مصعد داخلي',
    description: 'فلل ملكية راقية مجاورة للممر الأخضر الرئيسي في الشمال الشرقي.',
    polygon: '2080,326 2154,312 2346,302 2380,304 2384,316 2372,346 2328,390 2114,364',
    center: [2270, 333],
    color: '#22c55e',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
  {
    id: 'block_red_top',
    nameAr: 'البلوك الأحمر - فلل القمة المستقلة',
    nameEn: 'Prime Red Block - Executive Villas',
    category: 'standalone',
    unitType: 'فلل القمة الفاخرة (البلوك الأحمر)',
    area: '480 م²',
    specs: '5 غرف نوم ماستر · إطلالة مفتوحة · مسبح خاص وتراس واسع',
    description: 'أرقى مجمع فلل مستقلة في الجهة الشمالية بتشطيبات ألترا لوكس.',
    polygon: '1750,490 2008,318 2042,324 2092,354 2088,372 1868,542 1768,510',
    center: [1945, 416],
    color: '#ef4444',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
  {
    id: 'block_cyan_east_mid',
    nameAr: 'البلوك السماوي - تاون هاوس الواحة الشرقية',
    nameEn: 'East Oasis Cyan Block - Townhouses',
    category: 'townhouse',
    unitType: 'تاون هاوس عصري (البلوك السماوي)',
    area: '340 م²',
    specs: '4 غرف نوم · تصميم ذكي مفتوح · روف جاردن وتراس علوي',
    description: 'تاون هاوس عصري مطل على الممرات المشجرة الداخلية بالجهة الشرقية.',
    polygon: '2118,406 2154,368 2216,362 2456,442 2408,506 2240,462',
    center: [2265, 424],
    color: '#06b6d4',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=tarek-el-ared',
  },
  {
    id: 'block_pink_center_north',
    nameAr: 'البلوك الوردي - عمائر وفلل النخيل المركزية',
    nameEn: 'Central Palms Pink Block - Luxury Residences',
    category: 'standalone',
    unitType: 'فلل وعمائر سكنية (البلوك الوردي)',
    area: '410 م²',
    specs: '4 غرف نوم ماستر · حديقة خاصة · بهو استقبال مزدوج',
    description: 'موقع استراتيجي وسط المشروع بقرب الحدائق والممشى الرياضي.',
    polygon: '1248,574 1522,424 1610,460 1332,638 1248,588',
    center: [1392, 537],
    color: '#ec4899',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
  {
    id: 'block_yellow_west_mid',
    nameAr: 'البلوك الأصفر الغربي - فلل الواحة الهادئة',
    nameEn: 'West Oasis Yellow Block - Private Villas',
    category: 'standalone',
    unitType: 'فلل الواحة المستقلة (البلوك الأصفر)',
    area: '380 م²',
    specs: '4 غرف نوم · حديقة محيطة واسعة · خصوصية تامة ومصعد',
    description: 'فلل مستقلة ذات خصوصية عالية في الجانب الغربي الهادئ من الكمباوند.',
    polygon: '526,576 776,470 858,472 888,500 602,634 584,634 534,602',
    center: [681, 555],
    color: '#eab308',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
  {
    id: 'block_green_center',
    nameAr: 'البلوك الأخضر الأوسط - تاون هاوس الحديقة',
    nameEn: 'Central Garden Green Block',
    category: 'townhouse',
    unitType: 'تاون هاوس الحديقة (البلوك الأخضر)',
    area: '320 م²',
    specs: '3 غرف نوم + ملحق علوي · حديقة خاصة مطلة على المسطحات الخضراء',
    description: 'وحدات تاون هاوس بتصاميم مستدامة مع ممرات مشاة خضراء آمنة للأطفال.',
    polygon: '1556,548 1560,528 1578,512 1660,476 1856,552 1894,578 1804,670 1560,558',
    center: [1684, 553],
    color: '#22c55e',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=tarek-el-ared',
  },
  {
    id: 'block_pink_east_mid',
    nameAr: 'البلوك الوردي الشرقي - فلل الماجستيك',
    nameEn: 'East Majestic Pink Block - Villas',
    category: 'standalone',
    unitType: 'فلل ماجستيك فاخرة (البلوك الوردي)',
    area: '420 م²',
    specs: '4 غرف نوم ماستر · غرفة سائق وخادمة · مسبح عائلي خاص',
    description: 'فلل أنيقة في القطاع الشرقي بتصميم معماري يحقق أقصى درجات الراحة.',
    polygon: '1918,560 1940,516 1988,480 2274,586 2286,604 2224,682',
    center: [2105, 571],
    color: '#ec4899',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
  {
    id: 'block_pink_west_center',
    nameAr: 'البلوك الوردي الغربي - تاون هاوس الغروب',
    nameEn: 'West Sunset Pink Block - Townhouses',
    category: 'townhouse',
    unitType: 'تاون هاوس عصري (البلوك الوردي)',
    area: '310 م²',
    specs: '3 غرف نوم · حديقة خلفية · مواقف مظللة لسيارتين',
    description: 'تاون هاوس راقي يوفر أسلوب حياة مريح وعصري للعائلات الشابة.',
    polygon: '746,722 748,702 772,686 1092,528 1158,554 1170,574 1168,604 826,788',
    center: [960, 645],
    color: '#ec4899',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=tarek-el-ared',
  },
  {
    id: 'block_yellow_east_avenue',
    nameAr: 'البلوك الأصفر - فلل سنترال أفينيو الشرقية',
    nameEn: 'East Avenue Yellow Block - Signature Villas',
    category: 'standalone',
    unitType: 'فلل سنترال أفينيو (البلوك الأصفر)',
    area: '440 م²',
    specs: '4 غرف نوم ماستر · حديقة خاصة كبيرة · واجهات زجاجية واسعة',
    description: 'فلل مستقلة على شارع داخلي عريض مع سهولة الوصول للمرافق.',
    polygon: '1822,672 1924,578 2208,688 2216,702 2130,802',
    center: [2060, 688],
    color: '#eab308',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
  {
    id: 'block_cyan_west_center',
    nameAr: 'البلوك السماوي الغربي - تاون هاوس جاردن فيو',
    nameEn: 'West Garden Cyan Block - Townhouses',
    category: 'townhouse',
    unitType: 'تاون هاوس جاردن فيو (البلوك السماوي)',
    area: '330 م²',
    specs: '3 غرف نوم + صالة عائلية علوية · حديقة خاصة وتراس',
    description: 'مجمع تاون هاوس متميز بالجهة الغربية بالقرب من الممشى الرياضي.',
    polygon: '850,802 898,762 1214,592 1232,592 1314,642 948,876',
    center: [1076, 711],
    color: '#06b6d4',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=tarek-el-ared',
  },
  {
    id: 'block_cyan_center',
    nameAr: 'البلوك السماوي الأوسط - فلل سنترال بارك',
    nameEn: 'Central Park Cyan Block - Villas',
    category: 'standalone',
    unitType: 'فلل سنترال بارك (البلوك السماوي)',
    area: '390 م²',
    specs: '4 غرف نوم · إطلالة على الحديقة الوسطية · مسبح وجلسة خارجية',
    description: 'فلل هادئة تتوسط المشروع بمحاذاة الحديقة المركزية والمرافق الترفيهية.',
    polygon: '1516,724 1554,676 1626,624 1788,694 1672,800',
    center: [1631, 704],
    color: '#06b6d4',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
  {
    id: 'block_yellow_boulevard',
    nameAr: 'البلوك الأصفر - فلل البوليفارد الوسطية',
    nameEn: 'Boulevard Yellow Block - Luxury Villas',
    category: 'standalone',
    unitType: 'فلل بوليفارد فاخرة (البلوك الأصفر)',
    area: '430 م²',
    specs: '4 غرف نوم ماستر · بهو استقبال واسع · حديقة خاصة ومسبح',
    description: 'فلل الصف الثاني من البوليفارد تجمع بين الحيوية والهدوء العائلي.',
    polygon: '1340,846 1364,804 1468,740 1554,776 1664,842 1546,954',
    center: [1489, 827],
    color: '#eab308',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
  {
    id: 'block_blue_amenities',
    nameAr: 'البلوك الأزرق - مجمع المرافق والفلل الفاخرة',
    nameEn: 'Boulevard Blue Block - Amenities & Premium Villas',
    category: 'amenities',
    unitType: 'فلل ومرافق البوليفارد (البلوك الأزرق)',
    area: '460 م²',
    specs: 'إطلالة مباشرة على البوليفارد · وصول سريع للكلوب هاوس والمرافق',
    description: 'بلوك مميز يجمع بين الفلل الفاخرة وأهم المرافق الخدمية والترفيهية.',
    polygon: '1810,856 1842,810 1914,752 1936,752 2070,812 1966,930',
    center: [1923, 819],
    color: '#3b82f6',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev',
  },
  {
    id: 'block_pink_front_center',
    nameAr: 'البلوك الوردي الأمامي - فلل الواجهة الملكية',
    nameEn: 'Royal Frontline Pink Block - Signature Villas',
    category: 'standalone',
    unitType: 'فلل الواجهة الملكية (البلوك الوردي)',
    area: '500 م²',
    specs: '5 غرف نوم ماستر · إطلالة بانورامية على الشارع الرئيسي · حديقة محيطة ومسبح',
    description: 'أفخم فلل الصف الأمامي على الشارع الرئيسي بتصميم نجدي معاصر وتجهيزات متكاملة.',
    polygon: '1556,964 1678,848 1906,964 1792,1100',
    center: [1733, 969],
    color: '#ec4899',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
  {
    id: 'block_pink_front_west',
    nameAr: 'البلوك الوردي الغربي الأمامي - فلل الواجهة',
    nameEn: 'Frontline West Pink Block - Executive Villas',
    category: 'standalone',
    unitType: 'فلل الصف الأمامي (البلوك الوردي)',
    area: '450 م²',
    specs: '4 غرف نوم · حديقة خاصة واسعة · غرفة سائق ومواقف مظللة',
    description: 'فلل مستقلة راقية على امتداد بوليفارد المشروع مع إطلالة مفتوحة.',
    polygon: '1112,980 1136,944 1228,884 1282,862 1478,984 1302,1130 1116,1006',
    center: [1236, 970],
    color: '#ec4899',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
  {
    id: 'block_orange_front_center',
    nameAr: 'البلوك البرتقالي - فلل سنترال بوليفارد الأمامية',
    nameEn: 'Central Boulevard Orange Block - Prime Villas',
    category: 'standalone',
    unitType: 'فلل واجهة فاخرة (البلوك البرتقالي)',
    area: '470 م²',
    specs: '4 غرف نوم ماستر · بهو مزدوج الارتفاع · مواقف لـ 3 سيارات',
    description: 'فلل الواجهة الوسطى ذات المداخل الخاصة والواجهات الحجرية المعاصرة.',
    polygon: '1330,1142 1376,1086 1492,992 1746,1132 1568,1308 1344,1162',
    center: [1476, 1137],
    color: '#f97316',
    tourUrl: 'https://tarek-360-city.mostafa-a-ashmawy.workers.dev?p=Al-Qirwan',
  },
];


interface MasterPlanViewProps {
  onBackToRiyadh: () => void;
  onBackToOrbit: () => void;
}

export default function MasterPlanView({ onBackToRiyadh, onBackToOrbit }: MasterPlanViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredBlock, setHoveredBlock] = useState<MasterPlanBlock | null>(null);
  const [selectedBlockForTour, setSelectedBlockForTour] = useState<MasterPlanBlock | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredBlocks =
    activeCategory === 'all'
      ? MASTERPLAN_BLOCKS_HD
      : MASTERPLAN_BLOCKS_HD.filter((b) => b.category === activeCategory);

  const handleBlockHover = (block: MasterPlanBlock | null) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (block) {
      if (block.id !== hoveredBlock?.id) {
        soundManager.playBlockHover();
      }
      setHoveredBlock(block);
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredBlock(null);
      }, 100);
    }
  };

  const handleBlockClick = (block: MasterPlanBlock) => {
    soundManager.playBlockClick();
    if (typeof window !== 'undefined') {
      window.open('https://tarek-360-city.mostafa-a-ashmawy.workers.dev', '_blank');
    }
    setSelectedBlockForTour(block);
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(1, z - 0.25));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#060812] text-white select-none overflow-hidden">
      {/* ── Top Navigation Bar ─────────────────────────────────────────────────── */}
      <header className="relative z-30 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/75 backdrop-blur-xl">
        {/* Left: Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playTargetLock();
              onBackToRiyadh();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>خريطة الرياض</span>
          </button>

          <button
            onClick={() => {
              soundManager.playFlySound();
              onBackToOrbit();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>خريطة المملكة</span>
          </button>
        </div>

        {/* Center: Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
              المخطط العام المعماري · مشروع ساتك 360 سيتي
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Sparkles className="w-2.5 h-2.5 animate-pulse" />
              <span>مخطط تفاعلي ملون بالبلوكات</span>
            </span>
          </div>
          <p className="text-[11px] text-white/50 hidden sm:block">
            مرر المؤشر على أي بلوك ملون لعرض البيانات، وانقر مباشرة لفتح الجولة الافتراضية 360°
          </p>
        </div>

        {/* Right: Direct Tour Link */}
        <div className="flex items-center gap-2">
          <a
            href="https://tarek-360-city.mostafa-a-ashmawy.workers.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
          >
            <span>الجولة الافتراضية 360°</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* ── Category Filter Bar ──────────────────────────────────────────────── */}
      <div className="relative z-20 px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between gap-3 overflow-x-auto text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 flex items-center gap-1 text-[11px] font-medium mr-1 whitespace-nowrap">
            <Layers className="w-3 h-3 text-indigo-400" />
            <span>تصفية البلوكات:</span>
          </span>

          {[
            { id: 'all', labelAr: 'كافة البلوكات (17 بلوك)' },
            { id: 'standalone', labelAr: 'فلل مستقلة' },
            { id: 'townhouse', labelAr: 'تاون هاوس' },
            { id: 'amenities', labelAr: 'المرافق والخدمات' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playBlockHover();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat.labelAr}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="hidden md:flex items-center gap-1 bg-black/40 px-2 py-1 rounded-xl border border-white/10">
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white cursor-pointer"
            title="تكبير"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-white/40 font-mono px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white cursor-pointer"
            title="تصغير"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          {zoomLevel !== 1 && (
            <button
              onClick={handleResetZoom}
              className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white ml-1 cursor-pointer"
              title="إعادة الضبط"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── Master Plan Interactive Canvas Area ──────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-full overflow-auto flex items-center justify-center p-2 sm:p-4"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(30, 27, 75, 0.4) 0%, #060812 85%)',
        }}
      >
        {/* Transformable Stage Wrapper */}
        <div
          className="relative transition-transform duration-300 ease-out origin-center rounded-2xl shadow-2xl overflow-hidden border border-white/15"
          style={{
            width: '100%',
            maxWidth: '1280px',
            aspectRatio: '2752 / 1536',
            transform: `scale(${zoomLevel})`,
          }}
        >
          {/* Base Photorealistic 2752x1536 Master Plan Render Image (With Pre-Marked Dots) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/satk-masterplan.jpg"
            alt="SATK 360 City Master Plan Render"
            className="w-full h-full object-cover block pointer-events-none select-none"
          />

          {/* SVG Interactive Overlay Layer (viewBox 0 0 2752 1536) */}
          <svg
            viewBox="0 0 2752 1536"
            className="absolute inset-0 w-full h-full overflow-visible z-10"
          >
            <defs>
              <filter id="cloudFluffyFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
              <filter id="cloudShadowFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
            </defs>

            {/* ── 1. SOFT DRIFTING GROUND SHADOW ───────────────────────────── */}
            <g className="pointer-events-none select-none">
              <g opacity="0.12">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-1000, 200"
                  to="3400, 420"
                  dur="48s"
                  repeatCount="indefinite"
                />
                <ellipse cx="500" cy="260" rx="420" ry="130" fill="#020617" filter="url(#cloudShadowFilter)" />
              </g>
            </g>

            {/* ── 2. EXACT COLOR HIGHLIGHT POLYGONS (تظليل بنفس لون نقط كل بلوك) ─ */}
            {filteredBlocks.map((block) => {
              const isHovered = hoveredBlock?.id === block.id;

              return (
                <g key={block.id}>
                  {/* Interactive Highlight Polygon:
                      - pointerEvents="all" guarantees 100% responsiveness over EVERY point inside the block!
                      - fill: isHovered ? `${block.color}50` : 'rgba(0,0,0,0.001)' ensures the browser treats the whole area as a solid painted surface for hit-testing without being visible when unhovered.
                  */}
                  <polygon
                    points={block.polygon}
                    onClick={() => handleBlockClick(block)}
                    onMouseEnter={() => handleBlockHover(block)}
                    onMouseMove={() => {
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                        hoverTimeoutRef.current = null;
                      }
                      if (hoveredBlock?.id !== block.id) {
                        setHoveredBlock(block);
                      }
                    }}
                    onMouseLeave={() => handleBlockHover(null)}
                    className="cursor-pointer transition-all duration-150"
                    style={{
                      pointerEvents: 'all',
                      fill: isHovered ? `${block.color}50` : 'rgba(0, 0, 0, 0.001)',
                      stroke: isHovered ? block.color : 'transparent',
                      strokeWidth: isHovered ? 4 : 0,
                      filter: isHovered ? `drop-shadow(0 0 16px ${block.color})` : 'none',
                    }}
                  />

                  {/* Pulsing Pin at Block Center on Hover - MUST HAVE pointer-events-none so it doesn't block polygon mouse events! */}
                  {isHovered && (
                    <g
                      transform={`translate(${block.center[0]}, ${block.center[1]})`}
                      className="pointer-events-none select-none"
                    >
                      <circle r="28" fill={`${block.color}50`} className="animate-ping" />
                      <circle r="12" fill={block.color} stroke="#ffffff" strokeWidth="3" />
                    </g>
                  )}
                </g>
              );
            })}

            {/* ── 3. DISTANT BIRDS (عصافير صغيرة بعيدة بتعدى) ───────────────── */}
            <g className="pointer-events-none select-none">
              <g>
                <animateMotion
                  path="M 100,450 Q 1300,280 2700,180"
                  dur="25s"
                  repeatCount="indefinite"
                />
                <path
                  d="M -7,0 Q -3.5,-5 0,0 Q 3.5,-5 7,0 Q 3.5,-1 0,-0.5 Q -3.5,-1 -7,0 Z"
                  fill="#1e293b"
                  opacity="0.8"
                  className="bird-wing"
                />
              </g>
              <g>
                <animateMotion
                  path="M 70,470 Q 1270,300 2670,200"
                  dur="25s"
                  repeatCount="indefinite"
                  begin="0.25s"
                />
                <path
                  d="M -6,0 Q -3,-4.5 0,0 Q 3,-4.5 6,0 Q 3,-1 0,-0.5 Q -3,-1 -6,0 Z"
                  fill="#1e293b"
                  opacity="0.75"
                  className="bird-wing"
                />
              </g>
              <g>
                <animateMotion
                  path="M 130,440 Q 1330,270 2730,170"
                  dur="25s"
                  repeatCount="indefinite"
                  begin="0.5s"
                />
                <path
                  d="M -6,0 Q -3,-4.5 0,0 Q 3,-4.5 6,0 Q 3,-1 0,-0.5 Q -3,-1 -6,0 Z"
                  fill="#1e293b"
                  opacity="0.75"
                  className="bird-wing"
                />
              </g>
            </g>

            {/* ── 4. SOFT DRIFTING CLOUDS (سحاب خفيف بنسبة 50% في الأفق) ───────── */}
            <g className="pointer-events-none select-none">
              <g opacity="0.42">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-900, -60"
                  to="3300, 70"
                  dur="46s"
                  repeatCount="indefinite"
                />
                <g filter="url(#cloudFluffyFilter)">
                  <ellipse cx="400" cy="150" rx="340" ry="60" fill="#f1f5f9" />
                  <circle cx="220" cy="120" r="85" fill="#ffffff" />
                  <circle cx="320" cy="90" r="105" fill="#ffffff" />
                  <circle cx="430" cy="70" r="115" fill="#ffffff" />
                  <circle cx="540" cy="85" r="105" fill="#ffffff" />
                  <circle cx="640" cy="115" r="85" fill="#ffffff" />
                </g>
              </g>
              <g opacity="0.32">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-1200, 80"
                  to="3100, 220"
                  dur="55s"
                  repeatCount="indefinite"
                />
                <g filter="url(#cloudFluffyFilter)">
                  <ellipse cx="360" cy="120" rx="260" ry="50" fill="#f1f5f9" />
                  <circle cx="220" cy="90" r="75" fill="#ffffff" />
                  <circle cx="320" cy="65" r="95" fill="#ffffff" />
                  <circle cx="420" cy="75" r="90" fill="#ffffff" />
                  <circle cx="510" cy="95" r="75" fill="#ffffff" />
                </g>
              </g>
            </g>
          </svg>

          {/* ── Hovered Block Floating 3D Card (تظهر الداتا وزر دخول الجولة) ──── */}
          {hoveredBlock && (
            <div
              className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-5 animate-fade-in"
              style={{
                left: `${(hoveredBlock.center[0] / 2752) * 100}%`,
                top: `${(hoveredBlock.center[1] / 1536) * 100}%`,
              }}
            >
              <div
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                    hoverTimeoutRef.current = null;
                  }
                }}
                onMouseLeave={() => handleBlockHover(null)}
                className="pointer-events-auto rounded-2xl p-4 text-white shadow-2xl border backdrop-blur-2xl max-w-xs w-76"
                style={{
                  background: 'rgba(10, 14, 28, 0.96)',
                  borderColor: hoveredBlock.color,
                  boxShadow: `0 20px 45px rgba(0,0,0,0.85), 0 0 30px ${hoveredBlock.color}60`,
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                    style={{
                      background: `${hoveredBlock.color}25`,
                      color: hoveredBlock.color,
                      borderColor: `${hoveredBlock.color}60`,
                    }}
                  >
                    {hoveredBlock.unitType}
                  </span>
                  <span className="text-[11px] font-mono text-white/60">{hoveredBlock.area}</span>
                </div>

                <h4 className="font-bold text-white text-sm mb-1">{hoveredBlock.nameAr}</h4>
                <p className="text-[11px] text-white/70 leading-relaxed mb-3">
                  {hoveredBlock.specs}
                </p>

                {/* Click Prompt Button styled with the block's color */}
                <button
                  onClick={() => handleBlockClick(hoveredBlock)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${hoveredBlock.color}, #06b6d4)`,
                    boxShadow: `0 6px 20px ${hoveredBlock.color}50`,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>دخول الجولة الافتراضية 360°</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Information Ribbon ────────────────────────────────────────── */}
      <footer className="relative z-20 px-6 py-2.5 bg-black/75 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {hoveredBlock ? (
              <strong className="text-white">
                تم تحديد: {hoveredBlock.nameAr} — انقر لفتح المعاينة الافتراضية 360°
              </strong>
            ) : (
              'تم تحديد كافة البلوكات الملونة في الماستر بلان — مرر الماوس فوق أي بلوك وانقر لدخول الجولة'
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-white/40">SATK 360 City · Riyadh Master Plan</span>
        </div>
      </footer>

      {/* ── Virtual Tour Embedded Modal ────────────────────────────────────── */}
      <TourEmbedModal
        isOpen={!!selectedBlockForTour}
        onClose={() => setSelectedBlockForTour(null)}
        block={selectedBlockForTour}
      />
    </div>
  );
}


