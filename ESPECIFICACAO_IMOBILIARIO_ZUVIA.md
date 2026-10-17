# Especificação de engenharia — Token imobiliário de prédio em Assunção (via Zuvia)

**Status:** rascunho v0.1 · 17/10/2026
**Autor:** Cláudio Ikeda (CTO) com apoio do Claude
**Natureza:** proposta de engenharia. Itens marcados **[confirmar]** dependem de advogados, da Zuvia, da B3 ou de dados que ainda não temos. Itens **[a definir]** não têm valor decidido.

---

## 0. Premissas e o que ainda não sabemos

O que sabemos (fonte: notícias de ago/2025 sobre a Zuvia e a B3):

- A Zuvia se apresenta como plataforma de crowdfunding de investimentos e lançou ofertas sob a Resolução CVM 88.
- A Zuvia e a B3 firmaram parceria para tokenizar Contratos de Investimento Coletivo (CIC) e permitir negociação posterior em plataformas que usam a tecnologia da B3. Liquidação financeira via Pix.
- A primeira operação foi um token ligado a um empreendimento residencial em Bauru (SP): ~500 mil tokens a R$ 25 cada.
- A B3 fornece a infraestrutura de tokenização e negociação; a Zuvia gerencia as operações e o relacionamento com emissores e investidores.

O que **não** está confirmado e precisa ser verificado antes de qualquer commit de engenharia:

| # | Ponto | Por quê importa | Quem confirma |
|---|---|---|---|
| P1 | Situação da Zuvia como plataforma de crowdfunding autorizada pela CVM (número e data da autorização) | A frase "certificado pela CVM" não aparece nas fontes que li. Consultar o registro de plataformas no site da CVM | Advogados + registro CVM |
| P2 | Se a Res. 88 comporta nosso emissor: limite de captação por emissor/ano e porte máximo do emissor | A regra do crowdfunding foi pensada para empresas de menor porte e tem teto de captação. Um prédio inteiro pode exceder o teto | Advogados |
| P3 | Se um ativo **no Paraguai** pode ser objeto de CIC/crowdfunding no Brasil | Há questão de enquadramento do ativo estrangeiro, divulgação e registro | Advogados BR + PY |
| P4 | Qual blockchain/registro a Zuvia e a B3 usam e que APIs expõem | Define toda a camada de integração | Zuvia / B3 |
| P5 | Quem é o emissor: holding, PropCo ou veículo dedicado | Define cap table, contratos e o objeto do token | Advogados |
| P6 | Prédio, vendedor, preço, % da holding na OpCo | Sem isso não há números nem prazos | Cláudio |

**Regra do projeto:** nenhum número de rentabilidade ou valorização entra em código, tela ou material enquanto não houver parecer jurídico. Valorização aparece apenas como cenário ilustrativo, rotulado.

---

## 1. Objetivo do produto

Permitir que investidores no Brasil adquiram, via oferta regulada pela CVM e distribuída pela Zuvia, tokens que representam participação econômica em **um prédio inteiro em Assunção** (região da Av. Mariscal López / Paseo La Galería, Villa Morra), com renda de locação mobiliada e, em cenário não prometido, eventual valorização do imóvel.

Fora do escopo (decisões já tomadas):

- Nenhum produto financeiro no Paraguai (conta, crédito, investimento).
- Nenhuma garantia de recompra por construtora ou terceiro.
- Foz do Iguaçu e Ciudad del Este ficam para fase futura.
- A captação internacional da OpCo é um processo separado do token.

---

## 2. Estrutura jurídico-operacional que a engenharia precisa refletir

```
Investidores do token (BR)
        │  (CIC tokenizado via Zuvia / infra B3)
        ▼
   Emissor [confirmar: holding BR ou veículo dedicado]
        │
        ▼
   PropCo (PY)  ── dona do prédio (matrícula única)
        │  recebe aluguel
        ▲
   OpCo (PY)    ── aluga, administra, mantém
        ▲
   Sócios internacionais (reduzem a cota da holding na OpCo)
```

Implicações de engenharia:

