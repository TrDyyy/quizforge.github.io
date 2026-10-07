"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CloudDownload,
  CloudUpload,
  Crown,
  Globe2,
  LogOut,
  Mail,
  Upload,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { db } from "@/features/storage/db";
import {
  pullFromSupabase,
  syncToSupabase,
} from "@/features/sync/sync-to-supabase";
import {
  getCurrentRole,
  publishQuestionSet,
  unpublishQuestionSet,
} from "@/features/sync/public-question-sets";
import type { QuestionSet } from "@/types/question";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.19-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.06v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.87A6 6 0 0 1 6.08 12c0-.65.11-1.28.32-1.87V7.51H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.49l3.34-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.01c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.94 5.51l3.34 2.62c.79-2.36 3-4.12 5.6-4.12Z"
      />
    </svg>
  );
}

export function AuthProfile() {
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadAccount = async () => {
    const { data } = await supabase.auth.getUser();
    setUserEmail(data.user?.email ?? "");
    setUserId(data.user?.id ?? "");
    if (data.user) {
      try {
        setRole(await getCurrentRole());
      } catch {
        setRole("user");
      }
      setSets(await db.questionSets.orderBy("updatedAt").reverse().toArray());
    } else {
      setRole("user");
      setSets([]);
    }
  };

  useEffect(() => {
    const restore = window.setTimeout(() => {
      void loadAccount();
    });
    const restoreFromHistory = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      setBusy(false);
      void loadAccount();
    };
    const { data } = supabase.auth.onAuthStateChange(() => {
      void loadAccount();
    });
    window.addEventListener("pageshow", restoreFromHistory);
    return () => {
      window.clearTimeout(restore);
      window.removeEventListener("pageshow", restoreFromHistory);
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    setBusy(true);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${basePath}/profile/`,
      },
    });
    setMessage(
      error
        ? error.message
        : "Đã gửi Magic Link. Hãy kiểm tra email để đăng nhập.",
    );
    setBusy(false);
  };
  const signInWithGoogle = async () => {
    setBusy(true);
    setMessage("");
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${basePath}/profile/`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) {
      setMessage(`Không thể đăng nhập Google: ${error.message}`);
      setBusy(false);
    }
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    setMessage("Đã đăng xuất.");
  };
  const sync = async () => {
    setBusy(true);
    try {
      const result = await syncToSupabase();
      setMessage(
        `Đã đồng bộ ${result.questionSets} bộ đề, ${result.sessions} phiên học và ${result.progress} tiến độ.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Không thể đồng bộ: ${error.message}`
          : "Không thể đồng bộ.",
      );
    }
    setBusy(false);
  };
  const pull = async () => {
    setBusy(true);
    try {
      const result = await pullFromSupabase();
      setMessage(
        `Đã tải ${result.questionSets} bộ đề, ${result.sessions} phiên học và ${result.progress} tiến độ từ cloud.`,
      );
      await loadAccount();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Không thể tải: ${error.message}`
          : "Không thể tải dữ liệu.",
      );
    }
    setBusy(false);
  };
  const publish = async (set: QuestionSet) => {
    setBusy(true);
    try {
      await publishQuestionSet(set);
      setMessage(`Đã đăng “${set.name}” cho mọi người.`);
      await loadAccount();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Không thể đăng bộ đề: ${error.message}`
          : "Không thể đăng bộ đề.",
      );
    }
    setBusy(false);
  };
  const unpublish = async (set: QuestionSet) => {
    setBusy(true);
    try {
      await unpublishQuestionSet(set.id);
      setMessage(`Đã gỡ “${set.name}” khỏi thư viện chung.`);
      await loadAccount();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Không thể gỡ bộ đề: ${error.message}`
          : "Không thể gỡ bộ đề.",
      );
    }
    setBusy(false);
  };

  const publishable = sets.filter((set) => !set.isPublic);
  const published = sets.filter(
    (set) => set.isPublic && set.ownerId === userId,
  );

  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm font-semibold text-primary">
        ← QuizForge
      </Link>
      <div className="mt-10 flex items-center gap-3">
        <UserRound className="size-9 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Hồ sơ học tập</h1>
          {role === "admin" && (
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              <Crown className="size-4" /> Quản trị viên
            </p>
          )}
        </div>
      </div>
      {userEmail ? (
        <section className="mt-7 rounded-2xl border border-primary/15 bg-primary/7 p-5">
          <p className="text-sm text-muted-foreground">Đang đăng nhập</p>
          <p className="mt-1 font-semibold">{userEmail}</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Dữ liệu local vẫn hoạt động offline. Khi có mạng, bạn có thể tải
            hoặc đồng bộ với tài khoản này.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button disabled={busy} onClick={() => void sync()}>
              <CloudUpload /> Đồng bộ cloud
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => void pull()}
            >
              <CloudDownload /> Tải từ cloud
            </Button>
            <Button variant="outline" onClick={() => void signOut()}>
              <LogOut /> Đăng xuất
            </Button>
          </div>
        </section>
      ) : (
        <section className="mt-7">
          <Button
            variant="outline"
            size="lg"
            className="w-full border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/5"
            disabled={busy}
            onClick={() => void signInWithGoogle()}
          >
            <GoogleIcon /> Tiếp tục với Google
          </Button>
          <div className="my-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-[.14em] text-muted-foreground">
              hoặc dùng Magic Link
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <p className="text-muted-foreground">
            Nhập email để nhận Magic Link. Không cần tạo mật khẩu.
          </p>
          <label className="mt-6 block text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ban@example.com"
            className="mt-2 h-11 w-full rounded-lg border border-input bg-card px-3 outline-none focus:border-primary"
          />
          <Button
            className="mt-4 w-full"
            disabled={!email || busy}
            onClick={() => void signIn()}
          >
            <Mail /> Gửi Magic Link
          </Button>
        </section>
      )}

      {userEmail && role === "admin" && (
        <section
          className="mt-10 border-t border-border pt-8"
          aria-labelledby="admin-title"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[.14em] text-primary">
                <Globe2 className="size-4" /> Thư viện chung
              </p>
              <h2 id="admin-title" className="mt-2 text-2xl font-bold">
                Đăng bộ đề cho mọi người
              </h2>
            </div>
            <Button
              variant="outline"
              render={<Link href="/import" />}
              nativeButton={false}
            >
              <Upload /> Nhập bộ đề mới
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Bộ đề đã đăng sẽ xuất hiện trong thư viện và màn luyện tập của tất
            cả người dùng, kể cả khi chưa đăng nhập.
          </p>
          <div className="mt-6 space-y-3">
            {published.map((set) => (
              <article
                key={set.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-success/30 bg-success-surface p-4"
              >
                <div>
                  <p className="font-semibold">{set.name}</p>
                  <p className="mt-1 text-sm text-success-foreground">
                    Đang công khai · {set.questions.length} câu
                  </p>
                </div>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => void unpublish(set)}
                >
                  Gỡ khỏi thư viện chung
                </Button>
              </article>
            ))}
            {publishable.map((set) => (
              <article
                key={set.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <p className="font-semibold">{set.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {set.questions.length} câu · chỉ có trên thiết bị này
                  </p>
                </div>
                <Button disabled={busy} onClick={() => void publish(set)}>
                  <Globe2 /> Đăng công khai
                </Button>
              </article>
            ))}
            {!sets.length && (
              <p className="rounded-xl border border-dashed border-primary/30 p-5 text-sm text-muted-foreground">
                Chưa có bộ đề local. Hãy nhập và lưu một bộ đề trước.
              </p>
            )}
          </div>
        </section>
      )}
      {message && (
        <p role="status" className="mt-5 text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </main>
  );
}
