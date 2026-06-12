document.addEventListener('DOMContentLoaded', () => {
    // Redirect back if no meal selected or user not logged
    const user = JSON.parse(localStorage.getItem('ifeed_user') || 'null');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const mealName = sessionStorage.getItem('mealToReview') || 'Refeição';
    document.getElementById('meal-name').textContent = mealName;

    // back link
    document.getElementById('back-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'aluno.html';
    });

    // create simple star controls
    function createStars(container) {
        const field = container.dataset.field;
        container.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('button');
            star.type = 'button';
            star.className = 'star';
            star.dataset.value = i;
            star.setAttribute('aria-label', `${i} estrelas`);
            star.setAttribute('aria-pressed', 'false');
            star.textContent = '★';

            const setValue = (value) => {
                container.dataset.value = value;
                Array.from(container.children).forEach((c, idx) => {
                    const n = idx + 1;
                    if (n <= value) {
                        c.classList.add('selected');
                        c.setAttribute('aria-pressed', 'true');
                    } else {
                        c.classList.remove('selected');
                        c.setAttribute('aria-pressed', 'false');
                    }
                });
            };

            star.addEventListener('click', () => setValue(i));
            star.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    setValue(i);
                }
            });

            container.appendChild(star);
        }

        // set initial if already present
        if (container.dataset.value) {
            setTimeout(() => {
                const val = parseInt(container.dataset.value, 10) || 0;
                if (val > 0) container.querySelectorAll('.star').forEach((s, idx) => {
                    if (idx < val) s.classList.add('selected');
                });
            }, 0);
        }
    }

    document.querySelectorAll('.stars').forEach(createStars);

    const form = document.getElementById('avaliacao-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = {
            meal: mealName,
            user: user.login || user.name || 'Aluno',
            geral: form.querySelector('[data-field="avaliacaoGeral"]').dataset.value || 0,
            sabor: form.querySelector('[data-field="sabor"]').dataset.value || 0,
            apresentacao: form.querySelector('[data-field="apresentacao"]').dataset.value || 0,
            temperatura: form.querySelector('[data-field="temperatura"]').dataset.value || 0,
            quantidade: form.querySelector('[data-field="quantidade"]').dataset.value || 0,
            comentario: document.getElementById('comentario').value.trim(),
            date: new Date().toISOString()
        };

        const reviews = JSON.parse(localStorage.getItem('ifeed_reviews') || '[]');
        reviews.unshift(data);
        localStorage.setItem('ifeed_reviews', JSON.stringify(reviews));

        alert('Avaliação enviada! Obrigado pelo seu feedback.');
        sessionStorage.removeItem('mealToReview');
        window.location.href = 'aluno.html';
    });
});
