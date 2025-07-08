document.addEventListener('DOMContentLoaded', () => {
    // Function to load external HTML content into a placeholder
    async function loadHTML(url, elementId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;

            // After header is loaded, attach event listeners to its buttons
            if (elementId === 'header-placeholder') {
                attachTabEventListeners();
            }
        } catch (error) {
            console.error(`Could not load ${url}:`, error);
            const placeholder = document.getElementById(elementId);
            if (placeholder) {
                placeholder.innerHTML = `<p class="text-red-500 text-center">Error loading content from ${url}.</p>`;
            }
        }
    }

    // Load header and footer
    loadHTML('header.html', 'header-placeholder');
    loadHTML('footer.html', 'footer-placeholder');

    const tabContents = document.querySelectorAll('.tab-content');
    const newsTickerContent = document.getElementById('news-ticker-content');

    // Function to show a specific tab content and hide others
    function showTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });

        // Deactivate all tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
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
    }

    // Attach event listeners to tab buttons (called after header is loaded)
    function attachTabEventListeners() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const tabId = event.target.dataset.tab; // Get the data-tab attribute
                showTab(tabId);
            });
        });

        // Determine which tab to show on initial load (after buttons are available)
        // Default to 'calendar' tab as per the provided HTML snippet's first button
        showTab('calendar');
    }


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
});
