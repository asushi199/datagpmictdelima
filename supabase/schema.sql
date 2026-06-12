create extension if not exists pgcrypto;

create table if not exists schools (
  code text primary key,
  name text not null,
  zone text not null default '',
  current_version_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact_versions (
  id uuid primary key default gen_random_uuid(),
  school_code text not null references schools(code) on delete cascade,
  school_name text not null,
  zone text not null default '',
  submitted_at timestamptz not null default now(),
  submitter_name text null,
  submitter_phone text null,
  source text null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists contact_roles (
  version_id uuid not null references contact_versions(id) on delete cascade,
  role text not null check (role in ('GPICT', 'DELIMA', 'GPM')),
  teacher_name text not null default '',
  phone text not null default '',
  primary key (version_id, role)
);

create table if not exists admin_actions (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  school_code text null references schools(code) on delete set null,
  version_id uuid null references contact_versions(id) on delete set null,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'schools_current_version_id_fkey'
  ) then
    alter table schools
      add constraint schools_current_version_id_fkey
      foreign key (current_version_id)
      references contact_versions(id)
      on delete set null;
  end if;
end;
$$;

create index if not exists contact_versions_school_code_idx
  on contact_versions(school_code, submitted_at desc);

create index if not exists schools_current_version_id_idx
  on schools(current_version_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists schools_set_updated_at on schools;
create trigger schools_set_updated_at
before update on schools
for each row execute function set_updated_at();

alter table schools enable row level security;
alter table contact_versions enable row level security;
alter table contact_roles enable row level security;
alter table admin_actions enable row level security;

drop policy if exists "public read schools" on schools;
create policy "public read schools"
on schools for select
to anon
using (true);

drop policy if exists "public read current versions" on contact_versions;
create policy "public read current versions"
on contact_versions for select
to anon
using (id in (select current_version_id from schools));

drop policy if exists "public read current roles" on contact_roles;
create policy "public read current roles"
on contact_roles for select
to anon
using (version_id in (select current_version_id from schools));
