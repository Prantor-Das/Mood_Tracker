// Function to log and store mood
function logMood(mood) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date (YYYY-MM-DD)
    let moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || []; // Get stored moods

    // Check if mood already exists for today and update it
    let found = false;
    moodLogs = moodLogs.map(log => {
        if (log.date === today) {
            log.mood = mood;
            found = true;
        }
        return log;
    });

    // If today's mood is not found, add a new entry
    if (!found) {
        moodLogs.push({ date: today, mood });
    }

    // Save to LocalStorage
    localStorage.setItem('moodLogs', JSON.stringify(moodLogs));

    // Update the UI
    displayMoodTimeline();
    displayMoodCalendar();
}

// Function to show past moods in a timeline
function displayMoodTimeline() {
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    const timeline = document.getElementById('mood-timeline');
    timeline.innerHTML = ''; // Clear old data

    moodLogs.forEach(log => {
        const moodItem = document.createElement('div');
        moodItem.classList.add('mood-item');
        moodItem.innerHTML = `<strong>${log.date}</strong>: ${getMoodEmoji(log.mood)}`;
        timeline.appendChild(moodItem);
    });
}

// Function to return emoji for mood
function getMoodEmoji(mood) {
    const emojis = {
        happy: '😊',
        sad: '😢',
        neutral: '😐',
        excited: '😃'
    };
    return emojis[mood] || '😐'; // Default emoji
}

// Function to display moods in a calendar view
function displayMoodCalendar() {
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    const calendarEl = document.getElementById('mood-calendar');
    
    // Clear old calendar
    calendarEl.innerHTML = '';

    // Create and render FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: moodLogs.map(log => ({
            title: getMoodEmoji(log.mood), // Show emoji
            start: log.date,
            allDay: true
        }))
    });
    calendar.render();
}

// Load mood history and calendar on page load
document.addEventListener("DOMContentLoaded", () => {
    displayMoodTimeline();
    displayMoodCalendar();
});