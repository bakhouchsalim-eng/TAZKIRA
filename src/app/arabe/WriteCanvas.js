"use client";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function WriteCanvas({ currentLetter }) {
  const sigCanvas = useRef({});
  const [feedback, setFeedback] = useState("");

  // Effacer le canvas
  const clearCanvas = () => {
    sigCanvas.current.clear();
    setFeedback("");
  };

  // Simulation d'analyse du tracé (plus tard : IA réelle)
  const analyzeDrawing = () => {
    const isEmpty = sigCanvas.current.isEmpty();
    if (isEmpty) {
      setFeedback("⚠️ Dessine d'abord la lettre avec ton doigt ou ton stylet !");
      return;
    }
    // Pour le moment, on donne un feedback aléatoire
    const score = Math.floor(Math.random() * 30) + 70;
    if (score > 85) {
      setFeedback(`✅ Très bien ! Ton tracé du ${currentLetter} est précis (${score}%).`);
    } else {
      setFeedback(`🖊️ Bien tenté ! Ta forme du ${currentLetter} peut être améliorée (${score}%).`);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "#f1faee",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h2>✍️ Mode écriture : Lettre {currentLetter}</h2>
      <p>Trace la lettre arabe avec ton doigt, ta souris ou ton stylet.</p>

      <div
        style={{
          border: "2px solid #2d6a4f",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          margin: "auto",
          width: "300px",
          height: "300px",
        }}
      >
        <SignatureCanvas
          ref={sigCanvas}
          penColor="#1b4332"
          backgroundColor="transparent"
          canvasProps={{
            width: 300,
            height: 300,
            className: "sigCanvas",
          }}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={clearCanvas}
          style={{
            backgroundColor: "#457b9d",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Effacer
        </button>

        <button
          onClick={analyzeDrawing}
          style={{
            backgroundColor: "#2d6a4f",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Analyser mon tracé
        </button>
      </div>

      {feedback && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            width: "70%",
            margin: "20px auto",
            fontWeight: "500",
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}