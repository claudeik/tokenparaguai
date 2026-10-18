/**
 * Módulo de Domínio — Portal EPYX Wealth (v0.2)
 * Produto B: Pick & Go Cross-Border (Portal Paraguai + Cambio Real Pix Split + Correios Remessa Conforme)
 * Governança Transversal: IAM / RBAC (Seção 6), Pipeline de Ativos (Seção 4.3) e CMS Compliance (Seção 4.3.1)
 */

window.EPYX_PORTAL_DATA = {
  institucional: {
    marca: 'EPYX Wealth',
    versaoPortal: 'v0.2 · 17/out/2026',
    principioArquitetura:
      'Sem custódia própria de valores mobiliários ou moeda: no Produto A a oferta, KYC e liquidação ocorrem na Zuvia/B3; no Produto B o pagamento Pix e o split financeiro ocorrem via Cambio Real.',
    entidadesGrupo: [
      { sigla: 'EPYX Wealth', papel: 'Plataforma tecnológica, produto e operação do portal público [entidade a definir]' },
      { sigla: 'Zuvia + B3', papel: 'Distribuição regulada CVM Res. 88, KYC/Suitability, escrituração e mercado subsequente (Produto A)' },
      { sigla: 'Portal Paraguai', papel: 'Canal oficial de divulgação (80+ lojistas) e operação física de picking/retirada em Ciudad del Este (Produto B)' },
      { sigla: 'Cambio Real', papel: 'Instituição de pagamento e câmbio responsável pelo Pix dinâmico e split automático sem retenção pela EPYX (Produto B)' },
      { sigla: 'Correios (Remessa Conforme)', papel: 'Logística cross-border opcional para envio ao Brasil com cálculo prévio de tributos (Produto B)' }
    ]
  },

  pilotoPickAndGo: {
    cidade: 'Ciudad del Este (Ponte da Amizade / Microcentro)',
    escalaPiloto: '5 Lojas Âncora · 10 Operadores (Pickers) · Turno Único 08h00 às 18h00',
    indicadoresOperacionais: [
      { rotulo: 'Pedidos / Hora / Picker', valor: '4,8 pedidos/h', meta: 'Meta Piloto: > 4,0/h (10 operadores)' },
      { rotulo: 'Tempo Pagamento → Pronto p/ Retirada', valor: '11 min 20 s', meta: 'Zero fila de caixa para o turista' },
      { rotulo: 'Taxa de Divergência no Picking', valor: '0,42%', meta: 'Conferência dupla Picker + Lojista' },
      { rotulo: 'NPS Turista Brasileiro / Lojista', valor: '91 / 88', meta: 'Liquidação Cambio Real D+0/D+1' }
    ],
    lojasHomologadas: [
      {
        id: 'LOJA-CELLSHOP',
        nome: 'Cellshop Importados Paraguay',
        contratoId: 'CTR-PP-2026-001',
        pontoRetirada: 'Balcão Exclusivo Pick & Go — Piso Térreo Anexo Av. Carlos Antonio López',
        moedaRepasse: 'US$ (via Cambio Real)',
        comissaoPortalPct: 4.5,
        parcelaEpyxPct: 1.2,
        status: 'OPERACIONAL_PILOTO'
      },
      {
        id: 'LOJA-NISSIN',
        nome: 'Nissei Casa Matriz CDE',
        contratoId: 'CTR-PP-2026-002',
        pontoRetirada: 'Lounge Fast-Exit EPYX / Portal Paraguai — Av. Adrián Jara',
        moedaRepasse: 'US$ (via Cambio Real)',
        comissaoPortalPct: 4.5,
        parcelaEpyxPct: 1.2,
        status: 'OPERACIONAL_PILOTO'
      },
      {
        id: 'LOJA-MEGA',
        nome: 'Mega Eletrônicos',
        contratoId: 'CTR-PP-2026-003',
        pontoRetirada: 'Locker & Balcão Conferência Rápida — Piso 1',
        moedaRepasse: 'G$ Guaranis (via Cambio Real)',
        comissaoPortalPct: 4.8,
        parcelaEpyxPct: 1.2,
        status: 'OPERACIONAL_PILOTO'
      },
      {
        id: 'LOJA-MONALISA',
        nome: 'Monalisa Paraguay Luxury Store',
        contratoId: 'CTR-PP-2026-004',
        pontoRetirada: 'Concierge Pick & Go — Piso Boulevard',
        moedaRepasse: 'US$ (via Cambio Real)',
        comissaoPortalPct: 5.0,
        parcelaEpyxPct: 1.5,
        status: 'OPERACIONAL_PILOTO'
      },
      {
        id: 'LOJA-MADRID',
        nome: 'Madrid Center Importados',
        contratoId: 'CTR-PP-2026-005',
        pontoRetirada: 'Ponto Express Galeria San Blas',
        moedaRepasse: 'R$ / US$ (via Cambio Real)',
        comissaoPortalPct: 4.5,
        parcelaEpyxPct: 1.2,
        status: 'OPERACIONAL_PILOTO'
      }
    ],

    catalogoProdutos: [
      {
        id: 'PROD-01',
        lojaId: 'LOJA-NISSIN',
        lojaNome: 'Nissei Casa Matriz CDE',
        sku: 'NIS-APL-16PRO-256',
        nome: 'Smartphone Pro Max 256GB Titanium (Garantia Oficial Loja)',
        categoria: 'Tecnologia & Mobilidade',
        precoUsd: 1080.00,
        estoque: 18,
        pontoRetirada: 'Lounge Fast-Exit EPYX — Av. Adrián Jara',
        elegivelCorreios: false
      },
      {
        id: 'PROD-02',
        lojaId: 'LOJA-CELLSHOP',
        lojaNome: 'Cellshop Importados Paraguay',
        sku: 'CEL-GAR-FENIX8',
        nome: 'Smartwatch Multisport Sapphire Solar GPS Titanium',
        categoria: 'Wearables & Esporte',
        precoUsd: 790.00,
        estoque: 14,
        pontoRetirada: 'Balcão Exclusivo Pick & Go — Piso Térreo Anexo',
        elegivelCorreios: true
      },
      {
        id: 'PROD-03',
        lojaId: 'LOJA-MONALISA',
        lojaNome: 'Monalisa Paraguay Luxury Store',
        sku: 'MON-PRF-NICHE-100',
        nome: 'Eau de Parfum Haute Parfumerie Française 100ml',
        categoria: 'Perfumaria & Luxo',
        precoUsd: 245.00,
        estoque: 32,
        pontoRetirada: 'Concierge Pick & Go — Piso Boulevard',
        elegivelCorreios: true
      },
      {
        id: 'PROD-04',
        lojaId: 'LOJA-MEGA',
        lojaNome: 'Mega Eletrônicos',
        sku: 'MEG-AUD-ANC-PRO',
        nome: 'Headphone Wireless Noise Cancelling Studio Reference',
        categoria: 'Áudio Alta Fidelidade',
        precoUsd: 310.00,
        estoque: 25,
        pontoRetirada: 'Locker & Balcão Conferência Rápida — Piso 1',
        elegivelCorreios: true
      },
      {
        id: 'PROD-05',
        lojaId: 'LOJA-MADRID',
        lojaNome: 'Madrid Center Importados',
        sku: 'MAD-CAM-MIRROR-4K',
        nome: 'Lente Prime 35mm f/1.4 Full-Frame Cinema Series',
        categoria: 'Fotografia Profissional',
        precoUsd: 860.00,
        estoque: 9,
        pontoRetirada: 'Ponto Express Galeria San Blas',
        elegivelCorreios: true
      },
      {
        id: 'PROD-06',
        lojaId: 'LOJA-CELLSHOP',
        lojaNome: 'Cellshop Importados Paraguay',
        sku: 'CEL-TAB-AIR-M2',
        nome: 'Tablet Pro 11" Wi-Fi 256GB + Stylus Pen',
        categoria: 'Tecnologia & Mobilidade',
        precoUsd: 640.00,
        estoque: 21,
        pontoRetirada: 'Balcão Exclusivo Pick & Go — Piso Térreo Anexo',
        elegivelCorreios: true
      }
    ],

    filaPedidosOperador: [
      {
        id: 'PED-CDE-8841',
        turista: 'Marcelo V. (Doc. ***.412.890-**)',
        loja: 'Nissei Casa Matriz CDE',
        itensResumo: '1x Smartphone Pro Max 256GB',
        totalUsd: 1080.00,
        totalPixBrl: 6102.00,
        pixTxId: 'E18236120202610172045a98b1c',
        pickerDesignado: 'Picker #03 — Rodrigo Benítez',
        modalidade: 'Retirada Expressa Loja (QR Code)',
        estado: 'Pronto para retirada'
      },
      {
        id: 'PED-CDE-8842',
        turista: 'Fernanda L. (Doc. ***.881.230-**)',
        loja: 'Monalisa Paraguay + Cellshop (Multi-Loja)',
        itensResumo: '1x Eau de Parfum 100ml + 1x Headphone Studio',
        totalUsd: 555.00,
        totalPixBrl: 3135.75,
        pixTxId: 'E18236120202610172051c44d2e',
        pickerDesignado: 'Picker #07 — Camila Duarte',
        modalidade: 'Retirada Expressa Loja (QR Code)',
        estado: 'Em separação'
      },
      {
        id: 'PED-CDE-8843',
        turista: 'Eduardo K. (Doc. ***.109.554-**)',
        loja: 'Mega Eletrônicos',
        itensResumo: '1x Headphone Wireless ANC',
        totalUsd: 310.00,
        totalPixBrl: 2568.40,
        pixTxId: 'E18236120202610172010f71a9b',
        pickerDesignado: 'Picker #01 — Diego Galeano',
        modalidade: 'Correios Packet · Remessa Conforme (Frete + Tributos Inclusos)',
        estado: 'Separado'
      }
    ],

    faturasRepasseLojas: [
      {
        faturaId: 'FAT-2026-10-W3-NIS',
        loja: 'Nissei Casa Matriz CDE',
        brutoUsd: 48200.00,
        comissaoPortalUsd: 2169.00,
        ajusteFaltanteUsd: 0.00,
        liquidoLojistaUsd: 46031.00,
        status: 'LIQUIDADO_CAMBIO_REAL'
      },
      {
        faturaId: 'FAT-2026-10-W3-CEL',
        loja: 'Cellshop Importados Paraguay',
        brutoUsd: 39450.00,
        comissaoPortalUsd: 1775.25,
        ajusteFaltanteUsd: -120.00,
        liquidoLojistaUsd: 37554.75,
        status: 'EM_CONCILIACAO_DIARIA'
      },
      {
        faturaId: 'FAT-2026-10-W3-MON',
        loja: 'Monalisa Paraguay Luxury Store',
        brutoUsd: 22800.00,
        comissaoPortalUsd: 1140.00,
        ajusteFaltanteUsd: 0.00,
        liquidoLojistaUsd: 21660.00,
        status: 'LIQUIDADO_CAMBIO_REAL'
      }
    ]
  },

  pipelineAtivosProdutoA: [
    { etapa: '1. Triagem', descricao: 'Ficha mínima do ativo, matrícula única DGRP, vendedor, localização e renda esperada.', status: 'CONCLUÍDO (4 prédios mapeados)' },
    { etapa: '2. Diligência', descricao: 'Auditoria jurídica BR/PY, técnica, fiscal, ambiental e laudo independente (CBRE/Colliers).', status: 'CONCLUÍDO / EM REVISÃO P1–P6' },
    { etapa: '3. Estruturação', descricao: 'Constituição SPE/PropCo PY, Contrato Mestre de Locação com OpCo PY e série do token.', status: 'ESTRUTURADO' },
    { etapa: '4. Aprovação Interna', descricao: 'Deliberação do Comitê EPYX Wealth e parecer jurídico formal antes de qualquer divulgação.', status: 'GATE ATIVO' },
    { etapa: '5. Submissão à Zuvia', descricao: 'Registro da oferta sob Resolução CVM 88 e espelhamento na infraestrutura B3.', status: 'INTEGRAÇÃO FASE 1' },
    { etapa: '6. Publicação no Portal', descricao: 'Exibição pública apenas com selo de aprovação do Compliance e sem termos proibidos.', status: 'OPERACIONAL' },
    { etapa: '7. Pós-Oferta', descricao: 'Relatórios mensais de caixa OpCo → PropCo, conciliação B3 e laudo anual de valor justo.', status: 'OPERACIONAL (ZUV-WTC03)' }
  ],

  conteudosCanalPortalParaguai: [
    {
      id: 'CMS-101',
      titulo: 'Guia Técnico: O que significa o Grau de Investimento (Baa3 Moody’s) do Paraguai para o Mercado Imobiliário de Assunção',
      produtoAlvo: 'Produto A · Tokenização Imobiliária',
      autor: 'Redação Portal Paraguai',
      revisadoPor: 'Compliance Jurídico EPYX Wealth',
      statusCompliance: 'APROVADO_PUBLICADO',
      resumo: 'Análise macroeconômica do eixo corporativo Villa Morra / Paseo La Galería, regime fiscal territorial 10-10-10 e como funciona a proteção contratual PropCo–OpCo sem promessa de rentabilidade.'
    },
    {
      id: 'CMS-102',
      titulo: 'Como funciona o Pick & Go em Ciudad del Este: compre por Pix via Cambio Real e retire sem fila de caixa',
      produtoAlvo: 'Produto B · Pick & Go Cross-Border',
      autor: 'Equipe Operações Portal Paraguai',
      revisadoPor: 'Compliance Jurídico EPYX Wealth',
      statusCompliance: 'APROVADO_PUBLICADO',
      resumo: 'Passo a passo da jornada nas 5 lojas do piloto, conferência dupla pelo picker exclusivo, cotas de isenção de bagagem acompanhada e opção de envio pelos Correios (Remessa Conforme).'
    },
    {
      id: 'CMS-103',
      titulo: '[RASCUNHO BLOQUEADO] Invista em Assunção com lucro certo e recompra garantida em dólar',
      produtoAlvo: 'Produto A · Tokenização Imobiliária',
      autor: 'Marketing Externo (Submissão bloqueada)',
      revisadoPor: 'Motor Automático Compliance (Seção 4.3.1)',
      statusCompliance: 'BLOQUEADO_COMPLIANCE',
      resumo: 'Peça retida automaticamente pela regra 4.3.1: contém expressões vedadas ("lucro certo", "recompra garantida" sem contrato específico). O canal de marketing não possui permissão para publicar ofertas.'
    }
  ],

  matrizPapeisRbac: [
    {
      codigo: 'VISITANTE',
      nome: 'Visitante Público',
      acessoProdutoA: 'Visualiza vitrine pública de ofertas e regras de risco',
      acessoProdutoB: 'Visualiza lojas homologadas e catálogo Pick & Go',
      restricaoSeguranca: 'Sem acesso a posições individuais ou painéis operacionais.'
    },
    {
      codigo: 'INVESTIDOR',
      nome: 'Investidor (BR / PY) · MFA Ativo',
      acessoProdutoA: 'Leitura de posição, proventos e laudos via API Zuvia + SSO para subscrição na Zuvia',
      acessoProdutoB: 'Pode atuar como comprador no Pick & Go com conta única (dados financeiros segregados)',
      restricaoSeguranca: 'O Portal EPYX Wealth não armazena dados de KYC/Suitability; apenas vínculo ID Zuvia.'
    },
    {
      codigo: 'TURISTA',
      nome: 'Turista Comprador (Produto B)',
      acessoProdutoA: 'Apenas vitrine pública',
      acessoProdutoB: 'Monta carrinho multi-loja, paga Pix via Cambio Real, gera QR de retirada ou envio Correios',
      restricaoSeguranca: 'Totalmente isolado da base de investidores CVM 88.'
    },
    {
      codigo: 'LOJISTA',
      nome: 'Lojista Parceiro (Portal Paraguai)',
      acessoProdutoA: 'Bloqueado (N/A)',
      acessoProdutoB: 'Gere catálogo/estoque da sua loja, acompanha separação e faturas de repasse Cambio Real',
      restricaoSeguranca: 'Proibido acesso a dados de investidores do Produto A ou de outras lojas.'
    },
    {
      codigo: 'OPERADOR',
      nome: 'Operador / Picker (Turno 08h–18h CDE)',
      acessoProdutoA: 'Bloqueado (N/A)',
      acessoProdutoB: 'Fila de picking nas 5 lojas, conferência física, QR de saída e registro de exceções',
      restricaoSeguranca: 'Zero acesso a dados regulados de investidores (Seção 6).'
    },
    {
      codigo: 'COMPLIANCE',
      nome: 'Compliance / Jurídico & Admin EPYX',
      acessoProdutoA: 'Aprova/bloqueia materiais de oferta, audita Gates 6.2/6.3 e conciliação B3',
      acessoProdutoB: 'Audita termos, estornos, faturas de split Cambio Real e trilha imutável',
      restricaoSeguranca: 'Alçada obrigatória para publicação de qualquer peça de oferta.'
    }
  ]
};
