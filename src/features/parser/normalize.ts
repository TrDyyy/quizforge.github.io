/** Normalizes formatting characters without changing meaningful question text. */
export function normalizeInput(rawInput: string): string {
  return rawInput.replace(/\r\n?/g, "\n").replace(/[–—]/g, "-").replace(/\\([.:)])/g, "$1").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\u00a0/g, " ").trim();
}
