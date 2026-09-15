import { supabase } from "@/lib/supabase/client";
import { db } from "@/features/storage/db";

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
    const { error } = await supabase.from("question_progress").upsert(progress.map((item) => ({ user_id: auth.user.id, question_set_id: item.questionSetId, question_id: item.questionId, correct_count: item.correctCount, incorrect_count: item.incorrectCount, bookmarked: item.bookmarked, last_answered_at: item.lastAnsweredAt ?? null })), { onConflict: "user_id,question_set_id,question_id" });
    if (error) throw error;
  }
  return { questionSets: questionSets.length, sessions: sessions.length, progress: progress.length };
}
