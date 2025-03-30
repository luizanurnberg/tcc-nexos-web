$(document).ready(function () {
    const cleanPath = window.location.pathname.replace(/\/$/, '');
    const releaseId = cleanPath.split('/').pop();
    const authToken = localStorage.getItem('authToken');;
    if (!authToken) return redirectToLogin();

    $.ajax({
        url: `${window.config.api}/kanban/list/${releaseId}`,
        headers: { Authorization: `Bearer ${authToken}` },
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

                data.data.CLIENT_CHOSEN.forEach(client => {
                    const columnHtml = `
                        <div class="flex flex-col flex-shrink-0 w-72 border rounded-md overflow-hidden border-gray-200 dark:border-gray-700">
                            <div class="flex items-center flex-shrink-0 h-10 p-4 bg-white dark:bg-slate-800">
                                <span class="block text-sm font-semibold uppercase">${client.NAME}</span>
                            </div>
                            <div class="flex flex-col gap-4 overflow-auto p-4 h-[calc(100vh-300px)] kanban-board custom-scroll" id="kanban-${client.ID}">
                            </div>
                        </div>
                    `;
                    $('#container').append(columnHtml);

                    data.data.REQUIREMENT_TO_IMPLEMENT.forEach(function (req) {
                        if (req.CLIENT === client.NAME) {
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
                            $(`#kanban-${client.ID}`).append(cardHtml);
                        }
                    });
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro na requisição AJAX:", error);
        },
    });
});
