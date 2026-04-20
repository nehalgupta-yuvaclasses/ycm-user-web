alter table public.students
  add column if not exists name text,
  add column if not exists phone text,
  add column if not exists firebase_uid text,
  add column if not exists aspirant_type text;

create unique index if not exists students_phone_key on public.students (phone);
create unique index if not exists students_firebase_uid_key on public.students (firebase_uid);
