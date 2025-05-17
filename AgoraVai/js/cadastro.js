document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastro-form');
  const errorMessage = document.getElementById('error-message');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');

  // Função para carregar usuários do localStorage
  const loadUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  // Função para salvar usuários no localStorage
  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  // Função para validar e-mail
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Mostrar/esconder senha
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.previousElementSibling;
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      button.textContent = type === 'password' ? '👁' : '🙈';
    });
  });

  // Submissão do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const nomeCompleto = document.getElementById('nome-completo').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Validações
    if (!email || !nomeCompleto || !username || !password || !confirmPassword) {
      errorMessage.textContent = 'Por favor, preencha todos os campos.';
      errorMessage.style.display = 'block';
      return;
    }

    if (!isValidEmail(email)) {
      errorMessage.textContent = 'Por favor, insira um e-mail válido.';
      errorMessage.style.display = 'block';
      return;
    }

    const users = loadUsers();
    if (users.some(u => u.username === username)) {
      errorMessage.textContent = 'Este nome de usuário já está em uso.';
      errorMessage.style.display = 'block';
      return;
    }

    if (password.length < 6) {
      errorMessage.textContent = 'A senha deve ter pelo menos 6 caracteres.';
      errorMessage.style.display = 'block';
      return;
    }

    if (password !== confirmPassword) {
      errorMessage.textContent = 'As senhas não coincidem.';
      errorMessage.style.display = 'block';
      return;
    }

    // Registrar novo usuário
    users.push({
      username,
      password,
      tipo: 'Operador',
      email,
      nomeCompleto
    });
    saveUsers(users);

    errorMessage.style.display = 'none';
    // Redirecionar para a tela de login
    window.location.href = 'login.html';
  });
});