- Duas partes pagantes e recebedoras: **OpCo → PropCo** (aluguel) e **emissor → investidores** (distribuições). Cada fluxo precisa de conciliação própria.
- O sistema precisa distinguir **renda distribuível** (caixa) de **variação de valor justo** (contábil, não distribuível). Nunca misturar nas telas.
- A OpCo é parte relacionada da holding enquanto a cota for > 20% [confirmar]. O contrato de locação PropCo–OpCo é a principal proteção do investidor e vira dado de primeira classe no sistema.

---

## 3. Arquitetura proposta

### 3.1 Visão geral

```
┌────────────────────┐   ┌──────────────────────┐   ┌─────────────────────┐
│ Portal do investidor│   │ Backoffice (emissor) │   │ Painel Portal Paraguai│
│ (web/mobile)        │   │ operações, compliance │   │ (conteúdo, leads)     │
└─────────┬──────────┘   └──────────┬───────────┘   └──────────┬──────────┘
          │                         │                          │
          └────────────┬────────────┴──────────────┬───────────┘
                       ▼                           ▼
              ┌───────────────────┐       ┌──────────────────┐
              │  API do produto    │       │  CMS / leads      │
              │  (serviços de      │       │  (sem dados de     │
              │  domínio)          │       │  investimento)     │
              └───┬────┬────┬─────┘       └──────────────────┘
                  │    │    │
   ┌──────────────┘    │    └───────────────┐
   ▼                   ▼                    ▼
Adaptador Zuvia    Adaptador B3/ledger   Serviços do ativo
(oferta, cadastro, (emissão, titularidade, (aluguel, despesas,
 KYC, aportes)      mercado secundário)    avaliações, relatórios)
```

**Princípio:** a Zuvia e a B3 são o sistema de registro da oferta, da titularidade e da negociação. Nosso sistema **não** duplica o livro de titularidade; ele guarda o que é nosso (ativo, contratos, fluxo de caixa, relatórios) e **reconcilia** com o que vem da Zuvia/B3.

### 3.2 Componentes

| Componente | Responsabilidade | Observações |
|---|---|---|
| **Adaptador Zuvia** | Cadastro de oferta, documentos, status da captação, lista de investidores aceitos | Contrato de API **[confirmar]**; começar com camada de abstração para trocar de plataforma |
| **Adaptador B3 / ledger** | Consulta de titularidade, eventos de transferência, mercado subsequente, proventos | Depende de P4. Tratar como fonte de verdade da titularidade |
| **Serviço de Ativo** | Cadastro do prédio, unidades, contratos de locação, matrícula, seguros, laudos | Dados jurídicos PY em espanhol, com tradução para pt-BR |
| **Serviço de Receita** | Aluguéis recebidos da OpCo, despesas da PropCo, caixa distribuível | Moeda funcional: G$ e US$ **[confirmar]**; investidores em R$ |
| **Serviço de Distribuição** | Cálculo de proventos por token, retenção de impostos, instrução de pagamento via Pix | Cálculo determinístico, reproduzível, com trilha de auditoria |
| **Serviço de Avaliação** | Registro de laudos anuais independentes, valor justo, cenários ilustrativos | Cenários só com rótulo "ilustrativo" |
| **Serviço de Câmbio** | Cotação G$ / US$ / R$ com fonte e carimbo de tempo | Fonte oficial **[a definir]** |
| **Compliance** | KYC/AML (via Zuvia ou complementar), PEP, sanções, limites do investidor, suitability | Responsabilidade principal da plataforma; nós somos emissor |
| **Relatórios** | Informe periódico, demonstrações, extrato do investidor, informe de rendimentos | Prazos e conteúdo **[confirmar]** na norma aplicável |
| **Observabilidade e auditoria** | Logs imutáveis, métricas, alertas | Ver seção 9 |

### 3.3 Tecnologia (sugestão, ajustável)

- Backend: serviços em Python ou TypeScript, banco relacional (PostgreSQL) com histórico de alterações (tabelas temporais ou event sourcing nos fluxos financeiros).
- Filas para eventos de integração (Zuvia/B3), com reprocessamento idempotente.
- Armazenamento de documentos com versionamento e hash (matrícula, contratos, laudos).
- Front: web responsivo; app só se houver demanda.
- Nuvem no Brasil para dados de investidores (LGPD); dados do ativo podem replicar para PY **[confirmar]**.

Não definimos blockchain própria. Se a infra B3 já registra os tokens, nosso sistema consome seus eventos. Contratos inteligentes próprios só entram se a Zuvia/B3 permitirem e se houver ganho claro (ver 5.4).

