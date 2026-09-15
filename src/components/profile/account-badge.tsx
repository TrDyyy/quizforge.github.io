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
  if (!email) return <Link href="/profile" className="hidden px-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:block">Đăng nhập</Link>;
  return <Link href="/profile" title={email} className="hidden max-w-48 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium sm:inline-flex"><UserRound className="size-4 text-primary" /><span className="truncate">{email}</span></Link>;
}
