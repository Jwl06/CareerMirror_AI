-- CareerMirror AI: roadmap task progress tracking on assessments

alter table public.assessments
  add column if not exists roadmap_progress jsonb;

comment on column public.assessments.roadmap_progress is
  'User progress on the 16-week roadmap: { startedAt, currentWeek, completedTasks[] }';
