-- Run once in Supabase Dashboard → SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.question_sets (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_set_id uuid references public.question_sets(id) on delete set null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.question_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_set_id uuid not null references public.question_sets(id) on delete cascade,
  question_id text not null,
  correct_count integer not null default 0,
  incorrect_count integer not null default 0,
  bookmarked boolean not null default false,
  note text,
  last_answered_at timestamptz,
  primary key (user_id, question_set_id, question_id)
);

alter table public.question_progress add column if not exists note text;

alter table public.profiles enable row level security;
alter table public.question_sets enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.question_progress enable row level security;

create policy "users manage their profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "users manage their question sets" on public.question_sets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage their sessions" on public.quiz_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage their progress" on public.question_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
