$(document).ready(function () {
    let requirementsArray = [];
    let clientsCounter = 0;
    let reqCounter = 0;

    const elements = {
        cancelBtn: $('#btn-cancel'),
        saveBtn: $('#sweetalert-success'),
        saveRequirementBtn: $('#btn-save-requirement'),
        cancelRequirementBtn: $('#btn-cancel-requirement'),
        requirementDiv: $('#requirement-div'),
        requirementName: $('#requirement-name'),
        requirementDescription: $('#requirement-description'),
        requirementBudget: $('#requirement-budget'),
        requirementClient: $('#requirement-client'),
        clientSelectMatter: $('#client-select-matter'),
        requirementSelectMatter: $('#requirement-select-matter'),
        projectName: $('#project-name'),
        projectDescription: $('#project-description'),
        projectBudget: $('#project-budget'),
        projectSelectTime: $('#project-select-time'),
        modalBody: $('#modal-table'),
        addRequirementsDependenciesBtn: $('#btn-add-requirements-dep'),
    };

    elements.saveRequirementBtn.on('click', addRequirement);
    elements.cancelRequirementBtn.on('click', clearRequirementFields);
    elements.saveBtn.on('click', saveProject);

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
        console.log(clients)
    }

    function cleanAllFields() {
        elements.projectName.val('');
        elements.projectBudget.val('');
        elements.projectDescription.val('');
        elements.projectSelectTime.val('Selecione uma opção');
        elements.requirementName.val('');
        elements.requirementDescription.val('');
        elements.requirementBudget.val('');
        elements.requirementClient.val('');
        elements.clientSelectMatter.val('Selecione uma opção');
        elements.requirementSelectMatter.val('Selecione uma opção');

        elements.modalBody.find('#modal-thead').find('tr').html('<th scope="col" class="py-3 ps-4"></th>');
        elements.modalBody.find('#modal-tbody').empty();

        requirementsArray = [];
        clientsCounter = 0;
        reqCounter = 0;
    }

    function clearRequirementFields() {
        elements.requirementName.val('');
        elements.requirementDescription.val('');
        elements.requirementBudget.val('');
        elements.requirementClient.val('');
        elements.clientSelectMatter.val('Selecione uma opção');
        elements.requirementSelectMatter.val('Selecione uma opção');
    }

    function addRequirement() {
        const requirement = {
            id: reqCounter,
            name: elements.requirementName.val(),
            description: elements.requirementDescription.val(),
            budget: parseFloat(elements.requirementBudget.val()),
            clientId: clientsCounter,
            client: elements.requirementClient.val(),
            clientImportance: parseInt(elements.clientSelectMatter.val()),
            requirementImportance: parseInt(elements.requirementSelectMatter.val())
        };

        requirementsArray.push(requirement);
        clientsCounter++;
        reqCounter++;
        clearRequirementFields();
        updateModalContent();
    }

    function updateModalContent() {
        const thead = $('#modal-thead');
        const tbody = $('#modal-tbody');

        thead.find('tr').html('<th scope="col" class="py-3 ps-4"></th>');
        tbody.empty();

        if (requirementsArray.length > 0) {
            requirementsArray.forEach(req => {
                thead.find('tr').append(`<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">${req.name}</th>`);
            });

            requirementsArray.forEach((req, rowIndex) => {
                let row = `<tr><td class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">${req.name}</td>`;
                requirementsArray.forEach((_, colIndex) => {
                    if (rowIndex === colIndex) {
                        row += `<td class="py-3 ps-4"><span class="material-symbols-rounded">block</span></td>`;
                    } else {
                        row += `<td class="py-3 ps-4"><input class="form-checkbox rounded-full text-primary" type="checkbox" id="checkbox-${rowIndex}-${colIndex}"></td>`;
                    }
                });
                row += '</tr>';
                tbody.append(row);
            });
        } else {
            tbody.empty();
        }
    }


    function generateDependencyMatrix() {
        const dependencyList = [];

        requirementsArray.forEach((req, rowIndex) => {
            requirementsArray.forEach((dependentReq, colIndex) => {
                const checkbox = $(`#checkbox-${rowIndex}-${colIndex}`);
                if (checkbox.is(':checked')) {
                    dependencyList.push(` ${dependentReq.id} ${req.id}`);
                }
            });
        });

        return dependencyList;
    }

    function generateNumericId() {
        const timestamp = Date.now().toString();
        const randomNumbers = Math.floor(Math.random() * 1000000).toString().padStart(4, '0');
        return timestamp + randomNumbers;
    }

    function saveProject() {
        const data = {
            projectId: generateNumericId(),
            projectName: elements.projectName.val(),
            projectDescription: elements.projectDescription.val(),
            projectBudget: parseFloat(elements.projectBudget.val()),
            projectSelectTime: parseInt(elements.projectSelectTime.val()),
            requirements: requirementsArray,
            dependencyMatrix: generateDependencyMatrix(),
            numberOfReq: parseInt(reqCounter),
            numberOfClients: parseInt(clientsCounter),
            user: localStorage.getItem('uid'),
            status: {
                ID: 1,
                NAME: "Em geração"
            }
        };

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert('Token de autenticação não encontrado. Faça login novamente.');
            window.location.href = '/custom/login';
            return;
        }

        $.ajax({
            url: `${window.config.api}/release/insert`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            success: function () {
                localStorage.removeItem('authToken');
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'A release foi criada com sucesso com sucesso.',
                    icon: 'success',
                    confirmButtonClass: 'btn bg-primary text-white w-xs mt-2',
                    buttonsStyling: false,
                }).then(() => {
                    window.location.href = '/dashboard';
                });
            },
            error: function (error) {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Não foi possível criar a release. Tente novamente.',
                    icon: 'error',
                    confirmButtonClass: 'btn bg-primary text-white w-xs mt-2',
                    buttonsStyling: false,
                });
            }
        });

        cleanAllFields();
    }
});
