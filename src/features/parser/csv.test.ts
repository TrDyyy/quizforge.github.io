import { expect, it } from "vitest";
import { csvToQuestionText } from "./csv";
import { parseQuestions } from "./parser";

it("converts a headed CSV import into quiz questions", () => {
  const text = csvToQuestionText("question,A,B,C,D,answer\nCPU là gì?,Bộ xử lý,Bộ nhớ,Mạng,Tệp,A");
  const result = parseQuestions(text);
  expect(result.questions[0].content).toBe("CPU là gì?");
  expect(result.questions[0].correctAnswers).toEqual(["A"]);
});
