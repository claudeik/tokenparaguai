# Portal EPYX Wealth — plataforma de tokenização de ativos (B3) e Pick & Go cross-border

**Versão:** v0.2 (rascunho) · **Data:** 17/out/2026 · **Autor:** Cláudio Ikeda (CTO)
**Status:** documento de trabalho para a equipe de produto e engenharia. Não é material de oferta.
**Convenção:** `[a definir]` = decisão em aberto; `[confirmar]` = fato que os advogados ou parceiros precisam validar.

---

## 0. Resumo

O Portal EPYX Wealth é **um portal com dois produtos sobre a mesma base de plataforma**:

| | Produto A — Tokenização | Produto B — Pick & Go cross-border |
|---|---|---|
| O que faz | Apresenta ofertas de tokens de ativos reais e acompanha o investidor | Permite ao turista brasileiro comprar nas lojas do Portal Paraguai, pagar por Pix e retirar sem passar pelo caixa |
| Primeiro caso | Prédio inteiro em Assunção (Villa Morra, Av. Mariscal López / Paseo La Galería) | Piloto em Ciudad del Este: 5 lojas, 10 pessoas, turno único 8h–18h |
| Parceiros | Zuvia (distribuição regulada, Res. CVM 88), B3 (infraestrutura e mercado secundário) | Portal Paraguai (80+ lojistas), parceiro de pagamento e câmbio (Cambio Real) |
| Regulação | CVM / B3 | Câmbio, tributação de bagagem e importação, consumo |

**Papéis (decididos):**
- **EPYX Wealth** é a plataforma (produto, tecnologia, operação do portal).
- **Portal Paraguai** é o canal de divulgação (marketing social, conteúdo e tráfego). No produto B é também o operador de lojas e picking.
- **Zuvia** distribui os tokens e conduz cadastro, subscrição e mercado secundário. A EPYX Wealth não distribui valores mobiliários por conta própria.

**Princípio de arquitetura:** o que é regulado (oferta, cadastro do investidor, subscrição, custódia do token) mora no ambiente da Zuvia/B3. O portal mostra, explica e encaminha. Os dois produtos compartilham identidade, interface e infraestrutura, mas **não misturam dados nem fluxos de dinheiro**.

---

## 1. Premissas e o que ainda não sabemos

