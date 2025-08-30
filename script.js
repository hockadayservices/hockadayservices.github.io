document.addEventListener('DOMContentLoaded', () => {
const container = document.querySelector('.scroll-container');
const sections = [...document.querySelectorAll('.section')];
const dots = [...document.querySelectorAll('.dot')];
const dotsContainer = document.querySelector('.dots-container');
const dotLabel = document.getElementById('dot-label');
const linkedinButton = document.querySelector('#contact-section .linkedin-button-container');
const leftArrow = document.querySelector('.scroll-nav-left');
const rightArrow = document.querySelector('.scroll-nav-right');

let currentIndex = 0;
let isScrolling = false;
let lastDirection = 1;
let isHoveringDot = false;

    // ==========================
    // SCROLL TO SECTION
    // ==========================
    const scrollToIndex = (index, direction = 1) => {
        currentIndex = Math.max(0, Math.min(index, sections.length - 1));
        lastDirection = direction;

        sections[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });

        updateActiveStates();
    };

    // ==========================
    // UPDATE DOTS AND ARROWS
    // ==========================
    const updateActiveStates = () => {
        const oldIndex = dots.findIndex(dot => dot.classList.contains('active'));

        dots.forEach((dot, i) => {
            dot.classList.remove('active', 'drop', 'active-rise');

            if (i === currentIndex) {
                if (oldIndex !== -1 && oldIndex !== currentIndex) {
                    // Delay the rise slightly so it overlaps the drop return
                    setTimeout(() => {
                        dot.classList.add('active-rise');
                        setTimeout(() => {
                            dot.classList.remove('active-rise');
                            dot.classList.add('active');
                        }, 300); // match animation duration
                    }, 150); // stagger delay (slight overlap, not full wait)
                } else {
                    dot.classList.add('active');
                }
            } else if (i === oldIndex) {
                dot.classList.add('drop');
                setTimeout(() => {
                    dot.classList.remove('drop');
                }, 300); // clean up after animation
            }
        });

        // Show/hide arrows
        leftArrow.style.opacity = currentIndex > 0 ? '1' : '0';
        leftArrow.style.pointerEvents = currentIndex > 0 ? 'auto' : 'none';
        rightArrow.style.opacity = currentIndex < sections.length - 1 ? '1' : '0';
        rightArrow.style.pointerEvents = currentIndex < sections.length - 1 ? 'auto' : 'none';

        if (!isHoveringDot) updateDotLabel();
        checkLinkedInVisibility();
    };

// ==========================
// DOT CLICK HANDLER
// ==========================
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        // Scroll to the section corresponding to the clicked dot
        scrollToIndex(index, lastDirection);
    });
});

// ==========================
// DOT LABEL
// ==========================
const updateDotLabelPosition = () => {
    const rect = dotsContainer.getBoundingClientRect();
    dotLabel.style.left = `calc(${rect.left}px - 11.75vw)`;
};

// Call this whenever you update the label
const updateDotLabel = () => {
    const sectionName = sections[currentIndex].dataset.section || '';
    dotLabel.textContent = sectionName;
    dotLabel.classList.add('visible');
    updateDotLabelPosition();
};

// Update on hover as well
dots.forEach((dot, i) => {
    dot.addEventListener('mouseenter', () => {
        isHoveringDot = true;
        dotLabel.textContent = dot.dataset.section;
        dotLabel.classList.add('visible');
        updateDotLabelPosition();
    });
    dot.addEventListener('mouseleave', () => {
        isHoveringDot = false;
        updateDotLabel();
    });
});

// Also reposition on window resize
window.addEventListener('resize', updateDotLabelPosition);


    // ==========================
    // ARROW BUTTONS
    // ==========================
    const arrowClick = (direction) => {
        if (isScrolling) return;
        isScrolling = true;
        scrollToIndex(currentIndex + direction, direction);
        setTimeout(() => { isScrolling = false; }, 600);
    };

    leftArrow.addEventListener('click', () => arrowClick(-1));
    rightArrow.addEventListener('click', () => arrowClick(1));

    // ==========================
    // KEYBOARD NAVIGATION
    // ==========================
    window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        if (isScrolling) return;

        let direction = 0;
        if (e.code === 'ArrowLeft') direction = -1;
        if (e.code === 'ArrowRight') direction = 1;
        if (e.code === 'Space' || e.code === 'Spacebar') direction = lastDirection;

        if (direction === 0) return;

        e.preventDefault();
        arrowClick(direction);
    });

    // ==========================
    // MOUSE WHEEL NAVIGATION
    // ==========================
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (isScrolling) return;

        const delta = e.deltaY > 0 ? 1 : -1;
        if ((currentIndex === 0 && delta < 0) || (currentIndex === sections.length - 1 && delta > 0)) return;

        isScrolling = true;
        scrollToIndex(currentIndex + delta, delta);
        setTimeout(() => { isScrolling = false; }, 600);
    }, { passive: false });

    // ==========================
    // LINKEDIN BUTTON VISIBILITY
    // ==========================
    const checkLinkedInVisibility = () => {
        if (!linkedinButton) return;
        const rect = document.getElementById('contact-section').getBoundingClientRect();
        linkedinButton.classList.toggle('visible', rect.top < window.innerHeight && rect.bottom > 0);
    };
    window.addEventListener('scroll', checkLinkedInVisibility);
    window.addEventListener('resize', checkLinkedInVisibility);

    // ==========================
    // INITIALIZE
    // ==========================
    window.addEventListener('load', () => {
        updateActiveStates();
        updateDotLabel();
        checkLinkedInVisibility();
    });
});