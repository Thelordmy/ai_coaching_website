// Simple client-side chat UI with a mock bot response.
(function () {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatWindow = document.getElementById('chatWindow');
  const PENDING_WORKOUTS_KEY = 'coachia_pending_workouts';
  let isSending = false;
  let lastSentAt = 0;

  // Restore history from localStorage
  const STORAGE_KEY = 'coachia_chat_history_v1';
  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const items = JSON.parse(raw);
      items.forEach(m => {
        // Check if message is a workout JSON
        if (m.sender === 'bot' && typeof m.text === 'string' && m.text.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(m.text);
            if (parsed.type === 'workout') {
              renderWorkout(parsed);
              return;
            }
          } catch (e) {
            // Not valid JSON, fall through to regular message
          }
        }
        // Auto-flag saved workout messages that contain our save button markup
        const hasHtmlFlag = m.hasHTML || (typeof m.text === 'string' && m.text.includes('save-button-wrap'));
        appendMessage(m.sender, m.text, false, hasHtmlFlag);
      });
      scrollToBottom();
    } catch (e) {
      console.warn('Failed to load chat history', e);
    }
  }

  function saveMessage(sender, text, hasHTML = false) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ sender, text, t: Date.now(), hasHTML });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(-200)));
      } catch (e) {
        // Handle quota exceeded by trimming more aggressively
        if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(-50)));
          } catch (_) {
            console.warn('Storage is full; unable to persist more messages');
          }
        } else {
          console.warn('Failed to save chat message', e);
        }
      }
    } catch (e) {
      console.warn('Failed to access chat storage', e);
    }
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdown(text) {
    // Convert markdown-style formatting to HTML
    // First, escape any raw HTML to prevent injection
    let safe = escapeHtml(text || '');
    let html = safe
      // Bold: **text** -> <strong>text</strong>
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // New lines stay as new lines
      .split('\n')
      .map(line => {
        // If line starts with numbers (like "1. Exercise"), make it a list item
        if (/^\d+\./.test(line)) {
          return `<div style="margin-left: 16px; margin-top: 8px;">${line}</div>`;
        }
        // If line starts with -, make it a bullet point
        if (/^-/.test(line)) {
          return `<div style="margin-left: 16px; margin-top: 4px;">${line}</div>`;
        }
        // Regular lines with spacing
        return `<div style="margin-top: 8px;">${line}</div>`;
      })
      .join('');
    return html;
  }

  function getPendingWorkouts() {
    try {
      return JSON.parse(localStorage.getItem(PENDING_WORKOUTS_KEY) || '[]');
    } catch (e) {
      console.error('Failed to parse pending workouts', e);
      return [];
    }
  }

  function setPendingWorkouts(list) {
    try {
      localStorage.setItem(PENDING_WORKOUTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to write pending workouts', e);
    }
  }

  function stripIntroMetadata(content) {
    if (!content) return '';
    const skipPatterns = [
      /^nom du programme/i,
      /^programme\s*:\s*/i,
      /^objectifs?/i,
      /^niveau/i,
      /^disponibilit[é|e]/i,
      /^âge/i,
      /^age/i,
      /^poids/i,
      /^taille/i,
      /^\s*sexe/i,
      /^equipement/i,
      /^équipement/i
    ];
    return content
      .split(/\n+/)
      .filter(line => !skipPatterns.some(rx => rx.test(line.trim())))
      .join('\n')
      .trim();
  }

  function appendMessage(sender, text, save = true, hasHTML = false) {
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
    
    // Use formatted HTML for bot messages (to render markdown), plain text for user
    if (sender === 'bot') {
      // Render raw HTML when flagged (built by us), otherwise apply markdown formatting
      body.innerHTML = hasHTML ? text : formatMarkdown(text);
    } else {
      body.textContent = text;
    }
    
    el.appendChild(body);
    chatWindow.appendChild(el);
    if (save) saveMessage(sender, text, hasHTML);
    scrollToBottom();
  }

  // Render a workout card in the chat (matching the generator preview with images + muscle/difficulty)
  function renderWorkout(workout) {
    const el = document.createElement('div');
    el.className = 'message bot';

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = 'Coach IA';
    el.appendChild(meta);

    const body = document.createElement('div');
    body.className = 'body';

    const workoutPreview = document.createElement('div');
    workoutPreview.style.cssText = 'background: white; border-radius: 14px; padding: 24px; margin-top: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.08); border: 1px solid #f1f5f9;';

    // Title
    const title = document.createElement('h3');
    title.textContent = workout.title || 'Programme Débutant';
    title.style.cssText = 'color: #111827; font-size: 1.6rem; font-weight: 800; margin: 0 0 12px 0; letter-spacing: -0.3px;';
    workoutPreview.appendChild(title);

    // Description/notes
    if (workout.notes) {
      const description = document.createElement('p');
      description.textContent = workout.notes;
      description.style.cssText = 'color: #4b5563; font-size: 1rem; line-height: 1.6; margin: 0 0 22px 0;';
      workoutPreview.appendChild(description);
    }

    // Label for exercises
    if (workout.exercises && workout.exercises.length > 0) {
      const label = document.createElement('div');
      label.textContent = 'Aperçu des exercices';
      label.style.cssText = 'font-weight: 700; color: #111827; margin: 0 0 12px 0; font-size: 1.05rem;';
      workoutPreview.appendChild(label);
    }

    // Exercise list with muscle/difficulty when available
    // Simple synonym mapper to match French names to DB entries
    function mapToDbName(name) {
      const n = (name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const synonyms = {
        'squat': 'Squats',
        'developpe couche': 'Bench Press',
        'poussee de banc': 'Bench Press',
        'press a la hallebarde': 'Shoulder Press',
        'abdominaux': 'Crunches',
        'pompes': 'Push-ups',
        'tractions': 'Pull-ups',
        'fentes': 'Lunges',
        'planche': 'Plank'
      };
      for (const key in synonyms) {
        if (n.includes(key)) return synonyms[key];
      }
      return null;
    }

    const PLACEHOLDER = 'assets/images/exercise-placeholder.svg';
    (workout.exercises || []).forEach(ex => {
      let exData = typeof getExerciseData === 'function' ? getExerciseData(ex.name || ex) : null;
      if (!exData && typeof getExerciseData === 'function') {
        const mapped = mapToDbName(ex.name || ex);
        if (mapped) exData = getExerciseData(mapped);
      }
      const imgSrc = (ex.image && ex.image !== PLACEHOLDER)
        ? ex.image
        : (exData?.image || PLACEHOLDER);
      const muscle = exData?.muscle || '';
      const difficulty = exData?.difficulty || '';

      const exerciseItem = document.createElement('div');
      exerciseItem.style.cssText = 'display: flex; align-items: center; gap: 14px; padding: 14px; border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 12px; background: #f8fafc;';

      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = ex.name || exData?.name || '';
      img.style.cssText = 'width: 110px; height: 88px; border-radius: 10px; object-fit: cover; flex-shrink: 0; background: #e5e7eb;';
      img.onerror = function() { this.src = 'assets/images/exercise-placeholder.svg'; };

      const info = document.createElement('div');
      info.style.cssText = 'flex: 1;';

      const name = document.createElement('div');
      name.textContent = ex.name || exData?.name || '';
      name.style.cssText = 'color: #111827; font-size: 1.05rem; font-weight: 700; margin-bottom: 4px;';

      const reps = document.createElement('div');
      reps.textContent = ex.reps || '';
      reps.style.cssText = 'color: #374151; font-size: 0.95rem; margin-bottom: 3px;';

      const metaLine = document.createElement('div');
      metaLine.style.cssText = 'color: #6b7280; font-size: 0.9rem;';
      metaLine.textContent = [muscle ? `Muscle: ${muscle}` : '', difficulty ? `Difficulté: ${difficulty}` : ''].filter(Boolean).join('  ·  ');

      info.appendChild(name);
      info.appendChild(reps);
      if (metaLine.textContent) info.appendChild(metaLine);

      exerciseItem.appendChild(img);
      exerciseItem.appendChild(info);
      workoutPreview.appendChild(exerciseItem);
    });

    // Save button (full width, purple)
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Sauvegarder le programme';
    saveBtn.style.cssText = 'width: 100%; padding: 16px 20px; background: linear-gradient(135deg, #7C3AED 0%, #7b3af5 100%); color: white; border: none; border-radius: 10px; font-size: 1.05rem; font-weight: 700; cursor: pointer; margin-top: 16px; transition: all 200ms ease; box-shadow: 0 8px 20px rgba(124,58,237,0.25);';
    saveBtn.addEventListener('click', () => saveWorkoutFromRender(workout));
    saveBtn.addEventListener('mouseenter', () => {
      saveBtn.style.transform = 'translateY(-1px)';
      saveBtn.style.boxShadow = '0 10px 24px rgba(124,58,237,0.32)';
    });
    saveBtn.addEventListener('mouseleave', () => {
      saveBtn.style.transform = 'translateY(0)';
      saveBtn.style.boxShadow = '0 8px 20px rgba(124,58,237,0.25)';
    });
    workoutPreview.appendChild(saveBtn);

    body.appendChild(workoutPreview);
    el.appendChild(body);
    chatWindow.appendChild(el);
    scrollToBottom();
  }

  // Save a workout generated from chat
  function saveWorkoutFromRender(workout) {
    try {
      const KEY = 'coachia_saved_workouts_v1';
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      
      // Add id and timestamp if not present
      const workoutToSave = Object.assign({}, workout, {
        id: workout.id || Date.now(),
        savedAt: Date.now(),
        date: new Date().toISOString()
      });
      
      arr.push(workoutToSave);
      localStorage.setItem(KEY, JSON.stringify(arr));
      
      alert('Programme sauvegardé ✓');
    } catch (e) {
      console.error('Erreur sauvegarde', e);
      alert('Impossible de sauvegarder le programme.');
    }
  }

    // Save handler for workout chip in chat
    window.saveWorkoutFromChat = function(workoutId) {
      const pending = getPendingWorkouts();
      const workout = pending.find(w => w.id === workoutId);
      if (!workout) {
        alert('Programme introuvable. Génère à nouveau et réessaie.');
        return;
      }
      workout.type = workout.type || 'ai-generated';
      if (workout.content) {
        workout.content = stripIntroMetadata(workout.content);
      }
      saveWorkout(workout);
      setPendingWorkouts(pending.filter(w => w.id !== workoutId));

      // Small UI feedback
      const btn = event?.target?.closest('.save-button') || event?.target;
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        const label = btn.parentElement?.parentElement?.querySelector('.save-button-label');
        if (label) label.textContent = 'Enregistré';
      }
      alert('Programme sauvegardé dans tes entraînements.');
    };

  function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Enhance workout responses with exercise images and save button
  function enhanceWorkoutResponse(text) {
    // Check if this looks like a workout plan (contains exercise names in bold or numbered lists)
    const hasExercises = /\*\*[^*]+\*\*|\d+\.\s+[A-Z]/i.test(text);
    if (!hasExercises) {
      return { content: text, hasHTML: false };
    }

    // Extract exercise names from bold text
    const exerciseMatches = text.match(/\*\*[^*]+\*\*/g) || [];
    const exercises = [];
    const availableExercises = typeof getAllExerciseNames === 'function' ? getAllExerciseNames() : [];
    
    exerciseMatches.forEach(match => {
      const name = match.replace(/\*\*/g, '').trim();
      // Try exact match first
      let exerciseData = typeof getExerciseData === 'function' ? getExerciseData(name) : null;
      
      // If no exact match, try fuzzy match
      if (!exerciseData && availableExercises.length > 0) {
        const fuzzyMatch = availableExercises.find(ex => 
          name.toLowerCase().includes(ex.toLowerCase()) || 
          ex.toLowerCase().includes(name.toLowerCase())
        );
        if (fuzzyMatch) {
          exerciseData = getExerciseData(fuzzyMatch);
        }
      }
      
      if (exerciseData && !exercises.includes(exerciseData.name)) {
        exercises.push(exerciseData.name);
      }
    });

    // If no exercises found, return plain text
    if (exercises.length === 0) {
      return { content: text, hasHTML: false };
    }

    // Create workout object and store in pending queue
    const profile = getUserProfile();
    const newWorkout = {
      id: Date.now(),
      name: 'Programme IA généré',
      date: new Date().toISOString(),
      content: stripIntroMetadata(text),
      type: 'ai-generated',
      exercises: exercises,
      duration: profile?.minutesPerDay || 60,
      intensity: 'medium',
      createdAt: new Date().toISOString()
    };

    // Store in pending workouts
    try {
      const pending = getPendingWorkouts();
      pending.push(newWorkout);
      setPendingWorkouts(pending);
    } catch (e) {
      console.error('Failed to store pending workout', e);
    }

    // Build exercise cards HTML
    const cards = exercises.map(exerciseName => {
      const exercise = getExerciseData(exerciseName);
      if (!exercise) return '';
      return `
        <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; display: flex; gap: 12px; align-items: center;">
          <img src="${exercise.image}" alt="${escapeHtml(exercise.name)}" style="width: 96px; height: 96px; border-radius: 10px; object-fit: cover; flex-shrink: 0;" onerror="this.src='assets/images/exercise-placeholder.svg';">
          <div>
            <strong>${escapeHtml(exercise.name)}</strong>
            <div style="font-size: 0.9rem; color: #6b7280;">Muscle: ${escapeHtml(exercise.muscle)}</div>
            <div style="font-size: 0.9rem; color: #6b7280;">Difficulté: ${escapeHtml(exercise.difficulty)}</div>
          </div>
        </div>
      `;
    }).join('');

    const exerciseCardsHTML = exercises.length > 0 ? `
      <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
        <div style="font-weight: 700; color: #1f2937;">Aperçu des exercices</div>
        ${cards}
      </div>
    ` : '';

    // Add save button chip
    const saveButton = `
      <div class="save-button-wrap">
        <div class="circle-container">
          <button class="save-button" onclick="saveWorkoutFromChat(${newWorkout.id})" aria-label="Sauvegarder ce programme">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M7 4.5C7 3.95 7.45 3.5 8 3.5H16C16.55 3.5 17 3.95 17 4.5V19C17 19.66 16.28 20.07 15.72 19.73L12 17.48L8.28 19.73C7.72 20.07 7 19.66 7 19V4.5Z" fill="#7C3AED"/>
            </svg>
          </button>
        </div>
        <span class="save-button-label">Sauvegarder ce programme</span>
      </div>
    `;

    // Combine formatted plan text with exercise images and save button
    const formattedPlan = formatMarkdown(text);
    return { 
      content: `${formattedPlan}${exerciseCardsHTML}${saveButton}`, 
      hasHTML: true 
    };
  }

  // Scroll to bottom button functionality
  const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');
  
  function checkScrollPosition() {
    const isNearBottom = chatWindow.scrollHeight - chatWindow.scrollTop - chatWindow.clientHeight < 100;
    if (isNearBottom) {
      scrollToBottomBtn.style.display = 'none';
    } else {
      scrollToBottomBtn.style.display = 'flex';
    }
  }

  chatWindow.addEventListener('scroll', checkScrollPosition);
  
  scrollToBottomBtn.addEventListener('click', () => {
    chatWindow.scrollTo({
      top: chatWindow.scrollHeight,
      behavior: 'smooth'
    });
  });

  // Groq API configuration
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  // TODO: Move API key to environment variable or secure configuration
  const GROQ_API_KEY = 'YOUR_GROQ_API_KEY_HERE'; // Replace with your actual API key
  const MODEL = 'llama-3.1-8b-instant'; // Fast Groq model
  
  // Check if this is first-time user in chat
  const CHAT_HISTORY_KEY = 'coachia_chat_history_v1';
  const FIRST_TIME_CHAT_KEY = 'coachia_user_profiled';
  const PROFILING_STEP_KEY = 'coachia_profiling_step';
  
  function getProfilingStep() {
    const step = localStorage.getItem(PROFILING_STEP_KEY);
    return step ? parseInt(step) : 1;
  }
  
  function incrementProfilingStep() {
    const currentStep = getProfilingStep();
    localStorage.setItem(PROFILING_STEP_KEY, (currentStep + 1).toString());
  }
  
  // Skip forced profiling; we let the coach respond directly even with missing data
  function isFirstTimeUser() {
    return false;
  }
  
  const SYSTEM_PROMPT = `You are a specialized AI Fitness & Nutrition Coach integrated into a website.

YOUR DOMAIN (HARD CONSTRAINT):
You ONLY answer questions related to:
• Fitness training
• Exercise programming
• Nutrition
• Meal planning
• Body recomposition
• Muscle gain
• Fat loss
• Recovery, sleep, and lifestyle factors DIRECTLY tied to fitness

If a user asks about anything outside this domain:
• Briefly state that you only handle fitness & nutrition topics
• Politely redirect the conversation back to those areas
• Do NOT answer the unrelated question

WORKOUT GENERATION (CRITICAL):
When user asks to "generate", "create", or "make" a workout program using keywords like "génère", "programme", "créer", "faire", "entraînement", respond with ONLY a valid JSON object (no markdown, no code blocks, no other text):
{
  "type": "workout",
  "title": "Programme Débutant",
  "notes": "Ce programme est conçu pour les débutants qui veulent commencer à s'entraîner régulièrement.",
  "exercises": [
    {"name": "Squat", "reps": "3x8", "image": "assets/images/exercise-placeholder.svg"},
    {"name": "Push-Up", "reps": "3x10", "image": "assets/images/exercise-placeholder.svg"},
    {"name": "Plank", "reps": "3x30s", "image": "assets/images/exercise-placeholder.svg"}
  ]
}
IMPORTANT: Return ONLY the JSON. No text before or after. No markdown formatting. Just the raw JSON object.

PERSONALIZATION APPROACH (NO FORCED INTAKE):
• If profile data is available, use it.
• If data is missing, still provide a concise, ready-to-use plan; only ask 1-2 quick clarifying questions if they are truly critical to tailoring the answer.
• Avoid long questionnaires; do not block on missing info.
• If information is missing, be explicit that the plan is a generic starter and offer to refine it.

COACHING STYLE:
• Educator + Coach hybrid
• Clear, structured recommendations
• Brief explanations of reasoning when helpful
• Confident but adaptive to user constraints

NUTRITION RULES:
• You ARE allowed to create full meal plans if the user requests them
• Meal plans must respect:
  - User goals
  - Dietary preferences
  - Training frequency
  - Simplicity and sustainability
• Calories and macros can be estimated if appropriate, but adapt to user comfort level
• Do NOT include medical disclaimers

TRAINING RULES:
• Programs must align with:
  - User experience level
  - Available training days
  - Available equipment
• Prioritize progression, recovery, and adherence
• Avoid unnecessary complexity

INTERACTION FLOW:
1. If personalization is helpful, keep questions minimal and relevant (goal, days/week, equipment). Otherwise, give a best-effort plan directly.
2. Deliver structured, actionable guidance.
3. Offer optional follow-ups (adjustments, alternatives).

OUTPUT FORMAT:
When giving plans or advice, use:
• Clear headings
• Bullet points or numbered steps
• Simple, direct language
• No fluff, no unrelated commentary

You exist to help users train better, eat smarter, and reach their fitness goals — nothing else.`;

  const FIRST_TIME_SYSTEM_PROMPTS = {
    1: `RÉPONDS EXACTEMENT AVEC: Salut! Bienvenue chez CoachIA 💪 Quel est ton objectif principal? Perte de poids, prise de muscle, performance sportive, ou santé générale?`,
    2: `RÉPONDS EXACTEMENT AVEC: Super! Quel est ton niveau d'expérience? Débutant, intermédiaire, ou avancé?`,
    3: `RÉPONDS EXACTEMENT AVEC: Parfait! Combien de jours par semaine peux-tu t'entraîner?`,
    4: `RÉPONDS EXACTEMENT AVEC: Excellent! Y a-t-il autre chose que je devrais savoir? (blessures, allergies, préférences...)`,
    5: `RÉPONDS EXACTEMENT AVEC: Parfait! J'ai tout ce qu'il me faut. Prêt à commencer ton coaching personnalisé!`
  };

  async function getOllamaReply(userText) {
    try {
      let systemPrompt = SYSTEM_PROMPT;
      
      // Add user profile to coaching prompt
      const profile = getUserProfile();
      if (profile && Object.keys(profile).length > 0) {
        const profileContext = `
UTILISATEUR PROFILE:
- Age: ${profile.age}
- Sexe: ${profile.gender}
- Taille: ${profile.height}cm
- Poids: ${profile.weight}kg
- Objectif: ${profile.goal}
- Niveau: ${profile.level}
- Disponibilité: ${profile.daysPerWeek || profile.availability?.days} jours/semaine, ${profile.minutesPerDay || profile.availability?.minutes} minutes par séance

Utilise ces infos pour personnaliser tes conseils.`;
        systemPrompt = systemPrompt + profileContext;
      }
      
      // Use step-specific prompt if user is being profiled
      if (isFirstTimeUser()) {
        const step = getProfilingStep();
        systemPrompt = FIRST_TIME_SYSTEM_PROMPTS[step] || FIRST_TIME_SYSTEM_PROMPTS[5];
      }
      
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userText }
          ],
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      return `Désolé, impossible de se connecter au coach IA.\n\nErreur: ${error.message}\n\nVérifie:\n• Ta connexion internet\n• La clé API Groq dans chat.js\n• La console (F12) pour plus de détails`;
    }
  }

  // Input validation
  const MAX_MESSAGE_LENGTH = 2000;
  if (chatInput) {
    chatInput.maxLength = MAX_MESSAGE_LENGTH;
  }

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    if (text.length > MAX_MESSAGE_LENGTH) {
      alert(`Message trop long. Maximum ${MAX_MESSAGE_LENGTH} caractères.`);
      return;
    }
    const now = Date.now();
    if (isSending || (now - lastSentAt) < 1200) {
      return; // throttle rapid submissions
    }
    isSending = true;
    lastSentAt = now;
    chatInput.disabled = true;
    appendMessage('user', text, true);
    chatInput.value = '';

    // show a typing indicator
    const typing = document.createElement('div');
    typing.className = 'message bot';
    typing.innerHTML = '<div class="meta">Coach IA</div><div class="body">...</div>';
    chatWindow.appendChild(typing);
    scrollToBottom();

    // get response from AI
    let reply = await getOllamaReply(text);
    typing.remove();
    
    // Try to detect and parse workout JSON
    let workoutObj = null;
    try {
      const trimmedReply = reply.trim();
      
      // Try to extract JSON from response (might be wrapped in markdown code blocks)
      let jsonStr = trimmedReply;
      
      // Remove markdown code blocks if present
      if (trimmedReply.includes('```json')) {
        const match = trimmedReply.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (match) jsonStr = match[1];
      } else if (trimmedReply.includes('```')) {
        const match = trimmedReply.match(/```\s*(\{[\s\S]*?\})\s*```/);
        if (match) jsonStr = match[1];
      }
      
      // Check if it looks like JSON
      if (jsonStr.trim().startsWith('{')) {
        const parsed = JSON.parse(jsonStr.trim());
        if (parsed.type === 'workout') {
          workoutObj = parsed;
        }
      }
    } catch (e) {
      // Not JSON, will render as text
    }
    
    if (workoutObj) {
      // Render workout card and save workout JSON to chat history
      renderWorkout(workoutObj);
      saveMessage('bot', JSON.stringify(workoutObj), false); // Save JSON to history
    } else {
      // Check if reply contains a workout plan and enhance with exercise images
      const enhancedReply = enhanceWorkoutResponse(reply);
      appendMessage('bot', enhancedReply.content, true, enhancedReply.hasHTML);
    }
    
    // Increment profiling step if user is being profiled
    if (isFirstTimeUser()) {
      const step = getProfilingStep();
      if (step < 5) {
        incrementProfilingStep();
      }
    }
    
    // Mark user as profiled if they completed all steps
    if (isFirstTimeUser() && getProfilingStep() >= 5) {
      localStorage.setItem(FIRST_TIME_CHAT_KEY, 'true');
      localStorage.removeItem(PROFILING_STEP_KEY);
    }
    isSending = false;
    chatInput.disabled = false;
  });

  // Clear chat history function
  window.clearChatHistory = function() {
    if (confirm('Êtes-vous sûr? Cela supprimera tout l\'historique du chat.')) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(FIRST_TIME_CHAT_KEY);
        localStorage.removeItem(PROFILING_STEP_KEY);
      } catch (e) {
        // Silently fail if storage clear fails
      }
      chatWindow.innerHTML = '';
      alert('Historique effacé. La page va se recharger.');
      location.reload();
    }
  };

  // Test workout render function
  window.testWorkoutRender = function() {
    const testWorkout = {
      type: "workout",
      title: "Programme Débutant",
      notes: "Ce programme est conçu pour les débutants qui veulent commencer à s'entraîner régulièrement. Il se concentre sur les exercices de base et les mouvements fondamentaux.",
      exercises: [
        {name: "Squat", reps: "3x8", image: "assets/images/exercise-placeholder.svg"},
        {name: "Poussée de banc", reps: "3x10", image: "assets/images/exercise-placeholder.svg"},
        {name: "Press à la hallebarde", reps: "3x8", image: "assets/images/exercise-placeholder.svg"},
        {name: "Développé couché", reps: "3x10", image: "assets/images/exercise-placeholder.svg"},
        {name: "Abdominaux", reps: "3x15", image: "assets/images/exercise-placeholder.svg"}
      ]
    };
    renderWorkout(testWorkout);
    saveMessage('bot', JSON.stringify(testWorkout), false);
  };

  // init
  loadHistory();
  // focus input for quicker use
  chatInput && chatInput.focus();
})();
