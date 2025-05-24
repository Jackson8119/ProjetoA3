document.addEventListener('DOMContentLoaded', () => {
  const userCountEl = document.getElementById('user-count');
  const areaCountEl = document.getElementById('area-count');
  const assetCountEl = document.getElementById('asset-count');
  const userTrendEl = document.getElementById('user-trend');
  const areaTrendEl = document.getElementById('area-trend');
  const assetTrendEl = document.getElementById('asset-trend');
  const adminNameEl = document.getElementById('admin-name');

  // Verificar elementos DOM
  if (!userCountEl || !areaCountEl || !assetCountEl || !userTrendEl || !areaTrendEl || !assetTrendEl || !adminNameEl) {
    console.error('Erro: Um ou mais elementos DOM não foram encontrados.');
    return;
  }

  // Verificar se o usuário é administrador
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.tipo !== 'Administrador') {
    console.log('Usuário não é administrador ou não está logado. Redirecionando para login...');
    window.location.href = '/pages/login.html';
    return;
  }

  // Preencher nome do administrador
  adminNameEl.textContent = currentUser.nome || currentUser.login;

  // Carregar dados do localStorage
  const loadUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const loadAreas = () => {
    const areas = localStorage.getItem('areas');
    return areas ? JSON.parse(areas) : [];
  };

  const loadAssets = () => {
    const assets = localStorage.getItem('ativos');
    return assets ? JSON.parse(assets) : [];
  };

  // Carregar contagens anteriores
  const loadPreviousCounts = () => {
    const counts = localStorage.getItem('previousCounts');
    return counts ? JSON.parse(counts) : { users: 0, areas: 0, assets: 0 };
  };

  // Atualizar contagens e tendências
  const updateDashboard = () => {
    const users = loadUsers().filter(user => 
      user && user.nome && user.nome.trim() !== '' &&
      user.email && user.email.trim() !== '' &&
      user.login && user.login.trim() !== ''
    );
    const areas = loadAreas();
    const assets = loadAssets();
    const previousCounts = loadPreviousCounts();

    // Atualizar contagens
    userCountEl.textContent = users.length;
    areaCountEl.textContent = areas.length;
    assetCountEl.textContent = assets.length;

    // Calcular tendências
    const userDiff = users.length - previousCounts.users;
    const areaDiff = areas.length - previousCounts.areas;
    const assetDiff = assets.length - previousCounts.assets;

    userTrendEl.innerHTML = userDiff === 0 ? 'Sem alteração' : 
      `${userDiff > 0 ? '▲' : '▼'} ${Math.abs(userDiff)}`;
    userTrendEl.className = `trend ${userDiff > 0 ? 'increase' : userDiff < 0 ? 'decrease' : 'neutral'}`;

    areaTrendEl.innerHTML = areaDiff === 0 ? 'Sem alteração' : 
      `${areaDiff > 0 ? '▲' : '▼'} ${Math.abs(areaDiff)}`;
    areaTrendEl.className = `trend ${areaDiff > 0 ? 'increase' : areaDiff < 0 ? 'decrease' : 'neutral'}`;

    assetTrendEl.innerHTML = assetDiff === 0 ? 'Sem alteração' : 
      `${assetDiff > 0 ? '▲' : '▼'} ${Math.abs(assetDiff)}`;
    assetTrendEl.className = `trend ${assetDiff > 0 ? 'increase' : assetDiff < 0 ? 'decrease' : 'neutral'}`;

    // Salvar contagens atuais como anteriores
    localStorage.setItem('previousCounts', JSON.stringify({
      users: users.length,
      areas: areas.length,
      assets: assets.length
    }));
  };

  // Função de logout
  window.logout = () => {
    console.log('Executando logout...');
    localStorage.removeItem('currentUser');
    window.location.href = '/pages/login.html';
  };

  // Inicializar
  updateDashboard();
});