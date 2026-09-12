export type ContentValue = { en: string; ar: string };

/** Default site content (used until edited in /admin/content). */
export const DEFAULT_CONTENT: Record<string, ContentValue> = {
  siteName: { en: "Aetheria", ar: "أيثريا" },
  siteTagline: {
    en: "Engineering & Interior Design",
    ar: "هندسة وتصميم داخلي متكامل",
  },
  heroKicker: {
    en: "Engineering · Architecture · Interiors",
    ar: "هندسة · عمارة · تصاميم داخلية",
  },
  heroTitlePre: { en: "Designing the", ar: "نصمّم" },
  heroAccent: { en: "built edge", ar: "حدود البناء" },
  heroTitleAfter: { en: "of tomorrow.", ar: "في الغد." },
  heroBody: {
    en: "Aetheria Designs fuses rigorous engineering with a curated interior sensibility. From parametric facades to a single well-judged chair — we craft spaces and the objects that inhabit them.",
    ar: "تمزج أيثريا بين الهندسة الدقيقة والحس الداخلي المنسّق. من الواجهات البارامترية إلى المقعد المصمم بإتقان — نبتكر المساحات والقطع التي تسكنها.",
  },
  heroCtaPrimary: { en: "Enter the Store", ar: "ادخل المتجر" },
  heroCtaSecondary: {
    en: "View Featured Projects",
    ar: "شاهد المشاريع المميزة",
  },
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

/** Admin form field groups (order + human labels, English UI). */
export const CONTENT_FIELDS: {
  group: string;
  fields: { key: string; label: string; type?: "long" }[];
}[] = [
  {
    group: "Brand",
    fields: [
      { key: "siteName", label: "Site name" },
      { key: "siteTagline", label: "Tagline" },
    ],
  },
  {
    group: "Hero",
    fields: [
      { key: "heroKicker", label: "Kicker" },
      { key: "heroTitlePre", label: "Title — before highlight" },
      { key: "heroAccent", label: "Title — highlighted words" },
      { key: "heroTitleAfter", label: "Title — after highlight" },
      { key: "heroBody", label: "Subtitle", type: "long" },
      { key: "heroCtaPrimary", label: "Primary button" },
      { key: "heroCtaSecondary", label: "Secondary button" },
      { key: "heroBadgeTitle", label: "Badge title" },
      { key: "heroBadgeSub", label: "Badge subtitle" },
    ],
  },
  {
    group: "Stats",
    fields: [
      { key: "statYears", label: "Stat 1 label" },
      { key: "statProjects", label: "Stat 2 label" },
      { key: "statAwards", label: "Stat 3 label" },
    ],
  },
  {
    group: "Studio",
    fields: [
      { key: "studioF1Title", label: "Feature 1 title" },
      { key: "studioF1Body", label: "Feature 1 body", type: "long" },
      { key: "studioF2Title", label: "Feature 2 title" },
      { key: "studioF2Body", label: "Feature 2 body", type: "long" },
      { key: "studioF3Title", label: "Feature 3 title" },
      { key: "studioF3Body", label: "Feature 3 body", type: "long" },
      { key: "studioF4Title", label: "Feature 4 title" },
      { key: "studioF4Body", label: "Feature 4 body", type: "long" },
    ],
  },
  {
    group: "Best Sellers section",
    fields: [
      { key: "collectionKicker", label: "Kicker" },
      { key: "bestSellersTitle", label: "Heading" },
      { key: "shopAll", label: "Link label" },
    ],
  },
  {
    group: "Projects section",
    fields: [
      { key: "projectsKicker", label: "Kicker" },
      { key: "projectsTitle", label: "Heading" },
      { key: "projectsCta", label: "Link label" },
    ],
  },
  {
    group: "Store page",
    fields: [{ key: "storeSubtitle", label: "Subtitle", type: "long" }],
  },
  {
    group: "Contact details",
    fields: [
      { key: "contactStudioBody", label: "Studio address" },
      { key: "contactEmail", label: "Email" },
      { key: "contactPhone", label: "Phone" },
    ],
  },
  {
    group: "Footer",
    fields: [
      { key: "footerAbout", label: "About text", type: "long" },
      { key: "footerAddress", label: "Address" },
      { key: "footerTagline", label: "Tagline", type: "long" },
    ],
  },
];

export function parseSettingValue(raw: string): ContentValue {
  try {
    const parsed = JSON.parse(raw);
    return {
      en: typeof parsed.en === "string" ? parsed.en : "",
      ar: typeof parsed.ar === "string" ? parsed.ar : "",
    };
  } catch {
    return { en: "", ar: "" };
  }
}

export function getDefaultContent(lang: "en" | "ar"): Record<string, string> {
  const map: Record<string, string> = {};
  for (const key of Object.keys(DEFAULT_CONTENT)) {
    map[key] = DEFAULT_CONTENT[key][lang] || "";
  }
  return map;
}