1. A Zuvia é tratada como plataforma de crowdfunding autorizada pela CVM (Res. CVM 88) com infraestrutura B3. A autorização para este ativo e o enquadramento de um prédio paraguaio nos limites da Res. 88 são **pendências P1 e P2** [confirmar].
2. O protótipo atual (https://tokenparaguai.vercel.app/) é demonstração navegável, com marca "ZB3 PY·BR". Deve virar a base visual do portal, com marca EPYX Wealth.
3. A entidade jurídica que opera o portal (EPYX Wealth) e seu vínculo com a EPYX PY (Paraguai) e a EPYX SAS (Uruguai) são `[a definir]`.
4. Estrutura do ativo do Produto A: holding brasileira, PropCo paraguaia (dona do prédio) e OpCo paraguaia (loca e administra). O detalhe está na especificação `ESPECIFICACAO_IMOBILIARIO_ZUVIA.md` (v0.1), que este documento não repete.
5. Produto B: pagamento e câmbio pelo Cambio Real; envio ao Brasil pelos Correios com Remessa Conforme. O Portal Paraguai coleta os itens na loja e há ponto de retirada na própria loja ou em anexo. A taxa de serviço da operação está dentro da comissão do Portal.
6. Nada neste documento promete retorno, recompra ou comprovante de renda. Esses pontos dependem de série, contrato e parecer jurídico.

---

## 2. Visão do produto e usuários

### 2.1 Personas

| Persona | Produto | Necessidade |
|---|---|---|
| Investidor brasileiro | A | Entender o ativo, os riscos e a renda; subscrever com segurança; acompanhar posição |
| Investidor residente no Paraguai | A | Mesma jornada, com opções de recebimento em guaranis `[a definir]` |
| Turista brasileiro | B | Comprar com rapidez, pagar por Pix, não perder tempo no caixa |
| Lojista (Portal Paraguai) | B | Receber pedidos, separar itens, ser pago sem fricção |
| Operador do Portal (picker, atendimento) | B | Fila de pedidos, conferência, exceções |
| Equipe de marketing do Portal | A e B | Conteúdo, links rastreáveis, sem poder de alterar oferta |
| Compliance / jurídico | A e B | Revisar materiais, bloquear publicação, auditar |
| Administrador EPYX | A e B | Configurar, monitorar, suporte |

### 2.2 Mapa do portal (alto nível)

```
epyxwealth (portal)
├─ Início: duas portas — "Investir" e "Comprar no Paraguai"
├─ Investir (Produto A)
│   ├─ Ofertas (lista e ficha do ativo)
│   ├─ Como funciona / riscos / documentos
│   ├─ Entrar na Zuvia (cadastro e subscrição no ambiente regulado)
│   └─ Minha posição (leitura: tokens, renda, laudo, mercado) — via API Zuvia
├─ Comprar no Paraguai (Produto B)
│   ├─ Lojas e catálogo
│   ├─ Carrinho e pagamento Pix
│   ├─ Retirada (QR code, status do pedido)
│   └─ Envio ao Brasil (opcional)
├─ Conteúdo (canal Portal Paraguai)
└─ Conta única (login, perfil, idioma PT/ES)
```

---

## 3. Arquitetura compartilhada

### 3.1 Camadas

```
Canais       Portal web (PT/ES) · PWA mobile · painel do lojista · painel do operador · backoffice
Aplicação    BFF/API gateway · módulo Investir · módulo Pick & Go · CMS de conteúdo
Núcleo       Identidade e acesso · Pedidos/Estoque · Pagamentos · Notificações · Auditoria
Integrações  Zuvia (cadastro, ofertas, posição, renda) · B3 (via Zuvia) · Cambio Real (Pix, split, câmbio) · Correios (Remessa Conforme) · ERP/PDV das lojas
Dados        Banco transacional · armazenamento de documentos · analytics · logs imutáveis
```

### 3.2 Componentes principais

1. **Identidade e acesso (IAM):** conta única com login por e-mail, telefone ou Google; MFA obrigatório para áreas de investidor e painéis. Perfis e permissões por papel (seção 6).
2. **Módulo Investir:** exibe ofertas e documentos publicados pela Zuvia; faz o encaminhamento autenticado (SSO ou link assinado) ao ambiente regulado; mostra posição por API de leitura.
3. **Módulo Pick & Go:** catálogo, carrinho multi-loja, pedido, picking, retirada, exceções, fatura de repasse.
4. **Pagamentos:** Pix dinâmico por pedido (Produto B). Sem custódia de dinheiro pela EPYX Wealth nos dois produtos: no A o dinheiro corre na Zuvia/B3; no B corre pelo **Cambio Real**, com split por pedido.
5. **CMS e publicação:** conteúdo do canal Portal Paraguai com fluxo de aprovação. Páginas de oferta só vão ao ar com aprovação de compliance.
6. **Backoffice:** gestão de lojas, catálogo, pedidos, exceções, relatórios, trilha de auditoria.
7. **Observabilidade:** logs estruturados, métricas, alertas, painel de operação do piloto.

---

## 4. Produto A — Tokenização de ativos

### 4.1 Escopo do portal

| Função | Responsável | Notas |
|---|---|---|
| Vitrine de ofertas e ficha do ativo | Portal | Conteúdo vem da Zuvia/emissor e passa por compliance |
| Cadastro, KYC/suitability, subscrição, pagamento | **Zuvia** | O portal encaminha; não coleta dado regulado |
| Posição, renda recebida, laudo | Portal (leitura) | Dados por API da Zuvia, com cache e carimbo de data |
| Mercado secundário | Zuvia/B3 | Portal mostra livro e link; liquidez nunca é garantida |
| Relatórios periódicos e laudo anual | Emissor/Zuvia, exibidos no portal | Laudo por avaliador independente |
| Recebimento da renda | Agente pagador e instituições parceiras | Opções em reais (Pix) ou guaranis `[a definir]` |

### 4.3 Pipeline de ativos (para além do primeiro prédio)

1. **Triagem:** ficha mínima do ativo, matrícula/título, vendedor, localização, renda esperada.
2. **Diligência:** jurídica, técnica, fiscal, ambiental, laudo de avaliação. Checklist no backoffice com responsável e status.
3. **Estruturação:** veículo, contrato de locação/operação, tributação, série do token, janela de resgate (se houver).
4. **Aprovação interna:** comitê da EPYX Wealth e parecer jurídico.
5. **Submissão à Zuvia** e aprovação regulatória.
6. **Publicação** no portal com materiais aprovados.
7. **Pós-oferta:** relatórios, laudo anual, gestão de eventos.

---

## 5. Produto B — Pick & Go cross-border

### 5.1 Conceito

O turista brasileiro escolhe produtos nas lojas do Portal Paraguai antes de chegar ou dentro da loja, paga por Pix sem passar pelo caixa e retira o pedido separado (picking prévio) ou com checagem de saída. O envio ao Brasil é opcional.

### 5.4 Regras de operação (decididas)

- O Portal coleta os itens na loja; há ponto de retirada na própria loja ou em anexo.
- **Taxa de serviço** da operação está dentro da comissão do Portal Paraguai.
- Depois que o cliente sai, **defeito e reclamação são da loja**.
- **Item faltante ou a mais** se acerta na fatura ou com reposição na loja.
- **Piloto:** 5 lojas, 10 pessoas, turno único das 8h às 18h.

### 5.5 Estados do pedido

```
Criado → Pago → Em separação → Separado → Pronto para retirada → Retirado
                           ↘ Exceção (item faltante, divergência, recusa) → Resolvido
Retirado → (opcional) Despachado ao Brasil → Entregue
Qualquer estado até "Retirado" → Cancelado (com regra de estorno)
```

---

## 6. Papéis e permissões

| Papel | Produto A | Produto B |
|---|---|---|
| Visitante | Ver vitrine pública | Ver lojas e catálogo |
| Investidor | Ver posição (leitura) | n/a |
| Turista | n/a | Comprar, pagar, retirar |
| Lojista | n/a | Gerir catálogo e pedidos da sua loja |
| Operador | n/a | Separar, conferir, resolver exceções |
| Marketing (Portal) | Criar conteúdo, **sem** publicar oferta | Criar campanhas |
| Compliance | Aprovar/bloquear materiais e ofertas | Revisar termos |
| Admin EPYX | Configuração, suporte, auditoria | Configuração, suporte, auditoria |

---

## 10. Roadmap (esboço)

| Fase | Entrega | Critério de saída |
|---|---|---|
| 0 · Fundamentos (2–3 sem) | Marca EPYX Wealth, IAM, layout base, adaptador Zuvia simulado, CMS com aprovação | Portal navegável com as duas portas |
| 1 · Piloto Pick & Go (4–6 sem) | Catálogo de 5 lojas, Pix com split no Cambio Real, picking, retirada, fatura | 10 pessoas em turno único operando; indicadores medidos |
| 2 · Investir v1 (paralelo, depende da Zuvia) | Vitrine real, SSO, leitura de posição, regras de divulgação aplicadas | Aprovação regulatória e contrato de integração fechados |
| 3 · Escala | Mais lojas, envio ao Brasil pelos Correios (Remessa Conforme), segundo ativo no pipeline | Metas de volume e NPS |
| 4 · Expansão | Foz do Iguaçu e Ciudad del Este como novos ativos e operações | Decisão de produto |
