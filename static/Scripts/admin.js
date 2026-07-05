document.addEventListener('DOMContentLoaded', function () {
    const dataEl = document.getElementById('chart-data');
    if (!dataEl || typeof Chart === 'undefined') return;

    const chartData = JSON.parse(dataEl.textContent);
    const palette = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#2563eb', '#7c3aed'];

    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.color = '#6b7780';

    function commonOptions(extra) {
        return Object.assign({
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 450 },
            resizeDelay: 150,
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        boxHeight: 8,
                    },
                },
            },
        }, extra || {});
    }

    const distributionCanvas = document.getElementById('distributionChart');
    if (distributionCanvas) {
        new Chart(distributionCanvas, {
            type: 'bar',
            data: {
                labels: ['1 ⭐', '2 ⭐', '3 ⭐', '4 ⭐', '5 ⭐'],
                datasets: [{
                    label: 'Quantidade',
                    data: chartData.distribuicao,
                    backgroundColor: palette.slice(0, 5),
                    borderRadius: 8,
                }],
            },
            options: commonOptions({
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, ticks: { precision: 0 } },
                },
            }),
        });
    }

    const categoryCanvas = document.getElementById('categoryChart');
    if (categoryCanvas) {
        new Chart(categoryCanvas, {
            type: 'radar',
            data: {
                labels: ['Sabor', 'Apresentação', 'Temperatura', 'Quantidade'],
                datasets: [{
                    label: 'Média',
                    data: chartData.categorias,
                    backgroundColor: 'rgba(47, 155, 74, 0.18)',
                    borderColor: '#2f9b4a',
                    pointBackgroundColor: '#2f9b4a',
                    pointBorderColor: '#ffffff',
                    pointRadius: 4,
                }],
            },
            options: commonOptions({
                scales: {
                    r: {
                        min: 0,
                        max: 5,
                        ticks: { stepSize: 1 },
                        grid: { color: '#e6edf0' },
                    },
                },
            }),
        });
    }

    const mealCanvas = document.getElementById('mealChart');
    if (mealCanvas) {
        new Chart(mealCanvas, {
            type: 'doughnut',
            data: {
                labels: chartData.refeicoesLabels,
                datasets: [{
                    data: chartData.refeicoesValores,
                    backgroundColor: palette,
                    borderColor: '#ffffff',
                    borderWidth: 3,
                }],
            },
            options: commonOptions({
                cutout: '62%',
                plugins: {
                    legend: { position: 'bottom' },
                },
            }),
        });
    }

    const timelineCanvas = document.getElementById('timelineChart');
    if (timelineCanvas) {
        new Chart(timelineCanvas, {
            type: 'line',
            data: {
                labels: chartData.timelineLabels,
                datasets: [{
                    label: 'Média geral',
                    data: chartData.timelineValores,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.14)',
                    fill: true,
                    tension: 0.35,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }],
            },
            options: commonOptions({
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { min: 0, max: 5 },
                },
            }),
        });
    }
});
