import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      return NextResponse.json({ error: "API configuration error" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are QuickMate AI, a helpful assistant for QuickMate, a platform connecting college students who need tasks done (like getting food, notes, errands) with other students (Mates) who can do them for a small fee. Be concise, friendly, and helpful. Use emojis occasionally.",
    });

    // Convert chat history for Gemini
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.isBot ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const latestMessage = messages[messages.length - 1].text;

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(latestMessage);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
