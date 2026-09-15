"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StickyNote } from "lucide-react";
import { db } from "@/features/storage/db";
import type { QuestionSet } from "@/types/question";
import type { QuestionProgress } from "@/types/quiz";

export function NotesWorkspace() {
  const [sets, setSets] = useState<QuestionSet[]>([]); const [progress, setProgress] = useState<QuestionProgress[]>([]);
  useEffect(() => { void Promise.all([db.questionSets.toArray(), db.questionProgress.toArray()]).then(([savedSets, savedProgress]) => { setSets(savedSets); setProgress(savedProgress.filter((item) => item.note?.trim())); }); }, []);
  const items = progress.flatMap((item) => { const set = sets.find((candidate) => candidate.id === item.questionSetId); const question = set?.questions.find((candidate) => candidate.id === item.questionId); return set && question ? [{ item, set, question }] : []; });
  return <main className="mx-auto min-h-dvh max-w-3xl px-4 py-10 sm:px-6"><Link href="/" className="text-sm font-semibold text-primary">← QuizForge</Link><div className="mt-8 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-primary">Ôn theo ghi chú</p><h1 className="mt-2 text-3xl font-bold">Câu đã note</h1></div><StickyNote className="size-7 text-primary" /></div><div className="mt-9 space-y-4">{items.length ? items.map(({ item, set, question }) => <article key={`${item.questionSetId}-${item.questionId}`} className="border-l-2 border-primary bg-card p-5"><p className="text-sm font-semibold text-primary">{set.name} · Câu {question.number ?? ""}</p><h2 className="mt-2 font-semibold">{question.content}</h2><p className="mt-4 whitespace-pre-wrap border-l-2 border-border pl-3 text-sm leading-6 text-muted-foreground">{item.note}</p></article>) : <p className="border-l-2 border-border py-5 pl-4 text-sm text-muted-foreground">Chưa có ghi chú. Khi đang làm quiz, nhập nội dung vào “Ghi chú riêng cho câu này”; ghi chú sẽ lưu khi bạn hoàn thành phiên.</p>}</div></main>;
}
