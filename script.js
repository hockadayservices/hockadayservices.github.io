document.addEventListener('DOMContentLoaded', () => {
    // ==========================
    // GLOBAL SELECTORS
    // ==========================
    const container = document.querySelector('.scroll-container');
    const sections = [...document.querySelectorAll('.section')];
    const dots = [...document.querySelectorAll('.dot')];
    const dotLabel = document.getElementById('dot-label');
    const linkedinButton = document.querySelector('#contact-section .linkedin-button-container');
    const leftArrow = document.querySelector('.scroll-nav-left');
    const rightArrow = document.querySelector('.scroll-nav-right');

    let currentIndex = 0;
    let isHoveringDot = false;

    // ==========================
    // SCROLL TO SECTION
    // ==========================
    const scrollToIndex = (index) => {
        currentIndex = Math.max(0, Math.min(index, sections.length - 1));
        sections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        updateActiveStates();
    };

    // ==========================
    // UPDATE UI STATES
    // ==========================
    const updateActiveStates = () => {
        dots.forEach((dot, i) => {
            const active = i === currentIndex;
            dot.classList.toggle('active', active);
            dot.setAttribute('aria-current', active ? 'true' : 'false');
        });

        leftArrow.style.opacity = leftArrow.style.pointerEvents = currentIndex > 0 ? '1' : '0';
        rightArrow.style.opacity = rightArrow.style.pointerEvents = currentIndex < sections.length - 1 ? '1' : '0';

        updateDotLabel();
        checkLinkedInVisibility();
    };

    const updateDotLabel = () => {
        if (!isHoveringDot) {
            dotLabel.textContent = sections[currentIndex].dataset.section || '';
            dotLabel.classList.add('show');
        }
    };

    // ==========================
    // DOT INTERACTIONS
    // ==========================
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => scrollToIndex(i));
        dot.addEventListener('mouseenter', () => {
            isHoveringDot = true;
            dotLabel.textContent = dot.dataset.section;
        });
        dot.addEventListener('mouseleave', () => {
            isHoveringDot = false;
            updateDotLabel();
        });
    });

    // ==========================
    // ARROWS
    // ==========================
    leftArrow.addEventListener('click', () => scrollToIndex(currentIndex - 1));
    rightArrow.addEventListener('click', () => scrollToIndex(currentIndex + 1));

    // ==========================
    // KEYBOARD NAVIGATION
    // ==========================
    window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        if (['ArrowLeft'].includes(e.code)) scrollToIndex(currentIndex - 1);
        if (['ArrowRight', 'Space'].includes(e.code)) scrollToIndex(currentIndex + 1);
    });

    // ==========================
    // MAIN HORIZONTAL SCROLL (SNAP ONE SECTION)
    // ==========================
    let isScrolling = false; // throttle flag

    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (isScrolling) return;

        const delta = e.deltaY > 0 ? 1 : -1;
        const targetIndex = Math.max(0, Math.min(currentIndex + delta, sections.length - 1));

        if (targetIndex !== currentIndex) {
            isScrolling = true;
            scrollToIndex(targetIndex);

            // Release throttle after scroll finishes (approximate)
            setTimeout(() => {
                isScrolling = false;
            }, 600); // match smooth scroll duration
        }
    }, { passive: false });

    // ==========================
    // LINKEDIN BUTTON
    // ==========================
    const checkLinkedInVisibility = () => {
        if (!linkedinButton) return;
        const rect = document.getElementById('contact-section').getBoundingClientRect();
        linkedinButton.classList.toggle('visible', rect.top < window.innerHeight && rect.bottom > 0);
    };
    window.addEventListener('scroll', checkLinkedInVisibility);
    window.addEventListener('resize', checkLinkedInVisibility);

    // ==========================
    // HORIZONTAL CAROUSEL
    // ==========================
    document.querySelectorAll('.card-list-wrapper').forEach(carousel => {
        const card = carousel.querySelector('.hover-card');
        if (!card) return;
        const gap = parseInt(getComputedStyle(carousel).gap) || 32;

        carousel.addEventListener('wheel', (e) => {
            e.preventDefault();
            carousel.scrollBy({ left: (card.offsetWidth + gap) * (e.deltaY > 0 ? 1 : -1), behavior: 'smooth' });
        }, { passive: false });
    });

    // ==========================
    // INITIALIZE
    // ==========================
    window.addEventListener('load', () => {
        updateActiveStates();
        updateDotLabel();
        checkLinkedInVisibility();
    });
});