// static/js/pages/clients-chart.js
var colors = ["#0acf97", "#3073F1", "#fa5c7c", "#ffbc00", "#5b69bc"];
var dataColors = document.querySelector("#clients-chart").dataset.colors;

if (dataColors) {
    colors = dataColors.split(",");
}

var options = {
    chart: {
        height: 300,
        type: 'donut',
    },
    colors: colors,
    labels: [],
    series: [],
    legend: {
        show: false
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    total: {
                        show: true,
                        label: 'Total Cards',
                        formatter: function(w) {
                            return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                        }
                    }
                }
            }
        }
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
};

var chart = new ApexCharts(document.querySelector("#clients-chart"), options);
chart.render();

// Update chart with real data when available
document.addEventListener('metricsLoaded', function(e) {
    const metrics = e.detail;
    let clientsData = {};
    
    // Aggregate client data from all months
    metrics.forEach(month => {
        month.clients.forEach(client => {
            if (!clientsData[client.name]) {
                clientsData[client.name] = 0;
            }
            clientsData[client.name] += client.total_cards;
        });
    });
    
    const clientNames = Object.keys(clientsData);
    const clientValues = Object.values(clientsData);
    
    // Update chart
    chart.updateOptions({
        labels: clientNames,
        series: clientValues
    });
    
    // Update legend
    const legendContainer = document.getElementById('clients-legend');
    legendContainer.innerHTML = '';
    clientNames.forEach((name, index) => {
        const color = colors[index % colors.length];
        const legendItem = document.createElement('div');
        legendItem.className = 'flex items-center';
        legendItem.innerHTML = `
            <span class="w-3 h-3 rounded-full me-2" style="background-color: ${color}"></span>
            <span>${name}</span>
        `;
        legendContainer.appendChild(legendItem);
    });
});