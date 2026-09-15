export type QuestionOption = { id: string; label: string; content: string };

export type Question = { id: string; number?: number; content: string; options: QuestionOption[]; correctAnswers: string[]; explanation?: string; tags?: string[]; bookmarked?: boolean };

export type QuestionSet = { id: string; name: string; description?: string; createdAt: string; updatedAt: string; questions: Question[] };
