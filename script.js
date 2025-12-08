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
    // Parse target time (format: "HH:MM AM/PM")
    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = targetTime.trim().match(timeRegex);
    
    if (!match) {
        throw new Error("Invalid format! Use format like '2:30 AM' or '8:20 PM'");
    }
    
    const targetHours = parseInt(match[1]);
    const targetMinutes = parseInt(match[2]);
    const targetMeridiem = match[3].toUpperCase();
    
    // Validate hours and minutes
    if (targetHours < 1 || targetHours > 12) {
        throw new Error("Hours must be between 1 and 12");
    }
    if (targetMinutes < 0 || targetMinutes > 59) {
        throw new Error("Minutes must be between 0 and 59");
    }
    
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
    
    try {
        displayCountdown(targetTime);
    } catch (error) {
        document.getElementById("countdown").textContent = error.message;
    }
}

// Initialize the countdown input
updateCountdownInput();