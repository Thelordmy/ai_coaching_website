// Nutrition Page Management

document.addEventListener('DOMContentLoaded', function() {
  // Initialize sidebar
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  const toggleBtnFixed = document.getElementById('toggleSidebarFixed');
  const overlay = document.getElementById('sidebarOverlay');

  if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
  if (toggleBtnFixed) toggleBtnFixed.addEventListener('click', toggleSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebarOnMobile);

  // Load and personalize nutrition data
  personalizeNutrition();

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
 * Personalize nutrition recommendations based on user profile
 */
function personalizeNutrition() {
  const profile = getUserProfile();
  
  if (!profile) {
    console.warn('No profile found, showing default nutrition recommendations');
    return;
  }

  // Update subtitle with user's goal
  const subtitle = document.querySelector('.welcome-section .subtitle');
  if (subtitle && profile.goal) {
    subtitle.textContent = `Plans alimentaires adaptés à ton objectif: ${profile.goal}`;
  }

  // Calculate and display BMR (Basal Metabolic Rate) and TDEE
  if (profile.currentWeight && profile.height && profile.goal) {
    displayCalorieRecommendations(profile);
  }

  // Highlight the relevant nutrition card based on goal
  highlightRelevantCard(profile.goal);

  // Add personalized meal timing based on training schedule
  if (profile.preferredTime) {
    addMealTimingRecommendations(profile.preferredTime);
  }
}

/**
 * Calculate and display calorie recommendations
 */
function displayCalorieRecommendations(profile) {
  // Simplified BMR calculation using Mifflin-St Jeor equation
  // BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + (sex_factor)
  // Assuming male, age 30 for default calculation
  const age = profile.age || 30;
  const sexFactor = profile.gender === 'female' ? -161 : 5;
  
  const bmr = (10 * profile.currentWeight) + (6.25 * profile.height) - (5 * age) + sexFactor;
  const tdee = bmr * 1.55; // Activity multiplier (moderate activity)

  // Create recommendations card
  const nutritionGrid = document.querySelector('.nutrition-grid');
  if (nutritionGrid) {
    const card = document.createElement('div');
    card.className = 'nutrition-card personalized-card';
    
    let dailyCalories, message;
    
    if (profile.goal === 'Perte de Poids') {
      dailyCalories = Math.round(tdee - 400); // 400 kcal deficit
      message = `<strong>Déficit de 400 kcal</strong> pour une perte progressive`;
    } else if (profile.goal === 'Gain Musculaire') {
      dailyCalories = Math.round(tdee + 400); // 400 kcal surplus
      message = `<strong>Surplus de 400 kcal</strong> pour la prise de masse`;
    } else {
      dailyCalories = Math.round(tdee);
      message = `<strong>Maintenance calorique</strong>`;
    }

    card.innerHTML = `
      <h3><i class="fas fa-calculator"></i> Ta Recommandation Personnalisée</h3>
      <div class="calorie-recommendation">
        <div class="calorie-value">${dailyCalories}</div>
        <div class="calorie-label">kcal/jour</div>
      </div>
      <p style="text-align: center; margin-top: 12px; color: #666; font-size: 0.9em;">${message}</p>
      <p style="font-size: 0.85em; color: #999; margin-top: 8px;">
        Basé sur: ${profile.currentWeight}kg, ${profile.height}cm, ${profile.goal || 'Équilibre'}
      </p>
    `;
    
    // Insert after the welcome section, before nutrition cards
    nutritionGrid.parentNode.insertBefore(card, nutritionGrid);
  }
}

/**
 * Highlight the nutrition card relevant to user's goal
 */
function highlightRelevantCard(goal) {
  const cards = document.querySelectorAll('.nutrition-card');
  
  cards.forEach(card => {
    const title = card.querySelector('h3');
    if (!title) return;
    
    const titleText = title.textContent;
    let isRelevant = false;

    if (goal === 'Perte de Poids' && titleText.includes('Perte')) {
      isRelevant = true;
    } else if ((goal === 'Gain Musculaire' || goal === 'Prise de Masse') && titleText.includes('Prise')) {
      isRelevant = true;
    } else if (goal === 'Équilibre' && titleText.includes('Équilibre')) {
      isRelevant = true;
    }

    if (isRelevant) {
      card.style.borderLeft = '4px solid #7C3AED';
      card.style.backgroundColor = 'rgba(124, 58, 237, 0.05)';
      
      // Add badge
      const badge = document.createElement('div');
      badge.textContent = '✓ Pour toi';
      badge.style.cssText = 'position: absolute; top: 8px; right: 8px; background: #7C3AED; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold;';
      card.style.position = 'relative';
      card.appendChild(badge);
    }
  });
}

/**
 * Add meal timing recommendations based on training schedule
 */
function addMealTimingRecommendations(preferredTime) {
  // Parse time (e.g., "18h30" or "18h30 - 19h30")
  const timeMatch = preferredTime.match(/(\d{1,2})/);
  if (!timeMatch) return;

  const trainingHour = parseInt(timeMatch[1]);
  
  const mealTiming = document.createElement('div');
  mealTiming.className = 'meal-timing';
  mealTiming.style.cssText = `
    background: #f8f9fa;
    border-left: 4px solid #7C3AED;
    padding: 16px;
    margin: 20px 0;
    border-radius: 8px;
  `;

  let recommendations = `
    <h3 style="margin-top: 0; color: #333;">
      <i class="fas fa-clock"></i> Horaire Alimentaire Recommandé
    </h3>
    <p style="color: #666; margin: 8px 0; font-size: 0.95em;">
      Basé sur ton entraînement à ${preferredTime}:
    </p>
    <ul style="margin: 12px 0; padding-left: 20px; color: #555;">
  `;

  if (trainingHour >= 6 && trainingHour < 12) {
    // Morning training
    recommendations += `
      <li><strong>06h00 - 07h00:</strong> Petit-déjeuner protéiné (oeufs, pain complet)</li>
      <li><strong>1h avant entraînement:</strong> Collation légère (banane, miel)</li>
      <li><strong>Après entraînement:</strong> Protein shake + glucides (riz, pâtes)</li>
      <li><strong>13h00:</strong> Déjeuner complet</li>
      <li><strong>19h00:</strong> Dîner modéré</li>
    `;
  } else if (trainingHour >= 12 && trainingHour < 18) {
    // Afternoon training
    recommendations += `
      <li><strong>07h00:</strong> Petit-déjeuner équilibré</li>
      <li><strong>12h00:</strong> Déjeuner important</li>
      <li><strong>1h avant entraînement:</strong> Collation (fruits secs, yaourt)</li>
      <li><strong>Après entraînement:</strong> Protein shake + glucides</li>
      <li><strong>19h30:</strong> Dîner protéiné</li>
    `;
  } else {
    // Evening training
    recommendations += `
      <li><strong>07h00:</strong> Petit-déjeuner complet</li>
      <li><strong>12h00:</strong> Déjeuner équilibré</li>
      <li><strong>15h00:</strong> Goûter protéiné</li>
      <li><strong>1h avant entraînement:</strong> Collation légère</li>
      <li><strong>Après entraînement:</strong> Protein shake + glucides</li>
      <li><strong>22h00:</strong> Collation légère si nécessaire</li>
    `;
  }

  recommendations += `</ul>`;
  mealTiming.innerHTML = recommendations;

  // Insert after food list
  const foodList = document.querySelector('.food-list');
  if (foodList && foodList.nextElementSibling) {
    foodList.parentNode.insertBefore(mealTiming, foodList.nextElementSibling);
  } else if (foodList) {
    foodList.parentNode.appendChild(mealTiming);
  }
}
