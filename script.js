// Chris Park — portfolio interactions
document.addEventListener('DOMContentLoaded', function () {
    // --- Project card navigation (projects grid pages) ---
    // Hover overlay styling/animation is handled entirely in CSS
    // (.card-overlay + .project-card:hover .card-overlay).
    document.querySelectorAll('.project-card').forEach(function (card) {
        card.addEventListener('click', function () {
            const projectNumber = this.getAttribute('data-project');
            // Crosswind projects (5, 9, 10) all share one page
            if (projectNumber === '5' || projectNumber === '9' || projectNumber === '10') {
                window.location.href = 'project-crosswind.html';
            } else {
                window.location.href = `project${projectNumber}.html`;
            }
        });
    });

    // --- Active nav link based on current page ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    const designSystemsPage = 'design-systems.html';
    const homePages = new Set(['index.html', 'projects.html']);

    // Home pages (index/projects) intentionally have no active link.
    if (!homePages.has(currentPage)) {
        const caseStudyProjects = ['project6.html', 'project11.html', 'project12.html', 'project13.html'];
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (currentPage === designSystemsPage) {
                if (linkHref === designSystemsPage) link.classList.add('active');
            } else if (currentPage === linkHref) {
                link.classList.add('active');
            } else if (currentPage.startsWith('project') && currentPage.endsWith('.html')) {
                // Case-study projects highlight Spatial Computing; the rest, Design Systems.
                if (caseStudyProjects.includes(currentPage)) {
                    if (linkHref === 'case-study.html') link.classList.add('active');
                } else if (linkHref === designSystemsPage) {
                    link.classList.add('active');
                }
            }
        });
    }
});
