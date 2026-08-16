"use client";

import { useState } from "react";
import { CalendarDays, X } from "lucide-react";

import { DashboardNavigation, type DashboardView } from "@/src/components/dashboard-navigation";
import { CloudSyncControl } from "@/src/components/cloud-sync-control";
import { OverviewView } from "@/src/components/overview-view";
import { NotificationCenter } from "@/src/components/notification-center";
import { SubjectView } from "@/src/components/subject-view";
import { TopicWorkspace } from "@/src/components/topic-workspace";
import { subjectById, topicById } from "@/src/data/curriculum";
import { useStudyProgress } from "@/src/hooks/use-study-progress";
import type { CloudRole, StudyTopic, SubjectId } from "@/src/types/study";

export function StudyDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cloudRole, setCloudRole] = useState<CloudRole | null>(null);
  const {
    state,
    getProgress,
    toggleObjective,
    toggleWork,
    saveScore,
    completeResource,
    recordLessonAttempt,
    recordQuestionAttempt,
    logSession,
    replaceState,
  } = useStudyProgress();

  const selectedTopic = selectedTopicId ? topicById[selectedTopicId] : null;
  const teacherReadOnlyMessage = "Teacher cloud view is read-only. Rohan's saved record was not changed.";

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
            <CloudSyncControl onRoleChange={setCloudRole} replaceState={replaceState} state={state} />
            <NotificationCenter cloudRole={cloudRole} getProgress={getProgress} onOpenTopic={openTopic} sessions={state.sessions} />
            <div className="ml-1 grid size-[39px] place-items-center rounded-[13px] bg-[#3f766f] text-[11px] font-extrabold text-white" aria-hidden="true">{cloudRole === "teacher" ? "TR" : "RS"}</div>
            <div className="hidden min-[721px]:block"><strong className="block text-xs">{cloudRole === "teacher" ? "Teacher" : "Rohan"}</strong><span className="block text-[9px] text-study-muted">{cloudRole === "teacher" ? "Read-only view" : "AS student"}</span></div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1480px] px-[18px] pb-[55px] pt-[22px] min-[721px]:px-[clamp(24px,4vw,58px)] min-[721px]:pb-[70px] min-[721px]:pt-[34px]">
          {selectedTopic ? (
            <TopicWorkspace
              key={selectedTopic.id}
              onBack={closeTopic}
              onSaveScore={(score) => {
                if (cloudRole === "teacher") return setNotice(teacherReadOnlyMessage);
                saveScore(selectedTopic.id, score);
                setNotice(`${selectedTopic.title} score saved. Your mastery has been recalculated.`);
              }}
              onCompleteResource={(resourceId) => {
                if (cloudRole === "teacher") return setNotice(teacherReadOnlyMessage);
                completeResource(selectedTopic.id, resourceId);
                setNotice("Learning resource completed. Now use retrieval or exam practice to turn it into marks.");
              }}
              onLessonAttempt={(lessonId, isCorrect) => {
                if (cloudRole === "teacher") return setNotice(teacherReadOnlyMessage);
                recordLessonAttempt(selectedTopic.id, lessonId, isCorrect);
                setNotice(isCorrect ? "Urdu quick check correct — evidence saved." : "Attempt saved. Review the steps and try again.");
              }}
              onLogSession={(session) => {
                if (cloudRole === "teacher") return setNotice(teacherReadOnlyMessage);
                logSession(session);
                setNotice(`${session.focusedMinutes} focused minutes saved for ${selectedTopic.title}.`);
              }}
              onToggleObjective={(objective) => {
                if (cloudRole === "teacher") return setNotice(teacherReadOnlyMessage);
                toggleObjective(selectedTopic.id, objective);
              }}
              onToggleWork={(workId) => {
                if (cloudRole === "teacher") return setNotice(teacherReadOnlyMessage);
                toggleWork(selectedTopic.id, workId);
              }}
              progress={getProgress(selectedTopic.id)}
              subject={subjectById[selectedTopic.subjectId]}
              topic={selectedTopic}
            />
          ) : activeView === "overview" ? (
            <OverviewView
              cloudRole={cloudRole}
              getProgress={getProgress}
              onQuestionAttempt={(topicId, questionId, isCorrect) => {
                if (cloudRole === "teacher") return setNotice(teacherReadOnlyMessage);
                recordQuestionAttempt(topicId, questionId, isCorrect);
                setNotice(isCorrect ? "Retrieval answer correct — evidence saved." : "Attempt saved. This topic will move up future retrieval packs.");
              }}
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
