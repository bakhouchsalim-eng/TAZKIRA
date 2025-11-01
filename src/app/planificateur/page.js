"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Planificateur() {
  const [activeTab, setActiveTab] = useState("accueil");
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState("");

  // 🌙 Simule la progression du programme "Raffermir ma foi"
  const [completedDays, setCompletedDays] = useState(12); // valeur simulée
  const totalDays = 30;
  const progressPercent = Math.round((completedDays / totalDays) * 100);

  // --- Simulation de plan personnalisé ---
  const generatePlan = () => {
    if (!goal || !days) {
      alert("⚠️ Renseigne ton objectif et la durée !");
      return;
    }

    setGeneratedPlan(
      `📘 Plan personnalisé pour ton objectif : "${goal}" sur ${days} jours.\n\n🕌 Exemple :\n- Jour 1 : Apprends 5 versets de Al-Baqara (v.1–5)\n- Jour 2 : Révise les versets et médite la traduction.\n- Jour 3 : Ajoute 5 versets supplémentaires.\n... etc jusqu’à atteindre ton objectif.\n\n💡 Tazkira adaptera le rythme selon ta constance.`
    );
  };

  const buttonStyle = {
    backgroundColor: "#2d6a4f",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const tabButtonStyle = (tab) => ({
    backgroundColor: activeTab === tab ? "#2d6a4f" : "#d8f3dc",
    color: activeTab === tab ? "white" : "#1b4332",
    border: "1px solid #2d6a4f",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    margin: "0 5px",
  });

  return (
    <div className="main-container" style={{ textAlign: "center" }}>
      <h1>🕋 Planificateur spirituel</h1>

      {/* --- Onglets de navigation --- */}
      <div style={{ margin: "20px 0" }}>
        <button style={tabButtonStyle("accueil")} onClick={() => setActiveTab("accueil")}>
          Accueil
        </button>
        <button style={tabButtonStyle("libre")} onClick={() => setActiveTab("libre")}>
          Plan libre
        </button>
        <button style={tabButtonStyle("programmes")} onClick={() => setActiveTab("programmes")}>
          Programmes guidés
        </button>
      </div>

      {/* --- Contenu principal --- */}
      <div
        style={{
          backgroundColor: "#f1faee",
          borderRadius: "12px",
          padding: "20px",
          width: "85%",
          margin: "auto",
          minHeight: "350px",
        }}
      >
        {/* ACCUEIL */}
        {activeTab === "accueil" && (
          <>
            <h2>Bienvenue dans ton planificateur spirituel 🌙</h2>
            <p>
              Organise ta semaine religieuse, fixe-toi des objectifs réalistes et avance à ton
              rythme dans l’apprentissage du Coran.
            </p>
            <ul style={{ textAlign: "left", marginTop: "20px" }}>
              <li>🧭 Choisis un programme guidé (comme "Raffermir ma foi")</li>
              <li>📘 Ou crée ton propre plan libre avec ton objectif</li>
              <li>🔔 Reçois des rappels automatiques pour ne rien manquer</li>
            </ul>
          </>
        )}

        {/* PLAN LIBRE */}
        {activeTab === "libre" && (
          <>
            <h2>📘 Planificateur libre</h2>
            <p>
              Indique ton objectif et la durée pour que Tazkira te conçoive un plan d’étude sur
              mesure.
            </p>

            <input
              type="text"
              placeholder="Ex : Apprendre Juz Amma"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "70%",
                marginBottom: "10px",
              }}
            />
            <br />
            <input
              type="number"
              placeholder="Durée (en jours)"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "70%",
              }}
            />
            <br />
            <button onClick={generatePlan} style={{ ...buttonStyle, marginTop: "15px", backgroundColor: "#457b9d" }}>
              Générer mon plan ✨
            </button>

            {generatedPlan && (
              <div
                style={{
                  marginTop: "20px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "left",
                  whiteSpace: "pre-wrap",
                }}
              >
                {generatedPlan}
              </div>
            )}
          </>
        )}

        {/* PROGRAMMES GUIDÉS */}
        {activeTab === "programmes" && (
          <>
            <h2>🌿 Programmes guidés</h2>
            <p>Choisis un programme complet conçu pour renforcer ta foi et ta discipline.</p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: "center",
                marginTop: "25px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "15px 25px",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  width: "80%",
                }}
              >
                <h3>🌙 Raffermir ma foi (30 jours)</h3>
                <p style={{ color: "#333", marginBottom: "10px" }}>
                  Un parcours spirituel d’un mois avec des dhikr et actes quotidiens.
                </p>

                {/* --- Barre de progression --- */}
                <div
                  style={{
                    backgroundColor: "#d8f3dc",
                    borderRadius: "20px",
                    height: "20px",
                    width: "100%",
                    overflow: "hidden",
                    margin: "10px 0",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progressPercent}%`,
                      backgroundColor: "#2d6a4f",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>

                <p style={{ fontWeight: "bold", color: "#1b4332" }}>
                  ✅ {completedDays} / {totalDays} jours complétés ({progressPercent}%)
                </p>

                <Link href="/planificateur/programmes/foi">
                  <button style={{ ...buttonStyle, marginTop: "10px" }}>
                    Continuer le programme
                  </button>
                </Link>
              </div>

              {/* Prochains programmes */}
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "#52796f",
                  cursor: "not-allowed",
                }}
              >
                🕊️ Purifier mon cœur (bientôt)
              </button>
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "#52796f",
                  cursor: "not-allowed",
                }}
              >
                📿 Apprendre à prier (bientôt)
              </button>
            </div>
          </>
        )}
      </div>

      {/* --- Retour accueil --- */}
      <div style={{ marginTop: "25px" }}>
        <Link href="/">← Retour à l’accueil</Link>
      </div>
    </div>
  );
}