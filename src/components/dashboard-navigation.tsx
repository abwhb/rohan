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
import { cn } from "@/src/lib/ui";
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
    <aside className="sticky top-0 z-20 grid h-auto grid-cols-[auto_minmax(0,1fr)] overflow-visible bg-study-sidebar px-3.5 py-2.5 text-[#e9f0ed] min-[721px]:z-auto min-[721px]:flex min-[721px]:h-screen min-[721px]:flex-col min-[721px]:items-center min-[721px]:overflow-y-auto min-[721px]:px-[13px] min-[721px]:pb-[18px] min-[721px]:pt-6 min-[961px]:items-stretch min-[961px]:px-[22px] min-[961px]:pb-[22px] min-[961px]:pt-[30px]">
      <div className="flex items-center gap-[13px] border-0 pr-3 min-[721px]:border-b min-[721px]:border-white/10 min-[721px]:px-0 min-[721px]:pb-[29px]">
        <div className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-study-lime text-base font-[850] text-study-sidebar shadow-[inset_0_-3px_0_rgba(23,44,50,0.14)] min-[721px]:size-[42px] min-[721px]:rounded-[14px] min-[721px]:text-xl" aria-hidden="true">
          R
        </div>
        <div className="hidden min-[961px]:block">
          <strong className="block text-[17px] tracking-[-0.01em]">Rohan</strong>
          <span className="-mt-px block text-xs text-[#9cb0ae]">Study system</span>
        </div>
      </div>

      <nav className="no-scrollbar flex min-w-0 gap-1 overflow-x-auto min-[721px]:grid min-[721px]:w-full min-[721px]:gap-[7px] min-[721px]:overflow-visible min-[721px]:pt-[27px]" aria-label="Study dashboard">
        <span className="mx-2.5 mb-2 hidden text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#829996] min-[961px]:block">Workspace</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const accent = item.id === "overview" ? undefined : subjectById[item.id].accent;

          return (
            <button
              aria-current={activeView === item.id ? "page" : undefined}
              aria-label={item.label}
              className={cn(
                "[--nav-accent:var(--color-study-lime)] flex w-auto shrink-0 cursor-pointer items-center gap-3 rounded-[13px] border-0 bg-transparent px-[11px] py-2.5 text-left text-[#b8c7c4] transition hover:translate-x-0.5 hover:bg-white/[0.055] hover:text-white min-[721px]:w-full min-[721px]:justify-center min-[721px]:p-[13px] min-[961px]:justify-start min-[961px]:px-[13px] min-[961px]:py-3",
                activeView === item.id &&
                  "bg-study-sidebar-soft text-white shadow-[inset_0_-3px_0_var(--nav-accent)] min-[721px]:shadow-[inset_3px_0_0_var(--nav-accent)] [&_svg]:text-[var(--nav-accent)]",
              )}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
              style={accent ? ({ "--nav-accent": accent } as React.CSSProperties) : undefined}
            >
              <Icon aria-hidden="true" size={19} strokeWidth={1.9} />
              <span className="hidden text-[13px] font-bold min-[961px]:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-[34px] hidden gap-2 min-[961px]:grid">
        <span className="mx-2.5 mb-2 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#829996]">Coming next</span>
        <div className="flex items-center gap-2.5 rounded-[13px] border border-white/[0.07] px-3 py-2.5 text-[#91a7a4]">
          <Headphones aria-hidden="true" size={18} />
          <div>
            <strong className="block text-[11px] text-[#cedbd8]">Voice lessons</strong>
            <span className="block text-[9px]">Urdu audio enabled</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-[13px] border border-white/[0.07] px-3 py-2.5 text-[#91a7a4]">
          <BookOpenText aria-hidden="true" size={18} />
          <div>
            <strong className="block text-[11px] text-[#cedbd8]">Question packs</strong>
            <span className="block text-[9px]">Adaptive daily work</span>
          </div>
        </div>
      </div>

      <div className="mt-auto hidden grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-[18px] border border-white/[0.08] bg-[#223c42] p-4 text-[#e8f0ed] min-[961px]:grid">
        <div className="grid size-[34px] place-items-center rounded-[11px] bg-study-lime text-study-sidebar">
          <Settings2 aria-hidden="true" size={18} />
        </div>
        <div>
          <span className="block text-[9px] uppercase text-[#92aaa6]">First exam</span>
          <strong className="block text-[11px]">Pure 1 · 30 Sep</strong>
        </div>
        <b className="self-end text-[23px] leading-none">45</b>
        <small className="col-start-3 -mt-[9px] text-center text-[8px] uppercase text-[#91a7a4]">days</small>
      </div>
    </aside>
  );
}
