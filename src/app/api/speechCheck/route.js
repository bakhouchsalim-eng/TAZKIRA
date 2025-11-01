import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");
    const targetLetter = formData.get("targetLetter");

    if (!audioFile) {
      return NextResponse.json({ error: "Aucun fichier audio reçu." }, { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🎧 Étape 1 : Transcription audio avec Whisper
    const response = await openai.audio.transcriptions.create({
      file: new File([buffer], "recitation.wav", { type: "audio/wav" }),
      model: "whisper-1",
      language: "ar",
    });

    const transcription = response.text.trim();

    // 🎯 Étape 2 : Calcul d’un score de similarité basique
    let score = 0;
    if (transcription === targetLetter) {
      score = 100;
    } else if (transcription && transcription[0] === targetLetter[0]) {
      score = 75;
    } else {
      score = Math.floor(Math.random() * 40) + 30; // score aléatoire bas
    }

    // 🤖 Étape 3 : Analyse IA du feedback phonétique
    const feedbackPrompt = `
      Tu es un professeur d'arabe. L'élève a tenté de prononcer la lettre "${targetLetter}" 
      et le modèle Whisper a entendu "${transcription}". 
      Donne un feedback simple et bienveillant sur la prononciation, 
      avec un conseil pour s'améliorer en une phrase. Réponds en français.
    `;

    const feedbackResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: feedbackPrompt }],
      temperature: 0.6,
    });

    const feedbackIA = feedbackResponse.choices[0].message.content.trim();

    // 📦 Étape 4 : Retour complet
    return NextResponse.json({
      transcription,
      score,
      feedback: `🎧 Lettre prononcée : ${transcription}\n📊 Précision estimée : ${score}%\n💬 ${feedbackIA}`,
    });
  } catch (error) {
    console.error("Erreur API Whisper :", error);
    return NextResponse.json(
      { error: "Erreur Whisper : " + error.message },
      { status: 500 }
    );
  }
}