$(document).ready(function () {
    listProject();

    setInterval(listProject, 60000);

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
            let statusClass = '';
            let extraClass = '';
            if (project.STATUS.ID === 1) {
                statusClass = 'bg-yellow-500'; // Amarelo
            } else if (project.STATUS.ID === 2) {
                statusClass = 'bg-green-500'; // Verde
                extraClass = 'px-3 py-1.5'; // Aumentar tamanho
            } else if (project.STATUS.ID === 3) {
                statusClass = 'bg-red-500'; // Vermelho
            }

            const projectHtml = `
        <div class="card" data-id="${project.ID}">
                <div class="card-header">
                    <div class="flex justify-between items-center">
                        <a href="/apps/kanban/${project.ID}">
                            <h5 class="card-title">${project.TITLE}</h5>
                        </a>
                        <i class="mgc_delete_2_fill cursor-pointer text-red-500 delete-icon">
                            <div id="MessageSweetAlert" class="hidden w-full overflow-hidden transition-[height] duration-300">
                                <pre class="language-html h-auto">
                                    <code>
                                        &lt;button type=&quot;button&quot; class=&quot;btn bg-success text-white&quot; id=&quot;sweetalert-success&quot;&gt;Success&lt;/button&gt;
                                    </code>
                                </pre>
                            </div>
                        </i>
                    </div>
                </div>
                <div class="flex flex-col">
                <div class="py-3 px-6">
                <a href="/apps/kanban/${project.ID}">
                        <h5 class="my-2"><a href="#" class="text-slate-900 dark:text-slate-200">${project.DESCRIPTION || 'Sem descrição'}</a></h5>
                        </a>
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
                        <div class="flex justify-between items-center" style="margin-left: 10%">
                        <a href="#" class="text-sm">
                                <i class="mgc_pig_money_line text-lg me-2"></i>
                                <span class="align-text-bottom">R$: ${project.TOTAL_BUDGET}</span>
                        </a>
                            <div class="${statusClass} text-xs text-white rounded-md py-1 px-4 font-medium" role="alert">
                                <span>${project.STATUS.NAME}</span>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    `;
            container.append(projectHtml);
        });

        $('.delete-icon').on('click', function () {
            const projectId = $(this).closest('.card').data('id');
            showDeleteAlert(projectId);
        });
    }

    function showDeleteAlert(projectId) {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Você realmente deseja excluir esta release?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProject(projectId);
            }
        });
    }

    function deleteProject(id) {
        $.ajax({
            url: `${window.config.api}/release/delete/${id}`,
            method: 'DELETE',
            success: function (response) {
                Swal.fire('Excluído!', 'A release foi excluída com sucesso.', 'success');
                setTimeout(() => {
                    location.reload();
                }, 3000);
                listProject();
            },
            error: function (error) {
                console.error('Erro ao excluir release:', error);
                Swal.fire('Erro!', 'Não foi possível excluir a release.', 'error');
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
