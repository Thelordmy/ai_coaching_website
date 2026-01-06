const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// TODO: Move API key to environment variable or secure configuration
const GROQ_API_KEY = 'const GROQ_API_KEY = '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';';
const MODEL = 'llama-3.1-8b-instant';
const PENDING_WORKOUTS_KEY = 'coachia_pending_workouts';

// Store generated workouts temporarily
let generatedWorkouts = [];

// Format AI workout content to HTML
function formatAIWorkout(content) {
  if (!content) return '';
  
  // Replace markdown bold with HTML
  let formatted = content
    // Headers (###)
    .replace(/###\s*(.+)/g, '<h4 style="color: #7C3AED; margin: 16px 0 8px 0; font-size: 1rem;">$1</h4>')
    // Bold text (**text**)
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color: #1f2937;">$1</strong>')
    // Bullet points
    .replace(/^-\s+(.+)/gm, '<div style="padding: 4px 0 4px 16px; position: relative;"><span style="position: absolute; left: 0; color: #7C3AED;">•</span>$1</div>')
    // Numbered lists
    .replace(/^\d+\.\s+(.+)/gm, '<div style="padding: 4px 0;">$1</div>')
    // Line breaks
    .replace(/\n\n/g, '<div style="height: 12px;"></div>')
    .replace(/\n/g, '<br>');
    
  return `<div style="line-height: 1.6; color: #4b5563;">${formatted}</div>`;
}

// Remove meta headers like "Nom du programme", "Objectifs", etc. to keep only the plan/body
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

function loadWorkouts() {
  const workouts = getWorkouts();
  const grid = document.getElementById('workoutGrid');
  const emptyState = document.getElementById('emptyState');
  const firstTimeWelcome = document.getElementById('firstTimeWelcome');

  if (!workouts || workouts.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    firstTimeWelcome.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';
  firstTimeWelcome.style.display = 'none';

  grid.innerHTML = workouts.map((workout, idx) => `
    <div class="workout-card" style="animation: fadeInUp 0.6s ease-out ${idx * 0.1}s backwards;">
      <div class="workout-card-header">
        <h3>${workout.name}</h3>
        <button class="btn-delete-workout" aria-label="Supprimer cet entraînement" onclick="handleDeleteWorkout(${workout.id || idx})">✕</button>
      </div>
      <span class="difficulty ${workout.intensity || 'medium'}">
        ${workout.intensity === 'low' ? 'Légère' : workout.intensity === 'medium' ? 'Modérée' : workout.intensity === 'high' ? 'Élevée' : 'Modérée'}
      </span>
      <div class="workout-info">
        <p><strong>${workout.duration || 60} minutes</strong></p>
        <p><strong>${workout.exercises?.length || 0} exercices</strong></p>
        <p><small>${new Date(workout.date).toLocaleDateString('fr-FR')}</small></p>
      </div>
      ${workout.type === 'ai-generated' && workout.content ? `
        <div style="margin-top: 12px; padding: 16px; background: linear-gradient(to bottom right, #faf5ff, #f9fafb); border-radius: 12px; border: 1px solid #e9d5ff; font-size: 0.9rem;">
          ${formatAIWorkout(workout.content)}
        </div>
      ` : workout.exercises && workout.exercises.length > 0 ? `
        <div class="exercise-list">
          ${workout.exercises.map(ex => typeof ex === 'string' ? `<p>• ${ex}</p>` : `<p>• ${ex.name} ${ex.sets}×${ex.reps}</p>`).join('')}
        </div>
      ` : '<p style="color: #9ca3af; font-size: 0.9rem;">Pas d\'exercices enregistrés</p>'}
      ${workout.notes ? `<p style="font-size: 0.9rem; color: #6b7280; margin-top: 12px;"><strong>Notes:</strong> ${workout.notes}</p>` : ''}
      <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn-start" onclick="openWorkoutDetail(${workout.id || idx})">Voir le détail</button>
      </div>
    </div>
  `).join('');
}

function renderWorkoutGrid(workouts) {
  const grid = document.getElementById('workoutGrid');
  const emptyState = document.getElementById('emptyState');
  const firstTimeWelcome = document.getElementById('firstTimeWelcome');

  if (!workouts || workouts.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';
  if (firstTimeWelcome) firstTimeWelcome.style.display = 'none';

  grid.innerHTML = workouts.map((workout, idx) => `
    <div class="workout-card" style="animation: fadeInUp 0.6s ease-out ${idx * 0.1}s backwards;">
      <div class="workout-card-header">
        <h3>${workout.name}</h3>
        <button class="btn-delete-workout" aria-label="Supprimer cet entraînement" onclick="handleDeleteWorkout(${workout.id || idx})">✕</button>
      </div>
      <span class="difficulty ${workout.intensity || 'medium'}">
        ${workout.intensity === 'low' ? 'Légère' : workout.intensity === 'medium' ? 'Modérée' : workout.intensity === 'high' ? 'Élevée' : 'Modérée'}
      </span>
      <div class="workout-info">
        <p><strong>${workout.duration || 60} minutes</strong></p>
        <p><strong>${workout.exercises?.length || 0} exercices</strong></p>
        <p><small>${new Date(workout.date).toLocaleDateString('fr-FR')}</small></p>
      </div>
      ${workout.type === 'ai-generated' && workout.content ? `
        <div style="margin-top: 12px; padding: 16px; background: linear-gradient(to bottom right, #faf5ff, #f9fafb); border-radius: 12px; border: 1px solid #e9d5ff; font-size: 0.9rem;">
          ${formatAIWorkout(workout.content)}
        </div>
      ` : workout.exercises && workout.exercises.length > 0 ? `
        <div class="exercise-list">
          ${workout.exercises.map(ex => typeof ex === 'string' ? `<p>• ${ex}</p>` : `<p>• ${ex.name} ${ex.sets}×${ex.reps}</p>`).join('')}
        </div>
      ` : '<p style="color: #9ca3af; font-size: 0.9rem;">Pas d\'exercices enregistrés</p>'}
      ${workout.notes ? `<p style="font-size: 0.9rem; color: #6b7280; margin-top: 12px;"><strong>Notes:</strong> ${workout.notes}</p>` : ''}
      <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn-start" onclick="openWorkoutDetail(${workout.id || idx})">Voir le détail</button>
      </div>
    </div>
  `).join('');
}

async function generateAIWorkout() {
  const profile = getUserProfile();
  
  if (!profile || !profile.goal || profile.goal.length === 0) {
    alert('Complète d\'abord ton profil pour générer un programme personnalisé!');
    window.location.href = 'profile-setup.html';
    return;
  }

  const btn = event.target;
  btn.disabled = true;
  btn.textContent = '⏳ Génération en cours...';

  try {
    const goals = Array.isArray(profile.goal) ? profile.goal.join(', ') : profile.goal;
    const exerciseList = getAllExerciseNames().join(', ');
    
    const prompt = `Tu es un coach fitness expert. Génère un programme d'entraînement personnalisé basé sur ce profil:
- Objectifs: ${goals}
- Niveau: ${profile.level || 'non spécifié'}
- Disponibilité: ${profile.daysPerWeek || 3} jours/semaine, ${profile.minutesPerDay || 60} minutes par séance
- Age: ${profile.age}
- Poids: ${profile.weight}kg
- Taille: ${profile.height}cm

IMPORTANT: Tu DOIS UNIQUEMENT utiliser ces exercices: ${exerciseList}

Crée un programme avec:
1. Nom du programme
2. 4-6 exercices adaptés au profil (SEULEMENT DE LA LISTE ABOVE)
3. Nombre de séries et reps pour chaque
4. Conseils clés

Format ta réponse de façon claire et structurée.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error (${response.status}): ${error.message || response.statusText}`);
    }

    const data = await response.json();
    
    const aiResponse = data.choices[0].message.content;

    // Extract exercise names from the response (look for **Exercise** patterns)
    const exerciseMatches = aiResponse.match(/\*\*[^*]+\*\*/g) || [];
    
    // Try to match each bolded text to exercises in database
    const exercises = [];
    const availableExercises = getAllExerciseNames();
    
    exerciseMatches.forEach(match => {
      const name = match.replace(/\*\*/g, '').trim();
      // Try exact match first
      let exerciseData = getExerciseData(name);
      
      // If no exact match, try fuzzy match (partial word match)
      if (!exerciseData) {
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
    
    // Save the generated workout to localStorage
    const newWorkout = {
      id: Date.now(),
      name: 'Programme IA généré',
      date: new Date().toISOString(),
      content: stripIntroMetadata(aiResponse),
      type: 'ai-generated',
      exercises: exercises,
      duration: profile.minutesPerDay || 60,
      intensity: 'medium',
      createdAt: new Date().toISOString()
    };
    
    // Store in temporary array for the save button
    generatedWorkouts.push(newWorkout);

    // Persist to pending storage so chat page can save later
    try {
      const pending = JSON.parse(localStorage.getItem(PENDING_WORKOUTS_KEY) || '[]');
      pending.push(newWorkout);
      localStorage.setItem(PENDING_WORKOUTS_KEY, JSON.stringify(pending));
    } catch (e) {
      // Silently fail on storage error
    }
    
    // Create exercise cards HTML
    let exerciseCardsHTML = '';
    if (exercises.length > 0) {
      const cards = exercises.map(exerciseName => {
        const exercise = getExerciseData(exerciseName);
        if (!exercise) return '';
        return `
          <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; display: flex; gap: 12px; align-items: center;">
            <img src="${exercise.image}" alt="${exercise.name}" style="width: 96px; height: 96px; border-radius: 10px; object-fit: cover; flex-shrink: 0;" onerror="this.src='assets/images/exercise-placeholder.svg';">
            <div>
              <strong>${exercise.name}</strong>
              <div style="font-size: 0.9rem; color: #6b7280;">Muscle: ${exercise.muscle}</div>
              <div style="font-size: 0.9rem; color: #6b7280;">Difficulté: ${exercise.difficulty}</div>
            </div>
          </div>
        `;
      }).join('');
      exerciseCardsHTML = `
        <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
          <div style="font-weight: 700; color: #1f2937;">Aperçu des exercices</div>
          ${cards}
        </div>
      `;
    }
    
    // Add save button chip styled via chat.css
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
    
    // Save to chat history in the correct format
    const CHAT_HISTORY_KEY = 'coachia_chat_history_v1';
    const chatHistory = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || '[]');
    const cleanedContent = stripIntroMetadata(aiResponse);
    const formattedPlan = formatAIWorkout(cleanedContent);
    const hasStructuredPlan = /séance|jour\s*\d|day\s*\d|session|programme/i.test(cleanedContent);
    const planBlock = hasStructuredPlan ? formattedPlan : '';
    chatHistory.push({
      sender: 'bot',
      text: `<div style="margin-bottom:12px;">Voici ton programme d'entraînement personnalisé:</div>${planBlock}${exerciseCardsHTML}${saveButton}`,
      t: Date.now(),
      hasHTML: true
    });
    
    // Add follow-up message asking if they have questions
    chatHistory.push({
      sender: 'bot',
      text: 'As-tu des questions sur ce programme? Je peux t\'aider à ajuster les exercices, expliquer la technique, ou modifier l\'intensité! 💪',
      t: Date.now() + 1,
      hasHTML: false
    });
    
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
    console.log('Workout message added to chat history');
    
    // Small delay to ensure save completes, then redirect to chat
    setTimeout(() => {
      window.location.href = 'chat.html';
    }, 100);
  } catch (error) {
    console.error('Error:', error);
    alert(`Erreur lors de la génération:\n${error.message}\n\nVérifie:\n1. Ta clé API Groq est valide\n2. Ta connexion internet\n3. La console (F12) pour plus de détails`);
  } finally {
    btn.disabled = false;
    btn.textContent = '🧠 Générer un programme (IA)';
  }
}

// Make function globally accessible for onclick
window.saveWorkoutFromChat = function(workoutId) {
  console.log('Saving workout from chat, ID:', workoutId);
  
  // Find the workout in temporary storage first
  let workout = generatedWorkouts.find(w => w.id === workoutId);

  // Fallback to pending storage (for chat page)
  if (!workout) {
    try {
      const pending = JSON.parse(localStorage.getItem(PENDING_WORKOUTS_KEY) || '[]');
      workout = pending.find(w => w.id === workoutId);
      // Remove it from pending if found
      if (workout) {
        const remaining = pending.filter(w => w.id !== workoutId);
        localStorage.setItem(PENDING_WORKOUTS_KEY, JSON.stringify(remaining));
      }
    } catch (e) {
      console.error('Failed to load pending workouts', e);
    }
  }

  if (!workout) {
    console.error('Workout not found:', workoutId);
    alert('❌ Erreur: Programme introuvable');
    return;
  }
  
  // Ensure metadata is cleaned and type is preserved
  workout.type = workout.type || 'ai-generated';
  if (workout.content) {
    workout.content = stripIntroMetadata(workout.content);
  }
  
  // Save the workout using user-data.js function
  saveWorkout(workout);
  
  alert('✅ Programme sauvegardé dans tes entraînements!');
  
  // Reload workouts page to show the new workout
  setTimeout(() => {
    window.location.href = 'workouts.html';
  }, 500);
}

// Delete a workout and refresh the list
window.handleDeleteWorkout = function(workoutId) {
  // Store the ID for the confirmation handler
  window.pendingDeleteId = workoutId;
  
  // Open the delete confirmation modal
  const modal = document.getElementById('deleteConfirmModal');
  if (modal) {
    modal.style.display = 'grid';
  }
};

// Confirm deletion
window.confirmDelete = function() {
  const workoutId = window.pendingDeleteId;
  if (!workoutId) return;
  
  const ok = deleteWorkout(workoutId);
  if (!ok) {
    alert('❌ Impossible de supprimer ce programme pour le moment.');
    closeDeleteConfirm();
    return;
  }
  
  closeDeleteConfirm();
  loadWorkouts();
};

// Close delete confirmation modal
window.closeDeleteConfirm = function() {
  const modal = document.getElementById('deleteConfirmModal');
  if (modal) {
    modal.style.display = 'none';
  }
  window.pendingDeleteId = null;
};


// Show workout detail modal
window.openWorkoutDetail = function(workoutId) {
  const workouts = getWorkouts();
  const workout = workouts.find(w => w.id === workoutId);
  const modal = document.getElementById('workoutDetailModal');
  const body = document.getElementById('workoutDetailBody');
  if (!workout || !modal || !body) return;

  let planHTML = '';
  if (workout.type === 'ai-generated' && workout.content) {
    const cleaned = stripIntroMetadata(workout.content);
    planHTML = formatAIWorkout(cleaned);
  }

  let exerciseHTML = '';
  if (workout.exercises && workout.exercises.length > 0) {
    const cards = workout.exercises.map(name => {
      const ex = getExerciseData(name);
      if (!ex) return '';
      return `
        <div class="workout-detail-card">
          <img src="${ex.image}" alt="${ex.name}" onerror="this.src='assets/images/exercise-placeholder.svg';">
          <div>
            <div><strong>${ex.name}</strong></div>
            <div class="meta">Muscle: ${ex.muscle}</div>
            <div class="meta">Difficulté: ${ex.difficulty}</div>
          </div>
        </div>
      `;
    }).join('');
    exerciseHTML = `<div class="workout-detail-exercises">${cards}</div>`;
  }

  body.innerHTML = `
    <div class="workout-detail-header">
      <h3>${workout.name || 'Programme'}</h3>
      <div class="workout-detail-meta">${new Date(workout.date).toLocaleDateString('fr-FR')} · ${workout.duration || 60} min · ${workout.exercises?.length || 0} exercices</div>
    </div>
    <div class="workout-detail-body">
      ${planHTML || '<p style="color:#6b7280;">Aucun détail de programme disponible.</p>'}
      ${exerciseHTML}
      ${workout.notes ? `<p><strong>Notes:</strong> ${workout.notes}</p>` : ''}
    </div>
  `;

  modal.style.display = 'grid';
};

window.closeWorkoutDetail = function() {
  const modal = document.getElementById('workoutDetailModal');
  if (modal) modal.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', loadWorkouts);

/**
 * Filter workouts based on search and filter criteria
 */
function filterWorkouts() {
  const searchInput = document.getElementById('workoutSearchInput');
  const typeFilter = document.getElementById('typeFilter');
  const durationFilter = document.getElementById('durationFilter');
  
  const searchTerm = (searchInput?.value || '').toLowerCase();
  const typeValue = typeFilter?.value || '';
  const durationValue = durationFilter?.value || '';
  
  const allWorkouts = getWorkouts();
  
  // Apply filters
  let filtered = allWorkouts.filter(workout => {
    // Search filter
    if (searchTerm) {
      const name = (workout.name || '').toLowerCase();
      const notes = (workout.notes || '').toLowerCase();
      const matchesSearch = name.includes(searchTerm) || notes.includes(searchTerm);
      if (!matchesSearch) return false;
    }
    
    // Type filter
    if (typeValue && workout.type !== typeValue) {
      return false;
    }
    
    // Duration filter
    if (durationValue) {
      const duration = parseInt(workout.duration) || 60;
      if (durationValue === 'short' && duration >= 30) return false;
      if (durationValue === 'medium' && (duration < 30 || duration > 60)) return false;
      if (durationValue === 'long' && duration <= 60) return false;
    }
    
    return true;
  });
  
  // Render filtered results
  renderWorkoutGrid(filtered);
  
  // Show filter info
  const infoElement = document.getElementById('filterResultsInfo');
  if (infoElement) {
    if (filtered.length === 0) {
      infoElement.textContent = 'Aucun entraînement ne correspond à tes critères.';
    } else {
      infoElement.textContent = `${filtered.length} entraînement(s) trouvé(s)`;
    }
  }
}

/**
 * Clear all filters
 */
function clearWorkoutFilters() {
  const searchInput = document.getElementById('workoutSearchInput');
  const typeFilter = document.getElementById('typeFilter');
  const durationFilter = document.getElementById('durationFilter');
  
  if (searchInput) searchInput.value = '';
  if (typeFilter) typeFilter.value = '';
  if (durationFilter) durationFilter.value = '';
  
  const infoElement = document.getElementById('filterResultsInfo');
  if (infoElement) infoElement.textContent = '';
  
  loadWorkouts();
}

// Add event listeners for filters
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('workoutSearchInput');
  const typeFilter = document.getElementById('typeFilter');
  const durationFilter = document.getElementById('durationFilter');
  
  if (searchInput) searchInput.addEventListener('input', filterWorkouts);
  if (typeFilter) typeFilter.addEventListener('change', filterWorkouts);
  if (durationFilter) durationFilter.addEventListener('change', filterWorkouts);
});
