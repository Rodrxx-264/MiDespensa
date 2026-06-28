create extension if not exists pgcrypto;
create extension if not exists unaccent;

create table grupos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  codigo_qr text unique not null,
  admin_id uuid references auth.users(id) not null,
  created_at timestamptz default now()
);

create table perfiles (
  id uuid references auth.users(id) primary key,
  nombre text not null,
  email text not null,
  avatar_url text,
  grupo_id uuid references grupos(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table listas (
  id uuid default gen_random_uuid() primary key,
  grupo_id uuid references grupos(id) not null,
  nombre text not null,
  estado text check (estado in ('activa', 'completada')) default 'activa',
  presupuesto_maximo decimal(10,2),
  total_estimado decimal(10,2) default 0,
  total_real decimal(10,2) default 0,
  notas text,
  cerrada_por uuid references auth.users(id),
  created_at timestamptz default now(),
  completada_at timestamptz
);

create table productos (
  id uuid default gen_random_uuid() primary key,
  lista_id uuid references listas(id) on delete cascade not null,
  nombre text not null,
  categoria text not null,
  cantidad decimal(10,2) not null default 1,
  unidad text default 'unidad',
  precio_estimado decimal(10,2),
  precio_real decimal(10,2),
  tienda_sugerida text,
  tienda_compra text,
  estado text check (estado in ('pendiente', 'comprado')) default 'pendiente',
  notas text,
  agregado_por uuid references auth.users(id),
  agregado_por_nombre text,
  comprado_por uuid references auth.users(id),
  comprado_por_nombre text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table historial_precios (
  id uuid default gen_random_uuid() primary key,
  grupo_id uuid references grupos(id),
  producto_nombre text not null,
  tienda text not null,
  precio decimal(10,2) not null,
  presentacion text,
  fecha_consulta timestamptz default now()
);

create index idx_perfiles_grupo on perfiles(grupo_id);
create index idx_listas_grupo_estado on listas(grupo_id, estado);
create index idx_productos_lista on productos(lista_id);
create index idx_historial_grupo_producto on historial_precios(grupo_id, producto_nombre);

alter table perfiles enable row level security;
alter table grupos enable row level security;
alter table listas enable row level security;
alter table productos enable row level security;
alter table historial_precios enable row level security;

create policy "ver perfil propio o del grupo" on perfiles for select using (id = auth.uid() or grupo_id in (select grupo_id from perfiles where id = auth.uid()));
create policy "actualizar perfil propio" on perfiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "insertar perfil propio" on perfiles for insert with check (id = auth.uid());

create policy "ver grupos propios" on grupos for select using (id in (select grupo_id from perfiles where id = auth.uid()) or codigo_qr is not null);
create policy "crear grupo" on grupos for insert with check (admin_id = auth.uid());
create policy "admin actualiza grupo" on grupos for update using (admin_id = auth.uid()) with check (admin_id = auth.uid());

create policy "ver listas del grupo" on listas for select using (grupo_id in (select grupo_id from perfiles where id = auth.uid()));
create policy "insertar listas del grupo" on listas for insert with check (grupo_id in (select grupo_id from perfiles where id = auth.uid()));
create policy "actualizar listas del grupo" on listas for update using (grupo_id in (select grupo_id from perfiles where id = auth.uid())) with check (grupo_id in (select grupo_id from perfiles where id = auth.uid()));

create policy "ver productos del grupo" on productos for select using (lista_id in (select l.id from listas l join perfiles p on p.grupo_id = l.grupo_id where p.id = auth.uid()));
create policy "insertar productos del grupo" on productos for insert with check (lista_id in (select l.id from listas l join perfiles p on p.grupo_id = l.grupo_id where p.id = auth.uid()));
create policy "actualizar productos del grupo" on productos for update using (lista_id in (select l.id from listas l join perfiles p on p.grupo_id = l.grupo_id where p.id = auth.uid())) with check (lista_id in (select l.id from listas l join perfiles p on p.grupo_id = l.grupo_id where p.id = auth.uid()));
create policy "eliminar productos del grupo" on productos for delete using (lista_id in (select l.id from listas l join perfiles p on p.grupo_id = l.grupo_id where p.id = auth.uid()));

create policy "ver historial del grupo" on historial_precios for select using (grupo_id in (select grupo_id from perfiles where id = auth.uid()));
create policy "insertar historial del grupo" on historial_precios for insert with check (grupo_id in (select grupo_id from perfiles where id = auth.uid()));

create or replace function set_updated_at() returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
create trigger perfiles_updated_at before update on perfiles for each row execute function set_updated_at();
create trigger productos_updated_at before update on productos for each row execute function set_updated_at();

create or replace function recalcular_totales_lista() returns trigger as $$
declare target_lista uuid;
begin
  target_lista := coalesce(new.lista_id, old.lista_id);
  update listas set
    total_estimado = coalesce((select sum(coalesce(precio_estimado,0) * coalesce(cantidad,1)) from productos where lista_id = target_lista), 0),
    total_real = coalesce((select sum(coalesce(precio_real,0) * coalesce(cantidad,1)) from productos where lista_id = target_lista), 0)
  where id = target_lista;
  return coalesce(new, old);
end; $$ language plpgsql;
create trigger productos_recalcular_totales after insert or update or delete on productos for each row execute function recalcular_totales_lista();

create or replace function crear_perfil_google() returns trigger as $$
begin
  insert into perfiles (id, nombre, email, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.email, new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$ language plpgsql security definer;
create trigger auth_crear_perfil after insert on auth.users for each row execute function crear_perfil_google();

alter publication supabase_realtime add table productos;

-- Mi Despensa V3 - funciones inteligentes sin IA externa
alter table productos add column if not exists priority text not null default 'important';
alter table productos add column if not exists status text not null default 'pending';
alter table productos add column if not exists substitute_name text;
alter table productos add column if not exists purchase_note text;
alter table productos add column if not exists normalized_name text;

do $$ begin
  alter table productos add constraint productos_priority_check check (priority in ('essential', 'important', 'optional'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table productos add constraint productos_status_check check (status in ('pending', 'purchased', 'not_found'));
exception when duplicate_object then null; end $$;

create table if not exists category_budgets (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references listas(id) on delete cascade,
  category text not null,
  budget numeric not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(list_id, category)
);

create table if not exists pantry_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references grupos(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  quantity numeric default 1,
  unit text,
  category text,
  expires_at date,
  low_stock boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table historial_precios add column if not exists normalized_product_name text;
alter table historial_precios add column if not exists store text;
alter table historial_precios add column if not exists quantity numeric default 1;
alter table historial_precios add column if not exists unit text;
alter table historial_precios add column if not exists list_id uuid references listas(id) on delete set null;
alter table historial_precios add column if not exists purchased_at timestamptz default now();

update historial_precios set normalized_product_name = lower(regexp_replace(unaccent(producto_nombre), '\s+', ' ', 'g')) where normalized_product_name is null;
update historial_precios set store = tienda where store is null;

create index if not exists idx_historial_precios_normalized on historial_precios (grupo_id, normalized_product_name);
create index if not exists idx_historial_precios_store on historial_precios (grupo_id, store);
create index if not exists idx_pantry_items_group on pantry_items (group_id);
create index if not exists idx_pantry_items_normalized on pantry_items (group_id, normalized_name);
create index if not exists idx_category_budgets_list on category_budgets (list_id);

alter table category_budgets enable row level security;
alter table pantry_items enable row level security;

create policy "ver presupuestos categoria del grupo" on category_budgets for select using (list_id in (select l.id from listas l join perfiles p on p.grupo_id = l.grupo_id where p.id = auth.uid()));
create policy "insertar presupuestos categoria del grupo" on category_budgets for insert with check (list_id in (select l.id from listas l join perfiles p on p.grupo_id = l.grupo_id where p.id = auth.uid()));
create policy "actualizar presupuestos categoria del grupo" on category_budgets for update using (list_id in (select l.id from listas l join perfiles p on p.grupo_id = l.grupo_id where p.id = auth.uid())) with check (list_id in (select l.id from listas l join perfiles p on p.grupo_id = l.grupo_id where p.id = auth.uid()));
create policy "eliminar presupuestos categoria del grupo" on category_budgets for delete using (list_id in (select l.id from listas l join perfiles p on p.grupo_id = l.grupo_id where p.id = auth.uid()));

create policy "ver despensa del grupo" on pantry_items for select using (group_id in (select grupo_id from perfiles where id = auth.uid()));
create policy "insertar despensa del grupo" on pantry_items for insert with check (group_id in (select grupo_id from perfiles where id = auth.uid()));
create policy "actualizar despensa del grupo" on pantry_items for update using (group_id in (select grupo_id from perfiles where id = auth.uid())) with check (group_id in (select grupo_id from perfiles where id = auth.uid()));
create policy "eliminar despensa del grupo" on pantry_items for delete using (group_id in (select grupo_id from perfiles where id = auth.uid()));

drop trigger if exists category_budgets_updated_at on category_budgets;
create trigger category_budgets_updated_at before update on category_budgets for each row execute function set_updated_at();
drop trigger if exists pantry_items_updated_at on pantry_items;
create trigger pantry_items_updated_at before update on pantry_items for each row execute function set_updated_at();
