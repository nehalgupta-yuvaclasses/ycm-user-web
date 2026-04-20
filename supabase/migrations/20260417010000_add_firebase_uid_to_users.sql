alter table public.users
  drop constraint if exists users_id_fkey;

alter table public.users
  alter column id set default gen_random_uuid();

alter table public.users
  add column if not exists firebase_uid text,
  add column if not exists phone text,
  add column if not exists settings jsonb not null default '{}'::jsonb;

update public.users
set firebase_uid = coalesce(firebase_uid, id::text)
where firebase_uid is null;

alter table public.users
  alter column firebase_uid set not null,
  alter column email drop not null;

create unique index if not exists users_firebase_uid_key on public.users (firebase_uid);
