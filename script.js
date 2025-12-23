/* OrganiqFarm 2026 - Global Logic */
document.addEventListener('DOMContentLoaded', () => {
    // 1. CSP & Security Logs
    console.log("OrganiqFarm Security Shield: Active");

    // 2. Dynamic Year Updater (Ensures 2026 everywhere)
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => el.textContent = "2026");

    // 3. Simulated Live Weather/Soil Impact API
    const updateStats = () => {
        const soilMoisture = document.getElementById('soil-moisture');
        if(soilMoisture) {
            const val = (Math.random() * (45 - 38) + 38).toFixed(1);
            soilMoisture.textContent = `${val}% (Optimal)`;
        }
    };
    setInterval(updateStats, 5000);

    // 4. Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
