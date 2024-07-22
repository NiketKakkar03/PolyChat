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
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400});
    }

    // Ensure messages are typed correctly 
    const chatMessages: ChatCompletionRequestMessage[] = messages.map((message: any) => ({
      role: message.role,
      content: message.content,
    }));

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chatMessages,
    });

    return NextResponse.json(chatCompletion.data.choices[0].message);

  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
