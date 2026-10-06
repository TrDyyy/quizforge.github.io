"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Dices, Globe2, Play, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/features/storage/db";
import { syncPublicQuestionSets } from "@/features/sync/public-question-sets";
import type { QuestionSet } from "@/types/question";
import type { QuizMode, QuizOptions } from "@/types/quiz";

export function StudySetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [setId, setSetId] = useState("");
  const [mode, setMode] = useState<QuizMode>("practice");
  const [order, setOrder] = useState<"sequential" | "random">("sequential");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [count, setCount] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        await syncPublicQuestionSets();
      } catch {
        /* Offline: use the cached library. */
      }
      const items = await db.questionSets
        .orderBy("updatedAt")
        .reverse()
        .toArray();
      setSets(items);
      const requestedId = searchParams.get("set");
      setSetId(
        items.some((item) => item.id === requestedId)
          ? requestedId!
          : (items[0]?.id ?? ""),
      );
    })();
  }, [searchParams]);

  const selected = sets.find((item) => item.id === setId);
  const startQuiz = (quick = false) => {
    const options: QuizOptions = quick
      ? { questionSetId: setId, mode, order: "random", questionCount: 25 }
      : {
          questionSetId: setId,
          mode,
          order,
          startNumber: start ? Number(start) : undefined,
          endNumber: end ? Number(end) : undefined,
          questionCount: count ? Number(count) : undefined,
        };
    sessionStorage.setItem("quizforge-quiz-options", JSON.stringify(options));
    sessionStorage.setItem("quizforge-current-set-id", setId);
    router.push("/quiz");
  };

  if (!sets.length)
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <BookOpen className="mx-auto size-9 text-primary" />
        <h1 className="mt-5 text-2xl font-bold">Chưa có bộ đề nào</h1>
        <p className="mt-2 text-muted-foreground">
          Import, kiểm tra và lưu bộ câu hỏi trước khi bắt đầu học.
        </p>
        <Button
          className="mt-6"
          render={<Link href="/import" />}
          nativeButton={false}
        >
          Nhập bộ câu hỏi
        </Button>
      </main>
    );

  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm font-semibold text-primary">
        ← QuizForge
      </Link>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
        Thiết lập phiên học
      </p>
      <h1 className="mt-2 text-3xl font-bold">Bạn muốn học như thế nào?</h1>
      <section className="mt-9 space-y-7">
        <label className="block">
          <span className="text-sm font-semibold">Bộ đề</span>
          <select
            value={setId}
            onChange={(event) => setSetId(event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-input bg-card px-3 outline-none focus:border-primary"
          >
            <option value="" disabled>
              Chọn bộ đề
            </option>
            {sets.map((item) => (
              <option value={item.id} key={item.id}>
                {item.isPublic ? "🌏 " : ""}
                {item.name} · {item.questions.length} câu
              </option>
            ))}
          </select>
        </label>
        {selected?.isPublic && (
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
            <Globe2 className="size-4" /> Bộ đề chung
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("practice")}
            className={`rounded-xl border-2 p-4 text-left ${mode === "practice" ? "border-primary bg-primary/10" : "border-border bg-card"}`}
          >
            <p className="font-semibold">Luyện tập</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Biết đúng/sai ngay sau khi chọn.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setMode("exam")}
            className={`rounded-xl border-2 p-4 text-left ${mode === "exam" ? "border-primary bg-primary/10" : "border-border bg-card"}`}
          >
            <p className="font-semibold">Thi thử</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nộp bài rồi mới xem kết quả.
            </p>
          </button>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/7 p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Dices className="size-5" />
            </span>
            <div>
              <h2 className="font-bold">Làm nhanh 25 câu ngẫu nhiên</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Lấy tối đa 25 câu từ toàn bộ bộ đề. Phù hợp để ôn nhanh mỗi
                ngày.
              </p>
            </div>
          </div>
          <Button
            className="mt-4"
            disabled={!setId}
            onClick={() => startQuiz(true)}
          >
            <Shuffle /> Bắt đầu 25 câu
          </Button>
        </div>

        <div className="border-t border-border pt-7">
          <h2 className="font-bold">Tùy chỉnh phiên học</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Giữ cách chọn phạm vi và số câu như trước.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Thứ tự câu hỏi</p>
          <div className="mt-2 flex gap-3">
            <Button
              variant={order === "sequential" ? "default" : "outline"}
              onClick={() => setOrder("sequential")}
            >
              <BookOpen /> Theo thứ tự
            </Button>
            <Button
              variant={order === "random" ? "default" : "outline"}
              onClick={() => setOrder("random")}
            >
              <Shuffle /> Ngẫu nhiên
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-semibold">
            Từ câu
            <input
              type="number"
              min="1"
              value={start}
              onChange={(event) => setStart(event.target.value)}
              placeholder="1"
              className="mt-2 h-11 w-full rounded-lg border border-input bg-card px-3 font-normal outline-none focus:border-primary"
            />
          </label>
          <label className="text-sm font-semibold">
            Đến câu
            <input
              type="number"
              min="1"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
              placeholder={String(selected?.questions.length ?? "")}
              className="mt-2 h-11 w-full rounded-lg border border-input bg-card px-3 font-normal outline-none focus:border-primary"
            />
          </label>
          <label className="text-sm font-semibold">
            Số câu tối đa
            <input
              type="number"
              min="1"
              value={count}
              onChange={(event) => setCount(event.target.value)}
              placeholder="Tất cả"
              className="mt-2 h-11 w-full rounded-lg border border-input bg-card px-3 font-normal outline-none focus:border-primary"
            />
          </label>
        </div>
        <p className="text-sm text-muted-foreground">
          Dùng “Từ câu / Đến câu” để học theo chương nếu bạn đã đánh số câu liên
          tiếp theo chương trong tài liệu.
        </p>
        <Button size="lg" disabled={!setId} onClick={() => startQuiz()}>
          <Play /> Bắt đầu tùy chỉnh
        </Button>
      </section>
    </main>
  );
}
