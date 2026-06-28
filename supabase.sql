create extension if not exists pgcrypto;

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
