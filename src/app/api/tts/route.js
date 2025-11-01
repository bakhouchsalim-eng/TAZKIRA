import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return new Response(JSON.stringify({ error: "Texte vide" }), { status: 400 });
    }

    // 🔊 Création de la voix avec OpenAI
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy", // ou "verse", "soft", "bright"
      input: text,
    });

    // ✅ Conversion du flux audio en Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🔁 Envoi du fichier audio au frontend
    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Erreur API TTS :", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}