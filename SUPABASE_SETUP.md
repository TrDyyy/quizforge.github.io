# Supabase setup

QuizForge uses a browser client so it stays compatible with GitHub Pages static hosting. Do not add Next middleware or server-cookie helpers while `output: "export"` is enabled.

1. Open Supabase Dashboard → SQL Editor and run [schema.sql](./supabase/schema.sql).
2. In Authentication → URL Configuration, add these redirect URLs:
   - `http://localhost:3000/profile/`
   - Your final GitHub Pages URL, e.g. `https://your-name.github.io/quizforge/profile/`
3. Use `/profile` to sign in with Google or request a Magic Link.
4. Keep `.env.local` local. Git ignores it. In the GitHub repository, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as Actions secrets; the Pages workflow reads them at build time.

After signing in at `/profile`, choose **Đồng bộ cloud** to upload the device's question sets, completed sessions, learning progress and bookmarks. Choose **Tải từ cloud** on another device to merge those records back into IndexedDB. For conflicts, the newer question set wins; learning counts use the higher value and bookmarks are kept when either copy is bookmarked.

## Admin and shared question sets

The schema includes `user` and `admin` roles. Shared question sets are readable by everyone, including visitors who are not signed in. Only an admin can mark a set as public; this is enforced by Supabase RLS rather than only by the interface.

1. Run the latest [schema.sql](./supabase/schema.sql), including when upgrading an existing project.
2. Sign in once through `/profile` with the email that will be the admin. This creates its profile row.
3. In SQL Editor, grant the role (replace the example email):

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'admin@example.com'
);
```

4. Reload `/profile`. The **Quản trị viên** section can publish any set stored on that device or remove one from the shared library.

RLS policies ensure users only write their own profile data, sets, sessions and progress. Public sets are read-only to everyone except their admin owner.

## Google sign-in

Magic Link remains available as a fallback. To enable the Google button:

1. In Google Cloud Console → Google Auth Platform, create an OAuth client with application type **Web application**.
2. Add the app origins under **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - Your production origin, e.g. `https://your-name.github.io`
3. In Supabase Dashboard → Authentication → Providers → Google, copy the callback URL shown there. Add that exact URL to Google under **Authorized redirect URIs**. It normally looks like `https://<project-ref>.supabase.co/auth/v1/callback`.
4. Copy the Google Client ID and Client Secret into the Google provider settings in Supabase, then enable the provider.
5. In Supabase → Authentication → URL Configuration, keep these application redirect URLs in the allow list:
   - `http://localhost:3000/profile/`
   - `https://your-name.github.io/quizforge/profile/`

The Google Client Secret belongs only in the Supabase provider configuration. Do not add it to `.env.local`, GitHub Actions, or client-side code.
