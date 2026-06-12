document.addEventListener('DOMContentLoaded', () => {
    // Verify admin authentication
    const user = JSON.parse(localStorage.getItem('ifeed_user') || 'null');
    if (!user || user.tipo !== 'administrador') {
        window.location.href = 'login.html';
        return;
    }

    // Set admin user name
    const userName = user.name || user.login?.split('@')[0] || 'Administrador';
    const userElements = document.querySelectorAll('#user-name');
    userElements.forEach(el => el.textContent = `Olá, ${userName}`);

    // Logout functionality
    const logoutBtns = document.querySelectorAll('#logout-btn');
    const logoutModal = document.getElementById('logout-modal');
    const logoutConfirm = document.getElementById('logout-confirm');
    const logoutCancel = document.getElementById('logout-cancel');

    logoutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            logoutModal.style.display = 'flex';
        });
    });

    logoutConfirm.addEventListener('click', () => {
        localStorage.removeItem('ifeed_user');
        window.location.href = 'login.html';
    });

    logoutCancel.addEventListener('click', () => {
        logoutModal.style.display = 'none';
    });

    // Close modal if clicking outside
    logoutModal.addEventListener('click', (e) => {
        if (e.target === logoutModal) {
            logoutModal.style.display = 'none';
        }
    });

    // Load reviews data
    const reviews = JSON.parse(localStorage.getItem('ifeed_reviews') || '[]');

    // Check if on reports page
    if (document.getElementById('distributionChart')) {
        initReportsPage(reviews);
    }

    // Check if on feedbacks page
    if (document.getElementById('feedbacks-container')) {
        initFeedbacksPage(reviews);
    }
});

function initReportsPage(reviews) {
    if (reviews.length === 0) {
        // Generate mock data for demo
        reviews = generateMockReviews();
    }

    // Calculate statistics
    const stats = calculateStats(reviews);

    // Update stat cards
    document.getElementById('stat-sabor').textContent = stats.sabor.toFixed(1) + '/5';
    document.getElementById('stat-apresentacao').textContent = stats.apresentacao.toFixed(1) + '/5';
    document.getElementById('stat-temperatura').textContent = stats.temperatura.toFixed(1) + '/5';
    document.getElementById('stat-quantidade').textContent = stats.quantidade.toFixed(1) + '/5';

    // Create charts
    createDistributionChart(reviews);
    createCategoryChart(stats);
    createMealChart(reviews);
    createTimelineChart(reviews);
}

