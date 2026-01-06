// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const toggleBtnFixed = document.getElementById('toggleSidebarFixed');
const mainContent = document.querySelector('.main-content');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Check if we're on mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Toggle sidebar function
function toggleSidebar() {
  if (isMobile()) {
    // On mobile, toggle 'show' class for overlay effect
    sidebar.classList.toggle('show');
    sidebarOverlay.classList.toggle('show');
  } else {
    // On desktop, toggle 'collapsed' class
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Save state to localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  }
}

// Close sidebar when clicking overlay on mobile
if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', () => {
    if (isMobile()) {
      sidebar.classList.remove('show');
      sidebarOverlay.classList.remove('show');
    }
  });
}

// Toggle sidebar on both buttons
toggleBtn.addEventListener('click', toggleSidebar);
toggleBtnFixed.addEventListener('click', toggleSidebar);

// Handle window resize
window.addEventListener('resize', () => {
  if (!isMobile()) {
    sidebar.classList.remove('show');
    sidebarOverlay.classList.remove('show');
    // Restore desktop state
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('expanded');
    } else {
      sidebar.classList.remove('collapsed');
      mainContent.classList.remove('expanded');
    }
  } else {
    // Clear desktop classes on mobile
    sidebar.classList.remove('collapsed');
    mainContent.classList.remove('expanded');
  }
});
// Animate stat progress fills from their data-progress attributes
function initStatProgressBars() {
document.querySelectorAll('.stat-card[data-progress]').forEach(card => {
const pct = parseInt(card.dataset.progress, 10) || 0;
const fill = card.querySelector('.stat-progress-fill');
const label = card.querySelector('.stat-info h3');
if (label) label.textContent = pct + '%';
if (!fill) return;
// small timeout so transition is visible after load
setTimeout(() => {
fill.style.width = pct + '%';
}, 120);
});
}
document.addEventListener('DOMContentLoaded', initStatProgressBars);