const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const togglePassword = document.getElementById('togglePassword');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Toggle password visibility
togglePassword.addEventListener('click', () => {
  const type = loginPassword.type === 'password' ? 'text' : 'password';
  loginPassword.type = type;
  togglePassword.textContent = type === 'password' ? 'Afficher' : 'Masquer';
});

// Form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Hide previous errors
  loginError.style.display = 'none';
  
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  
  // Validation
  if (!email) {
    showError("L'email est obligatoire.");
    return;
  }
  
  if (!emailRegex.test(email)) {
    showError("Format d'email invalide.");
    return;
  }
  
  if (!password) {
    showError("Le mot de passe est obligatoire.");
    return;
  }
  
  if (password.length < 8) {
    showError("Le mot de passe doit contenir au moins 8 caractères.");
    return;
  }
  
  // Disable button and show loading
  loginBtn.disabled = true;
  loginBtn.textContent = 'Connexion...';
  
  // Simulate API call
  setTimeout(() => {
    // Check if user has profile, if not redirect to profile setup
    const profile = getUserProfile();
    
    if (!profile) {
      window.location.href = 'profile-setup.html';
    } else {
      window.location.href = 'accueil.html';
    }
  }, 1000);
});

function showError(message) {
  loginError.textContent = message;
  loginError.style.display = 'block';
}