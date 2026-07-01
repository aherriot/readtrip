# QuizCard

One quiz question — prompt, choices, and feedback — on the paper surface.
Source: [`components/reading/QuizCard.tsx`](../../../../components/reading/QuizCard.tsx).

```tsx
import { QuizCard } from "@/components/reading/QuizCard";

<QuizCard
  question={quiz.questions[i]}
  questionNumber={i + 1}
  totalQuestions={quiz.questions.length}
  isLast={i === quiz.questions.length - 1}
  onFirstAnswer={(choiceIndex) => (firstChoices.current[i] = choiceIndex)}
  onAdvance={next}
/>;
```

## When to use

- To render a single question in a quiz flow (see `app/(child)/play/QuizRunner.tsx`). The
  runner owns the question list, progress bar, and scoring; `QuizCard` owns one question's
  answer state.

## Behavior

- **Unfailable, low-stakes.** A wrong tap marks that choice **Try again** and lets the child
  keep trying; the correct tap reveals a cheerful explanation and the advance button.
- The **first** tap is reported via `onFirstAnswer` (the score signal — retries don't count),
  so scoring stays honest without pressuring the child.

## Props

| Prop             | Type                            | Notes                                             |
| ---------------- | ------------------------------- | ------------------------------------------------- |
| `question`       | `Quiz["questions"][number]`     | Prompt, choices, `correctIndex`, `explanation`.   |
| `questionNumber` | `number`                        | 1-based, for the "Question N of M" caption.       |
| `totalQuestions` | `number`                        | Total in the quiz.                                |
| `isLast`         | `boolean`                       | Advance button reads "Finish" vs "Next question". |
| `onFirstAnswer`  | `(choiceIndex: number) => void` | Fired once, on the first tap.                     |
| `onAdvance`      | `() => void`                    | Advance/finish; only reachable once solved.       |

## Accessibility

- Prompt is a `<legend>` over a `<fieldset>` of [`QuizChoice`](quiz-choice.md) buttons.
- The explanation appears in an `aria-live="polite"` region so SR users hear the feedback.
- Fully keyboard-operable via the underlying real buttons.
