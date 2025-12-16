// Typewriter Effect with Cycling
console.log('SCRIPT FILE LOADED - script.js is executing!');
console.error('TEST ERROR - If you see this, console is working!');
console.warn('TEST WARNING - If you see this, console is working!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired!');
    const typewriterText = document.getElementById('typewriter-text');
    if (typewriterText) {
        const texts = [
            'designer engineer',
            'xr developer',
            '3D modeler',
            'creative technologist',
            'usc student',
            'ui/ux product designer'
        ];
        
        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 50;
        let deletingSpeed = 30;
        let pauseTime = 3500;
        
        function typeWriter() {
            const currentText = texts[currentTextIndex];
            
            if (!isDeleting && currentCharIndex < currentText.length) {
                // Typing forward
                typewriterText.textContent = currentText.substring(0, currentCharIndex + 1);
                typewriterText.classList.add('typing');
                currentCharIndex++;
                setTimeout(typeWriter, typingSpeed);
            } else if (isDeleting && currentCharIndex > 0) {
                // Deleting backward
                typewriterText.textContent = currentText.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                setTimeout(typeWriter, deletingSpeed);
            } else if (!isDeleting && currentCharIndex === currentText.length) {
                // Finished typing, pause then start deleting
                typewriterText.classList.remove('typing');
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, pauseTime);
            } else if (isDeleting && currentCharIndex === 0) {
                // Finished deleting, move to next text
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % texts.length;
                setTimeout(typeWriter, 500);
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }

    // Handle project card clicks and overlays (only on projects page)
    console.log('=== SCRIPT RUNNING ===');
    const projectCards = document.querySelectorAll('.project-card');
    console.log('Found project cards:', projectCards.length);
    
    // Only run overlay code if there are actually project cards on this page
    if (projectCards.length > 0) {
        console.log('Setting up overlays for', projectCards.length, 'cards');
        
        // Add hover effect to show overlays
        projectCards.forEach((card, index) => {
            const overlay = card.querySelector('.card-overlay');
            console.log(`Card ${index + 1}: overlay found =`, !!overlay);
            
            if (overlay) {
                // Set all styles directly via JavaScript
                overlay.style.cssText = `
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    background: #EC4747 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: flex-end !important;
                    padding: 30px !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    transition: opacity 0.3s ease !important;
                    color: white !important;
                    z-index: 1000 !important;
                    pointer-events: none !important;
                `;
                
                console.log(`Adding event listeners to card ${index + 1}`);
                
                card.addEventListener('mouseenter', function(e) {
                    console.log('MOUSE ENTER on card', index + 1, e);
                    overlay.style.opacity = '1';
                    overlay.style.visibility = 'visible';
                });
                
                card.addEventListener('mouseleave', function(e) {
                    console.log('MOUSE LEAVE on card', index + 1, e);
                    overlay.style.opacity = '0';
                    overlay.style.visibility = 'hidden';
                });
                
                // Test: also try mousemove to see if ANY events fire
                card.addEventListener('mousemove', function() {
                    console.log('Mouse moving over card', index + 1);
                });
            } else {
                console.error('No overlay found for card', index + 1);
            }
            
            card.addEventListener('click', function() {
                const projectNumber = this.getAttribute('data-project');
                // Check if it's a Crosswind project (5, 9, or 10)
                if (projectNumber === '5' || projectNumber === '9' || projectNumber === '10') {
                    window.location.href = 'project-crosswind.html';
                } else {
                    window.location.href = `project${projectNumber}.html`;
                }
            });
        });
        
        console.log('Finished setting up all cards');
    } else {
        console.log('No project cards found on this page');
    }

    // Update active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remove all active classes first
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Only add active class if we're NOT on projects.html
    // projects.html should have no active links
    if (currentPage !== 'projects.html') {
        // Define case study projects
        const caseStudyProjects = ['project1.html', 'project2.html', 'project6.html', 'project7.html', 'project11.html'];
        
        // Add active class to the correct link based on current page
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            // Handle index.html showing Product Design as active
            if (currentPage === 'index.html') {
                if (linkHref === 'index.html') {
                    link.classList.add('active');
                }
            }
            // Handle other pages
            else if (currentPage === linkHref) {
                link.classList.add('active');
            }
            // Handle project detail pages (project1.html, project2.html, etc.)
            else if (currentPage.startsWith('project') && currentPage.endsWith('.html') && currentPage !== 'projects.html') {
                // Check if it's a case study project
                if (caseStudyProjects.includes(currentPage)) {
                    // Highlight Case Study for case study projects
                    if (linkHref === 'case-study.html') {
                        link.classList.add('active');
                    }
                } else {
                    // Highlight Product Design for other project pages
                    if (linkHref === 'index.html') {
                        link.classList.add('active');
                    }
                }
            }
        });
    }
});

