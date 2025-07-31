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
  
  // Small delay to ensure all elements are rendered before checking button visibility
  setTimeout(() => {
    updateProceedButtonVisibility();
  }, 100);







  // ------------------------------------
  // Background music enable on first click
  // ------------------------------------
  document.body.addEventListener('click', function () {
    const music = document.getElementById('backgroundMusic');
    if (music) {
      music.muted = false;
      music.play().catch(err => console.warn('Music playback failed:', err));
    }
  }, { once: true });

});















// ================================================
// INTEGRITY EDU - EDUCATIONAL MODULE SYSTEM
// ================================================
// This system creates an interactive learning experience with 8 modules
// Users can navigate between modules, complete them, and track progress

// MAIN VARIABLES - Think of these as the "memory" of the system
// ================================================================

let currentMeasure = 0;
// This keeps track of which screen we're on:
// 0 = home screen (showing all 8 circles)
// 1-8 = individual module screens

const completedModules = Array(8).fill(false);
// This is like a checklist - it remembers which modules are done
// [false, false, false, false, false, false, false, false] = none completed
// [true, false, true, false, false, false, false, false] = modules 1 and 3 completed

// PROGRESS TRACKING FUNCTION
// ==========================
function updateProgressIndicator() {
  // Count how many modules are completed (count the "true" values)
  const completedCount = completedModules.filter(Boolean).length;
  
  // Find the progress text on the webpage and update it
  const progressElement = document.getElementById('progressIndicator');
  if (progressElement) {
    // Show something like "Progress: 3/8 modules completed"
    progressElement.textContent = `Progress: ${completedCount}/8 modules completed`;
    // Change color to green if all 8 are done, gray if not
    progressElement.style.color = completedCount === 8 ? '#28a745' : '#6c757d';
  }
  
  // Update the visual circles on the home screen
  completedModules.forEach((completed, index) => {
    // Find each circle (circle-1, circle-2, etc.)
    const circle = document.querySelector(`.circle-${index + 1}`);
    if (circle) {
      if (completed) {
        // Make completed circles green
        circle.classList.add('completed');
        circle.style.backgroundColor = '#28a745';
        circle.style.borderColor = '#28a745';
      } else {
        // Keep incomplete circles their original color
        circle.classList.remove('completed');
        circle.style.backgroundColor = '';
        circle.style.borderColor = '';
      }
    }
  });
}






// QUIZ BUTTON VISIBILITY FUNCTION
// ===============================
// This controls when the "Proceed to Quiz" button appears and where it's positioned
function updateProceedButtonVisibility() {
  const proceedBtn = document.getElementById('proceedQuizButton');
  if (!proceedBtn) return; // Exit if button doesn't exist
  
  // Check if ALL 8 modules are completed
  const allCompleted = completedModules.every(c => c);
  
  if (allCompleted) {
    // STEP 1: Hide button completely to avoid visual jumping
    proceedBtn.style.display = 'none';
    proceedBtn.style.animation = '';
    
    // STEP 2: Wait a bit, then reposition and show the button
    setTimeout(() => {
      // Set button styling (green, rounded, etc.)
      proceedBtn.style.position = 'fixed';
      proceedBtn.style.zIndex = '1000';
      proceedBtn.style.padding = '12px 24px';
      proceedBtn.style.fontSize = '16px';
      proceedBtn.style.fontWeight = 'bold';
      proceedBtn.style.backgroundColor = '#28a745';
      proceedBtn.style.color = 'white';
      proceedBtn.style.border = 'none';
      proceedBtn.style.borderRadius = '8px';
      proceedBtn.style.cursor = 'pointer';
      proceedBtn.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
      proceedBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      proceedBtn.style.opacity = '0'; // Start invisible
      
      // ALWAYS position at bottom right - no more conditional logic!
      proceedBtn.style.bottom = '2rem';
      proceedBtn.style.right = '2rem';
      proceedBtn.style.left = 'auto';
      proceedBtn.style.top = 'auto';
      proceedBtn.style.transform = 'none';

      
      // STEP 3: Make button visible
      proceedBtn.style.display = 'block';
      
      // STEP 4: Fade in the button with pulsing animation
      setTimeout(() => {
        proceedBtn.style.opacity = '1';
        proceedBtn.style.animation = 'pulse 2s infinite'; // Makes it glow/pulse
      }, 50);
    }, 300); // Wait 300ms for slide transitions to finish
    
  } else {
    // If not all modules are completed, hide the button completely
    proceedBtn.style.display = 'none';
    proceedBtn.style.animation = '';
  }
}







