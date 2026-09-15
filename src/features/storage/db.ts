import Dexie, { type EntityTable } from "dexie";
import type { QuestionSet } from "@/types/question";
import type { QuizSession, QuestionProgress } from "@/types/quiz";

export type Setting = { key: string; value: unknown };

export class QuizForgeDB extends Dexie {
  questionSets!: EntityTable<QuestionSet, "id">;
  quizSessions!: EntityTable<QuizSession, "id">;
  questionProgress!: EntityTable<QuestionProgress, "questionId">;
  settings!: EntityTable<Setting, "key">;
  constructor() {
    super("QuizForgeDB");
    this.version(1).stores({ questionSets: "id, name, createdAt, updatedAt", settings: "key" });
    this.version(2).stores({ questionSets: "id, name, createdAt, updatedAt", quizSessions: "id, questionSetId, status, startedAt, completedAt", questionProgress: "questionId, questionSetId, incorrectCount, correctCount, bookmarked, lastAnsweredAt", settings: "key" });
  }
}

export const db = new QuizForgeDB();
