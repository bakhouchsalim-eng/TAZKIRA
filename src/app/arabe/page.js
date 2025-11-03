"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const LETTERS = [
  "ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش",
  "ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي"
];

export default function ApprentissageArabe() {
  const [selectedLetter, setSelectedLetter] = useState(LETTERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [listening, setListening] = useState(false);

  const [speechScore, setSpeechScore] = useState(null);
  const [speechFeedback, setSpeechFeedback] = useState("");
  const [writingScore, setWritingScore] = useState(null);
  const [writingFeedback, setWritingFeedback] = useState("");
  const [globalMsg, setGlobalMsg] = useState("");

  const [mastered, setMastered] = useState([]);
  const [history, setHistory] = useState([]); // historique local

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Charger historique local
  useEffect(() => {
    const saved = localStorage.getItem("arabicProgress");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Sauvegarder historique
  const saveHistory = (entry) => {
    const updated = [...history, entry];
    setHistory(updated);
    localStorage.setItem("arabicProgress", JSON.stringify(updated));
  };

  // --- Initialisation du canvas ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#1d3557";
    ctxRef.current = ctx;

    const preventScroll = (e) => e.preventDefault();
    canvas.addEventListener("touchmove", preventScroll, { passive: false });
    return () => canvas.removeEventListener("touchmove", preventScroll);
  }, []);

  // --- Redessiner la lettre fantôme (calque de guidage) ---
  const drawLetterGuide = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.15;
    ctx.font = "180px 'Scheherazade New', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText(selectedLetter, canvas.width / 2, canvas.height / 2);
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    drawLetterGuide();
  }, [selectedLetter]);

  // --- Dessin ---
  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
  };
  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };
  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };
  const clearCanvas = () => {
    const c = canvasRef.current;
    ctxRef.current.clearRect(0, 0, c.width, c.height);
    drawLetterGuide();
  };

  // --- Écouter (ElevenLabs) ---
  const handlePlay = async (letter) => {
    try {
      setIsPlaying(true);
      setGlobalMsg(`Lecture de "${letter}"...`);
      const res = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: letter, voice: "pNInz6obpgDQGcFmaJgB" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Erreur ElevenLabs");
      const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
      audio.play();
      audio.onended = () => {
        setIsPlaying(false);
        setGlobalMsg(`Lecture terminée pour "${letter}".`);
      };
    } catch (e) {
      setIsPlaying(false);
      setGlobalMsg("⚠️ Erreur de lecture : " + e.message);
    }
  };

  // --- Répéter (voix) + évaluation IA ---
  const handleRepeat = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("⚠️ Reconnaissance vocale non supportée sur ce navigateur.");
      return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "ar-SA";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);
    setGlobalMsg("🎤 Répète la lettre...");

    recognition.onresult = async (event) => {
      const userSpeech = event.results[0][0].transcript.trim();
      setGlobalMsg(`Tu as dit : "${userSpeech}". Évaluation...`);
      try {
        const res = await fetch("/api/evaluate-pronunciation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userSpeech, target: selectedLetter }),
        });
        const data = await res.json();
        setSpeechScore(data.score);
        setSpeechFeedback(data.feedback);
        saveHistory({ type: "prononciation", letter: selectedLetter, score: data.score, date: new Date().toISOString() });
        maybeAdvance(data.score, writingScore);
      } catch (e) {
        setSpeechFeedback("⚠️ Erreur : " + e.message);
      } finally {
        setListening(false);
      }
    };
    recognition.start();
  };

  // --- Vérifier écriture (image) + évaluation IA ---
  const handleCheckWriting = async () => {
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setGlobalMsg("🧠 Évaluation de l'écriture en cours...");
    try {
      const res = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, letter: selectedLetter }),
      });
      const data = await res.json();
      setWritingScore(data.score);
      setWritingFeedback(data.feedback);
      saveHistory({ type: "écriture", letter: selectedLetter, score: data.score, date: new Date().toISOString() });
      maybeAdvance(speechScore, data.score);
    } catch (e) {
      setWritingFeedback("⚠️ Erreur : " + e.message);
    }
  };

  // --- Passage niveau ---
  const maybeAdvance = (speech, writing) => {
    if (speech == null || writing == null) return;
    if (speech >= 80 && writing >= 80) {
      if (!mastered.includes(selectedLetter)) {
        const updated = [...mastered, selectedLetter];
        setMastered(updated);
        saveHistory({ type: "niveau", letter: selectedLetter, score: 100, date: new Date().toISOString() });
      }
      setGlobalMsg("🎉 Niveau validé pour cette lettre !");
      const idx = LETTERS.indexOf(selectedLetter);
      if (idx < LETTERS.length - 1) {
        setSelectedLetter(LETTERS[idx + 1]);
        clearCanvas();
        setSpeechScore(null);
        setWritingScore(null);
        setSpeechFeedback("");
        setWritingFeedback("");
      }
    }
  };

  return (
    <div className="main-container" style={{ textAlign: "center", padding: "20px" }}>
      <h1>📖 Apprentissage de l’alphabet arabe</h1>
      <p>Atteins 80% en écriture et prononciation pour valider chaque lettre.</p>

      {/* Sélecteur de lettre */}
      <div style={{ margin: "10px 0" }}>
        <label>Lettre : </label>
        <select
          value={selectedLetter}
          onChange={(e) => {
            setSelectedLetter(e.target.value);
            clearCanvas();
            drawLetterGuide();
            setSpeechScore(null);
            setWritingScore(null);
            setSpeechFeedback("");
            setWritingFeedback("");
            setGlobalMsg("");
          }}
        >
          {LETTERS.map((L) => (
            <option key={L}>{L}</option>
          ))}
        </select>
      </div>

      {/* Boutons audio */}
      <div style={{ marginTop: "15px" }}>
        <button
          onClick={() => handlePlay(selectedLetter)}
          disabled={isPlaying}
          style={{ background: "#2d6a4f", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8, marginRight: 8 }}
        >
          🔊 Écouter
        </button>
        <button
          onClick={handleRepeat}
          disabled={listening}
          style={{ background: "#457b9d", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8 }}
        >
          🎙️ Répéter
        </button>
      </div>

      {/* Canvas écriture */}
      <h2 style={{ marginTop: 25 }}>✍️ Écris la lettre « {selectedLetter} »</h2>
      <canvas
        ref={canvasRef}
        width={360}
        height={220}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          background: "#fff",
          border: "2px solid #ccc",
          borderRadius: 12,
          marginTop: 10,
        }}
      ></canvas>

      <div style={{ marginTop: 10 }}>
        <button onClick={clearCanvas} style={{ background: "#e63946", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, marginRight: 8 }}>
          🧹 Effacer
        </button>
        <button onClick={handleCheckWriting} style={{ background: "#1b4332", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8 }}>
          🖋️ Vérifier l’écriture
        </button>
      </div>

      {/* Feedback */}
      <div style={{ marginTop: 15 }}>
        {speechScore != null && <p><b>Prononciation :</b> {speechScore}%</p>}
        {writingScore != null && <p><b>Écriture :</b> {writingScore}%</p>}
        {speechFeedback && <div>{speechFeedback}</div>}
        {writingFeedback && <div>{writingFeedback}</div>}
      </div>

      {/* Message global */}
      {globalMsg && <div style={{ marginTop: 10, color: "#1b4332" }}>{globalMsg}</div>}

      {/* Progression */}
      <div style={{ marginTop: 20 }}>
        <b>Lettres validées :</b> {mastered.length}/{LETTERS.length}
      </div>

      {/* Historique */}
      <div style={{ marginTop: 25 }}>
        <h3>📊 Historique</h3>
        {history.length === 0 ? (
          <p>Aucun enregistrement pour le moment.</p>
        ) : (
          <div style={{ maxHeight: "200px", overflowY: "auto", textAlign: "left", margin: "0 auto", width: "70%" }}>
            {history.slice().reverse().map((item, idx) => (
              <div key={idx} style={{ borderBottom: "1px solid #ddd", padding: "6px 0" }}>
                <b>{item.letter}</b> — {item.type} — {item.score}% — <i>{new Date(item.date).toLocaleString()}</i>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <Link href="/">← Retour à l’accueil</Link>
      </div>
    </div>
  );
}