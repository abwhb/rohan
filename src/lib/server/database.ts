import postgres from "postgres";

import type { StudyProgressState } from "@/src/types/study";

type SqlClient = ReturnType<typeof postgres>;

declare global {
  var rohanStudySql: SqlClient | undefined;
  var rohanStudySchemaPromise: Promise<void> | undefined;
}

export function databaseIsConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");

  if (!globalThis.rohanStudySql) {
    globalThis.rohanStudySql = postgres(databaseUrl, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: true,
      connection: { application_name: "rohan-study-system" },
    });
  }
  return globalThis.rohanStudySql;
}

async function ensureSchema() {
  if (!globalThis.rohanStudySchemaPromise) {
    globalThis.rohanStudySchemaPromise = (async () => {
      const sql = getSql();
      await sql`
        create table if not exists study_state (
          account_id text primary key,
          revision bigint not null default 0,
          state jsonb not null,
          updated_at timestamptz not null default now()
        )
      `;
    })().catch((error) => {
      globalThis.rohanStudySchemaPromise = undefined;
      throw error;
    });
  }
  await globalThis.rohanStudySchemaPromise;
}

export async function getCloudStudyState(accountId: string) {
  await ensureSchema();
  const sql = getSql();
  const [row] = await sql<{ state: StudyProgressState; revision: string; updatedAt: Date }[]>`
    select state, revision, updated_at as "updatedAt"
    from study_state
    where account_id = ${accountId}
  `;
  if (!row) return null;
  return { state: row.state, revision: Number(row.revision), updatedAt: row.updatedAt.toISOString() };
}

export async function saveCloudStudyState(
  accountId: string,
  state: StudyProgressState,
  baseRevision: number,
) {
  await ensureSchema();
  const sql = getSql();

  return sql.begin(async (transaction) => {
    await transaction`
      insert into study_state (account_id, revision, state)
      values (${accountId}, 0, ${transaction.json({ version: 3, topics: {}, sessions: [] })})
      on conflict (account_id) do nothing
    `;
    const [current] = await transaction<{ state: StudyProgressState; revision: string }[]>`
      select state, revision
      from study_state
      where account_id = ${accountId}
      for update
    `;
    const currentRevision = Number(current?.revision ?? 0);
    if (!current || currentRevision !== baseRevision) {
      return { conflict: true as const, state: current?.state ?? null, revision: currentRevision };
    }

    const [updated] = await transaction<{ revision: string; updatedAt: Date }[]>`
      update study_state
      set state = ${transaction.json(state as unknown as postgres.JSONValue)}, revision = revision + 1, updated_at = now()
      where account_id = ${accountId}
      returning revision, updated_at as "updatedAt"
    `;
    return {
      conflict: false as const,
      revision: Number(updated!.revision),
      updatedAt: updated!.updatedAt.toISOString(),
    };
  });
}
