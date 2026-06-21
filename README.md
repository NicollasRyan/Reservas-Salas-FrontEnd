# Reserva de Salas

Sistema web para gerenciar salas de reunião e suas reservas, garantindo ausência de conflitos de horário.

## Repositórios

| Parte | Repositório |
|-------|------------|
| Frontend | Este repositório |
| Backend | [Reservas-Salas-BackEnd](https://github.com/NicollasRyan/Reservas-Salas-BackEnd) |

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix UI, React Hook Form + Zod |
| Backend | Fastify, TypeScript, Prisma ORM |
| Banco | PostgreSQL (Neon) |

## Arquitetura

```
reserva-salas/
├── backend/          # API Fastify
│   ├── src/
│   │   ├── modules/
│   │   │   ├── salas/      # routes → controllers → services → schema
│   │   │   └── reservas/   # routes → controllers → services → validators
│   │   └── lib/            # prisma singleton, AppError
│   └── prisma/             # schema + migrations
└── frontend/         # Next.js App Router
    └── src/
        ├── app/            # pages (reservas, salas)
        ├── components/     # UI components
        ├── hooks/          # useReservas, useSalas
        ├── services/       # API client (axios)
        └── types/          # TypeScript interfaces
```

A validação de conflito de horário roda **exclusivamente no servidor** (camada de service), nunca no cliente. O frontend exibe o erro retornado pela API com os detalhes da reserva conflitante.

## Setup

### Pré-requisitos

- Node.js 18+
- PostgreSQL (ou conta no [Supabase](https://supabase.com) / [Neon](https://neon.tech))

### 1. Clone e instale dependências

```bash
# Backend
git clone https://github.com/NicollasRyan/Reservas-Salas-BackEnd.git
cd Reservas-Salas-BackEnd && npm install

# Frontend
git clone https://github.com/NicollasRyan/Reservas-Salas-FrontEnd.git
cd Reservas-Salas-FrontEnd && npm install
```

### 2. Configure as variáveis de ambiente

**Backend** — crie `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/reserva_salas"
PORT=3333
CORS_ORIGIN="http://localhost:3000"
```

**Frontend** — crie `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3333"
```

### 3. Rode as migrations

```bash
cd Reservas-Salas-BackEnd
npx prisma migrate deploy
npx prisma generate
```

### 4. Inicie os servidores

```bash
# Backend (porta 3333)
cd Reservas-Salas-BackEnd && npm run dev

# Frontend (porta 3000)
cd Reservas-Salas-FrontEnd && npm run dev
```

Acesse `http://localhost:3000`.

---

## Decisões e premissas

### Conflito de horário (Regra 1)

A detecção usa sobreposição de intervalos abertos: `novo.inicio < existente.fim AND novo.fim > existente.inicio`. Isso significa que **reservas que se encostam não são conflito** — se uma termina às 14h e outra começa às 14h, ambas podem coexistir. Justificativa: em salas de reunião físicas, encerrar às 14h00 e começar às 14h00 é operacionalmente viável (troca de equipes imediata). Tornar isso um conflito criaria um vão obrigatório que não existe na realidade.

Ao editar uma reserva, a própria reserva é excluída da verificação de conflito (`excluirReservaId`), evitando falso positivo ao salvar sem alterar o horário.

### Capacidade (Regra 2)

Optei por **bloqueio rígido**: o sistema impede reservas que ultrapassem a capacidade da sala. Justificativa: salas têm limites físicos e de segurança — ultrapassá-los não é apenas inconveniente, pode ser um problema real. Um aviso sem bloqueio seria ignorado com facilidade.

### Horário de funcionamento

Não há restrição de horário. O sistema permite reservas em qualquer hora, inclusive madrugada e finais de semana. Justificativa: o sistema pode ser usado por equipes com plantão ou trabalho remoto em fusos diferentes. Regras de horário seriam configuração de empresa, não regra universal do sistema.

### Nomes de sala

Nomes de sala são únicos (constraint `@@unique` no banco). Justificativa: duas salas com o mesmo nome causariam confusão para o usuário ao filtrar reservas ou ao selecionar a sala num formulário.

### Paginação

A listagem de reservas é paginada no servidor (padrão: 12 por página). O filtro por sala e a ordenação também são aplicados no servidor, não no cliente, para que a paginação seja consistente com o total real de registros.

### Mensagem de conflito

O erro de conflito retorna o título e o intervalo de horário da reserva conflitante:
> *"Conflito de horário: a sala já está reservada para "Reunião de planning" das 14/06/2026 09:00 às 14/06/2026 10:00."*

Isso permite ao usuário identificar exatamente o bloqueio sem precisar navegar pela listagem.

---

## Pergunta de raciocínio — Reservas recorrentes

> Como você evoluiria este sistema para suportar reservas recorrentes (ex.: "toda terça às 14h, pelos próximos 3 meses")?

**Modelo de dados**

Criaria uma tabela `regras_recorrencia` com os campos `diasDaSemana`, `horarioInicio`, `horarioFim`, `dataInicioVigencia`, `dataFimVigencia` e `salaId`. Cada registro nessa tabela geraria um conjunto de instâncias (`reservas`) na criação — uma linha por ocorrência concreta, linkada à regra via `recorrenciaId` nullable.

Manter instâncias explícitas no banco (em vez de calcular on-the-fly) simplifica:
- A query de conflito (continua sendo `inicio < fim AND fim > inicio` sobre linhas concretas)
- Listagem e filtros (sem lógica de expansão em tempo de query)
- Cancelamento de uma única ocorrência (soft-delete na instância, sem afetar a regra)

**Checagem de conflito**

A query de conflito não muda para as instâncias individuais. O que muda é o momento da verificação: ao criar a regra, o sistema expande todas as ocorrências e verifica **cada uma** contra o banco numa transaction. Se qualquer ocorrência conflitar, a transação inteira é revertida e a mensagem retorna quais datas conflitam.

**Edição da regra**

Editar uma regra recorrente exigiria uma decisão UX: "editar apenas esta ocorrência", "editar esta e as futuras" ou "editar todas". Cada opção tem implicações diferentes no modelo (criar nova regra, atualizar ocorrências futuras, ou atualizar tudo).
