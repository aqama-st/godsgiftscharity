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
    if (document.getElementById('hero') && window.location.pathname.includes('index.html')) {
        startSliderWithLogoFade();
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


// Hero slideshow
let currentSlide = 0;

const heroImages = [
    'images/IMG_9053.JPG',
    'images/IMG_9071.JPG',
    'images/IMG_9183.JPG',
    'images/IMG_9234.JPG',
    'images/IMG_E9022.JPG',
    'images/GridArt_20250323_174730792.jpg'
];

function nextSlide() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    currentSlide = (currentSlide + 1) % heroImages.length;
    hero.style.backgroundImage = `url('${heroImages[currentSlide]}')`;
}

let sliderStarted = false;

function startSliderWithLogoFade() {
    if (sliderStarted) return;
    sliderStarted = true;

    setTimeout(() => {
        const logo = document.querySelector('.hero-logo-large');
        if (logo) logo.classList.add('logo-fade-out');
    }, 500);

    setInterval(nextSlide, 3000);
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
