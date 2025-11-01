"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function TableauDeBordArabe() {
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestLetter: "",
    history: [],
  });

  useEffect(() => {
    const storedData = localStorage.getItem("arabicPronunciationHistory");
    if (storedData) {
      const history = JSON.parse(storedData);

      const totalAttempts = history.length;
      const averageScore =
        totalAttempts > 0
          ? Math.round(
              history.reduce((sum, entry) => sum + entry.score, 0) / totalAttempts
            )
          : 0;

      const best = history.reduce(
        (a, b) => (a.score > b.score ? a : b),
        { letter: "", score: 0 }
      );

      setStats({
        totalAttempts,
        averageScore,
        bestLetter: best.letter,
        history,
      });
    }
  }, []);

  // Regroupe les scores par lettre
  const averagePerLetter = Object.values(
    stats.history.reduce((acc, curr) => {
      if (!acc[curr.letter]) acc[curr.letter] = { letter: curr.letter, total: 0, count: 0 };
      acc[curr.letter].total += curr.score;
      acc[curr.letter].count += 1;
      return acc;
    }, {})
  ).map((entry) => ({
    letter: entry.letter,
    averageScore: Math.round(entry.total / entry.count),
  }));

  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px",
        backgroundColor: "#f0fff4",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#1b4332" }}>📊 Tableau de bord — Arabe</h1>
      <p>Voici un résumé complet de tes progrès oraux 🗣️</p>

      {/* === Résumé des performances === */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "15px 25px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total d’essais</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {stats.totalAttempts}
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "15px 25px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Score moyen</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {stats.averageScore} %
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "15px 25px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Meilleure lettre</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {stats.bestLetter || "—"}
          </p>
        </div>
      </div>

      {/* === GRAPHIQUE DE PROGRESSION === */}
      <h2 style={{ marginTop: "40px", color: "#2d6a4f" }}>
        📈 Moyenne de prononciation par lettre
      </h2>
      {averagePerLetter.length > 0 ? (
        <ResponsiveContainer width="90%" height={300}>
          <BarChart data={averagePerLetter}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="letter" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageScore" fill="#2d6a4f" name="Score moyen (%)" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ marginTop: "20px" }}>
          Aucun enregistrement pour le moment 🕊️
        </p>
      )}

      {/* === Historique détaillé === */}
      <h2 style={{ marginTop: "40px", color: "#2d6a4f" }}>
        🕓 Historique des entraînements
      </h2>
      <table
        style={{
          width: "80%",
          margin: "20px auto",
          borderCollapse: "collapse",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ backgroundColor: "#2d6a4f", color: "white" }}>
          <tr>
            <th style={{ padding: "10px" }}>Lettre</th>
            <th style={{ padding: "10px" }}>Score</th>
            <th style={{ padding: "10px" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {stats.history.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: "20px" }}>
                Aucun enregistrement pour l’instant 🕊️
              </td>
            </tr>
          ) : (
            stats.history.map((entry, i) => (
              <tr key={i}>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {entry.letter}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                    color: entry.score >= 80 ? "green" : "orange",
                  }}
                >
                  {entry.score} %
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {new Date(entry.date).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Link
        href="/arabe"
        style={{
          display: "inline-block",
          marginTop: "20px",
          color: "white",
          backgroundColor: "#1b4332",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        ← Retour à l’apprentissage
      </Link>
    </div>
  );
}