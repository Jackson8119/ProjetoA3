document.addEventListener('DOMContentLoaded', () => {
  const usersTableBody = document.querySelector('#users-table tbody');
  const message = document.getElementById('message');

  // Carregar e exibir usuários
  const loadUsers = () => {
    usersTableBody.innerHTML = '';
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const lastRegisteredUser = localStorage.getItem('lastRegisteredUser');

    // Filtrar usuários válidos
    const validUsers = users.filter(user => 
      user && 
      user.nome && user.nome.trim() !== '' &&
      user.email && user.email.trim() !== '' &&
      user.login && user.login.trim() !== ''
    );

    // Identificar usuários inválidos
    const invalidUsers = users.filter(user => !validUsers.includes(user));
    if (invalidUsers.length > 0) {
      console.warn('Usuários inválidos encontrados:', invalidUsers);
      message.textContent = `Atenção: ${invalidUsers.length} usuário(s) inválido(s) encontrado(s). Use o botão abaixo para limpar.`;
      message.className = 'message error';
      message.style.display = 'block';
      // Adicionar botão para limpar inválidos
      const cleanButton = document.createElement('button');
      cleanButton.textContent = 'Limpar Usuários Inválidos';
      cleanButton.className = 'submit-btn';
      cleanButton.style.marginTop = '10px';
      cleanButton.onclick = cleanInvalidUsers;
      message.appendChild(cleanButton);
    }

    if (validUsers.length === 0) {
      usersTableBody.innerHTML = '<tr><td colspan="6">Nenhum usuário cadastrado.</td></tr>';
      return;
    }

    validUsers.forEach((user, index) => {
      const row = document.createElement('tr');
      if (user.login === lastRegisteredUser) {
        row.classList.add('highlight');
        message.textContent = `Usuário "${user.nome}" cadastrado com sucesso!`;
        message.className = 'message success';
        message.style.display = 'block';
        setTimeout(() => localStorage.removeItem('lastRegisteredUser'), 5000);
      }
      row.innerHTML = `
        <td>${user.nome}</td>
        <td>${user.email}</td>
        <td>${user.login}</td>
        <td>${user.tipo}</td>
        <td>${user.area || '-'}</td>
        <td>
          <button class="action-btn edit" title="Editar" onclick="editUser('${user.login}')">✏️</button>
          <button class="action-btn delete" title="Excluir" onclick="deleteUser(${index})">🗑️</button>
        </td>
      `;
      usersTableBody.appendChild(row);
    });

    // Atualizar localStorage com usuários válidos
    if (invalidUsers.length > 0) {
      localStorage.setItem('users', JSON.stringify(validUsers));
      users = validUsers;
    }
  };

  // Limpar usuários inválidos
  const cleanInvalidUsers = () => {
    if (confirm('Tem certeza que deseja remover todos os usuários inválidos?')) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const validUsers = users.filter(user => 
        user && 
        user.nome && user.nome.trim() !== '' &&
        user.email && user.email.trim() !== '' &&
        user.login && user.login.trim() !== ''
      );
      localStorage.setItem('users', JSON.stringify(validUsers));
      loadUsers();
      message.textContent = 'Usuários inválidos removidos com sucesso!';
      message.className = 'message success';
      message.style.display = 'block';
    }
  };

  // Excluir usuário por índice
  window.deleteUser = (index) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users[index];
    const login = user && user.login ? user.login : 'inválido';
    if (confirm(`Tem certeza que deseja excluir o usuário "${login}"?`)) {
      users.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(users));
      loadUsers();
      message.textContent = `Usuário "${login}" excluído com sucesso!`;
      message.className = 'message success';
      message.style.display = 'block';
    }
  };

  // Editar usuário (placeholder)
  window.editUser = (login) => {
    alert(`Funcionalidade de edição para o usuário "${login}" ainda não implementada.`);
  };

  // Carregar usuários ao iniciar
  loadUsers();
});