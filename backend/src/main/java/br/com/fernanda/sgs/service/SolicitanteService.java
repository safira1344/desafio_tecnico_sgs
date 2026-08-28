package br.com.fernanda.sgs.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.fernanda.sgs.model.Solicitante;
import br.com.fernanda.sgs.repository.SolicitanteRepository;

@Service
public class SolicitanteService {

    private final SolicitanteRepository solicitanteRepository;

    public SolicitanteService(SolicitanteRepository solicitanteRepository) {
        this.solicitanteRepository = solicitanteRepository;
    }

    public List<Solicitante> listarTodos() {
        return solicitanteRepository.findAll();
    }
}
