(() => {
  'use strict';

  const ASSISTANT_NAME = 'JARVIS';
  const VOICE_LANGUAGE = 'es-ES';
  const THEME_STORAGE_KEY = 'va-theme-scifi';
  const THEME_CLASS = 'va-theme-scifi';
  const root = document.documentElement;

  if (document.getElementById('va-assistant-root')) return;

  function normalize(value) {
    return String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[¿?¡!,.;:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function preferredTheme() {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) === 'on';
    } catch (error) {
      console.warn('No se pudo leer la preferencia del tema futurista.', error);
      return false;
    }
  }

  root.classList.toggle(THEME_CLASS, preferredTheme());

  const componentStyles = document.createElement('style');
  componentStyles.id = 'va-assistant-styles';
  componentStyles.textContent = `
    .va-assistant-root {
      --va-cyan: #62e8f4;
      --va-blue: #79baff;
      --va-violet: #c19bff;
      --va-ink: #edf5ff;
      --va-muted: #b7c8dc;
      position: fixed;
      z-index: 1100;
      inset: 0;
      color: var(--va-ink);
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
      pointer-events: none;
    }

    .va-assistant-root button,
    .va-assistant-root input {
      box-sizing: border-box;
      font: inherit;
    }

    .va-assistant-root button {
      cursor: pointer;
    }

    .va-assistant-root button:focus-visible,
    .va-assistant-root input:focus-visible {
      outline: 2px solid var(--va-cyan);
      outline-offset: 3px;
    }

    .va-statusbar {
      position: fixed;
      z-index: 3;
      top: 0;
      right: 0;
      left: 0;
      display: flex;
      min-height: 46px;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 18px;
      border-bottom: 1px solid rgba(98, 232, 244, .45);
      color: #eaf5ff;
      background: rgba(5, 10, 20, .92);
      box-shadow: 0 4px 24px rgba(0, 0, 0, .28), 0 1px 14px rgba(58, 181, 222, .13);
      font: 700 10px/1.3 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      letter-spacing: .09em;
      pointer-events: auto;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .va-assistant-root .va-statusbar[hidden] {
      display: none;
    }

    .va-status-title {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      min-width: 0;
    }

    .va-status-light {
      width: 8px;
      height: 8px;
      flex: 0 0 auto;
      border-radius: 50%;
      background: #53e3a8;
      box-shadow: 0 0 12px rgba(83, 227, 168, .8);
    }

    .va-status-meta {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      white-space: nowrap;
    }

    .va-clock {
      color: #cfdeee;
      font-variant-numeric: tabular-nums;
    }

    .va-alert-button {
      display: inline-flex;
      min-height: 30px;
      align-items: center;
      gap: 7px;
      padding: 4px 10px;
      border: 1px solid rgba(183, 200, 220, .36);
      border-radius: 999px;
      color: #f0f5ff;
      background: rgba(255, 255, 255, .06);
      font: inherit;
      letter-spacing: .04em;
    }

    .va-alert-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #53e3a8;
      box-shadow: 0 0 10px currentColor;
    }

    .va-alert-button[data-level="yellow"] .va-alert-dot {
      background: #ffcc70;
    }

    .va-alert-button[data-level="red"] .va-alert-dot {
      background: #ff7887;
    }

    .va-theme-toggle {
      position: fixed;
      z-index: 2;
      bottom: 28px;
      left: 20px;
      min-height: 42px;
      padding: 9px 14px;
      border: 1px solid rgba(98, 232, 244, .62);
      border-radius: 999px;
      color: #eafaff;
      background: linear-gradient(135deg, rgba(13, 35, 57, .96), rgba(38, 27, 67, .96));
      box-shadow: 0 0 18px rgba(98, 232, 244, .22), 0 8px 24px rgba(0, 0, 0, .32);
      font-size: 11px;
      font-weight: 750;
      pointer-events: auto;
      transition: transform .18s ease, box-shadow .18s ease;
    }

    .va-theme-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 22px rgba(98, 232, 244, .38), 0 8px 24px rgba(0, 0, 0, .32);
    }

    .va-start-card {
      position: fixed;
      z-index: 2;
      right: 22px;
      bottom: 94px;
      width: min(320px, calc(100vw - 28px));
      padding: 16px;
      border: 1px solid rgba(98, 232, 244, .5);
      border-radius: 18px 18px 5px 18px;
      color: var(--va-ink);
      background: linear-gradient(145deg, rgba(13, 28, 48, .97), rgba(24, 19, 48, .97));
      box-shadow: 0 0 22px rgba(98, 232, 244, .16), 0 18px 50px rgba(0, 0, 0, .42);
      pointer-events: auto;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      animation: va-card-in .28s ease both;
    }

    .va-start-title {
      display: block;
      margin: 0 0 5px;
      color: #fff;
      font-size: 14px;
      font-weight: 750;
    }

    .va-start-copy {
      display: block;
      margin-bottom: 13px;
      color: var(--va-muted);
      font-size: 12px;
      line-height: 1.5;
    }

    .va-start-actions {
      display: flex;
      gap: 8px;
    }

    .va-start-button,
    .va-skip-button {
      min-height: 36px;
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 750;
    }

    .va-start-button {
      border: 1px solid rgba(98, 232, 244, .75);
      color: #081522;
      background: linear-gradient(135deg, #72e8ef, #94c2ff);
    }

    .va-skip-button {
      border: 1px solid rgba(183, 200, 220, .4);
      color: #edf5ff;
      background: rgba(255, 255, 255, .07);
    }

    .va-launcher {
      position: fixed;
      z-index: 2;
      right: 22px;
      bottom: 20px;
      display: grid;
      width: 60px;
      height: 60px;
      place-items: center;
      border: 1px solid rgba(98, 232, 244, .9);
      border-radius: 50%;
      color: var(--va-cyan);
      background: linear-gradient(145deg, rgba(14, 40, 65, .98), rgba(27, 19, 54, .98));
      box-shadow: 0 0 15px rgba(98, 232, 244, .46), 0 0 35px rgba(121, 186, 255, .25), inset 0 0 16px rgba(98, 232, 244, .14);
      pointer-events: auto;
      animation: va-pulse 2.8s ease-in-out infinite;
      transition: transform .2s ease, box-shadow .2s ease;
    }

    .va-launcher:hover {
      transform: translateY(-2px) scale(1.04);
    }

    .va-launcher-icon {
      width: 29px;
      height: 29px;
      filter: drop-shadow(0 0 5px rgba(98, 232, 244, .7));
    }

    .va-panel {
      position: fixed;
      z-index: 2;
      right: 22px;
      bottom: 94px;
      display: flex;
      width: min(420px, calc(100vw - 28px));
      height: min(620px, calc(100dvh - 126px));
      min-height: 340px;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(98, 232, 244, .58);
      border-radius: 20px 20px 6px 20px;
      color: var(--va-ink);
      background:
        linear-gradient(rgba(57, 134, 180, .07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(57, 134, 180, .07) 1px, transparent 1px),
        linear-gradient(145deg, rgba(9, 20, 36, .985), rgba(18, 15, 38, .985));
      background-size: 24px 24px, 24px 24px, auto;
      box-shadow: 0 0 22px rgba(98, 232, 244, .2), 0 0 48px rgba(121, 186, 255, .18), 0 18px 60px rgba(0, 0, 0, .48);
      pointer-events: auto;
      transform-origin: bottom right;
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .va-panel[hidden],
    .va-start-card[hidden] {
      display: none;
    }

    .va-panel:not([hidden]) {
      animation: va-panel-in .24s cubic-bezier(.2, .8, .2, 1) both;
    }

    .va-chat-header {
      position: relative;
      display: flex;
      min-height: 68px;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-bottom: 1px solid rgba(98, 232, 244, .24);
      background: linear-gradient(100deg, rgba(25, 68, 96, .64), rgba(57, 38, 87, .5));
    }

    .va-chat-header::after {
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--va-cyan), var(--va-violet), transparent);
      content: "";
    }

    .va-mark {
      display: grid;
      width: 38px;
      height: 38px;
      flex: 0 0 auto;
      place-items: center;
      border: 1px solid rgba(98, 232, 244, .58);
      border-radius: 12px 12px 4px 12px;
      color: var(--va-cyan);
      background: rgba(98, 232, 244, .1);
      box-shadow: 0 0 14px rgba(98, 232, 244, .14);
    }

    .va-mark-icon {
      width: 23px;
      height: 23px;
    }

    .va-chat-heading {
      min-width: 0;
      flex: 1;
    }

    .va-assistant-name {
      display: block;
      overflow: hidden;
      color: #fff;
      font-size: 14px;
      font-weight: 750;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .va-online-status {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
      color: var(--va-muted);
      font-size: 10px;
    }

    .va-online-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #53e3a8;
      box-shadow: 0 0 8px rgba(83, 227, 168, .8);
    }

    .va-header-actions {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .va-voice-toggle,
    .va-close {
      display: grid;
      width: 34px;
      height: 34px;
      place-items: center;
      border: 1px solid rgba(183, 200, 220, .3);
      border-radius: 10px;
      color: #e6f3ff;
      background: rgba(255, 255, 255, .06);
      font-size: 16px;
      transition: border-color .18s ease, background .18s ease, color .18s ease;
    }

    .va-voice-toggle:hover,
    .va-close:hover {
      border-color: rgba(98, 232, 244, .7);
      color: var(--va-cyan);
      background: rgba(98, 232, 244, .1);
    }

    .va-voice-toggle:disabled {
      cursor: not-allowed;
      opacity: .55;
    }

    .va-chat-messages {
      display: flex;
      min-height: 0;
      flex: 1;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      padding: 16px 14px 12px;
      overscroll-behavior: contain;
      scrollbar-color: rgba(98, 232, 244, .45) transparent;
      scrollbar-width: thin;
    }

    .va-message {
      max-width: 90%;
      padding: 10px 12px;
      border: 1px solid rgba(121, 186, 255, .26);
      border-radius: 13px 13px 13px 4px;
      color: #eef6ff;
      background: rgba(22, 43, 66, .84);
      font-size: 12px;
      line-height: 1.55;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    .va-message-user {
      align-self: flex-end;
      border-color: rgba(193, 155, 255, .4);
      border-radius: 13px 13px 4px 13px;
      color: #f4edff;
      background: linear-gradient(135deg, rgba(74, 58, 119, .84), rgba(35, 59, 99, .88));
    }

    .va-typing {
      display: flex;
      width: fit-content;
      align-items: center;
      gap: 5px;
      padding: 10px 12px;
      border: 1px solid rgba(121, 186, 255, .26);
      border-radius: 13px 13px 13px 4px;
      background: rgba(22, 43, 66, .84);
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

    .va-quick-replies {
      display: flex;
      max-height: 86px;
      flex: 0 0 auto;
      flex-wrap: wrap;
      gap: 6px;
      overflow-y: auto;
      padding: 0 13px 10px;
      scrollbar-width: thin;
    }

    .va-quick-button {
      padding: 6px 9px;
      border: 1px solid rgba(98, 232, 244, .42);
      border-radius: 999px;
      color: #d3f6ff;
      background: rgba(39, 101, 128, .18);
      font-size: 10px;
      transition: transform .16s ease, border-color .16s ease, background .16s ease;
    }

    .va-quick-button:hover {
      transform: translateY(-1px);
      border-color: var(--va-cyan);
      background: rgba(98, 232, 244, .14);
    }

    .va-quick-button:disabled {
      cursor: wait;
      opacity: .55;
    }

    .va-mic-status {
      min-height: 18px;
      padding: 0 14px 6px;
      color: var(--va-muted);
      font-size: 10px;
    }

    .va-mic-status[data-listening="true"] {
      color: #ffb6bd;
      font-weight: 750;
    }

    .va-composer {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 11px;
      border-top: 1px solid rgba(98, 232, 244, .2);
      background: rgba(7, 15, 28, .76);
    }

    .va-chat-input {
      width: 100%;
      min-width: 0;
      height: 42px;
      padding: 0 11px;
      border: 1px solid rgba(183, 200, 220, .34);
      border-radius: 10px;
      color: #f1f7ff;
      background: rgba(14, 29, 47, .92);
      font-size: 12px;
    }

    .va-chat-input::placeholder {
      color: #bdcbe0;
    }

    .va-chat-input:focus {
      border-color: rgba(98, 232, 244, .75);
      box-shadow: 0 0 0 3px rgba(98, 232, 244, .12);
      outline: none;
    }

    .va-mic-button,
    .va-send-button {
      display: grid;
      width: 42px;
      height: 42px;
      flex: 0 0 auto;
      place-items: center;
      border-radius: 11px;
      transition: transform .16s ease, filter .16s ease, box-shadow .16s ease;
    }

    .va-mic-button {
      border: 1px solid rgba(193, 155, 255, .58);
      color: #e3d4ff;
      background: rgba(87, 60, 128, .44);
    }

    .va-mic-button[aria-pressed="true"] {
      border-color: #ff8797;
      color: #fff;
      background: rgba(155, 46, 67, .72);
      box-shadow: 0 0 16px rgba(255, 120, 135, .45);
      animation: va-mic-pulse 1.25s ease-in-out infinite;
    }

    .va-send-button {
      border: 1px solid rgba(98, 232, 244, .8);
      color: #071522;
      background: linear-gradient(135deg, #75e7ed, #a3c6ff);
      box-shadow: 0 0 12px rgba(98, 232, 244, .2);
    }

    .va-mic-button:hover,
    .va-send-button:hover {
      transform: translateY(-1px);
      filter: brightness(1.12);
    }

    .va-mic-button:disabled,
    .va-send-button:disabled,
    .va-chat-input:disabled {
      cursor: wait;
      opacity: .58;
    }

    .va-control-icon {
      width: 18px;
      height: 18px;
    }

    @keyframes va-pulse {
      0%, 100% { box-shadow: 0 0 15px rgba(98, 232, 244, .42), 0 0 32px rgba(121, 186, 255, .22), inset 0 0 16px rgba(98, 232, 244, .12); }
      50% { box-shadow: 0 0 20px rgba(98, 232, 244, .65), 0 0 38px rgba(193, 155, 255, .32), inset 0 0 18px rgba(98, 232, 244, .2); }
    }

    @keyframes va-panel-in {
      from { opacity: 0; transform: translateY(9px) scale(.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes va-card-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes va-typing {
      0%, 60%, 100% { opacity: .35; transform: translateY(0); }
      30% { opacity: 1; transform: translateY(-3px); }
    }

    @keyframes va-mic-pulse {
      50% { box-shadow: 0 0 20px rgba(255, 120, 135, .72); }
    }

    @media (max-width: 600px) {
      .va-statusbar {
        min-height: 48px;
        flex-wrap: wrap;
        gap: 4px 8px;
        padding: 7px 10px;
        font-size: 9px;
      }

      .va-status-meta {
        gap: 7px;
      }

      .va-alert-button {
        min-height: 27px;
        padding: 3px 8px;
      }

      .va-theme-toggle {
        bottom: 15px;
        left: 10px;
        min-height: 40px;
        padding: 8px 11px;
        font-size: 10px;
      }

      .va-launcher {
        right: 12px;
        bottom: 12px;
        width: 54px;
        height: 54px;
      }

      .va-start-card,
      .va-panel {
        right: 12px;
        width: calc(100vw - 24px);
      }

      .va-start-card {
        bottom: 78px;
      }

      .va-panel {
        bottom: 78px;
        height: min(72dvh, 620px);
        max-height: calc(100dvh - 96px);
        min-height: 300px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .va-launcher,
      .va-panel:not([hidden]),
      .va-start-card,
      .va-typing-dot,
      .va-mic-button[aria-pressed="true"] {
        animation: none;
      }

      .va-launcher,
      .va-launcher:hover,
      .va-theme-toggle:hover,
      .va-quick-button:hover,
      .va-mic-button:hover,
      .va-send-button:hover {
        transform: none;
        transition: none;
      }
    }
  `;
  document.head.appendChild(componentStyles);

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createButton(className, label, text) {
    const button = createElement('button', className, text);
    button.type = 'button';
    button.setAttribute('aria-label', label);
    return button;
  }

  function createSvg(className, viewBox, pathData) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add(className);
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.7');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    return svg;
  }

  const assistantRoot = createElement('div', 'va-assistant-root');
  assistantRoot.id = 'va-assistant-root';

  const statusBar = createElement('div', 'va-statusbar');
  statusBar.setAttribute('role', 'region');
  statusBar.setAttribute('aria-label', 'Estado del sistema de seguridad');
  statusBar.hidden = !root.classList.contains(THEME_CLASS);
  const systemTitle = createElement('span', 'va-status-title');
  const statusLight = createElement('span', 'va-status-light');
  statusLight.setAttribute('aria-hidden', 'true');
  systemTitle.append(statusLight, createElement('span', '', 'SISTEMA DE SEGURIDAD ACTIVO'));
  const statusMeta = createElement('div', 'va-status-meta');
  const clock = createElement('time', 'va-clock');
  clock.setAttribute('aria-label', 'Hora local');
  const alertButton = createButton('va-alert-button', 'Nivel de alerta: verde. Cambiar nivel', '');
  alertButton.setAttribute('data-level', 'green');
  alertButton.setAttribute('aria-live', 'polite');
  const alertDot = createElement('span', 'va-alert-dot');
  alertDot.setAttribute('aria-hidden', 'true');
  const alertLabel = createElement('span', '', 'ALERTA VERDE');
  alertButton.append(alertDot, alertLabel);
  statusMeta.append(clock, alertButton);
  statusBar.append(systemTitle, statusMeta);

  const themeToggle = createButton('va-theme-toggle', 'Activar modo de seguridad futurista', 'Modo original / Modo seguridad');
  themeToggle.setAttribute('aria-pressed', String(root.classList.contains(THEME_CLASS)));

  const startCard = createElement('section', 'va-start-card');
  startCard.setAttribute('role', 'region');
  startCard.setAttribute('aria-labelledby', 'va-start-title');
  const startTitle = createElement('strong', 'va-start-title', 'Iniciar sistema');
  startTitle.id = 'va-start-title';
  const startCopy = createElement('span', 'va-start-copy', `Activa el saludo de ${ASSISTANT_NAME} o continúa solo con mensajes de texto.`);
  const startActions = createElement('div', 'va-start-actions');
  const startButton = createButton('va-start-button', 'Iniciar sistema y escuchar el saludo', 'Iniciar sistema');
  const skipButton = createButton('va-skip-button', 'Omitir voz y mostrar la bienvenida en texto', 'Omitir');
  startActions.append(startButton, skipButton);
  startCard.append(startTitle, startCopy, startActions);

  const launcher = createButton('va-launcher', 'Abrir asistente virtual', '');
  launcher.setAttribute('aria-controls', 'va-chat-panel');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.appendChild(createSvg('va-launcher-icon', '0 0 24 24', 'M12 2.8 20 6v5.3c0 5-3.4 8.5-8 10.1-4.6-1.6-8-5.1-8-10.1V6l8-3.2Zm-3 9.2 2 2 4-4'));

  const panel = createElement('section', 'va-panel');
  panel.id = 'va-chat-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-labelledby', 'va-chat-title');
  const chatHeader = createElement('header', 'va-chat-header');
  const mark = createElement('div', 'va-mark');
  mark.setAttribute('aria-hidden', 'true');
  mark.appendChild(createSvg('va-mark-icon', '0 0 24 24', 'M12 2.8 20 6v5.3c0 5-3.4 8.5-8 10.1-4.6-1.6-8-5.1-8-10.1V6l8-3.2Zm-3 9.2 2 2 4-4'));
  const chatHeading = createElement('div', 'va-chat-heading');
  const assistantName = createElement('span', 'va-assistant-name', ASSISTANT_NAME);
  assistantName.id = 'va-chat-title';
  const onlineStatus = createElement('span', 'va-online-status');
  const onlineDot = createElement('span', 'va-online-dot');
  onlineDot.setAttribute('aria-hidden', 'true');
  onlineStatus.append(onlineDot, createElement('span', '', 'En línea'));
  chatHeading.append(assistantName, onlineStatus);
  const headerActions = createElement('div', 'va-header-actions');
  const voiceToggle = createButton('va-voice-toggle', 'Silenciar voz', '◖');
  voiceToggle.setAttribute('aria-pressed', 'false');
  const closeButton = createButton('va-close', 'Cerrar asistente virtual', '×');
  headerActions.append(voiceToggle, closeButton);
  chatHeader.append(mark, chatHeading, headerActions);

  const messages = createElement('div', 'va-chat-messages');
  messages.setAttribute('role', 'log');
  messages.setAttribute('aria-live', 'polite');
  messages.setAttribute('aria-relevant', 'additions');
  messages.setAttribute('aria-label', `Conversación con ${ASSISTANT_NAME}`);
  const initialMessage = createElement('div', 'va-message', `Sistema disponible. Pulsa “Iniciar sistema” para activar el saludo de ${ASSISTANT_NAME}.`);
  messages.appendChild(initialMessage);

  const typing = createElement('div', 'va-typing');
  typing.hidden = true;
  typing.setAttribute('role', 'status');
  typing.setAttribute('aria-label', `${ASSISTANT_NAME} está escribiendo`);
  for (let index = 0; index < 3; index += 1) {
    const dot = createElement('span', 'va-typing-dot');
    dot.setAttribute('aria-hidden', 'true');
    typing.appendChild(dot);
  }
  messages.appendChild(typing);

  const quickReplies = createElement('div', 'va-quick-replies');
  quickReplies.setAttribute('role', 'group');
  quickReplies.setAttribute('aria-label', 'Comandos rápidos');
  const quickCommands = [
    { label: 'Ayuda', command: 'ayuda' },
    { label: 'Modo seguridad', command: 'modo seguridad' },
    { label: 'Modo original', command: 'modo original' },
    { label: 'Alerta verde', command: 'alerta verde' },
    { label: 'Alerta amarilla', command: 'alerta amarilla' },
    { label: 'Alerta roja', command: 'alerta roja' },
    { label: 'Subir', command: 'subir' },
    { label: 'Bajar', command: 'bajar' },
    { label: 'Leer esta sección', command: 'leer esta sección' },
    { label: 'Reportar incidente', command: 'reportar incidente' },
    { label: 'Abrir asistente', command: 'abrir asistente' },
    { label: 'Cerrar asistente', command: 'cerrar asistente' },
    { label: 'Silencio', command: 'silencio' },
    { label: 'Activar voz', command: 'activar voz' }
  ];

  quickCommands.forEach(({ label, command }) => {
    const quickButton = createButton('va-quick-button', `Ejecutar comando: ${label}`, label);
    quickButton.addEventListener('click', () => handleMessage(command));
    quickReplies.appendChild(quickButton);
  });

  const microphoneStatus = createElement('div', 'va-mic-status', '');
  microphoneStatus.setAttribute('role', 'status');
  microphoneStatus.setAttribute('aria-live', 'polite');

  const composer = createElement('form', 'va-composer');
  const input = createElement('input', 'va-chat-input');
  input.type = 'text';
  input.autocomplete = 'off';
  input.placeholder = 'Escribe un comando…';
  input.setAttribute('aria-label', 'Escribe un comando para el asistente');
  const microphoneButton = createButton('va-mic-button', 'Iniciar reconocimiento de voz', '');
  microphoneButton.setAttribute('aria-pressed', 'false');
  microphoneButton.appendChild(createSvg('va-control-icon', '0 0 24 24', 'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm-6-3a6 6 0 0 0 12 0m-6 6v3m-4 0h8'));
  const sendButton = createButton('va-send-button', 'Enviar comando', '');
  sendButton.type = 'submit';
  sendButton.appendChild(createSvg('va-control-icon', '0 0 24 24', 'M4 12 20 4l-5 16-3-7-8-1Zm8 1 4-4'));
  composer.append(input, microphoneButton, sendButton);

  panel.append(chatHeader, messages, quickReplies, microphoneStatus, composer);
  assistantRoot.append(statusBar, themeToggle, startCard, launcher, panel);
  document.body.appendChild(assistantRoot);

  let muted = false;
  let isWaiting = false;
  let isListening = false;
  let previousFocus = null;
  let currentAlertLevel = 'green';
  let recognition = null;

  const alertLevelLabels = {
    green: 'verde',
    yellow: 'amarilla',
    red: 'roja'
  };

  function updateClock() {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(now);
  }

  function updateThemeToggle() {
    const themeEnabled = root.classList.contains(THEME_CLASS);
    themeToggle.textContent = 'Modo original / Modo seguridad';
    themeToggle.setAttribute('aria-label', themeEnabled ? 'Activar modo original' : 'Activar modo de seguridad futurista');
    themeToggle.setAttribute('aria-pressed', String(themeEnabled));
    statusBar.hidden = !themeEnabled;
  }

  function setTheme(enabled) {
    root.classList.toggle(THEME_CLASS, enabled);
    updateThemeToggle();
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, enabled ? 'on' : 'off');
    } catch (error) {
      console.warn('No se pudo guardar la preferencia del tema futurista.', error);
    }
  }

  function setAlertLevel(level) {
    if (!Object.prototype.hasOwnProperty.call(alertLevelLabels, level)) return;
    currentAlertLevel = level;
    const label = alertLevelLabels[level];
    alertButton.dataset.level = level;
    alertLabel.textContent = `ALERTA ${label.toLocaleUpperCase('es-ES')}`;
    alertButton.setAttribute('aria-label', `Nivel de alerta: ${label}. Cambiar nivel`);
  }

  function setMuted(value) {
    muted = value;
    voiceToggle.textContent = muted ? '◖̸' : '◖';
    voiceToggle.setAttribute('aria-label', muted ? 'Activar voz' : 'Silenciar voz');
    voiceToggle.setAttribute('aria-pressed', String(muted));
    if (muted && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  function addMessage(text, type) {
    const message = createElement('div', type === 'user' ? 'va-message va-message-user' : 'va-message', text);
    messages.insertBefore(message, typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function setWaiting(waiting) {
    isWaiting = waiting;
    input.disabled = waiting;
    sendButton.disabled = waiting;
    microphoneButton.disabled = waiting || !recognition;
    quickReplies.querySelectorAll('.va-quick-button').forEach((button) => {
      button.disabled = waiting;
    });
    typing.hidden = !waiting;
    messages.scrollTop = messages.scrollHeight;
  }

  function setListening(listening, statusText) {
    isListening = listening;
    microphoneButton.setAttribute('aria-pressed', String(listening));
    microphoneButton.setAttribute('aria-label', listening ? 'Detener reconocimiento de voz' : 'Iniciar reconocimiento de voz');
    microphoneStatus.textContent = statusText || (listening ? 'Escuchando…' : '');
    microphoneStatus.dataset.listening = String(listening);
    microphoneButton.disabled = !recognition || isWaiting;
  }

  function selectedSpanishVoice() {
    const voices = window.speechSynthesis.getVoices();
    const preferences = ['es-CO', 'es-MX', 'es-ES'];
    for (const language of preferences) {
      const voice = voices.find((candidate) => candidate.lang.toLowerCase() === language.toLowerCase());
      if (voice) return voice;
    }
    return voices.find((candidate) => candidate.lang.toLowerCase().startsWith('es')) || null;
  }

  function speak(text) {
    if (muted || !text || !('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') return false;
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = VOICE_LANGUAGE;
    const voice = selectedSpanishVoice();
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return true;
  }

  function greetingForTime() {
    const hour = new Date().getHours();
    const greeting = hour >= 5 && hour < 12 ? 'Buenos días' : hour >= 12 && hour < 19 ? 'Buenas tardes' : 'Buenas noches';
    return `${greeting}. Sistema de seguridad en línea. ¿En qué puedo ayudarle?`;
  }

  function showWelcome(shouldSpeak) {
    const greeting = greetingForTime();
    startCard.hidden = true;
    if (panel.hidden) openPanel();
    addMessage(greeting, 'assistant');
    if (shouldSpeak) {
      if (!speak(greeting)) addMessage('La voz de salida no está disponible en este navegador; puedes continuar por texto.', 'assistant');
    }
  }

  function openPanel() {
    if (!panel.hidden) return;
    previousFocus = startCard.contains(document.activeElement) ? launcher : document.activeElement;
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'Cerrar asistente virtual');
    messages.scrollTop = messages.scrollHeight;
    input.focus();
  }

  function closePanel() {
    if (panel.hidden) return;
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Abrir asistente virtual');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    else launcher.focus();
  }

  function sectionCandidates() {
    const candidates = [];
    const seen = new Map();
    const addCandidate = (label, target) => {
      const normalized = normalize(label);
      if (!normalized || !target) return;
      if (!seen.has(normalized)) seen.set(normalized, new Set());
      const targets = seen.get(normalized);
      if (targets.has(target)) return;
      targets.add(target);
      candidates.push({ label: String(label).trim(), normalized, target });
    };

    document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
      const target = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
      if (target) addCandidate(link.textContent, target);
    });

    document.querySelectorAll('h1, h2, h3').forEach((heading) => {
      const label = heading.textContent.trim();
      const target = heading.closest('section[id], article[id], main[id]') || heading.closest('section, article') || heading;
      addCandidate(label, target);
    });

    document.querySelectorAll('section[id]').forEach((section) => {
      const heading = section.querySelector('h1, h2, h3');
      const label = heading ? heading.textContent : section.id.replace(/[-_]/g, ' ');
      addCandidate(label, section);
      addCandidate(section.id.replace(/[-_]/g, ' '), section);
    });

    return candidates;
  }

  function scrollToTarget(target) {
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function scrollByViewport(direction) {
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollBy({
      top: direction * Math.max(window.innerHeight * 0.8, 320),
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  }

  function goToSection(name) {
    const query = normalize(name);
    const matches = sectionCandidates().filter(({ normalized }) => normalized.includes(query) || query.includes(normalized));
    matches.sort((left, right) => {
      if (left.normalized === query) return -1;
      if (right.normalized === query) return 1;
      return Math.abs(left.normalized.length - query.length) - Math.abs(right.normalized.length - query.length);
    });
    const match = matches[0];
    if (!match) return null;
    scrollToTarget(match.target);
    return match.label;
  }

  function currentSection() {
    const sections = Array.from(document.querySelectorAll('main section, main article[id]'));
    const center = window.innerHeight * 0.4;
    const active = sections.find((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= center && bounds.bottom > center;
    }) || sections.find((section) => section.getBoundingClientRect().top >= 0);
    if (!active) return null;
    const heading = active.querySelector('h1, h2, h3');
    const text = active.innerText.trim();
    return {
      title: heading ? heading.textContent.trim() : 'esta sección',
      text: text || (heading ? heading.textContent.trim() : '')
    };
  }

  function reportTarget() {
    const form = Array.from(document.querySelectorAll('form'))
      .find((candidate) => !candidate.closest('#va-assistant-root'));
    if (form) return { target: form, focus: form.querySelector('input, select, textarea, button') };
    const contact = document.querySelector('a[href^="mailto:"], a[href^="tel:"]');
    if (contact) return { target: contact, focus: contact };
    const incident = sectionCandidates().find(({ normalized }) => normalized.includes('incidente'));
    return incident ? { target: incident.target, focus: null } : null;
  }

  function setReportTarget() {
    const destination = reportTarget();
    if (!destination) return 'No encontré un formulario, contacto ni sección de incidentes en esta página.';
    scrollToTarget(destination.target);
    if (destination.focus) window.setTimeout(() => destination.focus.focus(), 250);
    return destination.focus ? 'Te llevé al formulario o contacto disponible para reportar el incidente.' : 'No hay un formulario de reporte en la página; te llevé a la sección existente de incidentes.';
  }

  function stripWakeWord(value) {
    const normalized = normalize(value);
    const assistantName = normalize(ASSISTANT_NAME);
    const prefix = new RegExp(`^(?:oye\\s+)?${assistantName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b\\s*`);
    return normalized.replace(prefix, '').trim();
  }

  function helpText() {
    return 'Comandos: “ir a [sección]”, “subir”, “bajar”, “leer esta sección”, “modo seguridad”, “modo original”, “alerta verde/amarilla/roja”, “abrir asistente”, “cerrar asistente”, “silencio”, “activar voz” y “reportar incidente”.';
  }

  function executeCommand(command) {
    let match = command.match(/^ir a\s+(.+)$/);
    if (match) {
      const sectionName = goToSection(match[1]);
      return sectionName
        ? { reply: `Abriendo la sección “${sectionName}”.` }
        : { reply: `No encontré una sección que coincida con “${match[1]}”. Diga “ayuda” para ver los comandos.` };
    }

    if (/^(subir|desplazarse arriba|ir arriba)$/.test(command)) {
      scrollByViewport(-1);
      return { reply: 'Desplazándome hacia arriba.' };
    }

    if (/^(bajar|desplazarse abajo|ir abajo)$/.test(command)) {
      scrollByViewport(1);
      return { reply: 'Desplazándome hacia abajo.' };
    }

    if (/^(leer esta seccion|lee esta seccion)$/.test(command)) {
      const section = currentSection();
      if (!section || !section.text) return { reply: 'No pude identificar una sección visible para leer.' };
      return { reply: `Leyendo “${section.title}”.`, speech: section.text };
    }

    if (/^(modo seguridad|activar modo seguridad|seguridad futurista)$/.test(command)) {
      setTheme(true);
      return { reply: 'Modo de seguridad futurista activado.' };
    }

    if (/^(modo original|activar modo original|tema original)$/.test(command)) {
      setTheme(false);
      return { reply: 'Modo original activado.' };
    }

    match = command.match(/^(?:nivel de )?alerta\s+(verde|amarilla|amarillo|roja|rojo)$/);
    if (match) {
      const level = match[1].startsWith('ver') ? 'green' : match[1].startsWith('amar') ? 'yellow' : 'red';
      setAlertLevel(level);
      return { reply: `Nivel de alerta ${alertLevelLabels[level]}.` };
    }

    if (/^(abrir asistente|abre asistente)$/.test(command)) {
      openPanel();
      return { reply: `${ASSISTANT_NAME} está listo para ayudarte.` };
    }

    if (/^(cerrar asistente|cierra asistente)$/.test(command)) {
      return { reply: 'Cerrando el panel del asistente.', afterReply: closePanel };
    }

    if (/^(silencio|silenciar|silencia)$/.test(command)) {
      setMuted(true);
      return { reply: 'Voz silenciada. Puedes reactivarla con “activar voz” o desde el botón de voz.' };
    }

    if (/^(activar voz|activar sonido|quitar silencio)$/.test(command)) {
      setMuted(false);
      return { reply: 'Voz activada.' };
    }

    if (/^(ayuda|comandos|lista de comandos)$/.test(command)) {
      return { reply: helpText() };
    }

    if (/^(reportar incidente|reporta un incidente|reporte de incidente)$/.test(command)) {
      return { reply: setReportTarget() };
    }

    return null;
  }

  // Connect this function to a same-origin API endpoint when a real assistant backend is available; keep API keys on the server.
  function sendToBackend(message) {
    return Promise.resolve(`No reconocí el comando “${message}”. Diga “ayuda” para ver los comandos disponibles.`);
  }

  async function handleMessage(rawMessage) {
    const message = String(rawMessage || '').trim();
    if (!message || isWaiting) return;

    addMessage(message, 'user');
    input.value = '';
    setWaiting(true);

    try {
      const command = stripWakeWord(message);
      const result = executeCommand(command);
      const reply = result ? result.reply : await sendToBackend(message);
      await new Promise((resolve) => window.setTimeout(resolve, 320));
      addMessage(reply, 'assistant');
      const spokenText = result && result.speech ? result.speech : reply;
      if (spokenText && !muted) speak(spokenText);
      if (result && result.afterReply) result.afterReply();
    } catch (error) {
      console.error('No se pudo procesar el comando del asistente virtual.', error);
      addMessage('No se pudo procesar el comando. Inténtalo de nuevo.', 'assistant');
    } finally {
      setWaiting(false);
      if (!panel.hidden) input.focus();
    }
  }

  function updateQuickSectionCommands() {
    sectionCandidates().forEach(({ label }) => {
      const command = `ir a ${label}`;
      const duplicate = Array.from(quickReplies.querySelectorAll('.va-quick-button'))
        .some((button) => normalize(button.textContent) === normalize(`Ir a ${label}`));
      if (duplicate) return;
      const quickButton = createButton('va-quick-button', `Ir a la sección: ${label}`, `Ir a ${label}`);
      quickButton.addEventListener('click', () => handleMessage(command));
      quickReplies.appendChild(quickButton);
    });
  }

  function initializeRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      microphoneButton.hidden = true;
      microphoneStatus.textContent = 'Reconocimiento de voz no disponible en este navegador; puedes escribir los comandos.';
      return;
    }

    try {
      recognition = new SpeechRecognition();
      recognition.lang = VOICE_LANGUAGE;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      microphoneButton.disabled = false;
      recognition.addEventListener('start', () => setListening(true, 'Escuchando…'));
      recognition.addEventListener('result', (event) => {
        const transcript = event.results[0][0].transcript;
        setListening(false, `Comando reconocido: “${transcript}”`);
        handleMessage(transcript);
      });
      recognition.addEventListener('error', (event) => {
        setListening(false, `No se pudo usar el micrófono (${event.error}). Puedes escribir el comando.`);
      });
      recognition.addEventListener('end', () => {
        if (isListening) setListening(false, 'Escucha finalizada.');
      });
    } catch (error) {
      console.error('No se pudo iniciar el reconocimiento de voz.', error);
      recognition = null;
      microphoneButton.hidden = true;
      microphoneStatus.textContent = 'No se pudo iniciar el reconocimiento de voz; puedes escribir los comandos.';
    }
  }

  function startListening() {
    if (!recognition || isWaiting) return;
    if (isListening) {
      recognition.stop();
      return;
    }
    microphoneStatus.textContent = 'Solicitando acceso al micrófono…';
    try {
      recognition.start();
    } catch (error) {
      setListening(false, 'No se pudo iniciar la escucha. Inténtalo de nuevo.');
      console.error('No se pudo activar el micrófono para el asistente.', error);
    }
  }

  updateClock();
  window.setInterval(updateClock, 1000);
  updateThemeToggle();
  updateQuickSectionCommands();
  initializeRecognition();

  if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
    voiceToggle.disabled = true;
    voiceToggle.setAttribute('aria-label', 'La voz de salida no está disponible en este navegador');
  }

  if ('speechSynthesis' in window) window.speechSynthesis.addEventListener('voiceschanged', selectedSpanishVoice);

  themeToggle.addEventListener('click', () => setTheme(!root.classList.contains(THEME_CLASS)));
  alertButton.addEventListener('click', () => {
    const levels = ['green', 'yellow', 'red'];
    setAlertLevel(levels[(levels.indexOf(currentAlertLevel) + 1) % levels.length]);
  });
  startButton.addEventListener('click', () => showWelcome(true));
  skipButton.addEventListener('click', () => showWelcome(false));
  launcher.addEventListener('click', () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });
  closeButton.addEventListener('click', closePanel);
  voiceToggle.addEventListener('click', () => setMuted(!muted));
  microphoneButton.addEventListener('click', startListening);
  composer.addEventListener('submit', (event) => {
    event.preventDefault();
    handleMessage(input.value);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) closePanel();
  });
})();