function initFeedbacksPage(reviews) {
    if (reviews.length === 0) {
        reviews = generateMockReviews();
    }

    const container = document.getElementById('feedbacks-container');
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-rating');
    const feedbackCount = document.getElementById('feedback-count');

    function renderFeedbacks(filtered) {
        feedbackCount.textContent = filtered.length;

        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty-feedbacks"><p>📭 Nenhum feedback encontrado.</p></div>';
            return;
        }

        container.innerHTML = filtered.map(review => {
            const date = new Date(review.date);
            const formatted = date.toLocaleDateString('pt-BR') + ', ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            const initials = (review.user || 'A').substring(0, 2).toUpperCase();
            const starsDisplay = '★'.repeat(parseInt(review.geral) || 0) + '☆'.repeat(5 - (parseInt(review.geral) || 0));

            return `
                <div class="feedback-card">
                    <div class="feedback-header">
                        <div class="feedback-author">
                            <div class="feedback-avatar">${initials}</div>
                            <div class="feedback-info">
                                <strong>${review.user}</strong>
                                <div class="feedback-meta">${formatted}</div>
                            </div>
                        </div>
                        <div class="feedback-stars">${starsDisplay}</div>
                    </div>

                    <div class="feedback-body">
                        <h3>${review.meal}</h3>
                        ${review.comentario ? `<p>${review.comentario}</p>` : ''}

                        <div class="feedback-scores">
                            <div class="score-item"><strong>Sabor:</strong> ${review.sabor}/5</div>
                            <div class="score-item"><strong>Apresentação:</strong> ${review.apresentacao}/5</div>
                            <div class="score-item"><strong>Temperatura:</strong> ${review.temperatura}/5</div>
                            <div class="score-item"><strong>Quantidade:</strong> ${review.quantidade}/5</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function filterAndRender() {
        let filtered = reviews;

        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(r => 
                r.user.toLowerCase().includes(searchTerm) ||
                r.meal.toLowerCase().includes(searchTerm) ||
                (r.comentario && r.comentario.toLowerCase().includes(searchTerm))
            );
        }

        const ratingFilter = filterSelect.value;
        if (ratingFilter) {
            filtered = filtered.filter(r => parseInt(r.geral) === parseInt(ratingFilter));
        }

        renderFeedbacks(filtered);
    }

    searchInput.addEventListener('input', filterAndRender);
    filterSelect.addEventListener('change', filterAndRender);

    renderFeedbacks(reviews);
}

function calculateStats(reviews) {
    if (reviews.length === 0) return { sabor: 0, apresentacao: 0, temperatura: 0, quantidade: 0 };

    const stats = { sabor: 0, apresentacao: 0, temperatura: 0, quantidade: 0 };
    reviews.forEach(r => {
        stats.sabor += parseInt(r.sabor) || 0;
        stats.apresentacao += parseInt(r.apresentacao) || 0;
        stats.temperatura += parseInt(r.temperatura) || 0;
        stats.quantidade += parseInt(r.quantidade) || 0;
    });

    Object.keys(stats).forEach(key => {
        stats[key] /= reviews.length;
    });

    return stats;
}

function createDistributionChart(reviews) {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
    reviews.forEach(r => {
        const rating = parseInt(r.geral) || 0;
        if (counts.hasOwnProperty(rating)) counts[rating]++;
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['5 estrelas', '4 estrelas', '3 estrelas', '2 estrelas', '1 estrela', 'Sem avaliação'],
            datasets: [{
                data: [counts[5], counts[4], counts[3], counts[2], counts[1], counts[0]],
                backgroundColor: ['#2f9b4a', '#52b788', '#74c69d', '#b7e4c7', '#e0f4e4', '#e6edf0']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function createCategoryChart(stats) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sabor', 'Apresentação', 'Temperatura', 'Quantidade'],
            datasets: [{
                label: 'Média',
                data: [stats.sabor, stats.apresentacao, stats.temperatura, stats.quantidade],
                backgroundColor: '#2f9b4a',
                borderColor: '#257a38',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: { x: { beginAtZero: true, max: 5 } }
        }
    });
}

function createMealChart(reviews) {
    const ctx = document.getElementById('mealChart');
    if (!ctx) return;

    const mealCounts = {};
    const mealRatings = {};

    reviews.forEach(r => {
        if (!mealCounts[r.meal]) {
            mealCounts[r.meal] = 0;
            mealRatings[r.meal] = 0;
        }
        mealCounts[r.meal]++;
        mealRatings[r.meal] += parseInt(r.geral) || 0;
    });

    const meals = Object.keys(mealCounts).slice(0, 6);
    const counts = meals.map(m => mealCounts[m]);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meals,
            datasets: [{
                label: 'Avaliação Média',
                data: meals.map(m => (mealRatings[m] / mealCounts[m]).toFixed(1)),
                backgroundColor: '#2f9b4a'
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, max: 5 } }
        }
    });
}

function createTimelineChart(reviews) {
    const ctx = document.getElementById('timelineChart');
    if (!ctx) return;

    // Group by date
    const byDate = {};
    reviews.forEach(r => {
        const date = new Date(r.date).toLocaleDateString('pt-BR');
        if (!byDate[date]) byDate[date] = { count: 0, sum: 0 };
        byDate[date].count++;
        byDate[date].sum += parseInt(r.geral) || 0;
    });

    const dates = Object.keys(byDate).sort();
    const counts = dates.map(d => byDate[d].count);
    const ratings = dates.map(d => (byDate[d].sum / byDate[d].count).toFixed(1));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Nº de Feedbacks',
                    data: counts,
                    borderColor: '#d4a574',
                    yAxisID: 'y',
                    tension: 0.3
                },
                {
                    label: 'Avaliação Média',
                    data: ratings,
                    borderColor: '#2f9b4a',
                    yAxisID: 'y1',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { position: 'left', beginAtZero: true },
                y1: { position: 'right', beginAtZero: true, max: 5 }
            }
        }
    });
}

function generateMockReviews() {
    const meals = ['Arroz, Feijão, Frango Grelhado e Salada', 'Lanche da Manhã', 'Bolo de Chocolate e Café', 'Sopa de Legumes e Broa'];
    const users = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Paula', 'Carlos Eduardo', 'Juliana Oliveira', 'Rafael Souza', 'Beatriz Lima'];
    const comments = [
        'Excelente refeição! O frango estava muito bem temperado e a salada fresca.',
        'Boa refeição, mas poderia ter mais molho no macarrão.',
        'A comida estava boa, mas a quantidade de arroz era pouca.',
        'Café da manhã perfeito! Pão quentinho e frutas frescas.',
        'Peixe bem preparado, legumes crocantes. Muito saudável!',
        'Adorei carne de sol! Estava deliciosa e bem temperada.',
        'Macarrão gostoso, massa no ponto certo.',
        'Refeição balanceada e saborosa. Parabéns à equipe!',
        'Sopa deliciosa mas faltou mais legume variado.',
        '',
        ''
    ];

    const reviews = [];
    for (let i = 0; i < 8; i++) {
        reviews.push({
            meal: meals[Math.floor(Math.random() * meals.length)],
            user: users[Math.floor(Math.random() * users.length)],
            geral: Math.floor(Math.random() * 5) + 1,
            sabor: Math.floor(Math.random() * 5) + 1,
            apresentacao: Math.floor(Math.random() * 5) + 1,
            temperatura: Math.floor(Math.random() * 5) + 1,
            quantidade: Math.floor(Math.random() * 5) + 1,
            comentario: comments[Math.floor(Math.random() * comments.length)],
            date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
        });
    }

    return reviews;
}
