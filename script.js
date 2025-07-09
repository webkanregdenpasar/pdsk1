document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables and Initial Setup ---
    let events = []; // Array to store agenda events
    let editingEventId = null; // To track which event is being edited
    let currentCalendarDate = new Date(); // Tracks the currently displayed month in the calendar

    const eventForm = document.getElementById('event-form');
    const eventTitleInput = document.getElementById('event-title');
    const eventDateInput = document.getElementById('event-date');
    const eventDescriptionInput = document.getElementById('event-description');
    const submitEventBtn = document.getElementById('submit-event-btn'); // Corrected typo here
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const eventListContainer = document.getElementById('event-list');
    const noEventsMessage = document.getElementById('no-events-message');
    const newsTickerContent = document.getElementById('news-ticker-content'); // For news ticker functionality

    // Calendar elements
    const currentMonthYearDisplay = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const calendarGridContainer = document.getElementById('calendar-grid-container');


    // --- Tab Navigation Logic ---

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Function to show a specific tab content and hide others
    function showTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });

        // Deactivate all tab buttons
        tabButtons.forEach(button => {
            button.classList.remove('active', 'border-blue-600', 'text-blue-600');
            button.classList.add('border-transparent', 'text-gray-600');
        });

        // Show the selected tab content
        const selectedContent = document.getElementById(`${tabId}-content`);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
        }

        // Activate the corresponding tab button
        const selectedButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active', 'border-blue-600', 'text-blue-600');
            selectedButton.classList.remove('border-transparent', 'text-gray-600');
        }

        // Special handling for news ticker: add close button if it's the active tab
        if (tabId === 'news-ticker') {
            initNewsTicker();
        }

        // Special handling for calendar: render events and calendar when calendar tab is active
        if (tabId === 'calendar') {
            renderEvents(); // Render event list
            renderCalendar(currentCalendarDate); // Render calendar view
        }
    }

    // Attach event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const tabId = event.target.dataset.tab; // Get the data-tab attribute
            showTab(tabId);
        });
    });

    // --- News Ticker Functionality ---

    // Function to initialize news ticker functionality (add close button)
    function initNewsTicker() {
        // Ensure the close button is only added once
        if (newsTickerContent && !newsTickerContent.querySelector('.close-button')) {
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.innerHTML = '&times;'; // '×' character
            closeButton.setAttribute('aria-label', 'Close news ticker');

            newsTickerContent.appendChild(closeButton);

            closeButton.addEventListener('click', () => {
                newsTickerContent.classList.add('hidden'); // Hide the entire section
                // Optionally, switch to the calendar tab after closing news ticker
                showTab('calendar'); // Default to calendar after closing news
            });
        }
    }

    // --- Calendar CRUD Functions ---

    // Function to render events in the list
    function renderEvents() {
        eventListContainer.innerHTML = ''; // Clear existing events

        if (events.length === 0) {
            noEventsMessage.classList.remove('hidden'); // Show "No events" message
            eventListContainer.appendChild(noEventsMessage);
            return;
        } else {
            noEventsMessage.classList.add('hidden'); // Hide "No events" message
        }

        events.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.id = `event-${event.id}`;
            eventCard.className = 'bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center';

            eventCard.innerHTML = `
                <div class="flex-grow mb-3 md:mb-0">
                    <h4 class="text-lg font-semibold text-blue-700">${event.title}</h4>
                    <p class="text-gray-600 text-sm mb-1">${event.date}</p>
                    <p class="text-gray-700 text-sm">${event.description}</p>
                </div>
                <div class="flex space-x-2">
                    <button class="edit-btn bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded-md transition duration-300 ease-in-out" data-id="${event.id}">Edit</button>
                    <button class="delete-btn bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md transition duration-300 ease-in-out" data-id="${event.id}">Delete</button>
                </div>
            `;
            eventListContainer.appendChild(eventCard);
        });

        // Add event listeners to newly created edit/delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => editEvent(e.target.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => deleteEvent(e.target.dataset.id));
        });
    }

    // Function to add or update an event
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = eventTitleInput.value.trim();
        const date = eventDateInput.value;
        const description = eventDescriptionInput.value.trim();

        if (!title || !date) {
            alert('Please enter event title and date.');
            return;
        }

        if (editingEventId) {
            // Update existing event
            const eventIndex = events.findIndex(event => event.id === editingEventId);
            if (eventIndex > -1) {
                events[eventIndex] = { ...events[eventIndex], title, date, description };
            }
            editingEventId = null; // Reset editing state
            submitEventBtn.textContent = 'Add Event'; // Change button text back
            cancelEditBtn.classList.add('hidden'); // Hide cancel button
        } else {
            // Add new event
            const newEvent = {
                id: Date.now().toString(), // Simple unique ID
                title,
                date,
                description
            };
            events.push(newEvent);
        }

        eventForm.reset(); // Clear form
        renderEvents(); // Re-render the list
        renderCalendar(currentCalendarDate); // Re-render calendar to show new event
    });

    // Function to populate form for editing
    function editEvent(id) {
        const eventToEdit = events.find(event => event.id === id);
        if (eventToEdit) {
            eventTitleInput.value = eventToEdit.title;
            eventDateInput.value = eventToEdit.date;
            eventDescriptionInput.value = eventToEdit.description;
            editingEventId = eventToEdit.id;
            submitEventBtn.textContent = 'Update Event';
            cancelEditBtn.classList.remove('hidden'); // Show cancel button
        }
    }

    // Function to cancel editing
    cancelEditBtn.addEventListener('click', () => {
        eventForm.reset();
        editingEventId = null;
        submitEventBtn.textContent = 'Add Event';
        cancelEditBtn.classList.add('hidden');
    });

    // Function to delete an event
    function deleteEvent(id) {
        if (confirm('Are you sure you want to delete this event?')) {
            events = events.filter(event => event.id !== id);
            renderEvents();
            renderCalendar(currentCalendarDate); // Re-render calendar after deleting event
            // If the deleted event was being edited, reset the form
            if (editingEventId === id) {
                eventForm.reset();
                editingEventId = null;
                submitEventBtn.textContent = 'Add Event';
                cancelEditBtn.classList.add('hidden');
            }
        }
    }

    // --- Calendar View Functions ---

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-indexed

        currentMonthYearDisplay.textContent = `${date.toLocaleString('en-US', { month: 'long' })} ${year}`;

        // Clear previous days, but keep headers
        while (calendarGridContainer.children.length > 7) { // 7 for the day headers (Sun-Sat)
            calendarGridContainer.removeChild(calendarGridContainer.lastChild);
        }

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
        const firstDayOfWeek = firstDayOfMonth.getDay();

        // Calculate days from previous month to display
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const dayCell = createCalendarDayCell(prevMonthLastDay - i, true, null);
            calendarGridContainer.appendChild(dayCell);
        }

        // Render current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isToday = currentDate.toDateString() === new Date().toDateString();
            const eventsForDay = events.filter(event => event.date === currentDate.toISOString().split('T')[0]);
            const dayCell = createCalendarDayCell(day, false, isToday, eventsForDay, currentDate.toISOString().split('T')[0]);
            calendarGridContainer.appendChild(dayCell);
        }

        // Calculate days from next month to display (to fill the last row)
        // Ensure the grid always has 6 rows (6 * 7 = 42 cells total)
        const totalCellsRendered = calendarGridContainer.children.length - 7; // Subtract headers
        const remainingCells = 42 - totalCellsRendered;
        for (let i = 1; i <= remainingCells; i++) {
            const dayCell = createCalendarDayCell(i, true, null);
            calendarGridContainer.appendChild(dayCell);
        }
    }

    function createCalendarDayCell(dayNumber, isInactive, isToday, eventsForDay = [], fullDate = '') {
        const dayCell = document.createElement('div');
        dayCell.className = `calendar-day-cell ${isInactive ? 'inactive' : ''} ${isToday ? 'today' : ''}`;
        dayCell.innerHTML = `<span class="calendar-day-number">${dayNumber}</span>`;

        if (!isInactive && eventsForDay.length > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'flex flex-col items-start w-full mt-6'; // Adjust margin-top to not overlap day number
            eventsForDay.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'flex items-center w-full mb-1';
                eventElement.innerHTML = `
                    <span class="calendar-event-dot"></span>
                    <span class="calendar-event-title">${event.title}</span>
                `;
                eventsContainer.appendChild(eventElement);
            });
            dayCell.appendChild(eventsContainer);
        }

        // Optional: Click a day to pre-fill the event form date
        if (!isInactive) {
            dayCell.addEventListener('click', () => {
                eventDateInput.value = fullDate;
                // Scroll to the form
                eventForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                eventTitleInput.focus();
            });
        }

        return dayCell;
    }

    // Calendar navigation event listeners
    prevMonthBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar(currentCalendarDate);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar(currentCalendarDate);
    });


    // --- Initial Load ---
    // Default to 'calendar' tab on initial load
    showTab('calendar');
});
