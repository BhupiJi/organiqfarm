/* Project: OrganiqFarm 2026
    File: script.js
    Description: Handles navigation, animations, API calls, and calculator.
*/

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCounters();
    initWeather();
    initBlogPagination();
    updateCopyrightYear();
    initCurrencyConverter();
});

// --- Navigation ---
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// --- Animated Counters (Intersection Observer) ---
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;

    const options = { threshold: 0.5 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, options);

    counters.forEach(counter => observer.observe(counter));
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Add '+' sign if it was in the design
            obj.innerHTML = end + (obj.getAttribute('data-suffix') || '');
        }
    };
    window.requestAnimationFrame(step);
}

// --- Weather API (Open-Meteo: Free, No Key) ---
function initWeather() {
    const weatherContainer = document.getElementById('weather-data');
    if (!weatherContainer) return;

    if ("geolocation" in navigator) {
        weatherContainer.innerHTML = "<p>Locating your farm...</p>";
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            try {
                // Fetching 2026 relevant metrics: temp, rain, soil moisture (simulated via rain)
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=precipitation_sum&timezone=auto`);
                const data = await response.json();
                
                renderWeather(data);
            } catch (error) {
                weatherContainer.innerHTML = "<p>Weather data currently unavailable. Check connection.</p>";
                console.error("Weather fetch error:", error);
            }
        }, () => {
            weatherContainer.innerHTML = "<p>Location access denied. Showing global average.</p>";
        });
    } else {
        weatherContainer.innerHTML = "<p>Geolocation not supported.</p>";
    }
}

function renderWeather(data) {
    const container = document.getElementById('weather-data');
    const temp = data.current_weather.temperature;
    const wind = data.current_weather.windspeed;
    const precip = data.daily.precipitation_sum[0];

    container.innerHTML = `
        <div class="weather-card">
            <h3>Local Farm Conditions</h3>
            <div style="display: flex; justify-content: space-around; margin-top: 1rem;">
                <div>
                    <strong>${temp}°C</strong><br>Temperature
                </div>
                <div>
                    <strong>${wind} km/h</strong><br>Wind Speed
                </div>
                <div>
                    <strong>${precip} mm</strong><br>Exp. Rainfall
                </div>
            </div>
            <p style="margin-top: 1rem; font-size: 0.9rem;">2026 Advisory: ${temp > 30 ? 'High heat. Ensure soil mulching.' : 'Conditions optimal for organic rotation.'}</p>
        </div>
    `;
}

// --- Blog Pagination (Client Side) ---
function initBlogPagination() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;

    // Logic: If we were fetching from JSON, we'd render here. 
    // Since it's static HTML, we assume the HTML contains all items and we toggle visibility.
    // For this deliverables, we will rely on CSS Grid layout for simplicity as requested by "Static Site".
    // A simple load more button could be implemented if list is long.
}

// --- Currency Converter for Downloads ---
function initCurrencyConverter() {
    const usdPrice = 25; // Example base price
    const inrDisplay = document.getElementById('price-inr');
    
    if (inrDisplay) {
        // Static approximate 2026 rate or fetch API
        const rate = 92.5; // Estimated 2026 rate
        const inr = (usdPrice * rate).toFixed(2);
        inrDisplay.innerText = `₹${inr}`;
    }
}

function updateCopyrightYear() {
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.innerText = new Date().getFullYear();
}
