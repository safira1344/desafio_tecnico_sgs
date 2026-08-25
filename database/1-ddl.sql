create table solicitante (
	id integer primary key generated always as identity,
	nome varchar(100) not null,
	cpf_cnpj varchar(20) unique not null
);

create table categoria (
	id integer primary key generated always as identity,
	nome varchar(100) unique not null
);

create table solicitacao (
	id integer primary key generated always as identity,
	solicitante_id integer not null,
	categoria_id integer not null,
	descricao varchar(300),
	valor numeric(10,2) not null,
	data_solicitacao date not null,
	status varchar(20) not null default 'SOLICITADO' check (status IN ('SOLICITADO', 'LIBERADO', 'APROVADO', 'REJEITADO', 'CANCELADO')),
	
	foreign key (solicitante_id) references solicitante(id),
	foreign key (categoria_id) references categoria(id)
);
