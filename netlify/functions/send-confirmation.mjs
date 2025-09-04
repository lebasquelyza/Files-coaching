import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY, {
  baseUrl: "https://api.eu.resend.com",
});

// CORS
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Toggle TEST/PROD
function isTest(event) {
  const envTest = String(process.env.SEND_TEST || "1") === "1";
  const qp = new URL(event.rawUrl || `http://x${event.path}${event.rawQuery ? "?" + event.rawQuery : ""}`);
  const qpTest = qp.searchParams.get("test") === "1";
  return envTest || qpTest;
}

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

  // Lecture body
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

  // Champs attendus (⚠️ "materiel" sans accent)
  const {
    email,
    prenom,
    age,
    poids,
    niveau,
    objectif,
    dispo,
    materiel,
    lieu,
    taille,
  } = data || {};

  // Validation email (sauf en test)
  const okEmail = (e) => !!e && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
  if (!okEmail(email) && !isTest(event)) {
    return { statusCode: 400, headers: cors, body: "Invalid client email" };
  }

  // Config envois
  const adminEmail = process.env.ADMIN_EMAIL || "sportifandpro@gmail.com";
  const toClient = email;
  const toAdmin = adminEmail;

  const FROM_TEST = "Files Coaching <onboarding@resend.dev>"; // OK en mode test
  const FROM_PROD = process.env.FROM_EMAIL || "Files Coaching <contact@files-coaching.com>";
  const from = isTest(event) ? FROM_TEST : FROM_PROD; // ← UNE SEULE déclaration de "from"

  // --------- CONTENU CLIENT ---------
  const htmlClient = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial;line-height:1.6;color:#111">
      <h2 style="color:#16a34a">Merci ${escapeHtml(prenom || "")} 🙏</h2>
      <p>
        Ton questionnaire a bien été transmis à <b>Files Coaching</b>.
        Chaque réponse est précieuse : elles nous aident à préparer
        <b>une séance parfaitement adaptée</b> à ton niveau, ton objectif et ton emploi du temps.
      </p>
      <p>
        <b>Concrètement :</b><br>
        • Nous allons examiner tes réponses 👀<br>
        • Nous bâtissons un plan personnalisé 📝<br>
        • Tu recevras bientôt ta proposition de séances 💪
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
      <p style="font-size:0.9em;color:#555">
        Cet e-mail est automatique, merci de ne pas y répondre directement.<br>
        Pour toute question, écris-nous à
        <a href="mailto:${adminEmail}">${adminEmail}</a>.
      </p>
      <p style="margin-top:20px">À très vite 👋<br><b>L’équipe Files Coaching</b></p>
    </div>
  `.trim();

  const textClient = `Merci ${prenom || ""} 🙏

Ton questionnaire a bien été reçu par Files Coaching.

Chaque réponse compte : elles nous permettent de préparer une séance adaptée à ton niveau, ton objectif et tes disponibilités.

Concrètement :
- Nous allons examiner tes réponses 👀
- Nous bâtissons un plan personnalisé 📝
- Tu recevras bientôt ta proposition de séances 💪

Cet e-mail est automatique, merci de ne pas y répondre.
Pour toute question : ${adminEmail}

— L’équipe Files Coaching`;

  // --------- CONTENU ADMIN ---------
  const htmlAdmin = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
      <p><b>Nouveau questionnaire reçu</b></p>
      <ul>
        <li><b>Prénom:</b> ${escapeHtml(prenom || "-")}</li>
        <li><b>Email client:</b> ${escapeHtml(email || "-")}</li>
        <li><b>Âge:</b> ${escapeHtml(String(age ?? "-"))}</li>
        <li><b>Poids:</b> ${escapeHtml(String(poids ?? "-"))}</li>
        <li><b>Taille:</b> ${escapeHtml(String(taille ?? "-"))}</li>
        <li><b>Niveau:</b> ${escapeHtml(niveau || "-")}</li>
        <li><b>Objectif:</b> ${escapeHtml(objectif || "-")}</li>
        <li><b>Lieu:</b> ${escapeHtml(lieu || "-")}</li>
        <li><b>Matériel:</b> ${escapeHtml(materiel || "-")}</li>
        <li><b>Dispos:</b> ${escapeHtml(dispo || "-").replace(/\n/g,"<br>")}</li>
      </ul>
    </div>
  `.trim();

  // Envois en parallèle
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

  if (clientRes.status === "fulfilled") {
    if (clientRes.value?.error) result.clientError = clientRes.value.error;
    else { result.ok = true; result.clientId = clientRes.value?.data?.id; }
  } else {
    result.clientError = String(clientRes.reason);
  }

  if (adminRes.status === "fulfilled") {
    if (adminRes.value?.error) result.adminError = adminRes.value.error;
    else result.adminId = adminRes.value?.data?.id;
  } else {
    result.adminError = String(adminRes.reason);
  }

  return {
    statusCode: result.ok ? 200 : 500,
    headers: cors,
    body: JSON.stringify(result),
  };
}

// Helpers
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
