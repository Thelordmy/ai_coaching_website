const form = document.getElementById('workoutForm');
const exercisesList = document.getElementById('exercisesList');
const successMessage = document.getElementById('successMessage');
let exercises = [];

// Set today's date
document.getElementById('workoutDate').valueAsDate = new Date();

// Make functions globally accessible for onclick handlers
window.addExercise = function() {
  const name = document.getElementById('exerciseName').value.trim();
  const sets = document.getElementById('exerciseSets').value;
  const reps = document.getElementById('exerciseReps').value;

  if (!name || !sets || !reps) {
    alert('Remplis tous les champs de l\'exercice');
    return;
  }

  const exercise = {
    id: Date.now(),
    name,
    sets: parseInt(sets),
    reps: parseInt(reps)
  };

  exercises.push(exercise);
  renderExercises();

  // Clear inputs
  document.getElementById('exerciseName').value = '';
  document.getElementById('exerciseSets').value = '';
  document.getElementById('exerciseReps').value = '';
  document.getElementById('exerciseName').focus();
}

window.removeExercise = function(id) {
  exercises = exercises.filter(e => e.id !== id);
  renderExercises();
}

function renderExercises() {
  exercisesList.innerHTML = exercises.map(ex => `
    <div class="exercise-item">
      <div class="exercise-info">
        <div class="exercise-name">${ex.name}</div>
        <div class="exercise-details">${ex.sets} séries × ${ex.reps} rép.</div>
      </div>
      <button type="button" class="btn-remove" onclick="removeExercise(${ex.id})">Supprimer</button>
    </div>
  `).join('');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (exercises.length === 0) {
    alert('Ajoute au moins un exercice');
    return;
  }

  const workout = {
    date: document.getElementById('workoutDate').value,
    name: document.getElementById('workoutName').value,
    duration: parseInt(document.getElementById('duration').value),
    intensity: document.getElementById('intensity').value,
    exercises: exercises,
    notes: document.getElementById('notes').value,
    completed: true
  };

  saveWorkout(workout);

  // Show success and redirect
  successMessage.style.display = 'block';
  setTimeout(() => {
    window.location.href = 'progress.html';
  }, 1500);
});
