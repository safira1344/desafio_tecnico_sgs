package br.com.fernanda.sgs.exception;

public class SolicitanteNaoEncontradoException extends RuntimeException {
    public SolicitanteNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
