"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Headphones, Pause, Play, Square } from "lucide-react";

import { cn, ui } from "@/src/lib/ui";
import type { UrduLesson } from "@/src/types/study";

interface UrduVoiceCoachProps {
  completed: boolean;
  lesson: UrduLesson;
  onComplete: () => void;
}

type PlaybackState = "idle" | "playing" | "paused" | "unsupported";

export function UrduVoiceCoach({ completed, lesson, onComplete }: UrduVoiceCoachProps) {
  const [playback, setPlayback] = useState<PlaybackState>("idle");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setPlayback("unsupported");
      return;
    }

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    };
  }, []);

  function speak(mode: "summary" | "steps") {
    if (playback === "unsupported") return;

    window.speechSynthesis.cancel();
    const text = mode === "summary"
      ? `${lesson.title}۔ ${lesson.summary}`
      : `${lesson.title}۔ ${lesson.steps.map((step) => `${step.title}۔ ${step.body}`).join("۔ ")}۔ اب سوال خود حل کرو۔ ${lesson.check.prompt}`;
    const utterance = new SpeechSynthesisUtterance(text);
    const urduVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("ur"));
    const pakistanVoice = voices.find((voice) => voice.lang.toLowerCase().includes("pk"));

    utterance.voice = urduVoice ?? pakistanVoice ?? null;
    utterance.lang = urduVoice?.lang ?? pakistanVoice?.lang ?? "ur-PK";
    utterance.rate = 0.82;
    utterance.pitch = 1;
    utterance.onend = () => {
      setPlayback("idle");
      utteranceRef.current = null;
      onComplete();
    };
    utterance.onerror = () => {
      setPlayback("idle");
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    setPlayback("playing");
    window.speechSynthesis.speak(utterance);
  }

  function togglePause() {
    if (playback === "playing") {
      window.speechSynthesis.pause();
      setPlayback("paused");
      return;
    }

    if (playback === "paused") {
      window.speechSynthesis.resume();
      setPlayback("playing");
    }
  }

  function stop() {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setPlayback("idle");
  }

  return (
    <section className="grid grid-cols-[auto_1fr] gap-[13px] rounded-[22px] bg-[#213e3b] p-[21px] text-[#f5faf8] shadow-[0_18px_45px_rgba(34,55,56,0.08)] min-[721px]:max-[960px]:col-span-full" aria-label="Urdu audio coach">
      <span className="grid size-[42px] place-items-center rounded-[13px] bg-study-lime text-[#1e3936]"><Headphones aria-hidden="true" size={21} /></span>
      <div>
        <span className={cn(ui.eyebrow, "text-study-lime")}>Urdu audio coach</span>
        <h2 className="mt-1 text-[17px] font-bold leading-[1.2] tracking-[-0.03em]">Listen, pause, then solve</h2>
        <p className="mt-[7px] text-[9px] text-[#adc1bc]">Uses the device&apos;s Urdu-capable voice. Playback stays on this device and needs no API key.</p>
      </div>

      {playback === "unsupported" ? (
        <p className="col-span-full rounded-[11px] bg-white/[0.07] p-3 text-[9px] text-[#c7d8d3]">Audio speech is not supported in this browser. The complete interactive Urdu text lesson remains available above.</p>
      ) : (
        <div className="col-span-full mt-1 grid gap-2">
          {playback === "idle" ? (
            <div className="grid gap-2 min-[520px]:grid-cols-2">
              <button className="flex w-full cursor-pointer items-center justify-between rounded-[11px] border border-white/10 bg-white/[0.07] px-3 py-2.5 text-[10px] font-[850] text-[#eff7f4]" onClick={() => speak("summary")} type="button">
                Play summary <Play aria-hidden="true" size={16} />
              </button>
              <button className="flex w-full cursor-pointer items-center justify-between rounded-[11px] border-0 bg-study-lime px-3 py-2.5 text-[10px] font-[850] text-[#213e3b]" onClick={() => speak("steps")} type="button">
                Play worked steps <Play aria-hidden="true" size={16} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[11px] border-0 bg-study-lime px-3 py-2.5 text-[10px] font-[850] text-[#213e3b]" onClick={togglePause} type="button">
                {playback === "paused" ? <Play aria-hidden="true" size={16} /> : <Pause aria-hidden="true" size={16} />}
                {playback === "paused" ? "Resume" : "Pause"}
              </button>
              <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[11px] border border-white/10 bg-white/[0.07] px-3 py-2.5 text-[10px] font-[850] text-[#eff7f4]" onClick={stop} type="button">
                <Square aria-hidden="true" size={14} /> Stop
              </button>
            </div>
          )}
          {completed ? <small className="flex items-center justify-center gap-1.5 text-[8px] text-[#bcd28b]"><Check aria-hidden="true" size={13} /> Audio lesson completed</small> : null}
        </div>
      )}
    </section>
  );
}
