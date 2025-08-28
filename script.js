// ==========================
// GLOBAL SELECTORS
// ==========================
const container = document.querySelector('.scroll-container');
const sections = Array.from(document.querySelectorAll('.section'));
const dots = Array.from(document.querySelectorAll('.dot'));
const leftArrow = document.querySelector('.arrow-left');
const rightArrow = document.querySelector('.arrow-right');
const linkedinButton = document.querySelector('#contact-section .linkedin-button-container');
let currentIndex = 0;

// Track hover states for horizontal scroll sections
const hoverState = { portfolio: false, resources: false, services: false };

// ==========================
// INTERSECTION OBSERVER FOR H1 UNDERLINE
// ==========================
const h1Observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-underline');
            h1Observer.unobserve(entry.target);
        }
    });
}, { root: container, threshold: 0.3 });

document.querySelectorAll('.section h1').forEach(h1 => h1Observer.observe(h1));

// ==========================
// SCROLL TO SECTION LOGIC
// ==========================
let isScrolling = false;
let isKeyScrolling = false; // <-- NEW: lock for key-based scrolling

function scrollToIndex(index) {
    index = Math.max(0, Math.min(index, sections.length - 1));
    currentIndex = index;
    if (isScrolling) return;

    isScrolling = true;
    isKeyScrolling = true;

    sections[index].scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });

    setTimeout(() => {
        updateDots();
        updateArrows();
        checkLinkedInVisibility();
        isScrolling = false;
        isKeyScrolling = false; // release lock after scroll finishes
    }, 600);
}

function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex]?.classList.add('active');
}

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
// HORIZONTAL CARD SCROLL
// ==========================
function setupHorizontalScroll(listSelector, hoverKey) {
    const list = document.querySelector(listSelector);
    if (!list) return;

    const cards = Array.from(list.querySelectorAll('.card-item'));
    if (!cards.length) return;

    // Track hover state
    list.addEventListener('mouseenter', () => hoverState[hoverKey] = true);
    list.addEventListener('mouseleave', () => hoverState[hoverKey] = false);

    const getCardScrollPos = card => {
        const containerCenter = list.offsetWidth / 2;
        const rect = card.getBoundingClientRect();
        const listRect = list.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2 - listRect.left;
        return list.scrollLeft + cardCenter - containerCenter;
    };

    const scrollToCard = index => {
        index = Math.max(0, Math.min(index, cards.length - 1));
        list.scrollTo({ left: getCardScrollPos(cards[index]), behavior: 'smooth' });
    };

    list.addEventListener('wheel', e => {
        if (!cards.length) return;
        e.stopPropagation();
        e.preventDefault();

        const containerCenter = list.offsetWidth / 2;
        let closestIndex = 0;
        let minDistance = Infinity;

        cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            const listRect = list.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2 - listRect.left;
            const distance = Math.abs(cardCenter - containerCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        });

        if (e.deltaY > 0 && closestIndex < cards.length - 1) closestIndex++;
        if (e.deltaY < 0 && closestIndex > 0) closestIndex--;

        scrollToCard(closestIndex);
    }, { passive: false });

    // Center first card
    scrollToCard(0);
}

['portfolio', 'resources', 'services'].forEach(section =>
    setupHorizontalScroll(`#${section}-section .card-list`, section)
);

// ==========================
// VERTICAL SCROLL SNAP FOR MAIN SECTIONS
// ==========================
container.addEventListener('wheel', e => {
    if (!Object.values(hoverState).some(v => v)) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            scrollToIndex(currentIndex + (e.deltaY > 0 ? 1 : -1));
        }
    }
}, { passive: false });

// ==========================
// DOTS & ARROW UPDATE ON MANUAL SCROLL
// ==========================
container.addEventListener('scroll', () => {
    if (!isKeyScrolling) { // <-- NEW: ignore scroll updates during key-based scroll
        const newIndex = Math.round(container.scrollLeft / window.innerWidth);
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            updateDots();
            updateArrows();
        }
        checkLinkedInVisibility();
    }
});

// ==========================
// LINKEDIN BUTTON VISIBILITY
// ==========================
function checkLinkedInVisibility() {
    if (!linkedinButton) return;
    const slide = document.querySelector('#contact-section');
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    const slideLeft = slide.offsetLeft;
    const slideRight = slideLeft + slide.offsetWidth;

    if (scrollCenter >= slideLeft && scrollCenter <= slideRight) {
        linkedinButton.classList.add('visible');
        linkedinButton.classList.remove('fade-out');
    } else if (linkedinButton.classList.contains('visible')) {
        linkedinButton.classList.remove('visible');
        linkedinButton.classList.add('fade-out');
        linkedinButton.addEventListener('animationend', () => linkedinButton.classList.remove('fade-out'), { once: true });
    }
}

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
            .then(() => setTimeout(() => submitButton.textContent = "Message Sent!", 2000))
            .catch(error => {
                responseMsg.textContent = "Error submitting form. Please try again.";
                submitButton.textContent = "Send";
                submitButton.disabled = false;
                console.error('Error!', error.message);
            });
    });
}

// ==========================
// REMOVE DEFAULT SPACEBAR FUNCTION
// ==========================
let lastAction = 'right'; // default: move right
let lastScrollLeft = container.scrollLeft; // track previous scroll position

function doScroll(action) {
    if (action === 'left') scrollToIndex(currentIndex - 1);
    if (action === 'right') scrollToIndex(currentIndex + 1);
}

leftArrow.addEventListener('click', () => {
    lastAction = 'left';
    doScroll('left');
});

rightArrow.addEventListener('click', () => {
    lastAction = 'right';
    doScroll('right');
});

window.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    if (e.code === 'ArrowLeft') {
        e.preventDefault();
        lastAction = 'left';
        doScroll('left');
    }

    if (e.code === 'ArrowRight') {
        e.preventDefault();
        lastAction = 'right';
        doScroll('right');
    }

    if (e.code === 'Space') {
        e.preventDefault();
        if (e.shiftKey) {
            // Reverse the last action
            doScroll(lastAction === 'left' ? 'right' : 'left');
        } else {
            // Repeat last action
            doScroll(lastAction);
        }
    }
});

container.addEventListener('scroll', () => {
    const delta = container.scrollLeft - lastScrollLeft;
    if (Math.abs(delta) > 2) { // ignore tiny scroll jitters
        lastAction = delta > 0 ? 'right' : 'left';
        lastScrollLeft = container.scrollLeft;
    }
});

// ==========================
// INITIALIZE
// ==========================
updateDots();
updateArrows();
checkLinkedInVisibility();