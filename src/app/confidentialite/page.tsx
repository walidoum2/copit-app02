"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/contexts/LangContext";
import Link from "next/link";

const CONTENT = {
  fr: {
    title: "Politique de Confidentialité",
    updated: "Dernière mise à jour : juillet 2026",
    sections: [
      {
        heading: "Qui sommes-nous ?",
        body: "CopIt DZ est un e-commerce algérien spécialisé dans la vente de sneakers et streetwear 100% originaux. Notre site web est accessible à l'adresse copit.dz."
      },
      {
        heading: "Données collectées",
        body: "Lorsque vous passez une commande sur CopIt, nous collectons les informations suivantes : votre nom complet, numéro de téléphone, wilaya, commune, adresse précise de livraison, et le détail des articles commandés. Ces données sont strictement nécessaires au traitement et à la livraison de votre commande."
      },
      {
        heading: "Paiement",
        body: "Tous les paiements se font en cash à la livraison (COD). Nous ne collectons, ne stockons et ne traitons aucune donnée de carte bancaire ou de paiement en ligne. Aucune information financière sensible ne transite par notre site."
      },
      {
        heading: "Partage des données",
        body: "Vos données de livraison (nom, téléphone, adresse) sont transmises à notre partenaire de livraison ZR Express uniquement dans le but d'acheminer votre colis. Nous ne vendons, ne louons et ne partageons vos données avec aucun autre tiers."
      },
      {
        heading: "Utilisation des données",
        body: "Vos informations sont utilisées uniquement pour : traiter et expédier vos commandes, vous contacter si nécessaire concernant votre livraison, et améliorer notre service client. Nous n'utilisons pas vos données à des fins de marketing sans votre consentement explicite."
      },
      {
        heading: "Durée de conservation",
        body: "Nous conservons vos données de commande pendant une durée de 3 ans à des fins administratives et comptables. Passé ce délai, elles sont supprimées de nos systèmes."
      },
      {
        heading: "Vos droits",
        body: "Vous pouvez à tout moment demander l'accès, la rectification ou la suppression de vos données personnelles en nous contactant directement sur WhatsApp au 0562 82 98 05."
      },
    ]
  },
  ar: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: يوليو 2026",
    sections: [
      {
        heading: "من نحن؟",
        body: "CopIt DZ هو متجر إلكتروني جزائري متخصص في بيع السنيكرز والستريتوير الأصلية 100%. موقعنا متاح على copit.dz."
      },
      {
        heading: "البيانات التي نجمعها",
        body: "عند تقديم طلب على CopIt، نجمع المعلومات التالية: اسمك الكامل، رقم هاتفك، ولايتك، بلديتك، عنوان التوصيل الدقيق، وتفاصيل المنتجات المطلوبة. هذه البيانات ضرورية لمعالجة طلبك وتوصيله."
      },
      {
        heading: "الدفع",
        body: "جميع المدفوعات تكون نقدًا عند الاستلام (COD). لا نقوم بجمع أو تخزين أو معالجة أي بيانات بطاقة بنكية أو دفع إلكتروني. لا توجد أي معلومات مالية حساسة تعبر موقعنا."
      },
      {
        heading: "مشاركة البيانات",
        body: "يتم إرسال بيانات التوصيل الخاصة بك (الاسم، الهاتف، العنوان) إلى شريك التوصيل ZR Express بغرض توصيل طلبك فقط. لا نبيع أو نؤجر أو نشارك بياناتك مع أي طرف آخر."
      },
      {
        heading: "استخدام البيانات",
        body: "تُستخدم معلوماتك فقط من أجل: معالجة وشحن طلباتك، الاتصال بك إذا لزم الأمر بخصوص توصيلك، وتحسين خدمة العملاء لدينا. لا نستخدم بياناتك لأغراض تسويقية دون موافقتك الصريحة."
      },
      {
        heading: "مدة الاحتفاظ",
        body: "نحتفظ ببيانات طلباتك لمدة 3 سنوات لأغراض إدارية ومحاسبية. بعد هذه المدة، يتم حذفها من أنظمتنا."
      },
      {
        heading: "حقوقك",
        body: "يمكنك في أي وقت طلب الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها بالاتصال بنا مباشرة على واتساب على الرقم 0562 82 98 05."
      },
    ]
  }
};

export default function ConfidentialitePage() {
  const { lang } = useLang();
  const content = CONTENT[lang as keyof typeof CONTENT] || CONTENT.fr;

  return (
    <>
      <Header onCartOpen={() => {}} />
      <div className="wrap page-head">
        <h1 className="display">{content.title}</h1>
        <p className="mono" style={{ fontSize: 12, color: "var(--steel)", marginTop: 10 }}>{content.updated}</p>
      </div>
      <div className="wrap" style={{ padding: "40px 0 80px", maxWidth: 720 }}>
        {content.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.heading}</h2>
            <p style={{ fontSize: 14.5, color: "var(--text-dim)", lineHeight: 1.7 }}>{s.body}</p>
          </div>
        ))}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
          <Link href="/" className="btn btn-outline" style={{ fontSize: 12 }}>← {lang === "ar" ? "العودة للرئيسية" : "Retour à l'accueil"}</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
