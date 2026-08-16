import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  Calculator,
  Headphones,
  Orbit,
  Settings2,
} from "lucide-react";

import { subjectById } from "@/src/data/curriculum";
import type { SubjectId } from "@/src/types/study";

export type DashboardView = "overview" | SubjectId;

interface DashboardNavigationProps {
  activeView: DashboardView;
  onNavigate: (view: DashboardView) => void;
}

const navItems = [
  { id: "overview" as const, label: "Overview", icon: BarChart3 },
  { id: "pure-1" as const, label: "Pure Mathematics 1", icon: Calculator },
  { id: "mechanics" as const, label: "Mechanics", icon: Orbit },
  { id: "business" as const, label: "AS Business", icon: BriefcaseBusiness },
];

export function DashboardNavigation({ activeView, onNavigate }: DashboardNavigationProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__mark" aria-hidden="true">
          R
        </div>
        <div>
          <strong>Rohan</strong>
          <span>Study system</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Study dashboard">
        <span className="sidebar__label">Workspace</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const accent = item.id === "overview" ? undefined : subjectById[item.id].accent;

          return (
            <button
              className={`nav-item ${activeView === item.id ? "nav-item--active" : ""}`}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
              style={accent ? ({ "--nav-accent": accent } as React.CSSProperties) : undefined}
            >
              <Icon aria-hidden="true" size={19} strokeWidth={1.9} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar__coming-next">
        <span className="sidebar__label">Coming next</span>
        <div className="mini-feature">
          <Headphones aria-hidden="true" size={18} />
          <div>
            <strong>Voice lessons</strong>
            <span>Gemini connection ready</span>
          </div>
        </div>
        <div className="mini-feature">
          <BookOpenText aria-hidden="true" size={18} />
          <div>
            <strong>Question packs</strong>
            <span>Adaptive daily work</span>
          </div>
        </div>
      </div>

      <div className="sidebar__exam-card">
        <div className="sidebar__exam-icon">
          <Settings2 aria-hidden="true" size={18} />
        </div>
        <div>
          <span>First exam</span>
          <strong>Pure 1 · 30 Sep</strong>
        </div>
        <b>45</b>
        <small>days</small>
      </div>
    </aside>
  );
}
