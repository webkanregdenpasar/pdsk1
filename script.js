document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables and Initial Setup ---
    let events = []; // Array to store agenda events
    let editingEventId = null; // To track which event is being edited

    const eventForm = document.getElementById('event-form');
    const eventTitleInput = document.getElementById('event-title');
    const eventDateInput = document.getElementById('event-date');
    const eventDescriptionInput = document.getElementById('event-description');
    const submitEventBtn = document.getElementById('submit-event-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const eventListContainer = document.getElementById('event-list');
    const noEventsMessage = document.getElementById('no-events-message');
    const newsTickerContent = document.getElementById('news-ticker-content'); // For news ticker functionality


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

        // Special handling for calendar: render events when calendar tab is active
        if (tabId === 'calendar') {
            renderEvents();
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
            // If the deleted event was being edited, reset the form
            if (editingEventId === id) {
                eventForm.reset();
                editingEventId = null;
                submitEventBtn.textContent = 'Add Event';
                cancelEditBtn.classList.add('hidden');
            }
        }
    }

    // --- Initial Load ---
    // Default to 'calendar' tab on initial load
    showTab('calendar');
});
