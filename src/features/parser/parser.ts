import type { Question } from "@/types/question";
import type { ParseResult, ParseWarning } from "@/types/parser";
import { normalizeInput } from "./normalize";

const questionLine = /^(?:câu|question)\s*(\d+)\s*[.):]\s*(.*)$/i;
const numberedQuestionLine = /^(\d+)\s*[.):]\s*(.*)$/;
const optionLine = /^([a-d])\s*[.):]\s*(.+)$/i;
const inlineAnswerLine = /^(?:đáp án(?:\s+đúng)?|answer)\s*:??\s*([a-d](?:[\s,]+[a-d])*)\s*$/i;
const answerKeyHeading = /^\s{0,3}#{0,6}\s*(?:\*\*)?\s*(?:đáp án|answer key)\s*(?:\*\*)?\s*$/im;

function labels(value: string) { return [...new Set((value.match(/[a-d]/gi) ?? []).map((label) => label.toUpperCase()))]; }

function answerMap(text: string) {
  const map = new Map<number, string[]>();
  const matches = text.matchAll(/(\d+)\s*[-:]\s*([a-d](?:[\s,]+[a-d])*)/gi);
  for (const match of matches) map.set(Number(match[1]), labels(match[2]));
  return map;
}

export function parseQuestions(rawInput: string): ParseResult {
  const normalized = normalizeInput(rawInput);
  const heading = normalized.match(answerKeyHeading);
  const questionText = heading?.index === undefined ? normalized : normalized.slice(0, heading.index);
  const keyText = heading?.index === undefined ? "" : normalized.slice(heading.index + heading[0].length);
  const key = answerMap(keyText); const warnings: ParseWarning[] = [];
  const blocks: { number: number; content: string; lines: string[] }[] = [];
  let current: { number: number; content: string; lines: string[] } | undefined;
  for (const line of questionText.split("\n")) {
    const match = line.match(questionLine) ?? line.match(numberedQuestionLine);
    if (match) { if (current) blocks.push(current); current = { number: Number(match[1]), content: match[2].trim(), lines: [] }; }
    else if (current) current.lines.push(line);
  }
  if (current) blocks.push(current);
  const numberCounts = new Map<number, number>(); const contentCounts = new Map<string, number>();
  for (const block of blocks) { numberCounts.set(block.number, (numberCounts.get(block.number) ?? 0) + 1); const content = block.content.trim().toLocaleLowerCase(); if (content) contentCounts.set(content, (contentCounts.get(content) ?? 0) + 1); }
  for (const [number, count] of numberCounts) if (count > 1) warnings.push({ code: "DUPLICATE_QUESTION_NUMBER", questionNumber: number, message: `Câu ${number} xuất hiện ${count} lần. QuizForge vẫn giữ từng câu với ID riêng.` });
  for (const [content, count] of contentCounts) if (count > 1) warnings.push({ code: "DUPLICATE_QUESTION_CONTENT", message: `Có ${count} câu trùng nội dung “${content.slice(0, 72)}${content.length > 72 ? "…" : ""}”. Hãy kiểm tra trong editor.` });
  const occurrences = new Map<number, number>();
  const questions: Question[] = blocks.map((block) => {
    const occurrence = (occurrences.get(block.number) ?? 0) + 1; occurrences.set(block.number, occurrence);
    const options = block.lines.flatMap((line) => { const match = line.match(optionLine); return match ? [{ id: `q${block.number}-${occurrence}-${match[1].toLowerCase()}`, label: match[1].toUpperCase(), content: match[2].trim() }] : []; });
    const inline = block.lines.map((line) => line.match(inlineAnswerLine)).find(Boolean)?.[1];
    const inlineAnswers = inline ? labels(inline) : [];
    const keyAnswers = key.get(block.number) ?? [];
    if (inlineAnswers.length && keyAnswers.length && inlineAnswers.join() !== keyAnswers.join()) warnings.push({ code: "ANSWER_CONFLICT", questionNumber: block.number, message: `Câu ${block.number}: đáp án inline và answer key không khớp.` });
    const correctAnswers = inlineAnswers.length ? inlineAnswers : keyAnswers;
    if (!correctAnswers.length) warnings.push({ code: "MISSING_ANSWER", questionNumber: block.number, message: `Câu ${block.number} chưa có đáp án.` });
    if (options.length < 2) warnings.push({ code: "MISSING_OPTIONS", questionNumber: block.number, message: `Câu ${block.number} có ít hơn 2 lựa chọn.` });
    if (!block.content) warnings.push({ code: "EMPTY_QUESTION", questionNumber: block.number, message: `Câu ${block.number} chưa có nội dung.` });
    return { id: `question-${block.number}-${occurrence}`, number: block.number, content: block.content, options, correctAnswers };
  });
  for (const number of key.keys()) if (!questions.some((question) => question.number === number)) warnings.push({ code: "UNKNOWN_ANSWER_KEY", questionNumber: number, message: `Answer key có đáp án cho câu ${number} nhưng không tìm thấy câu hỏi.` });
  const answeredQuestions = questions.filter((question) => question.correctAnswers.length).length;
  return { questions, warnings, errors: [], metadata: { totalQuestions: questions.length, answeredQuestions, unansweredQuestions: questions.length - answeredQuestions, inlineAnswers: questions.filter((question) => questionText.includes(`Đáp án: ${question.correctAnswers[0]}`)).length, answerKeyAnswers: questions.filter((question) => !questionText.includes(`Đáp án: ${question.correctAnswers[0]}`) && question.correctAnswers.length).length } };
}
