document.addEventListener('DOMContentLoaded', () => {
    // Animated Counters
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const update = () => {
                    const inc = target / 100;
                    if (count < target) {
                        count += inc;
                        entry.target.innerText = Math.ceil(count);
                        setTimeout(update, 20);
                    } else { entry.target.innerText = target; }
                };
                update();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 1 });
    counters.forEach(c => observer.observe(c));

    // Security: Anti-Right Click for Images
    document.addEventListener('contextmenu', e => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });
});
