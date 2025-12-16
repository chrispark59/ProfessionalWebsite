// Timeline Interactive Scrolling
document.addEventListener('DOMContentLoaded', function() {
    const timelineDots = document.querySelectorAll('.timeline-dot');
    const timelineSections = document.querySelectorAll('.timeline-section');
    const timelineContent = document.querySelector('.timeline-content');
    const timelineRight = document.querySelector('.timeline-right');
    
    // Event dates - single dates and date ranges
    const events = [
        { type: 'single', date: new Date('2025-11-25') }, // Physical Therapy Apple Vision Pro Project
        { type: 'single', date: new Date('2025-11-16') }, // Stanford Immerse the Bay Hackathon
        { type: 'single', date: new Date('2025-10-24') }, // Cal Hacks Hackathon
        { type: 'range', start: new Date('2025-06-01'), end: new Date('2025-08-15') }, // GCOO Product Design Internship
        { type: 'single', date: new Date('2025-05-23') }, // Agent Hacks Hackathon
        { type: 'range', start: new Date('2025-01-30'), end: new Date('2025-04-15') },  // USC SEP Startup Incubator
        { type: 'single', date: new Date('2024-11-18') }  // Stanford Immerse the Bay Hackathon
    ];
    
    // Get all dates for calculating span
    const allDates = [];
    events.forEach(event => {
        if (event.type === 'single') {
            allDates.push(event.date);
        } else {
            allDates.push(event.start, event.end);
        }
    });
    
    const firstDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const lastDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    const totalDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    
    // Calculate position for a date (reversed - most recent at bottom)
    function getPositionForDate(date) {
        const daysFromStart = (date - firstDate) / (1000 * 60 * 60 * 24);
        const percentage = (daysFromStart / totalDays) * 100;
        // Reverse: 100 - percentage so most recent is at bottom
        return 90 - (percentage * 0.8); // Map to 90% to 10% of viewport (reversed)
    }
    
    
    let currentActiveIndex = 5; // Start with USC SEP Startup Incubator (index 5)
    
    // Function to get center position for an event
    function getEventCenterPosition(index) {
        const event = events[index];
        if (event.type === 'single') {
            return getPositionForDate(event.date);
        } else {
            const startPos = getPositionForDate(event.start);
            const endPos = getPositionForDate(event.end);
            // For reversed timeline, end date is "higher" (smaller percentage)
            // so we need to calculate center correctly
            return (startPos + endPos) / 2;
        }
    }
    
    // Store original positions
    let originalPositions = {};
    
    // Function to update active state
    function updateActiveState(index) {
        const centerPosition = getEventCenterPosition(index);
        const centerOffset = centerPosition - 50; // How far from 50% the center is
        
        // Recalculate positions and apply offset to center the active event
        // Position single dots
        document.querySelectorAll('.timeline-dot:not(.timeline-dot-start):not(.timeline-dot-end)').forEach((dot) => {
            const dateStr = dot.getAttribute('data-date');
            if (dateStr) {
                const eventDate = new Date(dateStr);
                const originalTop = getPositionForDate(eventDate);
                const newTop = originalTop - centerOffset;
                dot.style.top = newTop + '%';
            }
        });
        
        // Position range containers - ensure no overlaps
        document.querySelectorAll('.timeline-dot-range').forEach((range) => {
            const startDate = new Date(range.getAttribute('data-start-date'));
            const endDate = new Date(range.getAttribute('data-end-date'));
            const startPos = getPositionForDate(startDate);
            const endPos = getPositionForDate(endDate);
            
            // For reversed timeline, end date is higher (smaller %), start is lower (larger %)
            // Position at the end date (top of range) and height extends down to start
            const newEnd = endPos - centerOffset;
            const newStart = startPos - centerOffset;
            range.style.top = newEnd + '%';
            range.style.height = Math.abs(newStart - newEnd) + '%';
            
            // Position the start and end dots within the range
            const startDot = range.querySelector('.timeline-dot-start');
            const endDot = range.querySelector('.timeline-dot-end');
            if (startDot) {
                startDot.style.top = '100%';
                startDot.style.transform = 'translateY(-50%)';
            }
            if (endDot) {
                endDot.style.top = '0%';
                endDot.style.transform = 'translateY(-50%)';
            }
        });
        
        // Update active states
        const allDotsAndRanges = document.querySelectorAll('.timeline-dot, .timeline-dot-range, .timeline-range-line');
        allDotsAndRanges.forEach((element) => {
            const eventIndex = parseInt(element.getAttribute('data-event'));
            if (!isNaN(eventIndex) && eventIndex === index) {
                element.classList.add('active');
                element.style.opacity = '1';
            } else {
                element.classList.remove('active');
                // Fade based on distance from active
                if (!isNaN(eventIndex)) {
                    const distance = Math.abs(eventIndex - index);
                    if (distance === 0) {
                        element.style.opacity = '1';
                    } else if (distance === 1) {
                        element.style.opacity = '0.7';
                    } else if (distance === 2) {
                        element.style.opacity = '0.4';
                    } else {
                        element.style.opacity = '0.2';
                    }
                }
            }
        });
        
        
        // Update sections
        timelineSections.forEach((section) => {
            const sectionEvent = parseInt(section.getAttribute('data-event'));
            if (sectionEvent === index) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        currentActiveIndex = index;
    }
    
    // Click handler for dots and ranges
    document.querySelectorAll('.timeline-dot, .timeline-dot-range').forEach((element) => {
        element.addEventListener('click', function(e) {
            e.stopPropagation();
            let eventIndex = parseInt(this.getAttribute('data-event'));
            
            // If clicking on a dot within a range, get the range's event index
            if (isNaN(eventIndex) && this.closest('.timeline-dot-range')) {
                const range = this.closest('.timeline-dot-range');
                eventIndex = parseInt(range.getAttribute('data-event'));
            }
            
            if (!isNaN(eventIndex)) {
                updateActiveState(eventIndex);
                scrollToSection(eventIndex);
            }
        });
    });
    
    // Scroll handler for timeline content - immediate experience switching
    let isScrolling = false;
    let scrollTimeout;
    
    timelineRight.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
        }
        
        clearTimeout(scrollTimeout);
        
        // Immediate detection - no delay
        const scrollPosition = timelineRight.scrollTop;
        const viewportHeight = timelineRight.clientHeight;
        const centerPoint = scrollPosition + (viewportHeight / 2);
        
        let closestSection = null;
        let closestDistance = Infinity;
        
        timelineSections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionCenter = sectionTop + (sectionHeight / 2);
            const distance = Math.abs(centerPoint - sectionCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = section;
            }
        });
        
        if (closestSection) {
            const eventIndex = parseInt(closestSection.getAttribute('data-event'));
            if (!isNaN(eventIndex) && eventIndex !== currentActiveIndex) {
                updateActiveState(eventIndex);
            }
        }
        
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
        }, 100);
    });
    
    // Intersection Observer for immediate scroll detection
    const observerOptions = {
        root: timelineRight,
        rootMargin: '-30% 0px -30% 0px',
        threshold: [0, 0.3, 0.5, 0.7, 1]
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            // More sensitive - trigger at 30% visibility
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                const eventIndex = parseInt(entry.target.getAttribute('data-event'));
                if (eventIndex !== -1 && eventIndex !== currentActiveIndex) {
                    updateActiveState(eventIndex);
                }
            }
        });
    }, observerOptions);
    
    timelineSections.forEach(section => {
        observer.observe(section);
    });
    
    // Smooth scroll to center when clicking dots
    function scrollToSection(eventIndex) {
        const section = Array.from(timelineSections).find(s => 
            parseInt(s.getAttribute('data-event')) === eventIndex
        );
        if (section) {
            isScrolling = true;
            const sectionTop = section.offsetTop;
            const viewportHeight = timelineRight.clientHeight;
            const sectionHeight = section.offsetHeight;
            const scrollTo = sectionTop - (viewportHeight / 2) + (sectionHeight / 2);
            
            timelineRight.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                isScrolling = false;
            }, 500);
        }
    }
    
    // Initialize positions and active state
    updateActiveState(5); // Start with USC SEP Startup Incubator (Jan 30)
});

