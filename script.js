document.addEventListener('DOMContentLoaded', () => {

    // Horizontal Carousel Logic
    const carouselSections = ['portfolio-section', 'resources-section', 'services-section'];

    carouselSections.forEach(sectionId => {
        const wrapper = document.getElementById(sectionId).querySelector('.card-list-wrapper');
        let isDragging = false;
        let startX;
        let scrollLeft;

        if (wrapper) {
            wrapper.addEventListener('mousedown', (e) => {
                isDragging = true;
                wrapper.classList.add('active');
                startX = e.pageX - wrapper.offsetLeft;
                scrollLeft = wrapper.scrollLeft;
            });

            wrapper.addEventListener('mouseleave', () => {
                isDragging = false;
                wrapper.classList.remove('active');
            });

            wrapper.addEventListener('mouseup', () => {
                isDragging = false;
                wrapper.classList.remove('active');
            });

            wrapper.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX - wrapper.offsetLeft;
                const walk = (x - startX) * 2; // The '2' is a speed multiplier
                wrapper.scrollLeft = scrollLeft - walk;
            });
        }
    });

    // Full-page scroll navigation logic
    const scrollContainer = document.querySelector('.scroll-container');
    const sections = document.querySelectorAll('.section');
    const dotsContainer = document.querySelector('.dots');
    const dotLabel = document.getElementById('dot-label');
    const navButtons = document.querySelectorAll('.scroll-nav-button');
    let currentIndex = 0;
    let isThrottled = false;
    const throttleDelay = 1000;

    const updateActiveDot = () => {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('active');
                dot.removeAttribute('aria-current');
            }
        });
    };

    const scrollToSection = (index) => {
        if (isThrottled || index < 0 || index >= sections.length) return;
        isThrottled = true;
        currentIndex = index;
        const sectionOffset = sections[currentIndex].offsetLeft;
        scrollContainer.scrollTo({
            left: sectionOffset,
            behavior: 'smooth'
        });

        updateActiveDot();
        setTimeout(() => {
            isThrottled = false;
        }, throttleDelay);
    };

    scrollContainer.addEventListener('scroll', () => {
        const scrollPosition = scrollContainer.scrollLeft;
        const visibleIndex = Math.round(scrollPosition / window.innerWidth);
        if (visibleIndex !== currentIndex) {
            currentIndex = visibleIndex;
            updateActiveDot();
        }
        updateNavButtonVisibility();
    });

    dotsContainer.addEventListener('click', (e) => {
        const dot = e.target.closest('.dot');
        if (dot) {
            const index = parseInt(dot.dataset.index);
            scrollToSection(index);
        }
    });

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('scroll-nav-left')) {
                scrollToSection(currentIndex - 1);
            } else if (button.classList.contains('scroll-nav-right')) {
                scrollToSection(currentIndex + 1);
            }
        });
    });

    const updateNavButtonVisibility = () => {
        const leftBtn = document.querySelector('.scroll-nav-left');
        const rightBtn = document.querySelector('.scroll-nav-right');
        
        if (currentIndex === 0) {
            leftBtn.classList.add('hidden');
        } else {
            leftBtn.classList.remove('hidden');
        }

        if (currentIndex === sections.length - 1) {
            rightBtn.classList.add('hidden');
        } else {
            rightBtn.classList.remove('hidden');
        }
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            scrollToSection(currentIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            scrollToSection(currentIndex - 1);
        }
    });

    // Initial setup
    updateActiveDot();
    updateNavButtonVisibility();

    // Form submission
    const contactForm = document.getElementById('contact-form');
    const responseMessage = document.getElementById('response');
    const linkedinButtonContainer = document.querySelector('.linkedin-button-container');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const object = Object.fromEntries(formData.entries());
        const json = JSON.stringify(object);

        responseMessage.textContent = "Sending your message...";
        responseMessage.style.color = "#fff";
        linkedinButtonContainer.classList.remove('visible');

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });
            const data = await res.json();

            if (data.success) {
                responseMessage.textContent = "Thanks for your message! I'll be in touch soon.";
                responseMessage.style.color = "var(--primary-yellow)";
                form.reset();
            } else {
                responseMessage.textContent = "Oops! There was an error. Please try again or connect on LinkedIn.";
                responseMessage.style.color = "red";
                linkedinButtonContainer.classList.add('visible');
            }
        } catch (error) {
            responseMessage.textContent = "Oops! An error occurred. Please check your connection and try again.";
            responseMessage.style.color = "red";
            linkedinButtonContainer.classList.add('visible');
        }
    });
});