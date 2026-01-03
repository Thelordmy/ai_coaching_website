// User Data Management with LocalStorage

const STORAGE_KEYS = {
  PROFILE: 'coachia_user_profile',
  WORKOUTS: 'coachia_workouts',
  PROGRESS: 'coachia_progress',
  CHAT_HISTORY: 'coachia_chat_history'
};

/**
 * Save user profile to localStorage
 */
function saveUserProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    console.log('Profile saved:', profile);
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

/**
 * Get user profile from localStorage
 */
function getUserProfile() {
  try {
    const profile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (e) {
    console.error('Failed to load profile:', e);
    return null;
  }
}

/**
 * Check if user has completed profile setup
 */
function isProfileSetup() {
  return getUserProfile() !== null;
}

/**
 * Save a workout session
 */
function saveWorkout(workout) {
  try {
    const workouts = getWorkouts();
    // Preserve existing id/date when provided so we can reference workouts later (e.g., delete)
    if (!workout.id) workout.id = Date.now();
    if (!workout.date) workout.date = new Date().toISOString();
    workouts.push(workout);
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    console.log('Workout saved:', workout);
    return workout;
  } catch (e) {
    console.error('Failed to save workout:', e);
    return null;
  }
}

/**
 * Get all workouts from localStorage
 */
function getWorkouts() {
  try {
    const workouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return workouts ? JSON.parse(workouts) : [];
  } catch (e) {
    console.error('Failed to load workouts:', e);
    return [];
  }
}

/**
 * Delete a workout by id
 */
function deleteWorkout(workoutId) {
  try {
    const workouts = getWorkouts();
    const filtered = workouts.filter(w => w.id !== workoutId);
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(filtered));
    console.log('Workout deleted:', workoutId);
    return true;
  } catch (e) {
    console.error('Failed to delete workout:', e);
    return false;
  }
}

/**
 * Save weight measurement
 */
function saveWeightMeasurement(weight, date = new Date()) {
  try {
    const progress = getProgress();
    progress.push({
      type: 'weight',
      value: weight,
      date: date.toISOString(),
      id: Date.now()
    });
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    console.log('Weight measurement saved:', weight);
    return true;
  } catch (e) {
    console.error('Failed to save weight:', e);
    return false;
  }
}

/**
 * Get all progress measurements
 */
function getProgress() {
  try {
    const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return progress ? JSON.parse(progress) : [];
  } catch (e) {
    console.error('Failed to load progress:', e);
    return [];
  }
}

/**
 * Get weight measurements only
 */
function getWeightMeasurements() {
  return getProgress().filter(p => p.type === 'weight');
}

/**
 * Calculate user stats
 */
function getUserStats() {
  const profile = getUserProfile();
  const workouts = getWorkouts();
  const weights = getWeightMeasurements();

  // Return default values if no profile
  if (!profile) {
    return {
      bmi: 0,
      bmiStatus: 'Aucun profil',
      totalWorkouts: workouts.length,
      thisWeekWorkouts: 0,
      currentWeight: 0,
      startingWeight: 0,
      weightChange: '0.0',
      weightProgress: 0,
      progressPercent: 0,
      weightHistory: []
    };
  }

  // Calculate BMI
  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);

  // Workout stats
  const totalWorkouts = workouts.length;
  const thisWeekWorkouts = workouts.filter(w => {
    const date = new Date(w.date);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  // Weight progress
  const currentWeight = weights.length > 0 ? weights[weights.length - 1].value : profile.weight;
  const startingWeight = weights.length > 0 ? weights[0].value : profile.weight;
  const weightChange = (currentWeight - startingWeight).toFixed(1);
  const progressPercent = profile.targetWeight 
    ? Math.round(((startingWeight - currentWeight) / (startingWeight - profile.targetWeight)) * 100)
    : 0;

  // BMI Status
  let bmiStatus = 'Normal';
  if (bmi < 18.5) bmiStatus = 'Insuffisant';
  else if (bmi >= 25 && bmi < 30) bmiStatus = 'Surpoids';
  else if (bmi >= 30) bmiStatus = 'Obèse';

  // Weight progress (difference from starting weight)
  const weightProgress = parseFloat(weightChange);

  return {
    bmi,
    bmiStatus,
    totalWorkouts,
    thisWeekWorkouts,
    currentWeight,
    startingWeight,
    weightChange,
    weightProgress,
    progressPercent,
    weightHistory: weights
  };
}

/**
 * Clear all user data (for logout)
 */
function clearAllUserData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.WORKOUTS);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    console.log('All user data cleared');
  } catch (e) {
    console.error('Failed to clear data:', e);
  }
}

/**
 * Export user data as JSON
 */
function exportUserData() {
  const data = {
    profile: getUserProfile(),
    workouts: getWorkouts(),
    progress: getProgress(),
    exportDate: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Import user data from JSON
 */
function importUserData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
    if (data.workouts) localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(data.workouts));
    if (data.progress) localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data.progress));
    console.log('User data imported successfully');
    return true;
  } catch (e) {
    console.error('Failed to import data:', e);
    return false;
  }
}
