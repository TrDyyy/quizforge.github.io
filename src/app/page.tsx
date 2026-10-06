import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Pencil,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeControls } from "@/components/theme-controls";
import { AccountBadge } from "@/components/profile/account-badge";
import { HomeWorkspace } from "@/components/home/home-workspace";

const steps = [
  [
    "01",
    "Nhập tài liệu",
    "Paste nội dung hoặc chọn tệp tài liệu có đáp án.",
  ],
  [
    "02",
    "Kiểm tra & sửa câu hỏi",
    "Preview kết quả parse và xử lý warning trước khi học.",
  ],
  ["03", "Làm quiz", "Luyện tập, đánh dấu và ôn lại các câu sai."],
];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  return (
    <div className="learning-canvas relative min-h-screen overflow-hidden text-foreground">
      <div className="pointer-events-none absolute -left-24 top-28 size-72 rounded-full bg-primary/10" />
      <div className="pointer-events-none absolute -right-20 top-8 size-64 rounded-[38%_62%_58%_42%] bg-primary/14" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Quiz<span className="text-primary">Forge</span>
        </Link>
        <div className="flex items-center gap-2">
          <AccountBadge />
          <ThemeControls />
          <Link href="/import" className={buttonVariants()}>
            Tạo bộ câu hỏi
          </Link>
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
        <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,.9fr)]">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              <Sparkles className="size-4" /> Tự tạo đề, tự ôn tập
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
              Học nhanh qua Quiz
              <br />
              <span className="text-primary">làm nhiều nhớ lâu.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              QuizForge giúp bạn tự tạo bộ câu hỏi từ tài liệu, luyện tập và ôn tập hiệu quả.
              Chuẩn bị file tài liệu có đáp án, phần còn lại để QuizForge lo !!!.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/study" className={buttonVariants({ size: "lg" })}>
                Bắt đầu học <ArrowRight />
              </Link>
              <Link
                href="/import"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Tạo bộ câu hỏi
              </Link>
            </div>
            <nav
              aria-label="Lối tắt học tập"
              className="mt-5 flex flex-wrap gap-x-1 text-sm"
            >
              <Link
                href="/history"
                className={buttonVariants({ variant: "ghost" })}
              >
                Lịch sử
              </Link>
              <Link
                href="/notes"
                className={buttonVariants({ variant: "ghost" })}
              >
                Ghi chú
              </Link>
              <Link
                href="/bookmarks"
                className={buttonVariants({ variant: "ghost" })}
              >
                Đã đánh dấu
              </Link>
              <a
                href={`${basePath}/quizforge-mau-import.txt`}
                download
                className={buttonVariants({ variant: "ghost" })}
              >
                File mẫu
              </a>
              <a
                href={`${basePath}/quizforge-mau-import.pdf`}
                download
                className={buttonVariants({ variant: "ghost" })}
              >
                Hướng dẫn PDF
              </a>
            </nav>
          </div>

          <div
            className="relative mx-auto hidden h-[23rem] w-full max-w-md select-none lg:block"
            aria-hidden="true"
          >
            <div className="study-float-slow absolute right-2 top-2 flex items-center gap-2 rounded-2xl border-2 border-primary/20 bg-card px-4 py-3 font-semibold text-primary shadow-lg shadow-primary/10">
              <Sparkles className="size-5" /> +1 kiến thức!
            </div>
            <div className="study-float absolute left-3 top-20 w-[82%] -rotate-3 rounded-[2rem] border-2 border-primary/20 bg-card p-6 shadow-xl shadow-primary/10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-bold text-primary">
                  CÂU HỎI 99
                </span>
                <Brain className="size-7 text-primary" />
              </div>
              <p className="mt-6 text-xl font-bold leading-snug">
                Hôm nay bạn có một ngày vui vẻ đúng không?
              </p>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border-2 border-primary bg-primary/10 p-3 font-semibold text-primary">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-4" />
                  </span>{" "}
                  Chắc chắn rồi!
                </div>
                <div className="rounded-xl border-2 border-border bg-background p-3 text-muted-foreground">
                  Sao mà không vui cho được!!!
                </div>
              </div>
            </div>
            <div className="study-wiggle absolute bottom-5 right-1 flex size-24 rotate-6 items-center justify-center rounded-[2rem] border-2 border-primary/20 bg-primary text-primary-foreground shadow-xl shadow-primary/20">
              <BookOpen className="size-11" />
            </div>
            <Pencil className="study-float-slow absolute bottom-10 left-0 size-10 -rotate-12 text-primary" />
          </div>
        </section>
        <HomeWorkspace />
        <section className="mt-20 grid gap-4 md:grid-cols-3">
          {steps.map(([number, title, description]) => (
            <article
              key={number}
              className="group rounded-2xl border border-primary/15 bg-card/85 p-5 shadow-sm transition-transform hover:-translate-y-1"
            >
              <p className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-sm font-bold text-primary transition-transform group-hover:-rotate-6">
                {number}
              </p>
              <h2 className="mt-5 text-xl font-bold">{title}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
