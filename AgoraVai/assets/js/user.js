document.addEventListener('DOMContentLoaded', () => {
  const usersTableBody = document.querySelector('#users-table tbody');
  const searchInput = document.querySelector('#search-user');
  const areaFilter = document.querySelector('#filter-area');

  // Carregar áreas no select
  const loadAreas = () => {
    const areas = JSON.parse(localStorage.getItem('areas')) || [];
    areas.forEach(area => {
      const option = document.createElement('option');
      option.value = area.name;
      option.textContent = area.name;
      areaFilter.appendChild(option);
    });
  };

  // Formatar data para DD/MM/AAAA
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Carregar e exibir usuários
  const loadUsers = (search = '', area = '') => {
    usersTableBody.innerHTML = '';
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const filteredUsers = users.filter(user => {
      const matchesSearch = user.nome.toLowerCase().includes(search.toLowerCase()) ||
                           user.email.toLowerCase().includes(search.toLowerCase()) ||
                           user.login.toLowerCase().includes(search.toLowerCase());
      const matchesArea = !area || user.area === area;
      return matchesSearch && matchesArea;
    });

    filteredUsers.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.nome}</td>
        <td>${user.email}</td>
        <td>${user.login}</td>
        <td>${user.tipo}</td>
        <td>${user.area || '-'}</td>
        <td>${user.createdAt ? formatDate(user.createdAt) : '-'}</td>
        <td>
          <button class="action-btn edit" title="Editar" onclick="editUser('${user.login}')">✏️</button>
          <button class="action-btn delete" title="Excluir" onclick="deleteUser('${user.login}')">🗑️</button>
        </td>
      `;
      usersTableBody.appendChild(row);
    });
  };

  // Editar usuário (placeholder)
  window.editUser = (login) => {
    alert(`Editar usuário com login: ${login}`);
    // Futuro: window.location.href = `/pages/admin/admin-users-edit.html?login=${login}`;
  };

  // Excluir usuário
  window.deleteUser = (login) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.filter(user => user.login !== login);
      localStorage.setItem('users', JSON.stringify(users));
      loadUsers(searchInput.value, areaFilter.value);
    }
  };

  // Eventos de filtro e pesquisa
  searchInput.addEventListener('input', () => {
    loadUsers(searchInput.value, areaFilter.value);
  });

  areaFilter.addEventListener('change', () => {
    loadUsers(searchInput.value, areaFilter.value);
  });

  // Carregar dados iniciais
  loadAreas();
  loadUsers();
});