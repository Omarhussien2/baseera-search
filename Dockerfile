FROM node:20-bullseye

# تنزيل المكتبات الأساسية لتشغيل المتصفحات المخفية (Puppeteer/Playwright) المطلوبة لأدوات الـ Scraping
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# نسخ الحزم أولاً لتسريع البناء
COPY package.json package-lock.json* ./
RUN npm ci

# نسخ باقي الملفات
COPY . .

# بناء المشروع
RUN npm run build

# إعدادات Hugging Face (بورت 7860 إجباري)
ENV NODE_ENV=production
ENV PORT=7860
EXPOSE 7860

# تشغيل المنصة
CMD ["npm", "start"]