// NAVIGATION FUNCTIONS
// ===================

// Go back to the home screen (showing all 8 circles)
function goHome() {
    // STEP 1: Hide the quiz button immediately
    const proceedBtn = document.getElementById('proceedQuizButton');
    if (proceedBtn) {
        proceedBtn.style.display = 'none';
        proceedBtn.style.animation = '';
    }
    
    // STEP 2: Fade out all current slides
    document.querySelectorAll('.integrity-edu .slide').forEach(slide => {
        slide.style.opacity = '0'; // Make transparent
        slide.style.transition = 'opacity 0.3s ease'; // Smooth fade
        setTimeout(() => {
            slide.classList.remove('active'); // Remove from view
        }, 150);
    });

    // STEP 3: After fade out, show the home slide
    setTimeout(() => {
        const homeSlide = document.getElementById('homeSlide');
        if (homeSlide) {
            homeSlide.classList.add('active'); // Make it the active slide
            homeSlide.style.opacity = '1'; // Make it visible
        }
    }, 150);
    
    // STEP 4: Hide the back button (not needed on home screen)
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.style.display = 'none';
    }
    
    // STEP 5: Update our memory of where we are
    currentMeasure = 0; // 0 means home screen
    
    // STEP 6: Check if quiz button should appear (after transition finishes)
    setTimeout(() => {
        updateProceedButtonVisibility();
    }, 400);
}






// Show a specific module (1-8)
function showMeasure(measureNum) {
    if (measureNum < 1 || measureNum > 8) return; // Invalid module number
    
    // STEP 1: Hide the quiz button immediately
    const proceedBtn = document.getElementById('proceedQuizButton');
    if (proceedBtn) {
        proceedBtn.style.display = 'none';
        proceedBtn.style.animation = '';
    }
    
    // STEP 2: Fade out all current slides
    document.querySelectorAll('.integrity-edu .slide').forEach(slide => {
        slide.style.opacity = '0';
        slide.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            slide.classList.remove('active');
        }, 150);
    });

    // STEP 3: After fade out, show the requested module slide
    setTimeout(() => {
        const measureSlide = document.getElementById(`measure${measureNum}`);
        if (measureSlide) {
            measureSlide.classList.add('active');
            measureSlide.style.opacity = '1';
        }
    }, 150);
    
    // STEP 4: Show the back button (needed on module screens)
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.style.display = 'block';
    }
    
    // STEP 5: Update our memory of where we are
    currentMeasure = measureNum; // Remember which module we're viewing
    
    // STEP 6: Check if quiz button should appear (after transition finishes)
    setTimeout(() => {
        updateProceedButtonVisibility();
    }, 400);
}





// MODULE COMPLETION SYSTEM
// =======================

// Mark a module as completed when user clicks "Complete Module" button
function markModuleComplete(moduleNumber) {
  if (moduleNumber < 1 || moduleNumber > 8) return; // Invalid module
  
  // Prevent completing the same module twice
  if (completedModules[moduleNumber - 1]) return; // Already completed
  
  // STEP 1: Mark this module as completed in our memory
  completedModules[moduleNumber - 1] = true;
  // Example: completedModules becomes [true, false, false, false, false, false, false, false]

  // STEP 2: Update the "Complete Module" button to show it's done
  const btn = document.querySelector(`#measure${moduleNumber} .complete-button`);
  if (btn) {
    btn.disabled = true; // Can't click it anymore
    btn.textContent = `Module ${moduleNumber} Completed ✓`; // Change text
    btn.style.opacity = '0.6'; // Make it look grayed out
    btn.style.cursor = 'default'; // Change cursor (no more hand pointer)
    btn.style.backgroundColor = '#28a745'; // Green color
    btn.style.borderColor = '#28a745';
  }

  // STEP 3: Update the progress indicator and circles
  updateProgressIndicator();
  
  // STEP 4: Check if quiz button should now appear (if all modules done)
  updateProceedButtonVisibility();
  
  // STEP 5: Show a celebration message
  showCompletionFeedback(moduleNumber);
}







