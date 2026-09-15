export type QuizMode = "practice" | "exam";
export type QuizAnswer = { questionId: string; selectedAnswers: string[]; isCorrect?: boolean };
export type QuizSession = { id: string; questionSetId: string; questionIds: string[]; answers: QuizAnswer[]; currentQuestionIndex: number; mode: QuizMode; startedAt: string; completedAt?: string; status: "in-progress" | "completed" };
export type QuizOptions = { questionSetId: string; mode: QuizMode; order: "sequential" | "random"; startNumber?: number; endNumber?: number; questionCount?: number; questionIds?: string[] };
export type QuestionProgress = { questionId: string; questionSetId: string; correctCount: number; incorrectCount: number; bookmarked: boolean; note?: string; lastAnsweredAt?: string };
