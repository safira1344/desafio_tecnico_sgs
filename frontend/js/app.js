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
    `;

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


// const TRANSICOES_PERMITIDAS = {
//     SOLICITADO: ['LIBERADO', 'REJEITADO'],
//     LIBERADO: ['APROVADO', 'REJEITADO'],
//     APROVADO: ['CANCELADO'],
//     REJEITADO: [],
//     CANCELADO: []
// };

// const ROTULOS_STATUS = {
//     SOLICITADO: 'Solicitado',
//     LIBERADO: 'Liberado',
//     APROVADO: 'Aprovado',
//     REJEITADO: 'Rejeitado',
//     CANCELADO: 'Cancelado'
// };

// const formatadorMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// let categoriasCache = [];
// let solicitantesCache = [];

// document.addEventListener('DOMContentLoaded', () => {
//     configurarAbas();
//     configurarFormularioCadastro();
//     configurarFiltros();
//     configurarModal();
//     carregarDadosIniciais();
// });

// function configurarAbas() {
//     const botoes = document.querySelectorAll('.aba-botao');
//     const paineis = document.querySelectorAll('.aba-painel');

//     botoes.forEach(botao => {
//         botao.addEventListener('click', () => {
//             botoes.forEach(b => b.classList.remove('ativo'));
//             paineis.forEach(p => p.classList.remove('ativo'));

//             botao.classList.add('ativo');
//             document.getElementById(botao.dataset.alvo).classList.add('ativo');
//         });
//     });
// }

// async function carregarDadosIniciais() {
//     try {
//         const [categorias, solicitantes] = await Promise.all([
//             api.listarCategorias(),
//             api.listarSolicitantes()
//         ]);

//         categoriasCache = categorias;
//         solicitantesCache = solicitantes;

//         preencherSelectCategorias(document.getElementById('campo-categoria'), 'Selecione a categoria');
//         preencherSelectCategorias(document.getElementById('filtro-categoria'), 'Todas as categorias');
//         preencherSelectSolicitantes(document.getElementById('campo-solicitante'));

//         await carregarSolicitacoes();
//     } catch (erro) {
//         exibirMensagem('erro', erro.message);
//     }
// }

// function preencherSelectCategorias(select, textoPadrao) {
//     select.innerHTML = '';
//     select.appendChild(criarOpcao('', textoPadrao));
//     categoriasCache.forEach(categoria => {
//         select.appendChild(criarOpcao(categoria.id, categoria.nome));
//     });
// }

// function preencherSelectSolicitantes(select) {
//     select.innerHTML = '';
//     select.appendChild(criarOpcao('', 'Selecione o solicitante'));
//     solicitantesCache.forEach(solicitante => {
//         select.appendChild(criarOpcao(solicitante.id, `${solicitante.nome} (${solicitante.cpfCnpj})`));
//     });
// }

// function criarOpcao(valor, texto) {
//     const opcao = document.createElement('option');
//     opcao.value = valor;
//     opcao.textContent = texto;
//     return opcao;
// }

// function configurarFormularioCadastro() {
//     const formulario = document.getElementById('formulario-cadastro');

//     formulario.addEventListener('submit', async (evento) => {
//         evento.preventDefault();

//         const dados = {
//             solicitanteId: Number(document.getElementById('campo-solicitante').value),
//             categoriaId: Number(document.getElementById('campo-categoria').value),
//             descricao: document.getElementById('campo-descricao').value.trim(),
//             valor: Number(document.getElementById('campo-valor').value)
//         };

//         try {
//             await api.criarSolicitacao(dados);
//             exibirMensagem('sucesso', 'Solicitação cadastrada com sucesso.');
//             formulario.reset();
//             await carregarSolicitacoes();
//             document.querySelector('[data-alvo="painel-solicitacoes"]').click();
//         } catch (erro) {
//             exibirMensagem('erro', erro.message);
//         }
//     });
// }

// function configurarFiltros() {
//     const formulario = document.getElementById('formulario-filtros');

//     formulario.addEventListener('submit', (evento) => {
//         evento.preventDefault();
//         carregarSolicitacoes();
//     });

//     document.getElementById('botao-limpar-filtros').addEventListener('click', () => {
//         formulario.reset();
//         carregarSolicitacoes();
//     });
// }

// function obterFiltrosAtuais() {
//     return {
//         status: document.getElementById('filtro-status').value,
//         categoriaId: document.getElementById('filtro-categoria').value,
//         dataInicio: document.getElementById('filtro-data-inicio').value,
//         dataFim: document.getElementById('filtro-data-fim').value
//     };
// }

// async function carregarSolicitacoes() {
//     try {
//         const solicitacoes = await api.listarSolicitacoes(obterFiltrosAtuais());
//         renderizarTabela(solicitacoes);
//     } catch (erro) {
//         exibirMensagem('erro', erro.message);
//     }
// }

// function renderizarTabela(solicitacoes) {
//     const corpoTabela = document.getElementById('corpo-tabela-solicitacoes');
//     corpoTabela.innerHTML = '';

//     if (solicitacoes.length === 0) {
//         const linha = document.createElement('tr');
//         linha.innerHTML = '<td colspan="7" class="celula-vazia">Nenhuma solicitação encontrada.</td>';
//         corpoTabela.appendChild(linha);
//         return;
//     }

//     solicitacoes.forEach(solicitacao => {
//         corpoTabela.appendChild(criarLinhaTabela(solicitacao));
//     });
// }

// function criarLinhaTabela(solicitacao) {
//     const linha = document.createElement('tr');

//     const proximosStatus = TRANSICOES_PERMITIDAS[solicitacao.status] || [];
//     const podeAtualizar = proximosStatus.length > 0;

//     linha.innerHTML = `
//         <td>${solicitacao.nomeSolicitante}</td>
//         <td>${solicitacao.cpfCnpj}</td>
//         <td>${solicitacao.nomeCategoria}</td>
//         <td><span class="badge-status badge-${solicitacao.status.toLowerCase()}">${ROTULOS_STATUS[solicitacao.status]}</span></td>
//         <td>${formatadorMoeda.format(solicitacao.valor)}</td>
//         <td>${formatarData(solicitacao.dataSolicitacao)}</td>
//         <td class="celula-acoes"></td>
//     `;

