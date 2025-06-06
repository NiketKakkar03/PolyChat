import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount=1, resolution="512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400});
    }

    if (!amount) {
      return new NextResponse("amount is required", { status: 400});
    }

    if (!resolution) {
      return new NextResponse("resolution is required", { status: 400});
    }

    const chatCompletion = await openai.createImage({
      prompt: prompt,
      n: parseInt(amount, 10),
      size: resolution
    });

    return NextResponse.json(chatCompletion.data.data);

  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
