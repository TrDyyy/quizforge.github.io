"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { questionSetRepository } from "@/features/storage/repositories/question-set.repository";
import type { QuestionSet } from "@/types/question";

export function LibraryWorkspace() {
  const [sets, setSets] = useState<QuestionSet[]>([]);
  useEffect(() => { void questionSetRepository.list().then(setSets); }, []);
  const remove = async (set: QuestionSet) => { if (!window.confirm(`Xóa bộ đề “${set.name}”? Lịch sử, ghi chú và tiến độ của bộ này cũng sẽ bị xóa.`)) return; await questionSetRepository.remove(set.id); setSets((current) => current.filter((item) => item.id !== set.id)); };
  return <main className="mx-auto min-h-dvh max-w-4xl px-4 py-10 sm:px-6"><Link href="/" className="text-sm font-semibold text-primary">← QuizForge</Link><p className="mt-8 text-sm font-semibold uppercase tracking-[.16em] text-primary">Thư viện</p><h1 className="mt-2 text-3xl font-bold">Bộ đề đã tạo</h1><div className="mt-8 space-y-3">{sets.length ? sets.map((set) => <article key={set.id} className="flex flex-wrap items-center justify-between gap-4 border-l-2 border-primary bg-card p-5"><div><BookOpen className="size-5 text-primary" /><h2 className="mt-3 font-semibold">{set.name}</h2><p className="mt-1 text-sm text-muted-foreground">{set.questions.length} câu hỏi · cập nhật {new Date(set.updatedAt).toLocaleDateString("vi-VN")}</p></div><div className="flex gap-2"><Button variant="outline" render={<Link href={`/study?set=${encodeURIComponent(set.id)}`} />} nativeButton={false}><Play /> Luyện</Button><Button variant="ghost" size="icon" onClick={() => void remove(set)} aria-label={`Xóa ${set.name}`}><Trash2 className="text-destructive" /></Button></div></article>) : <p className="border-l-2 border-border py-5 pl-4 text-sm text-muted-foreground">Chưa có bộ đề nào. Hãy import tài liệu để bắt đầu.</p>}</div></main>;
}
