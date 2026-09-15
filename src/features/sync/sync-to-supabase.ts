import { supabase } from "@/lib/supabase/client";
import { db } from "@/features/storage/db";
import type { QuestionSet } from "@/types/question";
import type { QuestionProgress, QuizSession } from "@/types/quiz";

export type SyncResult = { questionSets: number; sessions: number; progress: number };

export async function syncToSupabase(): Promise<SyncResult> {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) throw new Error("Hãy đăng nhập trước khi đồng bộ.");
  const [questionSets, sessions, progress] = await Promise.all([db.questionSets.toArray(), db.quizSessions.toArray(), db.questionProgress.toArray()]);
  if (questionSets.length) {
    const { error } = await supabase.from("question_sets").upsert(questionSets.map((set) => ({ id: set.id, user_id: auth.user.id, name: set.name, description: set.description ?? null, questions: set.questions, created_at: set.createdAt, updated_at: set.updatedAt })), { onConflict: "id" });
    if (error) throw error;
  }
  if (sessions.length) {
    const { error } = await supabase.from("quiz_sessions").upsert(sessions.map((session) => ({ id: session.id, user_id: auth.user.id, question_set_id: session.questionSetId === "demo" ? null : session.questionSetId, payload: session, created_at: session.completedAt ?? session.startedAt })), { onConflict: "id" });
    if (error) throw error;
  }
  if (progress.length) {
    const { error } = await supabase.from("question_progress").upsert(progress.map((item) => ({ user_id: auth.user.id, question_set_id: item.questionSetId, question_id: item.questionId, correct_count: item.correctCount, incorrect_count: item.incorrectCount, bookmarked: item.bookmarked, note: item.note ?? null, last_answered_at: item.lastAnsweredAt ?? null })), { onConflict: "user_id,question_set_id,question_id" });
    if (error) throw error;
  }
  return { questionSets: questionSets.length, sessions: sessions.length, progress: progress.length };
}

export async function pullFromSupabase(): Promise<SyncResult> {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) throw new Error("Hãy đăng nhập trước khi đồng bộ.");
  const [{ data: remoteSets, error: setsError }, { data: remoteSessions, error: sessionsError }, { data: remoteProgress, error: progressError }] = await Promise.all([
    supabase.from("question_sets").select("*").order("updated_at", { ascending: false }),
    supabase.from("quiz_sessions").select("*").order("created_at", { ascending: false }),
    supabase.from("question_progress").select("*"),
  ]);
  if (setsError) throw setsError; if (sessionsError) throw sessionsError; if (progressError) throw progressError;
  let setsCount = 0; let sessionsCount = 0; let progressCount = 0;
  for (const row of remoteSets ?? []) {
    const local = await db.questionSets.get(row.id); const remote: QuestionSet = { id: row.id, name: row.name, description: row.description ?? undefined, questions: row.questions, createdAt: row.created_at, updatedAt: row.updated_at };
    if (!local || new Date(remote.updatedAt) > new Date(local.updatedAt)) { await db.questionSets.put(remote); setsCount += 1; }
  }
  for (const row of remoteSessions ?? []) {
    const local = await db.quizSessions.get(row.id); if (!local) { await db.quizSessions.put(row.payload as QuizSession); sessionsCount += 1; }
  }
  for (const row of remoteProgress ?? []) {
    const local = await db.questionProgress.get(row.question_id); const remote: QuestionProgress = { questionId: row.question_id, questionSetId: row.question_set_id, correctCount: row.correct_count, incorrectCount: row.incorrect_count, bookmarked: row.bookmarked, note: row.note ?? undefined, lastAnsweredAt: row.last_answered_at ?? undefined };
    const merged: QuestionProgress = local ? { ...remote, correctCount: Math.max(local.correctCount, remote.correctCount), incorrectCount: Math.max(local.incorrectCount, remote.incorrectCount), bookmarked: local.bookmarked || remote.bookmarked, note: local.note || remote.note, lastAnsweredAt: new Date(local.lastAnsweredAt ?? 0) > new Date(remote.lastAnsweredAt ?? 0) ? local.lastAnsweredAt : remote.lastAnsweredAt } : remote;
    await db.questionProgress.put(merged); progressCount += 1;
  }
  return { questionSets: setsCount, sessions: sessionsCount, progress: progressCount };
}
