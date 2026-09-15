import type { Question } from "./question";

export type ParseWarning = { code: string; message: string; questionNumber?: number };
export type ParseError = { code: string; message: string };
export type ParseMetadata = { totalQuestions: number; answeredQuestions: number; unansweredQuestions: number; inlineAnswers: number; answerKeyAnswers: number };
export type ParseResult = { questions: Question[]; warnings: ParseWarning[]; errors: ParseError[]; metadata: ParseMetadata };
