const toast = document.querySelector('#toast');
let toastTimer;

const assistantAccess = [
  { name: 'Ana García', machine: 'OFI-12', status: 'Autorizado', lastSeen: 'Hace 2 min', risk: 'Seguro' },
  { name: 'Sergio López', machine: 'OFI-08', status: 'Verificado', lastSeen: 'Hace 5 min', risk: 'Normal' },
  { name: 'Marta Ruiz', machine: 'OFI-04', status: 'Restringido', lastSeen: 'Hace 1 min', risk: 'Revisión' },
  { name: 'Daniel Pérez', machine: 'OFI-17', status: 'Autorizado', lastSeen: 'Hace 3 min', risk: 'Seguro' }
];

const agentActivity = [
  { name: 'Ana García', office: 'OFI-12', department: 'Finanzas', ingresos: [{ time: '08:42', detail: 'Inicio de sesión en equipo FIN-WS-024', status: 'Verificado' }, { time: '09:16', detail: 'Acceso a VPN corporativa', status: 'MFA validado' }], descargas: [{ time: '09:03', detail: 'Finanzas_Q4_2026.xlsx', status: 'Autorizada' }, { time: '09:21', detail: 'Presupuesto_2027.pdf', status: 'Autorizada' }], recibidos: [{ time: '08:51', detail: 'Cierre trimestral · Laura Méndez', status: 'Revisado' }, { time: '09:12', detail: 'Confirmación bancaria · Tesorería', status: 'Adjunto seguro' }], enviados: [{ time: '09:08', detail: 'Informe de liquidez · Dirección', status: 'Entregado' }, { time: '09:27', detail: 'Solicitud de firma · Legal', status: 'Entregado' }] },
  { name: 'Sergio López', office: 'OFI-08', department: 'Operaciones', ingresos: [{ time: '08:37', detail: 'Inicio de sesión en equipo OPS-WS-008', status: 'Verificado' }, { time: '09:02', detail: 'Acceso al servidor de archivos', status: 'Autorizado' }], descargas: [{ time: '08:58', detail: 'Plan_Recuperación_Sistemas.docx', status: 'Revisada' }, { time: '09:14', detail: 'Inventario_activos.csv', status: 'Autorizada' }], recibidos: [{ time: '08:45', detail: 'Ventana de mantenimiento · Infraestructura', status: 'Revisado' }, { time: '09:19', detail: 'Alerta de respaldo · SOC', status: 'Prioritario' }], enviados: [{ time: '09:11', detail: 'Estado de parches · TI', status: 'Entregado' }, { time: '09:31', detail: 'Reporte de mantenimiento · Dirección', status: 'Entregado' }] },
  { name: 'Marta Ruiz', office: 'OFI-04', department: 'Legal', ingresos: [{ time: '08:49', detail: 'Inicio de sesión en equipo LEG-WS-004', status: 'Verificado' }, { time: '09:06', detail: 'Consulta de contratos', status: 'Autorizado' }], descargas: [{ time: '09:06', detail: 'Contratos_Alpha_Cliente.pdf', status: 'Autorizada' }, { time: '09:24', detail: 'Anexo_proveedor.docx', status: 'Restringida' }], recibidos: [{ time: '08:55', detail: 'Revisión contractual · Cliente Alpha', status: 'Revisado' }, { time: '09:17', detail: 'Aviso de cumplimiento · SOC', status: 'Prioritario' }], enviados: [{ time: '09:09', detail: 'Observaciones de contrato · Dirección', status: 'Entregado' }, { time: '09:29', detail: 'Solicitud de documentación · Finanzas', status: 'Entregado' }] },
  { name: 'Daniel Pérez', office: 'OFI-17', department: 'RRHH', ingresos: [{ time: '08:31', detail: 'Inicio de sesión en equipo HR-WS-017', status: 'Verificado' }, { time: '09:18', detail: 'Acceso a directorio de empleados', status: 'MFA validado' }], descargas: [{ time: '09:18', detail: 'RRHH_Empleados_Confidencial.csv', status: 'Autorizada' }, { time: '09:26', detail: 'Altas_octubre.xlsx', status: 'Autorizada' }], recibidos: [{ time: '08:59', detail: 'Nuevas incorporaciones · Dirección', status: 'Revisado' }, { time: '09:22', detail: 'Solicitud de acceso · Soporte', status: 'Revisado' }], enviados: [{ time: '09:20', detail: 'Listado de incorporaciones · Finanzas', status: 'Entregado' }, { time: '09:34', detail: 'Documentación de alta · Legal', status: 'Entregado' }] }
];

