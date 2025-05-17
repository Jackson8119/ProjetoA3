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
        urgencia: 'Médio',
        impacto: 'Médio',
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
      const urgenciaClass = `urgencia-${plano.urgencia.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
      const impactoClass = `impacto-${plano.impacto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
      console.log('Classes geradas:', { urgenciaClass, impactoClass });
      console.log('HTML do plano-right:', `<div class="plano-right"><div class="tags"><span class="tag ${urgenciaClass}">Urgência: ${plano.urgencia}</span><span class="tag ${impactoClass}">Impacto: ${plano.impacto}</span></div><button onclick="viewDetalhes('${plano.id}')">Ver Detalhes</button></div>`);
      const card = document.createElement('div');
      card.className = 'plano-card';
      card.innerHTML = `
        <div class="plano-left">
          <h3>${plano.titulo}</h3>
          <p class="description">${plano.descricao}</p>
          <p>Criado em: ${plano.dataCriacao}</p>
          <span class="tag ${status.toLowerCase().replace(' ', '-')}">Situação: ${status}</span>
        </div>
        <div class="plano-right">
          <div class="tags">
            <span class="tag ${urgenciaClass}">Urgência: ${plano.urgencia}</span>
            <span class="tag ${impactoClass}">Impacto: ${plano.impacto}</span>
          </div>
          <button onclick="viewDetalhes('${plano.id}')">Ver Detalhes</button>
        </div>
      `;
      planosList.appendChild(card);
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