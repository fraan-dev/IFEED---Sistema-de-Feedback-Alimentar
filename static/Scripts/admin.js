document.addEventListener('DOMContentLoaded', function () {
    const MOCK_FEEDBACKS = [
        { aluno: 'Maria Silva', refeicao: 'Almoço - Frango Grelhado', avaliacaoGeral: 5, sabor: 5, apresentacao: 4, temperatura: 5, quantidade: 4, comentario: 'Muito saboroso e bem temperado!', data: '2026-06-29' },
        { aluno: 'João Pedro', refeicao: 'Lanche da Tarde - Bolo', avaliacaoGeral: 4, sabor: 4, apresentacao: 4, temperatura: 3, quantidade: 5, comentario: 'Bolo bom, mas chegou meio frio.', data: '2026-06-29' },
        { aluno: 'Ana Beatriz', refeicao: 'Janta - Cuscuz e Carne', avaliacaoGeral: 3, sabor: 3, apresentacao: 3, temperatura: 4, quantidade: 3, comentario: 'Poderia ter mais tempero na carne.', data: '2026-06-28' },
        { aluno: 'Carlos Eduardo', refeicao: 'Almoço - Macarrão', avaliacaoGeral: 5, sabor: 5, apresentacao: 5, temperatura: 5, quantidade: 5, comentario: 'Perfeito, sem reclamações!', data: '2026-06-28' },
        { aluno: 'Fernanda Costa', refeicao: 'Lanche da Manhã - Frutas', avaliacaoGeral: 4, sabor: 4, apresentacao: 5, temperatura: 4, quantidade: 4, comentario: '', data: '2026-06-27' },
        { aluno: 'Lucas Almeida', refeicao: 'Almoço - Frango Grelhado', avaliacaoGeral: 2, sabor: 2, apresentacao: 3, temperatura: 2, quantidade: 3, comentario: 'Estava frio e a porção era pequena.', data: '2026-06-27' },
        { aluno: 'Beatriz Souza', refeicao: 'Janta - Cuscuz e Carne', avaliacaoGeral: 4, sabor: 4, apresentacao: 4, temperatura: 4, quantidade: 4, comentario: 'Bem servido, gostei da salada.', data: '2026-06-26' },
        { aluno: 'Rafael Santos', refeicao: 'Lanche da Tarde - Bolo', avaliacaoGeral: 5, sabor: 5, apresentacao: 4, temperatura: 5, quantidade: 5, comentario: 'Excelente, repito sempre!', data: '2026-06-26' },
    ];

    const feedbacksContainer = document.getElementById('feedbacks-container');

    if (feedbacksContainer) {
        const countEl = document.getElementById('feedback-count');
        const searchInput = document.getElementById('search-input');
        const ratingFilter = document.getElementById('filter-rating');

        function starsHtml(n) {
            return '⭐'.repeat(n) + '☆'.repeat(5 - n);
        }

        function renderFeedbacks(list) {
            feedbacksContainer.innerHTML = '';

            if (list.length === 0) {
                feedbacksContainer.innerHTML = '<p class="empty-state">Nenhum feedback encontrado com esses filtros.</p>';
                return;
            }

            list.forEach(function (fb) {
                const card = document.createElement('article');
                card.className = 'feedback-card';
                card.innerHTML =
                    '<div class="feedback-header">' +
                        '<div>' +
                            '<h3>' + fb.aluno + '</h3>' +
                            '<small>' + fb.refeicao + '</small>' +
                        '</div>' +
                        '<span class="feedback-rating">' + starsHtml(fb.avaliacaoGeral) + '</span>' +
                    '</div>' +
                    (fb.comentario ? '<p class="feedback-comment">"' + fb.comentario + '"</p>' : '<p class="feedback-comment empty">Sem comentário</p>') +
                    '<div class="feedback-footer"><small>' + new Date(fb.data).toLocaleDateString('pt-BR') + '</small></div>';
                feedbacksContainer.appendChild(card);
            });

            if (countEl) countEl.textContent = list.length;
        }

        function applyFilters() {
            const term = (searchInput ? searchInput.value : '').trim().toLowerCase();
            const rating = ratingFilter ? ratingFilter.value : '';

            const filtered = MOCK_FEEDBACKS.filter(function (fb) {
                const matchesTerm = !term ||
                    fb.aluno.toLowerCase().includes(term) ||
                    fb.refeicao.toLowerCase().includes(term) ||
                    (fb.comentario || '').toLowerCase().includes(term);

                const matchesRating = !rating || String(fb.avaliacaoGeral) === rating;

                return matchesTerm && matchesRating;
            });

            renderFeedbacks(filtered);
        }

        let debounceTimer;
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(applyFilters, 200);
            });
        }
        if (ratingFilter) {
            ratingFilter.addEventListener('change', applyFilters);
        }

        applyFilters();
    }

    const distributionCanvas = document.getElementById('distributionChart');

    if (distributionCanvas && typeof Chart !== 'undefined') {
        const palette = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.responsive = true;

        const distribution = [1, 2, 3, 4, 5].map(function (n) {
            return MOCK_FEEDBACKS.filter(function (fb) { return fb.avaliacaoGeral === n; }).length;
        });

        new Chart(distributionCanvas, {
            type: 'bar',
            data: {
                labels: ['1 ⭐', '2 ⭐', '3 ⭐', '4 ⭐', '5 ⭐'],
                datasets: [{
                    label: 'Quantidade de avaliações',
                    data: distribution,
                    backgroundColor: palette,
                }],
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            },
        });

        function average(field) {
            const total = MOCK_FEEDBACKS.reduce(function (sum, fb) { return sum + fb[field]; }, 0);
            return Number((total / MOCK_FEEDBACKS.length).toFixed(1));
        }

        const categoryAverages = {
            sabor: average('sabor'),
            apresentacao: average('apresentacao'),
            temperatura: average('temperatura'),
            quantidade: average('quantidade'),
        };

        const categoryCanvas = document.getElementById('categoryChart');
        if (categoryCanvas) {
            new Chart(categoryCanvas, {
                type: 'radar',
                data: {
                    labels: ['Sabor', 'Apresentação', 'Temperatura', 'Quantidade'],
                    datasets: [{
                        label: 'Média (0-5)',
                        data: [categoryAverages.sabor, categoryAverages.apresentacao, categoryAverages.temperatura, categoryAverages.quantidade],
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        borderColor: '#22c55e',
                        pointBackgroundColor: '#22c55e',
                    }],
                },
                options: {
                    scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } },
                },
            });
        }

        const mealTypes = {};
        MOCK_FEEDBACKS.forEach(function (fb) {
            const type = fb.refeicao.split(' - ')[0];
            mealTypes[type] = (mealTypes[type] || 0) + 1;
        });

        const mealCanvas = document.getElementById('mealChart');
        if (mealCanvas) {
            new Chart(mealCanvas, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(mealTypes),
                    datasets: [{
                        data: Object.values(mealTypes),
                        backgroundColor: palette,
                    }],
                },
                options: {
                    plugins: { legend: { position: 'bottom' } },
                },
            });
        }

        const byDate = {};
        MOCK_FEEDBACKS.forEach(function (fb) {
            if (!byDate[fb.data]) byDate[fb.data] = [];
            byDate[fb.data].push(fb.avaliacaoGeral);
        });

        const dates = Object.keys(byDate).sort();
        const dailyAverages = dates.map(function (d) {
            const values = byDate[d];
            return Number((values.reduce(function (a, b) { return a + b; }, 0) / values.length).toFixed(1));
        });

        const timelineCanvas = document.getElementById('timelineChart');
        if (timelineCanvas) {
            new Chart(timelineCanvas, {
                type: 'line',
                data: {
                    labels: dates.map(function (d) { return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); }),
                    datasets: [{
                        label: 'Média geral',
                        data: dailyAverages,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        fill: true,
                        tension: 0.3,
                    }],
                },
                options: {
                    scales: { y: { min: 0, max: 5 } },
                },
            });
        }

        const statMap = {
            'stat-sabor': categoryAverages.sabor,
            'stat-apresentacao': categoryAverages.apresentacao,
            'stat-temperatura': categoryAverages.temperatura,
            'stat-quantidade': categoryAverages.quantidade,
        };

        Object.keys(statMap).forEach(function (id) {
            const el = document.getElementById(id);
            if (el) el.textContent = statMap[id] + '/5';
        });
    }
});