//     const celulaAcoes = linha.querySelector('.celula-acoes');

//     const botaoDetalhes = document.createElement('button');
//     botaoDetalhes.type = 'button';
//     botaoDetalhes.className = 'botao botao-secundario';
//     botaoDetalhes.textContent = 'Detalhes';
//     botaoDetalhes.addEventListener('click', () => abrirDetalhes(solicitacao.id));
//     celulaAcoes.appendChild(botaoDetalhes);

//     if (podeAtualizar) {
//         const seletorStatus = document.createElement('select');
//         seletorStatus.className = 'seletor-status';
//         proximosStatus.forEach(status => {
//             seletorStatus.appendChild(criarOpcao(status, ROTULOS_STATUS[status]));
//         });

//         const botaoAtualizar = document.createElement('button');
//         botaoAtualizar.type = 'button';
//         botaoAtualizar.className = 'botao botao-primario';
//         botaoAtualizar.textContent = 'Atualizar';
//         botaoAtualizar.addEventListener('click', () => atualizarStatusSolicitacao(solicitacao.id, seletorStatus.value));

//         celulaAcoes.appendChild(seletorStatus);
//         celulaAcoes.appendChild(botaoAtualizar);
//     }

//     return linha;
// }

// async function atualizarStatusSolicitacao(id, novoStatus) {
//     try {
//         await api.atualizarStatus(id, novoStatus);
//         exibirMensagem('sucesso', `Status da solicitação #${id} atualizado para ${ROTULOS_STATUS[novoStatus]}.`);
//         await carregarSolicitacoes();
//     } catch (erro) {
//         exibirMensagem('erro', erro.message);
//     }
// }

// function configurarModal() {
//     const modal = document.getElementById('modal-detalhe');
//     modal.querySelector('.modal-fechar').addEventListener('click', () => fecharModal());
//     modal.addEventListener('click', (evento) => {
//         if (evento.target === modal) fecharModal();
//     });
// }

// async function abrirDetalhes(id) {
//     try {
//         const solicitacao = await api.buscarSolicitacao(id);
//         const conteudo = document.getElementById('modal-conteudo');

//         conteudo.innerHTML = `
//             <dl class="lista-detalhes">
//                 <dt>ID</dt><dd>${solicitacao.id}</dd>
//                 <dt>Solicitante</dt><dd>${solicitacao.solicitante.nome}</dd>
//                 <dt>CPF/CNPJ</dt><dd>${solicitacao.solicitante.cpfCnpj}</dd>
//                 <dt>Categoria</dt><dd>${solicitacao.categoria.nome}</dd>
//                 <dt>Descrição</dt><dd>${solicitacao.descricao || '-'}</dd>
//                 <dt>Valor</dt><dd>${formatadorMoeda.format(solicitacao.valor)}</dd>
//                 <dt>Data da solicitação</dt><dd>${formatarData(solicitacao.dataSolicitacao)}</dd>
//                 <dt>Status</dt><dd><span class="badge-status badge-${solicitacao.status.toLowerCase()}">${ROTULOS_STATUS[solicitacao.status]}</span></dd>
//             </dl>
//         `;

//         document.getElementById('modal-detalhe').classList.add('ativo');
//     } catch (erro) {
//         exibirMensagem('erro', erro.message);
//     }
// }

// function fecharModal() {
//     document.getElementById('modal-detalhe').classList.remove('ativo');
// }

// function formatarData(dataIso) {
//     const [ano, mes, dia] = dataIso.split('-');
//     return `${dia}/${mes}/${ano}`;
// }

// let temporizadorMensagem = null;

// function exibirMensagem(tipo, texto) {
//     const area = document.getElementById('area-mensagens');
//     area.textContent = texto;
//     area.className = `mensagem mensagem-${tipo} visivel`;

//     clearTimeout(temporizadorMensagem);
//     temporizadorMensagem = setTimeout(() => {
//         area.classList.remove('visivel');
//     }, 5000);
// }
