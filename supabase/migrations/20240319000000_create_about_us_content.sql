-- Create moddatetime function if it doesn't exist
create or replace function public.moddatetime()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

create table if not exists public.about_us_content (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS policies
alter table public.about_us_content enable row level security;

create policy "Allow admin update"
  on public.about_us_content
  for update
  using (auth.uid() in (
    select user_id
    from public.user_roles
    where role = 'admin'
  ));

create policy "Allow admin insert"
  on public.about_us_content
  for insert
  with check (auth.uid() in (
    select user_id
    from public.user_roles
    where role = 'admin'
  ));

create policy "Allow admin delete"
  on public.about_us_content
  for delete
  using (auth.uid() in (
    select user_id
    from public.user_roles
    where role = 'admin'
  ));

create policy "Allow all view"
  on public.about_us_content
  for select
  using (true);

-- Create trigger for updated_at
create trigger handle_updated_at before update on public.about_us_content
  for each row execute function moddatetime(); 