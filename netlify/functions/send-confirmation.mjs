import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: cors, body: "Method Not Allowed" };

  if (!process.env.RESEND_API_KEY) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ ok:false, clientError: "Missing RESEND_API_KEY" }) };
  }

  // Parse body (JSON ou x-www-form-urlencoded)
  let data = {};
  const ct = String(event.headers["content-type"] || "").toLowerCase();
  try {
    data = ct.includes("application/x-www-form-urlencoded")
      ? Object.fromEntries(new URLSearchParams(event.body))
      : JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ ok:false, clientError: "Invalid JSON body" }) };
  }

  const { email, prenom, age, poids, taille, niveau, objectif, dispo } = data || {};
  const okEmail = (e) => !!e && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
  if (!okEmail(email)) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ ok:false, clientError: "Invalid client email" }) };
  }

  const from = "Files Coaching <onboarding@resend.dev>";
  const adminEmail = "sportifandpro@gmail.com";

  // --------- Templates ----------
  const htmlClient = `
    <p>Salut ${prenom || ""} 👋</p>
    <p>Merci d’avoir rempli notre questionnaire 🙏</p>
    <p>L’équipe <b>Files Coaching</b> prépare une <b>séance sur-mesure</b> adaptée à ton objectif, ton niveau et tes dispos 💪</p>
    <p>Tu recevras bientôt ton plan personnalisé par e-mail 🚀</p>
    <hr>
    <p><em>Récap :</em></p>
    <ul>
      <li><b>Âge:</b> ${age || "-"}</li>
      <li><b>Poids:</b> ${poids || "-"}</li>
      <li><b>Taille:</b> ${taille || "-"} cm</li>
      <li><b>Niveau:</b> ${niveau || "-"}</li>
      <li><b>Objectif:</b> ${objectif || "-"}</li>
      <li><b>Disponibilités:</b> ${(dispo || "-").replace(/\n/g,"<br>")}</li>
    </ul>
    <hr>
    <p style="font-size:0.9em;color:#666">
      ⚠️ E-mail automatique, ne pas répondre.<br>
      Besoin d’aide : <a href="mailto:sportifandpro@gmail.com">sportifandpro@gmail.com</a>
    </p>
    <p>À très vite ✨<br><b>Lyza — Files Coaching</b></p>
  `;
  const textClient =
`Salut ${prenom || ""} 👋
Merci pour ton questionnaire 🙏
Files Coaching prépare une séance sur-mesure 💪
Tu recevras bientôt ton plan par e-mail 🚀

— Récap —
Âge: ${age || "-"}
Poids: ${poids || "-"}
Taille: ${taille || "-"} cm
Niveau: ${niveau || "-"}
Objectif: ${objectif || "-"}
Disponibilités: ${(dispo || "-").replace(/\n/g," / ")}

⚠️ E-mail automatique, ne pas répondre.
Questions: sportifandpro@gmail.com
Lyza — Files Coaching`;

  const htmlAdmin = `
    <p>Nouveau questionnaire</p>
    <ul>
      <li><b>Prénom:</b> ${prenom || "-"}</li>
      <li><b>Email:</b> ${email}</li>
      <li><b>Âge:</b> ${age || "-"}</li>
      <li><b>Poids:</b> ${poids || "-"}</li>
      <li><b>Taille:</b> ${taille || "-"} cm</li>
      <li><b>Niveau:</b> ${niveau || "-"}</li>
      <li><b>Objectif:</b> ${objectif || "-"}</li>
      <li><b>Disponibilités:</b> ${(dispo || "-").replace(/\n/g,"<br>")}</li>
    </ul>`;

  // --------- Envoi CLIENT (bloquant) ----------
  try {
    const client = await resend.emails.send({
      from,
      to: [email],
      subject: "🎉 Merci ! Ton coaching personnalisé arrive bientôt",
      html: htmlClient,
      text: textClient,
      reply_to: "sportifandpro@gmail.com"
    });

    if (client?.error) {
      // Resend renvoie { error: { name, message, statusCode } }
      return { statusCode: 500, headers: cors, body: JSON.stringify({ ok:false, clientError: client.error }) };
    }
  } catch (err) {
    console.error("[client email error]", err);
    return { statusCode: 500, headers: cors, body: JSON.stringify({ ok:false, clientError: String(err) }) };
  }

  // --------- Envoi ADMIN (non bloquant) ----------
  try {
    await resend.emails.send({
      from,
      to: [adminEmail],
      subject: `Nouveau questionnaire: ${prenom || "inconnu"}`,
      html: htmlAdmin,
      text: htmlAdmin.replace(/<[^>]+>/g,"").replace(/\s+\n/g,"\n"),
      reply_to: "sportifandpro@gmail.com"
    });
  } catch (e) {
    console.warn("[admin email error]", e);
  }

  return { statusCode: 200, headers: cors, body: JSON.stringify({ ok:true }) };
}
