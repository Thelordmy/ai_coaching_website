// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const toggleBtnFixed = document.getElementById('toggleSidebarFixed');
const mainContent = document.querySelector('.main-content');

// Check if sidebar state is saved in localStorage
const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

// Apply saved state on load
if (sidebarCollapsed) {
  sidebar.classList.add('collapsed');
  mainContent.classList.add('expanded');
}

// Toggle sidebar function
function toggleSidebar() {
  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('expanded');
  
  // Save state to localStorage
  const isCollapsed = sidebar.classList.contains('collapsed');
  localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// Toggle sidebar on both buttons
toggleBtn.addEventListener('click', toggleSidebar);
toggleBtnFixed.addEventListener('click', toggleSidebar);