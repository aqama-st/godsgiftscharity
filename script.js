// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href').slice(1);
            const target = document.getElementById(id);

            if (target) {
                const offsetTop = target.offsetTop - 120;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                target.querySelectorAll('.program-card, .story-card, .stat')
                    .forEach(el => el.classList.add('fade-in'));
            }
        });
    });

    // Button hovers
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
    });

    initAmountButtons();
    initFadeIns();
    animateCounters();

    // Attach donation form
    const donationForm = document.querySelector('.donation-form');
    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleDonationSubmit();
        });
    }

// Start slider if hero exists
    if (document.getElementById('hero')) {
        startHeroIfPresent();
    }

});


// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target')) || 0;

                let current = 0;
                const increment = target / 100;

                const update = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.floor(current).toLocaleString();
                        setTimeout(update, 20);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };

                update();
                obs.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}


// Fade-ins
function initFadeIns() {
    const elements = document.querySelectorAll('.program-card, .story-card, .stat');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}


// Fallback
if (!('IntersectionObserver' in window)) {
    window.addEventListener('load', () => {
        document.querySelectorAll('.program-card, .story-card, .stat')
            .forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
    });
}


// Hero slideshow (premium crossfade + Ken Burns)
let currentSlide = 0;
let sliderIntervalId = null;
let sliderStarted = false;

// Start once per page load
function startHeroIfPresent() {
    if (!document.getElementById('hero')) return;
    // keep existing logo fade behavior
    startSliderWithLogoFade();
}


function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setActiveSlide(index) {
    const track = document.getElementById('hero-slider-track');
    if (!track) return;

    const slides = track.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    const safeIndex = ((index % slides.length) + slides.length) % slides.length;

    slides.forEach((s, i) => {
        s.classList.toggle('is-active', i === safeIndex);
    });

    const dots = document.querySelectorAll('[data-hero-dots] .hero-dot');
    dots.forEach((dot, i) => {
        dot.setAttribute('aria-current', i === safeIndex ? 'true' : 'false');
    });
}

function nextSlide() {
    currentSlide = currentSlide + 1;
    setActiveSlide(currentSlide);
}

function prevSlide() {
    currentSlide = currentSlide - 1;
    setActiveSlide(currentSlide);
}

function buildDots() {
    const track = document.getElementById('hero-slider-track');
    const dotsWrap = document.querySelector('[data-hero-dots]');
    if (!track || !dotsWrap) return;

    const slides = track.querySelectorAll('.hero-slide');
    dotsWrap.innerHTML = '';

    slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hero-dot';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
        btn.setAttribute('aria-current', i === currentSlide ? 'true' : 'false');
        btn.addEventListener('click', () => {
            currentSlide = i;
            setActiveSlide(currentSlide);
        });
        dotsWrap.appendChild(btn);
    });
}

function startSliderWithLogoFade() {
    if (sliderStarted) return;
    sliderStarted = true;

    setTimeout(() => {
        const logo = document.querySelector('.hero-logo-large');
        if (logo) logo.classList.add('logo-fade-out');
    }, 500);

    buildDots();
    setActiveSlide(0);

    const nextBtn = document.querySelector('[data-hero-next]');
    const prevBtn = document.querySelector('[data-hero-prev]');

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); restartAutoplay(); });

    // Autoplay ~6s
    if (!prefersReducedMotion()) {
        sliderIntervalId = window.setInterval(nextSlide, 6000);
    }
}

function restartAutoplay() {
    if (prefersReducedMotion()) return;
    if (sliderIntervalId) window.clearInterval(sliderIntervalId);
    sliderIntervalId = window.setInterval(nextSlide, 6000);
}



// Amount buttons
function initAmountButtons() {
    const buttons = document.querySelectorAll('.amount-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}


// ✅ FIXED Donation handler
function handleDonationSubmit() {
    const activeBtn = document.querySelector('.amount-btn.active');
    const customInput = document.getElementById('custom-amount');
    const frequencySelect = document.getElementById('frequency');
    const coverFeesCheckbox = document.getElementById('cover-fees');

    let amount = activeBtn ? parseFloat(activeBtn.dataset.amount) : 0;
    const customAmount = customInput ? parseFloat(customInput.value) : 0;

    // Custom overrides preset
    if (customAmount > 0) {
        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
        amount = customAmount;
    }

    if (!amount || amount <= 0) {
        alert('Please enter a valid donation amount.');
        return;
    }

    const frequency = frequencySelect ? frequencySelect.value : 'one-time';
    const coverFees = coverFeesCheckbox ? coverFeesCheckbox.checked : false;

    const formCard = document.querySelector('.donation-form-card');
    const thankYouMessage = document.getElementById('thank-you-message');
    const thankYouDetails = document.getElementById('thank-you-details');

    if (formCard) formCard.style.display = 'none';

    if (thankYouDetails) {
        thankYouDetails.innerHTML = `
            <strong>Amount:</strong> $${amount.toLocaleString()} USD<br>
            <strong>Frequency:</strong> ${frequency}<br>
            <strong>Cover transaction fees:</strong> ${coverFees ? 'Yes' : 'No'}
        `;
    }

    if (thankYouMessage) {
        thankYouMessage.style.display = 'block';
        thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    console.log('Donation data:', { amount, frequency, coverFees });
}


// Modal
function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Partnership Modal
function openPartnerModal() {
    const modal = document.getElementById('partner-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closePartnerModal() {
    const modal = document.getElementById('partner-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}


// ESC close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeContactModal();
        closePartnerModal();
    }
});
