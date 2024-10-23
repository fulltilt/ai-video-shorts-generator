"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getVideo } from "@/configs/queries";
import { VideoDataType } from "../(ui)/dashboard/create-new/page";
import { useRouter } from "next/navigation";
import { ActionType } from "../(ui)/dashboard/page";

export default function PlayerDialog({
  videoId,
  dispatch,
}: {
  videoId: number | null;
  dispatch: (x: ActionType) => void;
}) {
  const router = useRouter();

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoData, setVideoData] = useState<VideoDataType>();
  const [durationInFrames, setDurationInFrames] = useState(100);

  useEffect(() => {
    videoId && getVideoData();
  }, [videoId]);

  const getVideoData = async () => {
    const results = (await getVideo(videoId!)) as VideoDataType;
    setVideoData(results);
    setVideoLoaded(true);
  };

  return (
    <Dialog open={videoLoaded}>
      <DialogContent
        className="flex flex-col items-center"
        onEscapeKeyDown={() => dispatch({ type: "close" })}
        onInteractOutside={() => dispatch({ type: "close" })}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold my-5">
            Your video is ready
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Player
          component={RemotionVideo}
          durationInFrames={Number(durationInFrames.toFixed(0))}
          compositionWidth={300}
          compositionHeight={450}
          fps={30}
          inputProps={{
            ...videoData,
            setDurationInFrames: (frameValue: number) =>
              setDurationInFrames(frameValue),
          }}
          controls={true}
        />
        <div className="flex gap-12 mt-4">
          <Button variant={"ghost"} onClick={() => dispatch({ type: "close" })}>
            Cancel
          </Button>
          <Button>Export</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
