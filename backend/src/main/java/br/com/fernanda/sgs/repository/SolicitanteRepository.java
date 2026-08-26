package br.com.fernanda.sgs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.fernanda.sgs.model.Solicitante;

public interface SolicitanteRepository extends JpaRepository<Solicitante, Integer> {
}