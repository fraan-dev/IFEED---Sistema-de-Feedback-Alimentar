

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cadastroForm');
    if (!form) return;

    const messageBox = form.parentElement.querySelector('.form-message');
    const submitBtn = form.querySelector('.cadastro-button');

    const fields = {
        nome: document.getElementById('nome'),
        matricula: document.getElementById('matricula'),
        curso: document.getElementById('curso'),
        turma: document.getElementById('turma'),
        email: document.getElementById('email'),
        senha: document.getElementById('senha'),
        confirmarSenha: document.getElementById('confirmarSenha'),
    };

    function showMessage(text, type) {
        if (!messageBox) return;
        messageBox.textContent = text;
        messageBox.className = 'form-message ' + (type || '');
        messageBox.style.display = text ? 'block' : 'none';
    }

    function markField(input, valid) {
        if (!input) return;
        input.classList.toggle('invalid', !valid);
        input.classList.toggle('valid', valid);
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validate() {
        let firstInvalid = null;
        let ok = true;

        function check(input, condition) {
            const valid = !!condition;
            markField(input, valid);
            if (!valid) {
                ok = false;
                if (!firstInvalid) firstInvalid = input;
            }
        }

        check(fields.nome, fields.nome.value.trim().length >= 3);
        check(fields.matricula, /^\d{5,14}$/.test(fields.matricula.value.trim()));
        check(fields.curso, fields.curso.value.trim().length >= 2);
        check(fields.turma, fields.turma.value.trim().length >= 1);
        check(fields.email, isValidEmail(fields.email.value.trim()));
        check(fields.senha, fields.senha.value.length >= 6);
        check(fields.confirmarSenha, fields.confirmarSenha.value === fields.senha.value && fields.senha.value.length >= 6);

        if (!ok) {
            if (fields.confirmarSenha.classList.contains('invalid') && fields.senha.value.length >= 6) {
                showMessage('As senhas não coincidem.', 'error');
            } else {
                showMessage('Por favor, preencha todos os campos corretamente.', 'error');
            }
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            showMessage('', '');
        }

        return ok;
    }

    
    Object.values(fields).forEach(function (input) {
        if (!input) return;
        input.addEventListener('blur', function () {
            validate();
        });
        input.addEventListener('input', function () {
            if (input.classList.contains('invalid') && input.value.trim().length > 0) {
                input.classList.remove('invalid');
                showMessage('', '');
            }
        });
    });

    
    if (fields.matricula) {
        fields.matricula.addEventListener('input', function () {
            fields.matricula.value = fields.matricula.value.replace(/\D/g, '');
        });
    }

    form.addEventListener('submit', function (e) {
        const valid = validate();

        if (!valid) {
            e.preventDefault();
            return;
        }

        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
        submitBtn.disabled = true;

        
    });

    
    const errorMessage = document.querySelector('.form-message.error');
    if (errorMessage && errorMessage.textContent.trim()) {
        showMessage(errorMessage.textContent.trim(), 'error');
    }
});