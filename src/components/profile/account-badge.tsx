"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export function AccountBadge() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setEmail(session?.user.email ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);
  if (!email) return <Link href="/profile" aria-label="Đăng nhập" className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:gap-2 sm:text-sm"><UserRound className="size-4 text-primary" /><span>Đăng nhập</span></Link>;
  return <Link href="/profile" title={email} aria-label={`Tài khoản ${email}`} className="inline-flex max-w-48 items-center gap-1 rounded-full border border-border bg-card px-2 py-1.5 text-xs font-medium sm:gap-2 sm:px-3 sm:text-sm"><UserRound className="size-4 text-primary" /><span className="sm:hidden">Hồ sơ</span><span className="hidden truncate sm:inline">{email}</span></Link>;
}
