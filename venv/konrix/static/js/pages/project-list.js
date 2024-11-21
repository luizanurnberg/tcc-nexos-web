$(document).ready(function () {
    listProject();

    function listProject() {
        $.ajax({
            url: `${window.config.api}/release/list`,
            method: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                if (response.data && response.data.length) {
                    renderProjects(response.data);
                }
            },
            error: function (error) {
                console.error('Erro:', error);
            }
        });
    }

    function renderProjects(projects) {
        const container = $('.grid');
        container.empty();

        projects.forEach(project => {
            const projectHtml = `
            <div class="card" data-id="${project.ID}">
                <a href="#">
                    <div class="card-header">
                        <div class="flex justify-between items-center">
                            <h5 class="card-title">${project.TITLE}</h5>
                            <i class="mgc_delete_2_fill cursor-pointer text-red-500 delete-icon"></i>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <div class="py-3 px-6">
                            <h5 class="my-2"><a href="#" class="text-slate-900 dark:text-slate-200">${project.DESCRIPTION || 'Sem descrição'}</a></h5>
                        </div>
                    </div>
                    <div class="border-t p-5 border-gray-300 dark:border-gray-700">
                        <div class="grid lg:grid-cols-2 gap-4">
                            <div class="flex items-center justify-between gap-2">
                                <a href="#" class="text-sm">
                                    <i class="mgc_calendar_line text-lg me-2"></i>
                                    <span class="align-text-bottom">${formatDate(project.CREATED_AT.$date)}</span>
                                </a>
                                <a href="#" class="text-sm">
                                    <i class="mgc_align_justify_line text-lg me-2"></i>
                                    <span class="align-text-bottom">${project.REQUIREMENT.length} cards ao total</span>
                                </a>
                            </div>
                            <div class="flex justify-between items-center" style="margin-left: 70%">
                                <div class="bg-success text-xs text-white rounded-md py-1 px-1.5 font-medium" role="alert">
                                    <span>${project.STATUS.NAME}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
            container.append(projectHtml);
        });

        // Adicionar evento click para exclusão
        $('.delete-icon').on('click', function () {
            const projectId = $(this).closest('.card').data('id');
            deleteProject(projectId);
        });
    }

    function deleteProject(id) {
        $.ajax({
            url: `${window.config.api}/release/delete/${id}`,
            method: 'DELETE',
            success: function (response) {
                alert('Release excluída com sucesso!');
                listProject();
            },
            error: function (error) {
                console.error('Erro ao excluir release:', error);
            }
        });
    }

    function formatDate(isoDate) {
        const date = new Date(isoDate);

        const day = date.getUTCDate();
        const month = date.toLocaleString('default', { month: 'short' });

        return `${day} ${month}`;
    }
});
