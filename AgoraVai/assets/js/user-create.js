document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('user-form');
  const message = document.getElementById('message');
  const tipoSelect = document.getElementById('user-tipo');
  const areaGroup = document.getElementById('area-group');
  const areaSelect = document.getElementById('user-area');

  // Verificar elementos DOM
  if (!form || !message || !tipoSelect || !areaGroup || !areaSelect) {
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

  // Carregar áreas e usuários do localStorage
  const loadAreas = () => {
    const areas = localStorage.getItem('areas');
    return areas ? JSON.parse(areas) : [];
  };

  const loadUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  // Preencher dropdown de áreas
  const populateAreas = () => {
    const areas = loadAreas();
    areaSelect.innerHTML = '<option value="" disabled selected>Selecione uma área</option>';
    areas.forEach(area => {
      const option = document.createElement('option');
      option.value = area.nome;
      option.textContent = area.nome;
      areaSelect.appendChild(option);
    });
  };

  // Mostrar/esconder campo de área baseado no tipo de usuário
  tipoSelect.addEventListener('change', () => {
    if (tipoSelect.value === 'Operador') {
      areaGroup.style.display = 'block';
      areaSelect.setAttribute('required', 'required');
    } else {
      areaGroup.style.display = 'none';
      areaSelect.removeAttribute('required');
    }
  });

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

    const nome = document.getElementById('user-nome').value.trim();
    const login = document.getElementById('user-login').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const tipo = document.getElementById('user-tipo').value;
    const area = tipo === 'Operador' ? document.getElementById('user-area').value : '';
    const senha = document.getElementById('user-senha').value;
    const confirmarSenha = document.getElementById('user-confirmar-senha').value;

    // Validações
    if (!nome || !login || !email || !tipo || !senha || !confirmarSenha || (tipo === 'Operador' && !area)) {
      showMessage('Erro: Todos os campos obrigatórios devem ser preenchidos.', 'error');
      return;
    }

    if (senha !== confirmarSenha) {
      showMessage('Erro: As senhas não coincidem.', 'error');
      return;
    }

    const users = loadUsers();
    if (users.some(user => user.login === login)) {
      showMessage('Erro: Login já está em uso.', 'error');
      return;
    }

    if (users.some(user => user.email === email)) {
      showMessage('Erro: Email já está em uso.', 'error');
      return;
    }

    // Criar novo usuário
    const newUser = {
      nome,
      login,
      email,
      senha,
      tipo,
      area: tipo === 'Operador' ? area : null
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showMessage('Usuário cadastrado com sucesso!', 'success');

    // Redirecionar após 2 segundos
    setTimeout(() => {
      window.location.href = '/pages/admin/admin-users.html';
    }, 2000);
  });

  // Função para mostrar/esconder senha
  window.togglePassword = (inputId) => {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    if (input.type === 'password') {
      input.type = 'text';
      toggle.textContent = '🙈';
    } else {
      input.type = 'password';
      toggle.textContent = '👁️';
    }
  };

  // Função de logout
  window.logout = () => {
    console.log('Executando logout...');
    localStorage.removeItem('loggedUser');
    window.location.href = '/pages/admin/admin-home.html';
  };

  // Inicializar
  populateAreas();
});