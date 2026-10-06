import { supabase } from "@/lib/supabase/client";
import { db } from "@/features/storage/db";
import type { QuestionSet } from "@/types/question";

type QuestionSetRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  questions: QuestionSet["questions"];
  created_at: string;
  updated_at: string;
  is_public: boolean;
};

function fromRow(row: QuestionSetRow): QuestionSet {
  return {
    id: row.id,
    ownerId: row.user_id,
    name: row.name,
    description: row.description ?? undefined,
    questions: row.questions,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isPublic: row.is_public,
  };
}

export async function syncPublicQuestionSets() {
  const { data, error } = await supabase
    .from("question_sets")
    .select("*")
    .eq("is_public", true)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  const sets = (data ?? []).map((row) => fromRow(row as QuestionSetRow));
  const publicIds = new Set(sets.map((set) => set.id));
  const staleIds = (await db.questionSets.toArray())
    .filter((set) => set.isPublic && !publicIds.has(set.id))
    .map((set) => set.id);
  await db.transaction("rw", db.questionSets, async () => {
    if (staleIds.length) await db.questionSets.bulkDelete(staleIds);
    if (sets.length) await db.questionSets.bulkPut(sets);
  });
  return sets;
}

export async function getCurrentRole(): Promise<"admin" | "user"> {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) return "user";
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .maybeSingle();
  if (error) throw error;
  return data?.role === "admin" ? "admin" : "user";
}

export async function publishQuestionSet(set: QuestionSet) {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) throw new Error("Hãy đăng nhập bằng tài khoản admin.");
  const { error } = await supabase.from("question_sets").upsert(
    {
      id: set.id,
      user_id: auth.user.id,
      name: set.name,
      description: set.description ?? null,
      questions: set.questions,
      created_at: set.createdAt,
      updated_at: new Date().toISOString(),
      is_public: true,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
  await db.questionSets.update(set.id, {
    isPublic: true,
    ownerId: auth.user.id,
  });
}

export async function unpublishQuestionSet(id: string) {
  const { error } = await supabase
    .from("question_sets")
    .update({ is_public: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  await db.questionSets.update(id, { isPublic: false });
}
