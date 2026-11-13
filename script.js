const formulario = document.getElementById('formulario');
const divMensagem = document.getElementById('mensagem');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();

    divMensagem.style.display = 'none';
    divMensagem.className = '';
    divMensagem.innerText = '';

    if (!nome || !email) {
        exibirMensagem('Por favor, preencha todos os campos obrigatórios.', 'erro');
        return;
    }

    try {
        const resposta = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            exibirMensagem(dados.message, 'sucesso');
            formulario.reset();
        } else {
            exibirMensagem(dados.error, 'erro');
        }
    } catch (erro) {
        exibirMensagem('Erro de conexão. Verifique se o servidor está rodando.', 'erro');
    }
});

function exibirMensagem(texto, tipo) {
    divMensagem.innerText = texto;
    divMensagem.classList.add(tipo);
    divMensagem.style.display = 'block';
}