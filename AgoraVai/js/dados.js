// Forçar reinicialização dos planos para testes
localStorage.removeItem('planos'); // Remove chave antiga (remover após testar)

const initialPlanos = [
  {
    id: '1',
    titulo: 'Plano de Mitigação',
    descricao: 'Mitigar risco de falha no servidor',
    dataCriacao: '14/05/2025',
    areaResponsavel: 'TI',
    ativosImpactados: ['Servidor A'],
    areasImpactadas: ['TI', 'Produção'],
    urgencia: 'Médio',
    impacto: 'Médio',
    etapas: []
  }
];
localStorage.setItem('planos', JSON.stringify(initialPlanos));
console.log('Planos inicializados:', JSON.parse(localStorage.getItem('planos')));