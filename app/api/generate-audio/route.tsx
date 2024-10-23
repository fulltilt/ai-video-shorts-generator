import { storage } from "@/configs/FirebaseConfig";
import textToSpeech from "@google-cloud/text-to-speech";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
// const fs = require("fs");
// const util = require("util");

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, id } = await req.json();
    console.log("text", text);
    const storageRef = ref(storage, `ai-short-video-files/${id}.mp3`);

    const request = {
      input: { text: text },
      // Select the language and SSML voice gender (optional)
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      // select the type of audio encoding
      audioConfig: { audioEncoding: "MP3" },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // // Write the binary audio content to a local file
    // const writeFile = util.promisify(fs.writeFile);
    // await writeFile("output.mp3", response.audioContent, "binary");
    // console.log("Audio content written to file: output.mp3");
    console.log("audio", response);

    const audioBuffer = Buffer.from(response?.audioContent, "binary");

    await uploadBytes(storageRef, audioBuffer, { contentType: "audio/mp3" });

    const downloadUrl = await getDownloadURL(storageRef);

    console.log("downloadUrl", downloadUrl);
    return NextResponse.json({ result: downloadUrl });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ "Error:": e });
  }
}
