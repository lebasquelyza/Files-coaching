// netlify/functions/send-confirmation.mjs
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// CORS (utile si le formulaire fait un fetch depuis la même page)
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export async function handler(event) {
  // Préflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: "Method Not Allowed" };
  }

  if (!process.env.RESEND_API_KEY) {
    return { statusCode: 500, headers: cors, body: "Missing RESEND_API_KEY" };
  }

  // Lecture du body (JSON ou x-www-form-urlencoded)
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
    // ignore, data restera {}
  }

  const { email, prenom, age, poids, niveau, objectif, dispo } = data || {};

  // Validation e-mail
  const okEmail = (e) => !!e && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
  if (!okEmail(email)) {
    return { statusCode: 400, headers: cors, body: "Invalid client email" };
  }

  // Paramètres d'envoi
  const from = "Files Coaching <onboarding@resend.dev>"; // ok tant que ton domaine n'est pas vérifié
  const adminEmail = "sportifandpro@gmail.com";          // notification interne

  // Contenu e-mail CLIENT
  const htmlClient = `
    <p>Salut ${prenom || ""} 👋</p>
    <p>Merci d’avoir pris le temps de remplir notre questionnaire 🙏</p>
    <p>L’équipe <b>Files Coaching</b> est déjà en train de préparer une <b>séance sur-mesure</b> adaptée à ton objectif, ton niveau et tes dispos 💪</p>
    <p>Tu recevras bientôt ton plan personnalisé directement par e-mail 🚀</p>
    <hr>
    <p><em>Petit récap de tes infos :</em></p>
    <ul>
      <li><b>Âge:</b> ${age || "-"}</li>
      <li><b>Poids:</b> ${poids || "-"}</li>
      <li><b>Niveau:</b> ${niveau || "-"}</li>
      <li><b>Objectif:</b> ${objectif || "-"}</li>
      <li><b>Disponibilités:</b> ${(dispo || "-").replace(/\n/g,"<br>")}</li>
    </ul>
    <hr>
    <p style="font-size:0.9em;color:#666">
      ⚠️ Cet e-mail est automatique, merci de ne pas y répondre.<br>
      Pour toute question ou précision : <a href="mailto:sportifandpro@gmail.com">sportifandpro@gmail.com</a>
    </p>
    <p>À très vite ✨<br><b>Files Coaching</b></p>
  `;

  const textClient =
`Salut ${prenom || ""} 👋

Merci d’avoir pris le temps de remplir notre questionnaire 🙏
L’équipe Files Coaching prépare une séance sur-mesure adaptée à ton objectif, ton niveau et tes dispos 💪
Tu recevras bientôt ton plan personnalisé par e-mail 🚀

— Récap —
Âge: ${age || "-"}
Poids: ${poids || "-"}
Niveau: ${niveau || "-"}
Objectif: ${objectif || "-"}
Disponibilités: ${(dispo || "-").replace(/\n/g," / ")}

⚠️ E-mail automatique, ne pas répondre.
Questions: sportifandpro@gmail.com
Files Coaching`;

  // Contenu e-mail ADMIN
  const htmlAdmin = `
    <p>Nouveau questionnaire reçu.</p>
    <ul>
      <li><b>Prénom:</b> ${prenom || "-"}</li>
      <li><b>Email client:</b> ${email}</li>
      <li><b>Âge:</b> ${age || "-"}</li>
      <li><b>Poids:</b> ${poids || "-"}</li>
      <li><b>Niveau:</b> ${niveau || "-"}</li>
      <li><b>Objectif:</b> ${objectif || "-"}</li>
      <li><b>Disponibilités:</b> ${(dispo || "-").replace(/\n/g,"<br>")}</li>
    </ul>
  `;

  // Envois en parallèle (le client DOIT partir même si l'admin échoue)
  const clientPromise = resend.emails.send({
    from,
    to: [email],
    subject: "🎉 Merci ! Ton coaching personnalisé arrive bientôt",
    html: htmlClient,
    text: textClient,
    reply_to: "sportifandpro@gmail.com"
  });

  const adminPromise = resend.emails.send({
    from,
    to: [adminEmail],
    subject: `Nouveau questionnaire: ${prenom || "inconnu"}`,
    html: htmlAdmin,
    text: htmlAdmin.replace(/<[^>]+>/g, "").replace(/\s+\n/g, "\n"),
    reply_to: "sportifandpro@gmail.com"
  });

  const [clientRes, adminRes] = await Promise.allSettled([clientPromise, adminPromise]);

  // Bilan & réponse HTTP
  const result = { ok: false };

  if (clientRes.status === "fulfilled") {
    if (clientRes.value?.error) {
      result.clientError = clientRes.value.error;
    } else {
      result.ok = true;
      result.clientId = clientRes.value?.data?.id;
    }
  } else {
    result.clientError = String(clientRes.reason);
  }

  if (adminRes.status === "fulfilled") {
    if (adminRes.value?.error) {
      result.adminError = adminRes.value.error;
    } else {
      result.adminId = adminRes.value?.data?.id;
    }
  } else {
    result.adminError = String(adminRes.reason);
  }

  return {
    statusCode: result.ok ? 200 : 500,
    headers: cors,
    body: JSON.stringify(result)
  };
}


