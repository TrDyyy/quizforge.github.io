import { describe, expect, it } from "vitest";
import { applyFormattedDocxAnswers, formattedDocxAnswers } from "./docx";
import { parseQuestions } from "./parser";

const sample = "<p><strong>Câu 29. Thủ đô của Nhật Bản là thành phố nào?</strong></p><p>A. Kyoto</p><p><strong>B. Tokyo</strong></p><p>C. Seoul</p><p>D. Osaka</p><p><strong>Câu 1. Hành tinh nào gần Mặt Trời nhất?</strong></p><p><mark class=\"highlight\">A. Sao Thủy</mark></p><p>B. Sao Hỏa</p>";

describe("formatted DOCX answers", () => {
  it("detects bold and highlighted options", () => expect([...formattedDocxAnswers(sample)]).toEqual([[29, ["B"]], [1, ["A"]]]));
  it("only fills missing answers and keeps an inline answer", () => {
    const parsed = parseQuestions("Câu 29. Thủ đô của Nhật Bản là thành phố nào?\nA. Kyoto\nB. Tokyo\nC. Seoul\nD. Osaka\nCâu 1. Hành tinh nào gần Mặt Trời nhất?\nA. Sao Thủy\nB. Sao Hỏa\nĐáp án: B");
    const result = applyFormattedDocxAnswers(parsed, sample);
    expect(result.questions.map((question) => question.correctAnswers)).toEqual([["B"], ["B"]]);
  });
});
