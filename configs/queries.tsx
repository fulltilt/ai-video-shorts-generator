"use server";

import { VideoDataType } from "@/app/(ui)/dashboard/create-new/page";
import { db } from "./db";
import { videoData } from "./schema";
import { eq } from "drizzle-orm";

export async function insertVideo(data: VideoDataType, email: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await db
        .insert(videoData)
        .values({
          script: data.script,
          audioFileUrl: data.audioFileUrl,
          captions: data.captions,
          imageList: data.imageList,
          createdBy: email,
        })
        .returning({ id: videoData.id });

      console.log(result);
      resolve(result);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}

export async function getVideo(videoId: number) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await db
        .select()
        .from(videoData)
        .where(eq(videoData.id, videoId));

      console.log(result);
      resolve(result[0]);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}

export async function getUsersVideos(email: string): Promise<VideoDataType[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await db
        .select()
        .from(videoData)
        .where(eq(videoData.createdBy, email));
      console.log(result);

      resolve(result);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}
