/**
 * OrganiqFarm Portal - Core Interactivity 2026
 * Features: Smooth Scroll, Animated Stats, Glassmorphism Scroll Effect
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navbar Effect on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.background = 'rgba(5, 8, 1, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'rgba(5, 8, 1, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 2. Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Animated Stats Counter
    const stats = document.querySelectorAll('.stat-item h3');
    const speed = 200;

    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseFloat(stat.innerText.replace(/[^0-9.]/g, ''));
            const suffix = stat.innerText.replace(/[0-9.]/g, ''); // Keep %, k, -, etc.
            
            const updateCount = () => {
                const count = +stat.getAttribute('data-count') || 0;
                const inc = target / speed;

                if (count < target) {
                    stat.setAttribute('data-count', count + inc);
                    stat.innerText = Math.ceil(count + inc) + suffix;
                    setTimeout(updateCount, 1);
                } else {
                    stat.innerText = target + suffix;
                }
            };
            updateCount();
        });
    };

    // Trigger animation when stats section is in view
    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateStats();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // 4. Card Hover Reveal Effect (Console Log for Debugging)
    console.log("OrganiqFarm Engine 2026 Active - Secured by Cloudflare");
});
