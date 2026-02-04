// add data to  the results div
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    const list = Array.isArray(data) ? data : (data && data.textos) || [];
    list.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'tarjeta-resultado';
        itemDiv.innerHTML = `
                    <span class="dia">${escapeHtml(item.dia || '')}</span>
                    <span class="contenido"><strong>${escapeHtml(item.contenido)}</strong></span>
                    <span class="pinyin" onclick="playTextToSpeech('${escapeHtml(item.contenido)}')">${escapeHtml(item.pinyin + ' ▶️' || '')}</span>
                    <span class="significado">${escapeHtml(item.significado)}</span>
                    <span class="tags">
                        ${item.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join(' ')}
                    </span>
                `;
        resultsDiv.appendChild(itemDiv);
    });

}

function setupSearchBar(searchBar, textos) {
    const sortSelect = document.getElementById('sort-options');

    searchBar.addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        let filtered = textos;
        if (q) {
            filtered = filterResults(textos, q);
        }
        const sortOrder = sortSelect.value;
        filtered = sortResultsByDate(filtered, sortOrder);
        displayResults(filtered);
    });

    sortSelect.addEventListener('change', () => {
        const q = searchBar.value.trim().toLowerCase();
        let filtered = textos;
        if (q) {
            filtered = filterResults(textos, q);
        }
        const sortOrder = sortSelect.value;
        filtered = sortResultsByDate(filtered, sortOrder);
        displayResults(filtered);
    });
}

function filterResults(textos, query) {
    return textos.filter(it =>
        (it.contenido || '').toLowerCase().includes(query) ||
        (it.significado || '').toLowerCase().includes(query) ||
        (it.dia || '').toLowerCase().includes(query) || // Added to search in the 'dia' field
        String(it.id || '').includes(query) ||
        (it.pinyin || '').toLowerCase().includes(query) || // Added to search in the 'pinyin' field
        (it.tags || []).some(tag => tag.toLowerCase().includes(query))
    );
}

// Add sorting functionality by date
function sortResultsByDate(textos, order = 'asc') {
    return textos.sort((a, b) => {
        const dateA = new Date(a.dia);
        const dateB = new Date(b.dia);
        if (order === 'asc') {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });
}