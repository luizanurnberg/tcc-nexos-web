$(document).ready(function () {
    const cleanPath = window.location.pathname.replace(/\/$/, '');
    const releaseId = cleanPath.split('/').pop();

    $.ajax({
        url: `${window.config.api}/kanban/list/${releaseId}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data && data.data) {
                console.log(data.data);

                data.data.REQUIREMENT.forEach(function (req) {
                    const dependencyLabel = req.DEPENDENTS && req.DEPENDENTS.length > 0
                        ? '<h4 class="flex justify-between items-center h-6 px-3 text-xs font-semibold text-warning bg-warning/25 rounded-full">Depende do ...</h4>'
                        : '';

                    const cardHtml = `
                        <div class="card p-4 cursor-pointer">
                            <div class="flex justify-between items-center">
                                <h4 class="flex justify-between items-center h-6 px-3 text-xs font-semibold text-danger bg-danger/25 rounded-full">
                                </h4>
                                ${dependencyLabel}
                                <div class="text-xs">#${req.ID}</div>
                            </div>
                            <h4 class="mt-3 text-sm">${req.NAME}</h4>
                            <div class="flex items-center w-full mt-3 text-xs font-medium text-gray-400">
                                <div class="flex items-center">
                                    <i class="mgc_chat_3_line text-base"></i>
                                    <span class="ms-1 leading-none">${req.comments_count}</span>
                                </div>
                                <div class="flex items-center ms-4">
                                    <i class="mgc_attachment_line rotate-45 text-base"></i>
                                    <span class="ms-1 leading-none">${req.attachments_count}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    $('#kanbanborad-two').append(cardHtml);
                });

                data.data.REQUIREMENT_TO_IMPLEMENT.forEach(function (req) {
                    const dependencyLabel = req.DEPENDENTS && req.DEPENDENTS.length > 0
                        ? '<h4 class="flex justify-between items-center h-6 px-3 text-xs font-semibold text-warning bg-warning/25 rounded-full">Depende do ...</h4>'
                        : '';

                    const cardHtml = `
                        <div class="card p-4 cursor-pointer">
                            <div class="flex justify-between items-center">
                                <h4
                                    class="flex justify-between items-center h-6 px-3 text-xs font-semibold text-success bg-success/25 rounded-full">
                                </h4>
                                ${dependencyLabel}
                                <div class="text-xs">#${req.ID}</div>
                            </div>
                            <h4 class="mt-3 text-sm">${req.NAME}</h4>
                            <div class="flex items-center w-full mt-3 text-xs font-medium text-gray-400">
                                <div class="flex items-center">
                                    <i class="mgc_chat_3_line text-base"></i>
                                    <span class="ms-1 leading-none">${req.comments_count}</span>
                                </div>
                                <div class="flex items-center ms-4">
                                    <i class="mgc_attachment_line rotate-45 text-base"></i>
                                    <span class="ms-1 leading-none">${req.attachments_count}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    $('#kanbanborad-one').append(cardHtml);
                });

                initializeSortable();
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro na requisição AJAX:", error);
        },
    });


    function initializeSortable() {
        const kanbanOne = document.getElementById('kanbanborad-one');
        const kanbanTwo = document.getElementById('kanbanborad-two');
        const kanbanThree = document.getElementById('kanbanborad-three');
        const kanbanFour = document.getElementById('kanbanborad-four');
        const kanbanFive = document.getElementById('kanbanborad-five');
        const kanbanSix = document.getElementById('kanbanborad-six');

        if (kanbanOne) {
            new Sortable(kanbanOne, {
                group: 'shared',
                animation: 150,
            });
        }

        if (kanbanTwo) {
            new Sortable(kanbanTwo, {
                group: 'shared',
                animation: 150,
            });
        }

        if (kanbanThree) {
            new Sortable(kanbanThree, {
                group: 'shared',
                animation: 150,
            });
        }

        if (kanbanFour) {
            new Sortable(kanbanFour, {
                group: 'shared',
                animation: 150,
            });
        }

        if (kanbanFive) {
            new Sortable(kanbanFive, {
                group: 'shared',
                animation: 150,
            });
        }

        if (kanbanSix) {
            new Sortable(kanbanSix, {
                group: 'shared',
                animation: 150,
            });
        }
    }
});
