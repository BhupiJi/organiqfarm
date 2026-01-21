// ============================================
// ORGANIQFARM - COMPLETE JAVASCRIPT FILE
// All interactivity and functionality
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollTop();
    initCounters();
    initWeather();
    initBlogPagination();
    initQuiz();
    initContactForm();
    initPaymentButtons();
    initDownloads();
    initCharts();
    initToast();
    
    // Set active navigation menu
    setActiveMenu();
});

// ============================================
// NAVIGATION & MOBILE MENU
// ============================================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (linkPage.includes(currentPage) && currentPage !== '')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

function initScrollTop() {
    const scrollButton = document.createElement('div');
    scrollButton.className = 'scroll-top';
    scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// ANIMATED COUNTERS
// ============================================

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current) + '+';
                        setTimeout(updateCounter, 16);
                    } else {
                        counter.textContent = target + '+';
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ============================================
// WEATHER WIDGET
// ============================================

async function initWeather() {
    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget) return;
    
    try {
        // Get user location
        if (!navigator.geolocation) {
            showToast('Geolocation is not supported by your browser', 'error');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Using OpenWeatherMap API (You need to replace with your API key)
            const apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace with actual API key
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
            );
            
            if (!response.ok) throw new Error('Weather data not available');
            
            const data = await response.json();
            
            // Update weather widget
            document.getElementById('weatherLocation').textContent = data.name;
            document.getElementById('weatherTemp').textContent = Math.round(data.main.temp) + '°C';
            document.getElementById('weatherDesc').textContent = data.weather[0].description;
            document.getElementById('weatherHumidity').textContent = data.main.humidity + '%';
            document.getElementById('weatherWind').textContent = data.wind.speed + ' m/s';
            
            // Get weather icon
            const iconCode = data.weather[0].icon;
            document.getElementById('weatherIcon').innerHTML = 
                `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;
                
        }, (error) => {
            console.error('Geolocation error:', error);
            showToast('Unable to retrieve location for weather data', 'error');
        });
        
    } catch (error) {
        console.error('Weather fetch error:', error);
        showToast('Weather service temporarily unavailable', 'error');
    }
}

// ============================================
// BLOG PAGINATION
// ============================================

function initBlogPagination() {
    const blogContainer = document.getElementById('blogContainer');
    if (!blogContainer) return;
    
    const blogs = Array.from(blogContainer.children);
    const blogsPerPage = 4;
    let currentPage = 1;
    
    function showPage(page) {
        const start = (page - 1) * blogsPerPage;
        const end = start + blogsPerPage;
        
        blogs.forEach((blog, index) => {
            blog.style.display = (index >= start && index < end) ? 'block' : 'none';
        });
        
        // Update pagination buttons
        updatePaginationButtons(page);
    }
    
    function updatePaginationButtons(page) {
        const totalPages = Math.ceil(blogs.length / blogsPerPage);
        const pagination = document.querySelector('.pagination');
        
        if (pagination) {
            pagination.innerHTML = '';
            
            if (page > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.textContent = 'Previous';
                prevBtn.addEventListener('click', () => {
                    currentPage--;
                    showPage(currentPage);
                });
                pagination.appendChild(prevBtn);
            }
            
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                if (i === page) pageBtn.classList.add('active');
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    showPage(currentPage);
                });
                pagination.appendChild(pageBtn);
            }
            
            if (page < totalPages) {
                const nextBtn = document.createElement('button');
                nextBtn.textContent = 'Next';
                nextBtn.addEventListener('click', () => {
                    currentPage++;
                    showPage(currentPage);
                });
                pagination.appendChild(nextBtn);
            }
        }
    }
    
    showPage(1);
}

// ============================================
// QUIZ SYSTEM
// ============================================

function initQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;
    
    // Quiz questions database
    const quizData = {
        'organic-basics': [
            {
                question: "What is the minimum period required for land to be chemical-free to be certified as organic?",
                options: ["1 year", "2 years", "3 years", "4 years"],
                answer: 2
            },
            {
                question: "Which of these is NOT allowed in organic farming?",
                options: ["Crop rotation", "Synthetic pesticides", "Compost", "Green manure"],
                answer: 1
            }
        ],
        'sustainability': [
            {
                question: "What percentage increase in biodiversity is typically seen on organic farms?",
                options: ["10-20%", "30-50%", "60-80%", "90-100%"],
                answer: 1
            }
        ]
    };
    
    let currentCategory = null;
    let currentQuestion = 0;
    let score = 0;
    let userAnswers = [];
    
    // Category selection
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            currentCategory = card.dataset.category;
            startQuiz(currentCategory);
        });
    });
    
    function startQuiz(category) {
        document.getElementById('categorySelection').style.display = 'none';
        document.getElementById('quizQuestions').style.display = 'block';
        currentQuestion = 0;
        score = 0;
        userAnswers = [];
        showQuestion();
    }
    
    function showQuestion() {
        const questions = quizData[currentCategory];
        if (!questions || currentQuestion >= questions.length) {
            showResults();
            return;
        }
        
        const q = questions[currentQuestion];
        document.getElementById('quizQuestionText').textContent = q.question;
        
        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = '';
        
        q.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(optionDiv);
        });
        
        document.getElementById('questionCounter').textContent = 
            `Question ${currentQuestion + 1} of ${questions.length}`;
    }
    
    function selectOption(optionIndex) {
        userAnswers[currentQuestion] = optionIndex;
        
        // Visual feedback
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((opt, idx) => {
            opt.classList.remove('selected');
            if (idx === optionIndex) {
                opt.classList.add('selected');
            }
        });
        
        // Auto advance after delay
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < quizData[currentCategory].length) {
                showQuestion();
            } else {
                showResults();
            }
        }, 1000);
    }
    
    function showResults() {
        const questions = quizData[currentCategory];
        let score = 0;
        
        userAnswers.forEach((answer, index) => {
            if (answer === questions[index].answer) {
                score++;
            }
        });
        
        const percentage = Math.round((score / questions.length) * 100);
        
        document.getElementById('quizQuestions').style.display = 'none';
        document.getElementById('quizResults').style.display = 'block';
        
        document.getElementById('quizScore').textContent = `${score}/${questions.length}`;
        document.getElementById('quizPercentage').textContent = `${percentage}%`;
        
        // Determine message based on score
        let message = '';
        if (percentage >= 80) message = 'Excellent! You\'re an organic farming expert!';
        else if (percentage >= 60) message = 'Good job! You know quite a bit about organic farming.';
        else message = 'Keep learning! Organic farming has many benefits to discover.';
        
        document.getElementById('quizMessage').textContent = message;
    }
    
    // Restart quiz
    document.getElementById('restartQuiz')?.addEventListener('click', () => {
        document.getElementById('quizResults').style.display = 'none';
        document.getElementById('categorySelection').style.display = 'block';
    });
}

// ============================================
// CONTACT FORM
// ============================================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        showToast('Your message has been sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// ============================================
// PAYMENT BUTTONS
// ============================================

function initPaymentButtons() {
    // Update payment amounts
    document.querySelectorAll('.payment-amount').forEach(element => {
        const amount = element.dataset.amount || '1.99';
        element.textContent = '$' + amount;
        
        // Convert to INR
        const usdToInr = 83; // Current approximate rate
        const inrAmount = (parseFloat(amount) * usdToInr).toFixed(2);
        element.nextElementSibling?.textContent = `≈ ₹${inrAmount} INR`;
    });
    
    // Initialize RazorPay buttons
    const razorpayScript = document.createElement('script');
    razorpayScript.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    razorpayScript.async = true;
    document.body.appendChild(razorpayScript);
}

// ============================================
// DOWNLOADS MANAGEMENT
// ============================================

function initDownloads() {
    const loadMoreBtn = document.getElementById('loadMoreDownloads');
    if (!loadMoreBtn) return;
    
    let visibleCount = 10;
    const allDownloads = document.querySelectorAll('.download-card');
    
    // Initially show only 10
    allDownloads.forEach((card, index) => {
        card.style.display = index < visibleCount ? 'block' : 'none';
    });
    
    loadMoreBtn.addEventListener('click', () => {
        visibleCount += 10;
        
        allDownloads.forEach((card, index) => {
            card.style.display = index < visibleCount ? 'block' : 'none';
        });
        
        // Hide button if all are shown
        if (visibleCount >= allDownloads.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// ============================================
// CHARTS FOR NUTRITION PAGE
// ============================================

function initCharts() {
    const nutritionChart = document.getElementById('nutritionChart');
    if (!nutritionChart) return;
    
    // Sample data for nutrition comparison
    const ctx = nutritionChart.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Tomatoes', 'Spinach', 'Carrots', 'Apples', 'Berries'],
            datasets: [{
                label: 'Organic',
                data: [45, 60, 35, 50, 70],
                backgroundColor: 'rgba(46, 125, 50, 0.7)',
                borderColor: 'rgba(46, 125, 50, 1)',
                borderWidth: 1
            }, {
                label: 'Conventional',
                data: [20, 30, 15, 25, 35],
                backgroundColor: 'rgba(141, 110, 99, 0.7)',
                borderColor: 'rgba(141, 110, 99, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Antioxidant Level (%)'
                    }
                }
            }
        }
    });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function initToast() {
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
}

function showToast(message, type = 'info') {
    const toast = document.querySelector('.toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to element
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ============================================

window.OrganiqFarm = {
    showToast,
    smoothScrollTo,
    formatDate
};
