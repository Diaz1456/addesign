/* eslint-disable no-console */
/**
 * Seeds the database with an initial admin user and 5 sample products.
 *
 *   npm run db:seed
 *
 * Credentials come from .env (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD).
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const ADMIN_EMAIL =
  process.env.SEED_ADMIN_EMAIL || "admin@aetheria.design";
const ADMIN_PASSWORD =
  process.env.SEED_ADMIN_PASSWORD || "AetheriaAdmin2024";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "Aetheria Admin";

const PRODUCTS = [
  {
    name: "Modernist Lounge Chair",
    nameAr: "كرسي استرخاء حديث",
    description:
      "A reissue of our studio's 2019 lounge chair. Kiln-dried oak frame with a hand-wrapped wool seat, cantilevered on a whisper-thin steel base with a powder-coat in deep slate. Designed for the reading corner of concrete lofts.",
    descriptionAr:
      "إعادة إصدار لكرسي الاسترخاء من سنة ٢٠١٩. هيكل من خشب البلوط المجفف مع مقعد من الصوف ملفوف يدوياً، مثبّت على قاعدة فولاذية رفيعة بطلاء رمادي داكن. صُمم لركن القراءة في الشقق الخرسانية.",
    price: 1290,
    category: "Interior",
    featured: true,
    stock: 8,
    imageUrls: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    name: "Parametric Facade Panel",
    nameAr: "لوح واجهة بارامتري",
    description:
      "A pre-perforated anodized aluminium panel from the Helios Terraces project. Each sheet is CNC-cut to a gradient opening pattern that tunes daylight and privacy. Sold per panel — custom tessellations quoted per project.",
    descriptionAr:
      "لوح ألمنيوم مؤكسد مثقب مسبقاً من مشروع هيليوس تيراسيس. كل لوحة مقطوعة بالحاسوب بنمط تدرجي يضبط الضوء والخصوصية. يُباع اللوح منفرداً — تُقتبس التصاميم المخصصة حسب المشروع.",
    price: 550,
    category: "Exterior",
    featured: true,
    stock: 24,
    imageUrls: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    name: "Smart Lighting System",
    nameAr: "نظام إضاءة ذكي",
    description:
      "Tunable-white linear system engineered for residential and studio interiors. Constant-current drivers, DALI dimming, and a brushed anodized profile that reads as a crisp architectural line. Includes the control bridge and app set-up.",
    descriptionAr:
      "نظام خطي أبيض قابل للتعديل مصمم للتصميمات الداخلية السكنية واستوديوهات العمل. محركات تيار ثابت وتخميد DALI ولمسة أنودية مصقولة تُقرأ كخط معماري حاد. يشمل وحدة التحكم وتهيئة التطبيق.",
    price: 320,
    category: "Structural",
    featured: false,
    stock: 40,
    imageUrls: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    name: "Concrete Grove Bench",
    nameAr: "مقعد كونكريت جروف",
    description:
      "A precast concrete bench from the Concrete Grove campus, now available for private gardens and courtyards. Acid-washed finish with a subtle burned-orange pigment seam. Ships in two interlocking sections with a hidden steel connection.",
    descriptionAr:
      "مقعد خرساني مسبق الصب من حرم كونكريت جروف، متاح الآن للحدائق الخاصة والساحات. تشطيب بغسل حمضي مع درزة صبغة برتقالية محروقة خفيفة. يُشحن في قسمين متشابكين مع وصلة فولاذية مخفية.",
    price: 890,
    category: "Exterior",
    featured: true,
    stock: 6,
    imageUrls: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    name: "Slate Ceramic Vessel Set",
    nameAr: "طقم أواني سيراميكية قاتمة",
    description:
      "A trio of hand-thrown stoneware vessels glazed in matte slate and ember. Each piece is thrown in our Copenhagen studio and slow-fired. Group them on a shelf or a dining table as an honest counterpoint to steel and glass.",
    descriptionAr:
      "ثلاثة أوانٍ خزفية مصنوعة يدوياً بطلاء زجاجي قاتم وجمري. كل قطعة تُشكّل في استوديوهاتنا في كوبنهاغن وتُحرق ببطء. رتّبها على رف أو طاولة طعام كبديل صادق للفولاذ والزجاج.",
    price: 145,
    category: "Decor",
    featured: false,
    stock: 32,
    imageUrls: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=900&auto=format&fit=crop",
    ],
  },
];

async function main() {
  console.log("Seeding database…");

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, name: ADMIN_NAME },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`✔ Admin user ready: ${admin.email}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);

  for (const product of PRODUCTS) {
    const { name, ...data } = product;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    await prisma.product.upsert({
      where: { slug },
      update: {
        nameAr: data.nameAr,
        description: data.description,
        descriptionAr: data.descriptionAr,
        price: data.price,
        category: data.category,
        featured: data.featured,
        stock: data.stock,
        imageUrls: data.imageUrls,
      },
      create: {
        name,
        nameAr: data.nameAr,
        slug,
        description: data.description,
        descriptionAr: data.descriptionAr,
        price: data.price,
        category: data.category,
        featured: data.featured,
        stock: data.stock,
        imageUrls: data.imageUrls,
      },
    });
    console.log(`✔ Product: ${name}`);
  }

  const SITE_CONTENT = {
    siteName: { en: "Aetheria", ar: "أيثريا" },
    siteTagline: { en: "Engineering & Interior Design", ar: "هندسة وتصميم داخلي متكامل" },
    heroKicker: { en: "Engineering · Architecture · Interiors", ar: "هندسة · عمارة · تصاميم داخلية" },
    heroTitlePre: { en: "Designing the", ar: "نصمّم" },
    heroAccent: { en: "built edge", ar: "حدود البناء" },
    heroTitleAfter: { en: "of tomorrow.", ar: "في الغد." },
    heroBody: {
      en: "Aetheria Designs fuses rigorous engineering with a curated interior sensibility. From parametric facades to a single well-judged chair — we craft spaces and the objects that inhabit them.",
      ar: "تمزج أيثريا بين الهندسة الدقيقة والحس الداخلي المنسّق. من الواجهات البارامترية إلى المقعد المصمم بإتقان — نبتكر المساحات والقطع التي تسكنها.",
    },
    heroCtaPrimary: { en: "Enter the Store", ar: "ادخل المتجر" },
    heroCtaSecondary: { en: "View Featured Projects", ar: "شاهد المشاريع المميزة" },
    heroBadgeTitle: { en: "Split vision", ar: "رؤية مزدوجة" },
    heroBadgeSub: { en: "Exterior ⇄ Interior", ar: "خارجي ⇄ داخلي" },
    statYears: { en: "Years practice", ar: "سنوات خبرة" },
    statProjects: { en: "Projects delivered", ar: "مشاريع منجزة" },
    statAwards: { en: "Design awards", ar: "جوائز تصميم" },
    studioF1Title: { en: "Interior & Exterior", ar: "تصميم داخلي وخارجي" },
    studioF1Body: {
      en: "One practice, two disciplines. Facades, structure, interiors and objects designed in the same room.",
      ar: "ممارسة واحدة، تخصصان. واجهات وإنشاءات وديكورات وقطع تُصمم في نفس الغرفة.",
    },
    studioF2Title: { en: "Engineered Precision", ar: "دقة هندسية" },
    studioF2Body: {
      en: "Every curve and joint is stress-tested. Beauty that passes inspection and lasts decades.",
      ar: "كل منحنى ووصلية تخضع لاختبارات. جمال يجتاز الفحص ويدوم لعقود.",
    },
    studioF3Title: { en: "Curated Objects", ar: "قطع مختارة" },
    studioF3Body: {
      en: "Our store pieces are prototypes of our own projects — buy the same products we specify on site.",
      ar: "قطع متجرنا نماذج من مشاريعنا — اشترِ نفس المنتجات التي نعتمدها في مواقعنا.",
    },
    studioF4Title: { en: "Client Led", ar: "عميل أولاً" },
    studioF4Body: {
      en: "Inquiries become sessions, sessions become drawings, drawings become delivered projects.",
      ar: "الاستفسار يصبح جلسة، والجلسة تصبح رسومات، والرسومات تصبح مشاريع مسلّمة.",
    },
    collectionKicker: { en: "The Collection", ar: "المجموعة" },
    bestSellersTitle: { en: "Best Sellers", ar: "الأكثر مبيعاً" },
    shopAll: { en: "Shop all", ar: "تسوّق الكل" },
    projectsKicker: { en: "Selected Work", ar: "أعمال مختارة" },
    projectsTitle: { en: "Featured Projects", ar: "مشاريع مميزة" },
    projectsCta: { en: "See objects from these projects", ar: "شاهد قطع هذه المشاريع" },
    storeSubtitle: {
      en: "Design objects engineered in our studio and specified in our own projects.",
      ar: "قطع تصميم هندسي صُمّمت في الاستوديو واعتُمدت في مشاريعنا.",
    },
    footerAbout: {
      en: "A full-service engineering and design firm. We shape exterior architecture, choreograph interiors, and manufacture the pieces that make spaces feel intent.",
      ar: "شركة هندسة وتصميم متكاملة. نشكّل العمارة الخارجية، وننسّق التصميم الداخلي، ونصنع القطع التي تمنح المساحات معناها.",
    },
    footerTagline: {
      en: "Engineered with intent · Built on light.",
      ar: "مصمم بإتقان · مبني على الضوء.",
    },
    footerAddress: {
      en: "Level 4, Helios Works, Copenhagen, Denmark",
      ar: "الطابق الرابع، هيليوس وركس، كوبنهاغن، الدنمارك",
    },
    contactEmail: { en: "hello@aetheria.design", ar: "hello@aetheria.design" },
    contactPhone: { en: "+45 12 34 56 78", ar: "+45 12 34 56 78" },
    contactStudioBody: {
      en: "Level 4, Helios Works, Copenhagen, Denmark",
      ar: "الطابق الرابع، هيليوس وركس، كوبنهاغن، الدنمارك",
    },
  };

  for (const [key, value] of Object.entries(SITE_CONTENT)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  }
  console.log(`✔ Site content: ${Object.keys(SITE_CONTENT).length} settings`);

  console.log("\nSeeding complete. Start the app with `npm run dev`.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });