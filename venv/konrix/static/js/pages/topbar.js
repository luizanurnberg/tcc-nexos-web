$(document).ready(function () {
    const logoutLink = $('#logoutLink');

    logoutLink.on('click', function (event) {
        $.ajax({
            url: `${window.config.api}/logoff`,
            method: 'POST',
            success: function () {
                alert('Logged out successfully!');
                window.location.href = '/login';
            },
            error: function (error) {
                console.error('Logout failed:', error);
                alert('Logout failed. Please try again.');
            }
        });
    });
});
