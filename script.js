// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Simulate successful subscription
                emailInput.value = '';
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.innerHTML = `
                    <div style="background: #4caf50; color: white; padding: 15px; border-radius: 8px; margin-top: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-check-circle"></i>
                        <span>Thank you! Check your email for the free Starter Kit.</span>
                    </div>
                `;
                this.appendChild(successMsg);
                
                // Remove message after 5 seconds
                setTimeout(() => successMsg.remove(), 5000);
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            // Check if it's an external link with hash
            if (href.includes('#')) {
                const [path, hash] = href.split('#');
                if (path && path !== window.location.pathname) {
                    return; // Let normal navigation handle it
                }
            }
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add click handlers to cards
    document.querySelectorAll('.feature-card, .guide-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a link inside
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            const link = this.querySelector('a');
            if (link) {
                window.location.href = link.href;
            }
        });
        
        // Add hover effect for clickable cards
        card.style.cursor = 'pointer';
    });
