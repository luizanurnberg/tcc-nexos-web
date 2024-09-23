$(document).ready(function () {
    const requirementsArray = [];
    let clientsCounter = 0;
    let reqCounter = 0;

    const elements = {
        cancelBtn: $('#btn-cancel'),
        saveBtn: $('#btn-save'),
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

    function clearRequirementFields() {
        elements.requirementName.val('');
        elements.requirementDescription.val('');
        elements.requirementBudget.val('');
        elements.requirementClient.val('');
        elements.clientSelectMatter.val('Selecione uma opção');
        elements.requirementSelectMatter.val('Selecione uma opção');
    }

    function generateRandomId() {
        return 'req-' + Math.random().toString(36).substr(2, 9);
    }

    function addRequirement() {
        const requirement = {
            id: generateRandomId(),
            name: elements.requirementName.val(),
            description: elements.requirementDescription.val(),
            budget: elements.requirementBudget.val(),
            client: elements.requirementClient.val(),
            clientImportance: elements.clientSelectMatter.val(),
            requirementImportance: elements.requirementSelectMatter.val()
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
            tbody.html('<tr><td colspan="100%" class="py-3 text-center text-gray-500">Nenhum requisito adicionado. Adicione requisitos para ver a matriz de dependências.</td></tr>');
        }
    }
    

    function generateDependencyMatrix() {
        const dependencyMatrix = [];

        requirementsArray.forEach((req, rowIndex) => {
            const row = [];
            requirementsArray.forEach((_, colIndex) => {
                const checkbox = $(`#checkbox-${rowIndex}-${colIndex}`);
                row.push(checkbox.is(':checked') ? 1 : 0);
            });
            dependencyMatrix.push(row);
        });

        return dependencyMatrix;
    }

    function saveProject() {
        const data = {
            projectName: elements.projectName.val(),
            projectDescription: elements.projectDescription.val(),
            projectBudget: elements.projectBudget.val(),
            projectSelectTime: elements.projectSelectTime.val(),
            requirements: requirementsArray,
            dependencyMatrix: generateDependencyMatrix(),
            numberOfReq: reqCounter,
            numberOfClients: clientsCounter,
        };

        $.ajax({
            url: `${window.config.api}/release/insert`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                console.log('Sucesso:', response);
            },
            error: function (error) {
                console.error('Erro:', error);
            }
        });
    }    
});
