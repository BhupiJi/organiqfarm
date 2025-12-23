document.addEventListener('DOMContentLoaded', () => {
    // 1. STATS COUNTER ANIMATION
    const counters = document.querySelectorAll('.counter');
    const animate = (el) => {
        const target = +el.getAttribute('data-target');
        let count = 0;
        const update = () => {
            const inc = target / 80;
            if (count < target) {
                count += inc;
                el.innerText = Math.ceil(count);
                setTimeout(update, 15);
            } else { el.innerText = target; }
        };
        update();
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 });
    counters.forEach(c => observer.observe(c));

    // 2. SECURITY: DISABLE RIGHT CLICK & DRAG
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = (e) => {
        if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0)))) return false;
    };
});
