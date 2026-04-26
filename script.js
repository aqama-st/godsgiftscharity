// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (target) {
            const offsetTop = target.offsetTop - 120;
            console.log(`Scrolling to ${href} (id: ${id}), top: ${offsetTop}`);
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            // Trigger fade-ins
            target.querySelectorAll('.program-card, .story-card, .stat').forEach(el => el.classList.add('fade-in'));
        } else {
            console.error(`Target not found: ${href} (id: ${id})`);
        }
    });
});

// Animated counters for impact stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current).toLocaleString();
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        });
        observer.observe(counter);
    });
}

// Fade-in animations on scroll
function initFadeIns() {
    const elements = document.querySelectorAll('.program-card, .story-card, .stat');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

// IntersectionObserver fallback
if ('IntersectionObserver' in window === false) {
    window.addEventListener('load', () => {
        document.querySelectorAll('.program-card, .story-card, .stat').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAmountButtons();
    initFadeIns();
    animateCounters();
});

// Button hovers
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
    btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
});

// Hero slideshow with logo fade
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
    currentSlide = (currentSlide + 1) % heroImages.length;
    const hero = document.getElementById('hero');
    if (hero) {
        hero.style.backgroundImage = `url('${heroImages[currentSlide]}')`;
    }
}

// Logo fade-out on slider start
let sliderStarted = false;
function startSliderWithLogoFade() {
    if (sliderStarted) return;
    sliderStarted = true;
    
    // Fade out logo after short delay when slider starts
    setTimeout(() => {
        const logo = document.querySelector('.hero-logo-large');
        if (logo) {
            logo.classList.add('logo-fade-out');
        }
    }, 500); // Small delay to sync with first slide change
    
    // Start slideshow
    setInterval(nextSlide, 3000);
}

// Initialize slideshow only on index.html hero page (no hero section on about.html)
if (document.getElementById('hero') && window.location.pathname.includes('index.html')) {
    startSliderWithLogoFade();
}

// Amount button selection logic
function initAmountButtons() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    amountButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            amountButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Donation form handler
function handleDonationSubmit() {
    const activeBtn = document.querySelector('.amount-btn.active');
    const customAmountInput = document.getElementById('custom-amount');
    const frequencySelect = document.getElementById('frequency');
    const coverFeesCheckbox = document.getElementById('cover-fees');

    let amount = '';
    if (activeBtn) {
        amount = activeBtn.getAttribute('data-amount');
    }
    
    const customAmount = customAmountInput ? customAmountInput.value : '';
    
    if (customAmount && customAmount > 0) {
        amount = customAmount;
    }
    
    if (!amount || amount <= 0) {
        alert('Please select a preset amount or enter a custom amount.');
        return;
    }
    
    const frequency = frequencySelect ? frequencySelect.value : 'one-time';
    const coverFees = coverFeesCheckbox ? coverFeesCheckbox.checked : false;
    
    // Hide form and show thank you message
    const formCard = document.querySelector('.donation-form-card');
    const thankYouMessage = document.getElementById('thank-you-message');
    const thankYouDetails = document.getElementById('thank-you-details');
    
    if (formCard) formCard.style.display = 'none';
    
    if (thankYouDetails) {
        thankYouDetails.innerHTML = `
            <strong>Amount:</strong> $${parseFloat(amount).toLocaleString()} USD<br>
            <strong>Frequency:</strong> ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}<br>
            <strong>Cover transaction fees:</strong> ${coverFees ? 'Yes' : 'No'}
        `;
    }
    
    if (thankYouMessage) {
        thankYouMessage.style.display = 'block';
        thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    console.log('Donation data:', { amount, frequency, coverFees });
}

// Contact modal functions
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

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeContactModal();
    }
});
