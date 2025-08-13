import type { NextApiRequest, NextApiResponse } from "next";

const corsMiddleware = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  corsMiddleware(req, res);
  if (req.method === "POST") {
    try {
      const id = process.env.CF_Appsession;
      const secret = process.env.CF_Authorization;
      const token = process.env.CF_Token;

      let headers: any = {};
      if(token) {
        // If token is provided, use it for authorization
        headers["Authorization"] = `Bearer ${token}`;
        console.log("Authorization token:", token);
      } else {
        headers["CF-Access-Client-Id"] = id;
        console.log("CF-Access-Client-Id:", id);
        headers["CF-Client-Secret"] = secret;
        console.log("CF-Client-Secret:", secret);
        // headers["CF-Appsession"] = id || "";
        // console.log("CF-Appsession:", id);
        headers["CF-Authorization"] = secret || "";
        console.log("CF-Authorization:", secret);
      }
      //can add any endpoint for llm here eg "localhost:2222/api/chat for proxy"
      // const url = "https://ai1.rougeai.net/api/chat";
      //url for open ai endpoint https://api.openai.com/v1/responses
      const url = "http://localhost:11434/api/chat";
      const ollamaResponse = await fetch(`${url}/api/chat`, {
        // const openAIResponse = await fetch(`${url}/v1/responses`, {

        method: "POST",
        headers: {
          //headers only depending on the api you are using
          // ...headers, 
          "content-type": "application/json",
          body: JSON.stringify(req.body),
          //added to headers for ease of code breakup
          // "Content-Type": "application/json",
          // "CF-Appsession": process.env.CF_Appsession || "",
          //  "CF-Authorization": process.env.CF_Authorization || "",
        }
        });console.log("Response headers from ai1.rougeai.net:", ollamaResponse.headers);

         if (!ollamaResponse.ok) {
        throw new Error(`Ollama API responded with status: ${ollamaResponse.status}`);
      }
      
   

      const data = await ollamaResponse.json();
      res.status(200).json(data)
    } catch (error) {
      console.error("Error calling Ollama API:", error);
      res.status(500).json({ error: "Error making a request to that glorious api endpoint" });
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
