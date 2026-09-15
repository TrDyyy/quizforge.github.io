import type { ParseResult, ParseWarning } from "@/types/parser";

const questionLine = /^(?:câu|question)\s*(\d+)\s*[.):]\s*(.*)$/i;
const numberedQuestionLine = /^(\d+)\s*[.):]\s*(.*)$/;
const optionLine = /^([a-d])\s*[.):]\s*(.+)$/i;

function textFromHtml(value: string) {
  return value.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").trim();
}

/**
 * Finds options whose own Word paragraph is bold or highlighted. This is a
 * fallback only: parseQuestions' inline answer and answer-key result wins.
 */
export function formattedDocxAnswers(html: string) {
  const answers = new Map<number, string[]>();
  let questionNumber: number | undefined;
  for (const match of html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)) {
    const paragraphHtml = match[1]; const text = textFromHtml(paragraphHtml);
    const question = text.match(questionLine) ?? text.match(numberedQuestionLine);
    if (question) { questionNumber = Number(question[1]); continue; }
    const option = text.match(optionLine);
    const formatted = /<(?:strong|b|mark)\b/i.test(paragraphHtml) || /(?:highlight|background-color)/i.test(paragraphHtml);
    if (questionNumber && option && formatted) answers.set(questionNumber, [...new Set([...(answers.get(questionNumber) ?? []), option[1].toUpperCase()])]);
  }
  return answers;
}

export function applyFormattedDocxAnswers(result: ParseResult, html: string): ParseResult {
  const formatted = formattedDocxAnswers(html); const warnings: ParseWarning[] = [...result.warnings];
  const questions = result.questions.map((question) => {
    const detected = question.number ? formatted.get(question.number) ?? [] : [];
    if (!detected.length) return question;
    if (question.correctAnswers.length && question.correctAnswers.join() !== detected.join()) {
      warnings.push({ code: "ANSWER_CONFLICT", questionNumber: question.number, message: `Câu ${question.number}: đáp án inline/answer key được ưu tiên hơn đáp án định dạng Word.` });
      return question;
    }
    return question.correctAnswers.length ? question : { ...question, correctAnswers: detected };
  });
  const answeredQuestions = questions.filter((question) => question.correctAnswers.length).length;
  const withoutMissingAnswer = warnings.filter((warning) => warning.code !== "MISSING_ANSWER" || !questions.find((question) => question.number === warning.questionNumber)?.correctAnswers.length);
  return { ...result, questions, warnings: withoutMissingAnswer, metadata: { ...result.metadata, answeredQuestions, unansweredQuestions: questions.length - answeredQuestions } };
}