// Show a success message when module is completed
function showCompletionFeedback(moduleNumber) {
  const measureSlide = document.getElementById(`measure${moduleNumber}`);
  if (measureSlide) {
    // Create a temporary success notification
    const successMsg = document.createElement('div');
    successMsg.innerHTML = '✅ Module Completed!';
    successMsg.style.cssText = `
      position: fixed;          /* Float over everything */
      top: 20px;               /* 20px from top */
      right: 20px;             /* 20px from right */
      background: #28a745;     /* Green background */
      color: white;            /* White text */
      padding: 15px 20px;      /* Spacing inside */
      border-radius: 5px;      /* Rounded corners */
      font-weight: bold;       /* Bold text */
      z-index: 1000;          /* Above everything else */
      opacity: 0;             /* Start invisible */
      transform: translateX(100px); /* Start off-screen to the right */
      transition: all 0.3s ease;    /* Smooth animation */
    `;
    
    // Add the message to the webpage
    document.body.appendChild(successMsg);
    
    // ANIMATE IN: Slide in from right and fade in
    setTimeout(() => {
      successMsg.style.opacity = '1';        // Make visible
      successMsg.style.transform = 'translateX(0)'; // Slide to final position
    }, 100);
    
    // ANIMATE OUT: After 2.5 seconds, slide out and remove
    setTimeout(() => {
      successMsg.style.opacity = '0';        // Fade out
      successMsg.style.transform = 'translateX(100px)'; // Slide back out
      setTimeout(() => {
        document.body.removeChild(successMsg); // Remove from webpage
      }, 300);
    }, 2500);
  }
}









// QUIZ NAVIGATION
// ==============

// Take user to the quiz page when all modules are completed
function proceedToQuiz() {
  // Ask user to confirm they're ready
  if (confirm('You have completed all modules! Ready to take the quiz?')) {
    // Show loading state on button
    const proceedBtn = document.getElementById('proceedQuizButton');
    if (proceedBtn) {
      proceedBtn.textContent = 'Loading Quiz...';
      proceedBtn.disabled = true; // Can't click while loading
    }
    
    // Navigate to quiz page after short delay
    setTimeout(() => {
      window.location.href = '/quiz_manager'; // Go to quiz page
    }, 500);
  }
}






// KEYBOARD SHORTCUTS
// ==================
// Allow users to navigate using keyboard keys

document.addEventListener('keydown', (e) => {
    // Don't interfere if user is typing in a text box
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch(e.key) {
        case 'Escape': // ESC key
        case 'h':      // H key
        case 'H':      // Shift+H key
            goHome();  // Go back to home screen
            break;
            
        case '1': case '2': case '3': case '4': // Number keys 1-8
        case '5': case '6': case '7': case '8':
            if (currentMeasure === 0) { // Only work on home screen
                showMeasure(parseInt(e.key)); // Go to that module
            }
            break;
            
        case 'ArrowLeft': // Left arrow key
            if (currentMeasure > 1) {
                showMeasure(currentMeasure - 1); // Go to previous module
            } else if (currentMeasure === 1) {
                goHome(); // If on first module, go home
            }
            break;
            
        case 'ArrowRight': // Right arrow key
            if (currentMeasure > 0 && currentMeasure < 8) {
                showMeasure(currentMeasure + 1); // Go to next module
            }
            break;
            
        case ' ': // Spacebar
            if (currentMeasure > 0) {
                e.preventDefault(); // Don't scroll the page
                markModuleComplete(currentMeasure); // Complete current module
            }
            break;
            
        case 'Enter': // Enter key
            // If all modules done and quiz button is visible, go to quiz
            if (currentMeasure > 0 && completedModules.every(c => c)) {
                proceedToQuiz();
            }
            break;
    }
});




// INITIALIZATION (runs when page loads)
// ====================================
window.addEventListener('DOMContentLoaded', () => {
  // Add hover effects to make circles interactive
  document.querySelectorAll('.integrity-edu .floating-circle').forEach(circle => {
    circle.addEventListener('mouseenter', () => {
      // When mouse hovers over circle: add glow and lift effect
      circle.style.boxShadow = '0 20px 50px rgba(102, 126, 234, 0.4)';
      circle.style.transform = 'translateY(-5px) scale(1.05)'; // Lift up and grow slightly
      circle.style.transition = 'all 0.3s ease';
    });
    
    circle.addEventListener('mouseleave', () => {
      // When mouse leaves circle: return to normal
      circle.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
      circle.style.transform = 'translateY(0) scale(1)'; // Back to original position/size
    });
  });

  // Set up initial state
  currentMeasure = 0; // Start on home screen
  updateProgressIndicator(); // Show initial progress (0/8 completed)
  
  // Check if quiz button should be visible (after page finishes loading)
  setTimeout(() => {
    updateProceedButtonVisibility();
  }, 100);
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