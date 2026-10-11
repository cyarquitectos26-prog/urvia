-- Spatial inventory for City. Client demo uses lib/city/model.ts; server integration is future work.
alter table public.billboard_placements
  add column city_zone text,
  add column building text,
  add column facade text,
  add column screen_id text unique,
  add column size text check (size in ('mega','wide','corner','video')),
  add column visibility_score integer check (visibility_score between 0 and 100),
  add column orientation text,
  add column position double precision[] check (array_length(position,1) = 3),
  add column rotation double precision[] check (array_length(rotation,1) = 3),
  add column dimensions double precision[] check (array_length(dimensions,1) = 2);

insert into public.billboard_placements
(id,name,format,city_zone,building,facade,screen_id,size,visibility_score,orientation,position,rotation,dimensions) values
('city-main-001','Central Avenue / A01','mega','central-avenue','tower-1','street','A01','mega',98,'toward-avenue',ARRAY[-13.2,12.5,0.2]::double precision[],ARRAY[0,0,0]::double precision[],ARRAY[10,11]::double precision[]),
('city-main-002','Central Avenue / A02','wide','central-avenue','tower-2','street','A02','wide',94,'toward-avenue',ARRAY[13.2,10.8,0.2]::double precision[],ARRAY[0,0,0]::double precision[],ARRAY[9.8,6.8]::double precision[]),
('city-main-003','Central Avenue / A03','corner','central-avenue','avenue-gate','street','A03','corner',86,'toward-avenue',ARRAY[0,12,-13]::double precision[],ARRAY[0,0,0]::double precision[],ARRAY[13.5,5.8]::double precision[]),
('city-main-004','Central Avenue / A04','mega','central-avenue','tower-3','street','A04','mega',94,'toward-avenue',ARRAY[-5.65,11.5,-35]::double precision[],ARRAY[0,1.0471975511965976,0]::double precision[],ARRAY[8.2,7.2]::double precision[]),
('city-main-005','Central Avenue / A05','wide','central-avenue','tower-4','street','A05','wide',90,'toward-avenue',ARRAY[5.65,11.4,-35]::double precision[],ARRAY[0,-1.0471975511965976,0]::double precision[],ARRAY[7.8,6.4]::double precision[]),
('city-main-006','Central Avenue / A06','video','central-avenue','tower-4','street','A06','video',82,'toward-avenue',ARRAY[6.1,18.5,-40]::double precision[],ARRAY[0,-1.0471975511965976,0]::double precision[],ARRAY[5.9,7.8]::double precision[]),
('city-main-007','Central Avenue / A07','mega','central-avenue','tower-5','street','A07','mega',90,'toward-avenue',ARRAY[-5.65,12.5,-63]::double precision[],ARRAY[0,1.0471975511965976,0]::double precision[],ARRAY[8.2,7.2]::double precision[]),
('city-main-008','Central Avenue / A08','wide','central-avenue','tower-6','street','A08','wide',86,'toward-avenue',ARRAY[5.65,12.4,-63]::double precision[],ARRAY[0,-1.0471975511965976,0]::double precision[],ARRAY[7.8,6.4]::double precision[]),
('city-main-009','Central Avenue / A09','corner','central-avenue','tower-5','street','A09','corner',78,'toward-avenue',ARRAY[-6.1,19.5,-68]::double precision[],ARRAY[0,1.0471975511965976,0]::double precision[],ARRAY[5.9,3.8]::double precision[]),
('city-main-010','Central Avenue / A10','mega','central-avenue','tower-7','street','A10','mega',86,'toward-avenue',ARRAY[-5.65,10.5,-91]::double precision[],ARRAY[0,1.0471975511965976,0]::double precision[],ARRAY[8.2,7.2]::double precision[]),
('city-main-011','Central Avenue / A11','wide','central-avenue','tower-8','street','A11','wide',82,'toward-avenue',ARRAY[5.65,10.4,-91]::double precision[],ARRAY[0,-1.0471975511965976,0]::double precision[],ARRAY[7.8,6.4]::double precision[]),
('city-main-012','Central Avenue / A12','corner','central-avenue','tower-8','street','A12','corner',74,'toward-avenue',ARRAY[6.1,17.5,-96]::double precision[],ARRAY[0,-1.0471975511965976,0]::double precision[],ARRAY[5.9,3.8]::double precision[]),
('city-main-013','Central Avenue / A13','mega','central-avenue','tower-9','street','A13','mega',82,'toward-avenue',ARRAY[-5.65,11.5,-119]::double precision[],ARRAY[0,1.0471975511965976,0]::double precision[],ARRAY[8.2,7.2]::double precision[]),
('city-main-014','Central Avenue / A14','wide','central-avenue','tower-10','street','A14','wide',78,'toward-avenue',ARRAY[5.65,11.4,-119]::double precision[],ARRAY[0,-1.0471975511965976,0]::double precision[],ARRAY[7.8,6.4]::double precision[]),
('city-main-015','Central Avenue / A15','video','central-avenue','tower-9','street','A15','video',70,'toward-avenue',ARRAY[-6.1,18.5,-124]::double precision[],ARRAY[0,1.0471975511965976,0]::double precision[],ARRAY[5.9,7.8]::double precision[]),
('city-main-016','Central Avenue / A16','mega','central-avenue','tower-11','street','A16','mega',78,'toward-avenue',ARRAY[-5.65,12.5,-147]::double precision[],ARRAY[0,1.0471975511965976,0]::double precision[],ARRAY[8.2,7.2]::double precision[]),
('city-main-017','Central Avenue / A17','wide','central-avenue','tower-12','street','A17','wide',74,'toward-avenue',ARRAY[5.65,12.4,-147]::double precision[],ARRAY[0,-1.0471975511965976,0]::double precision[],ARRAY[7.8,6.4]::double precision[]),
('city-main-018','Central Avenue / A18','corner','central-avenue','tower-12','street','A18','corner',66,'toward-avenue',ARRAY[6.1,19.5,-152]::double precision[],ARRAY[0,-1.0471975511965976,0]::double precision[],ARRAY[5.9,3.8]::double precision[]),
('city-main-019','Central Avenue / A19','mega','central-avenue','tower-13','street','A19','mega',74,'toward-avenue',ARRAY[-5.65,10.5,-175]::double precision[],ARRAY[0,1.0471975511965976,0]::double precision[],ARRAY[8.2,7.2]::double precision[]),
('city-main-020','Central Avenue / A20','wide','central-avenue','tower-14','street','A20','wide',70,'toward-avenue',ARRAY[5.65,10.4,-175]::double precision[],ARRAY[0,-1.0471975511965976,0]::double precision[],ARRAY[7.8,6.4]::double precision[]),
('city-main-021','Central Avenue / A21','corner','central-avenue','tower-13','street','A21','corner',62,'toward-avenue',ARRAY[-6.1,17.5,-180]::double precision[],ARRAY[0,1.0471975511965976,0]::double precision[],ARRAY[5.9,3.8]::double precision[]);

alter table public.promotions add column city_screen_id text references public.billboard_placements(screen_id);
create unique index promotions_active_city_screen_idx on public.promotions(city_screen_id)
  where status = 'active' and city_screen_id is not null;

-- Analytics are accepted only by a trusted ingestion service, never directly from anonymous clients.
create table public.city_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  user_id uuid references public.profiles(id) on delete set null,
  promotion_id uuid references public.promotions(id) on delete set null,
  screen_id text references public.billboard_placements(screen_id),
  event_name text not null check (event_name in ('cityVisit','visitTime','billboardImpression','billboardViewTime','billboardClick','propertyOpen','save','chat','scheduledVisit')),
  value numeric,
  occurred_at timestamptz not null default now()
);
create index city_events_promotion_time_idx on public.city_events(promotion_id,occurred_at desc);
alter table public.city_events enable row level security;
create policy city_events_campaign_owner_read on public.city_events for select using (
  exists(select 1 from public.promotions p join public.campaigns c on c.id=p.campaign_id
    where p.id=promotion_id and c.owner_id=auth.uid())
);
-- Existing placements_read policy covers the public active inventory.
