"use client";

import dynamic from "next/dynamic";

const AuthProfile = dynamic(
  () =>
    import("@/components/profile/auth-profile").then(
      (module) => module.AuthProfile,
    ),
  {
    ssr: false,
    loading: () => (
      <main className="mx-auto min-h-dvh max-w-3xl px-6 py-16 text-sm text-muted-foreground">
        Đang tải hồ sơ…
      </main>
    ),
  },
);

export default function ProfilePage() {
  return <AuthProfile />;
}
