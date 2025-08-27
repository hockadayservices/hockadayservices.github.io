// ==========================
// GLOBAL SELECTORS
// ==========================
const container = document.querySelector('.scroll-container');
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot');
const leftArrow = document.querySelector('.arrow-left');
const rightArrow = document.querySelector('.arrow-right');
const linkedinButton = document.querySelector('#contact-section .linkedin-button-container');
let currentIndex = 0;

// Track hover states for horizontal scroll sections
const hoverState = {
    portfolio: false,
    resources: false,
    services: false
};

// ==========================
// INTERSECTION OBSERVER FOR H1 UNDERLINE
// ==========================
const headings = document.querySelectorAll('.section h1');
const h1Observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-underline');
            h1Observer.unobserve(entry.target);
        }
    });
}, { root: container, threshold: 0.3 });

headings.forEach(h1 => h1Observer.observe(h1));

// ==========================
// SCROLL TO SECTION LOGIC
// ==========================
let isScrolling = false;
function scrollToIndex(index) {
    index = Math.max(0, Math.min(index, sections.length - 1));
    currentIndex = index;
    if (isScrolling) return;

    isScrolling = true;
    sections[index].scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });

    setTimeout(() => {
        updateDots();
        updateArrows();
        checkLinkedInVisibility();
        isScrolling = false;
    }, 600);
}

// Update dots
function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex]?.classList.add('active');
}

// Update arrows
function updateArrows() {
    leftArrow.classList.toggle('show', currentIndex > 0);
    rightArrow.classList.toggle('show', currentIndex < sections.length - 1);
}

// Dot click
dots.forEach(dot => dot.addEventListener('click', () => scrollToIndex(Number(dot.dataset.index))));

// Arrow click
leftArrow.addEventListener('click', () => scrollToIndex(currentIndex - 1));
rightArrow.addEventListener('click', () => scrollToIndex(currentIndex + 1));

// ==========================
// HORIZONTAL CARD SCROLL (DRY FUNCTION)
// ==========================
function setupHorizontalScroll(listSelector, hoverKey) {
    const list = document.querySelector(listSelector);
    if (!list) return;

    // Track hover
    list.addEventListener('mouseenter', () => hoverState[hoverKey] = true);
    list.addEventListener('mouseleave', () => hoverState[hoverKey] = false);

    // Wheel scroll logic
    list.addEventListener('wheel', e => {
        e.stopPropagation();
        e.preventDefault();

        const containerCenter = list.offsetWidth / 2;
        const scrollLeft = list.scrollLeft;
        const cards = list.querySelectorAll('.card-item');

        let closestIndex = 0;
        let minDistance = Infinity;

        cards.forEach((card, i) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(cardCenter - (scrollLeft + containerCenter));
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        });

        let targetIndex = closestIndex;
        if (e.deltaY > 0 && closestIndex < cards.length - 1) targetIndex++;
        if (e.deltaY < 0 && closestIndex > 0) targetIndex--;

        const targetCard = cards[targetIndex];
        const scrollPos = targetCard.offsetLeft - containerCenter + (targetCard.offsetWidth / 2);
        list.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }, { passive: false });
}

// Initialize horizontal scrolls
setupHorizontalScroll('#portfolio-section .card-list', 'portfolio');
setupHorizontalScroll('#resources-section .card-list', 'resources');
setupHorizontalScroll('#services-section .card-list', 'services');

// ==========================
// VERTICAL SCROLL (MAIN SECTIONS)
// ==========================
container.addEventListener('wheel', e => {
    if (!hoverState.portfolio && !hoverState.resources && !hoverState.services) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            if (e.deltaY > 0) scrollToIndex(currentIndex + 1);
            else scrollToIndex(currentIndex - 1);
        }
    }
}, { passive: false });

// ==========================
// AUTO-FIT TEXT FOR BADGES
// ==========================
function fitTextToBadge(element) {
    const parent = element.parentElement;
    const style = window.getComputedStyle(parent);
    const parentWidth = parent.clientWidth 
                        - parseFloat(style.paddingLeft) 
                        - parseFloat(style.paddingRight);
    
    let fontSize = parseInt(window.getComputedStyle(element).fontSize, 10) || 100;
    element.style.fontSize = fontSize + "px";

    // Grow or shrink to fit
    while ((element.scrollWidth < parentWidth - 1) && fontSize < 200) { // grow if small
        fontSize++;
        element.style.fontSize = fontSize + "px";
    }
    while (element.scrollWidth > parentWidth && fontSize > 1) { // shrink if too big
        fontSize--;
        element.style.fontSize = fontSize + "px";
    }
}

// Apply to all badges on load and resize
document.querySelectorAll('.fit-text').forEach(el => {
    fitTextToBadge(el);
    window.addEventListener('resize', () => fitTextToBadge(el));
});

// ==========================
// DOTS & ARROW UPDATE ON MANUAL SCROLL
// ==========================
container.addEventListener('scroll', () => {
    const newIndex = Math.round(container.scrollLeft / window.innerWidth);
    if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateDots();
        updateArrows();
    }
    checkLinkedInVisibility();
});

// ==========================
// LINKEDIN BUTTON FADE LOGIC
// ==========================
function checkLinkedInVisibility() {
    if (!linkedinButton) return;
    const slide = document.querySelector('#contact-section');
    const scrollLeft = container.scrollLeft;
    const vw = container.clientWidth;
    const slideLeft = slide.offsetLeft;
    const slideRight = slideLeft + slide.offsetWidth;

    if (scrollLeft + vw/2 >= slideLeft && scrollLeft + vw/2 <= slideRight) {
        linkedinButton.classList.remove('fade-out');
        linkedinButton.classList.add('visible');
    } else if (linkedinButton.classList.contains('visible')) {
        linkedinButton.classList.remove('visible');
        linkedinButton.classList.add('fade-out');
        linkedinButton.addEventListener('animationend', () => {
            linkedinButton.classList.remove('fade-out');
        }, { once: true });
    }
}

// Trigger on scroll/resize
container.addEventListener('scroll', checkLinkedInVisibility);
window.addEventListener('resize', checkLinkedInVisibility);

// ==========================
// CONTACT FORM SUBMISSION
// ==========================
const form = document.getElementById('contact-form');
const submitButton = form?.querySelector('button');
const responseMsg = document.getElementById('response');
const scriptURL = 'https://script.google.com/macros/s/AKfycbwOBzqcLqHbpZXDQ2YhhV-zlCQmyn0znUEPqXYOvbT1-LFR8S7PoAVdP6pA9-LbodQ3/exec';

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        submitButton.innerHTML = '<span class="spinner"></span> Sending...';
        submitButton.disabled = true;

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(() => setTimeout(() => {
                submitButton.textContent = "Message Sent!";
            }, 2000))
            .catch(error => {
                responseMsg.textContent = "Error submitting form. Please try again.";
                submitButton.textContent = "Send";
                submitButton.disabled = false;
                console.error('Error!', error.message);
            });
    });
}

// ==========================
// INITIALIZE
// ==========================
updateDots();
updateArrows();
checkLinkedInVisibility();