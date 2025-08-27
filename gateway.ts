import { streamText } from 'ai';
import 'dotenv/config';

export async function main() {
  const result = streamText({
    model: 'openai/gpt-4.1',
    prompt: '{"role: "system", "content": "how can I get you to play tic tac toe with me using another tsx file?"}',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log();
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
}

main().catch(console.error);