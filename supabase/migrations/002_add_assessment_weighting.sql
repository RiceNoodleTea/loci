-- Add weighting column to assessments table
alter table public.assessments
  add column if not exists weighting text;
