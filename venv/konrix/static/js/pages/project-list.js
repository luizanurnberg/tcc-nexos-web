$(document).ready(function () {
    listProject();

    setInterval(listProject, 60000);

    function listProject() {
        const authToken = localStorage.getItem('authToken');
        const uid = localStorage.getItem('uid');
        if (!authToken) {
            alert('Token de autenticação não encontrado. Faça login novamente.');
            window.location.href = '/custom/login';
            return;
        }

        $.ajax({
            url: `${window.config.api}/release/list?uid=${uid}`,
            method: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                Authorization: `Bearer ${authToken}`
            },
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
            let isClickable = true;

            if (project.STATUS.ID === 1) {
                statusClass = 'bg-yellow-500'; // Amarelo
                isClickable = false; // Desabilitar clique
            } else if (project.STATUS.ID === 2) {
                statusClass = 'bg-green-500'; // Verde
                extraClass = 'px-3 py-1.5'; // Aumentar tamanho
            } else if (project.STATUS.ID === 3) {
                statusClass = 'bg-red-500'; // Vermelho
                isClickable = false;
            }

            const projectHtml = `
                <div class="card ${isClickable ? 'clickable' : 'non-clickable'}" data-id="${project.ID}">
                    <div class="card-header">
                        <div class="flex justify-between items-center">
                            ${isClickable ? `
                                <a href="/apps/kanban/${project.ID}">
                                    <h5 class="card-title">${project.TITLE}</h5>
                                </a>` : `
                                <h5 class="card-title text-gray-500">${project.TITLE}</h5>
                            `}
                            <i class="mgc_delete_2_fill cursor-pointer text-red-500 delete-icon"></i>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <div class="py-3 px-6">
                            <h5 class="my-2">
                                ${isClickable ? `
                                    <a href="/apps/kanban/${project.ID}" class="text-slate-900 dark:text-slate-200">${project.DESCRIPTION || 'Sem descrição'}</a>` : `
                                    <span class="text-gray-500">${project.DESCRIPTION || 'Sem descrição'}</span>
                                `}
                            </h5>
                        </div>
                    </div>
                    <div class="border-t p-5 border-gray-300 dark:border-gray-700">
                        <div class="grid lg:grid-cols-2 gap-4">
                            <div class="flex items-center justify-between gap-2">
                                <a class="text-sm">
                                    <i class="mgc_calendar_line text-lg me-2"></i>
                                    <span class="align-text-bottom">${formatDate(project.CREATED_AT.$date)}</span>
                                </a>
                                <a class="text-sm">
                                    <i class="mgc_align_justify_line text-lg me-2"></i>
                                    <span class="align-text-bottom">${project.REQUIREMENT.length} cards ao total</span>
                                </a>
                            </div>
                            <div class="flex justify-between items-center" style="margin-left: 10%">
                                <a class="text-sm">
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
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert('Token de autenticação não encontrado. Faça login novamente.');
            window.location.href = '/custom/login';
            return;
        }

        $.ajax({
            url: `${window.config.api}/release/delete/${id}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authToken}`
            },
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
