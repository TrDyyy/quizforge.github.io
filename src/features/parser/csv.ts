/** Converts the common CSV shape `question,A,B,C,D,answer` into parser input. */
function splitCsvLine(line: string) {
  const values: string[] = []; let value = ""; let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"') { value += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) { values.push(value.trim()); value = ""; }
    else value += character;
  }
  values.push(value.trim()); return values;
}

export function csvToQuestionText(raw: string) {
  const rows = raw.split(/\r?\n/).filter((line) => line.trim()).map(splitCsvLine);
  if (rows.length < 2) return raw;
  const headers = rows[0].map((header) => header.toLowerCase().trim());
  const get = (row: string[], names: string[]) => row[headers.findIndex((header) => names.includes(header))] ?? "";
  const hasQuestion = headers.some((header) => ["question", "câu hỏi", "content"].includes(header));
  if (!hasQuestion) return raw;
  return rows.slice(1).map((row, index) => {
    const question = get(row, ["question", "câu hỏi", "content"]);
    const answer = get(row, ["answer", "đáp án", "correct"]);
    return [`${index + 1}. ${question}`, `A. ${get(row, ["a", "option a"])}`, `B. ${get(row, ["b", "option b"])}`, `C. ${get(row, ["c", "option c"])}`, `D. ${get(row, ["d", "option d"])}`, answer ? `Đáp án: ${answer}` : ""].filter(Boolean).join("\n");
  }).join("\n\n");
}
