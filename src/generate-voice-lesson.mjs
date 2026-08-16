import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import { GoogleGenAI } from "@google/genai";
import wav from "wav";

const DEFAULT_TEXT_MODEL = "gemini-3.6-flash";
const DEFAULT_TTS_MODEL = "gemini-3.1-flash-tts-preview";
const DEFAULT_VOICE = "Kore";

export function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }

    if (!token.startsWith("--")) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const key = token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${token}`);
    }

    parsed[key] = value;
    index += 1;
  }

  return parsed;
}

export function slugify(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "lesson";
}

export function normalizeSpec(input) {
  const minutes = Number(input.minutes ?? 7);

  if (!input.subject?.trim()) throw new Error("Lesson subject is required.");
  if (!input.paper?.trim()) throw new Error("Lesson paper is required.");
  if (!input.topic?.trim()) throw new Error("Lesson topic is required.");
  if (!Number.isFinite(minutes) || minutes < 2 || minutes > 20) {
    throw new Error("Lesson duration must be between 2 and 20 minutes.");
  }

  return {
    learner: input.learner?.trim() || "Rohan",
    subject: input.subject.trim(),
    paper: input.paper.trim(),
    topic: input.topic.trim(),
    minutes,
    objectives: Array.isArray(input.objectives) ? input.objectives.filter(Boolean) : [],
    priorMistakes: Array.isArray(input.priorMistakes) ? input.priorMistakes.filter(Boolean) : [],
    teacherNotes: input.teacherNotes?.trim() || "",
  };
}

function bullets(items, fallback) {
  if (!items.length) return `- ${fallback}`;
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildLessonPrompt(spec) {
  const targetWords = Math.round(spec.minutes * 125);

  return `You are ${spec.learner}'s precise and encouraging Cambridge AS tutor.

Create a spoken lesson transcript for:
- Subject: ${spec.subject}
- Paper: ${spec.paper}
- Topic: ${spec.topic}
- Target duration: ${spec.minutes} minutes, approximately ${targetWords} words

Learning objectives:
${bullets(spec.objectives, "Teach the named topic accurately and connect it to exam questions.")}

Known mistakes to prevent:
${bullets(spec.priorMistakes, "Identify the two most likely exam mistakes for this topic.")}

Teacher notes:
${spec.teacherNotes || "Use British English and Cambridge terminology."}

Required lesson sequence:
1. State today's goal and why it earns marks.
2. Ask two brief retrieval questions. Tell the learner to pause before giving each answer.
3. Explain the core idea in small, connected steps.
4. Work through one original Cambridge-style example aloud, verbalising every important step.
5. Give one near-transfer question. Tell the learner to pause and attempt it before the solution.
6. Explain the common mistakes and a quick self-check.
7. End with a three-question exit quiz, pauses, concise answers, and one clear next action.

Use original examples rather than reproducing copyrighted past-paper questions. Do not claim that a question came from a real paper. Output only natural spoken text: no Markdown, tables, URLs, citations, or production notes. Use short sentences and say mathematical notation in a way that is clear when heard.`;
}

export function buildSpeechPrompt(transcript, spec) {
  return `Speak as a warm, calm, precise Cambridge AS tutor addressing ${spec.learner}. Use a clear teaching pace, natural emphasis, and brief pauses after questions. Be encouraging without sounding childish. Read the following lesson faithfully:\n\n${transcript}`;
}

async function readSpec(args) {
  if (args.spec) {
    const raw = await fs.readFile(path.resolve(args.spec), "utf8");
    return normalizeSpec(JSON.parse(raw));
  }

  return normalizeSpec({
    learner: args.learner,
    subject: args.subject,
    paper: args.paper,
    topic: args.topic,
    minutes: args.minutes,
    objectives: args.objective ? [args.objective] : [],
    priorMistakes: args.priorMistake ? [args.priorMistake] : [],
    teacherNotes: args.teacherNotes,
  });
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function safeErrorMessage(error, secret) {
  const message = error instanceof Error ? error.message : String(error);
  return secret ? message.split(secret).join("[REDACTED]") : message;
}

async function saveWaveFile(filename, pcmData, channels = 1, rate = 24000, sampleWidth = 2) {
  await new Promise((resolve, reject) => {
    const writer = new wav.FileWriter(filename, {
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    writer.on("finish", resolve);
    writer.on("error", reject);
    writer.write(pcmData);
    writer.end();
  });
}

function extractText(interaction) {
  return interaction.output_text ?? interaction.outputText;
}

function extractAudioData(interaction) {
  return interaction.output_audio?.data ?? interaction.outputAudio?.data;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const spec = await readSpec(args);
  const lessonPrompt = buildLessonPrompt(spec);

  if (args.dryRun) {
    console.log("Voice lesson specification is valid. No Gemini request was made.\n");
    console.log(lessonPrompt);
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "replace_with_a_new_rotated_key") {
    throw new Error("Set a newly rotated GEMINI_API_KEY in .env before generating audio.");
  }

  const textModel = process.env.GEMINI_TEXT_MODEL || DEFAULT_TEXT_MODEL;
  const ttsModel = process.env.GEMINI_TTS_MODEL || DEFAULT_TTS_MODEL;
  const voice = args.voice || process.env.GEMINI_VOICE || DEFAULT_VOICE;
  const client = new GoogleGenAI({ apiKey });

  try {
    const transcriptInteraction = await client.interactions.create({
      model: textModel,
      input: lessonPrompt,
    });
    const transcript = extractText(transcriptInteraction)?.trim();
    if (!transcript) throw new Error("Gemini returned an empty lesson transcript.");

    const ttsInteraction = await client.interactions.create({
      model: ttsModel,
      input: buildSpeechPrompt(transcript, spec),
      response_format: { type: "audio" },
      generation_config: {
        speech_config: [{ voice }],
      },
    });
    const audioData = extractAudioData(ttsInteraction);
    if (!audioData) throw new Error("Gemini returned no audio data.");

    const lessonId = `${timestamp()}-${slugify(spec.topic)}`;
    const outputRoot = path.resolve(args.output || "lessons/generated");
    const lessonDir = path.join(outputRoot, lessonId);
    await fs.mkdir(lessonDir, { recursive: true });

    const transcriptPath = path.join(lessonDir, "transcript.txt");
    const audioPath = path.join(lessonDir, "lesson.wav");
    const metadataPath = path.join(lessonDir, "metadata.json");

    await fs.writeFile(transcriptPath, `${transcript}\n`, "utf8");
    await saveWaveFile(audioPath, Buffer.from(audioData, "base64"));
    await fs.writeFile(
      metadataPath,
      `${JSON.stringify({ ...spec, textModel, ttsModel, voice, generatedAt: new Date().toISOString() }, null, 2)}\n`,
      "utf8",
    );

    console.log(`Generated voice lesson: ${lessonDir}`);
    console.log(`Audio: ${audioPath}`);
    console.log(`Transcript: ${transcriptPath}`);
  } catch (error) {
    throw new Error(safeErrorMessage(error, apiKey));
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((error) => {
    console.error(`Voice lesson generation failed: ${safeErrorMessage(error, process.env.GEMINI_API_KEY)}`);
    process.exitCode = 1;
  });
}
