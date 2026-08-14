// Chris Park — portfolio interactions
document.addEventListener('DOMContentLoaded', function () {
    // --- Project card navigation (projects grid pages) ---
    // Maps each card's data-project id to its page. Crosswind variants
    // (5, 9, 10) share one page. Hover overlay is handled entirely in CSS.
    const projectPages = {
        '1':  'project_unitFitness.html',
        '2':  'project_gcoo.html',
        '3':  'project_tesla.html',
        '4':  'project_redBull.html',
        '5':  'project_crosswind.html',
        '6':  'project_resense.html',
        '7':  'project_lotus.html',
        '9':  'project_crosswind.html',
        '10': 'project_crosswind.html',
        '11': 'project_volumeZero.html',
        '12': 'project_APT.html',
        '13': 'project_gradient.html',
        '14': 'project_miraGlasses.html',
        '15': 'project_honda.html',
        '16': 'project_alaskaAirlines.html'
    };
    document.querySelectorAll('.project-card').forEach(function (card) {
        card.addEventListener('click', function () {
            const target = projectPages[this.getAttribute('data-project')];
            if (target) window.location.href = target;
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
        // Spatial Computing projects highlight "Spatial Computing"; the rest, "Design Systems".
        const caseStudyProjects = [
            'project_resense.html',
            'project_volumeZero.html',
            'project_APT.html',
            'project_gradient.html',
            'project_honda.html',
            'project_alaskaAirlines.html'
        ];
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (currentPage === designSystemsPage) {
                if (linkHref === designSystemsPage) link.classList.add('active');
            } else if (currentPage === linkHref) {
                link.classList.add('active');
            } else if (currentPage.startsWith('project') && currentPage.endsWith('.html')) {
                if (caseStudyProjects.includes(currentPage)) {
                    if (linkHref === 'case-study.html') link.classList.add('active');
                } else if (linkHref === designSystemsPage) {
                    link.classList.add('active');
                }
            }
        });
    }
});
