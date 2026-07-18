interface ProcolisColis {
  token: string;
  key: string;
  expediteur: string;
  telephone_expediteur: string;
  destinataire: string;
  telephone_destinataire: string;
  adresse: string;
  wilaya: string;
  commune: string;
  type: string;
  produit: string;
  nb_colis: number;
  valeur: number;
  remarque: string;
  tailles?: string;
}

export async function createProcolisShipment(data: {
  orderRef: string;
  customerName: string;
  customerPhone: string;
  wilaya: string;
  commune: string;
  address: string;
  total: number;
  itemCount: number;
  notes?: string;
}) {
  const token = process.env.PROCOLIS_TOKEN;
  const key = process.env.PROCOLIS_KEY;

  if (!token || !key) {
    console.error("Procolis credentials not configured");
    return { success: false, error: "Shipping service not configured" };
  }

  // ZR Express / Procolis uses specific wilaya IDs - need mapping
  // 11 new wilayas (Law n°26-06, 2026) NOT added — confirm codes with ZR Express first
  const WILAYA_CODE_MAP: Record<string, number> = {
    "Adrar": 1, "Chlef": 2, "Laghouat": 3, "Oum El Bouaghi": 4,
    "Batna": 5, "Béjaïa": 6, "Biskra": 7, "Béchar": 8, "Blida": 9,
    "Bouira": 10, "Tamanrasset": 11, "Tébessa": 12, "Tlemcen": 13,
    "Tiaret": 14, "Tizi Ouzou": 15, "Alger": 16, "Djelfa": 17,
    "Jijel": 18, "Sétif": 19, "Saïda": 20, "Skikda": 21,
    "Sidi Bel Abbès": 22, "Annaba": 23, "Guelma": 24, "Constantine": 25,
    "Médéa": 26, "Mostaganem": 27, "M'Sila": 28, "Mascara": 29,
    "Ouargla": 30, "Oran": 31, "El Bayadh": 32, "Illizi": 33,
    "Bordj Bou Arréridj": 34, "Boumerdès": 35, "El Tarf": 36,
    "Tindouf": 37, "Tissemsilt": 38, "El Oued": 39, "Khenchela": 40,
    "Souk Ahras": 41, "Tipaza": 42, "Mila": 43, "Aïn Defla": 44,
    "Naâma": 45, "Aïn Témouchent": 46, "Ghardaïa": 47, "Relizane": 48,
    "Timimoun": 49, "Bordj Badji Mokhtar": 50, "Ouled Djellal": 51,
    "Béni Abbès": 52, "In Salah": 53, "In Guezzam": 54,
    "Touggourt": 55, "Djanet": 56, "El M'Ghair": 57, "El Meniaa": 58,
  };

  const colisData: ProcolisColis = {
    token,
    key,
    expediteur: "CopIt Store",
    telephone_expediteur: "0562829805",
    destinataire: data.customerName,
    telephone_destinataire: data.customerPhone,
    adresse: data.address,
    wilaya: String(WILAYA_CODE_MAP[data.wilaya] || 16),
    commune: data.commune,
    type: "1", // 1 = standard
    produit: `Commande ${data.orderRef}`,
    nb_colis: data.itemCount,
    valeur: data.total,
    remarque: data.notes || "",
  };

  try {
    const response = await fetch("https://procolis.com/api_v1/add_colis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(colisData),
    });

    const result = await response.json();

    if (result.id_colis) {
      return { success: true, trackingId: result.id_colis, data: result };
    }

    return { success: false, error: result.message || "Unknown error" };
  } catch (error) {
    console.error("Procolis API error:", error);
    return { success: false, error: "Shipping service temporarily unavailable" };
  }
}