const patchBalance = [
  { name: 'Windows 11 24H2', completion: 96, status: 'Actualizado' },
  { name: 'Defender AV', completion: 88, status: 'Pendiente' },
  { name: 'Firewall', completion: 100, status: 'Actualizado' },
  { name: 'Office 365', completion: 74, status: 'Pendiente' }
];

const networkUsage = [
  { name: 'Red de oficinas', traffic: '412 MB/s', risk: 'Estable' },
  { name: 'VPN ejecutiva', traffic: '188 MB/s', risk: 'Bajo' },
  { name: 'Servidor de archivos', traffic: '603 MB/s', risk: 'Elevado' },
  { name: 'Correo corporativo', traffic: '256 MB/s', risk: 'Estable' }
];

const threatStudyCatalog = [
  {
    type: 'Ransomware',
    source: 'Archivo adjunto de correo',
    pattern: 'Cifrado rápido y bloqueo de archivos clave.',
    interpretation: 'La amenaza presenta cifrado activo sobre documentos empresariales, una señal típica de ransomware que intenta detener procesos críticos y presionar por rescate.',
    countermeasure: 'Separar el equipo, aislar la red, revisar backups y restaurar desde copias verificadas; activar respuesta por incidente y bloquear la ruta de ejecución.'
  },
  {
    type: 'Gusano de red',
    source: 'Escaneo lateral interno',
    pattern: 'Propagación automática hacia equipos vecinos.',
    interpretation: 'Este comportamiento indica propagación automática entre terminales, probablemente mediante puertos o servicios compartidos, con riesgo alto de expansión lateral.',
    countermeasure: 'Desactivar la comunicación entre segmentos afectados, aplicar parches de red y reforzar el firewall con reglas de restricción para tráfico lateral.'
  },
  {
    type: 'Phishing con credenciales',
    source: 'Correo o VPN simulada',
    pattern: 'Solicitudes de autenticación urgentes y enlaces falsos.',
    interpretation: 'La actividad apunta a un intento de suplantación con captación de credenciales, muy frecuente en entornos de oficina y gestión de accesos.',
    countermeasure: 'Reforzar autenticación multifactor, invalidar sesiones sospechosas y enviar capacitación especializada a usuarios con un flujo de validación seguro.'
  }
];

const confidentialFiles = [
  { name: 'Finanzas_Q4_2026.xlsx', owner: 'Tesorería', status: 'Permitido' },
  { name: 'Contratos_Alpha_Cliente.pdf', owner: 'Legal', status: 'Permitido' },
  { name: 'Plan_Recuperación_Sistemas.docx', owner: 'Operaciones', status: 'Restringido' },
  { name: 'RRHH_Empleados_Confidencial.csv', owner: 'Recursos humanos', status: 'Permitido' }
];

const rolePermissions = [
  { role: 'Director', scope: 'Acceso total', status: 'Permitido' },
  { role: 'Gestión', scope: 'Finanzas y RRHH', status: 'Autorizado' },
  { role: 'Operaciones', scope: 'Infraestructura', status: 'Autorizado' },
  { role: 'Soporte', scope: 'Solo tareas asignadas', status: 'Revisado' }
];

