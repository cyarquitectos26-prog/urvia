-- Preparación para conectar la demo a Supabase. Ejecutar con Supabase CLI.
create extension if not exists pgcrypto;
create type public.user_role as enum ('buyer','owner','agent','agency','admin');
create type public.property_status as enum ('available','reserved','sold','rented','expired','unverified');
create type public.property_operation as enum ('buy','rent');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  name text not null,
  avatar_url text,
  bio text,
  role public.user_role not null default 'buyer',
  created_at timestamptz not null default now()
);
create table public.agencies (id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, logo_url text, verified_at timestamptz);
create table public.agents (profile_id uuid primary key references public.profiles(id) on delete cascade, agency_id uuid references public.agencies(id), verified_at timestamptz, specialties text[] not null default '{}', rating numeric(2,1) not null default 0);
create table public.properties (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id), agent_id uuid references public.agents(profile_id), slug text not null unique,
  title text not null, description text not null default '', operation public.property_operation not null, type text not null,
  price numeric(14,2) not null check(price > 0), currency char(3) not null check(currency in ('USD','PEN')),
  area_m2 numeric(10,2) not null check(area_m2 > 0), bedrooms int not null default 0, bathrooms int not null default 0, parking int not null default 0,
  district text not null, city text not null default 'Lima', address text, latitude numeric(10,7), longitude numeric(10,7), amenities text[] not null default '{}',
  status public.property_status not null default 'unverified', verified_at timestamptz, published_at timestamptz default now(), updated_at timestamptz not null default now()
);
create table public.property_media (id uuid primary key default gen_random_uuid(), property_id uuid not null references public.properties(id) on delete cascade, url text not null, media_type text not null check(media_type in ('image','video','floorplan','tour')), alt_text text not null default '', sort_order int not null default 0);
create table public.property_price_history (id uuid primary key default gen_random_uuid(), property_id uuid not null references public.properties(id) on delete cascade, price numeric(14,2) not null, currency char(3) not null, recorded_at timestamptz not null default now());
create table public.posts (id uuid primary key default gen_random_uuid(), author_id uuid not null references public.profiles(id), property_id uuid references public.properties(id), body text not null, image_url text, created_at timestamptz not null default now());
create table public.videos (id uuid primary key default gen_random_uuid(), author_id uuid not null references public.profiles(id), property_id uuid references public.properties(id), title text not null, video_url text not null, cover_url text, created_at timestamptz not null default now());
create table public.likes (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, target_type text not null check(target_type in ('post','video','property')), target_id uuid not null, created_at timestamptz not null default now(), unique(user_id,target_type,target_id));
create table public.comments (id uuid primary key default gen_random_uuid(), author_id uuid not null references public.profiles(id), post_id uuid references public.posts(id) on delete cascade, video_id uuid references public.videos(id) on delete cascade, body text not null, created_at timestamptz not null default now(), check((post_id is not null) <> (video_id is not null)));
create table public.follows (id uuid primary key default gen_random_uuid(), follower_id uuid not null references public.profiles(id) on delete cascade, target_type text not null check(target_type in ('agent','user','agency','district')), target_id text not null, created_at timestamptz not null default now(), unique(follower_id,target_type,target_id));
create table public.collections (id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade, name text not null, description text, collaborative boolean not null default false, created_at timestamptz not null default now());
create table public.collection_items (collection_id uuid not null references public.collections(id) on delete cascade, property_id uuid not null references public.properties(id) on delete cascade, added_at timestamptz not null default now(), primary key(collection_id,property_id));
create table public.conversations (id uuid primary key default gen_random_uuid(), participant_ids uuid[] not null, property_id uuid references public.properties(id), updated_at timestamptz not null default now(), check(array_length(participant_ids,1) >= 2));
create table public.messages (id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.conversations(id) on delete cascade, sender_id uuid not null references public.profiles(id), body text not null, sent_at timestamptz not null default now());
create table public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, title text not null, body text not null, href text, read_at timestamptz, created_at timestamptz not null default now());
create table public.viewing_appointments (id uuid primary key default gen_random_uuid(), property_id uuid not null references public.properties(id), user_id uuid not null references public.profiles(id), scheduled_at timestamptz not null, status text not null default 'requested' check(status in ('requested','confirmed','cancelled')), created_at timestamptz not null default now());
create table public.campaigns (id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id), name text not null, created_at timestamptz not null default now());
create table public.billboard_placements (id text primary key, name text not null, format text not null, active boolean not null default true);
create table public.promotions (id uuid primary key default gen_random_uuid(), campaign_id uuid not null references public.campaigns(id) on delete cascade, property_id uuid references public.properties(id), placement_id text not null references public.billboard_placements(id), objective text not null, budget_pen numeric(12,2) not null check(budget_pen > 0), duration_days int not null check(duration_days > 0), status text not null default 'draft' check(status in ('draft','active','paused','complete')), created_at timestamptz not null default now());
create table public.promotion_analytics (promotion_id uuid primary key references public.promotions(id) on delete cascade, impressions bigint not null default 0, views bigint not null default 0, clicks bigint not null default 0, saves bigint not null default 0, chats bigint not null default 0, visits bigint not null default 0, cost_pen numeric(12,2) not null default 0, updated_at timestamptz not null default now());
insert into public.billboard_placements(id,name,format) values ('home_hero','Home hero','wide'),('feed_standard','Feed','standard'),('feed_wide','Feed wide','wide'),('explore_grid','Explorar','grid'),('district_hero','Distrito','wide'),('video_break','Videos','vertical'),('city_premium','City premium','hero'),('map_overlay','Mapa','compact'),('agent_recommendation','Agente','standard');

