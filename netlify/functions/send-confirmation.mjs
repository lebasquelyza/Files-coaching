import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY, {
  baseUrl: "https://api.eu.resend.com",
});

// CORS de base
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// expéditeur + destinataires
const FROM_TEST = "Files Coaching <onboarding@resend.dev>";   // OK sans domaine vérifié
const FROM_PROD = "Files Coaching <contact@files-coaching.com>"; // quand ton domaine Resend est vérifié
const adminEmail = "sportifandpro@gmail.com";                  // reçoit la notif
const toAdmin = adminEmail;

function isTest(event) {
  const envTest = String(process.env.SEND_TEST || "1") === "1";
  const u = new URL(event.rawUrl || `http://x${event.path}${event.rawQuery ? "?" + event.rawQuery : ""}`);
  return envTest || u.searchParams.get("test") === "1";
}

export async function handler(event) {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: "Method Not Allowed" };
  }
  if (!process.env.RESEND_API_KEY) {
    return { statusCode: 500, headers: cors, body: "Missing RESEND_API_KEY" };
  }

  // Parse body (JSON ou form-encoded)
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

  // ⚠️ noms SANS accent, doivent matcher ton <input name="...">
  const {
    email = "",
    prenom = "",
    age = "",
    poids = "",
    niveau = "",
    objectif = "",
    dispo = "",
    lieu = "",
    materiel = "",  // ← correspond à <input name="materiel">
    taille = "",
  } = data;

  // validation e-mail (sauf en test)
  const emailOk = !!email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!emailOk && !isTest(event)) {
    return { statusCode: 400, headers: cors, body: "Invalid client email" };
  }

  const from = isTest(event) ? FROM_TEST : FROM_PROD;
  const toClient = email || adminEmail; // en test sans email, on s’auto-envoie pour vérifier

  // --- contenu client
  const htmlClient = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial;line-height:1.6;color:#111">
      <h2 style="color:#16a34a">Merci ${escapeHtml(prenom)}</h2>
      <p>Ton questionnaire a bien été transmis à <b>Files Coaching</b>.
      Nous allons examiner tes réponses et préparer une proposition de séances adaptée 💪</p>
      <p style="font-size:0.9em;color:#555">Besoin d’aide ? Écris-nous : <a href="mailto:${adminEmail}">${adminEmail}</a></p>
      <p style="margin-top:20px">À très vite 👋<br><b>L’équipe Files Coaching</b></p>
    </div>
  `.trim();

  const textClient = `Merci ${prenom}

Ton questionnaire a bien été reçu par Files Coaching.
Nous préparons une proposition de séances adaptée.

Contact : ${adminEmail}
— L’équipe Files Coaching`;

  // --- contenu admin
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
        <li><b>Lieu:</b> ${escapeHtml(lieu || "-")}</li>
        <li><b>Matériel:</b> ${escapeHtml(materiel || "-")}</li>
        <li><b>Dispos:</b> ${escapeHtml(dispo || "-").replace(/\n/g, "<br>")}</li>
      </ul>
    </div>
  `.trim();

  // envois en parallèle
  const clientPromise = resend.emails.send({
    from,
    to: [toClient],
    subject: "🎉 Merci ! Ton coaching personnalisé arrive bientôt",
    html: htmlClient,
    text: textClient,
    reply_to: adminEmail,
  });

  const adminPromise = resend.emails.send({
    from,
    to: [toAdmin],
    subject: `Nouveau questionnaire: ${prenom || "inconnu"}`,
    html: htmlAdmin,
    text: htmlAdmin.replace(/<[^>]+>/g, "").replace(/\s+\n/g, "\n"),
    reply_to: adminEmail,
  });

  const [clientRes, adminRes] = await Promise.allSettled([clientPromise, adminPromise]);

  const result = { ok: false, test: isTest(event) };

  if (clientRes.status === "fulfilled" && !clientRes.value?.error) {
    result.ok = true;
    result.clientId = clientRes.value?.data?.id;
  } else {
    result.clientError = String(clientRes.reason || clientRes.value?.error || "");
  }
  if (adminRes.status === "fulfilled" && !adminRes.value?.error) {
    result.adminId = adminRes.value?.data?.id;
  } else {
    result.adminError = String(adminRes.reason || adminRes.value?.error || "");
  }

  return {
    statusCode: result.ok ? 200 : 500,
    headers: cors,
    body: JSON.stringify(result),
  };
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
