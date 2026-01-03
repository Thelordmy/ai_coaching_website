const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const password = document.getElementById('password');

const firstNameError = document.getElementById('firstNameError');
const lastNameError = document.getElementById('lastNameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

const successMessage = document.getElementById('successMessage');
const togglePassword = document.getElementById('togglePassword');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateFirstName() {
  const value = firstName.value.trim();
  if (!value) {
    firstNameError.textContent = "Le prénom est obligatoire.";
    return false;
  }
  if (value.length < 2) {
    firstNameError.textContent = "Le prénom doit contenir au moins 2 caractères.";
    return false;
  }
  firstNameError.textContent = "";
  return true;
}

function validateLastName() {
  const value = lastName.value.trim();
  if (!value) {
    lastNameError.textContent = "Le nom est obligatoire.";
    return false;
  }
  if (value.length < 2) {
    lastNameError.textContent = "Le nom doit contenir au moins 2 caractères.";
    return false;
  }
  lastNameError.textContent = "";
  return true;
}

function validateEmail() {
  const value = email.value.trim();
  if (!value) {
    emailError.textContent = "L'email est obligatoire.";
    return false;
  }
  if (!emailRegex.test(value)) {
    emailError.textContent = "Format d'email invalide.";
    return false;
  }
  emailError.textContent = "";
  return true;
}

function validatePassword() {
  const value = password.value;
  if (!value) {
    passwordError.textContent = "Le mot de passe est obligatoire.";
    return false;
  }
  if (value.length < 8) {
    passwordError.textContent = "Le mot de passe doit contenir au moins 8 caractères.";
    return false;
  }
  passwordError.textContent = "";
  return true;
}

// Real-time validation
firstName.addEventListener('blur', validateFirstName);
lastName.addEventListener('blur', validateLastName);
email.addEventListener('blur', validateEmail);
password.addEventListener('blur', validatePassword);

// Toggle password visibility
togglePassword.addEventListener('click', () => {
  const type = password.type === 'password' ? 'text' : 'password';
  password.type = type;
  togglePassword.textContent = type === 'password' ? 'Afficher' : 'Masquer';
});

// Form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate all fields
  const isFirstNameValid = validateFirstName();
  const isLastNameValid = validateLastName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid) {
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Création en cours...';

    // Simulate API call
    setTimeout(() => {
      // Show success message
      successMessage.textContent = '✓ Compte créé avec succès ! Redirection...';
      successMessage.classList.add('show');

      // Reset form
      form.reset();

      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Créer mon compte';

      // Save user to localStorage and redirect to profile setup
      setTimeout(() => {
        const userData = {
          firstName: firstName.value.trim(),
          lastName: lastName.value.trim(),
          email: email.value.trim()
        };
        localStorage.setItem('signupData', JSON.stringify(userData));
        window.location.href = 'profile-setup.html';
      }, 2000);
    }, 1500);
  }
});