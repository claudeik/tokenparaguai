/**
 * Controlador Institucional — Portal EPYX Wealth Management
 * Plataforma de Tokenização de Ativos Reais (Zuvia / CVM Res. 88 / Infraestrutura B3)
 */

(function () {
  const data = window.REAL_ESTATE_DATA;
  let currentModalAsset = data.ativos[0];

  const pipelineAtivos = [
    { etapa: '1. Triagem', descricao: 'Ficha mínima do ativo, matrícula única DGRP, vendedor, localização e renda esperada.', status: 'CONCLUÍDO (4 prédios mapeados)' },
    { etapa: '2. Diligência', descricao: 'Auditoria jurídica BR/PY, técnica, fiscal, ambiental e laudo independente (CBRE/Colliers).', status: 'CONCLUÍDO / EM REVISÃO P1–P6' },
    { etapa: '3. Estruturação', descricao: 'Constituição SPE/PropCo PY, Contrato Mestre de Locação com OpCo PY e série do token.', status: 'ESTRUTURADO' },
    { etapa: '4. Aprovação Interna', descricao: 'Deliberação do Comitê EPYX Wealth e parecer jurídico formal antes de qualquer divulgação.', status: 'GATE ATIVO' },
    { etapa: '5. Submissão à Zuvia', descricao: 'Registro da oferta sob Resolução CVM 88 e espelhamento na infraestrutura B3.', status: 'INTEGRAÇÃO FASE 1' },
    { etapa: '6. Publicação no Portal', descricao: 'Exibição pública apenas com selo de aprovação do Compliance e sem termos proibidos.', status: 'OPERACIONAL' },
    { etapa: '7. Pós-Oferta', descricao: 'Relatórios mensais de caixa OpCo → PropCo, conciliação B3 e laudo anual de valor justo.', status: 'OPERACIONAL (ZUV-WTC03)' }
  ];

  const papeisIam = {
    INVESTIDOR: {
      nome: 'Investidor Qualificado / Varejo CVM 88 (MFA Ativo)',
      escopo: 'Acesso completo à vitrine de emissões, encaminhamento SSO para KYC/Subscrição na Zuvia e leitura consolidada da carteira (Saldo NAV, Market Value B3 e Dividendos Pix).',
      seguranca: 'O Portal EPYX Wealth não armazena dados sensíveis de KYC; consome posição via API de leitura Zuvia/B3.'
    },
    COMPLIANCE: {
      nome: 'Compliance Jurídico & Comitê EPYX Wealth',
      escopo: 'Alçada de aprovação do Pipeline de Ativos (Seção 4.3), auditoria do Gate 6.2 (Matrícula Única DGRP) e 2ª assinatura de liberação de dividendos no Gate 6.3.',
      seguranca: 'Trilha de auditoria imutável (SHA-256) e conciliação diária contra o Ledger B3.'
    },
    VISITANTE: {
      nome: 'Visitante Institucional',
      escopo: 'Consulta pública da jornada de tokenização RWA, mockups operacionais, dossiês de edifícios em Assunção e simulador determinístico.',
      seguranca: 'Para subscrever tokens CIC, o investidor passa pelo Onboarding KYC na Zuvia.'
    }
  };

  function fmtBrl(val) {
    return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function fmtUsd(val) {
    return 'US$ ' + Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fmtPyg(val) {
    return 'G$ ' + Math.round(Number(val)).toLocaleString('pt-BR');
  }

  function fmtInt(val) {
    return Number(val).toLocaleString('pt-BR');
  }

  function registrarEventoAuditoria(ator, acao, entidade, detalhe) {
    const novoId = 'EVT-' + (9000 + data.eventosAuditoria.length + 1);
    const agora = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    data.eventosAuditoria.unshift({
      id: novoId,
      ts: agora,
      ator,
      acao,
      entidade,
      detalhe
    });
    renderAuditLogs();
  }

  // 1. Alternância de Tema Institucional (Padrão BTG Wealth Claro <-> BTG Night Desk Escuro)
  function initThemeToggle() {
    const btn = document.getElementById('btnToggleTheme');
    const label = document.getElementById('themeToggleLabel');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      label.textContent =
        next === 'light' ? 'Modo BTG Night Desk (Escuro)' : 'Padrão BTG Wealth (Claro)';
    });
  }

  // 2. Internacionalização PT-BR / ES-PY
  function initI18n() {
    const langSelect = document.getElementById('iamLangSelect');
    if (!langSelect) return;

    const dict = {
      PT: {
        heroTitle: 'Estruturação e Tokenização Institucional de Ativos Imobiliários Prime',
        heroSubtitle:
          'A <strong>EPYX Wealth Management</strong> estrutura e origina ativos imobiliários reais de alta liquidez em Assunção (eixo corporativo <strong>Villa Morra &amp; Shopping Paseo La Galería</strong>), conectando investidores brasileiros à renda de locação em dólar (US$) por meio de Contratos de Investimento Coletivo (CIC) distribuídos pela <strong>Zuvia (Res. CVM 88)</strong> e registrados na infraestrutura <strong>B3</strong>.'
      },
      ES: {
        heroTitle: 'Estructuración y Tokenización Institucional de Activos Inmobiliarios Prime',
        heroSubtitle:
          '<strong>EPYX Wealth Management</strong> estructura y origina activos inmobiliarios reales de alta liquidez en Asunción (eje corporativo <strong>Villa Morra &amp; Shopping Paseo La Galería</strong>), conectando inversores a la renta de alquiler en dólares (US$) mediante Contratos de Inversión Colectiva (CIC) distribuidos por <strong>Zuvia (Res. CVM 88)</strong> y registrados en la infraestrutura <strong>B3</strong>.'
      }
    };

    langSelect.addEventListener('change', () => {
      const lang = langSelect.value;
      const t = dict[lang] || dict.PT;
      document.getElementById('i18nHeroTitle').textContent = t.heroTitle;
      document.getElementById('i18nHeroSubtitle').innerHTML = t.heroSubtitle;
    });
  }

  // 3. Controle de Perfil IAM
  function initRbacControl() {
    const roleSelect = document.getElementById('iamRoleSelect');
    if (!roleSelect) return;

    function updateRbacBanner() {
      const code = roleSelect.value;
      const roleObj = papeisIam[code] || papeisIam.INVESTIDOR;
      const banner = document.getElementById('rbacActiveBanner');

      banner.innerHTML = `
        <div>
          <span class="badge badge-ticker" style="margin-right: 0.45rem;">CONTA ÚNICA IAM · ${roleObj.nome}</span>
          <span>${roleObj.escopo}</span>
        </div>
        <div class="mono" style="font-size: 0.72rem; color: var(--emerald-light);">
          🔒 ${roleObj.seguranca}
        </div>
      `;
    }

    roleSelect.addEventListener('change', updateRbacBanner);
    updateRbacBanner();
  }

  // 4. Navegação de Módulos
  function activateTab(tabId) {
    const buttons = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    buttons.forEach((b) => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
    panels.forEach((p) => p.classList.toggle('active', p.id === tabId));
  }

  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activateTab(btn.getAttribute('data-tab'));
      });
    });

    document.querySelectorAll('[data-jump-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-jump-tab');
        activateTab(target);
        const navEl = document.querySelector('.nav-tabs');
        if (navEl) navEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const btnOpenKyc = document.getElementById('btnOpenKycSimulator');
    if (btnOpenKyc) {
      btnOpenKyc.addEventListener('click', () => {
        openSubscribeModal(data.ativos[0]);
      });
    }
  }

  // 5. Renderização da Vitrine de Emissões (Villa Morra & Paseo La Galería)
  function renderMarketplaceCards() {
    const zona = document.getElementById('filterZona').value;
    const construtora = document.getElementById('filterConstrutora').value;
    const status = document.getElementById('filterStatus').value;
    const container = document.getElementById('assetCardsContainer');

    const filtrados = data.ativos.filter((a) => {
      if (zona !== 'TODAS' && a.zona !== zona) return false;
      if (construtora !== 'TODAS' && a.construtoraId !== construtora) return false;
      if (status !== 'TODOS' && a.statusCiclo !== status) return false;
      return true;
    });

    if (filtrados.length === 0) {
      container.innerHTML = `
        <div class="section-card">
          <h3>Nenhuma série encontrada para os parâmetros selecionados</h3>
          <p class="section-desc">Restaure os filtros de Eixo Imobiliário ou Incorporadora para visualizar todas as ofertas aprovadas.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtrados
      .map((ativo) => {
        const pctCaptado = Math.min(100, Math.round((ativo.valorCaptadoBrl / ativo.valorAlvoBrl) * 100));
        const gateOk = ativo.statusGate62 !== 'AGUARDANDO_CERTIDAO_MATRICULA';

        return `
          <article class="asset-card" data-asset-id="${ativo.id}">
            <div class="asset-header">
              <div>
                <div class="badge-row">
                  <span class="badge badge-ticker">SÉRIE ${ativo.simbolo}</span>
                  <span class="badge badge-gold">${ativo.zona}</span>
                  <span class="badge badge-rating">${ativo.construtoraNome} · RATING ${ativo.ratingConstrutora}</span>
                  <span class="badge ${gateOk ? 'badge-rating' : 'badge-warning'}">
                    ${gateOk ? 'GATE 6.2: MATRÍCULA AVERBADA' : 'GATE 6.2: RETENÇÃO ESCROW'}
                  </span>
                </div>
                <h3 class="asset-title">${ativo.nome}</h3>
                <p class="asset-address">${ativo.endereco} — <strong>${ativo.faseObra}</strong></p>
              </div>
              <div class="price-stamp">
                <span class="stamp-label">VALOR NOMINAL CIC</span>
                <span class="stamp-val">${fmtBrl(ativo.precoTokenBrl)}</span>
              </div>
            </div>

            <div class="asset-metrics">
              <div class="metric-box">
                <span class="m-label">Renda Projetada (US$)</span>
                <span class="m-val emerald">${ativo.rendaProjetadaUsdAa.toFixed(2).replace('.', ',')}% a.a.</span>
              </div>
              <div class="metric-box">
                <span class="m-label">Piso Mínimo OpCo (US$)</span>
                <span class="m-val gold">${ativo.pisoOpCoUsdAa.toFixed(2).replace('.', ',')}% a.a.</span>
              </div>
              <div class="metric-box">
                <span class="m-label">Prédio Inteiro (Matrícula Única)</span>
                <span class="m-val">${ativo.unidadesTotal} unid. · ${fmtInt(ativo.areaTotalM2)} m²</span>
              </div>
              <div class="metric-box">
                <span class="m-label">Laudo NAV Independente</span>
                <span class="m-val">${fmtBrl(ativo.navLaudoPorTokenBrl)}</span>
              </div>
              <div class="metric-box">
                <span class="m-label">Market Value B3/Zuvia</span>
                <span class="m-val cyan">${fmtBrl(ativo.ultimoPrecoB3Brl)}</span>
              </div>
            </div>

            <div class="channel-mix-strip">
              <div class="channel-mix-header">
                <span>MIX DE LOCAÇÃO OPCO (OCUPAÇÃO ALVO: ${ativo.ocupacaoAlvoPct}% · ADR: US$ ${ativo.adrMedioUsd})</span>
                <span class="mono">Âncora ${ativo.mixCanais.ancora}% · Flex ${ativo.mixCanais.flex}% · Curta ${ativo.mixCanais.curta}%</span>
              </div>
              <div class="channel-mix-bar">
                <div class="mix-seg-ancora" style="width: ${ativo.mixCanais.ancora}%;"></div>
                <div class="mix-seg-flex" style="width: ${ativo.mixCanais.flex}%;"></div>
                <div class="mix-seg-curta" style="width: ${ativo.mixCanais.curta}%;"></div>
              </div>
            </div>

            <div class="funding-bar-wrap">
              <div class="funding-labels">
                <span>Oferta na Zuvia (${ativo.statusCiclo}): <strong>${fmtBrl(ativo.valorCaptadoBrl)}</strong> de ${fmtBrl(ativo.valorAlvoBrl)}</span>
                <span class="mono"><strong>${pctCaptado}%</strong> (${fmtInt(ativo.qtdTokensEmitidos)} / ${fmtInt(ativo.qtdTokensTotal)} CIC)</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${pctCaptado}%;"></div>
              </div>
            </div>

            <ul class="asset-highlights">
              ${ativo.destaques.map((d) => `<li>${d}</li>`).join('')}
            </ul>

            <div class="deed-metadata-footer mono">
              <span>PROPCO PY: ${ativo.propCoNome}</span>
              <span>REGISTRO: ${ativo.matriculaPy}</span>
            </div>

            <div class="asset-actions">
              <button type="button" class="btn btn-primary btn-open-subscribe" data-id="${ativo.id}">
                Subscrever via Onboarding KYC / SSO Zuvia (R$ 25,00)
              </button>
              <button type="button" class="btn btn-secondary btn-simular-ativo" data-id="${ativo.id}">
                Simular Fluxo de Caixa
              </button>
            </div>
          </article>
        `;
      })
      .join('');

    container.querySelectorAll('.btn-open-subscribe').forEach((btn) => {
      btn.addEventListener('click', () => {
        const asset = data.ativos.find((a) => a.id === btn.getAttribute('data-id'));
        if (asset) openSubscribeModal(asset);
      });
    });

    container.querySelectorAll('.btn-simular-ativo').forEach((btn) => {
      btn.addEventListener('click', () => {
        const select = document.getElementById('simAtivoSelect');
        select.value = btn.getAttribute('data-id');
        updateSimulator();
        select.focus();
      });
    });
  }

  // 6. Simulador Determinístico
  function initSimulator() {
    const ativoSelect = document.getElementById('simAtivoSelect');
    const cenarioSelect = document.getElementById('simCenarioSelect');
    const valorInput = document.getElementById('simValorBrl');

    ativoSelect.innerHTML = data.ativos
      .map(
        (a) =>
          `<option value="${a.id}">${a.simbolo} — ${a.nome} (Yield ${a.rendaProjetadaUsdAa.toFixed(1).replace('.', ',')}% US$)</option>`
      )
      .join('');

    cenarioSelect.innerHTML = data.cenariosIlustrativos
      .map(
        (c) =>
          `<option value="${c.id}">${c.rotulo} (+${c.taxaValorizacaoAnualUsd.toFixed(1).replace('.', ',')}% a.a.)</option>`
      )
      .join('');

    cenarioSelect.value = 'CEN-BASE-IG';

    const trancheBtns = document.querySelectorAll('.tranche-btn');
    trancheBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        trancheBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        valorInput.value = btn.getAttribute('data-val');
        updateSimulator();
      });
    });

    [
      'simAtivoSelect',
      'simValorBrl',
      'simCambioBrl',
      'simAnos',
      'simMoedaRecebimento',
      'simCenarioSelect'
    ].forEach((id) => {
      document.getElementById(id).addEventListener('input', updateSimulator);
      document.getElementById(id).addEventListener('change', updateSimulator);
    });

    updateSimulator();
  }

  function updateSimulator() {
    const ativoId = document.getElementById('simAtivoSelect').value;
    const valorBrl = Math.max(25, Number(document.getElementById('simValorBrl').value) || 25);
    const cambioBrl = Math.max(1, Number(document.getElementById('simCambioBrl').value) || 5.65);
    const anos = Math.max(1, Math.min(20, Number(document.getElementById('simAnos').value) || 5));
    const moedaRec = document.getElementById('simMoedaRecebimento').value;
    const cenarioId = document.getElementById('simCenarioSelect').value;

    const ativo = data.ativos.find((a) => a.id === ativoId) || data.ativos[0];
    const cenario =
      data.cenariosIlustrativos.find((c) => c.id === cenarioId) || data.cenariosIlustrativos[0];

    const qtdTokens = Math.floor(valorBrl / ativo.precoTokenBrl);
    const capitalEfetivoBrl = qtdTokens * ativo.precoTokenBrl;
    const capitalUsd = capitalEfetivoBrl / cambioBrl;

    const rendaAnualUsd = capitalUsd * (ativo.rendaProjetadaUsdAa / 100);
    const rendaMensalUsd = rendaAnualUsd / 12;
    const rendaMensalBrl = rendaMensalUsd * cambioBrl;
    const rendaMensalPyg = rendaMensalUsd * data.meta.cambioReferencia.usdPyg;

    const pisoAnualBrl = capitalUsd * (ativo.pisoOpCoUsdAa / 100) * cambioBrl;
    const rendaTotalHorizonteBrl = rendaAnualUsd * anos * cambioBrl;
    const rendaTotalHorizontePyg = rendaAnualUsd * anos * data.meta.cambioReferencia.usdPyg;

    const fatorValorizacao = Math.pow(1 + cenario.taxaValorizacaoAnualUsd / 100, anos);
    const patrimonioFinalUsd = capitalUsd * fatorValorizacao;
    const patrimonioFinalBrl = patrimonioFinalUsd * cambioBrl;
    const ganhoCapitalIlustrativoBrl = patrimonioFinalBrl - capitalEfetivoBrl;

    document.getElementById('simOutTokens').textContent = `${fmtInt(qtdTokens)} CIC (${fmtBrl(capitalEfetivoBrl)})`;
    document.getElementById('simOutCapitalUsd').textContent = fmtUsd(capitalUsd);

    if (moedaRec === 'PYG') {
      document.getElementById('simOutRendaMensal').textContent = `${fmtPyg(rendaMensalPyg)} / mês (${fmtUsd(rendaMensalUsd)})`;
      document.getElementById('simOutRendaTotalHorizonte').textContent = `${fmtPyg(rendaTotalHorizontePyg)} (${anos} anos)`;
    } else {
      document.getElementById('simOutRendaMensal').textContent = `${fmtBrl(rendaMensalBrl)} / mês (Pix)`;
      document.getElementById('simOutRendaTotalHorizonte').textContent = `${fmtBrl(rendaTotalHorizonteBrl)} (${anos} anos)`;
    }

    document.getElementById('simOutPisoAnual').textContent = `${ativo.pisoOpCoUsdAa.toFixed(2).replace('.', ',')}% a.a. (${fmtBrl(pisoAnualBrl)}/ano)`;
    document.getElementById('simOutPatrimonioFinal').textContent = fmtBrl(patrimonioFinalBrl);
    document.getElementById('simOutGanhoCapital').textContent = `+ ${fmtBrl(ganhoCapitalIlustrativoBrl)} (${cenario.taxaValorizacaoAnualUsd.toFixed(1).replace('.', ',')}% a.a.)`;
    document.getElementById('simOutAvisoCenario').textContent = cenario.avisoRegulatorio;
    document.getElementById('headerCambioBrl').textContent = 'R$ ' + cambioBrl.toFixed(4).replace('.', ',');
  }

  // 7. Incorporadoras & Pipeline de Admissão de Ativos
  function renderConstrutorasAndPipeline() {
    const pipeBody = document.getElementById('pipelineAtivosTableBody');
    pipeBody.innerHTML = pipelineAtivos
      .map(
        (p) => `
        <tr>
          <td><strong>${p.etapa}</strong></td>
          <td>${p.descricao}</td>
          <td><span class="badge badge-rating">${p.status}</span></td>
        </tr>
      `
      )
      .join('');

    const container = document.getElementById('buildersContainer');
    container.innerHTML = data.construtoras
      .map(
        (c) => `
        <article class="asset-card">
          <div class="badge-row">
            <span class="badge badge-rating">RATING INSTITUCIONAL ${c.rating}</span>
            <span class="badge badge-gold">SCORE ${c.scoreRisco}</span>
          </div>
          <h3 class="asset-title" style="margin-bottom: 0.3rem;">${c.nome}</h3>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.95rem;">
            Auditoria Independente: <strong>${c.auditoriaFinanceira}</strong>
          </p>

          <div class="asset-metrics" style="grid-template-columns: repeat(2, 1fr);">
            <div class="metric-box">
              <span class="m-label">Track Record PY</span>
              <span class="m-val">${c.anosMercado} anos</span>
            </div>
            <div class="metric-box" style="border-right:none;">
              <span class="m-label">Área Construída Entregue</span>
              <span class="m-val emerald">${c.m2Entregues}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">Índice de Pontualidade</span>
              <span class="m-val gold">${c.pontualidadeObras}</span>
            </div>
            <div class="metric-box" style="border-right:none;">
              <span class="m-label">Alavancagem (Dív. Líq./PL)</span>
              <span class="m-val">${c.alavancagemDividaPl}</span>
            </div>
          </div>

          <div style="margin: 0.9rem 0;">
            <strong style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;">
              Ativos de Referência Entregues em Assunção:
            </strong>
            <ul class="asset-highlights" style="margin-top: 0.45rem;">
              ${c.obrasReferencia.map((o) => `<li>${o}</li>`).join('')}
            </ul>
          </div>

          <div style="padding: 0.8rem; background: var(--bg-surface); border: 1px solid var(--border-gold-subtle); border-left: 3px solid var(--gold-primary); border-radius: 4px; font-size: 0.79rem;">
            <strong style="color: var(--gold-light);">Mecanismo Fiduciário &amp; Escrow:</strong> ${c.garantiaEscrow}
          </div>
        </article>
      `
      )
      .join('');
  }

  // 8. Gates 6.2 e 6.3 (PropCo / OpCo)
  function initGatesPropCoOpCo() {
    const select = document.getElementById('gate62AtivoSelect');
    select.innerHTML = data.ativos
      .map((a) => `<option value="${a.id}">${a.simbolo} — ${a.nome}</option>`)
      .join('');
    select.value = 'ATIVO-02';

    select.addEventListener('change', () => {
      document.getElementById('gate62Feedback').innerHTML = '';
      renderGate62Status();
    });

    document.getElementById('btnAnexarCertidaoGate62').addEventListener('click', () => {
      const ativo = data.ativos.find((a) => a.id === select.value);
      if (!ativo) return;
      ativo.statusGate62 = 'MATRICULA_REGISTRADA_AUDITADA';
      registrarEventoAuditoria(
        'ServicoAtivo (DGRP Assunção)',
        'AVERBACAO_MATRICULA_GATE_6_2',
        `Ativo(${ativo.simbolo})`,
        `Certidão de Matrícula Única (${ativo.matriculaPy}) averbada e validada em nome de ${ativo.propCoNome}.`
      );
      renderGate62Status();
      renderMarketplaceCards();
      document.getElementById('gate62Feedback').innerHTML = `
        <div class="toast-feedback">
          <strong>AVERBAÇÃO CONFIRMADA (DGRP ASSUNÇÃO):</strong> Certidão de Matrícula Única validada em nome de <strong>${ativo.propCoNome}</strong>. O Gate 6.2 para a série <strong>${ativo.simbolo}</strong> encontra-se habilitado.
        </div>
      `;
    });

    document.getElementById('btnTestarDesembolsoGate62').addEventListener('click', () => {
      const ativo = data.ativos.find((a) => a.id === select.value);
      if (!ativo) return;
      const bloqueado = ativo.statusGate62 === 'AGUARDANDO_CERTIDAO_MATRICULA';

      if (bloqueado) {
        registrarEventoAuditoria(
          'Gate62Guard (Core Compliance)',
          'BLOQUEIO_DESEMBOLSO_PROPCO',
          `Ativo(${ativo.simbolo})`,
          'Ordem de remessa rejeitada: Certidão de Matrícula Única pendente de averbação definitiva na PropCo PY.'
        );
        document.getElementById('gate62Feedback').innerHTML = `
          <div class="toast-feedback" style="background: var(--crimson-bg); border-color: var(--crimson-alert); border-left-color: var(--crimson-alert);">
            <strong>ORDEM REJEITADA PELO GATE 6.2 (Seção 6.2):</strong> Desembolso bloqueado para a série <strong>${ativo.simbolo}</strong>. Os recursos permanecem retidos até a anexação da certidão de registro da matrícula única em nome de <strong>${ativo.propCoNome}</strong>.
          </div>
        `;
      } else {
        registrarEventoAuditoria(
          'ServicoFinanceiro (Câmbio BR → PY)',
          'REMESSA_AUTORIZADA_GATE_6_2',
          `Ativo(${ativo.simbolo})`,
          `Remessa cambial autorizada para ${ativo.propCoNome} mediante comprovação de Matrícula Única.`
        );
        document.getElementById('gate62Feedback').innerHTML = `
          <div class="toast-feedback">
            <strong>CONDIÇÃO PRECEDENTE CUMPRIDA (GATE 6.2):</strong> Titularidade da Matrícula Única verificada em nome de <strong>${ativo.propCoNome}</strong>. Ordem de remessa autorizada.
          </div>
        `;
      }
    });

    document.getElementById('btnExecutarDistribuicaoPix').addEventListener('click', () => {
      const finOk = document.getElementById('chkAprovFinanceiro').checked;
      const compOk = document.getElementById('chkAprovCompliance').checked;
      const feedbackEl = document.getElementById('gate63Feedback');

      if (!finOk || !compOk) {
        feedbackEl.innerHTML = `
          <div class="toast-feedback" style="background: var(--crimson-bg); border-color: var(--crimson-alert); border-left-color: var(--crimson-alert);">
            <strong>ALÇADA INCOMPLETA (Seções 6.3 e 9):</strong> A instrução de pagamento de proventos exige a dupla assinatura eletrônica (Diretoria Financeira + Oficial de Compliance).
          </div>
        `;
        return;
      }

      const resumo = data.operacaoMensalOpCo.resumoPropCo;
      registrarEventoAuditoria(
        'ServicoDistribuicao (Alçada Dupla)',
        'LIQUIDACAO_PROVENTOS_AGENTE_PAGADOR',
        'Distribuicao(Out/2026 · ZUV-WTC03)',
        `Liquidado lote de ${fmtBrl(resumo.caixaDistribuivelLiquidoBrl)} (R$ ${resumo.proventoPorTokenBrl.toFixed(4).replace('.', ',')}/CIC) para 550.000 tokens conciliados no Ledger B3.`
      );

      feedbackEl.innerHTML = `
        <div class="toast-feedback">
          <strong>LOTE DE PROVENTOS LIQUIDADO (ZUVIA / B3):</strong> Caixa líquido distribuível de <strong>${fmtUsd(resumo.caixaDistribuivelLiquidoUsd)}</strong> convertido a R$ 5,6500 = <strong>${fmtBrl(resumo.caixaDistribuivelLiquidoBrl)}</strong> creditado aos investidores registrados no Ledger B3.
        </div>
      `;
    });

    renderGate62Status();
    renderOpCoTables();
  }

  function renderGate62Status() {
    const select = document.getElementById('gate62AtivoSelect');
    const ativo = data.ativos.find((a) => a.id === select.value) || data.ativos[0];
    const bloqueado = ativo.statusGate62 === 'AGUARDANDO_CERTIDAO_MATRICULA';

    document.getElementById('gate62StatusBox').innerHTML = `
      <div class="sim-row">
        <span>Sociedade de Propósito Específico (PY):</span>
        <strong>${ativo.propCoNome}</strong>
      </div>
      <div class="sim-row">
        <span>Registro Imobiliário DGRP Assunção:</span>
        <strong class="mono" style="font-size: 0.76rem;">${ativo.matriculaPy}</strong>
      </div>
      <div class="sim-row">
        <span>Saldo em Conta Segregada Zuvia:</span>
        <strong>${fmtBrl(ativo.valorCaptadoBrl)}</strong>
      </div>
      <div class="sim-row">
        <span>Estado da Trava Fiduciária (Gate 6.2):</span>
        <span class="badge ${bloqueado ? 'badge-warning' : 'badge-rating'}">
          ${bloqueado ? 'BLOQUEADO · AGUARDANDO CERTIDÃO DGRP' : 'HABILITADO · MATRÍCULA ÚNICA AVERBADA'}
        </span>
      </div>
    `;
  }

  function renderOpCoTables() {
    const op = data.operacaoMensalOpCo;
    const r = op.resumoPropCo;

    document.getElementById('opcoResumoBox').innerHTML = `
      <div class="sim-row">
        <span>Série em Operação / Competência:</span>
        <strong>${op.ativoReferencia} (${op.mesReferencia})</strong>
      </div>
      <div class="sim-row">
        <span>1. Receita Bruta Consolidada OpCo (3 Canais):</span>
        <strong>${fmtUsd(r.receitaBrutaTotalOpCoUsd)}</strong>
      </div>
      <div class="sim-row">
        <span>2. Aluguel Mestre Transferido OpCo → PropCo PY:</span>
        <strong style="color: var(--navy-b3);">${fmtUsd(r.aluguelPagoOpCoParaPropCoUsd)} (Piso: ${fmtUsd(r.pisoContratualMestreUsd)})</strong>
      </div>
      <div class="sim-row">
        <span>3. (-) Despesas PropCo, Impostos PY &amp; Reserva:</span>
        <strong>- ${fmtUsd(r.despesasPropCoSegurosContabUsd + r.impostosTerritoriaisPyUsd + r.reservaManutencaoFundoUsd)}</strong>
      </div>
      <div class="sim-row">
        <span>4. (=) Caixa Líquido Distribuível (US$ → Pix R$):</span>
        <strong style="color: var(--emerald-light);">${fmtUsd(r.caixaDistribuivelLiquidoUsd)} → ${fmtBrl(r.caixaDistribuivelLiquidoBrl)}</strong>
      </div>
      <div class="sim-row">
        <span>Dividendo Líquido Unitário (550.000 CIC):</span>
        <strong style="color: var(--emerald-light);">R$ ${r.proventoPorTokenBrl.toFixed(4).replace('.', ',')} / CIC</strong>
      </div>
    `;

    const tbody = document.getElementById('opcoChannelsTableBody');
    tbody.innerHTML = op.canais
      .map(
        (c) => `
        <tr>
          <td><strong>${c.canal}</strong></td>
          <td class="mono">${c.unidadesAlocadas} unid.</td>
          <td class="mono" style="color: var(--emerald-light);">${c.ocupacaoPct.toFixed(1).replace('.', ',')}%</td>
          <td class="mono">${fmtUsd(c.receitaBrutaUsd)}</td>
          <td class="mono">${fmtUsd(c.despesasOpCoUsd)}</td>
          <td>${c.descricao}</td>
        </tr>
      `
      )
      .join('');
  }

  // 9. Tela do Usuário: Tokens Comprados, Rentabilidade Mensal, Market Value e Saldo Total
  function renderPortfolioAndB3() {
    const posicoes = data.carteiraInvestidorPadrao.posicoes;

    let totalTokens = 0;
    let totalCustoBrl = 0;
    let totalNavBrl = 0;
    let totalMarketB3Brl = 0;
    let totalRendaMensalBrl = 0;

    posicoes.forEach((pos) => {
      totalTokens += pos.qtdTokens;
      totalCustoBrl += pos.qtdTokens * pos.precoMedioAquisicaoBrl;
      totalNavBrl += pos.qtdTokens * pos.navLaudoPorTokenBrl;
      totalMarketB3Brl += pos.qtdTokens * pos.ultimoPrecoB3Brl;
      totalRendaMensalBrl += pos.proventoMensalEstimadoBrl;
    });

    const agioPct = totalCustoBrl > 0 ? ((totalMarketB3Brl - totalCustoBrl) / totalCustoBrl) * 100 : 0;

    // Atualiza KPIs na Aba 01 (Showcase) e Aba 03 (Tela do Usuário)
    document.getElementById('dashTopSaldoNav').textContent = fmtBrl(totalNavBrl);
    document.getElementById('dashTopMarketValue').textContent = fmtBrl(totalMarketB3Brl);
    document.getElementById('dashTopRendaMensal').textContent = `${fmtBrl(totalRendaMensalBrl)} / mês`;
    document.getElementById('dashTopTotalTokens').textContent = `${fmtInt(totalTokens)} CIC`;

    document.getElementById('userKpiSaldoNav').textContent = fmtBrl(totalNavBrl);
    document.getElementById('userKpiCustoTotal').textContent = fmtBrl(totalCustoBrl);
    document.getElementById('userKpiMarketValue').textContent = fmtBrl(totalMarketB3Brl);
    document.getElementById('userKpiAgioPct').textContent = `+${agioPct.toFixed(2).replace('.', ',')}%`;
    document.getElementById('userKpiRendaMensal').textContent = `${fmtBrl(totalRendaMensalBrl)} / mês`;
    document.getElementById('userKpiQtdTokens').textContent = `${fmtInt(totalTokens)} CIC`;

    const pBody = document.getElementById('portfolioTableBody');
    pBody.innerHTML = posicoes
      .map((pos) => {
        const custoTotal = pos.qtdTokens * pos.precoMedioAquisicaoBrl;
        const valorPatrimonialTotal = pos.qtdTokens * pos.navLaudoPorTokenBrl;
        const valorMercadoB3Total = pos.qtdTokens * pos.ultimoPrecoB3Brl;
        return `
          <tr>
            <td><span class="badge badge-ticker">${pos.simbolo}</span></td>
            <td><strong>${pos.nomeAtivo}</strong></td>
            <td class="mono"><strong>${fmtInt(pos.qtdTokens)} CIC</strong></td>
            <td class="mono">${fmtBrl(custoTotal)}<span style="display:block; font-size:0.71rem; color:var(--text-muted);">Unit.: ${fmtBrl(pos.precoMedioAquisicaoBrl)}</span></td>
            <td class="mono">
              <strong>${fmtBrl(valorPatrimonialTotal)}</strong>
              <span style="display:block; font-size:0.71rem; color:var(--text-muted);">NAV: ${fmtBrl(pos.navLaudoPorTokenBrl)}/CIC</span>
            </td>
            <td class="mono" style="color: var(--navy-b3);">
              <strong>${fmtBrl(valorMercadoB3Total)}</strong>
              <span style="display:block; font-size:0.71rem; color:var(--text-muted);">Cotação B3: ${fmtBrl(pos.ultimoPrecoB3Brl)}/CIC</span>
            </td>
            <td class="mono" style="color: var(--emerald-light);"><strong>${fmtBrl(pos.proventoMensalEstimadoBrl)} / mês</strong></td>
            <td class="mono" style="font-size: 0.74rem;">${pos.idExternoLedgerB3}</td>
          </tr>
        `;
      })
      .join('');

    const obBody = document.getElementById('orderBookTableBody');
    obBody.innerHTML = data.livroOfertasB3
      .map(
        (o) => `
        <tr>
          <td>
            <span class="badge ${o.tipo.includes('COMPRA') ? 'badge-rating' : 'badge-gold'}">${o.tipo}</span>
          </td>
          <td class="mono"><strong>${o.simbolo}</strong></td>
          <td class="mono">${fmtInt(o.qtd)} CIC</td>
          <td class="mono"><strong>${fmtBrl(o.precoBrl)}</strong></td>
          <td>${o.origem}</td>
        </tr>
      `
      )
      .join('');

    const laudosContainer = document.getElementById('laudosContainer');
    laudosContainer.innerHTML = data.ativos
      .map(
        (a) => `
        <div class="gate-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
            <strong>${a.simbolo} — ${a.nome}</strong>
            <span class="badge badge-gold">LAUDO NAV: ${fmtBrl(a.navLaudoPorTokenBrl)} / CIC</span>
          </div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">
            Avaliador Independente: <strong>${a.avaliadorLaudo}</strong> · Valor Justo: <strong>${fmtUsd(a.precoAquisicaoUsd)}</strong>
          </div>
          <div class="mono" style="font-size:0.7rem; color:var(--text-muted); margin-top:0.35rem; word-break:break-all;">
            Hash SHA-256: ${a.hashLaudo}
          </div>
        </div>
      `
      )
      .join('');
  }

  // 10. Governança P1-P6 e Conciliação Diária B3
  function renderGovernanceAndAudit() {
    const pBody = document.getElementById('p1p6TableBody');
    pBody.innerHTML = data.pontosVerificacaoP1P6
      .map(
        (p) => `
        <tr>
          <td><span class="badge badge-gold">${p.codigo}</span></td>
          <td><strong>${p.titulo}</strong></td>
          <td>${p.importancia}</td>
          <td>${p.responsavel}</td>
          <td><span style="color: var(--emerald-light); font-weight: 500;">${p.bloqueioEngenharia}</span></td>
        </tr>
      `
      )
      .join('');

    renderReconciliationTable();
    renderAuditLogs();

    document.getElementById('btnRodarConciliacaoB3').addEventListener('click', () => {
      const ts = new Date().toLocaleTimeString('pt-BR');
      data.conciliacaoDiariaB3.forEach((item) => {
        item.ultimaVerificacao = `17/10/2026 ${ts}`;
      });
      renderReconciliationTable();
      registrarEventoAuditoria(
        'AdaptadorZuviaB3 (CachePosicao)',
        'SINCRONIZACAO_API_LEITURA_ZUVIA',
        'Todas as Séries (4 ativos)',
        'Cache de leitura sincronizado com a API Zuvia/B3 sem armazenamento de dados de KYC no portal.'
      );
    });
  }

  function renderReconciliationTable() {
    const rBody = document.getElementById('reconciliationTableBody');
    rBody.innerHTML = data.conciliacaoDiariaB3
      .map(
        (c) => `
        <tr>
          <td class="mono"><strong>${c.simbolo}</strong></td>
          <td class="mono">${fmtInt(c.posicoesLocais)} CIC</td>
          <td class="mono">${fmtInt(c.ledgerB3)} CIC</td>
          <td class="mono" style="color: var(--emerald-light);">${c.divergencia}</td>
          <td>
            <span class="badge badge-rating">${c.status} · ${c.ultimaVerificacao}</span>
          </td>
        </tr>
      `
      )
      .join('');
  }

  function renderAuditLogs() {
    const container = document.getElementById('auditLogContainer');
    container.innerHTML = data.eventosAuditoria
      .slice(0, 6)
      .map(
        (e) => `
        <div class="gate-card" style="padding: 0.85rem;">
          <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-muted);" class="mono">
            <span>${e.id} · ${e.acao}</span>
            <span>${e.ts}</span>
          </div>
          <div style="font-size:0.81rem; margin-top:0.3rem;">
            <strong>${e.ator}</strong> [<code>${e.entidade}</code>]: ${e.detalhe}
          </div>
        </div>
      `
      )
      .join('');
  }

  // 11. Modal de Onboarding KYC & Subscrição SSO na Zuvia (<dialog closedby="any"> + fallback)
  function initSubscribeModal() {
    const dialog = document.getElementById('subscribeDialog');
    const qtdInput = document.getElementById('modalQtdTokens');
    const form = document.getElementById('subscribeForm');

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        dialog.close();
      });
    }

    document.getElementById('btnCloseDialog').addEventListener('click', () => dialog.close());
    document.getElementById('btnCancelModal').addEventListener('click', () => dialog.close());

    qtdInput.addEventListener('input', updateModalCalculations);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const qtd = Math.max(1, Math.floor(Number(qtdInput.value) || 400));
      const valorBrl = qtd * currentModalAsset.precoTokenBrl;

      currentModalAsset.qtdTokensEmitidos += qtd;
      currentModalAsset.valorCaptadoBrl += valorBrl;

      const concItem = data.conciliacaoDiariaB3.find((c) => c.simbolo === currentModalAsset.simbolo);
      if (concItem) {
        concItem.posicoesLocais += qtd;
        concItem.ledgerB3 += qtd;
      }

      const posExistente = data.carteiraInvestidorPadrao.posicoes.find(
        (p) => p.simbolo === currentModalAsset.simbolo
      );
      const rendaMensalAdicional =
        ((valorBrl / data.meta.cambioReferencia.usdBrl) *
          (currentModalAsset.rendaProjetadaUsdAa / 100) /
          12) *
        data.meta.cambioReferencia.usdBrl;

      if (posExistente) {
        posExistente.qtdTokens += qtd;
        posExistente.proventoMensalEstimadoBrl += rendaMensalAdicional;
      } else {
        data.carteiraInvestidorPadrao.posicoes.push({
          simbolo: currentModalAsset.simbolo,
          nomeAtivo: currentModalAsset.nome,
          qtdTokens: qtd,
          precoMedioAquisicaoBrl: currentModalAsset.precoTokenBrl,
          navLaudoPorTokenBrl: currentModalAsset.navLaudoPorTokenBrl,
          ultimoPrecoB3Brl: currentModalAsset.ultimoPrecoB3Brl,
          proventoMensalEstimadoBrl: rendaMensalAdicional,
          idExternoLedgerB3: `B3-CIC-PY-${currentModalAsset.simbolo.replace('ZUV-', '')}-000${qtd}`
        });
      }

      registrarEventoAuditoria(
        'WebhookZuviaHMAC (KYC + Subscrição)',
        'SUBSCRICAO_CONFIRMADA_AMBIENTE_ZUVIA',
        `CachePosicao(${currentModalAsset.simbolo})`,
        `Onboarding KYC verificado e subscrição concluída na Zuvia: +${fmtInt(qtd)} CIC (${fmtBrl(valorBrl)}) adicionados à carteira.`
      );

      renderMarketplaceCards();
      renderPortfolioAndB3();
      renderReconciliationTable();
      dialog.close();
      activateTab('tab-carteira-b3');
    });
  }

  function openSubscribeModal(asset) {
    currentModalAsset = asset;
    document.getElementById('modalAssetTicker').textContent = `SÉRIE ${asset.simbolo} · ${asset.construtoraNome} (RATING ${asset.ratingConstrutora})`;
    document.getElementById('dialogSubscribeTitle').textContent = `Onboarding KYC & Subscrição SSO — ${asset.nome}`;
    document.getElementById('modalAssetSubtitle').textContent = `${asset.endereco} · PropCo PY: ${asset.propCoNome}`;
    document.getElementById('modalQtdTokens').value = 400;
    document.getElementById('modalTermoRisco').checked = false;

    updateModalCalculations();
    const dialog = document.getElementById('subscribeDialog');
    dialog.showModal();
  }

  function updateModalCalculations() {
    const qtd = Math.max(1, Math.floor(Number(document.getElementById('modalQtdTokens').value) || 1));
    const cambio = data.meta.cambioReferencia.usdBrl;
    const totalBrl = qtd * currentModalAsset.precoTokenBrl;
    const totalUsd = totalBrl / cambio;
    const rendaMensalBrl = ((totalUsd * (currentModalAsset.rendaProjetadaUsdAa / 100)) / 12) * cambio;

    document.getElementById('modalTotalBrl').textContent = fmtBrl(totalBrl);
    document.getElementById('modalTotalUsd').textContent = fmtUsd(totalUsd);
    document.getElementById('modalRendaMensalBrl').textContent = `${fmtBrl(rendaMensalBrl)} / mês (${currentModalAsset.rendaProjetadaUsdAa.toFixed(2).replace('.', ',')}% a.a. US$)`;
    document.getElementById('modalPisoOpCo').textContent = `${currentModalAsset.pisoOpCoUsdAa.toFixed(2).replace('.', ',')}% a.a. em US$ (Contrato Mestre 10 anos)`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initI18n();
    initRbacControl();
    initTabs();
    renderMarketplaceCards();
    initSimulator();
    renderConstrutorasAndPipeline();
    initGatesPropCoOpCo();
    renderPortfolioAndB3();
    renderGovernanceAndAudit();
    initSubscribeModal();

    ['filterZona', 'filterConstrutora', 'filterStatus'].forEach((id) => {
      document.getElementById(id).addEventListener('change', renderMarketplaceCards);
    });
  });
})();
