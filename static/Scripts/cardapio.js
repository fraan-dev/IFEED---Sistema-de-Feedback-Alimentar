document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('cardapio-search');
    const tipo = document.getElementById('tipo');
    const cards = Array.from(document.querySelectorAll('[data-cardapio-card]'));
    const emptyMessage = document.getElementById('cardapio-empty-client');

    if (!input || !cards.length) return;

    function normalize(text) {
        return (text || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    function applyFilter() {
        const query = normalize(input.value);
        const selectedType = normalize(tipo ? tipo.options[tipo.selectedIndex].text : '');
        let visibleCount = 0;

        cards.forEach(function (card) {
            const content = normalize(card.textContent);
            const matchesQuery = !query || content.includes(query);
            const matchesType = !tipo || !tipo.value || content.includes(selectedType);
            const visible = matchesQuery && matchesType;

            card.hidden = !visible;
            if (visible) visibleCount += 1;
        });

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount > 0;
        }
    }

    input.addEventListener('input', applyFilter);

    if (tipo) {
        tipo.addEventListener('change', applyFilter);
    }

    applyFilter();
});
