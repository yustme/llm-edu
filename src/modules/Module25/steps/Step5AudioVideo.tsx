import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  SPEAKER_SEGMENTS,
  AUDIO_TOTAL_DURATION_SECONDS,
  AUDIO_PROCESSING_STAGES,
  VIDEO_PROCESSING_STAGES,
} from "@/data/mock-multimodal";

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.4;

function SpeakerTimeline() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Speaker Diarization Timeline
      </p>

      {/* Timeline bar */}
      <div className="relative h-10 w-full rounded-lg bg-muted/50 overflow-hidden border">
        {SPEAKER_SEGMENTS.map((segment, index) => {
          const leftPercent =
            (segment.startSeconds / AUDIO_TOTAL_DURATION_SECONDS) * 100;
          const widthPercent =
            ((segment.endSeconds - segment.startSeconds) /
              AUDIO_TOTAL_DURATION_SECONDS) *
            100;

          return (
            <motion.div
              key={`${segment.speaker}-${segment.startSeconds}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: index * 0.15,
                duration: 0.4,
                ease: "easeOut",
              }}
              style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                transformOrigin: "left",
              }}
              className={cn(
                "absolute top-0 h-full cursor-pointer transition-opacity",
                segment.color,
                hoveredIndex !== null && hoveredIndex !== index
                  ? "opacity-40"
                  : "opacity-80",
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </div>

      {/* Time markers */}
      <div className="flex justify-between text-xs text-muted-foreground px-0.5">
        <span>0:00</span>
        <span>0:15</span>
        <span>0:30</span>
        <span>0:45</span>
        <span>1:00</span>
      </div>

      {/* Legend */}
      <div className="flex gap-3">
        {["Speaker A", "Speaker B", "Speaker C"].map((speaker) => {
          const seg = SPEAKER_SEGMENTS.find((s) => s.speaker === speaker);
          return (
            <div key={speaker} className="flex items-center gap-1.5">
              <div
                className={cn("h-3 w-3 rounded-sm", seg?.color ?? "bg-gray-300")}
              />
              <span className="text-xs text-muted-foreground">{speaker}</span>
            </div>
          );
        })}
      </div>

      {/* Transcript segments */}
      <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border bg-card p-3">
        {SPEAKER_SEGMENTS.map((segment, index) => (
          <motion.div
            key={`${segment.speaker}-${segment.startSeconds}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.8 + index * STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className={cn(
              "rounded-md p-2 text-sm transition-colors",
              hoveredIndex === index ? "bg-muted" : "",
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <div className={cn("h-2.5 w-2.5 rounded-sm", segment.color)} />
              <span className="text-xs font-semibold">{segment.speaker}</span>
              <span className="text-xs text-muted-foreground">
                {formatTime(segment.startSeconds)} -{" "}
                {formatTime(segment.endSeconds)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground pl-5">{segment.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AudioPipeline() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Audio Processing Pipeline
      </p>
      <div className="space-y-2">
        {AUDIO_PROCESSING_STAGES.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className="flex items-start gap-3 rounded-lg border bg-card p-3"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{stage.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stage.description}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                <Badge variant="outline" className="text-xs">
                  {stage.inputLabel}
                </Badge>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {stage.outputLabel}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function VideoPipeline() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Video Processing Pipeline
      </p>
      <div className="space-y-2">
        {VIDEO_PROCESSING_STAGES.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className="flex items-start gap-3 rounded-lg border bg-card p-3"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{stage.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stage.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function Step5AudioVideo() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Audio & Video Processing"
          highlights={[
            "Transcription",
            "Speaker Diarization",
            "Video Summarization",
          ]}
        >
          <p>
            Audio and video modalities bring temporal understanding to AI
            systems. Unlike static images, these inputs unfold over time and
            require sequential processing.
          </p>
          <p>Key audio capabilities:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Transcription</strong> -- converting speech to text using
              models like Whisper
            </li>
            <li>
              <strong>Speaker diarization</strong> -- identifying who is
              speaking at each moment by clustering voice embeddings
            </li>
            <li>
              <strong>Sentiment from tone</strong> -- detecting emotion and
              urgency beyond the words themselves
            </li>
          </ul>
          <p>Video combines visual and audio analysis:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Frame extraction</strong> -- sampling key frames for
              visual analysis
            </li>
            <li>
              <strong>Temporal fusion</strong> -- combining visual and audio
              tracks into a coherent timeline
            </li>
            <li>
              <strong>Summarization</strong> -- generating structured summaries
              with timestamps and highlights
            </li>
          </ul>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea>
          <Tabs defaultValue="audio">
            <TabsList>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
            </TabsList>

            <TabsContent value="audio" className="mt-4 space-y-5">
              <SpeakerTimeline />
              <AudioPipeline />
            </TabsContent>

            <TabsContent value="video" className="mt-4">
              <VideoPipeline />
            </TabsContent>
          </Tabs>
        </InteractiveArea>
      </div>
    </div>
  );
}
