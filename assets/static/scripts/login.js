const loginForm = document.querySelector('.login-box form');

if (loginForm) {
    const messageBox = loginForm.parentElement.querySelector('.form-message');

    const showMessage = (text, type = 'error') => {
        if (!messageBox) return;
        messageBox.textContent = text;
        messageBox.className = `form-message ${type}`;
    };

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const usuario = loginForm.elements.login.value.trim();
        const senha = loginForm.elements.senha.value.trim();

        if (usuario === '' || senha === '') {
            showMessage('Preencha todos os campos!');
            return;
        }

        if (senha.length < 6) {
            showMessage('A senha deve possuir pelo menos 6 caracteres.');
            return;
        }

        showMessage('Login realizado com sucesso!', 'success');

        // guarda o tipo de usuário antes de limpar o formulário
        const tipoUsuario = loginForm.elements.tipo.value;

        // mock de autenticação: salva no localStorage
        const userObj = {
            login: loginForm.elements.login.value.trim(),
            tipo: tipoUsuario,
            name: loginForm.elements.login.value.split('@')[0]
        };
        localStorage.setItem('ifeed_user', JSON.stringify(userObj));

        loginForm.reset();

        // redireciona brevemente para o painel apropriado
        setTimeout(() => {
            if (tipoUsuario === 'aluno') {
                window.location.href = 'aluno.html';
            } else if (tipoUsuario === 'administrador') {
                window.location.href = 'relatorios.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 700);
    });

}