// Basic interactivity, e.g., alert on contact form (since static, no real submission)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We'll get back to you soon.');
        });
    }
});
