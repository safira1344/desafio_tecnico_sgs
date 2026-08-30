document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias();
    carregarSolicitantes();
    carregarListagem();
    configurarFormularioCadastro();
    configurarAbas();

    document.getElementById("formulario-filtros").addEventListener("submit", (event) => {
        event.preventDefault();
        aplicarFiltros();
    });
    document.getElementById("botao-limpar-filtros").addEventListener("click", () => {
        document.getElementById("formulario-filtros").reset();
        carregarListagem();
    });
    document.querySelector(".modal-fechar").addEventListener("click", fecharModal);
    document.getElementById("modal-detalhe").addEventListener("click", (event) => {
        if (event.target.id === "modal-detalhe") {
            fecharModal();
        }
    });
});

const TRANSICOES_PERMITIDAS = {
    SOLICITADO: ["LIBERADO", "REJEITADO"],
    LIBERADO: ["APROVADO", "REJEITADO"],
    APROVADO: ["CANCELADO"],
    REJEITADO: [],
    CANCELADO: []
};

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
}); 

function formatarMoeda(valor) {
    return formatadorMoeda.format(valor);
}

function formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

async function carregarCategorias() {
    const categorias = await buscarCategorias();

    const selectFiltro = document.getElementById("filtro-categoria");
    const selectFormulario = document.getElementById("campo-categoria");

    categorias.forEach((categoria) => {
        const opcaoFiltro = document.createElement("option");
        opcaoFiltro.value = categoria.id;
        opcaoFiltro.textContent = categoria.nome;
        selectFiltro.appendChild(opcaoFiltro);

        const opcaoFormulario = document.createElement("option");
        opcaoFormulario.value = categoria.id;
        opcaoFormulario.textContent = categoria.nome;
        selectFormulario.appendChild(opcaoFormulario);
    });
}

async function carregarSolicitantes(){
    const solicitantes = await buscarSolicitantes();
    const selectFormulario = document.getElementById('campo-solicitante');

    solicitantes.forEach((solicitante) => {
        const opcaoFormulario = document.createElement("option");
        opcaoFormulario.value = solicitante.id;
        opcaoFormulario.textContent = `${solicitante.nome} (${solicitante.cpfCnpj})`;
        selectFormulario.appendChild(opcaoFormulario);
    });
}

async function carregarListagem(filtros = {}){
    const solicitacoes = await buscarSolicitacoes(filtros);
    const corpoTabela = document.getElementById("corpo-tabela-solicitacoes");

    corpoTabela.innerHTML = "";

    solicitacoes.forEach((solicitacao) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
        <td>${solicitacao.nomeSolicitante}</td>
        <td>${solicitacao.cpfCnpj}</td>
        <td>${solicitacao.nomeCategoria}</td>
        <td>${solicitacao.status}</td>
        <td>${formatarMoeda(solicitacao.valor)}</td>
        <td>${formatarData(solicitacao.dataSolicitacao)}</td>
        <td><button class="btn-detalhes botao botao-secundario" data-id="${solicitacao.id}">Ver detalhes</button></td>
        `;

        const botaoDetalhes = linha.querySelector(".btn-detalhes");

        botaoDetalhes.addEventListener("click", () => {
            abrirModalDetalhes(solicitacao.id);
        });

        corpoTabela.appendChild(linha);
    });
}

async function aplicarFiltros() {
    const filtrosStatus = document.getElementById('filtro-status');
    const filtrosCategoria = document.getElementById('filtro-categoria');
    const filtrosDataInicio = document.getElementById('filtro-data-inicio');
    const filtrosDataFim = document.getElementById('filtro-data-fim');

    const filtros = {
        status: filtrosStatus.value === "" ? null : filtrosStatus.value,
        categoriaId: filtrosCategoria.value === "" ? null : filtrosCategoria.value,
        dataInicio: filtrosDataInicio.value === "" ? null : filtrosDataInicio.value,
        dataFim: filtrosDataFim.value === "" ? null : filtrosDataFim.value
    };

    await carregarListagem(filtros);
}

async function abrirModalDetalhes(id) {
    const solicitacao = await buscarSolicitacaoPorId(id);
    const proximosStatus = TRANSICOES_PERMITIDAS[solicitacao.status];

    let areaStatusHtml;

    if (proximosStatus.length > 0) {
        const opcoesHtml = proximosStatus.map((status) => `<option value="${status}">${status}</option>`).join("");

        areaStatusHtml = `
            <div class="campo">
                <label for="select-novo-status">Alterar status para:</label>
                <select id="select-novo-status">${opcoesHtml}</select>
            </div>
            <button id="btn-confirmar-status" class="botao botao-primario">Confirmar alteração</button>
        `;
    } else {
        areaStatusHtml = `<p class="aviso-status-final">Este é um status final e não pode ser alterado.</p>`;
    }

    const modalConteudo = document.getElementById("modal-conteudo");

    modalConteudo.innerHTML = `
        <p><strong>ID:</strong> ${solicitacao.id}</p>
        <p><strong>Solicitante:</strong> ${solicitacao.solicitante.nome}</p>
        <p><strong>Documento:</strong> ${solicitacao.solicitante.cpfCnpj}</p>
        <p><strong>Categoria:</strong> ${solicitacao.categoria.nome}</p>
        <p><strong>Descrição:</strong> ${solicitacao.descricao}</p>
        <p><strong>Valor:</strong> ${formatarMoeda(solicitacao.valor)}</p>
        <p><strong>Data da Solicitação:</strong> ${formatarData(solicitacao.dataSolicitacao)}</p>
        <p><strong>Status atual:</strong> ${solicitacao.status}</p>
        ${areaStatusHtml}
    `;

    if (proximosStatus.length > 0) {
        document.getElementById("btn-confirmar-status").addEventListener("click", async () => {
            const novoStatus = document.getElementById("select-novo-status").value;

            try {
                await atualizarStatusSolicitacao(solicitacao.id, novoStatus);
                fecharModal();
                await carregarListagem();
            } catch (erro) {
                alert("Erro ao atualizar status: " + erro.message);
            }
        });
    }

    document.getElementById("modal-detalhe").classList.add("ativo");
}

function fecharModal() {
    document.getElementById("modal-detalhe").classList.remove("ativo");
}

function configurarAbas() {
    const botoesAba = document.querySelectorAll(".aba-botao");
    const paineis = document.querySelectorAll(".aba-painel");

    botoesAba.forEach((botao) => {
        botao.addEventListener("click", () => {
            botoesAba.forEach((b) => b.classList.remove("ativo"));
            paineis.forEach((p) => p.classList.remove("ativo"));

            botao.classList.add("ativo");
            document.getElementById(botao.dataset.alvo).classList.add("ativo");
        });
    });
}

function configurarFormularioCadastro() {
    document.getElementById("formulario-cadastro").addEventListener("submit", async (event) => {
        event.preventDefault();

        const dados = {
            solicitanteId: Number(document.getElementById("campo-solicitante").value),
            categoriaId: Number(document.getElementById("campo-categoria").value),
            descricao: document.getElementById("campo-descricao").value,
            valor: Number(document.getElementById("campo-valor").value)
        };

        try {
            await criarSolicitacao(dados);
            document.getElementById("formulario-cadastro").reset();
            await carregarListagem();
        } catch (erro) {
            alert("Erro ao cadastrar solicitação: " + erro.message);
        }
    });
}
