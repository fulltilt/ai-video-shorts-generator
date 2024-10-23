"use client";

import CustomLoader from "@/components/CustomLoader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { VideoDataContext } from "@/app/videoDataContext";
import { useSession } from "next-auth/react";
import { insertVideo } from "@/configs/queries";
import PlayerDialog from "@/app/components/PlayerDialog";

const FormDataSchema = z.object({
  topic: z.string().optional(),
  duration: z.string().optional(),
  imageStyle: z.string().optional(),
});
const VideoScriptSchema = z.array(
  z.object({ imagePrompt: z.string(), contextText: z.string() })
);
const AudioFileUrlSchema = z.string();
const CaptionSchema = z.array(
  z.object({
    text: z.string(),
    start: z.number(),
    end: z.number(),
    confidence: z.number(),
    speaker: z.string().nullable(),
  })
);
const ImageListSchema = z.array(z.string());

type VideoScript = z.infer<typeof VideoScriptSchema>;
type FormDataType = z.infer<typeof FormDataSchema>;
type AudioFileUrl = z.infer<typeof AudioFileUrlSchema>;
type Caption = z.infer<typeof CaptionSchema>;
type ImageList = z.infer<typeof ImageListSchema>;

export type VideoDataType = {
  id: number;
  script: VideoScript;
  audioFileUrl: AudioFileUrl;
  captions: Caption;
  imageList: ImageList;
  createdBy?: string;
};

