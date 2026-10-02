"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { gruposDiscipulado, GeneroGrupo } from "@/app/lib/gruposDiscipulado";
import { gruposGoiania } from "@/app/lib/gruposGoiania";
import { cidadeAtual } from "@/app/lib/cidades";

export default function MesarioPage() {
  const cidade =
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/goiania/") ||
      new URLSearchParams(window.location.search).get("cidade") === "goiania")
      ? "goiania"
      : "jatai";
  const grupos = cidade === "goiania" ? gruposGoiania : gruposDiscipulado;
  const [fila, setFila] = useState<any[]>([]);
  const [urna, setUrna] = useState("1");
  const [discipulado, setDiscipulado] = useState("");
  const [genero, setGenero] = useState<GeneroGrupo | "">("");
  const [mensagem, setMensagem] = useState("");
  const carregar = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("sessoes_votacao")
      .select("*")
      .eq("cidade_slug", cidadeAtual())
      .eq("status", "aguardando")
      .order("criada_em");
    setFila(data || []);
  };
  useEffect(() => {
    carregar();
    const timer = window.setInterval(carregar, 3000);
    return () => window.clearInterval(timer);
  }, []);
  const liberar = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("sessoes_votacao")
      .update({ status: "liberada", liberada_em: new Date().toISOString() })
      .eq("id", id)
      .eq("status", "aguardando");
    setMensagem(
      error ? error.message : "Urna liberada. O eleitor já pode votar.",
    );
    carregar();
  };
  const grupoSelecionado = grupos.find((grupo) => grupo.id === discipulado);
  const gruposFiltrados = grupos.filter((grupo) => grupo.genero === genero);
  const formacoesFiltradas = Array.from(new Set(gruposFiltrados.flatMap((grupo) => grupo.formacoes))).sort();
  const liberarEleitor = async () => {
    const destino = discipulado.startsWith("formacao:")
      ? `${discipulado.slice(9)} — Formação`
      : grupoSelecionado?.nome;
    if (!supabase || !destino) {
      setMensagem("Selecione uma formação ou um discipulado normal.");
      return;
    }
    const cidade = cidadeAtual();
    const { data: estacao } = await supabase
      .from("estacoes_urna")
      .select("id")
      .eq("cidade_slug", cidade)
      .eq("urna_numero", Number(urna))
      .eq("ativa", true)
      .maybeSingle();
    if (!estacao) {
      setMensagem(
        `A Urna ${urna} ainda não está cadastrada no Supabase para esta cidade.`,
      );
      return;
    }
    const { error } = await supabase
      .from("sessoes_votacao")
      .insert({
        cidade_slug: cidade,
        urna_numero: Number(urna),
        estacao_id: estacao.id,
        discipulado: destino,
        status: "liberada",
        liberada_em: new Date().toISOString(),
      });
    setMensagem(
      error ? error.message : `Urna ${urna} liberada para ${destino}.`,
    );
    setDiscipulado("");
    setGenero("");
  };
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "clamp(24px,5vw,52px) clamp(16px,5vw,64px)",
        background: "radial-gradient(circle at 80% 0%, #243866, #080d1d 65%)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1080, width: "100%", margin: "0 auto" }}>
        <header style={{ marginBottom: 34 }}>
          <div
            style={{
              color: "#86efac",
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            ● Sistema online
          </div>
          <h1 style={{ fontSize: "clamp(32px,5vw,54px)", margin: "10px 0" }}>
            Painel do <span style={{ color: "#93c5fd" }}>mesário</span>
          </h1>
          <p style={{ color: "#aab7e8", fontSize: 17 }}>
            O eleitor informa o discipulado. Você confirma os dados e libera a
            urna correta.
          </p>
        </header>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 22,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: "#121b35e8",
              border: "1px solid #34446f",
              borderRadius: 24,
              padding: "clamp(22px,4vw,30px)",
              boxShadow: "0 20px 60px #0004",
            }}
          >
            <div
              style={{ color: "#93c5fd", fontWeight: 800, marginBottom: 20 }}
            >
              NOVA LIBERAÇÃO
            </div>
            <div style={{ display: "grid", gap: 20 }}>
              <label
                style={{
                  display: "grid",
                  gap: 8,
                  color: "#dbeafe",
                  fontWeight: 700,
                }}
              >
                Número da urna
                <select
                  value={urna}
                  onChange={(e) => setUrna(e.target.value)}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid #52658f",
                    background: "#0b1228",
                    color: "#fff",
                    fontSize: 16,
                  }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
              <label
                style={{
                  display: "grid",
                  gap: 8,
                  color: "#dbeafe",
                  fontWeight: 700,
                }}
              >
                Menino ou menina
                <select
                  value={genero}
                  onChange={(e) => {
                    setGenero(e.target.value as GeneroGrupo);
                    setDiscipulado("");
                  }}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid #52658f",
                    background: "#0b1228",
                    color: "#fff",
                    fontSize: 16,
                  }}
                >
                  <option value="">Selecione...</option>
                  <option value="menino">Menino</option>
                  <option value="menina">Menina</option>
                </select>
              </label>
              <label
                style={{
                  display: "grid",
                  gap: 8,
                  color: "#dbeafe",
                  fontWeight: 700,
                }}
              >
                Discipulado normal
                <select
                  value={discipulado}
                  onChange={(e) => setDiscipulado(e.target.value)}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid #52658f",
                    background: "#0b1228",
                    color: "#fff",
                    fontSize: 16,
                  }}
                >
                  <option value="">
                    {genero
                      ? "Selecione o discipulado..."
                      : "Selecione uma formação ou escolha menino/menina"}
                  </option>
                  <optgroup label="Formações">
                    {formacoesFiltradas.map((nome) => (
                      <option key={`formacao-${nome}`} value={`formacao:${nome}`}>
                        {nome} — Formação
                      </option>
                    ))}
                  </optgroup>
                  {genero && <optgroup label={genero === "menino" ? "Discipulados masculinos" : "Discipulados femininos"}>
                    {gruposFiltrados.map((grupo) => (
                      <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
                    ))}
                  </optgroup>}
                </select>
              </label>
              {grupoSelecionado && (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    background: "#1e3a5f",
                    color: "#c7d2fe",
                  }}
                >
                  <strong>Formações relacionadas:</strong>
                  <br />
                  {grupoSelecionado.formacoes.join(" · ")}
                </div>
              )}
              <button
                onClick={liberarEleitor}
                style={{
                  padding: 17,
                  border: 0,
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                  color: "#052e16",
                  fontWeight: 900,
                  fontSize: 15,
                  marginTop: 6,
                }}
              >
                LIBERAR URNA {urna}
              </button>
            </div>
            {mensagem && (
              <p
                style={{
                  color: "#86efac",
                  background: "#14532d55",
                  padding: 14,
                  borderRadius: 10,
                  marginBottom: 0,
                }}
              >
                {mensagem}
              </p>
            )}
          </div>
          <div
            style={{
              background: "#0f1830cc",
              border: "1px solid #34446f",
              borderRadius: 24,
              padding: "clamp(22px,4vw,30px)",
            }}
          >
            <div style={{ color: "#aab7e8", fontSize: 13, letterSpacing: 1.5 }}>
              STATUS DA ESTAÇÃO
            </div>
            <div
              style={{
                fontSize: "clamp(54px,9vw,70px)",
                fontWeight: 900,
                color: "#86efac",
                margin: "22px 0 4px",
              }}
            >
              0{urna}
            </div>
            <div style={{ color: "#c7d2fe", fontSize: 18 }}>
              Urna selecionada
            </div>
            <div
              style={{
                marginTop: 30,
                paddingTop: 20,
                borderTop: "1px solid #34446f",
                color: "#aab7e8",
              }}
            >
              A liberação será enviada automaticamente ao computador configurado
              como Urna {urna}.
            </div>
          </div>
        </section>
        <section
          style={{
            marginTop: 30,
            background: "#121b35e8",
            border: "1px solid #34446f",
            borderRadius: 24,
            padding: "clamp(20px,4vw,26px)",
            overflowX: "auto",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Solicitações pendentes</h2>
          <div style={{ display: "grid", gap: 10, minWidth: 0 }}>
            {fila.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 12,
                  background: "#1e293b",
                }}
              >
                <span>
                  <strong>Urna {item.urna_numero}</strong> · {item.discipulado}
                </span>
                <button
                  onClick={() => liberar(item.id)}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    border: 0,
                    background: "#facc15",
                    fontWeight: 700,
                  }}
                >
                  LIBERAR
                </button>
              </div>
            ))}
            {fila.length === 0 && (
              <p style={{ color: "#94a3b8" }}>Nenhuma solicitação pendente.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
