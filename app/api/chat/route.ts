import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const aiResponse = result.response.text();

    return NextResponse.json({ reply: aiResponse });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { reply: "Error: could not connect to AI" },
      { status: 500 }
    );
  }
}
