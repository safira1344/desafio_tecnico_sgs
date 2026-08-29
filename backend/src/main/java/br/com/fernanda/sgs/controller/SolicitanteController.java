package br.com.fernanda.sgs.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fernanda.sgs.model.Solicitante;
import br.com.fernanda.sgs.service.SolicitanteService;

@RestController
@RequestMapping("/api/solicitantes")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class SolicitanteController {

    private final SolicitanteService solicitanteService;

    public SolicitanteController(SolicitanteService solicitanteService) {
        this.solicitanteService = solicitanteService;
    }

    @GetMapping
    public ResponseEntity<List<Solicitante>> listar() {
        return ResponseEntity.status(HttpStatus.OK).body(solicitanteService.listarTodos());
    }
}
