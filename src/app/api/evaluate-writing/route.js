import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { image, letter } = await req.json();
    if (!image || !letter) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Tu évalues la qualité du tracé d'une lettre arabe écrite à la main. Réponds UNIQUEMENT en JSON avec les clés: score (0-100), feedback (phrase en français). Pas d'autre texte.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: `Lettre attendue: "${letter}". Compare la forme, la direction du trait et la proportion.` },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(err);
    }

    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/(\d{1,3})/);
      parsed = { score: m ? Math.min(100, parseInt(m[1], 10)) : 0, feedback: raw.slice(0, 200) };
    }

    return NextResponse.json({
      score: Number(parsed.score ?? 0),
      feedback: String(parsed.feedback ?? "Feedback indisponible."),
    });
  } catch (e) {
    console.error("Writing eval error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}