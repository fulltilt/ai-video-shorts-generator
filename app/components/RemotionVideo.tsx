import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { VideoDataType } from "../(ui)/dashboard/create-new/page";

export default function RemotionVideo({
  script,
  imageList,
  audioFileUrl,
  captions,
  setDurationInFrames,
}: VideoDataType & { setDurationInFrames: (frameValue: number) => void }) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const getDurationFrame = () => {
    const frames = (captions[captions.length - 1].end / 1000) * fps;
    setDurationInFrames(frames);
    return frames;
  };

  const getCurrentCaptions = () => {
    const currentTime = (frame / 30) * 1000; // convert frame number to milliseconds
    const currentCaption = captions.find(
      (word) => currentTime >= word.start && currentTime <= word.end
    );
    return currentCaption?.text ?? "";
  };

  return (
    <div>
      <AbsoluteFill className="bg-black dark:bg-white">
        {imageList.map((item, idx) => {
          const startTime = (idx * getDurationFrame()) / imageList.length;
          const duration = getDurationFrame();
          const scale = (index: number) =>
            interpolate(
              frame,
              [startTime, startTime + duration / 2, startTime + duration],
              index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

          return (
            <div key={idx}>
              <Sequence from={startTime} durationInFrames={getDurationFrame()}>
                <Img
                  src={item}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale(idx)})`,
                  }}
                />
                <AbsoluteFill className="text-white justify-center items-center bottom-8 h-[150px]">
                  <h2 className="text-2xl font-bold">{getCurrentCaptions()}</h2>
                </AbsoluteFill>
              </Sequence>
            </div>
          );
        })}
        <Audio src={audioFileUrl} />
      </AbsoluteFill>
    </div>
  );
}
