alter table public.testimonials 
add column if not exists show_on_mobile boolean default false;

-- Uuenda olemasolevaid (valikuline, paneb esimesed 5 mobiilis nähtavaks)
with numbered as (
  select id, row_number() over (order by created_at desc) as rn
  from public.testimonials
  where status = 'published'
)
update public.testimonials
set show_on_mobile = true
where id in (select id from numbered where rn <= 5);