create index properties_discovery_idx on public.properties(status,operation,district,type,price);
create index posts_author_time_idx on public.posts(author_id,created_at desc);
create index messages_conversation_time_idx on public.messages(conversation_id,sent_at);
create index notifications_user_time_idx on public.notifications(user_id,created_at desc);
create index promotions_campaign_idx on public.promotions(campaign_id);

alter table public.profiles enable row level security;
alter table public.agencies enable row level security;
alter table public.agents enable row level security;
alter table public.properties enable row level security;
alter table public.property_media enable row level security;
alter table public.property_price_history enable row level security;
alter table public.posts enable row level security;
alter table public.videos enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.follows enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.viewing_appointments enable row level security;
alter table public.campaigns enable row level security;
alter table public.promotions enable row level security;
alter table public.billboard_placements enable row level security;
alter table public.promotion_analytics enable row level security;

create policy profiles_read on public.profiles for select using (true);
create policy profiles_insert on public.profiles for insert with check (id = auth.uid());
create policy profiles_update on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy agencies_read on public.agencies for select using (true);
create policy agents_read on public.agents for select using (true);
create policy agents_manage on public.agents for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy properties_read on public.properties for select using (status in ('available','reserved','sold','rented') or owner_id = auth.uid());
create policy properties_manage on public.properties for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy media_read on public.property_media for select using (exists(select 1 from public.properties p where p.id=property_id and (p.status in ('available','reserved','sold','rented') or p.owner_id=auth.uid())));
create policy media_manage on public.property_media for all using (exists(select 1 from public.properties p where p.id=property_id and p.owner_id=auth.uid())) with check (exists(select 1 from public.properties p where p.id=property_id and p.owner_id=auth.uid()));
create policy history_read on public.property_price_history for select using (exists(select 1 from public.properties p where p.id=property_id and (p.status in ('available','reserved','sold','rented') or p.owner_id=auth.uid())));
create policy posts_read on public.posts for select using (true);
create policy posts_manage on public.posts for all using (author_id=auth.uid()) with check (author_id=auth.uid());
create policy videos_read on public.videos for select using (true);
create policy videos_manage on public.videos for all using (author_id=auth.uid()) with check (author_id=auth.uid());
create policy likes_read on public.likes for select using (true);
create policy likes_manage on public.likes for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy comments_read on public.comments for select using (true);
create policy comments_manage on public.comments for all using (author_id=auth.uid()) with check (author_id=auth.uid());
create policy follows_read on public.follows for select using (true);
create policy follows_manage on public.follows for all using (follower_id=auth.uid()) with check (follower_id=auth.uid());
create policy collections_own on public.collections for all using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy collection_items_own on public.collection_items for all using (exists(select 1 from public.collections c where c.id=collection_id and c.owner_id=auth.uid())) with check (exists(select 1 from public.collections c where c.id=collection_id and c.owner_id=auth.uid()));
create policy conversations_own on public.conversations for all using (auth.uid()=any(participant_ids)) with check (auth.uid()=any(participant_ids));
create policy messages_read on public.messages for select using (exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid()=any(c.participant_ids)));
create policy messages_insert on public.messages for insert with check (sender_id=auth.uid() and exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid()=any(c.participant_ids)));
create policy notifications_own on public.notifications for select using (user_id=auth.uid());
create policy notifications_update on public.notifications for update using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy appointments_own on public.viewing_appointments for select using (user_id=auth.uid() or exists(select 1 from public.properties p where p.id=property_id and p.owner_id=auth.uid()));
create policy appointments_request on public.viewing_appointments for insert with check (user_id=auth.uid());
create policy campaigns_own on public.campaigns for all using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy promotions_own on public.promotions for all using (exists(select 1 from public.campaigns c where c.id=campaign_id and c.owner_id=auth.uid())) with check (exists(select 1 from public.campaigns c where c.id=campaign_id and c.owner_id=auth.uid()));
create policy placements_read on public.billboard_placements for select using (active);
create policy promotion_analytics_owner on public.promotion_analytics for select using (exists(select 1 from public.promotions p join public.campaigns c on c.id=p.campaign_id where p.id=promotion_id and c.owner_id=auth.uid()));
-- Analytics writes, verification, price history writes and admin moderation run through trusted server roles only.
