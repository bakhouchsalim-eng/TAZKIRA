"use client";
import Link from "next/link";
import "./styles.css";
import { useState } from "react";

export default function RootLayout({ children }) {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="fr">
      <body>
        {/* ======== NAVBAR ======== */}
        <nav className="navbar">
          <Link href="/" className="nav-logo">
            Tazkira
          </Link>

          {/* === Bouton hamburger mobile === */}
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>

          {/* === Liens de navigation === */}
          <div
            className={`nav-links ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {/* === MENU APPRENTISSAGE AVEC SOUS-MENU === */}
            <div
              className="nav-item"
              onMouseEnter={() => setShowSubmenu(true)}
              onMouseLeave={() => setShowSubmenu(false)}
              style={{ position: "relative" }}
            >
              <span className="nav-dropdown">Apprentissage ▼</span>

              {showSubmenu && (
                <div className="submenu">
                  <Link href="/apprentissage">📘 Apprentissage du Coran</Link>
                  <Link href="/arabe">📚 Langue arabe</Link>
                </div>
              )}
            </div>

            {/* === AUTRES LIENS === */}
            <Link href="/planificateur">Planificateur</Link>
            <Link href="/assistant">Assistant IA</Link>
          </div>
        </nav>

        {/* ======== CONTENU PRINCIPAL ======== */}
        <main className="main-content">{children}</main>

        {/* ======== FOOTER ======== */}
        <footer className="footer">
          <p>© 2025 Tazkira — Une invitation à la réflexion 🌿</p>
        </footer>
      </body>
    </html>
  );
}