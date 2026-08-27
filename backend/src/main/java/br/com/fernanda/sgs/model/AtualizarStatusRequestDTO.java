package br.com.fernanda.sgs.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarStatusRequestDTO {
    private StatusSolicitacao novoStatus;
}
