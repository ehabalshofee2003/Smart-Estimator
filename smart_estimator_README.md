# 🤖 SmartEstimator

منصة تقدير المشاريع البرمجية بالذكاء الاصطناعي

تطبيق ويب متكامل (Full-Stack SaaS) يحاكي واجهات ChatGPT، يقوم بمحادثة المستخدم باللغة العربية، ويجمع متطلبات المشروع، ثم يحسب التقديرات الدقيقة للحجم، التعقيد، الجهد، المدة، والتكلفة باستخدام معايير FPA و UCP.

---

# 🌟 الفكرة الأساسية (Core Philosophy)

التطبيق مبني على فلسفة هندسية صارمة:

> "الذكاء الاصطناعي للتفاعل، والكود للحساب"
> (AI for Interaction, Code for Computation)

- يستخدم الذكاء الاصطناعي (OpenRouter) لفهم اللغة الطبيعية، استخراج البيانات من إجابات المستخدم، وصياغة الردود بشكل ودود.
- تُنفذ الحسابات الرياضية المعقدة (FPA, UCP) عبر خوارزميات حاسوبية صارمة (Deterministic Code) داخل الـ Backend لضمان دقة النتائج بنسبة 100% دون هلوسة الذكاء الاصطناعي.

---

# ✨ المميزات الرئيسية

- واجهة محادثة احترافية تشبه ChatGPT مع دعم RTL وقائمة محادثات جانبية وتأثيرات Glassmorphism.
- محرك FPA كامل:
  - حساب UFP
  - حساب VAF
  - حساب AFP
- محرك UCP كامل:
  - حساب UAW
  - حساب UUCW
  - حساب UUCP
  - حساب TCF و ECF
- State Machine Architecture لجمع البيانات بشكل منطقي دون فقدان السياق.
- دعم العربية والإنجليزية مع تبديل فوري للواجهة باستخدام i18next.
- إنشاء تقارير PDF احترافية.
- نظام مصادقة آمن باستخدام Laravel Sanctum و Bearer Tokens.
- بيئة Docker معزولة لتشغيل كامل المشروع بأمر واحد.

---

# 🛠️ التقنيات المستخدمة (Tech Stack)

| المجال | التقنية |
|---|---|
| Frontend | React 18, Vite, TypeScript, TailwindCSS v3, Zustand, Framer Motion, i18next, Axios |
| Backend | Laravel 12, PHP 8.3, MySQL 8, Laravel Sanctum, DomPDF |
| AI Engine | OpenRouter API (GPT-3.5 / GPT-4) |
| DevOps | Docker, Docker Compose, Nginx, PHP-FPM, Redis |

---

# 🏗️ الهيكلية (Architecture)

```text
[ React + Vite (TypeScript) ]
            |
            |  Axios / Bearer Token
            v
[ Laravel 12 API ]
            |
     +------+------+
     |             |
     v             v
[ OpenRouter ]   [ FPA/UCP Engine ]
 (NLP & Chat)      (Math & Logic)
```

---

# 🚀 التشغيل السريع (Quick Start)

## المتطلبات (Prerequisites)

- Docker & Docker Compose
- Node.js & NPM
- مفتاح API من OpenRouter

---

## خطوات التثبيت

### 1) استنساخ المشروع

```bash
git clone https://github.com/YOUR_USERNAME/smart-estimator.git
cd smart-estimator
```

---

### 2) إعداد بيئة الـ Backend

```bash
cd backend
cp .env.example .env
```

قم بتعديل ملف `.env`:

```env
DB_DATABASE=estimation_db
DB_USERNAME=estimation_user
DB_PASSWORD=secret

OPENROUTER_API_KEY=sk-or-v1-XXXXXXXXXXXXX
```

---

### 3) إعداد بيئة الـ Frontend

```bash
cd ../frontend
npm install
```

---

### 4) تشغيل Docker

من داخل المجلد الرئيسي:

```bash
docker-compose up -d --build
```

---

### 5) تهيئة Laravel داخل الحاوية

```bash
docker-compose exec php composer install

docker-compose exec php php artisan key:generate

docker-compose exec php php artisan migrate
```

---

### 6) تشغيل الـ Frontend محلياً

```bash
cd frontend
npm run dev
```

الآن يمكنك الوصول إلى التطبيق عبر:

```text
http://localhost:5173
```

---

# ⚙️ المتغيرات البيئية (Environment Variables)

## Backend (`backend/.env`)

| المتغير | الوصف | القيمة الافتراضية |
|---|---|---|
| OPENROUTER_API_KEY | مفتاح API الخاص بالذكاء الاصطناعي | null |
| OPENROUTER_MODEL | نموذج الذكاء الاصطناعي | openai/gpt-3.5-turbo |
| DB_HOST | مضيف قاعدة البيانات | mysql |
| SESSION_DOMAIN | نطاق الجلسات الخاص بـ Sanctum | localhost |

---

## Frontend

تأكد من أن `baseURL` يشير إلى `/api` داخل:

```text
frontend/src/api/axios.ts
```

ليعمل الـ Proxy بشكل صحيح أثناء التطوير.

---

# 📂 هيكلية المشروع (Project Structure)

```text
smart-estimator/
├── docker/
│   ├── nginx/
│   └── php/
│
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   ├── Repositories/
│   │   └── Services/
│   │
│   ├── routes/api.php
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/Layout/
│   │   ├── pages/
│   │   ├── store/
│   │   └── i18n.js
│   │
│   ├── tailwind.config.js
│   └── .env
│
└── docker-compose.yml
```

---

# 📊 كيف تعمل الحسابات؟

## Function Point Analysis (FPA)

- يجمع البوت:
  - EI
  - EO
  - EQ
  - ILF
  - EIF

مع مستويات التعقيد:
- Low
- Average
- High

ثم:

1. حساب UFP باستخدام أوزان IFPUG.
2. تطبيق الـ 14 GSC لحساب VAF.
3. حساب AFP عبر:

```text
AFP = UFP × VAF
```

4. حساب الجهد والمدة والتكلفة.

---

## Use Case Point Analysis (UCP)

- يجمع:
  - Actors
  - Use Cases

ثم:

1. حساب UAW
2. حساب UUCW
3. حساب UUCP
4. تطبيق TCF و ECF
5. حساب UCP النهائي
6. تقدير الجهد والتكلفة

---

# 🤝 المساهمة (Contributing)

نرحب بالمساهمات ❤️

## خطوات المساهمة

### عمل Fork للمشروع

### إنشاء فرع جديد

```bash
git checkout -b feature/AmazingFeature
```

### تنفيذ التعديلات وعمل Commit

```bash
git commit -m "Add some AmazingFeature"
```

### رفع التعديلات

```bash
git push origin feature/AmazingFeature
```

### فتح Pull Request

---

# 📄 الرخصة (License)

هذا المشروع مرخص تحت رخصة MIT.

راجع ملف:

```text
LICENSE
```

للتفاصيل الكاملة.

---

<p align="center">
Built with ❤️ and AI Engineering
</p>

