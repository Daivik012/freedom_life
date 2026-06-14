/* ==========================================
   FreedomLife Core Interactive Script
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Mobile Menu Toggle
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const isOpen = navMenu.classList.contains('open');
            navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });

        // Close menu when links are clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    // ==========================================
    // 2. Navigation Scrollspy
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    function scrollSpy() {
        const scrollPosition = window.scrollY + 120; // offset for sticky header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // run once on load

    // ==========================================
    // 3. Success Stories Carousel / Slider
    // ==========================================
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const indicators = Array.from(document.querySelectorAll('.indicator'));
    
    let currentIndex = 0;

    function updateCarousel(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentIndex = index;

        // Move track
        const amountToMove = -currentIndex * 100;
        track.style.transform = `translateX(${amountToMove}%)`;

        // Update active slide class (for fade effect/styling if needed)
        slides.forEach((slide, idx) => {
            if (idx === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update indicators
        indicators.forEach((ind, idx) => {
            if (idx === currentIndex) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
        prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));

        indicators.forEach((indicator, idx) => {
            indicator.addEventListener('click', () => updateCarousel(idx));
        });
    }

    // ==========================================
    // 4. Is This For You? Fit Score Gauge
    // ==========================================
    const checkboxes = document.querySelectorAll('.qualify-checkbox');
    const gaugeProgress = document.getElementById('gaugeProgress');
    const gaugeValueText = document.getElementById('gaugeValue');
    const gaugeFeedback = document.getElementById('gaugeFeedback');
    const gaugeAction = document.getElementById('gaugeAction');

    // SVGs stroke-dashoffset parameters:
    // The gauge path has stroke-dasharray="125.6" (π * r, where r is 40).
    // offset 125.6 means 0% filled, offset 0 means 100% filled.
    const maxOffset = 125.6;

    function calculateFitScore() {
        let totalScore = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                totalScore += parseInt(checkbox.getAttribute('data-score'), 10);
            }
        });

        // Update value text
        gaugeValueText.textContent = `${totalScore}%`;

        // Update SVG gauge fill path
        const offset = maxOffset - (totalScore / 100) * maxOffset;
        gaugeProgress.style.strokeDashoffset = offset;

        // Dynamic Feedback styling and text
        let heading = "";
        let text = "";

        if (totalScore === 0) {
            heading = "Please select items to calculate compatibility.";
            text = "Tick the boxes on the left to evaluate your lifestyle alignment with FreedomLife.";
            gaugeAction.classList.add('hidden');
        } else if (totalScore <= 20) {
            heading = "Curious / Exploratory Alignment";
            text = "You are starting to question the corporate grind. Learn more about health and legacy assets.";
            gaugeAction.classList.add('hidden');
        } else if (totalScore <= 60) {
            heading = "Moderate Alignment";
            text = "You want more control over your time and value health. FreedomLife can bridge this gap for you.";
            gaugeAction.classList.remove('hidden');
        } else if (totalScore <= 80) {
            heading = "Strong Alignment!";
            text = "You are a wellness enthusiast looking to design a global lifestyle. The Enagic system fits you perfectly.";
            gaugeAction.classList.remove('hidden');
        } else {
            heading = "Perfect Alignment!";
            text = "You are fully aligned with the FreedomLife vision. We recommend booking a call immediately to secure your blueprint.";
            gaugeAction.classList.remove('hidden');
        }

        gaugeFeedback.innerHTML = `
            <p class="feedback-heading text-gold">${heading}</p>
            <p class="feedback-text">${text}</p>
        `;
    }

    if (checkboxes.length > 0) {
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', calculateFitScore);
        });
        calculateFitScore(); // Initialize on page load
    }

    // ==========================================
    // 5. Consultation Form Handling & Validation
    // ==========================================
    const form = document.getElementById('consultationForm');
    const formWrapper = document.getElementById('formWrapper');
    const formSuccess = document.getElementById('formSuccess');
    const successName = document.getElementById('successName');
    const resetFormBtn = document.getElementById('resetFormBtn');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple client-side validation check
            const nameVal = document.getElementById('fullName').value.trim();
            const emailVal = document.getElementById('emailAddress').value.trim();
            const phoneVal = document.getElementById('phoneNumber').value.trim();

            if (!nameVal || !emailVal || !phoneVal) {
                alert('Please fill out all required fields.');
                return;
            }

            // Animate transition to success state
            form.classList.add('hidden');
            successName.textContent = nameVal;
            formSuccess.classList.remove('hidden');
        });
    }

    if (resetFormBtn && form) {
        resetFormBtn.addEventListener('click', () => {
            form.reset();
            formSuccess.classList.add('hidden');
            form.classList.remove('hidden');
        });
    }

    // ==========================================
    // 6. Mock PDF Download Guide Trigger
    // ==========================================
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            // Animate downloading feeling
            const originalText = downloadPdfBtn.textContent;
            downloadPdfBtn.disabled = true;
            downloadPdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing PDF Blueprint...';
            
            setTimeout(() => {
                downloadPdfBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Downloaded Successfully';
                alert("FreedomLife Project Overview Blueprint has been generated!\n\nDetails:\n- File: FreedomLife_Enagic_Project_Overview.pdf\n- Content: Core Business philosophy, the 8-Point Compensation Matrix, and Kangen Water scientific certificates overview.\n\nCheck your browser's downloaded files list!");
                
                setTimeout(() => {
                    downloadPdfBtn.disabled = false;
                    downloadPdfBtn.textContent = originalText;
                }, 3000);
            }, 1500);
        });
    }
});
