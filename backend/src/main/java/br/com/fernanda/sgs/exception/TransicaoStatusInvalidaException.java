package br.com.fernanda.sgs.exception;

public class TransicaoStatusInvalidaException extends RuntimeException {
    public TransicaoStatusInvalidaException(String mensagem) {
        super(mensagem);
    }
}
