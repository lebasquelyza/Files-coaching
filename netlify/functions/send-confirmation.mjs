// netlify/functions/send-confirmation.mjs
import { Resend } from "resend";

// --- Config Resend (région EU par défaut)
const resend = new Resend(process.env.RESEND_API_KEY, {
  baseUrl: process.env.RESEND_BASE_URL || "https://api.eu.resend.com",
});

// --- CORS basique
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// --- Test mode (désactivé par défaut)
function isTest(event) {
  const envTest = String(process.env.SEND_TEST || "0") === "1";
  const raw = event.rawUrl || "http://localhost/.netlify/functions/send-confirmation";
  let qpTest = false;
  try {
    const url = new URL(raw);
    qpTest = url.searchParams.get("test") === "1";
  } catch {}
  return envTest || qpTest;
}

// --- Helpers
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function handler(event) {
  // Préflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: CORS, body: "Method Not Allowed" };
  }
  if (!process.env.RESEND_API_KEY) {
    return { statusCode: 500, headers: CORS, body: "Missing RESEND_API_KEY" };
  }

  // Parse body (JSON ou x-www-form-urlencoded)
  let data = {};
  const ct = String(event.headers["content-type"] || "").toLowerCase();
  try {
    if (ct.includes("application/json")) {
      data = JSON.parse(event.body || "{}");
    } else if (ct.includes("application/x-www-form-urlencoded")) {
      data = Object.fromEntries(new URLSearchParams(event.body));
    } else {
      data = JSON.parse(event.body || "{}");
    }
  } catch {
    data = {};
  }

  // Champs attendus (garde tout en ASCII sans accents côté clé)
  const {
    email,
    prenom,
    age,
    poids,
    taille,
    niveau,
    objectif,
    dispo,
    lieu,
    materiel
  } = data || {};

  // Addresses
  const adminEmail = process.env.ADMIN_EMAIL || "contact@files-coaching.com";
  const notifyEmail = process.env.NOTIFY_EMAIL || adminEmail;

  // Validation e-mail client (sauf en mode test)
  const okEmail = (e) => !!e && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
  if (!isTest(event) && !okEmail(email)) {
    return { statusCode: 400, headers: CORS, body: "Invalid client email" };
  }

  // Expéditeur: domaine vérifié
  const FROM_TEST = "Files Coaching <onboarding@resend.dev>";
  const FROM_PROD = `Files Coaching <${process.env.FROM_EMAIL || "contact@files-coaching.com"}>`;
  const fromAddr = isTest(event) ? FROM_TEST : FROM_PROD;

  // Contenu — Client
  const htmlClient = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial;line-height:1.6;color:#111">
      <h2 style="color:#16a34a">Merci ${escapeHtml(prenom || "")} 🙏</h2>
      <p>Ton questionnaire a bien été transmis à <b>Files Coaching</b>.
      Nous allons analyser tes réponses pour préparer <b>une séance adaptée</b> à ton niveau, ton objectif et tes dispos.</p>
      <p><b>Prochaines étapes :</b><br>
        • Analyse de tes réponses 👀<br>
        • Construction d’un plan personnalisé 📝<br>
        • Envoi de ta proposition 💪
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
      <p style="font-size:0.9em;color:#555">
        Cet e-mail est automatique, merci de ne pas y répondre.<br>
        Une question ? <a href="mailto:${adminEmail}">${adminEmail}</a>
      </p>
      <p style="margin-top:20px">À très vite 👋<br><b>L’équipe Files Coaching</b></p>
    </div>
  `.trim();

  const textClient = `Merci ${prenom || ""} 🙏

Ton questionnaire a bien été reçu par Files Coaching.
Nous préparons une séance adaptée à ton niveau, ton objectif et tes disponibilités.

Prochaines étapes :
• Analyse 👀
• Plan personnalisé 📝
• Envoi de ta proposition 💪

Ne réponds pas à ce mail automatique.
Contact : ${adminEmail}

— L’équipe Files Coaching`;

  // Contenu — Admin
  const htmlAdmin = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
      <p><b>Nouveau questionnaire reçu</b></p>
      <ul>
        <li><b>Prénom:</b> ${escapeHtml(prenom || "-")}</li>
        <li><b>Email:</b> ${escapeHtml(email || "-")}</li>
        <li><b>Âge:</b> ${escapeHtml(String(age || "-"))}</li>
        <li><b>Poids:</b> ${escapeHtml(String(poids || "-"))}</li>
        <li><b>Taille:</b> ${escapeHtml(String(taille || "-"))}</li>
        <li><b>Niveau:</b> ${escapeHtml(niveau || "-")}</li>
        <li><b>Objectif:</b> ${escapeHtml(objectif || "-")}</li>
        <li><b>Lieu:</b> ${escapeHtml(lieu || "-")}</li>
        <li><b>Matériel:</b> ${escapeHtml(materiel || "-")}</li>
        <li><b>Dispos:</b> ${escapeHtml(String(dispo || "-")).replace(/\n/g,"<br>")}</li>
      </ul>
    </div>
  `.trim();

  // Envois en parallèle
  const toClient = email;
  const toAdmin  = notifyEmail;

  const sendClient = resend.emails.send({
    from: fromAddr,
    to: [toClient],
    subject: "🎉 Merci ! Ton coaching personnalisé arrive bientôt",
    html: htmlClient,
    text: textClient,
    reply_to: adminEmail,
  });

  const sendAdmin = resend.emails.send({
    from: fromAddr,
    to: [toAdmin],
    subject: `Nouveau questionnaire: ${prenom || "inconnu"}`,
    html: htmlAdmin,
    text: htmlAdmin.replace(/<[^>]+>/g, "").replace(/\s+\n/g, "\n"),
    reply_to: adminEmail,
  });

  const [clientRes, adminRes] = await Promise.allSettled([sendClient, sendAdmin]);

  const result = {
    okClient: clientRes.status === "fulfilled" && !clientRes.value?.error,
    okAdmin:  adminRes.status  === "fulfilled" && !adminRes.value?.error,
    test: isTest(event),
  };
  if (clientRes.status === "rejected") result.clientError = String(clientRes.reason);
  if (adminRes.status  === "rejected") result.adminError  = String(adminRes.reason);

  // On renvoie 200 si le mail client a bien été envoyé (même si l’admin a raté),
  // sinon 500 pour signaler l’échec.
  const status = result.okClient ? 200 : 500;

  return { statusCode: status, headers: CORS, body: JSON.stringify(result) };
}
