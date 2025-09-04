// netlify/functions/send-confirmation.mjs
import { Resend } from "resend";

/* =========================
   Config & initialisation
   ========================= */
const resend = new Resend(process.env.RESEND_API_KEY, {
  baseUrl: process.env.RESEND_BASE_URL || "https://api.eu.resend.com", // EU endpoint
});

// Autoriser UNIQUEMENT tes origines (ajoute/retire si besoin)
const ALLOWED_ORIGINS = (
  process.env.CORS_ORIGINS || [
    "https://questionnaire.files-coaching.com",
    "https://questionnaire-files.netlify.app",
    "http://localhost:8888",
    "http://localhost:5173",
  ].join(",")
).split(",").map(s => s.trim()).filter(Boolean);

function makeCorsHeaders(event) {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] || "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Toggle test/prod : SEND_TEST=1 (test) / 0 (prod) ou ?test=1
function isTest(event) {
  if (String(process.env.SEND_TEST || "0") === "1") return true;
  try {
    const url = new URL(event.rawUrl || `http://x${event.path}${event.rawQuery ? "?" + event.rawQuery : ""}`);
    if (url.searchParams.get("test") === "1") return true;
  } catch {}
  return false;
}

/* =========================
   Handler
   ========================= */
export async function handler(event) {
  const CORS = makeCorsHeaders(event);

  // Preflight CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: CORS, body: "Method Not Allowed" };
  }

  // Vérifs ENV
  if (!process.env.RESEND_API_KEY) {
    return { statusCode: 500, headers: CORS, body: "Missing RESEND_API_KEY" };
  }

  // Expéditeur & destinataires (ENV ou valeurs par défaut)
  const FROM_EMAIL = process.env.FROM_EMAIL || "Files Coaching <contact@files-coaching.com>"; // domaine Resend vérifié
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "sportifandpro@gmail.com";

  // Lecture body (JSON ou x-www-form-urlencoded)
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

  // Champs attendus (garde compat. "matériel" avec accent)
  const prenom   = data.prenom ?? data.first_name ?? "";
  const email    = data.email ?? "";
  const age      = data.age ?? "";
  const poids    = data.poids ?? "";
  const taille   = data.taille ?? "";
  const niveau   = data.niveau ?? "";
  const objectif = data.objectif ?? "";
  const dispo    = data.dispo ?? "";
  const lieu     = data.lieu ?? data.place ?? "";
  const materiel = data.materiel ?? data["matériel"] ?? data["materiel?"] ?? "";

  // Validation e-mail client (sauf en mode test)
  const okEmail = e => !!e && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
  if (!okEmail(email) && !isTest(event)) {
    return { statusCode: 400, headers: CORS, body: "Invalid client email" };
  }

  // From: onboarding@resend.dev en TEST, ton domaine vérifié en PROD
  const from = isTest(event)
    ? "Files Coaching <onboarding@resend.dev>"
    : FROM_EMAIL;

  const toClient = okEmail(email) ? email : ADMIN_EMAIL; // en test, on peut fallback
  const toAdmin  = ADMIN_EMAIL;
  const replyTo  = ADMIN_EMAIL;

  /* =========================
     Contenu e-mails
     ========================= */
  const adminEmail = ADMIN_EMAIL;

  const htmlClient = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial;line-height:1.6;color:#111">
      <h2 style="color:#16a34a">Merci ${escapeHtml(prenom || "")} 🙏</h2>
      <p>
        Ton questionnaire a bien été transmis à <b>Files Coaching</b>.
        Nous allons analyser tes réponses et préparer <b>une proposition de séances</b>
        adaptée à ton niveau, ton objectif et tes disponibilités.
      </p>
      <p>
        <b>Prochaines étapes :</b><br>
        • Analyse de tes réponses 👀<br>
        • Préparation d’un exemple plan personnalisé 📝<br>
        • Réception de notre proposition
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
      <p style="font-size:0.9em;color:#555">
        Cet e-mail est automatique, merci de ne pas y répondre directement.<br>
        Une question ? Écris-nous : <a href="mailto:${adminEmail}">${adminEmail}</a>.
      </p>
      <p style="margin-top:20px">À très vite 👋<br><b>L’équipe Files Coaching</b></p>
    </div>
  `.trim();

  const textClient =
`Merci ${prenom || ""} 🙏

Ton questionnaire a bien été reçu par Files Coaching.
Nous analysons tes réponses et préparons une proposition de séances
adaptée à ton niveau, ton objectif et tes disponibilités.

Étapes :
- Analyse de tes réponses 👀
- Exemple de plan personnalisé 📝
- Envoi de notre proposition 💪

Questions : ${adminEmail}
— L’équipe Files Coaching`;

  const htmlAdmin = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
      <p><b>Nouveau questionnaire reçu</b></p>
      <ul>
        <li><b>Prénom:</b> ${escapeHtml(prenom || "-")}</li>
        <li><b>Email:</b> ${escapeHtml(email || "-")}</li>
        <li><b>Âge:</b> ${escapeHtml(String(age || "-"))}</li>
        <li><b>Taille:</b> ${escapeHtml(String(taille || "-"))}</li>
        <li><b>Poids:</b> ${escapeHtml(String(poids || "-"))}</li>
        <li><b>Niveau:</b> ${escapeHtml(niveau || "-")}</li>
        <li><b>Objectif:</b> ${escapeHtml(objectif || "-")}</li>
        <li><b>Lieu séance:</b> ${escapeHtml(lieu || "-")}</li>
        <li><b>Matériel:</b> ${escapeHtml(materiel || "-")}</li>
        <li><b>Dispos:</b> ${escapeHtml(dispo || "-").replace(/\n/g,"<br>")}</li>
      </ul>
    </div>
  `.trim();

  /* =========================
     Envois
     ========================= */
  try {
    const [clientRes, adminRes] = await Promise.allSettled([
      resend.emails.send({
        from,
        to: [toClient],
        subject: "🎉 Merci ! Ton exemple de coaching personnalisé arrive bientôt",
        html: htmlClient,
        text: textClient,
        reply_to: replyTo,
      }),
      resend.emails.send({
        from,
        to: [toAdmin],
        subject: `Nouveau questionnaire: ${prenom || "inconnu"}`,
        html: htmlAdmin,
        text: htmlAdmin.replace(/<[^>]+>/g, "").replace(/\s+\n/g, "\n"),
        reply_to: replyTo,
      }),
    ]);

    const result = { ok: true, test: isTest(event) };

    if (clientRes.status === "rejected") {
      result.ok = false;
      result.clientError = String(clientRes.reason);
    } else if (clientRes.value?.error) {
      result.ok = false;
      result.clientError = clientRes.value.error;
    } else {
      result.clientId = clientRes.value?.data?.id;
    }

    if (adminRes.status === "rejected") {
      result.adminError = String(adminRes.reason);
    } else if (adminRes.value?.error) {
      result.adminError = adminRes.value.error;
    } else {
      result.adminId = adminRes.value?.data?.id;
    }

    return {
      statusCode: result.ok ? 200 : 500,
      headers: CORS,
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ ok: false, error: String(err?.message || err) }),
    };
  }
}

/* =========================
   Helpers
   ========================= */
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
