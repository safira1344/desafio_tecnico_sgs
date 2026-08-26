package br.com.fernanda.sgs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.fernanda.sgs.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}