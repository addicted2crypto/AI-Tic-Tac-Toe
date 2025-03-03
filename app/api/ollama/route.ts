import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const ollamaResponse = await fetch("ai.ainetguard.com/api/chat", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API responded with status: ${ollamaResponse.status}`)
    }

    const data = await ollamaResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error calling Ollama API:", error)
    return NextResponse.json({ error: "Failed to call Ollama API" }, { status: 500 })
  }
}

