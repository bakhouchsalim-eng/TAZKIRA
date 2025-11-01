"use client";
import Link from "next/link";
import "./styles.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="title">Bienvenue sur Tazkira</h1>

      <p className="subtitle">
        Apprends le Coran, organise ta semaine spirituelle,
        et échange avec une IA de confiance.
      </p>

      <div>
        <Link href="/apprentissage">
          <button>Commencer mon voyage</button>
        </Link>
      </div>
    </div>
  );
}
