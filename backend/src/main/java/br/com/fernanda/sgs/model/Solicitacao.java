package br.com.fernanda.sgs.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "Solicitacao")
@Table(name = "solicitacao")
@Getter
@Setter

public class Solicitacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "solicitante_id")
    private Solicitante solicitante;
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
    private String descricao;
    private BigDecimal valor;
    private LocalDate dataSolicitacao;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusSolicitacao status;
}
