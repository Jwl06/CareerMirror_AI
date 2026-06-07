-- CareerMirror AI: assessments table for career profile submissions and AI analysis results

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'analyzing', 'completed', 'failed')),
  profile jsonb not null,
  analysis jsonb,
  readiness_score integer
    check (readiness_score is null or (readiness_score >= 0 and readiness_score <= 100)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assessments_user_id_idx on public.assessments (user_id);
create index if not exists assessments_created_at_idx on public.assessments (created_at desc);

alter table public.assessments enable row level security;

create policy "Users can view own assessments"
  on public.assessments
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own assessments"
  on public.assessments
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own assessments"
  on public.assessments
  for update
  using (auth.uid() = user_id);
