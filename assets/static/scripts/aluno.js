document.addEventListener('DOMContentLoaded', () => {
    // Verifica autenticação
    const user = JSON.parse(localStorage.getItem('ifeed_user') || 'null');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Exibe nome do usuário
    const userName = user.name || user.login?.split('@')[0] || 'Aluno';
    const userInitials = userName.substring(0, 2).toUpperCase();
    document.getElementById('user-name').textContent = `Olá, ${userName}`;

    // Funcionalidade de logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        document.getElementById('logout-modal').style.display = 'flex';
    });

    document.getElementById('logout-confirm').addEventListener('click', () => {
        localStorage.removeItem('ifeed_user');
        window.location.href = 'login.html';
    });

    document.getElementById('logout-cancel').addEventListener('click', () => {
        document.getElementById('logout-modal').style.display = 'none';
    });

    // Fecha modal ao clicar fora
    document.getElementById('logout-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('logout-modal')) {
            document.getElementById('logout-modal').style.display = 'none';
        }
    });

    // Vincula botões de avaliar às refeições
    document.querySelectorAll('.btn.avaliar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.currentTarget.closest('.meal-card');
            const mealName = card ? card.querySelector('h3')?.textContent?.trim() : 'Refeição';
            sessionStorage.setItem('mealToReview', mealName);
            window.location.href = 'avaliacao.html';
        });
    });

    // Carrega e exibe avaliações do localStorage
    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('ifeed_reviews') || '[]');
        const container = document.getElementById('reviews-container');
        
        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="empty-reviews">
                    <p>📝 Você ainda não enviou nenhuma avaliação.</p>
                    <p>Avalie uma refeição para começar!</p>
                </div>
            `;
            return;
        }

        // Mostra apenas as 3 avaliações mais recentes
        const recentReviews = reviews.slice(0, 3);
        container.innerHTML = recentReviews.map(review => {
            const date = new Date(review.date);
            const formatted = date.toLocaleDateString('pt-BR') + ', ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            const initials = (review.user || 'A').substring(0, 2).toUpperCase();
            const starsDisplay = '★'.repeat(parseInt(review.geral) || 0) + '☆'.repeat(5 - (parseInt(review.geral) || 0));

            return `
                <div class="review-card">
                    <header class="review-header">
                        <div class="review-author">
                            <div class="avatar">${initials}</div>
                            <div>
                                <strong>${review.user}</strong>
                                <div class="review-meta">${formatted}</div>
                            </div>
                        </div>
                        <div class="stars">${starsDisplay}</div>
                    </header>

                    <div class="review-body">
                        <h3>${review.meal}</h3>
                        ${review.comentario ? `<p>${review.comentario}</p>` : ''}

                        <div class="review-scores">
                            <div><strong>Sabor:</strong> ${review.sabor}/5</div>
                            <div><strong>Apresentação:</strong> ${review.apresentacao}/5</div>
                            <div><strong>Temperatura:</strong> ${review.temperatura}/5</div>
                            <div><strong>Quantidade:</strong> ${review.quantidade}/5</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadReviews();
});

