# Rohan AS Study System

A focused study system for Cambridge International AS Mathematics 9709 (Pure Mathematics 1 and Mechanics) and AS Business 9609.

The immediate goal is consistent, measurable study: 270 focused minutes per normal study day, active exam-question practice, rapid correction, and a visible mistake-review cycle.

The daily allocation is 100 minutes Pure Mathematics 1, 75 minutes Mechanics, and 95 minutes Business. Those targets include retrieval, teaching, exam practice, and correction; breaks are additional.

## Run the React dashboard

The student experience is a Next.js React dashboard styled with Tailwind CSS 4,
with all 18 top-level syllabus topics across Pure Mathematics 1, Mechanics, and
AS Business.

```bash
npm install
npm run dev
```

### Railway deployment

The production build uses Next.js standalone output. The post-build step copies
the compiled `.next/static` directory (and `public` when present) into the
standalone bundle so the generated server can serve its CSS, JavaScript, fonts,
and images. Railway injects `PORT`, and the standalone server reads it
automatically:

```bash
npm run build
npm start
```

Keep `GEMINI_API_KEY` in Railway's service variables. Never expose it through a
`NEXT_PUBLIC_` variable or commit it to the repository.

Open [http://localhost:3000](http://localhost:3000). The dashboard provides:

- complete subject and topic navigation;
- an adaptive daily queue that selects the weakest active topic in each subject;
- verified Khan Academy and Cambridge-focused learning resources with compulsory active follow-ups for all 18 topics;
- interactive Urdu explanations and saved quick-check attempts for every Math, Mechanics, and Business topic;
- in-dashboard Urdu audio summaries and worked-step playback using the learner's device voice, with pause, resume, stop, and completion evidence;
- a five-question daily retrieval pack that balances subjects and prioritises weak recall;
- deterministic date-based question variants for all 18 topics, so the daily pack changes without requiring an AI request;
- a focused-session log for minutes, questions, accuracy, mistake type, and a correction note;
- daily focused-minute totals, study streaks, recent activity, and a queue that updates after each saved session;
- objective-level topic checklists;
- topic-specific retrieval, teaching, exam-practice, and correction blocks;
- scored topic reviews and calculated mastery;
- bounded learning evidence from completed resources and Urdu checks, with exam practice and marked scores retaining most of the mastery weight;
- status filters for not started, learning, exam practice, and mastered;
- versioned local progress storage in the browser, including separate Urdu-lesson and daily-question evidence; and
- protected PostgreSQL cloud sync with separate student write access and teacher read-only access, while retaining and safely merging the device copy for offline use; and
- a protected teacher briefing with seven-day minutes, accuracy, active days, mistake patterns, and a weakest-topic intervention queue.

The interface follows the Next.js App Router architecture so Gemini audio can remain behind a secure server boundary when in-dashboard playback is connected.

## Use the Excel teacher companion

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
- Authentication and cross-device progress sync
- Interactive two-way voice tutoring with the Gemini Live API
- Email reminders, followed by an approved WhatsApp integration