---

## 4. Modelo de dados (núcleo)

```
Emissor(id, razao_social, cnpj, tipo, status)
Oferta(id, emissor_id, plataforma='zuvia', id_externo, valor_alvo, valor_minimo,
       preco_token, qtd_tokens, janela_inicio, janela_fim, status)
Token(id, oferta_id, simbolo, qtd_total, qtd_emitida, casas_decimais, id_externo_ledger)
Investidor(id, id_externo_plataforma, tipo, residencia_fiscal, status_kyc, perfil)
Posicao(investidor_id, token_id, quantidade, data_ref)         -- espelho do ledger
Ativo(id, propco_id, descricao, matricula, endereco, area_total_m2, data_aquisicao,
      preco_aquisicao_usd)
Unidade(id, ativo_id, numero, area_m2, mobiliada, canal_alvo)  -- canal: ancora|flex|curta
ContratoLocacaoMestre(id, propco_id, opco_id, inicio, fim, aluguel_minimo, pct_receita,
                      garantias, gatilhos_substituicao_opco)
ReceitaMensal(id, mes, canal, receita_bruta, despesas_opco, ocupacao_pct, adr)
FluxoPropCo(id, mes, aluguel_recebido, despesas_propco, impostos, caixa_distribuivel)
Distribuicao(id, mes_ref, valor_total_brl, valor_por_token, data_pagamento, status)
Laudo(id, data, avaliador, valor_usd, metodo, arquivo_hash)
CenarioIlustrativo(id, rotulo, taxa_anual, horizonte_anos, texto_aviso)
EventoAuditoria(id, ator, acao, entidade, antes, depois, ts)
```

Regras:

- **Valores monetários** em tipo decimal fixo, sem ponto flutuante. Sempre guardar moeda e cotação usada.
- **Imutabilidade** de distribuições pagas e de laudos publicados; correções via lançamento de ajuste.
- **Chave de idempotência** em toda integração de pagamento e de evento.

---

## 5. Especificação do token

### 5.1 O que o token representa (a decidir com advogados)

Opções (ver Escopo v3):

| Opção | Token representa | Prós | Contras |
|---|---|---|---|
| A | CIC sobre a PropCo (via emissor dedicado) | Exposição direta ao prédio | Enquadramento do ativo estrangeiro (P3) |
| B | CIC sobre a holding | Estrutura mais simples no BR | Mistura outros ativos e a participação na OpCo |
| C | Cotas de FII com tokenização (Res. 175) | Veículo conhecido do mercado | Caminho diferente do da Zuvia; custos e prazos maiores |

Esta especificação assume **A ou B** por serem compatíveis com a Zuvia. **[confirmar]**

### 5.2 Atributos

| Atributo | Valor |
|---|---|
| Fungibilidade | Fungível dentro da série |
| Preço inicial | [a definir] (referência de mercado: tokens recentes da Zuvia a R$ 25) |
| Quantidade | [a definir], derivada do valor-alvo da captação |
| Divisibilidade | [a definir] (casas decimais) |
| Direitos econômicos | Participação proporcional na renda líquida distribuível; participação no valor residual em liquidação |
| Direitos políticos | [a definir] (ex.: deliberações sobre venda do prédio e troca da OpCo) |
| Transferência | Apenas entre investidores aptos, via ambiente integrado à B3/Zuvia |
| Lock-up | [a definir] |

### 5.3 Ciclo de vida

```
Rascunho → Aprovado (jurídico) → Em oferta → Captação encerrada
        → Liquidação/emissão → Ativo em operação → Mercado subsequente
        → [Evento de liquidação do prédio] → Resgate/encerramento
```

### 5.4 Contratos inteligentes

Decisão: **não construir contrato próprio na v1**. Usar o registro e as regras de transferência da infra B3/Zuvia. Reavaliar para a v2 se houver necessidade de regras específicas (ex.: restrições de transferência, distribuição automatizada). Qualquer contrato próprio exigiria auditoria independente.

---

## 6. Fluxos principais

### 6.1 Oferta e captação

