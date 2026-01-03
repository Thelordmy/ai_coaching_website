// Settings management
const SETTINGS_KEY = 'coachia_settings';

// Default settings
const defaultSettings = {
  notifications: {
    workoutReminders: true,
    nutritionReminders: true,
    pushNotifications: false
  },
  preferences: {
    language: 'Français',
    units: 'Métrique (kg, cm)',
    experienceLevel: 'Débutant'
  },
  security: {
    twoFactorAuth: false,
    privateProfile: true,
    dataSharing: true
  }
};

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  return saved ? JSON.parse(saved) : defaultSettings;
}

// Save settings to localStorage
function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Get current settings from the form
function getCurrentSettings() {
  return {
    notifications: {
      workoutReminders: document.getElementById('workoutReminders').classList.contains('active'),
      nutritionReminders: document.getElementById('nutritionReminders').classList.contains('active'),
      pushNotifications: document.getElementById('pushNotifications').classList.contains('active')
    },
    preferences: {
      language: document.getElementById('language').value,
      units: document.getElementById('units').value,
      experienceLevel: document.getElementById('experienceLevel').value
    },
    security: {
      twoFactorAuth: document.getElementById('twoFactorAuth').classList.contains('active'),
      privateProfile: document.getElementById('privateProfile').classList.contains('active'),
      dataSharing: document.getElementById('dataSharing').classList.contains('active')
    }
  };
}

// Apply settings to the form
function applySettingsToForm(settings) {
  // Notifications
  toggleSetting('workoutReminders', settings.notifications.workoutReminders);
  toggleSetting('nutritionReminders', settings.notifications.nutritionReminders);
  toggleSetting('pushNotifications', settings.notifications.pushNotifications);
  
  // Preferences
  document.getElementById('language').value = settings.preferences.language;
  document.getElementById('units').value = settings.preferences.units;
  document.getElementById('experienceLevel').value = settings.preferences.experienceLevel;
  
  // Security
  toggleSetting('twoFactorAuth', settings.security.twoFactorAuth);
  toggleSetting('privateProfile', settings.security.privateProfile);
  toggleSetting('dataSharing', settings.security.dataSharing);
}

// Toggle a setting element
function toggleSetting(id, isActive) {
  const element = document.getElementById(id);
  if (element) {
    if (isActive) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  }
}

// Show success message
function showSuccessMessage() {
  const message = document.getElementById('successMessage');
  if (message) {
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
  }
}

// Initialize settings page
function initializeSettings() {
  const settings = loadSettings();
  applySettingsToForm(settings);
  
  // Save button
  const saveBtn = document.querySelector('.btn-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const currentSettings = getCurrentSettings();
      saveSettings(currentSettings);
      showSuccessMessage();
    });
  }
  
  // Cancel button
  const cancelBtn = document.querySelector('.btn-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      const settings = loadSettings();
      applySettingsToForm(settings);
    });
  }
  
  // Reset password button
  const resetPasswordBtn = document.querySelector('.btn-danger');
  if (resetPasswordBtn) {
    resetPasswordBtn.addEventListener('click', () => {
      if (confirm('Êtes-vous sûr de vouloir réinitialiser votre mot de passe?')) {
        alert('Un email de réinitialisation a été envoyé à votre adresse.');
      }
    });
  }
}

// Load settings when page is ready
document.addEventListener('DOMContentLoaded', initializeSettings);
