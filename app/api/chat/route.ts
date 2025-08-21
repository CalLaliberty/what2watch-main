// /app/api/chat/route.ts
import { NextResponse } from "next/server";
import { askContentMaster } from "@/lib/ai/contentMaster";

export async function POST(req: Request) {
  try {
    const { messages, type } = await req.json(); // type: "movie" | "tv"
    const reply = await askContentMaster(messages, type);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { reply: "Error: AI unavailable." },
      { status: 500 }
    );
  }
}
