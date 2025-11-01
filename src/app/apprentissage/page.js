"use client";
import { useState, useRef } from "react";
import Link from "next/link";

// 🌙 Liste complète des 114 sourates
const surahList = [
  { number: 1, name: "الفاتحة", translit: "Al-Fātiḥah" },
  { number: 2, name: "البقرة", translit: "Al-Baqarah" },
  { number: 3, name: "آل عمران", translit: "Āl ʿImrān" },
  { number: 4, name: "النساء", translit: "An-Nisā’" },
  { number: 5, name: "المائدة", translit: "Al-Mā’idah" },
  { number: 6, name: "الأنعام", translit: "Al-Anʿām" },
  { number: 7, name: "الأعراف", translit: "Al-Aʿrāf" },
  { number: 8, name: "الأنفال", translit: "Al-Anfāl" },
  { number: 9, name: "التوبة", translit: "At-Tawbah" },
  { number: 10, name: "يونس", translit: "Yūnus" },
  { number: 11, name: "هود", translit: "Hūd" },
  { number: 12, name: "يوسف", translit: "Yūsuf" },
  { number: 13, name: "الرعد", translit: "Ar-Raʿd" },
  { number: 14, name: "ابراهيم", translit: "Ibrāhīm" },
  { number: 15, name: "الحجر", translit: "Al-Ḥijr" },
  { number: 16, name: "النحل", translit: "An-Naḥl" },
  { number: 17, name: "الإسراء", translit: "Al-Isrā’" },
  { number: 18, name: "الكهف", translit: "Al-Kahf" },
  { number: 19, name: "مريم", translit: "Maryam" },
  { number: 20, name: "طه", translit: "Ṭā Hā" },
  { number: 21, name: "الأنبياء", translit: "Al-Anbiyā’" },
  { number: 22, name: "الحج", translit: "Al-Ḥajj" },
  { number: 23, name: "المؤمنون", translit: "Al-Mu’minūn" },
  { number: 24, name: "النور", translit: "An-Nūr" },
  { number: 25, name: "الفرقان", translit: "Al-Furqān" },
  { number: 26, name: "الشعراء", translit: "Ash-Shuʿarā’" },
  { number: 27, name: "النمل", translit: "An-Naml" },
  { number: 28, name: "القصص", translit: "Al-Qaṣaṣ" },
  { number: 29, name: "العنكبوت", translit: "Al-ʿAnkabūt" },
  { number: 30, name: "الروم", translit: "Ar-Rūm" },
  { number: 31, name: "لقمان", translit: "Luqmān" },
  { number: 32, name: "السجدة", translit: "As-Sajdah" },
  { number: 33, name: "الأحزاب", translit: "Al-Aḥzāb" },
  { number: 34, name: "سبإ", translit: "Saba’" },
  { number: 35, name: "فاطر", translit: "Fāṭir" },
  { number: 36, name: "يس", translit: "Yā Sīn" },
  { number: 37, name: "الصافات", translit: "Aṣ-Ṣāffāt" },
  { number: 38, name: "ص", translit: "Ṣād" },
  { number: 39, name: "الزمر", translit: "Az-Zumar" },
  { number: 40, name: "غافر", translit: "Ghāfir" },
  { number: 41, name: "فصلت", translit: "Fuṣṣilat" },
  { number: 42, name: "الشورى", translit: "Ash-Shūrā" },
  { number: 43, name: "الزخرف", translit: "Az-Zukhruf" },
  { number: 44, name: "الدخان", translit: "Ad-Dukhān" },
  { number: 45, name: "الجاثية", translit: "Al-Jāthiyah" },
  { number: 46, name: "الأحقاف", translit: "Al-Aḥqāf" },
  { number: 47, name: "محمد", translit: "Muḥammad" },
  { number: 48, name: "الفتح", translit: "Al-Fatḥ" },
  { number: 49, name: "الحجرات", translit: "Al-Ḥujurāt" },
  { number: 50, name: "ق", translit: "Qāf" },
  { number: 51, name: "الذاريات", translit: "Adh-Dhāriyāt" },
  { number: 52, name: "الطور", translit: "Aṭ-Ṭūr" },
  { number: 53, name: "النجم", translit: "An-Najm" },
  { number: 54, name: "القمر", translit: "Al-Qamar" },
  { number: 55, name: "الرحمن", translit: "Ar-Raḥmān" },
  { number: 56, name: "الواقعة", translit: "Al-Wāqiʿah" },
  { number: 57, name: "الحديد", translit: "Al-Ḥadīd" },
  { number: 58, name: "المجادلة", translit: "Al-Mujādilah" },
  { number: 59, name: "الحشر", translit: "Al-Ḥashr" },
  { number: 60, name: "الممتحنة", translit: "Al-Mumtaḥanah" },
  { number: 61, name: "الصف", translit: "Aṣ-Ṣaff" },
  { number: 62, name: "الجمعة", translit: "Al-Jumuʿah" },
  { number: 63, name: "المنافقون", translit: "Al-Munāfiqūn" },
  { number: 64, name: "التغابن", translit: "At-Taghābun" },
  { number: 65, name: "الطلاق", translit: "Aṭ-Ṭalāq" },
  { number: 66, name: "التحريم", translit: "At-Taḥrīm" },
  { number: 67, name: "الملك", translit: "Al-Mulk" },
  { number: 68, name: "القلم", translit: "Al-Qalam" },
  { number: 69, name: "الحاقة", translit: "Al-Ḥāqqah" },
  { number: 70, name: "المعارج", translit: "Al-Maʿārij" },
  { number: 71, name: "نوح", translit: "Nūḥ" },
  { number: 72, name: "الجن", translit: "Al-Jinn" },
  { number: 73, name: "المزمل", translit: "Al-Muzzammil" },
  { number: 74, name: "المدثر", translit: "Al-Muddaththir" },
  { number: 75, name: "القيامة", translit: "Al-Qiyāmah" },
  { number: 76, name: "الانسان", translit: "Al-Insān" },
  { number: 77, name: "المرسلات", translit: "Al-Mursalāt" },
  { number: 78, name: "النبأ", translit: "An-Naba’" },
  { number: 79, name: "النازعات", translit: "An-Nāziʿāt" },
  { number: 80, name: "عبس", translit: "ʿAbasa" },
  { number: 81, name: "التكوير", translit: "At-Takwīr" },
  { number: 82, name: "الانفطار", translit: "Al-Infiṭār" },
  { number: 83, name: "المطففين", translit: "Al-Muṭaffifīn" },
  { number: 84, name: "الانشقاق", translit: "Al-Inshiqāq" },
  { number: 85, name: "البروج", translit: "Al-Burūj" },
  { number: 86, name: "الطارق", translit: "Aṭ-Ṭāriq" },
  { number: 87, name: "الأعلى", translit: "Al-Aʿlā" },
  { number: 88, name: "الغاشية", translit: "Al-Ghāshiyah" },
  { number: 89, name: "الفجر", translit: "Al-Fajr" },
  { number: 90, name: "البلد", translit: "Al-Balad" },
  { number: 91, name: "الشمس", translit: "Ash-Shams" },
  { number: 92, name: "الليل", translit: "Al-Layl" },
  { number: 93, name: "الضحى", translit: "Ad-Ḍuḥā" },
  { number: 94, name: "الشرح", translit: "Ash-Sharḥ" },
  { number: 95, name: "التين", translit: "At-Tīn" },
  { number: 96, name: "العلق", translit: "Al-ʿAlaq" },
  { number: 97, name: "القدر", translit: "Al-Qadr" },
  { number: 98, name: "البينة", translit: "Al-Bayyinah" },
  { number: 99, name: "الزلزلة", translit: "Az-Zalzalah" },
  { number: 100, name: "العاديات", translit: "Al-ʿĀdiyāt" },
  { number: 101, name: "القارعة", translit: "Al-Qāriʿah" },
  { number: 102, name: "التكاثر", translit: "At-Takāthur" },
  { number: 103, name: "العصر", translit: "Al-ʿAṣr" },
  { number: 104, name: "الهمزة", translit: "Al-Humazah" },
  { number: 105, name: "الفيل", translit: "Al-Fīl" },
  { number: 106, name: "قريش", translit: "Quraysh" },
  { number: 107, name: "الماعون", translit: "Al-Māʿūn" },
  { number: 108, name: "الكوثر", translit: "Al-Kawthar" },
  { number: 109, name: "الكافرون", translit: "Al-Kāfirūn" },
  { number: 110, name: "النصر", translit: "An-Naṣr" },
  { number: 111, name: "المسد", translit: "Al-Masad" },
  { number: 112, name: "الإخلاص", translit: "Al-Ikhlāṣ" },
  { number: 113, name: "الفلق", translit: "Al-Falaq" },
  { number: 114, name: "الناس", translit: "An-Nās" },
];

