package br.com.fernanda.sgs.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.fernanda.sgs.model.Solicitacao;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Integer> {
    @Query(value = """
    SELECT s.id, s.descricao, s.valor, s.data_solicitacao, s.status,
        sol.nome as nome_solicitante, sol.cpf_cnpj,
        c.nome as nome_categoria
    FROM solicitacao s
    JOIN solicitante sol ON sol.id = s.solicitante_id
    JOIN categoria c ON c.id = s.categoria_id
    WHERE (:status IS NULL OR s.status = :status) 
    AND (:categoriaId IS NULL OR c.id = :categoriaId)
    AND (:dataInicio IS NULL OR s.data_solicitacao >= :dataInicio)
    AND (:dataFim IS NULL OR s.data_solicitacao <= :dataFim)
    """, nativeQuery = true)

    List<Object[]> listarComFiltros(
    @Param("status") String status,
    @Param("categoriaId") Integer categoriaId,
    @Param("dataInicio") LocalDate dataInicio,
    @Param("dataFim") LocalDate dataFim
);
}