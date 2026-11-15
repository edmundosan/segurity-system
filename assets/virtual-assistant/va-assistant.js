(() => {
  'use strict';

  if (document.getElementById('va-styles')) return;

  const simulatedResponses = {
    'Reportar un incidente': 'Puedo ayudarte a iniciar el reporte. Comparte qué ocurrió, cuándo lo detectaste y qué equipo o servicio está afectado. Si hay una amenaza activa, contacta también al equipo de seguridad.',
    Servicios: 'El centro ofrece monitorización, respuesta a incidentes, protección de endpoints, gestión de vulnerabilidades y asesoría de seguridad.',
    Contacto: 'Puedes contactar al equipo de seguridad desde el canal de soporte de tu organización. Para incidentes urgentes, sigue el protocolo de escalamiento interno.',
    'Preguntas frecuentes': 'Puedo orientarte sobre alertas, acceso seguro, protección de dispositivos y respuesta a incidentes. ¿Sobre cuál tema quieres saber más?'
  };

  const styles = document.createElement('style');
  styles.id = 'va-styles';
  styles.textContent = `
    .va-widget {
      --va-cyan: #35e7f2;
      --va-blue: #398cff;
      --va-violet: #9c69ff;
      --va-ink: #e8f4ff;
      --va-muted: #9bb1c8;
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 1000;
      color: var(--va-ink);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    .va-launcher {
      display: grid;
      width: 62px;
      height: 62px;
      place-items: center;
      border: 1px solid rgba(53, 231, 242, .85);
      border-radius: 50%;
      color: var(--va-cyan);
      background: linear-gradient(145deg, rgba(20, 42, 69, .97), rgba(17, 18, 45, .97));
      box-shadow: 0 0 12px rgba(53, 231, 242, .45), 0 0 30px rgba(57, 140, 255, .28), inset 0 0 18px rgba(53, 231, 242, .12);
      cursor: pointer;
      animation: va-pulse 2.8s ease-in-out infinite;
      transition: transform .2s ease, box-shadow .2s ease;
    }

    .va-launcher:hover {
      transform: translateY(-3px) scale(1.04);
      box-shadow: 0 0 18px rgba(53, 231, 242, .65), 0 0 38px rgba(156, 105, 255, .38);
    }

    .va-launcher:focus-visible,
    .va-close:focus-visible,
    .va-send:focus-visible,
    .va-quick-button:focus-visible,
    .va-input:focus-visible {
      outline: 2px solid var(--va-cyan);
      outline-offset: 3px;
    }

    .va-launcher-icon {
      width: 30px;
      height: 30px;
      filter: drop-shadow(0 0 5px rgba(53, 231, 242, .75));
    }

    .va-panel {
      position: absolute;
      right: 0;
      bottom: 78px;
      display: flex;
      width: min(390px, calc(100vw - 32px));
      height: min(560px, calc(100dvh - 130px));
      min-height: 340px;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(67, 207, 240, .5);
      border-radius: 16px;
      background:
        linear-gradient(rgba(44, 104, 151, .08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(44, 104, 151, .08) 1px, transparent 1px),
        linear-gradient(145deg, rgba(13, 27, 46, .97), rgba(15, 17, 39, .97));
      background-size: 24px 24px, 24px 24px, auto;
      box-shadow: 0 0 18px rgba(53, 231, 242, .18), 0 0 48px rgba(57, 140, 255, .2), 0 18px 60px rgba(0, 0, 0, .48), inset 0 0 32px rgba(57, 140, 255, .06);
      -webkit-backdrop-filter: blur(18px);
      backdrop-filter: blur(18px);
      transform-origin: bottom right;
    }

    .va-panel[hidden] {
      display: none;
    }

    .va-panel:not([hidden]) {
      animation: va-open .24s cubic-bezier(.2, .8, .2, 1) both;
    }

    .va-header {
      position: relative;
      display: flex;
      min-height: 72px;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid rgba(74, 194, 232, .2);
      background: linear-gradient(100deg, rgba(22, 61, 93, .6), rgba(39, 31, 82, .42));
    }

    .va-header::after {
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--va-cyan), var(--va-violet), transparent);
      content: '';
    }

    .va-mark {
      display: grid;
      width: 38px;
      height: 38px;
      flex: 0 0 auto;
      place-items: center;
      border: 1px solid rgba(53, 231, 242, .55);
      border-radius: 11px;
      color: var(--va-cyan);
      background: rgba(53, 231, 242, .08);
      box-shadow: inset 0 0 14px rgba(53, 231, 242, .12), 0 0 14px rgba(53, 231, 242, .12);
    }

    .va-mark-icon {
      width: 23px;
      height: 23px;
    }

    .va-heading {
      min-width: 0;
      flex: 1;
    }

    .va-name {
      display: block;
      overflow: hidden;
      color: #f0f8ff;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: .02em;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .va-status {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 5px;
      color: var(--va-muted);
      font-size: 10px;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .va-online-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4af2bd;
      box-shadow: 0 0 8px rgba(74, 242, 189, .8);
    }

    .va-close {
      display: grid;
      width: 34px;
      height: 34px;
      flex: 0 0 auto;
      place-items: center;
      border: 1px solid rgba(155, 177, 200, .22);
      border-radius: 9px;
      color: #b8cce0;
      background: rgba(255, 255, 255, .04);
      cursor: pointer;
      font: inherit;
      font-size: 19px;
      transition: color .18s ease, border-color .18s ease, background .18s ease;
    }

    .va-close:hover {
      border-color: rgba(53, 231, 242, .55);
      color: var(--va-cyan);
      background: rgba(53, 231, 242, .08);
    }

    .va-scan {
      position: absolute;
      z-index: 1;
      top: 72px;
      right: 0;
      left: 0;
      height: 1px;
      pointer-events: none;
      background: linear-gradient(90deg, transparent, rgba(53, 231, 242, .46), transparent);
      animation: va-scan 6s linear infinite;
    }

    .va-messages {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 12px;
      overflow-y: auto;
      padding: 18px 15px 12px;
      overscroll-behavior: contain;
      scrollbar-color: rgba(53, 231, 242, .4) transparent;
      scrollbar-width: thin;
    }

    .va-message {
      max-width: 88%;
      padding: 11px 12px;
      border: 1px solid rgba(74, 137, 183, .24);
      border-radius: 12px 12px 12px 3px;
      color: #dcecff;
      background: rgba(20, 41, 65, .76);
      box-shadow: inset 0 0 18px rgba(57, 140, 255, .035);
      font-family: system-ui, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    .va-message-user {
      align-self: flex-end;
      border-color: rgba(125, 99, 231, .38);
      border-radius: 12px 12px 3px 12px;
      color: #f2edff;
      background: linear-gradient(135deg, rgba(68, 63, 133, .72), rgba(37, 56, 103, .78));
    }

    .va-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      padding: 0 15px 12px;
    }

    .va-quick-button {
      padding: 7px 10px;
      border: 1px solid rgba(69, 188, 224, .38);
      border-radius: 999px;
      color: #bcecf7;
      background: rgba(38, 107, 139, .16);
      cursor: pointer;
      font: inherit;
      font-size: 10px;
      transition: border-color .18s ease, background .18s ease, transform .18s ease;
    }

    .va-quick-button:hover {
      transform: translateY(-1px);
      border-color: var(--va-cyan);
      background: rgba(53, 231, 242, .12);
    }

    .va-typing {
      display: flex;
      width: fit-content;
      align-items: center;
      gap: 5px;
      padding: 11px 13px;
      border: 1px solid rgba(74, 137, 183, .24);
      border-radius: 12px 12px 12px 3px;
      background: rgba(20, 41, 65, .76);
    }

    .va-typing[hidden] {
      display: none;
    }

    .va-typing-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--va-cyan);
      animation: va-typing 1s ease-in-out infinite;
    }

    .va-typing-dot:nth-child(2) {
      animation-delay: .15s;
    }

    .va-typing-dot:nth-child(3) {
      animation-delay: .3s;
    }

    .va-composer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid rgba(74, 194, 232, .18);
      background: rgba(8, 17, 31, .62);
    }

    .va-input {
      width: 100%;
      min-width: 0;
      height: 42px;
      padding: 0 12px;
      border: 1px solid rgba(105, 147, 183, .28);
      border-radius: 9px;
      color: #eff8ff;
      background: rgba(13, 29, 48, .82);
      font: 13px system-ui, sans-serif;
      transition: border-color .18s ease, box-shadow .18s ease;
    }

    .va-input::placeholder {
      color: #829ab3;
    }

    .va-input:focus {
      border-color: rgba(53, 231, 242, .7);
      box-shadow: 0 0 0 3px rgba(53, 231, 242, .1);
      outline: none;
    }

    .va-send {
      display: grid;
      width: 42px;
      height: 42px;
      flex: 0 0 auto;
      place-items: center;
      border: 1px solid rgba(53, 231, 242, .7);
      border-radius: 9px;
      color: #071726;
      background: linear-gradient(135deg, var(--va-cyan), #6eb6ff);
      box-shadow: 0 0 14px rgba(53, 231, 242, .2);
      cursor: pointer;
      transition: transform .18s ease, filter .18s ease;
    }

    .va-send:hover {
      transform: translateY(-1px);
      filter: brightness(1.12);
    }

    .va-send:disabled,
    .va-input:disabled,
    .va-quick-button:disabled {
      cursor: wait;
      opacity: .6;
    }

    .va-send-icon {
      width: 17px;
      height: 17px;
    }

    @keyframes va-pulse {
      0%, 100% { box-shadow: 0 0 12px rgba(53, 231, 242, .4), 0 0 27px rgba(57, 140, 255, .22), inset 0 0 18px rgba(53, 231, 242, .12); }
      50% { box-shadow: 0 0 17px rgba(53, 231, 242, .62), 0 0 36px rgba(156, 105, 255, .3), inset 0 0 18px rgba(53, 231, 242, .2); }
    }

    @keyframes va-open {
      from { opacity: 0; transform: translateY(10px) scale(.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes va-scan {
      from { transform: translateY(0); opacity: 0; }
      15%, 85% { opacity: .8; }
      to { transform: translateY(470px); opacity: 0; }
    }

    @keyframes va-typing {
      0%, 60%, 100% { opacity: .35; transform: translateY(0); }
      30% { opacity: 1; transform: translateY(-3px); }
    }

    @media (max-width: 520px) {
      .va-widget {
        right: 12px;
        bottom: 12px;
      }

      .va-panel {
        right: 0;
        bottom: 72px;
        width: calc(100vw - 24px);
        height: min(72dvh, 560px);
        min-height: 300px;
      }

      .va-launcher {
        width: 56px;
        height: 56px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .va-launcher,
      .va-panel:not([hidden]),
      .va-scan,
      .va-typing-dot {
        animation: none;
      }

      .va-launcher,
      .va-launcher:hover,
      .va-quick-button:hover,
      .va-send:hover {
        transform: none;
      }
    }
  `;
  document.head.appendChild(styles);

  const widget = document.createElement('div');
  widget.className = 'va-widget';

  const launcher = document.createElement('button');
  launcher.className = 'va-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Abrir asistente virtual');
  launcher.setAttribute('aria-controls', 'va-panel');
  launcher.setAttribute('aria-expanded', 'false');

  const shieldIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  shieldIcon.classList.add('va-launcher-icon');
  shieldIcon.setAttribute('viewBox', '0 0 24 24');
  shieldIcon.setAttribute('fill', 'none');
  shieldIcon.setAttribute('aria-hidden', 'true');
  const shieldPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  shieldPath.setAttribute('d', 'M12 2.8 20 6v5.3c0 5-3.4 8.5-8 10.1-4.6-1.6-8-5.1-8-10.1V6l8-3.2Z');
  shieldPath.setAttribute('stroke', 'currentColor');
  shieldPath.setAttribute('stroke-width', '1.6');
  shieldPath.setAttribute('stroke-linejoin', 'round');
  const shieldCore = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  shieldCore.setAttribute('d', 'm9 12 2 2 4-4M12 6.8v1.4');
  shieldCore.setAttribute('stroke', 'currentColor');
  shieldCore.setAttribute('stroke-width', '1.6');
  shieldCore.setAttribute('stroke-linecap', 'round');
  shieldCore.setAttribute('stroke-linejoin', 'round');
  shieldIcon.append(shieldPath, shieldCore);
  launcher.appendChild(shieldIcon);

  const panel = document.createElement('section');
  panel.className = 'va-panel';
  panel.id = 'va-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-labelledby', 'va-title');

  const header = document.createElement('header');
  header.className = 'va-header';
  const mark = document.createElement('div');
  mark.className = 'va-mark';
  mark.setAttribute('aria-hidden', 'true');
  const markIcon = shieldIcon.cloneNode(true);
  markIcon.classList.remove('va-launcher-icon');
  markIcon.classList.add('va-mark-icon');
  mark.appendChild(markIcon);

  const heading = document.createElement('div');
  heading.className = 'va-heading';
  const title = document.createElement('span');
  title.className = 'va-name';
  title.id = 'va-title';
  title.textContent = 'Sentinel AI';
  const status = document.createElement('span');
  status.className = 'va-status';
  const onlineDot = document.createElement('span');
  onlineDot.className = 'va-online-dot';
  onlineDot.setAttribute('aria-hidden', 'true');
  const statusText = document.createElement('span');
  statusText.textContent = 'En línea';
  status.append(onlineDot, statusText);
  heading.append(title, status);

  const closeButton = document.createElement('button');
  closeButton.className = 'va-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Cerrar asistente virtual');
  closeButton.textContent = '×';
  header.append(mark, heading, closeButton);

  const scanLine = document.createElement('div');
  scanLine.className = 'va-scan';
  scanLine.setAttribute('aria-hidden', 'true');

  const messages = document.createElement('div');
  messages.className = 'va-messages';
  messages.setAttribute('role', 'log');
  messages.setAttribute('aria-live', 'polite');
  messages.setAttribute('aria-relevant', 'additions');
  messages.setAttribute('aria-label', 'Conversación con Sentinel AI');

  const welcome = document.createElement('div');
  welcome.className = 'va-message';
  welcome.textContent = 'Hola, soy Sentinel AI. Puedo orientarte sobre seguridad y ayudarte a encontrar el siguiente paso. ¿En qué puedo ayudarte?';
  messages.appendChild(welcome);

  const quickReplies = document.createElement('div');
  quickReplies.className = 'va-quick-replies';
  Object.keys(simulatedResponses).forEach((label) => {
    const quickButton = document.createElement('button');
    quickButton.className = 'va-quick-button';
    quickButton.type = 'button';
    quickButton.textContent = label;
    quickButton.addEventListener('click', () => handleSend(label));
    quickReplies.appendChild(quickButton);
  });

  const typing = document.createElement('div');
  typing.className = 'va-typing';
  typing.hidden = true;
  typing.setAttribute('aria-label', 'Sentinel AI está escribiendo');
  typing.setAttribute('role', 'status');
  for (let index = 0; index < 3; index += 1) {
    const dot = document.createElement('span');
    dot.className = 'va-typing-dot';
    dot.setAttribute('aria-hidden', 'true');
    typing.appendChild(dot);
  }
  messages.appendChild(typing);

  const composer = document.createElement('form');
  composer.className = 'va-composer';
  const input = document.createElement('input');
  input.className = 'va-input';
  input.type = 'text';
  input.autocomplete = 'off';
  input.placeholder = 'Escribe tu mensaje…';
  input.setAttribute('aria-label', 'Escribe un mensaje para el asistente');
  const sendButton = document.createElement('button');
  sendButton.className = 'va-send';
  sendButton.type = 'submit';
  sendButton.setAttribute('aria-label', 'Enviar mensaje');
  const sendIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sendIcon.classList.add('va-send-icon');
  sendIcon.setAttribute('viewBox', '0 0 24 24');
  sendIcon.setAttribute('fill', 'none');
  sendIcon.setAttribute('aria-hidden', 'true');
  const sendPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  sendPath.setAttribute('d', 'M4 12 20 4l-5 16-3-7-8-1Zm8 1 4-4');
  sendPath.setAttribute('stroke', 'currentColor');
  sendPath.setAttribute('stroke-width', '1.7');
  sendPath.setAttribute('stroke-linecap', 'round');
  sendPath.setAttribute('stroke-linejoin', 'round');
  sendIcon.appendChild(sendPath);
  sendButton.appendChild(sendIcon);
  composer.append(input, sendButton);
  panel.append(header, scanLine, messages, quickReplies, composer);
  widget.append(panel, launcher);
  document.body.appendChild(widget);

  let isWaiting = false;
  let previousFocus = null;

  function addMessage(text, isUser) {
    const message = document.createElement('div');
    message.className = isUser ? 'va-message va-message-user' : 'va-message';
    message.textContent = text;
    messages.insertBefore(message, typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function setWaiting(waiting) {
    isWaiting = waiting;
    input.disabled = waiting;
    sendButton.disabled = waiting;
    quickReplies.querySelectorAll('.va-quick-button').forEach((button) => {
      button.disabled = waiting;
    });
    typing.hidden = !waiting;
    messages.scrollTop = messages.scrollHeight;
  }

  // Replace this demo response with a call to your own server; never put API keys in the browser.
  function sendToBackend(message) {
    const reply = simulatedResponses[message] || 'Gracias por escribir. Para ayudarte mejor, indica si tu consulta es sobre un incidente, un servicio o acceso a soporte.';
    return new Promise((resolve) => {
      window.setTimeout(() => resolve(reply), 700);
    });
  }

  async function handleSend(text) {
    const message = text.trim();
    if (!message || isWaiting) return;

    addMessage(message, true);
    input.value = '';
    setWaiting(true);
    try {
      const reply = await sendToBackend(message);
      addMessage(reply, false);
    } catch (error) {
      console.error('No se pudo obtener una respuesta del asistente virtual.', error);
      addMessage('No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.', false);
    } finally {
      setWaiting(false);
      if (!panel.hidden) input.focus();
    }
  }

  function openPanel() {
    if (!panel.hidden) return;
    previousFocus = document.activeElement;
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'Cerrar asistente virtual');
    input.focus();
    messages.scrollTop = messages.scrollHeight;
  }

  function closePanel() {
    if (panel.hidden) return;
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Abrir asistente virtual');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    else launcher.focus();
  }

  launcher.addEventListener('click', () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });
  closeButton.addEventListener('click', closePanel);
  composer.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSend(input.value);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) closePanel();
  });
})();
