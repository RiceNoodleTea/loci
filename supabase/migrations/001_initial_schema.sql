-- Loci Study App - Initial Schema
-- Run this in the Supabase SQL editor to set up the database

-- ══════════════════════════════════════
-- Core Tables
-- ══════════════════════════════════════

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Folders
create table if not exists public.folders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  parent_folder_id uuid references public.folders on delete set null,
  created_at timestamptz not null default now()
);

alter table public.folders enable row level security;
create policy "Users manage own folders" on public.folders
  for all using (auth.uid() = user_id);

-- Notes
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null default 'Untitled',
  content jsonb,
  folder_id uuid references public.folders on delete set null,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notes enable row level security;
create policy "Users manage own notes" on public.notes
  for all using (auth.uid() = user_id);

create index idx_notes_user on public.notes (user_id, updated_at desc);

-- ══════════════════════════════════════
-- Study Tools Tables
-- ══════════════════════════════════════

create table if not exists public.decks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  icon text default '📚',
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.decks enable row level security;
create policy "Users manage own decks" on public.decks
  for all using (auth.uid() = user_id);
create policy "Users can view public decks" on public.decks
  for select using (is_public = true);

create table if not exists public.flashcards (
  id uuid default gen_random_uuid() primary key,
  deck_id uuid references public.decks on delete cascade not null,
  front text not null,
  back text not null,
  ease_factor real not null default 2.5,
  interval integer not null default 0,
  repetitions integer not null default 0,
  next_review_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.flashcards enable row level security;
create policy "Users manage flashcards through decks" on public.flashcards
  for all using (
    exists (select 1 from public.decks where decks.id = flashcards.deck_id and decks.user_id = auth.uid())
  );

create table if not exists public.quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

alter table public.quizzes enable row level security;
create policy "Users manage own quizzes" on public.quizzes
  for all using (auth.uid() = user_id);

create table if not exists public.quiz_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references public.quizzes on delete cascade not null,
  question_text text not null,
  question_type text not null check (question_type in ('multiple_choice', 'short_answer', 'true_false')),
  options jsonb,
  correct_answer text not null,
  sort_order integer not null default 0
);

alter table public.quiz_questions enable row level security;
create policy "Users manage quiz questions through quizzes" on public.quiz_questions
  for all using (
    exists (select 1 from public.quizzes where quizzes.id = quiz_questions.quiz_id and quizzes.user_id = auth.uid())
  );

create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references public.quizzes on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  score integer not null,
  total integer not null,
  completed_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;
create policy "Users manage own attempts" on public.quiz_attempts
  for all using (auth.uid() = user_id);

-- ══════════════════════════════════════
-- Widget Tables
-- ══════════════════════════════════════

create table if not exists public.todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  text text not null,
  is_completed boolean not null default false,
  due_date date,
  created_at timestamptz not null default now()
);

alter table public.todos enable row level security;
create policy "Users manage own todos" on public.todos
  for all using (auth.uid() = user_id);

create table if not exists public.assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  subject text,
  due_date timestamptz not null,
  location text,
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.assessments enable row level security;
create policy "Users manage own assessments" on public.assessments
  for all using (auth.uid() = user_id);

create table if not exists public.study_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  room_id uuid,
  duration_seconds integer not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

alter table public.study_sessions enable row level security;
create policy "Users manage own sessions" on public.study_sessions
  for all using (auth.uid() = user_id);

create table if not exists public.widget_layouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  layout jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.widget_layouts enable row level security;
create policy "Users manage own widget layout" on public.widget_layouts
  for all using (auth.uid() = user_id);

-- ══════════════════════════════════════
-- Socials Tables
-- ══════════════════════════════════════

create table if not exists public.groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  invite_code text not null unique,
  created_by uuid references auth.users on delete set null,
  min_members integer not null default 3,
  created_at timestamptz not null default now()
);

alter table public.groups enable row level security;
create policy "Group members can view group" on public.groups
  for select using (
    exists (select 1 from public.group_members where group_members.group_id = groups.id and group_members.user_id = auth.uid())
  );
create policy "Authenticated users can create groups" on public.groups
  for insert with check (auth.uid() = created_by);
create policy "Anyone can view groups for discovery" on public.groups
  for select using (true);

