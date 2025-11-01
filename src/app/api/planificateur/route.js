import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { objectif, duree } = await req.json();

    const prompt = `
Tu es un professeur coranique expérimenté.  
L’utilisateur t’explique son objectif d’apprentissage du Coran.

Génère un **plan d'apprentissage précis et structuré** selon ces règles :
1. Couvre exactement la période donnée (ex: 2 mois, 8 semaines…)
2. Découpe le plan en **semaines et jours**
3. Mentionne **chaque sourate et les versets exacts** à apprendre quotidiennement
4. Intègre des **jours de révision** réguliers
5. Si l’objectif est très ambitieux (ex: moitié du Coran), répartis la charge de manière réaliste
6. Le ton doit être clair, pédagogique, encourageant.

Voici l'objectif :
"${objectif}"

Durée : ${duree}

Présente le résultat sous forme lisible, structurée par semaines et jours.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const plan = completion.choices[0]?.message?.content?.trim() || "Aucun plan généré.";
    return Response.json({ plan });
  } catch (error) {
    console.error("Erreur planificateur :", error);
    return Response.json({ plan: "Erreur lors de la génération du plan." }, { status: 500 });
  }
}