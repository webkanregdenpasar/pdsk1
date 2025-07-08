// Function to load external HTML content into a placeholder
async function loadHTML(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Could not load ${url}:`, error);
        // Optionally, display a fallback message to the user
        const placeholder = document.getElementById(elementId);
        if (placeholder) {
            placeholder.innerHTML = `<p style="color: red; text-align: center;">Error loading content from ${url}.</p>`;
        }
    }
}

// Function to initialize news ticker functionality
function initNewsTicker() {
    const newsTickerSection = document.getElementById('news-ticker');
    if (newsTickerSection) {
        // Create a close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;'; // '×' character
        closeButton.setAttribute('aria-label', 'Close news ticker');

        // Append the button to the news ticker section
        newsTickerSection.appendChild(closeButton);

        // Add event listener to hide the news ticker when the button is clicked
        closeButton.addEventListener('click', () => {
            newsTickerSection.style.display = 'none'; // Hide the entire section
        });
    }
}

// When the DOM is fully loaded, load the header and footer, and initialize news ticker
document.addEventListener('DOMContentLoaded', () => {
    loadHTML('header.html', 'header-placeholder');
    loadHTML('footer.html', 'footer-placeholder');

    // Only initialize news ticker if we are on the news.html page
    if (document.body.id === 'news-page') {
        initNewsTicker();
    }
});
