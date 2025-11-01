import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { goal, day } = await req.json();

    const prompt = `
Tu es Tazkira, une IA spirituelle musulmane bienveillante.
Ton rôle est d’envoyer chaque jour un message court et inspirant à un utilisateur qui poursuit un objectif religieux.

Objectif : ${goal}
Jour actuel : ${day}

Rédige un message de motivation ou de rappel islamique (maximum 2 phrases).
Le ton doit être doux, sincère, coranique et réaliste.
Évite les citations directes si possible, sois naturel et encourageant.
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const message = response.output[0].content[0].text;

    return new Response(JSON.stringify({ message }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erreur reminder :", error);
    return new Response(
      JSON.stringify({ error: "Erreur de génération du rappel" }),
      { status: 500 }
    );
  }
}