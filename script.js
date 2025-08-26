  const container = document.querySelector('.scroll-container');
  const sections = document.querySelectorAll('.section');
  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;

  const leftArrow = document.querySelector('.arrow-left');
  const rightArrow = document.querySelector('.arrow-right');

  let isHoveringPortfolio = false;
  let isHoveringServices = false;
  let isHoveringResources = false;



// H1 elements
// Grab all your slide <h1> elements
const headings = document.querySelectorAll('.section h1');

// Set up observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-underline');
      observer.unobserve(entry.target); // stop watching once animated
    }
  });
}, { 
  root: container,   // 👈 this tells it to use your scroll-container
  threshold: 0.3     // trigger when at least 30% of heading is visible
});

// Attach observer to each heading
headings.forEach(h1 => observer.observe(h1));





  // Scroll to section
  function scrollToIndex(index) {
      if (index < 0) index = 0;
      if (index >= sections.length) index = sections.length - 1;
      currentIndex = index;
      sections[index].scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
      updateDots();
      updateArrows();
  }

  // Update arrows
  function updateArrows() {
      leftArrow.classList.toggle('show', currentIndex > 0);
      rightArrow.classList.toggle('show', currentIndex < sections.length - 1);
  }

  // Update dots
  function updateDots() {
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
  }

  // Arrow click events
  leftArrow.addEventListener('click', () => scrollToIndex(currentIndex - 1));
  rightArrow.addEventListener('click', () => scrollToIndex(currentIndex + 1));

  // Dots click
  dots.forEach(dot => {
      dot.addEventListener('click', () => scrollToIndex(parseInt(dot.dataset.index)));
  });

  // Track hover for portfolio/services
  const portfolioList = document.querySelector('#portfolio-section .card-list');
  if (portfolioList) {
      portfolioList.addEventListener('mouseenter', () => isHoveringPortfolio = true);
      portfolioList.addEventListener('mouseleave', () => isHoveringPortfolio = false);
  }

  const servicesList = document.querySelector('#services-section .card-list');
  if (servicesList) {
      servicesList.addEventListener('mouseenter', () => isHoveringServices = true);
      servicesList.addEventListener('mouseleave', () => isHoveringServices = false);
  }

  // Update dots on manual scroll
  container.addEventListener('scroll', () => {
      const newIndex = Math.round(container.scrollLeft / window.innerWidth);
      if (newIndex !== currentIndex) {
          currentIndex = newIndex;
          updateDots();
          updateArrows();
      }
  });

  // Init
  updateDots();
  updateArrows();







  // Portfolio section scroll
if (portfolioList) {
    portfolioList.addEventListener('wheel', (e) => {
        e.stopPropagation(); // <-- stop container from also firing
        e.preventDefault();

        const containerCenter = portfolioList.offsetWidth / 2;
        const scrollLeft = portfolioList.scrollLeft;

        const cards = portfolioList.querySelectorAll('.card-item');

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

        let targetIndex = closestIndex;
        if (e.deltaY > 0 && closestIndex < cards.length - 1) targetIndex++;
        if (e.deltaY < 0 && closestIndex > 0) targetIndex--;

        const targetCard = cards[targetIndex];
        const scrollPos = targetCard.offsetLeft - containerCenter + (targetCard.offsetWidth / 2);
        portfolioList.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }, { passive: false });
}



// Resources section scroll
const resourcesList = document.querySelector('#resources-section .card-list');

if (resourcesList) {
    resourcesList.addEventListener('wheel', (e) => {
        e.stopPropagation(); // <-- stop container from also firing
        e.preventDefault();

        const containerCenter = resourcesList.offsetWidth / 2;
        const scrollLeft = resourcesList.scrollLeft;

        const cards = resourcesList.querySelectorAll('.card-item');

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

        let targetIndex = closestIndex;
        if (e.deltaY > 0 && closestIndex < cards.length - 1) targetIndex++;
        if (e.deltaY < 0 && closestIndex > 0) targetIndex--;

        const targetCard = cards[targetIndex];
        const scrollPos = targetCard.offsetLeft - containerCenter + (targetCard.offsetWidth / 2);
        resourcesList.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }, { passive: false });
}




// Services section scroll
if (servicesList) {
    servicesList.addEventListener('wheel', (e) => {
        e.stopPropagation(); // <-- prevent container scroll
        e.preventDefault();

        const containerCenter = servicesList.offsetWidth / 2;
        const scrollLeft = servicesList.scrollLeft;
        const cards = servicesList.querySelectorAll('.card-item');

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
        servicesList.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }, { passive: false });
}





  // Single container wheel listener
container.addEventListener('wheel', (e) => {
    // Only hijack vertical scrolling if not over portfolio/services
    if (!isHoveringPortfolio && !isHoveringServices) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { // vertical dominates
            e.preventDefault();
            if (e.deltaY > 0) scrollToIndex(currentIndex + 1);
            else if (e.deltaY < 0) scrollToIndex(currentIndex - 1);
        }
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

