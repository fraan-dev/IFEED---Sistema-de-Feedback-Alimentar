

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('avaliacao-form');
    if (!form) return;

    const STORAGE_KEY = 'ifeedMealSelecionada';
    const REVIEWS_KEY = 'ifeedReviews';

   
    function getMealData() {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                
            }
        }

        const params = new URLSearchParams(window.location.search);
        if (params.has('nome')) {
            return {
                tipo: params.get('tipo') || 'Refeição',
                nome: params.get('nome') || 'Refeição selecionada',
                desc: params.get('desc') || '',
            };
        }
        return null;
    }

    const meal = getMealData();
    if (meal) {
        const typeEl = document.getElementById('meal-type');
        const nameEl = document.getElementById('meal-name');
        const descEl = document.getElementById('meal-desc');
        if (typeEl) typeEl.textContent = meal.tipo;
        if (nameEl) nameEl.textContent = meal.nome;
        if (descEl) descEl.textContent = meal.desc;
    }

    
    const backLink = document.getElementById('back-link');
    if (backLink) {
        backLink.addEventListener('click', function (e) {
            e.preventDefault();
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/aluno/';
            }
        });
    }

  
    const ratings = {}; 

    document.querySelectorAll('.stars[data-field]').forEach(function (container) {
        const field = container.dataset.field;
        ratings[field] = 0;

        container.setAttribute('role', 'radiogroup');
        container.setAttribute('aria-label', 'Avaliação: ' + field);

        for (let i = 1; i <= 5; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'star-btn';
            btn.dataset.value = i;
            btn.setAttribute('role', 'radio');
            btn.setAttribute('aria-checked', 'false');
            btn.setAttribute('aria-label', i + ' de 5 estrelas');
            btn.innerHTML = '<i class="fas fa-star"></i>';

            btn.addEventListener('click', function () {
                setRating(container, field, i);
            });

            
            btn.addEventListener('mouseenter', function () {
                paintStars(container, i);
            });
            btn.addEventListener('mouseleave', function () {
                paintStars(container, ratings[field]);
            });

            container.appendChild(btn);
        }
    });

    function paintStars(container, value) {
        container.querySelectorAll('.star-btn').forEach(function (btn) {
            const active = Number(btn.dataset.value) <= value;
            btn.classList.toggle('active', active);
        });
    }

    function setRating(container, field, value) {
        ratings[field] = value;
        paintStars(container, value);
        container.querySelectorAll('.star-btn').forEach(function (btn) {
            btn.setAttribute('aria-checked', Number(btn.dataset.value) === value ? 'true' : 'false');
        });
    }

  
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const missing = Object.keys(ratings).filter(function (field) {
            return ratings[field] === 0;
        });

        if (missing.length > 0) {
            alert('Por favor, avalie todos os itens antes de enviar.');
            return;
        }

        const comentario = document.getElementById('comentario')
            ? document.getElementById('comentario').value.trim()
            : '';

        const review = {
            meal: meal || { tipo: '', nome: 'Refeição', desc: '' },
            ratings: ratings,
            comentario: comentario,
            data: new Date().toISOString(),
        };

        
        const existing = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
        existing.unshift(review);
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(existing));
        sessionStorage.removeItem(STORAGE_KEY);

        const submitBtn = form.querySelector('.submit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Avaliação enviada!';
        }

        setTimeout(function () {
            window.location.href = '/aluno/';
        }, 900);
    });
});