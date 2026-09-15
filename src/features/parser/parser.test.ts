import { describe, expect, it } from "vitest";
import { parseQuestions } from "./parser";

describe("parseQuestions", () => {
  it("merges a Markdown answer key with numbered Vietnamese questions", () => {
    const result = parseQuestions("**Câu 1\\. CPU là gì?**\nA. Bộ xử lý\nB. Bộ nhớ\n\nCâu 2: RAM là gì?\nA. Bộ nhớ tạm\nB. Mạng\n\n# **ĐÁP ÁN**\n| 1–A | 2–A |");
    expect(result.questions).toHaveLength(2);
    expect(result.questions[0].correctAnswers).toEqual(["A"]);
    expect(result.questions[1].correctAnswers).toEqual(["A"]);
    expect(result.warnings).toHaveLength(0);
  });

  it("keeps inline answers and reports a conflict", () => {
    const result = parseQuestions("1. Question\nA. One\nB. Two\nĐáp án: B\n# ĐÁP ÁN\n1-A");
    expect(result.questions[0].correctAnswers).toEqual(["B"]);
    expect(result.warnings[0].code).toBe("ANSWER_CONFLICT");
  });

  it("keeps duplicate question numbers with distinct IDs and warnings", () => {
    const result = parseQuestions("Câu 1. Câu đầu\nA. Một\nB. Hai\nĐáp án: A\n\nCâu 1. Câu khác\nA. Ba\nB. Bốn\nĐáp án: B");
    expect(result.questions.map((question) => question.id)).toEqual(["question-1-1", "question-1-2"]);
    expect(result.questions.map((question) => question.correctAnswers)).toEqual([["A"], ["B"]]);
    expect(result.warnings.some((warning) => warning.code === "DUPLICATE_QUESTION_NUMBER")).toBe(true);
  });
});