// --- Logique de l'apprentissage interactif ---
export default function ApprentissageCoran() {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedAyah, setSelectedAyah] = useState(1);
  const [verseText, setVerseText] = useState("");
  const [translation, setTranslation] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [tafsir, setTafsir] = useState("");
  const [feedback, setFeedback] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // 🕌 Charger verset
  const fetchAyah = async () => {
    setFeedback("Chargement du verset...");
    try {
      const [arabic, french] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurah}:${selectedAyah}/ar.alafasy`),
        fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurah}:${selectedAyah}/fr.hamidullah`),
      ]);
      const arabicData = await arabic.json();
      const frenchData = await french.json();
      setVerseText(arabicData.data.text);
      setTranslation(frenchData.data.text);
      setAudioUrl(arabicData.data.audio);
      setFeedback("");
    } catch {
      setFeedback("Erreur de chargement.");
    }
  };

  // 🎧 Lecture audio
  const handleListen = () => {
    if (audioUrl) new Audio(audioUrl).play();
  };

  // 🎙️ Récitation utilisateur
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      audioChunksRef.current = [];
      rec.ondataavailable = e => audioChunksRef.current.push(e.data);
      rec.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await analyzePronunciation(audioBlob);
      };
      rec.start();
      mediaRecorderRef.current = rec;
      setRecording(true);
    } catch {
      alert("Micro non accessible 🎙️");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // 🧠 Analyse IA de la récitation
  const analyzePronunciation = async (audioBlob) => {
    setFeedback("Analyse de ta récitation...");
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("verse", verseText);
    try {
      const res = await fetch("/api/correction", { method: "POST", body: formData });
      const data = await res.json();
      setFeedback(data.feedback || "Analyse terminée.");
    } catch {
      setFeedback("Erreur IA.");
    }
  };

  // 📘 Tafsîr simplifié IA
  const fetchTafsir = async () => {
    setTafsir("Analyse du verset...");
    try {
      const res = await fetch("/api/tafsir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verse: verseText, translation }),
      });
      const data = await res.json();
      setTafsir(data.tafsir || "Aucun tafsîr disponible.");
    } catch {
      setTafsir("Erreur tafsîr.");
    }
  };

  return (
    <div className="main-container" style={{ textAlign: "center" }}>
      <h1>Apprentissage interactif du Coran</h1>

      {/* Sélection sourate/verset */}
      <select value={selectedSurah} onChange={e => setSelectedSurah(e.target.value)}>
        {surahList.map(s => (
          <option key={s.number} value={s.number}>
            {s.number}. {s.name} ({s.translit})
          </option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        value={selectedAyah}
        onChange={e => setSelectedAyah(e.target.value)}
        style={{ marginLeft: "10px", width: "80px" }}
      />
      <button onClick={fetchAyah}>Charger</button>

      {verseText && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "2rem" }}>{verseText}</h2>
          <p style={{ fontStyle: "italic" }}>{translation}</p>
          <button onClick={handleListen}>🎧 Écouter</button>
          {!recording ? (
            <button onClick={startRecording} style={{ marginLeft: "10px" }}>
              🎙️ Réciter
            </button>
          ) : (
            <button onClick={stopRecording} style={{ marginLeft: "10px" }}>
              ⏹️ Stop
            </button>
          )}
          <button onClick={fetchTafsir} style={{ marginLeft: "10px" }}>
            📘 Tafsîr simplifié
          </button>
        </div>
      )}

      {tafsir && (
        <div
          style={{
            backgroundColor: "#f0f8ff",
            padding: "10px",
            marginTop: "15px",
            borderRadius: "8px",
            textAlign: "left",
          }}
        >
          <strong>Tafsîr :</strong>
          <p>{tafsir}</p>
        </div>
      )}

      {feedback && (
        <div style={{ marginTop: "15px", background: "#f0fff4", padding: "10px", borderRadius: "8px" }}>
          {feedback}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link href="/">← Retour</Link>
      </div>
    </div>
  );
}