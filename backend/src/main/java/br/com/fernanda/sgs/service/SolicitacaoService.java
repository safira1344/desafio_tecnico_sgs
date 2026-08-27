package br.com.fernanda.sgs.service;

import br.com.fernanda.sgs.repository.SolicitanteRepository;
import br.com.fernanda.sgs.repository.CategoriaRepository;
import br.com.fernanda.sgs.repository.SolicitacaoRepository;
import br.com.fernanda.sgs.model.Solicitante;
import br.com.fernanda.sgs.model.StatusSolicitacao;
import br.com.fernanda.sgs.model.Categoria;
import br.com.fernanda.sgs.model.Solicitacao;
import br.com.fernanda.sgs.model.SolicitacaoListagemDTO;
import br.com.fernanda.sgs.exception.SolicitanteNaoEncontradoException;
import br.com.fernanda.sgs.exception.TransicaoStatusInvalidaException;
import br.com.fernanda.sgs.exception.CategoriaNaoEncontradaException;
import br.com.fernanda.sgs.exception.SolicitacaoNaoEncontradaException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final SolicitanteRepository solicitanteRepository;
    private final CategoriaRepository categoriaRepository;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository, SolicitanteRepository solicitanteRepository, CategoriaRepository categoriaRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.solicitanteRepository = solicitanteRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public Solicitacao criar(Integer solicitanteId, Integer categoriaId, String descricao, BigDecimal valor) {

        Solicitante solicitante = solicitanteRepository.findById(solicitanteId).orElseThrow(() -> new SolicitanteNaoEncontradoException("Solicitante com id " + solicitanteId + " não encontrado."));

        Categoria categoria = categoriaRepository.findById(categoriaId).orElseThrow(() -> new CategoriaNaoEncontradaException("Categoria com id " + categoriaId + " não encontrada."));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setSolicitante(solicitante);
        solicitacao.setCategoria(categoria);
        solicitacao.setDescricao(descricao);
        solicitacao.setValor(valor);
        solicitacao.setDataSolicitacao(LocalDate.now());
        solicitacao.setStatus(StatusSolicitacao.SOLICITADO);

        return solicitacaoRepository.save(solicitacao);
    }

    public List<SolicitacaoListagemDTO> listar(String status, Integer categoriaId, LocalDate dataInicio, LocalDate dataFim) {
        return solicitacaoRepository.listarComFiltros(status, categoriaId, dataInicio, dataFim);
    }

    public Solicitacao buscarPorId(Integer id) {
        return solicitacaoRepository.findById(id).orElseThrow(() -> new SolicitacaoNaoEncontradaException("Solicitação com id " + id + " não encontrada."));
    }

    public void validarTransicao(StatusSolicitacao statusAtual, StatusSolicitacao statusNovo) {
        boolean transicaoValida;

        switch (statusAtual) {
            case SOLICITADO:
                transicaoValida = statusNovo == StatusSolicitacao.LIBERADO || statusNovo == StatusSolicitacao.REJEITADO;
                break;
            case LIBERADO:
                transicaoValida = statusNovo == StatusSolicitacao.APROVADO || statusNovo == StatusSolicitacao.REJEITADO;
                break;
            case APROVADO:
                transicaoValida = statusNovo == StatusSolicitacao.CANCELADO;
                break;
            case REJEITADO:
                transicaoValida = false;
                break;
            case CANCELADO:
                transicaoValida = false;
                break;
            default:
                transicaoValida = false;
        }

        if (!transicaoValida) {
            throw new TransicaoStatusInvalidaException("Transição de " + statusAtual + " para " + statusNovo + " não é permitida.");
        }
    }

    public Solicitacao atualizarStatus(Integer id, StatusSolicitacao novoStatus) {
        Solicitacao solicitacao = buscarPorId(id);
        validarTransicao(solicitacao.getStatus(), novoStatus);
        solicitacao.setStatus(novoStatus);
        
        return solicitacaoRepository.save(solicitacao);
    }
}
