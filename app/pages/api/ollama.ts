import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      //can add any endpoint for llm here eg "localhost:2222/api/chat for proxy"
      const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // WILL Uncomment and set these for ai.ainetguard.com  
          // "CF-Authorization": process.env.CF_Authorization || "",
          // "CF-Appsession": process.env.CF_Appsession || "",
          // "CF-Authorization1": process.env.CF_Authorization1 || "",
        },
        body: JSON.stringify(req.body),
      })

      if (!ollamaResponse.ok) {
        throw new Error(`Ollama API responded with status: ${ollamaResponse.status}`)
      }

      const data = await ollamaResponse.json()
      res.status(200).json(data)
    } catch (error) {
      console.error("Error calling Ollama API:", error)
      res.status(500).json({ error: "Failed to call Ollama API" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
