// Wait until the entire DOM content is loaded before running scripts
window.addEventListener('DOMContentLoaded', () => {
  // --------------------------
  // Sidebar toggle icon setup
  // --------------------------
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.querySelector('.toggle-sidebar-btn');
  const icon = toggleBtn.querySelector('i');

  // Set the initial icon based on sidebar state (closed/open)
  if (sidebar.classList.contains('closed')) {
    icon.className = 'fas fa-bars';  // Sidebar is closed → show hamburger icon
  } else {
    icon.className = 'fas fa-times'; // Sidebar is open → show X icon
  }


  // ---------------------------------------
  // Flash messages auto-hide after 5 seconds
  // ---------------------------------------
  const flashMessages = document.querySelectorAll('.flash-message');
  flashMessages.forEach(msg => {
    // Wait 5 seconds before starting fade out
    setTimeout(() => {
      // Apply CSS transition for opacity to fade out
      msg.style.transition = 'opacity 0.5s ease';
      msg.style.opacity = '0';  // Start fade out

      // After fade out transition (0.5s), hide the element completely
      setTimeout(() => {
        msg.style.display = 'none';
      }, 500);
    }, 5000); // 5000 milliseconds = 5 seconds delay before fade out
  });


  // ---------------------------
  // Smooth scrolling for anchors
  // ---------------------------
  // For any link that starts with "#" (page anchor links)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();  // Prevent default jump behavior
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth' // Scroll smoothly to target element
      });
    });
  });

  
  // ---------------------------------
  // Register form password validation
  // ---------------------------------
  // Only attach if register form exists on the page
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('registerConfirmPassword').value;

      // If passwords don't match, prevent form submission and alert user
      if (password !== confirmPassword) {
        e.preventDefault();
        alert('Passwords do not match!');
      }
    });
  }
});











// ---------------------------
// Sidebar toggle button logic
// ---------------------------
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleBtn = document.querySelector('.toggle-sidebar-btn');

  // Toggle sidebar visibility and adjust main content accordingly
  sidebar.classList.toggle('closed');
  mainContent.classList.toggle('sidebar-closed');

  // Update the toggle button icon (hamburger or X)
  const icon = toggleBtn.querySelector('i');
  if (sidebar.classList.contains('closed')) {
    icon.className = 'fas fa-bars';
  } else {
    icon.className = 'fas fa-times';
  }
}











// ------------------------------------
// Example: Show alert when module clicked
// ------------------------------------
function exploreModule(type) {
  alert("You clicked: " + type);
}












// ---------------------------
// Placeholder for Google Signup
// ---------------------------
function handleGoogleSignup() {
  alert('Google sign-up functionality would be implemented here');
}












// -----------------------------------
// Download template for integrityAI page
// -----------------------------------
function downloadTemplate() {
  fetch('/download-template')
    .then(res => res.blob())
    .then(blob => {
      // Create a temporary link element to download the file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'PACT_Compliance_Template.pdf'; // Suggested download filename
      link.click(); // Trigger the download

      // Optional: cleanup URL object after use (not strictly necessary here)
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    })
    .catch(() => alert('Download failed.'));
}



