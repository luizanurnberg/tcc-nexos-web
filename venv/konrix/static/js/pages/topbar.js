$(document).ready(function () {
    const logoutLink = $('#logoutLink');

    logoutLink.on('click', function (event) {
        event.preventDefault(); 

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert('Token de autenticação não encontrado. Faça login novamente.');
            window.location.href = '/custom/login';
            return;
        }

        $.ajax({
            url: `${window.config.api}/logoff`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            success: function () {
                localStorage.removeItem('authToken');
                Swal.fire({
                    title: 'Logout realizado!',
                    text: 'Você foi desconectado com sucesso.',
                    icon: 'success',
                    confirmButtonClass: 'btn bg-primary text-white w-xs mt-2',
                    buttonsStyling: false,
                }).then(() => {
                    window.location.href = '/custom/login';
                });
            },
            error: function (error) {
                Swal.fire({
                    title: 'Erro no Logout',
                    text: 'Não foi possível realizar o logout. Tente novamente.',
                    icon: 'error',
                    confirmButtonClass: 'btn bg-primary text-white w-xs mt-2',
                    buttonsStyling: false,
                });
            }
        });
    });
});
