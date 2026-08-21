import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("every curriculum topic has guided learning content", async () => {
  const [curriculum, learningContent] = await Promise.all([
    readFile(new URL("../src/data/curriculum.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/data/topic-learning-content.ts", import.meta.url), "utf8"),
  ]);

  const curriculumIds = [...curriculum.matchAll(/^    "((?:p1|m|b)-[a-z0-9-]+)",$/gm)].map((match) => match[1]);
  const contentIds = [...learningContent.matchAll(/^  "((?:p1|m|b)-[a-z0-9-]+)": \{$/gm)].map((match) => match[1]);

  assert.equal(curriculumIds.length, 18);
  assert.deepEqual(new Set(contentIds), new Set(curriculumIds));
});
