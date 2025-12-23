/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // Counter Animation Logic
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Trigger animation when Impact section is in view
    let options = { threshold: 0.5 };
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, options);

    const targetSection = document.querySelector('#impact-section');
    if(targetSection) {
        observer.observe(targetSection);
    }
});
