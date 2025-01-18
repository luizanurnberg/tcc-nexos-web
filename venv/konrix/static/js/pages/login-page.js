$(document).ready(function () {
    const elements = {
        emailInput: $('#LoggingEmailAddress'),
        passwordInput: $('#loggingPassword'),
        loginButton: $('.btn'),
    };

    elements.loginButton.on('click', handleLogin);

    function handleLogin() {
        const email = elements.emailInput.val();
        const password = elements.passwordInput.val();

        if (!email || !password) {
            Swal.fire({
                title: 'Erro de Validação',
                text: 'Todos os campos são obrigatórios.',
                icon: 'error',
                confirmButtonClass: 'btn bg-primary text-white w-xs mt-2',
                buttonsStyling: false
            });
            return;
        }

        const data = {
            email: email,
            password: password,
        };

        $.ajax({
            url: `${window.config.api}/login`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                const token = response.user.idToken;
                const uid = response.user.uid;
                localStorage.setItem('authToken', token);
                localStorage.setItem('uid', uid);
                window.location.href = '/dashboard';
            },
            error: function (error) {
                console.error('Login failed:', error);
                Swal.fire({
                    title: 'Login falhou',
                    text: 'Verifique as informações e tente novamente.',
                    icon: 'error',
                    confirmButtonClass: 'btn bg-primary text-white w-xs mt-2',
                    buttonsStyling: false
                });
            }
        });
    }
});
