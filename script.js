document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------
    // DOM Cache
    // ------------------------------
    const DOM = {
        sections: [...document.querySelectorAll('.section')],
        dotsContainer: document.querySelector('.site-footer__dots'),
        dotLabel: document.querySelector('.site-footer__dot-label'),
        leftArrow: document.querySelector('.scroll-nav-button--left'),
        rightArrow: document.querySelector('.scroll-nav-button--right'),
        contactForm: document.getElementById('contactForm'),
        formResponse: document.getElementById('formResponse'),
    };
    DOM.dots = [...DOM.dotsContainer.querySelectorAll('.site-footer__dot')];
    DOM.submitButton = DOM.contactForm?.querySelector('button');

    let currentIndex = 0;
    let isScrolling = false;
    let lastDirection = 1;
    const SCROLL_DELAY = 700;
    let dotLabelTimeout;

    // ------------------------------
    // Helpers
    // ------------------------------
    const lockScroll = (delay = SCROLL_DELAY) => {
        isScrolling = true;
        setTimeout(() => (isScrolling = false), delay);
    };

    const showResponse = (message, duration = 5000) => {
        if (!DOM.formResponse) return;
        DOM.formResponse.innerText = message;
        DOM.formResponse.classList.add('form-response--visible'); // ✅ no dot
        setTimeout(() => DOM.formResponse.classList.remove('form-response--visible'), duration);
    };

    const updateDotLabel = (fade = true) => {
        if (!DOM.dotLabel) return;
        DOM.dotLabel.textContent = DOM.sections[currentIndex].dataset.section || '';
        if (fade) {
            DOM.dotLabel.classList.add('visible');
            clearTimeout(DOM.dotLabel._timeout);
            DOM.dotLabel._timeout = setTimeout(() => {
                DOM.dotLabel.classList.remove('visible');
            }, 2000);
        }
    };

    const updateActiveStates = () => {
        DOM.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
            dot.setAttribute('aria-pressed', i === currentIndex);
        });

        if (DOM.leftArrow) {
            DOM.leftArrow.style.opacity = currentIndex > 0 ? '1' : '0';
            DOM.leftArrow.style.pointerEvents = currentIndex > 0 ? 'auto' : 'none';
        }
        if (DOM.rightArrow) {
            DOM.rightArrow.style.opacity = currentIndex < DOM.sections.length - 1 ? '1' : '0';
            DOM.rightArrow.style.pointerEvents = currentIndex < DOM.sections.length - 1 ? 'auto' : 'none';
        }

        updateDotLabel();
    };

    // ------------------------------
    // Smooth Scroll
    // ------------------------------
    const scrollToIndex = (index, direction = null) => {
        if (isScrolling) return;
        currentIndex = Math.max(0, Math.min(index, DOM.sections.length - 1));
        if (direction !== null) lastDirection = direction;

        DOM.sections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });

        lockScroll();
        setTimeout(updateActiveStates, SCROLL_DELAY - 50);
    };

    const safeScroll = (index, dir) => !isScrolling && scrollToIndex(index, dir);

    // ------------------------------
    // Dot Navigation & Hover
    // ------------------------------
    DOM.dots.forEach((dot, i) => {
        dot.addEventListener('click', () => safeScroll(i, i > currentIndex ? 1 : -1));

        dot.addEventListener('mouseenter', () => {
            if (!DOM.dotLabel) return;
            clearTimeout(dotLabelTimeout);
            DOM.dotLabel.textContent = dot.dataset.section || '';
            DOM.dotLabel.classList.add('visible');
        });

        dot.addEventListener('mouseleave', () => {
            if (!DOM.dotLabel) return;
            dotLabelTimeout = setTimeout(() => {
                DOM.dotLabel.textContent = DOM.sections[currentIndex].dataset.section || '';
                DOM.dotLabel.classList.remove('visible');
            }, 300);
        });
    });

    // ------------------------------
    // Arrow & Keyboard Navigation
    // ------------------------------
    DOM.leftArrow?.addEventListener('click', () => safeScroll(currentIndex - 1, -1));
    DOM.rightArrow?.addEventListener('click', () => safeScroll(currentIndex + 1, 1));

    window.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        if (['input','textarea'].includes(e.target.tagName.toLowerCase())) return;

        const keyMap = {
            ArrowRight: 1, ArrowDown: 1,
            ArrowLeft: -1, ArrowUp: -1,
            ' ': lastDirection
        };
        if (e.key in keyMap) {
            safeScroll(currentIndex + keyMap[e.key], keyMap[e.key]);
            e.preventDefault();
        }
    });

    // ------------------------------
    // Mouse Wheel Navigation
    // ------------------------------
    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        const delta = e.deltaY > 0 ? 1 : -1;
        safeScroll(currentIndex + delta, delta);
        lockScroll();
    });

    // ------------------------------
    // Intersection Observer
    // ------------------------------
    const observer = new IntersectionObserver((entries) => {
        if (isScrolling) return;
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const newIndex = DOM.sections.indexOf(entry.target);
                if (newIndex !== currentIndex) {
                    currentIndex = newIndex;
                    updateActiveStates();
                }
            }
        });
    }, { threshold: 0.5 });

    DOM.sections.forEach((section) => observer.observe(section));

    // ------------------------------
    // Form Submission
    // ------------------------------
    if (DOM.contactForm && DOM.formResponse && DOM.submitButton) {
        DOM.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            DOM.submitButton.disabled = true;
            const formData = new FormData(DOM.contactForm);
            const scriptURL = 'https://script.google.com/macros/s/.../exec';

            try {
                await fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' });
                DOM.contactForm.reset();
                showResponse('Thanks you kindly, bucko! Your message has been received.', 10000);
            } catch {
                showResponse('❌ Error sending message.', 10000);
            } finally {
                DOM.submitButton.disabled = false;
            }
        });
    }

    // ------------------------------
    // Initialize
    // ------------------------------
    updateActiveStates();
});