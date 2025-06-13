import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json();

    //add any endpoint for your LLM here url /api/chat 
    const ollamaResponse = await fetch("https://ai.ainetguard/api/chat", {
      method: "POST",
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "CF-Authorization": process.env.CF_Authorization || "",
      },
      body: JSON.stringify(body),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API responded with status: ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling Ollama API:", error);
    return NextResponse.json({ error: "Failed to call Ollama API" }, { status: 500 });
  }
}

