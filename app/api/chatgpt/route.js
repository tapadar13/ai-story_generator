import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { story } = await request.json();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a master storyteller with a flair for enchanting and fantastical tales, weaving narratives that are personalized and unique to each individual. Your stories transport listeners to magical realms filled with wonder and adventure, tailored specifically for them.",
          },
          {
            role: "user",
            content: `${story}`,
          },
        ],
      }),
    });

    const responseData = await response.json();
    if (!responseData.choices || responseData.choices.length === 0) {
      throw new Error("No choices returned from OpenAI API");
    }
    const reply = responseData.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "An error occurred while processing your request.",
    });
  }
};
