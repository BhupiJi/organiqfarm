// OrganiqFarm 2026 - Main JavaScript File

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main Initialization Function
function initializeWebsite() {
    // Initialize all components
    initializeMobileMenu();
    initializeAnimatedCounters();
    initializeBlogPagination();
    initializeFormValidation();
    initializeSmoothScrolling();
    initializeWeatherWidget();
    initializeChartData();
    initializeDownloadCalculators();
    initializeImageLazyLoading();
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
    
    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

// Animated Counters
function initializeAnimatedCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / (target / increment)));
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, stepTime);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Blog Pagination
function initializeBlogPagination() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    
    const blogsPerPage = 4;
    let currentPage = 1;
    
    // Create blog cards from the blogs data (if available)
    if (typeof blogs !== 'undefined') {
        displayBlogs(currentPage);
        setupPagination();
    }
    
    function displayBlogs(page) {
        blogGrid.innerHTML = '';
        const startIndex = (page - 1) * blogsPerPage;
        const endIndex = startIndex + blogsPerPage;
        const pageBlogs = blogs.slice(startIndex, endIndex);
        
        pageBlogs.forEach(blog => {
            const blogCard = createBlogCard(blog);
            blogGrid.appendChild(blogCard);
        });
    }
    
    function createBlogCard(blog) {
        const card = document.createElement('a');
        card.href = `blog-post-${blog.id}.html`;
        card.className = 'blog-card';
        
        card.innerHTML = `
            <div class="blog-card-image">
                <img src="${blog.image}" alt="${blog.title}" loading="lazy">
            </div>
            <div class="blog-card-content">
                <span class="blog-card-category">${blog.category}</span>
                <span class="blog-card-date">${blog.date}</span>
                <h3 class="blog-card-title">${blog.title}</h3>
                <p class="blog-card-excerpt">${blog.description}</p>
            </div>
        `;
        
        return card;
    }
    
    function setupPagination() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pageNumbers = document.getElementById('pageNumbers');
        
        if (!prevBtn || !nextBtn || !pageNumbers) return;
        
        const totalPages = Math.ceil(blogs.length / blogsPerPage);
        
        // Update page numbers
        pageNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                updatePagination();
            });
            pageNumbers.appendChild(pageNumber);
        }
        
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
            }
        });
        
        function updatePagination() {
            displayBlogs(currentPage);
            
            // Update active page number
            document.querySelectorAll('.page-number').forEach((page, index) => {
                page.classList.toggle('active', index + 1 === currentPage);
            });
            
            // Update button states
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;
            
            // Scroll to top of blog grid
            blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Initial button states
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }
}

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form:not(.newsletter-form)');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    showError(input, 'This field is required');
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    showError(input, 'Please enter a valid email address');
                } else {
                    clearError(input);
                }
            });
            
            if (isValid) {
                // In a real application, you would submit the form here
                // For now, we'll show a success message
                showFormSuccess(form);
            }
        });
    });
    
    function showError(input, message) {
        clearError(input);
        
        const error = document.createElement('div');
        error.className = 'form-error';
        error.textContent = message;
        error.style.color = '#f44336';
        error.style.fontSize = '0.8rem';
        error.style.marginTop = '5px';
        
        input.parentNode.appendChild(error);
        input.style.borderColor = '#f44336';
    }
    
    function clearError(input) {
        const error = input.parentNode.querySelector('.form-error');
        if (error) {
            error.remove();
        }
        input.style.borderColor = '';
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showFormSuccess(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            const successMsg = document.createElement('div');
            successMsg.className = 'form-success';
            successMsg.innerHTML = `
                <div style="background: #4CAF50; color: white; padding: 15px; border-radius: 5px; margin-top: 20px;">
                    <strong>✓ Success!</strong> Your message has been sent. We'll get back to you soon.
                </div>
            `;
            
            form.appendChild(successMsg);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 5000);
        }, 1500);
    }
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Weather Widget
function initializeWeatherWidget() {
    // This is a simplified version - in production, you'd use a real API
    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget) return;
    
    // Simulate weather data
    const weatherData = {
        temperature: 22,
        condition: 'Sunny',
        humidity: 65,
        windSpeed: 12,
        location: 'Farm Location'
    };
    
    updateWeatherWidget(weatherData);
    
    // Update weather every 30 minutes
    setInterval(() => {
        // In production, fetch fresh data from API
        updateWeatherWidget(weatherData);
    }, 30 * 60 * 1000);
}

function updateWeatherWidget(data) {
    const widget = document.getElementById('weatherWidget');
    if (widget) {
        widget.innerHTML = `
            <div class="weather-widget">
                <div class="weather-temp">${data.temperature}°C</div>
                <div class="weather-condition">${data.condition}</div>
                <div class="weather-details">
                    <span>Humidity: ${data.humidity}%</span>
                    <span>Wind: ${data.windSpeed} km/h</span>
                </div>
                <div class="weather-location">${data.location}</div>
            </div>
        `;
    }
}

// Chart Data Visualization
function initializeChartData() {
    // This would initialize charts if Chart.js is loaded
    // Check if we're on a page that needs charts
    if (document.querySelector('.chart-container')) {
        // Charts are initialized inline in facts.html
    }
}

