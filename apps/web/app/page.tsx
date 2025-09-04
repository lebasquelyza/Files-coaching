
"use client";
import { useState } from "react";
import "./(marketing)/landing.css";

export default function Landing() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header>
        <div className="container nav">
          <a href="/" className="brand">
            <span className="mark" />
            <span>Files Le Coach</span>
          </a>
          <nav className={open ? "menu open" : "menu"}>
            <a href="#features">Fonctionnalités</a>
            <a href="#pricing">Tarifs</a>
            <a href="#contact">Contact</a>
            <a className="cta" href="/sign-in">Se connecter</a>
          </nav>
          <button className="burger" onClick={()=>setOpen(o=>!o)} aria-label="Menu">☰</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container wrap">
            <div className="copy">
              <div className="badges">
                <span className="badge">Coach sportif IA</span>
                <span className="badge">24/7</span>
                <span className="badge">Programmes personnalisés</span>
              </div>
              <h1>Votre coach sportif <span style={{color:"var(--brand)"}}>artificiel</span>, partout avec vous.</h1>
              <p>Files Le Coach crée vos séances, corrige votre posture, propose des recettes healthy et booste votre motivation.</p>
              <div style={{display:"flex", gap:12, marginTop:18}}>
                <a className="cta" href="/sign-in">Commencer maintenant</a>
                <a className="cta" href="/dashboard/pricing" style={{background:"linear-gradient(135deg,var(--accent),var(--brand))"}}>Voir les tarifs</a>
              </div>
              <div className="stats">
                <div className="stat"><span className="num">3 min</span><span className="label">Pour démarrer</span></div>
                <div className="stat"><span className="num">+100</span><span className="label">Idées de recettes</span></div>
                <div className="stat"><span className="num">24/7</span><span className="label">Coach dispo</span></div>
              </div>
            </div>
            <div className="visual">
              <div className="card" style={{padding:12}}>
                <img alt="Aperçu app" src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80&auto=format&fit=crop" />
              </div>
            </div>
          </div>
        </section>

        <section id="features" style={{padding:"32px 0"}}>
          <div className="container">
            <div className="card" style={{padding:24}}>
              <h2 style={{marginTop:0}}>Fonctionnalités clés</h2>
              <ul style={{display:"grid", gridTemplateColumns:"repeat(2, minmax(0,1fr))", gap:16}}>
                <li className="card" style={{padding:16}}>🎥 <b>Files te corrige</b> — filme-toi et reçois des tips en direct.</li>
                <li className="card" style={{padding:16}}>📈 <b>Mes progrès</b> — questionnaire sauvegardé avec historique.</li>
                <li className="card" style={{padding:16}}>🥗 <b>Recettes healthy</b> — adaptées à ton plan.</li>
                <li className="card" style={{padding:16}}>🔔 <b>Notifications</b> — messages Files ou perso à intervalles.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="pricing" style={{padding:"32px 0"}}>
          <div className="container">
            <div className="card" style={{padding:24, display:"flex", gap:16}}>
              <div style={{flex:1}}>
                <h3>Basic — 9,90 €/mois</h3>
                <p>Chatbot, recettes générales, suivi progrès, motivation.</p>
              </div>
              <div style={{flex:1}}>
                <h3>Plus — 19,90 €/mois</h3>
                <p>Recettes personnalisées, 3 séances IA, -50% 1ʳᵉ visio.</p>
              </div>
              <div style={{flex:1}}>
                <h3>Premium — 39,90 €/mois</h3>
                <p>Correction vidéo exos, accès intégral, +1 visio offerte.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" style={{padding:"32px 0"}}>
          <div className="container">
            <div className="card" style={{padding:24, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16}}>
              <div><h3 style={{margin:"0 0 8px"}}>Prêt à démarrer ?</h3><p>Créez votre compte et commencez aujourd’hui.</p></div>
              <a className="cta" href="/sign-in">Créer un compte</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
