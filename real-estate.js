/**
 * Módulo de Dados e Domínio — Marketplace de Tokens Imobiliários no Paraguai (Assunção)
 * Arquitetura: Investidores (BR) → Emissor CIC (BR) → PropCo (PY · Matrícula Única) ↔ OpCo (PY)
 * Infraestrutura de Registro e Negociação: Zuvia (CVM Res. 88) + Tecnologia B3 + Liquidação Pix
 */

window.REAL_ESTATE_DATA = {
  meta: {
    versaoEspecificacao: 'v0.1 · 17/10/2026',
    autor: 'Cláudio Ikeda (CTO)',
    statusSoberanoParaguai: 'Investment Grade — Baa3 (Moody’s) / BB+ (S&P & Fitch)',
    regimeTributarioPY: 'Sistema territorial 10-10-10 (IVA Imobiliário / Renda Locação / Dividendos)',
    cambioReferencia: {
      usdBrl: 5.65,
      usdPyg: 7820,
      fonte: 'PTAX BCB / BCP Referencial [carimbo de tempo UTC]',
      atualizadoEm: '2026-10-17T17:30:00Z'
    },
    precoTokenPadraoBrl: 25.00
  },

  construtoras: [
    {
      id: 'CONST-FORTIS',
      nome: 'Fortis & Morra Desarrollos S.A.',
      rating: 'AAA',
      scoreRisco: '96/100 · Risco Muito Baixo',
      anosMercado: 24,
      m2Entregues: '185.000 m²',
      pontualidadeObras: '99,2%',
      alavancagemDividaPl: '0,18x',
      garantiaEscrow: 'Fideicomiso Bancário (Banco Itaú Paraguay / Sudameris) + Seguro de Conclusão',
      obrasReferencia: [
        'Torre Aviadores Corporate (Av. Aviadores del Chaco, 22 andares — 100% locado)',
        'Edifício Lumina Villa Morra (R. Senador Long — entregue 2 meses antes do prazo)',
        'Residencial Jardines de Santa Teresa (Eixo Paseo La Galería)'
      ],
      auditoriaFinanceira: 'Big Four (PwC Paraguay · Exercício 2025/2026)'
    },
    {
      id: 'CONST-EJE',
      nome: 'Constructora Eje Corporativo S.A.',
      rating: 'AA+',
      scoreRisco: '92/100 · Risco Baixo',
      anosMercado: 19,
      m2Entregues: '142.000 m²',
      pontualidadeObras: '97,8%',
      alavancagemDividaPl: '0,24x',
      garantiaEscrow: 'Conta Escrow Vinculada à Matrícula + Fiança de Performance de Obra',
      obrasReferencia: [
        'Mariscal Executive Center (Av. Mariscal López · Villa Morra)',
        'Palacio Recoleta Suites (Bairro Recoleta / Villa Morra)',
        'Domus Boggiani Corporate (Av. Boggiani)'
      ],
      auditoriaFinanceira: 'Deloitte Paraguay · Exercício 2025/2026'
    },
    {
      id: 'CONST-COSTANERA',
      nome: 'Grupo Costanera & Asunción Prime S.A.',
      rating: 'AA',
      scoreRisco: '90/100 · Risco Baixo (Ativo Operacional)',
      anosMercado: 21,
      m2Entregues: '164.500 m²',
      pontualidadeObras: '98,5%',
      alavancagemDividaPl: '0,21x',
      garantiaEscrow: 'Imóvel Pronto c/ Matrícula Única Registrada + Reserva Técnica de 6 Aluguéis na OpCo',
      obrasReferencia: [
        'The Hub Ykua Sati (Ativo em operação com 92% de ocupação média)',
        'WTC Asunción Boulevard Lofts (Eixo Aviadores del Chaco)',
        'Mirador del Chaco Residencias (Santa Teresa)'
      ],
      auditoriaFinanceira: 'EY Paraguay · Exercício 2025/2026'
    },
    {
      id: 'CONST-CHACO',
      nome: 'Inmobiliaria del Chaco & Mariscal S.A.',
      rating: 'A+',
      scoreRisco: '86/100 · Risco Moderado-Baixo',
      anosMercado: 15,
      m2Entregues: '94.000 m²',
      pontualidadeObras: '95,4%',
      alavancagemDividaPl: '0,31x',
      garantiaEscrow: 'Fideicomiso de Administração de Obra + Retenção de 15% pró-entrega de Habite-se',
      obrasReferencia: [
        'Boutique Lofts Lillo (Calle Lillo, Villa Morra)',
        'Edifício San Martín Design (Eixo Villa Morra)',
        'Suites del Sol (Próximo ao Shopping del Sol)'
      ],
      auditoriaFinanceira: 'Grant Thornton Paraguay · Exercício 2025/2026'
    }
  ],

  ativos: [
    {
      id: 'ATIVO-01',
      simbolo: 'ZUV-GAL01',
      nome: 'Edifício Torre Paseo Galería Prime',
      zona: 'Paseo La Galería / Santa Teresa',
      endereco: 'Av. Santa Teresa c/ Av. Aviadores del Chaco (a 180m do Shopping Paseo La Galería & WTC)',
      construtoraId: 'CONST-FORTIS',
      construtoraNome: 'Fortis & Morra Desarrollos S.A.',
      ratingConstrutora: 'AAA',
      statusCiclo: 'Em oferta',
      faseObra: 'Lançamento Estruturado · Entrega em 18 meses (Prédio Inteiro · Matrícula Única)',
      areaTotalM2: 4250,
      unidadesTotal: 64,
      mixCanais: { ancora: 45, flex: 35, curta: 20 },
      precoAquisicaoUsd: 2654867.26,
      valorAlvoBrl: 15000000.00,
      valorCaptadoBrl: 11400000.00,
      precoTokenBrl: 25.00,
      qtdTokensTotal: 600000,
      qtdTokensEmitidos: 456000,
      rendaProjetadaUsdAa: 8.4,
      pisoOpCoUsdAa: 6.8,
      ocupacaoAlvoPct: 89,
      adrMedioUsd: 88,
      propCoNome: 'PropCo Galería Prime S.A. (PY)',
      matriculaPy: 'Matrícula Nº A01-48.921 — Dirección General de los Registros Públicos (Assunção)',
      statusGate62: 'LIBERADO_COM_CLÁUSULA_REGISTRO',
      navLaudoPorTokenBrl: 25.00,
      ultimoPrecoB3Brl: 25.40,
      hashLaudo: 'sha256:9f84c2e17a6b30d84a9120c7e51d2a8b4f6e9c1d2b3a4f5e6d7c8b9a0f1e2d3c',
      avaliadorLaudo: 'CBRE LatAm / Tasaciones Asunción S.R.L.',
      destaques: [
        'Prédio inteiro de 64 unidades mobiliadas no metro quadrado mais líquido de Assunção',
        'Contrato Mestre PropCo–OpCo de 10 anos com aluguel mínimo fixo em US$ (Piso 6,8% a.a.)',
        'Demanda executiva de multinacionais instaladas nas torres do Paseo La Galería e WTC'
      ]
    },
    {
      id: 'ATIVO-02',
      simbolo: 'ZUV-VMOR02',
      nome: 'Villa Morra Mariscal Collection',
      zona: 'Villa Morra / Mariscal López',
      endereco: 'Av. Mariscal López esq. Senador Long · Coração de Villa Morra, Assunção',
      construtoraId: 'CONST-EJE',
      construtoraNome: 'Constructora Eje Corporativo S.A.',
      ratingConstrutora: 'AA+',
      statusCiclo: 'Em oferta',
      faseObra: 'Obras em Fundação (32% concluído) · Prédio Inteiro Residencial Executivo',
      areaTotalM2: 3680,
      unidadesTotal: 52,
      mixCanais: { ancora: 55, flex: 30, curta: 15 },
      precoAquisicaoUsd: 2212389.38,
      valorAlvoBrl: 12500000.00,
      valorCaptadoBrl: 8375000.00,
      precoTokenBrl: 25.00,
      qtdTokensTotal: 500000,
      qtdTokensEmitidos: 335000,
      rendaProjetadaUsdAa: 7.9,
      pisoOpCoUsdAa: 6.5,
      ocupacaoAlvoPct: 91,
      adrMedioUsd: 82,
      propCoNome: 'PropCo Mariscal Villa Morra S.A. (PY)',
      matriculaPy: 'Matrícula Nº A01-51.304 — DGRP Assunção (Sob Condição Suspensiva Gate 6.2)',
      statusGate62: 'AGUARDANDO_CERTIDAO_MATRICULA',
      navLaudoPorTokenBrl: 25.00,
      ultimoPrecoB3Brl: 25.15,
      hashLaudo: 'sha256:4a12b7d93e0f81c2b5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90',
      avaliadorLaudo: 'Colliers International Cono Sur',
      destaques: [
        'Localização clássica de embaixadas, cafés premium e Shopping Mariscal em Villa Morra',
        'Foco em contratos âncora de 6 a 12 meses em dólar para diplomatas e expatriados',
        'Sem liberação de caixa antes da averbação definitiva da Matrícula Única na PropCo'
      ]
    },
    {
      id: 'ATIVO-03',
      simbolo: 'ZUV-WTC03',
      nome: 'The Hub Ykua Sati · Paseo & WTC',
      zona: 'Ykua Sati / WTC',
      endereco: 'Calle Profesor Delia Frutos c/ Av. Aviadores del Chaco · Ykua Sati, Assunção',
      construtoraId: 'CONST-COSTANERA',
      construtoraNome: 'Grupo Costanera & Asunción Prime S.A.',
      ratingConstrutora: 'AA',
      statusCiclo: 'Ativo em operação · Mercado subsequente',
      faseObra: '100% Entregue e Operacional · 92% de Ocupação Comprovada',
      areaTotalM2: 3920,
      unidadesTotal: 58,
      mixCanais: { ancora: 50, flex: 30, curta: 20 },
      precoAquisicaoUsd: 2433628.32,
      valorAlvoBrl: 13750000.00,
      valorCaptadoBrl: 13750000.00,
      precoTokenBrl: 25.00,
      qtdTokensTotal: 550000,
      qtdTokensEmitidos: 550000,
      rendaProjetadaUsdAa: 8.8,
      pisoOpCoUsdAa: 7.0,
      ocupacaoAlvoPct: 92,
      adrMedioUsd: 94,
      propCoNome: 'PropCo Ykua Sati Hub S.A. (PY)',
      matriculaPy: 'Matrícula Nº A01-39.812 — DGRP Assunção (Averbação Definitiva Confirmada)',
      statusGate62: 'MATRICULA_REGISTRADA_AUDITADA',
      navLaudoPorTokenBrl: 26.85,
      ultimoPrecoB3Brl: 27.30,
      hashLaudo: 'sha256:7d3e8f1a2b4c6d8e0f1a3b5c7d9e1f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e',
      avaliadorLaudo: 'Cushman & Wakefield Cono Sur',
      destaques: [
        'Prédio em operação plena distribuindo dividendos mensais via Pix em R$ indexados ao US$',
        'Histórico auditado de 14 meses de repasses OpCo → PropCo sem atraso',
        'Negociação ativa no mercado subsequente integrado à infraestrutura B3 / Zuvia'
      ]
    },
    {
      id: 'ATIVO-04',
      simbolo: 'ZUV-PACH04',
      nome: 'Palacio Pacheco Boutique Suites',
      zona: 'Villa Morra / Mariscal López',
      endereco: 'Calle Pacheco c/ Choferes del Chaco · Villa Morra Sul, Assunção',
      construtoraId: 'CONST-CHACO',
      construtoraNome: 'Inmobiliaria del Chaco & Mariscal S.A.',
      ratingConstrutora: 'A+',
      statusCiclo: 'Em oferta',
      faseObra: 'Lançamento Residencial Boutique Mobiliado · Entrega em 20 meses',
      areaTotalM2: 3100,
      unidadesTotal: 48,
      mixCanais: { ancora: 35, flex: 40, curta: 25 },
      precoAquisicaoUsd: 1769911.50,
      valorAlvoBrl: 10000000.00,
      valorCaptadoBrl: 5200000.00,
      precoTokenBrl: 25.00,
      qtdTokensTotal: 400000,
      qtdTokensEmitidos: 208000,
      rendaProjetadaUsdAa: 9.1,
      pisoOpCoUsdAa: 7.0,
      ocupacaoAlvoPct: 87,
      adrMedioUsd: 79,
      propCoNome: 'PropCo Pacheco Suites S.A. (PY)',
      matriculaPy: 'Matrícula Nº A01-52.990 — DGRP Assunção (Contrato Condicionado à Captação)',
      statusGate62: 'AGUARDANDO_CERTIDAO_MATRICULA',
      navLaudoPorTokenBrl: 25.00,
      ultimoPrecoB3Brl: 25.00,
      hashLaudo: 'sha256:1b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c',
      avaliadorLaudo: 'Tasaciones Asunción S.R.L.',
      destaques: [
        'Ticket de entrada otimizado (captação-alvo R$ 10 MM — 400 mil tokens a R$ 25)',
        'Alto yield projetado em dólar pelo mix de estadias flex (30–90 dias) e executivos de tecnologia',
        'Covenant contratual de substituição automática da OpCo caso ocupação fique < 75% por 2 trimestres'
      ]
    }
  ],

  cenariosIlustrativos: [
    {
      id: 'CEN-CONSERVADOR',
      rotulo: 'Cenário Ilustrativo Conservador [NÃO PROMETIDO]',
      taxaValorizacaoAnualUsd: 3.5,
      avisoRegulatorio: 'Simulação meramente ilustrativa (Seção 0 e Seção 8). Valorização patrimonial é variação contábil de valor justo (não distribuível em caixa mensal) e depende de laudo anual independente ou liquidação do prédio.'
    },
    {
      id: 'CEN-BASE-IG',
      rotulo: 'Cenário Ilustrativo Base · Pós-Investment Grade PY [NÃO PROMETIDO]',
      taxaValorizacaoAnualUsd: 6.0,
      avisoRegulatorio: 'Simulação meramente ilustrativa (Seção 0 e Seção 8). Reflete compressão histórica de cap rate em capitais latino-americanas após obtenção de Investment Grade (Moody’s Baa3), sem qualquer promessa ou garantia de rentabilidade.'
    },
    {
      id: 'CEN-OTIMISTA',
      rotulo: 'Cenário Ilustrativo Expansão Eixo Corporativo [NÃO PROMETIDO]',
      taxaValorizacaoAnualUsd: 8.5,
      avisoRegulatorio: 'Simulação meramente ilustrativa (Seção 0 e Seção 8). Nenhuma construtora, OpCo ou terceiro oferece garantia de recompra ou piso de valorização do imóvel.'
    }
  ],

  operacaoMensalOpCo: {
    mesReferencia: 'Outubro/2026',
    ativoReferencia: 'ZUV-WTC03 — The Hub Ykua Sati · Paseo & WTC',
    canais: [
      {
        canal: 'Âncora Corporativo (6 a 12 meses)',
        unidadesAlocadas: 29,
        ocupacaoPct: 96.5,
        receitaBrutaUsd: 34800.00,
        despesasOpCoUsd: 4100.00,
        descricao: 'Executivos de multinacionais, embaixadas e trading companies no eixo Aviadores del Chaco'
      },
      {
        canal: 'Estadia Flex (30 a 90 dias)',
        unidadesAlocadas: 17,
        ocupacaoPct: 88.2,
        receitaBrutaUsd: 22950.00,
        despesasOpCoUsd: 3850.00,
        descricao: 'Consultores, projetos de engenharia/TI e profissionais em processo de residência fiscal no PY'
      },
      {
        canal: 'Curta Temporada Premium (1 a 29 dias)',
        unidadesAlocadas: 12,
        ocupacaoPct: 85.0,
        receitaBrutaUsd: 18400.00,
        despesasOpCoUsd: 4200.00,
        descricao: 'Turismo de negócios WTC Asunción e eventos corporativos Paseo La Galería'
      }
    ],
    resumoPropCo: {
      receitaBrutaTotalOpCoUsd: 76150.00,
      pisoContratualMestreUsd: 14200.00,
      aluguelPagoOpCoParaPropCoUsd: 21450.00,
      despesasPropCoSegurosContabUsd: 1620.00,
      impostosTerritoriaisPyUsd: 1983.00,
      reservaManutencaoFundoUsd: 847.00,
      caixaDistribuivelLiquidoUsd: 17000.00,
      cotacaoCambioAplicadaBrl: 5.65,
      caixaDistribuivelLiquidoBrl: 96050.00,
      qtdTokensElegiveis: 550000,
      proventoPorTokenBrl: 0.1746
    }
  },

  carteiraInvestidorPadrao: {
    investidorId: 'INV-BR-90412',
    nome: 'Investidor Qualificado / Varejo CVM 88 (CPF Validado na Zuvia)',
    residenciaFiscal: 'Brasil (LGPD Compliance)',
    statusKyc: 'APROVADO · MFA Ativo · Limite Anual Res. 88 Verificado',
    posicoes: [
      {
        simbolo: 'ZUV-WTC03',
        nomeAtivo: 'The Hub Ykua Sati · Paseo & WTC',
        qtdTokens: 1200,
        precoMedioAquisicaoBrl: 25.00,
        navLaudoPorTokenBrl: 26.85,
        ultimoPrecoB3Brl: 27.30,
        proventoMensalEstimadoBrl: 209.52,
        idExternoLedgerB3: 'B3-CIC-PY-WTC03-0001200'
      },
      {
        simbolo: 'ZUV-GAL01',
        nomeAtivo: 'Edifício Torre Paseo Galería Prime',
        qtdTokens: 800,
        precoMedioAquisicaoBrl: 25.00,
        navLaudoPorTokenBrl: 25.00,
        ultimoPrecoB3Brl: 25.40,
        proventoMensalEstimadoBrl: 140.00,
        idExternoLedgerB3: 'B3-CIC-PY-GAL01-0000800'
      }
    ]
  },

  livroOfertasB3: [
    { tipo: 'COMPRA (BID)', simbolo: 'ZUV-WTC03', qtd: 450, precoBrl: 27.15, origem: 'Ambiente Subsequente B3/Zuvia', status: 'Aberta' },
    { tipo: 'COMPRA (BID)', simbolo: 'ZUV-WTC03', qtd: 1000, precoBrl: 27.00, origem: 'Ambiente Subsequente B3/Zuvia', status: 'Aberta' },
    { tipo: 'VENDA (ASK)', simbolo: 'ZUV-WTC03', qtd: 320, precoBrl: 27.30, origem: 'Ambiente Subsequente B3/Zuvia', status: 'Aberta' },
    { tipo: 'VENDA (ASK)', simbolo: 'ZUV-WTC03', qtd: 600, precoBrl: 27.55, origem: 'Ambiente Subsequente B3/Zuvia', status: 'Aberta' },
    { tipo: 'COMPRA (BID)', simbolo: 'ZUV-GAL01', qtd: 800, precoBrl: 25.00, origem: 'Subscrição Primária Zuvia', status: 'Em Captação' }
  ],

  pontosVerificacaoP1P6: [
    {
      codigo: 'P1',
      titulo: 'Autorização da Zuvia na CVM (Res. 88)',
      importancia: 'Confirmar número e data do ato declaratório de registro na CVM antes do go-live.',
      responsavel: 'Advogados Societários + Registro CVM',
      status: 'EM_VERIFICACAO_JURIDICA',
      bloqueioEngenharia: 'Camada Adaptador Zuvia isolada por interface (Port & Adapter).'
    },
    {
      codigo: 'P2',
      titulo: 'Limite de Captação por Emissor/Ano (Res. 88)',
      importancia: 'Verificar teto de R$ 15 milhões por oferta/ano sob Res. CVM 88 e porte máximo da SPE emissora.',
      responsavel: 'Advogados Mercado de Capitais (BR)',
      status: 'ESTRUTURADO_POR_SPE',
      bloqueioEngenharia: 'Trava dura no sistema: nenhuma série ultrapassa R$ 15.000.000,00 (600.000 tokens a R$ 25).'
    },
    {
      codigo: 'P3',
      titulo: 'Enquadramento de Ativo Imobiliário no Paraguai em CIC BR',
      importancia: 'Validar estrutura Emissor BR → PropCo PY (Opção A: veículo dedicado vs. Opção B: holding).',
      responsavel: 'Advogados BR + Escritório Jurídico Assunção (PY)',
      status: 'PARECER_EM_ELABORACAO',
      bloqueioEngenharia: 'Suporte nativo a Opção A (SPE PropCo dedicada) com documentos bilingues ES/PT-BR.'
    },
    {
      codigo: 'P4',
      titulo: 'Infraestrutura DLT/Ledger e APIs Zuvia + B3',
      importancia: 'Definir endpoints de titularidade, eventos de transferência e conciliação diária de posições.',
      responsavel: 'CTO (Cláudio Ikeda) + Time Técnico Zuvia/B3',
      status: 'DISCOVERY_TECNICO_FASE_1',
      bloqueioEngenharia: 'Conciliador diário implementado consumindo o Ledger B3 como única fonte de verdade.'
    },
    {
      codigo: 'P5',
      titulo: 'Definição do Veículo Emissor e Partes Relacionadas (OpCo)',
      importancia: 'Se participação da holding na OpCo > 20%, tratar Contrato PropCo–OpCo como parte relacionada.',
      responsavel: 'Advogados + Governança',
      status: 'GATE_IMPLEMENTADO',
      bloqueioEngenharia: 'Contrato Mestre PropCo–OpCo monitorado com alertas de covenant e direito de substituição.'
    },
    {
      codigo: 'P6',
      titulo: 'Seleção Final do Prédio, Vendedor, Preço Fechado e % OpCo',
      importancia: 'Congelar cap table, laudo de aquisição e cronograma de desembolso protegido pelo Gate 6.2.',
      responsavel: 'Cláudio Ikeda (CTO) + Comitê de Investimentos',
      status: '4_ATIVOS_MAPEADOS_VILLA_MORRA',
      bloqueioEngenharia: 'Todos os cenários de valorização marcados como [ILUSTRATIVO · NÃO PROMETIDO].'
    }
  ],

  conciliacaoDiariaB3: [
    { simbolo: 'ZUV-GAL01', posicoesLocais: 456000, ledgerB3: 456000, divergencia: 0, status: 'CONCILIADO_OK', ultimaVerificacao: '17/10/2026 17:30:05' },
    { simbolo: 'ZUV-VMOR02', posicoesLocais: 335000, ledgerB3: 335000, divergencia: 0, status: 'CONCILIADO_OK', ultimaVerificacao: '17/10/2026 17:30:05' },
    { simbolo: 'ZUV-WTC03', posicoesLocais: 550000, ledgerB3: 550000, divergencia: 0, status: 'CONCILIADO_OK', ultimaVerificacao: '17/10/2026 17:30:05' },
    { simbolo: 'ZUV-PACH04', posicoesLocais: 208000, ledgerB3: 208000, divergencia: 0, status: 'CONCILIADO_OK', ultimaVerificacao: '17/10/2026 17:30:05' }
  ],

  eventosAuditoria: [
    {
      id: 'EVT-9001',
      ts: '2026-10-17 16:40:12 UTC',
      ator: 'ServiçoConciliacaoB3 (System)',
      acao: 'RECONCILIACAO_DIARIA_LEDGER',
      entidade: 'Posicao × AdaptadorB3',
      detalhe: '1.549.000 tokens verificados em 4 séries (divergência = 0.0000). Fonte de verdade: B3.'
    },
    {
      id: 'EVT-9002',
      ts: '2026-10-17 15:15:44 UTC',
      ator: 'ServicoAtivo (Compliance PY)',
      acao: 'VERIFICACAO_MATRICULA_UNICA',
      entidade: 'Ativo(ZUV-WTC03)',
      detalhe: 'Certidão DGRP Assunção Matrícula Nº A01-39.812 validada com hash SHA-256.'
    },
    {
      id: 'EVT-9003',
      ts: '2026-10-17 14:02:19 UTC',
      ator: 'Cláudio Ikeda (CTO)',
      acao: 'TRAVA_REGULATORIA_SECAO_0',
      entidade: 'CenarioIlustrativo',
      detalhe: 'Política ativa: proibida exibição de valorização sem rótulo [CENÁRIO ILUSTRATIVO · NÃO PROMETIDO].'
    }
  ]
};
