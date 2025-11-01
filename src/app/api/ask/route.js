import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { question } = await req.json();

    if (!question || question.trim() === "") {
      return new Response(
        JSON.stringify({ answer: "Veuillez poser une question." }),
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es Tazkira, une IA musulmane bienveillante.
          Réponds avec douceur et précision, en respectant la neutralité religieuse.`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = completion.choices[0].message.content;
    return new Response(JSON.stringify({ answer }), { status: 200 });
  } catch (error) {
    console.error("Erreur API :", error);
    return new Response(
      JSON.stringify({ answer: "Erreur côté serveur : " + error.message }),
      { status: 500 }
    );
  }
}