function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleBtn = document.querySelector('.toggle-sidebar-btn');
  
  sidebar.classList.toggle('closed');
  mainContent.classList.toggle('sidebar-closed');
  
  // Change toggle button icon
  const icon = toggleBtn.querySelector('i');
  if (sidebar.classList.contains('closed')) {
    icon.className = 'fas fa-bars';
  } else {
    icon.className = 'fas fa-times';
  }
}

function exploreModule(type) {
  alert("You clicked: " + type);
}

// Add smooth scrolling behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});



// Register Page
function handleGoogleSignup() {
  // Add your Google OAuth integration here
  alert('Google sign-up functionality would be implemented here');
}

// Optional: Add form validation
document.getElementById('registerForm').addEventListener('submit', function(e) {
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  
  if (password !== confirmPassword) {
    e.preventDefault();
    alert('Passwords do not match!');
  }
});




