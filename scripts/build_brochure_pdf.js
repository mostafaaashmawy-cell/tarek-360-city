const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scriptDir = path.resolve(__dirname);
const mockupDir = path.join(scriptDir, 'mockup_screens');
const projectRootDir = path.resolve(__dirname, '..');

// Read logo
const logoPath = path.resolve(__dirname, '../public/city-scale-logo.png');
const logoB64 = fs.readFileSync(logoPath).toString('base64');
const logoDataUri = `data:image/jpeg;base64,${logoB64}`;

// Read screenshots
function getB64(filename) {
  const p = path.join(mockupDir, filename);
  return `data:image/png;base64,${fs.readFileSync(p).toString('base64')}`;
}

const screenCustomer = getB64('screenshot_customer_tour.png');
const screenModal = getB64('screenshot_lead_modal.png');
const screenAnalytics = getB64('screenshot_admin_analytics.png');
const screenLeads = getB64('screenshot_admin_leads.png');
const screenSettings = getB64('screenshot_admin_settings.png');

console.log('All screenshots loaded as base64.');

// ── NEON SVG ICONS GENERATOR (Matching User Reference Image) ──────────────────
function neonSvg(type, color = 'cyan', size = 24) {
  const colors = {
    cyan: '#00f0ff',
    magenta: '#ff2d75',
    yellow: '#ffe600',
    purple: '#b042ff',
    green: '#00ff9d',
  };
  const c = colors[color] || '#00f0ff';
  const filter = `filter: drop-shadow(0 0 3px ${c}) drop-shadow(0 0 8px ${c});`;

  let inner = '';
  switch (type) {
    case 'mic':
      inner = `<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/>`;
      break;
    case 'globe':
      inner = `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`;
      break;
    case 'grid':
      inner = `<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>`;
      break;
    case 'chat':
      inner = `<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>`;
      break;
    case 'warning':
      inner = `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="0.8" fill="${c}"/>`;
      break;
    case 'diamond':
      inner = `<path d="M6 3h12l4 7-10 11L2 10l4-7z"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="12" y1="21" x2="8" y2="10"/><line x1="12" y1="21" x2="16" y2="10"/><line x1="6" y1="3" x2="8" y2="10"/><line x1="18" y1="3" x2="16" y2="10"/>`;
      break;
    case 'lightbulb':
      inner = `<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 2a7 7 0 0 0-4.95 11.95c.78.78 1.45 1.75 1.75 2.85h6.4c.3-1.1.97-2.07 1.75-2.85A7 7 0 0 0 12 2z"/>`;
      break;
    case 'lock':
      inner = `<rect x="4" y="10" width="16" height="12" rx="3"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/><circle cx="12" cy="15" r="1.5" fill="${c}"/><line x1="12" y1="16.5" x2="12" y2="18.5"/>`;
      break;
    case 'screen':
      inner = `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/>`;
      break;
    case 'user':
      inner = `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="9" r="3.5"/><path d="M6 19a6 6 0 0 1 12 0"/>`;
      break;
    case 'cloud':
      inner = `<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>`;
      break;
    case 'lightning':
      inner = `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`;
      break;
    case 'chart':
      inner = `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><path d="M3 13l6-6 4 4 8-8"/>`;
      break;
    case 'briefcase':
      inner = `<rect x="2" y="7" width="20" height="14" rx="3"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/><line x1="2" y1="12" x2="22" y2="12"/>`;
      break;
    case 'target':
      inner = `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="${c}"/>`;
      break;
    case 'folder':
      inner = `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>`;
      break;
    case 'phone':
      inner = `<rect x="6" y="2" width="12" height="20" rx="3"/><line x1="11" y1="18" x2="13" y2="18"/>`;
      break;
    case 'building':
      inner = `<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M10 22v-4h4v4"/>`;
      break;
    case 'web':
      inner = `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`;
      break;
    default:
      inner = `<circle cx="12" cy="12" r="10"/>`;
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${filter}; display: inline-block; vertical-align: middle;">${inner}</svg>`;
}

function neonBox(svgHtml, color = 'cyan', size = 42) {
  const colors = {
    cyan: '#00f0ff',
    magenta: '#ff2d75',
    yellow: '#ffe600',
    purple: '#b042ff',
    green: '#00ff9d',
  };
  const c = colors[color] || '#00f0ff';
  return `<div style="width: ${size}px; height: ${size}px; border-radius: 13px; background: rgba(10, 22, 32, 0.75); border: 1px solid ${c}55; box-shadow: 0 4px 18px rgba(0,0,0,0.5), inset 0 0 10px ${c}15; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${svgHtml}</div>`;
}

// SVG Wireframe Cube Pattern (City Scale Identity)
const svgCubePattern = `
<svg width="100%" height="100%" style="position:absolute; inset:0; pointer-events:none; opacity:0.12;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="cube-grid" width="120" height="120" patternUnits="userSpaceOnUse">
      <path d="M60 10 L110 38 L110 94 L60 122 L10 94 L10 38 Z" fill="none" stroke="#00d9b5" stroke-width="1.5"/>
      <path d="M60 10 L60 66 L110 94" fill="none" stroke="#00d9b5" stroke-width="1.5"/>
      <path d="M60 66 L10 94" fill="none" stroke="#00d9b5" stroke-width="1.5"/>
      <circle cx="60" cy="66" r="3" fill="#00d9b5"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#cube-grid)"/>
</svg>
`;

// HTML Document Builder
const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>Ai Smart Model — City Scale Sales Brochure</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: 297mm 210mm;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 297mm;
      height: auto;
      font-family: 'Cairo', 'Tajawal', sans-serif;
      background-color: #05141a;
      color: #ffffff;
      direction: rtl;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 297mm;
      height: 210mm;
      page-break-after: always;
      page-break-inside: avoid;
      position: relative;
      overflow: hidden;
      background: #091318;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0;
      box-sizing: border-box;
    }
    /* Brand Gradient Backgrounds */
    .bg-teal-gradient {
      background: linear-gradient(135deg, #001920 0%, #003744 40%, #005063 70%, #03151c 100%);
    }
    .bg-dark-slate {
      background: radial-gradient(circle at 80% 20%, #00313d 0%, #09141a 60%, #040a0d 100%);
    }
    /* Header Bar */
    .page-header {
      height: 64px;
      padding: 0 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0, 217, 181, 0.2);
      background: rgba(4, 15, 20, 0.85);
      z-index: 20;
    }
    .page-header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .page-header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    /* Footer Bar */
    .page-footer {
      height: 44px;
      padding: 0 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(4, 15, 20, 0.9);
      font-size: 11px;
      color: #7d9ba6;
      font-weight: 600;
      z-index: 20;
    }
    /* Body Content Container */
    .page-body {
      flex: 1;
      padding: 24px 36px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 10;
      position: relative;
    }
    /* Badges */
    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      background: rgba(0, 217, 181, 0.15);
      color: #00d9b5;
      border: 1px solid rgba(0, 217, 181, 0.35);
    }
    .pill-solid {
      background: #00d9b5;
      color: #03181f;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 900;
    }
    /* Cards */
    .feature-card {
      background: rgba(10, 28, 36, 0.75);
      border: 1px solid rgba(0, 217, 181, 0.2);
      border-radius: 16px;
      padding: 16px 20px;
      backdrop-filter: blur(10px);
    }
    .screenshot-frame {
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(0, 217, 181, 0.3);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 217, 181, 0.15);
      background: #000;
      display: flex;
    }
    .screenshot-frame img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
  </style>
