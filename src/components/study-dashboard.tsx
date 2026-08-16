"use client";

import { useState } from "react";
import { Bell, CalendarDays, X } from "lucide-react";

import { DashboardNavigation, type DashboardView } from "@/src/components/dashboard-navigation";
import { OverviewView } from "@/src/components/overview-view";
import { SubjectView } from "@/src/components/subject-view";
import { TopicWorkspace } from "@/src/components/topic-workspace";
import { subjectById, topicById } from "@/src/data/curriculum";
import { useStudyProgress } from "@/src/hooks/use-study-progress";
import type { StudyTopic, SubjectId } from "@/src/types/study";

export function StudyDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const {
    state,
    getProgress,
    toggleObjective,
    toggleWork,
    saveScore,
    completeResource,
    recordLessonAttempt,
    logSession,
  } = useStudyProgress();

  const selectedTopic = selectedTopicId ? topicById[selectedTopicId] : null;

  function navigate(view: DashboardView) {
    setActiveView(view);
    setSelectedTopicId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openSubject(subjectId: SubjectId) {
    navigate(subjectId);
  }

  function openTopic(topic: StudyTopic) {
    setActiveView(topic.subjectId);
    setSelectedTopicId(topic.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeTopic() {
    setSelectedTopicId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen min-[721px]:grid min-[721px]:grid-cols-[88px_minmax(0,1fr)] min-[961px]:grid-cols-[266px_minmax(0,1fr)]">
      <DashboardNavigation activeView={activeView} onNavigate={navigate} />

      <main className="min-w-0">
        <header className="static z-10 flex min-h-[58px] items-center justify-between border-b border-[#c9d3cf]/70 bg-study-canvas/90 px-[18px] py-2.5 backdrop-blur-[18px] min-[721px]:sticky min-[721px]:top-0 min-[721px]:min-h-[76px] min-[721px]:px-[clamp(24px,4vw,58px)] min-[721px]:py-3.5">
          <div className="flex items-center gap-[9px] text-xs text-study-muted">
            <CalendarDays aria-hidden="true" size={17} />
            <span className="hidden min-[721px]:inline">Sunday, 16 August</span>
            <b className="rounded-full bg-[#e4e9e4] px-[9px] py-1.5 text-[10px] text-[#49625f] min-[721px]:ml-2">45 days to Pure 1</b>
          </div>
          <div className="flex items-center gap-2.5">
            <button aria-label="Notifications" className="relative grid size-[38px] cursor-pointer place-items-center rounded-xl border border-study-line bg-white" type="button">
              <Bell aria-hidden="true" size={18} />
              <span className="absolute right-2 top-2 size-1.5 rounded-full border border-white bg-[#e17a49]" />
            </button>
            <div className="ml-1 grid size-[39px] place-items-center rounded-[13px] bg-[#3f766f] text-[11px] font-extrabold text-white" aria-hidden="true">RS</div>
            <div className="hidden min-[721px]:block"><strong className="block text-xs">Rohan</strong><span className="block text-[9px] text-study-muted">AS student</span></div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1480px] px-[18px] pb-[55px] pt-[22px] min-[721px]:px-[clamp(24px,4vw,58px)] min-[721px]:pb-[70px] min-[721px]:pt-[34px]">
          {selectedTopic ? (
            <TopicWorkspace
              key={selectedTopic.id}
              onBack={closeTopic}
              onSaveScore={(score) => {
                saveScore(selectedTopic.id, score);
                setNotice(`${selectedTopic.title} score saved. Your mastery has been recalculated.`);
              }}
              onCompleteResource={(resourceId) => {
                completeResource(selectedTopic.id, resourceId);
                setNotice("Video recall completed. Now use the follow-up task to turn watching into marks.");
              }}
              onLessonAttempt={(lessonId, isCorrect) => {
                recordLessonAttempt(selectedTopic.id, lessonId, isCorrect);
                setNotice(isCorrect ? "Urdu quick check correct — evidence saved." : "Attempt saved. Review the steps and try again.");
              }}
              onLogSession={(session) => {
                logSession(session);
                setNotice(`${session.focusedMinutes} focused minutes saved for ${selectedTopic.title}.`);
              }}
              onToggleObjective={(objective) => toggleObjective(selectedTopic.id, objective)}
              onToggleWork={(workId) => toggleWork(selectedTopic.id, workId)}
              onVoiceRequested={() =>
                setNotice(
                  `The ${selectedTopic.title} voice lesson is mapped. In-dashboard playback will connect through the secure server route next.`,
                )
              }
              progress={getProgress(selectedTopic.id)}
              subject={subjectById[selectedTopic.subjectId]}
              topic={selectedTopic}
            />
          ) : activeView === "overview" ? (
            <OverviewView
              getProgress={getProgress}
              onOpenSubject={openSubject}
              onOpenTopic={openTopic}
              sessions={state.sessions}
            />
          ) : (
            <SubjectView
              getProgress={getProgress}
              onOpenTopic={openTopic}
              subject={subjectById[activeView]}
            />
          )}
        </div>
      </main>

      {notice ? (
        <div className="fixed bottom-[18px] left-[18px] right-[18px] z-50 flex items-center gap-3.5 rounded-[14px] border border-white/10 bg-[#1b3437] py-3.5 pl-[17px] pr-[15px] text-[10px] text-[#eff7f4] shadow-[0_18px_50px_rgba(20,42,43,0.25)] min-[721px]:bottom-6 min-[721px]:left-auto min-[721px]:right-6 min-[721px]:max-w-[min(440px,calc(100vw-40px))]" role="status">
          <span>{notice}</span>
          <button aria-label="Dismiss message" className="grid size-[26px] shrink-0 cursor-pointer place-items-center rounded-lg border-0 bg-white/[0.08] text-[#c8d7d3]" onClick={() => setNotice(null)} type="button"><X size={16} /></button>
        </div>
      ) : null}
    </div>
  );
}
