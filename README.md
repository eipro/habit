# Habit (هبیت ترکر)

یک اپلیکیشن **Habit Tracker** سبک و تک‌صفحه‌ای (SPA) با پشتیبانی از:
- ثبت عادت‌های روزانه/هفتگی/دلخواه
- تقویم شمسی (جلالی)
- دسته‌بندی، جستجو و فیلتر
- تایمر پومودورو
- یادآور روزانه + نوتیفیکیشن (Push)
- حالت مهمان و ورود/ثبت‌نام
- همگام‌سازی ابری (Cloudflare Worker)
- نصب به‌عنوان PWA

---

## تکنولوژی‌ها
- `HTML + CSS + Vanilla JavaScript`
- `Service Worker` برای قابلیت‌های PWA و Push
- `localStorage` برای ذخیره محلی
- Cloudflare Worker API برای احراز هویت و Sync
- **Android (Kotlin + WebView)** برای اجرای همین اپ روی اندروید

---

## ساختار پروژه

```text
.
├── index.html   # کل UI و منطق برنامه وب
├── sw.js        # سرویس ورکر (PWA / Push)
├── android-app/
│   ├── app/src/main/java/com/habit/tracker/MainActivity.kt
│   └── app/src/main/assets/www/  # نسخه embed شده index.html + sw.js
└── README.md
```

---

## اجرای پروژه وب (لوکال)

به خاطر Service Worker، بهتر است پروژه با یک سرور ساده اجرا شود (نه `file://`).

### روش ۱: با Python
```bash
python -m http.server 8080
```
سپس باز کنید: `http://localhost:8080`

### روش ۲: با Node (در صورت نصب)
```bash
npx serve .
```

---

## اجرای نسخه اندروید

پوشه `android-app` یک پروژه آماده Android Studio است که اپ را با **Kotlin** و `WebView` اجرا می‌کند.

1. Android Studio را باز کنید.
2. گزینه **Open** را بزنید و مسیر `android-app` را انتخاب کنید.
3. اجازه دهید Gradle Sync انجام شود.
4. روی Emulator یا گوشی واقعی Run کنید.

صفحه اصلی از مسیر زیر لود می‌شود:
- `file:///android_asset/www/index.html`

> نکته: برای انتقال تغییرات جدید وب به اندروید، فایل‌های `index.html` و `sw.js` را به مسیر `android-app/app/src/main/assets/www/` کپی کنید.

---

## تنظیمات مهم

در فایل `index.html` این مقادیر استفاده می‌شوند:
- `CLOUDFLARE_WORKER_URL`
- `VAPID_PUBLIC_KEY`

برای محیط production باید:
1. آدرس Worker معتبر باشد.
2. کلید VAPID واقعی قرار داده شود.

> اگر VAPID نمونه/placeholder باشد، فعال‌سازی Push کامل نخواهد شد.

---

## ذخیره‌سازی داده‌ها

اطلاعات برنامه داخل `localStorage` نگهداری می‌شود. کلیدهای اصلی:
- `habits_ultimate`
- `user_stats_ultimate`
- `habit_categories`
- `last_local_mutation_ts`
- `last_synced_mutation_ts`

این کلیدها برای جلوگیری از overwrite شدن ناخواسته داده‌های محلی هنگام Sync استفاده می‌شوند.

---

## همگام‌سازی (Sync) چطور کار می‌کند؟

- **Push**: داده‌های محلی + `timestamp` آخرین تغییر محلی به سرور ارسال می‌شوند.
- **Pull**: داده سرور فقط وقتی اعمال می‌شود که نسبت به تغییرات محلی stale نباشد.
- اگر تغییر محلی سینک‌نشده وجود داشته باشد و پاسخ pull خالی/قدیمی/بدون timestamp معتبر باشد، داده محلی حفظ می‌شود تا از پاک‌شدن عادت‌ها جلوگیری شود.

---

## امکانات کلیدی UI

- افزودن، ویرایش، حذف و کپی عادت
- سنجاق کردن عادت‌ها
- جستجو با `/`
- میانبرها:
  - `n` برای عادت جدید
  - `t` رفتن به امروز
  - `f` حالت Focus
- خروجی JSON و CSV
- ورود مهمان (Guest Mode)

---

## نکات توسعه

- پروژه وب فعلاً بدون build step است.
- برای تغییر UI/logic وب کافی است `index.html` را ویرایش کنید.
- برای رفتارهای PWA/Push فایل `sw.js` را بررسی کنید.
- برای نسخه Android، فایل `MainActivity.kt` و assetهای مسیر `android-app/app/src/main/assets/www/` را مدیریت کنید.

---

## پیشنهادهای بهبود

- جداسازی کد JS به ماژول‌های مستقل
- افزودن تست end-to-end (مثلاً Playwright)
- افزودن migration برای schema ذخیره‌سازی localStorage
- افزودن conflict resolution پیشرفته‌تر برای Sync چنددستگاهی
- اتصال به TWA یا WebViewAssetLoader برای همسانی بهتر با PWA

---

## مجوز

در حال حاضر مجوز مشخصی تعریف نشده است. در صورت نیاز، فایل `LICENSE` اضافه شود.
