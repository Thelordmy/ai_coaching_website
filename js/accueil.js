function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  
  sidebar.classList.toggle('closed');    // Opens/closes sidebar
  content.classList.toggle('expanded');  // Adjusts content space
}