// Simple client-side chat UI with a mock bot response.
(function () {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatWindow = document.getElementById('chatWindow');

  // Restore history from localStorage
  const STORAGE_KEY = 'coachia_chat_history_v1';
  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const items = JSON.parse(raw);
      items.forEach(m => appendMessage(m.sender, m.text, false));
      scrollToBottom();
    } catch (e) {
      console.warn('Failed to load chat history', e);
    }
  }

  function saveMessage(sender, text) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ sender, text, t: Date.now() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(-200)));
    } catch (e) {}
  }

  function appendMessage(sender, text, save = true) {
    const el = document.createElement('div');
    el.className = 'message ' + (sender === 'user' ? 'user' : 'bot');
    if (sender === 'bot') {
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = 'Coach IA';
      el.appendChild(meta);
    }
    const body = document.createElement('div');
    body.className = 'body';
    body.textContent = text;
    el.appendChild(body);
    chatWindow.appendChild(el);
    if (save) saveMessage(sender, text);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function mockBotReply(userText) {
    // simple deterministic mock replies; you can replace this with an API call
    const normalized = userText.trim().toLowerCase();
    if (!normalized) return "Je n'ai rien reçu — peux-tu reformuler ?";
    if (normalized.includes('bonjour') || normalized.includes('salut')) return 'Salut ! Comment puis-je t\'aider aujourd\'hui ?';
    if (normalized.includes('objectif') || normalized.includes('objectif atteint')) return 'Ton objectif semble bien avancé — garde le cap !';
    if (normalized.includes('programme') || normalized.includes('entraînement')) return 'Je peux te proposer des entraînements personnalisés — quel niveau souhaites-tu ?';
    if (normalized.includes('calorie') || normalized.includes('calories')) return 'Je ne suis pas un tracker ici, mais je peux estimer les besoins si tu me donnes ton poids et activité.';
    // fallback
    return 'Bonne question — voici une idée rapide : concentre-toi sur une progression régulière de 2 à 3% chaque semaine.';
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage('user', text, true);
    chatInput.value = '';

    // show a typing indicator
    const typing = document.createElement('div');
    typing.className = 'message bot';
    typing.textContent = '...';
    chatWindow.appendChild(typing);
    scrollToBottom();

    // mock response after delay
    setTimeout(() => {
      typing.remove();
      const reply = mockBotReply(text);
      appendMessage('bot', reply, true);
    }, 650 + Math.random() * 700);
  });

  // init
  loadHistory();
  // focus input for quicker use
  chatInput && chatInput.focus();
})();
