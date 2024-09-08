document.addEventListener('DOMContentLoaded', function() {
    const requirementsArray = [];
    const elements = {
        addRequirementsBtn: document.getElementById('btn-add-requirements'),
        cancelBtn: document.getElementById('btn-cancel'),
        saveBtn: document.getElementById('btn-save'),
        saveRequirementBtn: document.getElementById('btn-save-requirement'),
        cancelRequirementBtn: document.getElementById('btn-cancel-requirement'),
        requirementDiv: document.getElementById('requirement-div'),
        requirementName: document.getElementById('requirement-name'),
        requirementDescription: document.getElementById('requirement-description'),
        requirementBudget: document.getElementById('requirement-budget'),
        requirementClient: document.getElementById('requirement-client'),
        clientSelectMatter: document.getElementById('client-select-matter'),
        requirementSelectMatter: document.getElementById('requirement-select-matter'),
        projectName: document.getElementById('project-name'),
        projectDescription: document.getElementById('project-description'),
        projectBudget: document.getElementById('project-budget'),
        projectSelectTime: document.getElementById('project-select-time')
    };

    elements.addRequirementsBtn.addEventListener('click', toggleRequirementDiv);
    elements.saveRequirementBtn.addEventListener('click', addRequirement);
    elements.cancelRequirementBtn.addEventListener('click', clearRequirementFields);
    elements.cancelBtn.addEventListener('click', () => console.log("Botão 'Cancelar' clicado"));
    elements.saveBtn.addEventListener('click', saveProject);

    // Função para mostrar/ocultar a div de requisitos
    function toggleRequirementDiv() {
        elements.requirementDiv.style.display = 
            elements.requirementDiv.style.display === 'none' || elements.requirementDiv.style.display === '' 
            ? 'block' 
            : 'none';
    }

    // Função para limpar os campos de requisitos
    function clearRequirementFields() {
        elements.requirementName.value = '';
        elements.requirementDescription.value = '';
        elements.requirementBudget.value = '';
        elements.requirementClient.value = '';
        elements.clientSelectMatter.value = 'Selecione uma opção';
        elements.requirementSelectMatter.value = 'Selecione uma opção';
    }

    // Função para adicionar um requisito ao array
    function addRequirement() {
        const requirement = {
            name: elements.requirementName.value,
            description: elements.requirementDescription.value,
            budget: elements.requirementBudget.value,
            client: elements.requirementClient.value,
            clientImportance: elements.clientSelectMatter.value,
            requirementImportance: elements.requirementSelectMatter.value
        };

        requirementsArray.push(requirement);
        clearRequirementFields();
    }

    // Função para salvar os dados do projeto
    function saveProject() {
        const data = {
            projectName: elements.projectName.value,
            projectDescription: elements.projectDescription.value,
            projectBudget: elements.projectBudget.value,
            projectSelectTime: elements.projectSelectTime.value,
            requirements: requirementsArray
        };

        fetch('/seu-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Sucesso:', data);
            // Lógica adicional após o envio bem-sucedido
        })
        .catch(error => {
            console.error('Erro:', error);
            // Lógica adicional para tratamento de erro
        });
    }
});
