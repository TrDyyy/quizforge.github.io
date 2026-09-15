import { db } from "../db";
import type { QuestionSet } from "@/types/question";

export const questionSetRepository = {
  async save(questionSet: QuestionSet) { await db.questionSets.put(questionSet); return questionSet; },
  async get(id: string) { return db.questionSets.get(id); },
  async list() { return db.questionSets.orderBy("updatedAt").reverse().toArray(); },
  async remove(id: string) { await db.questionSets.delete(id); },
};