1. Emissor cadastra a oferta na Zuvia com documentos (lâmina, contrato, estatuto, laudo) **[confirmar lista]**.
2. Zuvia valida e publica. Investidor faz cadastro/KYC na plataforma.
3. Investidor reserva e paga (Pix). Valores ficam sob regra de segregação da plataforma **[confirmar]**.
4. Se atingir o mínimo, emissão dos tokens. Se não, devolução.
5. Nosso sistema consome o evento de encerramento e abre a posição de cada investidor.

### 6.2 Aquisição do imóvel

Ordem que protege o investidor:

1. Contrato de compra do prédio assinado condicionado à captação.
2. Captação encerrada com sucesso.
3. Recursos transferidos para o PropCo **somente com** a condição de registro da matrícula em nome do PropCo.
4. Registro da matrícula confirmado, com certidão anexada ao Serviço de Ativo.

Sem inversão: nunca liberar dinheiro antes de haver cláusula que garanta o registro. Mecânica do repasse BR → PY (câmbio, aporte de capital ou empréstimo, impostos) depende de parecer fiscal e **não envolve produto financeiro paraguaio**.

### 6.3 Operação e distribuição mensal

1. OpCo reporta receita por canal (âncora 6–12 meses, flex 30–90 dias, curta temporada).
2. OpCo paga aluguel à PropCo conforme contrato mestre (mínimo fixo + % da receita).
3. PropCo apura caixa distribuível (aluguel − despesas − impostos − reservas).
4. Serviço de Distribuição calcula valor por token e converte para R$ com cotação registrada.
5. Aprovação em dupla (financeiro + compliance) antes do pagamento.
6. Pagamento via Pix pela plataforma. Conciliação automática com extrato.
7. Informe ao investidor.

### 6.4 Mercado subsequente

- Negociação no ambiente integrado à B3/Zuvia. Sem negociação em local não autorizado.
- Nosso sistema não define preço; mostra o último preço negociado e o valor patrimonial por token, com rótulos distintos.
- Liquidez **não é garantida**. Comunicar sempre. **[confirmar]** se haverá janela de resgate; foi descartada qualquer recompra por terceiros.

### 6.5 Avaliação anual

Laudo independente anual → registro de valor justo → variação contábil na PropCo, separada da renda distribuível → publicada no relatório.

---

## 7. Compliance e regulatório (checklist para os advogados)

- [ ] Autorização atual da Zuvia como plataforma de crowdfunding (P1).
- [ ] Enquadramento do emissor e do ativo no Paraguai na Res. 88 ou alternativa (P2, P3).
- [ ] Limites de captação por emissor/ano e por investidor.
- [ ] Documentos obrigatórios da oferta e linguagem de risco.
- [ ] Regras de publicidade e limites para divulgação (afeta o Portal Paraguai). Verificar se remunerar o Portal por indicação de investidores exige tratamento específico.
- [ ] Informes periódicos e contabilidade do emissor.
- [ ] Tributação: no Paraguai (imposto sobre renda do aluguel, IVA, registro), no Brasil (investidor PF/PJ), retenções e informe de rendimentos.
- [ ] Contrato PropCo–OpCo como transação com parte relacionada.
- [ ] Captação internacional da OpCo em jurisdições dos investidores.
- [ ] LGPD e a lei paraguaia de proteção de dados.
- [ ] Propriedade estrangeira de imóvel e estrutura de titularidade no Paraguai.

---

## 8. Proteções do investidor traduzidas em requisitos de sistema

| Proteção | Requisito |
|---|---|
| Contrato mestre PropCo–OpCo de longo prazo, assinado antes da oferta | Contrato versionado; alertas de vencimento; gatilhos medidos automaticamente |
| Metas de desempenho e direito de substituir a OpCo | Painel de KPIs (ocupação, receita por canal, inadimplência) com limites configuráveis |
| Capitalização mínima e garantia da OpCo | Monitoramento de caixa e covenant |
| Aluguel a preço de mercado (parte relacionada) | Registro do estudo de mercado de suporte; revisão periódica |
| Separação entre renda e valorização | Telas e relatórios distintos; cenários sempre rotulados |
| Registro da matrícula antes da liberação dos recursos | Gate no fluxo 6.2 |

---

## 9. Requisitos não funcionais

**Segurança**

- Autenticação forte (MFA) para investidores e para todo acesso administrativo.
- Segregação de funções; aprovação em dupla em distribuições e mudanças de dados bancários.
- Criptografia em trânsito e em repouso; gestão de segredos; chaves em HSM ou KMS.
- Trilha de auditoria imutável.
- Pentest antes do lançamento; revisão periódica.

