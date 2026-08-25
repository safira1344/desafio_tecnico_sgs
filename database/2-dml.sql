insert into solicitante (nome, cpf_cnpj) values
    ('Maria Silva Santos', '12345678900'),
    ('João Pedro Oliveira', 'ZLPZJ6BQFW1501'),
    ('Ana Carolina Souza', '34567890122'),
    ('Carlos Eduardo Lima', '45678901233'),
    ('Fernanda Mirely Costa', 'B3IHX63K0TPG98');

insert into categoria(nome) values 
	('Serviços'),
	('Material'),
	('Transporte'),
	('Diária'),
	('Consultoria');

insert into solicitacao (solicitante_id, categoria_id, descricao, valor, data_solicitacao, status) values
    (1, 2, 'Compra de material de escritório', 450.00, '2026-08-10', 'SOLICITADO'),
    (2, 2, 'Solicitação de equipamentos de informática', 3500.50, '2026-03-20', 'LIBERADO'),
    (3, 3, 'Solicitação de serviço de manutenção predial', 2750.00, '2026-07-10', 'REJEITADO');