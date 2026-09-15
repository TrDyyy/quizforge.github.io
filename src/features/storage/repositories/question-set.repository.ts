import { db } from "../db";
import type { QuestionSet } from "@/types/question";

export const questionSetRepository = {
  async save(questionSet: QuestionSet) { await db.questionSets.put(questionSet); return questionSet; },
  async get(id: string) { return db.questionSets.get(id); },
  async list() { return db.questionSets.orderBy("updatedAt").reverse().toArray(); },
  async remove(id: string) {
    await db.transaction("rw", db.questionSets, db.quizSessions, db.questionProgress, async () => {
      await db.questionSets.delete(id);
      await db.quizSessions.where("questionSetId").equals(id).delete();
      await db.questionProgress.where("questionSetId").equals(id).delete();
    });
  },
};