</head>
<body>

  <!-- ===================================================================== -->
  <!-- PAGE 1: COVER PAGE (الغلاف الفاخر)                                    -->
  <!-- ===================================================================== -->
  <div class="page bg-teal-gradient">
    ${svgCubePattern}

    <!-- Ambient glow circles -->
    <div style="position: absolute; top: -100px; right: -100px; width: 450px; height: 450px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 217, 181, 0.25) 0%, transparent 70%); pointer-events: none;"></div>
    <div style="position: absolute; bottom: -100px; left: -100px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 105, 128, 0.35) 0%, transparent 70%); pointer-events: none;"></div>

    <!-- Cover Top Navigation -->
    <div style="padding: 40px 48px 0; display: flex; align-items: center; justify-content: space-between; z-index: 10;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <img src="${logoDataUri}" style="height: 64px; width: 64px; border-radius: 14px; background: #fff; padding: 4px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
        <div>
          <h2 style="font-size: 24px; font-weight: 900; color: #fff; letter-spacing: -0.5px;">City Scale</h2>
          <p style="font-size: 12px; color: #00d9b5; font-weight: 700;">Physical & Visual modeling Co. — since 1998</p>
        </div>
      </div>
      <div style="display: flex; gap: 12px;">
        <span class="pill-badge">شهادة الجودة العالمية ISO</span>
        <span class="pill-badge">خبرة تتجاوز 28 عاماً</span>
      </div>
    </div>

    <!-- Cover Main Content Center -->
    <div style="padding: 0 48px; z-index: 10; margin-top: 10px;">
      <div class="pill-solid" style="display: inline-block; margin-bottom: 18px;">
        ثورة المبيعات العقارية التفاعلية | Next-Gen AI Sales Architecture
      </div>
      
      <h1 style="font-size: 54px; font-weight: 900; line-height: 1.15; color: #ffffff; margin-bottom: 8px;">
        Ai Smart Model
      </h1>
      <h2 style="font-size: 32px; font-weight: 800; color: #00d9b5; margin-bottom: 20px;">
        المجسم الذكي المدعوم بالذكاء الاصطناعي
      </h2>

      <p style="font-size: 17px; color: #d1e4eb; max-width: 820px; line-height: 1.7; font-weight: 500; margin-bottom: 36px;">
        الحل التقني المتكامل لتحويل المجسمات المعمارية والجولات الافتراضية 360° إلى مستشار مبيعات خبير ناطق ومتاح على مدار الساعة، يتحدث بطلاقة، يجيب فورياً على متطلبات العملاء، يعرض البطاقات التمويلية المتزامنة، ويؤهل الصفقات لإتمامها عبر واتساب مباشرة.
      </p>

      <!-- Key Capabilities Ribbon with NEON ICONS -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; max-width: 1000px;">
        <div style="background: rgba(0, 30, 38, 0.7); border: 1px solid rgba(0, 217, 181, 0.3); border-radius: 16px; padding: 18px 16px; text-align: center;">
          <div style="margin-bottom: 10px; display: flex; justify-content: center;">
            ${neonBox(neonSvg('mic', 'cyan', 26), 'cyan', 46)}
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #fff;">مستشار صوتي حي</h4>
          <p style="font-size: 11px; color: #94b5c0; margin-top: 4px;">تفاعل طبيعي متعدد اللهجات بتقنية Google Gemini</p>
        </div>

        <div style="background: rgba(0, 30, 38, 0.7); border: 1px solid rgba(0, 217, 181, 0.3); border-radius: 16px; padding: 18px 16px; text-align: center;">
          <div style="margin-bottom: 10px; display: flex; justify-content: center;">
            ${neonBox(neonSvg('globe', 'purple', 26), 'purple', 46)}
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #fff;">جولات 360° غامرة</h4>
          <p style="font-size: 11px; color: #94b5c0; margin-top: 4px;">محاكاة معمارية فائقة الدقة لكل ركن في المشروع</p>
        </div>

        <div style="background: rgba(0, 30, 38, 0.7); border: 1px solid rgba(0, 217, 181, 0.3); border-radius: 16px; padding: 18px 16px; text-align: center;">
          <div style="margin-bottom: 10px; display: flex; justify-content: center;">
            ${neonBox(neonSvg('grid', 'green', 26), 'green', 46)}
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #fff;">بطاقات ذكية متزامنة</h4>
          <p style="font-size: 11px; color: #94b5c0; margin-top: 4px;">عرض تلقائي للمساحات وخطط السداد أثناء الحديث</p>
        </div>

        <div style="background: rgba(0, 30, 38, 0.7); border: 1px solid rgba(0, 217, 181, 0.3); border-radius: 16px; padding: 18px 16px; text-align: center;">
          <div style="margin-bottom: 10px; display: flex; justify-content: center;">
            ${neonBox(neonSvg('chat', 'cyan', 26), 'cyan', 46)}
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #fff;">تأهيل فوري لواتساب</h4>
          <p style="font-size: 11px; color: #94b5c0; margin-top: 4px;">التقاط إشارات الشراء وإرسال بيانات العميل للمبيعات</p>
        </div>
      </div>
    </div>

    <!-- Cover Footer -->
    <div style="padding: 20px 48px 28px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); background: rgba(2, 16, 21, 0.95); z-index: 10;">
      <div style="display: flex; gap: 24px; font-size: 12px; color: #a0c2cd; font-weight: 700; align-items: center;">
        <span style="display: inline-flex; align-items: center; gap: 6px;">${neonSvg('web', 'cyan', 16)} CITY-SCALE.COM</span>
        <span>|</span>
        <span style="direction: ltr; display: inline-flex; align-items: center; gap: 6px;">${neonSvg('phone', 'magenta', 16)} KSA: +966-561617185 &nbsp;|&nbsp; Egypt: +20-1002533951</span>
        <span>|</span>
        <span style="display: inline-flex; align-items: center; gap: 6px;">${neonSvg('building', 'yellow', 16)} السجل الضريبي: 589-581-708</span>
      </div>
      <div style="font-size: 12px; font-weight: 800; color: #00d9b5;">
        الملف التعريفي والبيعي للحلول الذكية 2026
      </div>
    </div>
  </div>


  <!-- ===================================================================== -->
  <!-- PAGE 2: THE STRATEGIC BREAKTHROUGH (الرؤية والتحدي والحل الاستراتيجي) -->
  <!-- ===================================================================== -->
  <div class="page bg-dark-slate">
    ${svgCubePattern}

    <header class="page-header">
      <div class="page-header-left">
        <img src="${logoDataUri}" style="height: 38px; width: 38px; border-radius: 8px; background: #fff; padding: 2px;">
        <span style="font-size: 15px; font-weight: 800; color: #fff;">سيتي سكيل | City Scale</span>
        <span style="color: rgba(255,255,255,0.2);">|</span>
        <span style="font-size: 13px; color: #00d9b5; font-weight: 700;">Ai Smart Model</span>
      </div>
      <div class="page-header-right">
        <span class="pill-badge">01 / الرؤية الاستراتيجية</span>
      </div>
    </header>

    <div class="page-body" style="padding: 28px 36px;">
      <div>
        <div class="pill-solid" style="margin-bottom: 8px;">مقارنة وحقائق السوق العقاري</div>
        <h2 style="font-size: 26px; font-weight: 900; color: #fff; line-height: 1.2;">
          لماذا تحتاج شركات التطوير العقاري إلى "Ai Smart Model" اليوم؟
        </h2>
        <p style="font-size: 13px; color: #94b5c0; margin-top: 4px;">
          سد الفجوة القاتلة بين اهتمام العميل المبدئي وقدرة فريق المبيعات على الاستجابة الفورية والتأهيل الذكي.
        </p>
      </div>

      <!-- Split Columns: Traditional vs AI Smart Model -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin: 20px 0;">
        <!-- Column 1: Traditional Sales Friction -->
        <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 22px; padding: 28px 26px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 18px;">
              ${neonBox(neonSvg('warning', 'yellow', 22), 'yellow', 40)}
              <h3 style="font-size: 17px; font-weight: 800; color: #fca5a5;">تحديات المبيعات العقارية التقليدية</h3>
            </div>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 16px; font-size: 13.5px; color: #fecaca; line-height: 1.6;">
              <li style="display: flex; gap: 12px;">
                <span style="color: #ef4444; font-weight: 900; font-size: 16px;">✕</span>
                <span><strong>فقدان العملاء خارج أوقات العمل:</strong> أكثر من 60% من المشترين يتصفحون المشاريع مساءً وأثناء العطلات، مما يفقد المطور فرصاً بيعية مؤكدة دون استجابة.</span>
              </li>
              <li style="display: flex; gap: 12px;">
                <span style="color: #ef4444; font-weight: 900; font-size: 16px;">✕</span>
                <span><strong>تكلفة تشغيلية باهظة:</strong> مصاريف استقطاب وتدريب أطقم مبيعات ضخمة لتغطية صالات العرض والمعارض الإقليمية على مدار العام.</span>
              </li>
              <li style="display: flex; gap: 12px;">
                <span style="color: #ef4444; font-weight: 900; font-size: 16px;">✕</span>
                <span><strong>مجسمات ثابتة صامتة:</strong> عجز المجسمات التقليدية بمفردها عن توضيح خطط السداد أو مواعيد التسليم أو الاستجابة لأسئلة العميل التفاعلية.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Column 2: The Solution - Ai Smart Model -->
        <div style="background: rgba(0, 217, 181, 0.06); border: 1px solid rgba(0, 217, 181, 0.35); border-radius: 22px; padding: 28px 26px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 18px;">
              ${neonBox(neonSvg('diamond', 'cyan', 22), 'cyan', 40)}
              <h3 style="font-size: 17px; font-weight: 800; color: #00d9b5;">الحل الثوري: Ai Smart Model</h3>
            </div>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 16px; font-size: 13.5px; color: #d1f2eb; line-height: 1.6;">
              <li style="display: flex; gap: 12px;">
                <span style="color: #00d9b5; font-weight: 900; font-size: 16px;">✓</span>
                <span><strong>جاهزية تامة 24/7/365:</strong> استقبال وتوجيه الزوار في أي لحظة بشرح صوتي تفاعلي دافئ واحترافي لا يغيب ولا يتأخر ثانية واحدة.</span>
              </li>
              <li style="display: flex; gap: 12px;">
                <span style="color: #00d9b5; font-weight: 900; font-size: 16px;">✓</span>
                <span><strong>توفير حتى 70% من التكلفة التشغيلية:</strong> تحمّل الاستشارات الأولية والشرح المعماري تلقائياً، وتوجيه فريق المبيعات لإغلاق الصفقات فقط.</span>
              </li>
              <li style="display: flex; gap: 12px;">
                <span style="color: #00d9b5; font-weight: 900; font-size: 16px;">✓</span>
                <span><strong>توضيح مرئي وفوري وربط مباشر:</strong> ظهور البطاقات الذكية ومخططات الوحدات على الشاشة متزامنة مع الصوت، والتحويل الفوري لواتساب.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Strategic Value Note -->
      <div style="background: rgba(0, 36, 46, 0.7); border: 1px solid rgba(0, 217, 181, 0.25); border-radius: 18px; padding: 18px 24px; display: flex; align-items: center; gap: 18px;">
        ${neonBox(neonSvg('lightbulb', 'yellow', 24), 'yellow', 44)}
        <div>
          <h4 style="font-size: 14px; font-weight: 800; color: #00d9b5; margin-bottom: 2px;">التحول من العرض الصامت إلى البيع التفاعلي الذكي</h4>
          <p style="font-size: 12px; color: #cbd5e1; line-height: 1.5;">
            نظام "Ai Smart Model" يدمج الجولة الافتراضية ثلاثية الأبعاد والمجسم مع مستشار ذكاء اصطناعي صوتي مباشر، ليتحول العرض العقاري إلى جلسة استشارية متكاملة ترفع معدلات التحويل وتؤهل العميل فورياً.
          </p>
        </div>
      </div>
    </div>

    <footer class="page-footer">
      <span>سيتي سكيل للمجسمات المعمارية والحلول الذكية — City Scale 2026</span>
      <span>01 / الرؤية الاستراتيجية والحل الثوري</span>
    </footer>
  </div>


  <!-- ===================================================================== -->
  <!-- PAGE 3: THE CUSTOMER EXPERIENCE (تجربة العميل والتفاعل الصوتي)         -->
  <!-- ===================================================================== -->
  <div class="page bg-dark-slate">
    ${svgCubePattern}

    <header class="page-header">
      <div class="page-header-left">
        <img src="${logoDataUri}" style="height: 38px; width: 38px; border-radius: 8px; background: #fff; padding: 2px;">
        <span style="font-size: 15px; font-weight: 800; color: #fff;">سيتي سكيل | City Scale</span>
        <span style="color: rgba(255,255,255,0.2);">|</span>
        <span style="font-size: 13px; color: #00d9b5; font-weight: 700;">Ai Smart Model</span>
      </div>
      <div class="page-header-right">
        <span class="pill-badge">02 / تجربة العميل التفاعلية</span>
      </div>
    </header>

    <div class="page-body">
      <div>
        <div class="pill-solid" style="margin-bottom: 6px;">واجهة العميل التفاعلية</div>
        <h2 style="font-size: 24px; font-weight: 900; color: #fff; line-height: 1.2;">
          رحلة العميل: محاكاة 360° غامرة، صوت بشري طبيعي، وبطاقات سداد متزامنة
        </h2>
      </div>

      <!-- Content Grid: Visual Screenshots + Key Features -->
      <div style="display: grid; grid-template-columns: 1.35fr 1fr; gap: 24px; align-items: center; margin: 10px 0;">
        <!-- Left: Screenshots stack -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="screenshot-frame" style="height: 250px;">
            <img src="${screenCustomer}" alt="Customer 360 Virtual Tour with Smart Cards and Voice Button">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="screenshot-frame" style="height: 110px;">
              <img src="${screenModal}" alt="Lead Capture Modal">
            </div>
            <div style="background: rgba(0, 36, 46, 0.8); border: 1px solid rgba(0, 217, 181, 0.3); border-radius: 14px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: center;">
              <span style="font-size: 11px; color: #00d9b5; font-weight: 800; display: inline-flex; align-items: center; gap: 6px;">
                ${neonSvg('lock', 'magenta', 16)} استدراج ذكي للبيانات
              </span>
              <p style="font-size: 11px; color: #d0e7ee; margin-top: 4px; line-height: 1.4;">
                تظهر نافذة تأهيل العميل تلقائياً عند السؤال الثاني لضمان التقاط بيانات الاتصال والنية الشرائية قبل مغادرة الجولة.
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Feature Highlights with NEON ICONS -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <!-- Feature 1 -->
          <div class="feature-card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              ${neonBox(neonSvg('mic', 'cyan', 18), 'cyan', 32)}
              <h4 style="font-size: 14px; font-weight: 800; color: #fff;">المستشار الصوتي الحي (Voice-First AI)</h4>
            </div>
            <p style="font-size: 12px; color: #a4c6d1; line-height: 1.5;">
              محادثة صوتية فورية طبيعية دون أي تأخير، مدعومة بمحرك <strong>Google Gemini Live</strong>، تتحدث بطلاقة باللهجة المصرية والخليجية والفصحى والإنجليزية، وتجيب بدقة عن كل تفاصيل المشروع.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="feature-card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              ${neonBox(neonSvg('grid', 'purple', 18), 'purple', 32)}
              <h4 style="font-size: 14px; font-weight: 800; color: #93c5fd;">لوحة البطاقات الذكية المتزامنة</h4>
            </div>
            <p style="font-size: 12px; color: #a4c6d1; line-height: 1.5;">
              بطاقات ملونة تظهر تلقائياً على يمين الشاشة تعرض تفاصيل المساحات، خطط التقسيط المرنة، مواعيد التسليم، وأبرز المزايا في اللحظة التي يذكرها المساعد الصوتي، لترسيخ الثقة البصرية لدى العميل.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="feature-card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              ${neonBox(neonSvg('chat', 'green', 18), 'green', 32)}
              <h4 style="font-size: 14px; font-weight: 800; color: #6ee7b7;">جسر التواصل المباشر مع واتساب</h4>
            </div>
            <p style="font-size: 12px; color: #a4c6d1; line-height: 1.5;">
              زر دائم على الشاشة ينقل العميل فوراً إلى محادثة واتساب مجهزة مسبقاً باسم المشروع والوحدة التي تم الاستفسار عنها لتمكين فريق المبيعات من المتابعة الفورية.
            </p>
          </div>
        </div>
      </div>
    </div>

    <footer class="page-footer">
      <span>سيتي سكيل للمجسمات المعمارية والحلول الذكية — City Scale 2026</span>
      <span>02 / رحلة العميل والتجربة الصوتية التفاعلية</span>
    </footer>
  </div>


  <!-- ===================================================================== -->
  <!-- PAGE 4: ADMIN COMMAND CENTER (مركز التحكم وإدارة المشاريع)           -->
  <!-- ===================================================================== -->
  <div class="page bg-dark-slate">
    ${svgCubePattern}

    <header class="page-header">
      <div class="page-header-left">
        <img src="${logoDataUri}" style="height: 38px; width: 38px; border-radius: 8px; background: #fff; padding: 2px;">
        <span style="font-size: 15px; font-weight: 800; color: #fff;">سيتي سكيل | City Scale</span>
        <span style="color: rgba(255,255,255,0.2);">|</span>
        <span style="font-size: 13px; color: #00d9b5; font-weight: 700;">Ai Smart Model</span>
      </div>
      <div class="page-header-right">
        <span class="pill-badge">03 / مركز التحكم والإدارة</span>
      </div>
    </header>

    <div class="page-body">
      <div>
        <div class="pill-solid" style="margin-bottom: 6px;">لوحة تحكم المطور العقاري</div>
        <h2 style="font-size: 24px; font-weight: 900; color: #fff; line-height: 1.2;">
          إدارة مركزية متعددة المشاريع وتخصيص هوية ونبرة المستشار الصوتي
        </h2>
      </div>

      <!-- Grid: Settings Screenshot + Features with NEON ICONS -->
      <div style="display: grid; grid-template-columns: 1.35fr 1fr; gap: 24px; align-items: center; margin: 10px 0;">
        <!-- Left: Screenshot of Admin Settings -->
        <div class="screenshot-frame" style="height: 375px;">
          <img src="${screenSettings}" alt="Admin Multi-Project Settings and Voice Persona Tuning">
        </div>

        <!-- Right: Admin Capabilities -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="feature-card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              ${neonBox(neonSvg('screen', 'cyan', 18), 'cyan', 32)}
              <h4 style="font-size: 14px; font-weight: 800; color: #fff;">محرك المشاريع المتعددة (Multi-Project)</h4>
            </div>
            <p style="font-size: 12px; color: #a4c6d1; line-height: 1.5;">
              إمكانية إدارة وتخصيص عدد غير محدود من المشاريع (أبراج سكنية، منتجعات ساحلية، مجمعات تجارية) من لوحة تحكم واحدة، مع روابط معاينة مستقلة وخاصة بكل مشروع.
            </p>
          </div>

          <div class="feature-card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              ${neonBox(neonSvg('user', 'purple', 18), 'purple', 32)}
              <h4 style="font-size: 14px; font-weight: 800; color: #c084fc;">تخصيص نبرة وصوت الذكاء الاصطناعي</h4>
            </div>
            <p style="font-size: 12px; color: #a4c6d1; line-height: 1.5;">
              اختيار طبقة الصوت من مكتبة الأصوات البشرية المعتمدة، مع تحديد الأسلوب الحواري: (مستشار عقاري خبير ومقنع، ودود ومرحب، رسمي وتنفيذي، أو حماسي وبيعي) ليتوافق تماماً مع شريحة العملاء المستهدفة.
            </p>
          </div>

          <div class="feature-card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              ${neonBox(neonSvg('cloud', 'yellow', 18), 'yellow', 32)}
              <h4 style="font-size: 14px; font-weight: 800; color: #fcd34d;">حقن وتحديث قاعدة المعرفة لحظياً</h4>
            </div>
            <p style="font-size: 12px; color: #a4c6d1; line-height: 1.5;">
              تغذية النظام بكتالوج المشروع، جداول التسليم، الشروط التمويلية، وخطط الأقساط دون الحاجة لأي كود برمجي، مع تطبيق التحديثات فورياً في ثوانٍ معدودة.
            </p>
          </div>

          <div class="feature-card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              ${neonBox(neonSvg('lightning', 'cyan', 18), 'cyan', 32)}
              <h4 style="font-size: 14px; font-weight: 800; color: #00d9b5;">التحكم بالحصص وتفعيل وضع الصيانة</h4>
            </div>
            <p style="font-size: 12px; color: #a4c6d1; line-height: 1.5;">
              مراقبة رصيد دقائق التحدث الصوتي على مستوى الحساب بالكامل، وإمكانية إيقاف أو تفعيل المعاينة العامة للمشروع بضغطة زر واحدة أثناء فترات التحديث والتطوير.
            </p>
          </div>
        </div>
      </div>
    </div>

    <footer class="page-footer">
      <span>سيتي سكيل للمجسمات المعمارية والحلول الذكية — City Scale 2026</span>
      <span>03 / مركز التحكم وإدارة المشاريع المتعددة</span>
    </footer>
  </div>


  <!-- ===================================================================== -->
  <!-- PAGE 5: ANALYTICS & LEADS PIPELINE (لوحة التحليلات ومسار المبيعات)     -->
  <!-- ===================================================================== -->
  <div class="page bg-dark-slate">
    ${svgCubePattern}

    <header class="page-header">
      <div class="page-header-left">
        <img src="${logoDataUri}" style="height: 38px; width: 38px; border-radius: 8px; background: #fff; padding: 2px;">
        <span style="font-size: 15px; font-weight: 800; color: #fff;">سيتي سكيل | City Scale</span>
        <span style="color: rgba(255,255,255,0.2);">|</span>
        <span style="font-size: 13px; color: #00d9b5; font-weight: 700;">Ai Smart Model</span>
      </div>
      <div class="page-header-right">
        <span class="pill-badge">04 / التحليلات وخط المبيعات</span>
      </div>
    </header>

    <div class="page-body">
      <div>
        <div class="pill-solid" style="margin-bottom: 6px;">ذكاء الأعمال والتحليلات البيعية</div>
        <h2 style="font-size: 24px; font-weight: 900; color: #fff; line-height: 1.2;">
          تتبع دقيق لمعدلات التحويل وتصنيف آلي لإشارات الشراء (Buying Signals)
        </h2>
      </div>

      <!-- Split Layout: Analytics & Leads Screenshots side-by-side -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 10px 0;">
        <!-- Left: Analytics Dashboard Screenshot -->
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; font-weight: 800; color: #00d9b5; display: inline-flex; align-items: center; gap: 8px;">
              ${neonSvg('chart', 'cyan', 18)} لوحة التحليلات ومعدلات التفاعل
            </span>
            <span style="font-size: 11px; color: #94b5c0;">تحديث لحظي للزيارات</span>
          </div>
          <div class="screenshot-frame" style="height: 200px;">
            <img src="${screenAnalytics}" alt="Admin Analytics Dashboard">
          </div>
          <p style="font-size: 12px; color: #a4c6d1; margin-top: 8px; line-height: 1.4;">
            مراقبة شاملة لإجمالي الزوار، متوسط مدة الجلسة الصوتية، عدد العملاء المتواصلين عبر واتساب، ونسبة التحويل اليومية مقارنة بالمعدلات القياسية.
          </p>
        </div>

        <!-- Right: Leads CRM Screenshot -->
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; font-weight: 800; color: #38bdf8; display: inline-flex; align-items: center; gap: 8px;">
              ${neonSvg('briefcase', 'magenta', 18)} خط أنابيب العملاء المحتملين (Leads CRM)
            </span>
            <span style="font-size: 11px; color: #94b5c0;">تصنيف آلي وفق النية الشرائية</span>
          </div>
          <div class="screenshot-frame" style="height: 200px;">
            <img src="${screenLeads}" alt="Admin Leads Pipeline">
          </div>
          <p style="font-size: 12px; color: #a4c6d1; margin-top: 8px; line-height: 1.4;">
            سجل حي لكل عميل يتضمن رقم هاتفه، نوع الوحدة المطلوبة، الخطة التمويلية، وتصنيف الأهمية (عميل مؤهل للشراء / يحتاج مساعدة خاصة / صفقات مغلقة).
          </p>
        </div>
      </div>

      <!-- 3 Key Analytical Benefits Cards with NEON ICONS -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
        <div style="background: rgba(0, 40, 52, 0.7); border: 1px solid rgba(0, 217, 181, 0.25); border-radius: 16px; padding: 14px 18px;">
          <h4 style="font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
            ${neonSvg('lightning', 'yellow', 16)} سرعة إغلاق الصفقات
          </h4>
          <p style="font-size: 11px; color: #a4c6d1; line-height: 1.4;">
            يحصل مندوب المبيعات على ملخص متكامل لاحتياجات العميل وميزانيته قبل الاتصال به، مما يختصر وقت التفاوض بأكثر من 50%.
          </p>
        </div>

        <div style="background: rgba(0, 40, 52, 0.7); border: 1px solid rgba(0, 217, 181, 0.25); border-radius: 16px; padding: 14px 18px;">
          <h4 style="font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
            ${neonSvg('target', 'purple', 16)} كشف النية الشرائية الخفية
          </h4>
          <p style="font-size: 11px; color: #a4c6d1; line-height: 1.4;">
            تحليل نبرة العميل والأسئلة المتكررة لتحديد الوحدات الأكثر طلباً وتوجيه الحملات الإعلانية نحوها لتعظيم العائد.
          </p>
        </div>

        <div style="background: rgba(0, 40, 52, 0.7); border: 1px solid rgba(0, 217, 181, 0.25); border-radius: 16px; padding: 14px 18px;">
          <h4 style="font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
            ${neonSvg('folder', 'cyan', 16)} تصدير وتنظيم كامل للبيانات
          </h4>
          <p style="font-size: 11px; color: #a4c6d1; line-height: 1.4;">
            تبويب منفصل لكل مشروع على غرار جداول Excel لتسهيل تتبع الحملات التسويقية وربط البيانات مع أنظمة CRM المركزية.
          </p>
        </div>
      </div>
    </div>

    <footer class="page-footer">
      <span>سيتي سكيل للمجسمات المعمارية والحلول الذكية — City Scale 2026</span>
      <span>04 / الذكاء البيعي وإدارة العملاء المحتملين</span>
    </footer>
  </div>


  <!-- ===================================================================== -->
  <!-- PAGE 6: COMPANY CLOSING & CONTACT DATA (خاتمة وبيانات الشركة الرسمية) -->
  <!-- ===================================================================== -->
  <div class="page bg-teal-gradient" style="justify-content: space-between; padding: 44px 64px 32px;">
    ${svgCubePattern}

    <!-- Ambient glow circles -->
    <div style="position: absolute; top: -120px; right: -120px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 217, 181, 0.2) 0%, transparent 70%); pointer-events: none;"></div>
    <div style="position: absolute; bottom: -120px; left: -120px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 105, 128, 0.3) 0%, transparent 70%); pointer-events: none;"></div>

    <!-- Top: Centered Logo & Brand -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; z-index: 10;">
      <img src="${logoDataUri}" style="height: 70px; width: 70px; border-radius: 16px; background: #fff; padding: 5px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-bottom: 12px;">
      <h2 style="font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">City Scale</h2>
      <p style="font-size: 13px; color: #00d9b5; font-weight: 700;">Physical & Visual modeling Co. — since 1998</p>
    </div>

    <!-- Center: Thank you & Closing statement -->
    <div style="text-align: center; z-index: 10; margin: 16px 0;">
      <h1 style="font-size: 64px; font-weight: 900; color: #00d9b5; letter-spacing: -1px; margin-bottom: 6px; text-shadow: 0 4px 25px rgba(0, 217, 181, 0.3);">
        شكــــــراً لكــــــم
      </h1>
      <p style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 18px;">
        THANK YOU
      </p>
      <div style="width: 100px; height: 3px; background: linear-gradient(90deg, transparent, #00d9b5, transparent); margin: 0 auto 16px;"></div>
      <p style="font-size: 16px; color: #d1e4eb; max-width: 650px; margin: 0 auto; line-height: 1.6; font-weight: 600;">
        سيتي سكيل للمجسمات المعمارية والحلول الذكية
      </p>
    </div>

    <!-- Bottom: Contact Cards with NEON ICONS -->
    <div style="z-index: 10; width: 100%;">
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; max-width: 950px; margin: 0 auto;">
        <!-- Egypt -->
        <div style="background: rgba(0, 30, 38, 0.85); border: 1px solid rgba(0, 217, 181, 0.35); border-radius: 20px; padding: 22px 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <div style="margin-bottom: 8px; display: flex; justify-content: center;">
            ${neonBox(neonSvg('phone', 'cyan', 24), 'cyan', 44)}
          </div>
          <p style="font-size: 13px; font-weight: 700; color: #94b5c0;">مصــــر | Egypt</p>
          <p style="font-size: 20px; font-weight: 900; color: #fff; direction: ltr; margin-top: 6px; font-family: 'Inter', sans-serif; letter-spacing: 0.5px;">
            +20-1002533951
          </p>
        </div>

        <!-- KSA -->
        <div style="background: rgba(0, 30, 38, 0.85); border: 1px solid #00d9b5; border-radius: 20px; padding: 22px 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <div style="margin-bottom: 8px; display: flex; justify-content: center;">
            ${neonBox(neonSvg('phone', 'green', 24), 'green', 44)}
          </div>
          <p style="font-size: 13px; font-weight: 700; color: #94b5c0;">المملكة العربية السعودية | KSA</p>
          <p style="font-size: 20px; font-weight: 900; color: #00d9b5; direction: ltr; margin-top: 6px; font-family: 'Inter', sans-serif; letter-spacing: 0.5px;">
            +966-561617185
          </p>
        </div>

        <!-- Online / Tax ID -->
        <div style="background: rgba(0, 30, 38, 0.85); border: 1px solid rgba(0, 217, 181, 0.35); border-radius: 20px; padding: 22px 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <div style="margin-bottom: 8px; display: flex; justify-content: center;">
            ${neonBox(neonSvg('web', 'yellow', 24), 'yellow', 44)}
          </div>
          <p style="font-size: 13px; font-weight: 700; color: #94b5c0;">الموقع والسجل الضريبي</p>
          <p style="font-size: 18px; font-weight: 900; color: #fff; margin-top: 6px; font-family: 'Inter', sans-serif;">
            CITY-SCALE.COM
          </p>
          <p style="font-size: 11px; color: #7d9ba6; margin-top: 4px;">رقم التسجيل: 589-581-708</p>
        </div>
      </div>

      <!-- Bottom Note -->
      <div style="text-align: center; margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 13px; font-weight: 700; color: #00d9b5;">
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          ${neonSvg('lightning', 'cyan', 16)} تواصل معنا الآن ويصلك عرض السعر والعرض الفني خلال 24 ساعة فقط
        </span>
      </div>
    </div>
  </div>

</body>
</html>`;

const outHtmlPath = path.join(scriptDir, 'brochure_print.html');
fs.writeFileSync(outHtmlPath, htmlContent, 'utf8');
console.log('brochure_print.html written successfully.');

// Target PDF output path
const outPdfPath = path.resolve(projectRootDir, 'Ai_Smart_Model_Sales_Brochure_CityScale.pdf');

console.log('Generating final PDF with Edge headless...');
try {
  execFileSync(edgePath, [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${outPdfPath}`,
    outHtmlPath,
  ]);

  if (fs.existsSync(outPdfPath)) {
    const size = fs.statSync(outPdfPath).size;
    console.log(`✅ PDF generated successfully!`);
    console.log(`File: ${outPdfPath}`);
    console.log(`Size: ${(size / (1024 * 1024)).toFixed(2)} MB (${size} bytes)`);
  } else {
    console.error('❌ PDF file was not created.');
  }
} catch (err) {
  console.error('PDF generation error:', err.message);
}
