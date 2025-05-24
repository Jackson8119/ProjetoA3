document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('area-form');
  const message = document.getElementById('message');
  const areasGrid = document.getElementById('areas-grid');
  const searchInput = document.getElementById('search-input');
  const modal = document.getElementById('area-modal');
  const modalTitle = document.getElementById('modal-title');
  let editingIndex = null;

  // Verificar elementos DOM
  if (!form || !message || !areasGrid || !searchInput || !modal || !modalTitle) {
    console.error('Erro: Um ou mais elementos DOM não foram encontrados.');
    return;
  }

  // Verificar se o usuário é administrador
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
  if (!loggedUser || loggedUser.tipo !== 'Administrador') {
    console.log('Usuário não é administrador ou não está logado. Redirecionando para login...');
    window.location.href = '/login.html';
    return;
  }

  // Carregar áreas e ativos do localStorage
  const loadAreas = () => {
    const areas = localStorage.getItem('areas');
    return areas ? JSON.parse(areas) : [];
  };

  const loadAtivos = () => {
    const ativos = localStorage.getItem('ativos');
    return ativos ? JSON.parse(ativos) : [];
  };

  // Contar ativos por área
  const countAtivosByArea = (areaNome) => {
    const ativos = loadAtivos();
    return ativos.filter(ativo => ativo.area === areaNome).length;
  };

  // Exibir lista de áreas
  const displayAreas = (areasToDisplay) => {
    console.log('Atualizando grade de áreas...');
    const areas = areasToDisplay || loadAreas();
    areasGrid.innerHTML = '';
    if (areas.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'Nenhuma área cadastrada.';
      p.style.color = '#888888';
      p.style.textAlign = 'center';
      areasGrid.appendChild(p);
      return;
    }
    areas.forEach((area, index) => {
      const ativosCount = countAtivosByArea(area.nome);
      const card = document.createElement('div');
      card.className = 'area-card';
      card.innerHTML = `
        <div class="area-header">
          <span class="area-icon">🏢</span>
          <h3 class="area-title">${area.nome}</h3>
        </div>
        <div class="area-description">${area.descricao || 'Sem descrição'}</div>
        <div class="area-ativos-count">Ativos cadastrados: ${ativosCount}</div>
        <div class="area-footer">
          Criada em: ${new Date().toLocaleDateString('pt-BR')}
        </div>
        <div class="area-actions">
          <button class="edit-btn" onclick="openModal('edit', ${index})">
            <span>✏️</span>
          </button>
          <button class="delete-btn" onclick="deleteArea(${index})">
            <span>🗑️</span>
          </button>
        </div>
      `;
      areasGrid.appendChild(card);
    });
  };

  // Inicializar dados, se necessário
  if (!localStorage.getItem('areas')) {
    localStorage.setItem('areas', JSON.stringify([
      { nome: 'TI', descricao: 'Departamento de Tecnologia da Informação' },
      { nome: 'Produção', descricao: 'Linha de produção industrial' }
    ]));
  }

  // Funções do modal
  window.openModal = (mode, index) => {
    editingIndex = mode === 'edit' ? index : null;
    modalTitle.textContent = mode === 'edit' ? 'Editar Área' : 'Cadastrar Nova Área';
    form.reset();
    if (mode === 'edit') {
      const areas = loadAreas();
      document.getElementById('area-nome').value = areas[index].nome;
      document.getElementById('area-descricao').value = areas[index].descricao || '';
    }
    modal.style.display = 'block';
  };

  window.closeModal = () => {
    modal.style.display = 'none';
    form.reset();
    editingIndex = null;
  };

  // Deletar área
  window.deleteArea = (index) => {
    const areas = loadAreas();
    const area = areas[index];
    const ativosCount = countAtivosByArea(area.nome);
    if (ativosCount > 0) {
      showMessage('Erro: Não é possível excluir uma área com ativos cadastrados.', 'error');
      return;
    }
    if (confirm('Deseja excluir esta área?')) {
      areas.splice(index, 1);
      localStorage.setItem('areas', JSON.stringify(areas));
      displayAreas();
      showMessage('Área excluída com sucesso!', 'success');
    }
  };

  // Função para exibir mensagens
  const showMessage = (text, type) => {
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 2000);
  };

  // Manipular envio do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const areaNome = document.getElementById('area-nome').value.trim();
    const areaDescricao = document.getElementById('area-descricao').value.trim();

    if (!areaNome) {
      showMessage('Erro: Nome da área é obrigatório.', 'error');
      return;
    }

    const areas = loadAreas();
    if (editingIndex === null) {
      const existingArea = areas.find(a => a.nome.toLowerCase() === areaNome.toLowerCase());
      if (existingArea) {
        showMessage('Erro: Área já existe.', 'error');
        return;
      }
      const newArea = { nome: areaNome, descricao: areaDescricao };
      areas.push(newArea);
      console.log('Nova área criada:', newArea);
      showMessage('Área criada com sucesso!', 'success');
      localStorage.setItem('newArea', areaNome);
      localStorage.setItem('areas', JSON.stringify(areas));
      closeModal();
      window.location.href = '/pages/admin/admin-ativos.html';
    } else {
      areas[editingIndex] = { nome: areaNome, descricao: areaDescricao };
      console.log('Área atualizada:', areas[editingIndex]);
      showMessage('Área atualizada com sucesso!', 'success');
      localStorage.setItem('areas', JSON.stringify(areas));
      closeModal();
      displayAreas();
    }
  });

  // Manipular busca
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const areas = loadAreas();
    const filteredAreas = areas.filter(area =>
      area.nome.toLowerCase().includes(searchTerm)
    );
    displayAreas(filteredAreas);
  });

  // Função de logout
  window.logout = () => {
    console.log('Executando logout...');
    localStorage.removeItem('loggedUser');
    window.location.href = '/pages/admin/admin-home.html';
  };

  // Inicializar
  displayAreas();
});