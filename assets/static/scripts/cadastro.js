const cadastroForm = document.getElementById('cadastroForm');

if (cadastroForm) {
    const messageBox = cadastroForm.querySelector('.form-message');
    const matricula = document.getElementById('matricula');

    const showMessage = (text, type = 'error') => {
        if (!messageBox) return;
        messageBox.textContent = text;
        messageBox.className = `form-message ${type}`;
        messageBox.setAttribute('role', type === 'success' ? 'status' : 'alert');
    };

    /* MÁSCARA DA MATRÍCULA */
    matricula.addEventListener('input', () => {
        matricula.value = matricula.value
            .replace(/\D/g, '') 
            .slice(0, 14); 
    });

    cadastroForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = cadastroForm.elements.nome.value.trim();
        const matriculaValor = cadastroForm.elements.matricula.value.trim();
        const curso = cadastroForm.elements.curso.value.trim();
        const turma = cadastroForm.elements.turma.value.trim();
        const email = cadastroForm.elements.email.value.trim();
        const senha = cadastroForm.elements.senha.value.trim();
        const confirmarSenha = cadastroForm.elements.confirmarSenha.value.trim();
        const tipoUsuario = cadastroForm.elements.tipoUsuario.value;

        /* CAMPOS VAZIOS */
        if (
            nome === '' ||
            matriculaValor === '' ||
            curso === '' ||
            turma === '' ||
            email === '' ||
            senha === '' ||
            confirmarSenha === '' ||
            !tipoUsuario
        ) {
            showMessage('Preencha todos os campos!');
            return;
        }

        /* VALIDAÇÃO DO NOME */
        if (nome.length < 5) {
            showMessage('Digite um nome válido.');
            return;
        }

        /* MATRÍCULA */
        if (tipoUsuario === 'aluno') {
            if (matriculaValor.length < 14) {
                showMessage('A matrícula do aluno deve possuir pelo menos 14 números.');
                return;
            }
        }

        if (tipoUsuario === 'administrador') {
            if (matriculaValor.length < 7) {
                showMessage('A matrícula do administrador deve possuir pelo menos 7 números.');
                return;
            }
        }

        /* VALIDAÇÃO EMAIL */

        if (!email.includes('@') || !email.includes('.')) {
            showMessage('Digite um e-mail válido.');
            return;
        }

        if (!email.endsWith('@ifrn.edu.br')) {
            showMessage('Utilize um e-mail institucional do IFRN.');
            return;
        }

        /* VALIDAÇÃO SENHA */

        if (senha.length < 6) {
            showMessage('A senha deve possuir no mínimo 6 caracteres.');
            return;
        }

        /* CONFIRMAÇÃO DE SENHA */

        if (senha !== confirmarSenha) {
            showMessage('As senhas não coincidem.');
            return;
        }

        /* SUCESSO */

        showMessage('Cadastro realizado com sucesso!', 'success');

        cadastroForm.reset();

    });

}