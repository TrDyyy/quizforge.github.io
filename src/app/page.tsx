import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeControls } from "@/components/theme-controls";

const steps = [
  ["01", "Nhập tài liệu", "Paste nội dung hoặc chọn tệp TXT, Markdown, CSV, DOCX."],
  ["02", "Kiểm tra & sửa", "Preview kết quả parse và xử lý warning trước khi học."],
  ["03", "Làm quiz", "Luyện tập, đánh dấu và ôn lại các câu sai."],
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="aurora pointer-events-none absolute inset-0 opacity-60" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-bold tracking-tight">Quiz<span className="text-primary">Forge</span></Link>
        <div className="flex items-center gap-2">
          <Link href="/profile" className="hidden px-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:block">Đăng nhập</Link>
          <ThemeControls />
          <Link href="/import" className={buttonVariants()}>Tạo bộ câu hỏi</Link>
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pt-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Ôn tập theo cách của bạn</p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Biến tài liệu thành quiz để luyện thật sự.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Dán văn bản hoặc nhập file, kiểm tra câu hỏi đã parse, rồi bắt đầu ôn tập. Dữ liệu chỉ được lưu trên thiết bị này.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/study" className={buttonVariants({ size: "lg" })}>Bắt đầu luyện tập</Link>
          <Link href="/import" className={buttonVariants({ variant: "outline", size: "lg" })}>Nhập câu hỏi</Link>
          <Link href="/history" className={buttonVariants({ variant: "ghost", size: "lg" })}>Lịch sử học</Link>
        </div>
        <section className="mt-20 grid gap-4 md:grid-cols-3">
          {steps.map(([number, title, description]) => (
            <article key={number} className="border-t border-border pt-5">
              <p className="text-sm font-bold text-primary">{number}</p>
              <h2 className="mt-5 text-xl font-bold">{title}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
