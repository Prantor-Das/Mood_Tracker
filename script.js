// Function to log and store mood
function logMood(mood) {
    const today = new Date().toISOString().split('T')[0];
    let moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];

    // Check if today's mood exists
    let entryFound = moodLogs.find(log => log.date === today);
    if (entryFound) {
        entryFound.mood = mood;
    } else {
        moodLogs.push({ date: today, mood: mood });
    }

    localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
    updateUI();
    disableMoodSelection();
}

// Function to disable mood selection after logging
function disableMoodSelection() {
    const moodSelect = document.getElementById('mood-select');
    const submitButton = document.getElementById('submit-mood');

    if (moodSelect && submitButton) {
        moodSelect.disabled = true; // Disable dropdown
        submitButton.disabled = true; // Disable submit button
    }
}

// Function to update UI elements
function updateUI() {
    displayMoodTimeline();
    displayMoodCalendar();
    disableMoodSelection(); // Ensure selection stays disabled after reload
}

// Function to display past moods in a timeline
function displayMoodTimeline() {
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    const timeline = document.getElementById('mood-timeline');
    timeline.innerHTML = '';

    moodLogs.forEach((log, index) => {
        const moodItem = document.createElement('div');
        moodItem.classList.add('mood-item');
        moodItem.innerHTML = `
            <strong>${log.date}</strong>: ${getMoodEmoji(log.mood)}
            <button class="edit" onclick="editMood(${index}, this)">Edit</button>
            <button class="delete" onclick="deleteMood(${index})">Delete</button>
        `;
        timeline.appendChild(moodItem);
    });
}

// Function to get the corresponding emoji for a mood
function getMoodEmoji(mood) {
    const emojis = { happy: '😊', sad: '😢', neutral: '😐', excited: '😃' };
    return emojis[mood] || '😐';
}

// Function to display moods in a calendar view
function displayMoodCalendar() {
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    const calendarEl = document.getElementById('mood-calendar');
    calendarEl.innerHTML = '';

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: moodLogs.map(log => ({
            title: getMoodEmoji(log.mood),
            start: log.date,
            allDay: true
        }))
    });
    calendar.render();
}

// Function to edit a mood entry (dropdown appears inline)
function editMood(index, button) {
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    const parentDiv = button.parentElement;

    // Remove any existing dropdowns before adding a new one
    document.querySelectorAll('.edit-dropdown').forEach(el => el.remove());

    // Create dropdown for mood selection
    const selectElement = document.createElement('select');
    selectElement.classList.add('edit-dropdown');
    ['happy', 'sad', 'neutral', 'excited'].forEach(mood => {
        const option = document.createElement('option');
        option.value = mood;
        option.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
        if (mood === moodLogs[index].mood) option.selected = true;
        selectElement.appendChild(option);
    });

    // Create a save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.classList.add('save-btn');
    saveButton.onclick = () => {
        moodLogs[index].mood = selectElement.value;
        localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
        updateUI();
    };

    // Add dropdown and button next to the edit button
    parentDiv.appendChild(selectElement);
    parentDiv.appendChild(saveButton);
}

// Function to delete a mood entry
function deleteMood(index) {
    let moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    moodLogs.splice(index, 1);
    localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
    updateUI();
}

// Ensure the mood selection is disabled when the page loads
document.addEventListener("DOMContentLoaded", updateUI);