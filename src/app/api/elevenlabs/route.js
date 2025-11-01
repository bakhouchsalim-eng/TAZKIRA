import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, voice } = await req.json();

    // 🧩 Remplace ceci par ta vraie clé API ElevenLabs :
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      throw new Error("⚠️ Clé API ElevenLabs manquante !");
    }

    // 🎙️ Appel API ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice || "pNInz6obpgDQGcFmaJgB"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Erreur ElevenLabs : " + errorText);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({ success: true, audioBase64 });
  } catch (err) {
    console.error("❌ Erreur ElevenLabs :", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}