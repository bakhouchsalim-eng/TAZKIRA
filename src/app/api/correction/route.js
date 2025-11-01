import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio");
    const verse = formData.get("verse");

    // 🔊 Convertir la récitation utilisateur en texte
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = path.join("/tmp", "recitation.wav");
    fs.writeFileSync(tempPath, buffer);

    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-1",
      language: "ar",
    });

    const userText = transcript.text;

    // 🧠 Analyse comparative de la prononciation
    const feedbackRes = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
Tu es un professeur de tajwid.
Voici le verset original :
"${verse}"

Et voici la récitation de l'utilisateur :
"${userText}"

Analyse les erreurs éventuelles de prononciation et donne un feedback précis et bienveillant.
Exemple : "Bonne prononciation générale. Attention à la lettre ع dans الرحمن."
          `,
    });

    const feedback = feedbackRes.output[0].content[0].text;

    return new Response(JSON.stringify({ feedback }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Erreur correction :", err);
    return new Response(JSON.stringify({ feedback: "Erreur d'analyse vocale." }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}