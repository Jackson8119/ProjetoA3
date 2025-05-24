document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('area-form');
  const message = document.getElementById('message');
  const areasTableBody = document.querySelector('#areas-table tbody');

  // Carregar e exibir áreas
  const loadAreas = () => {
    areasTableBody.innerHTML = '';
    const areas = JSON.parse(localStorage.getItem('areas')) || [];

    if (areas.length === 0) {
      areasTableBody.innerHTML = '<tr><td colspan="2">Nenhuma área cadastrada.</td></tr>';
      return;
    }

    areas.forEach(area => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${area.name}</td>
        <td>
          <button class="action-btn delete" title="Excluir" onclick="deleteArea('${area.name}')">🗑️</button>
        </td>
      `;
      areasTableBody.appendChild(row);
    });
  };

  // Excluir área
  window.deleteArea = (name) => {
    if (confirm(`Tem certeza que deseja excluir a área "${name}"?`)) {
      let areas = JSON.parse(localStorage.getItem('areas')) || [];
      areas = areas.filter(area => area.name !== name);
      localStorage.setItem('areas', JSON.stringify(areas));
      loadAreas();
      message.textContent = 'Área excluída com sucesso!';
      message.className = 'message success';
      message.style.display = 'block';
    }
  };

  // Cadastrar área
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('area-nome').value.trim();

    if (!nome) {
      message.textContent = 'Por favor, preencha o nome da área.';
      message.className = 'message error';
      message.style.display = 'block';
      return;
    }

    const areas = JSON.parse(localStorage.getItem('areas')) || [];
    if (areas.some(area => area.name.toLowerCase() === nome.toLowerCase())) {
      message.textContent = 'Esta área já está cadastrada.';
      message.className = 'message error';
      message.style.display = 'block';
      return;
    }

    areas.push({ name: nome });
    localStorage.setItem('areas', JSON.stringify(areas));
    form.reset();
    loadAreas();
    message.textContent = 'Área cadastrada com sucesso!';
    message.className = 'message success';
    message.style.display = 'block';
  });

  // Carregar áreas ao iniciar
  loadAreas();
});