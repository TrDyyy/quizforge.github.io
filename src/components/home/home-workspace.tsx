"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Globe2, Play, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/features/storage/db";
import { questionSetRepository } from "@/features/storage/repositories/question-set.repository";
import { syncPublicQuestionSets } from "@/features/sync/public-question-sets";
import type { QuestionSet } from "@/types/question";

export function HomeWorkspace() {
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    void (async () => {
      try {
        await syncPublicQuestionSets();
      } catch {
        /* Offline: use cached sets. */
      }
      setSets(
        await db.questionSets.orderBy("updatedAt").reverse().limit(3).toArray(),
      );
    })();
    const storedNotice = sessionStorage.getItem("quizforge-home-notice") ?? "";
    window.setTimeout(() => setNotice(storedNotice), 0);
    sessionStorage.removeItem("quizforge-home-notice");
  }, []);
  const remove = async (set: QuestionSet) => {
    if (
      !window.confirm(
        `Xóa bộ đề “${set.name}”? Lịch sử, ghi chú và tiến độ của bộ này cũng sẽ bị xóa.`,
      )
    )
      return;
    await questionSetRepository.remove(set.id);
    setSets((current) => current.filter((item) => item.id !== set.id));
    setNotice(`Đã xóa bộ đề “${set.name}”.`);
  };
  return (
    <>
      {notice && (
        <p
          role="status"
          className="mt-7 border-l-2 border-success bg-success-surface p-3 text-sm text-success-foreground"
        >
          {notice}
        </p>
      )}
      {sets.length > 0 && (
        <section
          className="mt-16 rounded-[2rem] border border-primary/15 bg-primary/7 p-5 sm:p-7"
          aria-labelledby="quick-study-title"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.16em] text-primary">
                Góc học tập của bạn
              </p>
              <h2 id="quick-study-title" className="mt-2 text-2xl font-bold">
                Học tiếp từ chỗ đang dở
              </h2>
            </div>
            <Link
              href="/library"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {sets.map((set, index) => (
              <article
                key={set.id}
                className={`rounded-2xl border border-primary/15 bg-card p-5 shadow-sm transition-transform hover:-translate-y-1 ${index === 1 ? "md:rotate-1" : index === 2 ? "md:-rotate-1" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12">
                    <BookOpen className="size-5 text-primary" />
                  </span>
                  {set.isPublic && (
                    <span title="Bộ đề chung">
                      <Globe2 className="size-4 text-primary" />
                    </span>
                  )}
                </div>
                <h3 className="mt-5 line-clamp-2 font-semibold">{set.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {set.questions.length} câu hỏi
                  {set.isPublic ? " · Bộ đề chung" : ""}
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <Link
                    href={`/study?set=${encodeURIComponent(set.id)}`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <Play /> Luyện bộ này
                  </Link>
                  {!set.isPublic && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => void remove(set)}
                      aria-label={`Xóa ${set.name}`}
                      title="Xóa bộ đề"
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
