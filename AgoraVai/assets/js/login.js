document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Carregar usuários do localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Adicionar usuário padrão se não existir
    if (!users.some(u => u.login === 'admin')) {
      users.push({
        nome: 'Administrador',
        email: 'admin@agora.vai',
        login: 'admin',
        tipo: 'Administrador',
        senha: 'admin123',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Validar credenciais
    const user = users.find(
      (user) => user.login === username && user.senha === password
    );

    if (user) {
      // Salvar usuário logado no localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        login: user.login,
        tipo: user.tipo
      }));

      // Redirecionar com base no tipo de usuário
      switch (user.tipo) {
        case 'Administrador':
          window.location.href = '/pages/admin/admin-home.html';
          break;
        case 'Gerenciador':
          window.location.href = '/pages/gerenciador/gerenciador-home.html';
          break;
        case 'Operador':
          window.location.href = '/pages/user/user-home.html';
          break;
        default:
          errorMessage.textContent = 'Tipo de usuário inválido.';
          errorMessage.className = 'message error';
          errorMessage.style.display = 'block';
      }
    } else {
      errorMessage.textContent = 'Usuário ou senha inválidos.';
      errorMessage.className = 'message error';
      errorMessage.style.display = 'block';
    }
  });
});