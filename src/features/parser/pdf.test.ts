import { describe, expect, it } from "vitest";
import { textItemsToLines } from "./pdf";

describe("textItemsToLines", () => {
  it("preserves visual lines for the question parser", () => {
    const text = textItemsToLines([
      { str: "1.", transform: [1, 0, 0, 1, 10, 100], hasEOL: false },
      { str: "CPU là gì?", transform: [1, 0, 0, 1, 22, 100], hasEOL: true },
      { str: "A. Bộ xử lý", transform: [1, 0, 0, 1, 10, 80], hasEOL: true },
      { str: "Đáp án: A", transform: [1, 0, 0, 1, 10, 60], hasEOL: false },
    ]);
    expect(text).toBe("1. CPU là gì?\nA. Bộ xử lý\nĐáp án: A");
  });
});
