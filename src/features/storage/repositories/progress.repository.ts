import { db } from "../db";

export const progressRepository = {
  async record(questionSetId: string, questionId: string, correct: boolean) {
    const prior = await db.questionProgress.get(questionId);
    await db.questionProgress.put({ questionId, questionSetId, correctCount: (prior?.correctCount ?? 0) + Number(correct), incorrectCount: (prior?.incorrectCount ?? 0) + Number(!correct), bookmarked: prior?.bookmarked ?? false, lastAnsweredAt: new Date().toISOString() });
  },
  async toggleBookmark(questionSetId: string, questionId: string, bookmarked: boolean) {
    const prior = await db.questionProgress.get(questionId);
    await db.questionProgress.put({ questionId, questionSetId, correctCount: prior?.correctCount ?? 0, incorrectCount: prior?.incorrectCount ?? 0, bookmarked, lastAnsweredAt: prior?.lastAnsweredAt });
  },
  async incorrect(questionSetId: string) { return db.questionProgress.where("questionSetId").equals(questionSetId).filter((item) => item.incorrectCount > item.correctCount).toArray(); },
};
