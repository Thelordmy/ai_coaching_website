function loadDashboard() {
  const profile = getUserProfile();
  const stats = getUserStats();
  const workouts = getWorkouts();

  // Update welcome name
  const firstName = profile?.firstName || 'Utilisateur';
  document.getElementById('welcomeName').textContent = `Bienvenue, ${firstName}!`;

  // Update stats
  const statsGrid = document.getElementById('statsGrid');
  statsGrid.innerHTML = `
    <div class="stat-card" data-progress="${stats.progressPercent}">
      <i class="fas fa-bullseye stat-icon"></i>
      <div class="stat-info">
        <h3>${stats.progressPercent}%</h3>
        <p>Objectif atteint</p>
        <div class="stat-progress">
          <div class="stat-progress-fill"></div>
        </div>
      </div>
    </div>
    <div class="stat-card">
      <i class="fas fa-dumbbell stat-icon" style="color: #8b5cf6;"></i>
      <div class="stat-info">
        <h3>${stats.thisWeekWorkouts}</h3>
        <p>Séances cette semaine</p>
      </div>
    </div>
    <div class="stat-card">
      <i class="fas fa-weight stat-icon" style="color: #06b6d4;"></i>
      <div class="stat-info">
        <h3>${stats.bmi.toFixed(1)}</h3>
        <p>IMC: ${stats.bmiStatus}</p>
      </div>
    </div>
    <div class="stat-card">
      <i class="fas fa-heart stat-icon" style="color: #ef4444;"></i>
      <div class="stat-info">
        <h3>${stats.totalWorkouts}</h3>
        <p>Total entraînements</p>
      </div>
    </div>
  `;

  // Update workout section
  const workoutSection = document.getElementById('workoutSection');
  if (workouts && workouts.length > 0) {
    const lastWorkout = workouts[workouts.length - 1];
    workoutSection.innerHTML = `
      <div class="workout-preview">
        <div class="workout-info">
          <h3>${lastWorkout.name}</h3>
          <p>${lastWorkout.exercises?.length || 0} exercices • ${lastWorkout.duration} minutes • ${lastWorkout.intensity}</p>
          <small style="color: #9ca3af;">Dernière séance: ${new Date(lastWorkout.date).toLocaleDateString('fr-FR')}</small>
        </div>
      </div>
    `;
  } else {
    workoutSection.innerHTML = `
      <div class="workout-preview">
        <div class="workout-info">
          <h3>Pas encore d'entraînement</h3>
          <p>Clique sur "Journaliser une séance" pour enregistrer ton premier entraînement!</p>
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
