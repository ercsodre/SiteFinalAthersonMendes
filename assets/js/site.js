const cookieNotice = document.getElementById('cookie');
if(cookieNotice && !localStorage.getItem('cookiesOk')){
  cookieNotice.style.display = 'block';
}

const serviceConfigs = {
  'recurso-multa': {
    title: 'Recurso de Multa',
    fields: [
      {name:'orgao', label:'Órgão que aplicou a multa', type:'text', placeholder:'Ex.: Detran, PRF ou prefeitura'},
      {name:'etapa', label:'Em qual etapa está o processo?', type:'select', options:['Autuação recebida','Defesa prévia','Recurso na JARI','Recurso em segunda instância','Não sei informar']}
    ]
  },
  'suspensao-cassacao': {
    title: 'Processos de Suspensão e Cassação',
    fields: [
      {name:'tipo_processo', label:'Qual é o tipo de processo?', type:'select', options:['Suspensão da CNH','Cassação da CNH','Não sei informar']},
      {name:'etapa', label:'Em qual etapa está o processo?', type:'select', options:['Notificação de instauração','Defesa apresentada','Recurso apresentado','Penalidade aplicada','Não sei informar']}
    ]
  },
  'lei-seca': {
    title: 'Lei Seca',
    fields: [
      {name:'situacao', label:'Qual foi a situação?', type:'select', options:['Recusa ao bafômetro','Teste com resultado positivo','Outra situação','Não sei informar']},
      {name:'medida', label:'Qual medida foi aplicada?', type:'select', options:['Recebi auto de infração','CNH recolhida','Veículo retido','Mais de uma medida','Não sei informar']}
    ]
  },
  'real-condutor': {
    title: 'Ação Judicial de Indicação de Real Condutor',
    fields: [
      {name:'prazo_indicacao', label:'Como está o prazo para indicação?', type:'select', options:['Ainda está aberto','Já terminou','Não sei informar']},
      {name:'condutor', label:'O real condutor pode ser identificado?', type:'select', options:['Sim, está identificado','Pode ser identificado','Ainda não sei informar']}
    ]
  },
  'defesa-ppd': {
    title: 'Defesa da PPD (CNH provisória)',
    fields: [
      {name:'situacao_ppd', label:'Qual é a situação da PPD?', type:'select', options:['Ainda estou com a PPD','CNH definitiva foi negada','Recebi processo ou notificação','Não sei informar']},
      {name:'natureza_infracao', label:'Qual é a natureza da infração?', type:'select', options:['Média','Grave','Gravíssima','Não sei informar']}
    ]
  }
};

const serviceButtons = document.querySelectorAll('.service-option');
const contactFlow = document.getElementById('atendimento-form');
const selectedServiceTitle = document.getElementById('servico-selecionado');
const selectedServiceInput = document.getElementById('servico');
const specificFields = document.getElementById('campos-especificos');
const intakeForm = document.getElementById('whatsapp-intake-form');
let currentService = null;

function renderServiceField(field){
  const id = `campo-${field.name}`;
  if(field.type === 'select'){
    const options = field.options.map(option => `<option>${option}</option>`).join('');
    return `<div class="field"><label for="${id}">${field.label}</label><select id="${id}" name="${field.name}" required><option value="">Selecione</option>${options}</select></div>`;
  }
  return `<div class="field"><label for="${id}">${field.label}</label><input id="${id}" name="${field.name}" type="text" required placeholder="${field.placeholder || ''}"></div>`;
}

serviceButtons.forEach(button => {
  button.addEventListener('click', () => {
    const serviceId = button.dataset.service;
    const config = serviceConfigs[serviceId];
    if(!config || !contactFlow || !intakeForm) return;

    currentService = config;
    selectedServiceInput.value = config.title;
    selectedServiceTitle.textContent = config.title;
    specificFields.innerHTML = config.fields.map(renderServiceField).join('');

    serviceButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-expanded', active ? 'true' : 'false');
    });

    contactFlow.hidden = false;
    requestAnimationFrame(() => contactFlow.scrollIntoView({behavior:'smooth', block:'start'}));
  });
});

if(intakeForm){
  intakeForm.addEventListener('submit', event => {
    event.preventDefault();
    if(!currentService || !intakeForm.reportValidity()) return;

    const data = new FormData(intakeForm);
    const lines = [
      'Olá, Dr. Atherson Mendes. Gostaria de atendimento em Direito de Trânsito.',
      '',
      `Serviço: ${data.get('servico')}`,
      `Nome: ${data.get('nome')}`,
      `Estado: ${String(data.get('estado')).toUpperCase()}`
    ];

    currentService.fields.forEach(field => {
      lines.push(`${field.label}: ${data.get(field.name)}`);
    });

    lines.push(`Recebeu notificação: ${data.get('notificacao')}`);
    if(data.get('prazo')) lines.push(`Data final do prazo: ${data.get('prazo')}`);
    lines.push(`Resumo do caso: ${data.get('resumo')}`);

    const whatsappUrl = `https://wa.me/556298446053?text=${encodeURIComponent(lines.join('\n'))}`;
    registrarContato(`formulario_${selectedServiceInput.value}`);
    const whatsappLink = document.createElement('a');
    whatsappLink.href = whatsappUrl;
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener';
    whatsappLink.click();
  });
}
