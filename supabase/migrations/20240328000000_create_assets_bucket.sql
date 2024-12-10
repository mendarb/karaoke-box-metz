-- Create a new storage bucket for assets
insert into storage.buckets (id, name)
values ('assets', 'assets')
on conflict (id) do nothing;

-- Set up storage policy to allow public access to assets
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'assets' );