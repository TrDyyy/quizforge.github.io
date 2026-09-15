import { describe, expect, it } from "vitest";
import { normalizeInput } from "./normalize";

describe("normalizeInput", () => {
  it("normalizes Markdown and punctuation used by the TVU question bank", () => {
    expect(normalizeInput("**Câu 1\\. Nội dung**\r\n1–D\r\n2—C")).toBe("Câu 1. Nội dung\n1-D\n2-C");
  });
});
