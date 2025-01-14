$(document).ready(function () {
    const elements = {
        nameInput: $('#LoggingName'),
        emailInput: $('#LoggingEmailAddress'),
        passwordInput: $('#loggingPassword'),
        registerButton: $('.btn'),
    };

    elements.registerButton.on('click', handleRegister);

    function handleRegister(event) {
        event.preventDefault();

        const name = elements.nameInput.val();
        const email = elements.emailInput.val();
        const password = elements.passwordInput.val();
        console.log(name, email, password)
        if (!name || !email || !password) {
            Swal.fire({
                title: 'Erro de Validação',
                text: 'Todos os campos são obrigatórios.',
                icon: 'warning',
                confirmButtonClass: 'btn bg-primary text-white w-xs mt-2',
                buttonsStyling: false,
            });
            return;
        }

        const data = {
            name: name,
            email: email,
            password: password,
        };

        $.ajax({
            url: `${window.config.api}/register`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                Swal.fire({
                    title: 'Registro bem-sucedido!',
                    text: 'Sua conta foi criada com sucesso.',
                    icon: 'success',
                    confirmButtonClass: 'btn bg-primary text-white w-xs mt-2',
                    buttonsStyling: false,
                }).then(() => {
                    window.location.href = '/dashboard';
                });
            },
            error: function (error) {
                Swal.fire({
                    title: 'Falha no Registro',
                    text: error.responseJSON?.message || 'Ocorreu um erro ao registrar. Tente novamente.',
                    icon: 'error',
                    confirmButtonClass: 'btn bg-primary text-white w-xs mt-2',
                    buttonsStyling: false,
                });
            }
        });
    }
});
