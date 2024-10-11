import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the type for the expected request body
interface RequestBody {
  prompt: string;
  amount?: number; // Optional, defaults to 1
  resolution?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792"; // Allowed resolution types
}

export async function POST(req: Request) {
  try {
    const { userId } = auth(); // Authenticate user
    const body: RequestBody = await req.json(); // Type the body
    const { prompt, amount = 1, resolution = "512x512" } = body; // Destructure with defaults

    // Check if user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if OpenAI API Key is configured
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    // Validate prompt
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // Validate amount
    if (!amount || amount < 1 || amount > 10) {
      return new NextResponse("Amount must be between 1 and 10", { status: 400 });
    }

    // Validate resolution
    const validResolutions = ["256x256", "512x512", "1024x1024", "1792x1024", "1024x1792"];
    if (!resolution || !validResolutions.includes(resolution)) {
      return new NextResponse("Resolution is required and must be one of " + validResolutions.join(", "), { status: 400 });
    }

    // Modify the prompt to include specific requirements
    const modifiedPrompt = `${prompt}. Generate images of celebrities, scientists, and historical figures.`;

    // Ensure amount is an integer
    const imageCount = Math.floor(amount); // Make sure amount is an integer

    // Generate the images using OpenAI API
    const response = await openai.images.generate({
      prompt: modifiedPrompt, // The modified image prompt to generate from
      n: imageCount, // Number of images, ensure this is an integer
      size: resolution, // Image resolution
    });

    // Return the generated image URLs
    return NextResponse.json(response.data);

  } catch (error) {
    console.error("[IMAGE_GENERATION_ERROR]", error); // Log the error

    // Handle known errors
    if (error instanceof Error) {
      return new NextResponse(`Internal error: ${error.message}`, { status: 500 });
    } else {
      return new NextResponse("Internal error occurred", { status: 500 });
    }
  }
}
