package br.com.fernanda.sgs.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "Solicitante")
@Table(name = "solicitante")
@Getter
@Setter
public class Solicitante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    
    @Column(name = "cpf_cnpj", unique = true)
    private String cpfCnpj;
}
