// static/js/pages/monthly-releases-chart.js
var colors = ["#0acf97", "#3073F1", "#fa5c7c"];
var dataColors = document.querySelector("#monthly-releases-chart").dataset.colors;

if (dataColors) {
    colors = dataColors.split(",");
}

var options = {
    chart: {
        height: 350,
        type: 'bar',
        stacked: true,
        toolbar: {
            show: false
        }
    },
    colors: colors,
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '45%',
        },
    },
    series: [
        {
            name: 'Finished',
            data: []
        },
        {
            name: 'In Progress',
            data: []
        },
        {
            name: 'With Errors',
            data: []
        }
    ],
    xaxis: {
        categories: []
    },
    yaxis: {
        title: {
            text: 'Number of Releases'
        }
    },
    legend: {
        position: 'top'
    },
    fill: {
        opacity: 1
    }
};

var chart = new ApexCharts(document.querySelector("#monthly-releases-chart"), options);
chart.render();

// Update chart with real data when available
document.addEventListener('metricsLoaded', function(e) {
    const metrics = e.detail;
    let categories = [];
    let finishedData = [];
    let progressData = [];
    let errorData = [];
    
    metrics.forEach(month => {
        categories.push(`${month.month}/${month.year}`);
        finishedData.push(month.finished_releases);
        progressData.push(month.generation_releases);
        errorData.push(month.error_releases);
    });
    
    chart.updateOptions({
        xaxis: {
            categories: categories
        },
        series: [
            { data: finishedData },
            { data: progressData },
            { data: errorData }
        ]
    });
});