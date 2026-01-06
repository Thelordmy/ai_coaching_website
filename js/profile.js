// Profile Page Management

document.addEventListener('DOMContentLoaded', function() {
  // Initialize sidebar
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  const toggleBtnFixed = document.getElementById('toggleSidebarFixed');
  const overlay = document.getElementById('sidebarOverlay');

  if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
  if (toggleBtnFixed) toggleBtnFixed.addEventListener('click', toggleSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebarOnMobile);

  // Load and display user profile data
  loadProfileData();

  // Add event listeners to all edit buttons
  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      handleEditClick(index);
    });
  });

  // Restore sidebar state after page load
  const savedState = localStorage.getItem('sidebar_collapsed');
  if (savedState === 'true' && window.innerWidth > 768) {
    sidebar.classList.add('collapsed');
  }

  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('show');
      if (overlay) overlay.classList.remove('show');
    }
  });
});

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    sidebar.classList.toggle('show');
    if (overlay) overlay.classList.toggle('show');
  } else {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
  }
}

function closeSidebarOnMobile() {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
  }
}

/**
 * Load profile data from localStorage and update UI
 */
function loadProfileData() {
  const profile = getUserProfile();
  
  if (!profile) {
    console.warn('No profile found, using defaults');
    return;
  }

  // Update profile header
  const profileNameEl = document.getElementById('profileName');
  if (profileNameEl) {
    profileNameEl.textContent = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Profil Utilisateur';
  }

  // Update member since
  const memberSinceEl = document.getElementById('memberSince');
  if (memberSinceEl && profile.createdDate) {
    const date = new Date(profile.createdDate);
    const formatted = date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    memberSinceEl.textContent = `Membre depuis ${formatted}`;
  }

  // Update personal info section with ID-based selectors
  document.getElementById('emailValue').textContent = profile.email || 'Non défini';
  document.getElementById('phoneValue').textContent = profile.phone || 'Non défini';
  document.getElementById('nationalityValue').textContent = profile.nationality || 'Non défini';
  document.getElementById('locationValue').textContent = profile.location || 'Non défini';

  // Update health data section
  document.getElementById('weightValue').textContent = profile.currentWeight ? `${profile.currentWeight} kg` : 'Non défini';
  document.getElementById('heightValue').textContent = profile.height ? `${profile.height} cm` : 'Non défini';
  
  // Calculate BMI
  if (profile.currentWeight && profile.height) {
    const bmi = (profile.currentWeight / ((profile.height / 100) ** 2)).toFixed(1);
    const bmiCategory = getBMICategory(bmi);
    document.getElementById('bmiValue').textContent = `${bmi} (${bmiCategory})`;
  } else {
    document.getElementById('bmiValue').textContent = 'Non défini';
  }

  document.getElementById('goalWeightValue').textContent = profile.goalWeight ? `${profile.goalWeight} kg` : 'Non défini';

  // Update goals section
  document.getElementById('goalValue').textContent = profile.goal || 'Non défini';
  document.getElementById('frequencyValue').textContent = profile.trainingFrequency || 'Non défini';
  document.getElementById('deadlineValue').textContent = profile.deadline || 'Non défini';
  document.getElementById('trainingTypeValue').textContent = profile.trainingType || 'Non défini';

  // Update training preferences section
  document.getElementById('trainingLocationValue').textContent = profile.trainingLocation || 'Non défini';
  document.getElementById('equipmentValue').textContent = profile.equipment || 'Non défini';
  document.getElementById('preferredTimeValue').textContent = profile.preferredTime || 'Non défini';
  document.getElementById('limitationsValue').textContent = profile.limitations || 'Aucune';

  // Update stats
  updateProfileStats(profile);

  // Update achievements
  updateAchievements(profile);
}

/**
 * Update profile stats (workouts, objective %, streak)
 */
function updateProfileStats(profile) {
  const workoutCountEl = document.getElementById('workoutCount');
  const progressPercentEl = document.getElementById('progressPercent');
  const streakCountEl = document.getElementById('streakCount');

  if (workoutCountEl) {
    const workouts = getWorkouts();
    workoutCountEl.textContent = workouts.length;
  }

  if (progressPercentEl) {
    if (profile.currentWeight && profile.goalWeight) {
      const totalWeight = Math.abs(profile.currentWeight - profile.goalWeight);
      const lostWeight = Math.abs(profile.currentWeight - profile.goalWeight);
      const percentage = totalWeight > 0 ? Math.min(100, Math.round((lostWeight / totalWeight) * 100)) : 0;
      progressPercentEl.textContent = percentage + '%';
    } else {
      progressPercentEl.textContent = '0%';
    }
  }

  if (streakCountEl) {
    streakCountEl.textContent = profile.streak || '0';
  }
}

/**
 * Update achievements based on user progress
 */