**Disponibilidade e desempenho**

- Meta inicial de 99,5% para o portal (a ser revista); sem exigência de baixa latência, pois não há negociação própria.
- Backups com teste de restauração; RPO/RTO **[a definir]**.

**Privacidade**

- Minimização de dados; retenção definida; direitos do titular (LGPD).
- Dados de leads de marketing separados dos dados de investimento.

**Observabilidade**

- Logs estruturados, métricas de integração, alerta de divergência entre ledger e posições locais.

**Conciliação**

- Rotina diária: posições locais × ledger; pagamentos × extrato; receita × contrato.

---

## 10. Marcos de entrega (esboço)

| Fase | Entrega | Pré-requisito |
|---|---|---|
| 0 | Pareceres: P1–P5; escolha do veículo; contato técnico com Zuvia e B3 | Advogados, Zuvia, B3 |
| 1 | Discovery técnico das APIs; protótipo do Serviço de Ativo e do modelo de dados | P4 respondido |
| 2 | Portal do investidor (consulta de posição, documentos, extratos) + adaptador Zuvia | Fase 1 |
| 3 | Serviço de Receita e Distribuição + conciliação + relatórios | Prédio definido (P6) |
| 4 | Testes de segurança, ensaio de distribuição, operação assistida | Fases 2–3 |
| 5 | Lançamento da oferta | Aprovação regulatória e jurídica |

Prazos e esforço: **[a definir]** após a fase 0. Não estimamos agora para não criar falsa precisão.

---

## 11. Riscos de engenharia e de produto

| Risco | Efeito | Mitigação |
|---|---|---|
| Ativo estrangeiro não caber no crowdfunding (P2/P3) | Mudança de veículo e de plataforma | Parecer na fase 0; manter adaptador desacoplado da Zuvia |
| Dependência de APIs e regras da B3/Zuvia | Atrasos e mudança de escopo | Contrato de integração; camada de abstração |
| Divergência entre ledger e posição local | Pagamento errado | Conciliação diária; ledger como fonte de verdade |
| Câmbio G$ / US$ / R$ | Distribuição varia | Política de conversão e divulgação clara; registro da cotação |
| OpCo ligada ao mesmo grupo: risco de vacância não é realmente transferido | Investidor acredita estar protegido sem estar | Contrato com mínimo fixo, garantias e substituição; divulgar a relação societária |
| Liquidez baixa no mercado subsequente | Investidor não consegue sair | Comunicação clara; avaliar janela de resgate com advogados |
| Comunicação do Portal sair do limite regulatório | Sanção e dano de imagem | Material aprovado, roteiro, treinamento (ver pitch do Portal) |
| Dados de mercado fracos (preço por m² = preço pedido; aluguel mobiliado sem levantamento local) | Modelo financeiro sem base | Levantamento local de aluguéis e preços fechados antes de qualquer número público |

---

## 12. Perguntas em aberto (para fechar a v0.2)

1. Qual prédio, quem vende e a que preço?
2. Quem é o emissor e onde fica o token (PropCo, holding ou veículo dedicado)?
3. Qual a cota-alvo da holding na OpCo e quem controla/gerencia a OpCo?
4. A OpCo cuidará só deste prédio ou de outros?
5. Já existem investidores internacionais interessados?
6. Qual o papel e a remuneração do Portal Paraguai?
7. A Zuvia aceita o nosso caso? Há estudo de viabilidade com eles?
8. Quais APIs e ambientes de teste a Zuvia e a B3 disponibilizam?

---

## Fontes

- [Zuvia e B3 realizam negociação subsequente de ativos de crowdfunding (Okai, 25/08/2025)](https://okai.com.br/noticia/2025-08-25/b3-e-zuvia-realizam-negociacao-subsequente-de-ativos-de-crowdfunding)
- [Token imobiliário é liberado para negociação em plataforma integrada à B3 (InfoMoney, via CNBSP, 22/08/2025)](https://cnbsp.org.br/2025/08/22/infomoney-token-imobiliario-e-liberado-para-negociacao-em-plataforma-integrada-a-b3/)
- Documentos do projeto: Escopo v3 (Assunção) e Estudo de mercado de Assunção e Ciudad del Este.
