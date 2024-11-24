$(document).ready(function () {
    const cleanPath = window.location.pathname.replace(/\/$/, '');
    const releaseId = cleanPath.split('/').pop();

    $.ajax({
        url: `${window.config.api}/kanban/list/${releaseId}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data && data.data) {

                function getPriorityHtml(weight) {
                    if (weight === 25) {
                        return '<span class="text-gray-500"><i class="mgc_snow_line"></i> Prioridade Baixa</span>';
                    } else if (weight === 50) {
                        return '<span class="text-gray-500"><i class="mgc_pin_line"></i> Prioridade Média</span>';
                    } else if (weight === 100) {
                        return '<span class="text-gray-500"><i class="mgc_fire_line"></i> Prioridade Alta</span>';
                    } else {
                        return '<span class="text-gray-500"><i class="icon-unknown-priority"></i> Sem Prioridade</span>';
                    }
                }

                data.data.REQUIREMENT.forEach(function (req) {
                    const priorityHtml = getPriorityHtml(req.WEIGHT);
                    const dependencyLabel = req.DEPENDENTS && req.DEPENDENTS.length > 0
                        ? `<h4 class="flex justify-between items-center h-6 px-3 text-xs font-semibold text-warning bg-warning/25 rounded-full" style="margin-left: -20%">
                        Depende do ${req.DEPENDENTS.map(req => `#${req.ID}`).join(', ')}
                        </h4>`
                        : '';

                    const cardHtml = `
                        <div class="card p-4 break-words">
                            <div class="flex justify-between items-center">
                                <h4
                                    class="flex justify-between items-center h-6 px-5 text-xs font-semibold text-danger bg-danger/25 rounded-full">
                                </h4>
                                ${dependencyLabel}
                                <div class="text-xs">#${req.ID}</div>
                            </div>
                            <h4 class="mt-3 text-sm">${req.NAME}</h4>
                            <div class="flex items-center w-full mt-3 text-xs font-medium text-gray-400">
                                <div class="flex items-center">
                                    <span class="ms-1 leading-none">${req.DESCRIPTION || 'Sem descrição'}</span>
                                </div>
                            </div>
                            <div class="flex items-center w-full mt-3 text-xs font-medium text-gray-400">
                                <div class="flex items-center">
                                    <span class="ms-1 leading-none">${priorityHtml}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    $('#kanbanborad-two').append(cardHtml);
                });

                data.data.REQUIREMENT_TO_IMPLEMENT.sort((a, b) => b.WEIGHT - a.WEIGHT).forEach(function (req) {
                    const priorityHtml = getPriorityHtml(req.WEIGHT);
                    const dependencyLabel = req.DEPENDENTS && req.DEPENDENTS.length > 0
                        ? `<h4 class="flex justify-between items-center h-6 px-3 text-xs font-semibold text-warning bg-warning/25 rounded-full" style="margin-left: -20%">
                        Depende do ${req.DEPENDENTS.map(req => `#${req.ID}`).join(', ')}
                        </h4>`
                        : '';

                    const cardHtml = `
                        <div class="card p-4 break-words">
                            <div class="flex justify-between items-center">
                                <h4
                                    class="flex justify-between items-center h-6 px-5 text-xs font-semibold text-success bg-success/25 rounded-full">
                                </h4>
                                ${dependencyLabel}
                                <div class="text-xs">#${req.ID}</div>
                            </div>
                            <h4 class="mt-3 text-sm">${req.NAME}</h4>
                            <div class="flex items-center w-full mt-3 text-xs font-medium text-gray-400">
                                <div class="flex items-center">
                                    <span class="ms-1 leading-none">${req.DESCRIPTION || 'Sem descrição'}</span>
                                </div>
                            </div>
                            <div class="flex items-center w-full mt-3 text-xs font-medium text-gray-400">
                                <div class="flex items-center">
                                    <span class="ms-1 leading-none">${priorityHtml}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    $('#kanbanborad-one').append(cardHtml);
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro na requisição AJAX:", error);
        },
    });
});
