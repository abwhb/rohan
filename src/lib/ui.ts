import type { TopicStatus } from "@/src/types/study";

type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

export const ui = {
  eyebrow:
    "block text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#6f827f]",
  panel:
    "rounded-[26px] border border-[#dae2de]/80 bg-white shadow-[0_10px_34px_rgba(43,62,63,0.05)]",
  panelPadding: "p-5 min-[721px]:p-6",
  sectionHeading: "mb-5 flex items-start justify-between gap-5",
  sectionTitle: "mt-1 text-xl font-bold leading-[1.2] tracking-[-0.03em]",
  subtleBadge:
    "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#f0f3ef] px-2.5 py-1.5 text-[9px] font-extrabold text-[#59706d]",
  progressTrack: "h-1.5 overflow-hidden rounded-full bg-[#e8ece9]",
  primaryButton:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-study-lime px-[18px] py-[13px] text-xs font-extrabold text-[#20322f] shadow-[0_8px_20px_rgba(16,37,34,0.24)] transition hover:-translate-y-px",
  secondaryButton:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-[#244340] px-3.5 py-[11px] text-[10px] font-extrabold text-white transition hover:-translate-y-px",
} as const;

const statusColours: Record<TopicStatus, string> = {
  "not-started": "bg-[#eef1ef] text-[#788682]",
  learning: "bg-[#fff0d5] text-[#8b6428]",
  "exam-practice": "bg-[#e5ebfb] text-[#475f95]",
  mastered: "bg-[#ddf2ec] text-[#2c7169]",
};

export function statusPillClass(status: TopicStatus) {
  return cn(
    "inline-flex w-fit items-center rounded-full px-2 py-1 text-[8px] font-extrabold tracking-[0.02em]",
    statusColours[status],
  );
}
