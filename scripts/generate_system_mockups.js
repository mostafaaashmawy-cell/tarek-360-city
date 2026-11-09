const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.resolve(__dirname, 'mockup_screens');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Read logo as base64
const logoPath = path.resolve(__dirname, '../public/city-scale-logo.png');
const logoB64 = fs.readFileSync(logoPath).toString('base64');
const logoDataUri = `data:image/jpeg;base64,${logoB64}`;

// Common CSS Styles for high-fidelity dark UI
const commonHead = `
<meta charset="utf-8">
<meta name="viewport" content="width=1440, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Cairo', 'Tajawal', sans-serif;
    background-color: #0c1015;
    color: #ffffff;
    width: 1440px;
    height: 900px;
    overflow: hidden;
    position: relative;
    -webkit-font-smoothing: antialiased;
  }
  .glass {
    background: rgba(20, 26, 34, 0.75);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .glass-card {
    background: rgba(25, 33, 44, 0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(0, 194, 203, 0.2);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  }
</style>
`;

// ── SCREEN 1: 360 Virtual Tour + AI Button + Dynamic Smart Cards ──────────────
const screen1Html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  ${commonHead}
  <style>
    .bg-3d {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 70% 30%, #003644 0%, #051921 50%, #030c10 100%);
      overflow: hidden;
    }
    /* SVG architectural interior wireframe & render backdrop */
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(0, 217, 181, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 217, 181, 0.05) 1px, transparent 1px);
      background-size: 60px 60px;
      perspective: 800px;
    }
    .arch-skyline {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60%;
      background: linear-gradient(180deg, transparent 0%, rgba(0, 72, 92, 0.2) 60%, rgba(2, 20, 26, 0.8) 100%);
    }
    .top-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 76px;
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 50;
      background: linear-gradient(180deg, rgba(8, 16, 22, 0.95) 0%, rgba(8, 16, 22, 0.6) 80%, transparent 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }
    .cards-panel {
      position: absolute;
      top: 96px;
      right: 32px;
      width: 360px;
      z-index: 40;
      background: rgba(12, 19, 26, 0.92);
      border: 1px solid rgba(0, 217, 181, 0.25);
      border-radius: 24px;
      box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0, 217, 181, 0.1);
      overflow: hidden;
    }
    .ai-btn-box {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      z-index: 50;
    }
    .ai-btn {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00d9b5 0%, #008fa6 100%);
      box-shadow: 0 0 45px rgba(0, 217, 181, 0.6), 0 0 80px rgba(0, 143, 166, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
    }
    .pulse-ring {
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 2px solid rgba(0, 217, 181, 0.5);
    }
    .whatsapp-btn {
      position: absolute;
      bottom: 40px;
      left: 32px;
      padding: 14px 24px;
      border-radius: 20px;
      background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 15px 35px rgba(37, 211, 102, 0.35);
      z-index: 50;
    }
    .compass-nav {
      position: absolute;
      top: 96px;
      left: 32px;
      padding: 12px 18px;
      border-radius: 16px;
      background: rgba(10, 16, 22, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="bg-3d">
    <div class="grid-lines"></div>
    <div class="arch-skyline"></div>
    <!-- 3D Interior Mockup SVG Graphics -->
    <svg style="position: absolute; inset: 0; width: 100%; height: 100%;" preserveAspectRatio="none" viewBox="0 0 1440 900">
      <!-- Luxury Modern Penthouse Interior perspective lines -->
      <polygon points="0,0 350,220 350,680 0,900" fill="rgba(6, 25, 34, 0.7)" stroke="rgba(0, 217, 181, 0.15)" stroke-width="1.5"/>
      <polygon points="1440,0 1090,220 1090,680 1440,900" fill="rgba(6, 25, 34, 0.7)" stroke="rgba(0, 217, 181, 0.15)" stroke-width="1.5"/>
      <polygon points="350,220 1090,220 1090,680 350,680" fill="none" stroke="rgba(0, 217, 181, 0.2)" stroke-width="2"/>
      
      <!-- Panoramic Window Skyline -->
      <circle cx="720" cy="380" r="140" fill="url(#sun-glow)" opacity="0.3"/>
      <defs>
        <radialGradient id="sun-glow">
          <stop offset="0%" stop-color="#00d9b5" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#003644" stop-opacity="0"/>
        </radialGradient>
      </defs>
      
      <!-- Tower outlines in distance -->
      <rect x="420" y="320" width="60" height="360" fill="rgba(0, 80, 100, 0.35)" stroke="rgba(0, 217, 181, 0.2)"/>
      <rect x="510" y="260" width="85" height="420" fill="rgba(0, 95, 120, 0.4)" stroke="rgba(0, 217, 181, 0.25)"/>
      <polygon points="552,210 510,260 595,260" fill="rgba(0, 120, 140, 0.5)"/>
      <rect x="620" y="340" width="55" height="340" fill="rgba(0, 70, 90, 0.35)" stroke="rgba(0, 217, 181, 0.15)"/>
      <rect x="700" y="280" width="110" height="400" fill="rgba(0, 110, 135, 0.45)" stroke="rgba(0, 217, 181, 0.3)"/>
      <rect x="835" y="310" width="70" height="370" fill="rgba(0, 85, 105, 0.35)" stroke="rgba(0, 217, 181, 0.2)"/>
      <rect x="930" y="360" width="65" height="320" fill="rgba(0, 65, 80, 0.3)" stroke="rgba(0, 217, 181, 0.15)"/>
      
      <!-- Modern balcony balustrade glass -->
      <line x1="350" y1="580" x2="1090" y2="580" stroke="rgba(255, 255, 255, 0.3)" stroke-width="3"/>
      <rect x="350" y="580" width="740" height="100" fill="rgba(0, 217, 181, 0.08)"/>
      
      <!-- 360 Hotspots -->
      <g transform="translate(600, 480)">
        <circle r="16" fill="rgba(0, 217, 181, 0.2)" stroke="#00d9b5" stroke-width="2"/>
        <circle r="6" fill="#00d9b5"/>
        <text x="24" y="5" fill="#fff" font-size="13" font-weight="700" text-anchor="start">الصالة البانورامية</text>
      </g>
      <g transform="translate(850, 440)">
        <circle r="16" fill="rgba(0, 217, 181, 0.2)" stroke="#00d9b5" stroke-width="2"/>
        <circle r="6" fill="#00d9b5"/>
        <text x="24" y="5" fill="#fff" font-size="13" font-weight="700" text-anchor="start">التراس الفاخر</text>
      </g>
    </svg>
  </div>

  <!-- Top Header -->
  <header class="top-header">
    <div style="display: flex; align-items: center; gap: 16px;">
      <img src="${logoDataUri}" style="height: 48px; width: 48px; border-radius: 12px; background: #fff; padding: 4px; object-fit: contain;">
      <div>
        <h2 style="font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.3px;">البرج الكبير | The Grand Tower</h2>
        <p style="font-size: 12px; color: #00d9b5; font-weight: 600;">سيتي سكيل للمجسمات المعمارية والذكاء الاصطناعي</p>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 16px;">
      <div style="display: flex; align-items: center; gap: 8px; background: rgba(0, 217, 181, 0.12); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(0, 217, 181, 0.3);">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #00d9b5; box-shadow: 0 0 10px #00d9b5;"></span>
        <span style="font-size: 12px; font-weight: 700; color: #00d9b5;">جولة حية 360° تفاعلية</span>
      </div>
      <div style="background: rgba(255,255,255,0.06); padding: 6px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #cbd5e1; font-weight: 600;">
        العربية | EN
      </div>
    </div>
  </header>

  <!-- Compass / Floor Navigator -->
  <div class="compass-nav">
    <span style="color: #00d9b5; font-weight: 700;">🧭 الدور 28</span>
    <span>|</span>
    <span>الجناح الملكي البانورامي</span>
    <span>|</span>
    <span style="color: #fff; font-weight: 700;">إطلالة بحرية كاملة 360°</span>
  </div>

  <!-- Smart Cards Panel (Synced in real time with AI Speech - Strictly NO prices) -->
  <div class="cards-panel">
    <div style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="width: 10px; height: 10px; border-radius: 50%; background: #00d9b5; box-shadow: 0 0 12px #00d9b5;"></span>
        <h3 style="font-size: 15px; font-weight: 800; color: #fff;">ملخص العرض العقاري</h3>
      </div>
      <span style="font-size: 11px; background: rgba(0, 217, 181, 0.15); color: #00d9b5; padding: 3px 8px; border-radius: 6px; font-weight: 700;">تزامن فوري</span>
    </div>
    
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">
      <!-- Card 1 -->
      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(16, 185, 129, 0.2); display: flex; align-items: center; justify-content: center; font-size: 20px;">💎</div>
        <div>
          <p style="font-size: 11px; color: #6ee7b7; font-weight: 700; text-transform: uppercase;">نظام السداد والتقسيط</p>
          <p style="font-size: 14px; color: #fff; font-weight: 700;">أقساط مرنة ممتدة حتى 7 سنوات بدون فوائد</p>
        </div>
      </div>

      <!-- Card 2 -->
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(59, 130, 246, 0.2); display: flex; align-items: center; justify-content: center; font-size: 20px;">💰</div>
        <div>
          <p style="font-size: 11px; color: #93c5fd; font-weight: 700; text-transform: uppercase;">مقدم التعاقد</p>
          <p style="font-size: 14px; color: #fff; font-weight: 700;">10% فقط مع خيارات دفع مرنة ربع سنوية</p>
        </div>
      </div>

      <!-- Card 3 -->
      <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(139, 92, 246, 0.2); display: flex; align-items: center; justify-content: center; font-size: 20px;">📐</div>
        <div>
          <p style="font-size: 11px; color: #c4b5fd; font-weight: 700; text-transform: uppercase;">مساحة وتقسيم الوحدة</p>
          <p style="font-size: 14px; color: #fff; font-weight: 700;">142 م² (2 غرفة نوم ماستر + ريسبشن + تراس)</p>
        </div>
      </div>

      <!-- Card 4 -->
      <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(245, 158, 11, 0.2); display: flex; align-items: center; justify-content: center; font-size: 20px;">🏗️</div>
        <div>
          <p style="font-size: 11px; color: #fcd34d; font-weight: 700; text-transform: uppercase;">موعد ونوع التسليم</p>
          <p style="font-size: 14px; color: #fff; font-weight: 700;">الربع الرابع 2027 — تشطيب ألترا لوكس متكامل</p>
        </div>
      </div>

      <!-- Card 5 -->
      <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(244, 63, 94, 0.2); display: flex; align-items: center; justify-content: center; font-size: 20px;">✨</div>
        <div>
          <p style="font-size: 11px; color: #fda4af; font-weight: 700; text-transform: uppercase;">المميزات الاستثنائية</p>
          <p style="font-size: 14px; color: #fff; font-weight: 700;">أنظمة ذكية بالكامل · مسبح معلق · 2 موقف خاص</p>
        </div>
      </div>
    </div>
    <div style="padding: 10px 16px 14px; text-align: center; font-size: 11px; color: #64748b;">
      تتغير البطاقات تلقائياً مع توجيهات المساعد الصوتي
    </div>
  </div>

  <!-- Multimodal Voice AI Agent Button -->
  <div class="ai-btn-box">
    <div style="background: rgba(0, 217, 181, 0.2); border: 1px solid rgba(0, 217, 181, 0.4); padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; color: #00d9b5; display: flex; align-items: center; gap: 8px;">
      <span>🎙️ اضغط مطولاً للتحدث مع المستشار العقاري</span>
    </div>
    <div class="ai-btn">
      <div class="pulse-ring"></div>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="#0c1015">
        <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm7 10a1 1 0 1 1 2 0 9 9 0 0 1-18 0 1 1 0 1 1 2 0 7 7 0 0 0 14 0zm-8 9h2v2h-2v-2z"/>
      </svg>
    </div>
    <span style="font-size: 13px; font-weight: 700; color: #fff;">المستشار الصوتي الذكي (Google Gemini Live)</span>
  </div>

  <!-- WhatsApp Action -->
  <div class="whatsapp-btn">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
    </svg>
    <span>تواصل فوري عبر واتساب</span>
  </div>
</body>
</html>`;

// ── SCREEN 2: Mandatory Lead Capture Modal ──────────────────────────────────────
const screen2Html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  ${commonHead}
  <style>
    .backdrop {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(0, 54, 68, 0.85) 0%, rgba(5, 18, 24, 0.95) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-box {
      width: 540px;
      background: linear-gradient(135deg, rgba(16, 26, 36, 0.96) 0%, rgba(8, 16, 22, 0.98) 100%);
      border: 1px solid rgba(0, 217, 181, 0.35);
      border-radius: 32px;
      padding: 44px;
      box-shadow: 0 35px 80px rgba(0,0,0,0.8), 0 0 50px rgba(0, 217, 181, 0.18);
      position: relative;
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 18px;
      border-radius: 20px;
      background: rgba(0, 217, 181, 0.15);
      border: 1px solid rgba(0, 217, 181, 0.3);
      color: #00d9b5;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .input-group {
      margin-top: 20px;
      text-align: right;
    }
    .input-group label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: #cbd5e1;
      margin-bottom: 8px;
    }
    .input-field {
      width: 100%;
      height: 52px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 0 20px;
      color: #fff;
      font-size: 15px;
      font-family: inherit;
      outline: none;
      display: flex;
      align-items: center;
    }
    .submit-btn {
      margin-top: 28px;
      width: 100%;
      height: 54px;
      border-radius: 16px;
      background: linear-gradient(135deg, #00d9b5 0%, #008fa6 100%);
      color: #0c1015;
      font-size: 16px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 15px 35px rgba(0, 217, 181, 0.35);
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="backdrop">
    <div class="modal-box">
      <div class="badge">
        <span>✨ استشارة عقارية تفاعلية مخصصة</span>
      </div>
      <h2 style="font-size: 26px; font-weight: 900; color: #fff; margin-bottom: 12px; line-height: 1.3;">
        لمتابعة استشارتك وجولتك الذكية
      </h2>
      <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
        يرجى مشاركة اسمك ورقم هاتفك لنتمكن من تزويدك بأدق التفاصيل والكتالوج الهندسي المناسب لمتطلباتك في مشروع <strong style="color: #00d9b5;">البرج الكبير</strong>.
      </p>

      <div class="input-group">
        <label>الاسم بالكامل:</label>
        <div class="input-field" style="border-color: rgba(0, 217, 181, 0.5); background: rgba(0, 217, 181, 0.05);">
          <span style="color: #fff; font-weight: 600;">أحمد حسن عبد الرحمن</span>
        </div>
      </div>

      <div class="input-group">
        <label>رقم الهاتف المحمول (واتساب):</label>
        <div class="input-field" style="direction: ltr; justify-content: flex-end;">
          <span style="color: #fff; font-weight: 700; font-family: 'Inter', sans-serif;">+20 100 123 4567</span>
          <span style="margin-left: 12px; color: #94a3b8;">📱</span>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 18px; font-size: 12px; color: #64748b;">
        <span>🔒 بياناتك محمية ومشفرة وتستخدم فقط لتقديم الاستشارة العقارية</span>
      </div>

      <div class="submit-btn">
        <span>متابعة الاستشارة الصوتية مع ليلى</span>
        <span>←</span>
      </div>
    </div>
  </div>
</body>
</html>`;

// ── SCREEN 3: Admin Analytics Dashboard ───────────────────────────────────────
const screen3Html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  ${commonHead}
  <style>
    .layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      height: 900px;
    }
    .sidebar {
      background: #090e13;
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      padding: 28px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 700;
      color: #94a3b8;
      margin-bottom: 6px;
    }
    .nav-item.active {
      background: rgba(0, 217, 181, 0.12);
      color: #00d9b5;
      border: 1px solid rgba(0, 217, 181, 0.3);
    }
    .main-content {
      padding: 32px 40px;
      overflow-y: auto;
      background: radial-gradient(circle at top right, #0b1c24 0%, #080f14 100%);
    }
    .quota-card {
      background: linear-gradient(135deg, rgba(0, 77, 97, 0.25) 0%, rgba(12, 22, 30, 0.95) 100%);
      border: 1px solid rgba(0, 217, 181, 0.3);
      border-radius: 20px;
      padding: 20px 24px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: rgba(16, 24, 32, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 20px;
    }
    .chart-container {
      background: rgba(16, 24, 32, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 24px;
    }
  </style>
</head>
<body>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 36px; padding-right: 8px;">
          <img src="${logoDataUri}" style="height: 42px; width: 42px; border-radius: 10px; background: #fff; padding: 3px;">
          <div>
            <h3 style="font-size: 15px; font-weight: 900; color: #fff;">سيتي سكيل</h3>
            <p style="font-size: 11px; color: #00d9b5; font-weight: 700;">Ai Smart Model</p>
          </div>
        </div>
        <nav>
          <div class="nav-item active">📊 لوحة التحليلات المتقدمة</div>
          <div class="nav-item">💬 عملاء واتساب (CRM)</div>
          <div class="nav-item">⚙️ إعدادات المشاريع والصوت</div>
          <div class="nav-item">🌐 معاينة الجولة الحية 360°</div>
        </nav>
      </div>
      <div style="padding: 16px; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);">
        <p style="font-size: 11px; color: #64748b;">حساب المطور العقاري:</p>
        <p style="font-size: 13px; font-weight: 700; color: #fff; margin-top: 2px;">City Scale Enterprise</p>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 900; color: #fff;">تحليلات التفاعل والمبيعات الذكية</h1>
          <p style="font-size: 13px; color: #94a3b8; margin-top: 4px;">تتبع زيارات المجسمات وتحويلات العملاء المحتملين عبر الذكاء الاصطناعي</p>
        </div>
        <!-- Project Switcher Tabs -->
        <div style="display: flex; background: rgba(255,255,255,0.05); padding: 4px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="background: #00d9b5; color: #0c1015; padding: 8px 16px; border-radius: 10px; font-weight: 800; font-size: 13px;">جميع المشاريع (1,284)</div>
          <div style="color: #cbd5e1; padding: 8px 16px; font-weight: 600; font-size: 13px;">البرج الكبير (796)</div>
          <div style="color: #cbd5e1; padding: 8px 16px; font-weight: 600; font-size: 13px;">مارينا باي (488)</div>
        </div>
      </div>

      <!-- Quota Card -->
      <div class="quota-card">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 14px; background: rgba(0, 217, 181, 0.2); display: flex; align-items: center; justify-content: center; font-size: 24px;">⚡</div>
          <div>
            <h3 style="font-size: 16px; font-weight: 800; color: #fff;">رصيد دقائق التحدث الذكية (Google Gemini Live)</h3>
            <p style="font-size: 12px; color: #94a3b8;">إجمالي حصة الصوت المتاحة للمشاريع: <strong style="color: #00d9b5;">120.00 دقيقة تشغيلية نشطة</strong></p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #6ee7b7; padding: 6px 14px; border-radius: 10px; font-size: 12px; font-weight: 700;">
            ✓ النظام يعمل بكفاءة 100%
          </span>
          <div style="background: linear-gradient(135deg, #00d9b5, #008fa6); color: #0c1015; font-weight: 800; font-size: 13px; padding: 10px 20px; border-radius: 12px;">
            + إضافة دقائق
          </div>
        </div>
      </div>

      <!-- KPI Cards Grid -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">إجمالي الزيارات</p>
          <p style="font-size: 30px; font-weight: 900; color: #fff; margin: 8px 0;">1,284</p>
          <span style="font-size: 12px; color: #00d9b5; font-weight: 700;">↑ 12% مقارنة بالأسبوع الماضي</span>
        </div>
        <div class="kpi-card">
          <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">متوسط مدة الجلسة</p>
          <p style="font-size: 30px; font-weight: 900; color: #fff; margin: 8px 0;">4m 45s</p>
          <span style="font-size: 12px; color: #00d9b5; font-weight: 700;">↑ 8% تفاعل صوتي مرتفع</span>
        </div>
        <div class="kpi-card">
          <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">عملاء واتساب المحولين</p>
          <p style="font-size: 30px; font-weight: 900; color: #00d9b5; margin: 8px 0;">94</p>
          <span style="font-size: 12px; color: #00d9b5; font-weight: 700;">↑ 22% طلب حجز واستفسار</span>
        </div>
        <div class="kpi-card">
          <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">معدل التحويل البيعي</p>
          <p style="font-size: 30px; font-weight: 900; color: #38bdf8; margin: 8px 0;">7.3%</p>
          <span style="font-size: 12px; color: #38bdf8; font-weight: 700;">أعلى بـ 3 أضعاف من المعدل التقليدي</span>
        </div>
      </div>

      <!-- Chart Simulation Container -->
      <div class="chart-container">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 800; color: #fff;">مخطط تدفق الزوار وتحويلات المبيعات اليومية</h3>
            <p style="font-size: 12px; color: #64748b;">مقارنة عدد زوار المجسم ثلاثي الأبعاد والعملاء المتواصلين عبر واتساب</p>
          </div>
          <div style="display: flex; gap: 12px; font-size: 12px;">
            <span style="display: flex; align-items: center; gap: 6px; color: #00d9b5;"><span style="width: 10px; height: 10px; background: #00d9b5; border-radius: 50%;"></span> الزيارات اليومية</span>
            <span style="display: flex; align-items: center; gap: 6px; color: #38bdf8;"><span style="width: 10px; height: 10px; background: #38bdf8; border-radius: 50%;"></span> عملاء واتساب</span>
          </div>
        </div>

        <!-- SVG Line Chart Visual -->
        <svg width="100%" height="160" viewBox="0 0 1000 160" preserveAspectRatio="none">
          <!-- Grid lines -->
          <line x1="0" y1="30" x2="1000" y2="30" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          <line x1="0" y1="80" x2="1000" y2="80" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          <line x1="0" y1="130" x2="1000" y2="130" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          
          <!-- Area Fill -->
          <path d="M0,140 L140,110 L280,95 L420,70 L560,85 L700,50 L840,40 L1000,60 L1000,160 L0,160 Z" fill="url(#chart-grad)" opacity="0.25"/>
          <defs>
            <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#00d9b5"/>
              <stop offset="100%" stop-color="#00d9b5" stop-opacity="0"/>
            </linearGradient>
          </defs>
          
          <!-- Line 1: Visitors -->
          <path d="M0,140 L140,110 L280,95 L420,70 L560,85 L700,50 L840,40 L1000,60" fill="none" stroke="#00d9b5" stroke-width="3.5"/>
          
          <!-- Line 2: Leads -->
          <path d="M0,150 L140,140 L280,132 L420,118 L560,126 L700,105 L840,95 L1000,110" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="4 4"/>

          <!-- Nodes -->
          <circle cx="700" cy="50" r="5" fill="#00d9b5"/>
          <circle cx="840" cy="40" r="6" fill="#fff" stroke="#00d9b5" stroke-width="3"/>
        </svg>

        <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 11px; color: #64748b; direction: ltr;">
          <span>Aug 13</span>
          <span>Aug 14</span>
          <span>Aug 15</span>
          <span>Aug 16</span>
          <span>Aug 17</span>
          <span>Aug 18</span>
          <span>Aug 19 (Today)</span>
        </div>
      </div>
    </main>
  </div>
</body>
</html>`;

// ── SCREEN 4: Admin Leads CRM Pipeline ─────────────────────────────────────────
const screen4Html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  ${commonHead}
  <style>
    .layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      height: 900px;
    }
    .sidebar {
      background: #090e13;
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      padding: 28px 20px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 700;
      color: #94a3b8;
      margin-bottom: 6px;
    }
    .nav-item.active {
      background: rgba(0, 217, 181, 0.12);
      color: #00d9b5;
      border: 1px solid rgba(0, 217, 181, 0.3);
    }
    .main-content {
      padding: 32px 40px;
      overflow-y: auto;
      background: radial-gradient(circle at top right, #0b1c24 0%, #080f14 100%);
    }
    .lead-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 8px;
      margin-top: 16px;
    }
    .lead-table th {
      text-align: right;
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }
    .lead-row {
      background: rgba(16, 24, 32, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      transition: all 0.2s;
    }
    .lead-row td {
      padding: 16px;
      font-size: 13px;
      color: #fff;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 800;
    }
    .status-qualified {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
    }
    .status-assist {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
    }
    .status-new {
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.35);
      color: #a5b4fc;
    }
    .status-closed {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #cbd5e1;
    }
  </style>
</head>
<body>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 36px; padding-right: 8px;">
        <img src="${logoDataUri}" style="height: 42px; width: 42px; border-radius: 10px; background: #fff; padding: 3px;">
        <div>
          <h3 style="font-size: 15px; font-weight: 900; color: #fff;">سيتي سكيل</h3>
          <p style="font-size: 11px; color: #00d9b5; font-weight: 700;">Ai Smart Model</p>
        </div>
      </div>
      <nav>
        <div class="nav-item">📊 لوحة التحليلات المتقدمة</div>
        <div class="nav-item active">💬 عملاء واتساب (CRM)</div>
        <div class="nav-item">⚙️ إعدادات المشاريع والصوت</div>
        <div class="nav-item">🌐 معاينة الجولة الحية 360°</div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 900; color: #fff;">سجل العملاء وإشارات الشراء التفاعلية</h1>
          <p style="font-size: 13px; color: #94a3b8; margin-top: 4px;">بيانات العملاء الملتقطة بواسطة المستشار الذكي مع ملخص المتطلبات وخيارات السداد</p>
        </div>
        <div style="background: rgba(0, 217, 181, 0.15); border: 1px solid rgba(0, 217, 181, 0.3); color: #00d9b5; padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 800;">
          94 عميل مسجل
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px;">
        <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 16px; padding: 14px 18px;">
          <p style="font-size: 11px; color: #a5b4fc; font-weight: 700;">عملاء جدد (لم يفتحوا بعد)</p>
          <p style="font-size: 22px; font-weight: 900; color: #fff; margin-top: 4px;">18 عميل</p>
        </div>
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 16px; padding: 14px 18px;">
          <p style="font-size: 11px; color: #6ee7b7; font-weight: 700;">عملاء مؤهلون للشراء (Qualified)</p>
          <p style="font-size: 22px; font-weight: 900; color: #00d9b5; margin-top: 4px;">42 عميل</p>
        </div>
        <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 16px; padding: 14px 18px;">
          <p style="font-size: 11px; color: #fcd34d; font-weight: 700;">يحتاجون خطة سداد مخصصة</p>
          <p style="font-size: 22px; font-weight: 900; color: #f59e0b; margin-top: 4px;">24 عميل</p>
        </div>
        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 14px 18px;">
          <p style="font-size: 11px; color: #94a3b8; font-weight: 700;">صفقات منجزة ومغلقة</p>
          <p style="font-size: 22px; font-weight: 900; color: #fff; margin-top: 4px;">10 صفقات</p>
        </div>
      </div>

      <!-- Leads Table -->
      <table class="lead-table">
        <thead>
          <tr>
            <th>العميل</th>
            <th>المشروع المستهدف</th>
            <th>المتطلبات وإشارات الشراء الملتقطة بالذكاء الاصطناعي</th>
            <th>الحالة والتصنيف</th>
            <th>الإجراء المباشر</th>
          </tr>
        </thead>
        <tbody>
          <!-- Lead 1 -->
          <tr class="lead-row">
            <td>
              <strong style="font-size: 14px; color: #fff;">أحمد حسن عبد الرحمن</strong>
              <div style="color: #00d9b5; font-size: 12px; font-family: 'Inter'; direction: ltr; text-align: right; margin-top: 2px;">+20 100 123 4567</div>
            </td>
            <td>
              <span style="font-weight: 700; color: #cbd5e1;">البرج الكبير</span>
              <div style="font-size: 11px; color: #64748b;">الأدوار 15–20</div>
            </td>
            <td>
              <p style="font-size: 12px; color: #e2e8f0; line-height: 1.5;">
                مهتم بشقة غرفتين بإطلالة بانورامية كاملة، طلب خطة تقسيط ممتدة لـ 7 سنوات مع مقدم 10%.
              </p>
              <div style="display: flex; gap: 6px; margin-top: 6px;">
                <span style="background: rgba(0, 217, 181, 0.15); color: #00d9b5; font-size: 10px; padding: 2px 8px; border-radius: 6px;">جاهز للزيارة</span>
                <span style="background: rgba(255,255,255,0.06); color: #94a3b8; font-size: 10px; padding: 2px 8px; border-radius: 6px;">سكن عائلي</span>
              </div>
            </td>
            <td>
              <span class="status-badge status-qualified">✨ عميل مؤهل عالي الأهمية</span>
            </td>
            <td>
              <button style="background: #25d366; color: #fff; border: none; padding: 8px 14px; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <span>محادثة واتساب</span>
              </button>
            </td>
          </tr>

          <!-- Lead 2 -->
          <tr class="lead-row">
            <td>
              <strong style="font-size: 14px; color: #fff;">سارة خليل</strong>
              <div style="color: #00d9b5; font-size: 12px; font-family: 'Inter'; direction: ltr; text-align: right; margin-top: 2px;">+20 111 987 6543</div>
            </td>
            <td>
              <span style="font-weight: 700; color: #cbd5e1;">مارينا باي ريزيدنسز</span>
              <div style="font-size: 11px; color: #64748b;">شاليهات اللاجون</div>
            </td>
            <td>
              <p style="font-size: 12px; color: #e2e8f0; line-height: 1.5;">
                مستثمرة عقارية تبحث عن شاليه غرفة واحدة بهدف تحقيق عائد إيجاري، تفضل الإطلالة المباشرة على البحيرة.
              </p>
              <div style="display: flex; gap: 6px; margin-top: 6px;">
                <span style="background: rgba(0, 217, 181, 0.15); color: #00d9b5; font-size: 10px; padding: 2px 8px; border-radius: 6px;">استثمار عقاري</span>
              </div>
            </td>
            <td>
              <span class="status-badge status-qualified">✨ عميل مؤهل عالي الأهمية</span>
            </td>
            <td>
              <button style="background: #25d366; color: #fff; border: none; padding: 8px 14px; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <span>محادثة واتساب</span>
              </button>
            </td>
          </tr>

          <!-- Lead 3 -->
          <tr class="lead-row">
            <td>
              <strong style="font-size: 14px; color: #fff;">د. طارق منصور</strong>
              <div style="color: #00d9b5; font-size: 12px; font-family: 'Inter'; direction: ltr; text-align: right; margin-top: 2px;">+20 122 555 9876</div>
            </td>
            <td>
              <span style="font-weight: 700; color: #cbd5e1;">البرج الكبير</span>
              <div style="font-size: 11px; color: #64748b;">الدور 25</div>
            </td>
            <td>
              <p style="font-size: 12px; color: #e2e8f0; line-height: 1.5;">
                طلب دمج وحدتين متجاورتين لتكوين جناح دوبلكس فاخر مع خطة سداد ممتدة خاصة لمدة 10 سنوات.
              </p>
            </td>
            <td>
              <span class="status-badge status-assist">⚠️ يحتاج خطة مخصصة</span>
            </td>
            <td>
              <button style="background: #25d366; color: #fff; border: none; padding: 8px 14px; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <span>محادثة واتساب</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</body>
</html>`;

// ── SCREEN 5: Admin Project & AI Settings ───────────────────────────────────────
const screen5Html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  ${commonHead}
  <style>
    .layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      height: 900px;
    }
    .sidebar {
      background: #090e13;
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      padding: 28px 20px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 700;
      color: #94a3b8;
      margin-bottom: 6px;
    }
    .nav-item.active {
      background: rgba(0, 217, 181, 0.12);
      color: #00d9b5;
      border: 1px solid rgba(0, 217, 181, 0.3);
    }
    .main-content {
      padding: 32px 40px;
      overflow-y: auto;
      background: radial-gradient(circle at top right, #0b1c24 0%, #080f14 100%);
    }
    .project-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .project-card {
      background: rgba(16, 24, 32, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 18px;
      cursor: pointer;
    }
    .project-card.active {
      background: rgba(0, 77, 97, 0.25);
      border-color: #00d9b5;
      box-shadow: 0 10px 30px rgba(0, 217, 181, 0.15);
    }
    .form-section {
      background: rgba(16, 24, 32, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: #cbd5e1;
      margin-bottom: 8px;
    }
    .form-input {
      width: 100%;
      height: 46px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 0 16px;
      color: #fff;
      font-size: 14px;
      font-family: inherit;
    }
    .voice-badge {
      padding: 10px 16px;
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }
    .voice-badge.selected {
      background: rgba(0, 217, 181, 0.15);
      border-color: #00d9b5;
      color: #00d9b5;
    }
  </style>
</head>
<body>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 36px; padding-right: 8px;">
        <img src="${logoDataUri}" style="height: 42px; width: 42px; border-radius: 10px; background: #fff; padding: 3px;">
        <div>
          <h3 style="font-size: 15px; font-weight: 900; color: #fff;">سيتي سكيل</h3>
          <p style="font-size: 11px; color: #00d9b5; font-weight: 700;">Ai Smart Model</p>
        </div>
      </div>
      <nav>
        <div class="nav-item">📊 لوحة التحليلات المتقدمة</div>
        <div class="nav-item">💬 عملاء واتساب (CRM)</div>
        <div class="nav-item active">⚙️ إعدادات المشاريع والصوت</div>
        <div class="nav-item">🌐 معاينة الجولة الحية 360°</div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 900; color: #fff;">إعدادات المشاريع والمستشار الصوتي الذكي</h1>
          <p style="font-size: 13px; color: #94a3b8; margin-top: 4px;">تخصيص هوية المشاريع، رابط الجولة 360°، ونبرة صوت Google Gemini Live</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <div style="background: rgba(255,255,255,0.08); color: #fff; padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 700;">
            + مشروع جديد
          </div>
          <div style="background: linear-gradient(135deg, #00d9b5, #008fa6); color: #0c1015; padding: 8px 20px; border-radius: 12px; font-size: 13px; font-weight: 800;">
            حفظ التغييرات ✓
          </div>
        </div>
      </div>

      <!-- Multi-Project Cards -->
      <div class="project-grid">
        <div class="project-card active">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: 15px; color: #fff;">البرج الكبير (Grand Tower)</strong>
            <span style="background: rgba(16, 185, 129, 0.2); color: #6ee7b7; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">مباشر (Live)</span>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 4px;">المعرف: grand-tower / صوت ليلى</p>
        </div>
        <div class="project-card">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: 15px; color: #fff;">مارينا باي (Marina Bay)</strong>
            <span style="background: rgba(16, 185, 129, 0.2); color: #6ee7b7; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">مباشر (Live)</span>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 4px;">المعرف: marina-bay / صوت سارة</p>
        </div>
        <div class="project-card" style="border-style: dashed; display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: 700; font-size: 14px;">
          + إضافة مشروع عقاري جديد
        </div>
      </div>

      <!-- Form Section 1: Identity & Tour Link -->
      <div class="form-section">
        <h3 style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 16px;">1. هوية المشروع والربط الافتراضي</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label>اسم المشروع بالعربية:</label>
            <input class="form-input" value="البرج الكبير — العاصمة الإدارية">
          </div>
          <div class="form-group">
            <label>اسم المشروع بالإنجليزية:</label>
            <input class="form-input" value="The Grand Tower Luxury Residences" style="direction: ltr;">
          </div>
        </div>
        <div class="form-group">
          <label>رابط الجولة الافتراضية 360° (Coohom / Matterport / 3DVista):</label>
          <input class="form-input" value="https://www.coohom.com/pub/tool/panorama/aiwalking?obsPlanId=3FO3DBYBNCU7" style="direction: ltr;">
        </div>
      </div>

      <!-- Form Section 2: AI Voice Persona & Tone -->
      <div class="form-section">
        <h3 style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 16px;">2. تخصيص شخصية ونبرة المستشار الذكي (Google Gemini Live)</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px;">
          <div class="voice-badge selected">
            <div>
              <p style="font-size: 13px; font-weight: 800;">Aoede (ليلى)</p>
              <p style="font-size: 11px; opacity: 0.8;">دافئ ومقنع</p>
            </div>
            <span>▶</span>
          </div>
          <div class="voice-badge">
            <div>
              <p style="font-size: 13px; font-weight: 800; color: #fff;">Kore (سارة)</p>
              <p style="font-size: 11px; color: #64748b;">هادئ واحترافي</p>
            </div>
            <span>▶</span>
          </div>
          <div class="voice-badge">
            <div>
              <p style="font-size: 13px; font-weight: 800; color: #fff;">Puck (عمر)</p>
              <p style="font-size: 11px; color: #64748b;">حماسي وتفاعلي</p>
            </div>
            <span>▶</span>
          </div>
          <div class="voice-badge">
            <div>
              <p style="font-size: 13px; font-weight: 800; color: #fff;">Fenrir (طارق)</p>
              <p style="font-size: 11px; color: #64748b;">رسمي وتنفيذي</p>
            </div>
            <span>▶</span>
          </div>
        </div>

        <div class="form-group">
          <label>قاعدة معرفة المشروع ومحددات السداد (Sales Knowledge Base Prompt):</label>
          <textarea style="width: 100%; height: 100px; border-radius: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); padding: 12px 16px; color: #fff; font-size: 13px; font-family: inherit; line-height: 1.6; outline: none;">أنتِ ليلى، المستشار العقاري الرسمي لمشروع البرج الكبير من شركة سيتي سكيل. تحدثي بلهجة عربية احترافية وودودة، وقومي بشرح خطة التقسيط الممتدة على 7 سنوات مع مقدم 10%. احرصي على إظهار البطاقات الذكية فوراً عند الحديث عن مواعيد التسليم أو المساحات أو خطط السداد.</textarea>
        </div>
      </div>
    </main>
  </div>
</body>
</html>`;

// Save all HTML files
fs.writeFileSync(path.join(outDir, 'screen1.html'), screen1Html, 'utf8');
fs.writeFileSync(path.join(outDir, 'screen2.html'), screen2Html, 'utf8');
fs.writeFileSync(path.join(outDir, 'screen3.html'), screen3Html, 'utf8');
fs.writeFileSync(path.join(outDir, 'screen4.html'), screen4Html, 'utf8');
fs.writeFileSync(path.join(outDir, 'screen5.html'), screen5Html, 'utf8');

console.log('HTML mockup screens written.');

// Capture screenshots with Edge
const screens = [
  { html: 'screen1.html', png: 'screenshot_customer_tour.png' },
  { html: 'screen2.html', png: 'screenshot_lead_modal.png' },
  { html: 'screen3.html', png: 'screenshot_admin_analytics.png' },
  { html: 'screen4.html', png: 'screenshot_admin_leads.png' },
  { html: 'screen5.html', png: 'screenshot_admin_settings.png' },
];

const { execFileSync } = require('child_process');

for (const s of screens) {
  const htmlPath = path.join(outDir, s.html);
  const pngPath = path.join(outDir, s.png);
  console.log(`Capturing ${s.png}...`);
  try {
    execFileSync(edgePath, [
      '--headless',
      '--disable-gpu',
      '--window-size=1440,900',
      `--screenshot=${pngPath}`,
      htmlPath,
    ]);
    console.log(`✓ ${s.png} captured (${fs.statSync(pngPath).size} bytes)`);
  } catch (err) {
    console.error(`Failed to capture ${s.png}:`, err.message);
  }
}
