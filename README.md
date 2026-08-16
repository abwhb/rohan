# Rohan AS Study System

A focused study system for Cambridge International AS Mathematics 9709 (Pure Mathematics 1 and Mechanics) and AS Business 9609.

The immediate goal is consistent, measurable study: 270 focused minutes per normal study day, active exam-question practice, rapid correction, and a visible mistake-review cycle.

## Start with the Excel MVP

Open [Rohan Study Tracker](outputs/01a00a8d-4444-79b2-a191-e78d8bb1e883/rohan-study-tracker.xlsx).

1. Check the exam dates and daily target on the **Settings** sheet.
2. Use **Daily Plan** to see the day's phase and subject priorities.
3. Enter every focused session in **Study Log**.
4. Record every lost mark in **Mistake Log**, including a review date.
5. Use **Dashboard** to monitor time, completion, accuracy, and unresolved errors.

Videos count only when they are followed by recall and exam-question practice.

## Generate a Gemini voice lesson

The first version creates a lesson transcript with Gemini and then converts it into a 24 kHz WAV lesson using Gemini text-to-speech.

```bash
npm install
cp .env.example .env
```

Put a newly rotated key in `.env`; never reuse or commit a key that has appeared in a message or screenshot. Then run:

```bash
npm run voice-lesson -- --spec lesson-specs/day-01-math-p1-quadratics.json
```

Generated audio, transcript, and metadata are written under `lessons/generated/` and ignored by Git. To validate a lesson specification without sending an API request:

```bash
npm run voice-lesson -- --spec lesson-specs/day-01-math-p1-quadratics.json --dry-run
```

The defaults are configurable in `.env`. The implementation follows Google's current [Gemini text-to-speech documentation](https://ai.google.dev/gemini-api/docs/speech-generation) and uses the Interactions API rather than the older `generateContent` schema.

## Project documents

- [Research brief and 45-day plan](docs/research-and-45-day-plan.md)
- [Quick video resource queue](docs/quick-video-resources.md)

## Next application milestones

- Diagnostic-paper intake and objective-level scoring
- First seven adaptive daily question packs
- Teacher review and marking workflow
- Student web dashboard and authentication
- Interactive two-way voice tutoring with the Gemini Live API
- Email reminders, followed by an approved WhatsApp integration
