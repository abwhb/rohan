import { cn } from "@/src/lib/ui";

interface ProgressRingProps {
  value: number;
  accent: string;
  size?: "small" | "large";
  tone?: "light" | "dark";
}

export function ProgressRing({ value, accent, size = "small", tone = "light" }: ProgressRingProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full",
        size === "large" ? "size-28" : "size-[66px]",
      )}
      style={{ background: `conic-gradient(${accent} ${safeValue * 3.6}deg, rgba(132, 150, 146, 0.2) 0)` }}
      role="img"
      aria-label={`${safeValue}% mastery`}
    >
      <div
        className={cn(
          "grid size-[calc(100%-12px)] place-content-center rounded-full text-center",
          tone === "dark" ? "bg-[#2e514c] text-[#f7fbfa]" : "bg-white text-study-ink",
        )}
      >
        <strong className={cn("leading-none", size === "large" ? "text-[27px]" : "text-lg")}>{safeValue}%</strong>
        {size === "large" ? (
          <span
            className={cn(
              "mt-1 text-[8px] font-bold uppercase tracking-[0.09em]",
              tone === "dark" ? "text-[#a8bdb8]" : "text-[#778783]",
            )}
          >
            mastery
          </span>
        ) : null}
      </div>
    </div>
  );
}
