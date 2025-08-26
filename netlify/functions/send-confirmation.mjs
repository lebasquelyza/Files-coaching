// /.netlify/functions/send-confirmation
// Envoi via Resend vers mail-tester (adresse fournie)

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY");
      return { statusCode: 500, body: "Server not configured" };
    }

    const data = JSON.parse(event.body || "{}");
    const {
      prenom = "",
      age = "",
      poids = "",
      niveau = "",
      objectif = "",
      dispo = "",
      email = "",
    } = data;

    // Contenu
    const from = "Files Coaching <contact@files-coaching.com>"; // ton domaine
    const to = "test-cvxzq2i5r@srv1.mail-tester.com";            // ton destinataire de test
    const subject = "Test SPF/DKIM/DMARC — Files Coaching";

    const text = [
      "Hello, test de configuration.",
      "",
      "Infos formulaire :",
      `- Prénom: ${prenom}`,
      `- Âge: ${age}`,
      `- Poids: ${poids}`,
      `- Niveau: ${niveau}`,
      `- Objectif: ${objectif}`,
      `- Dispo: ${dispo}`,
      `- Email saisi: ${email}`,
    ].join("\n");

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>Test SPF/DKIM/DMARC</h2>
        <p>Hello, ceci est un test de configuration.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <h3>Infos formulaire</h3>
        <ul>
          <li><b>Prénom:</b> ${escapeHtml(prenom)}</li>
          <li><b>Âge:</b> ${escapeHtml(String(age))}</li>
          <li><b>Poids:</b> ${escapeHtml(String(poids))}</li>
          <li><b>Niveau:</b> ${escapeHtml(niveau)}</li>
          <li><b>Objectif:</b> ${escapeHtml(objectif)}</li>
          <li><b>Dispo:</b> ${escapeHtml(dispo)}</li>
          <li><b>Email saisi:</b> ${escapeHtml(email)}</li>
        </ul>
        <p style="color:#888">Envoyé via Resend → mail-tester.</p>
      </div>
    `.trim();

    // Appel API Resend
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text,
        html,
        reply_to: "Files Coaching <contact@files-coaching.com>",
      }),
    });

    const body = await resp.text();
    if (!resp.ok) {
      console.error("Resend error:", resp.status, body);
      return { statusCode: 500, body: "send-confirmation failed" };
    }

    return { statusCode: 200, body: body || JSON.stringify({ ok: true }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: "send-confirmation failed (exception)" };
  }
};

// --- helpers ---
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

