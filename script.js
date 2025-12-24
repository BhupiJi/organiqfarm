// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Initialize impact index counters
    initCounters();
    
    // Initialize blog cards if on blogs page
    if (document.querySelector('.blog-grid')) {
        initBlogCards();
    }
    
    // Initialize facts grid if on facts page
    if (document.querySelector('.facts-grid')) {
        initFactsGrid();
    }
    
    // Initialize nutrition table if on nutrition page
    if (document.querySelector('.nutrition-table')) {
        initNutritionTable();
    }
    
    // Initialize weather visualization if on facts page
    if (document.getElementById('weather-chart')) {
        initWeatherChart();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle anchor links (not external links)
            if (href === '#' || href.startsWith('#!')) return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
});

// Impact Index Counter Animation
function initCounters() {
    const counters = [
        { id: 'soil-index', target: 78, suffix: '%' },
        { id: 'water-index', target: 45, suffix: '%' },
        { id: 'carbon-index', target: 2.4, suffix: 't' },
        { id: 'biodiversity-index', target: 62, suffix: '%' },
        { id: 'nutrition-index', target: 34, suffix: '%' }
    ];
    
    let animated = false;
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Function to animate counters
    function animateCounters() {
        if (animated) return;
        
        const firstCounter = document.getElementById(counters[0].id);
        if (!firstCounter || !isInViewport(firstCounter)) return;
        
        animated = true;
        
        counters.forEach(counter => {
            const element = document.getElementById(counter.id);
            if (!element) return;
            
            const target = counter.target;
            const suffix = counter.suffix;
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format the number based on whether it's a decimal or integer
                if (counter.id === 'carbon-index') {
                    element.textContent = current.toFixed(1) + suffix;
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
            }, 16);
        });
    }
    
    // Check on load and scroll
    animateCounters();
    window.addEventListener('scroll', animateCounters);
}

// Blog Cards Interaction
function initBlogCards() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Facts Grid Interaction
function initFactsGrid() {
    const factItems = document.querySelectorAll('.fact-item');
    
    factItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
}

// Nutrition Table Sorting
function initNutritionTable() {
    const table = document.querySelector('.nutrition-table');
    if (!table) return;
    
    const headers = table.querySelectorAll('th[data-sort]');
    
    headers.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            const sortBy = this.getAttribute('data-sort');
            const isAsc = this.getAttribute('data-order') === 'asc';
            const newOrder = isAsc ? 'desc' : 'asc';
            
            // Reset all headers
            headers.forEach(h => {
                h.removeAttribute('data-order');
                h.classList.remove('sorted-asc', 'sorted-desc');
            });
            
            // Set current header
            this.setAttribute('data-order', newOrder);
            this.classList.add(`sorted-${newOrder}`);
            
            // Sort table
            sortTable(table, sortBy, newOrder);
        });
    });
}

function sortTable(table, sortBy, order) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let aVal, bVal;
        
        if (sortBy === 'food') {
            aVal = a.cells[0].textContent;
            bVal = b.cells[0].textContent;
        } else if (sortBy === 'nutrient') {
            aVal = a.cells[1].textContent;
            bVal = b.cells[1].textContent;
        } else if (sortBy === 'increase') {
            aVal = parseFloat(a.cells[2].textContent.replace('%', ''));
            bVal = parseFloat(b.cells[2].textContent.replace('%', ''));
        }
        
        if (order === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });
    
    // Reappend rows in sorted order
    rows.forEach(row => tbody.appendChild(row));
}

// Weather Chart Visualization
function initWeatherChart() {
    const canvas = document.getElementById('weather-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Chart data
    const data = {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        datasets: [
            {
                label: 'Conventional Farm Yield Loss (%)',
                data: [5, 8, 12, 15, 18, 22, 25],
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                tension: 0.3,
                fill: true
            },
            {
                label: 'Organic Farm Yield Loss (%)',
                data: [2, 3, 4, 5, 6, 7, 8],
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.3,
                fill: true
            }
        ]
    };
    
    // Chart configuration
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Yield Loss During Extreme Weather Events (2020-2026)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Yield Loss (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    };
    
    // Create chart
    new Chart(ctx, config);
}

// Update active navigation link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === `#${current}` || (current === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                this.tooltipElement = null;
            }
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTooltips);
} else {
    initTooltips();
}
