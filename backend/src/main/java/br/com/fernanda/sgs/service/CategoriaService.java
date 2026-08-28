package br.com.fernanda.sgs.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.fernanda.sgs.model.Categoria;
import br.com.fernanda.sgs.repository.CategoriaRepository;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }
}
