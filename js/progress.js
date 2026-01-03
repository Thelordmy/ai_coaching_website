// Load and display real data from localStorage
function loadProgressData() {
  const stats = getUserStats();
  const weights = getWeightMeasurements();
  const workouts = getWorkouts();

  if (!stats) {
    console.error('Error loading stats');
    return;
  }

  const profile = getUserProfile();
  
  // Show message if no profile exists
  if (!profile) {
    const progressStats = document.getElementById('progressStats');
    progressStats.innerHTML = `
      <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
        <p style="font-size: 1.2rem; color: #6b7280; margin-bottom: 20px;">
          Crée ton profil pour commencer à suivre tes progrès!
        </p>
        <a href="profile-setup.html" style="padding: 12px 24px; background: #7C3AED; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Créer mon profil
        </a>
      </div>
    `;
    return;
  }

  // Update progress stats
  const progressStats = document.getElementById('progressStats');
  progressStats.innerHTML = `
    <div class="progress-stat">
      <div class="number">${stats.progressPercent}%</div>
      <div class="label">Objectif Atteint</div>
      <div class="change">${stats.weightProgress > 0 ? '+' : ''}${stats.weightProgress.toFixed(1)} kg</div>
    </div>
    <div class="progress-stat">
      <div class="number">${stats.totalWorkouts}</div>
      <div class="label">Entraînements</div>
      <div class="change">Total enregistrés</div>
    </div>
    <div class="progress-stat">
      <div class="number">${stats.bmi.toFixed(1)}</div>
      <div class="label">IMC</div>
      <div class="change">${stats.bmiStatus}</div>
    </div>
    <div class="progress-stat">
      <div class="number">${stats.thisWeekWorkouts}</div>
      <div class="label">Cette Semaine</div>
      <div class="change">Entraînements</div>
    </div>
  `;

  // Update weight chart
  const weightChart = document.getElementById('weightChart');
  if (weights.length > 0) {
    const maxWeight = Math.max(...weights.map(w => w.value));
    const minWeight = Math.min(...weights.map(w => w.value));
    const range = maxWeight - minWeight || 1;

    weightChart.innerHTML = weights.slice(-6).map(w => {
      const height = ((maxWeight - w.value) / range * 100) + 10;
      const date = new Date(w.date);
      const label = date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
      return `
        <div class="bar" style="height: ${height}%;">
          <div class="bar-value">${w.value}</div>
          <div class="bar-label">${label}</div>
        </div>
      `;
    }).join('');
  } else {
    weightChart.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 20px;">Aucune mesure de poids enregistrée</p>';
  }

  // Update workouts chart (last 7 days)
  const workoutsChart = document.getElementById('workoutsChart');
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const workoutsByDay = Array(7).fill(0);

  workouts.forEach(w => {
    const workoutDate = new Date(w.date);
    const today = new Date();
    const daysAgo = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
    if (daysAgo < 7) {
      const dayIndex = (6 - daysAgo) % 7;
      workoutsByDay[dayIndex]++;
    }
  });

  const maxWorkouts = Math.max(...workoutsByDay) || 1;
  workoutsChart.innerHTML = workoutsByDay.map((count, idx) => {
    const height = (count / maxWorkouts) * 100;
    return `
      <div class="bar" style="height: ${height || 10}%;">
        <div class="bar-value">${count}</div>
        <div class="bar-label">${days[idx]}</div>
      </div>
    `;
  }).join('');
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadProgressData);
