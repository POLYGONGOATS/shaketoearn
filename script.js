let totalPoints = 0;
let dailyPoints = 0;
const maxDailyPoints = 1000;

let foodScale = 100;
let happinessScale = 100;
let healthScale = 100;
let petLevel = 0;

let energy = 1000;
const maxEnergy = 1000;
const energyDecreaseRate = 25; // per second during shaking
const energyIncreaseRate = 0.05; // per second when not shaking

const foodDecreaseRate = 0.002314814;
const happinessDecreaseRate = 0.41;
const healthDecreaseRate = 0.5;

const shakeThreshold = 15; // Adjust this value based on your testing
let lastUpdate = 0;
let isShaking = false;
let energyInterval, shakeTimeout;

document.addEventListener("DOMContentLoaded", function() {
    // Initialize points and scales from local storage
    totalPoints = parseInt(localStorage.getItem('totalPoints')) || 0;
    foodScale = parseFloat(localStorage.getItem('foodScale')) || 100;
    happinessScale = parseFloat(localStorage.getItem('happinessScale')) || 100;
    healthScale = parseFloat(localStorage.getItem('healthScale')) || 100;
    petLevel = parseInt(localStorage.getItem('petLevel')) || 0;
    energy = parseFloat(localStorage.getItem('energy')) || maxEnergy;

    document.getElementById('total-points').innerText = totalPoints;
    document.getElementById('food-scale').innerText = foodScale.toFixed(2);
    document.getElementById('happiness-scale').innerText = happinessScale.toFixed(2);
    document.getElementById('health-scale').innerText = healthScale.toFixed(2);
    document.getElementById('pet-level').innerText = petLevel;
    document.getElementById('energy').innerText = energy.toFixed(0);

    // Set up tab functionality
    document.getElementsByClassName('tab-link')[0].click();

    // Decrease scales over time
    setInterval(decreaseScales, 1000);
    // Increase energy over time
    energyInterval = setInterval(increaseEnergy, 1000);
});

// Shake event listener
window.addEventListener('devicemotion', function(event) {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastUpdate;

    if (timeDifference > 100) {
        const acceleration = event.accelerationIncludingGravity;
        const speed = Math.sqrt(acceleration.x * acceleration.x + acceleration.y * acceleration.y + acceleration.z * acceleration.z);

        if (speed > shakeThreshold && energy >= 25) {
            if (!isShaking) {
                isShaking = true;
                shakeTimeout = setTimeout(() => {
                    isShaking = false;
                }, 2000); // Shaking period in milliseconds
                rewardPointsForShake();
                energyInterval = setInterval(decreaseEnergy, 1000);
            }
        }

        lastUpdate = currentTime;
    }
});

function rewardPointsForShake() {
    let shakePoints = 0;
    const shakeDuration = 2000; // Duration for which shaking will be detected (in milliseconds)

    const interval = setInterval(() => {
        shakePoints += 20;
        if (shakePoints >= 1000) {
            clearInterval(interval);
        }
    }, 2000);

    setTimeout(() => {
        clearInterval(interval);
        if (dailyPoints + shakePoints <= maxDailyPoints) {
            earnPoints(shakePoints);
            dailyPoints += shakePoints;
        } else {
            const pointsToAdd = maxDailyPoints - dailyPoints;
            earnPoints(pointsToAdd);
            dailyPoints = maxDailyPoints;
        }
    }, shakeDuration);
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove('active');
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.className += " active";
}

function earnPoints(points) {
    totalPoints += points;
    document.getElementById('total-points').innerText = totalPoints;
    localStorage.setItem('totalPoints', totalPoints);
}

function restoreFood() {
    if (totalPoints >= 100 && foodScale < 100) {
        totalPoints -= 100;
        foodScale = 100;
        updateScales();
        document.getElementById('total-points').innerText = totalPoints;
        localStorage.setItem('totalPoints', totalPoints);
    }
}

function restoreHappiness() {
    if (totalPoints >= 180 && happinessScale < 100) {
        totalPoints -= 180;
        happinessScale = 100;
        updateScales();
        document.getElementById('total-points').innerText = totalPoints;
        localStorage.setItem('totalPoints', totalPoints);
    }
}

function restoreHealth() {
    if (totalPoints >= 300 && healthScale < 100) {
        totalPoints -= 300;
        healthScale = 100;
        updateScales();
        document.getElementById('total-points').innerText = totalPoints;
        localStorage.setItem('totalPoints', totalPoints);
    }
}

function decreaseScales() {
    if (foodScale > 0) {
        foodScale -= foodDecreaseRate;
    }

    if (foodScale <= 0 && happinessScale > 0) {
        happinessScale -= happinessDecreaseRate;
    }

    if (happinessScale <= 0 && healthScale > 0) {
        healthScale -= healthDecreaseRate;
    }

    updateScales();
}

function updateScales() {
    document.getElementById('food-scale').innerText = foodScale.toFixed(2);
    document.getElementById('happiness-scale').innerText = happinessScale.toFixed(2);
    document.getElementById('health-scale').innerText = healthScale.toFixed(2);

    localStorage.setItem('foodScale', foodScale);
    localStorage.setItem('happinessScale', happinessScale);
    localStorage.setItem('healthScale', healthScale);
}

function decreaseEnergy() {
    if (energy > 0) {
        energy -= energyDecreaseRate;
        document.getElementById('energy').innerText = energy.toFixed(0);
        localStorage.setItem('energy', energy);

        if (energy <= 0) {
            clearInterval(energyInterval);
        }
    }
}

function increaseEnergy() {
    if (energy < maxEnergy) {
        energy += energyIncreaseRate;

        if (energy >= maxEnergy) {
            energy = maxEnergy;
        }

        if (Math.floor(energy) % 1 === 0) {
            document.getElementById('energy').innerText = energy.toFixed(0);
        }

        localStorage.setItem('energy', energy);
    }
}



