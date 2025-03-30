document.addEventListener('DOMContentLoaded', function() {
    function redirectToLogin() {
        window.location.href = '/login';
    }

    function fetchReleaseMetrics() {
        const authToken = localStorage.getItem('authToken');
        const uid = localStorage.getItem('uid');
        
        if (!authToken) return redirectToLogin();

        $.ajax({
            url: `${window.config.api}/release/metrics?uid=${uid}`,
            method: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            headers: { Authorization: `Bearer ${authToken}` },
            success: function(response) {
                if (response.message === 'success' && response.data) {
                    updateDashboard(response.data);
                }
            },
            error: function(error) {
                console.error('Error fetching metrics:', error);
            }
        });
    }

    function updateDashboard(metrics) {
        const statusChartContainer = document.querySelector(".status-chart-container");
        const statisticsChartContainer = document.querySelector(".statistics-chart-container");
    
        if (!metrics || metrics.length === 0) {
            console.log("Nenhum dado disponível. Ocultando gráficos.");
    
            // Esconde os cards inteiros
            statusChartContainer.style.display = "none";
            statisticsChartContainer.style.display = "none";
            return;
        }
    
        // Exibe os cards caso haja dados
        statusChartContainer.style.display = "block";
        statisticsChartContainer.style.display = "block";
    
        updateStatusChart(metrics);
        updateStatisticsChart(metrics);
    }

    // 1. Gráfico de Status de Releases (Monthly Target)
    function updateStatusChart(metrics) {
        // Pegar o último mês ou somar todos os meses
        const lastMonth = metrics[metrics.length - 1];
        
        const series = [
            lastMonth.generation_releases || 0, // Em geração
            lastMonth.finished_releases || 0,   // Concluídos
            lastMonth.error_releases || 0       // Com erro
        ];
        
        const options = {
            chart: {
                height: 375,
                type: 'donut',
            },
            series: series,
            labels: ['Em Geração', 'Concluídos', 'Com Erro'],
            colors: ['#3073F1', '#0acf97', '#fa5c7c'],
            legend: {
                show: true,
                position: 'bottom',
                horizontalAlign: 'center',
                floating: false,
                fontSize: '14px',
            },
            responsive: [{
                breakpoint: 600,
                options: {
                    chart: {
                        height: 200
                    },
                    legend: {
                        show: false
                    },
                }
            }]
        };
        
        if (window.statusChart) {
            window.statusChart.updateSeries(series);
        } else {
            window.statusChart = new ApexCharts(
                document.querySelector("#monthly-target"),
                options
            );
            window.statusChart.render();
        }
    }

// 2. Gráfico de Estatísticas - A partir de Janeiro/2025
function updateStatisticsChart(metrics) {
    const startDate = new Date(2025, 0, 1); 
    const currentDate = new Date();
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                       'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    let allMonths = [];
    let date = new Date(startDate);
    
    while (date <= currentDate) {
        allMonths.push({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            label: `${monthNames[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`
        });
        date.setMonth(date.getMonth() + 1);
    }

    const metricsMap = {};
    metrics.forEach(m => {
        const key = `${m.year}-${m.month}`;
        metricsMap[key] = m;
    });

    const seriesData = {
        totalValues: [],
        totalReleases: [],
        finishedReleases: []
    };

    allMonths.forEach(m => {
        const key = `${m.year}-${m.month}`;
        const metric = metricsMap[key] || {};
        
        seriesData.totalValues.push(metric.total_value || 0);
        seriesData.totalReleases.push(metric.total_releases || 0);
        seriesData.finishedReleases.push(metric.finished_releases || 0);
    });

    var options = {
        chart: {
            height: 400,
            type: 'bar',
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '15%',
                endingShape: 'rounded'
            }
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        series: [{
            name: 'Valor Total (R$)',
            data: seriesData.totalValues
        }, {
            name: 'Total Releases',
            data: seriesData.totalReleases
        },],
        colors: ['#8A2BE2', '#DA70D6', '#8A2BE2'],
        xaxis: {
            categories: allMonths.map(m => m.label),
            labels: { 
                style: { fontSize: '12px' },
                formatter: function(value) {
                    const currentYear = new Date().getFullYear();
                    const year = value.split('/')[1];
                    return year == currentYear.toString().slice(-2) ? 
                           value.split('/')[0] : value;
                }
            }
        },
        yaxis: [{
            title: { text: 'Valor (R$)', style: { fontWeight: '500' } },
            labels: {
                formatter: function(value) {
                    return 'R$ ' + value.toLocaleString('pt-BR');
                }
            }
        }, {
            opposite: true,
            title: { text: 'Quantidade', style: { fontWeight: '500' } }
        }],
        grid: { borderColor: '#9ca3af20' },
        fill: { opacity: 1 },
        tooltip: {
            y: {
                formatter: function(val, { seriesIndex }) {
                    if (seriesIndex === 0) {
                        return val === 0 ? 'R$ 0,00' : 
                               'R$ ' + val.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                    }
                    return val;
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            offsetY: -5
        }
    };

    if (window.statisticsChart) {
        window.statisticsChart.updateOptions(options);
    } else {
        window.statisticsChart = new ApexCharts(
            document.querySelector("#crm-project-statistics"),
            options
        );
        window.statisticsChart.render();
    }
}

    // Inicializar o dashboard quando o DOM estiver pronto
    fetchReleaseMetrics();
});