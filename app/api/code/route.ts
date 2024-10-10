import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Define the type for messages according to OpenAI's expectations
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string; // Optional property for function messages
}

// Instruction message for OpenAI
const instructionMessage: ChatMessage = {
  role: "system",
  content: `You are a code generator. You must answer in markdown code snippets. 
            Use code comments for explanations. 
            Provide code in the following languages: Flutter (Dart), Anaconda (Python), 
            Quantum IBM hardware programming, Kotlin, Java, JavaScript, TypeScript, React, 
            and Jupyter Notebook. Handle programming errors and explain the code.`,
};

export async function POST(req: Request) {
  try {
    const { userId } = auth(); // Authenticate user
    const body = await req.json(); // Parse request body
    const { messages }: { messages: ChatMessage[] } = body;

    // Check if user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if OpenAI API Key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API Key is not configured."); // Log a warning
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Messages must be a non-empty array.", { status: 400 });
    }

    // Initialize OpenAI inside the handler to ensure API key is checked
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepend the instruction message to the messages array
    const completeMessages: ChatMessage[] = [instructionMessage, ...messages];

    // Using OpenAI SDK to create a chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Ensure this is a valid model (verify if gpt-4o-mini exists)
      messages: completeMessages,
    });

    // Check if response contains choices
    if (!response.choices || response.choices.length === 0) {
      return new NextResponse("No response from OpenAI.", { status: 500 });
    }

    // Return the assistant's message
    return NextResponse.json(response.choices[0].message);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[CONVERSATION_ERROR]", errorMessage); // Log the error for debugging
    return new NextResponse(`Internal server error: ${errorMessage}`, { status: 500 });
  }
}
