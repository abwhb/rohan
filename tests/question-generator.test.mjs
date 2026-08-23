import assert from "node:assert/strict";
import test from "node:test";

import { buildDailyQuestion, dailyQuestionTopicIds } from "../src/lib/question-generator.ts";

test("builds a valid deterministic daily question for every topic", () => {
  assert.equal(dailyQuestionTopicIds.length, 18);

  for (const topicId of dailyQuestionTopicIds) {
    const first = buildDailyQuestion(topicId, "2026-08-16");
    const repeated = buildDailyQuestion(topicId, "2026-08-16");

    assert.deepEqual(repeated, first);
    assert.equal(first.topicId, topicId);
    assert.match(first.id, /^2026-08-16:/);
    assert.ok(first.prompt.length > 10);
    assert.ok(first.explanation.length > 10);
    assert.ok(first.options.length >= 3);
    assert.equal(new Set(first.options).size, first.options.length);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < first.options.length);
  }
});

test("rotates question content across study dates", () => {
  for (const topicId of dailyQuestionTopicIds) {
    const variants = new Set(
      ["16", "17", "18", "19", "20", "21", "22"].map((day) => {
        const question = buildDailyQuestion(topicId, `2026-08-${day}`);
        return JSON.stringify([question.prompt, question.options]);
      }),
    );

    assert.ok(variants.size >= 2, `${topicId} should vary during the week`);
  }
});

test("rejects topics without an approved generator", () => {
  assert.throws(() => buildDailyQuestion("unknown-topic", "2026-08-16"), /No daily question generator/);
});
