"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ExpeditionStamp } from "@/components/game/ExpeditionStamp";
import { LevelUpCelebration } from "@/components/game/LevelUpCelebration";
import { RewardBurst } from "@/components/game/RewardBurst";
import { XPBar } from "@/components/game/XPBar";
import { QuizCard } from "@/components/reading/QuizCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Text } from "@/components/ui/Text";
import type { Quiz } from "@/lib/llm";
import { scoreQuiz, type QuizScore } from "@/lib/reading/quiz";
import type { LessonTopic, SteerHandlers } from "./LessonReader";

type Phase =
  | { name: "loading" }
  | { name: "error" }
  | { name: "blocked"; redirect: string }
  | { name: "playing"; quiz: Quiz; index: number }
  | { name: "done"; score: QuizScore; loopId: string | null };

// The XP / level / badge payout for this loop — shown once /api/progress replies.
type Reward = {
  xpAwarded: number;
  /** Cumulative XP after this loop — drives the XPBar fill. */
  xp: number;
  level: number;
  leveledUp: boolean;
  badgeTitle: string | null;
} | null;

// Warm, level-agnostic praise keyed off how the child did — never a "you failed".
function resultMessage(score: QuizScore): string {
  if (score.total === 0) return "Great exploring!";
  if (score.correct === score.total) return "Perfect run — you nailed it!";
  if (score.correct >= score.total / 2) return "Nice work, explorer!";
  return "Great effort — every trip makes you sharper!";
}

export function QuizRunner({
  topic,
  lessonText,
  onExplore,
  onGoDeeper,
}: { topic: LessonTopic; lessonText: string } & SteerHandlers) {
  const [phase, setPhase] = useState<Phase>({ name: "loading" });
  const [reward, setReward] = useState<Reward>(null);
  // First tapped choice per question — the score signal (retries don't count).
  const firstChoices = useRef<(number | null)[]>([]);
  // The persisted loop this quiz belongs to (null if the DB write failed). Steer
  // keys off it to record the score and to link a "go deeper" follow-up.
  const loopId = useRef<string | null>(null);

  // Fetch the quiz exactly once. `fetchedRef` guards against React StrictMode's
  // double-invoke (which would otherwise POST twice and persist two Loops);
  // `activeRef`, reset at the top of every effect run, gates the late setState so
  // a real unmount is ignored but the StrictMode remount still renders.
  const fetchedRef = useRef(false);
  const activeRef = useRef(true);
  useEffect(() => {
    activeRef.current = true;
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      void (async () => {
        try {
          const res = await fetch("/api/quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: topic.title,
              topicSlug: topic.topicSlug,
              intent: topic.intent,
              rawQuery: topic.rawQuery,
              lessonText,
              parentLoopId: topic.parentLoopId,
            }),
          });
          if (!res.ok) throw new Error(`quiz failed: ${res.status}`);
          const data = (await res.json()) as
            | { quiz: Quiz; loopId: string | null }
            | { blocked: true; redirect: string };
          if (!activeRef.current) return;
          // Safety steered the generated quiz away — show a gentle redirect
          // rather than a scary error, and don't try to play a missing quiz.
          if ("blocked" in data) {
            setPhase({ name: "blocked", redirect: data.redirect });
            return;
          }
          loopId.current = data.loopId;
          firstChoices.current = new Array(data.quiz.questions.length).fill(
            null
          );
          setPhase({ name: "playing", quiz: data.quiz, index: 0 });
        } catch (err) {
          console.error(err);
          if (activeRef.current) setPhase({ name: "error" });
        }
      })();
    }
    return () => {
      activeRef.current = false;
    };
  }, [topic, lessonText]);

  if (phase.name === "loading") {
    return (
      <ResultShell>
        <span className="text-5xl" aria-hidden="true">
          🧩
        </span>
        <Heading level={2}>Building your quiz…</Heading>
        <Text tone="soft" aria-live="polite">
          Cooking up a few questions about {topic.title}.
        </Text>
      </ResultShell>
    );
  }

  if (phase.name === "error") {
    return (
      <ResultShell>
        <span className="text-5xl" aria-hidden="true">
          🧭
        </span>
        <Heading level={2}>That quiz got lost</Heading>
        <Text tone="soft" measure aria-live="polite">
          Something went wrong making your quiz. Your reading still counts!
        </Text>
        <Button onClick={onExplore}>Explore something else</Button>
      </ResultShell>
    );
  }

  if (phase.name === "blocked") {
    return (
      <ResultShell>
        <span className="text-5xl" aria-hidden="true">
          🌈
        </span>
        <Heading level={2}>Let&apos;s find something else</Heading>
        <Text tone="soft" measure aria-live="polite">
          {phase.redirect}
        </Text>
        <Button onClick={onExplore}>Try another idea</Button>
      </ResultShell>
    );
  }

  if (phase.name === "done") {
    return (
      <SteerResult
        topic={topic}
        score={phase.score}
        reward={reward}
        loopId={phase.loopId}
        onExplore={onExplore}
        onGoDeeper={onGoDeeper}
      />
    );
  }

  const { quiz, index } = phase;
  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;

  function finish(quiz: Quiz) {
    const score = scoreQuiz(firstChoices.current, quiz);
    const id = loopId.current;
    setPhase({ name: "done", score, loopId: id });

    // Close out the loop once it's persisted: Steer records the score and
    // refreshes the parent-approved difficulty suggestion (docs/04), Progress
    // awards XP + badges (docs/05). Both re-grade server-side from the stored
    // quiz; fire in parallel and fail quietly — neither should block the child
    // from steering onward, and there's nothing to score without a loop.
    if (!id) return;
    const choices = firstChoices.current;

    void fetch("/api/steer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loopId: id, firstChoices: choices }),
    }).catch((err) => console.error("[steer] failed:", err));

    void (async () => {
      try {
        const res = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            loopId: id,
            firstChoices: choices,
            title: topic.title,
          }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as NonNullable<Reward>;
        setReward(data);
      } catch (err) {
        console.error("[progress] failed:", err);
      }
    })();

    // Grow the world map: the explored node is already saved at quiz time, so
    // this just refreshes the interest-driven neighbour suggestions for next
    // time (docs/05). Fire-and-forget — it doesn't affect this screen.
    void fetch("/api/map", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicSlug: topic.topicSlug, title: topic.title }),
    }).catch((err) => console.error("[map] failed:", err));
  }

  function advance() {
    if (isLast) {
      finish(quiz);
    } else {
      setPhase({ name: "playing", quiz, index: index + 1 });
    }
  }

  return (
    <div
      data-surface="paper"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    >
      <Heading level={2}>Quiz: {topic.title}</Heading>
      <ProgressBar
        label="Quiz progress"
        value={index}
        max={quiz.questions.length}
      />
      <QuizCard
        key={index}
        question={question}
        questionNumber={index + 1}
        totalQuestions={quiz.questions.length}
        isLast={isLast}
        onFirstAnswer={(choiceIndex) => {
          firstChoices.current[index] = choiceIndex;
        }}
        onAdvance={advance}
      />
    </div>
  );
}

