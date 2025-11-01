"use client";
import "../styles.css";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AssistantIA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // 🧠 Envoi de la question à l’IA
  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.answer || "Pas de réponse reçue.");
    } catch (err) {
      console.error(err);
      setAnswer("Erreur de connexion à l’IA.");
    } finally {
      setLoading(false);
    }
  };

  // 🎙️ Reconnaissance vocale (poser la question à voix haute)
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Désolé, la reconnaissance vocale n’est pas supportée sur ce navigateur 😢");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      console.error("Erreur de reconnaissance vocale :", event.error);
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      setTimeout(() => handleAsk(), 500); // envoi automatique à l’IA
    };

    recognition.start();
  };

  // 🔊 Lecture vocale avec OpenAI TTS (voix naturelle)
  const handleSpeak = async (text) => {
    if (!text) return;

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Erreur de synthèse vocale");
      }

      // Convertir le flux audio en son et le jouer
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Erreur TTS :", error);
    }
  };

  // 🔄 Lecture automatique dès que Tazkira donne une réponse
  useEffect(() => {
    if (answer && !loading) {
      handleSpeak(answer);
    }
  }, [answer, loading]);

  return (
    <div className="main-container">
      <h1>Assistant IA – Tazkira</h1>

      <p>
        Parle ou écris à Tazkira pour poser tes questions spirituelles
        et recevoir une réponse apaisante 🌿
      </p>

      <textarea
        placeholder="Ex : Quelle sourate me conseillerais-tu pour apaiser mon cœur ?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows="4"
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "10px",
          borderRadius: "8px",
          border: "1px solid #b7e4c7",
          backgroundColor: "#f9fff9",
          fontSize: "1rem",
        }}
      ></textarea>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={handleAsk} disabled={loading}>
          {loading ? "Tazkira réfléchit..." : "Envoyer"}
        </button>

        <button
          onClick={handleVoiceInput}
          style={{
            backgroundColor: listening ? "#2d6a4f" : "#1b4332",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
          }}
        >
          {listening ? "🎧 J’écoute..." : "🎙️ Parler"}
        </button>
      </div>

      {answer && (
        <div
          className="ia-answer"
          style={{
            marginTop: "20px",
            backgroundColor: "#f0fff4",
            borderRadius: "10px",
            padding: "15px",
          }}
        >
          <strong>Réponse :</strong>
          <p style={{ marginTop: "10px" }}>{answer}</p>

          <button
            onClick={() => handleSpeak(answer)}
            style={{
              marginTop: "10px",
              backgroundColor: "#1b4332",
              color: "white",
              padding: "8px 14px",
              borderRadius: "8px",
            }}
          >
            🔊 Répéter la réponse
          </button>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link href="/">← Retour à l’accueil</Link>
      </div>
    </div>
  );
}