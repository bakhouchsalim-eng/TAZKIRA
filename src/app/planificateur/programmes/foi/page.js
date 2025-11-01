"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RaffermirMaFoi() {
  const [currentDay, setCurrentDay] = useState(1);
  const [completed, setCompleted] = useState({});
  const [tasks, setTasks] = useState([]);

  const dailyProgram = [
    // --- SEMAINE 1 ---
    {
      title: "Jour 1 — Reconnexion à Allah",
      tasks: [
        { name: "Faire les 5 prières à l’heure", time: "05:00" },
        { name: "Lire Al-Fatiha lentement en méditant", time: "10:00" },
        { name: "Dire 100 fois 'SubhanAllah'", time: "18:00" },
        { name: "Faire une invocation avant de dormir", time: "22:30" },
      ],
    },
    {
      title: "Jour 2 — Gratitude consciente",
      tasks: [
        { name: "Remercier Allah pour 3 bienfaits", time: "09:00" },
        { name: "Lire Al-Baqara (v. 1–5)", time: "11:00" },
        { name: "Dire 100 fois 'Alhamdulillah'", time: "17:00" },
        { name: "Faire 2 unités de prière surérogatoires", time: "21:00" },
      ],
    },
    {
      title: "Jour 3 — Pureté du cœur",
      tasks: [
        { name: "Faire 2 raka’at de tawbah", time: "06:30" },
        { name: "Lire Al-Baqara (v. 6–16)", time: "10:00" },
        { name: "Dire 100 fois 'Astaghfirullah'", time: "17:00" },
        { name: "Faire du dhikr du soir", time: "20:30" },
      ],
    },
    {
      title: "Jour 4 — Discipline spirituelle",
      tasks: [
        { name: "Prier à la mosquée", time: "05:00" },
        { name: "Lire Al-Baqara (v. 17–29)", time: "10:00" },
        { name: "Dire 100 fois 'La ilaha illa Allah'", time: "17:30" },
        { name: "Écouter un rappel sur l’intention", time: "21:00" },
      ],
    },
    {
      title: "Jour 5 — Intention pure",
      tasks: [
        { name: "Faire le dhikr du matin", time: "06:00" },
        { name: "Lire Al-Baqara (v. 30–39)", time: "09:30" },
        { name: "Dire 100 fois 'SubhanAllah wa bihamdih'", time: "18:00" },
        { name: "Écrire ton intention spirituelle", time: "21:00" },
      ],
    },
    {
      title: "Jour 6 — Lien avec le Coran",
      tasks: [
        { name: "Lire Al-Baqara (v. 40–59)", time: "10:00" },
        { name: "Réciter Ayat al-Kursi", time: "12:30" },
        { name: "Dire 100 fois 'Allahu Akbar'", time: "17:00" },
        { name: "Écouter la récitation d’Al-Afasy", time: "20:00" },
      ],
    },
    {
      title: "Jour 7 — Révision et introspection",
      tasks: [
        { name: "Relire les versets étudiés", time: "09:00" },
        { name: "Faire du dhikr : 33x SubhanAllah, 33x Alhamdulillah, 34x Allahu Akbar", time: "17:00" },
        { name: "Écrire 3 réflexions spirituelles", time: "21:00" },
      ],
    },

    // --- SEMAINE 2 ---
    {
      title: "Jour 8 — Détox spirituelle",
      tasks: [
        { name: "Éviter les paroles vaines", time: "08:00" },
        { name: "Lire Al-Baqara (v. 60–80)", time: "10:30" },
        { name: "Dire 100 fois 'La ilaha illa Allah wahdahu la sharika lah'", time: "17:00" },
        { name: "Faire du dhikr avant de dormir", time: "22:00" },
      ],
    },
    {
      title: "Jour 9 — Patience et confiance",
      tasks: [
        { name: "Lire Al-Baqara (v. 81–100)", time: "09:30" },
        { name: "Dire 100 fois 'Hasbiyallahu la ilaha illa Huwa'", time: "18:00" },
        { name: "Offrir ton aide à quelqu’un", time: "19:00" },
      ],
    },
    {
      title: "Jour 10 — Sérénité intérieure",
      tasks: [
        { name: "Faire du dhikr en marchant", time: "09:00" },
        { name: "Lire Al-Baqara (v. 101–120)", time: "10:00" },
        { name: "Dire 100 fois 'SubhanAllah wa bihamdih'", time: "18:00" },
      ],
    },
    {
      title: "Jour 11 — Douceur du cœur",
      tasks: [
        { name: "Lire Al-Baqara (v. 121–141)", time: "09:30" },
        { name: "Dire 100 fois 'Ya Rahman, Ya Rahim'", time: "18:00" },
        { name: "Faire une invocation sincère", time: "20:30" },
      ],
    },
    {
      title: "Jour 12 — La générosité",
      tasks: [
        { name: "Donner une aumône", time: "12:00" },
        { name: "Lire Al-Baqara (v. 142–163)", time: "15:00" },
        { name: "Dire 100 fois 'Alhamdulillah ala kulli hal'", time: "18:00" },
      ],
    },
    {
      title: "Jour 13 — Révision et gratitude",
      tasks: [
        { name: "Réviser tous les versets précédents", time: "09:30" },
        { name: "Dire 100 fois 'SubhanAllah wa bihamdih'", time: "18:00" },
      ],
    },
    {
      title: "Jour 14 — Vendredi de lumière",
      tasks: [
        { name: "Lire la sourate Al-Kahf", time: "09:00" },
        { name: "Faire du dhikr collectif", time: "16:00" },
        { name: "Dire 100 fois 'Allahumma salli ala Muhammad'", time: "18:00" },
      ],
    },

    // --- SEMAINE 3 ---
    {
      title: "Jour 15 — La constance dans la foi",
      tasks: [
        { name: "Lire Al-Baqara (v. 164–176)", time: "10:00" },
        { name: "Dire 100 fois 'SubhanAllah'", time: "18:00" },
        { name: "Tenir un mini journal spirituel", time: "21:00" },
      ],
    },
    {
      title: "Jour 16 — Douceur et bienveillance",
      tasks: [
        { name: "Aider quelqu’un sans qu’il le sache", time: "11:00" },
        { name: "Lire Al-Baqara (v. 177–195)", time: "14:00" },
        { name: "Dire 100 fois 'Ya Karim'", time: "18:00" },
      ],
    },
    {
      title: "Jour 17 — Méditation du Coran",
      tasks: [
        { name: "Lire Al-Baqara (v. 196–210)", time: "09:30" },
        { name: "Dire 100 fois 'Allahu Akbar'", time: "18:00" },
      ],
    },
    {
      title: "Jour 18 — Le dhikr constant",
      tasks: [
        { name: "Répéter : SubhanAllah, Alhamdulillah, Allahu Akbar", time: "17:00" },
        { name: "Lire Al-Baqara (v. 211–225)", time: "10:30" },
      ],
    },
    {
      title: "Jour 19 — La prière de nuit",
      tasks: [
        { name: "Faire 2 raka’at de qiyam", time: "04:30" },
        { name: "Lire Al-Baqara (v. 226–242)", time: "09:30" },
        { name: "Dire 100 fois 'Ya Ghafur'", time: "18:00" },
      ],
    },
    {
      title: "Jour 20 — La sincérité totale",
      tasks: [
        { name: "Lire Al-Baqara (v. 243–260)", time: "09:00" },
        { name: "Faire une aumône secrète", time: "15:00" },
        { name: "Dire 100 fois 'Astaghfirullah'", time: "18:00" },
      ],
    },
    {
      title: "Jour 21 — Révision et gratitude",
      tasks: [
        { name: "Réviser tous les versets étudiés", time: "10:00" },
        { name: "Dire 100 fois 'Alhamdulillah'", time: "18:00" },
      ],
    },

    // --- SEMAINE 4 ---
    {
      title: "Jour 22 — Servir Allah avec amour",
      tasks: [
        { name: "Lire Al-Baqara (v. 261–281)", time: "09:00" },
        { name: "Faire un acte de bonté discret", time: "15:00" },
        { name: "Dire 100 fois 'Ya Wadud'", time: "18:00" },
      ],
    },
    {
      title: "Jour 23 — Le comportement exemplaire",
      tasks: [
        { name: "Lire Al-Baqara (v. 282–286)", time: "10:00" },
        { name: "Dire 100 fois 'SubhanAllah'", time: "18:00" },
      ],
    },
    {
      title: "Jour 24 — Sincérité et gratitude",
      tasks: [
        { name: "Lire Āl ʿImrān (v. 1–20)", time: "09:00" },
        { name: "Dire 100 fois 'Alhamdulillah ala kulli hal'", time: "18:00" },
      ],
    },
    {
      title: "Jour 25 — L’humilité du croyant",
      tasks: [
        { name: "Lire Āl ʿImrān (v. 21–40)", time: "09:30" },
        { name: "Dire 100 fois 'Astaghfirullah'", time: "18:00" },
      ],
    },
    {
      title: "Jour 26 — Patience et espoir",
      tasks: [
        { name: "Lire Āl ʿImrān (v. 41–60)", time: "10:00" },
        { name: "Dire 100 fois 'Ya Sabur'", time: "18:00" },
      ],
    },
    {
      title: "Jour 27 — Miséricorde et fraternité",
      tasks: [
        { name: "Lire Āl ʿImrān (v. 61–80)", time: "09:00" },
        { name: "Dire 100 fois 'Ya Rahman'", time: "18:00" },
        { name: "Pardonner à quelqu’un", time: "20:00" },
      ],
    },
    {
      title: "Jour 28 — Révision générale",
      tasks: [
        { name: "Revoir Al-Fatiha, Al-Baqara, Āl ʿImrān", time: "09:30" },
        { name: "Dire 100 fois 'SubhanAllah wa bihamdih'", time: "18:00" },
      ],
    },
    {
      title: "Jour 29 — Préparation du cœur",
      tasks: [
        { name: "Prier la nuit (qiyam)", time: "04:30" },
        { name: "Dire 100 fois 'Astaghfirullah wa atubu ilayh'", time: "18:00" },
        { name: "Écrire ton engagement spirituel", time: "21:00" },
      ],
    },
    {
      title: "Jour 30 — Gratitude et transmission",
      tasks: [
        { name: "Relire tes notes du mois", time: "09:00" },
        { name: "Dire 100 fois 'Alhamdulillah'", time: "18:00" },
        { name: "Enseigner une chose apprise à quelqu’un", time: "20:00" },
      ],
    },
  ];

  useEffect(() => {
    setTasks(dailyProgram[currentDay - 1]?.tasks || []);
  }, [currentDay]);

  useEffect(() => {
    if (Notification.permission !== "granted") Notification.requestPermission();

    const now = new Date();
    tasks.forEach((t) => {
      const [hour, minute] = t.time.split(":").map(Number);
      const taskTime = new Date();
      taskTime.setHours(hour, minute, 0, 0);

      const reminder = new Date(taskTime.getTime() - 5 * 60 * 1000);

      if (reminder > now) {
        setTimeout(
          () => new Notification("🕓 Bientôt ta tâche", { body: `Dans 5 min : ${t.name}` }),
          reminder.getTime() - now.getTime()
        );
      }

      if (taskTime > now) {
        setTimeout(
          () => new Notification("🕌 C’est l’heure !", { body: `Accomplis ta tâche : ${t.name}` }),
          taskTime.getTime() - now.getTime()
        );
      }
    });
  }, [tasks]);

  const toggleTask = (taskName) => {
    setCompleted((prev) => ({ ...prev, [taskName]: !prev[taskName] }));
  };

  return (
    <div className="main-container" style={{ textAlign: "center" }}>
      <h1>📿 Programme : Raffermir ma foi</h1>
      <h2>{dailyProgram[currentDay - 1]?.title}</h2>

      <div style={{ marginTop: "20px" }}>
        {tasks.map((t, i) => (
          <div
            key={i}
            style={{
              backgroundColor: completed[t.name] ? "#d1e7dd" : "#fff",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              margin: "10px auto",
              width: "80%",
              textAlign: "left",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={completed[t.name] || false}
                onChange={() => toggleTask(t.name)}
              />
              <div>
                <strong>{t.name}</strong>
                <div style={{ fontSize: "0.9rem", color: "#555" }}>⏰ {t.time}</div>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setCurrentDay((prev) => Math.min(prev + 1, dailyProgram.length))}
          style={{
            backgroundColor: "#2d6a4f",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Jour suivant
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link href="/planificateur">← Retour</Link>
      </div>
    </div>
  );
}