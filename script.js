// Function to schedule fiber breakage
function scheduleBreakage() {
    const breakDate = document.getElementById('breakDate').value;
    const breakTime = document.getElementById('breakTime').value;
    const breakLocation = document.getElementById('breakLocation').value;

    if (breakDate && breakTime && breakLocation) {
        // Store breakage details in local storage
        const breakageData = {
            breakDateTime: `${breakDate} ${breakTime}`,
            breakLocation,
            fixedTime: null,
        };

        // Retrieve existing breakages or initialize an empty array
        const breakages = JSON.parse(localStorage.getItem('breakages')) || [];
        breakages.unshift(breakageData); // Add new entry to the beginning of the array

        // Save updated breakages back to local storage
        localStorage.setItem('breakages', JSON.stringify(breakages));

        // Display notification
        showNotification(`Breakage scheduled at ${breakDate} ${breakTime} in ${breakLocation}`);

        // Refresh the fixed breakages list
        displayFixedBreakages();
    } else {
        alert('Please enter breakage date, time, and location.');
    }
}

// Function to display notifications
function showNotification(message) {
    const notifications = document.getElementById('notifications');
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification';
    notificationElement.textContent = message;
    notifications.appendChild(notificationElement);

    // Clear notification after 5 seconds
    setTimeout(() => {
        notifications.removeChild(notificationElement);
    }, 5000);
}

// Function to display fixed breakages list
function displayFixedBreakages() {
    const fixedList = document.getElementById('fixedList');
    fixedList.innerHTML = '<h3>All Breakages</h3>';

    // Retrieve breakages from local storage
    const breakages = JSON.parse(localStorage.getItem('breakages')) || [];

    // Display breakages list
    breakages.forEach((breakage, index) => {
        if (breakage.fixedTime) {
            const fixedTime = new Date(breakage.fixedTime);
            const breakTime = new Date(breakage.breakDateTime);
            const timeDifference = calculateTimeDifference(breakTime, fixedTime);

            const breakageEntry = document.createElement('div');
            breakageEntry.className = 'breakage-entry';
            breakageEntry.innerHTML = `
                <p><strong>Breakage Time:</strong> ${breakage.breakDateTime}</p>
                <p><strong>Location:</strong> ${breakage.breakLocation}</p>
                <p><strong>Fixed Time:</strong> ${breakage.fixedTime}</p>
                <p><strong>Time Difference:</strong> ${formatTimeDifference(timeDifference)}</p>
            `;

            fixedList.appendChild(breakageEntry);
        } else {
            // Add button to confirm breakage fixing
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Confirm Fixed';
            confirmButton.onclick = function () {
                confirmBreakageFix(index);
            };

            const breakageEntry = document.createElement('div');
            breakageEntry.className = 'breakage-entry';
            breakageEntry.innerHTML = `
                <p><strong>Breakage Time:</strong> ${breakage.breakDateTime}</p>
                <p><strong>Location:</strong> ${breakage.breakLocation}</p>
            `;

            breakageEntry.appendChild(confirmButton);
            fixedList.appendChild(breakageEntry);
        }
    });
}

// Function to confirm breakage fixing
function confirmBreakageFix(index) {
    const breakages = JSON.parse(localStorage.getItem('breakages')) || [];

    if (index >= 0 && index < breakages.length) {
        // Update fixed time
        breakages[index].fixedTime = new Date().toLocaleString();

        // Save updated breakages back to local storage
        localStorage.setItem('breakages', JSON.stringify(breakages));

        // Display notification
        showNotification(`Breakage fixed at ${breakages[index].fixedTime}`);

        // Refresh the fixed breakages list
        displayFixedBreakages();
    }
}

// Function to download breakages as CSV and output to console
function downloadBreakages() {
    const breakages = JSON.parse(localStorage.getItem('breakages')) || [];

    if (breakages.length > 0) {
        console.log("Breakage Time,Location,Fixed Time,Time Difference (days, hours, minutes, seconds)");

        breakages.forEach((breakage) => {
            if (breakage.fixedTime) {
                const fixedTime = new Date(breakage.fixedTime);
                const breakTime = new Date(breakage.breakDateTime);
                const timeDifference = calculateTimeDifference(breakTime, fixedTime);

                console.log(`"${breakage.breakDateTime}","${breakage.breakLocation}","${breakage.fixedTime}","${formatTimeDifference(timeDifference)}"`);
            }
        });
    } else {
        alert('No fixed breakages to download.');
    }
}

// Function to calculate time difference
function calculateTimeDifference(start, end) {
    const timeDifference = end - start; // in milliseconds
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}

// Function to format time difference
function formatTimeDifference(timeDifference) {
    return `${timeDifference.days} days, ${timeDifference.hours} hours, ${timeDifference.minutes} minutes, ${timeDifference.seconds} seconds`;
}

// Function to clear all breakages
function clearBreakages() {
    localStorage.removeItem('breakages');
    displayFixedBreakages(); // Refresh the fixed breakages list
}

// Function to periodically show notifications (every 45 minutes)
setInterval(function () {
    showNotification('Reminder: Fiber breakage needs attention!');
}, 45 * 60 * 1000);

// Call displayFixedBreakages on page load
displayFixedBreakages();
