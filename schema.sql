create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  description text,
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table bookmarks enable row level security;

create policy "Users can select their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

create policy "Users can update their own bookmarks"
  on bookmarks for update
  using (auth.uid() = user_id);

create table categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table bookmarks add column category_id uuid references categories(id) on delete set null;

alter table categories enable row level security;

create policy "Users can select their own categories"
  on categories for select
  using (auth.uid() = user_id);

create policy "Users can insert their own categories"
  on categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own categories"
  on categories for update
  using (auth.uid() = user_id);

create policy "Users can delete their own categories"
  on categories for delete
  using (auth.uid() = user_id);

alter publication supabase_realtime add table categories;
