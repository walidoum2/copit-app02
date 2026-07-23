"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/contexts/LangContext";
import Link from "next/link";

const CONTENT = {
  fr: {
    title: "Conditions Générales de Vente",
    updated: "Dernière mise à jour : juillet 2026",
    sections: [
      {
        heading: "1. Présentation",
        body: "Les présentes conditions générales régissent les ventes effectuées sur le site CopIt DZ (copit.dz), exploité par une entreprise algérienne spécialisée dans la vente de sneakers et streetwear. En passant commande, vous acceptez ces conditions sans réserve."
      },
      {
        heading: "2. Produits",
        body: "Tous les articles proposés à la vente sont 100% originaux, vérifiés avant expédition. Chaque produit est accompagné de sa boîte d'origine et de sa facture. Les photos sont non contractuelles — les légères variations de couleurs entre l'écran et le produit réel sont possibles."
      },
      {
        heading: "3. Prix",
        body: "Les prix sont affichés en Dinar Algérien (DA), toutes taxes comprises. Les frais de livraison sont calculés automatiquement en fonction de la wilaya et du type de livraison (domicile ou stopdesk). La livraison est offerte à partir de 15 000 DA de commande."
      },
      {
        heading: "4. Commande",
        body: "La commande est considérée comme ferme après validation du panier et confirmation sur la page de paiement. Un numéro de référence vous est communiqué. Nous vous contactons par téléphone pour confirmer les détails avant expédition."
      },
      {
        heading: "5. Paiement",
        body: "Le paiement s'effectue uniquement en cash à la livraison (COD). Aucun paiement en ligne n'est requis. Le montant est à régler directement au livreur au moment de la réception du colis."
      },
      {
        heading: "6. Livraison",
        body: "Nous livrons dans les 69 wilayas d'Algérie via notre partenaire ZR Express. Les délais sont de 24h à 7 jours selon la wilaya. En cas d'absence, le livreur vous contactera au numéro fourni lors de la commande pour organiser une seconde livraison."
      },
      {
        heading: "7. Échange et retour",
        body: "L'échange est possible sous 3 jours suivant la réception, pour tout article non porté, en bon état et avec ses étiquettes d'origine. Le remboursement n'est pas proposé — seul l'échange contre un autre article (même valeur ou supérieure avec compensation) est disponible. Les frais de retour pour échange sont à la charge du client sauf en cas d'erreur de notre part."
      },
      {
        heading: "8. Service client",
        body: "Pour toute question ou réclamation, contactez-nous sur WhatsApp au 0562 82 98 05. Nous répondons sous 24h en semaine."
      },
    ]
  },
  ar: {
    title: "الشروط العامة للبيع",
    updated: "آخر تحديث: يوليو 2026",
    sections: [
      {
        heading: "1. تقديم",
        body: "هذه الشروط العامة تنظم عمليات البيع على موقع CopIt DZ (copit.dz)، الذي تديره مؤسسة جزائرية متخصصة في بيع السنيكرز والستريتوير. بتقديم طلبك، فإنك تقبل هذه الشروط بدون تحفظ."
      },
      {
        heading: "2. المنتجات",
        body: "جميع المنتجات المعروضة للبيع أصلية 100%، ويتم فحصها قبل الشحن. كل منتج يأتي مع علبته الأصلية وفاتورته. الصور غير تعاقدية — الاختلافات الطفيفة في الألوان بين الشاشة والمنتج الفعلي ممكنة."
      },
      {
        heading: "3. الأسعار",
        body: "الأسعار معروضة بالدينار الجزائري (DA)، شاملة جميع الضرائب. يتم حساب تكاليف التوصيل تلقائيًا حسب الولاية ونوع التوصيل (منزل أو ستوب ديسك). التوصيل مجاني للطلبيات التي تتجاوز 15,000 دينار."
      },
      {
        heading: "4. الطلب",
        body: "الطلب يعتبر نهائيًا بعد تأكيد السلة وإتمام الدفع في صفحة الخلاص. يتم إعطاؤك رقم مرجعي. نتصل بك لتأكيد التفاصيل قبل الشحن."
      },
      {
        heading: "5. الدفع",
        body: "الدفع يتم فقط نقدًا عند الاستلام (COD). لا يتطلب أي دفع إلكتروني. يتم دفع المبلغ مباشرة للموصّل عند استلام الطرد."
      },
      {
        heading: "6. التوصيل",
        body: "نوصل إلى 58 ولاية في الجزائر عبر شريكنا ZR Express. المدة من 24 ساعة إلى 7 أيام حسب الولاية. في حالة الغياب، سيتصل بك الموصّل على الرقم المقدم لإعادة تنظيم التوصيل."
      },
      {
        heading: "7. التبديل والإرجاع",
        body: "التبديل ممكن في غضون 3 أيام من الاستلام، لأي منتج لم يتم لبسه وفي حالة جيدة مع تيكيتاته الأصلية. لا يتم تقديم الاسترجاع النقدي — فقط التبديل بمنتج آخر (نفس القيمة أو أعلى مع دفع الفرق) متاح. مصاريف الإرجاع للتبديل يتحملها الزبون إلا في حالة خطأ من طرفنا."
      },
      {
        heading: "8. خدمة الزبائن",
        body: "لأي استفسار أو شكوى، اتصل بنا على واتساب على الرقم 0562 82 98 05. نجيب خلال 24 ساعة في أيام العمل."
      },
    ]
  }
};

export default function ConditionsPage() {
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
