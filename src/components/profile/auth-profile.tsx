"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloudUpload, LogOut, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { syncToSupabase } from "@/features/sync/sync-to-supabase";

export function AuthProfile() {
  const [email, setEmail] = useState(""); const [userEmail, setUserEmail] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? "")); const { data } = supabase.auth.onAuthStateChange((_event, session) => setUserEmail(session?.user.email ?? "")); return () => data.subscription.unsubscribe(); }, []);
  const signIn = async () => { setBusy(true); const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""; const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}${basePath}/profile/` } }); setMessage(error ? error.message : "Đã gửi Magic Link. Hãy kiểm tra email để đăng nhập."); setBusy(false); };
  const signOut = async () => { await supabase.auth.signOut(); setMessage("Đã đăng xuất."); };
  const sync = async () => { setBusy(true); try { const result = await syncToSupabase(); setMessage(`Đã đồng bộ ${result.questionSets} bộ đề, ${result.sessions} phiên học và ${result.progress} tiến độ.`); } catch (error) { setMessage(error instanceof Error ? `Không thể đồng bộ: ${error.message}` : "Không thể đồng bộ."); } setBusy(false); };
  return <main className="mx-auto min-h-dvh max-w-lg px-6 py-16"><Link href="/" className="text-sm font-semibold text-primary">← QuizForge</Link><UserRound className="mt-10 size-9 text-primary" /><h1 className="mt-4 text-3xl font-bold">Hồ sơ học tập</h1>{userEmail ? <section className="mt-7 border-l-2 border-primary bg-muted p-5"><p className="text-sm text-muted-foreground">Đang đăng nhập</p><p className="mt-1 font-semibold">{userEmail}</p><p className="mt-4 text-sm leading-6 text-muted-foreground">Bộ đề và lịch sử local vẫn hoạt động offline. Khi có mạng, bạn có thể đồng bộ chúng vào tài khoản này.</p><div className="mt-5 flex flex-wrap gap-3"><Button disabled={busy} onClick={() => void sync()}><CloudUpload /> Đồng bộ cloud</Button><Button variant="outline" onClick={() => void signOut()}><LogOut /> Đăng xuất</Button></div></section> : <section className="mt-7"><p className="text-muted-foreground">Nhập email để nhận Magic Link. Không cần tạo mật khẩu.</p><label className="mt-6 block text-sm font-semibold" htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ban@example.com" className="mt-2 h-11 w-full rounded-lg border border-input bg-card px-3 outline-none focus:border-primary" /><Button className="mt-4 w-full" disabled={!email || busy} onClick={() => void signIn()}><Mail /> Gửi Magic Link</Button></section>}{message && <p role="status" className="mt-5 text-sm text-muted-foreground">{message}</p>}</main>;
}
