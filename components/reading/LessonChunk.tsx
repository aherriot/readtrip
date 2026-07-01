import { Text } from "@/components/ui/Text";

export interface LessonChunkProps {
  /** One block of the lesson — a single small idea, one or two short sentences. */
  children: string;
}

/**
 * One short, visual block of a lesson (docs/10). The lesson prompt separates the
 * explanation into blank-line chunks so early readers get one idea at a time;
 * each chunk renders here at a large, legible reading size with a capped measure.
 */
export function LessonChunk({ children }: LessonChunkProps) {
  return (
    <Text size="lg" measure>
      {children}
    </Text>
  );
}
