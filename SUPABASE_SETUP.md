# Supabase setup

QuizForge uses a browser client so it stays compatible with GitHub Pages static hosting. Do not add Next middleware or server-cookie helpers while `output: "export"` is enabled.

1. Open Supabase Dashboard → SQL Editor and run [schema.sql](./supabase/schema.sql).
2. In Authentication → URL Configuration, add these redirect URLs:
   - `http://localhost:3000/profile/`
   - Your final GitHub Pages URL, e.g. `https://your-name.github.io/quizforge/profile/`
3. Use `/profile` to request a Magic Link.
4. Keep `.env.local` local. Git ignores it. In the GitHub repository, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as Actions secrets; the Pages workflow reads them at build time.

After signing in at `/profile`, choose **Đồng bộ cloud** to upload the device's question sets, completed sessions, learning progress and bookmarks. Download/merge sync is intentionally the next step, so local work is never silently overwritten.

RLS policies in the schema ensure a signed-in person only reads and writes their own profile, question sets, sessions and learning progress.
