document.addEventListener('DOMContentLoaded', () => {
  const userInfo = document.getElementById('user-info');
  const searchInput = document.getElementById('search-input');
  const planosList = document.getElementById('planos-list');
  const message = document.getElementById('message');

  // Carregar usuário logado
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
  if (loggedUser && loggedUser.tipo === 'Gerenciador') {
    userInfo.textContent = `Olá, ${loggedUser.nomeCompleto}`;
  } else {
    window.location.href = 'login.html';
  }

  // Inicializar planos
  if (!localStorage.getItem('planos')) {
    const initialPlanos = [
      {
        id: '1',
        titulo: 'Plano de Mitigação',
        descricao: 'Mitigar risco de falha no servidor',
        dataCriacao: '14/05/2025',
        areaResponsavel: 'TI',
        ativosImpactados: ['Servidor A'],
        areasImpactadas: ['TI', 'Produção'],
        urgencia: 'Média',
        impacto: 'Médio',
        etapas: []
      },
      {
        id: '2',
        titulo: 'Plano de Backup',
        descricao: 'Criar backup do sistema',
        dataCriacao: '15/05/2025',
        areaResponsavel: 'TI',
        ativosImpactados: ['Servidor B'],
        areasImpactadas: ['TI'],
        urgencia: 'Alta',
        impacto: 'Alto',
        etapas: []
      },
      {
        id: '3',
        titulo: 'Plano de Manutenção',
        descricao: 'Manutenção preventiva',
        dataCriacao: '16/05/2025',
        areaResponsavel: 'TI',
        ativosImpactados: ['Servidor A'],
        areasImpactadas: ['TI'],
        urgencia: 'Baixa',
        impacto: 'Baixa',
        etapas: []
      }
    ];
    localStorage.setItem('planos', JSON.stringify(initialPlanos));
    console.log('Planos inicializados:', initialPlanos);
  }

  // Função para carregar planos do localStorage
  const loadPlanos = () => {
    const planos = localStorage.getItem('planos');
    const parsedPlanos = planos ? JSON.parse(planos) : [];
    console.log('Planos carregados do localStorage:', parsedPlanos);
    return parsedPlanos;
  };

  // Função para normalizar texto (ex.: "Média" → "media")
  const normalizeClassName = (text) => {
    const normalized = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim(); // Remove espaços extras
    console.log(`Normalizando "${text}" para "${normalized}" (para impacto ou urgência)`);
    return normalized;
  };

  // Função para exibir planos
  const displayPlanos = (planos) => {
    console.log('Exibindo planos:', planos);
    planosList.innerHTML = '';
    if (planos.length === 0) {
      message.textContent = 'Nenhum plano encontrado.';
      message.className = 'message';
      message.style.display = 'block';
    } else {
      message.style.display = 'none';
    }
    planos.forEach(plano => {
      const status = plano.etapas && plano.etapas.length > 0 ? plano.etapas[plano.etapas.length - 1].status : 'Não Iniciado';
      const rawUrgencia = plano.urgencia || 'Desconhecido';
      const rawImpacto = plano.impacto || 'Desconhecido';
      const urgenciaClass = `urgencia-${normalizeClassName(rawUrgencia)}`;
      const impactoClass = `impacto-${normalizeClassName(rawImpacto)}`;
      console.log('Valores brutos do plano:', { id: plano.id, titulo: plano.titulo, rawUrgencia, rawImpacto });
      console.log('Classes geradas:', { urgenciaClass, impactoClass });
      const rightHTML = `
        <div class="plano-right">
          <div class="tags">
            <span class="tag ${urgenciaClass}">Urgência: ${rawUrgencia}</span>
            <span class="tag ${impactoClass}">Impacto: ${rawImpacto}</span>
          </div>
          <button onclick="viewDetalhes('${plano.id}')">Ver Detalhes</button>
        </div>
      `;
      console.log('HTML gerado do plano-right:', rightHTML);
      const card = document.createElement('div');
      card.className = 'plano-card';
      card.innerHTML = `
        <div class="plano-left">
          <h3>${plano.titulo}</h3>
          <p class="description">${plano.descricao}</p>
          <p>Criado em: ${plano.dataCriacao}</p>
          <span class="tag ${status.toLowerCase().replace(' ', '-')}">Situação: ${status}</span>
        </div>
        ${rightHTML}
      `;
      planosList.appendChild(card);
      console.log('HTML final renderizado do plano:', card.outerHTML);
    });
  };

  // Filtrar planos por título
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const planos = loadPlanos();
    const filteredPlanos = planos.filter(plano => plano.titulo.toLowerCase().includes(searchTerm));
    displayPlanos(filteredPlanos);
  });

  // Função para ver detalhes
  const viewDetalhes = (id) => {
    window.location.href = `detalhes-plano.html?id=${id}`;
  };

  // Inicializar listagem
  displayPlanos(loadPlanos());

  // Expor função ao escopo global
  window.viewDetalhes = viewDetalhes;
});