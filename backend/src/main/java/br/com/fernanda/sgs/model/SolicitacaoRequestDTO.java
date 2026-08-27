package br.com.fernanda.sgs.model;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter 
public class SolicitacaoRequestDTO {
    private Integer solicitanteId;
    private Integer categoriaId;
    private String descricao;
    private BigDecimal valor;
}
