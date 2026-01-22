// Animate skill progress bars with rainbow effect variations
    document.addEventListener('DOMContentLoaded', function() {
      const progressFills = document.querySelectorAll('.progress-fill[data-skill]');
      
      progressFills.forEach((fill, index) => {
        const skillLevel = fill.getAttribute('data-skill');
        const delay = (index * 0.1) % 0.5; // Staggered delays
        
        setTimeout(() => {
          fill.style.width = skillLevel + '%';
          fill.style.transition = 'width 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }, delay * 1000);
      });
    });