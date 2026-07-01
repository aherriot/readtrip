// M3 Definition of Done, as a runnable script:
//   "a script can generate a level-appropriate lesson + a schema-valid quiz,
//    with the call logged and the system prefix caching (verify
//    cache_read_input_tokens > 0 on repeat)."
//
// Run with:  npm run llm:verify -- "why is the sky blue?"  [readingLevel]
//
// Requires ANTHROPIC_API_KEY (real call) and DATABASE_URL (to write LlmCallLog).
// Loads .env.local / .env the same way drizzle.config.ts does.
import { desc, eq } from "drizzle-orm";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // not present — env comes from the shell instead
  }
}

async function main() {
  // Imported after env is loaded so the DB/SDK singletons see the vars.
  const { db } = await import("@/lib/db");
  const { llmCallLogs } = await import("@/lib/db/schema");
  const { safetyPrecheck } = await import("@/lib/safety");
  const { normalizeTopic } = await import("@/lib/llm/normalize");
  const { generateLesson } = await import("@/lib/llm/lesson");
  const { generateQuiz } = await import("@/lib/llm/quiz");
  const { clampReadingLevel } = await import("@/lib/llm/prompts/readingLevel");

  const rawQuery = process.argv[2] ?? "why is the sky blue?";
  const readingLevel = clampReadingLevel(Number(process.argv[3] ?? 2));

  console.log(`\n▶ Input: "${rawQuery}"  (reading level ${readingLevel})\n`);

  // 1. Safety precheck
  const safety = await safetyPrecheck(rawQuery);
  if (!safety.ok) {
    console.log(`✋ Blocked (${safety.category}): ${safety.redirect}`);
    return;
  }
  console.log("✓ Safety precheck: safe");

  // 2. Normalize → stable concept
  const topic = await normalizeTopic({ rawQuery });
  console.log("✓ Normalized:", topic);

  // 3. Lesson
  const lesson = await generateLesson({
    title: topic.title,
    rawQuery,
    intent: topic.intent,
    readingLevel,
  });
  console.log(`\n✓ Lesson (${lesson.model}):\n${lesson.text}\n`);

  // 4. Quiz (schema-valid or it throws)
  const { quiz, model: quizModel } = await generateQuiz({
    lessonText: lesson.text,
    readingLevel,
  });
  console.log(
    `✓ Quiz (${quizModel}): ${quiz.questions.length} schema-valid questions`
  );
  for (const q of quiz.questions) {
    console.log(`   • ${q.prompt} → ${q.choices[q.correctIndex]}`);
  }

  // 5. Prove the system prefix caches: run the same lesson again and check that
  // the second call reads from cache. (Cache TTL is ~5 min; back-to-back is fine.)
  console.log("\n▶ Re-running the lesson to exercise the prompt cache…");
  await generateLesson({
    title: topic.title,
    rawQuery,
    intent: topic.intent,
    readingLevel,
  });

  const recentLessons = await db
    .select()
    .from(llmCallLogs)
    .where(eq(llmCallLogs.task, "lesson"))
    .orderBy(desc(llmCallLogs.createdAt))
    .limit(2);

  const cacheRead = recentLessons.reduce(
    (max, row) => Math.max(max, row.cacheReadTokens),
    0
  );
  console.log("\n✓ LlmCallLog rows written. Latest two lesson calls:");
  for (const row of recentLessons) {
    console.log(
      `   ${row.model}  in=${row.inputTokens} out=${row.outputTokens} ` +
        `cacheRead=${row.cacheReadTokens} cacheCreate=${row.cacheCreateTokens} ` +
        `$${row.costUsd.toFixed(5)}  ${row.latencyMs}ms`
    );
  }
  console.log(
    cacheRead > 0
      ? `\n🎉 DoD met: cache_read_input_tokens = ${cacheRead} (> 0) on repeat.`
      : "\n⚠ cache_read_input_tokens was 0 — the system prefix is likely below " +
          "the model's minimum cacheable length (~2048 tok Sonnet). Lengthen the " +
          "shared system prompt or verify within the 5-min TTL."
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
