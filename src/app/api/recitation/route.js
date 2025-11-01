import OpenAI from "openai";

export const runtime = "nodejs"; // ⚠️ Important : éviter les erreurs edge runtime

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response("Texte manquant pour la récitation", { status: 400 });
    }

    // 🎧 Génération audio avec modèle TTS
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    });

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    // ✅ Retourner le son au navigateur
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
      status: 200,
    });
  } catch (err) {
    console.error("❌ Erreur génération audio :", err);
    return new Response(
      JSON.stringify({
        error:
          "Erreur lors de la génération de la récitation. Vérifie ton API key OpenAI.",
      }),
      { status: 500 }
    );
  }
}