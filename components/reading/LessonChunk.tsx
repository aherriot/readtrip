import { Text } from "@/components/ui/Text";

export interface LessonChunkProps {
  /** One block of the lesson — a single small idea, one or two short sentences. */
  children: string;
}

/**
 * One short, visual block of a lesson (docs/10). The lesson prompt separates the
 * explanation into blank-line chunks so early readers get one idea at a time;
 * each chunk renders here at a large, legible reading size with a capped measure.
 *
 * Each block rises + fades in on mount (`motion-safe:`, so the reduced-motion
 * floor keeps it a still paragraph). During streaming that reads as ideas
 * arriving one at a time — a new paragraph gently appears as it's written — since
 * only newly-added chunks mount and animate; earlier ones stay settled.
 */
export function LessonChunk({ children }: LessonChunkProps) {
  return (
    <Text size="lg" measure className="motion-safe:animate-rise-in">
      {children}
    </Text>
  );
}