// Download Calculators
function initializeDownloadCalculators() {
    const downloadCards = document.querySelectorAll('.download-card');
    
    downloadCards.forEach(card => {
        const priceElement = card.querySelector('.download-price');
        const conversionElement = card.querySelector('.download-conversion');
        
        if (priceElement && conversionElement) {
            const usdPrice = parseFloat(priceElement.textContent.replace('$', ''));
            if (!isNaN(usdPrice)) {
                // Convert USD to INR (approximate rate)
                const inrPrice = usdPrice * 83; // Current approximate rate
                conversionElement.textContent = `Approx. ₹${inrPrice.toFixed(0)} INR`;
            }
        }
    });
}

// Image Lazy Loading
function initializeImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Newsletter Form
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate subscription
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for subscribing to our newsletter!');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                emailInput.value = '';
            }, 1000);
        });
    });
});

// Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-green);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.transform = 'translateY(-3px)';
        backToTopBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    });
    
    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.transform = 'translateY(0)';
        backToTopBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
}

// Initialize back to top button
initializeBackToTop();

// Cookie Consent Banner
function initializeCookieConsent() {
    if (!localStorage.getItem('cookiesAccepted')) {
        const consentBanner = document.createElement('div');
        consentBanner.className = 'cookie-consent';
        consentBanner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to enhance your browsing experience and analyze site traffic. By continuing to use our site, you consent to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button class="cookie-accept">Accept</button>
                    <button class="cookie-decline">Decline</button>
                </div>
            </div>
        `;
        
        consentBanner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            z-index: 1001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        document.body.appendChild(consentBanner);
        
        // Style the cookie content
        const cookieContent = consentBanner.querySelector('.cookie-content');
        cookieContent.style.maxWidth = '1200px';
        cookieContent.style.display = 'flex';
        cookieContent.style.justifyContent = 'space-between';
        cookieContent.style.alignItems = 'center';
        cookieContent.style.gap = '20px';
        
        // Style the buttons
        const buttons = consentBanner.querySelectorAll('.cookie-accept, .cookie-decline');
        buttons.forEach(btn => {
            btn.style.padding = '10px 25px';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.cursor = 'pointer';
            btn.style.fontWeight = '600';
            btn.style.transition = 'all 0.3s ease';
        });
        
        const acceptBtn = consentBanner.querySelector('.cookie-accept');
        acceptBtn.style.background = 'var(--primary-green)';
        acceptBtn.style.color = 'white';
        
        const declineBtn = consentBanner.querySelector('.cookie-decline');
        declineBtn.style.background = 'transparent';
        declineBtn.style.color = 'white';
        declineBtn.style.border = '2px solid white';
        
        // Add event listeners
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            consentBanner.style.display = 'none';
        });
        
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'false');
            consentBanner.style.display = 'none';
        });
    }
}

// Initialize cookie consent
initializeCookieConsent();

// Page Load Progress Bar
function initializeProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'page-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--primary-green);
        z-index: 1002;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = (window.pageYOffset / documentHeight) * 100;
        
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize progress bar
initializeProgressBar();

// Print Functionality for Blog Posts
function initializePrintFunctionality() {
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '🖨️ Print';
    printBtn.className = 'print-button';
    printBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        background: var(--primary-green);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: none;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(printBtn);
    
    // Only show on blog post pages
    if (document.querySelector('.blog-post')) {
        printBtn.style.display = 'block';
        
        printBtn.addEventListener('click', () => {
            const printContent = document.querySelector('.blog-post-main').innerHTML;
            const originalContent = document.body.innerHTML;
            
            document.body.innerHTML = `
                <div style="padding: 40px; max-width: 800px; margin: 0 auto;">
                    ${printContent}
                    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 0.9rem;">
                        Printed from OrganiqFarm.com - ${new Date().toLocaleDateString()}
                    </div>
                </div>
            `;
            
            window.print();
            
            // Restore original content
            document.body.innerHTML = originalContent;
            initializeWebsite(); // Reinitialize scripts
        });
    }
}

// Initialize print functionality
initializePrintFunctionality();

// Theme Switcher (Light/Dark Mode)
function initializeThemeSwitcher() {
    const themeBtn = document.createElement('button');
    themeBtn.innerHTML = '🌙';
    themeBtn.className = 'theme-switcher';
    themeBtn.title = 'Toggle Dark Mode';
    themeBtn.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-green);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(themeBtn);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        enableDarkMode();
        themeBtn.innerHTML = '☀️';
    }
    
    themeBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
            themeBtn.innerHTML = '🌙';
        } else {
            enableDarkMode();
            themeBtn.innerHTML = '☀️';
        }
    });
    
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
    
    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
}

// Initialize theme switcher
initializeThemeSwitcher();

// Add dark mode CSS
const darkModeCSS = `
    body.dark-mode {
        background: #121212;
        color: #e0e0e0;
    }
    
    body.dark-mode .navbar {
        background: rgba(30, 30, 30, 0.95);
    }
    
    body.dark-mode .nav-menu a {
        color: #e0e0e0;
    }
    
    body.dark-mode .feature-card,
    body.dark-mode .blog-card,
    body.dark-mode .comparison-card,
    body.dark-mode .support-card,
    body.dark-mode .download-card {
        background: #1e1e1e;
        color: #e0e0e0;
    }
    
    body.dark-mode .footer {
        background: #0a0a0a;
    }
`;

const style = document.createElement('style');
style.textContent = darkModeCSS;
document.head.appendChild(style);
