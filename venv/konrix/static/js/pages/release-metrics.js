// static/js/pages/release-metrics.js
function loadReleaseMetrics() {
    const authToken = getAuthToken();
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
    // Calculate totals
    let totalValue = 0;
    let totalCompleted = 0;
    let totalInProgress = 0;
    let totalErrors = 0;
    
    metrics.forEach(month => {
        totalValue += month.total_value;
        totalCompleted += month.finished_releases;
        totalInProgress += month.generation_releases;
        totalErrors += month.error_releases;
    });

    // Update summary cards
    $('#total-value').text(`R$ ${totalValue.toLocaleString('pt-BR')}`);
    $('#completed-releases').text(totalCompleted);
    $('#progress-releases').text(totalInProgress);
    $('#error-releases').text(totalErrors);
    
    // Load recent releases
    loadRecentReleases();
    
    // Dispatch event with metrics data
    const event = new CustomEvent('metricsLoaded', { detail: metrics });
    document.dispatchEvent(event);
}

function loadRecentReleases() {
    const authToken = getAuthToken();
    const uid = localStorage.getItem('uid');
    if (!authToken) return redirectToLogin();

    $.ajax({
        url: `${window.config.api}/release/list?uid=${uid}&limit=5`,
        method: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        headers: { Authorization: `Bearer ${authToken}` },
        success: function(response) {
            if (response.message === 'success' && response.data) {
                const container = $('#recent-releases');
                container.empty();
                
                response.data.forEach(release => {
                    const statusColors = {
                        'finished': 'success',
                        'generation': 'warning',
                        'error': 'danger'
                    };
                    
                    const statusColor = statusColors[release.STATUS] || 'primary';
                    
                    container.append(`
                        <div class="flex items-center border border-gray-200 dark:border-gray-700 rounded px-3 py-2">
                            <div class="flex-shrink-0 me-2">
                                <div class="w-12 h-12 flex justify-center items-center rounded-full text-${statusColor} bg-${statusColor}/25">
                                    <i class="mgc_folder_line text-xl"></i>
                                </div>
                            </div>
                            <div class="flex-grow">
                                <h5 class="font-semibold mb-1">${release.TITLE}</h5>
                                <p class="text-gray-400">R$ ${release.TOTAL_BUDGET.toLocaleString('pt-BR')}</p>
                            </div>
                            <div>
                                <span class="badge bg-${statusColor}/10 text-${statusColor}">${release.STATUS}</span>
                            </div>
                        </div>
                    `);
                });
            }
        },
        error: function(error) {
            console.error('Error fetching recent releases:', error);
        }
    });
}

$(document).ready(function() {
    loadReleaseMetrics();
    
    // Time period filter
    $('.time-period').on('click', function() {
        $('.time-period').removeClass('bg-primary/25 text-primary').addClass('bg-gray-400/25 text-gray-400');
        $(this).removeClass('bg-gray-400/25 text-gray-400').addClass('bg-primary/25 text-primary');
    });
});