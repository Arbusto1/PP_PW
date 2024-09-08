window.onload = function () {
    const formularioCadastro = document.getElementById('formularioCadastro');
    const formularioLogin = document.getElementById('formularioLogin');


    if (formularioCadastro) {
        document.getElementById('formularioCadastro').addEventListener('submit', function (event) {
            event.preventDefault();

            const nome = document.getElementById('nomec').value;
            const endereco = document.getElementById('enderecoc').value;
            const nomeBarbearia = document.getElementById('nomebarbeariac').value;
            const telefone = document.getElementById('numtelc').value;
            const email = document.getElementById('emailc').value;
            const senha = document.getElementById('senhac').value;

            const usuario = {
                nome: nome,
                endereco: endereco,
                nomeBarbearia: nomeBarbearia,
                telefone: telefone,
                email: email,
                senha: senha
            };

            localStorage.setItem('usuario', JSON.stringify(usuario));
            alert("Barbearia cadastrada com sucesso!");
        });
    }

    if (formularioLogin) {

        document.getElementById('formularioLogin').addEventListener('submit', function (event) {
            event.preventDefault();

            const emailLogin = document.getElementById('emailc').value;
            const senhaLogin = document.getElementById('senhac').value;

            const usuario = JSON.parse(localStorage.getItem('usuario'));

            if (usuario && emailLogin === usuario.email && senhaLogin === usuario.senha) {
                alert('Login bem-sucedido!');
                window.location.href = 'hclientes.html';
            } else {
                alert('E-mail e/ou senha inválidos.');
            }
        });
    }
}