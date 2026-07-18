import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FAQS = [
  { order: 1, questionFr: "Comment savoir si un produit est disponible ?", questionAr: "كيف نعرف واش المنتج متوفر؟", questionEn: "How do I know if a product is available?", answerFr: "La disponibilité et le stock par pointure sont affichés en temps réel sur chaque fiche produit.", answerAr: "التوفر والستوك حسب المقاس يبانو مباشرة في صفحة كل منتج.", answerEn: "Live availability and stock per size are shown directly on every product page." },
  { order: 2, questionFr: "Est-ce que les articles sont 100% originaux ?", questionAr: "واش المنتجات أصلية 100%؟", questionEn: "Are the items 100% original?", answerFr: "Oui. Chaque paire est vérifiée avant expédition, avec boîte et facture d'origine.", answerAr: "إيه، كل بير تتفحص قبل الشحن، مع العلبة والفاتورة الأصلية.", answerEn: "Yes. Every pair is verified before shipping, with the original box and receipt." },
  { order: 3, questionFr: "Combien coûte la livraison et vers quelles wilayas ?", questionAr: "شحال يكلف التوصيل ولأي ولايات؟", questionEn: "How much is delivery and which wilayas?", answerFr: "On livre dans les 69 wilayas. Le prix exact s'affiche automatiquement selon ta wilaya au moment de la commande.", answerAr: "نوصلو لـ 69 ولاية. الثمن الدقيق يبان مباشرة حسب ولايتك.", answerEn: "We deliver to all 69 wilayas. The exact price shows automatically based on your wilaya at checkout." },
  { order: 4, questionFr: "En combien de jours je reçois ma commande ?", questionAr: "في كم يوم توصلني الطلبية؟", questionEn: "How many days for delivery?", answerFr: "Entre 24h (Alger et environs) et 7 jours pour les wilayas du grand sud.", answerAr: "من 24 سا (الجزائر والمحيط) لغاية 7 أيام للولايات الجنوبية البعيدة.", answerEn: "Between 24h (Algiers area) and 7 days for far south wilayas." },
  { order: 5, questionFr: "Puis-je échanger si la taille ne va pas ?", questionAr: "نقدر نبدل إذا المقاس ماناسبنيش؟", questionEn: "Can I exchange if the size doesn't fit?", answerFr: "Oui, échange gratuit sous 3 jours après réception, article non porté avec étiquettes.", answerAr: "إيه، تبديل مجاني في ظرف 3 أيام من الاستلام.", answerEn: "Yes, free exchange within 3 days of receipt, unworn item with tags." },
  { order: 6, questionFr: "Comment je paye ?", questionAr: "كيفاش نخلص؟", questionEn: "How do I pay?", answerFr: "Paiement 100% à la livraison (cash), aucun paiement en ligne requis.", answerAr: "الخلاص 100% عند الاستلام (كاش)، ماكاش خلاص أونلاين.", answerEn: "100% cash on delivery, no online payment required." },
];

