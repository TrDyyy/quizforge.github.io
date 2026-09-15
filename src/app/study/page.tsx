import { Suspense } from "react";
import { StudySetup } from "@/components/study/study-setup";

export default function StudyPage() {
  return <Suspense fallback={<main className="mx-auto min-h-dvh max-w-3xl px-6 py-16 text-muted-foreground">Đang tải thiết lập phiên học…</main>}><StudySetup /></Suspense>;
}
