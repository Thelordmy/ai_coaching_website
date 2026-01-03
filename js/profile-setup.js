const form = document.getElementById('profileForm');
const successMessage = document.getElementById('successMessage');

// Load existing profile if available
function loadProfile() {
  const profile = getUserProfile();
  if (profile) {
    document.getElementById('age').value = profile.age || '';
    document.getElementById('gender').value = profile.gender || '';
    document.getElementById('weight').value = profile.weight || '';
    document.getElementById('height').value = profile.height || '';
    document.getElementById('daysPerWeek').value = profile.daysPerWeek || 3;
    document.getElementById('minutesPerDay').value = profile.minutesPerDay || 60;
    document.getElementById('targetWeight').value = profile.targetWeight || '';
    document.getElementById('targetDeadline').value = profile.targetDeadline || 3;
    
    if (profile.goal) {
      const goals = Array.isArray(profile.goal) ? profile.goal : [profile.goal];
      goals.forEach(goal => {
        const checkbox = document.querySelector(`input[name="goal"][value="${goal}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }
    if (profile.level) {
      document.querySelector(`input[name="level"][value="${profile.level}"]`).checked = true;
    }
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate required fields
  const level = document.querySelector('input[name="level"]:checked');
  if (!level) {
    alert('Veuillez sélectionner votre niveau d\'expérience');
    return;
  }

  const goals = Array.from(document.querySelectorAll('input[name="goal"]:checked')).map(cb => cb.value);
  if (goals.length === 0) {
    alert('Veuillez sélectionner au moins un objectif');
    return;
  }

  const profile = {
    age: parseInt(document.getElementById('age').value),
    gender: document.getElementById('gender').value,
    weight: parseFloat(document.getElementById('weight').value),
    height: parseInt(document.getElementById('height').value),
    goal: goals,
    level: level.value,
    daysPerWeek: parseInt(document.getElementById('daysPerWeek').value),
    minutesPerDay: parseInt(document.getElementById('minutesPerDay').value),
    targetWeight: document.getElementById('targetWeight').value ? parseFloat(document.getElementById('targetWeight').value) : null,
    targetDeadline: parseInt(document.getElementById('targetDeadline').value),
    createdAt: new Date().toISOString()
  };

  console.log('Saving profile:', profile);
  saveUserProfile(profile);
  
  // Show success message
  successMessage.style.display = 'block';
  
  setTimeout(() => {
    window.location.href = 'accueil.html';
  }, 1500);
});

loadProfile();
