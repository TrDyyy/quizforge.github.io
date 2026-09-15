import { expect, it } from "vitest";
import { isCorrect, score } from "./quiz-engine";
import type { Question } from "@/types/question";

const question: Question = { id: "q1", content: "Question", options: [{ id: "a", label: "A", content: "A" }, { id: "b", label: "B", content: "B" }], correctAnswers: ["A"] };
it("scores exact answers and keeps answer order irrelevant", () => {
  expect(isCorrect(question, ["A"])).toBe(true);
  expect(isCorrect(question, ["B"])).toBe(false);
  expect(score([question], { q1: ["A"] })).toMatchObject({ correct: 1, percentage: 100 });
});
