"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/features/storage/db";
import { quizRepository } from "@/features/storage/repositories/quiz.repository";
import { progressRepository } from "@/features/storage/repositories/progress.repository";
import type { QuestionSet } from "@/types/question";
import type { QuizSession, QuestionProgress, QuizOptions } from "@/types/quiz";
import { useRouter } from "next/navigation";

export function HistoryWorkspace() {
  const router = useRouter(); const [sessions, setSessions] = useState<QuizSession[]>([]); const [sets, setSets] = useState<QuestionSet[]>([]); const [progress, setProgress] = useState<QuestionProgress[]>([]);
  useEffect(() => { void Promise.all([quizRepository.list(), db.questionSets.toArray(), db.questionProgress.toArray()]).then(([savedSessions, savedSets, savedProgress]) => { setSessions(savedSessions); setSets(savedSets); setProgress(savedProgress); }); }, []);
  const retry = async (setId: string) => { const wrong = await progressRepository.incorrect(setId); const options: QuizOptions = { questionSetId: setId, questionIds: wrong.map((item) => item.questionId), mode: "practice", order: "random" }; sessionStorage.setItem("quizforge-quiz-options", JSON.stringify(options)); router.push("/quiz"); };
  return <main className="mx-auto min-h-dvh max-w-4xl px-4 py-10 sm:px-6"><Link href="/" className="text-sm font-semibold text-primary">← QuizForge</Link><div className="mt-8 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-primary">Tiến độ học</p><h1 className="mt-2 text-3xl font-bold">Lịch sử & câu cần ôn</h1></div><History className="size-7 text-muted-foreground" /></div><section className="mt-10"><h2 className="text-lg font-semibold">Ôn lại câu sai</h2><p className="mt-1 text-sm text-muted-foreground">Gồm mọi câu bạn đã từng trả lời sai, kể cả khi sau đó đã làm đúng.</p><div className="mt-3 space-y-3">{sets.map((set) => { const wrong = progress.filter((item) => item.questionSetId === set.id && item.incorrectCount > 0); return <article key={set.id} className="flex items-center justify-between border-l-2 border-border bg-card p-4"><div><p className="font-semibold">{set.name}</p><p className="mt-1 text-sm text-muted-foreground">{wrong.length} câu cần ôn lại</p></div><Button variant="outline" disabled={!wrong.length} onClick={() => void retry(set.id)}><RotateCcw /> Ôn câu sai</Button></article>; })}</div></section><section className="mt-10"><h2 className="text-lg font-semibold">Lịch sử làm bài</h2><div className="mt-3 divide-y divide-border border-y border-border">{sessions.length ? sessions.map((session) => { const correct = session.answers.filter((answer) => answer.isCorrect).length; return <article key={session.id} className="flex items-center justify-between py-4"><div><p className="font-medium">{sets.find((set) => set.id === session.questionSetId)?.name ?? "Bộ đề đã xóa"}</p><p className="mt-1 text-sm text-muted-foreground">{new Date(session.completedAt ?? session.startedAt).toLocaleString("vi-VN")} · {session.mode === "exam" ? "Thi thử" : "Luyện tập"}</p></div><p className="font-semibold">{correct}/{session.questionIds.length}</p></article>; }) : <p className="py-8 text-sm text-muted-foreground">Chưa có phiên học hoàn thành.</p>}</div></section></main>;
}
