"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function ApprentissageArabe() {
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Alphabet arabe
  const lettres = [
    "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش",
    "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
  ];

  // 🎧 Lecture ElevenLabs
  const handlePlay = async (lettre) => {
    try {
      setIsPlaying(true);
      setFeedback(`🔊 Lecture de la lettre "${lettre}"...`);

      const res = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: lettre,
          voice: "pNInz6obpgDQGcFmaJgB", // voix par défaut
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Erreur audio ElevenLabs");

      const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
      audio.play();

      audio.onended = () => {
        setIsPlaying(false);
        setFeedback(`✅ Lecture terminée pour "${lettre}".`);
      };
    } catch (err) {
      console.error("Erreur lecture :", err);
      setFeedback("⚠️ Erreur lors de la lecture du son : " + err.message);
      setIsPlaying(false);
    }
  };

  // 🎙️ Reconnaissance vocale
  const handleListen = (lettre) => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("⚠️ Reconnaissance vocale non supportée sur ce navigateur.");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "ar-SA";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);
    setFeedback("🎤 Répète la lettre...");

    recognition.onresult = (event) => {
      const userSpeech = event.results[0][0].transcript.trim();
      if (userSpeech === lettre) {
        setFeedback("✅ Parfait ! Prononciation correcte.");
      } else {
        setFeedback(`❌ Tu as dit "${userSpeech}". Essaie encore : ${lettre}`);
      }
      setListening(false);
    };

    recognition.onerror = () => {
      setFeedback("⚠️ Erreur pendant la reconnaissance vocale.");
      setListening(false);
    };

    recognition.start();
  };

  // ✍️ Canvas setup (souris + tactile)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#1d3557";
    ctxRef.current = ctx;

    // Empêche le défilement sur mobile quand on dessine
    const preventScroll = (e) => e.preventDefault();
    canvas.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      canvas.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  // 📌 Fonctions dessin souris
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

  // 📱 Fonctions dessin tactile
  const getTouchPos = (canvas, touchEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top,
    };
  };

  const startTouch = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getTouchPos(canvasRef.current, e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const drawTouch = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getTouchPos(canvasRef.current, e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopTouch = (e) => {
    e.preventDefault();
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="main-container" style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>📖 Apprentissage de l’alphabet arabe</h1>
      <p style={{ marginBottom: "20px" }}>
        Écoute chaque lettre, répète-la et apprends à la tracer à la main.
      </p>

      {/* Liste des lettres */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
          gap: "10px",
          marginTop: "20px",
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        {lettres.map((lettre, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              fontSize: "2rem",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            <div>{lettre}</div>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => handlePlay(lettre)}
                disabled={isPlaying}
                style={{
                  backgroundColor: "#2d6a4f",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  marginRight: "5px",
                  cursor: "pointer",
                }}
              >
                🔊 Écouter
              </button>
              <button
                onClick={() => handleListen(lettre)}
                disabled={listening}
                style={{
                  backgroundColor: "#457b9d",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🎙️ Répéter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✍️ Zone d’écriture */}
      <h2 style={{ marginTop: "40px" }}>✍️ Essaie d’écrire la lettre</h2>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startTouch}
        onTouchMove={drawTouch}
        onTouchEnd={stopTouch}
        style={{
          backgroundColor: "#ffffff",
          border: "2px solid #ccc",
          borderRadius: "10px",
          marginTop: "15px",
          cursor: "crosshair",
          touchAction: "none", // 🔥 empêche le scroll sur mobile
        }}
      ></canvas>
      <br />
      <button
        onClick={clearCanvas}
        style={{
          backgroundColor: "#e63946",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          marginTop: "10px",
          cursor: "pointer",
        }}
      >
        🧹 Effacer
      </button>

      {feedback && (
        <div
          style={{
            marginTop: "25px",
            backgroundColor: "#f0fff4",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            width: "70%",
            margin: "20px auto",
          }}
        >
          {feedback}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link href="/">← Retour à l’accueil</Link>
      </div>
    </div>
  );
}