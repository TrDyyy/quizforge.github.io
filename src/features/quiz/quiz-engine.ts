import type { Question } from "@/types/question";

export function sameAnswers(left: string[], right: string[]) { return left.length === right.length && [...left].sort().every((answer, index) => answer === [...right].sort()[index]); }
export function isCorrect(question: Question, selectedAnswers: string[]) { return sameAnswers(question.correctAnswers, selectedAnswers); }
export function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - 0.5); }
export function score(questions: Question[], answers: Record<string, string[]>) { const correct = questions.filter((question) => isCorrect(question, answers[question.id] ?? [])).length; return { correct, incorrect: Object.keys(answers).length - correct, unanswered: questions.length - Object.keys(answers).length, percentage: questions.length ? Math.round((correct / questions.length) * 100) : 0 }; }
