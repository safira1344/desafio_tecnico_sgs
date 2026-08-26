package br.com.fernanda.sgs.exception;

public class SolicitacaoNaoEncontradaException extends RuntimeException {
    public SolicitacaoNaoEncontradaException(String mensagem) {
        super(mensagem);
    }
}
