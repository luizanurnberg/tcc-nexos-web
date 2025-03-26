$(document).ready(function () {
    init();
});

function init() {
    listClients();
    setupEventHandlers();
    setupSearchHandler();
}

function listClients() {
    const authToken = getAuthToken();
    const uid = localStorage.getItem('uid');
    if (!authToken) return redirectToLogin();

    $.ajax({
        url: `${window.config.api}/client/list/${uid}`,
        method: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        headers: { Authorization: `Bearer ${authToken}` },
        success: (response) => response.data?.length && renderClients(response.data),
        error: (error) => console.error('Erro:', error)
    });
}

function renderClients(clients) {
    const container = $('#client-grid');
    container.empty();
    clients.forEach(client => container.append(createClientCard(client)));
    setupDeleteHandlers();
}

function createClientCard(client) {
    return `
        <div class="card" data-id="${client.ID}">
            <div class="card-header flex justify-between items-center">
                <h5 class="card-title">${client.NAME}</h5>
                <i class="mgc_delete_2_fill cursor-pointer text-red-500 delete-icon"></i>
            </div>
            <div class="py-3 px-6">
                <h5 class="my-2 text-slate-900 dark:text-slate-200">${client.EMAIL}</h5>
            </div>
            <div class="border-t p-5 border-gray-300 dark:border-gray-700">
                <div class="grid lg:grid-cols-2 gap-4">
                    <div class="flex items-center justify-between gap-2">
                        <a class="text-sm">
                            <i class="mgc_user_line text-lg me-2"></i>
                            <span class="align-text-bottom">${getPriorityHtml(client.WEIGHT)}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
}

function setupDeleteHandlers() {
    $('.delete-icon').on('click', function () {
        showDeleteAlert($(this).closest('.card').data('id'));
    });
}

function showDeleteAlert(clientId) {
    Swal.fire({
        title: 'Tem certeza?',
        text: 'Você realmente deseja excluir este cliente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => result.isConfirmed && deleteClient(clientId));
}

function deleteClient(clientId) {
    const authToken = getAuthToken();
    if (!authToken) return redirectToLogin();

    $.ajax({
        url: `${window.config.api}/client/delete/${clientId}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
        success: () => {
            Swal.fire('Excluído!', 'O cliente foi excluído com sucesso.', 'success');
            setTimeout(() => location.reload(), 1000);
        },
        error: (error) => Swal.fire('Erro!', 'Não foi possível excluir o cliente.', 'error')
    });
}

function setupEventHandlers() {
    $('#btn-save').on('click', saveClient);
    $('[data-fc-dismiss]').on('click', clearFormFields);
}

function saveClient() {
    const authToken = getAuthToken();
    if (!authToken) return redirectToLogin();

    const clientEmail = $('#inputEmail3').val();
    const clientName = $('#inputName3').val();
    const clientWeight = $('#client-select-matter').val();

    const data = {
        clientEmail: clientEmail,
        clientName: clientName,
        clientWeight: clientWeight,
        user: localStorage.getItem('uid'),
        clientId: generateNumericId()
    };

    $.ajax({
        url: `${window.config.api}/client/insert`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: { Authorization: `Bearer ${authToken}` },
        success: () => {
            Swal.fire({
                title: 'Sucesso!',
                text: 'O cliente foi cadastrado com sucesso.',
                icon: 'success',
                confirmButtonClass: 'btn bg-primary text-white w-xs mt-2',
                buttonsStyling: false,
            }).then(() => {
                clearFormFields();
                window.location.href = '/apps/client';
            });
        },
        error: () => Swal.fire('Erro!', 'Não foi possível cadastrar cliente.', 'error')
    });
}

function clearFormFields() {
    $('#inputEmail3, #inputName3').val('');
    $('#client-select-matter').val('Selecione uma opção');
}

function getPriorityHtml(weight) {
    const priorityMap = {
        25: '<i class="mgc_snow_line"></i> Prioridade Baixa',
        50: '<i class="mgc_pin_line"></i> Prioridade Média',
        100: '<i class="mgc_fire_line"></i> Prioridade Alta'
    };
    return `<span class="text-gray-500">${priorityMap[weight] || '<i class="icon-unknown-priority"></i> Sem Prioridade'}</span>`;
}

function generateNumericId() {
    const timestamp = Date.now().toString();
    const randomNumbers = Math.floor(Math.random() * 1000000).toString().padStart(4, '0');
    return timestamp + randomNumbers;
}

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function redirectToLogin() {
    alert('Token de autenticação não encontrado. Faça login novamente.');
    window.location.href = '/custom/login';
}

function setupSearchHandler() {
    let timer = null;
    const uid = localStorage.getItem('uid');
    $("input[type='search']").on("input", function () {
        let query = $(this).val().trim();

        if (query.length > 3) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                $.ajax({
                    url: `${window.config.api}/client/filter/${query}/${uid}`,
                    type: "GET",
                    headers: { Authorization: `Bearer ${getAuthToken()}` },
                    success: function (response) {
                        if (response && response.data && response.data.length) {
                            renderClients(response.data);
                        }
                    },
                    error: function () {
                        console.error("Erro ao buscar clientes"); 
                    }
                });
            }, 500);
        } else {
            listClients();
        }
    });
}

