document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ativo-form');
  const message = document.getElementById('message');
  const ativosGrid = document.getElementById('ativos-grid');
  const areaSelect = document.getElementById('ativo-area');
  const searchInput = document.getElementById('search-input');
  const modal = document.getElementById('ativo-modal');
  const modalTitle = document.getElementById('modal-title');
  let editingIndex = null;

  // Verificar elementos DOM
  if (!form || !message || !ativosGrid || !areaSelect || !searchInput || !modal || !modalTitle) {
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

  // Preencher dropdown de áreas
  const populateAreas = () => {
    const areas = loadAreas();
    areaSelect.innerHTML = '<option value="" disabled selected>Selecione uma área</option>';
    areas.forEach(area => {
      const option = document.createElement('option');
      option.value = area;
      option.textContent = area;
      areaSelect.appendChild(option);
    });
  };

  // Exibir lista de ativos
  const displayAtivos = (ativosToDisplay) => {
    console.log('Atualizando grade de ativos...');
    const ativos = ativosToDisplay || loadAtivos();
    ativosGrid.innerHTML = '';
    if (ativos.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'Nenhum ativo cadastrado.';
      p.style.color = '#888888';
      p.style.textAlign = 'center';
      ativosGrid.appendChild(p);
      return;
    }
    ativos.forEach((ativo, index) => {
      const card = document.createElement('div');
      card.className = 'ativo-card';
      card.innerHTML = `
        <div class="ativo-header">
          <span class="ativo-icon">🖥️</span>
          <h3 class="ativo-title">${ativo.nome}</h3>
        </div>
        <div class="ativo-description">${ativo.descricao || 'Sem descrição'}</div>
        <div class="ativo-area-tag">Área: ${ativo.area}</div>
        <div class="ativo-footer">
          ID: ${ativo.id} • Criado em: ${ativo.dataCriacao}
        </div>
        <div class="ativo-actions">
          <button class="edit-btn" onclick="openModal('edit', ${index})">
            <span>✏️</span>
          </button>
          <button class="delete-btn" onclick="deleteAtivo(${index})">
            <span>🗑️</span>
          </button>
        </div>
      `;
      ativosGrid.appendChild(card);
    });
  };

  // Inicializar dados, se necessário
  if (!localStorage.getItem('areas')) {
    localStorage.setItem('areas', JSON.stringify(['TI', 'Produção']));
  }
  if (!localStorage.getItem('ativos')) {
    localStorage.setItem('ativos', JSON.stringify([
      { id: 1, nome: 'Servidor A', descricao: 'Servidor principal de aplicações', area: 'TI', dataCriacao: '19/05/2025' },
      { id: 2, nome: 'Servidor B', descricao: 'Servidor de banco de dados', area: 'TI', dataCriacao: '19/05/2025' },
      { id: 3, nome: 'Linha de Produção 1', descricao: 'Linha principal de montagem', area: 'Produção', dataCriacao: '19/05/2025' }
    ]));
  }

  // Funções do modal
  window.openModal = (mode, index) => {
    editingIndex = mode === 'edit' ? index : null;
    modalTitle.textContent = mode === 'edit' ? 'Editar Ativo' : 'Cadastrar Novo Ativo';
    form.reset();
    if (mode === 'edit') {
      const ativos = loadAtivos();
      document.getElementById('ativo-nome').value = ativos[index].nome;
      document.getElementById('ativo-descricao').value = ativos[index].descricao || '';
      document.getElementById('ativo-area').value = ativos[index].area;
    }
    modal.style.display = 'block';
  };

  window.closeModal = () => {
    modal.style.display = 'none';
    form.reset();
    editingIndex = null;
  };

  // Deletar ativo
  window.deleteAtivo = (index) => {
    if (confirm('Deseja excluir este ativo?')) {
      const ativos = loadAtivos();
      ativos.splice(index, 1);
      localStorage.setItem('ativos', JSON.stringify(ativos));
      displayAtivos();
      showMessage('Ativo excluído com sucesso!', 'success');
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

    const ativoNome = document.getElementById('ativo-nome').value.trim();
    const ativoDescricao = document.getElementById('ativo-descricao').value.trim();
    const ativoArea = document.getElementById('ativo-area').value;

    if (!ativoNome || !ativoArea) {
      showMessage('Erro: Nome e área são obrigatórios.', 'error');
      return;
    }

    const ativos = loadAtivos();
    if (editingIndex === null) {
      const existingAtivo = ativos.find(a => a.nome === ativoNome);
      if (existingAtivo) {
        showMessage('Erro: Ativo já existe.', 'error');
        return;
      }
      const novoAtivo = {
        id: ativos.length > 0 ? Math.max(...ativos.map(a => a.id)) + 1 : 1,
        nome: ativoNome,
        descricao: ativoDescricao,
        area: ativoArea,
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      };
      ativos.push(novoAtivo);
      console.log('Novo ativo criado:', novoAtivo);
      showMessage('Ativo criado com sucesso!', 'success');
    } else {
      ativos[editingIndex] = {
        ...ativos[editingIndex],
        nome: ativoNome,
        descricao: ativoDescricao,
        area: ativoArea
      };
      console.log('Ativo atualizado:', ativos[editingIndex]);
      showMessage('Ativo atualizado com sucesso!', 'success');
    }

    localStorage.setItem('ativos', JSON.stringify(ativos));
    displayAtivos();
    closeModal();
  });

  // Manipular busca
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const ativos = loadAtivos();
    const filteredAtivos = ativos.filter(ativo =>
      ativo.nome.toLowerCase().includes(searchTerm) ||
      (ativo.descricao && ativo.descricao.toLowerCase().includes(searchTerm)) ||
      ativo.area.toLowerCase().includes(searchTerm)
    );
    displayAtivos(filteredAtivos);
  });

  // Função de logout
  window.logout = () => {
    console.log('Executando logout...');
    localStorage.removeItem('loggedUser');
    window.location.href = '/pages/admin/admin-home.html';
  };

  // Inicializar
  populateAreas();
  displayAtivos();
});