create table if not exists public.group_members (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

alter table public.group_members enable row level security;
create policy "Members can view group members" on public.group_members
  for select using (
    exists (select 1 from public.group_members gm where gm.group_id = group_members.group_id and gm.user_id = auth.uid())
  );
create policy "Users can join groups" on public.group_members
  for insert with check (auth.uid() = user_id);
create policy "Users can leave groups" on public.group_members
  for delete using (auth.uid() = user_id);

create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;
create policy "Group members can view messages" on public.messages
  for select using (
    exists (select 1 from public.group_members where group_members.group_id = messages.group_id and group_members.user_id = auth.uid())
  );
create policy "Group members can send messages" on public.messages
  for insert with check (
    exists (select 1 from public.group_members where group_members.group_id = messages.group_id and group_members.user_id = auth.uid())
  );

create index idx_messages_group on public.messages (group_id, created_at desc);

-- ══════════════════════════════════════
-- Study Room Tables
-- ══════════════════════════════════════

create table if not exists public.study_rooms (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups on delete cascade not null,
  created_by uuid references auth.users on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  is_active boolean not null default true
);

alter table public.study_rooms enable row level security;
create policy "Group members can manage study rooms" on public.study_rooms
  for all using (
    exists (select 1 from public.group_members where group_members.group_id = study_rooms.group_id and group_members.user_id = auth.uid())
  );

-- Link study_sessions to study_rooms
alter table public.study_sessions
  add constraint fk_study_session_room foreign key (room_id) references public.study_rooms(id) on delete set null;

create table if not exists public.study_room_participants (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references public.study_rooms on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  joined_at timestamptz not null default now(),
  left_at timestamptz
);

alter table public.study_room_participants enable row level security;
create policy "Group members can see participants" on public.study_room_participants
  for all using (
    exists (
      select 1 from public.study_rooms sr
      join public.group_members gm on gm.group_id = sr.group_id
      where sr.id = study_room_participants.room_id and gm.user_id = auth.uid()
    )
  );

-- ══════════════════════════════════════
-- Particle System Tables
-- ══════════════════════════════════════

create table if not exists public.particle_inventory (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups on delete cascade not null unique,
  up_quarks integer not null default 0,
  down_quarks integer not null default 0,
  protons integer not null default 0,
  neutrons integer not null default 0,
  electrons integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.particle_inventory enable row level security;
create policy "Group members can view/update inventory" on public.particle_inventory
  for all using (
    exists (select 1 from public.group_members where group_members.group_id = particle_inventory.group_id and group_members.user_id = auth.uid())
  );

create table if not exists public.particle_events (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  event_type text not null check (event_type in ('solo_study', 'pair_study', 'quiz_complete', 'flashcard_complete')),
  particle_earned text not null check (particle_earned in ('up_quark', 'down_quark', 'proton', 'neutron', 'electron')),
  source_session_id uuid,
  created_at timestamptz not null default now()
);

alter table public.particle_events enable row level security;
create policy "Group members can view particle events" on public.particle_events
  for select using (
    exists (select 1 from public.group_members where group_members.group_id = particle_events.group_id and group_members.user_id = auth.uid())
  );
create policy "Group members can create particle events" on public.particle_events
  for insert with check (auth.uid() = user_id);

create table if not exists public.atoms (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups on delete cascade not null,
  element_symbol text not null,
  element_name text not null,
  atomic_number integer not null,
  protons_used integer not null,
  neutrons_used integer not null,
  electrons_used integer not null,
  built_at timestamptz not null default now(),
  built_week date not null
);

alter table public.atoms enable row level security;
create policy "Group members can manage atoms" on public.atoms
  for all using (
    exists (select 1 from public.group_members where group_members.group_id = atoms.group_id and group_members.user_id = auth.uid())
  );

create table if not exists public.molecules (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups on delete cascade not null,
  formula text not null,
  name text not null,
  atom_ids uuid[] not null default '{}',
  fusion_session_id uuid references public.study_rooms on delete set null,
  built_at timestamptz not null default now(),
  built_week date not null
);

alter table public.molecules enable row level security;
create policy "Group members can manage molecules" on public.molecules
  for all using (
    exists (select 1 from public.group_members where group_members.group_id = molecules.group_id and group_members.user_id = auth.uid())
  );

create table if not exists public.element_votes (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  week_start date not null,
  element_symbol text not null,
  voted_at timestamptz not null default now(),
  unique (group_id, user_id, week_start)
);

alter table public.element_votes enable row level security;
create policy "Group members can manage votes" on public.element_votes
  for all using (
    exists (select 1 from public.group_members where group_members.group_id = element_votes.group_id and group_members.user_id = auth.uid())
  );

create table if not exists public.weekly_competitions (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups on delete cascade not null,
  week_start date not null,
  winning_molecule_id uuid references public.molecules on delete set null,
  total_particles_earned integer not null default 0,
  atoms_built integer not null default 0,
  created_at timestamptz not null default now(),
  unique (group_id, week_start)
);

alter table public.weekly_competitions enable row level security;
create policy "Group members can view competitions" on public.weekly_competitions
  for all using (
    exists (select 1 from public.group_members where group_members.group_id = weekly_competitions.group_id and group_members.user_id = auth.uid())
  );

-- ══════════════════════════════════════
-- Realtime
-- ══════════════════════════════════════

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.particle_events;
alter publication supabase_realtime add table public.particle_inventory;
