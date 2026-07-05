document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('avaliacao-form');
    if (!form) return;

    const ratings = {};
    const totalCampos = document.querySelectorAll('.stars[data-field]').length;
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const comentario = document.getElementById('comentario');
    const charCounter = document.querySelector('.char-counter');
    const starLabels = ['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'];

    document.querySelectorAll('.stars[data-field]').forEach(function(container) {
        const field = container.dataset.field;
        ratings[field] = 0;

        const labelSpan = document.createElement('span');
        labelSpan.className = 'star-label';
        labelSpan.textContent = '';
        container.appendChild(labelSpan);

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('button');
            star.type = 'button';
            star.className = 'star-btn';
            star.textContent = '★';
            star.dataset.value = i;
            star.setAttribute('aria-label', field + ' ' + i + ' estrelas');

            star.addEventListener('click', function(e) {
                e.stopPropagation();
                ratings[field] = i;
                paintStars(container, i);
                updateStarLabel(container, i);
                updateProgress();
                clearError(container);
            });

            star.addEventListener('mouseenter', function() {
                const value = parseInt(this.dataset.value);
                paintStars(container, value);
                updateStarLabel(container, value);
            });

            star.addEventListener('mouseleave', function() {
                paintStars(container, ratings[field]);
                updateStarLabel(container, ratings[field]);
            });

            container.appendChild(star);
        }
    });

    function paintStars(container, value) {
        container.querySelectorAll('.star-btn').forEach(function(star) {
            const active = Number(star.dataset.value) <= value;
            star.classList.toggle('active', active);
        });
    }

    function updateStarLabel(container, value) {
        const label = container.querySelector('.star-label');
        if (label) {
            const text = starLabels[value] || '';
            label.textContent = text;
            label.classList.toggle('active-text', text !== '');
        }
    }

    function updateProgress() {
        const avaliados = Object.values(ratings).filter(v => v > 0).length;
        const percentage = totalCampos > 0 ? (avaliados / totalCampos) * 100 : 0;

        if (progressFill) {
            progressFill.style.width = Math.min(percentage, 100) + '%';
        }
        if (progressText) {
            progressText.textContent = avaliados + '/' + totalCampos + ' avaliados';
        }
    }

    function clearError(container) {
        const group = container.closest('.rating-group');
        if (group) {
            group.classList.remove('error');
        }
    }

    function showError(container) {
        const group = container.closest('.rating-group');
        if (group) {
            group.classList.add('error');
        }
    }

    if (comentario && charCounter) {
        comentario.addEventListener('input', function() {
            const length = this.value.length;
            charCounter.textContent = length + '/500';
            charCounter.classList.remove('warning', 'danger');
            
            if (length > 480) {
                charCounter.classList.add('danger');
            } else if (length > 400) {
                charCounter.classList.add('warning');
            }
        });
    }

    form.addEventListener('submit', function(event) {
        const missing = Object.keys(ratings).filter(function(field) {
            return ratings[field] === 0;
        });

        document.querySelectorAll('.stars[data-field]').forEach(function(container) {
            const field = container.dataset.field;
            if (ratings[field] === 0) {
                showError(container);
            } else {
                clearError(container);
            }
        });

        if (missing.length > 0) {
            event.preventDefault();
            
            const firstMissing = document.querySelector('.stars[data-field="' + missing[0] + '"]');
            if (firstMissing) {
                firstMissing.closest('.rating-group').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }

            const campoNomes = {
                'avaliacao_geral': 'Avaliação Geral',
                'sabor': 'Sabor',
                'apresentacao': 'Apresentação',
                'temperatura': 'Temperatura',
                'quantidade': 'Quantidade'
            };
            
            const nomesFaltando = missing.map(f => campoNomes[f] || f).join(', ');
            alert('⚠️ Por favor, avalie todos os itens antes de enviar.\n\nFaltam: ' + nomesFaltando);
            return;
        }

        Object.keys(ratings).forEach(function(field) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field;
            input.value = ratings[field];
            form.appendChild(input);
        });
    });

    updateProgress();
});