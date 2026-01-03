const exercises = [
  {
    id: 1,
    name: 'Pompes',
    muscle: 'Poitrine',
    difficulty: 'Beginner',
    reps: '3x10',
    time: '20 min',
    description: 'Exercice classique au poids du corps pour la poitrine',
    instructions: [
      'Mets-toi en position de planche avec les mains à la largeur des épaules',
      'Abaisse ton corps en gardant le dos droit',
      'Reviens à la position de départ',
      'Respire lentement et contrôle le mouvement'
    ],
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4'
  },
  {
    id: 2,
    name: 'Squats',
    muscle: 'Jambes',
    difficulty: 'Beginner',
    reps: '3x15',
    time: '25 min',
    description: 'Exercice fondamental pour les jambes et les fesses',
    instructions: [
      'Tiens-toi debout, pieds à la largeur des épaules',
      'Descends en pliant les genoux comme si tu t\'assis',
      'Remonte à la position initiale',
      'Garde le buste droit tout au long du mouvement'
    ],
    videoUrl: 'https://www.youtube.com/embed/aclHkTpvHMU'
  },
  {
    id: 3,
    name: 'Traction',
    muscle: 'Dos',
    difficulty: 'Intermediate',
    reps: '3x8',
    time: '30 min',
    description: 'Exercice puissant pour le dos et les bras',
    instructions: [
      'Attrape la barre à la largeur des épaules',
      'Tire-toi vers le haut jusqu\'à ce que ton menton dépasse la barre',
      'Redescends lentement',
      'Exécute le mouvement en contrôle'
    ],
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g'
  },
  {
    id: 4,
    name: 'Développé Couché',
    muscle: 'Poitrine',
    difficulty: 'Intermediate',
    reps: '4x6',
    time: '35 min',
    description: 'Exercice de force pour la poitrine avec haltères',
    instructions: [
      'Allonge-toi sur un banc horizontal',
      'Tiens les haltères à hauteur d\'épaules',
      'Pousse vers le haut jusqu\'à l\'extension complète',
      'Redescends lentement pour éviter les blessures'
    ],
    videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg'
  },
  {
    id: 5,
    name: 'Deadlift',
    muscle: 'Dos',
    difficulty: 'Advanced',
    reps: '3x5',
    time: '40 min',
    description: 'L\'exercice roi pour la force et la puissance',
    instructions: [
      'Place la barre devant toi, pieds à la largeur des épaules',
      'Accroupis-toi et attrape la barre',
      'Relève en gardant le dos droit',
      'Redescends lentement et contrôlé'
    ],
    videoUrl: 'https://www.youtube.com/embed/VL5Dpscsj5I'
  },
  {
    id: 6,
    name: 'Développé Militaire',
    muscle: 'Épaules',
    difficulty: 'Intermediate',
    reps: '3x8',
    time: '30 min',
    description: 'Exercice de force pour les épaules et le haut du corps',
    instructions: [
      'Tiens les haltères à hauteur d\'épaules',
      'Pousse vers le haut jusqu\'à l\'extension complète',
      'Redescends lentement à hauteur d\'épaules',
      'Respire: expire en poussant, inspire en redescendant'
    ],
    videoUrl: 'https://www.youtube.com/embed/2yjDgfcMkR8'
  },
  {
    id: 7,
    name: 'Curl Biceps',
    muscle: 'Bras',
    difficulty: 'Beginner',
    reps: '3x12',
    time: '20 min',
    description: 'Isolement efficace pour les biceps',
    instructions: [
      'Tiens les haltères à tes côtés, paumes vers l\'avant',
      'Plie les coudes en levant les haltères',
      'Redescends lentement',
      'Garde les coudes fixes pendant tout le mouvement'
    ],
    videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo'
  },
  {
    id: 8,
    name: 'Burpee',
    muscle: 'Cardio',
    difficulty: 'Advanced',
    reps: '3x20',
    time: '25 min',
    description: 'Exercice cardio complet pour tout le corps',
    instructions: [
      'Tiens-toi debout et accroupis-toi',
      'Mets tes mains au sol et saute en arrière',
      'Saute en avant et lève-toi',
      'Répète le mouvement rapidement'
    ],
    videoUrl: 'https://www.youtube.com/embed/GY9SzYmY1iU'
  },
  {
    id: 9,
    name: 'Fentes Avant',
    muscle: 'Jambes',
    difficulty: 'Beginner',
    reps: '3x12',
    time: '25 min',
    description: 'Exercice équilibré pour les jambes',
    instructions: [
      'Tiens-toi debout avec les pieds écartés',
      'Fais un pas en avant et plie les genoux',
      'Reviens à la position initiale',
      'Alterne les jambes'
    ],
    videoUrl: 'https://www.youtube.com/embed/H-dJn2dx-y4'
  },
  {
    id: 10,
    name: 'Rowing',
    muscle: 'Dos',
    difficulty: 'Beginner',
    reps: '3x10',
    time: '30 min',
    description: 'Exercice cardio et musculaire avec haltère',
    instructions: [
      'Tiens une haltère dans une main',
      'Penche-toi en avant, genoux légèrement fléchis',
      'Tire l\'haltère vers ta poitrine',
      'Redescends contrôlé'
    ],
    videoUrl: 'https://www.youtube.com/embed/0Ee_KYOE3WQ'
  }
];