export default function CreateNew() {
  const { data: session } = useSession();

  const [selectedOption, setSelectedOption] = useState("Custom Prompt");
  const [formData, setFormData] = useState<FormDataType>({});
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("15 Seconds");
  const [isLoading, setIsLoading] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState();

  const { videoData, setVideoData } = useContext(VideoDataContext);

  const options = [
    "Custom Prompt",
    "Random AI Story",
    "Scary Story",
    "Historical Facts",
    "Bed Time Story",
    "Motivational",
    "Fun Facts",
  ];

  const styleOptions = [
    {
      name: "Realistic",
      image: "/realistic.webp",
    },
    {
      name: "Cartoon",
      image: "/cartoon.jpeg",
    },
    {
      name: "Comic",
      image: "/comic.jpeg",
    },
    {
      name: "Watercolor",
      image: "/watercolor.jpeg",
    },
    {
      name: "GTA",
      image: "/gta.jpeg",
    },
  ];

  useEffect(() => {
    console.log("videoData", videoData);
    if (videoData && Object.keys(videoData).length === 4)
      saveVideoData(videoData);
  }, [videoData]);

  const saveVideoData = async (videoData: VideoDataType) => {
    try {
      setIsLoading(true);
      const res = await insertVideo(videoData, session?.user.email);

      setVideoId(res[0].id);
      setPlayVideo(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onHandleInputChange = (fieldName: string, fieldValue: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const GetVideoScript = async (): Promise<VideoScript> => {
    const prompt = `write a script to generate a ${formData.duration} video on topic: ${formData.topic} along with an AI image prompt in realistic format for each scene and give me the result in JSON format with image prompt in ${formData.imageStyle} and ContextText as field, no plain text`;

    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/get-video-script", {
          method: "POST",
          body: JSON.stringify({
            prompt,
          }),
        });
        const data = await res.json();
        const validatedVideoScript = VideoScriptSchema.parse(data.result);
        setVideoData((prev: VideoDataType) => ({
          ...prev,
          script: validatedVideoScript,
        }));
        resolve(validatedVideoScript);
      } catch (e) {
        console.log("error", e);
        reject(e);
      }
    });
  };

  const GenerateAudioFile = async (
    videoScript: VideoScript
  ): Promise<AudioFileUrl> => {
    let script = "";
    const id = uuidv4();
    videoScript?.forEach((item) => {
      script += `${item.contextText} `;
    });

    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/generate-audio", {
          method: "POST",
          body: JSON.stringify({
            text: script,
            id,
          }),
        });
        const data = await res.json();
        const audioFileUrl = AudioFileUrlSchema.parse(data.result);
        setVideoData((prev: VideoDataType) => ({
          ...prev,
          audioFileUrl,
        }));
        resolve(audioFileUrl);
      } catch (e) {
        console.log("error", e);
        reject(e);
      }
    });
  };

  const GenerateAudioCaptions = async (
    audioFileUrl: string
  ): Promise<Caption> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/generate-caption", {
          method: "POST",
          body: JSON.stringify({
            audioFileUrl,
          }),
        });
        const data = await res.json();
        const captions = CaptionSchema.parse(data.result);
        setVideoData((prev: VideoDataType) => ({
          ...prev,
          captions,
        }));
        resolve(captions);
      } catch (e) {
        console.log("error", e);
        reject(e);
      }
    });
  };

  const GenerateImages = (videoScript: VideoScript): Promise<ImageList> => {
    return new Promise(async (resolve, reject) => {
      const promises: Promise<Response>[] = [];
      try {
        videoScript?.forEach(async (element) => {
          promises.push(
            fetch("/api/generate-image", {
              method: "POST",
              body: JSON.stringify({
                prompt: element?.imagePrompt,
              }),
            })
          );
        });
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map((res) => res.json()));
        const imageList = ImageListSchema.parse(data.map((d) => d.result));

        setVideoData((prev: VideoDataType) => ({
          ...prev,
          imageList,
        }));
        resolve(imageList);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  };

  return (
    <div className="p-12 w-full">
      <h2 className="font-bold text-4xl text-center">Create New</h2>
      <div className="flex flex-col gap-8 mt-12 shadow-md p-12">
        {/* Topic */}
        <div>
          <h2 className="font-bold text-2xl">Content</h2>
          <p>What is the topic of your video?</p>
          <Select
            onValueChange={(value) => {
              setSelectedOption(value);
              if (value !== "CustomPrompt") onHandleInputChange("topic", value);
            }}
          >
            <SelectTrigger className="w-full mt-4 p-8 text-lg">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, idx) => (
                <SelectItem key={idx} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedOption === "Custom Prompt" && (
            <Textarea
              className="mt-4"
              placeholder="Write prompt on which you want to generate video"
              onChange={(e) => onHandleInputChange("topic", e.target.value)}
            />
          )}
        </div>

        {/* Style */}
        <div>
          <h2 className="font-bold text-2xl">Style</h2>
          <p>Select your video style</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
            {styleOptions.map((item, idx) => (
              <div
                key={idx}
                className={`relative hover:scale-105 transition-all cursor-pointer rounded-xl ${
                  selectedStyle === item.name && "border-4 border-primary"
                }`}
                onClick={() => {
                  setSelectedStyle(item.name);
                  onHandleInputChange("imageStyle", item.name);
                }}
              >
                <Image
                  src={item.image}
                  width={100}
                  height={100}
                  alt="style"
                  className="h-48 object-cover rounded-lg w-full"
                />
                <h2 className="absolute p-1 bg-black bottom-0 w-full text-white rounded-b-lg dark:bg-white dark:text-black text-center">
                  {item.name}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <h2 className="font-bold text-2xl">Duration</h2>
          <p>Select the duration of your video</p>
          <Select
            onValueChange={(value) => {
              setSelectedDuration(value);
              onHandleInputChange("duration", value);
            }}
          >
            <SelectTrigger className="w-full mt-4 p-8 text-lg">
              <SelectValue placeholder="Select Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15 second">15</SelectItem>
              <SelectItem value="30 second">30</SelectItem>
              <SelectItem value="60 second">60</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="mt-12 w-full"
          onClick={async () => {
            try {
              setIsLoading(true);
              const videoScript = await GetVideoScript();
              const audioFile = await GenerateAudioFile(videoScript);
              const captions = await GenerateAudioCaptions(audioFile);
              const images = await GenerateImages(videoScript);
            } catch (e) {
              console.log(e);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          Create Short Video
        </Button>
      </div>

      <CustomLoader loading={isLoading} />
      <PlayerDialog playVideo={true} videoId={null} />
    </div>
  );
}
