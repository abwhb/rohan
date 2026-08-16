"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Cloud, CloudOff, LoaderCircle, LogOut, RefreshCw, ShieldCheck, X } from "lucide-react";

import { mergeStudyStates, normaliseStudyState } from "@/src/lib/study-state";
import { cn, ui } from "@/src/lib/ui";
import type { StudyProgressState } from "@/src/types/study";

type StudyRole = "student" | "teacher";
type SyncStatus = "checking" | "device" | "idle" | "saving" | "saved" | "error";

interface CloudSyncControlProps {
  replaceState: (state: StudyProgressState) => void;
  state: StudyProgressState;
}

interface CloudResponse {
  state: StudyProgressState | null;
  revision: number;
  updatedAt: string | null;
  error?: string;
}

export function CloudSyncControl({ replaceState, state }: CloudSyncControlProps) {
  const [configured, setConfigured] = useState(false);
  const [role, setRole] = useState<StudyRole | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("checking");
  const [panelOpen, setPanelOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const stateRef = useRef(state);
  const revisionRef = useRef(0);
  const lastSyncedStateRef = useRef<string | null>(null);
  const initialisedRef = useRef(false);
  const savingRef = useRef(false);
  stateRef.current = state;

  const loadCloud = useCallback(async (activeRole: StudyRole) => {
    setSyncStatus("saving");
    setMessage(null);
    const response = await fetch("/api/progress", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not read cloud progress.");
    const cloud = await response.json() as CloudResponse;
    revisionRef.current = cloud.revision;
    setLastSyncedAt(cloud.updatedAt);

    if (cloud.state) {
      const normalised = normaliseStudyState(cloud.state);
      const nextState = activeRole === "student"
        ? mergeStudyStates(stateRef.current, normalised)
        : normalised;
      lastSyncedStateRef.current = JSON.stringify(normalised);
      initialisedRef.current = true;
      replaceState(nextState);
      setSyncStatus(JSON.stringify(nextState) === lastSyncedStateRef.current ? "saved" : "saving");
      return;
    }

    if (activeRole === "teacher") {
      lastSyncedStateRef.current = JSON.stringify(stateRef.current);
      initialisedRef.current = true;
      setSyncStatus("saved");
      return;
    }

    const initialState = stateRef.current;
    const createResponse = await fetch("/api/progress", {
      body: JSON.stringify({ state: initialState, baseRevision: 0 }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    if (!createResponse.ok) throw new Error("Could not create cloud progress.");
    const created = await createResponse.json() as { revision: number; updatedAt: string };
    revisionRef.current = created.revision;
    lastSyncedStateRef.current = JSON.stringify(initialState);
    initialisedRef.current = true;
    setLastSyncedAt(created.updatedAt);
    setSyncStatus("saved");
  }, [replaceState]);

  useEffect(() => {
    let cancelled = false;

    async function checkStatus() {
      try {
        const response = await fetch("/api/auth/status", { cache: "no-store" });
        if (!response.ok) throw new Error("Cloud status unavailable.");
        const status = await response.json() as { configured: boolean; role: StudyRole | null };
        if (cancelled) return;
        setConfigured(status.configured);
        setRole(status.role);
        if (!status.configured) {
          setSyncStatus("device");
          return;
        }
        if (!status.role) {
          setSyncStatus("idle");
          return;
        }
        await loadCloud(status.role);
      } catch {
        if (!cancelled) {
          setSyncStatus("error");
          setMessage("Cloud tracking is temporarily unavailable. Device progress is still safe.");
        }
      }
    }

    void checkStatus();
    return () => { cancelled = true; };
  }, [loadCloud]);

  useEffect(() => {
    if (role !== "student" || !initialisedRef.current) return;
    const serialised = JSON.stringify(state);
    if (serialised === lastSyncedStateRef.current) return;

    setSyncStatus("saving");
    const timeout = window.setTimeout(async () => {
      if (savingRef.current) return;
      savingRef.current = true;
      try {
        const response = await fetch("/api/progress", {
          body: JSON.stringify({ state, baseRevision: revisionRef.current }),
          headers: { "Content-Type": "application/json" },
          method: "PUT",
        });
        const result = await response.json() as CloudResponse;
        if (response.status === 409 && result.state) {
          const currentCloud = normaliseStudyState(result.state);
          const merged = mergeStudyStates(stateRef.current, currentCloud);
          revisionRef.current = result.revision;
          lastSyncedStateRef.current = JSON.stringify(currentCloud);
          replaceState(merged);
          setMessage("A newer device update was merged. No stale data was written.");
          setSyncStatus(JSON.stringify(merged) === lastSyncedStateRef.current ? "saved" : "saving");
          return;
        }
        if (!response.ok) throw new Error(result.error || "Cloud save failed.");
        revisionRef.current = result.revision;
        lastSyncedStateRef.current = serialised;
        setLastSyncedAt(result.updatedAt);
        setSyncStatus("saved");
        setMessage(null);
      } catch {
        setSyncStatus("error");
        setMessage("Cloud save failed. Progress remains safe on this device and will retry after the next change.");
      } finally {
        savingRef.current = false;
      }
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [replaceState, role, state]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setSyncStatus("saving");
    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({ code: accessCode }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = await response.json() as { role?: StudyRole; error?: string };
      if (!response.ok || !result.role) throw new Error(result.error || "Login failed.");
      setAccessCode("");
      setRole(result.role);
      await loadCloud(result.role);
      setPanelOpen(false);
    } catch (error) {
      setSyncStatus("error");
      setMessage(error instanceof Error ? error.message : "Login failed.");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    initialisedRef.current = false;
    lastSyncedStateRef.current = null;
    revisionRef.current = 0;
    setRole(null);
    setSyncStatus("idle");
    setPanelOpen(false);
    setMessage("Cloud disconnected. This device copy remains available.");
  }

  const label = !configured
    ? "Device only"
    : role === "teacher"
      ? "Teacher view"
      : role === "student"
        ? syncStatus === "saving" ? "Saving…" : "Cloud saved"
        : "Connect cloud";

  return (
    <>
      <button
        aria-label={`${label}. Open cloud tracking controls`}
        className="inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-study-line bg-white px-3 text-[9px] font-extrabold text-[#49625f]"
        onClick={() => setPanelOpen(true)}
        type="button"
      >
        {syncStatus === "checking" || syncStatus === "saving" ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" size={15} />
        ) : configured && role ? (
          <Cloud aria-hidden="true" size={15} />
        ) : (
          <CloudOff aria-hidden="true" size={15} />
        )}
        <span className="hidden min-[520px]:inline">{label}</span>
      </button>

      {panelOpen ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[#102326]/45 p-4 backdrop-blur-sm" role="presentation">
          <section aria-label="Cloud tracking" aria-modal="true" className="w-full max-w-[420px] rounded-[22px] border border-white/80 bg-white p-6 shadow-[0_28px_80px_rgba(20,42,43,0.28)]" role="dialog">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={ui.eyebrow}>Protected tracking</span>
                <h2 className={cn(ui.sectionTitle, "mt-1 text-[22px]")}>Student and teacher cloud</h2>
              </div>
              <button aria-label="Close cloud controls" className="grid size-8 place-items-center rounded-lg border border-study-line bg-white" onClick={() => setPanelOpen(false)} type="button"><X size={16} /></button>
            </div>

            {!configured ? (
              <div className="mt-5 rounded-[14px] bg-[#f5f7f4] p-4 text-[10px] leading-relaxed text-study-muted">
                Cloud variables are not configured in this environment. All progress continues to save on this device.
              </div>
            ) : role ? (
              <div className="mt-5">
                <div className="flex items-center gap-3 rounded-[14px] bg-[#edf6f3] p-4 text-[#315f59]">
                  <span className="grid size-10 place-items-center rounded-xl bg-white"><ShieldCheck aria-hidden="true" size={20} /></span>
                  <div><strong className="block text-[11px] capitalize">{role} access</strong><span className="text-[9px]">{role === "teacher" ? "Read-only cloud view" : "Automatic revision-checked sync"}</span></div>
                </div>
                <p className="mt-3 text-[9px] text-study-muted">{lastSyncedAt ? `Last cloud update: ${new Date(lastSyncedAt).toLocaleString()}` : "Cloud record is ready."}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className={ui.secondaryButton} onClick={() => void loadCloud(role)} type="button"><RefreshCw aria-hidden="true" size={15} /> Refresh</button>
                  <button className={ui.secondaryButton} onClick={() => void logout()} type="button"><LogOut aria-hidden="true" size={15} /> Disconnect</button>
                </div>
              </div>
            ) : (
              <form className="mt-5" onSubmit={login}>
                <p className="text-[10px] leading-relaxed text-study-muted">Use Rohan&apos;s student code for automatic saving, or the teacher code for a protected read-only view.</p>
                <label className="mt-4 grid gap-1.5 text-[9px] font-bold text-[#60736f]">
                  Access code
                  <input
                    autoComplete="current-password"
                    className="min-h-11 rounded-[11px] border border-study-line px-3 text-[11px]"
                    minLength={8}
                    onChange={(event) => setAccessCode(event.target.value)}
                    required
                    type="password"
                    value={accessCode}
                  />
                </label>
                <button className={cn(ui.primaryButton, "mt-4 w-full justify-center")} disabled={syncStatus === "saving"} type="submit">
                  {syncStatus === "saving" ? <LoaderCircle aria-hidden="true" className="animate-spin" size={16} /> : <Check aria-hidden="true" size={16} />}
                  Connect protected tracking
                </button>
              </form>
            )}

            {message ? <p className={cn("mt-4 rounded-[11px] p-3 text-[9px] leading-relaxed", syncStatus === "error" ? "bg-[#fff0ec] text-[#8a473a]" : "bg-[#f5f7f4] text-study-muted")}>{message}</p> : null}
          </section>
        </div>
      ) : null}
    </>
  );
}
