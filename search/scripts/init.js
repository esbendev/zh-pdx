async function init() {
    const all = await fetchData();
    const textos = (all && all.textos) || [];
    const searchBar = document.getElementById('search-bar');
    const sortSelect = document.getElementById('sort-options');
    const sortOrder = sortSelect.value;
    filtered = sortResultsByDate(textos, sortOrder);
    displayResults(filtered);
    setupSearchBar(searchBar, filtered);

    // Preload voices
    const synth = window.speechSynthesis;
    if ('speechSynthesis' in window) {
        console.log('Initializing SpeechSynthesis...');
        let retryCount = 0; // Initialize retry counter
        const maxRetries = 4; // Set maximum retries

        const loadVoicesWithRetry = () => {
            const voices = synth.getVoices();
            if (voices.length > 0) {
                console.log('Voices loaded:', voices);
            } else if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Voices not loaded yet. Retrying... (${retryCount}/${maxRetries})`);
                setTimeout(loadVoicesWithRetry, 500); // Retry after 500ms
            } else {
                console.warn('Failed to load voices after maximum retries.');
            }
        };

        if (synth.getVoices().length > 0) {
            console.log('Voices already loaded:', synth.getVoices());
        } else {
            console.log('Waiting for voices to load...');
            synth.onvoiceschanged = () => {
                console.log('Voices loaded via onvoiceschanged event.');
            }; // Wait for voices to load
            loadVoicesWithRetry(); // Start retry mechanism
        }
    } else {
        console.warn('SpeechSynthesis API is not supported in this browser.');
    }
}