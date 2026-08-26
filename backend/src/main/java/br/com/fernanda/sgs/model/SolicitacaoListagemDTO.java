package br.com.fernanda.sgs.model;

public interface SolicitacaoListagemDTO {
    Integer getId();
    String getDescricao();
    java.math.BigDecimal getValor();
    java.time.LocalDate getDataSolicitacao();
    String getStatus();
    String getNomeSolicitante();
    String getCpfCnpj();
    String getNomeCategoria();
}
