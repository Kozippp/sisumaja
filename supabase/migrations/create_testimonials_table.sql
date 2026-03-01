-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the testimonials table
create table if not exists public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  type text not null check (type in ('text', 'image')),
  content text,
  author_name text,
  author_role text,
  author_company text,
  image_url text,
  status text default 'draft' check (status in ('draft', 'published')),
  "order" integer default 0
);

-- Enable Row Level Security
alter table public.testimonials enable row level security;

-- Create policies
create policy "Public testimonials are viewable by everyone"
  on public.testimonials for select
  using (status = 'published');

create policy "Authenticated users can manage all testimonials"
  on public.testimonials for all
  using (auth.role() = 'authenticated');

-- Create storage bucket for testimonials
insert into storage.buckets (id, name, public)
values ('testimonials', 'testimonials', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Testimonial images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'testimonials' );

create policy "Authenticated users can upload testimonial images"
  on storage.objects for insert
  with check ( bucket_id = 'testimonials' and auth.role() = 'authenticated' );

create policy "Authenticated users can update testimonial images"
  on storage.objects for update
  with check ( bucket_id = 'testimonials' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete testimonial images"
  on storage.objects for delete
  using ( bucket_id = 'testimonials' and auth.role() = 'authenticated' );
