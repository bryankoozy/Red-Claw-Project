// Wait until the entire DOM content is loaded before running scripts
window.addEventListener('DOMContentLoaded', () => {
  // --------------------------
  // Sidebar toggle icon setup
  // --------------------------
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.querySelector('.toggle-sidebar-btn');
  
  if (sidebar && toggleBtn) {
    const icon = toggleBtn.querySelector('i');

    // Set the initial icon based on sidebar state (closed/open)
    if (sidebar.classList.contains('closed')) {
      icon.className = 'fas fa-bars';  // Sidebar is closed → show hamburger icon
    } else {
      icon.className = 'fas fa-times'; // Sidebar is open → show X icon
    }
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
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth' // Scroll smoothly to target element
        });
      }
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
      const totalSignupsElement = document.getElementById('totalSignups');
      if (totalSignupsElement) {
        totalSignupsElement.textContent = totalSignups;
      }

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
          const highBar = document.getElementById('highBar');
          const highCount = document.getElementById('highCount');
          if (highBar && highCount) {
            const highPercent = (scores[0] / maxScore) * 100;
            highBar.style.width = `${highPercent}%`;
            highBar.textContent = scores[0];
            highCount.textContent = scores[0];
          }
          
          // Medium score bar
          const mediumBar = document.getElementById('mediumBar');
          const mediumCount = document.getElementById('mediumCount');
          if (mediumBar && mediumCount) {
            const mediumPercent = (scores[1] / maxScore) * 100;
            mediumBar.style.width = `${mediumPercent}%`;
            mediumBar.textContent = scores[1];
            mediumCount.textContent = scores[1];
          }
          
          // Low score bar
          const lowBar = document.getElementById('lowBar');
          const lowCount = document.getElementById('lowCount');
          if (lowBar && lowCount) {
            const lowPercent = (scores[2] / maxScore) * 100;
            lowBar.style.width = `${lowPercent}%`;
            lowBar.textContent = scores[2];
            lowCount.textContent = scores[2];
          }
          
          // No Score Yet
          const noScoreBar = document.getElementById('noScoreBar');
          const noScoreCount = document.getElementById('noScoreCount');
          if (noScoreBar && noScoreCount) {
            const noScorePercent = (scores[3] / maxScore) * 100;
            noScoreBar.style.width = `${noScorePercent}%`;
            noScoreBar.textContent = scores[3];
            noScoreCount.textContent = scores[3];
          }
      }, 500);
  }

  // ================================================
  // INTEGRITY EDU SPECIFIC CODE
  // ================================================
  
  // Add hover effects for floating circles
  document.querySelectorAll('.integrity-edu .floating-circle').forEach(circle => {
    circle.addEventListener('mouseenter', () => {
      circle.style.boxShadow = '0 20px 50px rgba(102, 126, 234, 0.4)';
      circle.style.transform = 'translateY(-5px) scale(1.05)';
      circle.style.transition = 'all 0.3s ease';
    });
    
    circle.addEventListener('mouseleave', () => {
      circle.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
      circle.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Initialize IntegrityEdu
  currentMeasure = 0;
  updateProgressIndicator();
  updateProceedButtonVisibility(); // ← ADD THIS LINE

});













// ================================================
// INTEGRITY EDU VARIABLES & FUNCTIONS
// ================================================

let currentMeasure = 0;

// Track module completion status: false initially
const completedModules = Array(8).fill(false);

// Progress tracking
function updateProgressIndicator() {
  const completedCount = completedModules.filter(Boolean).length;
  const progressElement = document.getElementById('progressIndicator');
  
  if (progressElement) {
    progressElement.textContent = `Progress: ${completedCount}/8 modules completed`;
    progressElement.style.color = completedCount === 8 ? '#28a745' : '#6c757d';
  }
  
  // Update circles to show completion status
  completedModules.forEach((completed, index) => {
    const circle = document.querySelector(`.circle-${index + 1}`);
    if (circle) {
      if (completed) {
        circle.classList.add('completed');
        circle.style.backgroundColor = '#28a745';
        circle.style.borderColor = '#28a745';
      } else {
        circle.classList.remove('completed');
        circle.style.backgroundColor = '';
        circle.style.borderColor = '';
      }
    }
  });
}

function showMeasure(measureNum) {
    if (measureNum < 1 || measureNum > 8) return;
    
    // Hide all slides with fade effect
    document.querySelectorAll('.integrity-edu .slide').forEach(slide => {
        slide.style.opacity = '0';
        slide.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            slide.classList.remove('active');
        }, 150);
    });

    // Show the selected measure with fade effect
    setTimeout(() => {
        const measureSlide = document.getElementById(`measure${measureNum}`);
        if (measureSlide) {
            measureSlide.classList.add('active');
            measureSlide.style.opacity = '1';
        }
    }, 150);
    
    // Show back button
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.style.display = 'block';
    }
    
    // Update proceed button visibility
    updateProceedButtonVisibility();
    
    currentMeasure = measureNum;
}

function goHome() {
    // Hide all slides with fade effect
    document.querySelectorAll('.integrity-edu .slide').forEach(slide => {
        slide.style.opacity = '0';
        slide.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            slide.classList.remove('active');
        }, 150);
    });

    // Show home slide with fade effect
    setTimeout(() => {
        const homeSlide = document.getElementById('homeSlide');
        if (homeSlide) {
            homeSlide.classList.add('active');
            homeSlide.style.opacity = '1';
        }
    }, 150);
    
    // Hide back button
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.style.display = 'none';
    }
    
    // Hide proceed button on home
    updateProceedButtonVisibility();

    currentMeasure = 0;
}

