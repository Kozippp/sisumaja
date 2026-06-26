-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the articles table (blogi / sisuartiklid AI-nähtavuse jaoks)
create table if not exists public.articles (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  slug text not null unique,
  title text not null,
  title_en text,
  excerpt text,
  excerpt_en text,
  content text,
  content_en text,
  cover_image_url text,
  is_published boolean default false,
  published_at timestamp with time zone
);

-- Index for fast published lookups
create index if not exists articles_published_idx
  on public.articles (is_published, published_at desc);

-- Enable Row Level Security
alter table public.articles enable row level security;

-- Public can read only published articles
create policy "Published articles are viewable by everyone"
  on public.articles for select
  using (is_published = true);

-- Authenticated (admin) can do everything, incl. read drafts
create policy "Authenticated users can manage all articles"
  on public.articles for all
  using (auth.role() = 'authenticated');

-- Storage bucket for article cover images
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

create policy "Article images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'article-images' );

create policy "Authenticated users can upload article images"
  on storage.objects for insert
  with check ( bucket_id = 'article-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can update article images"
  on storage.objects for update
  with check ( bucket_id = 'article-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete article images"
  on storage.objects for delete
  using ( bucket_id = 'article-images' and auth.role() = 'authenticated' );