const accessAudit = [
  { user: 'Ana García', action: 'Intento de acceso', file: 'Finanzas_Q4_2026.xlsx', result: 'Bloqueado', time: 'Hace 4 min' },
  { user: 'Sergio López', action: 'Solicitó lectura', file: 'Plan_Recuperación_Sistemas.docx', result: 'Revisado', time: 'Hace 12 min' },
  { user: 'Marta Ruiz', action: 'Descarga de archivo', file: 'Contratos_Alpha_Cliente.pdf', result: 'Autorizado', time: 'Hace 19 min' }
];

const liveSecurityEvents = [
  { label: 'Política de acceso reforzada', severity: 'ok' },
  { label: 'MFA validado en terminal ejecutiva', severity: 'ok' },
  { label: 'Intento sospechoso en directorio legal', severity: 'warn' }
];

const accessHistory = [
  { user: 'Ana García', department: 'Finanzas', file: 'Finanzas_Q4_2026.xlsx', time: '08:42', action: 'Lectura comprobada', status: 'Permitido' },
  { user: 'Sergio López', department: 'Operaciones', file: 'Plan_Recuperación_Sistemas.docx', time: '08:54', action: 'Intento de edición', status: 'Bloqueado' },
  { user: 'Marta Ruiz', department: 'Legal', file: 'Contratos_Alpha_Cliente.pdf', time: '09:06', action: 'Consulta autorizada', status: 'Permitido' },
  { user: 'Lucía Díaz', department: 'RRHH', file: 'RRHH_Empleados_Confidencial.csv', time: '09:18', action: 'Descarga verificada', status: 'Permitido' }
];

const socAlerts = [
  { label: 'Acceso anómalo a archivos financieros', severity: 'critical', time: 'Hace 2 min' },
  { label: 'Riesgo elevado en segmento de operaciones', severity: 'warning', time: 'Hace 6 min' },
  { label: 'Política MFA aplicada a 18 sesiones', severity: 'ok', time: 'Hace 9 min' }
];

let activeDepartmentFilter = 'Todos';
let activeAgentView = 'ingresos';

function renderAgentActivity() {
  const select = document.querySelector('#agentSelect');
  const summary = document.querySelector('#agentSummary');
  const detail = document.querySelector('#agentDetail');
  if (!select || !summary || !detail) return;
  if (!select.options.length) select.innerHTML = agentActivity.map((agent, index) => `<option value="${index}">${agent.name} · ${agent.office}</option>`).join('');
  const agent = agentActivity[Number(select.value) || 0];
  const activity = agent[activeAgentView];
  const labels = { ingresos: 'Ingresos registrados', descargas: 'Descargas realizadas', recibidos: 'Mensajes recibidos', enviados: 'Mensajes enviados' };
  summary.innerHTML = `<div><span>Agente</span><strong>${agent.name}</strong><small>${agent.department} · ${agent.office}</small></div><div><span>Eventos hoy</span><strong>${activity.length}</strong><small>${labels[activeAgentView]}</small></div><div><span>Última actividad</span><strong>${activity[activity.length - 1].time}</strong><small>Hora local</small></div>`;
  detail.innerHTML = `<div class="agent-detail-heading"><h3>${labels[activeAgentView]}</h3><span>Hoy · ${agent.office}</span></div>${activity.map((item) => `<div class="agent-event"><time>${item.time}</time><div><strong>${item.detail}</strong><small>${agent.name} · ${agent.department}</small></div><em>${item.status}</em></div>`).join('')}`;
}

