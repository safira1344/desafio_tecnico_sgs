package br.com.fernanda.sgs.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.fernanda.sgs.exception.CategoriaNaoEncontradaException;
import br.com.fernanda.sgs.exception.SolicitacaoNaoEncontradaException;
import br.com.fernanda.sgs.exception.SolicitanteNaoEncontradoException;
import br.com.fernanda.sgs.exception.TransicaoStatusInvalidaException;
import br.com.fernanda.sgs.model.AtualizarStatusRequestDTO;
import br.com.fernanda.sgs.model.Solicitacao;
import br.com.fernanda.sgs.model.SolicitacaoListagemDTO;
import br.com.fernanda.sgs.model.SolicitacaoRequestDTO;
import br.com.fernanda.sgs.service.SolicitacaoService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody SolicitacaoRequestDTO dto) {
        try {
            Solicitacao novaSolicitacao = solicitacaoService.criar(dto.getSolicitanteId(), dto.getCategoriaId(), dto.getDescricao(), dto.getValor());
            return ResponseEntity.status(HttpStatus.CREATED).body(novaSolicitacao);
        } catch (SolicitanteNaoEncontradoException | CategoriaNaoEncontradaException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoListagemDTO>> listar(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) Integer categoriaId,
        @RequestParam(required = false) LocalDate dataInicio,
        @RequestParam(required = false) LocalDate dataFim) {

        List<SolicitacaoListagemDTO> solicitacoes = solicitacaoService.listar(status, categoriaId, dataInicio, dataFim);

        return ResponseEntity.status(HttpStatus.OK).body(solicitacoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscarPorId(@PathVariable Integer id) {
        try {
            Solicitacao solicitacao = solicitacaoService.buscarPorId(id);
            return ResponseEntity.status(HttpStatus.OK).body(solicitacao);
        } catch (SolicitacaoNaoEncontradaException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> atualizarStatus(@PathVariable Integer id, @RequestBody AtualizarStatusRequestDTO dto) {
        try {
            Solicitacao solicitacaoAtualizada = solicitacaoService.atualizarStatus(id, dto.getNovoStatus());

            return ResponseEntity.status(HttpStatus.OK).body(solicitacaoAtualizada);
        } catch (SolicitacaoNaoEncontradaException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (TransicaoStatusInvalidaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}