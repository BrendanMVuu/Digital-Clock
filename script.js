function updateClock() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, 0);
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, 0);
    const minutes = now.getMinutes().toString().padStart(2, 0);
    const seconds = now.getSeconds().toString().padStart(2, 0);
    const timeString = `${hours}:${minutes}:${seconds} ${meridiem}`;
    document.getElementById("clock").textContent = timeString;
}

function calculateMinutesUntil(targetTime) {
    // Parse target time (format: "HH:MM AM/PM" or "HH:MM")
    const timeParts = targetTime.trim().split(" ");
    const [targetHours, targetMinutes] = timeParts[0].split(":").map(Number);
    const targetMeridiem = timeParts[1]?.toUpperCase() || "AM";
    
    // Get current time
    const now = new Date();
    let currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Convert target time to 24-hour format
    let adjustedHours = targetHours;
    if (targetMeridiem === "PM" && adjustedHours !== 12) {
        adjustedHours += 12;
    } else if (targetMeridiem === "AM" && adjustedHours === 12) {
        adjustedHours = 0;
    }
    
    // Convert both times to minutes
    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    const targetTotalMinutes = adjustedHours * 60 + targetMinutes;
    
    // Calculate difference
    let minutesRemaining = targetTotalMinutes - currentTotalMinutes;
    
    // If time has passed today, calculate for tomorrow
    if (minutesRemaining <= 0) {
        minutesRemaining += 24 * 60; // Add 24 hours worth of minutes
    }
    
    return minutesRemaining;
}

function displayCountdown(targetTime) {
    const minutesLeft = calculateMinutesUntil(targetTime);
    const hours = Math.floor(minutesLeft / 60);
    const minutes = minutesLeft % 60;
    
    const displayText = hours > 0 
        ? `${hours}h ${minutes}m remaining until ${targetTime}`
        : `${minutes}m remaining until ${targetTime}`;
    
    document.getElementById("countdown").textContent = displayText;
}

function updateCountdownInput() {
    const now = new Date();
    const meridiem = now.getHours() >= 12 ? "PM" : "AM";
    const inputField = document.getElementById("targetTimeInput");
    
    // Update placeholder to show current meridiem
    inputField.placeholder = `Enter time (e.g., 8:20 ${meridiem})`;
}

updateClock();
setInterval(updateClock, 1000);
setInterval(updateCountdownInput, 1000);

function handleCountdownClick() {
    const targetTime = document.getElementById("targetTimeInput").value;
    if (targetTime.trim() === "") {
        document.getElementById("countdown").textContent = "Please enter a time!";
        return;
    }
    displayCountdown(targetTime);
}

// Initialize the countdown input
updateCountdownInput();