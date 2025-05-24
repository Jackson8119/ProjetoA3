document.addEventListener('DOMContentLoaded', () => {
  // Verificar se há um usuário logado
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    // Redirecionar para a página de login se não estiver autenticado
    window.location.href = '/pages/login.html';
    return;
  }

  // Verificar se o usuário é Administrador
  if (currentUser.tipo !== 'Administrador') {
    alert('Acesso não autorizado. Redirecionando para o login.');
    localStorage.removeItem('currentUser');
    window.location.href = '/pages/login.html';
    return;
  }
});

// Função de logout
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = '/pages/login.html';
}