import { db } from "../db";
import type { QuizSession } from "@/types/quiz";

export const quizRepository = {
  async save(session: QuizSession) { await db.quizSessions.put(session); },
  async list() { return db.quizSessions.orderBy("startedAt").reverse().toArray(); },
};
