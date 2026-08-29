const API_BASE_URL = 'http://localhost:8080/api';

async function buscarSolicitacoes(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.status) params.append("status", filtros.status);
    if (filtros.categoriaId) params.append("categoriaId", filtros.categoriaId);
    if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio);
    if (filtros.dataFim) params.append("dataFim", filtros.dataFim);

    const resposta = await fetch(`${API_BASE_URL}/solicitacoes?${params.toString()}`);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar solicitações");
    }

    return resposta.json();
}

async function buscarSolicitacaoPorId(id){
    const resposta = await fetch(`${API_BASE_URL}/solicitacoes/${id}`);

    if(!resposta.ok) {
        throw new Error("Erro ao buscar solicitçaão");
    }

    return resposta.json();
}

async function criarSolicitacao(dadosSolicitacao) {
    const resposta = await fetch(`${API_BASE_URL}/solicitacoes`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dadosSolicitacao)
    });

    if (!resposta.ok) {
        throw new Error("Erro ao criar solicitação");
    }

    return resposta.json();
}

async function atualizarStatusSolicitacao(id, novoStatus) {
    const resposta = await fetch(`${API_BASE_URL}/solicitacoes/${id}/status`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({novoStatus: novoStatus})
    });

    if (!resposta.ok) {
        throw new Error("Erro ao atualizar status da solicitação");
    }

    return resposta.json();
}

async function buscarSolicitantes() {
    const resposta = await fetch(`${API_BASE_URL}/solicitantes`);

    if(!resposta.ok) {
        throw new Error("Erro ao buscar solicitantes");
    }

    return resposta.json();
}

async function buscarCategorias() {
    const resposta = await fetch(`${API_BASE_URL}/categorias`);

    if(!resposta.ok) {
        throw new Error("Erro ao buscar categorias");
    }

    return resposta.json();
}