// Mark a module complete when user clicks button
function markModuleComplete(moduleNumber) {
  if (moduleNumber < 1 || moduleNumber > 8) return;
  
  // Prevent double completion
  if (completedModules[moduleNumber - 1]) return;
  
  completedModules[moduleNumber - 1] = true;

  // Update the "Complete Module" button
  const btn = document.querySelector(`#measure${moduleNumber} .complete-button`);
  if (btn) {
    btn.disabled = true;
    btn.textContent = `Module ${moduleNumber} Completed ✓`;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'default';
    btn.style.backgroundColor = '#28a745';
    btn.style.borderColor = '#28a745';
  }

  // Update progress indicator
  updateProgressIndicator();
  
  // Update proceed button visibility
  updateProceedButtonVisibility();
  
  // Show completion animation/feedback
  showCompletionFeedback(moduleNumber);
}

// Show visual feedback when module is completed
function showCompletionFeedback(moduleNumber) {
  const measureSlide = document.getElementById(`measure${moduleNumber}`);
  if (measureSlide) {
    // Create temporary success message
    const successMsg = document.createElement('div');
    successMsg.innerHTML = '✅ Module Completed!';
    successMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      font-weight: bold;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(successMsg);
    
    // Animate in
    setTimeout(() => {
      successMsg.style.opacity = '1';
      successMsg.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      successMsg.style.opacity = '0';
      successMsg.style.transform = 'translateX(100px)';
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 300);
    }, 2500);
  }
}

function updateProceedButtonVisibility() {
  const proceedBtn = document.getElementById('proceedQuizButton');
  if (!proceedBtn) return;

  const allCompleted = completedModules.every(c => c);

  if (allCompleted) {
    proceedBtn.style.display = 'inline-block';
    proceedBtn.style.animation = 'pulse 2s infinite';

    // Ensure it's positioned on the home screen if we're on home
    if (currentMeasure === 0) {
      proceedBtn.style.position = 'absolute';
      proceedBtn.style.bottom = '2rem';
      proceedBtn.style.left = '50%';
      proceedBtn.style.transform = 'translateX(-50%)';

      // Extra: move it to front and make sure it's not accidentally covered
      proceedBtn.style.zIndex = '1000';
    } else {
      proceedBtn.style.position = '';
      proceedBtn.style.bottom = '';
      proceedBtn.style.left = '';
      proceedBtn.style.transform = '';
      proceedBtn.style.zIndex = '';
    }
  } else {
    proceedBtn.style.display = 'none';
    proceedBtn.style.animation = '';
  }
}



// Navigate to quiz page
function proceedToQuiz() {
  // Add confirmation dialog
  if (confirm('You have completed all modules! Ready to take the quiz?')) {
    // Add loading state
    const proceedBtn = document.getElementById('proceedQuizButton');
    if (proceedBtn) {
      proceedBtn.textContent = 'Loading Quiz...';
      proceedBtn.disabled = true;
    }
    
    // Navigate to quiz
    setTimeout(() => {
      window.location.href = '/quizManager';
    }, 500);
  }
}

// Enhanced keyboard navigation for IntegrityEdu
document.addEventListener('keydown', (e) => {
    // Prevent keyboard shortcuts if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch(e.key) {
        case 'Escape':
        case 'h':
        case 'H':
            goHome();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
            if (currentMeasure === 0) { // Only on home screen
                showMeasure(parseInt(e.key));
            }
            break;
        case 'ArrowLeft':
            if (currentMeasure > 1) {
                showMeasure(currentMeasure - 1);
            } else if (currentMeasure === 1) {
                goHome();
            }
            break;
        case 'ArrowRight':
            if (currentMeasure > 0 && currentMeasure < 8) {
                showMeasure(currentMeasure + 1);
            }
            break;
        case ' ': // Spacebar to complete current module
            if (currentMeasure > 0) {
                e.preventDefault();
                markModuleComplete(currentMeasure);
            }
            break;
        case 'Enter':
            if (currentMeasure > 0 && completedModules.every(c => c)) {
                proceedToQuiz();
            }
            break;
    }
});

























// ================================================
// SIDEBAR FUNCTIONS
// ================================================

// ---------------------------
// Sidebar toggle button logic
// ---------------------------
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleBtn = document.querySelector('.toggle-sidebar-btn');

  if (!sidebar || !mainContent || !toggleBtn) return;

  // Toggle sidebar visibility and adjust main content accordingly
  sidebar.classList.toggle('closed');
  mainContent.classList.toggle('sidebar-closed');

  // Update the toggle button icon (hamburger or X)
  const icon = toggleBtn.querySelector('i');
  if (icon) {
    if (sidebar.classList.contains('closed')) {
      icon.className = 'fas fa-bars';
    } else {
      icon.className = 'fas fa-times';
    }
  }
}




















// ================================================
// MODAL FUNCTIONS
// ================================================

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
      const modalBody = document.getElementById('modalBody');
      const modal = document.getElementById('modal');
      if (modalBody && modal) {
        modalBody.innerHTML = html;
        modal.style.display = 'flex';
      }
    })
    .catch(error => {
      const modalBody = document.getElementById('modalBody');
      const modal = document.getElementById('modal');
      if (modalBody && modal) {
        modalBody.innerHTML = "<p>Error loading content.</p>";
        modal.style.display = 'flex';
      }
      console.error('Error fetching modal content:', error);
    });
}

function hideModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    hideModal();
  }
}

















// ================================================
// UTILITY FUNCTIONS
// ================================================

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