"use client";

import { Button } from "@/components/ui/button";
import { getUsersVideos } from "@/configs/queries";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Thumbnail } from "@remotion/player";
import { useEffect, useState } from "react";
import { VideoDataType } from "./create-new/page";
import RemotionVideo from "@/app/components/RemotionVideo";
import PlayerDialog from "@/app/components/PlayerDialog";
import { useReducer } from "react";

export type PlayDialogStateType = {
  videoId: number | null;
  openDialog: boolean;
};
export type ActionType =
  | { type: "open"; payload: PlayDialogStateType }
  | { type: "close" };

function reducer(
  state: PlayDialogStateType,
  action: ActionType
): PlayDialogStateType {
  if (action.type === "open") {
    return {
      ...action.payload,
    };
  } else if (action.type === "close") {
    return initialState;
  }

  return initialState;
}
const initialState = {
  videoId: null,
  openDialog: false,
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [playDialogState, dispatch] = useReducer(reducer, initialState);

  const [videoList, setVideoList] = useState<VideoDataType[]>([]);
  const [openPlayDialog, setOpenPlayDialog] = useState(false);
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    session?.user.email && getVideoList(session.user.email);
  }, [session]);

  const getVideoList = async (email: string) => {
    if (!session?.user) return;
    const res = await getUsersVideos(email);

    setVideoList(res);
  };

  return (
    <div className="p-10 w-full">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Dashboard</h2>
        <Link href="/dashboard/create-new">
          <Button>+ Create New</Button>
        </Link>
      </div>
      {videoList.length === 0 && (
        <div className="p-5 py-24 flex items-center flex-col mt-10 border-2 border-dashed">
          <h2>You don&apos;t have any short video created</h2>
          <Link href="/dashboard/create-new">
            <Button>Create New Short Video</Button>
          </Link>
        </div>
      )}

      {/* <div className="mt-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"> */}
      <div className="mt-12 flex flex-wrap gap-8">
        {videoList.map((video, idx) => (
          <div
            key={idx}
            onClick={() => {
              dispatch({
                type: "open",
                payload: {
                  videoId: video.id,
                  openDialog: true,
                },
              });
            }}
          >
            <Thumbnail
              component={RemotionVideo}
              compositionWidth={250}
              compositionHeight={390}
              frameToDisplay={30}
              durationInFrames={120}
              fps={30}
              inputProps={{
                ...video,
                setDurationInFrames: () => {},
              }}
              style={{ borderRadius: "15px" }}
              className="cursor-pointer hover:scale-105 transition-all"
            />
          </div>
        ))}

        {playDialogState.openDialog && (
          <PlayerDialog dispatch={dispatch} videoId={playDialogState.videoId} />
        )}
      </div>
    </div>
  );
}
