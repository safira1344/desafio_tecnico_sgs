package br.com.fernanda.sgs.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.fernanda.sgs.model.Solicitacao;
import br.com.fernanda.sgs.model.SolicitacaoListagemDTO;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Integer> {
    @Query(value = """
        select s.id, s.descricao, s.valor, s.data_solicitacao, s.status,
            sol.nome as nome_solicitante, sol.cpf_cnpj,
            c.nome as nome_categoria
        from solicitacao s
        join solicitante sol on sol.id = s.solicitante_id
        join categoria c on c.id = s.categoria_id
        where (:status is null or s.status = :status) 
        and (:categoriaId is null or c.id = :categoriaId)
        and (:dataInicio is null or s.data_solicitacao >= :dataInicio)
        and (:dataFim is null or s.data_solicitacao <= :dataFim)
        """, nativeQuery = true)
    List<SolicitacaoListagemDTO> listarComFiltros(
        @Param("status") String status,
        @Param("categoriaId") Integer categoriaId,
        @Param("dataInicio") LocalDate dataInicio,
        @Param("dataFim") LocalDate dataFim
    );
}