// The post-quiz Steer screen (docs/01 §6): celebrate the result, then let the
// child choose where to go — deeper on this topic, or somewhere new.
function SteerResult({
  topic,
  score,
  reward,
  loopId,
  onExplore,
  onGoDeeper,
}: {
  topic: LessonTopic;
  score: QuizScore;
  reward: Reward;
  loopId: string | null;
} & SteerHandlers) {
  const [deepening, setDeepening] = useState(false);
  const [followUp, setFollowUp] = useState("");
  // The level-up overlay is the one blocking celebration: it opens as soon as
  // the reward lands with `leveledUp` (derived, no effect needed) and stays open
  // until the child dismisses it. This is the XP/game level — reading-level
  // changes are parent-approved and never surface to the child.
  const [levelUpDismissed, setLevelUpDismissed] = useState(false);

  function submitFollowUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = followUp.trim();
    onGoDeeper(trimmed || `Tell me more about ${topic.title}`, {
      loopId,
      title: topic.title,
    });
  }

  return (
    <ResultShell>
      <span className="text-5xl" aria-hidden="true">
        🌟
      </span>
      <Heading level={2}>{resultMessage(score)}</Heading>
      <Text tone="soft" measure aria-live="polite">
        You got {score.correct} of {score.total} on the first try.
      </Text>
      {reward && (
        <div className="flex w-full flex-col items-center gap-4">
          <RewardBurst xp={reward.xpAwarded} />
          <XPBar xp={reward.xp} className="max-w-xs" />
          {reward.badgeTitle && <ExpeditionStamp title={reward.badgeTitle} />}
        </div>
      )}
      {reward?.leveledUp && (
        <LevelUpCelebration
          open={!levelUpDismissed}
          level={reward.level}
          onDismiss={() => setLevelUpDismissed(true)}
        />
      )}

      {deepening ? (
        <form
          onSubmit={submitFollowUp}
          className="flex w-full flex-col gap-3 text-left"
        >
          <Input
            label={`What else do you want to know about ${topic.title}?`}
            name="followUp"
            value={followUp}
            onChange={(event) => setFollowUp(event.target.value)}
            placeholder="Ask a follow-up, or leave it blank to keep exploring it"
            autoComplete="off"
            maxLength={200}
          />
          <div className="flex flex-wrap justify-center gap-3">
            <Button type="submit">Go deeper</Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setDeepening(false)}
            >
              Back
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => setDeepening(true)}>Go deeper</Button>
          <Button variant="secondary" size="md" onClick={onExplore}>
            Explore something new
          </Button>
        </div>
      )}
    </ResultShell>
  );
}

// The non-question states (loading / error / result) share a centered paper card.
function ResultShell({ children }: { children: React.ReactNode }) {
  return (
    <div data-surface="paper" className="mx-auto w-full max-w-2xl">
      <Card
        elevated
        padding="lg"
        className="flex w-full flex-col items-center gap-4 text-center"
      >
        {children}
      </Card>
    </div>
  );
}
