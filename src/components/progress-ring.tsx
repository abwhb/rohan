import type { CSSProperties } from "react";

interface ProgressRingProps {
  value: number;
  accent: string;
  size?: "small" | "large";
}

export function ProgressRing({ value, accent, size = "small" }: ProgressRingProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  const style = {
    "--ring-progress": `${safeValue * 3.6}deg`,
    "--ring-accent": accent,
  } as CSSProperties;

  return (
    <div
      className={`progress-ring progress-ring--${size}`}
      style={style}
      role="img"
      aria-label={`${safeValue}% mastery`}
    >
      <div className="progress-ring__centre">
        <strong>{safeValue}%</strong>
        {size === "large" ? <span>mastery</span> : null}
      </div>
    </div>
  );
}