function updateAchievements(profile) {
  const workouts = getWorkouts();
  const achievements = document.querySelectorAll('.achievement');

  // Define achievement unlock conditions
  const achievementConditions = [
    { index: 0, condition: workouts.length >= 1, name: 'Débuts Prometteurs' },
    { index: 1, condition: workouts.length >= 5, name: 'Guerrier de Force' },
    { index: 2, condition: profile.streak >= 30, name: '30 Jours Streak' },
    { index: 3, condition: workouts.length >= 10 && profile.goal === 'Perte de Poids', name: 'Progression Rapide' },
    { index: 4, condition: workouts.length >= 50, name: 'Maître Ultime' },
    { index: 5, condition: workouts.length >= 100, name: 'Champion' }
  ];

  achievementConditions.forEach(({ index, condition }) => {
    if (achievements[index]) {
      if (condition) {
        achievements[index].classList.remove('locked');
      } else {
        achievements[index].classList.add('locked');
      }
    }
  });
}

/**
 * Handle edit button clicks
 */
function handleEditClick(buttonIndex) {
  const profile = getUserProfile();
  
  if (buttonIndex === 0) {
    // Edit Personal Info
    editPersonalInfo(profile);
  } else if (buttonIndex === 1) {
    // Edit Health Data
    editHealthData(profile);
  } else if (buttonIndex === 2) {
    // Edit Goals
    editGoals(profile);
  } else if (buttonIndex === 3) {
    // Edit Training Preferences
    editTrainingPreferences(profile);
  }
}

/**
 * Edit Personal Information
 */
function editPersonalInfo(profile) {
  const firstName = prompt('Prénom:', profile?.firstName || '');
  if (firstName === null) return;

  const lastName = prompt('Nom:', profile?.lastName || '');
  if (lastName === null) return;

  const email = prompt('Email:', profile?.email || '');
  if (email === null) return;

  const phone = prompt('Téléphone:', profile?.phone || '');
  if (phone === null) return;

  const nationality = prompt('Nationalité:', profile?.nationality || '');
  if (nationality === null) return;

  const location = prompt('Lieu:', profile?.location || '');
  if (location === null) return;

  const updatedProfile = {
    ...profile,
    firstName,
    lastName,
    email,
    phone,
    nationality,
    location
  };

  saveUserProfile(updatedProfile);
  alert('✅ Informations personnelles mises à jour');
  loadProfileData();
}

/**
 * Edit Health Data
 */
function editHealthData(profile) {
  const currentWeight = prompt('Poids Actuel (kg):', profile?.currentWeight || '');
  if (currentWeight === null) return;

  const height = prompt('Taille (cm):', profile?.height || '');
  if (height === null) return;

  const goalWeight = prompt('Objectif de Poids (kg):', profile?.goalWeight || '');
  if (goalWeight === null) return;

  const updatedProfile = {
    ...profile,
    currentWeight: parseFloat(currentWeight),
    height: parseFloat(height),
    goalWeight: parseFloat(goalWeight)
  };

  saveUserProfile(updatedProfile);
  alert('✅ Données de santé mises à jour');
  loadProfileData();
}

/**
 * Edit Goals
 */
function editGoals(profile) {
  const goal = prompt('Objectif Principal (ex: Perte de Poids, Gain Musculaire):', profile?.goal || '');
  if (goal === null) return;

  const trainingFrequency = prompt('Fréquence Entraînement (ex: 5 fois/semaine):', profile?.trainingFrequency || '');
  if (trainingFrequency === null) return;

  const deadline = prompt('Délai (ex: 3 mois):', profile?.deadline || '');
  if (deadline === null) return;

  const trainingType = prompt('Type d\'Entraînement (ex: Force + Cardio):', profile?.trainingType || '');
  if (trainingType === null) return;

  const updatedProfile = {
    ...profile,
    goal,
    trainingFrequency,
    deadline,
    trainingType
  };

  saveUserProfile(updatedProfile);
  alert('✅ Objectifs mis à jour');
  loadProfileData();
}

/**
 * Edit Training Preferences
 */
function editTrainingPreferences(profile) {
  const trainingLocation = prompt('Lieu d\'Entraînement (ex: Salle de Gym):', profile?.trainingLocation || '');
  if (trainingLocation === null) return;

  const equipment = prompt('Équipement Disponible (ex: Complet):', profile?.equipment || '');
  if (equipment === null) return;

  const preferredTime = prompt('Heure Préférée (ex: 18h30 - 19h30):', profile?.preferredTime || '');
  if (preferredTime === null) return;

  const limitations = prompt('Limitation Actuelle (ex: Aucune):', profile?.limitations || '');
  if (limitations === null) return;

  const updatedProfile = {
    ...profile,
    trainingLocation,
    equipment,
    preferredTime,
    limitations
  };

  saveUserProfile(updatedProfile);
  alert('✅ Préférences d\'entraînement mises à jour');
  loadProfileData();
}

/**
 * Get BMI category
 */
function getBMICategory(bmi) {
  bmi = parseFloat(bmi);
  if (bmi < 18.5) return 'Insuffisant';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Surpoids';
  return 'Obésité';
}
