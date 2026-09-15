"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/features/storage/db";
import type { QuestionSet } from "@/types/question";
import type { QuestionProgress, QuizOptions } from "@/types/quiz";
import { useRouter } from "next/navigation";

export function BookmarksWorkspace() {
  const router = useRouter(); const [sets, setSets] = useState<QuestionSet[]>([]); const [bookmarks, setBookmarks] = useState<QuestionProgress[]>([]);
  useEffect(() => { void Promise.all([db.questionSets.toArray(), db.questionProgress.toArray()]).then(([savedSets, progress]) => { setSets(savedSets); setBookmarks(progress.filter((item) => item.bookmarked)); }); }, []);
  const grouped = sets.map((set) => ({ set, entries: bookmarks.filter((item) => item.questionSetId === set.id) })).filter((group) => group.entries.length);
  const study = (set: QuestionSet, entries: QuestionProgress[]) => { const options: QuizOptions = { questionSetId: set.id, questionIds: entries.map((item) => item.questionId), mode: "practice", order: "sequential" }; sessionStorage.setItem("quizforge-quiz-options", JSON.stringify(options)); router.push("/quiz"); };
  return <main className="mx-auto min-h-dvh max-w-3xl px-4 py-10 sm:px-6"><Link href="/" className="text-sm font-semibold text-primary">← QuizForge</Link><div className="mt-8 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-primary">Ôn trọng tâm</p><h1 className="mt-2 text-3xl font-bold">Câu đã đánh dấu</h1></div><Bookmark className="size-7 fill-primary text-primary" /></div><div className="mt-9 space-y-5">{grouped.length ? grouped.map(({ set, entries }) => <section key={set.id} className="border-l-2 border-primary bg-card p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-semibold">{set.name}</h2><p className="mt-1 text-sm text-muted-foreground">{entries.length} câu được đánh dấu</p></div><Button variant="outline" onClick={() => study(set, entries)}><Play /> Ôn các câu này</Button></div><ol className="mt-5 space-y-2 text-sm">{entries.map((entry) => { const question = set.questions.find((item) => item.id === entry.questionId); return question ? <li key={entry.questionId} className="border-l-2 border-border pl-3">Câu {question.number ?? ""}. {question.content}</li> : null; })}</ol></section>) : <p className="border-l-2 border-border py-5 pl-4 text-sm text-muted-foreground">Chưa có câu nào được đánh dấu. Trong quiz, bấm icon bookmark rồi hoàn thành phiên để lưu.</p>}</div></main>;
}
