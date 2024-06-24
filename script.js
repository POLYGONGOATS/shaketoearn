let totalPoints = 0;
let lastShakeTime = 0;
let shakeInterval = 2000; // 2 seconds
let maxDailyPoints = 1000;
let dailyPoints = 0;
let lastResetTime = new Date().setHours(0, 0, 0, 0);

function resetDailyPoints() {
    let now = new Date();
    if (now - lastResetTime >= 86400000) { // 24 hours
        dailyPoints = 0;
        lastResetTime = now.setHours(0, 0, 0, 0);
    }
}

window.addEventListener('devicemotion', function(event) {
    let now = Date.now();
    if (now - lastShakeTime > shakeInterval) {
        lastShakeTime = now;
        if (dailyPoints < maxDailyPoints) {
            totalPoints += 20;
            dailyPoints += 20;
            document.getElementById('total-points').innerText = totalPoints;
            localStorage.setItem('totalPoints', totalPoints);
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    totalPoints = parseInt(localStorage.getItem('totalPoints')) || 0;
    document.getElementById('total-points').innerText = totalPoints;
    setInterval(resetDailyPoints, 60000); // Check every minute
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i.style.display = "none"];
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementsByClassName('tab-link')[0].click();
});

let foodScale = 100;
let happinessScale = 100;
let healthScale = 100;

function updateScales() {
    document.getElementById('food-scale').innerText = foodScale.toFixed(2);
    document.getElementById('happiness-scale').innerText = happinessScale.toFixed(2);
    document.getElementById('health-scale').innerText = healthScale.toFixed(2);
    localStorage.setItem('foodScale', foodScale);
    localStorage.setItem('happinessScale', happinessScale);
    localStorage.setItem('healthScale', healthScale);
}

function restoreFood() {
    if (totalPoints >= 100) {
        totalPoints -= 100;
        foodScale = 100;
        updateScales();
        document.getElementById('total-points').innerText = totalPoints;
        localStorage.setItem('totalPoints', totalPoints);
    }
}

function restoreHappiness() {
    if (totalPoints >= 180) {
        totalPoints -= 180;
        happinessScale = 100;
        updateScales();
        document.getElementById('total-points').innerText = totalPoints;
        localStorage.setItem('totalPoints', totalPoints);
    }
}

function restoreHealth() {
    if (totalPoints >= 300) {
        totalPoints -= 300;
        healthScale = 100;
        updateScales();
        document.getElementById('total-points').innerText = totalPoints;
        localStorage.setItem('totalPoints', totalPoints);
    }
}

function decreaseScales() {
    if (foodScale > 0) {
        foodScale -= 0.002314814;
    } else if (happinessScale > 0) {
        happinessScale -= 0.41;
    } else if (healthScale > 0) {
        healthScale -= 0.5;
    }
    updateScales();
}

document.addEventListener("DOMContentLoaded", function() {
    foodScale = parseFloat(localStorage.getItem('foodScale')) || 100;
    happinessScale = parseFloat(localStorage.getItem('happinessScale')) || 100;
    healthScale = parseFloat(localStorage.getItem('healthScale')) || 100;
    setInterval(decreaseScales, 1000); // Decrease scales every second
    updateScales();
});

function earnPoints(points) {
    totalPoints += points;
    document.getElementById('total-points').innerText = totalPoints;
    localStorage.setItem('totalPoints', totalPoints);
}

