const container = document.querySelector('.scroll-container');
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;

// Scroll to a section by index
const scrollToIndex = (index) => {
  if (index < 0) index = 0;
  if (index >= sections.length) index = sections.length - 1;
  currentIndex = index;
  sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateDots();
}

// Update active dot
function updateDots() {
  const scrollLeft = container.scrollLeft;
  const sectionWidth = window.innerWidth;
  sections.forEach((section, index) => {
    if (scrollLeft >= index * sectionWidth && scrollLeft < (index + 1) * sectionWidth) {
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
    }
  });
}


// Dots click
dots.forEach(dot => {
  dot.addEventListener('click', () => scrollToIndex(parseInt(dot.dataset.index)));
});

// Portfolio section scroll
const portfolioSection = document.getElementById('portfolio-section');
let isHoveringPortfolio = false;

if (portfolioSection) {
  const cardList = portfolioSection.querySelector('.card-list');
  const cards = portfolioSection.querySelectorAll('.card-item');
  const progressBar = portfolioSection.querySelector('.progress-bar');

  // Track hover
  cardList.addEventListener('mouseenter', () => isHoveringPortfolio = true);
  cardList.addEventListener('mouseleave', () => isHoveringPortfolio = false);

  // Magnetic scroll on wheel
  cardList.addEventListener('wheel', (e) => {
    e.preventDefault();

    const containerCenter = cardList.offsetWidth / 2;
    const scrollLeft = cardList.scrollLeft;

    // Find currently centered card
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

    // Decide next or previous card
    let targetIndex = closestIndex;
    if (e.deltaY > 0 && closestIndex < cards.length - 1) targetIndex++;
    if (e.deltaY < 0 && closestIndex > 0) targetIndex--;

    // Scroll to the target card
    const targetCard = cards[targetIndex];
    const scrollPos = targetCard.offsetLeft - containerCenter + (targetCard.offsetWidth / 2);
    cardList.scrollTo({ left: scrollPos, behavior: 'smooth' });

    // Update progress bar
    if (progressBar) {
      const scrollWidth = cardList.scrollWidth - cardList.clientWidth;
      progressBar.style.width = (scrollPos / scrollWidth * 100) + '%';
    }
  }, { passive: false });
}









// Services section scroll
const servicesSection = document.getElementById('services-section');
let isHoveringServices = false;

if (servicesSection) {
  const cardList = servicesSection.querySelector('.card-list');
  const cards = servicesSection.querySelectorAll('.card-item');
  const progressBar = servicesSection.querySelector('.progress-bar');

  // Track hover
  cardList.addEventListener('mouseenter', () => isHoveringServices = true);
  cardList.addEventListener('mouseleave', () => isHoveringServices = false);

  // Magnetic scroll on wheel
  cardList.addEventListener('wheel', (e) => {
    e.preventDefault();

    const containerCenter = cardList.offsetWidth / 2;
    const scrollLeft = cardList.scrollLeft;

    // Find currently centered card
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

    // Decide next or previous card
    let targetIndex = closestIndex;
    if (e.deltaY > 0 && closestIndex < cards.length - 1) targetIndex++;
    if (e.deltaY < 0 && closestIndex > 0) targetIndex--;

    // Scroll to the target card
    const targetCard = cards[targetIndex];
    const scrollPos = targetCard.offsetLeft - containerCenter + (targetCard.offsetWidth / 2);
    cardList.scrollTo({ left: scrollPos, behavior: 'smooth' });

    // Update progress bar
    if (progressBar) {
      const scrollWidth = cardList.scrollWidth - cardList.clientWidth;
      progressBar.style.width = (scrollPos / scrollWidth * 100) + '%';
    }
  }, { passive: false });
}


container.addEventListener('wheel', (e) => {
    e.preventDefault();

    // Only scroll main container if not hovering any inner horizontal section
    if (!isHoveringPortfolio && !isHoveringServices) {
        if (e.deltaY > 0) scrollToIndex(currentIndex + 1);
        else if (e.deltaY < 0) scrollToIndex(currentIndex - 1);
    }
}, { passive: false });


// Update dots on container scroll
container.addEventListener('scroll', updateDots);


// Contact form
const scriptURL = 'https://script.google.com/macros/s/AKfycbwOBzqcLqHbpZXDQ2YhhV-zlCQmyn0znUEPqXYOvbT1-LFR8S7PoAVdP6pA9-LbodQ3/exec';
const form = document.getElementById('contact-form');
const submitButton = form.querySelector('button');
const responseMsg = document.getElementById('response');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // prevent default page reload

    // Show spinner
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
    submitButton.disabled = true;

    // Send form data to Google Script
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            // After an amount of time, show "Message Sent!"
            setTimeout(() => {
                submitButton.textContent = "Message Sent!";
            }, 2000);

            // Optional: show a response message below form
            responseMsg.textContent = "Form submitted successfully!";
            form.reset(); // clear form fields
        })
        .catch(error => {
            responseMsg.textContent = "Error submitting form. Please try again.";
            submitButton.textContent = "Send";
            submitButton.disabled = false;
            console.error('Error!', error.message);
        });
});


// LinkedIn button fade logic
const slides = document.querySelectorAll('.section');
const linkedinButton = document.querySelector('#contact-section .linkedin-button-container');

function checkSlideVisibility() {
    const scrollLeft = container.scrollLeft; // <-- use container, not window
    const vw = container.clientWidth;

    slides.forEach((slide) => {
        if (slide.id === 'contact-section') {
            const slideLeft = slide.offsetLeft;
            const slideRight = slideLeft + slide.offsetWidth;

            if (scrollLeft + vw/2 >= slideLeft && scrollLeft + vw/2 <= slideRight) {
                // Fade in
                linkedinButton.classList.remove('fade-out');
                linkedinButton.classList.add('visible');
            } else {
                if (linkedinButton.classList.contains('visible')) {
                    // Trigger fade out
                    linkedinButton.classList.remove('visible');
                    linkedinButton.classList.add('fade-out');

                    linkedinButton.addEventListener('animationend', () => {
                        linkedinButton.classList.remove('fade-out');
                    }, { once: true });
                }
            }
        }
    });
}

// Trigger on scroll and resize
container.addEventListener('scroll', checkSlideVisibility);
window.addEventListener('resize', checkSlideVisibility);

// Trigger after arrow navigation
document.querySelector('.arrow-left').addEventListener('click', () => {
    scrollToIndex(currentIndex - 1);
    setTimeout(checkSlideVisibility, 300); // after smooth scroll
});
document.querySelector('.arrow-right').addEventListener('click', () => {
    scrollToIndex(currentIndex + 1);
    setTimeout(checkSlideVisibility, 300);
});

// Initial check
checkSlideVisibility();

