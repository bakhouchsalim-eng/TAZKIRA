import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { verse, translation } = await req.json();

    const prompt = `
Explique simplement ce verset du Coran en français clair et accessible :
---
Texte arabe : ${verse}
Traduction française : ${translation}
---

Présente :
1. Le contexte général du verset (si connu)
2. Le sens spirituel principal
3. Une leçon pratique pour la vie du musulman
Utilise un ton doux, pédagogique et respectueux de la foi musulmane.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const tafsir = completion.choices[0]?.message?.content?.trim() || "Tafsîr non disponible.";
    return Response.json({ tafsir });
  } catch (error) {
    console.error("Erreur tafsir :", error);
    return Response.json({ tafsir: "Erreur tafsir." }, { status: 500 });
  }
}