import { db } from "../db";
import type { QuestionProgress } from "@/types/quiz";

export const progressRepository = {
  async record(questionSetId: string, questionId: string, correct: boolean) {
    const prior = await db.questionProgress.get(questionId);
    await db.questionProgress.put({ questionId, questionSetId, correctCount: (prior?.correctCount ?? 0) + Number(correct), incorrectCount: (prior?.incorrectCount ?? 0) + Number(!correct), bookmarked: prior?.bookmarked ?? false, lastAnsweredAt: new Date().toISOString() });
  },
  async toggleBookmark(questionSetId: string, questionId: string, bookmarked: boolean) {
    const prior = await db.questionProgress.get(questionId);
    await db.questionProgress.put({ questionId, questionSetId, correctCount: prior?.correctCount ?? 0, incorrectCount: prior?.incorrectCount ?? 0, bookmarked, lastAnsweredAt: prior?.lastAnsweredAt });
  },
  async commitSession(questionSetId: string, entries: Array<{ questionId: string; correct?: boolean; bookmarked?: boolean; note?: string }>) {
    const ids = entries.map((entry) => entry.questionId);
    const previous = await db.questionProgress.bulkGet(ids);
    const now = new Date().toISOString();
    const records: QuestionProgress[] = entries.map((entry, index) => {
      const prior = previous[index];
      return { questionId: entry.questionId, questionSetId, correctCount: (prior?.correctCount ?? 0) + Number(entry.correct === true), incorrectCount: (prior?.incorrectCount ?? 0) + Number(entry.correct === false), bookmarked: entry.bookmarked ?? prior?.bookmarked ?? false, note: entry.note?.trim() || prior?.note, lastAnsweredAt: entry.correct === undefined ? prior?.lastAnsweredAt : now };
    });
    await db.questionProgress.bulkPut(records);
  },
  async incorrect(questionSetId: string) { return db.questionProgress.where("questionSetId").equals(questionSetId).filter((item) => item.incorrectCount > item.correctCount).toArray(); },
};
