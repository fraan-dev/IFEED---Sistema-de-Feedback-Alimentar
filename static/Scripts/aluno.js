
document.addEventListener('DOMContentLoaded', function () {

    const MEAL_STORAGE_KEY = 'ifeedMealSelecionada';
    const REVIEWS_KEY = 'ifeedReviews';

    document.querySelectorAll('.meal-card .avaliar').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const card = btn.closest('.meal-card');
            if (!card) return;

            const tipo = card.querySelector('small') ? card.querySelector('small').textContent.trim() : '';
            const nome = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '';
            const desc = card.querySelector('.meal-desc') ? card.querySelector('.meal-desc').textContent.trim() : '';

            sessionStorage.setItem(MEAL_STORAGE_KEY, JSON.stringify({ tipo: tipo, nome: nome, desc: desc }));

           
            window.location.href = '/avaliacao/';
        });
    });

    /* 2. RENDERIZAR AVALIAÇÕES RECENTES */
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;

    function fieldLabel(field) {
        const labels = {
            avaliacaoGeral: 'Geral',
            sabor: 'Sabor',
            apresentacao: 'Apresentação',
            temperatura: 'Temperatura',
            quantidade: 'Quantidade',
        };
        return labels[field] || field;
    }

    function formatDate(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function renderReviews() {
        const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p class="empty-state">Você ainda não avaliou nenhuma refeição. Que tal começar agora?</p>';
            return;
        }

        reviewsContainer.innerHTML = '';

        reviews.forEach(function (review) {
            const card = document.createElement('article');
            card.className = 'review-card';

            const geral = review.ratings && review.ratings.avaliacaoGeral ? review.ratings.avaliacaoGeral : 0;

            const detailsHtml = Object.keys(review.ratings || {})
                .filter(function (f) { return f !== 'avaliacaoGeral'; })
                .map(function (f) {
                    return '<span class="mini-rating">' + fieldLabel(f) + ': ' + '⭐'.repeat(review.ratings[f]) + '</span>';
                })
                .join('');

            card.innerHTML =
                '<div class="review-card-header">' +
                    '<div>' +
                        '<small>' + (review.meal.tipo || '') + '</small>' +
                        '<h3>' + (review.meal.nome || 'Refeição') + '</h3>' +
                    '</div>' +
                    '<span class="review-date">' + formatDate(review.data) + '</span>' +
                '</div>' +
                '<div class="review-general">' + '⭐'.repeat(geral) + ' <strong>' + geral + '/5</strong></div>' +
                '<div class="review-details">' + detailsHtml + '</div>' +
                (review.comentario ? '<p class="review-comment">"' + review.comentario + '"</p>' : '');

            reviewsContainer.appendChild(card);
        });
    }

    renderReviews();
});