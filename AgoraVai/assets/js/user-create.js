document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('user-form');
  const message = document.getElementById('message');
  const tipoUsuario = document.getElementById('user-tipo');
  const areaGroup = document.getElementById('area-group');
  const areaSelect = document.getElementById('user-area');

  // Carregar áreas no select
  const loadAreas = () => {
    try {
      const rawAreas = localStorage.getItem('areas');
      console.log('Conteúdo bruto de localStorage.areas:', rawAreas);
      
      let areas = rawAreas ? JSON.parse(rawAreas) : [];
      areaSelect.innerHTML = '<option value="" disabled selected>Selecione a área de atuação</option>';

      if (!Array.isArray(areas)) {
        console.warn('Áreas não são um array:', areas);
        areas = [];
      }

      const normalizedAreas = areas.map(item => {
        if (typeof item === 'string') {
          return { name: item };
        } else if (item && typeof item === 'object') {
          return { name: item.name || item.area || Object.values(item)[0] };
        }
        return null;
      }).filter(item => item && item.name);

      if (normalizedAreas.length === 0) {
        console.warn('Nenhuma área válida encontrada.');
        areaSelect.innerHTML += '<option value="" disabled>Nenhuma área disponível</option>';
        message.textContent = 'Nenhuma área cadastrada. Por favor, cadastre áreas em Administração de Áreas.';
        message.className = 'message error';
        message.style.display = 'block';
        return;
      }

      normalizedAreas.forEach(area => {
        const option = document.createElement('option');
        option.value = area.name;
        option.textContent = area.name;
        areaSelect.appendChild(option);
      });
      console.log('Áreas normalizadas carregadas:', normalizedAreas);
    } catch (error) {
      console.error('Erro ao carregar áreas:', error);
      areaSelect.innerHTML = '<option value="" disabled>Erro ao carregar áreas</option>';
      message.textContent = 'Erro ao carregar áreas. Verifique o console para detalhes.';
      message.className = 'message error';
      message.style.display = 'block';
    }
  };

  // Mostrar/esconder campo de área com base no tipo de usuário
  tipoUsuario.addEventListener('change', () => {
    areaGroup.style.display = tipoUsuario.value === 'Operador' ? 'block' : 'none';
    if (tipoUsuario.value === 'Operador') {
      loadAreas();
    }
  });

  // Alternar visibilidade da senha
  window.togglePassword = (fieldId) => {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling;
    if (field.type === 'password') {
      field.type = 'text';
      icon.textContent = '🙈';
    } else {
      field.type = 'password';
      icon.textContent = '👁️';
    }
  };

  // Validar e enviar formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Formulário submetido');

    const nome = document.getElementById('user-nome').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const login = document.getElementById('user-login').value.trim();
    const tipo = tipoUsuario.value;
    const area = tipo === 'Operador' ? areaSelect.value : '';
    const senha = document.getElementById('user-senha').value;
    const confirmarSenha = document.getElementById('user-confirmar-senha').value;

    console.log('Dados do formulário:', { nome, email, login, tipo, area, senha, confirmarSenha });

    // Validações
    if (!nome || !email || !login || !tipo || !senha || !confirmarSenha || (tipo === 'Operador' && !area)) {
      message.textContent = 'Por favor, preencha todos os campos obrigatórios.';
      message.className = 'message error';
      message.style.display = 'block';
      return;
    }

    if (nome === '' || email === '' || login === '') {
      message.textContent = 'Nome, email e login não podem ser vazios.';
      message.className = 'message error';
      message.style.display = 'block';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.textContent = 'Por favor, insira um email válido.';
      message.className = 'message error';
      message.style.display = 'block';
      return;
    }

    if (senha !== confirmarSenha) {
      message.textContent = 'As senhas não coincidem.';
      message.className = 'message error';
      message.style.display = 'block';
      return;
    }

    // Salvar usuário no localStorage
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];

      if (users.some(user => user.nome && user.nome.toLowerCase() === nome.toLowerCase())) {
        message.textContent = 'Este nome já está em uso.';
        message.className = 'message error';
        message.style.display = 'block';
        return;
      }

      if (users.some(user => user.email && user.email.toLowerCase() === email.toLowerCase())) {
        message.textContent = 'Este email já está em uso.';
        message.className = 'message error';
        message.style.display = 'block';
        return;
      }

      if (users.some(user => user.login && user.login.toLowerCase() === login.toLowerCase())) {
        message.textContent = 'Este login já está em uso.';
        message.className = 'message error';
        message.style.display = 'block';
        return;
      }

      const newUser = {
        nome,
        email,
        login,
        tipo,
        area,
        senha,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('lastRegisteredUser', login);
      console.log('Usuário salvo. Lista de usuários:', users);

      // Redirecionar para admin-users.html
      window.location.href = '/pages/admin/admin-users.html';
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      message.textContent = 'Erro ao salvar usuário. Verifique o console.';
      message.className = 'message error';
      message.style.display = 'block';
    }
  });

  // Carregar áreas ao iniciar
  loadAreas();
});

// Função de logout
function logout() {
  alert('Retornando ao Dashboard');
  window.location.href = '/pages/admin/admin-home.html';
}