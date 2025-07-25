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

  // ------------------------------------
  // Modal for terms of service and privacy policy
  // ------------------------------------
  document.querySelectorAll('.modal-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const url = link.getAttribute('data-url');
      showModal(url);
    });
  });

  // --------------------------
  // Chart.js Dashboard Charts
  // --------------------------
  const chartDataElement = document.getElementById('chart-data');
  
  if (chartDataElement) {
      const chartData = JSON.parse(chartDataElement.textContent);
      
      // Calculate total signups
      const totalSignups = chartData.signups.reduce((a, b) => a + b, 0);
      document.getElementById('totalSignups').textContent = totalSignups;

      // Monthly signups line chart
      const ctxLine = document.getElementById('signupLineChart')?.getContext('2d');
      if (ctxLine) {
          new Chart(ctxLine, {
              type: 'line',
              data: {
                  labels: chartData.months,
                  datasets: [{
                      label: 'Sign Ups',
                      data: chartData.signups,
                      borderColor: '#007bff',
                      backgroundColor: 'rgba(0, 123, 255, 0.1)',
                      fill: true,
                      tension: 0.3,
                      borderWidth: 2,
                      pointBackgroundColor: '#007bff',
                      pointRadius: 4
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      legend: {
                          display: false
                      }
                  },
                  scales: {
                      y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0,        // No decimal places
                            stepSize: 1,         // Optional: controls the interval between ticks
                            callback: function(value) {
                              if (Number.isInteger(value)) {
                                return value;
                              }
                              return null; // Hide non-integer values
                            }
                          },
                          grid: {
                              color: '#e9ecef'
                          }
                      },
                      x: {
                          grid: {
                              display: false
                          }
                      }
                  }
              }
          });
      }

      // Score bars animation
      const scores = chartData.score_counts;
      const maxScore = Math.max(...scores);
      
      setTimeout(() => {
          // High score bar
          const highPercent = (scores[0] / maxScore) * 100;
          document.getElementById('highBar').style.width = `${highPercent}%`;
          document.getElementById('highBar').textContent = scores[0];
          document.getElementById('highCount').textContent = scores[0];
          
          // Medium score bar
          const mediumPercent = (scores[1] / maxScore) * 100;
          document.getElementById('mediumBar').style.width = `${mediumPercent}%`;
          document.getElementById('mediumBar').textContent = scores[1];
          document.getElementById('mediumCount').textContent = scores[1];
          
          // Low score bar
          const lowPercent = (scores[2] / maxScore) * 100;
          document.getElementById('lowBar').style.width = `${lowPercent}%`;
          document.getElementById('lowBar').textContent = scores[2];
          document.getElementById('lowCount').textContent = scores[2];
          
          // No Score Yet
          const noScorePercent = (scores[3] / maxScore) * 100;
          document.getElementById('noScoreBar').style.width = `${noScorePercent}%`;
          document.getElementById('noScoreBar').textContent = scores[3];
          document.getElementById('noScoreCount').textContent = scores[3];
                
      }, 500);
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
// Modal for terms of service and privacy policy
// ------------------------------------
function showModal(file) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(html => {
      document.getElementById('modalBody').innerHTML = html;
      document.getElementById('modal').style.display = 'flex';
    })
    .catch(error => {
      document.getElementById('modalBody').innerHTML = "<p>Error loading content.</p>";
      document.getElementById('modal').style.display = 'flex';
      console.error('Error fetching modal content:', error);
    });
}

function hideModal() {
  document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    hideModal();
  }
}






// ------------------------------------
// Example: Show alert when module clicked
// ------------------------------------
function exploreModule(type) {
  alert("You clicked: " + type);
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
























