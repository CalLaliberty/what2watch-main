// /lib/ai/contentMaster.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI!);

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export async function askContentMaster(
  history: ChatMessage[],
  type: "movie" | "tv"
) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const category = type === "movie" ? "movies" : "TV shows";
  const prompt = `
You are an expert in ${category}.
Only answer questions about ${category}.
Ask clarifying questions if needed (genre, mood, actor, year, platform).
Always give a few specific ${
    category === "movies" ? "movie" : "TV show"
  } suggestions with a short description of each.
Keep replies concise, fun, and engaging.
Never go off-topic.

User conversation history:
${history.map((msg) => `${msg.role}: ${msg.text}`).join("\n")}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
