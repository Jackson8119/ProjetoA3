document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const togglePassword = document.querySelector('.toggle-password');
  const passwordInput = document.getElementById('password');

  // Carregar dados iniciais
  if (!localStorage.getItem('users')) {
    const initialUsers = [
      {
        username: "admin",
        password: "admin123",
        tipo: "Administrador",
        email: "admin@exemplo.com",
        nomeCompleto: "Administrador do Sistema"
      },
      {
        username: "gerenciador",
        password: "ger123",
        tipo: "Gerenciador",
        email: "gerenciador@exemplo.com",
        nomeCompleto: "Gerenciador Teste"
      },
      {
        username: "operador",
        password: "op123",
        tipo: "Operador",
        email: "operador@exemplo.com",
        nomeCompleto: "Operador Teste"
      }
    ];
    localStorage.setItem('users', JSON.stringify(initialUsers));
  }

  togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.textContent = type === 'password' ? '👁' : '🙈';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      errorMessage.textContent = 'Por favor, preencha todos os campos.';
      errorMessage.style.display = 'block';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Usuários no localStorage:', users); // Para depuração
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      errorMessage.style.display = 'none';
      localStorage.setItem('loggedUser', JSON.stringify(user));
      if (user.tipo === 'Gerenciador') {
        window.location.href = 'dashboard-gerenciador.html';
      } else {
        errorMessage.textContent = 'Dashboard não implementado para este tipo de usuário.';
        errorMessage.style.display = 'block';
      }
    } else {
      errorMessage.textContent = 'Nome de usuário ou senha incorretos.';
      errorMessage.style.display = 'block';
    }
  });
});