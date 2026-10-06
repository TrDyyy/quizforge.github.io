-- Run in Supabase Dashboard → SQL Editor. Safe to rerun.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles add column if not exists role text not null default 'user';
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table public.profiles add constraint profiles_role_check check (role in ('user', 'admin'));
  end if;
end $$;

create table if not exists public.question_sets (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  questions jsonb not null default '[]'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.question_sets add column if not exists is_public boolean not null default false;

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

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();
insert into public.profiles (id) select id from auth.users on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.question_sets enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.question_progress enable row level security;

drop policy if exists "users manage their profile" on public.profiles;
drop policy if exists "users read their profile" on public.profiles;
drop policy if exists "users create their profile" on public.profiles;
create policy "users read their profile" on public.profiles for select using (auth.uid() = id);
create policy "users create their profile" on public.profiles for insert with check (auth.uid() = id and role = 'user');

drop policy if exists "users manage their question sets" on public.question_sets;
drop policy if exists "everyone reads public question sets" on public.question_sets;
drop policy if exists "owners read private question sets" on public.question_sets;
drop policy if exists "owners create question sets" on public.question_sets;
drop policy if exists "owners update question sets" on public.question_sets;
drop policy if exists "owners delete question sets" on public.question_sets;
create policy "everyone reads public question sets" on public.question_sets for select using (is_public = true);
create policy "owners read private question sets" on public.question_sets for select using (auth.uid() = user_id);
create policy "owners create question sets" on public.question_sets for insert
  with check (auth.uid() = user_id and (is_public = false or public.is_admin()));
create policy "owners update question sets" on public.question_sets for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id and (is_public = false or public.is_admin()));
create policy "owners delete question sets" on public.question_sets for delete using (auth.uid() = user_id);

drop policy if exists "users manage their sessions" on public.quiz_sessions;
create policy "users manage their sessions" on public.quiz_sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "users manage their progress" on public.question_progress;
create policy "users manage their progress" on public.question_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- After the admin has logged in once, replace the email and run:
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'email@example.com');