let currentFilter = 'all';

function renderExercises(filter = 'all') {
  const grid = document.getElementById('exercisesGrid');
  const filtered = filter === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.muscle.toLowerCase() === filter.toLowerCase());

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1;">
        <i class="fas fa-search"></i>
        <h3>Aucun exercice trouvé</h3>
        <p>Essaie une autre catégorie</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((ex, idx) => `
    <div class="exercise-card" style="animation-delay: ${idx * 0.05}s">
      <div class="exercise-video">
        <i class="fas fa-play"></i>
      </div>
      <div class="exercise-content">
        <h3 class="exercise-title">${ex.name}</h3>
        <div class="exercise-meta">
          <span class="badge badge-muscle"><i class="fas fa-fire"></i> ${ex.muscle}</span>
          <span class="badge badge-difficulty ${ex.difficulty.toLowerCase()}">
            ${ex.difficulty === 'Beginner' ? '🟢 Débutant' : ex.difficulty === 'Intermediate' ? '🟡 Intermédiaire' : '🔴 Avancé'}
          </span>
        </div>
        <p class="exercise-description">${ex.description}</p>
        <div class="exercise-details">
          <div class="detail-item">
            <i class="fas fa-repeat"></i> ${ex.reps}
          </div>
          <div class="detail-item">
            <i class="fas fa-clock"></i> ${ex.time}
          </div>
        </div>
        <button class="btn-watch" onclick="openVideoModal(${ex.id})">
          <i class="fas fa-play"></i> Voir le Guide
        </button>
      </div>
    </div>
  `).join('');
}

function openVideoModal(exerciseId) {
  const exercise = exercises.find(ex => ex.id === exerciseId);
  if (!exercise) return;

  document.getElementById('modalTitle').textContent = exercise.name;
  document.getElementById('modalExerciseTitle').textContent = exercise.name;
  document.getElementById('modalDescription').textContent = exercise.description;
  document.getElementById('videoFrame').src = exercise.videoUrl;
  document.getElementById('modalInstructions').innerHTML = exercise.instructions
    .map(instruction => `<li>${instruction}</li>`)
    .join('');

  document.getElementById('videoModal').style.display = 'flex';
}

function closeVideoModal() {
  document.getElementById('videoModal').style.display = 'none';
  document.getElementById('videoFrame').src = '';
}

// Event listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderExercises(currentFilter);
  });
});

// Close modal on outside click
document.getElementById('videoModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('videoModal')) {
    closeVideoModal();
  }
});

// Render initial exercises
renderExercises();
