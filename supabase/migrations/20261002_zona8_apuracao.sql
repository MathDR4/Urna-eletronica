-- Zona 8: camada fictícia de exibição. Nenhum voto artificial é inserido em public.votos.
create table if not exists public.controle_apuracao (
  cidade_slug text primary key,
  zona8_status text not null default 'aberta' check (zona8_status in ('aberta', 'finalizada')),
  zona8_12 integer not null default 0 check (zona8_12 >= 0),
  zona8_17 integer not null default 0 check (zona8_17 >= 0),
  zona8_67 integer not null default 0 check (zona8_67 >= 0),
  zona8_ciclo integer not null default 0 check (zona8_ciclo >= 0),
  zona8_alvo_final integer,
  zona8_finalizada_em timestamptz,
  zona8_atualizada_em timestamptz not null default now()
);

alter table public.controle_apuracao enable row level security;

drop policy if exists controle_apuracao_leitura on public.controle_apuracao;
create policy controle_apuracao_leitura on public.controle_apuracao for select to anon using (true);

drop policy if exists controle_apuracao_insercao on public.controle_apuracao;
create policy controle_apuracao_insercao on public.controle_apuracao for insert to anon with check (true);

drop policy if exists controle_apuracao_atualizacao on public.controle_apuracao;
create policy controle_apuracao_atualizacao on public.controle_apuracao for update to anon using (true) with check (true);

insert into public.controle_apuracao (cidade_slug, zona8_atualizada_em)
values ('jatai', now() - interval '1 minute')
on conflict (cidade_slug) do nothing;

-- Mantém os três totais exibidos separados por no máximo dois votos e alterna
-- a liderança. Os contadores fictícios só aumentam; nunca removem votos da tela.
create or replace function public.avancar_zona8(
  p_cidade text,
  p_real_12 integer,
  p_real_17 integer,
  p_real_67 integer
)
returns setof public.controle_apuracao
language plpgsql
security definer
set search_path = public
as $$
declare
  estado public.controle_apuracao%rowtype;
  exibido_12 integer;
  exibido_17 integer;
  exibido_67 integer;
  base integer;
  alvo_12 integer;
  alvo_17 integer;
  alvo_67 integer;
  passo integer;
begin
  insert into public.controle_apuracao (cidade_slug, zona8_atualizada_em)
  values (p_cidade, now() - interval '1 minute')
  on conflict (cidade_slug) do nothing;

  select * into estado
  from public.controle_apuracao
  where cidade_slug = p_cidade
  for update;

  if estado.zona8_status <> 'aberta' then
    return query select * from public.controle_apuracao where cidade_slug = p_cidade;
    return;
  end if;

  -- O gráfico consulta a cada 5 s, mas a liderança muda a cada ~15 s.
  if estado.zona8_atualizada_em > now() - interval '15 seconds' then
    return query select * from public.controle_apuracao where cidade_slug = p_cidade;
    return;
  end if;

  exibido_12 := greatest(p_real_12, 0) + estado.zona8_12;
  exibido_17 := greatest(p_real_17, 0) + estado.zona8_17;
  exibido_67 := greatest(p_real_67, 0) + estado.zona8_67;

  -- Todos os alvos ficam acima do maior total atual. Assim não é preciso
  -- subtrair votos artificiais, mesmo quando os votos reais crescem muito.
  base := greatest(exibido_12, exibido_17, exibido_67) + 1;
  passo := mod(estado.zona8_ciclo, 6);

  if passo = 0 then
    alvo_12 := base + 2; alvo_67 := base + 1; alvo_17 := base;
  elsif passo = 1 then
    alvo_67 := base + 2; alvo_17 := base + 1; alvo_12 := base;
  elsif passo = 2 then
    alvo_17 := base + 2; alvo_12 := base + 1; alvo_67 := base;
  elsif passo = 3 then
    alvo_12 := base + 2; alvo_17 := base + 1; alvo_67 := base;
  elsif passo = 4 then
    alvo_17 := base + 2; alvo_67 := base + 1; alvo_12 := base;
  else
    alvo_67 := base + 2; alvo_12 := base + 1; alvo_17 := base;
  end if;

  update public.controle_apuracao
  set
    zona8_12 = zona8_12 + greatest(0, alvo_12 - exibido_12),
    zona8_17 = zona8_17 + greatest(0, alvo_17 - exibido_17),
    zona8_67 = zona8_67 + greatest(0, alvo_67 - exibido_67),
    zona8_ciclo = zona8_ciclo + 1,
    zona8_atualizada_em = now()
  where cidade_slug = p_cidade;

  return query select * from public.controle_apuracao where cidade_slug = p_cidade;
end;
$$;

-- Congela a Zona 8 e registra o maior contador fictício como alvo. O frontend
-- anima os outros dois até esse mesmo número; depois disso a diferença exibida
-- entre candidatos é exatamente a diferença dos votos reais.
create or replace function public.finalizar_zona8(p_cidade text)
returns setof public.controle_apuracao
language plpgsql
security definer
set search_path = public
as $$
declare
  alvo integer;
begin
  insert into public.controle_apuracao (cidade_slug, zona8_atualizada_em)
  values (p_cidade, now() - interval '1 minute')
  on conflict (cidade_slug) do nothing;

  select greatest(zona8_12, zona8_17, zona8_67)
  into alvo
  from public.controle_apuracao
  where cidade_slug = p_cidade
  for update;

  update public.controle_apuracao
  set
    zona8_status = 'finalizada',
    zona8_alvo_final = alvo,
    zona8_finalizada_em = now(),
    zona8_atualizada_em = now()
  where cidade_slug = p_cidade;

  return query select * from public.controle_apuracao where cidade_slug = p_cidade;
end;
$$;

create or replace function public.resetar_zona8(p_cidade text)
returns setof public.controle_apuracao
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.controle_apuracao (cidade_slug, zona8_atualizada_em)
  values (p_cidade, now() - interval '1 minute')
  on conflict (cidade_slug) do nothing;

  update public.controle_apuracao
  set
    zona8_status = 'aberta',
    zona8_12 = 0,
    zona8_17 = 0,
    zona8_67 = 0,
    zona8_ciclo = 0,
    zona8_alvo_final = null,
    zona8_finalizada_em = null,
    zona8_atualizada_em = now() - interval '1 minute'
  where cidade_slug = p_cidade;

  return query select * from public.controle_apuracao where cidade_slug = p_cidade;
end;
$$;

grant execute on function public.avancar_zona8(text, integer, integer, integer) to anon, authenticated;
grant execute on function public.finalizar_zona8(text) to anon, authenticated;
grant execute on function public.resetar_zona8(text) to anon, authenticated;
