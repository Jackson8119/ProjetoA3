document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.querySelector('.toggle-password');

  // Função para carregar usuários do localStorage
  const loadUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  // Mostrar/esconder senha
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.textContent = type === 'password' ? '👁' : '🙈';
  });

  // Submissão do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      errorMessage.textContent = 'Por favor, preencha todos os campos.';
      errorMessage.style.display = 'block';
      return;
    }

    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      errorMessage.textContent = 'Usuário ou senha inválidos.';
      errorMessage.style.display = 'block';
      return;
    }

    errorMessage.style.display = 'none';
    // Redirecionar com base no tipo de usuário
    switch (user.tipo) {
      case 'Administrador':
        window.location.href = 'dashboard-admin.html';
        break;
      case 'Gerenciador':
        window.location.href = 'dashboard-gerenciador.html';
        break;
      case 'Operador':
        window.location.href = 'dashboard-operador.html';
        break;
      default:
        errorMessage.textContent = 'Tipo de usuário inválido.';
        errorMessage.style.display = 'block';
    }
  });
});