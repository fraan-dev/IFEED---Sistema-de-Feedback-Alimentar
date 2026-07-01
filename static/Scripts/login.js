

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.login-box form');
    if (!form) return;

    const messageBox = document.querySelector('.login-box .form-message');
    const loginInput = document.getElementById('loginInput');
    const senhaInput = document.getElementById('senhaLogin');
    const submitBtn = form.querySelector('.login-button');

    function showMessage(text, type) {
        if (!messageBox) return;
        messageBox.textContent = text;
        messageBox.className = 'form-message ' + (type || '');
        messageBox.style.display = text ? 'block' : 'none';
    }

    function markField(input, valid) {
        input.classList.toggle('invalid', !valid);
        input.classList.toggle('valid', valid);
    }

    form.addEventListener('submit', function (e) {
        
        const loginValid = loginInput.value.trim().length > 0;
        const senhaValid = senhaInput.value.trim().length > 0;

        markField(loginInput, loginValid);
        markField(senhaInput, senhaValid);

        if (!loginValid || !senhaValid) {
            e.preventDefault();
            showMessage('Informe sua matrícula/e-mail e senha para continuar.', 'error');
            (loginValid ? senhaInput : loginInput).focus();
            return;
        }

        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        submitBtn.disabled = true;

        
    });

    
    [loginInput, senhaInput].forEach(function (input) {
        input.addEventListener('input', function () {
            if (input.classList.contains('invalid') && input.value.trim().length > 0) {
                input.classList.remove('invalid');
                showMessage('', '');
            }
        });
    });

    
    const errorMessage = document.querySelector('.form-message.error');
    if (errorMessage && errorMessage.textContent.trim()) {
        showMessage(errorMessage.textContent.trim(), 'error');
    }
});