-- Isolamento lógico das duas cidades no mesmo projeto Supabase.
-- Execute no SQL Editor e depois faça o backfill dos registros antigos.
create table if not exists public.cidades (
  slug text primary key check (slug in ('jatai', 'goiania')),
  nome text not null,
  ativa boolean not null default true,
  criada_em timestamptz not null default now()
);

insert into public.cidades (slug, nome) values
  ('jatai', 'Jataí'), ('goiania', 'Goiânia')
on conflict (slug) do update set nome = excluded.nome;

alter table public.votos add column if not exists cidade_slug text;
alter table public.estacoes_urna add column if not exists cidade_slug text;
alter table public.sessoes_votacao add column if not exists cidade_slug text;

alter table public.votos add constraint votos_cidade_slug_check check (cidade_slug in ('jatai', 'goiania'));
alter table public.estacoes_urna add constraint estacoes_cidade_slug_check check (cidade_slug in ('jatai', 'goiania'));
alter table public.sessoes_votacao add constraint sessoes_cidade_slug_check check (cidade_slug in ('jatai', 'goiania'));

create index if not exists votos_cidade_slug_idx on public.votos (cidade_slug);
create index if not exists estacoes_cidade_slug_idx on public.estacoes_urna (cidade_slug, urna_numero);
create index if not exists sessoes_cidade_slug_idx on public.sessoes_votacao (cidade_slug, status);

create table if not exists public.candidatos_cidade (
  id uuid primary key default gen_random_uuid(),
  cidade_slug text not null references public.cidades(slug),
  numero integer not null,
  nome text not null,
  chapa text not null,
  cor text not null,
  foto_url text,
  ativo boolean not null default true,
  unique (cidade_slug, numero)
);

create index if not exists candidatos_cidade_slug_idx on public.candidatos_cidade (cidade_slug, ativo);

alter table public.cidades enable row level security;
alter table public.candidatos_cidade enable row level security;
drop policy if exists cidades_leitura_publica on public.cidades;
create policy cidades_leitura_publica on public.cidades for select using (ativa = true);
drop policy if exists candidatos_leitura_publica on public.candidatos_cidade;
create policy candidatos_leitura_publica on public.candidatos_cidade for select using (ativo = true);

-- Todo o sistema existente foi criado para Jataí.
-- Estes comandos preservam o histórico atual e o vinculam a Jataí.
update public.votos set cidade_slug = 'jatai' where cidade_slug is null;
update public.estacoes_urna set cidade_slug = 'jatai' where cidade_slug is null;
update public.sessoes_votacao set cidade_slug = 'jatai' where cidade_slug is null;

-- O número da urna pode existir nas duas cidades, mas não duplicado dentro da mesma cidade.
alter table public.estacoes_urna drop constraint if exists estacoes_urna_urna_numero_key;
create unique index if not exists estacoes_urna_cidade_urna_uidx
  on public.estacoes_urna (cidade_slug, urna_numero);

-- Não torne NOT NULL antes de classificar os dados antigos.
alter table public.votos add column if not exists discipulado text;
