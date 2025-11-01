"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PageProgres() {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState("");
  const [progress, setProgress] = useState(0);
  const [aiMessage, setAiMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧾 Charger les données sauvegardées depuis le planificateur
  useEffect(() => {
    const savedTasks = localStorage.getItem("tazkira_tasks");
    const savedGoals = localStorage.getItem("tazkira_plan");

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks);

      const doneCount = parsedTasks.filter((t) => t.done).length;
      const total = parsedTasks.length;
      setProgress(total > 0 ? Math.round((doneCount / total) * 100) : 0);
    }

    if (savedGoals) setGoals(savedGoals.slice(0, 200) + "...");
  }, []);

  // 📈 Générer le message spirituel IA
  const handleGenerateBilan = async () => {
    setLoading(true);
    setAiMessage("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `
Tu es Tazkira, une IA spirituelle bienveillante.
Voici le bilan de l’utilisateur :

Objectif : ${goals}
Progression : ${progress}%

Analyse et commente sa semaine spirituelle :
- Commence par une phrase bienveillante.
- Donne un message d’encouragement adapté à son niveau de progression.
- Si le taux est faible (<50%), encourage avec douceur.
- Si le taux est élevé (>80%), félicite avec gratitude envers Allah.
- Termine par un petit conseil pour la semaine suivante.
Ne dépasse pas 5 lignes.
`,
        }),
      });

      const data = await res.json();
      const message = data.answer || "Erreur : aucune réponse IA reçue.";
      setAiMessage(message);
    } catch (error) {
      console.error("Erreur bilan :", error);
      setAiMessage("Erreur de connexion à Tazkira IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <h1>📊 Mes progrès – Tazkira</h1>

      <p>
        Voici ton avancement spirituel selon les tâches de ton plan hebdomadaire.
      </p>

      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2>🎯 Objectif : </h2>
        <p>{goals || "Aucun objectif renseigné."}</p>

        <div
          style={{
            width: "100%",
            height: "25px",
            borderRadius: "12px",
            backgroundColor: "#e5f5e0",
            marginTop: "15px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: "12px",
              backgroundColor: progress > 80 ? "#2d6a4f" : "#74c69d",
              transition: "width 1s ease-in-out",
            }}
          ></div>
        </div>

        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
          Progression : {progress}%
        </p>
      </div>

      <div style={{ marginTop: "25px" }}>
        <button onClick={handleGenerateBilan} disabled={loading}>
          {loading ? "Analyse en cours..." : "🧠 Générer mon bilan spirituel"}
        </button>
      </div>

      {aiMessage && (
        <div
          style={{
            marginTop: "20px",
            backgroundColor: "#f0fff4",
            borderRadius: "10px",
            padding: "15px",
            whiteSpace: "pre-wrap",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <strong>🌿 Message de Tazkira :</strong>
          <p style={{ marginTop: "10px" }}>{aiMessage}</p>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <Link href="/planificateur">← Retour au planificateur</Link>
      </div>
    </div>
  );
}