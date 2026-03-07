-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the retention_images table
create table if not exists public.retention_images (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text not null,
  is_active boolean default true,
  display_order integer default 0
);

-- Enable Row Level Security
alter table public.retention_images enable row level security;

-- Create policies
create policy "Active retention images are viewable by everyone"
  on public.retention_images for select
  using (is_active = true);

create policy "Authenticated users can manage all retention images"
  on public.retention_images for all
  using (auth.role() = 'authenticated');

-- Create storage bucket for retention images
insert into storage.buckets (id, name, public)
values ('retention-images', 'retention-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Retention images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'retention-images' );

create policy "Authenticated users can upload retention images"
  on storage.objects for insert
  with check ( bucket_id = 'retention-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can update retention images"
  on storage.objects for update
  with check ( bucket_id = 'retention-images' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete retention images"
  on storage.objects for delete
  using ( bucket_id = 'retention-images' and auth.role() = 'authenticated' );
