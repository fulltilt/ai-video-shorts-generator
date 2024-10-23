import { AssemblyAI } from "assemblyai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { audioFileUrl } = await req.json();

  const client = new AssemblyAI({
    apiKey: process.env.CAPTION_API!,
  });

  const data = {
    audio: audioFileUrl,
  };

  try {
    const transcript = await client.transcripts.transcribe(data);
    // console.log("captions", transcript);
    return NextResponse.json({
      result: transcript.words,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      error: e,
    });
  }
}