const WHYUS = [
  { order: 1, icon: "check", headingFr: "Original garanti", headingAr: "أصالة مضمونة", headingEn: "Guaranteed original", paragraphFr: "Chaque paire est vérifiée avant expédition. Boîte, facture et étiquettes d'origine inclus.", paragraphAr: "كل بير تتفحص قبل الشحن. العلبة والفاتورة والتيكيتات الأصلية متوفرة.", paragraphEn: "Every pair is checked before shipping. Original box, receipt and tags included." },
  { order: 2, icon: "truck", headingFr: "Paiement à la livraison", headingAr: "الخلاص عند الاستلام", headingEn: "Cash on delivery", paragraphFr: "Tu payes uniquement quand le colis arrive chez toi. Zéro paiement en ligne.", paragraphAr: "تخلص غير كي توصلك الطلبية. صفر خلاص أونلاين.", paragraphEn: "Pay only when the package reaches you. Zero online payment." },
  { order: 3, icon: "map", headingFr: "69 wilayas couvertes", headingAr: "69 ولاية", headingEn: "69 wilayas covered", paragraphFr: "Domicile ou stopdesk, livraison 2 à 5 jours selon ta wilaya.", paragraphAr: "للمنزل أو ستوب ديسك، التوصيل من 2 إلى 5 أيام حسب ولايتك.", paragraphEn: "Home or stopdesk, delivery in 2 to 5 days depending on your wilaya." },
  { order: 4, icon: "refresh", headingFr: "Échange facile", headingAr: "تبديل سهل", headingEn: "Easy exchange", paragraphFr: "Mauvaise pointure ? Échange sous 3 jours, sans complications.", paragraphAr: "المقاس ماناسبكش؟ تبديل في ظرف 3 أيام بلا مشاكل.", paragraphEn: "Wrong size? Exchange within 3 days, no hassle." },
];

const BRANDS = [
  { name: "Dr. Martens", hot: true, order: 1 },
  { name: "Under Armour", hot: false, order: 2 },
  { name: "Puma", hot: false, order: 3 },
  { name: "Osiris", hot: false, order: 4 },
  { name: "Jordan", hot: true, order: 5 },
  { name: "CopIt Basics", hot: false, order: 6 },
];

const CATEGORIES = [
  { nameFr: "Chaussures", nameAr: "أحذية", nameEn: "Shoes", slug: "Chaussures", order: 1 },
  { nameFr: "Vêtements", nameAr: "ملابس", nameEn: "Clothing", slug: "Vêtements", order: 2 },
  { nameFr: "Accessoires", nameAr: "إكسسوارات", nameEn: "Accessories", slug: "Accessoires", order: 3 },
];

const FOOTER_LINKS = [
  { section: "shop", labelFr: "Tous les produits", labelAr: "كل المنتجات", labelEn: "All products", url: "/shop", order: 1 },
  { section: "shop", labelFr: "Chaussures", labelAr: "أحذية", labelEn: "Shoes", url: "/shop?category=Chaussures", order: 2 },
  { section: "shop", labelFr: "Nouveautés", labelAr: "جديد", labelEn: "New arrivals", url: "/shop", order: 3 },
  { section: "help", labelFr: "FAQ", labelAr: "الأسئلة الشائعة", labelEn: "FAQ", url: "/#faq", order: 1 },
  { section: "help", labelFr: "Suivi commande", labelAr: "تتبع الطلبية", labelEn: "Track order", url: "/track", order: 2 },
  { section: "help", labelFr: "Contact WhatsApp", labelAr: "تواصل واتساب", labelEn: "WhatsApp contact", url: "https://wa.me/213562829805", order: 3 },
  { section: "legal", labelFr: "Confidentialité", labelAr: "الخصوصية", labelEn: "Privacy", url: "#", order: 1 },
  { section: "legal", labelFr: "Conditions", labelAr: "الشروط", labelEn: "Terms", url: "#", order: 2 },
];

async function main() {
  for (const f of FAQS) {
    await prisma.faq.create({ data: f });
  }
  console.log(`Seeded ${FAQS.length} FAQs`);

  for (const w of WHYUS) {
    await prisma.whyUsItem.create({ data: w });
  }
  console.log(`Seeded ${WHYUS.length} Why Us items`);

  for (const b of BRANDS) {
    await prisma.brandItem.create({ data: b });
  }
  console.log(`Seeded ${BRANDS.length} brands`);

  for (const c of CATEGORIES) {
    await prisma.categoryContent.create({ data: c });
  }
  console.log(`Seeded ${CATEGORIES.length} categories`);

  for (const l of FOOTER_LINKS) {
    await prisma.footerLink.create({ data: l });
  }
  console.log(`Seeded ${FOOTER_LINKS.length} footer links`);

  console.log("Content seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
