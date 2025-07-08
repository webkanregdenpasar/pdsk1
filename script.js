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
        document.getElementById(elementId).innerHTML = `<p style="color: red;">Error loading content from ${url}.</p>`;
    }
}

// When the DOM is fully loaded, load the header and footer
document.addEventListener('DOMContentLoaded', () => {
    loadHTML('header.html', 'header-placeholder');
    loadHTML('footer.html', 'footer-placeholder');
});
