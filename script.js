// Smooth scrolling for anchor links
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
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
    'IMG_9053.JPG',
    'IMG_9071.JPG',
    'IMG_9183.JPG',
    'IMG_9234.JPG',
    'IMG_E9022.JPG',
    'GridArt_20250323_174730792.jpg'
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

// Donation form handler (demo)
function handleDonationSubmit() {
    const amountRadios = document.querySelectorAll('input[name="amount"]:checked');
    const customAmount = document.querySelector('input[name="custom-amount"]').value;
    const frequency = document.querySelector('input[name="frequency"]:checked')?.value || 'one-time';
    const transactionCharge = document.querySelector('input[name="transaction-charge"]:checked')?.value || 'no';
    
    let amount = '';
    if (amountRadios.length > 0) {
        amount = amountRadios[0].value;
    } else if (customAmount && customAmount > 0) {
        amount = customAmount;
    } else {
        alert('Please select a preset amount or enter a custom amount.');
        return;
    }
    
    const message = `Thank you for your donation!\n\nSummary:
Amount: $${amount} USD
Frequency: ${frequency}
Cover transaction charges: ${transactionCharge === 'yes' ? 'Yes' : 'No'}

Demo: In production, this would redirect to PayPal, Flutterwave, or Stripe checkout with these parameters.`;
    
    alert(message);
    
    // Simulate payment redirect
    console.log('Donation data:', { amount, frequency, transactionCharge });
}

