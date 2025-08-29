/**
 * Main script file for StrategixAI website.
 * This script handles:
 * 1. Navbar scroll effects.
 * 2. Hero audio demo playback.
 * 3. An auto-playing projects carousel with hover-pause functionality.
 * 4. A flipping testimonials card.
 * 5. An accordion for the FAQ section.
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Main initialization function that runs after the DOM is loaded.
     */
    function init() {
        initNavbarScroll();
        initHeroDemo();
        initProjectsCarousel();
        initTestimonialsFlip();
        initFaqAccordion();
    }

    /**
     * Adds a 'scrolled' class to the navbar when the page is scrolled.
     */
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /**
     * Manages the play/pause functionality for the hero audio demo.
     */
    function initHeroDemo() {
        const demoButton = document.getElementById('hero-demo-button');
        const audio = document.getElementById('hero-audio-demo');
        const waveform = document.querySelector('.hero-waveform-container');

        if (!demoButton || !audio || !waveform) return;

        const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8 5v14l11-7z"/></svg> Demo Our AI`;
        const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Stop Demo`;

        const resetDemoState = () => {
            waveform.classList.remove('playing');
            demoButton.innerHTML = playIcon;
            audio.currentTime = 0;
        };

        demoButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                waveform.classList.add('playing');
                demoButton.innerHTML = pauseIcon;
            } else {
                audio.pause();
                resetDemoState();
            }
        });

        audio.onended = resetDemoState;
    }

    /**
     * Initializes the projects carousel with auto-play and hover-pause functionality.
     */
    function initProjectsCarousel() {
        const track = document.querySelector('#projects .carousel-track');
        const cards = document.querySelectorAll('.project-card');
        const dotsContainer = document.querySelector('#projects .carousel-dots');
        const carouselContainer = document.querySelector('#projects .carousel-container');

        if (!track || cards.length === 0 || !dotsContainer || !carouselContainer) return;

        const cardsPerPage = 3;
        const totalPages = Math.ceil(cards.length / cardsPerPage);
        let currentPage = 0;
        let autoplayInterval;

        if (totalPages <= 1) return; // No need for carousel logic if not enough pages

        // Create navigation dots
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentPage = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
        const dots = dotsContainer.querySelectorAll('.dot');

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth;
            const margin = parseFloat(getComputedStyle(cards[0]).marginRight) * 2;
            const moveDistance = (cardWidth + margin) * cardsPerPage * currentPage;
            track.style.transform = `translateX(-${moveDistance}px)`;

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentPage);
            });
        }

        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                currentPage = (currentPage + 1) % totalPages;
                updateCarousel();
            }, 8000); // Change slide every 8 seconds
        }

        // Add this function call inside your main init() function if you have one,
// or just place the function in your script.js file.

/**
 * Initializes the responsive hamburger menu.
 * Toggles the 'active' class on the menu and hamburger button on click.
 */
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open'); // Toggles body scroll
    });
}

// Make sure to call the function
initHamburgerMenu();// Add this function call inside your main init() function if you have one,
// or just place the function in your script.js file.

/**
 * Initializes the responsive hamburger menu.
 * Toggles the 'active' class on the menu and hamburger button on click.
 */
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open'); // Toggles body scroll
    });
}

// Make sure to call the function
initHamburgerMenu();

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        carouselContainer.addEventListener('mouseover', stopAutoplay);
        carouselContainer.addEventListener('mouseout', startAutoplay);
        window.addEventListener('resize', updateCarousel);
        
        updateCarousel(); // Initial call
        startAutoplay();  // Start autoplay
    }

    /**
     * Manages the flipping behavior of the testimonials card.
     */
    function initTestimonialsFlip() {
        const carousel = document.querySelector('#testimonials .testimonial-carousel');
        const flipButtons = document.querySelectorAll('#testimonials .prev, #testimonials .next');

        if (!carousel || flipButtons.length === 0) return;

        flipButtons.forEach(button => {
            button.addEventListener('click', () => {
                carousel.classList.toggle('is-flipped');
            });
        });
    }

    /**
     * Manages the accordion functionality for the FAQ section.
     */
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const currentlyActive = document.querySelector('.faq-item.active');
                    if (currentlyActive && currentlyActive !== item) {
                        currentlyActive.classList.remove('active');
                    }
                    item.classList.toggle('active');
                });
            }
        });
    }

    // Run all initialization functions
    init();

});