function downloadReport(area) {
  const reports = {
    diario: 'Informe diario de seguridad\n\nPostura: 87/100\nDispositivos protegidos: 142/148\nAlertas abiertas: 07\nTiempo medio de respuesta: 18 min',
    amenazas: 'Informe de amenazas e incidentes\n\nEventos de las últimas 24 horas: 24\nCríticos: 2\nAltos: 5\nMedios: 11\nBajos: 6\n\nRespuesta: ransomware bloqueado y gusano neutralizado.',
    activos: `Informe de activos y actualizaciones\n\nDispositivos protegidos: 142/148\n${patchBalance.map((entry) => `${entry.name}: ${entry.completion}% - ${entry.status}`).join('\n')}`,
    red: `Informe de accesos y red\n\nEquipos activos: ${document.querySelector('#liveAccessTotal').textContent}\nTráfico medio: ${document.querySelector('#liveNetworkTotal').textContent} Gb/s\n\n${assistantAccess.map((entry) => `${entry.name} (${entry.machine}): ${entry.status} - ${entry.risk}`).join('\n')}\n\n${networkUsage.map((entry) => `${entry.name}: ${entry.traffic} - ${entry.risk}`).join('\n')}`,
    operaciones: `Informe operativo\n\nAccesos actuales: ${document.querySelector('#liveAccessTotal').textContent}\nParches pendientes: ${document.querySelector('#livePatchTotal').textContent}\nTráfico de red: ${document.querySelector('#liveNetworkTotal').textContent} Gb/s`
  };

  const blob = new Blob([reports[area] || reports.diario], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `sentinel-${area}-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  showToast(`Informe diario de ${area} descargado`);
}

function renderAssistantAccess() {
  const list = document.querySelector('#assistantAccessList');
  if (!list) return;
  list.innerHTML = assistantAccess.map((entry) => `
    <li>
      <div><strong>${entry.name}</strong><span>${entry.machine} · ${entry.status}</span></div>
      <div class="list-meta"><b>${entry.lastSeen}</b><em class="tag ${entry.risk === 'Revisión' ? 'warning-tag' : 'good-tag'}">${entry.risk}</em></div>
    </li>
  `).join('');
}

function renderPatchBalance() {
  const list = document.querySelector('#patchBalanceList');
  if (!list) return;
  list.innerHTML = patchBalance.map((entry) => `
    <li>
      <div><strong>${entry.name}</strong><span>${entry.completion}% completado</span></div>
      <div class="list-meta"><b>${entry.status}</b><em class="tag ${entry.status === 'Pendiente' ? 'warning-tag' : 'good-tag'}">${entry.status === 'Pendiente' ? 'Revisión' : 'OK'}</em></div>
    </li>
  `).join('');
}

function renderNetworkUsage() {
  const list = document.querySelector('#networkUsageList');
  if (!list) return;
  list.innerHTML = networkUsage.map((entry) => `
    <li>
      <div><strong>${entry.name}</strong><span>${entry.traffic}</span></div>
      <div class="list-meta"><b>${entry.risk}</b><em class="tag ${entry.risk === 'Elevado' ? 'warning-tag' : 'good-tag'}">${entry.risk === 'Elevado' ? 'Atención' : 'Normal'}</em></div>
    </li>
  `).join('');
}

function renderThreatStudy() {
  const list = document.querySelector('#threatStudyList');
  const detail = document.querySelector('#threatStudyDetail');
  if (!list || !detail) return;

  list.innerHTML = threatStudyCatalog.map((item, index) => `
    <button class="study-option ${index === 0 ? 'active' : ''}" data-index="${index}">
      <span>${item.type}</span>
      <small>${item.source}</small>
    </button>
  `).join('');

  const updateStudy = (index) => {
    const item = threatStudyCatalog[index];
    detail.innerHTML = `
      <div class="study-badge">${item.type}</div>
      <h3>${item.source}</h3>
      <p><strong>Patrón:</strong> ${item.pattern}</p>
      <p><strong>Interpretación:</strong> ${item.interpretation}</p>
      <div class="countermeasure-box">
        <span>Contramedida recomendada</span>
        <strong>${item.countermeasure}</strong>
      </div>
    `;

    list.querySelectorAll('.study-option').forEach((button, buttonIndex) => {
      button.classList.toggle('active', buttonIndex === index);
    });
  };

  list.addEventListener('click', (event) => {
    const button = event.target.closest('.study-option');
    if (!button) return;
    updateStudy(Number(button.dataset.index));
  });

  updateStudy(0);
}

function renderConfidentialFiles() {
  const list = document.querySelector('#confidentialFilesList');
  if (!list) return;

  list.innerHTML = confidentialFiles.map((file) => `
    <div class="file-row">
      <span class="file-name">${file.name}</span>
      <span class="file-owner">${file.owner}</span>
      <span class="file-status ${file.status === 'Restringido' ? 'restricted' : 'allowed'}">${file.status}</span>
      <button class="deny-access" data-file="${file.name}" aria-label="Denegar acceso a ${file.name}">${file.status === 'Restringido' ? 'Reactivar' : 'Denegar'}</button>
    </div>
  `).join('');
}

function renderRolePermissions() {
  const list = document.querySelector('#rolePermissionsList');
  if (!list) return;

  list.innerHTML = rolePermissions.map((entry) => `
    <div class="role-row">
      <div>
        <strong>${entry.role}</strong>
        <span>${entry.scope}</span>
      </div>
      <div class="role-meta">
        <span class="mini-state ${entry.status === 'Permitido' ? 'allow' : entry.status === 'Autorizado' ? 'ok' : 'review'}">${entry.status}</span>
        <button class="permission-toggle" data-role="${entry.role}">${entry.status === 'Permitido' ? 'Bloquear' : 'Permitir'}</button>
      </div>
    </div>
  `).join('');
}

function renderAccessAudit() {
  const list = document.querySelector('#accessAuditList');
  if (!list) return;

  list.innerHTML = accessAudit.map((entry) => `
    <div class="audit-row">
      <div>
        <strong>${entry.user}</strong>
        <span>${entry.action} · ${entry.file}</span>
      </div>
      <div class="audit-meta">
        <b>${entry.time}</b>
        <em class="audit-result ${entry.result === 'Bloqueado' ? 'blocked' : entry.result === 'Revisado' ? 'review' : 'allowed'}">${entry.result}</em>
      </div>
    </div>
  `).join('');
}

function renderSecurityEvents() {
  const list = document.querySelector('#securityEventList');
  if (!list) return;

  list.innerHTML = liveSecurityEvents.map((event) => `
    <div class="event-row">
      <span class="event-dot ${event.severity}"></span>
      <span>${event.label}</span>
    </div>
  `).join('');
}

function renderAccessHistory() {
  const list = document.querySelector('#accessHistoryList');
  if (!list) return;

  const filtered = activeDepartmentFilter === 'Todos'
    ? accessHistory
    : accessHistory.filter((entry) => entry.department === activeDepartmentFilter);

  list.innerHTML = filtered.map((entry) => `
    <div class="history-row">
      <div>
        <strong>${entry.user}</strong>
        <span>${entry.department} · ${entry.file}</span>
      </div>
      <div class="history-meta">
        <b>${entry.time}</b>
        <em class="history-status ${entry.status === 'Bloqueado' ? 'blocked' : 'allowed'}">${entry.status}</em>
      </div>
    </div>
  `).join('');
}

function renderSocAlerts() {
  const list = document.querySelector('#socAlertList');
  if (!list) return;

  list.innerHTML = socAlerts.map((alert) => `
    <li class="soc-alert-item ${alert.severity}">
      <span class="soc-alert-dot"></span>
      <div>
        <strong>${alert.label}</strong>
        <small>${alert.time}</small>
      </div>
    </li>
  `).join('');
}

function updateLiveMetrics() {
  const accessTotal = document.querySelector('#liveAccessTotal');
  const patchTotal = document.querySelector('#livePatchTotal');
  const networkTotal = document.querySelector('#liveNetworkTotal');

  if (!accessTotal || !patchTotal || !networkTotal) return;

  const nextAccess = Math.max(14, Math.min(24, Number(accessTotal.textContent) + (Math.random() > 0.5 ? 1 : -1)));
  const nextPatch = Math.max(5, Math.min(18, Number(patchTotal.textContent) + (Math.random() > 0.5 ? 1 : 0)));
  const nextNetwork = Number((Math.random() * 1.8 + 0.8).toFixed(1));

  accessTotal.textContent = nextAccess;
  patchTotal.textContent = nextPatch;
  networkTotal.textContent = nextNetwork.toFixed(1);

  const randomAssistant = assistantAccess[Math.floor(Math.random() * assistantAccess.length)];
  randomAssistant.lastSeen = `Hace ${Math.max(1, Math.floor(Math.random() * 5))} min`;
  randomAssistant.status = ['Autorizado', 'Verificado', 'Restringido'][Math.floor(Math.random() * 3)];
  randomAssistant.risk = randomAssistant.status === 'Restringido' ? 'Revisión' : (Math.random() > 0.7 ? 'Normal' : 'Seguro');
  renderAssistantAccess();

  const randomPatch = patchBalance[Math.floor(Math.random() * patchBalance.length)];
  randomPatch.completion = Math.max(60, Math.min(100, randomPatch.completion + (Math.random() > 0.5 ? 2 : -2)));
  randomPatch.status = randomPatch.completion >= 95 ? 'Actualizado' : 'Pendiente';
  renderPatchBalance();

  const randomNetwork = networkUsage[Math.floor(Math.random() * networkUsage.length)];
  randomNetwork.traffic = `${(Math.random() * 700 + 120).toFixed(0)} MB/s`;
  randomNetwork.risk = randomNetwork.traffic.includes('600') ? 'Elevado' : (Math.random() > 0.7 ? 'Bajo' : 'Estable');
  renderNetworkUsage();

  const eventTemplates = [
    { label: 'Intento de acceso bloqueado por política', severity: 'warn' },
    { label: 'Sesión de gestión verificada correctamente', severity: 'ok' },
    { label: 'Archivo sensible revisado por auditoría', severity: 'warn' },
    { label: 'Autenticación reforzada en terminal crítica', severity: 'ok' }
  ];
  const nextEvent = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
  liveSecurityEvents.unshift(nextEvent);
  liveSecurityEvents.splice(5);
  renderSecurityEvents();

  const auditEntry = accessAudit[Math.floor(Math.random() * accessAudit.length)];
  auditEntry.result = ['Bloqueado', 'Autorizado', 'Revisado'][Math.floor(Math.random() * 3)];
  auditEntry.time = `Hace ${Math.max(1, Math.floor(Math.random() * 8))} min`;
  renderAccessAudit();

  const randomRole = rolePermissions[Math.floor(Math.random() * rolePermissions.length)];
  const roleStatus = ['Permitido', 'Autorizado', 'Revisado'];
  randomRole.status = roleStatus[Math.floor(Math.random() * roleStatus.length)];
  renderRolePermissions();

  const randomHistory = accessHistory[Math.floor(Math.random() * accessHistory.length)];
  randomHistory.time = `${String(Math.floor(Math.random() * 9) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`;
  randomHistory.status = ['Permitido', 'Bloqueado'][Math.floor(Math.random() * 2)];
  renderAccessHistory();

  const randomAlert = socAlerts[Math.floor(Math.random() * socAlerts.length)];
  randomAlert.time = `Hace ${Math.floor(Math.random() * 12) + 1} min`;
  randomAlert.label = ['Acceso anómalo a archivos financieros', 'Riesgo elevado en segmento de operaciones', 'Política MFA aplicada a 18 sesiones', 'Escaneo lateral detectado'][Math.floor(Math.random() * 4)];
  randomAlert.severity = ['critical', 'warning', 'ok'][Math.floor(Math.random() * 3)];
  renderSocAlerts();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

document.querySelector('#exportButton').addEventListener('click', () => {
  downloadReport('diario');
});

document.querySelector('#reviewControls').addEventListener('click', () => {
  showToast('Revisión iniciada. Hay 3 recomendaciones pendientes.');
});

document.querySelector('#viewAlerts').addEventListener('click', () => {
  document.querySelector('#alerts').scrollIntoView({ behavior: 'smooth' });
  showToast('Mostrando las alertas prioritarias');
});

document.querySelector('#viewDefensePlan').addEventListener('click', () => {
  document.querySelector('#threatControl').scrollIntoView({ behavior: 'smooth' });
  showToast('Plan de defensa reforzado en revisión');
});

document.querySelector('#viewAuditLog').addEventListener('click', () => {
  document.querySelector('.security-policy-panel').scrollIntoView({ behavior: 'smooth' });
  showToast('Auditoría de seguridad abierta');
});

document.querySelectorAll('.filter-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    activeDepartmentFilter = chip.dataset.department;
    document.querySelectorAll('.filter-chip').forEach((button) => button.classList.toggle('active', button === chip));
    renderAccessHistory();
    showToast(`Filtro activo: ${activeDepartmentFilter}`);
  });
});

document.querySelector('#filterButton').addEventListener('click', (event) => {
  const statuses = ['all', 'critical', 'high', 'medium'];
  const current = statuses.indexOf(event.currentTarget.dataset.filter || 'all');
  const next = statuses[(current + 1) % statuses.length];
  event.currentTarget.dataset.filter = next;
  event.currentTarget.firstChild.textContent = ({ all: 'Todos', critical: 'Críticos', high: 'Altos', medium: 'Medios' })[next] + ' ';
  document.querySelectorAll('#incidentTable tr').forEach((row) => {
    row.hidden = next !== 'all' && row.dataset.status !== next;
  });
});

document.querySelectorAll('.row-action').forEach((button) => {
  button.addEventListener('click', () => {
    const incident = button.closest('tr').querySelector('.incident-id').textContent;
    showToast(`${incident}: detalle del incidente abierto`);
  });
});

document.querySelectorAll('[data-report]').forEach((button) => {
  button.addEventListener('click', () => downloadReport(button.dataset.report));
});
document.querySelector('#agentSelect').addEventListener('change', renderAgentActivity);
document.querySelectorAll('.agent-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    activeAgentView = tab.dataset.agentView;
    document.querySelectorAll('.agent-tab').forEach((button) => button.classList.toggle('active', button === tab));
    renderAgentActivity();
  });
});

document.addEventListener('click', (event) => {
  const denyButton = event.target.closest('.deny-access');
  if (denyButton) {
    const fileName = denyButton.dataset.file;
    const target = confidentialFiles.find((file) => file.name === fileName);
    if (!target) return;

    target.status = target.status === 'Restringido' ? 'Permitido' : 'Restringido';
    renderConfidentialFiles();
    showToast(`${fileName}: ${target.status === 'Restringido' ? 'acceso denegado' : 'acceso restaurado'}`);
    return;
  }

  const permissionButton = event.target.closest('.permission-toggle');
  if (permissionButton) {
    const role = rolePermissions.find((entry) => entry.role === permissionButton.dataset.role);
    if (!role) return;

    role.status = role.status === 'Permitido' ? 'Revisado' : 'Permitido';
    renderRolePermissions();
    showToast(`${role.role}: permiso actualizado`);
  }
});

renderAssistantAccess();
renderPatchBalance();
renderNetworkUsage();
renderAgentActivity();
renderThreatStudy();
renderConfidentialFiles();
renderRolePermissions();
renderAccessAudit();
renderSecurityEvents();
renderAccessHistory();
renderSocAlerts();
setInterval(updateLiveMetrics, 3500);