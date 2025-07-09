<<<<<<< HEAD

function showModal(type) {
  document.getElementById(type + "Modal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal(type) {
  document.getElementById(type + "Modal").style.display = "none";
  document.body.style.overflow = "auto";
}

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

// Close modal when clicking outside
window.onclick = function(event) {
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  
  if (event.target === loginModal) {
    closeModal('login');
  }
  if (event.target === registerModal) {
    closeModal('register');
  }
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
=======

function showModal(type) {
  document.getElementById(type + "Modal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal(type) {
  document.getElementById(type + "Modal").style.display = "none";
  document.body.style.overflow = "auto";
}

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

// Close modal when clicking outside
window.onclick = function(event) {
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  
  if (event.target === loginModal) {
    closeModal('login');
  }
  if (event.target === registerModal) {
    closeModal('register');
  }
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
>>>>>>> bb38ddfc23888165588272adc9018bac65cef72b
